import { contentDigest } from '../sync/canonical.mjs';

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw new TypeError(`${name} must be a positive integer.`);
  return number;
}

function userRoles(user) {
  return (user.roles ?? []).map((role) => Number(role.roleid ?? role.id)).filter(Number.isInteger);
}

function safeError(error) {
  return { code: String(error?.code ?? 'unavailable'), message: String(error?.message ?? 'Read unavailable.') };
}

async function observed(read) {
  try {
    return { available: true, value: await read() };
  } catch (error) {
    return { available: false, error: safeError(error) };
  }
}

export async function auditCourse(client, { courseId }) {
  const course_id = positiveInteger(courseId, 'courseId');
  const [course, sections] = await Promise.all([
    client.callOperation('get_course', { course_id }),
    client.callOperation('get_course_contents', { course_id })
  ]);
  const modules = sections.flatMap((section) => section.modules ?? []);
  const findings = [];
  if (course.visible === false || Number(course.visible) === 0) {
    findings.push({ severity: 'warning', code: 'course_hidden', entity: `course:${course_id}` });
  }
  if (!String(course.summary ?? '').replace(/<[^>]*>/g, '').trim()) {
    findings.push({ severity: 'info', code: 'course_summary_empty', entity: `course:${course_id}` });
  }
  if (modules.length === 0) {
    findings.push({ severity: 'warning', code: 'course_has_no_modules', entity: `course:${course_id}` });
  }
  for (const section of sections) {
    const sectionId = Number(section.id ?? section.section ?? 0);
    if (section.visible === 0 || section.visible === false) {
      findings.push({ severity: 'info', code: 'section_hidden', entity: `section:${sectionId}` });
    }
    for (const module of section.modules ?? []) {
      if (module.visible === 0 || module.visible === false || module.uservisible === false) {
        findings.push({ severity: 'info', code: 'module_hidden_or_restricted', entity: `module:${Number(module.id)}` });
      }
    }
  }
  return {
    schema_version: 1,
    course,
    inventory: {
      sections: sections.length,
      modules: modules.length,
      hidden_sections: findings.filter((entry) => entry.code === 'section_hidden').length,
      hidden_or_restricted_modules: findings.filter((entry) => entry.code === 'module_hidden_or_restricted').length
    },
    evidence: {
      course: { available: true, operation: 'get_course' },
      structure: { available: true, operation: 'get_course_contents' },
      authoring_fields: { available: false, reason: 'core_course_contents_is_not_a_complete_authoring_export' }
    },
    findings
  };
}

export async function getCourseProgressReport(client, { courseId, userIds = [], maximumUsers = 100 }) {
  const course_id = positiveInteger(courseId, 'courseId');
  const maximum = positiveInteger(maximumUsers, 'maximumUsers');
  const selected = new Set(userIds.map((id) => positiveInteger(id, 'userIds')));
  const enrolled = await client.callOperation('get_enrolled_users', { course_id });
  const users = selected.size === 0
    ? enrolled
    : enrolled.filter((user) => selected.has(Number(user.id)));
  const visibleUserIds = new Set(users.map((user) => Number(user.id)));
  if (users.length > maximum) {
    throw new TypeError(`Progress report contains ${users.length} users, above the maximumUsers limit of ${maximum}.`);
  }
  const rows = await Promise.all(users.map(async (user) => {
    const user_id = positiveInteger(user.id, 'user.id');
    const [activities, completion, grades] = await Promise.all([
      observed(() => client.callOperation('get_activity_completion_statuses', { course_id, user_id })),
      observed(() => client.callOperation('get_course_completion_status', { course_id, user_id })),
      observed(() => client.callOperation('get_user_course_grades', { user_id }))
    ]);
    const courseGrade = grades.available
      ? (grades.value.grades ?? grades.value).find?.((grade) => Number(grade.courseid ?? grade.course_id) === course_id) ?? null
      : null;
    return {
      user_id,
      full_name: String(user.fullname ?? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim()),
      activity_completion: activities,
      course_completion: completion,
      course_grade: grades.available ? { available: true, value: courseGrade } : grades
    };
  }));
  return {
    schema_version: 1,
    course_id,
    completeness: selected.size === 0 ? 'all_visible_enrolled_users' : 'selected_visible_enrolled_users',
    missing_user_ids: [...selected].filter((userId) => !visibleUserIds.has(userId)),
    users: rows
  };
}

export async function auditCourseCompletion(client, { courseId }) {
  const course_id = positiveInteger(courseId, 'courseId');
  const sections = await client.callOperation('get_course_contents', { course_id });
  const modules = sections.flatMap((section) => (section.modules ?? []).map((module) => ({
    module_id: Number(module.id ?? module.module_id),
    name: String(module.name ?? ''),
    module_type: String(module.modname ?? module.module_type ?? ''),
    visible: module.visible !== false && Number(module.visible ?? 1) !== 0,
    completion_observation: Object.hasOwn(module, 'completion')
      ? { available: true, value: module.completion }
      : { available: false, reason: 'not_exposed_by_core_course_contents' }
  })));
  return {
    schema_version: 1,
    course_id,
    provider: 'core',
    inventory: { sections: sections.length, modules: modules.length },
    modules,
    evidence: {
      structure: { available: true, operation: 'get_course_contents' },
      completion_configuration: {
        available: false,
        reason: 'core_has_no_verified_activity_completion_configuration_authoring_api'
      }
    },
    findings: [{
      severity: 'warning',
      code: 'completion_configuration_unavailable',
      entity: `course:${course_id}`,
      message: 'Core course contents do not provide a verified round-trip completion configuration surface.'
    }]
  };
}

export function planCourseCompletionRepair(audit, { mode = 'book_view_only' } = {}) {
  if (!audit || audit.schema_version !== 1 || !Number.isInteger(Number(audit.course_id))) {
    throw new TypeError('A valid completion audit is required.');
  }
  const allowedModes = new Set(['book_view_only', 'all_grade_to_view', 'disable_all']);
  if (!allowedModes.has(mode)) throw new TypeError('Unsupported completion repair mode.');
  const unsigned = {
    schema_version: 1,
    workflow: 'course_completion_repair',
    provider: 'core',
    course_id: Number(audit.course_id),
    mode,
    applicable: false,
    actions: [],
    unsupported: [{
      capability: 'completion.configuration.update',
      reason: 'core_has_no_verified_activity_completion_configuration_authoring_api',
      remedy: 'Install MoodlIA and use its typed repair_course_completion operation.'
    }]
  };
  return { ...unsigned, digest: contentDigest(unsigned) };
}

export async function planManualEnrolmentSync(client, { courseId, desired }) {
  const course_id = positiveInteger(courseId, 'courseId');
  if (!Array.isArray(desired)) throw new TypeError('desired must be an array.');
  const normalized = desired.map((entry) => ({
    user_id: positiveInteger(entry.user_id, 'desired.user_id'),
    role_id: positiveInteger(entry.role_id, 'desired.role_id'),
    ...(entry.start_time === undefined ? {} : { start_time: Number(entry.start_time) }),
    ...(entry.end_time === undefined ? {} : { end_time: Number(entry.end_time) }),
    ...(entry.suspended === undefined ? {} : { suspended: Boolean(entry.suspended) })
  }));
  const seen = new Set();
  for (const entry of normalized) {
    const key = `${entry.user_id}:${entry.role_id}`;
    if (seen.has(key)) throw new TypeError(`Duplicate desired enrolment: ${key}.`);
    seen.add(key);
  }
  const enrolled = await client.callOperation('get_enrolled_users', { course_id });
  const current = new Set(enrolled.flatMap((user) => userRoles(user).map((roleId) => `${Number(user.id)}:${roleId}`)));
  const actions = normalized.filter((entry) => !current.has(`${entry.user_id}:${entry.role_id}`)).map((entry) => ({
    kind: 'enrolment.add',
    parameters: { course_id, ...entry }
  }));
  const unchanged = normalized.filter((entry) => current.has(`${entry.user_id}:${entry.role_id}`));
  const unsigned = {
    schema_version: 1,
    mode: 'add_only',
    course_id,
    actions,
    unchanged,
    removals: [],
    limitations: ['existing_enrolments_are_never_removed', 'visible_roles_only']
  };
  return { ...unsigned, digest: contentDigest(unsigned) };
}

export async function applyManualEnrolmentSync(client, plan, { planDigest }) {
  if (!plan || plan.schema_version !== 1 || plan.mode !== 'add_only') throw new TypeError('Invalid enrolment plan.');
  const { digest, ...unsigned } = plan;
  const expected = contentDigest(unsigned);
  if (digest !== expected || planDigest !== expected) throw new TypeError('The enrolment plan digest does not match.');
  const enrolled = await client.callOperation('get_enrolled_users', { course_id: plan.course_id });
  const current = new Set(enrolled.flatMap((user) => userRoles(user).map((roleId) => `${Number(user.id)}:${roleId}`)));
  const results = [];
  const skipped = [];
  for (const action of plan.actions ?? []) {
    if (action.kind !== 'enrolment.add') throw new TypeError(`Unsupported enrolment action: ${action.kind}.`);
    const key = `${action.parameters.user_id}:${action.parameters.role_id}`;
    if (current.has(key)) {
      skipped.push({ ...action.parameters, reason: 'already_enrolled_at_apply' });
      continue;
    }
    results.push(await client.callOperation('enrol_user', action.parameters));
    current.add(key);
  }
  return { schema_version: 1, course_id: plan.course_id, applied: results.length, skipped, results };
}
