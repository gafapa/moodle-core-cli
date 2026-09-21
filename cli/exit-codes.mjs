export const CLI_EXIT_CODES = Object.freeze({
  success: 0,
  internalError: 1,
  validationError: 2,
  capabilityGap: 3,
  conflict: 4,
  remoteFailure: 5,
  partialExecution: 6,
  verificationFailure: 7
});

const validationCodes = new Set([
  'configuration_error',
  'invalid_parameters',
  'invalid_plan',
  'invalid_state',
  'not_found',
  'validation_error'
]);

const capabilityCodes = new Set([
  'capability_gap',
  'no_eligible_implementation',
  'operation_unavailable',
  'provider_unavailable',
  'unsupported',
  'unsupported_change',
  'unsupported_operation',
  'unsupported_moodle_version'
]);

const conflictCodes = new Set([
  'conflict',
  'entity_precondition_failed',
  'plan_conflict',
  'precondition_failed',
  'state_changed'
]);

const remoteCodes = new Set([
  'authentication_error',
  'connection_error',
  'file_upload_failed',
  'moodle_error',
  'permission_denied',
  'permission_error',
  'remote_error',
  'transport_error'
]);

const partialStatuses = new Set(['partially_applied', 'partial', 'unknown_outcome']);
const verificationStatuses = new Set(['verification_failed', 'failed_verification']);

function normalizedCode(error) {
  return String(error?.code ?? '').trim().toLowerCase();
}

export function exitCodeForError(error) {
  const code = normalizedCode(error);
  if (code === 'verification_failed' || code === 'invalid_response') {
    return CLI_EXIT_CODES.verificationFailure;
  }
  if (code === 'partial_execution' || code === 'unknown_outcome') return CLI_EXIT_CODES.partialExecution;
  if (conflictCodes.has(code)) return CLI_EXIT_CODES.conflict;
  if (capabilityCodes.has(code)) return CLI_EXIT_CODES.capabilityGap;
  if (validationCodes.has(code) || error instanceof SyntaxError || error instanceof TypeError) {
    return CLI_EXIT_CODES.validationError;
  }
  if (remoteCodes.has(code)) return CLI_EXIT_CODES.remoteFailure;
  if (error?.name === 'MoodleClientError' && code) return CLI_EXIT_CODES.remoteFailure;
  return CLI_EXIT_CODES.internalError;
}

export function exitCodeForResult(result) {
  if (!result || typeof result !== 'object') return CLI_EXIT_CODES.success;
  const status = String(result.status ?? '').toLowerCase();
  if (verificationStatuses.has(status)) return CLI_EXIT_CODES.verificationFailure;
  if (partialStatuses.has(status)) return CLI_EXIT_CODES.partialExecution;
  if (Array.isArray(result.conflicts) && result.conflicts.length > 0) return CLI_EXIT_CODES.conflict;
  if (Array.isArray(result.unsupported) && result.unsupported.length > 0) return CLI_EXIT_CODES.capabilityGap;
  if (result.applicable === false) {
    return Array.isArray(result.conflicts) && result.conflicts.length > 0
      ? CLI_EXIT_CODES.conflict
      : CLI_EXIT_CODES.capabilityGap;
  }
  if (result.data && typeof result.data === 'object') return exitCodeForResult(result.data);
  return CLI_EXIT_CODES.success;
}
