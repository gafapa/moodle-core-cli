import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { createMoodleClient } from '../client/moodle-rest-client.mjs';
import {
  CASSETTE_BASE_URL,
  cassetteContainsSecret,
  createRecordingFetch,
  createReplayFetch,
  loadCassette
} from '../testing/cassette.mjs';
import { CASSETTE_OPERATIONS } from '../testing/cassette-operations.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cassetteRoot = path.join(root, 'tests', 'cassettes');
const branches = fs.existsSync(cassetteRoot)
  ? fs.readdirSync(cassetteRoot).filter((entry) => fs.existsSync(path.join(cassetteRoot, entry, 'core-reads.json'))).sort()
  : [];

test('recording redacts the token and the site address, and replay serves the same exchange', async () => {
  const token = 'a'.repeat(32);
  const live = async (input) => {
    const url = new URL(String(input));
    return new Response(JSON.stringify({ sitename: 'Lab', siteurl: `${url.origin}/moodle`, release: '5.2+', echoed: token }), {
      headers: { 'content-type': 'application/json' }
    });
  };
  const recorder = createRecordingFetch({ baseUrl: 'http://127.0.0.1:18999/moodle', token, fetchImplementation: live });
  const recording = createMoodleClient({
    baseUrl: 'http://127.0.0.1:18999/moodle',
    token,
    fetchImplementation: recorder.fetch,
    moodleVersion: '5.2'
  });
  await recording.callOperation('get_site_info', {});
  assert.equal(recorder.entries.length, 1);
  assert.equal(cassetteContainsSecret({ exchanges: recorder.entries }, token), false);
  assert.equal(JSON.stringify(recorder.entries).includes('127.0.0.1:18999'), false);
  assert.match(recorder.entries[0].body, /https:\/\/moodle\.test/);

  const replaying = createMoodleClient({
    baseUrl: CASSETTE_BASE_URL,
    token: 'replay-token',
    fetchImplementation: createReplayFetch(recorder.entries),
    moodleVersion: '5.2'
  });
  const info = await replaying.callOperation('get_site_info', {});
  assert.equal(typeof info, 'object');
  await assert.rejects(
    () => replaying.callOperation('get_courses', {}),
    (error) => /No recorded exchange/.test(String(error.cause?.message))
  );
});

for (const branch of branches) {
  test(`Core reads replay against recorded Moodle ${branch} responses`, async () => {
    const cassette = loadCassette(path.join(cassetteRoot, branch, 'core-reads.json'));
    assert.equal(cassette.branch, branch);
    const client = createMoodleClient({
      baseUrl: CASSETTE_BASE_URL,
      token: 'replay-token',
      fetchImplementation: createReplayFetch(cassette.exchanges)
    });
    const results = {};
    for (const step of CASSETTE_OPERATIONS) {
      results[step.name] = await client.callOperation(step.operation, step.parameters(results));
      assert.notEqual(results[step.name], undefined, `${branch} ${step.operation}`);
    }
    assert.equal(client.moodleVersion, branch);
  });
}
