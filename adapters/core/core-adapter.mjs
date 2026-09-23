import { parseMoodleVersion } from '../../client/moodle-rest-client.mjs';

export class CoreMoodleAdapter {
  constructor({ client, profileName = null }) {
    if (!client) throw new TypeError('client is required.');
    this.client = client;
    this.provider = 'core';
    this.profileName = profileName;
    this.discovery = null;
  }

  async discoverSite() {
    const payload = await this.client.transport.callFunction('core_webservice_get_site_info');
    const moodleVersion = String(payload.release ?? payload.version ?? '');
    if (!this.client.moodleVersion) this.client.moodleVersion = parseMoodleVersion(moodleVersion);
    this.client.assertSupportedVersion();
    this.discovery = {
      provider: 'core',
      profile: this.profileName,
      site_url: String(payload.siteurl ?? ''),
      site_name: String(payload.sitename ?? ''),
      moodle_version: this.client.moodleVersion,
      moodle_release: moodleVersion,
      user_id: Number(payload.userid ?? 0),
      functions: (payload.functions ?? []).map((entry) => String(entry.name ?? entry)).filter(Boolean),
      operations: this.client.operationNames()
    };
    return this.discovery;
  }
}

export function createCoreMoodleAdapter(options) {
  return new CoreMoodleAdapter(options);
}
