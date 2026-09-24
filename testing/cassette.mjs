import fs from 'node:fs';
import path from 'node:path';

// Record and replay Moodle REST exchanges ("cassettes") so tests can run
// against real responses from every supported Moodle branch without Docker.
// Recorded cassettes never contain the token or the lab site's address.

export const CASSETTE_BASE_URL = 'https://moodle.test';
const TOKEN_PLACEHOLDER = '[token]';

function requestKey(method, pathname, parameters) {
  const entries = [...parameters.entries()]
    .filter(([name]) => !['wstoken', 'token'].includes(name))
    .sort(([left, leftValue], [right, rightValue]) => left.localeCompare(right) || leftValue.localeCompare(rightValue));
  return `${method} ${pathname} ${new URLSearchParams(entries).toString()}`;
}

async function requestParameters(url, init) {
  const parameters = new URLSearchParams(url.search);
  const body = init?.body;
  if (body instanceof URLSearchParams) {
    for (const [name, value] of body.entries()) parameters.append(name, value);
  } else if (typeof body === 'string') {
    for (const [name, value] of new URLSearchParams(body).entries()) parameters.append(name, value);
  }
  return parameters;
}

function redact(text, secrets) {
  let result = text;
  for (const [secret, replacement] of secrets) {
    if (secret) result = result.split(secret).join(replacement);
  }
  return result;
}

/**
 * Wraps a fetch implementation and records every exchange with the token and
 * site address replaced by placeholders.
 */
export function createRecordingFetch({ baseUrl, token, fetchImplementation = globalThis.fetch }) {
  const site = new URL(baseUrl);
  const origin = `${site.origin}${site.pathname.replace(/\/$/, '')}`;
  const secrets = [[token, TOKEN_PLACEHOLDER], [origin, CASSETTE_BASE_URL], [encodeURIComponent(origin), encodeURIComponent(CASSETTE_BASE_URL)]];
  const entries = [];
  async function recordingFetch(input, init = {}) {
    const url = new URL(String(input));
    const parameters = await requestParameters(url, init);
    const response = await fetchImplementation(input, init);
    const body = await response.text();
    const pathname = url.pathname.slice(site.pathname.replace(/\/$/, '').length) || '/';
    entries.push({
      key: redact(requestKey(init.method ?? 'GET', pathname, parameters), secrets),
      status: response.status,
      content_type: response.headers.get('content-type'),
      body: redact(body, secrets)
    });
    return new Response(body, { status: response.status, headers: response.headers });
  }
  return { fetch: recordingFetch, entries };
}

/**
 * Serves recorded exchanges. Requests must match a recorded method, path, and
 * parameter set exactly; anything else fails loudly.
 */
export function createReplayFetch(entries, { baseUrl = CASSETTE_BASE_URL } = {}) {
  const site = new URL(baseUrl);
  const byKey = new Map(entries.map((entry) => [entry.key, entry]));
  return async function replayFetch(input, init = {}) {
    const url = new URL(String(input));
    const parameters = await requestParameters(url, init);
    const pathname = url.pathname.slice(site.pathname.replace(/\/$/, '').length) || '/';
    const key = requestKey(init.method ?? 'GET', pathname, parameters);
    const entry = byKey.get(key);
    if (!entry) throw new Error(`No recorded exchange for ${key}`);
    return new Response(entry.body, {
      status: entry.status,
      headers: entry.content_type ? { 'content-type': entry.content_type } : {}
    });
  };
}

export function saveCassette(filePath, cassette) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(cassette, null, 2)}\n`);
}

export function loadCassette(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function cassetteContainsSecret(cassette, secret) {
  return Boolean(secret) && JSON.stringify(cassette).includes(secret);
}
