import { coreErrors, createMoodleClient, MoodleValidationError } from '../client/moodle-rest-client.mjs';
import {
  booleanOption,
  positiveIntegerOption,
  readJsonFile,
  requiredOption,
  writeNewJsonFile
} from './options.mjs';
import {
  applyManualEnrolmentSync,
  auditCourseCompletion,
  auditCourse,
  getCourseProgressReport,
  planCourseCompletionRepair,
  planManualEnrolmentSync
} from '../workflows/index.mjs';

function required(options, name) {
  return requiredOption(options, name, coreErrors);
}

function positiveInteger(options, name, fallback) {
  return positiveIntegerOption(options, name, { fallback, errors: coreErrors });
}

function booleanFlag(options, name) {
  return booleanOption(options, name, coreErrors);
}

function client(options, { allowWrite = false } = {}) {
  return createMoodleClient({
    baseUrl: options.url ?? process.env.MOODLE_BASE_URL,
    token: options.token ?? process.env.MOODLE_TOKEN,
    moodleVersion: options.moodle_version ?? process.env.MOODLE_VERSION,
    allowInsecure: booleanFlag(options, 'allow_insecure'),
    readOnly: !allowWrite,
    allowedOperations: allowWrite ? ['get_enrolled_users', 'enrol_user'] : null
  });
}

export function printCourseAuditHelp() {
  console.log('Usage: moodle-core course audit --course-id <id> [options]');
  console.log('       moodle-core audit-course --course-id <id> [options]');
  console.log('');
  console.log('Reads course metadata and structure without recording view events.');
  console.log('Unavailable authoring fields remain explicit in the evidence.');
}

export function printCourseProgressHelp() {
  console.log('Usage: moodle-core course progress --course-id <id> [options]');
  console.log('');
  console.log('  --user-ids <ids>            Optional comma-separated Moodle user IDs');
  console.log('  --maximum-users <n>         Safety limit (default: 100)');
}

export function printCourseCompletionAuditHelp() {
  console.log('Usage: moodle-core course completion audit --course-id <id> [options]');
  console.log('');
  console.log('Reports the completion evidence exposed by Core and marks unavailable configuration explicitly.');
}

export function printCourseCompletionRepairHelp() {
  console.log('Usage: moodle-core course completion repair --course-id <id> [options]');
  console.log('');
  console.log('  --mode <mode>               book_view_only, all_grade_to_view, or disable_all');
  console.log('Core has no verified configuration authoring API, so this command returns a capability-gap plan.');
}

export function printEnrolmentSyncHelp() {
  console.log('Usage: moodle-core enrolments sync --course-id <id> --desired-file <path> [options]');
  console.log('');
  console.log('Planning is read-only and add-only. Existing enrolments are never removed.');
  console.log('  --plan-file <path>          Save the immutable JSON plan without overwriting');
  console.log('  --apply-plan <path>         Apply a previously saved plan');
  console.log('  --plan-digest <sha256>      Required exact digest for apply');
  console.log('  --allow-write --yes         Required together for apply');
}

export async function runCourseAudit(options) {
  return auditCourse(client(options), { courseId: positiveInteger(options, 'course_id') });
}

export async function runCourseProgress(options) {
  const userIds = options.user_ids === undefined
    ? []
    : String(options.user_ids).split(',').filter(Boolean).map((value) => Number(value.trim()));
  return getCourseProgressReport(client(options), {
    courseId: positiveInteger(options, 'course_id'),
    userIds,
    maximumUsers: positiveInteger(options, 'maximum_users', 100)
  });
}

export async function runCourseCompletionAudit(options) {
  return auditCourseCompletion(client(options), { courseId: positiveInteger(options, 'course_id') });
}

export async function runCourseCompletionRepair(options) {
  const audit = await auditCourseCompletion(client(options), {
    courseId: positiveInteger(options, 'course_id')
  });
  return planCourseCompletionRepair(audit, { mode: options.mode ?? 'book_view_only' });
}

export async function runEnrolmentSync(options) {
  if (options.apply_plan !== undefined) {
    if (!booleanFlag(options, 'allow_write') || !booleanFlag(options, 'yes')) {
      throw new MoodleValidationError('Applying an enrolment plan requires --allow-write and --yes.');
    }
    const plan = readJsonFile(options.apply_plan, 'enrolment plan', coreErrors);
    return applyManualEnrolmentSync(client(options, { allowWrite: true }), plan, {
      planDigest: required(options, 'plan_digest')
    });
  }
  const desired = readJsonFile(required(options, 'desired_file'), 'desired enrolments', coreErrors);
  const plan = await planManualEnrolmentSync(client(options), {
    courseId: positiveInteger(options, 'course_id'),
    desired
  });
  if (options.plan_file !== undefined) {
    return { ...plan, plan_path: writeNewJsonFile(required(options, 'plan_file'), plan) };
  }
  return plan;
}
