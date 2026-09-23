import type { ErrorFactory } from '../client/transport-kernel.js';

export type CliOptions = Record<string, string | boolean | undefined>;

export function requiredOption(options: CliOptions, name: string, errors?: ErrorFactory): string;
export function positiveIntegerOption(
  options: CliOptions,
  name: string,
  settings?: { fallback?: number; errors?: ErrorFactory }
): number;
export function booleanOption(options: CliOptions, name: string, errors?: ErrorFactory): boolean;
export function readJsonFile<T = unknown>(filePath: unknown, label: string, errors?: ErrorFactory): T;
export function writeNewJsonFile(filePath: string, value: unknown): string;
