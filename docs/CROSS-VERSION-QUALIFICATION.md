# Cross-version synchronization qualification

## Scope

The release suite evaluates the five supported Moodle branches (`4.5`, `5.0`, `5.1`, `5.2`, and `5.3`) in every source-to-target direction and through all four provider pairings:

- Core to Core
- Core to MoodlIA
- MoodlIA to Core
- MoodlIA to MoodlIA

This produces 100 logical scenarios. `tests/version-matrix.test.mjs` validates every immutable plan, preserves source and target version evidence, checks provider-specific capability outcomes, and rejects any plan containing backup, restore, course-copy, or `.mbz` transport markers.

## Expected outcomes

The representative fixture always transfers exact supported course metadata. A MoodlIA source additionally exposes a complete portable Page definition:

| Source | Destination | Expected authored Page outcome |
| --- | --- | --- |
| Core | Core | No Page authoring claim because Core extraction is shell-only |
| Core | MoodlIA | No Page authoring claim because the source field is unavailable |
| MoodlIA | Core | Blocking `target_capability_unavailable` gap before any write |
| MoodlIA | MoodlIA | Exact portable Page creation action |

Across all version directions, 75 scenarios are applicable for the selected fixture and 25 intentionally produce the documented Core destination gap. A capability-gap result is a successful qualification outcome, not a successful content transfer.

## Evidence layers

The logical matrix complements rather than replaces the other release evidence:

- `npm test` covers deterministic planning, three-way conflicts, asset streaming, Unicode paths, reference rewriting, interruption, reconciliation, resume, idempotent reruns, and verification failures.
- The Moodle plugin CI matrix executes its PHP and database suite on each supported branch and supported database/PHP boundary.
- Disposable live-site qualification is required for claims about a concrete service, token, database, or deployment. It must use recorded isolated resources and remove them after verification.

No production synchronization or plugin deployment is part of this qualification.

## Latest plugin branch evidence

The release evidence inspected on 2026-09-22 is the successful [Moodle PHPUnit run 35627262680](https://github.com/gafapa/moodle-local_moodlia/actions/runs/35627262680) for plugin commit `adc0204cf755192e6f99643c4fb9114e01285c66`. Its ten successful jobs cover:

- Moodle 4.5 on MariaDB/PHP 8.1 and PostgreSQL/PHP 8.3.
- Moodle 5.0 on MariaDB/PHP 8.2 and PostgreSQL/PHP 8.4.
- Moodle 5.1 on MariaDB/PHP 8.2 and PostgreSQL/PHP 8.4.
- Moodle 5.2 on MariaDB/PHP 8.3 and PostgreSQL/PHP 8.4.
- The audited Moodle 5.3 beta snapshot on MariaDB/PHP 8.3 and PostgreSQL 17/PHP 8.4.

This evidence proves the plugin suite on each branch boundary. It does not turn a static Core token into an authoring API and does not replace live source-to-target permission checks.
