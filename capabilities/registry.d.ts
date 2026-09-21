export type CapabilityFidelity = 'exact' | 'partial' | 'unknown' | 'unsupported';

export interface CapabilityImplementation {
  provider: string;
  operation?: string;
  workflow?: string[];
  fidelity?: CapabilityFidelity;
  implementationKind?: 'direct' | 'workflow';
  stability?: 'verified' | 'experimental' | 'deprecated';
  supportedFields?: string[] | null;
  requiredOperations?: string[];
  requiredFunctions?: string[];
  limitations?: string[];
}

export interface CapabilityDescriptor {
  capability: string;
  effects?: string[];
  implementations?: CapabilityImplementation[];
}

export class CapabilityRegistry {
  constructor(descriptors?: CapabilityDescriptor[]);
  register(descriptor: CapabilityDescriptor): this;
  get(capability: string): CapabilityDescriptor | null;
  list(): CapabilityDescriptor[];
  resolve(capability: string, options?: {
    requestedFields?: string[];
    provider?: 'auto' | string;
    providerPreference?: string[];
    evidenceByProvider?: Record<string, {
      available?: boolean;
      operations?: string[];
      functions?: string[];
    }>;
    allowExperimental?: boolean;
    allowPartial?: boolean;
  }): Record<string, unknown>;
}

export function createCapabilityRegistry(descriptors?: CapabilityDescriptor[]): CapabilityRegistry;
export const coreCapabilityDescriptors: readonly CapabilityDescriptor[];
