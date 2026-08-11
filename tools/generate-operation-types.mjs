import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = path.join(rootDirectory, 'contract', 'operations.json');
const responseTypesPath = path.join(rootDirectory, 'contract', 'source-response-types.json');
const outputPath = path.join(rootDirectory, 'client', 'generated', 'operation-types.d.ts');

function toPascalCase(value) {
  return value.split('_').map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join('');
}

function quote(value) {
  return JSON.stringify(String(value));
}

function scalarType(value) {
  if (typeof value === 'string' && value.includes('|')) {
    return value.split('|').map((part) => scalarType(part.trim())).join(' | ');
  }
  switch (value) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';
    case 'array':
      return 'unknown[]';
    case 'object':
      return 'JsonObject';
    case 'object_array':
      return 'JsonObject[]';
    case 'null':
      return 'null';
    default:
      return 'unknown';
  }
}

function parameterType(definition) {
  if (Array.isArray(definition.enum)) return definition.enum.map(quote).join(' | ');
  if (definition.type === 'array') return `${scalarType(definition.items ?? 'unknown')}[]`;
  return scalarType(definition.type);
}

function responseType(definition, indent = 0) {
  const padding = ' '.repeat(indent);
  const nestedPadding = ' '.repeat(indent + 2);
  if (typeof definition === 'string') return scalarType(definition);
  if (Array.isArray(definition)) {
    if (definition.length === 0) return 'unknown[]';
    return `${responseType(definition[0], indent)}[]`;
  }
  if (definition && typeof definition === 'object') {
    const entries = Object.entries(definition);
    if (entries.length === 0) return 'Record<string, never>';
    return `{\n${entries.map(([key, value]) => {
      const optional = key.endsWith('?');
      const propertyName = optional ? key.slice(0, -1) : key;
      return `${nestedPadding}${propertyName}${optional ? '?' : ''}: ${responseType(value, indent + 2)};`;
    }).join('\n')}\n${padding}}`;
  }
  return 'unknown';
}

function parameterInterface(operation) {
  const name = `${toPascalCase(operation.name)}Parameters`;
  const entries = Object.entries(operation.parameters ?? {});
  if (entries.length === 0) return `export interface ${name} {}\n`;
  const lines = entries.map(([key, definition]) => `  ${key}${definition.required ? '' : '?'}: ${parameterType(definition)};`);
  return `export interface ${name} {\n${lines.join('\n')}\n}\n`;
}

function responseDeclaration(operation) {
  const name = `${toPascalCase(operation.name)}Response`;
  const body = responseType(operation.returns);
  return !Array.isArray(operation.returns) && body.startsWith('{\n')
    ? `export interface ${name} ${body}\n`
    : `export type ${name} = ${body};\n`;
}

export function buildOperationTypes(contract) {
  const operations = contract.operations ?? [];
  const operationNames = operations.map((operation) => operation.name);
  const methods = operations.map((operation) => {
    const pascalName = toPascalCase(operation.name);
    const optional = Object.keys(operation.parameters ?? {}).length === 0 ? '?' : '';
    return `  ${operation.name}(parameters${optional}: ${pascalName}Parameters): Promise<${pascalName}Response>;`;
  });

  return [
    '// This file is generated from contract/operations.json.',
    '// Run npm run types:generate after changing the canonical operation contract.',
    '',
    'export type JsonPrimitive = string | number | boolean | null;',
    'export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];',
    'export interface JsonObject { [key: string]: JsonValue; }',
    '',
    `export type MoodleOperationName = ${operationNames.map(quote).join(' | ')};`,
    '',
    operations.map(parameterInterface).join('\n'),
    operations.map(responseDeclaration).join('\n'),
    'export interface MoodleOperationParameters {',
    ...operations.map((operation) => `  ${operation.name}: ${toPascalCase(operation.name)}Parameters;`),
    '}',
    '',
    'export interface MoodleOperationResponses {',
    ...operations.map((operation) => `  ${operation.name}: ${toPascalCase(operation.name)}Response;`),
    '}',
    '',
    'export interface TypedMoodleClient {',
    '  operationNames(): MoodleOperationName[];',
    '  callOperation<TName extends MoodleOperationName>(',
    '    operationName: TName,',
    '    parameters: MoodleOperationParameters[TName]',
    '  ): Promise<MoodleOperationResponses[TName]>;',
    ...methods,
    '}',
    '',
    'export type MoodleOperationParameter<TName extends MoodleOperationName> = MoodleOperationParameters[TName];',
    'export type MoodleOperationResponse<TName extends MoodleOperationName> = MoodleOperationResponses[TName];',
    ''
  ].join('\n');
}

async function main() {
  const contract = JSON.parse((await fs.readFile(contractPath, 'utf8')).replace(/^\uFEFF/, ''));
  const sourceResponseTypes = JSON.parse(await fs.readFile(responseTypesPath, 'utf8'));
  const typedContract = {
    ...contract,
    operations: contract.operations.map((operation) => ({
      ...operation,
      returns: operation.returns === 'object'
        ? sourceResponseTypes.schemas[operation.moodleFunction] ?? operation.returns
        : operation.returns
    }))
  };
  const expected = buildOperationTypes(typedContract);
  if (process.argv.includes('--check')) {
    let actual = '';
    try {
      actual = await fs.readFile(outputPath, 'utf8');
    } catch {
      throw new Error('Generated operation type declarations are missing. Run npm run types:generate.');
    }
    if (actual.replace(/\r\n/g, '\n') !== expected) {
      throw new Error('Generated operation type declarations are stale. Run npm run types:generate.');
    }
    return;
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, expected);
  console.log(`Generated ${path.relative(rootDirectory, outputPath)} from ${contract.operations.length} operations.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
