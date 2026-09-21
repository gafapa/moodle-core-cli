import fs from 'node:fs';
import path from 'node:path';
import { createMoodleClient, MoodleValidationError } from '../client/moodle-rest-client.mjs';
import {
  applyManualEnrolmentSync,
  auditCourseCompletion,
  auditCourse,
  getCourseProgressReport,
  planCourseCompletionRepair,
  planManualEnrolmentSync
} from '../workflows/index.mjs';

function required(options, name) {
  const value = options[name];
  if (value === undefined || value === true || String(value).trim() === '') {
    throw new MoodleValidationError(`--${name.replaceAll('_', '-')} is required.`, { parameter: name });
  }
  return String(value);
}

function positiveInteger(options, name, fallback) {
  const value = options[name] === undefined ? fallback : Number(options[name]);
  if (!Number.isInteger(value) || value <= 0) {
    throw new MoodleValidationError(`--${name.replaceAll('_', '-')} must be a positive integer.`, { parameter: name });
  }
  return value;
}

function booleanOption(options, name) {
  const value = options[name];
  if (value === undefined) return false;
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  throw new MoodleValidationError(`--${name.replaceAll('_', '-')} must be true or false.`, { parameter: name });
}

function readJson(filePath, label) {
  const resolved = path.resolve(required({ value: filePath }, 'value'));
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    throw new MoodleValidationError(`Unable to read ${label}: ${resolved}`, { file_path: resolved }, error);
  }
}

function client(options, { allowWrite = false } = {}) {
  return createMoodleClient({
    baseUrl: options.url ?? process.env.MOODLE_BASE_URL,
    token: options.token ?? process.env.MOODLE_TOKEN,
    moodleVersion: options.moodle_version ?? process.env.MOODLE_VERSION,
    allowInsecure: booleanOption(options, 'allow_insecure'),
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
    if (!booleanOption(options, 'allow_write') || !booleanOption(options, 'yes')) {
      throw new MoodleValidationError('Applying an enrolment plan requires --allow-write and --yes.');
    }
    const plan = readJson(options.apply_plan, 'enrolment plan');
    return applyManualEnrolmentSync(client(options, { allowWrite: true }), plan, {
      planDigest: required(options, 'plan_digest')
    });
  }
  const desired = readJson(required(options, 'desired_file'), 'desired enrolments');
  const plan = await planManualEnrolmentSync(client(options), {
    courseId: positiveInteger(options, 'course_id'),
    desired
  });
  if (options.plan_file !== undefined) {
    const outputPath = path.resolve(required(options, 'plan_file'));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true, mode: 0o700 });
    fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    return { ...plan, plan_path: outputPath };
  }
  return plan;
}
