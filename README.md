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

## Cross-site synchronization preview

The package now provides the Core-only foundation for profile-based, no-backup course synchronization. Planning is read-only and writes an immutable JSON plan. Applying requires the saved plan digest and `--allow-write`.

The shared planner models native editor content and assets for sections, Pages, Text and media activities, URL resources, Book chapters, and assignment description and instruction areas. A destination adapter must advertise the corresponding typed capability before the planner emits an identity-preserving content update.

Internal links in section, Page, Text and media, URL, Book, and assignment editor HTML are parsed rather than replaced as raw text. Known destination mappings are rewritten during planning; links to activities created by the same plan become dependency-bound deferred references. External links are preserved and Moodle-origin URLs containing authentication tokens are rejected.

The same command exposes durable recovery and verification with `--job-id`, `--history`, `--cancel-job`, `--resume-job`, and `--verify-plan`. A timed-out write is recorded as an unknown outcome and reconciled before resume; it is never replayed blindly.

```powershell
moodle-core course sync `
  --source-profile school_a --source-course-id 42 `
  --target-profile school_b --target-course-id 81 `
  --plan ".moodle-sync\plans\course-42.json"

moodle-core course sync `
  --apply-plan ".moodle-sync\plans\course-42.json" `
  --plan-digest "sha256:..." --allow-write
```

Profiles use environment-variable references rather than embedded tokens. See [the synchronization architecture](docs/SYNC-ARCHITECTURE.md) and [the current capability matrix](docs/SYNC-CAPABILITY-MATRIX.md). The Core package intentionally contains no MCP server; cross-site MCP coordination is provided by the separate `moodlia-sync-mcp` package.

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

CLI output is JSON. Errors are written as a structured JSON object to stderr and produce a non-zero exit code.

The CLI runs in read-only mode by default. Write operations require `--allow-write`, and destructive operations additionally require `--yes`. High-risk generic or development operations require `--allow-dangerous`.

Secret-bearing operation results are redacted by default. Use `--show-secrets` only when the output is sent to a trusted destination. Moodle debug information is omitted from errors unless `--debug` is present.

Local file access is disabled by default. Upload and download commands require `--file-root <path>` or a comma-separated list of explicitly allowed roots.

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
- File access is confined with `allowedFileRoots`; uploads and downloads have configurable byte limits.
- REST responses have a configurable byte limit and file downloads are streamed through a protected temporary file.
- Secret results and Moodle debug details are hidden by default in CLI output.
- Write operations are never retried automatically.
