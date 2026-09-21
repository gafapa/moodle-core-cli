# Cross-site synchronization architecture

## Scope

`moodle-core-cli` owns the provider-neutral synchronization model, capability registry, immutable planner, executor, profile schema, and state-store interfaces. It contains only Moodle Core implementations and has no dependency on MoodlIA or MCP.

`moodlia` depends on this package and adds the MoodlIA provider. Its adaptive adapter selects a provider for each capability instead of selecting one backend for an entire command. `moodlia-sync-mcp` exposes the same engine to MCP clients under a separate authorization boundary.

The preview synchronizes selected metadata and proven structure plus selected portable authoring through MoodlIA: Pages, Labels, URLs, resources, folders, Books, assignments and Workshop grading forms. The capability matrix distinguishes create/update gaps. Learner submissions, grades, attempts, and historical completion remain excluded.

## Decision: local state

The default store uses Node's synchronous SQLite API and therefore requires Node 22.5 or newer. SQLite keeps immutable plans, jobs, course bindings, entity mappings, and external approvals together without adding a native third-party database dependency. The in-memory store remains available for deterministic tests.

The database never stores Moodle tokens. Profiles contain environment-variable references only. A deployment must keep one writer per state database and protect both the database and plan files with operating-system permissions.

## Safety model

Planning performs reads only. Applying requires all of the following:

1. A saved plan whose canonical digest matches its contents.
2. A non-expired plan.
3. Unchanged source and target course digests.
4. Explicit CLI write authorization, or a separate unconsumed approval for MCP.
5. A destination capability that covers every requested field.

The executor persists intent before every write, records attempts and correlation IDs, stores returned identifiers immediately, and reads the target again after writes. It checks entity preconditions immediately before updates. Timeout-like failures become `unknown_outcome` and must be reconciled before resume. A readback mismatch is a verification failure, not success. A cancellation request stops scheduling new actions between writes. Cross-server transactions and automatic rollback are not claimed.

## Identity and mappings

Remote numeric IDs are scoped to their own Moodle site. A binding ID hashes the source site/course and target site/course. Entity mappings then associate opaque source sync keys with destination IDs by namespace. Names and positions are not identity.

Section zero is matched only with section zero. Other existing sections require a persisted or caller-supplied mapping. New courses are created hidden in an explicitly selected category; their real binding is persisted after creation. New sections, groups, groupings, modules, and chapters receive mappings from destination IDs. This avoids overwriting an unrelated entity merely because its title is similar.

## Provider evidence

Core capability availability is the intersection of the static versioned contract and the functions returned for the current token by `core_webservice_get_site_info`. Moodle Core does not expose a general permission probe, so write permission remains `unknown` until an authorized request is attempted.

MoodlIA 0.1.209 adds `get_sync_capabilities`. It evaluates category-scoped course creation and course-scoped structure, activity, grading-form, Book, and Workshop capabilities. Older plugins remain usable for legacy direct commands, but adaptive synchronization does not promote a declared write operation to an available capability without contextual evidence.

## Compatibility

The support floor is Moodle 4.5. Static Core contracts are audited for 4.5, 5.0, 5.1, 5.2, and the 5.3 snapshot. A future version is not accepted merely because its number is greater. Each provider must also expose the selected function to the current service and token.
