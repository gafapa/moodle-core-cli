# API coverage

## Supported scope

Moodle Core CLI is a static, friendly client for Moodle 5.0 and later. It does not inspect a live site's function catalog and it does not offer an arbitrary `call(functionName, parameters)` escape hatch.

The contract covers:

1. Every standard external function declared in Moodle's `db/services.php` files for the supported branches.
2. Every external function assigned to `MOODLE_OFFICIAL_MOBILE_SERVICE`.
3. Administrative and AJAX-capable external functions, because a Moodle administrator can expose external functions through a configured service when their access rules permit it.
4. Moodle's draft-file upload and authenticated plugin-file download endpoints.

The contract does not claim to cover:

- Functions installed by third-party, contributed, or local plugins.
- Functions added by a future Moodle branch before the contract is audited and updated.
- Test-fixture service definitions under Moodle's test directories.

This boundary is necessary because Moodle installations can define arbitrary local external functions. Covering those without runtime discovery requires an explicit contract extension.

## Verified branch matrix

The source audit reads every `db/services.php` file, identifies function declarations and official-mobile membership, and compares them with the version-valid operations in `contract/operations.json`.

| Moodle branch | Service declarations | All covered | Official mobile functions | Mobile covered | Unknown contract functions |
| --- | ---: | ---: | ---: | ---: | ---: |
| 5.0 | 754 | 754 | 426 | 426 | 0 |
| 5.1 | 761 | 761 | 432 | 432 | 0 |
| 5.2 | 755 | 755 | 430 | 430 | 0 |

The counts are branch-specific. Moodle may add or remove functions between minor branches. For example, the MoodleNet functions are available through Moodle 5.1 and are rejected by the client on Moodle 5.2.

## Reproducing the audit

Use a source checkout for the branch being checked:

```bash
npm run coverage:audit -- /path/to/moodle --version 5.0 --strict --require-all
npm run coverage:audit -- /path/to/moodle --version 5.1 --strict --require-all
npm run coverage:audit -- /path/to/moodle --version 5.2 --strict --require-all
```

Strict mode fails when:

- an official-mobile function is missing from the friendly contract; or
- any declared standard external function is missing when `--require-all` is used; or
- a contract operation claims compatibility with the selected branch but its Moodle function is absent from that source tree.

## Response types

Moodle describes external return values with `external_value`, `external_single_structure`, `external_multiple_structure`, and related structures. The development extractor parses those PHP descriptions and stores the resulting schemas in `contract/source-response-types.json`.

```bash
npm run types:extract -- /path/to/moodle
npm run types:generate
npm run types:compile
```

All generic object responses in the current contract resolve to extracted structures. The committed extraction snapshot has zero unresolved generic responses.

## Live-site limitations

An operation being compatible with a Moodle version does not mean that every token can call it. The site's external service must include the Moodle function and the token user must hold the necessary capabilities. Moodle returns a structured access or missing-function error when either condition is not met.
