import { randomUUID } from 'node:crypto';
import { canonicalize, contentDigest } from './canonical.mjs';
import { selectedCourseFields } from './model.mjs';

function changedFields(source, target, fields) {
  return Object.fromEntries(fields
    .filter((field) => source[field] !== null && source[field] !== undefined && source[field] !== target[field])
    .map((field) => [field, source[field]]));
}

function threeWayChangedFields(source, target, baselineSource, baselineTarget, fields, context) {
  if (!baselineSource || !baselineTarget) return changedFields(source, target, fields);
  const updates = {};
  for (const field of fields) {
    const sourceValue = source[field];
    if (sourceValue === null || sourceValue === undefined) continue;
    const targetValue = target[field];
    const sourceChanged = sourceValue !== baselineSource[field];
    const targetChanged = targetValue !== baselineTarget[field];
    if (!sourceChanged && targetChanged) {
      context.divergences.push({ ...context.identity, field, reason: 'target_only_change' });
      continue;
    }
    if (sourceChanged && targetChanged && sourceValue !== targetValue) {
      context.conflicts.push({
        ...context.identity,
        field,
        reason: 'concurrent_change',
        baseline_source: baselineSource[field],
        baseline_target: baselineTarget[field],
        source_value: sourceValue,
        target_value: targetValue,
        resolution: context.conflictPolicy
      });
      if (context.conflictPolicy === 'source-wins') updates[field] = sourceValue;
      continue;
    }
    if (sourceValue !== targetValue) updates[field] = sourceValue;
  }
  return updates;
}

function targetSectionByMapping(target, mapping, sourceSection) {
  const mappedId = mapping?.sections?.[sourceSection.sync_key];
  if (mappedId !== undefined) return target.sections.find((section) => section.source_id === mappedId) ?? null;
  if (sourceSection.section_number === 0) {
    return target.sections.find((section) => section.section_number === 0) ?? null;
  }
  return null;
}

function targetEntityByMapping(targetEntities, mapping, namespace, sourceEntity) {
  const mappedId = mapping?.[namespace]?.[sourceEntity.sync_key];
  if (mappedId === undefined) return null;
  return targetEntities.find((entity) => entity.source_id === mappedId) ?? null;
}

export function courseBindingId(source, target) {
  return `binding_${contentDigest({
    source_site: source.site.site_url,
    source_course_id: source.course.source_id,
    target_site: target.site.site_url,
    target_course_id: target.course.source_id,
    target_creation: target.target_creation ?? null
  }).slice(0, 32)}`;
}

function actionId(action) {
  return `action_${contentDigest(action).slice(0, 24)}`;
}

function addAction(actions, action) {
  actions.push({ action_id: actionId(action), ...action });
}

function capabilitySupports(capabilities, name, fields = []) {
  const capability = capabilities[name];
  if (capability === true) return true;
  if (!capability || capability.available !== true) return false;
  if (!Array.isArray(capability.supported_fields)) return true;
  const supported = new Set(capability.supported_fields);
  return fields.every((field) => supported.has(field));
}

function authoredContentHasFiles(content) {
  return /@@PLUGINFILE@@|\/(?:webservice\/)?pluginfile\.php(?:\/|\?)/i.test(String(content ?? ''));
}

function containsSourceSiteReference(content, sourceSiteUrl) {
  const value = String(content ?? '');
  if (!value || !sourceSiteUrl) return false;
  const origin = new URL(sourceSiteUrl).origin;
  return value.includes(`${origin}/mod/`) || value.includes(`${origin}/course/`);
}

function allModules(model) {
  return model.sections.flatMap((section) => section.modules);
}

export function createCourseSyncPlan({
  source,
  target,
  mapping = {},
  baseline = null,
  capabilities = {},
  targetCreation = target.target_creation ?? null,
  unsupportedPolicy = 'error',
  conflictPolicy = 'abort',
  expiresInMs = 60 * 60 * 1000
}) {
  if (!['error', 'skip', 'degrade'].includes(unsupportedPolicy)) {
    throw new TypeError('unsupportedPolicy must be error, skip, or degrade.');
  }
  if (!['abort', 'source-wins', 'target-wins', 'report'].includes(conflictPolicy)) {
    throw new TypeError('conflictPolicy is unsupported.');
  }
  const actions = [];
  const unsupported = [];
  const conflicts = [];
  const divergences = [];
  if (target.course.source_id === null) {
    const fields = {
      fullname: source.course.fullname,
      shortname: String(targetCreation?.shortname ?? source.course.shortname),
      category_id: Number(targetCreation?.category_id),
      ...(source.course.idnumber ? { idnumber: source.course.idnumber } : {}),
      ...(source.course.summary !== null ? { summary: source.course.summary } : {}),
      visible: false,
      ...(source.course.start_date !== null ? { start_date: source.course.start_date } : {}),
      ...(source.course.end_date !== null ? { end_date: source.course.end_date } : {})
    };
    if (capabilitySupports(capabilities, 'course_create', Object.keys(fields))) {
      addAction(actions, {
        kind: 'course.create', entity_namespace: 'courses',
        source_key: `course:${source.course.source_id}`, target_id: null,
        fields, effects: ['content.write']
      });
    } else unsupported.push({ kind: 'course.create', fields: Object.keys(fields), reason: 'target_capability_unavailable' });
  }
  const courseFields = target.course.source_id === null ? {} : threeWayChangedFields(source.course, target.course, baseline?.source_model?.course, baseline?.target_model?.course, [
    'fullname', 'shortname', 'idnumber', 'summary', 'summary_format', 'visible', 'start_date', 'end_date'
  ], { conflicts, divergences, conflictPolicy, identity: { kind: 'course.update', source_key: `course:${source.course.source_id}` } });
  if (Object.keys(courseFields).length > 0) {
    if (capabilitySupports(capabilities, 'course_update', Object.keys(courseFields))) {
      addAction(actions, {
        kind: 'course.update',
        source_key: `course:${source.course.source_id}`,
        target_id: target.course.source_id,
        fields: courseFields,
        expected_target_digest: contentDigest(selectedCourseFields(target)),
        effects: ['content.write']
      });
    } else {
      unsupported.push({ kind: 'course.update', fields: Object.keys(courseFields), reason: 'target_capability_unavailable' });
    }
  }
  for (const sourceSection of source.sections) {
    const targetSection = targetSectionByMapping(target, mapping, sourceSection);
    if (!targetSection) {
      const detail = { kind: 'section.create', source_key: sourceSection.sync_key, reason: 'target_capability_unavailable' };
      const fields = {
        name: sourceSection.name,
        summary: sourceSection.summary,
        summary_format: sourceSection.summary_format,
        visible: sourceSection.visible,
        order: sourceSection.order
      };
      if (capabilitySupports(capabilities, 'section_create', Object.keys(fields))) {
        addAction(actions, {
          kind: 'section.create',
          entity_namespace: 'sections',
          source_key: sourceSection.sync_key,
          target_id: null,
          fields,
          effects: ['content.write']
        });
      } else unsupported.push(detail);
      continue;
    }
    const baselineSourceSection = baseline?.source_model?.sections?.find((section) => section.sync_key === sourceSection.sync_key);
    const baselineTargetSection = baseline?.target_model
      ? targetSectionByMapping(baseline.target_model, mapping, sourceSection)
      : null;
    const fields = threeWayChangedFields(
      sourceSection,
      targetSection,
      baselineSourceSection,
      baselineTargetSection,
      ['name', 'summary', 'summary_format', 'visible', 'order'],
      {
        conflicts, divergences, conflictPolicy,
        identity: { kind: 'section.update', source_key: sourceSection.sync_key }
      }
    );
    if (Object.keys(fields).length === 0) continue;
    if (capabilitySupports(capabilities, 'section_update', Object.keys(fields))) {
      addAction(actions, {
        kind: 'section.update',
        entity_namespace: 'sections',
        source_key: sourceSection.sync_key,
        target_id: targetSection.source_id,
        target_section_number: targetSection.section_number,
        fields,
        ...(targetSection.source_id ? { expected_target_digest: contentDigest(targetSection) } : {}),
        effects: ['content.write']
      });
    } else unsupported.push({ kind: 'section.update', source_key: sourceSection.sync_key, fields: Object.keys(fields), reason: 'target_capability_unavailable' });
  }
  for (const sourceGroup of source.groups) {
    const targetGroup = targetEntityByMapping(target.groups, mapping, 'groups', sourceGroup);
    const fields = Object.fromEntries(['name', 'description', 'idnumber', 'visibility', 'participation']
      .filter((field) => sourceGroup[field] !== null && sourceGroup[field] !== undefined)
      .map((field) => [field, sourceGroup[field]]));
    if (!targetGroup) {
      if (capabilitySupports(capabilities, 'group_create', Object.keys(fields))) {
        addAction(actions, {
          kind: 'group.create',
          entity_namespace: 'groups',
          source_key: sourceGroup.sync_key,
          target_id: null,
          fields,
          effects: ['content.write']
        });
      } else unsupported.push({ kind: 'group.create', source_key: sourceGroup.sync_key, fields: Object.keys(fields), reason: 'target_capability_unavailable' });
      continue;
    }
    const baselineSourceGroup = baseline?.source_model?.groups?.find((group) => group.sync_key === sourceGroup.sync_key);
    const baselineTargetGroup = baseline?.target_model
      ? targetEntityByMapping(baseline.target_model.groups, mapping, 'groups', sourceGroup)
      : null;
    const updates = threeWayChangedFields(
      sourceGroup, targetGroup, baselineSourceGroup, baselineTargetGroup,
      ['name', 'description', 'idnumber', 'visibility', 'participation'],
      { conflicts, divergences, conflictPolicy, identity: { kind: 'group.update', source_key: sourceGroup.sync_key } }
    );
    if (Object.keys(updates).length === 0) continue;
    updates.name ??= sourceGroup.name;
    if (capabilitySupports(capabilities, 'group_update', Object.keys(updates))) {
      addAction(actions, {
        kind: 'group.update',
        entity_namespace: 'groups',
        source_key: sourceGroup.sync_key,
        target_id: targetGroup.source_id,
        fields: updates,
        expected_target_digest: contentDigest(targetGroup),
        effects: ['content.write']
      });
    } else unsupported.push({ kind: 'group.update', source_key: sourceGroup.sync_key, fields: Object.keys(updates), reason: 'target_capability_unavailable' });
  }
  for (const sourceGrouping of source.groupings) {
    const targetGrouping = targetEntityByMapping(target.groupings, mapping, 'groupings', sourceGrouping);
    const fields = Object.fromEntries(['name', 'description', 'idnumber']
      .filter((field) => sourceGrouping[field] !== null && sourceGrouping[field] !== undefined)
      .map((field) => [field, sourceGrouping[field]]));
    if (!targetGrouping) {
      if (capabilitySupports(capabilities, 'grouping_create', Object.keys(fields))) {
        addAction(actions, {
          kind: 'grouping.create', entity_namespace: 'groupings', source_key: sourceGrouping.sync_key,
          target_id: null, fields, effects: ['content.write']
        });
      } else unsupported.push({ kind: 'grouping.create', source_key: sourceGrouping.sync_key, reason: 'target_capability_unavailable' });
      continue;
    }
    const baselineSourceGrouping = baseline?.source_model?.groupings?.find(
      (grouping) => grouping.sync_key === sourceGrouping.sync_key
    );
    const baselineTargetGrouping = baseline?.target_model
      ? targetEntityByMapping(baseline.target_model.groupings, mapping, 'groupings', sourceGrouping)
      : null;
    const updates = threeWayChangedFields(
      sourceGrouping, targetGrouping, baselineSourceGrouping, baselineTargetGrouping,
      ['name', 'description', 'idnumber'],
      {
        conflicts, divergences, conflictPolicy,
        identity: { kind: 'grouping.update', source_key: sourceGrouping.sync_key }
      }
    );
    if (Object.keys(updates).length === 0) continue;
    updates.name ??= sourceGrouping.name;
    if (capabilitySupports(capabilities, 'grouping_update', Object.keys(updates))) {
      addAction(actions, {
        kind: 'grouping.update', entity_namespace: 'groupings', source_key: sourceGrouping.sync_key,
        target_id: targetGrouping.source_id, fields: updates,
        expected_target_digest: contentDigest(targetGrouping), effects: ['content.write']
      });
    } else unsupported.push({ kind: 'grouping.update', source_key: sourceGrouping.sync_key, reason: 'target_capability_unavailable' });
  }
  for (const sourceGrouping of source.groupings) {
    const targetGrouping = targetEntityByMapping(target.groupings, mapping, 'groupings', sourceGrouping);
    const groupingWillBeCreated = actions.some((action) =>
      action.kind === 'grouping.create' && action.source_key === sourceGrouping.sync_key);
    for (const groupSourceKey of sourceGrouping.group_source_keys ?? []) {
      const sourceGroup = source.groups.find((group) => group.sync_key === groupSourceKey);
      if (!sourceGroup) {
        unsupported.push({ kind: 'grouping.member.add', source_key: sourceGrouping.sync_key, reason: 'source_group_unresolved' });
        continue;
      }
      const targetGroup = targetEntityByMapping(target.groups, mapping, 'groups', sourceGroup);
      const groupWillBeCreated = actions.some((action) =>
        action.kind === 'group.create' && action.source_key === sourceGroup.sync_key);
      if ((!targetGrouping && !groupingWillBeCreated) || (!targetGroup && !groupWillBeCreated)) {
        unsupported.push({
          kind: 'grouping.member.add', source_key: sourceGrouping.sync_key,
          group_source_key: sourceGroup.sync_key, reason: 'target_entity_unresolved'
        });
        continue;
      }
      if (targetGrouping && targetGroup
        && (targetGrouping.group_source_keys ?? []).includes(targetGroup.sync_key)) continue;
      if (!capabilitySupports(capabilities, 'grouping_member_add', ['grouping_id', 'group_id'])) {
        unsupported.push({
          kind: 'grouping.member.add', source_key: sourceGrouping.sync_key,
          group_source_key: sourceGroup.sync_key, reason: 'target_capability_unavailable'
        });
        continue;
      }
      addAction(actions, {
        kind: 'grouping.member.add',
        source_key: `${sourceGrouping.sync_key}:${sourceGroup.sync_key}`,
        grouping_source_key: sourceGrouping.sync_key,
        group_source_key: sourceGroup.sync_key,
        target_grouping_id: targetGrouping?.source_id ?? null,
        target_group_id: targetGroup?.source_id ?? null,
        effects: ['content.write']
      });
    }
  }
  const targetModules = allModules(target);
  for (const sourceSection of source.sections) {
    for (const sourceModule of sourceSection.modules) {
      if (sourceModule.module_type === 'assign') {
        if (!['complete', 'selected'].includes(sourceModule.authoring_completeness)) {
          unsupported.push({ kind: 'assignment.authoring', source_key: sourceModule.sync_key, reason: 'source_authoring_unavailable' });
          continue;
        }
        const authoring = sourceModule.authoring ?? {};
        const assignmentFormats = [
          Number(authoring.content?.intro_format ?? 1),
          Number(authoring.content?.activity_format ?? 1)
        ];
        if (assignmentFormats.some((format) => ![1, 2].includes(format))) {
          unsupported.push({
            kind: 'assignment.content_format', source_key: sourceModule.sync_key,
            reason: 'destination_format_not_representable', source_formats: assignmentFormats
          });
          continue;
        }
        if (authoredContentHasFiles(authoring.content?.intro) || authoredContentHasFiles(authoring.content?.activity)) {
          unsupported.push({ kind: 'assignment.assets', source_key: sourceModule.sync_key, reason: 'native_editor_asset_manifest_incomplete' });
          continue;
        }
        if (containsSourceSiteReference(authoring.content?.intro, source.site.site_url)
          || containsSourceSiteReference(authoring.content?.activity, source.site.site_url)) {
          unsupported.push({ kind: 'assignment.internal_links', source_key: sourceModule.sync_key, reason: 'internal_link_mapping_unavailable' });
          continue;
        }
        if ((authoring.losses ?? []).length > 0) {
          unsupported.push({
            kind: 'assignment.settings', source_key: sourceModule.sync_key,
            reason: 'selected_configuration_incomplete', losses: authoring.losses,
            degradable: true, transformation: 'assignment_selected_settings'
          });
          if (unsupportedPolicy !== 'degrade') continue;
        }
        const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
        const targetSection = targetSectionByMapping(target, mapping, sourceSection);
        if (!targetModule) {
          const parentWillBeCreated = actions.some((action) =>
            action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
          if (!targetSection && !parentWillBeCreated) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
            continue;
          }
          const fields = {
            module_type: 'assign',
            name: sourceModule.name,
            ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
            settings: {
              ...(authoring.settings ?? {}),
              intro: String(authoring.content?.intro ?? ''),
              activity: String(authoring.content?.activity ?? '')
            },
            transformation: (authoring.losses ?? []).length > 0 ? 'assignment_selected_settings' : null
          };
          if (!capabilitySupports(capabilities, 'module_create', ['module_type', 'name', 'visible', 'settings'])) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
            continue;
          }
          addAction(actions, {
            kind: 'module.create', entity_namespace: 'modules', source_key: sourceModule.sync_key,
            parent_source_key: sourceSection.sync_key,
            target_section_number: targetSection?.section_number ?? null,
            target_id: null, fields, effects: ['content.write']
          });
          if (authoring.rubric) {
            if (capabilitySupports(capabilities, 'assignment_rubric_set', ['name', 'description', 'criteria', 'options'])) {
              addAction(actions, {
                kind: 'assignment_rubric.set',
                source_key: `rubric:${sourceModule.sync_key}`,
                parent_source_key: sourceModule.sync_key,
                target_module_id: null,
                target_id: null,
                fields: authoring.rubric,
                effects: ['content.write', 'grading_configuration.write']
              });
            } else unsupported.push({ kind: 'assignment_rubric.set', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
          }
          continue;
        }
        const contentUpdates = changedFields(authoring.content ?? {}, targetModule.authoring?.content ?? {}, [
          'intro', 'intro_format', 'activity', 'activity_format'
        ]);
        if (sourceModule.name !== targetModule.name) contentUpdates.name = sourceModule.name;
        if (Object.keys(contentUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'assignment_content_update', Object.keys(contentUpdates))) {
            addAction(actions, {
              kind: 'assignment_content.update', source_key: sourceModule.sync_key,
              target_id: targetModule.source_id, fields: contentUpdates,
              expected_target_digest: contentDigest(targetModule), effects: ['content.write']
            });
          } else unsupported.push({ kind: 'assignment_content.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(authoring.settings ?? {}) !== contentDigest(targetModule.authoring?.settings ?? {})) {
          unsupported.push({ kind: 'assignment.settings_update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(authoring.rubric ?? null) !== contentDigest(targetModule.authoring?.rubric ?? null)) {
          unsupported.push({ kind: 'assignment.grading_definition_update', source_key: sourceModule.sync_key, reason: 'existing_grading_definition_protected' });
        }
        continue;
      }
      if (sourceModule.module_type === 'workshop') {
        if (sourceModule.authoring_completeness !== 'complete') {
          unsupported.push({ kind: 'workshop.authoring', source_key: sourceModule.sync_key, reason: 'source_authoring_unavailable' });
          continue;
        }
        const authoring = sourceModule.authoring ?? {};
        const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
        const targetSection = targetSectionByMapping(target, mapping, sourceSection);
        if (!targetModule) {
          const parentWillBeCreated = actions.some((action) =>
            action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
          if (!targetSection && !parentWillBeCreated) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
            continue;
          }
          if (!capabilitySupports(capabilities, 'module_create', ['module_type', 'name', 'visible', 'settings'])) {
            unsupported.push({ kind: 'workshop.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
            continue;
          }
          addAction(actions, {
            kind: 'module.create', entity_namespace: 'modules', source_key: sourceModule.sync_key,
            parent_source_key: sourceSection.sync_key,
            target_section_number: targetSection?.section_number ?? null,
            target_id: null,
            fields: {
              module_type: 'workshop', name: sourceModule.name,
              ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
              settings: authoring.settings ?? {}
            },
            effects: ['content.write']
          });
          if (authoring.grading_form?.definition?.dimensions?.length > 0) {
            if (capabilitySupports(capabilities, 'workshop_form_set', ['strategy', 'definition'])) {
              addAction(actions, {
                kind: 'workshop_form.set', source_key: `workshop-form:${sourceModule.sync_key}`,
                parent_source_key: sourceModule.sync_key, target_module_id: null,
                fields: authoring.grading_form,
                effects: ['content.write', 'grading_configuration.write']
              });
            } else unsupported.push({ kind: 'workshop_form.set', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
          }
          continue;
        }
        const moduleUpdates = changedFields(sourceModule, targetModule, ['name', 'visible']);
        if (Object.keys(moduleUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'module_update', Object.keys(moduleUpdates))) {
            addAction(actions, {
              kind: 'module.update', entity_namespace: 'modules', source_key: sourceModule.sync_key,
              target_id: targetModule.source_id, fields: moduleUpdates,
              expected_target_digest: contentDigest(targetModule), effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(authoring.settings ?? {}) !== contentDigest(targetModule.authoring?.settings ?? {})) {
          unsupported.push({ kind: 'workshop.settings_update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(authoring.grading_form ?? null)
          !== contentDigest(targetModule.authoring?.grading_form ?? null)) {
          unsupported.push({
            kind: 'workshop.grading_definition_update', source_key: sourceModule.sync_key,
            reason: 'existing_grading_definition_protected'
          });
        }
        continue;
      }
      if (['resource', 'folder'].includes(sourceModule.module_type)) {
        if (sourceModule.authoring_completeness !== 'complete') {
          unsupported.push({
            kind: 'module.authoring', source_key: sourceModule.sync_key,
            module_type: sourceModule.module_type, reason: 'source_authoring_unavailable'
          });
          continue;
        }
        const authoring = sourceModule.authoring ?? {};
        const assets = authoring.files ?? [];
        if (sourceModule.module_type === 'resource' && assets.length !== 1) {
          unsupported.push({ kind: 'resource.assets', source_key: sourceModule.sync_key, reason: 'resource_requires_exactly_one_file' });
          continue;
        }
        const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
        const targetSection = targetSectionByMapping(target, mapping, sourceSection);
        if (!targetModule) {
          const parentWillBeCreated = actions.some((action) =>
            action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
          if (!targetSection && !parentWillBeCreated) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
            continue;
          }
          if (!capabilitySupports(capabilities, 'module_create', ['module_type', 'name', 'visible', 'settings'])
            || !capabilitySupports(capabilities, 'module_asset_stage', ['filename', 'filepath', 'filesize', 'content_hash'])) {
            unsupported.push({ kind: `${sourceModule.module_type}.create`, source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
            continue;
          }
          const stageSourceKey = `draft:${sourceModule.sync_key}`;
          addAction(actions, {
            kind: 'module_asset.stage', entity_namespace: 'drafts', source_key: stageSourceKey,
            assets, effects: ['file.read', 'file.write']
          });
          addAction(actions, {
            kind: 'module.create', entity_namespace: 'modules', source_key: sourceModule.sync_key,
            parent_source_key: sourceSection.sync_key,
            target_section_number: targetSection?.section_number ?? null,
            target_id: null,
            asset_stage_source_key: stageSourceKey,
            expected_assets: assets,
            fields: {
              module_type: sourceModule.module_type,
              name: sourceModule.name,
              ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
              settings: authoring.settings ?? {}
            },
            effects: ['content.write', 'file.write']
          });
          continue;
        }
        const moduleUpdates = changedFields(sourceModule, targetModule, ['name', 'visible']);
        if (Object.keys(moduleUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'module_update', Object.keys(moduleUpdates))) {
            addAction(actions, {
              kind: 'module.update', entity_namespace: 'modules', source_key: sourceModule.sync_key,
              target_id: targetModule.source_id, fields: moduleUpdates,
              expected_target_digest: contentDigest(targetModule), effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        const targetAssets = targetModule.authoring?.files ?? [];
        const assetsMatch = assets.length === targetAssets.length && assets.every((asset) =>
          targetAssets.some((targetAsset) => asset.filepath === targetAsset.filepath
            && asset.filename === targetAsset.filename
            && asset.sha256 && asset.sha256 === targetAsset.sha256));
        const settingsMatch = contentDigest(authoring.settings ?? {})
          === contentDigest(targetModule.authoring?.settings ?? {});
        if (sourceModule.module_type === 'resource' && (!assetsMatch || !settingsMatch)) {
          if (capabilitySupports(capabilities, 'resource_asset_replace', ['filename', 'filepath', 'filesize', 'content_hash'])) {
            const sourceAsset = assets[0];
            const formats = { 1: 'html', 2: 'plain' };
            const introFormat = formats[Number(authoring.settings?.intro_format ?? 1)];
            if (!introFormat) {
              unsupported.push({ kind: 'resource.content_format', source_key: sourceModule.sync_key, reason: 'destination_format_not_representable' });
              continue;
            }
            addAction(actions, {
              kind: 'resource_asset.replace', source_key: `asset:${sourceModule.sync_key}`,
              target_id: targetModule.source_id, asset: sourceAsset,
              expected_assets: assets,
              expected_target_digest: contentDigest({ ...targetModule, ...moduleUpdates }),
              fields: {
                name: sourceModule.name,
                intro: String(authoring.settings?.intro ?? ''),
                intro_format: introFormat
              },
              effects: ['file.read', 'file.write', 'content.write']
            });
          } else unsupported.push({ kind: 'resource_asset.replace', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        } else if (sourceModule.module_type === 'folder' && (!assetsMatch || !settingsMatch)) {
          unsupported.push({ kind: 'folder.content_update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        continue;
      }
      if (sourceModule.module_type === 'page') {
        if (sourceModule.authoring_completeness !== 'complete') {
          unsupported.push({ kind: 'module.authoring', source_key: sourceModule.sync_key, module_type: 'page', reason: 'source_authoring_unavailable' });
          continue;
        }
        const authoring = sourceModule.authoring ?? {};
        const settings = authoring.settings ?? {};
        const assets = authoring.files ?? [];
        if (![1, 2, 'html', 'plain'].includes(settings.content_format ?? 1)) {
          unsupported.push({ kind: 'page.content_format', source_key: sourceModule.sync_key, reason: 'destination_format_not_representable' });
          continue;
        }
        if (authoredContentHasFiles(settings.content) && assets.length === 0) {
          unsupported.push({ kind: 'module.assets', source_key: sourceModule.sync_key, module_type: 'page', reason: 'native_editor_asset_manifest_incomplete' });
          continue;
        }
        if (containsSourceSiteReference(settings.content, source.site.site_url)) {
          unsupported.push({ kind: 'module.internal_links', source_key: sourceModule.sync_key, reason: 'internal_link_mapping_unavailable' });
          continue;
        }
        const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
        const targetSection = targetSectionByMapping(target, mapping, sourceSection);
        if (!targetModule) {
          const parentWillBeCreated = actions.some((action) =>
            action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
          if (!targetSection && !parentWillBeCreated) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
            continue;
          }
          if (!capabilitySupports(capabilities, 'module_create', ['module_type', 'name', 'visible', 'settings'])
            || (assets.length > 0
              && !capabilitySupports(capabilities, 'module_asset_stage', ['filename', 'filepath', 'filesize', 'content_hash']))) {
            unsupported.push({ kind: 'page.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
            continue;
          }
          let stageSourceKey = null;
          if (assets.length > 0) {
            stageSourceKey = `draft:${sourceModule.sync_key}`;
            addAction(actions, {
              kind: 'module_asset.stage', entity_namespace: 'drafts', source_key: stageSourceKey,
              assets, effects: ['file.read', 'file.write']
            });
          }
          addAction(actions, {
            kind: 'module.create', entity_namespace: 'modules', source_key: sourceModule.sync_key,
            parent_source_key: sourceSection.sync_key,
            target_section_number: targetSection?.section_number ?? null,
            target_id: null,
            ...(stageSourceKey ? { asset_stage_source_key: stageSourceKey, expected_assets: assets } : {}),
            fields: {
              module_type: 'page', name: sourceModule.name,
              ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
              settings
            },
            effects: assets.length > 0 ? ['content.write', 'file.write'] : ['content.write']
          });
          continue;
        }
        const visibilityUpdates = changedFields(sourceModule, targetModule, ['visible']);
        if (Object.keys(visibilityUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'module_update', Object.keys(visibilityUpdates))) {
            addAction(actions, {
              kind: 'module.update', entity_namespace: 'modules', source_key: sourceModule.sync_key,
              target_id: targetModule.source_id, fields: visibilityUpdates,
              expected_target_digest: contentDigest(targetModule), effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        const targetAssets = targetModule.authoring?.files ?? [];
        const assetsMatch = assets.every((asset) => targetAssets.some((targetAsset) =>
          asset.filepath === targetAsset.filepath && asset.filename === targetAsset.filename
          && asset.sha256 && asset.sha256 === targetAsset.sha256));
        const targetOnlyAssets = targetAssets.filter((targetAsset) => !assets.some((asset) =>
          asset.filepath === targetAsset.filepath && asset.filename === targetAsset.filename));
        if (targetOnlyAssets.length > 0) {
          divergences.push({
            kind: 'page.assets', source_key: sourceModule.sync_key, field: 'files',
            reason: 'target_only_files_preserved',
            target_files: targetOnlyAssets.map((file) => ({ filepath: file.filepath, filename: file.filename }))
          });
        }
        const contentChanged = sourceModule.name !== targetModule.name
          || contentDigest(settings) !== contentDigest(targetModule.authoring?.settings ?? {})
          || !assetsMatch;
        if (contentChanged) {
          const fields = { name: sourceModule.name, ...settings };
          if (!capabilitySupports(capabilities, 'page_content_update', Object.keys(fields))
            || (!assetsMatch
              && !capabilitySupports(capabilities, 'module_asset_stage', ['filename', 'filepath', 'filesize', 'content_hash']))) {
            unsupported.push({ kind: 'page.content_update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
            continue;
          }
          let stageSourceKey = null;
          if (!assetsMatch && assets.length > 0) {
            stageSourceKey = `draft:${sourceModule.sync_key}`;
            addAction(actions, {
              kind: 'module_asset.stage', entity_namespace: 'drafts', source_key: stageSourceKey,
              assets, effects: ['file.read', 'file.write']
            });
          }
          addAction(actions, {
            kind: 'page_content.update', source_key: sourceModule.sync_key,
            target_id: targetModule.source_id,
            ...(stageSourceKey ? { asset_stage_source_key: stageSourceKey, expected_assets: assets } : {}),
            fields,
            expected_target_digest: contentDigest({ ...targetModule, ...visibilityUpdates }),
            effects: stageSourceKey ? ['content.write', 'file.write'] : ['content.write']
          });
        }
        continue;
      }
      if (['label', 'url'].includes(sourceModule.module_type)) {
        if (sourceModule.authoring_completeness !== 'complete') {
          unsupported.push({ kind: 'module.authoring', source_key: sourceModule.sync_key, module_type: sourceModule.module_type, reason: 'source_authoring_unavailable' });
          continue;
        }
        const settings = sourceModule.authoring?.settings ?? {};
        if (authoredContentHasFiles(settings.content ?? settings.intro ?? '')) {
          unsupported.push({ kind: 'module.assets', source_key: sourceModule.sync_key, module_type: sourceModule.module_type, reason: 'native_editor_asset_manifest_incomplete' });
          continue;
        }
        if (containsSourceSiteReference(settings.content ?? settings.intro ?? '', source.site.site_url)) {
          unsupported.push({ kind: 'module.internal_links', source_key: sourceModule.sync_key, reason: 'internal_link_mapping_unavailable' });
          continue;
        }
        const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
        const targetSection = targetSectionByMapping(target, mapping, sourceSection);
        if (!targetModule) {
          const parentWillBeCreated = actions.some((action) =>
            action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
          if (!targetSection && !parentWillBeCreated) {
            unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
            continue;
          }
          const moduleFields = {
            module_type: sourceModule.module_type,
            name: sourceModule.name,
            ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
            settings
          };
          if (capabilitySupports(capabilities, 'module_create', Object.keys(moduleFields))) {
            addAction(actions, {
              kind: 'module.create',
              entity_namespace: 'modules',
              source_key: sourceModule.sync_key,
              parent_source_key: sourceSection.sync_key,
              target_section_number: targetSection?.section_number ?? null,
              target_id: null,
              fields: moduleFields,
              effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
          continue;
        }
        const moduleUpdates = changedFields(sourceModule, targetModule, ['name', 'visible']);
        if (Object.keys(moduleUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'module_update', Object.keys(moduleUpdates))) {
            addAction(actions, {
              kind: 'module.update', entity_namespace: 'modules', source_key: sourceModule.sync_key,
              target_id: targetModule.source_id, fields: moduleUpdates,
              expected_target_digest: contentDigest(targetModule), effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(settings) !== contentDigest(targetModule.authoring?.settings ?? {})) {
          unsupported.push({ kind: `${sourceModule.module_type}.content_update`, source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        continue;
      }
      if (sourceModule.module_type !== 'book' || sourceModule.authoring_completeness !== 'complete') {
        unsupported.push({
          kind: 'module.authoring',
          source_key: sourceModule.sync_key,
          module_type: sourceModule.module_type,
          reason: sourceModule.module_type === 'book'
            ? 'source_authoring_unavailable'
            : 'module_type_not_implemented'
        });
        continue;
      }
      const chapters = sourceModule.authoring?.chapters ?? [];
      if (chapters.some((chapter) => authoredContentHasFiles(chapter.content) && (chapter.files ?? []).length === 0)) {
        unsupported.push({
          kind: 'book.assets',
          source_key: sourceModule.sync_key,
          reason: 'native_editor_asset_manifest_incomplete'
        });
        continue;
      }
      if (chapters.some((chapter) => containsSourceSiteReference(chapter.content, source.site.site_url))) {
        unsupported.push({ kind: 'book.internal_links', source_key: sourceModule.sync_key, reason: 'internal_link_mapping_unavailable' });
        continue;
      }
      const hasAssets = chapters.some((chapter) => (chapter.files ?? []).length > 0);
      if (hasAssets
        && !capabilitySupports(capabilities, 'book_asset_transfer', ['filename', 'filepath', 'filesize', 'content_hash', 'content'])) {
        unsupported.push({ kind: 'book.assets', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        continue;
      }
      const targetModule = targetEntityByMapping(targetModules, mapping, 'modules', sourceModule);
      const targetSection = targetSectionByMapping(target, mapping, sourceSection);
      const requiresChapterCreate = chapters.some((chapter, chapterIndex) => {
        const sourceChapterId = Number(chapter.chapter_id ?? 0);
        const sourceKey = `chapter:${sourceChapterId || `${sourceModule.sync_key}:${chapterIndex}`}`;
        return mapping?.chapters?.[sourceKey] === undefined;
      });
      if (requiresChapterCreate
        && !capabilitySupports(capabilities, 'book_chapter_create', ['title', 'content', 'content_format', 'subchapter', 'hidden', 'order'])) {
        unsupported.push({ kind: 'book_chapter.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        continue;
      }
      if (!targetModule) {
        const parentWillBeCreated = actions.some((action) =>
          action.kind === 'section.create' && action.source_key === sourceSection.sync_key);
        if (!targetSection && !parentWillBeCreated) {
          unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_section_unresolved' });
          continue;
        }
        const moduleFields = {
          module_type: 'book',
          name: sourceModule.name,
          ...(sourceModule.visible === null ? {} : { visible: sourceModule.visible }),
          settings: sourceModule.authoring?.settings ?? {}
        };
        if (!capabilitySupports(capabilities, 'module_create', Object.keys(moduleFields))) {
          unsupported.push({ kind: 'module.create', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
          continue;
        }
        addAction(actions, {
          kind: 'module.create',
          entity_namespace: 'modules',
          source_key: sourceModule.sync_key,
          parent_source_key: sourceSection.sync_key,
          target_section_number: targetSection?.section_number ?? null,
          target_id: null,
          fields: moduleFields,
          effects: ['content.write']
        });
      } else {
        const moduleUpdates = changedFields(sourceModule, targetModule, ['name', 'visible']);
        if (Object.keys(moduleUpdates).length > 0) {
          if (capabilitySupports(capabilities, 'module_update', Object.keys(moduleUpdates))) {
            addAction(actions, {
              kind: 'module.update',
              entity_namespace: 'modules',
              source_key: sourceModule.sync_key,
              target_id: targetModule.source_id,
              fields: moduleUpdates,
              expected_target_digest: contentDigest(targetModule),
              effects: ['content.write']
            });
          } else unsupported.push({ kind: 'module.update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
        if (contentDigest(sourceModule.authoring?.settings ?? {}) !== contentDigest(targetModule.authoring?.settings ?? {})) {
          unsupported.push({ kind: 'book.settings_update', source_key: sourceModule.sync_key, reason: 'target_capability_unavailable' });
        }
      }
      const targetChapters = targetModule?.authoring?.chapters ?? [];
      let previousSourceKey = null;
      for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex += 1) {
        const sourceChapter = chapters[chapterIndex];
        const sourceChapterId = Number(sourceChapter.chapter_id ?? 0);
        const sourceKey = `chapter:${sourceChapterId || `${sourceModule.sync_key}:${chapterIndex}`}`;
        const mappedId = mapping?.chapters?.[sourceKey];
        const targetChapter = mappedId === undefined
          ? null
          : targetChapters.find((chapter) => Number(chapter.chapter_id) === Number(mappedId));
        const fields = {
          title: String(sourceChapter.title ?? ''),
          content: String(sourceChapter.content ?? ''),
          content_format: Number(sourceChapter.content_format ?? 1),
          subchapter: Boolean(sourceChapter.subchapter),
          hidden: Boolean(sourceChapter.hidden),
          order: chapterIndex
        };
        if (!targetChapter) {
          if (!capabilitySupports(capabilities, 'book_chapter_create', Object.keys(fields))) {
            unsupported.push({ kind: 'book_chapter.create', source_key: sourceKey, reason: 'target_capability_unavailable' });
            continue;
          }
          addAction(actions, {
            kind: 'book_chapter.create',
            entity_namespace: 'chapters',
            source_key: sourceKey,
            parent_source_key: sourceModule.sync_key,
            after_source_key: previousSourceKey,
            target_module_id: targetModule?.source_id ?? null,
            target_id: null,
            fields,
            effects: ['content.write']
          });
        } else {
          const updates = changedFields(fields, {
            title: targetChapter.title,
            content: targetChapter.content,
            content_format: Number(targetChapter.content_format ?? 1),
            subchapter: Boolean(targetChapter.subchapter),
            hidden: Boolean(targetChapter.hidden),
            order: Number(targetChapter.page_number ?? chapterIndex) - 1
          }, Object.keys(fields));
          if (Object.keys(updates).length > 0) {
            if (capabilitySupports(capabilities, 'book_chapter_update', Object.keys(updates))) {
              addAction(actions, {
                kind: 'book_chapter.update',
                entity_namespace: 'chapters',
                source_key: sourceKey,
                parent_source_key: sourceModule.sync_key,
                target_module_id: targetModule.source_id,
                target_id: targetChapter.chapter_id,
                fields: updates,
                expected_target_digest: contentDigest(targetChapter),
                effects: ['content.write']
              });
            } else unsupported.push({ kind: 'book_chapter.update', source_key: sourceKey, reason: 'target_capability_unavailable' });
          }
        }
        const sourceFiles = sourceChapter.files ?? [];
        const targetFiles = targetChapter?.files ?? [];
        const filesMatch = sourceFiles.every((asset) => targetFiles.some((targetFile) =>
            String(targetFile.filepath ?? '/') === String(asset.filepath ?? '/')
            && String(targetFile.filename) === String(asset.filename)
            && String(targetFile.content_hash ?? '') === String(asset.content_hash ?? '')));
        const targetOnlyFiles = targetFiles.filter((targetFile) => !sourceFiles.some((asset) =>
          String(targetFile.filepath ?? '/') === String(asset.filepath ?? '/')
          && String(targetFile.filename) === String(asset.filename)));
        if (targetOnlyFiles.length > 0) {
          divergences.push({
            kind: 'book.assets',
            source_key: sourceKey,
            field: 'files',
            reason: 'target_only_files_preserved',
            target_files: targetOnlyFiles.map((file) => ({
              filepath: String(file.filepath ?? '/'),
              filename: String(file.filename ?? '')
            }))
          });
        }
        if (sourceFiles.length > 0 && !filesMatch) {
          addAction(actions, {
            kind: 'book_asset.transfer',
            source_key: `assets:${sourceKey}`,
            parent_source_key: sourceKey,
            parent_module_source_key: sourceModule.sync_key,
            target_module_id: targetModule?.source_id ?? null,
            target_chapter_id: targetChapter?.chapter_id ?? null,
            assets: sourceFiles.map((asset) => ({
              filename: String(asset.filename),
              filepath: String(asset.filepath ?? '/'),
              filesize: Number(asset.filesize ?? 0),
              mimetype: String(asset.mimetype ?? ''),
              content_hash: String(asset.content_hash ?? ''),
              sha256: String(asset.sha256 ?? ''),
              url: String(asset.url)
            })),
            content: fields.content,
            content_format: fields.content_format,
            effects: ['file.read', 'file.write', 'content.write']
          });
        }
        previousSourceKey = sourceKey;
      }
    }
  }
  const skipped = [];
  if (unsupportedPolicy === 'skip') {
    const skippedKeys = new Set(unsupported.map((entry) => entry.source_key).filter(Boolean));
    let changed = true;
    while (changed) {
      changed = false;
      for (const action of actions) {
        if (skippedKeys.has(action.source_key)
          || skippedKeys.has(action.parent_source_key)
          || skippedKeys.has(action.group_source_key)
          || skippedKeys.has(action.grouping_source_key)) {
          if (!skippedKeys.has(action.source_key)) {
            skippedKeys.add(action.source_key);
            changed = true;
          }
        }
      }
    }
    for (let index = actions.length - 1; index >= 0; index -= 1) {
      const action = actions[index];
      if (skippedKeys.has(action.source_key)
        || skippedKeys.has(action.parent_source_key)
        || skippedKeys.has(action.group_source_key)
        || skippedKeys.has(action.grouping_source_key)) {
        skipped.unshift({
          kind: action.kind,
          source_key: action.source_key,
          reason: 'depends_on_skipped_or_unsupported_entity'
        });
        actions.splice(index, 1);
      }
    }
  }
  for (const action of actions) {
    const capabilityName = action.kind.replaceAll('.', '_');
    const selectedProvider = capabilities[capabilityName]?.provider;
    if (selectedProvider) action.provider = selectedProvider;
    const { action_id: ignoredActionId, ...actionIdentity } = action;
    action.action_id = actionId(actionIdentity);
  }
  for (const action of actions) {
    const dependencySourceKeys = [
      action.parent_source_key,
      action.after_source_key,
      action.asset_stage_source_key,
      action.group_source_key,
      action.grouping_source_key
    ].filter(Boolean);
    action.depends_on = [...new Set(actions
      .filter((candidate) => candidate.action_id !== action.action_id
        && dependencySourceKeys.includes(candidate.source_key)
        && (candidate.kind.endsWith('.create') || candidate.kind === 'module_asset.stage'))
      .map((candidate) => candidate.action_id))].sort();
  }
  const selectedEntityKeys = [
    `course:${source.course.source_id}`,
    ...source.sections.map((section) => section.sync_key),
    ...source.sections.flatMap((section) => section.modules.map((module) => module.sync_key)),
    ...source.groups.map((group) => group.sync_key),
    ...source.groupings.map((grouping) => grouping.sync_key),
    ...source.sections.flatMap((section) => section.modules.flatMap((module) =>
      (module.authoring?.chapters ?? []).map((chapter, index) =>
        `chapter:${Number(chapter.chapter_id ?? 0) || `${module.sync_key}:${index}`}`)))
  ];
  const changedEntityKeys = new Set(actions.flatMap((action) => [
    action.source_key,
    action.parent_source_key,
    action.parent_module_source_key,
    action.group_source_key,
    action.grouping_source_key
  ].filter(Boolean)));
  const unchanged = selectedEntityKeys
    .filter((sourceKey) => !changedEntityKeys.has(sourceKey))
    .map((sourceKey) => ({ source_key: sourceKey }));
  const actionSummary = {
    creates: actions.filter((action) => action.kind.endsWith('.create')).length,
    updates: actions.filter((action) => action.kind.endsWith('.update') || action.kind.endsWith('.set')).length,
    moves: actions.filter((action) => action.kind.endsWith('.move')).length,
    asset_transfers: actions.filter((action) =>
      action.kind.includes('asset') || action.kind === 'module_asset.stage').length,
    deletes: actions.filter((action) => action.kind.endsWith('.delete')).length,
    unchanged: unchanged.length,
    dependency_edges: actions.reduce((total, action) => total + action.depends_on.length, 0),
    estimated_transfer_bytes: actions.reduce((total, action) => total
      + (action.assets ?? []).reduce((sum, asset) => sum + Number(asset.filesize ?? 0), 0)
      + Number(action.asset?.filesize ?? 0), 0),
    effect_scope: [...new Set(actions.flatMap((action) => action.effects ?? []))].sort()
  };
  const now = new Date();
  const semantic = canonicalize({
    schema_version: 2,
    contract_versions: { sync_model: 2, sync_plan: 2 },
    binding_id: courseBindingId(source, target),
    source: { site: source.site, course_id: source.course.source_id, digest: source.digest },
    target: {
      site: target.site,
      course_id: target.course.source_id,
      digest: target.digest,
      ...(targetCreation ? { creation: targetCreation } : {})
    },
    capability_snapshot: canonicalize(capabilities),
    entity_mapping_snapshot: canonicalize(mapping),
    policies: { unsupported: unsupportedPolicy, conflict: conflictPolicy },
    actions,
    action_summary: actionSummary,
    conflicts,
    divergences,
    unsupported,
    skipped,
    unchanged,
    unknown: [
      ...(source.unknowns ?? []).map((entry) => ({ side: 'source', ...entry })),
      ...(target.unknowns ?? []).map((entry) => ({ side: 'target', ...entry }))
    ],
    applicable: (!['abort', 'report'].includes(conflictPolicy) || conflicts.length === 0)
      && (unsupportedPolicy === 'skip'
        || unsupported.length === 0
        || (unsupportedPolicy === 'degrade' && unsupported.every((entry) => entry.degradable === true)))
  });
  const planWithoutDigest = canonicalize({
    schema_version: 2,
    plan_id: randomUUID(),
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + expiresInMs).toISOString(),
    semantic_digest: contentDigest(semantic),
    ...semantic
  });
  return { ...planWithoutDigest, digest: contentDigest(planWithoutDigest) };
}

export function validateSyncPlan(plan) {
  if (!plan || plan.schema_version !== 2 || typeof plan.plan_id !== 'string') {
    throw new TypeError('Sync plan is invalid.');
  }
  const { digest, ...unsigned } = plan;
  if (contentDigest(unsigned) !== digest) throw new TypeError('Sync plan digest does not match its contents.');
  if (Date.parse(plan.expires_at) <= Date.now()) throw new TypeError('Sync plan has expired.');
  return plan;
}
