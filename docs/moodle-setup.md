# Moodle setup

No Moodle Core CLI component is installed in Moodle.

An administrator must:

1. Enable web services.
2. Enable the REST protocol.
3. Create or select an external service.
4. Add the core functions required by the Moodle Core CLI operations that will be used.
5. Create a dedicated web service user.
6. Grant only the required capabilities.
7. Create a token for that user and service.

Add `core_webservice_get_site_info` for automatic Moodle version detection. If it cannot be added, configure `moodleVersion` in the library or `MOODLE_VERSION` in the CLI environment.

The operation-to-function mapping is available in `contract/operations.json`. The Moodle administrator should add only the functions needed for the intended integration.

Some operations require capabilities beyond access to the web service itself. For example, cohort visibility, group management, course completion reports, and grade reports apply their own Moodle capability checks. A function can therefore be present in the service and still reject a particular token user.
