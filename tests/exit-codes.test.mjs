import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import {
  CLI_EXIT_CODES,
  exitCodeForError,
  exitCodeForResult
} from '../cli/exit-codes.mjs';

test('exit-code classifier covers every documented outcome', () => {
  assert.equal(exitCodeForError({ code: 'invalid_parameters' }), CLI_EXIT_CODES.validationError);
  assert.equal(exitCodeForError({ code: 'capability_gap' }), CLI_EXIT_CODES.capabilityGap);
  assert.equal(exitCodeForError({ code: 'entity_precondition_failed' }), CLI_EXIT_CODES.conflict);
  assert.equal(exitCodeForError({ code: 'transport_error' }), CLI_EXIT_CODES.remoteFailure);
  assert.equal(exitCodeForError({ code: 'verification_failed' }), CLI_EXIT_CODES.verificationFailure);
  assert.equal(exitCodeForError(new Error('Unexpected')), CLI_EXIT_CODES.internalError);

  assert.equal(exitCodeForResult({ unsupported: [{ capability: 'section.write' }] }), CLI_EXIT_CODES.capabilityGap);
  assert.equal(exitCodeForResult({ conflicts: [{ field: 'fullname' }] }), CLI_EXIT_CODES.conflict);
  assert.equal(exitCodeForResult({ status: 'partially_applied' }), CLI_EXIT_CODES.partialExecution);
  assert.equal(exitCodeForResult({ status: 'verification_failed' }), CLI_EXIT_CODES.verificationFailure);
  assert.equal(exitCodeForResult({ status: 'succeeded' }), CLI_EXIT_CODES.success);
});

test('CLI validation failures return exit code 2 with structured stderr', () => {
  const result = spawnSync(process.execPath, [path.resolve('cli/moodle-core.mjs'), 'not-a-command'], {
    cwd: path.resolve('.'),
    encoding: 'utf8'
  });
  assert.equal(result.status, CLI_EXIT_CODES.validationError);
  assert.equal(JSON.parse(result.stderr).code, 'validation_error');
});
