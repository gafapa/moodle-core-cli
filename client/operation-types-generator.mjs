import fs from 'node:fs/promises';
import path from 'node:path';

// Generates TypeScript declarations for an operation contract. Shared by
// moodle-core-cli and moodlia, whose contracts differ only in these options:
// - objectParameterType: the type accepted for object parameters.
// - clientMethods: the generic call methods of TypedMoodleClient.

function toPascalCase(value) {
  return value.split('_').map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join('');
}

function quote(value) {
  return JSON.stringify(String(value));
}

function scalarType(value, objectType = 'JsonObject') {
  if (typeof value === 'string' && value.includes('|')) {
    return value.split('|').map((part) => scalarType(part.trim(), objectType)).join(' | ');
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
      return objectType;
    case 'object_array':
      return 'JsonObject[]';
    case 'null':
      return 'null';
    default:
      return 'unknown';
  }
}

function parameterType(definition, objectParameterType) {
  if (Array.isArray(definition.enum)) return definition.enum.map(quote).join(' | ');
  if (definition.type === 'array') return `${scalarType(definition.items ?? 'unknown')}[]`;
  return scalarType(definition.type, objectParameterType);
}

function responseType(definition, indent = 0) {
  const padding = ' '.repeat(indent);
  const nestedPadding = ' '.repeat(indent + 2);
  if (typeof definition === 'string') return scalarType(definition.split(';')[0].trim());
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

function parameterInterface(operation, objectParameterType) {
  const name = `${toPascalCase(operation.name)}Parameters`;
  const entries = Object.entries(operation.parameters ?? {});
  if (entries.length === 0) return `export interface ${name} {}\n`;
  const lines = entries.map(([key, definition]) =>
    `  ${key}${definition.required ? '' : '?'}: ${parameterType(definition, objectParameterType)};`);
  return `export interface ${name} {\n${lines.join('\n')}\n}\n`;
}

function responseDeclaration(operation) {
  const name = `${toPascalCase(operation.name)}Response`;
  const body = responseType(operation.returns);
  return !Array.isArray(operation.returns) && body.startsWith('{\n')
    ? `export interface ${name} ${body}\n`
    : `export type ${name} = ${body};\n`;
}

export function buildOperationTypes(contract, { objectParameterType = 'JsonObject', clientMethods = ['callOperation'] } = {}) {
  const operations = contract.operations ?? [];
  const operationNames = operations.map((operation) => operation.name);
  const methods = operations.map((operation) => {
    const pascalName = toPascalCase(operation.name);
    const optional = Object.keys(operation.parameters ?? {}).length === 0 ? '?' : '';
    return `  ${operation.name}(parameters${optional}: ${pascalName}Parameters): Promise<${pascalName}Response>;`;
  });
  const genericMethods = clientMethods.flatMap((method) => [
    `  ${method}<TName extends MoodleOperationName>(`,
    '    operationName: TName,',
    '    parameters: MoodleOperationParameters[TName]',
    '  ): Promise<MoodleOperationResponses[TName]>;'
  ]);

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
    operations.map((operation) => parameterInterface(operation, objectParameterType)).join('\n'),
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
    ...genericMethods,
    ...methods,
    '}',
    '',
    'export type MoodleOperationParameter<TName extends MoodleOperationName> = MoodleOperationParameters[TName];',
    'export type MoodleOperationResponse<TName extends MoodleOperationName> = MoodleOperationResponses[TName];',
    ''
  ].join('\n');
}

/**
 * Writes the declarations, or with check=true fails when the file is stale.
 */
export async function writeOperationTypes({ contract, outputPath, check = false, ...options }) {
  const expected = buildOperationTypes(contract, options);
  if (check) {
    let actual = '';
    try {
      actual = await fs.readFile(outputPath, 'utf8');
    } catch {
      throw new Error('Generated operation type declarations are missing. Run npm run types:generate.');
    }
    if (actual.replace(/\r\n/g, '\n') !== expected) {
      throw new Error('Generated operation type declarations are stale. Run npm run types:generate.');
    }
    return false;
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, expected);
  return true;
}
