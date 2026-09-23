#!/usr/bin/env node
import {
  buildContractParameters,
  createMoodleClient,
  isDestructiveOperation,
  loadContractFromFile,
  MoodleValidationError,
  normalizeClientError,
  redactOperationResult
} from '../client/moodle-rest-client.mjs';
import { printCapabilitiesHelp, runCapabilitiesCommand, syncMovedError } from './capabilities-command.mjs';
import {
  printCourseAuditHelp,
  printCourseCompletionAuditHelp,
  printCourseCompletionRepairHelp,
  printCourseProgressHelp,
  printEnrolmentSyncHelp,
  runCourseAudit,
  runCourseCompletionAudit,
  runCourseCompletionRepair,
  runCourseProgress,
  runEnrolmentSync
} from './workflow-commands.mjs';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { commandLineFileRoots } from '../client/transport-kernel.mjs';
import { exitCodeForError, exitCodeForResult } from './exit-codes.mjs';

let debugEnabled = false;

function toKebabCase(value) {
  return value.replaceAll('_', '-');
}

function toSnakeCase(value) {
  return value.replaceAll('-', '_');
}

function parseArguments(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) {
      positional.push(argument);
      continue;
    }
    const raw = argument.slice(2);
    const separator = raw.indexOf('=');
    if (separator >= 0) {
      options[toSnakeCase(raw.slice(0, separator))] = raw.slice(separator + 1);
      continue;
    }
    const key = toSnakeCase(raw);
    const next = argv[index + 1];
    if (next === undefined || next.startsWith('--')) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }
  return { positional, options };
}

function booleanOption(options, name, defaultValue = false) {
  const value = options[name];
  if (value === undefined) return defaultValue;
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  throw new MoodleValidationError(`--${toKebabCase(name)} must be true or false.`, {
    parameter: name
  });
}

function listOption(value) {
  if (value === undefined || value === true || value === '') return [];
  return String(value).split(',').map((entry) => entry.trim()).filter(Boolean);
}

function describeType(definition) {
  if (definition.type === 'array') return `${definition.items ?? 'unknown'}[]`;
  return definition.type;
}

function printHelp(contract, operation = null) {
  if (!operation) {
    console.log('Usage: moodle-core <command> [options]');
    console.log('');
    console.log('Friendly Moodle operations:');
    console.log('  capabilities             Discover the release and functions of a site profile');
    console.log('                           (course synchronization is provided by moodlia-sync)');
    console.log('  course audit             Evidence-based read-only course audit');
    console.log('  course progress          Aggregate visible progress and grade evidence');
    console.log('  course completion audit  Inspect completion evidence without inferring hidden settings');
    console.log('  course completion repair Report the exact Core authoring capability gap');
    console.log('  enrolments sync          Plan or apply add-only manual enrolments');
    for (const entry of contract.operations) {
      console.log(`  ${toKebabCase(entry.name).padEnd(24)} ${entry.summary}`);
    }
    console.log('');
    console.log('Connection options:');
    console.log('  --url <url>                 Defaults to MOODLE_BASE_URL');
    console.log('  --token <token>             Defaults to MOODLE_TOKEN');
    console.log('  --moodle-version <version>  Skip automatic version detection');
    console.log('  --allow-insecure            Allow HTTP for non-loopback development sites');
    console.log('  --allow-write               Allow operations classified as writes');
    console.log('  --allow-dangerous           Allow high-risk generic or development operations');
    console.log('  --allow-operation <names>   Comma-separated operation allowlist');
    console.log('  --deny-operation <names>    Comma-separated operation denylist');
    console.log('  --file-root <paths>         Comma-separated roots for local files (default: the working');
    console.log('                              directory and the directories of files named on the command line)');
    console.log('  --max-response-bytes <n>    Maximum REST or upload response size (MOODLE_MAX_RESPONSE_BYTES)');
    console.log('  --max-upload-bytes <n>      Maximum local upload size, streamed (MOODLE_MAX_UPLOAD_BYTES; default 2 GiB)');
    console.log('  --max-download-bytes <n>    Maximum downloaded file size, streamed (MOODLE_MAX_DOWNLOAD_BYTES; default 2 GiB)');
    console.log('  --yes                       Confirm a destructive operation');
    console.log('  --show-secrets              Print secret-bearing operation results');
    console.log('  --debug                     Include Moodle debug information in errors');
    console.log('  --compact                   Print compact JSON');
    console.log('  --help');
    console.log('');
    console.log('Exit codes: 0 success, 1 internal, 2 validation, 3 capability gap, 4 conflict,');
    console.log('            5 remote failure, 6 partial execution, 7 verification failure.');
    return;
  }

  console.log(`Usage: moodle-core ${toKebabCase(operation.name)} [options]`);
  console.log('');
  console.log(operation.summary);
  console.log(`Supported since Moodle ${operation.compatibility.from}.`);
  console.log('');
  console.log('Operation options:');
  for (const [name, definition] of Object.entries(operation.parameters)) {
    console.log(`  --${toKebabCase(name)} <${describeType(definition)}>  ${definition.required ? 'required' : 'optional'}`);
  }
}

function operationParameters(operation, options) {
  const globals = new Set([
    'url', 'token', 'moodle_version', 'allow_insecure', 'allow_write', 'allow_dangerous',
    'allow_operation', 'deny_operation', 'file_root', 'max_response_bytes', 'max_upload_bytes',
    'max_download_bytes', 'yes', 'show_secrets', 'debug', 'compact', 'help'
  ]);
  const raw = Object.fromEntries(Object.entries(options).filter(([name]) => !globals.has(name)));
  return buildContractParameters(operation, raw);
}

export async function runMoodleCoreCli(argv = process.argv.slice(2)) {
  const contract = loadContractFromFile();
  const { positional, options } = parseArguments(argv);
  const command = positional[0];
  const syncSubcommand = command === 'sync' ? positional[1] : null;
  const groupedSyncCommand = ['status', 'resume', 'verify', 'history', 'cancel'].includes(syncSubcommand);
  const syncCommand = (command === 'course' && positional[1] === 'sync')
    || command === 'sync-course'
    || groupedSyncCommand;
  const auditCommand = (command === 'course' && positional[1] === 'audit') || command === 'audit-course';
  const progressCommand = (command === 'course' && positional[1] === 'progress') || command === 'course-progress';
  const completionAuditCommand = command === 'course' && positional[1] === 'completion' && positional[2] === 'audit';
  const completionRepairCommand = command === 'course' && positional[1] === 'completion' && positional[2] === 'repair';
  const enrolmentSyncCommand = (command === 'enrolments' && positional[1] === 'sync') || command === 'sync-enrolments';
  const operation = contract.operations.find((entry) => toKebabCase(entry.name) === command);

  if (command === 'capabilities') {
    if (options.help) {
      printCapabilitiesHelp();
      return;
    }
    debugEnabled = booleanOption(options, 'debug');
    const result = await runCapabilitiesCommand(options);
    console.log(JSON.stringify(result, null, booleanOption(options, 'compact') ? 0 : 2));
    process.exitCode = exitCodeForResult(result);
    return;
  }
  if (syncCommand) {
    throw syncMovedError();
  }
  if (auditCommand || progressCommand || completionAuditCommand || completionRepairCommand || enrolmentSyncCommand) {
    if (options.help) {
      if (auditCommand) printCourseAuditHelp();
      else if (progressCommand) printCourseProgressHelp();
      else if (completionAuditCommand) printCourseCompletionAuditHelp();
      else if (completionRepairCommand) printCourseCompletionRepairHelp();
      else printEnrolmentSyncHelp();
      return;
    }
    debugEnabled = booleanOption(options, 'debug');
    const result = auditCommand
      ? await runCourseAudit(options)
      : progressCommand
        ? await runCourseProgress(options)
        : completionAuditCommand
          ? await runCourseCompletionAudit(options)
          : completionRepairCommand
            ? await runCourseCompletionRepair(options)
            : await runEnrolmentSync(options);
    console.log(JSON.stringify(result, null, booleanOption(options, 'compact') ? 0 : 2));
    process.exitCode = exitCodeForResult(result);
    return;
  }
  if (!command || options.help) {
    printHelp(contract, operation ?? null);
    return;
  }
  if (!operation) {
    throw new MoodleValidationError(`Unknown command: ${command}.`, { command });
  }

  const allowWrite = booleanOption(options, 'allow_write');
  const allowDangerous = booleanOption(options, 'allow_dangerous');
  const confirmed = booleanOption(options, 'yes');
  const showSecrets = booleanOption(options, 'show_secrets');
  debugEnabled = booleanOption(options, 'debug');
  const compact = booleanOption(options, 'compact');
  const allowedOperations = listOption(options.allow_operation);
  const deniedOperations = listOption(options.deny_operation);
  if (operation.kind === 'write' && !allowWrite) {
    throw new MoodleValidationError(
      `Write operation ${operation.name} requires --allow-write.`,
      { operation: operation.name }
    );
  }
  if (isDestructiveOperation(operation.name) && !confirmed) {
    throw new MoodleValidationError(
      `Destructive operation ${operation.name} requires --yes.`,
      { operation: operation.name }
    );
  }

  const client = createMoodleClient({
    baseUrl: options.url ?? process.env.MOODLE_BASE_URL,
    token: options.token ?? process.env.MOODLE_TOKEN,
    moodleVersion: options.moodle_version ?? process.env.MOODLE_VERSION,
    allowInsecure: booleanOption(options, 'allow_insecure'),
    readOnly: !allowWrite,
    allowedOperations: allowedOperations.length > 0 ? allowedOperations : null,
    deniedOperations,
    allowDangerousOperations: allowDangerous,
    allowedFileRoots: listOption(options.file_root).length > 0
      ? listOption(options.file_root)
      : commandLineFileRoots([options.file_path, options.destination_path]),
    environment: process.env,
    maximumResponseBytes: options.max_response_bytes === undefined
      ? undefined
      : Number(options.max_response_bytes),
    maximumUploadBytes: options.max_upload_bytes === undefined
      ? undefined
      : Number(options.max_upload_bytes),
    maximumDownloadBytes: options.max_download_bytes === undefined
      ? undefined
      : Number(options.max_download_bytes)
  });
  const result = await client.callOperation(operation.name, operationParameters(operation, options));
  const output = showSecrets ? result : redactOperationResult(operation.name, result);
  console.log(JSON.stringify(output, null, compact ? 0 : 2));
  process.exitCode = exitCodeForResult(output);
}

function isMainModule() {
  if (!process.argv[1]) return false;
  try {
    // npm installs bins as symlinks; compare real paths, not the invoked path.
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

const invokedAsExecutable = isMainModule();

if (invokedAsExecutable) {
  runMoodleCoreCli().catch((error) => {
    console.error(JSON.stringify(normalizeClientError(error).toJSON({ includeDebug: debugEnabled })));
    process.exitCode = exitCodeForError(error);
  });
}
