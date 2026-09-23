import type { MoodleClient } from '../../client/moodle-rest-client.js';

/** Site discovery for Moodle Core. moodlia-sync extends it with synchronization. */
export class CoreMoodleAdapter {
  constructor(options: { client: MoodleClient; profileName?: string | null });
  readonly client: MoodleClient;
  readonly provider: 'core';
  profileName: string | null;
  discovery: Record<string, unknown> | null;
  discoverSite(): Promise<Record<string, unknown>>;
}

export function createCoreMoodleAdapter(options: ConstructorParameters<typeof CoreMoodleAdapter>[0]): CoreMoodleAdapter;
