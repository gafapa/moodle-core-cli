import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  applyManualEnrolmentSync,
  auditCourseCompletion,
  auditCourse,
  getCourseProgressReport,
  planCourseCompletionRepair,
  planManualEnrolmentSync
} from '../workflows/index.mjs';

function fakeClient(handlers) {
  return {
    calls: [],
    async callOperation(name, parameters) {
      this.calls.push({ name, parameters });
      if (!handlers[name]) throw new Error(`Unexpected operation: ${name}`);
      return handlers[name](parameters);
    }
  };
}

test('course audit reports visible evidence and does not infer hidden authoring fields', async () => {
  const client = fakeClient({
    get_course: () => ({ id: 7, fullname: 'Course', summary: '', visible: false }),
    get_course_contents: () => [{
      id: 10, visible: false,
      modules: [{ id: 20, visible: true, uservisible: false }]
    }]
  });
  const report = await auditCourse(client, { courseId: 7 });
  assert.deepEqual(report.findings.map((entry) => entry.code), [
    'course_hidden', 'course_summary_empty', 'section_hidden', 'module_hidden_or_restricted'
  ]);
  assert.equal(report.evidence.authoring_fields.available, false);
  assert.equal(report.inventory.modules, 1);
});

test('progress report preserves unavailable fields as unknown evidence', async () => {
  const client = fakeClient({
    get_enrolled_users: () => [{ id: 3, fullname: 'Ada Lovelace' }],
    get_activity_completion_statuses: () => ({ statuses: [{ cmid: 20, state: 1 }] }),
    get_course_completion_status: () => { const error = new Error('Denied'); error.code = 'permission_denied'; throw error; },
    get_user_course_grades: () => ({ grades: [{ courseid: 7, grade: '85.00' }] })
  });
  const report = await getCourseProgressReport(client, { courseId: 7 });
  assert.equal(report.users[0].activity_completion.available, true);
  assert.equal(report.users[0].course_completion.available, false);
  assert.equal(report.users[0].course_completion.error.code, 'permission_denied');
  assert.equal(report.users[0].course_grade.value.grade, '85.00');
});

test('Core completion audit reports evidence and repair remains an explicit capability gap', async () => {
  const client = fakeClient({
    get_course_contents: () => [{
      id: 10,
      modules: [
        { id: 20, name: 'Book', modname: 'book', visible: true, completion: 2 },
        { id: 21, name: 'Page', modname: 'page', visible: true }
      ]
    }]
  });
  const audit = await auditCourseCompletion(client, { courseId: 7 });
  assert.equal(audit.inventory.modules, 2);
  assert.equal(audit.modules[0].completion_observation.available, true);
  assert.equal(audit.modules[1].completion_observation.available, false);
  assert.equal(audit.evidence.completion_configuration.available, false);

  const plan = planCourseCompletionRepair(audit, { mode: 'book_view_only' });
  assert.equal(plan.applicable, false);
  assert.equal(plan.actions.length, 0);
  assert.equal(plan.unsupported[0].capability, 'completion.configuration.update');
  assert.match(plan.digest, /^sha256:/);
});

test('manual enrolment synchronization is add-only and digest-bound', async () => {
  const client = fakeClient({
    get_enrolled_users: () => [{ id: 3, roles: [{ roleid: 5 }] }],
    enrol_user: (parameters) => ({ enrolled: true, ...parameters })
  });
  const plan = await planManualEnrolmentSync(client, {
    courseId: 7,
    desired: [{ user_id: 3, role_id: 5 }, { user_id: 4, role_id: 5 }]
  });
  assert.equal(plan.mode, 'add_only');
  assert.equal(plan.actions.length, 1);
  assert.deepEqual(plan.removals, []);
  await assert.rejects(
    () => applyManualEnrolmentSync(client, plan, { planDigest: 'sha256:wrong' }),
    /digest does not match/
  );
  const result = await applyManualEnrolmentSync(client, plan, { planDigest: plan.digest });
  assert.equal(result.applied, 1);
  assert.deepEqual(result.skipped, []);
  assert.equal(client.calls.filter((call) => call.name === 'enrol_user').length, 1);
});

test('manual enrolment apply reconciles a concurrent successful enrolment', async () => {
  let reads = 0;
  const client = fakeClient({
    get_enrolled_users: () => reads++ === 0 ? [] : [{ id: 4, roles: [{ roleid: 5 }] }],
    enrol_user: () => { throw new Error('Must not replay an already satisfied action.'); }
  });
  const plan = await planManualEnrolmentSync(client, {
    courseId: 7,
    desired: [{ user_id: 4, role_id: 5 }]
  });
  const result = await applyManualEnrolmentSync(client, plan, { planDigest: plan.digest });
  assert.equal(result.applied, 0);
  assert.equal(result.skipped[0].reason, 'already_enrolled_at_apply');
});

test('CLI exposes evidence workflows and add-only enrolment planning', () => {
  for (const command of [
    ['course', 'audit', '--help'],
    ['course', 'progress', '--help'],
    ['course', 'completion', 'audit', '--help'],
    ['course', 'completion', 'repair', '--help'],
    ['enrolments', 'sync', '--help']
  ]) {
    const result = spawnSync(process.execPath, [path.resolve('cli/moodle-core.mjs'), ...command], {
      encoding: 'utf8'
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage: moodle-core/);
  }
});

test('CLI exposes grouped synchronization lifecycle aliases', () => {
  const help = spawnSync(process.execPath, [path.resolve('cli/moodle-core.mjs'), 'sync', 'status', '--help'], {
    cwd: path.resolve('.'), encoding: 'utf8'
  });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /sync resume --job-id/);
  assert.match(help.stdout, /sync verify --plan-id/);
});

test('CLI awaits asynchronous sync work before closing durable state', () => {
  const source = fs.readFileSync(path.resolve('cli/sync-commands.mjs'), 'utf8');
  assert.doesNotMatch(source, /return engine\.(?:apply|verify)\(/);
  assert.equal((source.match(/return await engine\.(?:apply|verify)\(/g) ?? []).length, 3);
});
