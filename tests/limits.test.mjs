import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  createMoodleClient,
  MoodleConfigurationError,
  MoodlePayloadTooLargeError,
  MoodlePermissionError,
  operationResponseLimit,
  RestTransport
} from '../client/moodle-rest-client.mjs';
import {
  commandLineFileRoots,
  DEFAULT_LIMITS,
  resolveByteLimit
} from '../client/transport-kernel.mjs';
import { CLI_EXIT_CODES, exitCodeForError } from '../cli/exit-codes.mjs';

const MiB = 1024 * 1024;

function jsonResponse(value, init = {}) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init
  });
}

function streamingResponse(totalBytes, { chunkBytes = MiB, headers = {} } = {}) {
  let sent = 0;
  const chunk = new Uint8Array(chunkBytes).fill(97);
  return new Response(new ReadableStream({
    pull(controller) {
      if (sent >= totalBytes) {
        controller.close();
        return;
      }
      const size = Math.min(chunkBytes, totalBytes - sent);
      controller.enqueue(size === chunkBytes ? chunk : chunk.subarray(0, size));
      sent += size;
    }
  }), { status: 200, headers });
}

function memoryInUse() {
  const usage = process.memoryUsage();
  return usage.heapUsed + usage.arrayBuffers;
}

async function withTemporaryDirectory(callback) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-limits-'));
  try {
    return await callback(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test('byte limits resolve from explicit values, then environment, then defaults', () => {
  const environment = { MOODLE_MAX_UPLOAD_BYTES: '4096' };
  assert.equal(resolveByteLimit(10, { name: 'maximumUploadBytes', fallback: 1, environment }), 10);
  assert.equal(resolveByteLimit(undefined, { name: 'maximumUploadBytes', fallback: 1, environment }), 4096);
  assert.equal(resolveByteLimit(undefined, { name: 'maximumUploadBytes', fallback: 1, environment: {} }), 1);
  assert.equal(resolveByteLimit(Infinity, { name: 'maximumUploadBytes', fallback: 1 }), Infinity);
  assert.throws(
    () => resolveByteLimit(undefined, { name: 'maximumUploadBytes', fallback: 1, environment: { MOODLE_MAX_UPLOAD_BYTES: 'lots' } }),
    { code: 'configuration_error' }
  );
  assert.throws(
    () => new RestTransport({ baseUrl: 'https://moodle.example.com', token: 't', maximumResponseBytes: -1 }),
    MoodleConfigurationError
  );
});

test('library defaults stream large transfers and keep local files closed', () => {
  const transport = new RestTransport({ baseUrl: 'https://moodle.example.com', token: 't' });
  assert.equal(transport.maximumResponseBytes, 10 * MiB);
  assert.equal(transport.maximumUploadBytes, 2048 * MiB);
  assert.equal(transport.maximumDownloadBytes, 2048 * MiB);
  assert.deepEqual(transport.allowedFileRoots, []);
  assert.equal(
    new RestTransport({ baseUrl: 'https://moodle.example.com', token: 't', environment: { MOODLE_MAX_DOWNLOAD_BYTES: '123' } })
      .maximumDownloadBytes,
    123
  );
});

test('responses just below and just above the limit', async () => {
  const body = JSON.stringify({ value: 'x'.repeat(100) });
  const size = Buffer.byteLength(body);
  const at = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    maximumResponseBytes: size,
    fetchImplementation: async () => new Response(body)
  });
  assert.deepEqual(await at.callFunction('f'), JSON.parse(body));

  const below = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    maximumResponseBytes: size - 1,
    fetchImplementation: async () => new Response(body)
  });
  await assert.rejects(() => below.callFunction('f'), (error) => {
    assert.ok(error instanceof MoodlePayloadTooLargeError);
    assert.equal(error.code, 'payload_too_large');
    assert.equal(error.details.limit, size - 1);
    assert.equal(error.details.limit_name, 'maximumResponseBytes');
    assert.equal(error.details.option, '--max-response-bytes');
    assert.equal(error.details.environment_variable, 'MOODLE_MAX_RESPONSE_BYTES');
    return true;
  });
});

test('false and missing Content-Length headers cannot bypass the limit', async () => {
  const lying = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    maximumResponseBytes: 1024,
    fetchImplementation: async () => streamingResponse(8 * 1024, { chunkBytes: 512, headers: { 'content-length': '10' } })
  });
  await assert.rejects(() => lying.callFunction('f'), MoodlePayloadTooLargeError);

  const declared = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    maximumResponseBytes: 1024,
    fetchImplementation: async () => new Response('{}', { headers: { 'content-length': '999999' } })
  });
  await assert.rejects(() => declared.callFunction('f'), (error) => error.details.observed === 999999);

  const missing = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    maximumResponseBytes: 1024,
    fetchImplementation: async () => streamingResponse(4 * 1024, { chunkBytes: 256 })
  });
  await assert.rejects(() => missing.callFunction('f'), MoodlePayloadTooLargeError);
});

test('operation limits raise the default for bulk reads but never override a user limit', async () => {
  assert.equal(operationResponseLimit({ limits: { class: 'bulk' } }), DEFAULT_LIMITS.maximumBulkResponseBytes);
  assert.equal(operationResponseLimit({ limits: { maximumResponseBytes: 5 } }), 5);
  assert.equal(operationResponseLimit({}), null);

  const large = JSON.stringify({ data: 'y'.repeat(12 * MiB) });
  const makeTransport = (options = {}) => new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 't',
    fetchImplementation: async () => new Response(large),
    ...options
  });
  await assert.rejects(() => makeTransport().callFunction('f'), MoodlePayloadTooLargeError);
  const raised = await makeTransport().callFunction('f', {}, { maximumResponseBytes: 64 * MiB });
  assert.equal(raised.data.length, 12 * MiB);
  await assert.rejects(
    () => makeTransport({ maximumResponseBytes: 10 * MiB }).callFunction('f', {}, { maximumResponseBytes: 64 * MiB }),
    MoodlePayloadTooLargeError
  );
  await assert.rejects(
    () => makeTransport({ environment: { MOODLE_MAX_RESPONSE_BYTES: String(MiB) } })
      .callFunction('f', {}, { maximumResponseBytes: 64 * MiB }),
    MoodlePayloadTooLargeError
  );
});

test('the client applies a contract operation limit to its REST call', async () => {
  const contract = {
    version: 'test',
    minimumMoodleVersion: '4.5',
    maximumVerifiedMoodleVersion: '5.3',
    operations: [{
      name: 'export_everything',
      summary: 'Bulk export',
      kind: 'read',
      moodleFunction: 'core_export_everything',
      compatibility: { from: '4.5' },
      parameters: {},
      returns: {},
      limits: { class: 'bulk' }
    }]
  };
  const calls = [];
  const transport = {
    siteMaximumUploadBytes: null,
    async callFunction(functionName, parameters, options) {
      calls.push({ functionName, options });
      return {};
    }
  };
  const client = createMoodleClient({ contract, transport, moodleVersion: '5.2' });
  await client.callOperation('export_everything', {});
  assert.equal(calls[0].options.maximumResponseBytes, DEFAULT_LIMITS.maximumBulkResponseBytes);
});

test('uploads stream a 256 MiB file without buffering it in memory', async () => {
  await withTemporaryDirectory(async (directory) => {
    const filePath = path.join(directory, 'large backup.mbz');
    const handle = await fs.open(filePath, 'w');
    const block = Buffer.alloc(MiB, 98);
    for (let index = 0; index < 256; index += 1) await handle.write(block);
    await handle.close();

    let received = 0;
    let peak = 0;
    const baseline = memoryInUse();
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 't',
      allowedFileRoots: [directory],
      fetchImplementation: async (url, options) => {
        const reader = new Response(options.body).body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.byteLength;
          peak = Math.max(peak, memoryInUse() - baseline);
        }
        return jsonResponse([{ itemid: 5, filename: 'large backup.mbz' }]);
      }
    });
    const result = await transport.uploadDraftFile({ filePath });
    assert.equal(result.itemid, 5);
    assert.ok(received > 256 * MiB, `received ${received}`);
    assert.ok(peak < 128 * MiB, `upload buffered ${Math.round(peak / MiB)} MiB`);
  });
});

test('downloads stream a 256 MiB file to disk without buffering it in memory', async () => {
  await withTemporaryDirectory(async (directory) => {
    const destinationPath = path.join(directory, 'download.mbz');
    const baseline = memoryInUse();
    let peak = 0;
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 't',
      allowedFileRoots: [directory],
      fetchImplementation: async () => {
        const response = streamingResponse(256 * MiB);
        const reader = response.body.getReader();
        return new Response(new ReadableStream({
          async pull(controller) {
            const { done, value } = await reader.read();
            peak = Math.max(peak, memoryInUse() - baseline);
            if (done) controller.close();
            else controller.enqueue(value);
          }
        }));
      }
    });
    const result = await transport.downloadFile({
      fileUrl: 'https://moodle.example.com/pluginfile.php/1/backup/course/download.mbz',
      destinationPath
    });
    assert.equal(result.size, 256 * MiB);
    assert.equal((await fs.stat(destinationPath)).size, 256 * MiB);
    assert.ok(peak < 128 * MiB, `download buffered ${Math.round(peak / MiB)} MiB`);
  });
});

test('upload and download limits reject before or while transferring and leave no partial file', async () => {
  await withTemporaryDirectory(async (directory) => {
    const filePath = path.join(directory, 'five.bin');
    await fs.writeFile(filePath, '12345');
    let uploads = 0;
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 't',
      allowedFileRoots: [directory],
      maximumUploadBytes: 4,
      maximumDownloadBytes: 4,
      fetchImplementation: async () => {
        uploads += 1;
        return streamingResponse(5, { chunkBytes: 1 });
      }
    });
    await assert.rejects(() => transport.uploadDraftFile({ filePath }), (error) => {
      assert.equal(error.code, 'payload_too_large');
      assert.equal(error.details.observed, 5);
      assert.equal(error.details.limit_name, 'maximumUploadBytes');
      return true;
    });
    assert.equal(uploads, 0, 'an oversized upload must not reach Moodle');

    const destinationPath = path.join(directory, 'partial.bin');
    await assert.rejects(() => transport.downloadFile({
      fileUrl: 'https://moodle.example.com/pluginfile.php/1/file.bin',
      destinationPath
    }), MoodlePayloadTooLargeError);
    const leftovers = (await fs.readdir(directory)).filter((name) => name !== 'five.bin');
    assert.deepEqual(leftovers, []);
  });
});

test('uploads honour the upload limit reported by the Moodle site', async () => {
  await withTemporaryDirectory(async (directory) => {
    const filePath = path.join(directory, 'file.bin');
    await fs.writeFile(filePath, Buffer.alloc(2048));
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 't',
      allowedFileRoots: [directory],
      fetchImplementation: async (url) => {
        if (url.pathname.endsWith('server.php')) {
          return jsonResponse({ release: '5.2 (Build: 20260101)', version: '2026010100', usermaxuploadfilesize: 1024 });
        }
        return jsonResponse([{ itemid: 1 }]);
      }
    });
    const client = createMoodleClient({ transport });
    await client.detectVersion();
    assert.equal(transport.siteMaximumUploadBytes, 1024);
    await assert.rejects(() => transport.uploadDraftFile({ filePath }), (error) => {
      assert.equal(error.code, 'payload_too_large');
      assert.equal(error.details.limit_name, 'siteMaximumUploadBytes');
      return true;
    });
  });
});

test('file roots contain relative, parent-traversal, absolute, and linked paths', async () => {
  await withTemporaryDirectory(async (root) => {
    const inside = path.join(root, 'inside');
    const outside = path.join(root, 'outside');
    await fs.mkdir(inside);
    await fs.mkdir(outside);
    await fs.writeFile(path.join(inside, 'ok.txt'), 'ok');
    await fs.writeFile(path.join(outside, 'secret.txt'), 'secret');
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 't',
      allowedFileRoots: [inside],
      fetchImplementation: async () => jsonResponse([{ itemid: 1 }])
    });

    const previous = process.cwd();
    process.chdir(inside);
    try {
      assert.equal((await transport.uploadDraftFile({ filePath: 'ok.txt' })).itemid, 1);
      await assert.rejects(() => transport.uploadDraftFile({ filePath: '../outside/secret.txt' }), MoodlePermissionError);
    } finally {
      process.chdir(previous);
    }
    await assert.rejects(
      () => transport.uploadDraftFile({ filePath: path.join(inside, '..', 'outside', 'secret.txt') }),
      MoodlePermissionError
    );
    const systemFile = process.platform === 'win32'
      ? path.join(process.env.SystemRoot ?? 'C:\\Windows', 'win.ini')
      : '/etc/hosts';
    await assert.rejects(() => transport.uploadDraftFile({ filePath: systemFile }), MoodlePermissionError);
    if (process.platform === 'win32') {
      await assert.rejects(
        () => transport.uploadDraftFile({ filePath: '\\\\127.0.0.1\\c$\\Windows\\win.ini' }),
        (error) => ['permission_error', 'validation_error'].includes(error.code)
      );
    }
    try {
      await fs.symlink(outside, path.join(inside, 'link'), 'junction');
    } catch (error) {
      if (['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) return;
      throw error;
    }
    await assert.rejects(
      () => transport.uploadDraftFile({ filePath: path.join(inside, 'link', 'secret.txt') }),
      MoodlePermissionError
    );
  });
});

test('command-line defaults allow the working directory and explicitly named files', () => {
  const cwd = path.resolve('/work');
  const roots = commandLineFileRoots([path.resolve('/elsewhere/file.pdf'), undefined, ''], cwd);
  assert.deepEqual(roots, [cwd, path.resolve('/elsewhere')]);
});

test('payload_too_large maps to the validation exit code', () => {
  assert.equal(exitCodeForError(new MoodlePayloadTooLargeError('too big')), CLI_EXIT_CODES.validationError);
});
