import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_LIMITS,
  MoodleClientError,
  MoodlePayloadTooLargeError,
  assertResponseOrigin,
  collectSensitiveValues,
  normalizeAllowedFileRoots,
  normalizeClientError,
  openUploadSource,
  parseLimitedJsonResponse,
  postDraftUpload,
  redactSensitiveData,
  redactTextValues,
  resolveAllowedDestination,
  resolveByteLimit,
  resolveMoodleUrl as resolveKernelMoodleUrl,
  streamResponseToFile,
  temporarySiblingPath
} from './transport-kernel.mjs';

export { MoodleClientError, MoodlePayloadTooLargeError, normalizeClientError, redactSensitiveData };

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultContractPath = path.join(packageDirectory, 'contract', 'operations.json');
const dangerousOperations = new Set([
  'call_mobile_external_functions'
]);
const sensitiveOperationPattern = /(?:token|api_key|autologin_key)/i;
const destructiveOperationPattern = /(?:^|_)(?:delete|disable|remove|purge|reset|revoke|terminate|unenrol|uninstall)(?:_|$)/i;

export function redactOperationResult(operationName, value) {
  return redactSensitiveData(value, {
    redactEntireValue: sensitiveOperationPattern.test(operationName)
  });
}

export function isDestructiveOperation(operationName) {
  return destructiveOperationPattern.test(operationName);
}

function isDangerousOperation(operationName) {
  return dangerousOperations.has(operationName) || /^(?:admin_|behat_|xmldb_)/.test(operationName);
}

export class MoodleConfigurationError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('configuration_error', message, details, cause);
    this.name = 'MoodleConfigurationError';
  }
}

export class MoodleConnectionError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('connection_error', message, details, cause);
    this.name = 'MoodleConnectionError';
  }
}

export class MoodleAuthenticationError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('authentication_error', message, details, cause);
    this.name = 'MoodleAuthenticationError';
  }
}

export class MoodlePermissionError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('permission_error', message, details, cause);
    this.name = 'MoodlePermissionError';
  }
}

export class MoodleValidationError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('validation_error', message, details, cause);
    this.name = 'MoodleValidationError';
  }
}

export class MoodleUnsupportedVersionError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('unsupported_moodle_version', message, details, cause);
    this.name = 'MoodleUnsupportedVersionError';
  }
}

export class MoodleOperationUnavailableError extends MoodleClientError {
  constructor(message, details = {}, cause = null) {
    super('operation_unavailable', message, details, cause);
    this.name = 'MoodleOperationUnavailableError';
  }
}

export const coreErrors = Object.freeze({
  configuration: (message, details = {}, cause = null) => new MoodleConfigurationError(message, details, cause),
  validation: (message, details = {}, cause = null) => new MoodleValidationError(message, details, cause),
  permission: (message, details = {}, cause = null) => new MoodlePermissionError(message, details, cause),
  connection: (message, details = {}, cause = null) => new MoodleConnectionError(message, details, cause)
});

// Some Moodle write functions report a rejected change as a warning instead of an
// exception (for example core_course_update_courses with a shortname already in use).
function rejectMoodleWarnings(payload, label) {
  const warnings = Array.isArray(payload?.warnings) ? payload.warnings : [];
  if (warnings.length === 0) return;
  const summary = warnings.map((warning) => `${warning.warningcode ?? 'warning'}: ${warning.message ?? ''}`.trim()).join('; ');
  throw coreErrors.validation(`Moodle rejected ${label}: ${summary}`, { moodle_warnings: warnings });
}

export function loadContractFromFile(contractPath = defaultContractPath) {
  return JSON.parse(fs.readFileSync(contractPath, 'utf8').replace(/^﻿/, ''));
}

export function resolveMoodleUrl(baseUrl, relativePath, { allowInsecure = false } = {}) {
  return resolveKernelMoodleUrl(baseUrl, relativePath, { allowInsecure, errors: coreErrors });
}

/**
 * Response-size limit for one operation: an explicit contract limit, the bulk
 * class for export and bulk reads, or null for the transport default.
 */
export function operationResponseLimit(operation) {
  if (Number.isSafeInteger(operation?.limits?.maximumResponseBytes)) {
    return operation.limits.maximumResponseBytes;
  }
  return operation?.limits?.class === 'bulk' ? DEFAULT_LIMITS.maximumBulkResponseBytes : null;
}

function appendParameter(searchParameters, key, value) {
  if (value === undefined || value === null) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => appendParameter(searchParameters, `${key}[${index}]`, entry));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, entry]) => appendParameter(searchParameters, `${key}[${childKey}]`, entry));
    return;
  }
  searchParameters.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
}

export function encodeMoodleParameters(parameters = {}) {
  const searchParameters = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => appendParameter(searchParameters, key, value));
  return searchParameters;
}

function parseVersionParts(value) {
  const match = String(value ?? '').match(/(\d+)\.(\d+)/);
  if (!match) {
    throw new MoodleUnsupportedVersionError('Moodle returned an unrecognized version.', { detectedVersion: value ?? null });
  }
  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    branch: `${match[1]}.${match[2]}`
  };
}

export function parseMoodleVersion(value) {
  return parseVersionParts(value).branch;
}

function compareVersions(left, right) {
  const leftParts = parseVersionParts(left);
  const rightParts = parseVersionParts(right);
  return leftParts.major === rightParts.major
    ? leftParts.minor - rightParts.minor
    : leftParts.major - rightParts.major;
}

function mapMoodleError(payload, context, sensitiveValues = []) {
  const errorCode = String(payload?.errorcode ?? '');
  const details = {
    ...context,
    moodleErrorCode: errorCode || undefined,
    moodleException: payload?.exception,
    debuginfo: redactTextValues(payload?.debuginfo, sensitiveValues)
  };
  const message = redactTextValues(payload?.message, sensitiveValues) || 'Moodle rejected the request.';

  if (['invalidtoken', 'webservicetokeninvalid'].includes(errorCode)) {
    return new MoodleAuthenticationError(message, details);
  }
  if (errorCode.includes('access') || errorCode.includes('permission') || errorCode === 'nopermissions') {
    return new MoodlePermissionError(message, details);
  }
  if (errorCode === 'invalidparameter') {
    return new MoodleValidationError(message, details);
  }
  if (errorCode === 'accessexception' || payload?.exception === 'webservice_access_exception') {
    return new MoodleOperationUnavailableError(message, details);
  }
  return new MoodleClientError(errorCode || 'moodle_error', message, details);
}

export class RestTransport {
  constructor({
    baseUrl,
    token,
    timeoutMs = 30_000,
    fetchImplementation = globalThis.fetch,
    allowInsecure = false,
    allowedFileRoots = [],
    maximumResponseBytes,
    maximumUploadBytes,
    maximumDownloadBytes,
    environment = {}
  } = {}) {
    if (!baseUrl) {
      throw new MoodleConfigurationError('baseUrl is required.', { parameter: 'baseUrl' });
    }
    if (!token) {
      throw new MoodleConfigurationError('token is required.', { parameter: 'token' });
    }
    if (typeof fetchImplementation !== 'function') {
      throw new MoodleConfigurationError('A fetch implementation is required.', { parameter: 'fetchImplementation' });
    }
    if (typeof allowInsecure !== 'boolean') {
      throw new MoodleConfigurationError('allowInsecure must be a boolean.', { parameter: 'allowInsecure' });
    }
    this.baseUrl = resolveMoodleUrl(baseUrl, '.', { allowInsecure });
    this.endpoint = resolveMoodleUrl(baseUrl, 'webservice/rest/server.php', { allowInsecure });
    this.allowInsecure = allowInsecure;
    this.token = token;
    this.timeoutMs = timeoutMs;
    this.fetchImplementation = fetchImplementation;
    this.allowedFileRoots = normalizeAllowedFileRoots(allowedFileRoots, coreErrors);
    const limit = (value, name) => resolveByteLimit(value, {
      name,
      fallback: DEFAULT_LIMITS[name],
      environment,
      errors: coreErrors
    });
    this.maximumResponseBytes = limit(maximumResponseBytes, 'maximumResponseBytes');
    this.maximumUploadBytes = limit(maximumUploadBytes, 'maximumUploadBytes');
    this.maximumDownloadBytes = limit(maximumDownloadBytes, 'maximumDownloadBytes');
    this.explicitResponseLimit = maximumResponseBytes !== undefined
      || Boolean(environment?.MOODLE_MAX_RESPONSE_BYTES);
    this.siteMaximumUploadBytes = null;
  }

  responseLimit(requested) {
    if (!Number.isSafeInteger(requested)) return this.maximumResponseBytes;
    // A user-configured limit always wins; contract limits only raise the default.
    return this.explicitResponseLimit ? this.maximumResponseBytes : Math.max(requested, this.maximumResponseBytes);
  }

  async callFunction(functionName, parameters = {}, { maximumResponseBytes } = {}) {
    const body = encodeMoodleParameters(parameters);
    body.set('wstoken', this.token);
    body.set('wsfunction', functionName);
    body.set('moodlewsrestformat', 'json');

    let response;
    try {
      response = await this.fetchImplementation(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
        redirect: 'error',
        signal: AbortSignal.timeout(this.timeoutMs)
      });
    } catch (error) {
      throw new MoodleConnectionError('Unable to connect to Moodle.', { functionName }, error);
    }

    if (!response.ok) {
      throw new MoodleConnectionError(`Moodle returned HTTP ${response.status}.`, {
        functionName,
        status: response.status
      });
    }
    assertResponseOrigin(response, this.endpoint, coreErrors);

    const payload = await parseLimitedJsonResponse(response, this.responseLimit(maximumResponseBytes), 'Moodle response', {
      errors: coreErrors,
      details: { functionName }
    });
    if (payload && typeof payload === 'object' && (payload.exception || payload.errorcode)) {
      const sensitiveValues = collectSensitiveValues(parameters);
      sensitiveValues.add(String(this.token));
      throw mapMoodleError(payload, { functionName }, sensitiveValues);
    }
    return payload;
  }

  async uploadDraftFile({ filePath, itemId = 0, draftPath = '/', filename = null }) {
    const source = await openUploadSource(filePath, {
      allowedFileRoots: this.allowedFileRoots,
      maximumBytes: this.maximumUploadBytes,
      siteMaximumBytes: this.siteMaximumUploadBytes,
      errors: coreErrors
    });
    const { response, payload } = await postDraftUpload({
      baseUrl: this.baseUrl,
      token: this.token,
      body: source.blob,
      filename: filename ?? source.filename,
      filepath: draftPath,
      itemId,
      timeoutMs: this.timeoutMs,
      fetchImplementation: this.fetchImplementation,
      allowInsecure: this.allowInsecure,
      maximumResponseBytes: this.maximumResponseBytes,
      errors: coreErrors
    });
    if (payload && !Array.isArray(payload) && (payload.exception || payload.errorcode || payload.error)) {
      throw mapMoodleError(payload, { endpoint: 'webservice/upload.php' }, [String(this.token)]);
    }
    if (!response.ok) {
      throw new MoodleConnectionError(`Moodle returned HTTP ${response.status} while uploading a file.`, {
        status: response.status
      });
    }
    if (!Array.isArray(payload) || !payload[0]) {
      throw new MoodleConnectionError('Moodle returned an unexpected file upload response.');
    }
    return payload[0];
  }

  async downloadFile({ fileUrl, destinationPath, overwrite = false }) {
    let sourceUrl;
    try {
      sourceUrl = new URL(fileUrl);
    } catch (error) {
      throw new MoodleValidationError('file_url must be a valid URL.', { parameter: 'file_url' }, error);
    }
    if (sourceUrl.username || sourceUrl.password) {
      throw new MoodleValidationError('file_url must not contain credentials.', { parameter: 'file_url' });
    }
    if (sourceUrl.origin !== this.baseUrl.origin) {
      throw new MoodleValidationError('file_url must belong to the configured Moodle site.', {
        parameter: 'file_url',
        origin: sourceUrl.origin
      });
    }
    sourceUrl.hash = '';
    const pluginFilePrefix = `${this.baseUrl.pathname}pluginfile.php/`;
    const webServicePluginFilePrefix = `${this.baseUrl.pathname}webservice/pluginfile.php/`;
    if (sourceUrl.pathname.startsWith(pluginFilePrefix)) {
      sourceUrl.pathname = `${webServicePluginFilePrefix}${sourceUrl.pathname.slice(pluginFilePrefix.length)}`;
    }
    if (!sourceUrl.pathname.startsWith(webServicePluginFilePrefix)) {
      throw new MoodleValidationError('file_url must be a Moodle pluginfile URL.', { parameter: 'file_url' });
    }
    sourceUrl.searchParams.set('token', this.token);

    const resolvedDestination = await resolveAllowedDestination(destinationPath, this.allowedFileRoots, coreErrors);

    let response;
    try {
      response = await this.fetchImplementation(sourceUrl, {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(this.timeoutMs)
      });
    } catch (error) {
      throw new MoodleConnectionError('Unable to download the Moodle file.', {}, error);
    }
    if (!response.ok) {
      throw new MoodleConnectionError(`Moodle returned HTTP ${response.status} while downloading a file.`, {
        status: response.status
      });
    }
    assertResponseOrigin(response, sourceUrl, coreErrors);

    const temporaryPath = temporarySiblingPath(resolvedDestination, 'moodle-core');
    const { size } = await streamResponseToFile(response, temporaryPath, {
      maximumBytes: this.maximumDownloadBytes
    });

    let existingStats = null;
    try {
      existingStats = await fs.promises.lstat(resolvedDestination);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        await fs.promises.rm(temporaryPath, { force: true });
        throw error;
      }
    }
    if (existingStats?.isSymbolicLink()) {
      await fs.promises.rm(temporaryPath, { force: true });
      throw new MoodlePermissionError('The download destination must not be a symbolic link.', {
        destinationPath: resolvedDestination
      });
    }
    if (existingStats && !overwrite) {
      await fs.promises.rm(temporaryPath, { force: true });
      throw new MoodleValidationError('The download destination already exists.', {
        parameter: 'destination_path',
        destinationPath: resolvedDestination
      });
    }
    try {
      if (!overwrite) {
        await fs.promises.link(temporaryPath, resolvedDestination);
        await fs.promises.rm(temporaryPath);
      } else {
        if (existingStats) await fs.promises.rm(resolvedDestination);
        await fs.promises.rename(temporaryPath, resolvedDestination);
      }
    } catch (error) {
      await fs.promises.rm(temporaryPath, { force: true });
      if (!overwrite && error.code === 'EEXIST') {
        throw new MoodleValidationError('The download destination already exists.', {
          parameter: 'destination_path',
          destinationPath: resolvedDestination
        }, error);
      }
      throw error;
    }
    return {
      destinationPath: resolvedDestination,
      size,
      contentType: response.headers.get('content-type')
    };
  }
}

function operationByName(contract, operationName) {
  const operation = contract.operations?.find((entry) => entry.name === operationName);
  if (!operation) {
    throw new MoodleValidationError(`Unknown operation: ${operationName}.`, { operation: operationName });
  }
  return operation;
}

function coerceValue(value, definition, name) {
  if (value === undefined || value === null || value === '') {
    return value;
  }
  if (definition.type === 'integer') {
    if (!/^[+-]?\d+$/.test(String(value))) {
      throw new MoodleValidationError(`${name} must be an integer.`, { parameter: name });
    }
    return Number.parseInt(String(value), 10);
  }
  if (definition.type === 'number') {
    const result = Number(value);
    if (!Number.isFinite(result)) {
      throw new MoodleValidationError(`${name} must be a number.`, { parameter: name });
    }
    return result;
  }
  if (definition.type === 'boolean') {
    if (typeof value === 'boolean') return value;
    if (['true', '1'].includes(String(value).toLowerCase())) return true;
    if (['false', '0'].includes(String(value).toLowerCase())) return false;
    throw new MoodleValidationError(`${name} must be a boolean.`, { parameter: name });
  }
  if (definition.type === 'array') {
    const values = Array.isArray(value)
      ? value
      : String(value).trim().startsWith('[')
        ? JSON.parse(String(value))
        : String(value).split(',').map((entry) => entry.trim()).filter(Boolean);
    return values.map((entry) => coerceValue(entry, { type: definition.items ?? 'string' }, name));
  }
  if (definition.type === 'object') {
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(String(value));
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // The validation error below provides a stable public error.
    }
    throw new MoodleValidationError(`${name} must be an object or a JSON object.`, { parameter: name });
  }
  if (definition.type === 'object_array') {
    try {
      const parsed = Array.isArray(value) ? value : JSON.parse(String(value));
      if (Array.isArray(parsed) && parsed.every((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))) {
        return parsed;
      }
    } catch {
      // The validation error below provides a stable public error.
    }
    throw new MoodleValidationError(`${name} must be an array of objects or a JSON array of objects.`, { parameter: name });
  }
  return String(value);
}

export function buildContractParameters(operation, parameters = {}) {
  const result = {};
  const definitions = operation.parameters ?? {};
  for (const [name, definition] of Object.entries(definitions)) {
    const value = parameters[name];
    const missing = value === undefined || value === null || (value === '' && !definition.allowEmpty);
    if (missing && definition.required) {
      throw new MoodleValidationError(`Missing required parameter: ${name}.`, { operation: operation.name, parameter: name });
    }
    if (missing) continue;
    const coerced = coerceValue(value, definition, name);
    if (definition.enum && !definition.enum.includes(String(coerced))) {
      throw new MoodleValidationError(`${name} must be one of: ${definition.enum.join(', ')}.`, {
        parameter: name,
        allowedValues: definition.enum
      });
    }
    if (definition.minimum !== undefined && coerced < definition.minimum) {
      throw new MoodleValidationError(`${name} must be at least ${definition.minimum}.`, {
        parameter: name,
        minimum: definition.minimum
      });
    }
    if (definition.maximum !== undefined && coerced > definition.maximum) {
      throw new MoodleValidationError(`${name} must be at most ${definition.maximum}.`, {
        parameter: name,
        maximum: definition.maximum
      });
    }
    result[name] = coerced;
  }
  for (const name of Object.keys(parameters)) {
    if (!Object.hasOwn(definitions, name)) {
      throw new MoodleValidationError(`Unknown parameter: ${name}.`, { operation: operation.name, parameter: name });
    }
  }
  return result;
}

function normalizeRenderedSummary(value) {
  if (value === undefined || value === null) return null;
  const summary = String(value);
  return summary.match(/^<div class="no-overflow">([\s\S]*)<\/div>$/)?.[1] ?? summary;
}

function courseFromMoodle(course) {
  return {
    id: course.id,
    fullname: course.fullname,
    shortname: course.shortname,
    category_id: course.categoryid,
    idnumber: course.idnumber || null,
    summary: normalizeRenderedSummary(course.summary),
    summary_format: course.summaryformat ?? null,
    visible: Boolean(course.visible),
    start_date: course.startdate ?? null,
    end_date: course.enddate ?? null
  };
}

function categoryFromMoodle(category) {
  return {
    id: category.id,
    name: category.name,
    idnumber: category.idnumber || null,
    description: category.description ?? '',
    parent_id: category.parent,
    course_count: category.coursecount,
    visible: category.visible === undefined ? null : Boolean(category.visible)
  };
}

function enrolledUserOptions(input) {
  const options = [];
  if (input.group_id !== undefined) options.push({ name: 'groupid', value: input.group_id });
  if (input.only_active !== undefined) options.push({ name: 'onlyactive', value: input.only_active ? 1 : 0 });
  if (input.limit !== undefined) options.push({ name: 'limitnumber', value: input.limit });
  if (input.offset !== undefined) options.push({ name: 'limitfrom', value: input.offset });
  return options;
}

function cohortCategoryType(categoryId) {
  return categoryId === undefined
    ? { type: 'system', value: 0 }
    : { type: 'id', value: categoryId };
}

function moodleContextLevel(contextType) {
  return contextType === 'course_category' ? 'coursecat' : contextType;
}

function capabilityUserOptions(input) {
  const options = [];
  if (input.group_id !== undefined) options.push({ name: 'groupid', value: input.group_id });
  if (input.only_active !== undefined) options.push({ name: 'onlyactive', value: input.only_active ? 1 : 0 });
  if (input.limit !== undefined) options.push({ name: 'limitnumber', value: input.limit });
  if (input.offset !== undefined) options.push({ name: 'limitfrom', value: input.offset });
  return options;
}

function forumOptions(entries) {
  return Object.entries(entries)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => ({ name, value }));
}

function namedValues(values = {}) {
  return Object.entries(values).map(([name, value]) => ({ name, value }));
}

function searchFilters(filters = {}) {
  const names = {
    area_ids: 'areaids',
    course_ids: 'courseids',
    context_ids: 'contextids',
    category: 'cat',
    user_ids: 'userids',
    group_ids: 'groupids',
    only_my_courses: 'mycoursesonly',
    start_time: 'timestart',
    end_time: 'timeend'
  };
  return Object.fromEntries(
    Object.entries(filters).map(([name, value]) => [names[name] ?? name, value])
  );
}

function tagIndexParameters(input, includeTagId = false) {
  return {
    ...(includeTagId ? { id: input.tag_id ?? 0 } : {}),
    tag: input.tag ?? '',
    tc: input.collection_id ?? 0,
    ta: input.area_id ?? 0,
    excl: input.exclusive ?? false,
    from: input.source_context_id ?? 0,
    ctx: input.context_id ?? 0,
    rec: input.include_children ?? true,
    page: input.page ?? 0
  };
}

function xapiStateParameters(input, { includeStateId = false, includeState = false, includeSince = false } = {}) {
  return {
    component: input.component,
    activityId: input.activity_id,
    agent: JSON.stringify(input.agent),
    ...(includeStateId ? { stateId: input.state_id } : {}),
    ...(includeState ? { stateData: JSON.stringify(input.state) } : {}),
    ...(input.registration === undefined ? {} : { registration: input.registration }),
    ...(!includeSince || input.since === undefined ? {} : { since: input.since })
  };
}

function systemReportParameters(input, includePagination = false) {
  return {
    source: input.source,
    context: {
      contextlevel: input.context_type,
      instanceid: input.context_id
    },
    component: input.component ?? '',
    area: input.area ?? '',
    itemid: input.item_id ?? 0,
    parameters: namedValues(input.parameters),
    ...(includePagination ? {
      page: input.page ?? 0,
      perpage: input.page_size ?? 10
    } : {})
  };
}

function contractAdapter(operation) {
  const definitions = operation.parameters ?? {};
  return {
    request: (input) => Object.fromEntries(
      Object.entries(definitions)
        .map(([name, definition]) => [
          definition.moodleName ?? name,
          input[name] ?? definition.default
        ])
        .filter(([, value]) => value !== undefined)
    ),
    response: (payload) => payload
  };
}

function databaseFields(fields) {
  return Object.entries(fields).map(([fieldKey, value]) => {
    const [fieldId, ...subfieldParts] = fieldKey.split(':');
    return {
      fieldid: Number.parseInt(fieldId, 10),
      subfield: subfieldParts.join(':'),
      value: JSON.stringify(value)
    };
  });
}

const adapters = {
  get_site_info: {
    request: () => ({}),
    response: (payload) => ({
      site_name: payload.sitename,
      site_url: payload.siteurl,
      moodle_version: parseMoodleVersion(payload.release ?? payload.version),
      moodle_release: String(payload.release ?? payload.version),
      user_id: payload.userid,
      username: payload.username,
      full_name: payload.fullname
    })
  },
  get_courses: {
    request: (input) => input.course_ids ? { options: { ids: input.course_ids } } : {},
    response: (payload) => payload.map(courseFromMoodle)
  },
  get_course: {
    request: (input) => ({ field: 'id', value: input.course_id }),
    response: (payload, input) => {
      const course = payload?.courses?.[0];
      if (!course) throw new MoodleClientError('not_found', `Course ${input.course_id} was not found.`, { courseId: input.course_id });
      return courseFromMoodle(course);
    }
  },
  create_course: {
    request: (input) => ({ courses: [{ fullname: input.fullname, shortname: input.shortname, categoryid: input.category_id, idnumber: input.idnumber, summary: input.summary, visible: input.visible, startdate: input.start_date, enddate: input.end_date }] }),
    response: (payload) => ({ id: payload[0].id, shortname: payload[0].shortname })
  },
  update_course: {
    request: (input) => ({ courses: [{ id: input.course_id, fullname: input.fullname, shortname: input.shortname, categoryid: input.category_id, idnumber: input.idnumber, summary: input.summary, visible: input.visible, startdate: input.start_date, enddate: input.end_date }] }),
    response: (payload, input) => {
      rejectMoodleWarnings(payload, `the update of course ${input.course_id}`);
      return { updated: true, course_id: input.course_id };
    }
  },
  delete_course: {
    request: (input) => ({ courseids: [input.course_id] }),
    response: (payload, input) => ({ deleted: true, course_id: input.course_id, warnings: payload?.warnings ?? [] })
  },
  get_course_contents: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  get_users_by_field: {
    request: (input) => ({ field: input.field, values: input.values }),
    response: (payload) => payload
  },
  create_user: {
    request: (input) => ({ users: [input] }),
    response: (payload) => ({ id: payload[0].id, username: payload[0].username })
  },
  update_user: {
    request: (input) => ({ users: [{ ...input, id: input.user_id, user_id: undefined, suspended: input.suspended }] }),
    response: (payload, input) => {
      rejectMoodleWarnings(payload, `the update of user ${input.user_id}`);
      return { updated: true, user_id: input.user_id };
    }
  },
  delete_user: {
    request: (input) => ({ userids: [input.user_id] }),
    response: (_payload, input) => ({ deleted: true, user_id: input.user_id })
  },
  enrol_user: {
    request: (input) => ({ enrolments: [{ roleid: input.role_id, userid: input.user_id, courseid: input.course_id, timestart: input.start_time, timeend: input.end_time, suspend: input.suspended }] }),
    response: (_payload, input) => ({ enrolled: true, course_id: input.course_id, user_id: input.user_id, role_id: input.role_id })
  },
  unenrol_user: {
    request: (input) => ({ enrolments: [{ userid: input.user_id, courseid: input.course_id, roleid: input.role_id }] }),
    response: (_payload, input) => ({ unenrolled: true, course_id: input.course_id, user_id: input.user_id })
  },
  get_course_groups: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  create_group: {
    request: (input) => ({ groups: [{
      courseid: input.course_id,
      name: input.name,
      description: input.description ?? '',
      idnumber: input.idnumber,
      enrolmentkey: input.enrolment_key,
      visibility: input.visibility,
      participation: input.participation
    }] }),
    response: (payload) => ({ id: payload[0].id, name: payload[0].name })
  },
  delete_group: {
    request: (input) => ({ groupids: [input.group_id] }),
    response: (_payload, input) => ({ deleted: true, group_id: input.group_id })
  },
  add_group_member: {
    request: (input) => ({ members: [{ groupid: input.group_id, userid: input.user_id }] }),
    response: (_payload, input) => ({ added: true, group_id: input.group_id, user_id: input.user_id })
  },
  remove_group_member: {
    request: (input) => ({ members: [{ groupid: input.group_id, userid: input.user_id }] }),
    response: (_payload, input) => ({ removed: true, group_id: input.group_id, user_id: input.user_id })
  },
  get_course_categories: {
    request: (input) => ({
      criteria: input.parent_id === undefined ? [] : [{ key: 'parent', value: input.parent_id }],
      addsubcategories: input.include_subcategories ?? true
    }),
    response: (payload) => payload.map(categoryFromMoodle)
  },
  get_course_category: {
    request: (input) => ({ criteria: [{ key: 'id', value: input.category_id }], addsubcategories: false }),
    response: (payload, input) => {
      if (!payload[0]) {
        throw new MoodleClientError('not_found', `Course category ${input.category_id} was not found.`, {
          categoryId: input.category_id
        });
      }
      return categoryFromMoodle(payload[0]);
    }
  },
  get_enrolled_users: {
    request: (input) => ({ courseid: input.course_id, options: enrolledUserOptions(input) }),
    response: (payload) => payload
  },
  get_cohorts: {
    request: (input) => ({ cohortids: input.cohort_ids ?? [] }),
    response: (payload) => payload
  },
  get_group_members: {
    request: (input) => ({ groupids: [input.group_id] }),
    response: (payload, input) => ({
      group_id: input.group_id,
      user_ids: payload.find((entry) => entry.groupid === input.group_id)?.userids ?? []
    })
  },
  get_course_groupings: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  get_activity_completion_statuses: {
    request: (input) => ({ courseid: input.course_id, userid: input.user_id }),
    response: (payload) => payload
  },
  get_course_completion_status: {
    request: (input) => ({ courseid: input.course_id, userid: input.user_id }),
    response: (payload) => payload
  },
  get_calendar_events: {
    request: (input) => ({
      events: {
        eventids: input.event_ids ?? [],
        courseids: input.course_ids ?? [],
        groupids: input.group_ids ?? [],
        categoryids: input.category_ids ?? []
      },
      options: {
        userevents: input.include_user_events ?? true,
        siteevents: input.include_site_events ?? true,
        timestart: input.time_from ?? 0,
        timeend: input.time_to ?? 0,
        ignorehidden: input.ignore_hidden ?? true
      }
    }),
    response: (payload) => payload
  },
  get_grade_items: {
    request: (input) => ({
      courseid: input.course_id,
      userid: input.user_id ?? 0,
      groupid: input.group_id ?? 0
    }),
    response: (payload) => payload
  },
  create_course_category: {
    request: (input) => ({ categories: [{
      name: input.name,
      parent: input.parent_id ?? 0,
      idnumber: input.idnumber,
      description: input.description,
      theme: input.theme
    }] }),
    response: (payload) => ({ id: payload[0].id, name: payload[0].name })
  },
  update_course_category: {
    request: (input) => ({ categories: [{
      id: input.category_id,
      name: input.name,
      parent: input.parent_id,
      idnumber: input.idnumber,
      description: input.description,
      theme: input.theme
    }] }),
    response: (_payload, input) => ({ updated: true, category_id: input.category_id })
  },
  delete_course_category: {
    request: (input) => ({ categories: [{
      id: input.category_id,
      newparent: input.new_parent_id,
      recursive: input.recursive ?? false
    }] }),
    response: (payload, input) => ({
      deleted: true,
      category_id: input.category_id,
      warnings: payload?.warnings ?? payload ?? []
    })
  },
  get_group: {
    request: (input) => ({ groupids: [input.group_id] }),
    response: (payload, input) => {
      if (!payload[0]) {
        throw new MoodleClientError('not_found', `Group ${input.group_id} was not found.`, { groupId: input.group_id });
      }
      return payload[0];
    }
  },
  update_group: {
    request: (input) => ({ groups: [{
      id: input.group_id,
      name: input.name,
      description: input.description,
      idnumber: input.idnumber,
      enrolmentkey: input.enrolment_key,
      visibility: input.visibility,
      participation: input.participation
    }] }),
    response: (_payload, input) => ({ updated: true, group_id: input.group_id })
  },
  create_grouping: {
    request: (input) => ({ groupings: [{
      courseid: input.course_id,
      name: input.name,
      description: input.description ?? '',
      idnumber: input.idnumber ?? ''
    }] }),
    response: (payload) => ({ id: payload[0].id, name: payload[0].name })
  },
  get_grouping: {
    request: (input) => ({ groupingids: [input.grouping_id], returngroups: input.include_groups ?? false }),
    response: (payload, input) => {
      if (!payload[0]) {
        throw new MoodleClientError('not_found', `Grouping ${input.grouping_id} was not found.`, {
          groupingId: input.grouping_id
        });
      }
      return payload[0];
    }
  },
  update_grouping: {
    request: (input) => ({ groupings: [{
      id: input.grouping_id,
      name: input.name,
      description: input.description ?? '',
      idnumber: input.idnumber ?? ''
    }] }),
    response: (_payload, input) => ({ updated: true, grouping_id: input.grouping_id })
  },
  delete_grouping: {
    request: (input) => ({ groupingids: [input.grouping_id] }),
    response: (_payload, input) => ({ deleted: true, grouping_id: input.grouping_id })
  },
  add_group_to_grouping: {
    request: (input) => ({ assignments: [{ groupingid: input.grouping_id, groupid: input.group_id }] }),
    response: (_payload, input) => ({ added: true, grouping_id: input.grouping_id, group_id: input.group_id })
  },
  remove_group_from_grouping: {
    request: (input) => ({ unassignments: [{ groupingid: input.grouping_id, groupid: input.group_id }] }),
    response: (_payload, input) => ({ removed: true, grouping_id: input.grouping_id, group_id: input.group_id })
  },
  create_cohort: {
    request: (input) => ({ cohorts: [{
      categorytype: cohortCategoryType(input.category_id),
      name: input.name,
      idnumber: input.idnumber,
      description: input.description,
      visible: input.visible
    }] }),
    response: (payload) => ({ id: payload[0].id, name: payload[0].name })
  },
  update_cohort: {
    request: (input) => ({ cohorts: [{
      id: input.cohort_id,
      categorytype: cohortCategoryType(input.category_id),
      name: input.name,
      idnumber: input.idnumber,
      description: input.description,
      visible: input.visible
    }] }),
    response: (_payload, input) => ({ updated: true, cohort_id: input.cohort_id })
  },
  delete_cohort: {
    request: (input) => ({ cohortids: [input.cohort_id] }),
    response: (_payload, input) => ({ deleted: true, cohort_id: input.cohort_id })
  },
  get_cohort_members: {
    request: (input) => ({ cohortids: [input.cohort_id] }),
    response: (payload, input) => ({
      cohort_id: input.cohort_id,
      user_ids: payload.find((entry) => entry.cohortid === input.cohort_id)?.userids ?? []
    })
  },
  search_cohorts: {
    request: (input) => ({
      query: input.query,
      context: { contextid: input.context_id },
      includes: input.include_contexts ?? 'parents',
      limitfrom: input.offset ?? 0,
      limitnum: input.limit ?? 25
    }),
    response: (payload) => payload
  },
  add_cohort_member: {
    request: (input) => ({ members: [{
      cohorttype: { type: 'id', value: input.cohort_id },
      usertype: { type: 'id', value: input.user_id }
    }] }),
    response: (payload, input) => ({
      added: true,
      cohort_id: input.cohort_id,
      user_id: input.user_id,
      warnings: payload ?? []
    })
  },
  remove_cohort_member: {
    request: (input) => ({ members: [{ cohortid: input.cohort_id, userid: input.user_id }] }),
    response: (_payload, input) => ({ removed: true, cohort_id: input.cohort_id, user_id: input.user_id })
  },
  assign_role: {
    request: (input) => ({ assignments: [{
      roleid: input.role_id,
      userid: input.user_id,
      contextlevel: moodleContextLevel(input.context_type),
      instanceid: input.instance_id
    }] }),
    response: (_payload, input) => ({ assigned: true, role_id: input.role_id, user_id: input.user_id })
  },
  unassign_role: {
    request: (input) => ({ unassignments: [{
      roleid: input.role_id,
      userid: input.user_id,
      contextlevel: moodleContextLevel(input.context_type),
      instanceid: input.instance_id
    }] }),
    response: (_payload, input) => ({ unassigned: true, role_id: input.role_id, user_id: input.user_id })
  },
  get_user_courses: {
    request: (input) => ({
      userid: input.user_id,
      returnusercount: input.include_user_count ?? false
    }),
    response: (payload) => payload
  },
  get_course_enrolment_methods: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  get_enrolled_users_with_capability: {
    request: (input) => ({
      coursecapabilities: [{ courseid: input.course_id, capabilities: input.capabilities }],
      options: capabilityUserOptions(input)
    }),
    response: (payload) => payload
  },
  search_enrolled_users: {
    request: (input) => ({
      courseid: input.course_id,
      search: input.query,
      searchanywhere: input.match_anywhere ?? true,
      page: input.page ?? 0,
      perpage: input.page_size ?? 25,
      contextid: input.context_id
    }),
    response: (payload) => payload
  },
  get_potential_enrolment_users: {
    request: (input) => ({
      courseid: input.course_id,
      enrolid: input.enrolment_id,
      search: input.query ?? '',
      searchanywhere: input.match_anywhere ?? true,
      page: input.page ?? 0,
      perpage: input.page_size ?? 25
    }),
    response: (payload) => payload
  },
  get_self_enrolment_info: {
    request: (input) => ({ instanceid: input.enrolment_id }),
    response: (payload) => payload
  },
  self_enrol: {
    request: (input) => ({
      courseid: input.course_id,
      password: input.enrolment_key ?? '',
      instanceid: input.enrolment_id ?? 0
    }),
    response: (payload) => payload
  },
  update_user_enrolment: {
    request: (input) => {
      const formData = new URLSearchParams({
        ue: String(input.enrolment_id),
        status: input.status === 'suspended' ? '1' : '0'
      });
      if (input.start_time !== undefined) formData.set('timestart', String(input.start_time));
      if (input.end_time !== undefined) formData.set('timeend', String(input.end_time));
      return { formdata: formData.toString() };
    },
    response: (payload) => payload
  },
  delete_user_enrolment: {
    request: (input) => ({ ueid: input.enrolment_id }),
    response: (payload) => payload
  },
  get_grades_table: {
    request: (input) => ({
      courseid: input.course_id,
      userid: input.user_id ?? 0,
      groupid: input.group_id ?? 0
    }),
    response: (payload) => payload
  },
  get_user_course_grades: {
    request: (input) => ({ userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  get_grade_access_information: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  get_gradebook_items: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  get_grade_tree: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => typeof payload === 'string' ? JSON.parse(payload) : payload
  },
  get_gradable_users: {
    request: (input) => ({
      courseid: input.course_id,
      groupid: input.group_id ?? 0,
      onlyactive: input.only_active ?? false
    }),
    response: (payload) => payload
  },
  get_grade_feedback: {
    request: (input) => ({
      courseid: input.course_id,
      userid: input.user_id,
      itemid: input.grade_item_id
    }),
    response: (payload) => payload
  },
  create_grade_category: {
    request: (input) => ({
      courseid: input.course_id,
      categories: [{
        fullname: input.name,
        options: {
          aggregation: input.aggregation,
          droplow: input.drop_low,
          idnumber: input.idnumber,
          grademax: input.grade_max,
          grademin: input.grade_min,
          gradepass: input.grade_pass,
          parentcategoryid: input.parent_category_id
        }
      }]
    }),
    response: (payload) => payload
  },
  update_grade_value: {
    request: (input) => ({
      source: input.source,
      courseid: input.course_id,
      component: input.component,
      activityid: input.activity_id,
      itemnumber: input.item_number ?? 0,
      grades: [{
        studentid: input.user_id,
        grade: input.grade,
        str_feedback: input.feedback
      }]
    }),
    response: (payload) => ({ status: payload })
  },
  set_activity_completion_status: {
    request: (input) => ({ cmid: input.module_id, completed: input.completed }),
    response: (payload) => payload
  },
  override_activity_completion_status: {
    request: (input) => ({ userid: input.user_id, cmid: input.module_id, newstate: input.state }),
    response: (payload) => payload
  },
  mark_course_self_completed: {
    request: (input) => ({ courseid: input.course_id }),
    response: (payload) => payload
  },
  upload_draft_file: {
    execute: async (transport, input) => {
      const payload = await transport.uploadDraftFile({
        filePath: input.file_path,
        itemId: input.item_id ?? 0,
        draftPath: input.draft_path ?? '/',
        filename: input.filename ?? null
      });
      return {
        component: payload.component,
        context_id: payload.contextid,
        user_id: Number(payload.userid),
        file_area: payload.filearea,
        filename: payload.filename,
        file_path: payload.filepath,
        item_id: payload.itemid
      };
    }
  },
  download_file: {
    execute: async (transport, input) => {
      const payload = await transport.downloadFile({
        fileUrl: input.file_url,
        destinationPath: input.destination_path,
        overwrite: input.overwrite ?? false
      });
      return {
        destination_path: payload.destinationPath,
        size: payload.size,
        content_type: payload.contentType
      };
    }
  },
  get_course_assignments: {
    request: (input) => ({
      courseids: input.course_ids ?? [],
      capabilities: input.capabilities ?? [],
      includenotenrolledcourses: input.include_visible_not_enrolled ?? false
    }),
    response: (payload) => payload
  },
  get_assignment_submissions: {
    request: (input) => ({
      assignmentids: input.assignment_ids,
      status: input.status ?? '',
      since: input.modified_since ?? 0,
      before: input.modified_before ?? 0
    }),
    response: (payload) => payload
  },
  get_assignment_grades: {
    request: (input) => ({ assignmentids: input.assignment_ids, since: input.modified_since ?? 0 }),
    response: (payload) => payload
  },
  get_assignment_submission_status: {
    request: (input) => ({
      assignid: input.assignment_id,
      userid: input.user_id ?? 0,
      groupid: input.group_id ?? 0
    }),
    response: (payload) => payload
  },
  get_assignment_participants: {
    request: (input) => ({
      assignid: input.assignment_id,
      groupid: input.group_id ?? 0,
      filter: input.query ?? '',
      skip: input.offset ?? 0,
      limit: input.limit ?? 0,
      onlyids: input.only_ids ?? false,
      includeenrolments: true,
      tablesort: false,
      marking: false
    }),
    response: (payload) => payload
  },
  get_assignment_participant: {
    request: (input) => ({
      assignid: input.assignment_id,
      userid: input.user_id,
      embeduser: input.include_user ?? false
    }),
    response: (payload) => payload
  },
  start_assignment_submission: {
    request: (input) => ({ assignid: input.assignment_id }),
    response: (payload) => payload
  },
  save_assignment_submission: {
    request: (input) => {
      const pluginData = {};
      if (input.online_text !== undefined) {
        pluginData.onlinetext_editor = {
          text: input.online_text,
          format: input.online_text_format ?? 1,
          itemid: input.online_text_item_id ?? 0
        };
      }
      if (input.file_draft_item_id !== undefined) {
        pluginData.files_filemanager = input.file_draft_item_id;
      }
      return { assignmentid: input.assignment_id, plugindata: pluginData };
    },
    response: (payload) => payload
  },
  submit_assignment_for_grading: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      acceptsubmissionstatement: input.accept_submission_statement ?? false
    }),
    response: (payload) => payload
  },
  save_assignment_grade: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      userid: input.user_id,
      grade: input.grade,
      attemptnumber: input.attempt_number ?? -1,
      addattempt: input.add_attempt ?? false,
      workflowstate: input.workflow_state ?? '',
      applytoall: input.apply_to_all ?? false,
      plugindata: input.feedback_text === undefined ? {} : {
        assignfeedbackcomments_editor: { text: input.feedback_text, format: 1 }
      },
      advancedgradingdata: {}
    }),
    response: (_payload, input) => ({
      saved: true,
      assignment_id: input.assignment_id,
      user_id: input.user_id
    })
  },
  set_assignment_user_flags: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      userflags: [{
        userid: input.user_id,
        locked: input.locked,
        extensionduedate: input.extension_due_date,
        workflowstate: input.workflow_state,
        allocatedmarker: input.allocated_marker_id
      }]
    }),
    response: (payload) => payload
  },
  get_assignment_user_flags: {
    request: (input) => ({ assignmentids: input.assignment_ids }),
    response: (payload) => payload
  },
  get_assignment_user_mappings: {
    request: (input) => ({ assignmentids: input.assignment_ids }),
    response: (payload) => payload
  },
  lock_assignment_submissions: {
    request: (input) => ({ assignmentid: input.assignment_id, userids: input.user_ids }),
    response: (payload) => payload
  },
  unlock_assignment_submissions: {
    request: (input) => ({ assignmentid: input.assignment_id, userids: input.user_ids }),
    response: (payload) => payload
  },
  revert_assignment_submissions_to_draft: {
    request: (input) => ({ assignmentid: input.assignment_id, userids: input.user_ids }),
    response: (payload) => payload
  },
  set_assignment_extension: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      userids: [input.user_id],
      dates: [input.extension_due_date]
    }),
    response: (payload) => payload
  },
  reveal_assignment_identities: {
    request: (input) => ({ assignmentid: input.assignment_id }),
    response: (payload) => payload
  },
  copy_previous_assignment_attempt: {
    request: (input) => ({ assignmentid: input.assignment_id }),
    response: (payload) => payload
  },
  remove_assignment_submission: {
    request: (input) => ({ assignid: input.assignment_id, userid: input.user_id }),
    response: (payload) => payload
  },
  view_assignment: {
    request: (input) => ({ assignid: input.assignment_id }),
    response: (payload) => payload
  },
  view_assignment_submission_status: {
    request: (input) => ({ assignid: input.assignment_id }),
    response: (payload) => payload
  },
  view_assignment_grading_table: {
    request: (input) => ({ assignid: input.assignment_id }),
    response: (payload) => payload
  },
  get_course_forums: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_forum_discussions: {
    request: (input) => ({
      forumid: input.forum_id,
      sortorder: input.sort_order ?? -1,
      page: input.page ?? -1,
      perpage: input.page_size ?? 0,
      groupid: input.group_id ?? 0
    }),
    response: (payload) => payload
  },
  get_forum_discussion_posts: {
    request: (input) => ({
      discussionid: input.discussion_id,
      sortby: input.sort_by ?? 'created',
      sortdirection: input.sort_direction ?? 'DESC',
      includeinlineattachments: input.include_inline_attachments ?? false
    }),
    response: (payload) => payload
  },
  get_forum_post: {
    request: (input) => ({ postid: input.post_id }),
    response: (payload) => payload
  },
  get_forum_posts_by_user: {
    request: (input) => ({
      userid: input.user_id,
      cmid: input.module_id,
      sortby: input.sort_by ?? 'created',
      sortdirection: input.sort_direction ?? 'DESC'
    }),
    response: (payload) => payload
  },
  get_forum_access_information: {
    request: (input) => ({ forumid: input.forum_id }),
    response: (payload) => payload
  },
  can_add_forum_discussion: {
    request: (input) => ({ forumid: input.forum_id, groupid: input.group_id ?? -1 }),
    response: (payload) => payload
  },
  create_forum_discussion: {
    request: (input) => ({
      forumid: input.forum_id,
      subject: input.subject,
      message: input.message,
      groupid: input.group_id ?? 0,
      options: forumOptions({
        discussionsubscribe: input.subscribe,
        discussionpinned: input.pinned,
        inlineattachmentsid: input.inline_draft_item_id,
        attachmentsid: input.attachment_draft_item_id
      })
    }),
    response: (payload) => payload
  },
  reply_to_forum_post: {
    request: (input) => ({
      postid: input.post_id,
      subject: input.subject,
      message: input.message,
      options: forumOptions({
        discussionsubscribe: input.subscribe,
        private: input.private_reply,
        inlineattachmentsid: input.inline_draft_item_id,
        attachmentsid: input.attachment_draft_item_id
      }),
      messageformat: input.message_format ?? 1
    }),
    response: (payload) => payload
  },
  update_forum_post: {
    request: (input) => ({
      postid: input.post_id,
      subject: input.subject ?? '',
      message: input.message ?? '',
      messageformat: input.message_format ?? 1,
      options: forumOptions({
        pinned: input.pinned,
        discussionsubscribe: input.subscribe,
        inlineattachmentsid: input.inline_draft_item_id,
        attachmentsid: input.attachment_draft_item_id
      })
    }),
    response: (payload) => payload
  },
  delete_forum_post: {
    request: (input) => ({ postid: input.post_id }),
    response: (payload) => payload
  },
  prepare_forum_post_draft: {
    request: (input) => ({
      postid: input.post_id,
      area: input.area,
      draftitemid: input.draft_item_id ?? 0,
      filestokeep: []
    }),
    response: (payload) => payload
  },
  set_forum_subscription: {
    request: (input) => ({ forumid: input.forum_id, targetstate: input.subscribed }),
    response: (payload) => payload
  },
  set_forum_tracking: {
    request: (input) => ({ forumid: input.forum_id, targetstate: input.tracked }),
    response: (payload) => payload
  },
  set_forum_discussion_subscription: {
    request: (input) => ({
      forumid: input.forum_id,
      discussionid: input.discussion_id,
      targetstate: input.subscribed
    }),
    response: (payload) => payload
  },
  set_forum_discussion_favourite: {
    request: (input) => ({ discussionid: input.discussion_id, targetstate: input.favourite }),
    response: (payload) => payload
  },
  set_forum_discussion_pin: {
    request: (input) => ({ discussionid: input.discussion_id, targetstate: input.pinned ? 1 : 0 }),
    response: (payload) => payload
  },
  set_forum_discussion_lock: {
    request: (input) => ({
      forumid: input.forum_id,
      discussionid: input.discussion_id,
      targetstate: input.locked ? Math.floor(Date.now() / 1000) : 0
    }),
    response: (payload) => payload
  },
  mark_forum_posts_read: {
    request: (input) => ({ postids: input.post_ids, discussionid: input.discussion_id }),
    response: (payload) => payload
  },
  view_forum: {
    request: (input) => ({ forumid: input.forum_id }),
    response: (payload) => payload
  },
  view_forum_discussion: {
    request: (input) => ({ discussionid: input.discussion_id }),
    response: (payload) => payload
  },
  get_course_quizzes: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_user_quiz_attempts: {
    request: (input) => ({
      quizid: input.quiz_id,
      userid: input.user_id ?? 0,
      status: input.status ?? 'finished',
      includepreviews: input.include_previews ?? false
    }),
    response: (payload) => payload
  },
  get_user_quiz_best_grade: {
    request: (input) => ({ quizid: input.quiz_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  get_quiz_review_options: {
    request: (input) => ({ quizid: input.quiz_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  start_quiz_attempt: {
    request: (input) => ({
      quizid: input.quiz_id,
      preflightdata: namedValues(input.preflight_data),
      forcenew: input.force_new ?? false
    }),
    response: (payload) => payload
  },
  get_quiz_attempt_data: {
    request: (input) => ({
      attemptid: input.attempt_id,
      page: input.page,
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  get_quiz_attempt_summary: {
    request: (input) => ({
      attemptid: input.attempt_id,
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  save_quiz_attempt: {
    request: (input) => ({
      attemptid: input.attempt_id,
      data: namedValues(input.responses),
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  process_quiz_attempt: {
    request: (input) => ({
      attemptid: input.attempt_id,
      data: namedValues(input.responses),
      finishattempt: input.finish ?? false,
      timeup: input.time_up ?? false,
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  get_quiz_attempt_review: {
    request: (input) => ({ attemptid: input.attempt_id, page: input.page ?? -1 }),
    response: (payload) => payload
  },
  get_quiz_feedback_for_grade: {
    request: (input) => ({ quizid: input.quiz_id, grade: input.grade }),
    response: (payload) => payload
  },
  get_quiz_access_information: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  get_quiz_attempt_access_information: {
    request: (input) => ({ quizid: input.quiz_id, attemptid: input.attempt_id ?? 0 }),
    response: (payload) => payload
  },
  get_quiz_required_question_types: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  view_quiz: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  view_quiz_attempt: {
    request: (input) => ({
      attemptid: input.attempt_id,
      page: input.page,
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  view_quiz_attempt_summary: {
    request: (input) => ({
      attemptid: input.attempt_id,
      preflightdata: namedValues(input.preflight_data)
    }),
    response: (payload) => payload
  },
  view_quiz_attempt_review: {
    request: (input) => ({ attemptid: input.attempt_id }),
    response: (payload) => payload
  },
  get_course_books: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_book: {
    request: (input) => ({ bookid: input.book_id, chapterid: input.chapter_id ?? 0 }),
    response: (payload) => payload
  },
  get_course_folders: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_folder: {
    request: (input) => ({ folderid: input.folder_id }),
    response: (payload) => payload
  },
  get_course_imscp_packages: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_imscp_package: {
    request: (input) => ({ imscpid: input.imscp_id }),
    response: (payload) => payload
  },
  get_course_labels: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_course_pages: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_page: {
    request: (input) => ({ pageid: input.page_id }),
    response: (payload) => payload
  },
  get_course_resources: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_resource: {
    request: (input) => ({ resourceid: input.resource_id }),
    response: (payload) => payload
  },
  get_course_urls: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  view_url: {
    request: (input) => ({ urlid: input.url_id }),
    response: (payload) => payload
  },
  get_course_choices: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_choice_options: {
    request: (input) => ({ choiceid: input.choice_id }),
    response: (payload) => payload
  },
  get_choice_results: {
    request: (input) => ({
      choiceid: input.choice_id,
      ...(input.group_id === undefined ? {} : { groupid: input.group_id })
    }),
    response: (payload) => payload
  },
  submit_choice_response: {
    request: (input) => ({ choiceid: input.choice_id, responses: input.option_ids }),
    response: (payload) => payload
  },
  delete_choice_responses: {
    request: (input) => ({ choiceid: input.choice_id, responses: input.response_ids ?? [] }),
    response: (payload) => payload
  },
  view_choice: {
    request: (input) => ({ choiceid: input.choice_id }),
    response: (payload) => payload
  },
  get_course_scorm_packages: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_scorm_attempt_count: {
    request: (input) => ({
      scormid: input.scorm_id,
      userid: input.user_id,
      ignoremissingcompletion: input.ignore_incomplete ?? false
    }),
    response: (payload) => payload
  },
  get_scorm_contents: {
    request: (input) => ({ scormid: input.scorm_id, organization: input.organization ?? '' }),
    response: (payload) => payload
  },
  get_scorm_user_data: {
    request: (input) => ({ scormid: input.scorm_id, attempt: input.attempt }),
    response: (payload) => payload
  },
  save_scorm_tracks: {
    request: (input) => ({
      scoid: input.sco_id,
      attempt: input.attempt,
      tracks: Object.entries(input.tracks).map(([element, value]) => ({ element, value }))
    }),
    response: (payload) => payload
  },
  get_scorm_tracks: {
    request: (input) => ({
      scoid: input.sco_id,
      userid: input.user_id,
      attempt: input.attempt ?? 0
    }),
    response: (payload) => payload
  },
  launch_scorm_content: {
    request: (input) => ({ scormid: input.scorm_id, scoid: input.sco_id ?? 0 }),
    response: (payload) => payload
  },
  get_scorm_access_information: {
    request: (input) => ({ scormid: input.scorm_id }),
    response: (payload) => payload
  },
  view_scorm: {
    request: (input) => ({ scormid: input.scorm_id }),
    response: (payload) => payload
  },
  get_course_wikis: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_wiki_subwikis: {
    request: (input) => ({ wikiid: input.wiki_id }),
    response: (payload) => payload
  },
  get_wiki_pages: {
    request: (input) => ({
      wikiid: input.wiki_id,
      groupid: input.group_id ?? -1,
      userid: input.user_id ?? 0,
      options: {
        sortby: input.sort_by ?? 'title',
        sortdirection: input.sort_direction ?? 'ASC',
        includecontent: input.include_content === false ? 0 : 1
      }
    }),
    response: (payload) => payload
  },
  get_wiki_files: {
    request: (input) => ({
      wikiid: input.wiki_id,
      groupid: input.group_id ?? -1,
      userid: input.user_id ?? 0
    }),
    response: (payload) => payload
  },
  get_wiki_page: {
    request: (input) => ({ pageid: input.page_id }),
    response: (payload) => payload
  },
  get_wiki_page_for_editing: {
    request: (input) => ({
      pageid: input.page_id,
      ...(input.section === undefined ? {} : { section: input.section }),
      lockonly: input.lock_only ?? false
    }),
    response: (payload) => payload
  },
  create_wiki_page: {
    request: (input) => ({
      title: input.title,
      content: input.content,
      ...(input.content_format === undefined ? {} : { contentformat: input.content_format }),
      ...(input.subwiki_id === undefined ? {} : { subwikiid: input.subwiki_id }),
      ...(input.wiki_id === undefined ? {} : { wikiid: input.wiki_id }),
      ...(input.user_id === undefined ? {} : { userid: input.user_id }),
      ...(input.group_id === undefined ? {} : { groupid: input.group_id })
    }),
    response: (payload) => payload
  },
  update_wiki_page: {
    request: (input) => ({
      pageid: input.page_id,
      content: input.content,
      ...(input.section === undefined ? {} : { section: input.section })
    }),
    response: (payload) => payload
  },
  view_wiki: {
    request: (input) => ({ wikiid: input.wiki_id }),
    response: (payload) => payload
  },
  view_wiki_page: {
    request: (input) => ({ pageid: input.page_id }),
    response: (payload) => payload
  },
  get_course_feedbacks: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_feedback_access_information: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_feedback_temporary_completion: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_feedback_items: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  launch_feedback: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_feedback_page: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      page: input.page,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  submit_feedback_page: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      page: input.page,
      responses: namedValues(input.responses),
      goprevious: input.go_previous ?? false,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  get_feedback_analysis: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      groupid: input.group_id ?? 0,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  get_unfinished_feedback_responses: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_finished_feedback_responses: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_feedback_non_respondents: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      groupid: input.group_id ?? 0,
      sort: input.sort_by ?? 'lastaccess',
      page: input.page ?? 0,
      perpage: input.page_size ?? 0,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  get_feedback_responses_analysis: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      groupid: input.group_id ?? 0,
      page: input.page ?? 0,
      perpage: input.page_size ?? 0,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  get_last_feedback_completion: {
    request: (input) => ({ feedbackid: input.feedback_id, courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  reorder_feedback_questions: {
    request: (input) => ({ cmid: input.module_id, itemorder: input.item_ids.join(',') }),
    response: (payload) => payload
  },
  view_feedback: {
    request: (input) => ({
      feedbackid: input.feedback_id,
      moduleviewed: input.mark_completed ?? false,
      courseid: input.course_id ?? 0
    }),
    response: (payload) => payload
  },
  get_course_h5p_activities: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_h5p_access_information: {
    request: (input) => ({ h5pactivityid: input.h5p_id }),
    response: (payload) => payload
  },
  get_h5p_attempts: {
    request: (input) => ({ h5pactivityid: input.h5p_id, userids: input.user_ids ?? [] }),
    response: (payload) => payload
  },
  get_h5p_results: {
    request: (input) => ({ h5pactivityid: input.h5p_id, attemptids: input.attempt_ids ?? [] }),
    response: (payload) => payload
  },
  get_h5p_user_attempts: {
    request: (input) => ({
      h5pactivityid: input.h5p_id,
      sortorder: input.sort_order ?? 'id ASC',
      page: input.page ?? -1,
      perpage: input.page_size ?? 0,
      firstinitial: input.first_initial ?? '',
      lastinitial: input.last_initial ?? ''
    }),
    response: (payload) => payload
  },
  log_h5p_report_view: {
    request: (input) => ({
      h5pactivityid: input.h5p_id,
      ...(input.user_id === undefined ? {} : { userid: input.user_id }),
      ...(input.attempt_id === undefined ? {} : { attemptid: input.attempt_id })
    }),
    response: (payload) => payload
  },
  view_h5p_activity: {
    request: (input) => ({ h5pactivityid: input.h5p_id }),
    response: (payload) => payload
  },
  get_course_databases: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_database_access_information: {
    request: (input) => ({ databaseid: input.database_id, groupid: input.group_id ?? 0 }),
    response: (payload) => payload
  },
  get_database_entries: {
    request: (input) => ({
      databaseid: input.database_id,
      groupid: input.group_id ?? 0,
      returncontents: input.include_contents ?? false,
      ...(input.sort_field_id === undefined ? {} : { sort: input.sort_field_id }),
      ...(input.sort_direction === undefined ? {} : { order: input.sort_direction }),
      page: input.page ?? 0,
      perpage: input.page_size ?? 0
    }),
    response: (payload) => payload
  },
  get_database_entry: {
    request: (input) => ({
      entryid: input.entry_id,
      returncontents: input.include_contents ?? false
    }),
    response: (payload) => payload
  },
  get_database_fields: {
    request: (input) => ({ databaseid: input.database_id }),
    response: (payload) => payload
  },
  search_database_entries: {
    request: (input) => ({
      databaseid: input.database_id,
      groupid: input.group_id ?? 0,
      returncontents: input.include_contents ?? false,
      search: input.query ?? '',
      advsearch: namedValues(input.advanced_search),
      ...(input.sort_field_id === undefined ? {} : { sort: input.sort_field_id }),
      ...(input.sort_direction === undefined ? {} : { order: input.sort_direction }),
      page: input.page ?? 0,
      perpage: input.page_size ?? 0
    }),
    response: (payload) => payload
  },
  approve_database_entry: {
    request: (input) => ({ entryid: input.entry_id, approve: input.approved }),
    response: (payload) => payload
  },
  delete_database_entry: {
    request: (input) => ({ entryid: input.entry_id }),
    response: (payload) => payload
  },
  create_database_entry: {
    request: (input) => ({
      databaseid: input.database_id,
      groupid: input.group_id ?? 0,
      data: databaseFields(input.fields)
    }),
    response: (payload) => payload
  },
  update_database_entry: {
    request: (input) => ({ entryid: input.entry_id, data: databaseFields(input.fields) }),
    response: (payload) => payload
  },
  delete_database_presets: {
    request: (input) => ({ dataid: input.database_id, presetnames: input.preset_names }),
    response: (payload) => payload
  },
  get_database_preset_mapping: {
    request: (input) => ({ cmid: input.module_id, importedpreset: input.preset }),
    response: (payload) => payload
  },
  view_database: {
    request: (input) => ({ databaseid: input.database_id }),
    response: (payload) => payload
  },
  get_course_glossaries: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_glossary_entries_by_letter: {
    request: (input) => ({
      id: input.glossary_id, letter: input.letter, from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_entries_by_date: {
    request: (input) => ({
      id: input.glossary_id, order: input.date_field ?? 'UPDATE', sort: input.sort_direction ?? 'DESC',
      from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_categories: {
    request: (input) => ({ id: input.glossary_id, from: input.offset ?? 0, limit: input.limit ?? 20 }),
    response: (payload) => payload
  },
  get_glossary_entries_by_category: {
    request: (input) => ({
      id: input.glossary_id, categoryid: input.category_id, from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_authors: {
    request: (input) => ({
      id: input.glossary_id, from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_entries_by_author_letter: {
    request: (input) => ({
      id: input.glossary_id, letter: input.letter, field: input.name_field ?? 'LASTNAME',
      sort: input.sort_direction ?? 'ASC', from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_entries_by_author: {
    request: (input) => ({
      id: input.glossary_id, authorid: input.author_id, order: input.order_by ?? 'CONCEPT',
      sort: input.sort_direction ?? 'ASC', from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  search_glossary_entries: {
    request: (input) => ({
      id: input.glossary_id, query: input.query, fullsearch: input.full_search ?? true,
      order: input.order_by ?? 'CONCEPT', sort: input.sort_direction ?? 'ASC',
      from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_entries_by_term: {
    request: (input) => ({
      id: input.glossary_id, term: input.term, from: input.offset ?? 0, limit: input.limit ?? 20,
      options: { includenotapproved: input.include_unapproved ?? false }
    }),
    response: (payload) => payload
  },
  get_glossary_entries_to_approve: {
    request: (input) => ({
      id: input.glossary_id, letter: input.letter, order: input.order_by ?? 'CONCEPT',
      sort: input.sort_direction ?? 'ASC', from: input.offset ?? 0, limit: input.limit ?? 20, options: {}
    }),
    response: (payload) => payload
  },
  get_glossary_entry: {
    request: (input) => ({ id: input.entry_id }),
    response: (payload) => payload
  },
  create_glossary_entry: {
    request: (input) => ({
      glossaryid: input.glossary_id, concept: input.concept, definition: input.definition,
      definitionformat: input.definition_format ?? 1, options: namedValues(input.options)
    }),
    response: (payload) => payload
  },
  update_glossary_entry: {
    request: (input) => ({
      entryid: input.entry_id, concept: input.concept, definition: input.definition,
      definitionformat: input.definition_format ?? 1, options: namedValues(input.options)
    }),
    response: (payload) => payload
  },
  delete_glossary_entry: {
    request: (input) => ({ entryid: input.entry_id }),
    response: (payload) => payload
  },
  prepare_glossary_entry: {
    request: (input) => ({ entryid: input.entry_id }),
    response: (payload) => payload
  },
  view_glossary: {
    request: (input) => ({ id: input.glossary_id, mode: input.mode }),
    response: (payload) => payload
  },
  view_glossary_entry: {
    request: (input) => ({ id: input.entry_id }),
    response: (payload) => payload
  },
  get_course_bigbluebutton_activities: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  can_join_bigbluebutton: {
    request: (input) => ({ cmid: input.module_id, groupid: input.group_id ?? 0 }),
    response: (payload) => payload
  },
  get_bigbluebutton_join_url: {
    request: (input) => ({ cmid: input.module_id, groupid: input.group_id ?? 0 }),
    response: (payload) => payload
  },
  get_bigbluebutton_recordings: {
    request: (input) => ({
      bigbluebuttonbnid: input.bigbluebutton_id,
      tools: (input.tools ?? ['protect', 'unprotect', 'publish', 'unpublish', 'delete']).join(','),
      ...(input.group_id === undefined ? {} : { groupid: input.group_id })
    }),
    response: (payload) => payload
  },
  get_bigbluebutton_recordings_to_import: {
    request: (input) => ({
      destinationinstanceid: input.destination_id,
      sourcebigbluebuttonbnid: input.source_bigbluebutton_id ?? 0,
      sourcecourseid: input.source_course_id ?? 0,
      tools: (input.tools ?? ['protect', 'unprotect', 'publish', 'unpublish', 'delete']).join(','),
      ...(input.group_id === undefined ? {} : { groupid: input.group_id })
    }),
    response: (payload) => payload
  },
  update_bigbluebutton_recording: {
    request: (input) => ({
      bigbluebuttonbnid: input.bigbluebutton_id,
      recordingid: input.recording_id,
      action: input.action,
      additionaloptions: JSON.stringify(input.additional_options ?? {})
    }),
    response: (payload) => payload
  },
  end_bigbluebutton_meeting: {
    request: (input) => ({ bigbluebuttonbnid: input.bigbluebutton_id, groupid: input.group_id ?? 0 }),
    response: (payload) => payload
  },
  validate_bigbluebutton_completion: {
    request: (input) => ({ bigbluebuttonbnid: input.bigbluebutton_id }),
    response: (payload) => payload
  },
  get_bigbluebutton_meeting_information: {
    request: (input) => ({
      bigbluebuttonbnid: input.bigbluebutton_id,
      groupid: input.group_id ?? 0,
      updatecache: input.refresh_cache ?? false
    }),
    response: (payload) => payload
  },
  view_bigbluebutton: {
    request: (input) => ({ bigbluebuttonbnid: input.bigbluebutton_id }),
    response: (payload) => payload
  },
  get_course_lessons: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_lesson: {
    request: (input) => ({ lessonid: input.lesson_id, password: input.password ?? '' }),
    response: (payload) => payload
  },
  get_lesson_access_information: {
    request: (input) => ({ lessonid: input.lesson_id }),
    response: (payload) => payload
  },
  get_lesson_question_attempts: {
    request: (input) => ({
      lessonid: input.lesson_id,
      attempt: input.attempt,
      correct: input.only_correct ?? false,
      ...(input.page_id === undefined ? {} : { pageid: input.page_id }),
      ...(input.user_id === undefined ? {} : { userid: input.user_id })
    }),
    response: (payload) => payload
  },
  get_lesson_user_grade: {
    request: (input) => ({
      lessonid: input.lesson_id,
      ...(input.user_id === undefined ? {} : { userid: input.user_id })
    }),
    response: (payload) => payload
  },
  get_lesson_attempt_grade: {
    request: (input) => ({
      lessonid: input.lesson_id,
      lessonattempt: input.attempt,
      ...(input.user_id === undefined ? {} : { userid: input.user_id })
    }),
    response: (payload) => payload
  },
  get_lesson_content_pages_viewed: {
    request: (input) => ({
      lessonid: input.lesson_id,
      lessonattempt: input.attempt,
      ...(input.user_id === undefined ? {} : { userid: input.user_id })
    }),
    response: (payload) => payload
  },
  get_lesson_user_timers: {
    request: (input) => ({
      lessonid: input.lesson_id,
      ...(input.user_id === undefined ? {} : { userid: input.user_id })
    }),
    response: (payload) => payload
  },
  get_lesson_pages: {
    request: (input) => ({ lessonid: input.lesson_id, password: input.password ?? '' }),
    response: (payload) => payload
  },
  launch_lesson_attempt: {
    request: (input) => ({
      lessonid: input.lesson_id,
      password: input.password ?? '',
      pageid: input.page_id ?? 0,
      review: input.review ?? false
    }),
    response: (payload) => payload
  },
  get_lesson_page: {
    request: (input) => ({
      lessonid: input.lesson_id,
      pageid: input.page_id,
      password: input.password ?? '',
      review: input.review ?? false,
      returncontents: input.include_contents ?? false
    }),
    response: (payload) => payload
  },
  submit_lesson_page: {
    request: (input) => ({
      lessonid: input.lesson_id,
      pageid: input.page_id,
      data: namedValues(input.responses),
      password: input.password ?? '',
      review: input.review ?? false
    }),
    response: (payload) => payload
  },
  finish_lesson_attempt: {
    request: (input) => ({
      lessonid: input.lesson_id,
      password: input.password ?? '',
      outoftime: input.out_of_time ?? false,
      review: input.review ?? false
    }),
    response: (payload) => payload
  },
  get_lesson_attempts_overview: {
    request: (input) => ({ lessonid: input.lesson_id, groupid: input.group_id ?? 0 }),
    response: (payload) => payload
  },
  get_lesson_user_attempt: {
    request: (input) => ({
      lessonid: input.lesson_id,
      userid: input.user_id,
      lessonattempt: input.attempt
    }),
    response: (payload) => payload
  },
  get_lesson_possible_jumps: {
    request: (input) => ({ lessonid: input.lesson_id }),
    response: (payload) => payload
  },
  view_lesson: {
    request: (input) => ({ lessonid: input.lesson_id, password: input.password ?? '' }),
    response: (payload) => payload
  },
  get_course_lti_tools: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_lti_launch_data: {
    request: (input) => ({ toolid: input.tool_id }),
    response: (payload) => payload
  },
  get_lti_tool_proxies: {
    request: (input) => ({ orphanedonly: input.only_orphaned ?? false }),
    response: (payload) => payload
  },
  create_lti_tool_proxy: {
    request: (input) => ({
      name: input.name ?? '',
      regurl: input.registration_url,
      capabilityoffered: input.capabilities ?? [],
      serviceoffered: input.services ?? []
    }),
    response: (payload) => payload
  },
  delete_lti_tool_proxy: {
    request: (input) => ({ id: input.proxy_id }),
    response: (payload) => payload
  },
  get_lti_proxy_registration_request: {
    request: (input) => ({ id: input.proxy_id }),
    response: (payload) => payload
  },
  get_lti_tool_types: {
    request: (input) => ({ toolproxyid: input.proxy_id ?? 0 }),
    response: (payload) => payload
  },
  get_lti_tool_types_and_proxies: {
    request: (input) => ({
      toolproxyid: input.proxy_id ?? 0,
      orphanedonly: input.only_orphaned ?? false,
      limit: input.limit ?? 60,
      offset: input.offset ?? 0
    }),
    response: (payload) => payload
  },
  count_lti_tool_types_and_proxies: {
    request: (input) => ({
      toolproxyid: input.proxy_id ?? 0,
      orphanedonly: input.only_orphaned ?? false
    }),
    response: (payload) => payload
  },
  create_lti_tool_type: {
    request: (input) => ({
      cartridgeurl: input.cartridge_url ?? '',
      key: input.consumer_key ?? '',
      secret: input.shared_secret ?? ''
    }),
    response: (payload) => payload
  },
  update_lti_tool_type: {
    request: (input) => ({
      id: input.tool_type_id,
      ...(input.name === undefined ? {} : { name: input.name }),
      ...(input.description === undefined ? {} : { description: input.description }),
      ...(input.state === undefined ? {} : { state: input.state })
    }),
    response: (payload) => payload
  },
  delete_lti_tool_type: {
    request: (input) => ({ id: input.tool_type_id }),
    response: (payload) => payload
  },
  delete_course_lti_tool_type: {
    request: (input) => ({ tooltypeid: input.tool_type_id }),
    response: (payload) => payload
  },
  set_lti_tool_activity_chooser_visibility: {
    request: (input) => ({
      tooltypeid: input.tool_type_id,
      courseid: input.course_id,
      showinactivitychooser: input.visible
    }),
    response: (payload) => payload
  },
  is_lti_cartridge: {
    request: (input) => ({ url: input.url }),
    response: (payload) => payload
  },
  view_lti: {
    request: (input) => ({ ltiid: input.lti_id }),
    response: (payload) => payload
  },
  get_course_workshops: {
    request: (input) => ({ courseids: input.course_ids ?? [] }),
    response: (payload) => payload
  },
  get_workshop_access_information: {
    request: (input) => ({ workshopid: input.workshop_id }),
    response: (payload) => payload
  },
  get_workshop_user_plan: {
    request: (input) => ({ workshopid: input.workshop_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  create_workshop_submission: {
    request: (input) => ({
      workshopid: input.workshop_id,
      title: input.title,
      content: input.content ?? '',
      contentformat: input.content_format ?? 0,
      inlineattachmentsid: input.inline_draft_item_id ?? 0,
      attachmentsid: input.attachment_draft_item_id ?? 0
    }),
    response: (payload) => payload
  },
  update_workshop_submission: {
    request: (input) => ({
      submissionid: input.submission_id,
      title: input.title,
      content: input.content ?? '',
      contentformat: input.content_format ?? 0,
      inlineattachmentsid: input.inline_draft_item_id ?? 0,
      attachmentsid: input.attachment_draft_item_id ?? 0
    }),
    response: (payload) => payload
  },
  delete_workshop_submission: {
    request: (input) => ({ submissionid: input.submission_id }),
    response: (payload) => payload
  },
  get_workshop_submissions: {
    request: (input) => ({
      workshopid: input.workshop_id,
      userid: input.user_id ?? 0,
      groupid: input.group_id ?? 0,
      page: input.page ?? 0,
      perpage: input.page_size ?? 0
    }),
    response: (payload) => payload
  },
  get_workshop_submission: {
    request: (input) => ({ submissionid: input.submission_id }),
    response: (payload) => payload
  },
  get_workshop_submission_assessments: {
    request: (input) => ({ submissionid: input.submission_id }),
    response: (payload) => payload
  },
  get_workshop_assessment: {
    request: (input) => ({ assessmentid: input.assessment_id }),
    response: (payload) => payload
  },
  get_workshop_assessment_form: {
    request: (input) => ({ assessmentid: input.assessment_id, mode: input.mode ?? 'assessment' }),
    response: (payload) => payload
  },
  get_workshop_reviewer_assessments: {
    request: (input) => ({ workshopid: input.workshop_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  update_workshop_assessment: {
    request: (input) => ({ assessmentid: input.assessment_id, data: namedValues(input.data) }),
    response: (payload) => payload
  },
  get_workshop_grades: {
    request: (input) => ({ workshopid: input.workshop_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  evaluate_workshop_assessment: {
    request: (input) => ({
      assessmentid: input.assessment_id,
      feedbacktext: input.feedback ?? '',
      feedbackformat: input.feedback_format ?? 0,
      weight: input.weight ?? 1,
      gradinggradeover: input.grade_override ?? ''
    }),
    response: (payload) => payload
  },
  get_workshop_grades_report: {
    request: (input) => ({
      workshopid: input.workshop_id,
      groupid: input.group_id ?? 0,
      sortby: input.sort_by ?? 'lastname',
      sortdirection: input.sort_direction ?? 'ASC',
      page: input.page ?? 0,
      perpage: input.page_size ?? 0
    }),
    response: (payload) => payload
  },
  evaluate_workshop_submission: {
    request: (input) => ({
      submissionid: input.submission_id,
      feedbacktext: input.feedback ?? '',
      feedbackformat: input.feedback_format ?? 0,
      published: input.published ?? false,
      gradeover: input.grade_override ?? ''
    }),
    response: (payload) => payload
  },
  view_workshop: {
    request: (input) => ({ workshopid: input.workshop_id }),
    response: (payload) => payload
  },
  view_workshop_submission: {
    request: (input) => ({ submissionid: input.submission_id }),
    response: (payload) => payload
  },
  save_assignment_grades: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      applytoall: input.apply_to_all ?? false,
      grades: input.grades.map((grade) => ({
        userid: grade.user_id ?? grade.userid,
        grade: grade.grade,
        attemptnumber: grade.attempt_number ?? grade.attemptnumber ?? -1,
        addattempt: grade.add_attempt ?? grade.addattempt ?? false,
        workflowstate: grade.workflow_state ?? grade.workflowstate ?? '',
        plugindata: grade.plugin_data ?? grade.plugindata ?? {},
        advancedgradingdata: grade.advanced_grading_data ?? grade.advancedgradingdata ?? {}
      }))
    }),
    response: (payload) => payload
  },
  submit_assignment_grading_form: {
    request: (input) => ({
      assignmentid: input.assignment_id,
      userid: input.user_id,
      jsonformdata: JSON.stringify(input.form_data),
      marker: input.marking ?? false
    }),
    response: (payload) => payload
  },
  get_user_quiz_attempts_legacy: {
    request: (input) => ({
      quizid: input.quiz_id,
      userid: input.user_id ?? 0,
      status: input.status ?? 'finished',
      includepreviews: input.include_previews ?? false
    }),
    response: (payload) => payload
  },
  set_quiz_question_version: {
    request: (input) => ({ slotid: input.slot_id, newversion: input.version }),
    response: (payload) => payload
  },
  reopen_quiz_attempt: {
    request: (input) => ({ attemptid: input.attempt_id }),
    response: (payload) => payload
  },
  get_reopen_quiz_attempt_confirmation: {
    request: (input) => ({ attemptid: input.attempt_id }),
    response: (payload) => payload
  },
  add_quiz_random_questions: {
    request: (input) => ({
      cmid: input.module_id,
      addonpage: input.page,
      randomcount: input.count,
      filtercondition: input.filter === undefined ? '' : JSON.stringify(input.filter),
      newcategory: input.new_category ?? '',
      parentcategory: input.parent_category ?? '0'
    }),
    response: (payload) => payload
  },
  update_quiz_random_question_filter: {
    request: (input) => ({
      cmid: input.module_id,
      slotid: input.slot_id,
      filtercondition: JSON.stringify(input.filter)
    }),
    response: (payload) => payload
  },
  save_quiz_overrides: {
    request: (input) => ({ data: { quizid: input.quiz_id, overrides: input.overrides } }),
    response: (payload) => payload
  },
  delete_quiz_overrides: {
    request: (input) => ({ data: { quizid: input.quiz_id, ids: input.override_ids } }),
    response: (payload) => payload
  },
  get_quiz_overrides: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  create_quiz_grade_items: {
    request: (input) => ({
      quizid: input.quiz_id,
      quizgradeitems: input.names.map((name) => ({ name }))
    }),
    response: (payload) => payload
  },
  delete_quiz_grade_items: {
    request: (input) => ({
      quizid: input.quiz_id,
      quizgradeitems: input.grade_item_ids.map((id) => ({ id }))
    }),
    response: (payload) => payload
  },
  update_quiz_grade_items: {
    request: (input) => ({ quizid: input.quiz_id, quizgradeitems: input.grade_items }),
    response: (payload) => payload
  },
  update_quiz_slots: {
    request: (input) => ({ quizid: input.quiz_id, slots: input.slots }),
    response: (payload) => payload
  },
  get_quiz_grading_setup: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  create_quiz_grade_item_per_section: {
    request: (input) => ({ quizid: input.quiz_id }),
    response: (payload) => payload
  },
  get_calendar_month: {
    request: (input) => ({
      year: input.year,
      month: input.month,
      courseid: input.course_id ?? 1,
      ...(input.category_id === undefined ? {} : { categoryid: input.category_id }),
      includenavigation: input.include_navigation ?? true,
      mini: input.mini ?? false
    }),
    response: (payload) => payload
  },
  get_calendar_day: {
    request: (input) => ({
      year: input.year,
      month: input.month,
      day: input.day,
      courseid: input.course_id ?? 1,
      ...(input.category_id === undefined ? {} : { categoryid: input.category_id })
    }),
    response: (payload) => payload
  },
  get_calendar_upcoming: {
    request: (input) => ({
      courseid: input.course_id ?? 1,
      ...(input.category_id === undefined ? {} : { categoryid: input.category_id })
    }),
    response: (payload) => payload
  },
  move_calendar_event: {
    request: (input) => ({ eventid: input.event_id, daytimestamp: input.day_timestamp }),
    response: (payload) => payload
  },
  create_calendar_events: {
    request: (input) => ({
      events: input.events.map((event) => ({
        name: event.name,
        description: event.description,
        format: event.description_format ?? event.format ?? 1,
        courseid: event.course_id ?? event.courseid ?? 0,
        groupid: event.group_id ?? event.groupid ?? 0,
        repeats: event.repeats ?? 0,
        eventtype: event.event_type ?? event.eventtype ?? 'user',
        timestart: event.start_time ?? event.timestart,
        timeduration: event.duration ?? event.timeduration ?? 0,
        visible: event.visible === false ? 0 : 1,
        sequence: event.sequence ?? 1
      }))
    }),
    response: (payload) => payload
  },
  delete_calendar_events: {
    request: (input) => ({
      events: input.events.map((event) => ({
        eventid: event.event_id ?? event.eventid,
        repeat: event.repeat ?? false
      }))
    }),
    response: (payload) => payload
  },
  get_action_events_by_time: {
    request: (input) => ({
      timesortfrom: input.from ?? 0,
      ...(input.to === undefined ? {} : { timesortto: input.to }),
      aftereventid: input.after_event_id ?? 0,
      limitnum: input.limit ?? 20,
      limittononsuspendedevents: input.only_active_enrolments ?? false,
      ...(input.user_id === undefined ? {} : { userid: input.user_id }),
      ...(input.query === undefined ? {} : { searchvalue: input.query })
    }),
    response: (payload) => payload
  },
  get_course_action_events: {
    request: (input) => ({
      courseid: input.course_id,
      ...(input.from === undefined ? {} : { timesortfrom: input.from }),
      ...(input.to === undefined ? {} : { timesortto: input.to }),
      aftereventid: input.after_event_id ?? 0,
      limitnum: input.limit ?? 20,
      ...(input.query === undefined ? {} : { searchvalue: input.query })
    }),
    response: (payload) => payload
  },
  get_courses_action_events: {
    request: (input) => ({
      courseids: input.course_ids,
      ...(input.from === undefined ? {} : { timesortfrom: input.from }),
      ...(input.to === undefined ? {} : { timesortto: input.to }),
      limitnum: input.limit ?? 10,
      ...(input.query === undefined ? {} : { searchvalue: input.query })
    }),
    response: (payload) => payload
  },
  get_calendar_event: {
    request: (input) => ({ eventid: input.event_id }),
    response: (payload) => payload
  },
  submit_calendar_event_form: {
    request: (input) => ({
      formdata: new URLSearchParams(
        Object.entries(input.form_data).map(([key, value]) => [key, String(value)])
      ).toString()
    }),
    response: (payload) => payload
  },
  get_calendar_access_information: {
    request: (input) => ({ courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_allowed_calendar_event_types: {
    request: (input) => ({ courseid: input.course_id ?? 0 }),
    response: (payload) => payload
  },
  get_calendar_export_token: {
    request: () => ({}),
    response: (payload) => payload
  },
  get_badge: {
    request: (input) => ({ id: input.badge_id }),
    response: (payload) => payload
  },
  get_user_badges: {
    request: (input) => ({
      userid: input.user_id ?? 0,
      courseid: input.course_id ?? 0,
      page: input.page ?? 0,
      perpage: input.page_size ?? 0,
      search: input.query ?? '',
      onlypublic: input.only_public ?? false
    }),
    response: (payload) => payload
  },
  get_user_badge_by_hash: {
    request: (input) => ({ hash: input.hash }),
    response: (payload) => payload
  },
  get_blog_entries: {
    request: (input) => ({
      filters: namedValues(input.filters),
      page: input.page ?? 0,
      perpage: input.page_size ?? 10
    }),
    response: (payload) => payload
  },
  view_blog_entries: {
    request: (input) => ({ filters: namedValues(input.filters) }),
    response: (payload) => payload
  },
  get_blog_access_information: {
    request: () => ({}),
    response: (payload) => payload
  },
  create_blog_entry: {
    request: (input) => ({
      subject: input.subject,
      summary: input.content,
      summaryformat: input.content_format ?? 1,
      options: namedValues(input.options)
    }),
    response: (payload) => payload
  },
  update_blog_entry: {
    request: (input) => ({
      entryid: input.entry_id,
      subject: input.subject,
      summary: input.content,
      summaryformat: input.content_format ?? 1,
      options: namedValues(input.options)
    }),
    response: (payload) => payload
  },
  delete_blog_entry: {
    request: (input) => ({ entryid: input.entry_id }),
    response: (payload) => payload
  },
  prepare_blog_entry: {
    request: (input) => ({ entryid: input.entry_id }),
    response: (payload) => payload
  },
  get_comments: {
    request: (input) => ({
      contextlevel: input.context_type,
      instanceid: input.context_id,
      component: input.component,
      itemid: input.item_id,
      area: input.area ?? '',
      page: input.page ?? 0,
      sortdirection: input.sort_direction ?? 'DESC'
    }),
    response: (payload) => payload
  },
  create_comments: {
    request: (input) => ({
      comments: input.comments.map((comment) => ({
        contextlevel: comment.context_type ?? comment.contextlevel,
        instanceid: comment.context_id ?? comment.instanceid,
        component: comment.component,
        content: comment.content,
        itemid: comment.item_id ?? comment.itemid,
        area: comment.area ?? ''
      }))
    }),
    response: (payload) => payload
  },
  delete_comments: {
    request: (input) => ({ comments: input.comment_ids }),
    response: (payload) => payload
  },
  create_notes: {
    request: (input) => ({
      notes: input.notes.map((note) => ({
        userid: note.user_id ?? note.userid,
        publishstate: note.publish_state ?? note.publishstate,
        courseid: note.course_id ?? note.courseid,
        text: note.text,
        format: note.format ?? 1,
        ...((note.client_note_id ?? note.clientnoteid) === undefined
          ? {}
          : { clientnoteid: note.client_note_id ?? note.clientnoteid })
      }))
    }),
    response: (payload) => payload
  },
  delete_notes: {
    request: (input) => ({ notes: input.note_ids }),
    response: (payload) => payload
  },
  get_course_notes: {
    request: (input) => ({ courseid: input.course_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  view_notes: {
    request: (input) => ({ courseid: input.course_id, userid: input.user_id ?? 0 }),
    response: (payload) => payload
  },
  get_item_ratings: {
    request: (input) => ({
      contextlevel: input.context_type,
      instanceid: input.context_id,
      component: input.component,
      ratingarea: input.rating_area,
      itemid: input.item_id,
      scaleid: input.scale_id,
      sort: input.sort_by
    }),
    response: (payload) => payload
  },
  rate_item: {
    request: (input) => ({
      contextlevel: input.context_type,
      instanceid: input.context_id,
      component: input.component,
      ratingarea: input.rating_area,
      itemid: input.item_id,
      scaleid: input.scale_id,
      rating: input.rating,
      rateduserid: input.rated_user_id,
      aggregation: input.aggregation ?? 0
    }),
    response: (payload) => payload
  },
  delete_draft_files: {
    request: (input) => ({
      draftitemid: input.draft_item_id,
      files: input.files.map((file) => ({
        filepath: file.file_path ?? file.filepath,
        filename: file.file_name ?? file.filename
      }))
    }),
    response: (payload) => payload
  },
  search_site: {
    request: (input) => ({
      query: input.query,
      filters: searchFilters(input.filters),
      page: input.page ?? 0
    }),
    response: (payload) => payload
  },
  get_top_search_results: {
    request: (input) => ({ query: input.query, filters: searchFilters(input.filters) }),
    response: (payload) => payload
  },
  view_search_results: {
    request: (input) => ({
      query: input.query,
      filters: searchFilters(input.filters),
      page: input.page ?? 0
    }),
    response: (payload) => payload
  },
  get_tag_index: {
    request: (input) => ({ tagindex: tagIndexParameters(input) }),
    response: (payload) => payload
  },
  get_tag_index_by_area: {
    request: (input) => ({ tagindex: tagIndexParameters(input, true) }),
    response: (payload) => payload
  },
  set_favourite_courses: {
    request: (input) => ({
      courses: input.courses.map((course) => ({
        id: course.course_id ?? course.id,
        favourite: course.favourite ?? course.starred
      }))
    }),
    response: (payload) => payload
  },
  check_course_updates: {
    request: (input) => ({
      courseid: input.course_id,
      tocheck: input.contexts.map((context) => ({
        contextlevel: context.context_type ?? context.contextlevel ?? 'module',
        id: context.context_id ?? context.id,
        since: context.since
      })),
      filter: input.areas ?? []
    }),
    response: (payload) => payload
  },
  get_available_filters: {
    request: (input) => ({
      contexts: input.contexts.map((context) => ({
        contextlevel: context.context_type ?? context.contextlevel,
        instanceid: context.context_id ?? context.instanceid
      }))
    }),
    response: (payload) => payload
  },
  get_course_user_profiles: {
    request: (input) => ({
      userlist: input.users.map((user) => ({
        userid: user.user_id ?? user.userid,
        courseid: user.course_id ?? user.courseid
      }))
    }),
    response: (payload) => payload
  },
  set_user_preferences: {
    request: (input) => ({
      preferences: input.preferences.map((preference) => ({
        name: preference.name,
        value: preference.value,
        userid: preference.user_id ?? preference.userid ?? 0
      }))
    }),
    response: (payload) => payload
  },
  update_user_preferences: {
    request: (input) => ({
      ...(input.user_id === undefined ? {} : { userid: input.user_id }),
      ...(input.notifications_disabled === undefined ? {} : { emailstop: input.notifications_disabled }),
      preferences: Object.entries(input.preferences ?? {}).map(([type, value]) => ({ type, value }))
    }),
    response: (payload) => payload
  },
  get_xapi_state: {
    request: (input) => xapiStateParameters(input, { includeStateId: true }),
    response: (payload) => payload
  },
  get_xapi_states: {
    request: (input) => xapiStateParameters(input, { includeSince: true }),
    response: (payload) => payload
  },
  save_xapi_state: {
    request: (input) => xapiStateParameters(input, { includeStateId: true, includeState: true }),
    response: (payload) => payload
  },
  delete_xapi_state: {
    request: (input) => xapiStateParameters(input, { includeStateId: true }),
    response: (payload) => payload
  },
  delete_xapi_states: {
    request: (input) => xapiStateParameters(input),
    response: (payload) => payload
  },
  post_xapi_statements: {
    request: (input) => ({ component: input.component, requestjson: JSON.stringify(input.statements) }),
    response: (payload) => payload
  },
  save_point_grading_panel: {
    request: (input) => ({
      component: input.component,
      contextid: input.context_id,
      itemname: input.item,
      gradeduserid: input.user_id,
      notifyuser: input.notify_user ?? false,
      formdata: new URLSearchParams(
        Object.entries(input.form_data).map(([name, value]) => [name, String(value)])
      ).toString()
    }),
    response: (payload) => payload
  },
  save_scale_grading_panel: {
    request: (input) => ({
      component: input.component,
      contextid: input.context_id,
      itemname: input.item,
      gradeduserid: input.user_id,
      notifyuser: input.notify_user ?? false,
      formdata: new URLSearchParams(
        Object.entries(input.form_data).map(([name, value]) => [name, String(value)])
      ).toString()
    }),
    response: (payload) => payload
  },
  can_view_system_report: {
    request: (input) => systemReportParameters(input),
    response: (payload) => payload
  },
  get_system_report: {
    request: (input) => systemReportParameters(input, true),
    response: (payload) => payload
  },
  get_dynamic_table: {
    request: (input) => ({
      component: input.component,
      handler: input.handler,
      uniqueid: input.unique_id,
      sortdata: (input.sort ?? []).map((sort) => ({
        sortby: sort.column ?? sort.sort_by ?? sort.sortby,
        sortorder: sort.direction ?? sort.sort_order ?? sort.sortorder
      })),
      ...(input.filters === undefined ? {} : {
        filters: input.filters.map((filter) => ({
          name: filter.name,
          jointype: filter.join_type ?? filter.jointype,
          values: filter.values,
          ...(filter.options === undefined && filter.filteroptions === undefined ? {} : {
            filteroptions: namedValues(filter.options ?? filter.filteroptions)
          })
        }))
      }),
      ...(input.filter_join_type === undefined ? {} : { jointype: input.filter_join_type }),
      ...(input.first_initial === undefined ? {} : { firstinitial: input.first_initial }),
      ...(input.last_initial === undefined ? {} : { lastinitial: input.last_initial }),
      ...(input.page === undefined ? {} : { pagenumber: input.page }),
      ...(input.page_size === undefined ? {} : { pagesize: input.page_size }),
      ...(input.hidden_columns === undefined ? {} : { hiddencolumns: input.hidden_columns }),
      ...(input.reset_preferences === undefined ? {} : { resetpreferences: input.reset_preferences })
    }),
    response: (payload) => payload
  },
  set_policy_acceptances: {
    request: (input) => ({
      policies: input.policies.map((policy) => ({
        versionid: policy.version_id ?? policy.versionid,
        status: policy.accepted === undefined
          ? policy.status
          : (policy.accepted ? 1 : 0),
        ...(policy.note === undefined ? {} : { note: policy.note })
      })),
      userid: input.user_id ?? 0
    }),
    response: (payload) => payload
  }
};

export class MoodleClient {
  constructor({
    contract,
    transport,
    moodleVersion = null,
    allowUnverifiedVersion = false,
    readOnly = false,
    allowedOperations = null,
    deniedOperations = [],
    allowDangerousOperations = false
  } = {}) {
    this.contract = contract ?? loadContractFromFile();
    this.transport = transport;
    this.moodleVersion = moodleVersion ? parseMoodleVersion(moodleVersion) : null;
    this.allowUnverifiedVersion = allowUnverifiedVersion;
    if (!this.transport) throw new MoodleConfigurationError('transport is required.', { parameter: 'transport' });
    if (typeof readOnly !== 'boolean') {
      throw new MoodleConfigurationError('readOnly must be a boolean.', { parameter: 'readOnly' });
    }
    if (typeof allowDangerousOperations !== 'boolean') {
      throw new MoodleConfigurationError('allowDangerousOperations must be a boolean.', {
        parameter: 'allowDangerousOperations'
      });
    }
    if (allowedOperations !== null && !Array.isArray(allowedOperations)) {
      throw new MoodleConfigurationError('allowedOperations must be an array or null.', {
        parameter: 'allowedOperations'
      });
    }
    this.readOnly = readOnly;
    this.allowDangerousOperations = allowDangerousOperations;
    if (!Array.isArray(deniedOperations)) {
      throw new MoodleConfigurationError('deniedOperations must be an array.', { parameter: 'deniedOperations' });
    }
    this.allowedOperations = allowedOperations === null ? null : new Set(allowedOperations);
    this.deniedOperations = new Set(deniedOperations);

    for (const operation of this.contract.operations ?? []) {
      this[operation.name] = (parameters = {}) => this.callOperation(operation.name, parameters);
    }
  }

  operationNames() {
    return (this.contract.operations ?? []).map((operation) => operation.name);
  }

  rememberSiteLimits(payload) {
    const siteLimit = Number(payload?.usermaxuploadfilesize);
    if (Number.isSafeInteger(siteLimit) && siteLimit > 0 && 'siteMaximumUploadBytes' in this.transport) {
      this.transport.siteMaximumUploadBytes = siteLimit;
    }
  }

  scopedTransport(operation) {
    const maximumResponseBytes = operationResponseLimit(operation);
    if (maximumResponseBytes === null) return this.transport;
    const transport = this.transport;
    return Object.create(transport, {
      callFunction: {
        value: (functionName, parameters = {}, options = {}) =>
          transport.callFunction(functionName, parameters, { maximumResponseBytes, ...options })
      }
    });
  }

  async detectVersion() {
    const payload = await this.transport.callFunction('core_webservice_get_site_info');
    this.rememberSiteLimits(payload);
    const detected = parseMoodleVersion(payload.release ?? payload.version);
    this.assertSupportedVersion(detected);
    this.moodleVersion = detected;
    return detected;
  }

  assertSupportedVersion(version = this.moodleVersion) {
    if (!version) throw new MoodleConfigurationError('Moodle version has not been detected or configured.');
    if (compareVersions(version, this.contract.minimumMoodleVersion) < 0) {
      throw new MoodleUnsupportedVersionError(`Moodle ${version} is not supported. Moodle ${this.contract.minimumMoodleVersion} or later is required.`, {
        detectedVersion: version,
        minimumVersion: this.contract.minimumMoodleVersion
      });
    }
    if (
      this.contract.maximumVerifiedMoodleVersion &&
      compareVersions(version, this.contract.maximumVerifiedMoodleVersion) > 0
    ) {
      throw new MoodleUnsupportedVersionError(
        `Moodle ${version} has not been verified. The newest supported branch is ${this.contract.maximumVerifiedMoodleVersion}.`,
        {
          detectedVersion: version,
          maximumVerifiedVersion: this.contract.maximumVerifiedMoodleVersion
        }
      );
    }
  }

  async callOperation(operationName, parameters = {}) {
    const operation = operationByName(this.contract, operationName);
    if (this.allowedOperations && !this.allowedOperations.has(operationName)) {
      throw new MoodlePermissionError(`Operation ${operationName} is not in the client allowlist.`, {
        operation: operationName
      });
    }
    if (this.deniedOperations.has(operationName)) {
      throw new MoodlePermissionError(`Operation ${operationName} is denied by the client policy.`, {
        operation: operationName
      });
    }
    if (this.readOnly && operation.kind === 'write') {
      throw new MoodlePermissionError(`Operation ${operationName} is unavailable in read-only mode.`, {
        operation: operationName,
        kind: operation.kind
      });
    }
    if (!this.allowDangerousOperations && isDangerousOperation(operationName)) {
      throw new MoodlePermissionError(`Operation ${operationName} requires allowDangerousOperations.`, {
        operation: operationName
      });
    }
    if (!this.moodleVersion && operationName === 'get_site_info') {
      const input = buildContractParameters(operation, parameters);
      const adapter = adapters[operationName] ?? contractAdapter(operation);
      const payload = await this.transport.callFunction(operation.moodleFunction, adapter.request(input));
      this.rememberSiteLimits(payload);
      this.moodleVersion = parseMoodleVersion(payload.release ?? payload.version);
      this.assertSupportedVersion();
      return adapter.response(payload, input);
    }
    if (!this.moodleVersion) await this.detectVersion();
    this.assertSupportedVersion();
    if (compareVersions(this.moodleVersion, operation.compatibility.from) < 0) {
      throw new MoodleUnsupportedVersionError(`${operationName} requires Moodle ${operation.compatibility.from} or later.`, {
        operation: operationName,
        detectedVersion: this.moodleVersion,
        supportedSince: operation.compatibility.from
      });
    }
    if (
      operation.compatibility.until &&
      compareVersions(this.moodleVersion, operation.compatibility.until) > 0
    ) {
      throw new MoodleUnsupportedVersionError(
        `${operationName} is only available through Moodle ${operation.compatibility.until}.`,
        {
          operation: operationName,
          detectedVersion: this.moodleVersion,
          supportedUntil: operation.compatibility.until
        }
      );
    }
    const input = buildContractParameters(operation, parameters);
    const adapter = adapters[operationName] ?? contractAdapter(operation);
    const transport = this.scopedTransport(operation);
    if (adapter.execute) {
      return adapter.execute(transport, input);
    }
    const request = adapter.request(input);
    const payload = await transport.callFunction(operation.moodleFunction, request);
    return adapter.response(payload, input);
  }
}

export function createMoodleClient({
  baseUrl,
  token,
  moodleVersion = null,
  contract = null,
  transport = null,
  readOnly = false,
  allowedOperations = null,
  deniedOperations = [],
  allowDangerousOperations = false,
  ...transportOptions
} = {}) {
  const resolvedContract = contract ?? loadContractFromFile();
  const resolvedTransport = transport ?? new RestTransport({ baseUrl, token, ...transportOptions });
  return new MoodleClient({
    contract: resolvedContract,
    transport: resolvedTransport,
    moodleVersion,
    allowUnverifiedVersion: transportOptions.allowUnverifiedVersion,
    readOnly,
    allowedOperations,
    deniedOperations,
    allowDangerousOperations
  });
}

export const createMoodleRestClient = createMoodleClient;
