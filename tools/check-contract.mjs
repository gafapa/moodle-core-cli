import fs from 'node:fs/promises';

const contract = JSON.parse(await fs.readFile(new URL('../contract/operations.json', import.meta.url), 'utf8'));
const sourceResponseTypes = JSON.parse(
  await fs.readFile(new URL('../contract/source-response-types.json', import.meta.url), 'utf8')
);
const errors = [];
const names = new Set();

if (!contract.version) errors.push('Contract version is required.');
if (contract.minimumMoodleVersion !== '4.5') errors.push('minimumMoodleVersion must be 4.5.');
if (contract.maximumVerifiedMoodleVersion !== '5.3') {
  errors.push('maximumVerifiedMoodleVersion must be 5.3.');
}
if (!Number.isInteger(contract.generatedStandardOperationCount)) {
  errors.push('generatedStandardOperationCount must be an integer.');
}

for (const operation of contract.operations ?? []) {
  if (!/^[a-z][a-z0-9_]*$/.test(operation.name)) errors.push(`Invalid operation name: ${operation.name}.`);
  if (names.has(operation.name)) errors.push(`Duplicate operation name: ${operation.name}.`);
  names.add(operation.name);
  if (!operation.summary) errors.push(`${operation.name} requires a summary.`);
  if (!['read', 'write'].includes(operation.kind)) errors.push(`${operation.name} requires a read or write kind.`);
  if (!operation.moodleFunction) errors.push(`${operation.name} requires a Moodle function.`);
  if (!operation.compatibility?.from) errors.push(`${operation.name} requires compatibility.from.`);
  if (
    operation.compatibility?.until &&
    Number(operation.compatibility.until) < Number(operation.compatibility.from)
  ) {
    errors.push(`${operation.name} has compatibility.until before compatibility.from.`);
  }
  if (!operation.parameters || operation.returns === undefined) errors.push(`${operation.name} requires parameters and returns.`);
  if (
    operation.returns === 'object' &&
    !sourceResponseTypes.schemas?.[operation.moodleFunction]
  ) {
    errors.push(`${operation.name} has an unresolved generic response type.`);
  }
}

if ((sourceResponseTypes.unresolved ?? []).length > 0) {
  errors.push(`Response extraction has ${sourceResponseTypes.unresolved.length} unresolved functions.`);
}
if ((sourceResponseTypes.unresolvedParameters ?? []).length > 0) {
  errors.push(`Parameter extraction has ${sourceResponseTypes.unresolvedParameters.length} unresolved functions.`);
}

if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}

console.log(`Validated ${contract.operations.length} operations.`);
