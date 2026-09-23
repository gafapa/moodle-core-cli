import { createMoodleClient, coreErrors, MoodleClientError } from '../client/moodle-rest-client.mjs';
import { createCoreMoodleAdapter } from '../adapters/core/index.mjs';
import { describeProfile, loadProfiles, resolveProfile } from '../profiles/profiles.mjs';
import { requiredOption } from './options.mjs';

const DEFAULT_CONFIG = '.moodle-profiles.json';

export function syncMovedError() {
  return new MoodleClientError(
    'unsupported_operation',
    'Course synchronization moved to the moodlia-sync package. Install it with "npm install -g moodlia-sync" and run "moodlia-sync --help".',
    { package: 'moodlia-sync', since: '0.4.0' }
  );
}

export function printCapabilitiesHelp() {
  console.log('Usage: moodle-core capabilities --profile <name> [options]');
  console.log('');
  console.log('Discovers the Moodle release, web service functions, and contract operations of a site profile.');
  console.log('Synchronization capabilities are reported by "moodlia-sync capabilities".');
  console.log('');
  console.log(`  --config <path>             Profile file (default: ${DEFAULT_CONFIG})`);
  console.log('  --profile <name>            Site profile to inspect');
}

export async function runCapabilitiesCommand(options) {
  const profileName = requiredOption(options, 'profile', coreErrors);
  const profile = resolveProfile(loadProfiles(options.config ?? DEFAULT_CONFIG), profileName);
  const credentials = profile.credentials.core;
  if (!credentials) {
    throw coreErrors.validation(`Profile ${profile.name} does not configure Core credentials.`, {
      profile: profile.name,
      provider: 'core'
    });
  }
  const adapter = createCoreMoodleAdapter({
    client: createMoodleClient({
      baseUrl: profile.url,
      token: credentials.token,
      allowInsecure: profile.allow_insecure,
      readOnly: true
    }),
    profileName: profile.name
  });
  return { profile: describeProfile(profile), discovery: await adapter.discoverSite() };
}
