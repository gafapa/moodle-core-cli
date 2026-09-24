export function buildOperationTypes(
  contract: { operations?: Array<Record<string, unknown>> },
  options?: { objectParameterType?: string; clientMethods?: string[] }
): string;
export function writeOperationTypes(options: {
  contract: { operations?: Array<Record<string, unknown>> };
  outputPath: string;
  check?: boolean;
  objectParameterType?: string;
  clientMethods?: string[];
}): Promise<boolean>;
