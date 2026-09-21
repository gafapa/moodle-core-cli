import fs from 'node:fs';
import path from 'node:path';
import { createMoodleClient, MoodleValidationError } from '../client/moodle-rest-client.mjs';
import { createCoreMoodleAdapter } from '../adapters/core/index.mjs';
import { describeProfile, loadProfiles, resolveProfile } from '../profiles/profiles.mjs';
import {
  createCourseSyncEngine,
  SqliteSyncStateStore,
  validateSyncPlan
} from '../sync/index.mjs';

const DEFAULT_CONFIG = '.moodle-profiles.json';
const DEFAULT_STATE = path.join('.moodle-sync', 'state.sqlite');

function requiredOption(options, name) {
  const value = options[name];
  if (value === undefined || value === true || String(value).trim() === '') {
    throw new MoodleValidationError(`--${name.replaceAll('_', '-')} is required.`, { parameter: name });
  }
  return String(value);
}

function positiveIntegerOption(options, name) {
  const value = Number(requiredOption(options, name));
  if (!Number.isInteger(value) || value <= 0) {
    throw new MoodleValidationError(`--${name.replaceAll('_', '-')} must be a positive integer.`, {
      parameter: name
    });
  }
  return value;
}

function loadResolvedProfile(options, name) {
  const profiles = loadProfiles(options.config ?? DEFAULT_CONFIG);
  return resolveProfile(profiles, name);
}

function adapterForProfile(profile, { allowWrite = false } = {}) {
  const credentials = profile.credentials.core;
  if (!credentials) {
    throw new MoodleValidationError(
      `Profile ${profile.name} does not configure Core credentials.`,
      { profile: profile.name, provider: 'core' }
    );
  }
  const client = createMoodleClient({
    baseUrl: profile.url,
    token: credentials.token,
    allowInsecure: profile.allow_insecure,
    readOnly: !allowWrite
  });
  return createCoreMoodleAdapter({ client, profileName: profile.name });
}

function stateStore(options) {
  const databasePath = path.resolve(options.state ?? DEFAULT_STATE);
  fs.mkdirSync(path.dirname(databasePath), { recursive: true, mode: 0o700 });
  return new SqliteSyncStateStore(databasePath);
}

function readPlan(planPath) {
  const raw = fs.readFileSync(path.resolve(planPath), 'utf8').replace(/^\uFEFF/, '');
  return validateSyncPlan(JSON.parse(raw));
}

function readMapping(mappingPath) {
  if (mappingPath === undefined) return {};
  if (mappingPath === true) throw new MoodleValidationError('--mapping requires a JSON file path.');
  const raw = fs.readFileSync(path.resolve(String(mappingPath)), 'utf8').replace(/^\uFEFF/, '');
  const mapping = JSON.parse(raw);
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new MoodleValidationError('--mapping must contain a JSON object.');
  }
  return mapping;
}

function writePlan(plan, requestedPath) {
  const planPath = path.resolve(requestedPath === true || requestedPath === undefined
    ? path.join('.moodle-sync', 'plans', `${plan.plan_id}.json`)
    : String(requestedPath));
  fs.mkdirSync(path.dirname(planPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
    encoding: 'utf8', flag: 'wx', mode: 0o600
  });
  return planPath;
}

function policiesFromOptions(options) {
  return {
    unsupported: options.unsupported_policy ?? 'error',
    conflict: options.conflict_policy ?? 'abort'
  };
}

export function printCapabilitiesHelp(binaryName = 'moodle-core') {
  console.log(`Usage: ${binaryName} capabilities --profile <name> [options]`);
  console.log('');
  console.log('Options:');
  console.log(`  --config <path>             Profile file (default: ${DEFAULT_CONFIG})`);
  console.log('  --profile <name>            Site profile to inspect');
  console.log('  --course-id <id>            Optional course context');
  console.log('  --compact                   Print compact JSON');
}

export function printCourseSyncHelp(binaryName = 'moodle-core') {
  console.log(`Usage: ${binaryName} course sync [options]`);
  console.log(`       ${binaryName} sync-course [options]`);
  console.log('');
  console.log('Plan options:');
  console.log('  --source-profile <name>     Source site profile');
  console.log('  --source-course-id <id>     Source course ID');
  console.log('  --target-profile <name>     Target site profile');
  console.log('  --target-course-id <id>     Existing target course ID');
  console.log('  --create-target-category-id <id>  Create a hidden target course in this category');
  console.log('  --target-shortname <value>  Required short name for a newly created target course');
  console.log('  --plan [path]               Save an immutable plan');
  console.log('  --mapping <path>            Explicit section/group ID mapping JSON');
  console.log('  --unsupported-policy <mode> error, skip, or degrade');
  console.log('  --conflict-policy <mode>    abort, source-wins, target-wins, or report');
  console.log('');
  console.log('Apply options:');
  console.log('  --approve-plan <path>       Persist external approval for MCP execution');
  console.log('  --yes                       Confirm local approval');
  console.log('  --apply-plan <path>         Apply a saved plan');
  console.log('  --plan-digest <sha256>      Approve the exact saved plan');
  console.log('  --allow-write               Required to apply a plan');
  console.log('  --resume-job <id>           Reconcile and resume an interrupted job');
  console.log('  --verify-plan <id>          Verify a completed plan by live readback');
  console.log('  --job-id <id>               Inspect one durable job');
  console.log('  --history                   List durable synchronization jobs');
  console.log('  --cancel-job <id>           Request cancellation before the next action');
  console.log('');
  console.log('Shared options:');
  console.log(`  --config <path>             Profile file (default: ${DEFAULT_CONFIG})`);
  console.log(`  --state <path>              SQLite state file (default: ${DEFAULT_STATE})`);
  console.log('  --compact                   Print compact JSON');
}

export async function runCapabilitiesCommand(options) {
  const profileName = requiredOption(options, 'profile');
  const profile = loadResolvedProfile(options, profileName);
  const adapter = adapterForProfile(profile);
  const discovery = await adapter.discoverSite();
  const capabilities = await adapter.syncCapabilities({
    courseId: options.course_id === undefined ? undefined : positiveIntegerOption(options, 'course_id')
  });
  return { profile: describeProfile(profile), discovery, capabilities };
}

export async function runCourseSyncCommand(options) {
  const approving = options.approve_plan !== undefined;
  const applying = options.apply_plan !== undefined;
  const resuming = options.resume_job !== undefined;
  const verifying = options.verify_plan !== undefined;
  const inspecting = options.job_id !== undefined;
  const listing = options.history !== undefined;
  const cancelling = options.cancel_job !== undefined;
  const modes = [approving, applying, resuming, verifying, inspecting, listing, cancelling,
    options.plan !== undefined].filter(Boolean);
  if (modes.length > 1) {
    throw new MoodleValidationError('Planning, approval, apply, resume, verify, job, history, and cancel modes cannot be combined.');
  }
  if (!applying && !resuming && options.allow_write) {
    throw new MoodleValidationError('--allow-write is only valid with --apply-plan or --resume-job.');
  }
  const store = stateStore(options);
  try {
    const engine = createCourseSyncEngine({ stateStore: store });
    if (listing) return { jobs: store.listJobs() };
    if (inspecting) {
      const jobId = requiredOption(options, 'job_id');
      const job = store.getJob(jobId);
      if (!job) throw new MoodleValidationError(`Unknown sync job: ${jobId}.`);
      return job;
    }
    if (cancelling) {
      const jobId = requiredOption(options, 'cancel_job');
      const job = store.getJob(jobId);
      if (!job) throw new MoodleValidationError(`Unknown sync job: ${jobId}.`);
      if (!['queued', 'running'].includes(job.status)) {
        throw new MoodleValidationError(`Job ${jobId} cannot be cancelled from status ${job.status}.`);
      }
      const cancelled = { ...job, status: 'cancel_requested', updated_at: new Date().toISOString() };
      store.saveJob(cancelled);
      return cancelled;
    }
    if (resuming || verifying) {
      const job = resuming ? store.getJob(requiredOption(options, 'resume_job')) : null;
      const planId = resuming ? job?.plan_id : requiredOption(options, 'verify_plan');
      if (!planId) throw new MoodleValidationError(`Unknown sync job: ${options.resume_job}.`);
      const plan = store.getPlan(planId);
      if (!plan) throw new MoodleValidationError(`Unknown sync plan: ${planId}.`);
      const targetName = String(plan.target?.site?.profile ?? '');
      const sourceName = String(plan.source?.site?.profile ?? '');
      if (!targetName || (resuming && !sourceName)) {
        throw new MoodleValidationError('The stored plan does not identify its site profiles.');
      }
      const targetAdapter = adapterForProfile(loadResolvedProfile(options, targetName), { allowWrite: resuming });
      if (verifying) {
        return engine.verify({ planId, targetAdapter, jobId: options.verify_job_id });
      }
      if (!options.allow_write) throw new MoodleValidationError('Resuming a job requires --allow-write.');
      return engine.apply({
        planId,
        planDigest: requiredOption(options, 'plan_digest'),
        resumeJobId: job.job_id,
        sourceAdapter: adapterForProfile(loadResolvedProfile(options, sourceName)),
        targetAdapter
      });
    }
    if (approving) {
      if (!(options.yes === true || options.yes === 'true' || options.yes === '1')) {
        throw new MoodleValidationError('Approving a sync plan requires --yes.');
      }
      const plan = readPlan(requiredOption(options, 'approve_plan'));
      const approval = {
        schema_version: 1,
        plan_id: plan.plan_id,
        digest: plan.digest,
        approved_at: new Date().toISOString(),
        expires_at: plan.expires_at,
        consumed_at: null
      };
      store.savePlan(plan);
      store.saveApproval(approval);
      return approval;
    }
    if (applying) {
      if (!options.allow_write) {
        throw new MoodleValidationError('Applying a sync plan requires --allow-write.');
      }
      const plan = readPlan(requiredOption(options, 'apply_plan'));
      const approvedDigest = requiredOption(options, 'plan_digest');
      const sourceProfileName = String(plan.source?.site?.profile ?? '');
      const targetProfileName = String(plan.target?.site?.profile ?? '');
      if (!sourceProfileName || !targetProfileName) {
        throw new MoodleValidationError('The plan does not identify its source and target profiles.');
      }
      store.savePlan(plan);
      const sourceAdapter = adapterForProfile(loadResolvedProfile(options, sourceProfileName));
      const targetAdapter = adapterForProfile(loadResolvedProfile(options, targetProfileName), { allowWrite: true });
      return engine.apply({
        planId: plan.plan_id,
        planDigest: approvedDigest,
        sourceAdapter,
        targetAdapter
      });
    }

    const sourceProfileName = requiredOption(options, 'source_profile');
    const targetProfileName = requiredOption(options, 'target_profile');
    const hasTargetCourse = options.target_course_id !== undefined;
    const createsTarget = options.create_target_category_id !== undefined;
    if (hasTargetCourse === createsTarget) {
      throw new MoodleValidationError(
        'Provide exactly one of --target-course-id or --create-target-category-id.'
      );
    }
    const targetCreation = createsTarget ? {
      category_id: positiveIntegerOption(options, 'create_target_category_id'),
      shortname: requiredOption(options, 'target_shortname')
    } : null;
    const plan = await engine.plan({
      sourceAdapter: adapterForProfile(loadResolvedProfile(options, sourceProfileName)),
      targetAdapter: adapterForProfile(loadResolvedProfile(options, targetProfileName)),
      sourceCourseId: positiveIntegerOption(options, 'source_course_id'),
      targetCourseId: hasTargetCourse ? positiveIntegerOption(options, 'target_course_id') : null,
      targetCreation,
      mapping: readMapping(options.mapping),
      policies: policiesFromOptions(options)
    });
    const planPath = writePlan(plan, options.plan);
    return { ...plan, plan_path: planPath };
  } finally {
    store.close();
  }
}
