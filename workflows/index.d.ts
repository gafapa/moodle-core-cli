import type { MoodleClient } from '../client/moodle-rest-client.js';

export function auditCourse(client: MoodleClient, input: { courseId: number }): Promise<Record<string, unknown>>;
export function getCourseProgressReport(client: MoodleClient, input: {
  courseId: number;
  userIds?: number[];
  maximumUsers?: number;
}): Promise<Record<string, unknown>>;
export function auditCourseCompletion(
  client: MoodleClient,
  input: { courseId: number }
): Promise<Record<string, unknown>>;
export function planCourseCompletionRepair(
  audit: Record<string, unknown>,
  options?: { mode?: 'book_view_only' | 'all_grade_to_view' | 'disable_all' }
): Record<string, unknown>;
export function planManualEnrolmentSync(client: MoodleClient, input: {
  courseId: number;
  desired: Array<Record<string, unknown>>;
}): Promise<Record<string, unknown>>;
export function applyManualEnrolmentSync(
  client: MoodleClient,
  plan: Record<string, unknown>,
  options: { planDigest: string }
): Promise<Record<string, unknown>>;
