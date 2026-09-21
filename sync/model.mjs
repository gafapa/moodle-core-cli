import { contentDigest } from './canonical.mjs';

function optionalString(value) {
  return value === undefined || value === null ? null : String(value);
}

function normalizeTextFormat(value) {
  if (value === undefined || value === null || value === '') return null;
  const formats = { 0: 'moodle', 1: 'html', 2: 'plain', 4: 'markdown' };
  return formats[value] ?? String(value).toLowerCase();
}

function normalizeSection(section, index) {
  const sourceId = Number(section.id ?? section.section_id ?? 0);
  const sectionNumber = Number(section.section ?? section.section_number ?? index);
  return {
    sync_key: `section:${sourceId || sectionNumber}`,
    source_id: sourceId || null,
    section_number: sectionNumber,
    name: optionalString(section.name) ?? '',
    summary: optionalString(section.summary) ?? '',
    summary_format: normalizeTextFormat(section.summaryformat ?? section.summary_format ?? 1),
    visible: section.visible === undefined ? null : Boolean(section.visible),
    order: index,
    modules: (section.modules ?? []).map((module, moduleIndex) => ({
      sync_key: `module:${Number(module.id ?? module.module_id ?? 0) || `${sectionNumber}:${moduleIndex}`}`,
      source_id: Number(module.id ?? module.module_id ?? 0) || null,
      instance_id: Number(module.instance ?? module.instance_id ?? 0) || null,
      module_type: String(module.modname ?? module.module_type ?? ''),
      name: optionalString(module.name) ?? '',
      visible: module.visible === undefined ? null : Boolean(module.visible),
      order: moduleIndex,
      url: optionalString(module.url),
      availability: optionalString(module.availability),
      authoring_completeness: module.authoring_completeness ?? 'shell',
      authoring: module.authoring ? structuredClone(module.authoring) : null
    }))
  };
}

export function createCourseSyncModel({
  site, course, sections = [], groups = [], groupings = [], exclusions = [], targetCreation = null
}) {
  if (!site || !course) throw new TypeError('site and course are required.');
  const normalizedGroups = groups.map((group) => ({
    sync_key: `group:${Number(group.id ?? group.group_id ?? 0) || String(group.idnumber ?? group.name)}`,
    source_id: Number(group.id ?? group.group_id ?? 0) || null,
    name: optionalString(group.name) ?? '',
    description: optionalString(group.description) ?? '',
    idnumber: optionalString(group.idnumber),
    visibility: group.visibility ?? null,
    participation: group.participation ?? null
  }));
  const model = {
    schema_version: 1,
    extracted_at: new Date().toISOString(),
    ...(targetCreation ? { target_creation: structuredClone(targetCreation) } : {}),
    site: {
      provider: String(site.provider),
      profile: optionalString(site.profile),
      site_url: String(site.site_url),
      moodle_version: optionalString(site.moodle_version),
      plugin_version: optionalString(site.plugin_version)
    },
    course: {
      source_id: Number(course.id ?? course.course_id ?? 0) || null,
      fullname: optionalString(course.fullname) ?? '',
      shortname: optionalString(course.shortname) ?? '',
      category_id: Number(course.category_id ?? course.categoryid ?? 0) || null,
      idnumber: optionalString(course.idnumber),
      summary: optionalString(course.summary),
      summary_format: normalizeTextFormat(course.summary_format ?? course.summaryformat),
      visible: course.visible === undefined ? null : Boolean(course.visible),
      start_date: course.start_date ?? course.startdate ?? null,
      end_date: course.end_date ?? course.enddate ?? null
    },
    sections: sections.map(normalizeSection),
    groups: normalizedGroups,
    groupings: groupings.map((grouping) => ({
      sync_key: `grouping:${Number(grouping.id ?? grouping.grouping_id ?? 0) || String(grouping.idnumber ?? grouping.name)}`,
      source_id: Number(grouping.id ?? grouping.grouping_id ?? 0) || null,
      name: optionalString(grouping.name) ?? '',
      description: optionalString(grouping.description) ?? '',
      idnumber: optionalString(grouping.idnumber),
      group_source_keys: (grouping.group_ids ?? grouping.groups?.map((group) => group.id) ?? [])
        .map((groupId) => normalizedGroups.find((group) => group.source_id === Number(groupId))?.sync_key)
        .filter(Boolean)
    })),
    assets: [],
    exclusions: [...exclusions]
  };
  model.assets = model.sections.flatMap((section) => section.modules.flatMap((module) => [
    ...(module.authoring?.files ?? []).map((file) => ({
      owner: {
        entity: module.sync_key,
        module: module.sync_key,
        component: `mod_${module.module_type}`,
        file_area: 'content'
      },
      filename: String(file.filename ?? ''),
      filepath: String(file.filepath ?? '/'),
      filesize: Number(file.filesize ?? 0),
      mimetype: optionalString(file.mimetype),
      content_hash: optionalString(file.content_hash),
      sha256: optionalString(file.sha256),
      url: optionalString(file.url)
    })),
    ...(module.authoring?.chapters ?? []).flatMap((chapter) => (chapter.files ?? []).map((file) => ({
      owner: {
        entity: `chapter:${Number(chapter.chapter_id ?? 0) || 'unknown'}`,
        module: module.sync_key,
        component: 'mod_book',
        file_area: 'chapter'
      },
      filename: String(file.filename ?? ''),
      filepath: String(file.filepath ?? '/'),
      filesize: Number(file.filesize ?? 0),
      mimetype: optionalString(file.mimetype),
      content_hash: optionalString(file.content_hash),
      sha256: optionalString(file.sha256),
      url: optionalString(file.url)
    })))
  ]));
  model.digest = contentDigest({ ...model, extracted_at: undefined, digest: undefined });
  return model;
}

export function selectedCourseFields(model) {
  const result = {};
  for (const field of ['fullname', 'shortname', 'category_id', 'idnumber', 'summary', 'summary_format', 'visible', 'start_date', 'end_date']) {
    if (model.course[field] !== null && model.course[field] !== undefined) result[field] = model.course[field];
  }
  return result;
}
