# Architecture

## Goals

Moodle Core CLI provides one stable, friendly API over Moodle 5.0+ core web services. The npm library is the primary product; the CLI is an adapter over the same client methods.

The project intentionally does not provide live web service discovery, arbitrary `wsfunction` calls, or APIs supplied by third-party and site-local plugins.

## Layers

1. `contract/operations.json` defines public operations, parameters, responses, compatibility, and their internal Moodle function.
2. `contract/source-response-types.json` stores response schemas extracted from Moodle's official PHP external descriptions.
3. `client/generated/operation-types.d.ts` is generated from the friendly contract and extracted response schemas.
4. `MoodleClient` validates friendly parameters, checks Moodle compatibility, and selects an operation adapter.
5. Operation adapters translate stable Moodle Core CLI inputs into Moodle parameters and normalize Moodle responses.
6. `RestTransport` encodes nested parameters and communicates with Moodle.
7. `cli/moodle-core.mjs` converts kebab-case commands and flags into the same operation calls.

## Security policy

`MoodleClient` can enforce read-only execution, an operation allowlist, an operation denylist, and explicit access to high-risk generic or development operations. The CLI enables read-only mode by default, requires explicit write authorization, and requires a second confirmation flag for destructive operation names.

`RestTransport` rejects redirects on authenticated requests, disables local file access until allowed roots are configured, limits response and file sizes, and writes downloads through a temporary file before moving them into place. HTTPS remains mandatory except for loopback development sites or an explicit development override.

CLI result serialization redacts secret-bearing fields and entire results from token- or API-key-returning operations. Moodle `debuginfo` is available to library consumers but is omitted from serialized errors unless debug output is explicitly enabled.

## Version policy

Moodle 5.0 is the minimum supported version. Automatic detection uses `core_webservice_get_site_info`. Consumers can provide a Moodle version explicitly when that function is not exposed by their external service.

The contract also records the newest audited branch. A future branch is rejected until its source inventory, parameter structures, response structures, and compatibility differences have been incorporated into a new package release.

Version compatibility means that a Moodle branch contains the underlying core function with the contract expected by Moodle Core CLI. It does not guarantee that a particular external service exposes the function or that its token user has permission to execute it.

New Moodle branches must be tested before Moodle Core CLI claims verified compatibility. When a Moodle request or response changes, an internal adapter variant should preserve the existing public contract wherever practical.

## Contract and generated declarations

The operation contract is the canonical source for:

- Public operation names.
- CLI commands.
- Required and optional parameters.
- Scalar and array parameter types.
- Explicit stable response shapes and the Moodle function used to resolve extracted response shapes.
- Moodle version ranges.
- Read or write classification.

`tools/extract-moodle-response-types.mjs` parses Moodle's `external_*` PHP descriptions without executing Moodle code. `tools/generate-operation-types.mjs` then generates the operation name union, parameter interfaces, response interfaces, parameter and response maps, and typed client methods.

CI must run `npm run types:check` and `npm run types:compile` to prevent stale or invalid declarations.

## Error model

The JavaScript API rejects promises with typed errors. The CLI serializes those errors to JSON.

Important categories include configuration, connection, authentication, permission, validation, unsupported Moodle version, and unavailable operation errors.

Moodle exception details are preserved without including the client token. Serialized errors omit Moodle debug information by default and redact fields whose names indicate passwords, secrets, tokens, private keys, or API keys.
