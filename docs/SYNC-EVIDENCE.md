# Synchronization evidence inventory

This inventory records implementation status rather than inferred Moodle capability.

| Area | Status | Evidence and boundary |
| --- | --- | --- |
| Moodle 4.5-5.3 Core discovery | Verified statically and by disposable installation matrix | Versioned Core contract plus `core_webservice_get_site_info`; MoodlIA build `2026092110` installed on 4.5.14, 5.0.8, 5.1.5, 5.2.2, and 5.3 beta on 2026-09-21 |
| Core course metadata create/update | Verified by request/response fixtures | Permission remains unknown until Moodle authorizes the request |
| Core groups/groupings/membership | Verified by request/response fixtures | Structure only; user membership is excluded |
| Core section/activity authoring | Unavailable | No promoted exact authoring adapter; course-format actions remain experimental |
| MoodlIA contextual discovery | Verified contract | Category/course capability evidence from `get_sync_capabilities` |
| MoodlIA sections and group structure | Verified unit/static contract | Runtime qualification required on every supported branch |
| Page/Label/URL authoring | Verified planner/adapter fixtures | Typed creation and identity-preserving updates use multi-file drafts |
| Section and assignment editor files | Verified planner/adapter/static plugin tests | Runtime Moodle matrix qualification is required before release |
| Resource/folder creation | Verified planner/adapter fixtures | Resource replacement is supported; existing folder replacement is unavailable |
| Book chapters and files | Verified planner/adapter/static plugin tests | Source bytes use SHA-256; final file manifests are read back |
| Assignment content and new rubrics | Verified planner/adapter/static plugin tests | Existing grading definitions are protected; incomplete plugin configuration requires a named degradation |
| Workshop grading forms | Verified for accumulative, comments, numerrors, and rubric definitions | New forms only; existing definitions are protected; rubric levels are not capped at four |
| Questions, quiz ownership, Lesson, Database, Feedback | Pending/unavailable | Reported as explicit module authoring gaps; no success is claimed |
| Deletion/pruning | Unavailable by default | No delete action is generated from filtered or incomplete inventory |
| Learner outcomes | Excluded | Submissions, grades, attempts, completion history, logs, and personal content are not synchronized |

Upstream operations that record view events are classified as writes in the Core client policy even when their names begin with `view`. Generic dynamic forms and arbitrary AJAX actions are not promoted as synchronization capabilities.

The disposable S1 matrix bound every test site to loopback, installed the release archive through Moodle's CLI upgrade path, linted every plugin PHP file, verified the stored plugin build, and removed all test containers, volumes, networks, and uploaded artifacts. Moodle 5.1 and later place web plugin types under `public/`; deployment tooling must resolve the effective plugin directory instead of assuming `<moodle-root>/local`.
