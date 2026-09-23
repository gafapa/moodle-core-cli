export declare const DEFAULT_LIMITS: Readonly<{
  maximumResponseBytes: number;
  maximumBulkResponseBytes: number;
  maximumUploadBytes: number;
  maximumDownloadBytes: number;
}>;

export type ByteLimitName = 'maximumResponseBytes' | 'maximumUploadBytes' | 'maximumDownloadBytes';

export declare const LIMIT_ENVIRONMENT: Readonly<Record<ByteLimitName, string>>;
export declare const LIMIT_OPTIONS: Readonly<Record<ByteLimitName, string>>;

export class MoodleClientError extends Error {
  constructor(code: string, message: string, details?: Record<string, unknown>, cause?: unknown);
  readonly code: string;
  readonly details: Record<string, unknown>;
  toJSON(options?: { includeDebug?: boolean }): {
    error: true;
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export class MoodlePayloadTooLargeError extends MoodleClientError {}

export type ErrorKind = 'configuration' | 'validation' | 'permission' | 'connection';
export type ErrorFactory = Record<
  ErrorKind,
  (message: string, details?: Record<string, unknown>, cause?: unknown) => MoodleClientError
>;

export declare const defaultErrorFactory: Readonly<ErrorFactory>;

export function normalizeClientError(
  error: unknown,
  fallbackCode?: string,
  details?: Record<string, unknown>
): MoodleClientError;
export function redactSensitiveData(value: unknown, options?: { redactEntireValue?: boolean }): unknown;
export function collectSensitiveValues(value: unknown, inheritedSensitive?: boolean, values?: Set<string>): Set<string>;
export function redactTextValues<T>(value: T, sensitiveValues: Iterable<string>): T | string;
export function isLoopbackHostname(hostname: string): boolean;
export function normalizeMoodleBaseUrl(
  baseUrl: string,
  options?: { allowInsecure?: boolean; errors?: ErrorFactory; parameter?: string }
): URL;
export function resolveMoodleUrl(
  baseUrl: string,
  relativePath: string,
  options?: { allowInsecure?: boolean; errors?: ErrorFactory }
): URL;
export function resolveByteLimit(
  value: number | string | null | undefined,
  options: { name: ByteLimitName; fallback: number; environment?: Record<string, string | undefined>; errors?: ErrorFactory }
): number;
export function assertContentLength(response: Response, maximumBytes: number, label: string, limitName: ByteLimitName): void;
export function readLimitedResponse(response: Response, maximumBytes: number, label: string, limitName?: ByteLimitName): Promise<Uint8Array>;
export function parseLimitedJsonResponse(
  response: Response,
  maximumBytes: number,
  label: string,
  options?: { errors?: ErrorFactory; details?: Record<string, unknown> }
): Promise<unknown>;
export function assertResponseOrigin(response: Response, expectedUrl: URL | string, errors?: ErrorFactory): void;
export function pathBelongsToRoot(candidatePath: string, rootPath: string): boolean;
export function normalizeAllowedFileRoots(allowedFileRoots: string[] | null, errors?: ErrorFactory): string[] | null;
export function openUploadSource(
  filePath: string,
  options?: { allowedFileRoots?: string[] | null; maximumBytes?: number; siteMaximumBytes?: number | null; errors?: ErrorFactory }
): Promise<{ blob: Blob; size: number; path: string; filename: string }>;
export function assertPlainFilename(filename: string, errors?: ErrorFactory): string;
export function assertDraftPath(filepath: string, errors?: ErrorFactory): string;
export function postDraftUpload(options: {
  baseUrl: string | URL;
  token: string;
  body: Blob;
  filename: string;
  filepath?: string;
  itemId?: number;
  timeoutMs?: number;
  fetchImplementation?: typeof fetch;
  allowInsecure?: boolean;
  maximumResponseBytes?: number;
  errors?: ErrorFactory;
}): Promise<{ response: Response; payload: unknown }>;
export function streamResponseToFile(
  response: Response,
  destinationPath: string,
  options?: { maximumBytes?: number; label?: string; hash?: boolean }
): Promise<{ size: number; sha256: string | null }>;
export function resolveAllowedDestination(
  destinationPath: string,
  allowedFileRoots: string[] | null,
  errors?: ErrorFactory
): Promise<string>;
export function temporarySiblingPath(destinationPath: string, tag?: string): string;
export function commandLineFileRoots(explicitPaths?: Array<string | undefined>, cwd?: string): string[];
