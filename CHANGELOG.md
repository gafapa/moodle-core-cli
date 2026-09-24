# Changelog

## 0.4.1 - 2026-09-24

- `update_course` and `update_user` now fail with `validation_error` when
  Moodle rejects the change with a warning instead of an exception, for example
  a course shortname that is already in use. Before, they reported
  `updated: true` although nothing changed. The error message names Moodle's
  warning codes and the details keep the warnings.

## 0.4.0 - 2026-09-24

Breaking changes:

- Course synchronization moved to the new `moodlia-sync` package. The
  `./sync` export, `moodle-core course sync`, `sync-course`, and
  `moodle-core sync ...` are removed; the commands now exit with
  `unsupported_operation` (exit code 3) and point to `moodlia-sync`.
  `moodle-core capabilities` reports site discovery only.
  `CoreMoodleAdapter` keeps `discoverSite()`; `moodlia-sync` extends it.
- No runtime dependencies: `better-sqlite3` and `parse5` are gone, so
  installing Core no longer builds a native module.
- Limits: uploads and downloads stream with a 2 GiB default instead of being
  buffered with 50 MiB and 100 MiB limits. Exceeding any limit raises
  `payload_too_large` (exit code 2) instead of `connection_error` or
  `validation_error`, with the limit, observed size, option, and environment
  variable in its details.
- Uploads send the token in the multipart body instead of the URL query.

Additions:

- `moodle-core-cli/transport`: the shared transport kernel (limits,
  streaming, file roots, URL checks, secret redaction, error class) that
  `moodlia` now builds on.
- `moodle-core-cli/canonical` and `moodle-core-cli/cli-options`.
- `MOODLE_MAX_{RESPONSE,UPLOAD,DOWNLOAD}_BYTES`; bulk reads declare
  `limits.class: "bulk"` and get a 64 MiB response limit unless the user set
  one; uploads honour the site's `usermaxuploadfilesize`.
- The CLI allows the working directory and explicitly named files by default
  when `--file-root` is not given.
- The executable runs when installed as a symlinked bin.

Migration: replace `moodle-core course sync ...` with the `moodlia-sync`
commands listed in its README.

## 0.3.6 - 2026-09-22

- Identify created entities by the first positive identifier in adapter
  results, so module results that echo `grouping_id: 0` no longer fail
  readback verification or lose their binding mapping.
- Record readback verification failures in the failed job and in the CLI error
  details so operators can identify the diverging action without re-running
  verification.
- Preserve the original error code and details when the Core CLI wraps
  non-client errors instead of reporting them as `internal_error`.

## 0.3.5 - 2026-09-22

- Retain the source module type in unresolved-section synchronization gaps so
  operators can identify blocked Page and activity content precisely.

## 0.3.4 - 2026-09-22

- Normalize Moodle 5.3's rendered course-summary overflow wrapper back to portable authoring HTML.
- Preserve Moodle's explicit zero start and end dates so Core and MoodlIA snapshots compare canonically.

## 0.3.3 - 2026-09-22

- Prefer a created section's identity over its parent course identity during apply, mapping, and readback verification.
- Add a cross-provider regression test for section responses that include both `section_id` and `course_id`.

## 0.3.2 - 2026-09-22

- Keep the durable SQLite state store open until asynchronous apply, resume, and verification operations settle.
- Add a regression guard for the CLI state-store lifecycle discovered by disposable cross-version qualification.
- Send an explicit empty grouping ID number so Moodle 5.3 can validate the response from `core_group_create_groupings`.
- Map grouped resume, verify, and cancel identifiers without leaving conflicting lifecycle options behind.
- Reconcile uniquely matching group and grouping creations when Moodle commits a write before returning an invalid response.

## 0.3.1 - 2026-09-22

- Export a stable CLI outcome-code contract for validation, capability gaps, conflicts, remote failures, partial execution, and verification failures.
- Add grouped synchronization lifecycle aliases for status, resume, verification, history, and cancellation.
- Add conservative Core completion audit and repair planning. Core repair reports an explicit capability gap because no verified configuration authoring API exists.
- Export the in-process Core CLI runner used by MoodlIA's explicit provider namespace.
- Replace experimental `node:sqlite` with the pinned maintained `better-sqlite3` driver.
- Qualify all 100 logical Moodle 4.5-5.3 source/target and provider pairings and assert the no-backup transport boundary.

## 0.3.0 - 2026-09-21

- Add the Core-owned adaptive capability, profile, workflow, and synchronization foundation.
- Add immutable plans, persistent state, conflict detection, recovery, asset transfer, and live verification.
- Add evidence-based course audit, progress reporting, and add-only manual-enrolment workflows.
