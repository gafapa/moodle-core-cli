import {
  createMoodleClient,
  type GetConversationsResponse,
  type MoodleOperationResponse
} from 'moodle-core-cli';
import { auditCourse } from 'moodle-core-cli/workflows';

const client = createMoodleClient({
  baseUrl: 'https://moodle.example.com',
  token: 'example-token',
  moodleVersion: '5.2'
});

const conversationsPromise: Promise<GetConversationsResponse> = client.get_conversations({
  user_id: 7,
  limit: 20
});

const coursesPromise: Promise<MoodleOperationResponse<'get_courses'>> = client.get_courses({
  course_ids: [1, 2]
});

void conversationsPromise;
void coursesPromise;
void auditCourse;
