// Records Core read operations from a live lab site into
// tests/cassettes/<branch>/core-reads.json.
// usage: MOODLE_BASE_URL=... MOODLE_TOKEN=... node tools/record-cassettes.mjs <branch>
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMoodleClient } from '../client/moodle-rest-client.mjs';
import { cassetteContainsSecret, createRecordingFetch, saveCassette } from '../testing/cassette.mjs';
import { CASSETTE_OPERATIONS } from '../testing/cassette-operations.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branch = process.argv[2];
const baseUrl = process.env.MOODLE_BASE_URL;
const token = process.env.MOODLE_TOKEN;
if (!/^\d+\.\d+$/.test(branch ?? '') || !baseUrl || !token) {
  console.error('usage: MOODLE_BASE_URL=... MOODLE_TOKEN=... node tools/record-cassettes.mjs <branch>');
  process.exit(2);
}

const recorder = createRecordingFetch({ baseUrl, token });
const client = createMoodleClient({ baseUrl, token, fetchImplementation: recorder.fetch, allowInsecure: true });
const results = {};
for (const step of CASSETTE_OPERATIONS) {
  const parameters = step.parameters(results);
  results[step.name] = await client.callOperation(step.operation, parameters);
}
const cassette = {
  schema_version: 1,
  branch,
  moodle_release: results.site?.release ?? null,
  recorded_at: new Date().toISOString(),
  exchanges: recorder.entries
};
if (cassetteContainsSecret(cassette, token)) throw new Error('The cassette still contains the token.');
const target = path.join(root, 'tests', 'cassettes', branch, 'core-reads.json');
saveCassette(target, cassette);
console.log(`Recorded ${recorder.entries.length} exchanges to ${path.relative(root, target)}`);
