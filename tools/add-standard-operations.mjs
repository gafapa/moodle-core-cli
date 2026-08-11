#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const contractPath = resolve(projectRoot, 'contract', 'operations.json');
const versions = ['5.0', '5.1', '5.2'];

async function readJson(path) {
  return JSON.parse(await readFile(resolve(projectRoot, path), 'utf8'));
}

const contract = await readJson('contract/operations.json');
const inventories = Object.fromEntries(await Promise.all(versions.map(async (version) => [
  version,
  new Set((await readJson(`contract/moodle-${version}-inventory.json`)).declaredFunctions)
])));
const typeSources = Object.fromEntries(await Promise.all(versions.map(async (version) => [
  version,
  await readJson(version === '5.2'
    ? 'contract/source-response-types.json'
    : `contract/moodle-${version}-response-types.json`)
])));

const exactParameterNames = {
  userid: 'user_id',
  userids: 'user_ids',
  useridto: 'to_user_id',
  useridfrom: 'from_user_id',
  courseid: 'course_id',
  courseids: 'course_ids',
  categoryid: 'category_id',
  categoryids: 'category_ids',
  contextid: 'context_id',
  contextids: 'context_ids',
  competencyid: 'competency_id',
  competencyids: 'competency_ids',
  competencyframeworkid: 'competency_framework_id',
  planid: 'plan_id',
  templateid: 'template_id',
  moduleid: 'module_id',
  cmid: 'course_module_id',
  cmids: 'course_module_ids',
  groupid: 'group_id',
  groupids: 'group_ids',
  groupingid: 'grouping_id',
  cohortid: 'cohort_id',
  roleid: 'role_id',
  instanceid: 'instance_id',
  itemid: 'item_id',
  fieldid: 'field_id',
  pageid: 'page_id',
  questionid: 'question_id',
  attemptid: 'attempt_id',
  reportid: 'report_id',
  requestid: 'request_id',
  conversationid: 'conversation_id',
  conversationids: 'conversation_ids',
  messageid: 'message_id',
  notificationid: 'notification_id',
  limitfrom: 'offset',
  limitnum: 'limit',
  searchvalue: 'query',
  searchtext: 'query',
  searchquery: 'query',
  sortorder: 'sort_order',
  timecreated: 'created_at',
  timestart: 'start_time',
  timeend: 'end_time',
  includecapabilities: 'include_capabilities',
  includeenrolments: 'include_enrolments',
  includecontactrequests: 'include_contact_requests',
  includeprivacyinfo: 'include_privacy_info',
  onlyactive: 'only_active',
  onlymycourses: 'only_my_courses'
  ,
  admintreeid: 'admin_tree_id',
  browserexamkey: 'browser_exam_key',
  componentname: 'component_name',
  conditionid: 'condition_id',
  contentitemid: 'content_item_id',
  contextlevel: 'context_level',
  customprofilefields: 'custom_profile_fields',
  definitionid: 'definition_id',
  deletecontent: 'delete_content',
  deleteplans: 'delete_plans',
  filecontent: 'file_content',
  gradeduserid: 'graded_user_id',
  includecomments: 'include_comments',
  includedetails: 'include_details',
  includeinherit: 'include_inherited',
  includenotset: 'include_not_set',
  includerelated: 'include_related',
  includesubcategories: 'include_subcategories',
  jsonformdata: 'json_form_data',
  newcategoryid: 'new_category_id',
  newcontextid: 'new_context_id',
  onlyvisible: 'only_visible',
  otheruserid: 'other_user_id',
  paymentarea: 'payment_area',
  precedingsiblingid: 'preceding_sibling_id',
  recaptchachallengehash: 'recaptcha_challenge_hash',
  recaptcharesponse: 'recaptcha_response',
  relatedcompetencyid: 'related_competency_id',
  requiredcapabilities: 'required_capabilities',
  ruleoutcome: 'rule_outcome',
  sectionreturn: 'section_return',
  settingname: 'setting_name',
  shareformat: 'share_format',
  stringparams: 'string_parameters',
  subscriptionid: 'subscription_id',
  targetparentid: 'target_parent_id',
  targetsectionid: 'target_section_id',
  targetsectionnum: 'target_section_number',
  uniqueidentifier: 'unique_identifier',
  userevidenceid: 'user_evidence_id'
};
const words = [
  'capabilities', 'competency', 'framework', 'preferences', 'configuration',
  'conversation', 'notification', 'categories', 'category', 'contexts', 'context',
  'activities', 'activity', 'questions', 'question', 'enrolments', 'enrolment',
  'instances', 'instance', 'courses', 'course', 'modules', 'module', 'templates',
  'template', 'reports', 'report', 'sections', 'section', 'messages', 'message',
  'users', 'user', 'groups', 'group', 'fields', 'field', 'items', 'item',
  'include', 'exclude', 'enabled', 'disabled', 'current', 'format', 'status',
  'search', 'query', 'filter', 'filters', 'sort', 'order', 'offset', 'limit',
  'created', 'updated', 'start', 'end', 'from', 'to', 'name', 'value',
  'type', 'mode', 'page', 'number', 'size', 'ids', 'id'
].sort((left, right) => right.length - left.length);

function splitCollapsedName(value) {
  const memo = new Map();
  function split(rest) {
    if (rest.length === 0) return [];
    if (memo.has(rest)) return memo.get(rest);
    for (const word of words) {
      if (!rest.startsWith(word)) continue;
      const tail = split(rest.slice(word.length));
      if (tail) {
        const result = [word, ...tail];
        memo.set(rest, result);
        return result;
      }
    }
    memo.set(rest, null);
    return null;
  }
  return split(value);
}

function friendlyParameterName(name) {
  if (exactParameterNames[name]) return exactParameterNames[name];
  if (name.includes('_')) return name;
  const parts = splitCollapsedName(name);
  return parts ? parts.join('_') : name;
}

function operationBaseName(moodleFunction) {
  if (moodleFunction.startsWith('core_')) return moodleFunction.slice(5);
  if (moodleFunction.startsWith('tool_')) return moodleFunction.slice(5);
  return moodleFunction;
}

function compatibilityFor(moodleFunction) {
  const available = versions.filter((version) => inventories[version].has(moodleFunction));
  if (available.length === 0) throw new Error(`No inventory contains ${moodleFunction}.`);
  const indexes = available.map((version) => versions.indexOf(version));
  for (let index = 1; index < indexes.length; index += 1) {
    if (indexes[index] !== indexes[index - 1] + 1) {
      throw new Error(`Non-contiguous compatibility for ${moodleFunction}.`);
    }
  }
  const compatibility = { from: available[0] };
  if (available.at(-1) !== versions.at(-1)) compatibility.until = available.at(-1);
  return compatibility;
}

function sourceFor(moodleFunction) {
  for (const version of [...versions].reverse()) {
    if (inventories[version].has(moodleFunction) && typeSources[version].services[moodleFunction]) {
      return typeSources[version];
    }
  }
  throw new Error(`No extracted source metadata found for ${moodleFunction}.`);
}

const existingFunctions = new Set(contract.operations.map((operation) => operation.moodleFunction));
const operationNames = new Set(contract.operations.map((operation) => operation.name));
const allFunctions = new Set(versions.flatMap((version) => [...inventories[version]]));
const additions = [];

if (process.argv.includes('--normalize-existing')) {
  const generatedCount = contract.generatedStandardOperationCount ?? 0;
  for (const operation of contract.operations.slice(-generatedCount)) {
    const normalizedParameters = {};
    for (const [currentName, descriptor] of Object.entries(operation.parameters)) {
      const moodleName = descriptor.moodleName ?? currentName;
      let friendlyName = friendlyParameterName(moodleName);
      if (normalizedParameters[friendlyName]) friendlyName = moodleName;
      normalizedParameters[friendlyName] = {
        ...descriptor,
        ...(friendlyName === moodleName ? {} : { moodleName })
      };
    }
    operation.parameters = normalizedParameters;
  }
}

for (const moodleFunction of [...allFunctions].sort()) {
  if (existingFunctions.has(moodleFunction)) continue;
  const source = sourceFor(moodleFunction);
  let name = operationBaseName(moodleFunction);
  if (operationNames.has(name)) name = moodleFunction;
  operationNames.add(name);

  const parameters = {};
  for (const [moodleName, sourceDescriptor] of Object.entries(source.parameters[moodleFunction] ?? {})) {
    let friendlyName = friendlyParameterName(moodleName);
    if (parameters[friendlyName]) friendlyName = moodleName;
    parameters[friendlyName] = {
      ...sourceDescriptor,
      ...(friendlyName === moodleName ? {} : { moodleName })
    };
  }

  additions.push({
    name,
    summary: source.services[moodleFunction].summary,
    kind: source.services[moodleFunction].kind,
    moodleFunction,
    compatibility: compatibilityFor(moodleFunction),
    parameters,
    returns: source.schemas[moodleFunction] ?? 'object'
  });
}

contract.operations.push(...additions);
contract.generatedStandardOperationCount =
  (contract.generatedStandardOperationCount ?? 0) + additions.length;
await writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`);
console.log(`Added ${additions.length} standard Moodle operations.`);
