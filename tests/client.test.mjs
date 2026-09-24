import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  createMoodleClient,
  encodeMoodleParameters,
  RestTransport,
  MoodleConnectionError,
  MoodlePayloadTooLargeError,
  MoodlePermissionError,
  MoodleUnsupportedVersionError,
  MoodleValidationError,
  redactOperationResult
} from '../client/moodle-rest-client.mjs';

function createTransport(responses) {
  const calls = [];
  return {
    calls,
    async callFunction(functionName, parameters = {}) {
      calls.push({ functionName, parameters });
      if (!Object.hasOwn(responses, functionName)) {
        throw new Error(`Unexpected function: ${functionName}`);
      }
      const response = responses[functionName];
      return typeof response === 'function' ? response(parameters) : response;
    }
  };
}

test('encodes Moodle nested arrays and booleans', () => {
  const encoded = encodeMoodleParameters({
    courses: [{ fullname: 'Course', visible: true }],
    ids: [4, 9]
  });

  assert.equal(encoded.get('courses[0][fullname]'), 'Course');
  assert.equal(encoded.get('courses[0][visible]'), '1');
  assert.equal(encoded.get('ids[0]'), '4');
  assert.equal(encoded.get('ids[1]'), '9');
});

test('detects Moodle 5 and normalizes courses', async () => {
  const transport = createTransport({
    core_webservice_get_site_info: {
      release: '5.0.2+ (Build: 20260710)'
    },
    core_course_get_courses: [{
      id: 12,
      fullname: 'Example course',
      shortname: 'EXAMPLE',
      categoryid: 3,
      summary: '<div class="no-overflow"><p>Portable summary</p></div>',
      visible: 1,
      startdate: 100,
      enddate: 0
    }]
  });
  const client = createMoodleClient({ transport });

  const courses = await client.get_courses();

  assert.equal(client.moodleVersion, '5.0');
  assert.deepEqual(courses, [{
    id: 12,
      fullname: 'Example course',
      shortname: 'EXAMPLE',
      category_id: 3,
      idnumber: null,
      summary: '<p>Portable summary</p>',
      summary_format: null,
      visible: true,
    start_date: 100,
    end_date: 0
  }]);
  assert.deepEqual(transport.calls.map((call) => call.functionName), [
    'core_webservice_get_site_info',
    'core_course_get_courses'
  ]);
});

test('gets site information with a single request during version detection', async () => {
  const transport = createTransport({
    core_webservice_get_site_info: {
      sitename: 'Example Moodle',
      siteurl: 'https://moodle.example.com',
      release: '5.1.1 (Build: 20260710)',
      userid: 7,
      username: 'service-user',
      fullname: 'Service User'
    }
  });
  const client = createMoodleClient({ transport });

  const result = await client.get_site_info();

  assert.equal(result.moodle_version, '5.1');
  assert.equal(result.site_name, 'Example Moodle');
  assert.equal(transport.calls.length, 1);
});

test('maps one friendly create operation to Moodle batch parameters', async () => {
  const transport = createTransport({
    core_course_create_courses(parameters) {
      assert.deepEqual(parameters, {
        courses: [{
          fullname: 'Biology',
          shortname: 'BIO',
          categoryid: 2,
          idnumber: undefined,
          summary: undefined,
          visible: true,
          startdate: undefined,
          enddate: undefined
        }]
      });
      return [{ id: 99, shortname: 'BIO' }];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.1' });

  const result = await client.create_course({
    fullname: 'Biology',
    shortname: 'BIO',
    category_id: 2,
    visible: true
  });

  assert.deepEqual(result, { id: 99, shortname: 'BIO' });
});

test('rejects unsupported Moodle versions before an operation call', async () => {
  const transport = createTransport({});
  const client = createMoodleClient({ transport, moodleVersion: '4.4' });

  await assert.rejects(() => client.get_courses(), MoodleUnsupportedVersionError);
  assert.equal(transport.calls.length, 0);
});

test('accepts the Moodle 4.5 and 5.3 compatibility boundaries', async () => {
  for (const moodleVersion of ['4.5', '5.3']) {
    const transport = createTransport({
      core_course_get_courses: []
    });
    const client = createMoodleClient({ transport, moodleVersion });

    assert.deepEqual(await client.get_courses(), []);
    assert.equal(transport.calls.length, 1);
  }
});

test('rejects operations removed after their supported Moodle version', async () => {
  const transport = createTransport({
    tool_moodlenet_search_courses: () => {
      assert.fail('The removed MoodleNet operation must not reach the transport.');
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await assert.rejects(
    client.search_moodlenet_courses({ query: 'biology' }),
    (error) => {
      assert.equal(error.code, 'unsupported_moodle_version');
      assert.equal(error.details.supportedUntil, '5.1');
      return true;
    }
  );
});

test('rejects future Moodle branches until their static contract is audited', async () => {
  const client = createMoodleClient({
    transport: createTransport({}),
    moodleVersion: '5.4'
  });

  await assert.rejects(
    client.get_site_info({}),
    (error) => {
      assert.equal(error.code, 'unsupported_moodle_version');
      assert.equal(error.details.maximumVerifiedVersion, '5.3');
      return true;
    }
  );
});

test('validates friendly parameters before a Moodle call', async () => {
  const transport = createTransport({});
  const client = createMoodleClient({ transport, moodleVersion: '5.0' });

  await assert.rejects(
    () => client.create_course({ fullname: 'Missing fields' }),
    MoodleValidationError
  );
  assert.equal(transport.calls.length, 0);
});

test('supports comma-separated arrays for CLI-compatible input', async () => {
  const transport = createTransport({
    core_user_get_users_by_field(parameters) {
      assert.deepEqual(parameters, {
        field: 'email',
        values: ['one@example.com', 'two@example.com']
      });
      return [];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.0' });

  await client.get_users_by_field({
    field: 'email',
    values: 'one@example.com,two@example.com'
  });
});

test('normalizes course categories and optional visibility', async () => {
  const transport = createTransport({
    core_course_get_categories(parameters) {
      assert.deepEqual(parameters, {
        criteria: [{ key: 'parent', value: 4 }],
        addsubcategories: false
      });
      return [{
        id: 8,
        name: 'Science',
        description: '<p>Science courses</p>',
        parent: 4,
        coursecount: 3
      }];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const categories = await client.get_course_categories({
    parent_id: 4,
    include_subcategories: false
  });

  assert.deepEqual(categories, [{
    id: 8,
    name: 'Science',
    idnumber: null,
    description: '<p>Science courses</p>',
    parent_id: 4,
    course_count: 3,
    visible: null
  }]);
});

test('translates friendly enrolled user filters to Moodle options', async () => {
  const transport = createTransport({
    core_enrol_get_enrolled_users(parameters) {
      assert.deepEqual(parameters, {
        courseid: 42,
        options: [
          { name: 'groupid', value: 7 },
          { name: 'onlyactive', value: 1 },
          { name: 'limitnumber', value: 20 },
          { name: 'limitfrom', value: 10 }
        ]
      });
      return [{ id: 3, username: 'learner' }];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const users = await client.get_enrolled_users({
    course_id: 42,
    group_id: 7,
    only_active: true,
    limit: 20,
    offset: 10
  });

  assert.equal(users.length, 1);
});

test('normalizes one group member response', async () => {
  const transport = createTransport({
    core_group_get_group_members: [{ groupid: 9, userids: [2, 4] }]
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const members = await client.get_group_members({ group_id: 9 });

  assert.deepEqual(members, { group_id: 9, user_ids: [2, 4] });
});

test('maps completion parameters without exposing Moodle field names', async () => {
  const transport = createTransport({
    core_completion_get_course_completion_status(parameters) {
      assert.deepEqual(parameters, { courseid: 2206, userid: 2 });
      return { completionstatus: { completed: false }, warnings: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const status = await client.get_course_completion_status({
    course_id: 2206,
    user_id: 2
  });

  assert.equal(status.completionstatus.completed, false);
});

test('maps friendly calendar filters to the Moodle event selector', async () => {
  const transport = createTransport({
    core_calendar_get_calendar_events(parameters) {
      assert.deepEqual(parameters, {
        events: {
          eventids: [],
          courseids: [2206],
          groupids: [],
          categoryids: []
        },
        options: {
          userevents: false,
          siteevents: true,
          timestart: 100,
          timeend: 200,
          ignorehidden: true
        }
      });
      return { events: [], warnings: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const result = await client.get_calendar_events({
    course_ids: [2206],
    include_user_events: false,
    time_from: 100,
    time_to: 200
  });

  assert.deepEqual(result.events, []);
});

test('maps grade report filters to Moodle defaults', async () => {
  const transport = createTransport({
    gradereport_user_get_grade_items(parameters) {
      assert.deepEqual(parameters, { courseid: 2206, userid: 2, groupid: 0 });
      return { usergrades: [], warnings: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_grade_items({ course_id: 2206, user_id: 2 });
});

test('maps the complete course category write lifecycle', async () => {
  const transport = createTransport({
    core_course_create_categories(parameters) {
      assert.deepEqual(parameters, {
        categories: [{
          name: 'Science',
          parent: 4,
          idnumber: 'SCI',
          description: 'Science courses',
          theme: undefined
        }]
      });
      return [{ id: 8, name: 'Science' }];
    },
    core_course_update_categories(parameters) {
      assert.deepEqual(parameters, {
        categories: [{
          id: 8,
          name: 'Natural Science',
          parent: undefined,
          idnumber: undefined,
          description: undefined,
          theme: undefined
        }]
      });
      return null;
    },
    core_course_delete_categories(parameters) {
      assert.deepEqual(parameters, {
        categories: [{ id: 8, newparent: 4, recursive: false }]
      });
      return [];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.deepEqual(await client.create_course_category({
    name: 'Science',
    parent_id: 4,
    idnumber: 'SCI',
    description: 'Science courses'
  }), { id: 8, name: 'Science' });
  assert.deepEqual(await client.update_course_category({
    category_id: 8,
    name: 'Natural Science'
  }), { updated: true, category_id: 8 });
  assert.deepEqual(await client.delete_course_category({
    category_id: 8,
    new_parent_id: 4
  }), { deleted: true, category_id: 8, warnings: [] });
});

test('course and user updates fail when Moodle rejects the change with a warning', async () => {
  const shortnameTaken = {
    warnings: [{ item: 'course', itemid: 9, warningcode: 'shortnametaken', message: 'Short name is already used' }]
  };
  const transport = createTransport({
    core_course_update_courses: (parameters) => (parameters.courses[0].id === 9 ? shortnameTaken : { warnings: [] }),
    core_user_update_users: { warnings: [{ item: 'user', itemid: 5, warningcode: 'usernotupdated', message: 'Invalid email' }] }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.deepEqual(await client.update_course({ course_id: 3, fullname: 'Ok' }), { updated: true, course_id: 3 });
  await assert.rejects(client.update_course({ course_id: 9, shortname: 'TAKEN' }), (error) =>
    error instanceof MoodleValidationError
    && /Moodle rejected the update of course 9: shortnametaken: Short name is already used/.test(error.message)
    && error.details.moodle_warnings[0].warningcode === 'shortnametaken');
  await assert.rejects(client.update_user({ user_id: 5, email: 'bad' }), /usernotupdated: Invalid email/);
});

test('maps group detail and update operations', async () => {
  const transport = createTransport({
    core_group_get_groups(parameters) {
      assert.deepEqual(parameters, { groupids: [9] });
      return [{ id: 9, courseid: 42, name: 'Team A' }];
    },
    core_group_update_groups(parameters) {
      assert.deepEqual(parameters, {
        groups: [{
          id: 9,
          name: 'Team Alpha',
          description: 'Updated',
          idnumber: undefined,
          enrolmentkey: undefined,
          visibility: 1,
          participation: true
        }]
      });
      return null;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.equal((await client.get_group({ group_id: 9 })).name, 'Team A');
  assert.deepEqual(await client.update_group({
    group_id: 9,
    name: 'Team Alpha',
    description: 'Updated',
    visibility: 1,
    participation: true
  }), { updated: true, group_id: 9 });
});

test('maps the complete grouping lifecycle and group assignments', async () => {
  const transport = createTransport({
    core_group_create_groupings(parameters) {
      assert.deepEqual(parameters, {
        groupings: [{ courseid: 42, name: 'Labs', description: '', idnumber: '' }]
      });
      return [{ id: 12, name: 'Labs' }];
    },
    core_group_get_groupings(parameters) {
      assert.deepEqual(parameters, { groupingids: [12], returngroups: true });
      return [{ id: 12, name: 'Labs', groups: [{ id: 9 }] }];
    },
    core_group_update_groupings(parameters) {
      assert.deepEqual(parameters, {
        groupings: [{ id: 12, name: 'Laboratories', description: 'Lab groups', idnumber: '' }]
      });
      return null;
    },
    core_group_assign_grouping(parameters) {
      assert.deepEqual(parameters, { assignments: [{ groupingid: 12, groupid: 9 }] });
      return null;
    },
    core_group_unassign_grouping(parameters) {
      assert.deepEqual(parameters, { unassignments: [{ groupingid: 12, groupid: 9 }] });
      return null;
    },
    core_group_delete_groupings(parameters) {
      assert.deepEqual(parameters, { groupingids: [12] });
      return null;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.deepEqual(await client.create_grouping({ course_id: 42, name: 'Labs' }), { id: 12, name: 'Labs' });
  assert.equal((await client.get_grouping({ grouping_id: 12, include_groups: true })).groups.length, 1);
  assert.deepEqual(await client.update_grouping({
    grouping_id: 12,
    name: 'Laboratories',
    description: 'Lab groups'
  }), { updated: true, grouping_id: 12 });
  assert.deepEqual(await client.add_group_to_grouping({
    grouping_id: 12,
    group_id: 9
  }), { added: true, grouping_id: 12, group_id: 9 });
  assert.deepEqual(await client.remove_group_from_grouping({
    grouping_id: 12,
    group_id: 9
  }), { removed: true, grouping_id: 12, group_id: 9 });
  assert.deepEqual(await client.delete_grouping({ grouping_id: 12 }), { deleted: true, grouping_id: 12 });
});

test('maps the complete cohort lifecycle and membership operations', async () => {
  const transport = createTransport({
    core_cohort_create_cohorts(parameters) {
      assert.deepEqual(parameters, {
        cohorts: [{
          categorytype: { type: 'id', value: 4 },
          name: 'Teachers',
          idnumber: 'TEACHERS',
          description: undefined,
          visible: true
        }]
      });
      return [{ id: 15, name: 'Teachers' }];
    },
    core_cohort_update_cohorts(parameters) {
      assert.deepEqual(parameters, {
        cohorts: [{
          id: 15,
          categorytype: { type: 'system', value: 0 },
          name: 'All teachers',
          idnumber: 'TEACHERS',
          description: undefined,
          visible: undefined
        }]
      });
      return null;
    },
    core_cohort_get_cohort_members(parameters) {
      assert.deepEqual(parameters, { cohortids: [15] });
      return [{ cohortid: 15, userids: [2, 7] }];
    },
    core_cohort_search_cohorts(parameters) {
      assert.deepEqual(parameters, {
        query: 'teacher',
        context: { contextid: 1 },
        includes: 'all',
        limitfrom: 5,
        limitnum: 10
      });
      return { cohorts: [{ id: 15 }], totalcount: 1 };
    },
    core_cohort_add_cohort_members(parameters) {
      assert.deepEqual(parameters, {
        members: [{
          cohorttype: { type: 'id', value: 15 },
          usertype: { type: 'id', value: 7 }
        }]
      });
      return [];
    },
    core_cohort_delete_cohort_members(parameters) {
      assert.deepEqual(parameters, { members: [{ cohortid: 15, userid: 7 }] });
      return null;
    },
    core_cohort_delete_cohorts(parameters) {
      assert.deepEqual(parameters, { cohortids: [15] });
      return null;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.deepEqual(await client.create_cohort({
    name: 'Teachers',
    idnumber: 'TEACHERS',
    category_id: 4,
    visible: true
  }), { id: 15, name: 'Teachers' });
  assert.deepEqual(await client.update_cohort({
    cohort_id: 15,
    name: 'All teachers',
    idnumber: 'TEACHERS'
  }), { updated: true, cohort_id: 15 });
  assert.deepEqual(await client.get_cohort_members({ cohort_id: 15 }), {
    cohort_id: 15,
    user_ids: [2, 7]
  });
  assert.equal((await client.search_cohorts({
    query: 'teacher',
    context_id: 1,
    include_contexts: 'all',
    limit: 10,
    offset: 5
  })).totalcount, 1);
  assert.deepEqual(await client.add_cohort_member({ cohort_id: 15, user_id: 7 }), {
    added: true,
    cohort_id: 15,
    user_id: 7,
    warnings: []
  });
  assert.deepEqual(await client.remove_cohort_member({ cohort_id: 15, user_id: 7 }), {
    removed: true,
    cohort_id: 15,
    user_id: 7
  });
  assert.deepEqual(await client.delete_cohort({ cohort_id: 15 }), { deleted: true, cohort_id: 15 });
});

test('validates upper ranges introduced by group visibility', async () => {
  const transport = createTransport({});
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await assert.rejects(
    () => client.update_group({ group_id: 9, name: 'Invalid', visibility: 4 }),
    MoodleValidationError
  );
  assert.equal(transport.calls.length, 0);
});

test('maps role assignments to friendly Moodle context names', async () => {
  const transport = createTransport({
    core_role_assign_roles(parameters) {
      assert.deepEqual(parameters, {
        assignments: [{ roleid: 5, userid: 7, contextlevel: 'coursecat', instanceid: 4 }]
      });
      return null;
    },
    core_role_unassign_roles(parameters) {
      assert.deepEqual(parameters, {
        unassignments: [{ roleid: 5, userid: 7, contextlevel: 'coursecat', instanceid: 4 }]
      });
      return null;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.deepEqual(await client.assign_role({
    role_id: 5,
    user_id: 7,
    context_type: 'course_category',
    instance_id: 4
  }), { assigned: true, role_id: 5, user_id: 7 });
  assert.deepEqual(await client.unassign_role({
    role_id: 5,
    user_id: 7,
    context_type: 'course_category',
    instance_id: 4
  }), { unassigned: true, role_id: 5, user_id: 7 });
});

test('maps enrolment discovery and participant search operations', async () => {
  const transport = createTransport({
    core_enrol_get_users_courses(parameters) {
      assert.deepEqual(parameters, { userid: 7, returnusercount: false });
      return [];
    },
    core_enrol_get_course_enrolment_methods(parameters) {
      assert.deepEqual(parameters, { courseid: 42 });
      return [];
    },
    core_enrol_get_enrolled_users_with_capability(parameters) {
      assert.deepEqual(parameters, {
        coursecapabilities: [{ courseid: 42, capabilities: ['mod/forum:replypost'] }],
        options: [
          { name: 'onlyactive', value: 1 },
          { name: 'limitnumber', value: 10 }
        ]
      });
      return [];
    },
    core_enrol_search_users(parameters) {
      assert.deepEqual(parameters, {
        courseid: 42,
        search: 'Ada',
        searchanywhere: true,
        page: 0,
        perpage: 20,
        contextid: undefined
      });
      return { totalusers: 0, users: [] };
    },
    core_enrol_get_potential_users(parameters) {
      assert.deepEqual(parameters, {
        courseid: 42,
        enrolid: 3,
        search: '',
        searchanywhere: true,
        page: 0,
        perpage: 25
      });
      return { totalusers: 0, users: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_user_courses({ user_id: 7 });
  await client.get_course_enrolment_methods({ course_id: 42 });
  await client.get_enrolled_users_with_capability({
    course_id: 42,
    capabilities: ['mod/forum:replypost'],
    only_active: true,
    limit: 10
  });
  await client.search_enrolled_users({ course_id: 42, query: 'Ada', page_size: 20 });
  await client.get_potential_enrolment_users({ course_id: 42, enrolment_id: 3 });
});

test('maps self enrolment and individual enrolment management', async () => {
  const transport = createTransport({
    enrol_self_get_instance_info(parameters) {
      assert.deepEqual(parameters, { instanceid: 3 });
      return { id: 3, courseid: 42, type: 'self', name: 'Self enrolment', status: true };
    },
    enrol_self_enrol_user(parameters) {
      assert.deepEqual(parameters, { courseid: 42, password: 'join', instanceid: 3 });
      return { status: true, warnings: [] };
    },
    core_enrol_submit_user_enrolment_form(parameters) {
      const formData = new URLSearchParams(parameters.formdata);
      assert.equal(formData.get('ue'), '88');
      assert.equal(formData.get('status'), '1');
      assert.equal(formData.get('timestart'), '100');
      assert.equal(formData.get('timeend'), '200');
      return { result: true, errors: [] };
    },
    core_enrol_unenrol_user_enrolment(parameters) {
      assert.deepEqual(parameters, { ueid: 88 });
      return { result: true, errors: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  assert.equal((await client.get_self_enrolment_info({ enrolment_id: 3 })).id, 3);
  assert.equal((await client.self_enrol({
    course_id: 42,
    enrolment_key: 'join',
    enrolment_id: 3
  })).status, true);
  assert.equal((await client.update_user_enrolment({
    enrolment_id: 88,
    status: 'suspended',
    start_time: 100,
    end_time: 200
  })).result, true);
  assert.equal((await client.delete_user_enrolment({ enrolment_id: 88 })).result, true);
});

test('maps grade report and gradebook read operations', async () => {
  const transport = createTransport({
    gradereport_user_get_grades_table(parameters) {
      assert.deepEqual(parameters, { courseid: 42, userid: 7, groupid: 0 });
      return { tables: [], warnings: [] };
    },
    gradereport_overview_get_course_grades(parameters) {
      assert.deepEqual(parameters, { userid: 7 });
      return { grades: [], warnings: [] };
    },
    gradereport_user_get_access_information(parameters) {
      assert.deepEqual(parameters, { courseid: 42 });
      return { canviewmygrades: true, warnings: [] };
    },
    core_grades_get_gradeitems(parameters) {
      assert.deepEqual(parameters, { courseid: 42 });
      return { gradeItems: [], warnings: [] };
    },
    core_grades_get_grade_tree(parameters) {
      assert.deepEqual(parameters, { courseid: 42 });
      return '{"id":1,"children":[]}';
    },
    core_grades_get_gradable_users(parameters) {
      assert.deepEqual(parameters, { courseid: 42, groupid: 0, onlyactive: true });
      return { users: [], warnings: [] };
    },
    core_grades_get_feedback(parameters) {
      assert.deepEqual(parameters, { courseid: 42, userid: 7, itemid: 11 });
      return { feedback: 'Good work' };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_grades_table({ course_id: 42, user_id: 7 });
  await client.get_user_course_grades({ user_id: 7 });
  await client.get_grade_access_information({ course_id: 42 });
  await client.get_gradebook_items({ course_id: 42 });
  assert.equal((await client.get_grade_tree({ course_id: 42 })).id, 1);
  await client.get_gradable_users({ course_id: 42, only_active: true });
  assert.equal((await client.get_grade_feedback({
    course_id: 42,
    user_id: 7,
    grade_item_id: 11
  })).feedback, 'Good work');
});

test('maps grade category creation and grade updates', async () => {
  const transport = createTransport({
    core_grades_create_gradecategories(parameters) {
      assert.deepEqual(parameters, {
        courseid: 42,
        categories: [{
          fullname: 'Assessments',
          options: {
            aggregation: 13,
            droplow: 1,
            idnumber: undefined,
            grademax: 100,
            grademin: undefined,
            gradepass: 50,
            parentcategoryid: undefined
          }
        }]
      });
      return [{ id: 21 }];
    },
    core_grades_update_grades(parameters) {
      assert.deepEqual(parameters, {
        source: 'moodle-core-cli',
        courseid: 42,
        component: 'mod_assign',
        activityid: 8,
        itemnumber: 0,
        grades: [{
          studentid: 7,
          grade: 85,
          str_feedback: 'Good'
        }]
      });
      return 0;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.create_grade_category({
    course_id: 42,
    name: 'Assessments',
    aggregation: 13,
    drop_low: 1,
    grade_max: 100,
    grade_pass: 50
  });
  assert.deepEqual(await client.update_grade_value({
    source: 'moodle-core-cli',
    course_id: 42,
    component: 'mod_assign',
    activity_id: 8,
    user_id: 7,
    grade: 85,
    feedback: 'Good'
  }), { status: 0 });
});

test('maps all public completion write operations', async () => {
  const transport = createTransport({
    core_completion_update_activity_completion_status_manually(parameters) {
      assert.deepEqual(parameters, { cmid: 90, completed: true });
      return { status: true, warnings: [] };
    },
    core_completion_override_activity_completion_status(parameters) {
      assert.deepEqual(parameters, { userid: 7, cmid: 90, newstate: 2 });
      return { state: 2 };
    },
    core_completion_mark_course_self_completed(parameters) {
      assert.deepEqual(parameters, { courseid: 42 });
      return { status: true, warnings: [] };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.set_activity_completion_status({ module_id: 90, completed: true });
  await client.override_activity_completion_status({ module_id: 90, user_id: 7, state: 2 });
  await client.mark_course_self_completed({ course_id: 42 });
});

test('uploads a local file through the dedicated Moodle endpoint', async () => {
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-upload-'));
  const sourcePath = path.join(temporaryDirectory, 'source.txt');
  await fs.writeFile(sourcePath, 'file contents');
  try {
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 'secret',
      allowedFileRoots: [temporaryDirectory],
      fetchImplementation: async (url, options) => {
        assert.equal(url.pathname, '/webservice/upload.php');
        assert.equal(url.search, '', 'the token must not travel in the URL');
        assert.ok(options.body instanceof FormData);
        assert.equal(options.body.get('token'), 'secret');
        assert.equal(options.body.get('itemid'), '17');
        assert.equal(options.body.get('filepath'), '/subfolder/');
        assert.equal(options.body.get('file_1').name, 'renamed.txt');
        return new Response(JSON.stringify([{
          component: 'user',
          contextid: 5,
          userid: '7',
          filearea: 'draft',
          filename: 'renamed.txt',
          filepath: '/subfolder/',
          itemid: 17
        }]), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
    });
    const client = createMoodleClient({ transport, moodleVersion: '5.2' });

    const result = await client.upload_draft_file({
      file_path: sourcePath,
      item_id: 17,
      draft_path: '/subfolder/',
      filename: 'renamed.txt'
    });

    assert.deepEqual(result, {
      component: 'user',
      context_id: 5,
      user_id: 7,
      file_area: 'draft',
      filename: 'renamed.txt',
      file_path: '/subfolder/',
      item_id: 17
    });
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test('downloads only same-site Moodle plugin files and protects existing destinations', async () => {
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-download-'));
  const destinationPath = path.join(temporaryDirectory, 'nested', 'download.txt');
  try {
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 'secret',
      allowedFileRoots: [temporaryDirectory],
      fetchImplementation: async (url) => {
        assert.equal(url.pathname, '/webservice/pluginfile.php/3/mod_assign/submission/file.txt');
        assert.equal(url.searchParams.get('token'), 'secret');
        return new Response('download contents', {
          status: 200,
          headers: { 'content-type': 'text/plain' }
        });
      }
    });
    const client = createMoodleClient({ transport, moodleVersion: '5.2' });

    const result = await client.download_file({
      file_url: 'https://moodle.example.com/pluginfile.php/3/mod_assign/submission/file.txt',
      destination_path: destinationPath
    });

    assert.equal(await fs.readFile(destinationPath, 'utf8'), 'download contents');
    assert.equal(result.size, 17);
    assert.equal(result.content_type, 'text/plain');
    await assert.rejects(
      () => client.download_file({
        file_url: 'https://moodle.example.com/pluginfile.php/3/mod_assign/submission/file.txt',
        destination_path: destinationPath
      }),
      MoodleValidationError
    );
    await assert.rejects(
      () => client.download_file({
        file_url: 'https://other.example.com/pluginfile.php/3/file.txt',
        destination_path: path.join(temporaryDirectory, 'other.txt')
      }),
      MoodleValidationError
    );
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test('blocks writes, denied operations, and dangerous generic operations through client policy', async () => {
  const transport = createTransport({
    core_course_create_courses: [],
    core_course_get_courses: [],
    tool_mobile_call_external_functions: {}
  });
  const readOnlyClient = createMoodleClient({
    transport,
    moodleVersion: '5.2',
    readOnly: true
  });
  await assert.rejects(
    () => readOnlyClient.create_course({ fullname: 'Course', shortname: 'C', category_id: 1 }),
    MoodlePermissionError
  );

  const deniedClient = createMoodleClient({
    transport,
    moodleVersion: '5.2',
    deniedOperations: ['get_courses']
  });
  await assert.rejects(() => deniedClient.get_courses(), MoodlePermissionError);

  const allowlistedClient = createMoodleClient({
    transport,
    moodleVersion: '5.2',
    allowedOperations: ['get_site_info']
  });
  await assert.rejects(() => allowlistedClient.get_courses(), MoodlePermissionError);

  const safeClient = createMoodleClient({ transport, moodleVersion: '5.2' });
  await assert.rejects(
    () => safeClient.call_mobile_external_functions({ requests: [] }),
    MoodlePermissionError
  );
  await assert.rejects(
    () => safeClient.admin_set_plugin_state({ plugin: 'mod_example', state: 0 }),
    MoodlePermissionError
  );
  assert.equal(transport.calls.length, 0);
});

test('sets redirect error mode on every authenticated request', async () => {
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-redirect-'));
  const sourcePath = path.join(temporaryDirectory, 'source.txt');
  const destinationPath = path.join(temporaryDirectory, 'destination.txt');
  await fs.writeFile(sourcePath, 'data');
  const redirects = [];
  try {
    const transport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 'secret',
      allowedFileRoots: [temporaryDirectory],
      fetchImplementation: async (url, options) => {
        redirects.push(options.redirect);
        if (url.pathname.endsWith('server.php')) return new Response('{}');
        if (url.pathname.endsWith('upload.php')) return new Response('[{"filename":"source.txt"}]');
        return new Response('download');
      }
    });
    await transport.callFunction('core_webservice_get_site_info');
    await transport.uploadDraftFile({ filePath: sourcePath });
    await transport.downloadFile({
      fileUrl: 'https://moodle.example.com/pluginfile.php/1/file.txt',
      destinationPath
    });
    assert.deepEqual(redirects, ['error', 'error', 'error']);
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test('enforces response, upload, download, and file-root limits', async () => {
  const allowedDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-allowed-'));
  const outsideDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'moodle-core-outside-'));
  const oversizedUpload = path.join(allowedDirectory, 'large.txt');
  const outsideUpload = path.join(outsideDirectory, 'outside.txt');
  await fs.writeFile(oversizedUpload, '12345');
  await fs.writeFile(outsideUpload, 'data');
  try {
    const disabledFileTransport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 'secret',
      fetchImplementation: async () => new Response('{}')
    });
    await assert.rejects(
      () => disabledFileTransport.uploadDraftFile({ filePath: oversizedUpload }),
      MoodlePermissionError
    );

    const responseTransport = new RestTransport({
      baseUrl: 'https://moodle.example.com',
      token: 'secret',
      allowedFileRoots: [allowedDirectory],
      maximumResponseBytes: 4,
      maximumUploadBytes: 4,
      maximumDownloadBytes: 4,
      fetchImplementation: async (url) => url.pathname.endsWith('pluginfile.php/1/file.txt')
        ? new Response('12345')
        : new Response('{"too":"large"}')
    });
    await assert.rejects(
      () => responseTransport.callFunction('core_webservice_get_site_info'),
      MoodlePayloadTooLargeError
    );
    await assert.rejects(
      () => responseTransport.uploadDraftFile({ filePath: oversizedUpload }),
      MoodlePayloadTooLargeError
    );
    await assert.rejects(
      () => responseTransport.uploadDraftFile({ filePath: outsideUpload }),
      MoodlePermissionError
    );
    const destinationPath = path.join(allowedDirectory, 'download.txt');
    await assert.rejects(
      () => responseTransport.downloadFile({
        fileUrl: 'https://moodle.example.com/webservice/pluginfile.php/1/file.txt',
        destinationPath
      }),
      MoodlePayloadTooLargeError
    );
    await assert.rejects(() => fs.access(destinationPath));
    await assert.rejects(
      () => responseTransport.downloadFile({
        fileUrl: 'https://moodle.example.com/webservice/pluginfile.php/1/file.txt',
        destinationPath: path.join(outsideDirectory, 'download.txt')
      }),
      MoodlePermissionError
    );
    const linkedDirectory = path.join(allowedDirectory, 'linked');
    try {
      await fs.symlink(outsideDirectory, linkedDirectory, 'junction');
      await assert.rejects(
        () => responseTransport.downloadFile({
          fileUrl: 'https://moodle.example.com/webservice/pluginfile.php/1/file.txt',
          destinationPath: path.join(linkedDirectory, 'escaped.txt')
        }),
        MoodlePermissionError
      );
      await assert.rejects(() => fs.access(path.join(outsideDirectory, 'escaped.txt')));
    } catch (error) {
      if (!['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) throw error;
    }
  } finally {
    await fs.rm(allowedDirectory, { recursive: true, force: true });
    await fs.rm(outsideDirectory, { recursive: true, force: true });
  }
});

test('redacts secret results and omits Moodle debug information by default', () => {
  assert.deepEqual(
    redactOperationResult('get_mobile_qr_login_tokens', {
      token: 'secret-token',
      expires: 123
    }),
    {
      token: '[REDACTED]',
      expires: '[REDACTED]'
    }
  );
  assert.deepEqual(
    redactOperationResult('get_user_preferences', {
      api_key: 'secret-key',
      theme: 'boost'
    }),
    {
      api_key: '[REDACTED]',
      theme: 'boost'
    }
  );
  const error = new MoodleConnectionError('Failed.', {
    debuginfo: '/private/path SQL statement',
    functionName: 'example',
    token: 'secret-token'
  });
  assert.deepEqual(error.toJSON().details, {
    functionName: 'example',
    token: '[REDACTED]'
  });
  assert.equal(error.toJSON({ includeDebug: true }).details.debuginfo, '/private/path SQL statement');
});

test('removes the client token and sensitive parameters from Moodle errors', async () => {
  const transport = new RestTransport({
    baseUrl: 'https://moodle.example.com',
    token: 'client-secret-token',
    fetchImplementation: async () => new Response(JSON.stringify({
      exception: 'invalid_parameter_exception',
      errorcode: 'invalidparameter',
      message: 'Password quiz-secret-password failed for client-secret-token',
      debuginfo: 'Received quiz-secret-password using client-secret-token'
    }))
  });
  await assert.rejects(
    () => transport.callFunction('mod_quiz_start_attempt', {
      password: 'quiz-secret-password'
    }),
    (error) => {
      assert.doesNotMatch(error.message, /quiz-secret-password|client-secret-token/);
      assert.doesNotMatch(
        error.toJSON({ includeDebug: true }).details.debuginfo,
        /quiz-secret-password|client-secret-token/
      );
      return true;
    }
  );
});

test('maps assignment discovery, submissions, grades, and participants', async () => {
  const transport = createTransport({
    mod_assign_get_assignments(parameters) {
      assert.deepEqual(parameters, {
        courseids: [42],
        capabilities: [],
        includenotenrolledcourses: false
      });
      return { courses: [], warnings: [] };
    },
    mod_assign_get_submissions(parameters) {
      assert.deepEqual(parameters, { assignmentids: [8], status: 'submitted', since: 100, before: 200 });
      return { assignments: [], warnings: [] };
    },
    mod_assign_get_grades(parameters) {
      assert.deepEqual(parameters, { assignmentids: [8], since: 0 });
      return { assignments: [], warnings: [] };
    },
    mod_assign_get_submission_status(parameters) {
      assert.deepEqual(parameters, { assignid: 8, userid: 7, groupid: 0 });
      return { lastattempt: {}, warnings: [] };
    },
    mod_assign_list_participants(parameters) {
      assert.deepEqual(parameters, {
        assignid: 8,
        groupid: 0,
        filter: 'Ada',
        skip: 0,
        limit: 10,
        onlyids: false,
        includeenrolments: true,
        tablesort: false,
        marking: false
      });
      return [];
    },
    mod_assign_get_participant(parameters) {
      assert.deepEqual(parameters, { assignid: 8, userid: 7, embeduser: true });
      return { id: 7 };
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_assignments({ course_ids: [42] });
  await client.get_assignment_submissions({
    assignment_ids: [8],
    status: 'submitted',
    modified_since: 100,
    modified_before: 200
  });
  await client.get_assignment_grades({ assignment_ids: [8] });
  await client.get_assignment_submission_status({ assignment_id: 8, user_id: 7 });
  await client.get_assignment_participants({ assignment_id: 8, query: 'Ada', limit: 10 });
  await client.get_assignment_participant({ assignment_id: 8, user_id: 7, include_user: true });
});

test('maps assignment submission and grading workflows', async () => {
  const transport = createTransport({
    mod_assign_start_submission(parameters) {
      assert.deepEqual(parameters, { assignid: 8 });
      return { submission: { id: 1 }, warnings: [] };
    },
    mod_assign_save_submission(parameters) {
      assert.deepEqual(parameters, {
        assignmentid: 8,
        plugindata: {
          onlinetext_editor: { text: 'My answer', format: 1, itemid: 0 },
          files_filemanager: 17
        }
      });
      return [];
    },
    mod_assign_submit_for_grading(parameters) {
      assert.deepEqual(parameters, { assignmentid: 8, acceptsubmissionstatement: true });
      return [];
    },
    mod_assign_save_grade(parameters) {
      assert.deepEqual(parameters, {
        assignmentid: 8,
        userid: 7,
        grade: 90,
        attemptnumber: -1,
        addattempt: false,
        workflowstate: 'released',
        applytoall: false,
        plugindata: {
          assignfeedbackcomments_editor: { text: 'Excellent', format: 1 }
        },
        advancedgradingdata: {}
      });
      return null;
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.start_assignment_submission({ assignment_id: 8 });
  await client.save_assignment_submission({
    assignment_id: 8,
    online_text: 'My answer',
    file_draft_item_id: 17
  });
  await client.submit_assignment_for_grading({
    assignment_id: 8,
    accept_submission_statement: true
  });
  assert.deepEqual(await client.save_assignment_grade({
    assignment_id: 8,
    user_id: 7,
    grade: 90,
    workflow_state: 'released',
    feedback_text: 'Excellent'
  }), { saved: true, assignment_id: 8, user_id: 7 });
});

test('maps assignment flags, locks, extensions, and administrative actions', async () => {
  const expectedFunctions = new Map([
    ['mod_assign_set_user_flags', { assignmentid: 8, userflags: [{ userid: 7, locked: true, extensionduedate: undefined, workflowstate: undefined, allocatedmarker: undefined }] }],
    ['mod_assign_get_user_flags', { assignmentids: [8] }],
    ['mod_assign_get_user_mappings', { assignmentids: [8] }],
    ['mod_assign_lock_submissions', { assignmentid: 8, userids: [7] }],
    ['mod_assign_unlock_submissions', { assignmentid: 8, userids: [7] }],
    ['mod_assign_revert_submissions_to_draft', { assignmentid: 8, userids: [7] }],
    ['mod_assign_save_user_extensions', { assignmentid: 8, userids: [7], dates: [500] }],
    ['mod_assign_reveal_identities', { assignmentid: 8 }],
    ['mod_assign_copy_previous_attempt', { assignmentid: 8 }],
    ['mod_assign_remove_submission', { assignid: 8, userid: 7 }]
  ]);
  const responses = Object.fromEntries([...expectedFunctions].map(([functionName, expected]) => [
    functionName,
    (parameters) => {
      assert.deepEqual(parameters, expected);
      return [];
    }
  ]));
  const transport = createTransport(responses);
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.set_assignment_user_flags({ assignment_id: 8, user_id: 7, locked: true });
  await client.get_assignment_user_flags({ assignment_ids: [8] });
  await client.get_assignment_user_mappings({ assignment_ids: [8] });
  await client.lock_assignment_submissions({ assignment_id: 8, user_ids: [7] });
  await client.unlock_assignment_submissions({ assignment_id: 8, user_ids: [7] });
  await client.revert_assignment_submissions_to_draft({ assignment_id: 8, user_ids: [7] });
  await client.set_assignment_extension({ assignment_id: 8, user_id: 7, extension_due_date: 500 });
  await client.reveal_assignment_identities({ assignment_id: 8 });
  await client.copy_previous_assignment_attempt({ assignment_id: 8 });
  await client.remove_assignment_submission({ assignment_id: 8, user_id: 7 });
});

test('maps all assignment view event operations', async () => {
  const transport = createTransport({
    mod_assign_view_assign: { status: true, warnings: [] },
    mod_assign_view_submission_status: { status: true, warnings: [] },
    mod_assign_view_grading_table: { status: true, warnings: [] }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.view_assignment({ assignment_id: 8 });
  await client.view_assignment_submission_status({ assignment_id: 8 });
  await client.view_assignment_grading_table({ assignment_id: 8 });
  assert.deepEqual(transport.calls.map((call) => call.parameters), [
    { assignid: 8 },
    { assignid: 8 },
    { assignid: 8 }
  ]);
});

test('maps forum discovery and read operations', async () => {
  const expectedFunctions = new Map([
    ['mod_forum_get_forums_by_courses', { courseids: [42] }],
    ['mod_forum_get_forum_discussions', { forumid: 8, sortorder: -1, page: -1, perpage: 0, groupid: 0 }],
    ['mod_forum_get_discussion_posts', {
      discussionid: 9,
      sortby: 'created',
      sortdirection: 'DESC',
      includeinlineattachments: false
    }],
    ['mod_forum_get_discussion_post', { postid: 10 }],
    ['mod_forum_get_discussion_posts_by_userid', {
      userid: 7,
      cmid: 81,
      sortby: 'modified',
      sortdirection: 'ASC'
    }],
    ['mod_forum_get_forum_access_information', { forumid: 8 }],
    ['mod_forum_can_add_discussion', { forumid: 8, groupid: -1 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name,
    (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_forums({ course_ids: [42] });
  await client.get_forum_discussions({ forum_id: 8 });
  await client.get_forum_discussion_posts({ discussion_id: 9 });
  await client.get_forum_post({ post_id: 10 });
  await client.get_forum_posts_by_user({
    user_id: 7,
    module_id: 81,
    sort_by: 'modified',
    sort_direction: 'ASC'
  });
  await client.get_forum_access_information({ forum_id: 8 });
  await client.can_add_forum_discussion({ forum_id: 8 });
});

test('maps forum discussion and post mutation operations', async () => {
  const expectedFunctions = new Map([
    ['mod_forum_add_discussion', {
      forumid: 8,
      subject: 'Topic',
      message: 'Body',
      groupid: 0,
      options: [
        { name: 'discussionsubscribe', value: true },
        { name: 'discussionpinned', value: false },
        { name: 'attachmentsid', value: 17 }
      ]
    }],
    ['mod_forum_add_discussion_post', {
      postid: 10,
      subject: 'Reply',
      message: 'Reply body',
      options: [
        { name: 'private', value: true },
        { name: 'inlineattachmentsid', value: 18 }
      ],
      messageformat: 1
    }],
    ['mod_forum_update_discussion_post', {
      postid: 10,
      subject: 'Updated',
      message: '',
      messageformat: 1,
      options: [{ name: 'pinned', value: true }]
    }],
    ['mod_forum_delete_post', { postid: 10 }],
    ['mod_forum_prepare_draft_area_for_post', {
      postid: 10,
      area: 'attachment',
      draftitemid: 0,
      filestokeep: []
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name,
    (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.create_forum_discussion({
    forum_id: 8,
    subject: 'Topic',
    message: 'Body',
    subscribe: true,
    pinned: false,
    attachment_draft_item_id: 17
  });
  await client.reply_to_forum_post({
    post_id: 10,
    subject: 'Reply',
    message: 'Reply body',
    private_reply: true,
    inline_draft_item_id: 18
  });
  await client.update_forum_post({ post_id: 10, subject: 'Updated', pinned: true });
  await client.delete_forum_post({ post_id: 10 });
  await client.prepare_forum_post_draft({ post_id: 10, area: 'attachment' });
});

test('maps forum state and view operations', async () => {
  const expectedFunctions = new Map([
    ['mod_forum_set_forum_subscription', { forumid: 8, targetstate: true }],
    ['mod_forum_set_forum_tracking', { forumid: 8, targetstate: false }],
    ['mod_forum_set_subscription_state', { forumid: 8, discussionid: 9, targetstate: true }],
    ['mod_forum_toggle_favourite_state', { discussionid: 9, targetstate: false }],
    ['mod_forum_set_pin_state', { discussionid: 9, targetstate: 1 }],
    ['mod_forum_mark_posts_read', { postids: [10, 11], discussionid: 9 }],
    ['mod_forum_view_forum', { forumid: 8 }],
    ['mod_forum_view_forum_discussion', { discussionid: 9 }]
  ]);
  const handlers = Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name,
    (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ]));
  handlers.mod_forum_set_lock_state = (parameters) => {
    assert.equal(parameters.forumid, 8);
    assert.equal(parameters.discussionid, 9);
    assert.ok(Number.isInteger(parameters.targetstate) && parameters.targetstate > 0);
    return { warnings: [] };
  };
  const transport = createTransport(handlers);
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.set_forum_subscription({ forum_id: 8, subscribed: true });
  await client.set_forum_tracking({ forum_id: 8, tracked: false });
  await client.set_forum_discussion_subscription({ forum_id: 8, discussion_id: 9, subscribed: true });
  await client.set_forum_discussion_favourite({ discussion_id: 9, favourite: false });
  await client.set_forum_discussion_pin({ discussion_id: 9, pinned: true });
  await client.set_forum_discussion_lock({ forum_id: 8, discussion_id: 9, locked: true });
  await client.mark_forum_posts_read({ discussion_id: 9, post_ids: [10, 11] });
  await client.view_forum({ forum_id: 8 });
  await client.view_forum_discussion({ discussion_id: 9 });
});

test('maps quiz discovery, grades, review, and access operations', async () => {
  const expectedFunctions = new Map([
    ['mod_quiz_get_quizzes_by_courses', { courseids: [42] }],
    ['mod_quiz_get_user_quiz_attempts', { quizid: 8, userid: 7, status: 'all', includepreviews: true }],
    ['mod_quiz_get_user_best_grade', { quizid: 8, userid: 0 }],
    ['mod_quiz_get_combined_review_options', { quizid: 8, userid: 0 }],
    ['mod_quiz_get_attempt_review', { attemptid: 9, page: -1 }],
    ['mod_quiz_get_quiz_feedback_for_grade', { quizid: 8, grade: 7.5 }],
    ['mod_quiz_get_quiz_access_information', { quizid: 8 }],
    ['mod_quiz_get_attempt_access_information', { quizid: 8, attemptid: 9 }],
    ['mod_quiz_get_quiz_required_qtypes', { quizid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_quizzes({ course_ids: [42] });
  await client.get_user_quiz_attempts({ quiz_id: 8, user_id: 7, status: 'all', include_previews: true });
  await client.get_user_quiz_best_grade({ quiz_id: 8 });
  await client.get_quiz_review_options({ quiz_id: 8 });
  await client.get_quiz_attempt_review({ attempt_id: 9 });
  await client.get_quiz_feedback_for_grade({ quiz_id: 8, grade: 7.5 });
  await client.get_quiz_access_information({ quiz_id: 8 });
  await client.get_quiz_attempt_access_information({ quiz_id: 8, attempt_id: 9 });
  await client.get_quiz_required_question_types({ quiz_id: 8 });
});

test('maps the complete quiz attempt response workflow', async () => {
  const expectedFunctions = new Map([
    ['mod_quiz_start_attempt', {
      quizid: 8,
      preflightdata: [{ name: 'quizpassword', value: 'secret' }],
      forcenew: false
    }],
    ['mod_quiz_get_attempt_data', {
      attemptid: 9,
      page: 0,
      preflightdata: [{ name: 'quizpassword', value: 'secret' }]
    }],
    ['mod_quiz_get_attempt_summary', { attemptid: 9, preflightdata: [] }],
    ['mod_quiz_save_attempt', {
      attemptid: 9,
      data: [{ name: 'q1:1_answer', value: 'Paris' }],
      preflightdata: []
    }],
    ['mod_quiz_process_attempt', {
      attemptid: 9,
      data: [{ name: 'q1:1_answer', value: 'Paris' }],
      finishattempt: true,
      timeup: false,
      preflightdata: []
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.start_quiz_attempt({ quiz_id: 8, preflight_data: { quizpassword: 'secret' } });
  await client.get_quiz_attempt_data({ attempt_id: 9, page: 0, preflight_data: { quizpassword: 'secret' } });
  await client.get_quiz_attempt_summary({ attempt_id: 9 });
  await client.save_quiz_attempt({ attempt_id: 9, responses: { 'q1:1_answer': 'Paris' } });
  await client.process_quiz_attempt({
    attempt_id: 9,
    responses: { 'q1:1_answer': 'Paris' },
    finish: true
  });
});

test('maps all quiz view event operations', async () => {
  const transport = createTransport({
    mod_quiz_view_quiz: { status: true },
    mod_quiz_view_attempt: { status: true },
    mod_quiz_view_attempt_summary: { status: true },
    mod_quiz_view_attempt_review: { status: true }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.view_quiz({ quiz_id: 8 });
  await client.view_quiz_attempt({ attempt_id: 9, page: 0, preflight_data: { quizpassword: 'secret' } });
  await client.view_quiz_attempt_summary({ attempt_id: 9 });
  await client.view_quiz_attempt_review({ attempt_id: 9 });
  assert.deepEqual(transport.calls.map((call) => call.parameters), [
    { quizid: 8 },
    { attemptid: 9, page: 0, preflightdata: [{ name: 'quizpassword', value: 'secret' }] },
    { attemptid: 9, preflightdata: [] },
    { attemptid: 9 }
  ]);
});

test('maps standard content module discovery and view operations', async () => {
  const expectedFunctions = new Map([
    ['mod_book_get_books_by_courses', { courseids: [42] }],
    ['mod_book_view_book', { bookid: 1, chapterid: 2 }],
    ['mod_folder_get_folders_by_courses', { courseids: [42] }],
    ['mod_folder_view_folder', { folderid: 3 }],
    ['mod_imscp_get_imscps_by_courses', { courseids: [42] }],
    ['mod_imscp_view_imscp', { imscpid: 4 }],
    ['mod_label_get_labels_by_courses', { courseids: [42] }],
    ['mod_page_get_pages_by_courses', { courseids: [42] }],
    ['mod_page_view_page', { pageid: 5 }],
    ['mod_resource_get_resources_by_courses', { courseids: [42] }],
    ['mod_resource_view_resource', { resourceid: 6 }],
    ['mod_url_get_urls_by_courses', { courseids: [42] }],
    ['mod_url_view_url', { urlid: 7 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_books({ course_ids: [42] });
  await client.view_book({ book_id: 1, chapter_id: 2 });
  await client.get_course_folders({ course_ids: [42] });
  await client.view_folder({ folder_id: 3 });
  await client.get_course_imscp_packages({ course_ids: [42] });
  await client.view_imscp_package({ imscp_id: 4 });
  await client.get_course_labels({ course_ids: [42] });
  await client.get_course_pages({ course_ids: [42] });
  await client.view_page({ page_id: 5 });
  await client.get_course_resources({ course_ids: [42] });
  await client.view_resource({ resource_id: 6 });
  await client.get_course_urls({ course_ids: [42] });
  await client.view_url({ url_id: 7 });
});

test('maps the complete choice module API', async () => {
  const expectedFunctions = new Map([
    ['mod_choice_get_choices_by_courses', { courseids: [42] }],
    ['mod_choice_get_choice_options', { choiceid: 8 }],
    ['mod_choice_get_choice_results', { choiceid: 8, groupid: 2 }],
    ['mod_choice_submit_choice_response', { choiceid: 8, responses: [10, 11] }],
    ['mod_choice_delete_choice_responses', { choiceid: 8, responses: [] }],
    ['mod_choice_view_choice', { choiceid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_choices({ course_ids: [42] });
  await client.get_choice_options({ choice_id: 8 });
  await client.get_choice_results({ choice_id: 8, group_id: 2 });
  await client.submit_choice_response({ choice_id: 8, option_ids: [10, 11] });
  await client.delete_choice_responses({ choice_id: 8 });
  await client.view_choice({ choice_id: 8 });
});

test('maps the complete SCORM module API', async () => {
  const expectedFunctions = new Map([
    ['mod_scorm_get_scorms_by_courses', { courseids: [42] }],
    ['mod_scorm_get_scorm_attempt_count', { scormid: 8, userid: 7, ignoremissingcompletion: true }],
    ['mod_scorm_get_scorm_scoes', { scormid: 8, organization: '' }],
    ['mod_scorm_get_scorm_user_data', { scormid: 8, attempt: 1 }],
    ['mod_scorm_insert_scorm_tracks', {
      scoid: 9,
      attempt: 1,
      tracks: [
        { element: 'cmi.core.lesson_status', value: 'completed' },
        { element: 'cmi.core.score.raw', value: '95' }
      ]
    }],
    ['mod_scorm_get_scorm_sco_tracks', { scoid: 9, userid: 7, attempt: 0 }],
    ['mod_scorm_launch_sco', { scormid: 8, scoid: 9 }],
    ['mod_scorm_get_scorm_access_information', { scormid: 8 }],
    ['mod_scorm_view_scorm', { scormid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_scorm_packages({ course_ids: [42] });
  await client.get_scorm_attempt_count({ scorm_id: 8, user_id: 7, ignore_incomplete: true });
  await client.get_scorm_contents({ scorm_id: 8 });
  await client.get_scorm_user_data({ scorm_id: 8, attempt: 1 });
  await client.save_scorm_tracks({
    sco_id: 9,
    attempt: 1,
    tracks: {
      'cmi.core.lesson_status': 'completed',
      'cmi.core.score.raw': '95'
    }
  });
  await client.get_scorm_tracks({ sco_id: 9, user_id: 7 });
  await client.launch_scorm_content({ scorm_id: 8, sco_id: 9 });
  await client.get_scorm_access_information({ scorm_id: 8 });
  await client.view_scorm({ scorm_id: 8 });
});

test('maps the complete wiki module API', async () => {
  const expectedFunctions = new Map([
    ['mod_wiki_get_wikis_by_courses', { courseids: [42] }],
    ['mod_wiki_get_subwikis', { wikiid: 8 }],
    ['mod_wiki_get_subwiki_pages', {
      wikiid: 8,
      groupid: -1,
      userid: 0,
      options: { sortby: 'title', sortdirection: 'DESC', includecontent: 0 }
    }],
    ['mod_wiki_get_subwiki_files', { wikiid: 8, groupid: 2, userid: 7 }],
    ['mod_wiki_get_page_contents', { pageid: 9 }],
    ['mod_wiki_get_page_for_editing', { pageid: 9, section: 'Intro', lockonly: false }],
    ['mod_wiki_new_page', {
      title: 'New page',
      content: 'Contents',
      contentformat: 'html',
      wikiid: 8,
      userid: 7,
      groupid: 2
    }],
    ['mod_wiki_edit_page', { pageid: 9, content: 'Updated', section: 'Intro' }],
    ['mod_wiki_view_wiki', { wikiid: 8 }],
    ['mod_wiki_view_page', { pageid: 9 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_wikis({ course_ids: [42] });
  await client.get_wiki_subwikis({ wiki_id: 8 });
  await client.get_wiki_pages({ wiki_id: 8, sort_direction: 'DESC', include_content: false });
  await client.get_wiki_files({ wiki_id: 8, group_id: 2, user_id: 7 });
  await client.get_wiki_page({ page_id: 9 });
  await client.get_wiki_page_for_editing({ page_id: 9, section: 'Intro' });
  await client.create_wiki_page({
    title: 'New page',
    content: 'Contents',
    content_format: 'html',
    wiki_id: 8,
    user_id: 7,
    group_id: 2
  });
  await client.update_wiki_page({ page_id: 9, content: 'Updated', section: 'Intro' });
  await client.view_wiki({ wiki_id: 8 });
  await client.view_wiki_page({ page_id: 9 });
});

test('maps feedback participation operations', async () => {
  const expectedFunctions = new Map([
    ['mod_feedback_get_feedbacks_by_courses', { courseids: [42] }],
    ['mod_feedback_get_feedback_access_information', { feedbackid: 8, courseid: 42 }],
    ['mod_feedback_get_current_completed_tmp', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_get_items', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_launch_feedback', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_get_page_items', { feedbackid: 8, page: 1, courseid: 0 }],
    ['mod_feedback_process_page', {
      feedbackid: 8,
      page: 1,
      responses: [{ name: 'textfield_10', value: 'Answer' }],
      goprevious: false,
      courseid: 0
    }],
    ['mod_feedback_get_unfinished_responses', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_get_finished_responses', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_get_last_completed', { feedbackid: 8, courseid: 0 }],
    ['mod_feedback_view_feedback', { feedbackid: 8, moduleviewed: true, courseid: 0 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_feedbacks({ course_ids: [42] });
  await client.get_feedback_access_information({ feedback_id: 8, course_id: 42 });
  await client.get_feedback_temporary_completion({ feedback_id: 8 });
  await client.get_feedback_items({ feedback_id: 8 });
  await client.launch_feedback({ feedback_id: 8 });
  await client.get_feedback_page({ feedback_id: 8, page: 1 });
  await client.submit_feedback_page({ feedback_id: 8, page: 1, responses: { textfield_10: 'Answer' } });
  await client.get_unfinished_feedback_responses({ feedback_id: 8 });
  await client.get_finished_feedback_responses({ feedback_id: 8 });
  await client.get_last_feedback_completion({ feedback_id: 8 });
  await client.view_feedback({ feedback_id: 8, mark_completed: true });
});

test('maps feedback reporting and question administration', async () => {
  const expectedFunctions = new Map([
    ['mod_feedback_get_analysis', { feedbackid: 8, groupid: 2, courseid: 0 }],
    ['mod_feedback_get_non_respondents', {
      feedbackid: 8,
      groupid: 0,
      sort: 'lastname',
      page: 1,
      perpage: 25,
      courseid: 0
    }],
    ['mod_feedback_get_responses_analysis', {
      feedbackid: 8,
      groupid: 2,
      page: 0,
      perpage: 50,
      courseid: 42
    }],
    ['mod_feedback_questions_reorder', { cmid: 81, itemorder: '3,1,2' }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return name === 'mod_feedback_questions_reorder' ? true : { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_feedback_analysis({ feedback_id: 8, group_id: 2 });
  await client.get_feedback_non_respondents({
    feedback_id: 8,
    sort_by: 'lastname',
    page: 1,
    page_size: 25
  });
  await client.get_feedback_responses_analysis({
    feedback_id: 8,
    group_id: 2,
    page_size: 50,
    course_id: 42
  });
  assert.equal(await client.reorder_feedback_questions({ module_id: 81, item_ids: [3, 1, 2] }), true);
});

test('maps the complete H5P activity module API', async () => {
  const expectedFunctions = new Map([
    ['mod_h5pactivity_get_h5pactivities_by_courses', { courseids: [42] }],
    ['mod_h5pactivity_get_h5pactivity_access_information', { h5pactivityid: 8 }],
    ['mod_h5pactivity_get_attempts', { h5pactivityid: 8, userids: [7] }],
    ['mod_h5pactivity_get_results', { h5pactivityid: 8, attemptids: [9] }],
    ['mod_h5pactivity_get_user_attempts', {
      h5pactivityid: 8,
      sortorder: 'lastname DESC',
      page: 1,
      perpage: 25,
      firstinitial: 'A',
      lastinitial: ''
    }],
    ['mod_h5pactivity_log_report_viewed', { h5pactivityid: 8, userid: 7, attemptid: 9 }],
    ['mod_h5pactivity_view_h5pactivity', { h5pactivityid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_h5p_activities({ course_ids: [42] });
  await client.get_h5p_access_information({ h5p_id: 8 });
  await client.get_h5p_attempts({ h5p_id: 8, user_ids: [7] });
  await client.get_h5p_results({ h5p_id: 8, attempt_ids: [9] });
  await client.get_h5p_user_attempts({
    h5p_id: 8,
    sort_order: 'lastname DESC',
    page: 1,
    page_size: 25,
    first_initial: 'A'
  });
  await client.log_h5p_report_view({ h5p_id: 8, user_id: 7, attempt_id: 9 });
  await client.view_h5p_activity({ h5p_id: 8 });
});

test('maps database discovery, entries, fields, and search operations', async () => {
  const expectedFunctions = new Map([
    ['mod_data_get_databases_by_courses', { courseids: [42] }],
    ['mod_data_get_data_access_information', { databaseid: 8, groupid: 2 }],
    ['mod_data_get_entries', {
      databaseid: 8,
      groupid: 0,
      returncontents: true,
      sort: -4,
      order: 'DESC',
      page: 1,
      perpage: 25
    }],
    ['mod_data_get_entry', { entryid: 9, returncontents: true }],
    ['mod_data_get_fields', { databaseid: 8 }],
    ['mod_data_search_entries', {
      databaseid: 8,
      groupid: 0,
      returncontents: false,
      search: '',
      advsearch: [{ name: 'fn', value: 'Ada' }],
      page: 0,
      perpage: 0
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_databases({ course_ids: [42] });
  await client.get_database_access_information({ database_id: 8, group_id: 2 });
  await client.get_database_entries({
    database_id: 8,
    include_contents: true,
    sort_field_id: -4,
    sort_direction: 'DESC',
    page: 1,
    page_size: 25
  });
  await client.get_database_entry({ entry_id: 9, include_contents: true });
  await client.get_database_fields({ database_id: 8 });
  await client.search_database_entries({ database_id: 8, advanced_search: { fn: 'Ada' } });
});

test('maps database entry and preset administration operations', async () => {
  const expectedFunctions = new Map([
    ['mod_data_approve_entry', { entryid: 9, approve: false }],
    ['mod_data_delete_entry', { entryid: 9 }],
    ['mod_data_add_entry', {
      databaseid: 8,
      groupid: 2,
      data: [
        { fieldid: 10, subfield: '', value: '"Title"' },
        { fieldid: 11, subfield: 'lat', value: '40.4' }
      ]
    }],
    ['mod_data_update_entry', {
      entryid: 9,
      data: [{ fieldid: 10, subfield: '', value: '"Updated"' }]
    }],
    ['mod_data_delete_saved_preset', { dataid: 8, presetnames: ['cards'] }],
    ['mod_data_get_mapping_information', { cmid: 81, importedpreset: 'imagegallery' }],
    ['mod_data_view_database', { databaseid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.approve_database_entry({ entry_id: 9, approved: false });
  await client.delete_database_entry({ entry_id: 9 });
  await client.create_database_entry({
    database_id: 8,
    group_id: 2,
    fields: { 10: 'Title', '11:lat': 40.4 }
  });
  await client.update_database_entry({ entry_id: 9, fields: { 10: 'Updated' } });
  await client.delete_database_presets({ database_id: 8, preset_names: ['cards'] });
  await client.get_database_preset_mapping({ module_id: 81, preset: 'imagegallery' });
  await client.view_database({ database_id: 8 });
});

test('maps glossary browsing and search operations', async () => {
  const expectedFunctions = new Map([
    ['mod_glossary_get_glossaries_by_courses', { courseids: [42] }],
    ['mod_glossary_get_entries_by_letter', {
      id: 8, letter: 'A', from: 0, limit: 20, options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_by_date', {
      id: 8, order: 'CREATION', sort: 'ASC', from: 0, limit: 20, options: { includenotapproved: false }
    }],
    ['mod_glossary_get_categories', { id: 8, from: 10, limit: 5 }],
    ['mod_glossary_get_entries_by_category', {
      id: 8, categoryid: 2, from: 0, limit: 20, options: { includenotapproved: true }
    }],
    ['mod_glossary_get_authors', {
      id: 8, from: 0, limit: 20, options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_by_author', {
      id: 8, letter: 'G', field: 'FIRSTNAME', sort: 'ASC', from: 0, limit: 20,
      options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_by_author_id', {
      id: 8, authorid: 7, order: 'CONCEPT', sort: 'ASC', from: 0, limit: 20,
      options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_by_search', {
      id: 8, query: 'term', fullsearch: true, order: 'CONCEPT', sort: 'ASC', from: 0, limit: 20,
      options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_by_term', {
      id: 8, term: 'alias', from: 0, limit: 20, options: { includenotapproved: false }
    }],
    ['mod_glossary_get_entries_to_approve', {
      id: 8, letter: 'ALL', order: 'CONCEPT', sort: 'ASC', from: 0, limit: 20, options: {}
    }],
    ['mod_glossary_get_entry_by_id', { id: 9 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_glossaries({ course_ids: [42] });
  await client.get_glossary_entries_by_letter({ glossary_id: 8, letter: 'A' });
  await client.get_glossary_entries_by_date({ glossary_id: 8, date_field: 'CREATION', sort_direction: 'ASC' });
  await client.get_glossary_categories({ glossary_id: 8, offset: 10, limit: 5 });
  await client.get_glossary_entries_by_category({ glossary_id: 8, category_id: 2, include_unapproved: true });
  await client.get_glossary_authors({ glossary_id: 8 });
  await client.get_glossary_entries_by_author_letter({ glossary_id: 8, letter: 'G', name_field: 'FIRSTNAME' });
  await client.get_glossary_entries_by_author({ glossary_id: 8, author_id: 7 });
  await client.search_glossary_entries({ glossary_id: 8, query: 'term' });
  await client.get_glossary_entries_by_term({ glossary_id: 8, term: 'alias' });
  await client.get_glossary_entries_to_approve({ glossary_id: 8, letter: 'ALL' });
  await client.get_glossary_entry({ entry_id: 9 });
});

test('maps glossary entry lifecycle and view operations', async () => {
  const expectedFunctions = new Map([
    ['mod_glossary_add_entry', {
      glossaryid: 8, concept: 'API', definition: 'Definition', definitionformat: 1,
      options: [{ name: 'aliases', value: 'REST,HTTP' }]
    }],
    ['mod_glossary_update_entry', {
      entryid: 9, concept: 'API', definition: 'Updated', definitionformat: 1,
      options: [{ name: 'usedynalink', value: true }]
    }],
    ['mod_glossary_delete_entry', { entryid: 9 }],
    ['mod_glossary_prepare_entry_for_edition', { entryid: 9 }],
    ['mod_glossary_view_glossary', { id: 8, mode: 'letter' }],
    ['mod_glossary_view_entry', { id: 9 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.create_glossary_entry({
    glossary_id: 8, concept: 'API', definition: 'Definition', options: { aliases: 'REST,HTTP' }
  });
  await client.update_glossary_entry({
    entry_id: 9, concept: 'API', definition: 'Updated', options: { usedynalink: true }
  });
  await client.delete_glossary_entry({ entry_id: 9 });
  await client.prepare_glossary_entry({ entry_id: 9 });
  await client.view_glossary({ glossary_id: 8, mode: 'letter' });
  await client.view_glossary_entry({ entry_id: 9 });
});

test('maps the complete BigBlueButton module API', async () => {
  const expectedFunctions = new Map([
    ['mod_bigbluebuttonbn_get_bigbluebuttonbns_by_courses', { courseids: [42] }],
    ['mod_bigbluebuttonbn_can_join', { cmid: 81, groupid: 2 }],
    ['mod_bigbluebuttonbn_get_join_url', { cmid: 81, groupid: 0 }],
    ['mod_bigbluebuttonbn_get_recordings', {
      bigbluebuttonbnid: 8,
      tools: 'publish,delete',
      groupid: 2
    }],
    ['mod_bigbluebuttonbn_get_recordings_to_import', {
      destinationinstanceid: 8,
      sourcebigbluebuttonbnid: 9,
      sourcecourseid: 42,
      tools: 'protect,unprotect,publish,unpublish,delete'
    }],
    ['mod_bigbluebuttonbn_update_recording', {
      bigbluebuttonbnid: 8,
      recordingid: 10,
      action: 'edit',
      additionaloptions: '{"name":"New title"}'
    }],
    ['mod_bigbluebuttonbn_end_meeting', { bigbluebuttonbnid: 8, groupid: 2 }],
    ['mod_bigbluebuttonbn_completion_validate', { bigbluebuttonbnid: 8 }],
    ['mod_bigbluebuttonbn_meeting_info', { bigbluebuttonbnid: 8, groupid: 2, updatecache: true }],
    ['mod_bigbluebuttonbn_view_bigbluebuttonbn', { bigbluebuttonbnid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_bigbluebutton_activities({ course_ids: [42] });
  await client.can_join_bigbluebutton({ module_id: 81, group_id: 2 });
  await client.get_bigbluebutton_join_url({ module_id: 81 });
  await client.get_bigbluebutton_recordings({ bigbluebutton_id: 8, tools: ['publish', 'delete'], group_id: 2 });
  await client.get_bigbluebutton_recordings_to_import({
    destination_id: 8,
    source_bigbluebutton_id: 9,
    source_course_id: 42
  });
  await client.update_bigbluebutton_recording({
    bigbluebutton_id: 8,
    recording_id: 10,
    action: 'edit',
    additional_options: { name: 'New title' }
  });
  await client.end_bigbluebutton_meeting({ bigbluebutton_id: 8, group_id: 2 });
  await client.validate_bigbluebutton_completion({ bigbluebutton_id: 8 });
  await client.get_bigbluebutton_meeting_information({
    bigbluebutton_id: 8,
    group_id: 2,
    refresh_cache: true
  });
  await client.view_bigbluebutton({ bigbluebutton_id: 8 });
});

test('maps lesson discovery, progress, grades, and reporting operations', async () => {
  const expectedFunctions = new Map([
    ['mod_lesson_get_lessons_by_courses', { courseids: [42] }],
    ['mod_lesson_get_lesson', { lessonid: 8, password: '' }],
    ['mod_lesson_get_lesson_access_information', { lessonid: 8 }],
    ['mod_lesson_get_questions_attempts', {
      lessonid: 8, attempt: 1, correct: true, pageid: 9, userid: 7
    }],
    ['mod_lesson_get_user_grade', { lessonid: 8, userid: 7 }],
    ['mod_lesson_get_user_attempt_grade', { lessonid: 8, lessonattempt: 1, userid: 7 }],
    ['mod_lesson_get_content_pages_viewed', { lessonid: 8, lessonattempt: 1 }],
    ['mod_lesson_get_user_timers', { lessonid: 8 }],
    ['mod_lesson_get_pages', { lessonid: 8, password: 'secret' }],
    ['mod_lesson_get_attempts_overview', { lessonid: 8, groupid: 2 }],
    ['mod_lesson_get_user_attempt', { lessonid: 8, userid: 7, lessonattempt: 1 }],
    ['mod_lesson_get_pages_possible_jumps', { lessonid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_lessons({ course_ids: [42] });
  await client.get_lesson({ lesson_id: 8 });
  await client.get_lesson_access_information({ lesson_id: 8 });
  await client.get_lesson_question_attempts({
    lesson_id: 8, attempt: 1, only_correct: true, page_id: 9, user_id: 7
  });
  await client.get_lesson_user_grade({ lesson_id: 8, user_id: 7 });
  await client.get_lesson_attempt_grade({ lesson_id: 8, attempt: 1, user_id: 7 });
  await client.get_lesson_content_pages_viewed({ lesson_id: 8, attempt: 1 });
  await client.get_lesson_user_timers({ lesson_id: 8 });
  await client.get_lesson_pages({ lesson_id: 8, password: 'secret' });
  await client.get_lesson_attempts_overview({ lesson_id: 8, group_id: 2 });
  await client.get_lesson_user_attempt({ lesson_id: 8, user_id: 7, attempt: 1 });
  await client.get_lesson_possible_jumps({ lesson_id: 8 });
});

test('maps the complete lesson attempt interaction workflow', async () => {
  const expectedFunctions = new Map([
    ['mod_lesson_launch_attempt', { lessonid: 8, password: '', pageid: 0, review: false }],
    ['mod_lesson_get_page_data', {
      lessonid: 8, pageid: 9, password: '', review: false, returncontents: true
    }],
    ['mod_lesson_process_page', {
      lessonid: 8,
      pageid: 9,
      data: [{ name: 'answer', value: 'Paris' }],
      password: '',
      review: false
    }],
    ['mod_lesson_finish_attempt', { lessonid: 8, password: '', outoftime: false, review: true }],
    ['mod_lesson_view_lesson', { lessonid: 8, password: '' }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.launch_lesson_attempt({ lesson_id: 8 });
  await client.get_lesson_page({ lesson_id: 8, page_id: 9, include_contents: true });
  await client.submit_lesson_page({ lesson_id: 8, page_id: 9, responses: { answer: 'Paris' } });
  await client.finish_lesson_attempt({ lesson_id: 8, review: true });
  await client.view_lesson({ lesson_id: 8 });
});

test('maps LTI activity, proxy, and discovery operations', async () => {
  const expectedFunctions = new Map([
    ['mod_lti_get_ltis_by_courses', { courseids: [42] }],
    ['mod_lti_get_tool_launch_data', { toolid: 8 }],
    ['mod_lti_get_tool_proxies', { orphanedonly: true }],
    ['mod_lti_create_tool_proxy', {
      name: 'Provider',
      regurl: 'https://tool.example/register',
      capabilityoffered: ['basic-lti-launch-request'],
      serviceoffered: ['Result.item']
    }],
    ['mod_lti_delete_tool_proxy', { id: 9 }],
    ['mod_lti_get_tool_proxy_registration_request', { id: 9 }],
    ['mod_lti_get_tool_types', { toolproxyid: 9 }],
    ['mod_lti_get_tool_types_and_proxies', {
      toolproxyid: 0, orphanedonly: false, limit: 20, offset: 40
    }],
    ['mod_lti_get_tool_types_and_proxies_count', { toolproxyid: 0, orphanedonly: false }],
    ['mod_lti_is_cartridge', { url: 'https://tool.example/cartridge.xml' }],
    ['mod_lti_view_lti', { ltiid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_lti_tools({ course_ids: [42] });
  await client.get_lti_launch_data({ tool_id: 8 });
  await client.get_lti_tool_proxies({ only_orphaned: true });
  await client.create_lti_tool_proxy({
    name: 'Provider',
    registration_url: 'https://tool.example/register',
    capabilities: ['basic-lti-launch-request'],
    services: ['Result.item']
  });
  await client.delete_lti_tool_proxy({ proxy_id: 9 });
  await client.get_lti_proxy_registration_request({ proxy_id: 9 });
  await client.get_lti_tool_types({ proxy_id: 9 });
  await client.get_lti_tool_types_and_proxies({ limit: 20, offset: 40 });
  await client.count_lti_tool_types_and_proxies({});
  await client.is_lti_cartridge({ url: 'https://tool.example/cartridge.xml' });
  await client.view_lti({ lti_id: 8 });
});

test('maps LTI tool type administration operations', async () => {
  const expectedFunctions = new Map([
    ['mod_lti_create_tool_type', {
      cartridgeurl: 'https://tool.example/cartridge.xml',
      key: 'consumer',
      secret: 'shared'
    }],
    ['mod_lti_update_tool_type', { id: 10, name: 'Updated', state: 1 }],
    ['mod_lti_delete_tool_type', { id: 10 }],
    ['mod_lti_delete_course_tool_type', { tooltypeid: 11 }],
    ['mod_lti_toggle_showinactivitychooser', {
      tooltypeid: 11, courseid: 42, showinactivitychooser: true
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.create_lti_tool_type({
    cartridge_url: 'https://tool.example/cartridge.xml',
    consumer_key: 'consumer',
    shared_secret: 'shared'
  });
  await client.update_lti_tool_type({ tool_type_id: 10, name: 'Updated', state: 1 });
  await client.delete_lti_tool_type({ tool_type_id: 10 });
  await client.delete_course_lti_tool_type({ tool_type_id: 11 });
  await client.set_lti_tool_activity_chooser_visibility({
    tool_type_id: 11,
    course_id: 42,
    visible: true
  });
});

test('maps workshop discovery, submission lifecycle, and assessment reads', async () => {
  const expectedFunctions = new Map([
    ['mod_workshop_get_workshops_by_courses', { courseids: [42] }],
    ['mod_workshop_get_workshop_access_information', { workshopid: 8 }],
    ['mod_workshop_get_user_plan', { workshopid: 8, userid: 7 }],
    ['mod_workshop_add_submission', {
      workshopid: 8, title: 'Submission', content: 'Body', contentformat: 1,
      inlineattachmentsid: 0, attachmentsid: 17
    }],
    ['mod_workshop_update_submission', {
      submissionid: 9, title: 'Updated', content: '', contentformat: 0,
      inlineattachmentsid: 0, attachmentsid: 0
    }],
    ['mod_workshop_delete_submission', { submissionid: 9 }],
    ['mod_workshop_get_submissions', {
      workshopid: 8, userid: 0, groupid: 2, page: 1, perpage: 25
    }],
    ['mod_workshop_get_submission', { submissionid: 9 }],
    ['mod_workshop_get_submission_assessments', { submissionid: 9 }],
    ['mod_workshop_get_assessment', { assessmentid: 10 }],
    ['mod_workshop_get_assessment_form_definition', { assessmentid: 10, mode: 'preview' }],
    ['mod_workshop_get_reviewer_assessments', { workshopid: 8, userid: 7 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_workshops({ course_ids: [42] });
  await client.get_workshop_access_information({ workshop_id: 8 });
  await client.get_workshop_user_plan({ workshop_id: 8, user_id: 7 });
  await client.create_workshop_submission({
    workshop_id: 8,
    title: 'Submission',
    content: 'Body',
    content_format: 1,
    attachment_draft_item_id: 17
  });
  await client.update_workshop_submission({ submission_id: 9, title: 'Updated' });
  await client.delete_workshop_submission({ submission_id: 9 });
  await client.get_workshop_submissions({ workshop_id: 8, group_id: 2, page: 1, page_size: 25 });
  await client.get_workshop_submission({ submission_id: 9 });
  await client.get_workshop_submission_assessments({ submission_id: 9 });
  await client.get_workshop_assessment({ assessment_id: 10 });
  await client.get_workshop_assessment_form({ assessment_id: 10, mode: 'preview' });
  await client.get_workshop_reviewer_assessments({ workshop_id: 8, user_id: 7 });
});

test('maps workshop assessment, grading, evaluation, and view operations', async () => {
  const expectedFunctions = new Map([
    ['mod_workshop_update_assessment', {
      assessmentid: 10,
      data: [
        { name: 'grade__idx_0', value: 90 },
        { name: 'feedbackauthor', value: 'Good work' }
      ]
    }],
    ['mod_workshop_get_grades', { workshopid: 8, userid: 7 }],
    ['mod_workshop_evaluate_assessment', {
      assessmentid: 10,
      feedbacktext: 'Accurate review',
      feedbackformat: 1,
      weight: 2,
      gradinggradeover: '95'
    }],
    ['mod_workshop_get_grades_report', {
      workshopid: 8, groupid: 2, sortby: 'submissiongrade',
      sortdirection: 'DESC', page: 0, perpage: 50
    }],
    ['mod_workshop_evaluate_submission', {
      submissionid: 9,
      feedbacktext: 'Excellent',
      feedbackformat: 1,
      published: true,
      gradeover: '92'
    }],
    ['mod_workshop_view_workshop', { workshopid: 8 }],
    ['mod_workshop_view_submission', { submissionid: 9 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.update_workshop_assessment({
    assessment_id: 10,
    data: { grade__idx_0: 90, feedbackauthor: 'Good work' }
  });
  await client.get_workshop_grades({ workshop_id: 8, user_id: 7 });
  await client.evaluate_workshop_assessment({
    assessment_id: 10,
    feedback: 'Accurate review',
    feedback_format: 1,
    weight: 2,
    grade_override: '95'
  });
  await client.get_workshop_grades_report({
    workshop_id: 8,
    group_id: 2,
    sort_by: 'submissiongrade',
    sort_direction: 'DESC',
    page_size: 50
  });
  await client.evaluate_workshop_submission({
    submission_id: 9,
    feedback: 'Excellent',
    feedback_format: 1,
    published: true,
    grade_override: '92'
  });
  await client.view_workshop({ workshop_id: 8 });
  await client.view_workshop_submission({ submission_id: 9 });
});

test('maps assignment bulk grades and grading form operations', async () => {
  const transport = createTransport({
    mod_assign_save_grades(parameters) {
      assert.deepEqual(parameters, {
        assignmentid: 8,
        applytoall: false,
        grades: [{
          userid: 7,
          grade: 95,
          attemptnumber: -1,
          addattempt: false,
          workflowstate: '',
          plugindata: {},
          advancedgradingdata: {}
        }]
      });
      return null;
    },
    mod_assign_submit_grading_form(parameters) {
      assert.deepEqual(parameters, {
        assignmentid: 8,
        userid: 7,
        jsonformdata: '{"grade":95}',
        marker: false
      });
      return [];
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.save_assignment_grades({
    assignment_id: 8,
    grades: [{ user_id: 7, grade: 95 }]
  });
  await client.submit_assignment_grading_form({
    assignment_id: 8,
    user_id: 7,
    form_data: { grade: 95 }
  });
});

test('maps legacy and administrative quiz attempt operations', async () => {
  const expectedFunctions = new Map([
    ['mod_quiz_get_user_attempts', {
      quizid: 8, userid: 7, status: 'all', includepreviews: true
    }],
    ['mod_quiz_set_question_version', { slotid: 10, newversion: 0 }],
    ['mod_quiz_reopen_attempt', { attemptid: 9 }],
    ['mod_quiz_get_reopen_attempt_confirmation', { attemptid: 9 }],
    ['mod_quiz_add_random_questions', {
      cmid: 81,
      addonpage: 2,
      randomcount: 3,
      filtercondition: '{"category":{"values":[5]}}',
      newcategory: '',
      parentcategory: '0'
    }],
    ['mod_quiz_update_filter_condition', {
      cmid: 81,
      slotid: 10,
      filtercondition: '{"category":{"values":[6]}}'
    }],
    ['mod_quiz_save_overrides', {
      data: { quizid: 8, overrides: [{ userid: 7, attempts: 3 }] }
    }],
    ['mod_quiz_delete_overrides', { data: { quizid: 8, ids: [11] } }],
    ['mod_quiz_get_overrides', { quizid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_user_quiz_attempts_legacy({
    quiz_id: 8, user_id: 7, status: 'all', include_previews: true
  });
  await client.set_quiz_question_version({ slot_id: 10, version: 0 });
  await client.reopen_quiz_attempt({ attempt_id: 9 });
  await client.get_reopen_quiz_attempt_confirmation({ attempt_id: 9 });
  await client.add_quiz_random_questions({
    module_id: 81, page: 2, count: 3, filter: { category: { values: [5] } }
  });
  await client.update_quiz_random_question_filter({
    module_id: 81, slot_id: 10, filter: { category: { values: [6] } }
  });
  await client.save_quiz_overrides({
    quiz_id: 8, overrides: [{ userid: 7, attempts: 3 }]
  });
  await client.delete_quiz_overrides({ quiz_id: 8, override_ids: [11] });
  await client.get_quiz_overrides({ quiz_id: 8 });
});

test('maps the complete quiz grade-item and slot administration API', async () => {
  const expectedFunctions = new Map([
    ['mod_quiz_create_grade_items', {
      quizid: 8, quizgradeitems: [{ name: 'Knowledge' }, { name: 'Skills' }]
    }],
    ['mod_quiz_delete_grade_items', { quizid: 8, quizgradeitems: [{ id: 12 }] }],
    ['mod_quiz_update_grade_items', {
      quizid: 8, quizgradeitems: [{ id: 12, name: 'Updated' }]
    }],
    ['mod_quiz_update_slots', {
      quizid: 8, slots: [{ id: 10, displaynumber: '1a', maxmark: 2 }]
    }],
    ['mod_quiz_get_edit_grading_page_data', { quizid: 8 }],
    ['mod_quiz_create_grade_item_per_section', { quizid: 8 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return null;
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.create_quiz_grade_items({ quiz_id: 8, names: ['Knowledge', 'Skills'] });
  await client.delete_quiz_grade_items({ quiz_id: 8, grade_item_ids: [12] });
  await client.update_quiz_grade_items({ quiz_id: 8, grade_items: [{ id: 12, name: 'Updated' }] });
  await client.update_quiz_slots({ quiz_id: 8, slots: [{ id: 10, displaynumber: '1a', maxmark: 2 }] });
  await client.get_quiz_grading_setup({ quiz_id: 8 });
  await client.create_quiz_grade_item_per_section({ quiz_id: 8 });
});

test('maps calendar rendered views, permissions, and event lifecycle', async () => {
  const expectedFunctions = new Map([
    ['core_calendar_get_calendar_monthly_view', {
      year: 2026, month: 7, courseid: 42, includenavigation: true, mini: false
    }],
    ['core_calendar_get_calendar_day_view', {
      year: 2026, month: 7, day: 26, courseid: 1, categoryid: 3
    }],
    ['core_calendar_get_calendar_upcoming_view', { courseid: 42 }],
    ['core_calendar_update_event_start_day', { eventid: 9, daytimestamp: 1000 }],
    ['core_calendar_create_calendar_events', {
      events: [{
        name: 'Meeting',
        description: 'Description',
        format: 1,
        courseid: 42,
        groupid: 0,
        repeats: 0,
        eventtype: 'course',
        timestart: 1000,
        timeduration: 3600,
        visible: 1,
        sequence: 1
      }]
    }],
    ['core_calendar_delete_calendar_events', {
      events: [{ eventid: 9, repeat: true }]
    }],
    ['core_calendar_get_calendar_event_by_id', { eventid: 9 }],
    ['core_calendar_submit_create_update_form', { formdata: 'name=Meeting&timestart=1000' }],
    ['core_calendar_get_calendar_access_information', { courseid: 42 }],
    ['core_calendar_get_allowed_event_types', { courseid: 42 }],
    ['core_calendar_get_calendar_export_token', {}]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { warnings: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_calendar_month({ year: 2026, month: 7, course_id: 42 });
  await client.get_calendar_day({ year: 2026, month: 7, day: 26, category_id: 3 });
  await client.get_calendar_upcoming({ course_id: 42 });
  await client.move_calendar_event({ event_id: 9, day_timestamp: 1000 });
  await client.create_calendar_events({
    events: [{
      name: 'Meeting',
      description: 'Description',
      course_id: 42,
      event_type: 'course',
      start_time: 1000,
      duration: 3600
    }]
  });
  await client.delete_calendar_events({ events: [{ event_id: 9, repeat: true }] });
  await client.get_calendar_event({ event_id: 9 });
  await client.submit_calendar_event_form({ form_data: { name: 'Meeting', timestart: 1000 } });
  await client.get_calendar_access_information({ course_id: 42 });
  await client.get_allowed_calendar_event_types({ course_id: 42 });
  await client.get_calendar_export_token({});
});

test('maps all calendar action-event query variants', async () => {
  const expectedFunctions = new Map([
    ['core_calendar_get_action_events_by_timesort', {
      timesortfrom: 100,
      timesortto: 200,
      aftereventid: 9,
      limitnum: 25,
      limittononsuspendedevents: true,
      userid: 7,
      searchvalue: 'assignment'
    }],
    ['core_calendar_get_action_events_by_course', {
      courseid: 42,
      timesortfrom: 100,
      aftereventid: 9,
      limitnum: 20
    }],
    ['core_calendar_get_action_events_by_courses', {
      courseids: [42, 43],
      timesortto: 200,
      limitnum: 10,
      searchvalue: 'quiz'
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return { events: [] };
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_action_events_by_time({
    from: 100,
    to: 200,
    after_event_id: 9,
    limit: 25,
    only_active_enrolments: true,
    user_id: 7,
    query: 'assignment'
  });
  await client.get_course_action_events({ course_id: 42, from: 100, after_event_id: 9 });
  await client.get_courses_action_events({ course_ids: [42, 43], to: 200, query: 'quiz' });
});

test('maps badge and blog operations to Moodle parameters', async () => {
  const expectedFunctions = new Map([
    ['core_badges_get_badge', { id: 3 }],
    ['core_badges_get_user_badges', {
      userid: 7, courseid: 42, page: 1, perpage: 20, search: 'silver', onlypublic: true
    }],
    ['core_badges_get_user_badge_by_hash', { hash: 'abc123' }],
    ['core_blog_get_entries', {
      filters: [{ name: 'userid', value: 7 }], page: 1, perpage: 20
    }],
    ['core_blog_view_entries', { filters: [{ name: 'courseid', value: 42 }] }],
    ['core_blog_get_access_information', {}],
    ['core_blog_add_entry', {
      subject: 'Hello', summary: 'Content', summaryformat: 1,
      options: [{ name: 'publishstate', value: 'site' }]
    }],
    ['core_blog_update_entry', {
      entryid: 9, subject: 'Updated', summary: 'New content', summaryformat: 2, options: []
    }],
    ['core_blog_delete_entry', { entryid: 9 }],
    ['core_blog_prepare_entry_for_edition', { entryid: 9 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_badge({ badge_id: 3 });
  await client.get_user_badges({
    user_id: 7, course_id: 42, page: 1, page_size: 20, query: 'silver', only_public: true
  });
  await client.get_user_badge_by_hash({ hash: 'abc123' });
  await client.get_blog_entries({ filters: { userid: 7 }, page: 1, page_size: 20 });
  await client.view_blog_entries({ filters: { courseid: 42 } });
  await client.get_blog_access_information({});
  await client.create_blog_entry({
    subject: 'Hello', content: 'Content', options: { publishstate: 'site' }
  });
  await client.update_blog_entry({
    entry_id: 9, subject: 'Updated', content: 'New content', content_format: 2
  });
  await client.delete_blog_entry({ entry_id: 9 });
  await client.prepare_blog_entry({ entry_id: 9 });
});

test('maps comment, note, and rating operations to Moodle parameters', async () => {
  const expectedFunctions = new Map([
    ['core_comment_get_comments', {
      contextlevel: 'module', instanceid: 11, component: 'mod_glossary', itemid: 5,
      area: 'entry', page: 0, sortdirection: 'DESC'
    }],
    ['core_comment_add_comments', {
      comments: [{
        contextlevel: 'module', instanceid: 11, component: 'mod_glossary',
        content: 'Useful', itemid: 5, area: 'entry'
      }]
    }],
    ['core_comment_delete_comments', { comments: [13, 14] }],
    ['core_notes_create_notes', {
      notes: [{
        userid: 7, publishstate: 'course', courseid: 42, text: 'Follow up',
        format: 1, clientnoteid: 'local-1'
      }]
    }],
    ['core_notes_delete_notes', { notes: [21] }],
    ['core_notes_get_course_notes', { courseid: 42, userid: 7 }],
    ['core_notes_view_notes', { courseid: 42, userid: 0 }],
    ['core_rating_get_item_ratings', {
      contextlevel: 'module', instanceid: 11, component: 'mod_glossary',
      ratingarea: 'entry', itemid: 5, scaleid: 10, sort: 'rating'
    }],
    ['core_rating_add_rating', {
      contextlevel: 'module', instanceid: 11, component: 'mod_glossary',
      ratingarea: 'entry', itemid: 5, scaleid: 10, rating: 8,
      rateduserid: 7, aggregation: 0
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  const item = {
    context_type: 'module', context_id: 11, component: 'mod_glossary',
    item_id: 5, area: 'entry'
  };
  await client.get_comments(item);
  await client.create_comments({ comments: [{ ...item, content: 'Useful' }] });
  await client.delete_comments({ comment_ids: [13, 14] });
  await client.create_notes({
    notes: [{
      user_id: 7, publish_state: 'course', course_id: 42,
      text: 'Follow up', client_note_id: 'local-1'
    }]
  });
  await client.delete_notes({ note_ids: [21] });
  await client.get_course_notes({ course_id: 42, user_id: 7 });
  await client.view_notes({ course_id: 42 });
  await client.get_item_ratings({
    context_type: 'module', context_id: 11, component: 'mod_glossary',
    rating_area: 'entry', item_id: 5, scale_id: 10, sort_by: 'rating'
  });
  await client.rate_item({
    context_type: 'module', context_id: 11, component: 'mod_glossary',
    rating_area: 'entry', item_id: 5, scale_id: 10, rating: 8, rated_user_id: 7
  });
});

test('maps group helpers, personal pages, question flags, blocks, and file areas', async () => {
  const expectedFunctions = new Map([
    ['core_group_get_activity_allowed_groups', { cmid: 11, userid: 0 }],
    ['core_group_get_activity_groupmode', { cmid: 11 }],
    ['core_group_get_course_user_groups', { courseid: 42, userid: 7, groupingid: 0 }],
    ['core_group_get_groups_for_selector', { courseid: 42, cmid: 0 }],
    ['block_recentlyaccesseditems_get_recent_items', { limit: 10 }],
    ['block_starredcourses_get_starred_courses', { limit: 20, offset: 5 }],
    ['core_my_view_page', { page: 'dashboard' }],
    ['core_question_update_flag', {
      qubaid: 30, questionid: 4, qaid: 31, slot: 2, checksum: 'abc123', newstate: true
    }],
    ['core_files_get_files', {
      contextid: -1, component: 'user', filearea: 'private', itemid: 0,
      filepath: '/', filename: '', contextlevel: 'user', instanceid: 7
    }],
    ['core_files_delete_draft_files', {
      draftitemid: 99, files: [{ filepath: '/', filename: 'draft.txt' }]
    }],
    ['core_files_get_unused_draft_itemid', {}]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_activity_allowed_groups({ course_module_id: 11 });
  await client.get_activity_group_mode({ course_module_id: 11 });
  await client.get_user_course_groups({ course_id: 42, user_id: 7 });
  await client.get_groups_for_selector({ course_id: 42 });
  await client.get_recently_accessed_items({ limit: 10 });
  await client.get_starred_courses({ limit: 20, offset: 5 });
  await client.view_personal_page({ page: 'dashboard' });
  await client.update_question_flag({
    question_usage_id: 30, question_id: 4, question_attempt_id: 31,
    slot: 2, checksum: 'abc123', flagged: true
  });
  await client.browse_files({
    context_id: -1, component: 'user', file_area: 'private', item_id: 0,
    file_path: '/', file_name: '', context_type: 'user', instance_id: 7
  });
  await client.delete_draft_files({
    draft_item_id: 99, files: [{ file_path: '/', file_name: 'draft.txt' }]
  });
  await client.get_unused_draft_area({});
});

test('maps user preferences, profile events, private files, pictures, and devices', async () => {
  const expectedFunctions = new Map([
    ['core_user_get_user_preferences', { name: '', userid: 0 }],
    ['core_user_get_private_files_info', { userid: 7 }],
    ['core_user_view_user_list', { courseid: 42 }],
    ['core_user_view_user_profile', { userid: 7, courseid: 42 }],
    ['core_user_agree_site_policy', {}],
    ['core_user_add_user_private_files', { draftid: 99 }],
    ['core_user_update_picture', { draftitemid: 99, delete: false, userid: 7 }],
    ['core_user_remove_user_device', { uuid: 'device-1', appid: '' }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_user_preferences({});
  await client.get_private_files_information({ user_id: 7 });
  await client.view_course_user_list({ course_id: 42 });
  await client.view_user_profile({ user_id: 7, course_id: 42 });
  await client.agree_site_policy({});
  await client.add_private_files({ draft_item_id: 99 });
  await client.update_user_picture({ draft_item_id: 99, user_id: 7 });
  await client.remove_user_device({ device_id: 'device-1' });
});

test('maps global search and tag operations', async () => {
  const filters = {
    title: 'Algebra', areaids: ['mod_forum-post'], courseids: [42],
    contextids: [], cat: 'core-courses', userids: [7], groupids: [3],
    mycoursesonly: true, order: 'time', timestart: 100, timeend: 200
  };
  const expectedFunctions = new Map([
    ['core_search_get_results', { query: 'equation', filters, page: 2 }],
    ['core_search_get_top_results', { query: 'equation', filters }],
    ['core_search_get_search_areas_list', { cat: '' }],
    ['core_search_view_results', { query: 'equation', filters, page: 2 }],
    ['core_tag_get_tag_areas', {}],
    ['core_tag_get_tag_collections', {}],
    ['core_tag_get_tag_cloud', {
      tagcollid: 1, isstandard: true, limit: 25, sort: 'count', search: 'math',
      fromctx: 2, ctx: 3, rec: false
    }],
    ['core_tag_get_tagindex', {
      tagindex: { tag: 'math', tc: 1, ta: 2, excl: true, from: 3, ctx: 4, rec: false, page: 1 }
    }],
    ['core_tag_get_tagindex_per_area', {
      tagindex: { id: 9, tag: '', tc: 0, ta: 0, excl: false, from: 0, ctx: 0, rec: true, page: 0 }
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });
  const friendlyFilters = {
    title: 'Algebra', area_ids: ['mod_forum-post'], course_ids: [42],
    context_ids: [], category: 'core-courses', user_ids: [7], group_ids: [3],
    only_my_courses: true, order: 'time', start_time: 100, end_time: 200
  };

  await client.search_site({ query: 'equation', filters: friendlyFilters, page: 2 });
  await client.get_top_search_results({ query: 'equation', filters: friendlyFilters });
  await client.get_search_areas({});
  await client.view_search_results({ query: 'equation', filters: friendlyFilters, page: 2 });
  await client.get_tag_areas({});
  await client.get_tag_collections({});
  await client.get_tag_cloud({
    collection_id: 1, only_standard: true, limit: 25, sort_by: 'count', query: 'math',
    source_context_id: 2, context_id: 3, include_children: false
  });
  await client.get_tag_index({
    tag: 'math', collection_id: 1, area_id: 2, exclusive: true,
    source_context_id: 3, context_id: 4, include_children: false, page: 1
  });
  await client.get_tag_index_by_area({ tag_id: 9 });
});

test('maps course discovery, timeline, favourites, navigation, and update operations', async () => {
  const expectedFunctions = new Map([
    ['core_course_get_course_module', { cmid: 11 }],
    ['core_course_get_course_module_by_instance', { module: 'quiz', instance: 8 }],
    ['core_course_view_course', { courseid: 42, sectionnumber: 2 }],
    ['core_course_search_courses', {
      criterianame: 'search', criteriavalue: 'Algebra', page: 1, perpage: 20,
      requiredcapabilities: ['moodle/course:view'], limittoenrolled: true, onlywithcompletion: false
    }],
    ['core_course_get_user_navigation_options', { courseids: [42, 43] }],
    ['core_course_get_user_administration_options', { courseids: [42] }],
    ['core_course_get_updates_since', { courseid: 42, since: 100, filter: ['completion'] }],
    ['core_course_get_enrolled_courses_by_timeline_classification', {
      classification: 'inprogress', limit: 10, offset: 2, sort: 'fullname',
      customfieldname: 'level', customfieldvalue: 'advanced', searchvalue: 'math',
      requiredfields: ['id', 'fullname']
    }],
    ['core_course_set_favourite_courses', {
      courses: [{ id: 42, favourite: true }, { id: 43, favourite: false }]
    }],
    ['core_course_get_recent_courses', { userid: 7, limit: 10, offset: 2, sort: 'timeaccess desc' }],
    ['core_course_check_updates', {
      courseid: 42,
      tocheck: [{ contextlevel: 'module', id: 11, since: 100 }],
      filter: ['completion', 'comments']
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_module({ course_module_id: 11 });
  await client.get_course_module_by_instance({ module: 'quiz', instance_id: 8 });
  await client.view_course({ course_id: 42, section_number: 2 });
  await client.search_courses({
    criteria: 'search', value: 'Algebra', page: 1, page_size: 20,
    required_capabilities: ['moodle/course:view'], only_enrolled: true
  });
  await client.get_course_navigation_options({ course_ids: [42, 43] });
  await client.get_course_administration_options({ course_ids: [42] });
  await client.get_course_updates({ course_id: 42, since: 100, areas: ['completion'] });
  await client.get_timeline_courses({
    classification: 'inprogress', limit: 10, offset: 2, sort: 'fullname',
    custom_field: 'level', custom_value: 'advanced', query: 'math', fields: ['id', 'fullname']
  });
  await client.set_favourite_courses({
    courses: [{ course_id: 42, starred: true }, { course_id: 43, starred: false }]
  });
  await client.get_recent_courses({ user_id: 7, limit: 10, offset: 2, sort: 'timeaccess desc' });
  await client.check_course_updates({
    course_id: 42,
    contexts: [{ context_type: 'module', context_id: 11, since: 100 }],
    areas: ['completion', 'comments']
  });
});

test('maps course overviews, filters, localization, icons, and trusted H5P files', async () => {
  const expectedFunctions = new Map([
    ['core_course_get_enrolled_courses_with_action_events_by_timeline_classification', {
      classification: 'future', limit: 10, offset: 0, sort: 'fullname',
      searchvalue: 'math', eventsfrom: 100, eventsto: 200
    }],
    ['core_course_view_module_instance_list', { courseid: 42, modname: 'quiz' }],
    ['core_courseformat_get_overview_information', { courseid: 42, modname: 'assign' }],
    ['core_courseformat_log_view_overview_information', { courseid: 42 }],
    ['core_filters_get_available_in_context', {
      contexts: [{ contextlevel: 'course', instanceid: 42 }]
    }],
    ['core_filters_get_all_states', {}],
    ['core_get_component_strings', { component: 'mod_quiz', lang: 'es' }],
    ['core_output_load_fontawesome_icon_system_map', {}],
    ['core_h5p_get_trusted_h5p_file', {
      url: 'https://example.test/content.h5p',
      frame: true, export: false, embed: true, copyright: false
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_timeline_courses_with_events({
    classification: 'future', limit: 10, sort: 'fullname',
    query: 'math', events_from: 100, events_to: 200
  });
  await client.view_module_instance_list({ course_id: 42, module: 'quiz' });
  await client.get_course_overview({ course_id: 42, module: 'assign' });
  await client.view_course_overview({ course_id: 42 });
  await client.get_available_filters({ contexts: [{ context_type: 'course', context_id: 42 }] });
  await client.get_all_filter_states({});
  await client.get_component_strings({ component: 'mod_quiz', language: 'es' });
  await client.get_fontawesome_icon_map({});
  await client.get_trusted_h5p_file({
    url: 'https://example.test/content.h5p', show_frame: true, allow_embed: true
  });
});

test('maps push and popup notification operations', async () => {
  const expectedFunctions = new Map([
    ['message_airnotifier_is_system_configured', {}],
    ['message_airnotifier_are_notification_preferences_configured', { userids: [7, 8] }],
    ['message_airnotifier_get_user_devices', { appid: 'com.example.app', userid: 7 }],
    ['message_airnotifier_enable_device', { deviceid: 3, enable: false }],
    ['message_popup_get_popup_notifications', {
      useridto: 7, newestfirst: true, limit: 20, offset: 5
    }],
    ['message_popup_get_unread_popup_notification_count', { useridto: 7 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.is_push_notification_system_configured({});
  await client.get_push_preference_statuses({ user_ids: [7, 8] });
  await client.get_user_push_devices({ application_id: 'com.example.app', user_id: 7 });
  await client.set_push_device_enabled({ device_id: 3, enabled: false });
  await client.get_popup_notifications({ user_id: 7, limit: 20, offset: 5 });
  await client.get_unread_popup_notification_count({ user_id: 7 });
});

test('maps guest enrolment information and password validation', async () => {
  const transport = createTransport({
    enrol_guest_get_instance_info(parameters) {
      assert.deepEqual(parameters, { instanceid: 12 });
      return {};
    },
    enrol_guest_validate_password(parameters) {
      assert.deepEqual(parameters, { instanceid: 12, password: 'guest-key' });
      return {};
    }
  });
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_guest_enrolment_information({ instance_id: 12 });
  await client.validate_guest_enrolment_password({ instance_id: 12, password: 'guest-key' });
});

test('maps the remaining user profile, preference, device, and private-file operations', async () => {
  const expectedFunctions = new Map([
    ['core_user_add_user_device', {
      appid: 'com.example.app', name: 'Phone', model: 'Model X', platform: 'Android',
      version: '15', pushid: 'push-token', uuid: 'device-1', publickey: 'public-key'
    }],
    ['core_user_update_user_device_public_key', {
      uuid: 'device-1', appid: 'com.example.app', publickey: 'new-key'
    }],
    ['core_user_get_course_user_profiles', {
      userlist: [{ userid: 7, courseid: 42 }, { userid: 8, courseid: 43 }]
    }],
    ['core_user_set_user_preferences', {
      preferences: [{ name: 'theme', value: 'boost', userid: 7 }]
    }],
    ['core_user_update_user_preferences', {
      userid: 7, emailstop: true,
      preferences: [{ type: 'drawer-open-index', value: 'false' }]
    }],
    ['core_user_prepare_private_files_for_edition', {}],
    ['core_user_update_private_files', { draftitemid: 99 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.register_user_device({
    application_id: 'com.example.app', name: 'Phone', model: 'Model X',
    platform: 'Android', version: '15', push_id: 'push-token',
    device_id: 'device-1', public_key: 'public-key'
  });
  await client.update_user_device_public_key({
    device_id: 'device-1', application_id: 'com.example.app', public_key: 'new-key'
  });
  await client.get_course_user_profiles({
    users: [{ user_id: 7, course_id: 42 }, { user_id: 8, course_id: 43 }]
  });
  await client.set_user_preferences({
    preferences: [{ name: 'theme', value: 'boost', user_id: 7 }]
  });
  await client.update_user_preferences({
    user_id: 7, notifications_disabled: true,
    preferences: { 'drawer-open-index': 'false' }
  });
  await client.prepare_private_files({});
  await client.update_private_files({ draft_item_id: 99 });
});

test('maps the complete xAPI state and statement API', async () => {
  const agent = { objectType: 'Agent', account: { homePage: 'https://example.test', name: '7' } };
  const statement = { actor: agent, verb: { id: 'https://example.test/completed' } };
  const common = {
    component: 'mod_h5pactivity',
    activityId: 'https://example.test/activity/1',
    agent: JSON.stringify(agent),
    registration: 'registration-1'
  };
  const expectedFunctions = new Map([
    ['core_xapi_get_state', { ...common, stateId: 'progress' }],
    ['core_xapi_get_states', { ...common, since: '2026-07-01T00:00:00Z' }],
    ['core_xapi_post_state', {
      ...common, stateId: 'progress', stateData: JSON.stringify({ page: 3 })
    }],
    ['core_xapi_delete_state', { ...common, stateId: 'progress' }],
    ['core_xapi_delete_states', common],
    ['core_xapi_statement_post', {
      component: 'mod_h5pactivity', requestjson: JSON.stringify([statement])
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });
  const stateInput = {
    component: 'mod_h5pactivity', activity_id: 'https://example.test/activity/1',
    agent, registration: 'registration-1'
  };

  await client.get_xapi_state({ ...stateInput, state_id: 'progress' });
  await client.get_xapi_states({ ...stateInput, since: '2026-07-01T00:00:00Z' });
  await client.save_xapi_state({ ...stateInput, state_id: 'progress', state: { page: 3 } });
  await client.delete_xapi_state({ ...stateInput, state_id: 'progress' });
  await client.delete_xapi_states(stateInput);
  await client.post_xapi_statements({ component: 'mod_h5pactivity', statements: [statement] });
});

test('maps competency reads, grading, evidence deletion, and view events', async () => {
  const expectedFunctions = new Map([
    ['core_competency_competency_viewed', { id: 5 }],
    ['core_competency_delete_evidence', { id: 6 }],
    ['core_competency_get_scale_values', { scaleid: 2 }],
    ['core_competency_grade_competency_in_course', {
      courseid: 42, userid: 7, competencyid: 5, grade: 3, note: 'Demonstrated'
    }],
    ['core_competency_list_course_competencies', { id: 42 }],
    ['core_competency_user_competency_viewed', { usercompetencyid: 8 }],
    ['core_competency_user_competency_viewed_in_course', {
      competencyid: 5, userid: 7, courseid: 42
    }],
    ['core_competency_user_competency_viewed_in_plan', {
      competencyid: 5, userid: 7, planid: 9
    }],
    ['core_competency_user_competency_plan_viewed', {
      competencyid: 5, userid: 7, planid: 9
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.view_competency({ competency_id: 5 });
  await client.delete_competency_evidence({ evidence_id: 6 });
  await client.get_competency_scale_values({ scale_id: 2 });
  await client.grade_course_competency({
    course_id: 42, user_id: 7, competency_id: 5, grade: 3, note: 'Demonstrated'
  });
  await client.get_course_competencies({ course_id: 42 });
  await client.view_user_competency({ user_competency_id: 8 });
  await client.view_user_competency_in_course({ competency_id: 5, user_id: 7, course_id: 42 });
  await client.view_user_competency_in_plan({ competency_id: 5, user_id: 7, plan_id: 9 });
  await client.view_user_competency_plan({ competency_id: 5, user_id: 7, plan_id: 9 });
});

test('maps course and dashboard block operations', async () => {
  const expectedFunctions = new Map([
    ['core_block_get_course_blocks', { courseid: 42, returncontents: true }],
    ['core_block_get_dashboard_blocks', {
      userid: 7, returncontents: true, mypage: 'my-index'
    }],
    ['core_block_fetch_addable_blocks', {
      pagecontextid: 4, pagetype: 'course-view-topics', pagelayout: 'course',
      subpage: '', pagehash: ''
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_blocks({ course_id: 42, include_contents: true });
  await client.get_dashboard_blocks({ user_id: 7, include_contents: true, page: 'my-index' });
  await client.get_addable_blocks({
    page_context_id: 4, page_type: 'course-view-topics', page_layout: 'course'
  });
});

test('maps grade selectors and point and scale grading panels', async () => {
  const expectedFunctions = new Map([
    ['core_grades_get_enrolled_users_for_selector', { courseid: 42, groupid: 3 }],
    ['core_grades_get_groups_for_selector', { courseid: 42, cmid: 11 }],
    ['core_grades_grader_gradingpanel_point_fetch', {
      component: 'mod_assign', contextid: 4, itemname: 'grade', gradeduserid: 7
    }],
    ['core_grades_grader_gradingpanel_point_store', {
      component: 'mod_assign', contextid: 4, itemname: 'grade', gradeduserid: 7,
      notifyuser: true, formdata: 'grade=85&feedback=Good'
    }],
    ['core_grades_grader_gradingpanel_scale_fetch', {
      component: 'mod_forum', contextid: 5, itemname: 'rating', gradeduserid: 7
    }],
    ['core_grades_grader_gradingpanel_scale_store', {
      component: 'mod_forum', contextid: 5, itemname: 'rating', gradeduserid: 7,
      notifyuser: false, formdata: 'grade=3'
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_grade_selector_users({ course_id: 42, group_id: 3 });
  await client.get_grade_selector_groups({ course_id: 42, course_module_id: 11 });
  await client.get_point_grading_panel({
    component: 'mod_assign', context_id: 4, item: 'grade', user_id: 7
  });
  await client.save_point_grading_panel({
    component: 'mod_assign', context_id: 4, item: 'grade', user_id: 7,
    notify_user: true, form_data: { grade: 85, feedback: 'Good' }
  });
  await client.get_scale_grading_panel({
    component: 'mod_forum', context_id: 5, item: 'rating', user_id: 7
  });
  await client.save_scale_grading_panel({
    component: 'mod_forum', context_id: 5, item: 'rating', user_id: 7,
    form_data: { grade: 3 }
  });
});

test('maps remaining grade-report and analytics insight operations', async () => {
  const expectedFunctions = new Map([
    ['gradereport_grader_get_users_in_report', { courseid: 42 }],
    ['gradereport_singleview_get_grade_items_for_search_widget', { courseid: 42 }],
    ['gradereport_overview_view_grade_report', { courseid: 42, userid: 7 }],
    ['gradereport_user_view_grade_report', { courseid: 42, userid: 7 }],
    ['report_insights_action_executed', {
      actionname: 'fixed', predictionids: [10, 11]
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_grader_report_users({ course_id: 42 });
  await client.get_grade_items_for_selector({ course_id: 42 });
  await client.view_grade_overview_report({ course_id: 42, user_id: 7 });
  await client.view_user_grade_report({ course_id: 42, user_id: 7 });
  await client.record_insight_action({ action: 'fixed', prediction_ids: [10, 11] });
});

test('maps custom and system Report Builder operations', async () => {
  const systemReport = {
    source: '\\core_user\\reportbuilder\\local\\systemreports\\users',
    context: { contextlevel: 'system', instanceid: 0 },
    component: 'core_user',
    area: 'users',
    itemid: 0,
    parameters: [{ name: 'active', value: 1 }]
  };
  const expectedFunctions = new Map([
    ['core_reportbuilder_list_reports', { page: 1, perpage: 25 }],
    ['core_reportbuilder_retrieve_report', { reportid: 4, page: 2, perpage: 20 }],
    ['core_reportbuilder_view_report', { reportid: 4 }],
    ['core_reportbuilder_can_view_system_report', systemReport],
    ['core_reportbuilder_retrieve_system_report', {
      ...systemReport, page: 3, perpage: 50
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.list_custom_reports({ page: 1, page_size: 25 });
  await client.get_custom_report({ report_id: 4, page: 2, page_size: 20 });
  await client.view_custom_report({ report_id: 4 });
  const friendly = {
    source: '\\core_user\\reportbuilder\\local\\systemreports\\users',
    context_type: 'system', context_id: 0, component: 'core_user',
    area: 'users', parameters: { active: 1 }
  };
  await client.can_view_system_report(friendly);
  await client.get_system_report({ ...friendly, page: 3, page_size: 50 });
});

test('maps dynamic tables and Tiny editor configuration', async () => {
  const expectedFunctions = new Map([
    ['core_table_get_dynamic_table_content', {
      component: 'core_user', handler: 'participants', uniqueid: 'users-table',
      sortdata: [{ sortby: 'fullname', sortorder: 'ASC' }],
      filters: [{
        name: 'status', jointype: 1, values: ['active'],
        filteroptions: [{ name: 'include', value: 'enrolled' }]
      }],
      jointype: 1, firstinitial: 'A', pagenumber: 2, pagesize: 25,
      hiddencolumns: ['email'], resetpreferences: false
    }],
    ['editor_tiny_get_configuration', { contextlevel: 'course', instanceid: 42 }],
    ['tiny_premium_get_api_key', { contextid: 4 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_dynamic_table({
    component: 'core_user', handler: 'participants', unique_id: 'users-table',
    sort: [{ column: 'fullname', direction: 'ASC' }],
    filters: [{ name: 'status', join_type: 1, values: ['active'], options: { include: 'enrolled' } }],
    filter_join_type: 1, first_initial: 'A', page: 2, page_size: 25,
    hidden_columns: ['email'], reset_preferences: false
  });
  await client.get_tiny_editor_configuration({ context_type: 'course', context_id: 42 });
  await client.get_tiny_premium_api_key({ context_id: 4 });
});

test('maps data privacy requests and policy acceptances', async () => {
  const expectedFunctions = new Map([
    ['tool_dataprivacy_get_access_information', {}],
    ['tool_dataprivacy_create_data_request', {
      type: 1, comments: 'Please export my data', foruserid: 7
    }],
    ['tool_dataprivacy_cancel_data_request', { requestid: 12 }],
    ['tool_dataprivacy_contact_dpo', { message: 'Privacy question' }],
    ['tool_dataprivacy_get_data_requests', {
      userid: 7, statuses: [0, 1], types: [1], creationmethods: [0],
      sort: 'timecreated DESC', limitfrom: 10, limitnum: 20
    }],
    ['tool_policy_get_user_acceptances', { userid: 7 }],
    ['tool_policy_set_acceptances_status', {
      policies: [
        { versionid: 3, status: 1 },
        { versionid: 4, status: 0, note: 'Declined by guardian' }
      ],
      userid: 7
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_data_privacy_access_information({});
  await client.create_data_request({
    request_type: 1, comments: 'Please export my data', user_id: 7
  });
  await client.cancel_data_request({ request_id: 12 });
  await client.contact_data_protection_officer({ message: 'Privacy question' });
  await client.get_data_requests({
    user_id: 7, statuses: [0, 1], types: [1], creation_methods: [0],
    sort: 'timecreated DESC', offset: 10, limit: 20
  });
  await client.get_policy_acceptances({ user_id: 7 });
  await client.set_policy_acceptances({
    policies: [
      { version_id: 3, accepted: true },
      { version_id: 4, accepted: false, note: 'Declined by guardian' }
    ],
    user_id: 7
  });
});

test('maps all learning-plan aggregated page-data operations', async () => {
  const expectedFunctions = new Map([
    ['tool_lp_data_for_course_competencies_page', { courseid: 42, moduleid: 11 }],
    ['tool_lp_data_for_plan_page', { planid: 9 }],
    ['tool_lp_data_for_plans_page', { userid: 7 }],
    ['tool_lp_data_for_user_competency_summary', { userid: 7, competencyid: 5 }],
    ['tool_lp_data_for_user_competency_summary_in_course', {
      userid: 7, competencyid: 5, courseid: 42
    }],
    ['tool_lp_data_for_user_competency_summary_in_plan', { competencyid: 5, planid: 9 }],
    ['tool_lp_data_for_user_evidence_list_page', { userid: 7 }],
    ['tool_lp_data_for_user_evidence_page', { id: 6 }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.get_course_competencies_page({ course_id: 42, course_module_id: 11 });
  await client.get_learning_plan_page({ plan_id: 9 });
  await client.get_user_learning_plans_page({ user_id: 7 });
  await client.get_user_competency_summary({ user_id: 7, competency_id: 5 });
  await client.get_course_user_competency_summary({
    user_id: 7, competency_id: 5, course_id: 42
  });
  await client.get_plan_user_competency_summary({ competency_id: 5, plan_id: 9 });
  await client.get_user_evidence_list_page({ user_id: 7 });
  await client.get_user_evidence_page({ evidence_id: 6 });
});

test('maps messaging conversations, contacts, and preferences', async () => {
  const expectedFunctions = new Map([
    ['core_message_send_messages_to_conversation', {
      conversationid: 12, messages: [{ text: 'Hello', textformat: 1 }]
    }],
    ['core_message_get_conversations', {
      userid: 7, limitfrom: 10, limitnum: 20, type: 1,
      favourites: true, mergeself: false
    }],
    ['core_message_get_conversation_messages', {
      currentuserid: 7, convid: 12, limitfrom: 0, limitnum: 50,
      newest: true, timefrom: 100
    }],
    ['core_message_get_member_info', {
      referenceuserid: 7, userids: [8, 9],
      includecontactrequests: true, includeprivacyinfo: false
    }],
    ['core_message_set_favourite_conversations', {
      userid: 7, conversations: [12, 13]
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({ transport, moodleVersion: '5.2' });

  await client.send_conversation_messages({
    conversation_id: 12, messages: [{ text: 'Hello', textformat: 1 }]
  });
  await client.get_conversations({
    user_id: 7, offset: 10, limit: 20, type: 1, favourites: true, merge_self: false
  });
  await client.get_conversation_messages({
    user_id: 7, conversation_id: 12, offset: 0, limit: 50,
    newest_first: true, from_time: 100
  });
  await client.get_message_member_info({
    reference_user_id: 7, user_ids: [8, 9],
    include_contact_requests: true, include_privacy_info: false
  });
  await client.set_favourite_conversations({ user_id: 7, conversation_ids: [12, 13] });
});

test('maps AI, analytics, and Moodle app operations', async () => {
  const expectedFunctions = new Map([
    ['aiplacement_courseassist_explain_text', { contextid: 4, prompttext: 'Explain this' }],
    ['aiplacement_editor_generate_image', {
      contextid: 4, prompttext: 'A diagram', aspectratio: 'square',
      quality: 'standard', numimages: 1, style: 'natural'
    }],
    ['core_ai_get_policy_status', { userid: 7 }],
    ['tool_analytics_potential_contexts', { query: 'Course', modelid: 3 }],
    ['tool_mobile_get_config', { section: 'tool_mobile' }],
    ['tool_mobile_get_content', {
      component: 'mod_assign', method: 'mobile_course_view',
      args: [{ name: 'courseid', value: '42' }]
    }],
    ['tool_mobile_call_external_functions', {
      requests: [{ function: 'core_webservice_get_site_info', arguments: '{}' }]
    }]
  ]);
  const transport = createTransport(Object.fromEntries([...expectedFunctions].map(([name, expected]) => [
    name, (parameters) => {
      assert.deepEqual(parameters, expected);
      return {};
    }
  ])));
  const client = createMoodleClient({
    transport,
    moodleVersion: '5.2',
    allowDangerousOperations: true
  });

  await client.explain_text_with_ai({ context_id: 4, prompt_text: 'Explain this' });
  await client.generate_ai_image({
    context_id: 4, prompt_text: 'A diagram', aspect_ratio: 'square',
    quality: 'standard', number_of_images: 1, style: 'natural'
  });
  await client.get_ai_policy_status({ user_id: 7 });
  await client.get_analytics_contexts({ query: 'Course', model_id: 3 });
  await client.get_mobile_config({ section: 'tool_mobile' });
  await client.get_mobile_content({
    component: 'mod_assign', method: 'mobile_course_view',
    arguments: [{ name: 'courseid', value: '42' }]
  });
  await client.call_mobile_external_functions({
    requests: [{ function: 'core_webservice_get_site_info', arguments: '{}' }]
  });
});

test('maps every source-generated standard operation through its static contract', async () => {
  const contract = JSON.parse(
    await fs.readFile(new URL('../contract/operations.json', import.meta.url), 'utf8')
  );
  const generatedOperations = contract.operations.slice(-contract.generatedStandardOperationCount);
  assert.equal(generatedOperations.length, contract.generatedStandardOperationCount);

  function sampleValue(descriptor) {
    switch (descriptor.type) {
      case 'integer': return 2;
      case 'number': return 2.5;
      case 'boolean': return true;
      case 'string': return 'value';
      case 'array': return [descriptor.items === 'string' ? 'value' : 2];
      case 'object_array': return [{}];
      case 'object': return {};
      default: throw new Error(`Unsupported generated parameter type: ${descriptor.type}`);
    }
  }

  for (const operation of generatedOperations) {
    const friendlyParameters = {};
    const expectedParameters = {};
    for (const [friendlyName, descriptor] of Object.entries(operation.parameters)) {
      const value = sampleValue(descriptor);
      friendlyParameters[friendlyName] = value;
      expectedParameters[descriptor.moodleName ?? friendlyName] = value;
    }
    const transport = createTransport({
      [operation.moodleFunction]: (parameters) => {
        assert.deepEqual(parameters, expectedParameters, operation.name);
        return {};
      }
    });
    const client = createMoodleClient({
      transport,
      moodleVersion: operation.compatibility.from,
      allowDangerousOperations: true
    });
    await client[operation.name](friendlyParameters);
  }
});
