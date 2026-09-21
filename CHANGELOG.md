# Changelog

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
