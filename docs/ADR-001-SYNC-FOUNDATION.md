# ADR 001: Shared adaptive synchronization foundation

Status: accepted for preview

## Decision

`moodle-core-cli` owns the provider-neutral course model, capability registry, planner, executor, profiles, and state stores. It has no dependency on MoodlIA or an MCP SDK. `moodlia` depends on Core and adds a field-aware MoodlIA adapter. `moodlia-sync-mcp` is a separate coordinator package that depends on both and exposes the same engine.

The state store uses `node:sqlite`, requiring Node 22.5 or newer. This avoids a native third-party driver while providing transactions, WAL journaling, leases, and schema-versioned durable state. The in-memory implementation remains the test double.

Plans are canonical JSON documents with a digest, expiry, capability snapshot, selected provider per action, source and target preconditions, conflicts, unsupported changes, skipped dependencies, effects, and transfer estimates. Plan files and SQLite state are created with restrictive POSIX permissions where supported. Credentials remain environment-variable references and are never serialized.

## Consequences

- Core-only sites retain a useful, explicitly limited path.
- MoodlIA can improve an individual capability without replacing the whole client.
- Provider fallback happens during planning, never after an ambiguous mutation.
- New target courses are created hidden and only in an explicitly selected category.
- A timeout does not imply failure: it becomes `unknown_outcome` and requires readback reconciliation.
- Native backups remain a separate portability/QA mechanism and are not part of cross-site synchronization.

## Rejected alternatives

- Merging both repositories would force GPL/MoodlIA and MCP dependencies into the MIT Core client.
- Selecting one backend for an entire command would discard safe Core fallbacks and hide field-level gaps.
- JSON-only state would not provide transactional approval consumption or target-course leases.
- Automatic title matching would risk overwriting unrelated Moodle entities.
