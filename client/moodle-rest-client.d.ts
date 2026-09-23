export * from './generated/operation-types.js';

import type { TypedMoodleClient } from './generated/operation-types.js';

export interface MoodleOperationParameterDefinition {
  type: string;
  items?: string;
  required?: boolean;
  enum?: string[];
  minimum?: number;
  maximum?: number;
}

export interface MoodleOperationDefinition {
  name: string;
  summary: string;
  kind: 'read' | 'write';
  moodleFunction: string;
  compatibility: { from: string; until?: string | null };
  parameters?: Record<string, MoodleOperationParameterDefinition>;
  returns?: unknown;
  limits?: { class?: 'bulk'; maximumResponseBytes?: number };
}

export interface MoodleOperationContract {
  version: string;
  minimumMoodleVersion: string;
  maximumVerifiedMoodleVersion: string;
  operations: MoodleOperationDefinition[];
}

export interface MoodleCallOptions {
  maximumResponseBytes?: number;
}

export interface MoodleTransport {
  callFunction(functionName: string, parameters?: Record<string, unknown>, options?: MoodleCallOptions): Promise<unknown>;
}

export interface RestTransportOptions {
  baseUrl?: string;
  token?: string;
  timeoutMs?: number;
  fetchImplementation?: typeof fetch;
  allowInsecure?: boolean;
  /** null leaves local files unrestricted; an empty array (default) disables local file access. */
  allowedFileRoots?: string[] | null;
  maximumResponseBytes?: number;
  maximumUploadBytes?: number;
  maximumDownloadBytes?: number;
  /** Source for MOODLE_MAX_*_BYTES defaults; pass process.env to honour them. */
  environment?: Record<string, string | undefined>;
}

export interface MoodleClientOptions extends RestTransportOptions {
  moodleVersion?: string | null;
  contract?: MoodleOperationContract | null;
  transport?: MoodleTransport | null;
  allowUnverifiedVersion?: boolean;
  readOnly?: boolean;
  allowedOperations?: string[] | null;
  deniedOperations?: string[];
  allowDangerousOperations?: boolean;
}

import { MoodleClientError } from './transport-kernel.js';
export { MoodleClientError, MoodlePayloadTooLargeError } from './transport-kernel.js';

export class MoodleConfigurationError extends MoodleClientError {}
export class MoodleConnectionError extends MoodleClientError {}
export class MoodleAuthenticationError extends MoodleClientError {}
export class MoodlePermissionError extends MoodleClientError {}
export class MoodleValidationError extends MoodleClientError {}
export class MoodleUnsupportedVersionError extends MoodleClientError {}
export class MoodleOperationUnavailableError extends MoodleClientError {}

export class RestTransport implements MoodleTransport {
  constructor(options?: RestTransportOptions);
  siteMaximumUploadBytes: number | null;
  callFunction(functionName: string, parameters?: Record<string, unknown>, options?: MoodleCallOptions): Promise<unknown>;
  uploadDraftFile(options: {
    filePath: string;
    itemId?: number;
    draftPath?: string;
    filename?: string | null;
  }): Promise<Record<string, unknown>>;
  downloadFile(options: {
    fileUrl: string;
    destinationPath: string;
    overwrite?: boolean;
  }): Promise<{ destinationPath: string; size: number; contentType: string | null }>;
}

export class MoodleClient {
  constructor(options?: {
    contract?: MoodleOperationContract;
    transport: MoodleTransport;
    moodleVersion?: string | null;
    allowUnverifiedVersion?: boolean;
    readOnly?: boolean;
    allowedOperations?: string[] | null;
    deniedOperations?: string[];
    allowDangerousOperations?: boolean;
  });
  readonly contract: MoodleOperationContract;
  readonly transport: MoodleTransport;
  moodleVersion: string | null;
  operationNames(): import('./generated/operation-types.js').MoodleOperationName[];
  detectVersion(): Promise<string>;
  assertSupportedVersion(version?: string | null): void;
  callOperation<TName extends import('./generated/operation-types.js').MoodleOperationName>(
    operationName: TName,
    parameters: import('./generated/operation-types.js').MoodleOperationParameters[TName]
  ): Promise<import('./generated/operation-types.js').MoodleOperationResponses[TName]>;
}

export interface MoodleClient extends TypedMoodleClient {}

export function createMoodleClient(options?: MoodleClientOptions): MoodleClient;
export const createMoodleRestClient: typeof createMoodleClient;
export function operationResponseLimit(operation: MoodleOperationDefinition): number | null;
export function loadContractFromFile(contractPath?: string): MoodleOperationContract;
export function resolveMoodleUrl(baseUrl: string, relativePath: string, options?: { allowInsecure?: boolean }): URL;
export function encodeMoodleParameters(parameters?: Record<string, unknown>): URLSearchParams;
export function parseMoodleVersion(value: string): string;
export function buildContractParameters(
  operation: MoodleOperationDefinition,
  parameters?: Record<string, unknown>
): Record<string, unknown>;
export function normalizeClientError(
  error: unknown,
  fallbackCode?: string,
  details?: Record<string, unknown>
): MoodleClientError;
export function redactSensitiveData(value: unknown, options?: { redactEntireValue?: boolean }): unknown;
export function redactOperationResult(operationName: string, value: unknown): unknown;
export function isDestructiveOperation(operationName: string): boolean;
