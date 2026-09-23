import fs from 'node:fs';
import path from 'node:path';
import { defaultErrorFactory } from '../client/transport-kernel.mjs';

// Option helpers shared by the Core, MoodlIA, and synchronization CLIs. Each
// caller passes its error factory so validation keeps its own public code.

function optionName(name) {
  return `--${name.replaceAll('_', '-')}`;
}

export function requiredOption(options, name, errors = defaultErrorFactory) {
  const value = options[name];
  if (value === undefined || value === true || String(value).trim() === '') {
    throw errors.validation(`${optionName(name)} is required.`, { parameter: name });
  }
  return String(value);
}

export function positiveIntegerOption(options, name, { fallback, errors = defaultErrorFactory } = {}) {
  const value = options[name] === undefined
    ? fallback
    : Number(requiredOption(options, name, errors));
  if (!Number.isInteger(value) || value <= 0) {
    throw errors.validation(`${optionName(name)} must be a positive integer.`, { parameter: name });
  }
  return value;
}

export function booleanOption(options, name, errors = defaultErrorFactory) {
  const value = options[name];
  if (value === undefined) return false;
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  throw errors.validation(`${optionName(name)} must be true or false.`, { parameter: name });
}

export function readJsonFile(filePath, label, errors = defaultErrorFactory) {
  if (filePath === undefined || filePath === true || String(filePath).trim() === '') {
    throw errors.validation(`${label} requires a JSON file path.`, {});
  }
  const resolved = path.resolve(String(filePath));
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8').replace(/^﻿/, ''));
  } catch (error) {
    throw errors.validation(`Unable to read ${label}: ${resolved}`, { file_path: resolved }, error);
  }
}

/**
 * Writes JSON to a new file readable only by its owner. Existing files are
 * never overwritten, so a saved plan cannot be silently replaced.
 */
export function writeNewJsonFile(filePath, value) {
  const resolved = path.resolve(String(filePath));
  fs.mkdirSync(path.dirname(resolved), { recursive: true, mode: 0o700 });
  fs.writeFileSync(resolved, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  return resolved;
}
