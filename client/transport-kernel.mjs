import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

// Shared transport primitives for Moodle REST clients. Each client supplies an
// error factory so it keeps its own public error codes while sharing limits,
// streaming, file-root checks, and secret redaction.

export const DEFAULT_LIMITS = Object.freeze({
  maximumResponseBytes: 10 * 1024 * 1024,
  maximumBulkResponseBytes: 64 * 1024 * 1024,
  maximumUploadBytes: 2 * 1024 * 1024 * 1024,
  maximumDownloadBytes: 2 * 1024 * 1024 * 1024
});

export const LIMIT_ENVIRONMENT = Object.freeze({
  maximumResponseBytes: 'MOODLE_MAX_RESPONSE_BYTES',
  maximumUploadBytes: 'MOODLE_MAX_UPLOAD_BYTES',
  maximumDownloadBytes: 'MOODLE_MAX_DOWNLOAD_BYTES'
});

export const LIMIT_OPTIONS = Object.freeze({
  maximumResponseBytes: '--max-response-bytes',
  maximumUploadBytes: '--max-upload-bytes',
  maximumDownloadBytes: '--max-download-bytes'
});

const sensitiveKeyPattern = /(?:access_?token|api_?key|password|private_?key|secret|token)$/i;

export class MoodleClientError extends Error {
  constructor(code, message, details = {}, cause = null) {
    super(message, cause ? { cause } : undefined);
    this.name = 'MoodleClientError';
    this.code = code;
    this.details = details;
  }

  toJSON({ includeDebug = false } = {}) {
    const details = includeDebug
      ? this.details
      : Object.fromEntries(Object.entries(this.details).filter(([key]) => key !== 'debuginfo'));
    return {
      error: true,
      code: this.code,
      message: this.message,
      details: redactSensitiveData(details)
    };
  }
}

export class MoodlePayloadTooLargeError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('payload_too_large', message, details, cause);
    this.name = 'MoodlePayloadTooLargeError';
  }
}

export function normalizeClientError(error, fallbackCode = 'internal_error', details = {}) {
  if (error instanceof MoodleClientError) {
    return error;
  }
  if (error && typeof error.code === 'string' && error.code.trim() !== '') {
    return new MoodleClientError(
      error.code,
      error.message || 'Unexpected Moodle client error.',
      error.details && typeof error.details === 'object' ? error.details : details,
      error
    );
  }
  return new MoodleClientError(fallbackCode, error?.message || 'Unexpected Moodle client error.', details, error);
}

/**
 * Default error factory. Kinds: configuration, validation, permission,
 * connection. Size violations always use MoodlePayloadTooLargeError.
 */
export const defaultErrorFactory = Object.freeze({
  configuration: (message, details, cause) => new MoodleClientError('configuration_error', message, details, cause),
  validation: (message, details, cause) => new MoodleClientError('validation_error', message, details, cause),
  permission: (message, details, cause) => new MoodleClientError('permission_error', message, details, cause),
  connection: (message, details, cause) => new MoodleClientError('connection_error', message, details, cause)
});

export function redactSensitiveData(value, { redactEntireValue = false } = {}) {
  if (redactEntireValue && (value === null || typeof value !== 'object')) return '[REDACTED]';
  if (Array.isArray(value)) {
    return value.map((entry) => redactSensitiveData(entry, { redactEntireValue }));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
      key,
      redactEntireValue || sensitiveKeyPattern.test(key)
        ? '[REDACTED]'
        : redactSensitiveData(entry, { redactEntireValue: false })
    ]));
  }
  return value;
}

export function collectSensitiveValues(value, inheritedSensitive = false, values = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectSensitiveValues(entry, inheritedSensitive, values));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => {
      collectSensitiveValues(entry, inheritedSensitive || sensitiveKeyPattern.test(key), values);
    });
  } else if (inheritedSensitive && value !== undefined && value !== null && String(value).length >= 4) {
    values.add(String(value));
  }
  return values;
}

export function redactTextValues(value, sensitiveValues) {
  let result = value === undefined || value === null ? value : String(value);
  if (typeof result !== 'string') return result;
  for (const sensitiveValue of sensitiveValues) {
    if (sensitiveValue) result = result.replaceAll(String(sensitiveValue), '[REDACTED]');
  }
  return result;
}

export function isLoopbackHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export function normalizeMoodleBaseUrl(baseUrl, { allowInsecure = false, errors = defaultErrorFactory, parameter = 'baseUrl' } = {}) {
  let resolved;
  try {
    resolved = new URL(baseUrl);
  } catch (error) {
    throw errors.configuration(`${parameter} must be a valid URL.`, { parameter }, error);
  }
  if (resolved.username || resolved.password) {
    throw errors.configuration(`${parameter} must not contain credentials.`, { parameter });
  }
  if (resolved.protocol !== 'https:' && !(resolved.protocol === 'http:' && (allowInsecure || isLoopbackHostname(resolved.hostname)))) {
    throw errors.configuration(
      `${parameter} must use HTTPS. HTTP is allowed only for loopback hosts or when allowInsecure is explicitly enabled.`,
      { parameter, protocol: resolved.protocol }
    );
  }
  resolved.search = '';
  resolved.hash = '';
  resolved.pathname = `${resolved.pathname.replace(/\/+$/, '')}/`;
  return resolved;
}

export function resolveMoodleUrl(baseUrl, relativePath, options = {}) {
  const errors = options.errors ?? defaultErrorFactory;
  const relative = String(relativePath ?? '').replace(/^\/+/, '');
  if (/^[a-z][a-z\d+.-]*:/i.test(relative)) {
    throw errors.validation('Moodle URL paths must be relative paths.', { parameter: 'relativePath' });
  }
  return new URL(relative || '.', normalizeMoodleBaseUrl(baseUrl, options));
}

/**
 * Resolves a byte limit from, in order: an explicit value, an environment
 * variable, and a default. Infinity is accepted to disable a limit.
 */
export function resolveByteLimit(value, { name, fallback, environment = process.env, errors = defaultErrorFactory } = {}) {
  let resolved = value;
  if (resolved === undefined || resolved === null || resolved === '') {
    const variable = LIMIT_ENVIRONMENT[name];
    const fromEnvironment = variable ? environment?.[variable] : undefined;
    resolved = fromEnvironment === undefined || fromEnvironment === '' ? fallback : Number(fromEnvironment);
  }
  if (typeof resolved === 'string' && resolved.trim() !== '') resolved = Number(resolved);
  if (resolved === Infinity) return Infinity;
  if (!Number.isSafeInteger(resolved) || resolved <= 0) {
    throw errors.configuration(`${name} must be a positive integer.`, { parameter: name });
  }
  return resolved;
}

function payloadTooLarge(label, { limit, observed, limitName }) {
  const option = LIMIT_OPTIONS[limitName];
  const variable = LIMIT_ENVIRONMENT[limitName];
  return new MoodlePayloadTooLargeError(
    `${label} exceeds the configured ${limit} byte limit. Raise it with ${option} or ${variable}.`,
    { limit, observed, limit_name: limitName, option, environment_variable: variable }
  );
}

export function assertContentLength(response, maximumBytes, label, limitName) {
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw payloadTooLarge(label, { limit: maximumBytes, observed: contentLength, limitName });
  }
}

export async function readLimitedResponse(response, maximumBytes, label, limitName = 'maximumResponseBytes') {
  assertContentLength(response, maximumBytes, label, limitName);
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximumBytes) {
        await reader.cancel();
        throw payloadTooLarge(label, { limit: maximumBytes, observed: size, limitName });
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, size);
}

export async function parseLimitedJsonResponse(response, maximumBytes, label, { errors = defaultErrorFactory, details = {} } = {}) {
  const data = await readLimitedResponse(response, maximumBytes, label);
  if (data.length === 0) return null;
  try {
    return JSON.parse(data.toString('utf8'));
  } catch (error) {
    throw errors.connection(`${label} was not valid JSON.`, { ...details, http_status: response.status }, error);
  }
}

export function assertResponseOrigin(response, expectedUrl, errors = defaultErrorFactory) {
  if (!response.url) return;
  let responseUrl;
  try {
    responseUrl = new URL(response.url);
  } catch {
    throw errors.connection('Moodle returned an invalid response URL.', {});
  }
  if (responseUrl.origin !== new URL(expectedUrl).origin) {
    throw errors.connection('Moodle redirected the request to another origin.', {});
  }
}

export function pathBelongsToRoot(candidatePath, rootPath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function resolveAllowedRoots(roots, errors) {
  const resolvedRoots = [];
  for (const root of roots) {
    try {
      resolvedRoots.push(await fs.promises.realpath(path.resolve(root)));
    } catch (error) {
      throw errors.configuration('An allowed file root does not exist.', { root }, error);
    }
  }
  return resolvedRoots;
}

/**
 * Normalizes an allowedFileRoots option: null keeps local files unrestricted,
 * an empty array disables local file access, and a list restricts it.
 */
export function normalizeAllowedFileRoots(allowedFileRoots, errors = defaultErrorFactory) {
  if (allowedFileRoots === null) return null;
  if (!Array.isArray(allowedFileRoots) || allowedFileRoots.some((root) => typeof root !== 'string' || !root)) {
    throw errors.configuration('allowedFileRoots must be null or an array of directories.', {
      parameter: 'allowedFileRoots'
    });
  }
  return allowedFileRoots.map((root) => path.resolve(root));
}

/**
 * Validates a local upload source without reading it into memory and returns
 * a Blob that streams the file when sent.
 */
export async function openUploadSource(filePath, {
  allowedFileRoots = [],
  maximumBytes = DEFAULT_LIMITS.maximumUploadBytes,
  siteMaximumBytes = null,
  errors = defaultErrorFactory
} = {}) {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw errors.validation('An upload file path is required.', { parameter: 'filePath' });
  }
  if (Array.isArray(allowedFileRoots) && allowedFileRoots.length === 0) {
    throw errors.permission('Local file access is disabled. Configure allowedFileRoots to enable uploads.', {});
  }
  const absolutePath = path.resolve(filePath);
  let pathStats;
  let realFilePath;
  try {
    pathStats = await fs.promises.lstat(absolutePath);
    realFilePath = await fs.promises.realpath(absolutePath);
  } catch (error) {
    throw errors.validation(`Unable to read upload file: ${absolutePath}`, {
      parameter: 'filePath',
      file_path: absolutePath
    }, error);
  }
  if (Array.isArray(allowedFileRoots)) {
    const roots = await resolveAllowedRoots(allowedFileRoots, errors);
    if (!roots.some((root) => pathBelongsToRoot(realFilePath, root))) {
      throw errors.permission('The upload source is outside the allowed file roots.', { file_path: absolutePath });
    }
    if (pathStats.isSymbolicLink()) {
      throw errors.permission('The upload source must be a regular file, not a symbolic link.', {
        file_path: absolutePath
      });
    }
  }
  const stats = await fs.promises.stat(realFilePath);
  if (!stats.isFile()) {
    throw errors.validation(`Unable to read upload file: ${absolutePath}`, {
      parameter: 'filePath',
      file_path: absolutePath,
      reason: 'not_a_regular_file'
    });
  }
  if (stats.size > maximumBytes) {
    throw payloadTooLarge('The upload source', {
      limit: maximumBytes,
      observed: stats.size,
      limitName: 'maximumUploadBytes'
    });
  }
  if (Number.isSafeInteger(siteMaximumBytes) && siteMaximumBytes > 0 && stats.size > siteMaximumBytes) {
    throw new MoodlePayloadTooLargeError(
      `The upload source exceeds the ${siteMaximumBytes} byte upload limit reported by the Moodle site.`,
      { limit: siteMaximumBytes, observed: stats.size, limit_name: 'siteMaximumUploadBytes' }
    );
  }
  const blob = await fs.openAsBlob(realFilePath);
  return { blob, size: stats.size, path: realFilePath, filename: path.basename(absolutePath) };
}

export function assertPlainFilename(filename, errors = defaultErrorFactory) {
  const resolved = String(filename ?? '').trim();
  if (!resolved || path.basename(resolved) !== resolved) {
    throw errors.validation('filename must be a plain file name.', { parameter: 'filename' });
  }
  return resolved;
}

export function assertDraftPath(filepath, errors = defaultErrorFactory) {
  const resolved = String(filepath || '/');
  if (!resolved.startsWith('/') || !resolved.endsWith('/') || resolved.includes('..')) {
    throw errors.validation('filepath must be an absolute Moodle file path.', { parameter: 'filepath' });
  }
  return resolved;
}

/**
 * Sends a file or in-memory data to webservice/upload.php. The token travels
 * in the multipart body so it never appears in server access logs.
 */
export async function postDraftUpload({
  baseUrl,
  token,
  body: fileBody,
  filename,
  filepath = '/',
  itemId = 0,
  timeoutMs = 0,
  fetchImplementation = globalThis.fetch,
  allowInsecure = false,
  maximumResponseBytes = DEFAULT_LIMITS.maximumResponseBytes,
  errors = defaultErrorFactory
}) {
  if (!Number.isInteger(itemId) || itemId < 0) {
    throw errors.validation('itemId must be a non-negative integer.', { parameter: 'itemId' });
  }
  const endpoint = resolveMoodleUrl(baseUrl, 'webservice/upload.php', { allowInsecure, errors });
  const form = new FormData();
  form.set('token', String(token));
  form.set('filepath', assertDraftPath(filepath, errors));
  form.set('itemid', String(itemId));
  form.set('file_1', fileBody, assertPlainFilename(filename, errors));
  const signal = timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined;
  let response;
  try {
    response = await fetchImplementation(endpoint, { method: 'POST', body: form, redirect: 'error', signal });
  } catch (error) {
    throw errors.connection(`Moodle draft upload failed: ${redactTextValues(error.message, [token])}`, {
      endpoint: 'webservice/upload.php'
    }, error);
  }
  assertResponseOrigin(response, endpoint, errors);
  const payload = await parseLimitedJsonResponse(response, maximumResponseBytes, 'Moodle draft upload response', {
    errors,
    details: { endpoint: 'webservice/upload.php' }
  });
  return { response, payload };
}

/**
 * Streams a download to a new file, enforcing the size limit while writing.
 * The destination is created exclusively; callers decide how to publish it.
 */
export async function streamResponseToFile(response, destinationPath, {
  maximumBytes = DEFAULT_LIMITS.maximumDownloadBytes,
  label = 'Moodle file download',
  hash = false
} = {}) {
  assertContentLength(response, maximumBytes, label, 'maximumDownloadBytes');
  const digest = hash ? createHash('sha256') : null;
  const handle = await fs.promises.open(destinationPath, 'wx', 0o600);
  let size = 0;
  try {
    if (response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > maximumBytes) {
            await reader.cancel();
            throw payloadTooLarge(label, { limit: maximumBytes, observed: size, limitName: 'maximumDownloadBytes' });
          }
          digest?.update(value);
          await handle.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    }
    await handle.close();
  } catch (error) {
    await handle.close().catch(() => {});
    await fs.promises.rm(destinationPath, { force: true });
    throw error;
  }
  return { size, sha256: digest ? digest.digest('hex') : null };
}

export async function resolveAllowedDestination(destinationPath, allowedFileRoots, errors = defaultErrorFactory) {
  const absoluteDestination = path.resolve(destinationPath);
  if (allowedFileRoots === null) return absoluteDestination;
  if (allowedFileRoots.length === 0) {
    throw errors.permission('Local file access is disabled. Configure allowedFileRoots to enable downloads.', {});
  }
  const roots = await resolveAllowedRoots(allowedFileRoots, errors);
  const rootIndex = allowedFileRoots.findIndex((root) => pathBelongsToRoot(absoluteDestination, path.resolve(root)));
  if (rootIndex < 0) {
    throw errors.permission('The download destination is outside the allowed file roots.', {
      destinationPath: absoluteDestination
    });
  }
  const lexicalRoot = path.resolve(allowedFileRoots[rootIndex]);
  const realRoot = roots[rootIndex];
  const relativeParent = path.relative(lexicalRoot, path.dirname(absoluteDestination));
  let currentParent = realRoot;
  for (const segment of relativeParent.split(path.sep).filter(Boolean)) {
    currentParent = path.join(currentParent, segment);
    let stats;
    try {
      stats = await fs.promises.lstat(currentParent);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      try {
        await fs.promises.mkdir(currentParent);
      } catch (mkdirError) {
        if (mkdirError.code !== 'EEXIST') throw mkdirError;
      }
      stats = await fs.promises.lstat(currentParent);
    }
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw errors.permission('The download path must not traverse symbolic links or non-directories.', {
        destinationPath: absoluteDestination
      });
    }
    const realCurrentParent = await fs.promises.realpath(currentParent);
    if (!pathBelongsToRoot(realCurrentParent, realRoot)) {
      throw errors.permission('The download destination resolves outside the allowed file roots.', {
        destinationPath: absoluteDestination
      });
    }
  }
  return path.join(currentParent, path.basename(absoluteDestination));
}

export function temporarySiblingPath(destinationPath, tag = 'moodle') {
  return path.join(path.dirname(destinationPath), `.${path.basename(destinationPath)}.${tag}-${randomUUID()}.tmp`);
}

/**
 * Default allowed roots for a command-line invocation: the working directory
 * plus the directory of every file the user named explicitly.
 */
export function commandLineFileRoots(explicitPaths = [], cwd = process.cwd()) {
  const roots = new Set([path.resolve(cwd)]);
  for (const entry of explicitPaths) {
    if (typeof entry === 'string' && entry.trim() !== '') roots.add(path.dirname(path.resolve(entry)));
  }
  return [...roots];
}
