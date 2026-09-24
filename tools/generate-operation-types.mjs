import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeOperationTypes } from '../client/operation-types-generator.mjs';

export { buildOperationTypes } from '../client/operation-types-generator.mjs';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = path.join(rootDirectory, 'contract', 'operations.json');
const responseTypesPath = path.join(rootDirectory, 'contract', 'source-response-types.json');
const outputPath = path.join(rootDirectory, 'client', 'generated', 'operation-types.d.ts');

async function main() {
  const contract = JSON.parse((await fs.readFile(contractPath, 'utf8')).replace(/^﻿/, ''));
  const sourceResponseTypes = JSON.parse(await fs.readFile(responseTypesPath, 'utf8'));
  // Core contracts declare generic object returns; use the types extracted from Moodle's source.
  const typedContract = {
    ...contract,
    operations: contract.operations.map((operation) => ({
      ...operation,
      returns: operation.returns === 'object'
        ? sourceResponseTypes.schemas[operation.moodleFunction] ?? operation.returns
        : operation.returns
    }))
  };
  const written = await writeOperationTypes({ contract: typedContract, outputPath, check: process.argv.includes('--check') });
  if (written) console.log(`Generated ${path.relative(rootDirectory, outputPath)} from ${contract.operations.length} operations.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
