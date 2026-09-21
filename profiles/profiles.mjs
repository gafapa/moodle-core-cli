import fs from 'node:fs';
import path from 'node:path';

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object.`);
  }
  return value;
}

function normalizeUrl(value, profileName) {
  let url;
  try {
    url = new URL(String(value));
  } catch (error) {
    throw new TypeError(`Profile ${profileName} has an invalid URL.`, { cause: error });
  }
  const loopback = ['127.0.0.1', '::1', 'localhost'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
    throw new TypeError(`Profile ${profileName} must use HTTPS unless it is a loopback site.`);
  }
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.toString().replace(/\/$/, '');
}

function credentialReference(value, name) {
  if (value === undefined) return null;
  const reference = assertObject(value, name);
  const tokenEnv = String(reference.token_env ?? '').trim();
  if (!tokenEnv || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(tokenEnv)) {
    throw new TypeError(`${name}.token_env must be an environment variable name.`);
  }
  return Object.freeze({ token_env: tokenEnv });
}

function normalizeProfile(name, value) {
  const profile = assertObject(value, `profile ${name}`);
  const backend = profile.backend ?? 'auto';
  if (!['auto', 'core', 'moodlia'].includes(backend)) {
    throw new TypeError(`Profile ${name} has an unsupported backend.`);
  }
  const credentials = assertObject(profile.credentials ?? {}, `profile ${name}.credentials`);
  const normalizedCredentials = {
    core: credentialReference(credentials.core, `profile ${name}.credentials.core`),
    moodlia: credentialReference(credentials.moodlia, `profile ${name}.credentials.moodlia`)
  };
  if (!normalizedCredentials.core && !normalizedCredentials.moodlia) {
    throw new TypeError(`Profile ${name} must configure at least one credential reference.`);
  }
  return Object.freeze({
    name,
    url: normalizeUrl(profile.url, name),
    backend,
    credentials: Object.freeze(normalizedCredentials),
    allow_insecure: profile.allow_insecure === true
  });
}

export function parseProfiles(document) {
  const root = assertObject(document, 'profile document');
  if (root.schema_version !== 1) {
    throw new TypeError('Profile document schema_version must be 1.');
  }
  const profiles = assertObject(root.profiles, 'profiles');
  return new Map(Object.entries(profiles).map(([name, value]) => [name, normalizeProfile(name, value)]));
}

export function loadProfiles(configPath) {
  const resolvedPath = path.resolve(configPath);
  const raw = fs.readFileSync(resolvedPath, 'utf8').replace(/^\uFEFF/, '');
  return parseProfiles(JSON.parse(raw));
}

export function resolveProfile(profiles, name, environment = process.env) {
  const profile = profiles.get(name);
  if (!profile) throw new TypeError(`Unknown Moodle profile: ${name}.`);
  const credentials = {};
  for (const provider of ['core', 'moodlia']) {
    const reference = profile.credentials[provider];
    if (!reference) continue;
    const token = environment[reference.token_env];
    if (typeof token !== 'string' || token === '') {
      throw new TypeError(`Profile ${name} requires environment variable ${reference.token_env}.`);
    }
    credentials[provider] = Object.freeze({ token });
  }
  return Object.freeze({ ...profile, credentials: Object.freeze(credentials) });
}

export function describeProfile(profile) {
  return {
    name: profile.name,
    url: profile.url,
    backend: profile.backend,
    credential_providers: Object.entries(profile.credentials)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([provider]) => provider)
  };
}
