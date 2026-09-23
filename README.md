# Moodle Core CLI

Moodle Core CLI is a friendly Node.js client library and command-line interface for Moodle 4.5 and later core web services. The current release is verified through the official Moodle 5.3 beta source. It does not require a Moodle plugin and it does not expose arbitrary web service calls.

The package provides stable, friendly operations such as `create_course` while internally handling Moodle function names, nested REST parameters, version checks, and response normalization.

## Requirements

- Node.js 22.13 or later.
- Moodle 4.5 or later, through Moodle 5.3.
- Moodle web services and the REST protocol enabled.
- A web service token whose service contains the functions used by the desired operations.
- `core_webservice_get_site_info` in the service when automatic version detection is used.

Moodle version compatibility does not grant access by itself. The external service must expose each required function and the token user must have the corresponding capabilities.

## Cross-site synchronization

Course synchronization between Moodle sites is provided by the separate
[`moodlia-sync`](https://www.npmjs.com/package/moodlia-sync) package, which
builds on this client. Since 0.4.0 `moodle-core course sync` and
`moodle-core sync ...` exit with code 3 and point there; `moodle-core-cli`
itself has no runtime dependencies.

## Installation

```bash
npm install moodle-core-cli
```

## Library usage

```js
import { createMoodleClient } from 'moodle-core-cli';

const moodle = createMoodleClient({
  baseUrl: 'https://moodle.example.com',
  token: process.env.MOODLE_TOKEN,
  readOnly: true
});

const courses = await moodle.get_courses();

const course = await moodle.create_course({
  fullname: 'Introduction to Biology',
  shortname: 'BIO101',
  category_id: 3,
  visible: true
});
```

The first operation automatically calls `core_webservice_get_site_info` to detect the Moodle branch. Supply `moodleVersion` to skip detection:

```js
const moodle = createMoodleClient({
  baseUrl: 'https://moodle.example.com',
  token: process.env.MOODLE_TOKEN,
  moodleVersion: '4.5'
});
```

All public operation methods use generated parameter and response types. The canonical source is [`contract/operations.json`](contract/operations.json).

## CLI usage

Use environment variables:

```bash
export MOODLE_BASE_URL=https://moodle.example.com
export MOODLE_TOKEN=your-token
```

Run with `npx`:

```bash
npx moodle-core-cli get-courses
npx moodle-core-cli get-course --course-id 42
npx moodle-core-cli create-course \
  --allow-write \
  --fullname "Introduction to Biology" \
  --shortname BIO101 \
  --category-id 3 \
  --visible true
```

Windows PowerShell:

```powershell
$env:MOODLE_BASE_URL = 'https://moodle.example.com'
$env:MOODLE_TOKEN = 'your-token'
npx moodle-core-cli get-courses
```

Connection values can also be provided explicitly:

```bash
moodle-core get-courses \
  --url https://moodle.example.com \
  --token your-token \
  --moodle-version 4.5
```

CLI output is JSON. Errors are written as a structured JSON object to stderr. Automation can distinguish outcomes with these stable exit codes:

| Code | Meaning |
| ---: | --- |
| `0` | Success |
| `1` | Unexpected internal error |
| `2` | Invalid configuration, arguments, plan, or local state |
| `3` | Unsupported capability or provider gap |
| `4` | Synchronization conflict or failed precondition |
| `5` | Remote Moodle, authentication, permission, or transport failure |
| `6` | Partial execution or unknown write outcome |
| `7` | Response or synchronization verification failure |

Structured output is still emitted for a completed plan, conflict report, partial job, or verification failure before the corresponding non-zero exit code is returned. The same classification is exported from `moodle-core-cli/exit-codes` for wrappers and the adaptive CLI.

The CLI runs in read-only mode by default. Write operations require `--allow-write`, and destructive operations additionally require `--yes`. High-risk generic or development operations require `--allow-dangerous`.

Secret-bearing operation results are redacted by default. Use `--show-secrets` only when the output is sent to a trusted destination. Moodle debug information is omitted from errors unless `--debug` is present.

The CLI allows local files in the working directory and in the directories of files named on the command line (`--file-path`, `--destination-path`). Use `--file-root <paths>` to set the allowed roots explicitly. The library keeps local file access disabled unless `allowedFileRoots` is configured.

## Size limits

| Limit | Default | Option | Environment variable |
| --- | --- | --- | --- |
| REST response | 10 MiB; 64 MiB for bulk reads | `--max-response-bytes` | `MOODLE_MAX_RESPONSE_BYTES` |
| Upload (streamed) | 2 GiB, and the site's upload limit when known | `--max-upload-bytes` | `MOODLE_MAX_UPLOAD_BYTES` |
| Download (streamed to disk) | 2 GiB | `--max-download-bytes` | `MOODLE_MAX_DOWNLOAD_BYTES` |

A user-configured response limit always wins over the bulk default. Exceeding a limit fails with `payload_too_large` (exit code 2), whose details name the limit, the observed size, and the option that raises it.

## API coverage

The canonical contract currently exposes 788 friendly operations. Its supported scope is:

- Every standard external function declared by Moodle in the supported 4.5, 5.0, 5.1, 5.2, and 5.3 branches, including administrative and AJAX-capable external functions.
- Every function assigned to Moodle's official mobile service in those branches.
- The upload and authenticated plugin-file endpoints used by Moodle web services.

The version-specific audits currently prove:

| Moodle branch | All declared | Covered | Official mobile | Covered |
| --- | ---: | ---: | ---: | ---: |
| 4.5 | 759 | 759 | 438 | 438 |
| 5.0 | 754 | 754 | 426 | 426 |
| 5.1 | 761 | 761 | 432 | 432 |
| 5.2 | 755 | 755 | 430 | 430 |
| 5.3 beta | 760 | 760 | 431 | 431 |

Moodle 5.3 support is based on the official `v5.3.0-beta` source snapshot and remains preliminary until Moodle publishes the stable branch.

Moodle can add site-specific functions through third-party or local plugins. Those functions are intentionally not discovered or called dynamically. Supporting one requires adding it to the static contract.

See [API coverage](docs/API-COVERAGE.md) for the exact scope and audit procedure.

Use `moodle-core --help` for the complete command list and `moodle-core <command> --help` for operation parameters.

Evidence-based local workflows compose the audited Core operations without requiring a Moodle plugin:

```powershell
moodle-core course audit --course-id 42
moodle-core course progress --course-id 42 --maximum-users 100
moodle-core course completion audit --course-id 42
moodle-core course completion repair --course-id 42 --mode book_view_only
moodle-core enrolments sync --course-id 42 --desired-file desired-enrolments.json --plan-file enrolments.plan.json
moodle-core enrolments sync --apply-plan enrolments.plan.json --plan-digest "sha256:..." --allow-write --yes
```

The progress workflow preserves denied or unavailable completion and grade reads as explicit unknown evidence. The Core completion repair command intentionally returns an exit-code-3 capability-gap plan because Moodle Core has no verified activity-completion configuration authoring API; it never fabricates a repair. Enrolment synchronization is intentionally add-only: it never removes existing users or roles, and applying requires the exact immutable plan digest.

## Type generation

Parameter types are generated from the friendly contract. Response types are generated from Moodle's official `external_*` return descriptions and committed as a reproducible snapshot:

```bash
npm run types:extract -- /path/to/moodle
npm run types:generate
npm run types:check
npm run types:compile
```

The generator writes `client/generated/operation-types.d.ts`. Generated declarations must not be edited manually.

## Development

```bash
npm run check
npm run pack:check
```

To audit a Moodle source checkout:

```bash
npm run coverage:audit -- /path/to/moodle --version 5.3 --strict --require-all
```

Project documentation, variable names, function names, and source comments are written in English.

## Security

- HTTPS is required except for loopback development sites.
- Authenticated requests reject redirects instead of forwarding credentials.
- Tokens must not be included in the Moodle base URL.
- Avoid passing tokens on the command line in shared environments; prefer `MOODLE_TOKEN`.
- Create a dedicated external service containing only the required functions.
- Give the token user only the Moodle capabilities required for its intended work.
- The CLI is read-only by default and requires explicit authorization for writes and destructive actions.
- The library supports `readOnly`, `allowedOperations`, `deniedOperations`, and `allowDangerousOperations` policies.
- File access is confined with `allowedFileRoots`; uploads and downloads stream with configurable byte limits.
- REST responses have a configurable byte limit and file downloads are streamed through a protected temporary file.
- Upload tokens travel in the request body, never in the URL.
- Secret results and Moodle debug details are hidden by default in CLI output.
- Write operations are never retried automatically.
