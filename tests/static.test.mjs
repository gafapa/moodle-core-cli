import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadContractFromFile } from '../client/moodle-rest-client.mjs';

const execFileAsync = promisify(execFile);
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('generated type declarations are current', async () => {
  await execFileAsync(process.execPath, ['tools/generate-operation-types.mjs', '--check'], {
    cwd: rootDirectory
  });
});

test('every operation has a unique friendly command', () => {
  const contract = loadContractFromFile();
  const commands = contract.operations.map((operation) => operation.name.replaceAll('_', '-'));
  assert.equal(new Set(commands).size, commands.length);
  assert.ok(contract.operations.every((operation) => operation.compatibility.from >= '5.0'));
});

test('CLI prints contract-generated help', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['cli/moodle-core.mjs', '--help'], {
    cwd: rootDirectory
  });
  assert.match(stdout, /create-course/);
  assert.doesNotMatch(stdout, /core_course_create_courses/);
});

test('CLI requires explicit write and destructive-operation authorization', async () => {
  await assert.rejects(
    () => execFileAsync(process.execPath, ['cli/moodle-core.mjs', 'create-course'], {
      cwd: rootDirectory
    }),
    (error) => {
      assert.match(error.stderr, /requires --allow-write/);
      return true;
    }
  );
  await assert.rejects(
    () => execFileAsync(process.execPath, [
      'cli/moodle-core.mjs',
      'delete-course',
      '--allow-write'
    ], {
      cwd: rootDirectory
    }),
    (error) => {
      assert.match(error.stderr, /requires --yes/);
      return true;
    }
  );
});

test('CLI parses security booleans strictly', async () => {
  await assert.rejects(
    () => execFileAsync(process.execPath, [
      'cli/moodle-core.mjs',
      'get-site-info',
      '--url',
      'http://moodle.example.com',
      '--token',
      'example-token',
      '--allow-insecure=false'
    ], {
      cwd: rootDirectory
    }),
    (error) => {
      assert.match(error.stderr, /baseUrl must use HTTPS/);
      return true;
    }
  );
  await assert.rejects(
    () => execFileAsync(process.execPath, [
      'cli/moodle-core.mjs',
      'get-site-info',
      '--allow-insecure=maybe'
    ], {
      cwd: rootDirectory
    }),
    (error) => {
      assert.match(error.stderr, /must be true or false/);
      return true;
    }
  );
});
