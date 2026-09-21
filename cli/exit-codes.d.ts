export declare const CLI_EXIT_CODES: Readonly<{
  success: 0;
  internalError: 1;
  validationError: 2;
  capabilityGap: 3;
  conflict: 4;
  remoteFailure: 5;
  partialExecution: 6;
  verificationFailure: 7;
}>;

export declare function exitCodeForError(error: unknown): number;
export declare function exitCodeForResult(result: unknown): number;
