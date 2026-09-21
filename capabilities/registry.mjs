const fidelityPriority = Object.freeze({
  exact: 3,
  partial: 2,
  unknown: 1,
  unsupported: 0
});

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string.`);
  }
  return value.trim();
}

function normalizeImplementation(capability, implementation) {
  if (!implementation || typeof implementation !== 'object' || Array.isArray(implementation)) {
    throw new TypeError(`Implementation for ${capability} must be an object.`);
  }
  const provider = assertNonEmptyString(implementation.provider, 'provider');
  const fidelity = implementation.fidelity ?? 'exact';
  if (!Object.hasOwn(fidelityPriority, fidelity)) {
    throw new TypeError(`Unsupported fidelity: ${fidelity}.`);
  }
  const supportedFields = implementation.supportedFields === undefined
    ? null
    : [...new Set(implementation.supportedFields.map((field) => assertNonEmptyString(field, 'supported field')))];
  return Object.freeze({
    ...implementation,
    capability,
    provider,
    fidelity,
    implementationKind: implementation.implementationKind ?? (implementation.operation ? 'direct' : 'workflow'),
    stability: implementation.stability ?? 'verified',
    supportedFields,
    requiredOperations: Object.freeze([...(implementation.requiredOperations ?? [])]),
    requiredFunctions: Object.freeze([...(implementation.requiredFunctions ?? [])]),
    limitations: Object.freeze([...(implementation.limitations ?? [])])
  });
}

function coversFields(implementation, requestedFields) {
  if (requestedFields.length === 0 || implementation.supportedFields === null) return true;
  const supported = new Set(implementation.supportedFields);
  return requestedFields.every((field) => supported.has(field));
}

function requirementsAvailable(implementation, evidence) {
  const operations = evidence.operations ? new Set(evidence.operations) : null;
  const functions = evidence.functions ? new Set(evidence.functions) : null;
  if (operations && implementation.requiredOperations.some((name) => !operations.has(name))) return false;
  if (functions && implementation.requiredFunctions.some((name) => !functions.has(name))) return false;
  return true;
}

export class CapabilityRegistry {
  constructor(descriptors = []) {
    this.descriptors = new Map();
    for (const descriptor of descriptors) this.register(descriptor);
  }

  register(descriptor) {
    if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) {
      throw new TypeError('Capability descriptor must be an object.');
    }
    const capability = assertNonEmptyString(descriptor.capability, 'capability');
    const implementations = (descriptor.implementations ?? []).map((entry) =>
      normalizeImplementation(capability, entry));
    this.descriptors.set(capability, Object.freeze({
      ...descriptor,
      capability,
      effects: Object.freeze([...(descriptor.effects ?? [])]),
      implementations: Object.freeze(implementations)
    }));
    return this;
  }

  get(capability) {
    return this.descriptors.get(capability) ?? null;
  }

  list() {
    return [...this.descriptors.values()];
  }

  resolve(capability, {
    requestedFields = [],
    provider = 'auto',
    providerPreference = ['moodlia', 'core'],
    evidenceByProvider = {},
    allowExperimental = false,
    allowPartial = false
  } = {}) {
    const descriptor = this.get(capability);
    if (!descriptor) {
      return { status: 'unsupported', capability, reason: 'capability_not_registered', candidates: [] };
    }
    const providerRank = new Map(providerPreference.map((name, index) => [name, providerPreference.length - index]));
    const candidates = descriptor.implementations
      .filter((entry) => provider === 'auto' || entry.provider === provider)
      .map((entry) => {
        const evidence = evidenceByProvider[entry.provider] ?? {};
        const providerAvailable = evidence.available !== false;
        const requirementsSatisfied = providerAvailable && requirementsAvailable(entry, evidence);
        const fieldsSatisfied = coversFields(entry, requestedFields);
        const stabilitySatisfied = entry.stability !== 'experimental' || allowExperimental;
        const fidelitySatisfied = entry.fidelity === 'exact' || (entry.fidelity === 'partial' && allowPartial);
        return {
          ...entry,
          eligible: requirementsSatisfied && fieldsSatisfied && stabilitySatisfied && fidelitySatisfied,
          evidence,
          rejectionReasons: [
            ...(!providerAvailable ? ['provider_unavailable'] : []),
            ...(providerAvailable && !requirementsSatisfied ? ['requirements_unavailable'] : []),
            ...(!fieldsSatisfied ? ['requested_fields_unsupported'] : []),
            ...(!stabilitySatisfied ? ['experimental_not_allowed'] : []),
            ...(!fidelitySatisfied ? ['fidelity_not_allowed'] : [])
          ]
        };
      })
      .sort((left, right) =>
        (fidelityPriority[right.fidelity] - fidelityPriority[left.fidelity])
        || ((providerRank.get(right.provider) ?? 0) - (providerRank.get(left.provider) ?? 0)));
    const selected = candidates.find((entry) => entry.eligible);
    if (!selected) {
      return { status: 'unsupported', capability, reason: 'no_eligible_implementation', candidates };
    }
    return {
      status: 'supported',
      capability,
      selected,
      candidates,
      effects: descriptor.effects
    };
  }
}

export function createCapabilityRegistry(descriptors = []) {
  return new CapabilityRegistry(descriptors);
}

export const coreCapabilityDescriptors = Object.freeze([
  {
    capability: 'course.read',
    effects: ['content.read'],
    implementations: [{
      provider: 'core',
      operation: 'get_course',
      fidelity: 'exact',
      supportedFields: ['fullname', 'shortname', 'category_id', 'idnumber', 'summary', 'visible', 'start_date', 'end_date'],
      requiredOperations: ['get_course']
    }]
  },
  {
    capability: 'course.update',
    effects: ['content.write'],
    implementations: [{
      provider: 'core',
      operation: 'update_course',
      fidelity: 'exact',
      supportedFields: ['fullname', 'shortname', 'category_id', 'idnumber', 'summary', 'visible', 'start_date', 'end_date'],
      requiredOperations: ['update_course']
    }]
  },
  {
    capability: 'course.structure.read',
    effects: ['content.read'],
    implementations: [{
      provider: 'core',
      operation: 'get_course_contents',
      fidelity: 'partial',
      supportedFields: ['name', 'summary', 'visible', 'order', 'modules'],
      requiredOperations: ['get_course_contents'],
      limitations: ['Activity-specific authoring fields may not be exposed by Core course contents.']
    }]
  },
  {
    capability: 'group.structure.read',
    effects: ['content.read'],
    implementations: [{
      provider: 'core',
      workflow: ['get_course_groups', 'get_course_groupings'],
      fidelity: 'exact',
      requiredOperations: ['get_course_groups', 'get_course_groupings']
    }]
  },
  {
    capability: 'group.create',
    effects: ['content.write'],
    implementations: [{
      provider: 'core',
      operation: 'create_group',
      fidelity: 'exact',
      supportedFields: ['name', 'description', 'idnumber', 'visibility', 'participation'],
      requiredOperations: ['create_group']
    }]
  }
]);
