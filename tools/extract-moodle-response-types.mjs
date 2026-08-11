#!/usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import PhpParser from 'php-parser';

const sourceArgument = process.argv[2];
if (!sourceArgument) {
  console.error('Usage: node tools/extract-moodle-response-types.mjs <path-to-moodle-root>');
  process.exit(2);
}

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = resolve(sourceArgument);
const publicRoot = await readdir(sourceRoot).then((entries) =>
  entries.includes('public') ? resolve(sourceRoot, 'public') : sourceRoot
);
const outputOptionIndex = process.argv.indexOf('--output');
const outputPath = outputOptionIndex >= 0
  ? resolve(process.argv[outputOptionIndex + 1])
  : resolve(projectRoot, 'contract', 'source-response-types.json');
const versionOptionIndex = process.argv.indexOf('--version');
const extractedMoodleVersion = versionOptionIndex >= 0
  ? process.argv[versionOptionIndex + 1]
  : '5.2';
const contract = JSON.parse(await readFile(resolve(projectRoot, 'contract', 'operations.json'), 'utf8'));
const parser = new PhpParser({
  parser: { extractDoc: false, suppressErrors: true },
  ast: { withPositions: false }
});

async function findFiles(directory, predicate) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (['node_modules', 'vendor', 'tests'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) results.push(...await findFiles(path, predicate));
    else if (predicate(path)) results.push(path);
  }
  return results;
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  }
}

function identifier(node) {
  if (typeof node === 'string') return node;
  return node?.name ?? node?.value ?? null;
}

function findReturnExpression(method) {
  const returnStatement = method.body?.children?.find((statement) => statement.kind === 'return');
  const expression = returnStatement?.expr ?? null;
  if (expression?.kind !== 'variable') return expression;
  const variableName = identifier(expression);
  const assignments = (method.body?.children ?? []).filter((statement) =>
    statement.kind === 'expressionstatement' &&
    statement.expression?.kind === 'assign' &&
    statement.expression.left?.kind === 'variable' &&
    identifier(statement.expression.left) === variableName
  );
  return assignments.at(-1)?.expression.right ?? expression;
}

function evaluationContext(classContext, method) {
  const variables = new Map();
  for (const statement of method.body?.children ?? []) {
    if (
      statement.kind === 'expressionstatement' &&
      statement.expression?.kind === 'assign' &&
      statement.expression.left?.kind === 'variable'
    ) {
      variables.set(identifier(statement.expression.left), statement.expression.right);
    }
  }
  return { ...classContext, variables };
}

const phpFiles = await findFiles(publicRoot, (path) =>
  path.endsWith('.php') &&
  (
    path.endsWith('externallib.php') ||
    path.endsWith('external.php') ||
    /[\\/]classes[\\/].*[\\/]external[\\/]/.test(path) ||
    /[\\/]classes[\\/]external[\\/]/.test(path)
  )
);
const classIndex = new Map();
const fileMethodIndex = new Map();
const methodsByName = new Map();

for (const file of phpFiles) {
  let ast;
  try {
    ast = parser.parseCode(await readFile(file, 'utf8'), file);
  } catch {
    continue;
  }
  let namespace = '';
  walk(ast, (node) => {
    if (node.kind === 'namespace') namespace = identifier(node.name) ?? '';
    if (node.kind !== 'class') return;
    const className = identifier(node.name);
    const fullClassName = [namespace, className].filter(Boolean).join('\\').replace(/^\\/, '');
    const methods = new Map();
    for (const member of node.body ?? []) {
      if (member.kind !== 'method') continue;
      const methodName = identifier(member.name);
      methods.set(methodName, member);
      const records = methodsByName.get(methodName) ?? [];
      records.push({ file, fullClassName, method: member, methods });
      methodsByName.set(methodName, records);
    }
    classIndex.set(fullClassName.toLowerCase(), { file, fullClassName, methods });
    fileMethodIndex.set(file.toLowerCase(), { file, fullClassName, methods });
  });
}

const serviceFiles = await findFiles(publicRoot, (path) =>
  path.endsWith('/db/services.php') || path.endsWith('\\db\\services.php')
);
const serviceDefinitions = new Map();

for (const file of serviceFiles) {
  const source = await readFile(file, 'utf8');
  const starts = [...source.matchAll(/^(\s+)['"]([^'"]+)['"]\s*=>\s*(?:array\s*\(|\[)/gm)];
  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index];
    const next = starts.slice(index + 1).find((candidate) => candidate[1].length <= start[1].length);
    const body = source.slice(start.index, next?.index ?? source.length);
    if (!/['"]type['"]\s*=>/.test(body)) continue;
    const className =
      body.match(/['"]classname['"]\s*=>\s*['"]([^'"]+)['"]/)?.[1] ??
      body.match(/['"]classname['"]\s*=>\s*([\\A-Za-z_][\\A-Za-z0-9_]*)::class/)?.[1] ??
      null;
    if (!className) continue;
    const methodName = body.match(/['"]methodname['"]\s*=>\s*['"]([^'"]+)['"]/)?.[1] ?? 'execute';
    const classPath = body.match(/['"]classpath['"]\s*=>\s*['"]([^'"]+)['"]/)?.[1] ?? null;
    const description =
      body.match(/['"]description['"]\s*=>\s*['"]([^'"]+)['"]/)?.[1] ??
      `Call ${start[2]}.`;
    const type = body.match(/['"]type['"]\s*=>\s*['"]([^'"]+)['"]/)?.[1] ?? 'read';
    serviceDefinitions.set(start[2], { className, methodName, classPath, description, type });
  }
}

function scalarFromParameter(name) {
  if (/BOOL/.test(name)) return 'boolean';
  if (/(?:INT|NUMBER)$/.test(name)) return 'integer';
  if (/FLOAT/.test(name)) return 'number';
  return 'string';
}

function literalValue(expression) {
  if (!expression) return undefined;
  if (expression.kind === 'string') return expression.value;
  if (expression.kind === 'number') return Number(expression.value);
  if (expression.kind === 'boolean') return expression.value;
  if (expression.kind === 'truekeyword') return true;
  if (expression.kind === 'falsekeyword') return false;
  if (expression.kind === 'nullkeyword') return null;
  if (expression.kind === 'array' && (expression.items ?? []).length === 0) return [];
  return undefined;
}

function parameterRequiredness(expression) {
  const marker = identifier(expression?.arguments?.[2]);
  return {
    required: marker !== 'VALUE_OPTIONAL' && marker !== 'VALUE_DEFAULT',
    default: marker === 'VALUE_DEFAULT'
      ? literalValue(expression.arguments?.[3])
      : undefined
  };
}

function parameterDescriptor(expression, context) {
  if (expression?.kind === 'variable') {
    const assigned = context.variables?.get(identifier(expression));
    return assigned
      ? parameterDescriptor(assigned, context)
      : { type: 'object', required: true };
  }
  if (expression?.kind !== 'new') return { type: 'object', required: true };
  const constructor = identifier(expression.what)?.split('\\').at(-1);
  const presence = parameterRequiredness(expression);
  let descriptor;
  if (constructor === 'external_value' || constructor === 'external_format_value') {
    descriptor = {
      type: constructor === 'external_format_value'
        ? 'integer'
        : scalarFromParameter(identifier(expression.arguments?.[0]) ?? 'PARAM_RAW'),
      required: presence.required
    };
  } else if (constructor === 'external_multiple_structure') {
    const child = expression.arguments?.[0];
    const childConstructor = child?.kind === 'new'
      ? identifier(child.what)?.split('\\').at(-1)
      : null;
    descriptor = childConstructor === 'external_value'
      ? {
          type: 'array',
          items: scalarFromParameter(identifier(child.arguments?.[0]) ?? 'PARAM_RAW'),
          required: presence.required
        }
      : { type: 'object_array', required: presence.required };
  } else {
    descriptor = { type: 'object', required: presence.required };
  }
  if (presence.default !== undefined) descriptor.default = presence.default;
  return descriptor;
}

function parameterMapFromExpression(expression, context, seen = new Set()) {
  if (expression?.kind === 'variable') {
    const assigned = context.variables?.get(identifier(expression));
    return assigned ? parameterMapFromExpression(assigned, context, seen) : null;
  }
  if (
    expression?.kind === 'new' &&
    identifier(expression.what)?.split('\\').at(-1) === 'external_function_parameters'
  ) {
    return parameterMapFromExpression(expression.arguments?.[0], context, seen);
  }
  if (expression?.kind === 'call' && expression.what?.kind === 'staticlookup') {
    const methodName = identifier(expression.what.offset);
    if (!methodName || seen.has(methodName)) return null;
    const helper = context.methods.get(methodName);
    if (!helper) return null;
    const helperContext = evaluationContext(context, helper);
    return parameterMapFromExpression(
      findReturnExpression(helper),
      helperContext,
      new Set([...seen, methodName])
    );
  }
  if (expression?.kind !== 'array') return null;
  const parameters = {};
  for (const entry of expression.items ?? []) {
    const key = identifier(entry.key);
    if (key === null) return null;
    parameters[key] = parameterDescriptor(entry.value, context);
  }
  return parameters;
}

function isOptionalExternalValue(expression) {
  return expression?.kind === 'new' &&
    expression.arguments?.some((argument) => identifier(argument) === 'VALUE_OPTIONAL');
}

function schemaFromExpression(expression, context, seen = new Set()) {
  if (!expression) return null;
  if (expression.kind === 'nullkeyword') return 'null';
  if (expression.kind === 'variable') {
    const assignedExpression = context.variables?.get(identifier(expression));
    return assignedExpression
      ? schemaFromExpression(assignedExpression, context, seen)
      : 'object';
  }
  if (expression.kind === 'new') {
    const constructor = identifier(expression.what)?.split('\\').at(-1);
    if (constructor === 'external_format_value') return 'integer';
    if (constructor === 'external_value') {
      return scalarFromParameter(identifier(expression.arguments?.[0]) ?? 'PARAM_RAW');
    }
    if (constructor === 'external_files') {
      return [{
        filename: 'string',
        filepath: 'string',
        filesize: 'integer',
        fileurl: 'string',
        timemodified: 'integer',
        mimetype: 'string',
        'isexternal?': 'boolean',
        'repositorytype?': 'string'
      }];
    }
    if (constructor === 'external_warnings') {
      return [{
        item: 'string',
        itemid: 'integer',
        warningcode: 'string',
        message: 'string'
      }];
    }
    if (constructor === 'external_single_structure') {
      return schemaFromExpression(expression.arguments?.[0], context, seen);
    }
    if (constructor === 'external_multiple_structure') {
      const item = schemaFromExpression(expression.arguments?.[0], context, seen);
      return item ? [item] : null;
    }
    return 'object';
  }
  if (expression.kind === 'array') {
    const object = {};
    for (const entry of expression.items ?? []) {
      const key = identifier(entry.key);
      if (key === null) return 'object';
      const value = schemaFromExpression(entry.value, context, seen);
      if (!value) object[`${key}${isOptionalExternalValue(entry.value) ? '?' : ''}`] = 'object';
      else
      object[`${key}${isOptionalExternalValue(entry.value) ? '?' : ''}`] = value;
    }
    return object;
  }
  if (expression.kind === 'call' && expression.what?.kind === 'staticlookup') {
    const methodName = identifier(expression.what.offset);
    if (!methodName || seen.has(methodName)) return 'object';
    const classReference = identifier(expression.what.what);
    let targetContext = context;
    if (classReference && !['self', 'static', 'parent'].includes(classReference.toLowerCase())) {
      const normalizedReference = classReference.replace(/^\\/, '').toLowerCase();
      targetContext = classIndex.get(normalizedReference);
      if (!targetContext) {
        const suffixMatches = [...classIndex.values()].filter(({ fullClassName }) =>
          fullClassName.toLowerCase().endsWith(`\\${normalizedReference}`)
        );
        if (suffixMatches.length === 1) targetContext = suffixMatches[0];
      }
    }
    let helper = targetContext?.methods.get(methodName);
    if (!helper) {
      const candidates = methodsByName.get(methodName) ?? [];
      if (candidates.length === 1) {
        targetContext = candidates[0];
        helper = candidates[0].method;
      }
    }
    if (!helper) return 'object';
    return schemaFromExpression(
      findReturnExpression(helper),
      evaluationContext(targetContext, helper),
      new Set([...seen, methodName])
    );
  }
  if (expression.kind === 'call' && identifier(expression.what) === 'array_merge') {
    const merged = {};
    for (const argument of expression.arguments ?? []) {
      const schema = schemaFromExpression(argument, context, seen);
      if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return 'object';
      Object.assign(merged, schema);
    }
    return merged;
  }
  return null;
}

function resolveServiceContext(definition) {
  const normalizedClass = definition.className
    .replace(/\\+/g, '\\')
    .replace(/^\\/, '')
    .toLowerCase();
  const byClass = classIndex.get(normalizedClass);
  if (byClass) return byClass;
  if (definition.classPath) {
    const byFile = fileMethodIndex.get(resolve(publicRoot, definition.classPath).toLowerCase());
    if (byFile) return byFile;
  }
  return null;
}

const schemas = {};
const parameters = {};
const services = {};
const unresolved = [];
const unresolvedParameters = [];

for (const [moodleFunction, definition] of serviceDefinitions) {
  services[moodleFunction] = {
    summary: definition.description,
    kind: definition.type === 'write' ? 'write' : 'read'
  };
  const context = resolveServiceContext(definition);
  const returnMethodName = definition.methodName === 'execute'
    ? 'execute_returns'
    : `${definition.methodName}_returns`;
  let method = context?.methods.get(returnMethodName);
  let methodContext = context;
  if (!method) {
    const candidates = methodsByName.get(returnMethodName) ?? [];
    if (candidates.length === 1) {
      method = candidates[0].method;
      methodContext = candidates[0];
    }
  }
  const schema = method
    ? schemaFromExpression(
      findReturnExpression(method),
      evaluationContext(methodContext, method)
    )
    : null;
  if (schema) schemas[moodleFunction] = schema;
  else unresolved.push(moodleFunction);

  const parameterMethodName = definition.methodName === 'execute'
    ? 'execute_parameters'
    : `${definition.methodName}_parameters`;
  let parameterMethod = context?.methods.get(parameterMethodName);
  let parameterContext = context;
  if (!parameterMethod) {
    const candidates = methodsByName.get(parameterMethodName) ?? [];
    if (candidates.length === 1) {
      parameterMethod = candidates[0].method;
      parameterContext = candidates[0];
    }
  }
  const parameterExpression = parameterMethod
    ? findReturnExpression(parameterMethod)
    : null;
  const parameterMap = parameterMapFromExpression(
    parameterExpression,
    parameterMethod ? evaluationContext(parameterContext, parameterMethod) : parameterContext
  );
  if (parameterMap) parameters[moodleFunction] = parameterMap;
  else {
    parameters[moodleFunction] = {};
    unresolvedParameters.push(moodleFunction);
  }
}

const knownNullResponses = [
  'core_customfield_delete_category',
  'core_customfield_delete_field',
  'core_customfield_move_category',
  'core_customfield_move_field',
  'core_message_set_unsent_message',
  'qbank_columnsortorder_set_column_size',
  'qbank_columnsortorder_set_columnbank_order',
  'qbank_columnsortorder_set_hidden_columns',
  'qbank_viewquestiontext_set_question_text_format',
  'tool_admin_presets_delete_preset'
];
for (const moodleFunction of knownNullResponses) {
  schemas[moodleFunction] = 'null';
}
const finalUnresolved = unresolved.filter(
  (moodleFunction) =>
    moodleFunction !== 'core_filters_get_all_states' &&
    !knownNullResponses.includes(moodleFunction)
);

await writeFile(outputPath, `${JSON.stringify({
  moodleVersion: extractedMoodleVersion,
  schemas,
  parameters,
  services,
  unresolved: finalUnresolved.sort(),
  unresolvedParameters: unresolvedParameters.sort()
}, null, 2)}\n`);
console.log(`Extracted ${Object.keys(schemas).length} response schemas.`);
console.log(`Unresolved generic responses: ${finalUnresolved.length}.`);
console.log(`Unresolved parameter schemas: ${unresolvedParameters.length}.`);
