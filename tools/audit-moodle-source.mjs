#!/usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

const sourceArgument = process.argv[2];

if (!sourceArgument) {
  console.error('Usage: node tools/audit-moodle-source.mjs <path-to-moodle-public>');
  process.exit(2);
}

const sourceRoot = resolve(sourceArgument);
const versionOptionIndex = process.argv.indexOf('--version');
const moodleVersion = versionOptionIndex >= 0 ? process.argv[versionOptionIndex + 1] : null;
const contractPath = new URL('../contract/operations.json', import.meta.url);
const contract = JSON.parse(await readFile(contractPath, 'utf8'));

function compareVersions(left, right) {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

function supportsVersion(operation) {
  if (!moodleVersion) return true;
  if (compareVersions(moodleVersion, operation.compatibility.from) < 0) return false;
  return !operation.compatibility.until ||
    compareVersions(moodleVersion, operation.compatibility.until) <= 0;
}

const contractFunctions = new Set(
  contract.operations
    .filter(supportsVersion)
    .map((operation) => operation.moodleFunction)
    .filter((name) => !name.includes('/'))
);

async function findFiles(directory, predicate) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (['tests', 'vendor', 'node_modules'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findFiles(path, predicate));
    } else if (predicate(path)) {
      results.push(path);
    }
  }

  return results;
}

function extractFunctionBlocks(source) {
  const functionsStart = source.indexOf('$functions');
  if (functionsStart < 0) {
    return [];
  }

  const servicesStart = source.indexOf('$services', functionsStart);
  const functionSource = source.slice(
    functionsStart,
    servicesStart < 0 ? source.length : servicesStart
  );
  const candidateExpression = /^(\s+)['"]([^'"]+)['"]\s*=>\s*(?:array\s*\(|\[)/gm;
  const candidates = [...functionSource.matchAll(candidateExpression)];

  return candidates.flatMap((entry, index) => {
    const nextEntry = candidates
      .slice(index + 1)
      .find((candidate) => candidate[1].length <= entry[1].length);
    const body = functionSource.slice(entry.index, nextEntry?.index ?? functionSource.length);
    const isFunctionDefinition =
      /['"]type['"]\s*=>/.test(body) &&
      (/['"]classname['"]\s*=>/.test(body) || /['"]methodname['"]\s*=>/.test(body));

    return isFunctionDefinition ? [{ name: entry[2], body }] : [];
  });
}

const serviceFiles = await findFiles(
  sourceRoot,
  (path) => path.endsWith('/db/services.php') || path.endsWith('\\db\\services.php')
);
const officialFunctions = new Set();
const declaredFunctions = new Set();

for (const file of serviceFiles) {
  const source = await readFile(file, 'utf8');
  for (const definition of extractFunctionBlocks(source)) {
    declaredFunctions.add(definition.name);
    if (definition.body.includes('MOODLE_OFFICIAL_MOBILE_SERVICE')) {
      officialFunctions.add(definition.name);
    }
  }
}

const missingOfficial = [...officialFunctions]
  .filter((name) => !contractFunctions.has(name))
  .sort();
const missingDeclared = [...declaredFunctions]
  .filter((name) => !contractFunctions.has(name))
  .sort();
const unknownContractFunctions = [...contractFunctions]
  .filter((name) => !declaredFunctions.has(name))
  .sort();
const inventoryOptionIndex = process.argv.indexOf('--write-inventory');
if (inventoryOptionIndex >= 0) {
  const inventoryPath = process.argv[inventoryOptionIndex + 1];
  if (!inventoryPath) throw new Error('--write-inventory requires an output path.');
  await writeFile(resolve(inventoryPath), `${JSON.stringify({
    moodleVersion,
    declaredFunctions: [...declaredFunctions].sort(),
    officialMobileFunctions: [...officialFunctions].sort()
  }, null, 2)}\n`);
}

console.log(`Moodle service declarations: ${declaredFunctions.size}`);
console.log(`Official mobile service functions: ${officialFunctions.size}`);
console.log(`Official mobile functions covered: ${officialFunctions.size - missingOfficial.length}`);
console.log(`All declared functions covered: ${declaredFunctions.size - missingDeclared.length}`);
console.log(`Contract functions not found in this source tree: ${unknownContractFunctions.length}`);

if (missingOfficial.length > 0) {
  console.error('\nMissing official mobile functions:');
  for (const name of missingOfficial) {
    console.error(`- ${name}`);
  }
  process.exitCode = 1;
}

if (process.argv.includes('--require-all') && missingDeclared.length > 0) {
  console.error('\nMissing declared external functions:');
  for (const name of missingDeclared) {
    console.error(`- ${name}`);
  }
  process.exitCode = 1;
}

if (process.argv.includes('--strict') && unknownContractFunctions.length > 0) {
  console.error('\nContract functions not found in this Moodle source tree:');
  for (const name of unknownContractFunctions) {
    console.error(`- ${name}`);
  }
  process.exitCode = 1;
}
