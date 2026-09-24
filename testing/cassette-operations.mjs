// The read operations recorded from, and replayed against, each Moodle branch.
// Later steps may use earlier results, for example the lab source course id.

function labSourceCourseId(results) {
  const course = (results.courses ?? []).find((entry) => entry.shortname === 'LAB-SOURCE');
  if (!course) throw new Error('The lab site has no LAB-SOURCE course.');
  return course.id;
}

export const CASSETTE_OPERATIONS = Object.freeze([
  { name: 'site', operation: 'get_site_info', parameters: () => ({}) },
  { name: 'courses', operation: 'get_courses', parameters: () => ({}) },
  { name: 'categories', operation: 'get_course_categories', parameters: () => ({}) },
  { name: 'course', operation: 'get_course', parameters: (results) => ({ course_id: labSourceCourseId(results) }) },
  { name: 'contents', operation: 'get_course_contents', parameters: (results) => ({ course_id: labSourceCourseId(results) }) },
  { name: 'groups', operation: 'get_course_groups', parameters: (results) => ({ course_id: labSourceCourseId(results) }) },
  { name: 'groupings', operation: 'get_course_groupings', parameters: (results) => ({ course_id: labSourceCourseId(results) }) },
  { name: 'enrolled', operation: 'get_enrolled_users', parameters: (results) => ({ course_id: labSourceCourseId(results) }) }
]);
