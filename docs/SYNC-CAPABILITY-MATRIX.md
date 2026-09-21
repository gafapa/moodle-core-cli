# Synchronization capability matrix

This matrix describes the current implementation, not the complete long-term roadmap.

| Capability | Core source | Core destination | MoodlIA source | MoodlIA destination | Current status |
| --- | --- | --- | --- | --- | --- |
| Course identity and summary | Exact selected reads | Exact supported-field update | Exact selected reads | Exact supported-field update | Preview |
| New hidden target course | Read source metadata | Explicit target category and short name; permission is enforced by Moodle | Read source metadata | Contextual category permission probe and exact creation | Preview |
| Course category | Read | Requires an explicit destination category; source numeric ID is never copied | Read | Same | Explicit mapping |
| Sections, including section zero | Structural read | No verified Core authoring path | Structural read | Create/update with contextual permission evidence | Preview |
| Group definitions and grouping membership | Read when exposed to token | Create/update/add membership | Read | Create/update/add membership | Preview |
| Activity shells | Partial structural read | Quick-create is not full authoring | Partial structural read | Available direct operations vary | Reported as incomplete |
| Books and chapters | No verified Core authoring round trip | Unsupported | Ordered chapters and native file manifests | Create/update chapters and transfer files | Preview |
| Pages, labels, URLs | Structural reads only | Authoring destination unsupported | Complete typed reads | Exact creation; mapped content update remains blocked | Partial preview |
| File resources and folders | Structural reads are incomplete | Publication unsupported | File manifests and SHA-256 verification | Exact creation; resource replacement; folder update blocked | Partial preview |
| Assignments and rubrics | Authoring round trip not proven | Unsupported | Selected authoring fields and rubric definitions | New assignment/rubric and content update; existing grading definitions protected | Partial preview |
| Workshop forms | Definition reads/writes not proven | Unsupported | Portable definitions for four standard strategies | New Workshop/form; existing definitions protected | Partial preview |
| Questions and quizzes | Partial APIs | Ownership-safe round trip not proven | Typed operations exist | Version/context transformation pending | Pending |
| Learner submissions, grades, attempts, logs | Excluded | Excluded | Excluded | Excluded | Out of scope |

`unsupported_policy=error` is the default. `skip` removes the unsupported entity and dependent actions from the executable graph and records them in `skipped`. `degrade` succeeds only for a named registered transformation; it is not a universal lossy switch.
