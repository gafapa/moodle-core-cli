import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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

test('enrolment sync CLI saves a new plan file, refuses to overwrite it, and applies it by digest', async () => {
  const { createServer } = await import('node:http');
  const { runEnrolmentSync } = await import('../cli/workflow-commands.mjs');
  const calls = [];
  const server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
    const functionName = body.get('wsfunction');
    calls.push(functionName);
    response.setHeader('content-type', 'application/json');
    if (functionName === 'core_enrol_get_enrolled_users') {
      response.end(JSON.stringify([{ id: 5, fullname: 'Existing', roles: [{ roleid: 5 }] }]));
      return;
    }
    response.end('null');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'moodle-core-enrol-'));
  try {
    const desiredPath = path.join(directory, 'desired.json');
    const planPath = path.join(directory, 'plans', 'enrolments.json');
    fs.writeFileSync(desiredPath, JSON.stringify([{ user_id: 5, role_id: 5 }, { user_id: 9, role_id: 5 }]));
    const connection = {
      url: `http://127.0.0.1:${server.address().port}`,
      token: 'enrol-token',
      moodle_version: '5.2',
      course_id: '42'
    };
    const planned = await runEnrolmentSync({ ...connection, desired_file: desiredPath, plan_file: planPath });
    assert.equal(planned.plan_path, planPath);
    assert.equal(planned.actions.length, 1);
    assert.deepEqual(planned.unchanged.map((entry) => entry.user_id), [5]);
    const saved = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    assert.equal(saved.digest, planned.digest);
    await assert.rejects(
      () => runEnrolmentSync({ ...connection, desired_file: desiredPath, plan_file: planPath }),
      { code: 'EEXIST' }
    );
    await assert.rejects(
      () => runEnrolmentSync({ ...connection, apply_plan: planPath, plan_digest: saved.digest }),
      { code: 'validation_error' }
    );
    const applied = await runEnrolmentSync({
      ...connection,
      apply_plan: planPath,
      plan_digest: saved.digest,
      allow_write: true,
      yes: true
    });
    assert.equal(applied.applied, 1);
    assert.ok(calls.includes('enrol_manual_enrol_users'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('synchronization commands point to the moodlia-sync package', () => {
  for (const command of [['course', 'sync'], ['sync-course'], ['sync', 'status', '--job-id', 'x']]) {
    const result = spawnSync(process.execPath, [path.resolve('cli/moodle-core.mjs'), ...command], { encoding: 'utf8' });
    assert.equal(result.status, 3, command.join(' '));
    const error = JSON.parse(result.stderr);
    assert.equal(error.code, 'unsupported_operation');
    assert.match(error.message, /moodlia-sync/);
  }
});
