import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

import { CapabilityRegistry, coreCapabilityDescriptors } from '../capabilities/registry.mjs';
import { parseProfiles, resolveProfile, describeProfile } from '../profiles/profiles.mjs';
import {
  createCourseSyncEngine,
  createCourseSyncModel,
  createCourseSyncPlan,
  courseBindingId,
  contentDigest,
  MemorySyncStateStore,
  SqliteSyncStateStore,
  validateSyncPlan,
  rewriteMoodleHtmlReferences,
  resolveDeferredMoodleReferences
} from '../sync/index.mjs';

function model({
  provider = 'core', siteUrl, courseId, fullname, shortname, visible = true,
  sections = [], groups = [], groupings = []
}) {
  return createCourseSyncModel({
    site: { provider, site_url: siteUrl, moodle_version: '5.3' },
    course: { id: courseId, fullname, shortname, visible },
    sections,
    groups,
    groupings
  });
}

test('capability resolution checks fields and live operation evidence', () => {
  const registry = new CapabilityRegistry(coreCapabilityDescriptors);
  const supported = registry.resolve('course.update', {
    provider: 'core',
    requestedFields: ['fullname', 'summary'],
    evidenceByProvider: { core: { available: true, operations: ['update_course'] } }
  });
  assert.equal(supported.status, 'supported');
  assert.equal(supported.selected.operation, 'update_course');

  const missing = registry.resolve('course.update', {
    provider: 'core',
    evidenceByProvider: { core: { available: true, operations: [] } }
  });
  assert.equal(missing.status, 'unsupported');
  assert.deepEqual(missing.candidates[0].rejectionReasons, ['requirements_unavailable']);
});

test('sync model v2 distinguishes unknown, null, and empty fields with owned assets', () => {
  const snapshot = createCourseSyncModel({
    site: { provider: 'moodlia', site_url: 'https://source.example' },
    course: { id: 7, fullname: 'Course', shortname: 'COURSE', summary: '', idnumber: null },
    sections: [{
      id: 10,
      section: 0,
      name: '',
      modules: [{
        id: 20,
        modname: 'page',
        name: 'Page',
        authoring_completeness: 'complete',
        authoring: {
          kind: 'page',
          settings: { content: '<img src="@@PLUGINFILE@@/hero.png">', content_format: 1 },
          files: [{ filename: 'hero.png', filepath: '/', filesize: 3, sha256: 'abc' }]
        }
      }]
    }],
    losses: [{ scope: 'custom_field', reason: 'not_readable' }],
    unknowns: [{ scope: 'hidden_modules', reason: 'permission_limited' }]
  });

  assert.equal(snapshot.schema_version, 2);
  assert.equal(snapshot.course.field_states.summary, 'explicit_empty');
  assert.equal(snapshot.course.field_states.idnumber, 'explicit_null');
  assert.equal(snapshot.course.field_states.visible, 'unknown');
  assert.equal(snapshot.assets[0].owner.field, 'files');
  assert.equal(snapshot.assets[0].logical_path, '/hero.png');
  assert.match(snapshot.assets[0].asset_key, /^asset:/);
  assert.equal(snapshot.losses[0].reason, 'not_readable');
  assert.equal(snapshot.unknowns[0].reason, 'permission_limited');
});

test('HTML reference resolver rewrites mapped links and defers newly created entities', () => {
  const source = model({
    siteUrl: 'https://source.example/moodle', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, modules: [
      { id: 20, modname: 'page', name: 'Mapped' },
      { id: 21, modname: 'book', name: 'New book', authoring: {
        chapters: [{ chapter_id: 30, title: 'Chapter' }]
      } }
    ] }]
  });
  const target = model({
    siteUrl: 'https://target.example/learn', courseId: 8, fullname: 'Course', shortname: 'COURSE'
  });
  const result = rewriteMoodleHtmlReferences(
    '<a href="https://source.example/moodle/mod/page/view.php?id=20">Page</a>'
      + '<img srcset="https://cdn.example/a.png 1x, https://source.example/moodle/mod/book/view.php?id=21&amp;chapterid=30 2x">',
    {
      sourceSiteUrl: source.site.site_url,
      targetSiteUrl: target.site.site_url,
      sourceModel: source,
      targetModel: target,
      mapping: { modules: { 'module:20': 40 } }
    }
  );
  assert.match(result.html, /https:\/\/target\.example\/learn\/mod\/page\/view\.php\?id=40/);
  assert.match(result.html, /moodlia-sync:\/\/chapters\/chapter%3A30/);
  assert.deepEqual(result.reference_source_keys, ['chapter:30', 'module:21']);
  const resolved = resolveDeferredMoodleReferences(result.html, {
    targetSiteUrl: target.site.site_url,
    mapping: {},
    createdEntities: new Map([
      ['modules:module:21', { module_id: 41 }],
      ['chapters:chapter:30', { chapter_id: 50 }]
    ])
  });
  assert.match(resolved, /https:\/\/target\.example\/learn\/mod\/book\/view\.php\?id=41&chapterid=50/);
});

test('HTML reference resolver preserves external links and reports token-bearing source URLs', () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE' });
  const target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE' });
  const result = rewriteMoodleHtmlReferences(
    '<a href="https://external.example/mod/page/view.php?id=9">External</a>'
      + '<img style="background:url(https://source.example/mod/page/view.php?id=9&amp;wstoken=secret)">',
    { sourceSiteUrl: source.site.site_url, targetSiteUrl: target.site.site_url, sourceModel: source, targetModel: target }
  );
  assert.match(result.html, /external\.example/);
  assert.equal(result.blocked[0].reason, 'token_bearing_url');
});

test('planner makes portable content depend on newly created linked activities', () => {
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, modules: [
      { id: 20, modname: 'page', name: 'Destination', authoring_completeness: 'complete',
        authoring: { kind: 'page', settings: { content: '<p>Destination</p>', content_format: 1 }, files: [] } },
      { id: 21, modname: 'label', name: 'Link', authoring_completeness: 'complete',
        authoring: { kind: 'label', settings: {
          content: '<a href="https://source.example/mod/page/view.php?id=20">Open</a>', content_format: 1
        }, files: [] } }
    ] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: { module_create: { available: true, supported_fields: ['module_type', 'name', 'visible', 'settings'] } }
  });
  const destination = plan.actions.find((action) => action.source_key === 'module:20');
  const link = plan.actions.find((action) => action.source_key === 'module:21');
  assert.match(link.fields.settings.content, /moodlia-sync:\/\/modules\/module%3A20/);
  assert.deepEqual(link.depends_on, [destination.action_id]);
});

test('Book chapters and assignment editors depend on newly created linked activities', () => {
  const linkedUrl = 'https://source.example/mod/page/view.php?id=20';
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, modules: [
      { id: 20, modname: 'page', name: 'Destination', authoring_completeness: 'complete',
        authoring: { kind: 'page', settings: { content: '<p>Destination</p>', content_format: 1 }, files: [] } },
      { id: 21, modname: 'book', name: 'Book', authoring_completeness: 'complete',
        authoring: { kind: 'book', settings: {}, chapters: [{
          chapter_id: 30, title: 'Chapter', content: `<a href="${linkedUrl}">Page</a>`, content_format: 1
        }] } },
      { id: 22, modname: 'assign', name: 'Task', authoring_completeness: 'complete',
        authoring: { kind: 'assignment', settings: {}, content: {
          intro: `<a href="${linkedUrl}">Intro</a>`, intro_format: 1,
          activity: `<a href="${linkedUrl}">Instructions</a>`, activity_format: 1
        }, losses: [] } }
    ] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: {
      module_create: { available: true, supported_fields: ['module_type', 'name', 'visible', 'settings'] },
      book_chapter_create: {
        available: true,
        supported_fields: ['title', 'content', 'content_format', 'subchapter', 'hidden', 'order']
      }
    }
  });
  const destination = plan.actions.find((action) => action.source_key === 'module:20');
  const chapter = plan.actions.find((action) => action.source_key === 'chapter:30');
  const assignment = plan.actions.find((action) => action.source_key === 'module:22');
  assert.match(chapter.fields.content, /moodlia-sync:\/\/modules\/module%3A20/);
  assert.match(assignment.fields.settings.intro, /moodlia-sync:\/\/modules\/module%3A20/);
  assert.match(assignment.fields.settings.activity, /moodlia-sync:\/\/modules\/module%3A20/);
  assert.ok(chapter.depends_on.includes(destination.action_id));
  assert.ok(assignment.depends_on.includes(destination.action_id));
});

test('profiles keep token values outside configuration and descriptions', () => {
  const profiles = parseProfiles({
    schema_version: 1,
    profiles: {
      school: {
        url: 'https://moodle.example/learning/',
        backend: 'auto',
        credentials: {
          core: { token_env: 'SCHOOL_CORE_TOKEN' },
          moodlia: { token_env: 'SCHOOL_MOODLIA_TOKEN' }
        }
      }
    }
  });
  const resolved = resolveProfile(profiles, 'school', {
    SCHOOL_CORE_TOKEN: 'core-secret',
    SCHOOL_MOODLIA_TOKEN: 'moodlia-secret'
  });
  assert.equal(resolved.url, 'https://moodle.example/learning');
  assert.equal(resolved.credentials.core.token, 'core-secret');
  assert.deepEqual(describeProfile(profiles.get('school')), {
    name: 'school',
    url: 'https://moodle.example/learning',
    backend: 'auto',
    credential_providers: ['core', 'moodlia']
  });
  assert.doesNotMatch(JSON.stringify(describeProfile(profiles.get('school'))), /secret/);
});

test('planner is deterministic in content, blocks unsupported structure, and validates its digest', () => {
  const source = model({
    siteUrl: 'https://source.example',
    courseId: 7,
    fullname: 'Source name',
    shortname: 'SOURCE',
    sections: [{ id: 70, section: 1, name: 'Unit 1', summary: '<p>Start</p>' }]
  });
  const target = model({
    siteUrl: 'https://target.example',
    courseId: 8,
    fullname: 'Old name',
    shortname: 'TARGET'
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: { course_update: true, section_create: false },
    unsupportedPolicy: 'error'
  });
  assert.equal(plan.actions.length, 1);
  assert.equal(plan.actions[0].kind, 'course.update');
  assert.equal(plan.unsupported[0].kind, 'section.create');
  assert.equal(plan.applicable, false);
  assert.equal(validateSyncPlan(plan), plan);
  assert.throws(() => validateSyncPlan({ ...plan, applicable: true }), /digest/);
});

test('skip removes dependent actions and degrade accepts only registered transformations', () => {
  const source = model({
    siteUrl: 'https://source.example', courseId: 7, fullname: 'New name', shortname: 'COURSE',
    sections: [{ id: 10, section: 1, name: 'Unit', modules: [{
      id: 20, modname: 'page', name: 'Page', authoring_completeness: 'complete',
      authoring: { settings: { content: '<p>Content</p>' } }
    }] }],
    groups: [{ id: 30, name: 'Group' }],
    groupings: [{ id: 31, name: 'Grouping', group_ids: [30] }]
  });
  const target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old name', shortname: 'COURSE' });
  const skippedPlan = createCourseSyncPlan({
    source,
    target,
    capabilities: { course_update: true, module_create: true, group_create: true, grouping_create: true },
    unsupportedPolicy: 'skip'
  });
  assert.deepEqual(skippedPlan.actions.map((action) => action.kind), ['course.update', 'group.create']);
  assert.ok(skippedPlan.skipped.some((entry) => entry.kind === 'grouping.create'));
  assert.equal(skippedPlan.applicable, true);

  const degradedPlan = createCourseSyncPlan({
    source,
    target,
    capabilities: { course_update: true },
    unsupportedPolicy: 'degrade'
  });
  assert.equal(degradedPlan.applicable, false);
});

test('SQLite state store persists plans, jobs, and bindings without credentials', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-sync-state-'));
  const databasePath = path.join(directory, 'state.sqlite');
  try {
    const store = new SqliteSyncStateStore(databasePath);
    const plan = {
      schema_version: 1,
      plan_id: 'plan-1',
      digest: 'sha256:example',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 60_000).toISOString()
    };
    store.savePlan(plan);
    store.saveJob({ job_id: 'job-1', plan_id: 'plan-1', status: 'queued', updated_at: new Date().toISOString() });
    store.saveBinding({ binding_id: 'binding-1', sections: { 'section:7': 17 } });
    assert.equal(store.acquireLease('binding-1', 'worker-a', new Date(Date.now() + 60_000).toISOString()), true);
    assert.equal(store.acquireLease('binding-1', 'worker-b', new Date(Date.now() + 60_000).toISOString()), false);
    store.releaseLease('binding-1', 'worker-a');
    assert.equal(store.acquireLease('binding-1', 'worker-b', new Date(Date.now() + 60_000).toISOString()), true);
    store.releaseLease('binding-1', 'worker-b');
    assert.deepEqual(store.getPlan('plan-1'), plan);
    assert.equal(store.getJob('job-1').status, 'queued');
    assert.equal(store.getBinding('binding-1').sections['section:7'], 17);
    store.saveApproval({
      plan_id: 'plan-1', digest: 'sha256:example', approved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 60_000).toISOString(), consumed_at: null
    });
    assert.equal(store.consumeApprovalAndSaveJob('plan-1', 'sha256:example', {
      job_id: 'job-2', plan_id: 'plan-1', status: 'queued', updated_at: new Date().toISOString()
    }), true);
    assert.equal(store.consumeApprovalAndSaveJob('plan-1', 'sha256:example', {
      job_id: 'job-3', plan_id: 'plan-1', status: 'queued', updated_at: new Date().toISOString()
    }), false);
    assert.equal(store.listJobs().length, 2);
    store.close();
    const persisted = new SqliteSyncStateStore(databasePath);
    assert.equal(persisted.getPlan('plan-1').digest, 'sha256:example');
    persisted.close();
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('SQLite state store migrates a version 1 database to the current schema', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-sync-migration-'));
  const databasePath = path.join(directory, 'state.sqlite');
  try {
    const legacy = new DatabaseSync(databasePath);
    legacy.exec(`
      CREATE TABLE sync_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      INSERT INTO sync_meta(key, value) VALUES ('schema_version', '1');
    `);
    legacy.close();
    const store = new SqliteSyncStateStore(databasePath);
    assert.equal(store.database.prepare(
      "SELECT value FROM sync_meta WHERE key = 'schema_version'"
    ).get().value, '2');
    assert.deepEqual(store.listJobs(), []);
    store.close();
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('sync engine applies an unchanged approved plan and verifies the target', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'New name', shortname: 'COURSE' });
  let target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old name', shortname: 'COURSE' });
  const applied = [];
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { course_update: true }; },
    async applySyncAction(action) {
      applied.push(action);
      target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: action.fields.fullname, shortname: 'COURSE' });
      return { updated: true };
    }
  };
  const store = new MemorySyncStateStore();
  const engine = createCourseSyncEngine({ stateStore: store });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  const job = await engine.apply({ planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter });
  assert.equal(job.status, 'succeeded');
  assert.equal(applied.length, 1);
  assert.equal(store.getJob(job.job_id).verification.target_digest, target.digest);
});

test('sync engine can create an explicitly named hidden target course from an immutable plan', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Source', shortname: 'SOURCE' });
  const prospective = createCourseSyncModel({
    site: { provider: 'core', site_url: 'https://target.example', moodle_version: '5.3' },
    course: { id: null, fullname: '', shortname: '', category_id: 4, visible: false },
    targetCreation: { category_id: 4, shortname: 'TARGET' }
  });
  let target = null;
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async prepareTargetCourse() { return prospective; },
    async syncCapabilities() { return { course_create: true }; },
    async applySyncAction(action) {
      assert.equal(action.kind, 'course.create');
      assert.equal(action.fields.visible, false);
      target = model({
        siteUrl: 'https://target.example', courseId: 80,
        fullname: action.fields.fullname, shortname: action.fields.shortname, visible: false
      });
      target.course.category_id = 4;
      target.course.start_date = source.course.start_date;
      target.course.end_date = source.course.end_date;
      target.digest = contentDigest({ ...target, extracted_at: undefined, digest: undefined });
      return { course_id: 80 };
    },
    async exportCourse(courseId) { assert.equal(courseId, 80); return target; }
  };
  const store = new MemorySyncStateStore();
  const engine = createCourseSyncEngine({ stateStore: store });
  const plan = await engine.plan({
    sourceAdapter, targetAdapter, sourceCourseId: 7,
    targetCreation: { category_id: 4, shortname: 'TARGET' }
  });
  assert.equal(plan.actions[0].kind, 'course.create');
  const job = await engine.apply({
    planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter
  });
  assert.equal(job.status, 'succeeded');
  const actualBinding = store.getBinding(courseBindingId(source, target));
  assert.equal(actualBinding.target.course_id, 80);
});

test('sync engine refuses an approved plan after target drift', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'New name', shortname: 'COURSE' });
  let target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old name', shortname: 'COURSE' });
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { course_update: true }; },
    async applySyncAction() { assert.fail('Drifted plan must not write.'); }
  };
  const engine = createCourseSyncEngine({ stateStore: new MemorySyncStateStore() });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Manual edit', shortname: 'COURSE' });
  await assert.rejects(
    () => engine.apply({ planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter }),
    /changed after/
  );
});

test('planner creates groups only when no persistent mapping exists', () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE' });
  const target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE' });
  source.groups = [{
    sync_key: 'group:11', source_id: 11, name: 'Teachers', description: '', idnumber: 'teachers',
    visibility: null, participation: null
  }];
  source.digest = contentDigest({ ...source, extracted_at: undefined, digest: undefined });
  const createPlan = createCourseSyncPlan({ source, target, capabilities: { group_create: true } });
  assert.equal(createPlan.actions[0].kind, 'group.create');

  target.groups = [{
    sync_key: 'group:91', source_id: 91, name: 'Teachers', description: '', idnumber: 'teachers',
    visibility: null, participation: null
  }];
  target.digest = contentDigest({ ...target, extracted_at: undefined, digest: undefined });
  const mappedPlan = createCourseSyncPlan({
    source,
    target,
    mapping: { groups: { 'group:11': 91 } },
    capabilities: { group_create: true, group_update: true }
  });
  assert.equal(mappedPlan.actions.length, 0);
  assert.equal(mappedPlan.entity_mapping_snapshot.groups['group:11'], 91);
});

test('planner creates grouping membership after mapped or newly created entities', () => {
  const source = model({
    siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    groups: [{ id: 11, name: 'Teachers', idnumber: 'teachers' }],
    groupings: [{ id: 12, name: 'Cohorts', group_ids: [11] }]
  });
  const emptyTarget = model({
    siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE'
  });
  const createPlan = createCourseSyncPlan({
    source,
    target: emptyTarget,
    capabilities: { group_create: true, grouping_create: true, grouping_member_add: true }
  });
  assert.deepEqual(createPlan.actions.map((action) => action.kind), [
    'group.create', 'grouping.create', 'grouping.member.add'
  ]);
  assert.equal(createPlan.actions[2].group_source_key, 'group:11');
  assert.equal(createPlan.actions[2].grouping_source_key, 'grouping:12');

  const target = model({
    siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    groups: [{ id: 91, name: 'Teachers', idnumber: 'teachers' }],
    groupings: [{ id: 92, name: 'Cohorts', group_ids: [91] }]
  });
  const convergedPlan = createCourseSyncPlan({
    source,
    target,
    mapping: { groups: { 'group:11': 91 }, groupings: { 'grouping:12': 92 } },
    capabilities: { group_update: true, grouping_update: true, grouping_member_add: true }
  });
  assert.equal(convergedPlan.actions.length, 0);
});

test('sync engine records a verification failure after a non-converging write', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'New name', shortname: 'COURSE' });
  const target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old name', shortname: 'COURSE' });
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { course_update: true }; },
    async applySyncAction() { return { updated: true }; }
  };
  const store = new MemorySyncStateStore();
  const engine = createCourseSyncEngine({ stateStore: store });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  await assert.rejects(
    () => engine.apply({ planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter }),
    /readback verification/
  );
  assert.equal([...store.jobs.values()][0].status, 'verification_failed');
});

test('sync engine streams assets through a temporary cache and removes it after publication', async () => {
  const bytes = new TextEncoder().encode('streamed asset');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const asset = {
    filename: 'guide.pdf', filepath: '/', filesize: bytes.byteLength,
    content_hash: 'moodle-content-hash', sha256, url: 'https://source.example/file'
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [{
      id: 20, modname: 'resource', name: 'Guide', visible: true,
      authoring_completeness: 'complete',
      authoring: { kind: 'resource', settings: { intro: '', intro_format: 1 }, files: [asset] }
    }] }]
  });
  let target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [] }]
  });
  let cachedPath;
  const sourceAdapter = {
    async exportCourse() { return source; },
    async downloadAssetToFile(_asset, destinationPath) {
      cachedPath = destinationPath;
      await fs.writeFile(destinationPath, bytes);
      return { path: destinationPath, filesize: bytes.byteLength, sha256 };
    }
  };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { module_create: true, module_asset_stage: true }; },
    async stageModuleAssets(_action, materials) {
      assert.equal(materials.length, 1);
      assert.deepEqual(await fs.readFile(materials[0].filePath), Buffer.from(bytes));
      return { draft_item_id: 77, files: [{ filename: 'guide.pdf' }] };
    },
    async applySyncAction(action) {
      assert.equal(action.kind, 'module.create');
      target = model({
        provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
        sections: [{ id: 11, section: 0, name: 'General', modules: [{
          id: 40, modname: 'resource', name: 'Guide', visible: true,
          authoring_completeness: 'complete',
          authoring: { kind: 'resource', settings: { intro: '', intro_format: 1 }, files: [asset] }
        }] }]
      });
      return { module_id: 40 };
    }
  };
  const engine = createCourseSyncEngine({ stateStore: new MemorySyncStateStore() });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  const job = await engine.apply({
    planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter
  });
  assert.equal(job.status, 'succeeded');
  await assert.rejects(() => fs.access(cachedPath));
});

test('three-way planning preserves target-only edits and blocks concurrent changes', () => {
  const baselineSource = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Original', shortname: 'COURSE' });
  const baselineTarget = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Original', shortname: 'COURSE' });
  const unchangedSource = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Original', shortname: 'COURSE' });
  const editedTarget = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Target edit', shortname: 'COURSE' });
  const driftPlan = createCourseSyncPlan({
    source: unchangedSource,
    target: editedTarget,
    baseline: { source_model: baselineSource, target_model: baselineTarget },
    capabilities: { course_update: true }
  });
  assert.equal(driftPlan.actions.length, 0);
  assert.equal(driftPlan.divergences[0].reason, 'target_only_change');

  const editedSource = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'Source edit', shortname: 'COURSE' });
  const conflictPlan = createCourseSyncPlan({
    source: editedSource,
    target: editedTarget,
    baseline: { source_model: baselineSource, target_model: baselineTarget },
    capabilities: { course_update: true }
  });
  assert.equal(conflictPlan.applicable, false);
  assert.equal(conflictPlan.conflicts[0].reason, 'concurrent_change');
});

test('three-way planning protects mapped section fields from concurrent edits', () => {
  const section = (id, summary) => [{ id, section: 1, name: 'Unit', summary }];
  const baselineSource = model({
    siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: section(10, 'Original')
  });
  const baselineTarget = model({
    siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: section(90, 'Original')
  });
  const source = model({
    siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: section(10, 'Source edit')
  });
  const target = model({
    siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: section(90, 'Target edit')
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    baseline: { source_model: baselineSource, target_model: baselineTarget },
    mapping: { sections: { 'section:10': 90 } },
    capabilities: { section_update: true }
  });
  assert.equal(plan.actions.length, 0);
  assert.equal(plan.conflicts[0].kind, 'section.update');
  assert.equal(plan.conflicts[0].field, 'summary');
  assert.equal(plan.applicable, false);
});

test('Book chapters are planned only when native editor assets are not required', () => {
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [{
      id: 20,
      modname: 'book',
      name: 'Handbook',
      visible: true,
      authoring_completeness: 'complete',
      authoring: {
        kind: 'book',
        settings: { numbering: 'numbers', custom_titles: false },
        chapters: [{ chapter_id: 30, title: 'Start', content: '<p>Hello</p>', content_format: 1 }]
      }
    }] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [] }]
  });
  const capabilities = {
    module_create: { available: true, supported_fields: ['module_type', 'name', 'visible', 'settings'] },
    book_chapter_create: {
      available: true,
      supported_fields: ['title', 'content', 'content_format', 'subchapter', 'hidden', 'order']
    }
  };
  const plan = createCourseSyncPlan({ source, target, capabilities });
  assert.deepEqual(plan.actions.map((action) => action.kind), ['module.create', 'book_chapter.create']);

  source.sections[0].modules[0].authoring.chapters[0].content = '<img src="@@PLUGINFILE@@/image.png">';
  const blocked = createCourseSyncPlan({ source, target, capabilities });
  assert.equal(blocked.actions.length, 0);
  assert.equal(blocked.unsupported[0].kind, 'book.assets');

  source.sections[0].modules[0].authoring.chapters[0].files = [{
    filename: 'image.png', filepath: '/', filesize: 10, mimetype: 'image/png',
    content_hash: 'source-sha1', sha256: 'source-sha256',
    url: 'https://source.example/webservice/pluginfile.php/1/mod_book/chapter/30/image.png'
  }, {
    filename: 'diagram.svg', filepath: '/media/', filesize: 20, mimetype: 'image/svg+xml',
    content_hash: 'source-sha1-2', sha256: 'source-sha256-2',
    url: 'https://source.example/webservice/pluginfile.php/2/mod_book/chapter/30/media/diagram.svg'
  }];
  const assetPlan = createCourseSyncPlan({
    source,
    target,
    capabilities: {
      ...capabilities,
      book_asset_transfer: {
        available: true,
        supported_fields: ['filename', 'filepath', 'filesize', 'content_hash', 'content']
      }
    }
  });
  assert.deepEqual(assetPlan.actions.map((action) => action.kind), [
    'module.create', 'book_chapter.create', 'book_asset.transfer'
  ]);
  assert.equal(assetPlan.actions[2].assets.length, 2);
  assert.equal(assetPlan.action_summary.asset_transfers, 1);
  assert.equal(assetPlan.action_summary.estimated_transfer_bytes, 30);

  target.sections[0].modules = [{
    source_id: 40,
    sync_key: 'module:40',
    module_type: 'book',
    name: 'Handbook',
    visible: true,
    authoring_completeness: 'complete',
    authoring: {
      kind: 'book',
      settings: { numbering: 'numbers', custom_titles: false },
      chapters: [{
        ...structuredClone(source.sections[0].modules[0].authoring.chapters[0]),
        chapter_id: 50,
        page_number: 1,
        files: [
          ...structuredClone(source.sections[0].modules[0].authoring.chapters[0].files),
          { filename: 'local-note.txt', filepath: '/', content_hash: 'target-only', filesize: 4 }
        ]
      }]
    }
  }];
  const unchangedPlan = createCourseSyncPlan({
    source,
    target,
    capabilities: assetPlan.capability_snapshot,
    mapping: { modules: { 'module:20': 40 }, chapters: { 'chapter:30': 50 } }
  });
  assert.equal(unchangedPlan.actions.some((action) => action.kind === 'book_asset.transfer'), false);
  assert.equal(unchangedPlan.divergences[0].reason, 'target_only_files_preserved');
});

test('portable Page, Label, and URL definitions use exact MoodlIA module creation', () => {
  const modules = [
    { id: 20, modname: 'page', name: 'Page', authoring_completeness: 'complete', authoring: { kind: 'page', settings: { content: '<p>Page</p>' } } },
    { id: 21, modname: 'label', name: 'Label', authoring_completeness: 'complete', authoring: { kind: 'label', settings: { content: '<p>Label</p>' } } },
    { id: 22, modname: 'url', name: 'URL', authoring_completeness: 'complete', authoring: { kind: 'url', settings: { external_url: 'https://example.org' } } }
  ];
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: { module_create: { available: true, supported_fields: ['module_type', 'name', 'visible', 'settings'] } }
  });
  assert.deepEqual(plan.actions.map((action) => action.fields.module_type), ['page', 'label', 'url']);
});

test('Page editor assets are staged as one draft for identity-preserving updates', () => {
  const assets = [
    { filename: 'hero image.jpg', filepath: '/', filesize: 5, content_hash: 'sha1-a', sha256: 'sha256-a', url: 'https://source.example/a' },
    { filename: 'flow.svg', filepath: '/diagrams/', filesize: 7, content_hash: 'sha1-b', sha256: 'sha256-b', url: 'https://source.example/b' }
  ];
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [{
      id: 20, modname: 'page', name: 'Portable Page', visible: true,
      authoring_completeness: 'complete',
      authoring: {
        kind: 'page',
        settings: {
          content: '<img src="@@PLUGINFILE@@/hero%20image.jpg"><img src="@@PLUGINFILE@@/diagrams/flow.svg">',
          content_format: 1,
          print_intro: false,
          print_last_modified: true
        },
        files: assets
      }
    }] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [{
      id: 40, modname: 'page', name: 'Old Page', visible: true,
      authoring_completeness: 'complete',
      authoring: {
        kind: 'page',
        settings: { content: '<p>Old</p>', content_format: 1, print_intro: false, print_last_modified: true },
        files: []
      }
    }] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    mapping: { modules: { 'module:20': 40 } },
    capabilities: {
      module_asset_stage: true,
      page_content_update: {
        available: true,
        supported_fields: ['name', 'content', 'content_format', 'print_intro', 'print_last_modified']
      }
    }
  });

  assert.deepEqual(plan.actions.map((action) => action.kind), ['module_asset.stage', 'page_content.update']);
  assert.equal(plan.actions[0].assets.length, 2);
  assert.equal(plan.actions[1].asset_stage_source_key, plan.actions[0].source_key);
  assert.deepEqual(plan.actions[1].depends_on, [plan.actions[0].action_id]);
  assert.equal(plan.action_summary.estimated_transfer_bytes, 12);
});

test('Label and URL updates preserve identity and stage native editor assets', () => {
  const asset = {
    filename: 'ícono.svg', filepath: '/media/', filesize: 9, content_hash: 'sha1-icon', sha256: 'sha256-icon',
    url: 'https://source.example/webservice/pluginfile.php/1/mod_label/intro/0/media/icon.svg'
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [
      {
        id: 20, modname: 'label', name: 'Text', visible: true, authoring_completeness: 'complete',
        authoring: { kind: 'label', settings: {
          content: '<img src="@@PLUGINFILE@@/media/%C3%ADcono.svg">', content_format: 1
        }, files: [asset] }
      },
      {
        id: 21, modname: 'url', name: 'Reference', visible: true, authoring_completeness: 'complete',
        authoring: { kind: 'url', settings: {
          external_url: 'https://example.org/new', intro: '<p>Updated</p>', intro_format: 1,
          display: 'open', print_intro: true
        }, files: [] }
      }
    ] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [
      {
        id: 40, modname: 'label', name: 'Old text', visible: true, authoring_completeness: 'complete',
        authoring: { kind: 'label', settings: { content: '<p>Old</p>', content_format: 1 }, files: [] }
      },
      {
        id: 41, modname: 'url', name: 'Old reference', visible: true, authoring_completeness: 'complete',
        authoring: { kind: 'url', settings: {
          external_url: 'https://example.org/old', intro: '', intro_format: 1,
          display: 'open', print_intro: false
        }, files: [] }
      }
    ] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    mapping: { modules: { 'module:20': 40, 'module:21': 41 } },
    capabilities: {
      module_asset_stage: true,
      label_content_update: { available: true, supported_fields: ['content', 'content_format'] },
      url_content_update: { available: true, supported_fields: [
        'name', 'external_url', 'intro', 'intro_format', 'display', 'print_intro', 'popup_width', 'popup_height'
      ] }
    }
  });

  assert.deepEqual(plan.actions.map((action) => action.kind), [
    'module_asset.stage', 'label_content.update', 'url_content.update'
  ]);
  assert.equal(plan.actions[1].target_id, 40);
  assert.equal(plan.actions[2].target_id, 41);
  assert.equal(plan.actions[1].asset_stage_source_key, plan.actions[0].source_key);
  assert.deepEqual(plan.actions[1].depends_on, [plan.actions[0].action_id]);
});

test('resource and folder creation stages verified assets before publishing the module', () => {
  const file = {
    filename: 'guía.pdf', filepath: '/docs/', filesize: 4, mimetype: 'application/pdf',
    content_hash: 'moodle-hash', sha256: 'sha256-file', url: 'https://source.example/webservice/pluginfile.php/1/guía.pdf'
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [{
      id: 20, modname: 'resource', name: 'Guide', visible: true,
      authoring_completeness: 'complete', authoring: {
        kind: 'resource', settings: { intro: '', intro_format: 1 }, files: [file]
      }
    }] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 90, section: 0, name: 'General', modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: { module_create: true, module_asset_stage: true },
    mapping: { sections: { 'section:10': 90 } }
  });
  assert.deepEqual(plan.actions.map((action) => action.kind), ['module_asset.stage', 'module.create']);
  assert.equal(plan.actions[1].asset_stage_source_key, plan.actions[0].source_key);
  assert.equal(plan.actions[1].expected_assets[0].sha256, 'sha256-file');
});

test('section editor assets are staged and published after section identity exists', () => {
  const file = {
    filename: 'hero.jpg', filepath: '/media/', filesize: 4, mimetype: 'image/jpeg',
    content_hash: 'moodle-section-hash', sha256: 'sha256-section',
    url: 'https://source.example/webservice/pluginfile.php/1/course/section/10/media/hero.jpg'
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{
      id: 10, section: 1, name: 'Unit', summary: '<img src="@@PLUGINFILE@@/media/hero.jpg">',
      summary_format: 'html', files: [file], modules: []
    }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 90, section: 0, name: 'General', modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    capabilities: { section_create: true, section_update: true, module_asset_stage: true }
  });
  assert.deepEqual(plan.actions.map((action) => action.kind), [
    'section.create', 'module_asset.stage', 'section.update'
  ]);
  assert.equal(plan.actions[2].asset_stage_source_key, plan.actions[1].source_key);
  assert.deepEqual(plan.actions[2].expected_assets, [file]);
  assert.ok(plan.actions[2].depends_on.includes(plan.actions[0].action_id));
  assert.ok(plan.actions[2].depends_on.includes(plan.actions[1].action_id));
  assert.equal(source.assets[0].owner.file_area, 'section');
});

test('assignment editor assets are staged by file area without recreating the activity', () => {
  const file = {
    filename: 'diagram.png', filepath: '/media/', filesize: 5, mimetype: 'image/png',
    content_hash: 'moodle-assignment-hash', sha256: 'sha256-assignment',
    url: 'https://source.example/webservice/pluginfile.php/1/mod_assign/intro/0/media/diagram.png'
  };
  const assignment = {
    id: 20, modname: 'assign', name: 'Essay', visible: true, authoring_completeness: 'selected',
    authoring: {
      kind: 'assignment', settings: {}, losses: [], rubric: null,
      content: {
        intro: '<img src="@@PLUGINFILE@@/media/diagram.png">', intro_format: 1, intro_files: [file],
        activity: '<p>Instructions</p>', activity_format: 1, activity_files: []
      }
    }
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [assignment] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [{
      ...assignment,
      id: 90,
      authoring: {
        ...assignment.authoring,
        content: { ...assignment.authoring.content, intro: '<p>Old</p>', intro_files: [] }
      }
    }] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    mapping: { modules: { 'module:20': 90 } },
    capabilities: { assignment_content_update: true, module_asset_stage: true }
  });
  assert.deepEqual(plan.actions.map((action) => action.kind), [
    'module_asset.stage', 'assignment_content.update'
  ]);
  assert.equal(plan.actions[1].file_area, 'intro');
  assert.equal(plan.actions[1].target_id, 90);
  assert.deepEqual(plan.actions[1].expected_assets, [file]);
  assert.equal(source.assets[0].owner.file_area, 'intro');
});

test('new assignments can carry a rubric while existing grading definitions are protected', () => {
  const assignment = {
    id: 20, modname: 'assign', name: 'Essay', visible: true, authoring_completeness: 'selected',
    authoring: {
      kind: 'assignment',
      content: { intro: '<p>Write</p>', intro_format: 1, activity: '', activity_format: 1 },
      settings: { grade: 100, team_submission: false },
      losses: [],
      rubric: {
        name: 'Essay rubric', description: '', options: {},
        criteria: [{ sort_order: 1, description: 'Argument', levels: [
          { score: 0, definition: 'Missing' }, { score: 4, definition: 'Strong' }
        ] }]
      }
    }
  };
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [assignment] }]
  });
  const emptyTarget = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [] }]
  });
  const capabilities = {
    module_create: { available: true, supported_fields: ['module_type', 'name', 'visible', 'settings'] },
    assignment_rubric_set: { available: true, supported_fields: ['name', 'description', 'criteria', 'options'] }
  };
  const createPlan = createCourseSyncPlan({ source, target: emptyTarget, capabilities });
  assert.deepEqual(createPlan.actions.map((action) => action.kind), ['module.create', 'assignment_rubric.set']);

  const existingTarget = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 11, section: 0, name: 'General', modules: [{
      ...assignment, id: 90, authoring: { ...assignment.authoring, rubric: null }
    }] }]
  });
  const protectedPlan = createCourseSyncPlan({
    source,
    target: existingTarget,
    mapping: { modules: { 'module:20': 90 } },
    capabilities: { ...capabilities, assignment_content_update: true }
  });
  assert.equal(protectedPlan.unsupported.some((entry) => entry.reason === 'existing_grading_definition_protected'), true);
});

test('new assignments preserve checklist and marking-guide definitions', () => {
  const definitions = [
    {
      method: 'checklist', name: 'Checklist', description: '',
      items: [{ sort_order: 1, description: 'Includes evidence', score: 5 }]
    },
    {
      method: 'guide', name: 'Guide', description: '', options: {},
      criteria: [{
        sort_order: 1, shortname: 'Accuracy', description: 'Accuracy',
        description_markers: 'Marker guidance', max_score: 10
      }],
      comments: [{ sort_order: 1, description: 'Well supported' }]
    }
  ];
  for (const definition of definitions) {
    const source = model({
      provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7,
      fullname: 'Course', shortname: 'COURSE',
      sections: [{ id: 10, section: 0, name: 'General', modules: [{
        id: 20, modname: 'assign', name: 'Essay', visible: true, authoring_completeness: 'selected',
        authoring: {
          kind: 'assignment', settings: {}, losses: [], rubric: null,
          grading_definition: definition,
          content: { intro: '', intro_format: 1, activity: '', activity_format: 1 }
        }
      }] }]
    });
    const target = model({
      provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8,
      fullname: 'Course', shortname: 'COURSE',
      sections: [{ id: 90, section: 0, name: 'General', modules: [] }]
    });
    const capability = definition.method === 'guide' ? 'assignment_guide_set' : 'assignment_checklist_set';
    const expectedKind = definition.method === 'guide' ? 'assignment_guide.set' : 'assignment_checklist.set';
    const plan = createCourseSyncPlan({
      source,
      target,
      mapping: { sections: { 'section:10': 90 } },
      capabilities: { module_create: true, [capability]: true }
    });
    assert.deepEqual(plan.actions.map((action) => action.kind), ['module.create', expectedKind]);
    assert.equal(plan.actions[1].fields.name, definition.name);
  }
});

test('new Workshops preserve rubric definitions with more than four levels', () => {
  const levels = Array.from({ length: 6 }, (_, index) => ({
    definition: `Level ${index + 1}`,
    grade: index
  }));
  const source = model({
    provider: 'moodlia', siteUrl: 'https://source.example', courseId: 7, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 10, section: 0, name: 'General', modules: [{
      id: 20, modname: 'workshop', name: 'Peer review', visible: true,
      authoring_completeness: 'complete',
      authoring: {
        kind: 'workshop', settings: { strategy: 'rubric' }, phase: 20,
        grading_form: {
          strategy: 'rubric',
          definition: { layout: 'grid', dimensions: [{ description: 'Quality', levels }] }
        }
      }
    }] }]
  });
  const target = model({
    provider: 'moodlia', siteUrl: 'https://target.example', courseId: 8, fullname: 'Course', shortname: 'COURSE',
    sections: [{ id: 90, section: 0, name: 'General', modules: [] }]
  });
  const plan = createCourseSyncPlan({
    source,
    target,
    mapping: { sections: { 'section:10': 90 } },
    capabilities: { module_create: true, workshop_form_set: true }
  });
  assert.deepEqual(plan.actions.map((action) => action.kind), ['module.create', 'workshop_form.set']);
  assert.equal(plan.actions[1].fields.definition.dimensions[0].levels.length, 6);
});

test('resume reconciles completed actions and does not replay them', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'New', shortname: 'COURSE' });
  source.groups = [{
    sync_key: 'group:11', source_id: 11, name: 'Team', description: '', idnumber: null,
    visibility: null, participation: null
  }];
  source.digest = contentDigest({ ...source, extracted_at: undefined, digest: undefined });
  let target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old', shortname: 'COURSE' });
  let failGroup = true;
  let courseWrites = 0;
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { course_update: true, group_create: true }; },
    async applySyncAction(action) {
      if (action.kind === 'course.update') {
        courseWrites += 1;
        target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'New', shortname: 'COURSE' });
        return { updated: true };
      }
      if (failGroup) {
        failGroup = false;
        throw new Error('temporary group failure');
      }
      target.groups = [{ ...source.groups[0], source_id: 91, sync_key: 'group:91' }];
      target.digest = contentDigest({ ...target, extracted_at: undefined, digest: undefined });
      return { id: 91, name: 'Team' };
    }
  };
  const store = new MemorySyncStateStore();
  const engine = createCourseSyncEngine({ stateStore: store });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  await assert.rejects(() => engine.apply({
    planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter
  }), /temporary group failure/);
  const failedJob = [...store.jobs.values()][0];
  const resumed = await engine.apply({
    planId: plan.plan_id,
    planDigest: plan.digest,
    sourceAdapter,
    targetAdapter,
    resumeJobId: failedJob.job_id
  });
  assert.equal(resumed.status, 'succeeded');
  assert.equal(courseWrites, 1);
});

test('resume reconciles a timed-out write before deciding whether it is safe to replay', async () => {
  const source = model({ siteUrl: 'https://source.example', courseId: 7, fullname: 'New name', shortname: 'COURSE' });
  let target = model({ siteUrl: 'https://target.example', courseId: 8, fullname: 'Old name', shortname: 'COURSE' });
  let writes = 0;
  const sourceAdapter = { async exportCourse() { return source; } };
  const targetAdapter = {
    async exportCourse() { return target; },
    async syncCapabilities() { return { course_update: true }; },
    async applySyncAction(action) {
      writes += 1;
      target = model({
        siteUrl: 'https://target.example', courseId: 8,
        fullname: action.fields.fullname, shortname: 'COURSE'
      });
      const error = new Error('The response timed out after Moodle committed the write.');
      error.name = 'AbortError';
      throw error;
    }
  };
  const store = new MemorySyncStateStore();
  const engine = createCourseSyncEngine({ stateStore: store });
  const plan = await engine.plan({ sourceAdapter, targetAdapter, sourceCourseId: 7, targetCourseId: 8 });
  await assert.rejects(() => engine.apply({
    planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter, jobId: 'job-timeout'
  }), /timed out/);
  assert.equal(store.getJob('job-timeout').status, 'unknown_outcome');
  const resumed = await engine.apply({
    planId: plan.plan_id, planDigest: plan.digest, sourceAdapter, targetAdapter, resumeJobId: 'job-timeout'
  });
  assert.equal(resumed.status, 'succeeded');
  assert.equal(resumed.results[0].reconciled_at !== undefined, true);
  assert.equal(writes, 1);
});
