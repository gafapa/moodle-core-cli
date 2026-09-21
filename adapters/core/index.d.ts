import type { MoodleClient } from '../../client/moodle-rest-client.js';
import type { CourseSyncModel } from '../../sync/index.js';

export class CoreMoodleAdapter {
  constructor(options: { client: MoodleClient; profileName?: string | null });
  readonly provider: 'core';
  discoverSite(): Promise<Record<string, unknown>>;
  exportCourse(courseId: number): Promise<CourseSyncModel>;
  syncCapabilities(input?: { courseId?: number }): Promise<Record<string, boolean>>;
  applySyncAction(action: Record<string, unknown>, context: { courseId: number }): Promise<unknown>;
}

export function createCoreMoodleAdapter(options: ConstructorParameters<typeof CoreMoodleAdapter>[0]): CoreMoodleAdapter;
