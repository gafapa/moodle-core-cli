// This file is generated from contract/operations.json.
// Run npm run types:generate after changing the canonical operation contract.

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject { [key: string]: JsonValue; }

export type MoodleOperationName = "get_site_info" | "get_courses" | "get_course" | "create_course" | "update_course" | "delete_course" | "get_course_contents" | "get_users_by_field" | "create_user" | "update_user" | "delete_user" | "enrol_user" | "unenrol_user" | "get_course_groups" | "create_group" | "delete_group" | "add_group_member" | "remove_group_member" | "get_course_categories" | "get_course_category" | "get_enrolled_users" | "get_cohorts" | "get_group_members" | "get_course_groupings" | "get_activity_completion_statuses" | "get_course_completion_status" | "get_calendar_events" | "get_grade_items" | "create_course_category" | "update_course_category" | "delete_course_category" | "get_group" | "update_group" | "create_grouping" | "get_grouping" | "update_grouping" | "delete_grouping" | "add_group_to_grouping" | "remove_group_from_grouping" | "create_cohort" | "update_cohort" | "delete_cohort" | "get_cohort_members" | "search_cohorts" | "add_cohort_member" | "remove_cohort_member" | "assign_role" | "unassign_role" | "get_user_courses" | "get_course_enrolment_methods" | "get_enrolled_users_with_capability" | "search_enrolled_users" | "get_potential_enrolment_users" | "get_self_enrolment_info" | "self_enrol" | "update_user_enrolment" | "delete_user_enrolment" | "get_grades_table" | "get_user_course_grades" | "get_grade_access_information" | "get_gradebook_items" | "get_grade_tree" | "get_gradable_users" | "get_grade_feedback" | "create_grade_category" | "update_grade_value" | "set_activity_completion_status" | "override_activity_completion_status" | "mark_course_self_completed" | "upload_draft_file" | "download_file" | "get_course_assignments" | "get_assignment_submissions" | "get_assignment_grades" | "get_assignment_submission_status" | "get_assignment_participants" | "get_assignment_participant" | "start_assignment_submission" | "save_assignment_submission" | "submit_assignment_for_grading" | "save_assignment_grade" | "set_assignment_user_flags" | "get_assignment_user_flags" | "get_assignment_user_mappings" | "lock_assignment_submissions" | "unlock_assignment_submissions" | "revert_assignment_submissions_to_draft" | "set_assignment_extension" | "reveal_assignment_identities" | "copy_previous_assignment_attempt" | "remove_assignment_submission" | "view_assignment" | "view_assignment_submission_status" | "view_assignment_grading_table" | "get_course_forums" | "get_forum_discussions" | "get_forum_discussion_posts" | "get_forum_post" | "get_forum_posts_by_user" | "get_forum_access_information" | "can_add_forum_discussion" | "create_forum_discussion" | "reply_to_forum_post" | "update_forum_post" | "delete_forum_post" | "prepare_forum_post_draft" | "set_forum_subscription" | "set_forum_tracking" | "set_forum_discussion_subscription" | "set_forum_discussion_favourite" | "set_forum_discussion_pin" | "set_forum_discussion_lock" | "mark_forum_posts_read" | "view_forum" | "view_forum_discussion" | "get_course_quizzes" | "get_user_quiz_attempts" | "get_user_quiz_best_grade" | "get_quiz_review_options" | "start_quiz_attempt" | "get_quiz_attempt_data" | "get_quiz_attempt_summary" | "save_quiz_attempt" | "process_quiz_attempt" | "get_quiz_attempt_review" | "get_quiz_feedback_for_grade" | "get_quiz_access_information" | "get_quiz_attempt_access_information" | "get_quiz_required_question_types" | "view_quiz" | "view_quiz_attempt" | "view_quiz_attempt_summary" | "view_quiz_attempt_review" | "get_course_books" | "view_book" | "get_course_folders" | "view_folder" | "get_course_imscp_packages" | "view_imscp_package" | "get_course_labels" | "get_course_pages" | "view_page" | "get_course_resources" | "view_resource" | "get_course_urls" | "view_url" | "get_course_choices" | "get_choice_options" | "get_choice_results" | "submit_choice_response" | "delete_choice_responses" | "view_choice" | "get_course_scorm_packages" | "get_scorm_attempt_count" | "get_scorm_contents" | "get_scorm_user_data" | "save_scorm_tracks" | "get_scorm_tracks" | "launch_scorm_content" | "get_scorm_access_information" | "view_scorm" | "get_course_wikis" | "get_wiki_subwikis" | "get_wiki_pages" | "get_wiki_files" | "get_wiki_page" | "get_wiki_page_for_editing" | "create_wiki_page" | "update_wiki_page" | "view_wiki" | "view_wiki_page" | "get_course_feedbacks" | "get_feedback_access_information" | "get_feedback_temporary_completion" | "get_feedback_items" | "launch_feedback" | "get_feedback_page" | "submit_feedback_page" | "get_feedback_analysis" | "get_unfinished_feedback_responses" | "get_finished_feedback_responses" | "get_feedback_non_respondents" | "get_feedback_responses_analysis" | "get_last_feedback_completion" | "reorder_feedback_questions" | "view_feedback" | "get_course_h5p_activities" | "get_h5p_access_information" | "get_h5p_attempts" | "get_h5p_results" | "get_h5p_user_attempts" | "log_h5p_report_view" | "view_h5p_activity" | "get_course_databases" | "get_database_access_information" | "get_database_entries" | "get_database_entry" | "get_database_fields" | "search_database_entries" | "approve_database_entry" | "delete_database_entry" | "create_database_entry" | "update_database_entry" | "delete_database_presets" | "get_database_preset_mapping" | "view_database" | "get_course_glossaries" | "get_glossary_entries_by_letter" | "get_glossary_entries_by_date" | "get_glossary_categories" | "get_glossary_entries_by_category" | "get_glossary_authors" | "get_glossary_entries_by_author_letter" | "get_glossary_entries_by_author" | "search_glossary_entries" | "get_glossary_entries_by_term" | "get_glossary_entries_to_approve" | "get_glossary_entry" | "create_glossary_entry" | "update_glossary_entry" | "delete_glossary_entry" | "prepare_glossary_entry" | "view_glossary" | "view_glossary_entry" | "get_course_bigbluebutton_activities" | "can_join_bigbluebutton" | "get_bigbluebutton_join_url" | "get_bigbluebutton_recordings" | "get_bigbluebutton_recordings_to_import" | "update_bigbluebutton_recording" | "end_bigbluebutton_meeting" | "validate_bigbluebutton_completion" | "get_bigbluebutton_meeting_information" | "view_bigbluebutton" | "get_course_lessons" | "get_lesson" | "get_lesson_access_information" | "get_lesson_question_attempts" | "get_lesson_user_grade" | "get_lesson_attempt_grade" | "get_lesson_content_pages_viewed" | "get_lesson_user_timers" | "get_lesson_pages" | "launch_lesson_attempt" | "get_lesson_page" | "submit_lesson_page" | "finish_lesson_attempt" | "get_lesson_attempts_overview" | "get_lesson_user_attempt" | "get_lesson_possible_jumps" | "view_lesson" | "get_course_lti_tools" | "get_lti_launch_data" | "get_lti_tool_proxies" | "create_lti_tool_proxy" | "delete_lti_tool_proxy" | "get_lti_proxy_registration_request" | "get_lti_tool_types" | "get_lti_tool_types_and_proxies" | "count_lti_tool_types_and_proxies" | "create_lti_tool_type" | "update_lti_tool_type" | "delete_lti_tool_type" | "delete_course_lti_tool_type" | "set_lti_tool_activity_chooser_visibility" | "is_lti_cartridge" | "view_lti" | "get_course_workshops" | "get_workshop_access_information" | "get_workshop_user_plan" | "create_workshop_submission" | "update_workshop_submission" | "delete_workshop_submission" | "get_workshop_submissions" | "get_workshop_submission" | "get_workshop_submission_assessments" | "get_workshop_assessment" | "get_workshop_assessment_form" | "get_workshop_reviewer_assessments" | "update_workshop_assessment" | "get_workshop_grades" | "evaluate_workshop_assessment" | "get_workshop_grades_report" | "evaluate_workshop_submission" | "view_workshop" | "view_workshop_submission" | "save_assignment_grades" | "submit_assignment_grading_form" | "get_user_quiz_attempts_legacy" | "set_quiz_question_version" | "reopen_quiz_attempt" | "get_reopen_quiz_attempt_confirmation" | "add_quiz_random_questions" | "update_quiz_random_question_filter" | "save_quiz_overrides" | "delete_quiz_overrides" | "get_quiz_overrides" | "create_quiz_grade_items" | "delete_quiz_grade_items" | "update_quiz_grade_items" | "update_quiz_slots" | "get_quiz_grading_setup" | "create_quiz_grade_item_per_section" | "get_calendar_month" | "get_calendar_day" | "get_calendar_upcoming" | "move_calendar_event" | "create_calendar_events" | "delete_calendar_events" | "get_action_events_by_time" | "get_course_action_events" | "get_courses_action_events" | "get_calendar_event" | "submit_calendar_event_form" | "get_calendar_access_information" | "get_allowed_calendar_event_types" | "get_calendar_export_token" | "get_badge" | "get_user_badges" | "get_user_badge_by_hash" | "get_blog_entries" | "view_blog_entries" | "get_blog_access_information" | "create_blog_entry" | "update_blog_entry" | "delete_blog_entry" | "prepare_blog_entry" | "get_comments" | "create_comments" | "delete_comments" | "create_notes" | "delete_notes" | "get_course_notes" | "view_notes" | "get_item_ratings" | "rate_item" | "get_activity_allowed_groups" | "get_activity_group_mode" | "get_user_course_groups" | "get_groups_for_selector" | "get_recently_accessed_items" | "get_starred_courses" | "view_personal_page" | "update_question_flag" | "browse_files" | "delete_draft_files" | "get_unused_draft_area" | "get_user_preferences" | "get_private_files_information" | "view_course_user_list" | "view_user_profile" | "agree_site_policy" | "add_private_files" | "update_user_picture" | "remove_user_device" | "search_site" | "get_top_search_results" | "get_search_areas" | "view_search_results" | "get_tag_areas" | "get_tag_collections" | "get_tag_cloud" | "get_tag_index" | "get_tag_index_by_area" | "get_course_module" | "get_course_module_by_instance" | "view_course" | "search_courses" | "get_course_navigation_options" | "get_course_administration_options" | "get_course_updates" | "get_timeline_courses" | "set_favourite_courses" | "get_recent_courses" | "check_course_updates" | "get_timeline_courses_with_events" | "view_module_instance_list" | "get_course_overview" | "view_course_overview" | "get_available_filters" | "get_all_filter_states" | "get_component_strings" | "get_fontawesome_icon_map" | "get_trusted_h5p_file" | "is_push_notification_system_configured" | "get_push_preference_statuses" | "get_user_push_devices" | "set_push_device_enabled" | "get_popup_notifications" | "get_unread_popup_notification_count" | "get_guest_enrolment_information" | "validate_guest_enrolment_password" | "register_user_device" | "update_user_device_public_key" | "get_course_user_profiles" | "set_user_preferences" | "update_user_preferences" | "prepare_private_files" | "update_private_files" | "get_xapi_state" | "get_xapi_states" | "save_xapi_state" | "delete_xapi_state" | "delete_xapi_states" | "post_xapi_statements" | "view_competency" | "delete_competency_evidence" | "get_competency_scale_values" | "grade_course_competency" | "get_course_competencies" | "view_user_competency" | "view_user_competency_in_course" | "view_user_competency_in_plan" | "view_user_competency_plan" | "get_course_blocks" | "get_dashboard_blocks" | "get_addable_blocks" | "get_grade_selector_users" | "get_grade_selector_groups" | "get_point_grading_panel" | "save_point_grading_panel" | "get_scale_grading_panel" | "save_scale_grading_panel" | "get_grader_report_users" | "get_grade_items_for_selector" | "view_grade_overview_report" | "view_user_grade_report" | "record_insight_action" | "list_custom_reports" | "get_custom_report" | "view_custom_report" | "can_view_system_report" | "get_system_report" | "get_dynamic_table" | "get_tiny_editor_configuration" | "get_tiny_premium_api_key" | "get_data_privacy_access_information" | "create_data_request" | "cancel_data_request" | "contact_data_protection_officer" | "get_data_requests" | "get_policy_acceptances" | "set_policy_acceptances" | "get_course_competencies_page" | "get_learning_plan_page" | "get_user_learning_plans_page" | "get_user_competency_summary" | "get_course_user_competency_summary" | "get_plan_user_competency_summary" | "get_user_evidence_list_page" | "get_user_evidence_page" | "send_conversation_messages" | "send_instant_messages" | "delete_message_contacts" | "mute_conversations" | "unmute_conversations" | "block_message_user" | "unblock_message_user" | "get_contact_requests" | "get_received_contact_request_count" | "get_conversation_members" | "create_contact_request" | "confirm_contact_request" | "decline_contact_request" | "search_message_users" | "search_messages" | "get_conversation_between_users" | "get_self_conversation" | "get_conversation_messages" | "get_message_contacts" | "search_message_contacts" | "get_conversations" | "get_conversation" | "get_messages" | "get_conversation_counts" | "get_unread_conversation_counts" | "get_unread_conversations_count" | "get_unread_notification_count" | "get_blocked_message_users" | "get_message_member_info" | "mark_message_read" | "mark_notification_read" | "mark_all_notifications_read" | "mark_conversation_read" | "delete_conversations" | "delete_message" | "delete_message_for_all_users" | "configure_message_processor" | "get_user_notification_preferences" | "get_user_message_preferences" | "set_favourite_conversations" | "unset_favourite_conversations" | "explain_text_with_ai" | "summarise_text_with_ai" | "generate_ai_image" | "generate_ai_text" | "get_ai_policy_status" | "set_ai_policy_status" | "get_analytics_contexts" | "get_mobile_plugins" | "get_mobile_public_config" | "get_mobile_config" | "get_mobile_autologin_key" | "get_mobile_content" | "call_mobile_external_functions" | "get_mobile_qr_login_tokens" | "validate_mobile_subscription_key" | "get_policy_version" | "search_moodlenet_courses" | "verify_moodlenet_profile" | "auth_email_get_signup_settings" | "auth_email_signup_user" | "block_accessreview_get_module_data" | "block_accessreview_get_section_data" | "admin_set_block_protection" | "admin_set_plugin_order" | "admin_set_plugin_state" | "ai_delete_provider_instance" | "ai_set_action" | "ai_set_provider_order" | "ai_set_provider_status" | "auth_confirm_user" | "auth_is_age_digital_consent_verification_enabled" | "auth_is_minor" | "auth_request_password_reset" | "auth_resend_confirmation_email" | "backup_get_async_backup_links_backup" | "backup_get_async_backup_links_restore" | "backup_get_async_backup_progress" | "backup_get_copy_progress" | "backup_submit_copy_form" | "badges_disable_badges" | "badges_enable_badges" | "calendar_delete_subscription" | "calendar_get_timestamps" | "change_editmode" | "check_get_result_admintree" | "competency_add_competency_to_course" | "competency_add_competency_to_plan" | "competency_add_competency_to_template" | "competency_add_related_competency" | "competency_approve_plan" | "competency_competency_framework_viewed" | "competency_complete_plan" | "competency_count_competencies" | "competency_count_competencies_in_course" | "competency_count_competencies_in_template" | "competency_count_competency_frameworks" | "competency_count_course_module_competencies" | "competency_count_courses_using_competency" | "competency_count_templates" | "competency_count_templates_using_competency" | "competency_create_competency" | "competency_create_competency_framework" | "competency_create_plan" | "competency_create_template" | "competency_create_user_evidence_competency" | "competency_delete_competency" | "competency_delete_competency_framework" | "competency_delete_plan" | "competency_delete_template" | "competency_delete_user_evidence" | "competency_delete_user_evidence_competency" | "competency_duplicate_competency_framework" | "competency_duplicate_template" | "competency_grade_competency" | "competency_grade_competency_in_plan" | "competency_list_competencies" | "competency_list_competencies_in_template" | "competency_list_competency_frameworks" | "competency_list_course_module_competencies" | "competency_list_plan_competencies" | "competency_list_templates" | "competency_list_templates_using_competency" | "competency_list_user_plans" | "competency_move_down_competency" | "competency_move_up_competency" | "competency_plan_cancel_review_request" | "competency_plan_request_review" | "competency_plan_start_review" | "competency_plan_stop_review" | "competency_read_competency" | "competency_read_competency_framework" | "competency_read_plan" | "competency_read_template" | "competency_read_user_evidence" | "competency_remove_competency_from_course" | "competency_remove_competency_from_plan" | "competency_remove_competency_from_template" | "competency_remove_related_competency" | "competency_reopen_plan" | "competency_reorder_course_competency" | "competency_reorder_plan_competency" | "competency_reorder_template_competency" | "competency_request_review_of_user_evidence_linked_competencies" | "competency_search_competencies" | "competency_set_course_competency_ruleoutcome" | "competency_set_parent_competency" | "competency_template_has_related_data" | "competency_template_viewed" | "competency_unapprove_plan" | "competency_unlink_plan_from_template" | "competency_update_competency" | "competency_update_competency_framework" | "competency_update_course_competency_settings" | "competency_update_plan" | "competency_update_template" | "competency_user_competency_cancel_review_request" | "competency_user_competency_request_review" | "competency_user_competency_start_review" | "competency_user_competency_stop_review" | "contentbank_copy_content" | "contentbank_delete_content" | "contentbank_rename_content" | "contentbank_set_content_visibility" | "course_add_content_item_to_user_favourites" | "course_delete_modules" | "course_duplicate_course" | "course_edit_module" | "course_edit_section" | "course_get_activity_chooser_footer" | "course_get_course_content_items" | "course_get_enrolled_users_by_cmid" | "course_get_module" | "course_import_course" | "course_remove_content_item_from_user_favourites" | "course_toggle_activity_recommendation" | "courseformat_create_module" | "courseformat_file_handlers" | "courseformat_get_section_content_items" | "courseformat_get_state" | "courseformat_new_module" | "courseformat_update_course" | "create_userfeedback_action_record" | "customfield_convert_category" | "customfield_create_category" | "customfield_delete_category" | "customfield_delete_field" | "customfield_move_category" | "customfield_move_field" | "customfield_reload_template" | "customfield_toggle_shared" | "dynamic_tabs_get_content" | "fetch_notifications" | "files_upload" | "form_dynamic_form" | "form_get_filetypes_browser_data" | "get_fragment" | "get_string" | "get_strings" | "get_user_dates" | "grading_get_definitions" | "grading_get_gradingform_instances" | "grading_save_definitions" | "message_get_message_processor" | "message_get_unsent_message" | "message_set_default_notification" | "message_set_unsent_message" | "moodlenet_auth_check" | "moodlenet_get_share_info_activity" | "moodlenet_get_shared_course_info" | "moodlenet_send_activity" | "moodlenet_send_course" | "notes_get_notes" | "notes_update_notes" | "output_load_template" | "output_load_template_with_dependencies" | "output_poll_stored_progress" | "payment_get_available_gateways" | "question_get_random_question_summaries" | "question_move_questions" | "question_search_shared_banks" | "reportbuilder_audiences_delete" | "reportbuilder_columns_add" | "reportbuilder_columns_delete" | "reportbuilder_columns_reorder" | "reportbuilder_columns_sort_get" | "reportbuilder_columns_sort_reorder" | "reportbuilder_columns_sort_toggle" | "reportbuilder_conditions_add" | "reportbuilder_conditions_delete" | "reportbuilder_conditions_reorder" | "reportbuilder_conditions_reset" | "reportbuilder_filters_add" | "reportbuilder_filters_delete" | "reportbuilder_filters_reorder" | "reportbuilder_filters_reset" | "reportbuilder_reports_delete" | "reportbuilder_reports_get" | "reportbuilder_schedules_delete" | "reportbuilder_schedules_send" | "reportbuilder_schedules_toggle" | "reportbuilder_set_filters" | "search_get_relevant_users" | "session_time_remaining" | "session_touch" | "sms_set_gateway_status" | "tag_get_tags" | "tag_update_tags" | "update_inplace_editable" | "user_get_users" | "user_search_identity" | "customfield_number_recalculate_value" | "enrol_meta_add_instances" | "enrol_meta_delete_instances" | "gradingform_guide_grader_gradingpanel_fetch" | "gradingform_guide_grader_gradingpanel_store" | "gradingform_rubric_grader_gradingpanel_fetch" | "gradingform_rubric_grader_gradingpanel_store" | "media_videojs_get_language" | "paygw_paypal_create_transaction_complete" | "paygw_paypal_get_config_for_js" | "qbank_columnsortorder_set_column_size" | "qbank_columnsortorder_set_columnbank_order" | "qbank_columnsortorder_set_hidden_columns" | "qbank_editquestion_set_status" | "qbank_managecategories_move_category" | "qbank_tagquestion_submit_tags_form" | "qbank_viewquestiontext_set_question_text_format" | "quizaccess_seb_validate_quiz_keys" | "report_competency_data_for_report" | "tiny_autosave_reset_session" | "tiny_autosave_resume_session" | "tiny_autosave_update_session" | "tiny_equation_filter" | "tiny_media_preview" | "admin_presets_delete_preset" | "behat_get_entity_generator" | "dataprivacy_approve_data_request" | "dataprivacy_bulk_approve_data_requests" | "dataprivacy_bulk_deny_data_requests" | "dataprivacy_confirm_contexts_for_deletion" | "dataprivacy_create_category_form" | "dataprivacy_create_purpose_form" | "dataprivacy_delete_category" | "dataprivacy_delete_purpose" | "dataprivacy_deny_data_request" | "dataprivacy_get_activity_options" | "dataprivacy_get_category_options" | "dataprivacy_get_data_request" | "dataprivacy_get_purpose_options" | "dataprivacy_get_users" | "dataprivacy_mark_complete" | "dataprivacy_set_context_defaults" | "dataprivacy_set_context_form" | "dataprivacy_set_contextlevel_form" | "dataprivacy_submit_selected_courses_form" | "dataprivacy_tree_extra_branches" | "lp_data_for_competencies_manage_page" | "lp_data_for_competency_frameworks_manage_page" | "lp_data_for_competency_summary" | "lp_data_for_related_competencies_section" | "lp_data_for_template_competencies_page" | "lp_data_for_templates_manage_page" | "lp_list_courses_using_competency" | "lp_search_cohorts" | "lp_search_users" | "policy_submit_accept_on_behalf" | "templatelibrary_list_templates" | "templatelibrary_load_canonical_template" | "usertours_complete_tour" | "usertours_fetch_and_start_tour" | "usertours_reset_tour" | "usertours_step_shown" | "xmldb_invoke_move_action" | "grades_get_enrolled_users_for_search_widget" | "grades_get_groups_for_search_widget" | "output_load_fontawesome_icon_map" | "mod_assign_delete_overrides" | "mod_assign_get_overrides" | "mod_assign_save_overrides" | "mod_chat_get_chat_latest_messages" | "mod_chat_get_chat_users" | "mod_chat_get_chats_by_courses" | "mod_chat_get_session_messages" | "mod_chat_get_sessions" | "mod_chat_login_user" | "mod_chat_send_chat_message" | "mod_chat_view_chat" | "mod_chat_view_sessions" | "mod_forum_set_read_state" | "mod_quiz_get_users_in_report" | "mod_survey_get_questions" | "mod_survey_get_surveys_by_courses" | "mod_survey_submit_answers" | "mod_survey_view_survey" | "report_insights_set_fixed_prediction" | "report_insights_set_notuseful_prediction";

export interface GetSiteInfoParameters {}

export interface GetCoursesParameters {
  course_ids?: number[];
}

export interface GetCourseParameters {
  course_id: number;
}

export interface CreateCourseParameters {
  fullname: string;
  shortname: string;
  category_id: number;
  idnumber?: string;
  summary?: string;
  visible?: boolean;
  start_date?: number;
  end_date?: number;
}

export interface UpdateCourseParameters {
  course_id: number;
  fullname?: string;
  shortname?: string;
  category_id?: number;
  idnumber?: string;
  summary?: string;
  visible?: boolean;
  start_date?: number;
  end_date?: number;
}

export interface DeleteCourseParameters {
  course_id: number;
}

export interface GetCourseContentsParameters {
  course_id: number;
}

export interface GetUsersByFieldParameters {
  field: "id" | "idnumber" | "username" | "email";
  values: string[];
}

export interface CreateUserParameters {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  auth?: string;
  idnumber?: string;
}

export interface UpdateUserParameters {
  user_id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  idnumber?: string;
  suspended?: boolean;
}

export interface DeleteUserParameters {
  user_id: number;
}

export interface EnrolUserParameters {
  course_id: number;
  user_id: number;
  role_id: number;
  start_time?: number;
  end_time?: number;
  suspended?: boolean;
}

export interface UnenrolUserParameters {
  course_id: number;
  user_id: number;
  role_id?: number;
}

export interface GetCourseGroupsParameters {
  course_id: number;
}

export interface CreateGroupParameters {
  course_id: number;
  name: string;
  description?: string;
  idnumber?: string;
  enrolment_key?: string;
  visibility?: number;
  participation?: boolean;
}

export interface DeleteGroupParameters {
  group_id: number;
}

export interface AddGroupMemberParameters {
  group_id: number;
  user_id: number;
}

export interface RemoveGroupMemberParameters {
  group_id: number;
  user_id: number;
}

export interface GetCourseCategoriesParameters {
  parent_id?: number;
  include_subcategories?: boolean;
}

export interface GetCourseCategoryParameters {
  category_id: number;
}

export interface GetEnrolledUsersParameters {
  course_id: number;
  group_id?: number;
  only_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetCohortsParameters {
  cohort_ids?: number[];
}

export interface GetGroupMembersParameters {
  group_id: number;
}

export interface GetCourseGroupingsParameters {
  course_id: number;
}

export interface GetActivityCompletionStatusesParameters {
  course_id: number;
  user_id: number;
}

export interface GetCourseCompletionStatusParameters {
  course_id: number;
  user_id: number;
}

export interface GetCalendarEventsParameters {
  event_ids?: number[];
  course_ids?: number[];
  group_ids?: number[];
  category_ids?: number[];
  include_user_events?: boolean;
  include_site_events?: boolean;
  time_from?: number;
  time_to?: number;
  ignore_hidden?: boolean;
}

export interface GetGradeItemsParameters {
  course_id: number;
  user_id?: number;
  group_id?: number;
}

export interface CreateCourseCategoryParameters {
  name: string;
  parent_id?: number;
  idnumber?: string;
  description?: string;
  theme?: string;
}

export interface UpdateCourseCategoryParameters {
  category_id: number;
  name?: string;
  parent_id?: number;
  idnumber?: string;
  description?: string;
  theme?: string;
}

export interface DeleteCourseCategoryParameters {
  category_id: number;
  new_parent_id?: number;
  recursive?: boolean;
}

export interface GetGroupParameters {
  group_id: number;
}

export interface UpdateGroupParameters {
  group_id: number;
  name: string;
  description?: string;
  idnumber?: string;
  enrolment_key?: string;
  visibility?: number;
  participation?: boolean;
}

export interface CreateGroupingParameters {
  course_id: number;
  name: string;
  description?: string;
  idnumber?: string;
}

export interface GetGroupingParameters {
  grouping_id: number;
  include_groups?: boolean;
}

export interface UpdateGroupingParameters {
  grouping_id: number;
  name: string;
  description?: string;
  idnumber?: string;
}

export interface DeleteGroupingParameters {
  grouping_id: number;
}

export interface AddGroupToGroupingParameters {
  grouping_id: number;
  group_id: number;
}

export interface RemoveGroupFromGroupingParameters {
  grouping_id: number;
  group_id: number;
}

export interface CreateCohortParameters {
  name: string;
  idnumber: string;
  category_id?: number;
  description?: string;
  visible?: boolean;
}

export interface UpdateCohortParameters {
  cohort_id: number;
  name: string;
  idnumber: string;
  category_id?: number;
  description?: string;
  visible?: boolean;
}

export interface DeleteCohortParameters {
  cohort_id: number;
}

export interface GetCohortMembersParameters {
  cohort_id: number;
}

export interface SearchCohortsParameters {
  query: string;
  context_id: number;
  include_contexts?: "all" | "parents" | "self";
  limit?: number;
  offset?: number;
}

export interface AddCohortMemberParameters {
  cohort_id: number;
  user_id: number;
}

export interface RemoveCohortMemberParameters {
  cohort_id: number;
  user_id: number;
}

export interface AssignRoleParameters {
  role_id: number;
  user_id: number;
  context_type: "system" | "course" | "course_category" | "module" | "user" | "block";
  instance_id: number;
}

export interface UnassignRoleParameters {
  role_id: number;
  user_id: number;
  context_type: "system" | "course" | "course_category" | "module" | "user" | "block";
  instance_id: number;
}

export interface GetUserCoursesParameters {
  user_id: number;
  include_user_count?: boolean;
}

export interface GetCourseEnrolmentMethodsParameters {
  course_id: number;
}

export interface GetEnrolledUsersWithCapabilityParameters {
  course_id: number;
  capabilities: string[];
  group_id?: number;
  only_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchEnrolledUsersParameters {
  course_id: number;
  query: string;
  match_anywhere?: boolean;
  page?: number;
  page_size?: number;
  context_id?: number;
}

export interface GetPotentialEnrolmentUsersParameters {
  course_id: number;
  enrolment_id: number;
  query?: string;
  match_anywhere?: boolean;
  page?: number;
  page_size?: number;
}

export interface GetSelfEnrolmentInfoParameters {
  enrolment_id: number;
}

export interface SelfEnrolParameters {
  course_id: number;
  enrolment_key?: string;
  enrolment_id?: number;
}

export interface UpdateUserEnrolmentParameters {
  enrolment_id: number;
  status: "active" | "suspended";
  start_time?: number;
  end_time?: number;
}

export interface DeleteUserEnrolmentParameters {
  enrolment_id: number;
}

export interface GetGradesTableParameters {
  course_id: number;
  user_id?: number;
  group_id?: number;
}

export interface GetUserCourseGradesParameters {
  user_id?: number;
}

export interface GetGradeAccessInformationParameters {
  course_id: number;
}

export interface GetGradebookItemsParameters {
  course_id: number;
}

export interface GetGradeTreeParameters {
  course_id: number;
}

export interface GetGradableUsersParameters {
  course_id: number;
  group_id?: number;
  only_active?: boolean;
}

export interface GetGradeFeedbackParameters {
  course_id: number;
  user_id: number;
  grade_item_id: number;
}

export interface CreateGradeCategoryParameters {
  course_id: number;
  name: string;
  aggregation?: number;
  drop_low?: number;
  idnumber?: string;
  grade_max?: number;
  grade_min?: number;
  grade_pass?: number;
  parent_category_id?: number;
}

export interface UpdateGradeValueParameters {
  source: string;
  course_id: number;
  component: string;
  activity_id: number;
  item_number?: number;
  user_id: number;
  grade: number;
  feedback?: string;
}

export interface SetActivityCompletionStatusParameters {
  module_id: number;
  completed: boolean;
}

export interface OverrideActivityCompletionStatusParameters {
  module_id: number;
  user_id: number;
  state: number;
}

export interface MarkCourseSelfCompletedParameters {
  course_id: number;
}

export interface UploadDraftFileParameters {
  file_path: string;
  item_id?: number;
  draft_path?: string;
  filename?: string;
}

export interface DownloadFileParameters {
  file_url: string;
  destination_path: string;
  overwrite?: boolean;
}

export interface GetCourseAssignmentsParameters {
  course_ids?: number[];
  capabilities?: string[];
  include_visible_not_enrolled?: boolean;
}

export interface GetAssignmentSubmissionsParameters {
  assignment_ids: number[];
  status?: string;
  modified_since?: number;
  modified_before?: number;
}

export interface GetAssignmentGradesParameters {
  assignment_ids: number[];
  modified_since?: number;
}

export interface GetAssignmentSubmissionStatusParameters {
  assignment_id: number;
  user_id?: number;
  group_id?: number;
}

export interface GetAssignmentParticipantsParameters {
  assignment_id: number;
  group_id?: number;
  query?: string;
  offset?: number;
  limit?: number;
  only_ids?: boolean;
}

export interface GetAssignmentParticipantParameters {
  assignment_id: number;
  user_id: number;
  include_user?: boolean;
}

export interface StartAssignmentSubmissionParameters {
  assignment_id: number;
}

export interface SaveAssignmentSubmissionParameters {
  assignment_id: number;
  online_text?: string;
  online_text_format?: number;
  online_text_item_id?: number;
  file_draft_item_id?: number;
}

export interface SubmitAssignmentForGradingParameters {
  assignment_id: number;
  accept_submission_statement?: boolean;
}

export interface SaveAssignmentGradeParameters {
  assignment_id: number;
  user_id: number;
  grade: number;
  attempt_number?: number;
  add_attempt?: boolean;
  workflow_state?: string;
  apply_to_all?: boolean;
  feedback_text?: string;
}

export interface SetAssignmentUserFlagsParameters {
  assignment_id: number;
  user_id: number;
  locked?: boolean;
  extension_due_date?: number;
  workflow_state?: string;
  allocated_marker_id?: number;
}

export interface GetAssignmentUserFlagsParameters {
  assignment_ids: number[];
}

export interface GetAssignmentUserMappingsParameters {
  assignment_ids: number[];
}

export interface LockAssignmentSubmissionsParameters {
  assignment_id: number;
  user_ids: number[];
}

export interface UnlockAssignmentSubmissionsParameters {
  assignment_id: number;
  user_ids: number[];
}

export interface RevertAssignmentSubmissionsToDraftParameters {
  assignment_id: number;
  user_ids: number[];
}

export interface SetAssignmentExtensionParameters {
  assignment_id: number;
  user_id: number;
  extension_due_date: number;
}

export interface RevealAssignmentIdentitiesParameters {
  assignment_id: number;
}

export interface CopyPreviousAssignmentAttemptParameters {
  assignment_id: number;
}

export interface RemoveAssignmentSubmissionParameters {
  assignment_id: number;
  user_id: number;
}

export interface ViewAssignmentParameters {
  assignment_id: number;
}

export interface ViewAssignmentSubmissionStatusParameters {
  assignment_id: number;
}

export interface ViewAssignmentGradingTableParameters {
  assignment_id: number;
}

export interface GetCourseForumsParameters {
  course_ids?: number[];
}

export interface GetForumDiscussionsParameters {
  forum_id: number;
  sort_order?: number;
  page?: number;
  page_size?: number;
  group_id?: number;
}

export interface GetForumDiscussionPostsParameters {
  discussion_id: number;
  sort_by?: "id" | "created" | "modified";
  sort_direction?: "ASC" | "DESC";
  include_inline_attachments?: boolean;
}

export interface GetForumPostParameters {
  post_id: number;
}

export interface GetForumPostsByUserParameters {
  user_id: number;
  module_id: number;
  sort_by?: "id" | "created" | "modified";
  sort_direction?: "ASC" | "DESC";
}

export interface GetForumAccessInformationParameters {
  forum_id: number;
}

export interface CanAddForumDiscussionParameters {
  forum_id: number;
  group_id?: number;
}

export interface CreateForumDiscussionParameters {
  forum_id: number;
  subject: string;
  message: string;
  group_id?: number;
  subscribe?: boolean;
  pinned?: boolean;
  inline_draft_item_id?: number;
  attachment_draft_item_id?: number;
}

export interface ReplyToForumPostParameters {
  post_id: number;
  subject: string;
  message: string;
  message_format?: number;
  subscribe?: boolean;
  private_reply?: boolean;
  inline_draft_item_id?: number;
  attachment_draft_item_id?: number;
}

export interface UpdateForumPostParameters {
  post_id: number;
  subject?: string;
  message?: string;
  message_format?: number;
  subscribe?: boolean;
  pinned?: boolean;
  inline_draft_item_id?: number;
  attachment_draft_item_id?: number;
}

export interface DeleteForumPostParameters {
  post_id: number;
}

export interface PrepareForumPostDraftParameters {
  post_id: number;
  area: "attachment" | "post";
  draft_item_id?: number;
}

export interface SetForumSubscriptionParameters {
  forum_id: number;
  subscribed: boolean;
}

export interface SetForumTrackingParameters {
  forum_id: number;
  tracked: boolean;
}

export interface SetForumDiscussionSubscriptionParameters {
  forum_id: number;
  discussion_id: number;
  subscribed: boolean;
}

export interface SetForumDiscussionFavouriteParameters {
  discussion_id: number;
  favourite: boolean;
}

export interface SetForumDiscussionPinParameters {
  discussion_id: number;
  pinned: boolean;
}

export interface SetForumDiscussionLockParameters {
  forum_id: number;
  discussion_id: number;
  locked: boolean;
}

export interface MarkForumPostsReadParameters {
  discussion_id: number;
  post_ids: number[];
}

export interface ViewForumParameters {
  forum_id: number;
}

export interface ViewForumDiscussionParameters {
  discussion_id: number;
}

export interface GetCourseQuizzesParameters {
  course_ids?: number[];
}

export interface GetUserQuizAttemptsParameters {
  quiz_id: number;
  user_id?: number;
  status?: "all" | "finished" | "unfinished";
  include_previews?: boolean;
}

export interface GetUserQuizBestGradeParameters {
  quiz_id: number;
  user_id?: number;
}

export interface GetQuizReviewOptionsParameters {
  quiz_id: number;
  user_id?: number;
}

export interface StartQuizAttemptParameters {
  quiz_id: number;
  preflight_data?: JsonObject;
  force_new?: boolean;
}

export interface GetQuizAttemptDataParameters {
  attempt_id: number;
  page: number;
  preflight_data?: JsonObject;
}

export interface GetQuizAttemptSummaryParameters {
  attempt_id: number;
  preflight_data?: JsonObject;
}

export interface SaveQuizAttemptParameters {
  attempt_id: number;
  responses: JsonObject;
  preflight_data?: JsonObject;
}

export interface ProcessQuizAttemptParameters {
  attempt_id: number;
  responses?: JsonObject;
  finish?: boolean;
  time_up?: boolean;
  preflight_data?: JsonObject;
}

export interface GetQuizAttemptReviewParameters {
  attempt_id: number;
  page?: number;
}

export interface GetQuizFeedbackForGradeParameters {
  quiz_id: number;
  grade: number;
}

export interface GetQuizAccessInformationParameters {
  quiz_id: number;
}

export interface GetQuizAttemptAccessInformationParameters {
  quiz_id: number;
  attempt_id?: number;
}

export interface GetQuizRequiredQuestionTypesParameters {
  quiz_id: number;
}

export interface ViewQuizParameters {
  quiz_id: number;
}

export interface ViewQuizAttemptParameters {
  attempt_id: number;
  page: number;
  preflight_data?: JsonObject;
}

export interface ViewQuizAttemptSummaryParameters {
  attempt_id: number;
  preflight_data?: JsonObject;
}

export interface ViewQuizAttemptReviewParameters {
  attempt_id: number;
}

export interface GetCourseBooksParameters {
  course_ids?: number[];
}

export interface ViewBookParameters {
  book_id: number;
  chapter_id?: number;
}

export interface GetCourseFoldersParameters {
  course_ids?: number[];
}

export interface ViewFolderParameters {
  folder_id: number;
}

export interface GetCourseImscpPackagesParameters {
  course_ids?: number[];
}

export interface ViewImscpPackageParameters {
  imscp_id: number;
}

export interface GetCourseLabelsParameters {
  course_ids?: number[];
}

export interface GetCoursePagesParameters {
  course_ids?: number[];
}

export interface ViewPageParameters {
  page_id: number;
}

export interface GetCourseResourcesParameters {
  course_ids?: number[];
}

export interface ViewResourceParameters {
  resource_id: number;
}

export interface GetCourseUrlsParameters {
  course_ids?: number[];
}

export interface ViewUrlParameters {
  url_id: number;
}

export interface GetCourseChoicesParameters {
  course_ids?: number[];
}

export interface GetChoiceOptionsParameters {
  choice_id: number;
}

export interface GetChoiceResultsParameters {
  choice_id: number;
  group_id?: number;
}

export interface SubmitChoiceResponseParameters {
  choice_id: number;
  option_ids: number[];
}

export interface DeleteChoiceResponsesParameters {
  choice_id: number;
  response_ids?: number[];
}

export interface ViewChoiceParameters {
  choice_id: number;
}

export interface GetCourseScormPackagesParameters {
  course_ids?: number[];
}

export interface GetScormAttemptCountParameters {
  scorm_id: number;
  user_id: number;
  ignore_incomplete?: boolean;
}

export interface GetScormContentsParameters {
  scorm_id: number;
  organization?: string;
}

export interface GetScormUserDataParameters {
  scorm_id: number;
  attempt: number;
}

export interface SaveScormTracksParameters {
  sco_id: number;
  attempt: number;
  tracks: JsonObject;
}

export interface GetScormTracksParameters {
  sco_id: number;
  user_id: number;
  attempt?: number;
}

export interface LaunchScormContentParameters {
  scorm_id: number;
  sco_id?: number;
}

export interface GetScormAccessInformationParameters {
  scorm_id: number;
}

export interface ViewScormParameters {
  scorm_id: number;
}

export interface GetCourseWikisParameters {
  course_ids?: number[];
}

export interface GetWikiSubwikisParameters {
  wiki_id: number;
}

export interface GetWikiPagesParameters {
  wiki_id: number;
  group_id?: number;
  user_id?: number;
  sort_by?: string;
  sort_direction?: "ASC" | "DESC";
  include_content?: boolean;
}

export interface GetWikiFilesParameters {
  wiki_id: number;
  group_id?: number;
  user_id?: number;
}

export interface GetWikiPageParameters {
  page_id: number;
}

export interface GetWikiPageForEditingParameters {
  page_id: number;
  section?: string;
  lock_only?: boolean;
}

export interface CreateWikiPageParameters {
  title: string;
  content: string;
  content_format?: string;
  subwiki_id?: number;
  wiki_id?: number;
  user_id?: number;
  group_id?: number;
}

export interface UpdateWikiPageParameters {
  page_id: number;
  content: string;
  section?: string;
}

export interface ViewWikiParameters {
  wiki_id: number;
}

export interface ViewWikiPageParameters {
  page_id: number;
}

export interface GetCourseFeedbacksParameters {
  course_ids?: number[];
}

export interface GetFeedbackAccessInformationParameters {
  feedback_id: number;
  course_id?: number;
}

export interface GetFeedbackTemporaryCompletionParameters {
  feedback_id: number;
  course_id?: number;
}

export interface GetFeedbackItemsParameters {
  feedback_id: number;
  course_id?: number;
}

export interface LaunchFeedbackParameters {
  feedback_id: number;
  course_id?: number;
}

export interface GetFeedbackPageParameters {
  feedback_id: number;
  page: number;
  course_id?: number;
}

export interface SubmitFeedbackPageParameters {
  feedback_id: number;
  page: number;
  responses?: JsonObject;
  go_previous?: boolean;
  course_id?: number;
}

export interface GetFeedbackAnalysisParameters {
  feedback_id: number;
  group_id?: number;
  course_id?: number;
}

export interface GetUnfinishedFeedbackResponsesParameters {
  feedback_id: number;
  course_id?: number;
}

export interface GetFinishedFeedbackResponsesParameters {
  feedback_id: number;
  course_id?: number;
}

export interface GetFeedbackNonRespondentsParameters {
  feedback_id: number;
  group_id?: number;
  sort_by?: "firstname" | "lastname" | "lastaccess";
  page?: number;
  page_size?: number;
  course_id?: number;
}

export interface GetFeedbackResponsesAnalysisParameters {
  feedback_id: number;
  group_id?: number;
  page?: number;
  page_size?: number;
  course_id?: number;
}

export interface GetLastFeedbackCompletionParameters {
  feedback_id: number;
  course_id?: number;
}

export interface ReorderFeedbackQuestionsParameters {
  module_id: number;
  item_ids: number[];
}

export interface ViewFeedbackParameters {
  feedback_id: number;
  mark_completed?: boolean;
  course_id?: number;
}

export interface GetCourseH5pActivitiesParameters {
  course_ids?: number[];
}

export interface GetH5pAccessInformationParameters {
  h5p_id: number;
}

export interface GetH5pAttemptsParameters {
  h5p_id: number;
  user_ids?: number[];
}

export interface GetH5pResultsParameters {
  h5p_id: number;
  attempt_ids?: number[];
}

export interface GetH5pUserAttemptsParameters {
  h5p_id: number;
  sort_order?: string;
  page?: number;
  page_size?: number;
  first_initial?: string;
  last_initial?: string;
}

export interface LogH5pReportViewParameters {
  h5p_id: number;
  user_id?: number;
  attempt_id?: number;
}

export interface ViewH5pActivityParameters {
  h5p_id: number;
}

export interface GetCourseDatabasesParameters {
  course_ids?: number[];
}

export interface GetDatabaseAccessInformationParameters {
  database_id: number;
  group_id?: number;
}

export interface GetDatabaseEntriesParameters {
  database_id: number;
  group_id?: number;
  include_contents?: boolean;
  sort_field_id?: number;
  sort_direction?: "ASC" | "DESC";
  page?: number;
  page_size?: number;
}

export interface GetDatabaseEntryParameters {
  entry_id: number;
  include_contents?: boolean;
}

export interface GetDatabaseFieldsParameters {
  database_id: number;
}

export interface SearchDatabaseEntriesParameters {
  database_id: number;
  group_id?: number;
  include_contents?: boolean;
  query?: string;
  advanced_search?: JsonObject;
  sort_field_id?: number;
  sort_direction?: "ASC" | "DESC";
  page?: number;
  page_size?: number;
}

export interface ApproveDatabaseEntryParameters {
  entry_id: number;
  approved: boolean;
}

export interface DeleteDatabaseEntryParameters {
  entry_id: number;
}

export interface CreateDatabaseEntryParameters {
  database_id: number;
  group_id?: number;
  fields: JsonObject;
}

export interface UpdateDatabaseEntryParameters {
  entry_id: number;
  fields: JsonObject;
}

export interface DeleteDatabasePresetsParameters {
  database_id: number;
  preset_names: string[];
}

export interface GetDatabasePresetMappingParameters {
  module_id: number;
  preset: string;
}

export interface ViewDatabaseParameters {
  database_id: number;
}

export interface GetCourseGlossariesParameters {
  course_ids?: number[];
}

export interface GetGlossaryEntriesByLetterParameters {
  glossary_id: number;
  letter: string;
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryEntriesByDateParameters {
  glossary_id: number;
  date_field?: "CREATION" | "UPDATE";
  sort_direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryCategoriesParameters {
  glossary_id: number;
  offset?: number;
  limit?: number;
}

export interface GetGlossaryEntriesByCategoryParameters {
  glossary_id: number;
  category_id: number;
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryAuthorsParameters {
  glossary_id: number;
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryEntriesByAuthorLetterParameters {
  glossary_id: number;
  letter: string;
  name_field?: "FIRSTNAME" | "LASTNAME";
  sort_direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryEntriesByAuthorParameters {
  glossary_id: number;
  author_id: number;
  order_by?: "CONCEPT" | "CREATION" | "UPDATE";
  sort_direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface SearchGlossaryEntriesParameters {
  glossary_id: number;
  query: string;
  full_search?: boolean;
  order_by?: "CONCEPT" | "CREATION" | "UPDATE";
  sort_direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryEntriesByTermParameters {
  glossary_id: number;
  term: string;
  offset?: number;
  limit?: number;
  include_unapproved?: boolean;
}

export interface GetGlossaryEntriesToApproveParameters {
  glossary_id: number;
  letter: string;
  order_by?: "CONCEPT" | "CREATION" | "UPDATE";
  sort_direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
}

export interface GetGlossaryEntryParameters {
  entry_id: number;
}

export interface CreateGlossaryEntryParameters {
  glossary_id: number;
  concept: string;
  definition: string;
  definition_format?: number;
  options?: JsonObject;
}

export interface UpdateGlossaryEntryParameters {
  entry_id: number;
  concept: string;
  definition: string;
  definition_format?: number;
  options?: JsonObject;
}

export interface DeleteGlossaryEntryParameters {
  entry_id: number;
}

export interface PrepareGlossaryEntryParameters {
  entry_id: number;
}

export interface ViewGlossaryParameters {
  glossary_id: number;
  mode: string;
}

export interface ViewGlossaryEntryParameters {
  entry_id: number;
}

export interface GetCourseBigbluebuttonActivitiesParameters {
  course_ids?: number[];
}

export interface CanJoinBigbluebuttonParameters {
  module_id: number;
  group_id?: number;
}

export interface GetBigbluebuttonJoinUrlParameters {
  module_id: number;
  group_id?: number;
}

export interface GetBigbluebuttonRecordingsParameters {
  bigbluebutton_id: number;
  tools?: string[];
  group_id?: number;
}

export interface GetBigbluebuttonRecordingsToImportParameters {
  destination_id: number;
  source_bigbluebutton_id?: number;
  source_course_id?: number;
  tools?: string[];
  group_id?: number;
}

export interface UpdateBigbluebuttonRecordingParameters {
  bigbluebutton_id: number;
  recording_id: number;
  action: "delete" | "edit" | "protect" | "publish" | "unprotect" | "unpublish" | "import";
  additional_options?: JsonObject;
}

export interface EndBigbluebuttonMeetingParameters {
  bigbluebutton_id: number;
  group_id?: number;
}

export interface ValidateBigbluebuttonCompletionParameters {
  bigbluebutton_id: number;
}

export interface GetBigbluebuttonMeetingInformationParameters {
  bigbluebutton_id: number;
  group_id?: number;
  refresh_cache?: boolean;
}

export interface ViewBigbluebuttonParameters {
  bigbluebutton_id: number;
}

export interface GetCourseLessonsParameters {
  course_ids?: number[];
}

export interface GetLessonParameters {
  lesson_id: number;
  password?: string;
}

export interface GetLessonAccessInformationParameters {
  lesson_id: number;
}

export interface GetLessonQuestionAttemptsParameters {
  lesson_id: number;
  attempt: number;
  only_correct?: boolean;
  page_id?: number;
  user_id?: number;
}

export interface GetLessonUserGradeParameters {
  lesson_id: number;
  user_id?: number;
}

export interface GetLessonAttemptGradeParameters {
  lesson_id: number;
  attempt: number;
  user_id?: number;
}

export interface GetLessonContentPagesViewedParameters {
  lesson_id: number;
  attempt: number;
  user_id?: number;
}

export interface GetLessonUserTimersParameters {
  lesson_id: number;
  user_id?: number;
}

export interface GetLessonPagesParameters {
  lesson_id: number;
  password?: string;
}

export interface LaunchLessonAttemptParameters {
  lesson_id: number;
  password?: string;
  page_id?: number;
  review?: boolean;
}

export interface GetLessonPageParameters {
  lesson_id: number;
  page_id: number;
  password?: string;
  review?: boolean;
  include_contents?: boolean;
}

export interface SubmitLessonPageParameters {
  lesson_id: number;
  page_id: number;
  responses: JsonObject;
  password?: string;
  review?: boolean;
}

export interface FinishLessonAttemptParameters {
  lesson_id: number;
  password?: string;
  out_of_time?: boolean;
  review?: boolean;
}

export interface GetLessonAttemptsOverviewParameters {
  lesson_id: number;
  group_id?: number;
}

export interface GetLessonUserAttemptParameters {
  lesson_id: number;
  user_id: number;
  attempt: number;
}

export interface GetLessonPossibleJumpsParameters {
  lesson_id: number;
}

export interface ViewLessonParameters {
  lesson_id: number;
  password?: string;
}

export interface GetCourseLtiToolsParameters {
  course_ids?: number[];
}

export interface GetLtiLaunchDataParameters {
  tool_id: number;
}

export interface GetLtiToolProxiesParameters {
  only_orphaned?: boolean;
}

export interface CreateLtiToolProxyParameters {
  name?: string;
  registration_url: string;
  capabilities?: string[];
  services?: string[];
}

export interface DeleteLtiToolProxyParameters {
  proxy_id: number;
}

export interface GetLtiProxyRegistrationRequestParameters {
  proxy_id: number;
}

export interface GetLtiToolTypesParameters {
  proxy_id?: number;
}

export interface GetLtiToolTypesAndProxiesParameters {
  proxy_id?: number;
  only_orphaned?: boolean;
  limit?: number;
  offset?: number;
}

export interface CountLtiToolTypesAndProxiesParameters {
  proxy_id?: number;
  only_orphaned?: boolean;
}

export interface CreateLtiToolTypeParameters {
  cartridge_url?: string;
  consumer_key?: string;
  shared_secret?: string;
}

export interface UpdateLtiToolTypeParameters {
  tool_type_id: number;
  name?: string;
  description?: string;
  state?: number;
}

export interface DeleteLtiToolTypeParameters {
  tool_type_id: number;
}

export interface DeleteCourseLtiToolTypeParameters {
  tool_type_id: number;
}

export interface SetLtiToolActivityChooserVisibilityParameters {
  tool_type_id: number;
  course_id: number;
  visible: boolean;
}

export interface IsLtiCartridgeParameters {
  url: string;
}

export interface ViewLtiParameters {
  lti_id: number;
}

export interface GetCourseWorkshopsParameters {
  course_ids?: number[];
}

export interface GetWorkshopAccessInformationParameters {
  workshop_id: number;
}

export interface GetWorkshopUserPlanParameters {
  workshop_id: number;
  user_id?: number;
}

export interface CreateWorkshopSubmissionParameters {
  workshop_id: number;
  title: string;
  content?: string;
  content_format?: number;
  inline_draft_item_id?: number;
  attachment_draft_item_id?: number;
}

export interface UpdateWorkshopSubmissionParameters {
  submission_id: number;
  title: string;
  content?: string;
  content_format?: number;
  inline_draft_item_id?: number;
  attachment_draft_item_id?: number;
}

export interface DeleteWorkshopSubmissionParameters {
  submission_id: number;
}

export interface GetWorkshopSubmissionsParameters {
  workshop_id: number;
  user_id?: number;
  group_id?: number;
  page?: number;
  page_size?: number;
}

export interface GetWorkshopSubmissionParameters {
  submission_id: number;
}

export interface GetWorkshopSubmissionAssessmentsParameters {
  submission_id: number;
}

export interface GetWorkshopAssessmentParameters {
  assessment_id: number;
}

export interface GetWorkshopAssessmentFormParameters {
  assessment_id: number;
  mode?: "assessment" | "preview";
}

export interface GetWorkshopReviewerAssessmentsParameters {
  workshop_id: number;
  user_id?: number;
}

export interface UpdateWorkshopAssessmentParameters {
  assessment_id: number;
  data: JsonObject;
}

export interface GetWorkshopGradesParameters {
  workshop_id: number;
  user_id?: number;
}

export interface EvaluateWorkshopAssessmentParameters {
  assessment_id: number;
  feedback?: string;
  feedback_format?: number;
  weight?: number;
  grade_override?: string;
}

export interface GetWorkshopGradesReportParameters {
  workshop_id: number;
  group_id?: number;
  sort_by?: string;
  sort_direction?: "ASC" | "DESC";
  page?: number;
  page_size?: number;
}

export interface EvaluateWorkshopSubmissionParameters {
  submission_id: number;
  feedback?: string;
  feedback_format?: number;
  published?: boolean;
  grade_override?: string;
}

export interface ViewWorkshopParameters {
  workshop_id: number;
}

export interface ViewWorkshopSubmissionParameters {
  submission_id: number;
}

export interface SaveAssignmentGradesParameters {
  assignment_id: number;
  apply_to_all?: boolean;
  grades: JsonObject[];
}

export interface SubmitAssignmentGradingFormParameters {
  assignment_id: number;
  user_id: number;
  form_data: JsonObject;
  marking?: boolean;
}

export interface GetUserQuizAttemptsLegacyParameters {
  quiz_id: number;
  user_id?: number;
  status?: "all" | "finished" | "unfinished";
  include_previews?: boolean;
}

export interface SetQuizQuestionVersionParameters {
  slot_id: number;
  version: number;
}

export interface ReopenQuizAttemptParameters {
  attempt_id: number;
}

export interface GetReopenQuizAttemptConfirmationParameters {
  attempt_id: number;
}

export interface AddQuizRandomQuestionsParameters {
  module_id: number;
  page: number;
  count: number;
  filter?: JsonObject;
  new_category?: string;
  parent_category?: string;
}

export interface UpdateQuizRandomQuestionFilterParameters {
  module_id: number;
  slot_id: number;
  filter: JsonObject;
}

export interface SaveQuizOverridesParameters {
  quiz_id: number;
  overrides: JsonObject[];
}

export interface DeleteQuizOverridesParameters {
  quiz_id: number;
  override_ids: number[];
}

export interface GetQuizOverridesParameters {
  quiz_id: number;
}

export interface CreateQuizGradeItemsParameters {
  quiz_id: number;
  names: string[];
}

export interface DeleteQuizGradeItemsParameters {
  quiz_id: number;
  grade_item_ids: number[];
}

export interface UpdateQuizGradeItemsParameters {
  quiz_id: number;
  grade_items: JsonObject[];
}

export interface UpdateQuizSlotsParameters {
  quiz_id: number;
  slots: JsonObject[];
}

export interface GetQuizGradingSetupParameters {
  quiz_id: number;
}

export interface CreateQuizGradeItemPerSectionParameters {
  quiz_id: number;
}

export interface GetCalendarMonthParameters {
  year: number;
  month: number;
  course_id?: number;
  category_id?: number;
  include_navigation?: boolean;
  mini?: boolean;
}

export interface GetCalendarDayParameters {
  year: number;
  month: number;
  day: number;
  course_id?: number;
  category_id?: number;
}

export interface GetCalendarUpcomingParameters {
  course_id?: number;
  category_id?: number;
}

export interface MoveCalendarEventParameters {
  event_id: number;
  day_timestamp: number;
}

export interface CreateCalendarEventsParameters {
  events: JsonObject[];
}

export interface DeleteCalendarEventsParameters {
  events: JsonObject[];
}

export interface GetActionEventsByTimeParameters {
  from?: number;
  to?: number;
  after_event_id?: number;
  limit?: number;
  only_active_enrolments?: boolean;
  user_id?: number;
  query?: string;
}

export interface GetCourseActionEventsParameters {
  course_id: number;
  from?: number;
  to?: number;
  after_event_id?: number;
  limit?: number;
  query?: string;
}

export interface GetCoursesActionEventsParameters {
  course_ids: number[];
  from?: number;
  to?: number;
  limit?: number;
  query?: string;
}

export interface GetCalendarEventParameters {
  event_id: number;
}

export interface SubmitCalendarEventFormParameters {
  form_data: JsonObject;
}

export interface GetCalendarAccessInformationParameters {
  course_id?: number;
}

export interface GetAllowedCalendarEventTypesParameters {
  course_id?: number;
}

export interface GetCalendarExportTokenParameters {}

export interface GetBadgeParameters {
  badge_id: number;
}

export interface GetUserBadgesParameters {
  user_id?: number;
  course_id?: number;
  page?: number;
  page_size?: number;
  query?: string;
  only_public?: boolean;
}

export interface GetUserBadgeByHashParameters {
  hash: string;
}

export interface GetBlogEntriesParameters {
  filters?: JsonObject;
  page?: number;
  page_size?: number;
}

export interface ViewBlogEntriesParameters {
  filters?: JsonObject;
}

export interface GetBlogAccessInformationParameters {}

export interface CreateBlogEntryParameters {
  subject: string;
  content: string;
  content_format?: number;
  options?: JsonObject;
}

export interface UpdateBlogEntryParameters {
  entry_id: number;
  subject: string;
  content: string;
  content_format?: number;
  options?: JsonObject;
}

export interface DeleteBlogEntryParameters {
  entry_id: number;
}

export interface PrepareBlogEntryParameters {
  entry_id: number;
}

export interface GetCommentsParameters {
  context_type: string;
  context_id: number;
  component: string;
  item_id: number;
  area?: string;
  page?: number;
  sort_direction?: "ASC" | "DESC";
}

export interface CreateCommentsParameters {
  comments: JsonObject[];
}

export interface DeleteCommentsParameters {
  comment_ids: number[];
}

export interface CreateNotesParameters {
  notes: JsonObject[];
}

export interface DeleteNotesParameters {
  note_ids: number[];
}

export interface GetCourseNotesParameters {
  course_id: number;
  user_id?: number;
}

export interface ViewNotesParameters {
  course_id: number;
  user_id?: number;
}

export interface GetItemRatingsParameters {
  context_type: string;
  context_id: number;
  component: string;
  rating_area: string;
  item_id: number;
  scale_id: number;
  sort_by: "firstname" | "rating" | "timemodified";
}

export interface RateItemParameters {
  context_type: string;
  context_id: number;
  component: string;
  rating_area: string;
  item_id: number;
  scale_id: number;
  rating: number;
  rated_user_id: number;
  aggregation?: number;
}

export interface GetActivityAllowedGroupsParameters {
  course_module_id: number;
  user_id?: number;
}

export interface GetActivityGroupModeParameters {
  course_module_id: number;
}

export interface GetUserCourseGroupsParameters {
  course_id?: number;
  user_id?: number;
  grouping_id?: number;
}

export interface GetGroupsForSelectorParameters {
  course_id: number;
  course_module_id?: number;
}

export interface GetRecentlyAccessedItemsParameters {
  limit?: number;
}

export interface GetStarredCoursesParameters {
  limit?: number;
  offset?: number;
}

export interface ViewPersonalPageParameters {
  page: "dashboard" | "my";
}

export interface UpdateQuestionFlagParameters {
  question_usage_id: number;
  question_id: number;
  question_attempt_id: number;
  slot: number;
  checksum: string;
  flagged: boolean;
}

export interface BrowseFilesParameters {
  context_id: number;
  component: string;
  file_area: string;
  item_id: number;
  file_path: string;
  file_name: string;
  modified_after?: number;
  context_type?: string;
  instance_id?: number;
}

export interface DeleteDraftFilesParameters {
  draft_item_id: number;
  files: JsonObject[];
}

export interface GetUnusedDraftAreaParameters {}

export interface GetUserPreferencesParameters {
  preference?: string;
  user_id?: number;
}

export interface GetPrivateFilesInformationParameters {
  user_id?: number;
}

export interface ViewCourseUserListParameters {
  course_id: number;
}

export interface ViewUserProfileParameters {
  user_id: number;
  course_id?: number;
}

export interface AgreeSitePolicyParameters {}

export interface AddPrivateFilesParameters {
  draft_item_id: number;
}

export interface UpdateUserPictureParameters {
  draft_item_id: number;
  delete_picture?: boolean;
  user_id?: number;
}

export interface RemoveUserDeviceParameters {
  device_id: string;
  application_id?: string;
}

export interface SearchSiteParameters {
  query: string;
  filters?: JsonObject;
  page?: number;
}

export interface GetTopSearchResultsParameters {
  query: string;
  filters?: JsonObject;
}

export interface GetSearchAreasParameters {
  category?: string;
}

export interface ViewSearchResultsParameters {
  query: string;
  filters?: JsonObject;
  page?: number;
}

export interface GetTagAreasParameters {}

export interface GetTagCollectionsParameters {}

export interface GetTagCloudParameters {
  collection_id?: number;
  only_standard?: boolean;
  limit?: number;
  sort_by?: string;
  query?: string;
  source_context_id?: number;
  context_id?: number;
  include_children?: boolean;
}

export interface GetTagIndexParameters {
  tag: string;
  collection_id: number;
  area_id: number;
  exclusive?: boolean;
  source_context_id?: number;
  context_id?: number;
  include_children?: boolean;
  page?: number;
}

export interface GetTagIndexByAreaParameters {
  tag_id?: number;
  tag?: string;
  collection_id?: number;
  area_id?: number;
  exclusive?: boolean;
  source_context_id?: number;
  context_id?: number;
  include_children?: boolean;
  page?: number;
}

export interface GetCourseModuleParameters {
  course_module_id: number;
}

export interface GetCourseModuleByInstanceParameters {
  module: string;
  instance_id: number;
}

export interface ViewCourseParameters {
  course_id: number;
  section_number?: number;
}

export interface SearchCoursesParameters {
  criteria: "search" | "modulelist" | "blocklist" | "tagid";
  value: string;
  page?: number;
  page_size?: number;
  required_capabilities?: string[];
  only_enrolled?: boolean;
  only_with_completion?: boolean;
}

export interface GetCourseNavigationOptionsParameters {
  course_ids: number[];
}

export interface GetCourseAdministrationOptionsParameters {
  course_ids: number[];
}

export interface GetCourseUpdatesParameters {
  course_id: number;
  since: number;
  areas?: string[];
}

export interface GetTimelineCoursesParameters {
  classification: string;
  limit?: number;
  offset?: number;
  sort?: string;
  custom_field?: string;
  custom_value?: string;
  query?: string;
  fields?: string[];
}

export interface SetFavouriteCoursesParameters {
  courses: JsonObject[];
}

export interface GetRecentCoursesParameters {
  user_id?: number;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface CheckCourseUpdatesParameters {
  course_id: number;
  contexts: JsonObject[];
  areas?: string[];
}

export interface GetTimelineCoursesWithEventsParameters {
  classification: string;
  limit?: number;
  offset?: number;
  sort?: string;
  custom_field?: string;
  custom_value?: string;
  query?: string;
  events_from?: number;
  events_to?: number;
}

export interface ViewModuleInstanceListParameters {
  course_id: number;
  module: string;
}

export interface GetCourseOverviewParameters {
  course_id: number;
  module: string;
}

export interface ViewCourseOverviewParameters {
  course_id: number;
}

export interface GetAvailableFiltersParameters {
  contexts: JsonObject[];
}

export interface GetAllFilterStatesParameters {}

export interface GetComponentStringsParameters {
  component: string;
  language?: string;
}

export interface GetFontawesomeIconMapParameters {}

export interface GetTrustedH5pFileParameters {
  url: string;
  show_frame?: boolean;
  allow_export?: boolean;
  allow_embed?: boolean;
  show_copyright?: boolean;
}

export interface IsPushNotificationSystemConfiguredParameters {}

export interface GetPushPreferenceStatusesParameters {
  user_ids: number[];
}

export interface GetUserPushDevicesParameters {
  application_id: string;
  user_id?: number;
}

export interface SetPushDeviceEnabledParameters {
  device_id: number;
  enabled: boolean;
}

export interface GetPopupNotificationsParameters {
  user_id: number;
  newest_first?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetUnreadPopupNotificationCountParameters {
  user_id: number;
}

export interface GetGuestEnrolmentInformationParameters {
  instance_id: number;
}

export interface ValidateGuestEnrolmentPasswordParameters {
  instance_id: number;
  password: string;
}

export interface RegisterUserDeviceParameters {
  application_id: string;
  name: string;
  model: string;
  platform: string;
  version: string;
  push_id: string;
  device_id: string;
  public_key?: string;
}

export interface UpdateUserDevicePublicKeyParameters {
  device_id: string;
  application_id: string;
  public_key: string;
}

export interface GetCourseUserProfilesParameters {
  users: JsonObject[];
}

export interface SetUserPreferencesParameters {
  preferences: JsonObject[];
}

export interface UpdateUserPreferencesParameters {
  user_id?: number;
  notifications_disabled?: boolean;
  preferences?: JsonObject;
}

export interface PreparePrivateFilesParameters {}

export interface UpdatePrivateFilesParameters {
  draft_item_id: number;
}

export interface GetXapiStateParameters {
  component: string;
  activity_id: string;
  agent: JsonObject;
  state_id: string;
  registration?: string;
}

export interface GetXapiStatesParameters {
  component: string;
  activity_id: string;
  agent: JsonObject;
  registration?: string;
  since?: string;
}

export interface SaveXapiStateParameters {
  component: string;
  activity_id: string;
  agent: JsonObject;
  state_id: string;
  state: JsonObject;
  registration?: string;
}

export interface DeleteXapiStateParameters {
  component: string;
  activity_id: string;
  agent: JsonObject;
  state_id: string;
  registration?: string;
}

export interface DeleteXapiStatesParameters {
  component: string;
  activity_id: string;
  agent: JsonObject;
  registration?: string;
}

export interface PostXapiStatementsParameters {
  component: string;
  statements: JsonObject[];
}

export interface ViewCompetencyParameters {
  competency_id: number;
}

export interface DeleteCompetencyEvidenceParameters {
  evidence_id: number;
}

export interface GetCompetencyScaleValuesParameters {
  scale_id: number;
}

export interface GradeCourseCompetencyParameters {
  course_id: number;
  user_id: number;
  competency_id: number;
  grade: number;
  note?: string;
}

export interface GetCourseCompetenciesParameters {
  course_id: number;
}

export interface ViewUserCompetencyParameters {
  user_competency_id: number;
}

export interface ViewUserCompetencyInCourseParameters {
  competency_id: number;
  user_id: number;
  course_id: number;
}

export interface ViewUserCompetencyInPlanParameters {
  competency_id: number;
  user_id: number;
  plan_id: number;
}

export interface ViewUserCompetencyPlanParameters {
  competency_id: number;
  user_id: number;
  plan_id: number;
}

export interface GetCourseBlocksParameters {
  course_id: number;
  include_contents?: boolean;
}

export interface GetDashboardBlocksParameters {
  user_id?: number;
  include_contents?: boolean;
  page?: string;
}

export interface GetAddableBlocksParameters {
  page_context_id: number;
  page_type: string;
  page_layout: string;
  subpage?: string;
  page_hash?: string;
}

export interface GetGradeSelectorUsersParameters {
  course_id: number;
  group_id?: number;
}

export interface GetGradeSelectorGroupsParameters {
  course_id: number;
  course_module_id?: number;
}

export interface GetPointGradingPanelParameters {
  component: string;
  context_id: number;
  item: string;
  user_id: number;
}

export interface SavePointGradingPanelParameters {
  component: string;
  context_id: number;
  item: string;
  user_id: number;
  notify_user?: boolean;
  form_data: JsonObject;
}

export interface GetScaleGradingPanelParameters {
  component: string;
  context_id: number;
  item: string;
  user_id: number;
}

export interface SaveScaleGradingPanelParameters {
  component: string;
  context_id: number;
  item: string;
  user_id: number;
  notify_user?: boolean;
  form_data: JsonObject;
}

export interface GetGraderReportUsersParameters {
  course_id: number;
}

export interface GetGradeItemsForSelectorParameters {
  course_id: number;
}

export interface ViewGradeOverviewReportParameters {
  course_id: number;
  user_id?: number;
}

export interface ViewUserGradeReportParameters {
  course_id: number;
  user_id?: number;
}

export interface RecordInsightActionParameters {
  action: string;
  prediction_ids: number[];
}

export interface ListCustomReportsParameters {
  page?: number;
  page_size?: number;
}

export interface GetCustomReportParameters {
  report_id: number;
  page?: number;
  page_size?: number;
}

export interface ViewCustomReportParameters {
  report_id: number;
}

export interface CanViewSystemReportParameters {
  source: string;
  context_type: string;
  context_id: number;
  component?: string;
  area?: string;
  item_id?: number;
  parameters?: JsonObject;
}

export interface GetSystemReportParameters {
  source: string;
  context_type: string;
  context_id: number;
  component?: string;
  area?: string;
  item_id?: number;
  parameters?: JsonObject;
  page?: number;
  page_size?: number;
}

export interface GetDynamicTableParameters {
  component: string;
  handler: string;
  unique_id: string;
  sort?: JsonObject[];
  filters?: JsonObject[];
  filter_join_type?: number;
  first_initial?: string;
  last_initial?: string;
  page?: number;
  page_size?: number;
  hidden_columns?: string[];
  reset_preferences?: boolean;
}

export interface GetTinyEditorConfigurationParameters {
  context_type: string;
  context_id: number;
}

export interface GetTinyPremiumApiKeyParameters {
  context_id: number;
}

export interface GetDataPrivacyAccessInformationParameters {}

export interface CreateDataRequestParameters {
  request_type: "1" | "2";
  comments?: string;
  user_id?: number;
}

export interface CancelDataRequestParameters {
  request_id: number;
}

export interface ContactDataProtectionOfficerParameters {
  message: string;
}

export interface GetDataRequestsParameters {
  user_id?: number;
  statuses?: number[];
  types?: number[];
  creation_methods?: number[];
  sort?: string;
  offset?: number;
  limit?: number;
}

export interface GetPolicyAcceptancesParameters {
  user_id?: number;
}

export interface SetPolicyAcceptancesParameters {
  policies: JsonObject[];
  user_id?: number;
}

export interface GetCourseCompetenciesPageParameters {
  course_id: number;
  course_module_id?: number;
}

export interface GetLearningPlanPageParameters {
  plan_id: number;
}

export interface GetUserLearningPlansPageParameters {
  user_id: number;
}

export interface GetUserCompetencySummaryParameters {
  user_id: number;
  competency_id: number;
}

export interface GetCourseUserCompetencySummaryParameters {
  user_id: number;
  competency_id: number;
  course_id: number;
}

export interface GetPlanUserCompetencySummaryParameters {
  competency_id: number;
  plan_id: number;
}

export interface GetUserEvidenceListPageParameters {
  user_id: number;
}

export interface GetUserEvidencePageParameters {
  evidence_id: number;
}

export interface SendConversationMessagesParameters {
  conversation_id: number;
  messages: JsonObject[];
}

export interface SendInstantMessagesParameters {
  messages: JsonObject[];
}

export interface DeleteMessageContactsParameters {
  user_ids: number[];
  user_id?: number;
}

export interface MuteConversationsParameters {
  user_id: number;
  conversation_ids: number[];
}

export interface UnmuteConversationsParameters {
  user_id: number;
  conversation_ids: number[];
}

export interface BlockMessageUserParameters {
  user_id: number;
  blocked_user_id: number;
}

export interface UnblockMessageUserParameters {
  user_id: number;
  unblocked_user_id: number;
}

export interface GetContactRequestsParameters {
  user_id: number;
  offset?: number;
  limit?: number;
}

export interface GetReceivedContactRequestCountParameters {
  user_id: number;
}

export interface GetConversationMembersParameters {
  user_id: number;
  conversation_id: number;
  include_contact_requests?: boolean;
  include_privacy_info?: boolean;
  offset?: number;
  limit?: number;
}

export interface CreateContactRequestParameters {
  user_id: number;
  requested_user_id: number;
}

export interface ConfirmContactRequestParameters {
  user_id: number;
  requested_user_id: number;
}

export interface DeclineContactRequestParameters {
  user_id: number;
  requested_user_id: number;
}

export interface SearchMessageUsersParameters {
  user_id: number;
  query: string;
  offset?: number;
  limit?: number;
}

export interface SearchMessagesParameters {
  user_id: number;
  query: string;
  offset?: number;
  limit?: number;
}

export interface GetConversationBetweenUsersParameters {
  user_id: number;
  other_user_id: number;
  include_contact_requests?: boolean;
  include_privacy_info?: boolean;
  member_limit?: number;
  member_offset?: number;
  message_limit?: number;
  message_offset?: number;
  newest_first?: boolean;
}

export interface GetSelfConversationParameters {
  user_id: number;
  message_limit?: number;
  message_offset?: number;
  newest_first?: boolean;
}

export interface GetConversationMessagesParameters {
  user_id: number;
  conversation_id: number;
  offset?: number;
  limit?: number;
  newest_first?: boolean;
  from_time?: number;
}

export interface GetMessageContactsParameters {
  user_id: number;
  offset?: number;
  limit?: number;
}

export interface SearchMessageContactsParameters {
  query: string;
  only_my_courses?: boolean;
}

export interface GetConversationsParameters {
  user_id: number;
  offset?: number;
  limit?: number;
  type?: number;
  favourites?: boolean;
  merge_self?: boolean;
}

export interface GetConversationParameters {
  user_id: number;
  conversation_id: number;
  include_contact_requests?: boolean;
  include_privacy_info?: boolean;
  member_limit?: number;
  member_offset?: number;
  message_limit?: number;
  message_offset?: number;
  newest_first?: boolean;
}

export interface GetMessagesParameters {
  to_user_id: number;
  from_user_id?: number;
  type?: string;
  read?: number;
  newest_first?: boolean;
  offset?: number;
  limit?: number;
}

export interface GetConversationCountsParameters {
  user_id?: number;
}

export interface GetUnreadConversationCountsParameters {
  user_id?: number;
}

export interface GetUnreadConversationsCountParameters {
  to_user_id: number;
}

export interface GetUnreadNotificationCountParameters {
  to_user_id: number;
}

export interface GetBlockedMessageUsersParameters {
  user_id: number;
}

export interface GetMessageMemberInfoParameters {
  reference_user_id: number;
  user_ids: number[];
  include_contact_requests?: boolean;
  include_privacy_info?: boolean;
}

export interface MarkMessageReadParameters {
  message_id: number;
  read_time?: number;
}

export interface MarkNotificationReadParameters {
  notification_id: number;
  read_time?: number;
}

export interface MarkAllNotificationsReadParameters {
  to_user_id: number;
  from_user_id?: number;
  created_before?: number;
}

export interface MarkConversationReadParameters {
  user_id: number;
  conversation_id: number;
}

export interface DeleteConversationsParameters {
  user_id: number;
  conversation_ids: number[];
}

export interface DeleteMessageParameters {
  message_id: number;
  user_id: number;
  read?: boolean;
}

export interface DeleteMessageForAllUsersParameters {
  message_id: number;
  user_id: number;
}

export interface ConfigureMessageProcessorParameters {
  user_id: number;
  processor: string;
  form_values: JsonObject[];
}

export interface GetUserNotificationPreferencesParameters {
  user_id?: number;
}

export interface GetUserMessagePreferencesParameters {
  user_id?: number;
}

export interface SetFavouriteConversationsParameters {
  user_id?: number;
  conversation_ids: number[];
}

export interface UnsetFavouriteConversationsParameters {
  user_id?: number;
  conversation_ids: number[];
}

export interface ExplainTextWithAiParameters {
  context_id: number;
  prompt_text: string;
}

export interface SummariseTextWithAiParameters {
  context_id: number;
  prompt_text: string;
}

export interface GenerateAiImageParameters {
  context_id: number;
  prompt_text: string;
  aspect_ratio?: string;
  quality?: string;
  number_of_images?: number;
  style?: string;
}

export interface GenerateAiTextParameters {
  context_id: number;
  prompt_text: string;
}

export interface GetAiPolicyStatusParameters {
  user_id: number;
}

export interface SetAiPolicyStatusParameters {
  context_id: number;
}

export interface GetAnalyticsContextsParameters {
  query?: string;
  model_id?: number;
}

export interface GetMobilePluginsParameters {}

export interface GetMobilePublicConfigParameters {}

export interface GetMobileConfigParameters {
  section?: string;
}

export interface GetMobileAutologinKeyParameters {
  private_token: string;
}

export interface GetMobileContentParameters {
  component: string;
  method: string;
  arguments?: JsonObject[];
}

export interface CallMobileExternalFunctionsParameters {
  requests: JsonObject[];
}

export interface GetMobileQrLoginTokensParameters {
  qr_login_key: string;
  user_id: number;
}

export interface ValidateMobileSubscriptionKeyParameters {
  key: string;
}

export interface GetPolicyVersionParameters {
  version_id: number;
  on_behalf_of_user_id?: number;
}

export interface SearchMoodlenetCoursesParameters {
  query: string;
}

export interface VerifyMoodlenetProfileParameters {
  profile_url: string;
  course_id: number;
  section_number: number;
}

export interface AuthEmailGetSignupSettingsParameters {}

export interface AuthEmailSignupUserParameters {
  user_name: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  city?: string;
  country?: string;
  recaptcha_challenge_hash?: string;
  recaptcha_response?: string;
  custom_profile_fields?: JsonObject[];
  redirect?: string;
}

export interface BlockAccessreviewGetModuleDataParameters {
  course_id: number;
}

export interface BlockAccessreviewGetSectionDataParameters {
  course_id: number;
}

export interface AdminSetBlockProtectionParameters {
  plugin: string;
  state: number;
}

export interface AdminSetPluginOrderParameters {
  plugin: string;
  direction: number;
}

export interface AdminSetPluginStateParameters {
  plugin: string;
  state: number;
}

export interface AiDeleteProviderInstanceParameters {
  providerid: number;
}

export interface AiSetActionParameters {
  plugin: string;
  state: number;
  providerid?: number;
}

export interface AiSetProviderOrderParameters {
  plugin: number;
  direction: number;
}

export interface AiSetProviderStatusParameters {
  plugin: number;
  state: number;
}

export interface AuthConfirmUserParameters {
  user_name: string;
  secret: string;
}

export interface AuthIsAgeDigitalConsentVerificationEnabledParameters {}

export interface AuthIsMinorParameters {
  age: number;
  country: string;
}

export interface AuthRequestPasswordResetParameters {
  user_name?: string;
  email?: string;
}

export interface AuthResendConfirmationEmailParameters {
  user_name: string;
  password: string;
  redirect?: string;
}

export interface BackupGetAsyncBackupLinksBackupParameters {
  filename: string;
  context_id: number;
  backupid: string;
}

export interface BackupGetAsyncBackupLinksRestoreParameters {
  backupid: string;
  context_id: number;
}

export interface BackupGetAsyncBackupProgressParameters {
  backupids: string[];
  context_id: number;
}

export interface BackupGetCopyProgressParameters {
  copies: JsonObject[];
}

export interface BackupSubmitCopyFormParameters {
  json_form_data: string;
}

export interface BadgesDisableBadgesParameters {
  badgeids: string[];
}

export interface BadgesEnableBadgesParameters {
  badgeids: string[];
}

export interface CalendarDeleteSubscriptionParameters {
  subscription_id: number;
}

export interface CalendarGetTimestampsParameters {
  data: JsonObject[];
}

export interface ChangeEditmodeParameters {
  setmode: boolean;
  context: number;
}

export interface CheckGetResultAdmintreeParameters {
  admin_tree_id: string;
  setting_name: string;
  include_details?: boolean;
}

export interface CompetencyAddCompetencyToCourseParameters {
  course_id: number;
  competency_id: number;
}

export interface CompetencyAddCompetencyToPlanParameters {
  plan_id: number;
  competency_id: number;
}

export interface CompetencyAddCompetencyToTemplateParameters {
  template_id: number;
  competency_id: number;
}

export interface CompetencyAddRelatedCompetencyParameters {
  competency_id: number;
  related_competency_id: number;
}

export interface CompetencyApprovePlanParameters {
  id: number;
}

export interface CompetencyCompetencyFrameworkViewedParameters {
  id: number;
}

export interface CompetencyCompletePlanParameters {
  plan_id: number;
}

export interface CompetencyCountCompetenciesParameters {
  filters: JsonObject[];
}

export interface CompetencyCountCompetenciesInCourseParameters {
  id: number;
}

export interface CompetencyCountCompetenciesInTemplateParameters {
  id: number;
}

export interface CompetencyCountCompetencyFrameworksParameters {
  context: JsonObject;
  includes?: string;
}

export interface CompetencyCountCourseModuleCompetenciesParameters {
  course_module_id: number;
}

export interface CompetencyCountCoursesUsingCompetencyParameters {
  id: number;
}

export interface CompetencyCountTemplatesParameters {
  context: JsonObject;
  includes?: string;
}

export interface CompetencyCountTemplatesUsingCompetencyParameters {
  id: number;
}

export interface CompetencyCreateCompetencyParameters {
  competency: JsonObject;
}

export interface CompetencyCreateCompetencyFrameworkParameters {
  competency_framework: JsonObject;
}

export interface CompetencyCreatePlanParameters {
  plan: JsonObject;
}

export interface CompetencyCreateTemplateParameters {
  template: JsonObject;
}

export interface CompetencyCreateUserEvidenceCompetencyParameters {
  user_evidence_id: number;
  competency_id: number;
}

export interface CompetencyDeleteCompetencyParameters {
  id: number;
}

export interface CompetencyDeleteCompetencyFrameworkParameters {
  id: number;
}

export interface CompetencyDeletePlanParameters {
  id: number;
}

export interface CompetencyDeleteTemplateParameters {
  id: number;
  delete_plans: boolean;
}

export interface CompetencyDeleteUserEvidenceParameters {
  id: number;
}

export interface CompetencyDeleteUserEvidenceCompetencyParameters {
  user_evidence_id: number;
  competency_id: number;
}

export interface CompetencyDuplicateCompetencyFrameworkParameters {
  id: number;
}

export interface CompetencyDuplicateTemplateParameters {
  id: number;
}

export interface CompetencyGradeCompetencyParameters {
  user_id: number;
  competency_id: number;
  grade: number;
  note?: string;
}

export interface CompetencyGradeCompetencyInPlanParameters {
  plan_id: number;
  competency_id: number;
  grade: number;
  note?: string;
}

export interface CompetencyListCompetenciesParameters {
  filters: JsonObject[];
  sort?: string;
  order?: string;
  skip?: number;
  limit?: number;
}

export interface CompetencyListCompetenciesInTemplateParameters {
  id: number;
}

export interface CompetencyListCompetencyFrameworksParameters {
  sort?: string;
  order?: string;
  skip?: number;
  limit?: number;
  context: JsonObject;
  includes?: string;
  only_visible?: boolean;
  query?: string;
}

export interface CompetencyListCourseModuleCompetenciesParameters {
  course_module_id: number;
}

export interface CompetencyListPlanCompetenciesParameters {
  id: number;
}

export interface CompetencyListTemplatesParameters {
  sort?: string;
  order?: string;
  skip?: number;
  limit?: number;
  context: JsonObject;
  includes?: string;
  only_visible?: boolean;
}

export interface CompetencyListTemplatesUsingCompetencyParameters {
  id: number;
}

export interface CompetencyListUserPlansParameters {
  user_id: number;
}

export interface CompetencyMoveDownCompetencyParameters {
  id: number;
}

export interface CompetencyMoveUpCompetencyParameters {
  id: number;
}

export interface CompetencyPlanCancelReviewRequestParameters {
  id: number;
}

export interface CompetencyPlanRequestReviewParameters {
  id: number;
}

export interface CompetencyPlanStartReviewParameters {
  id: number;
}

export interface CompetencyPlanStopReviewParameters {
  id: number;
}

export interface CompetencyReadCompetencyParameters {
  id: number;
}

export interface CompetencyReadCompetencyFrameworkParameters {
  id: number;
}

export interface CompetencyReadPlanParameters {
  id: number;
}

export interface CompetencyReadTemplateParameters {
  id: number;
}

export interface CompetencyReadUserEvidenceParameters {
  id: number;
}

export interface CompetencyRemoveCompetencyFromCourseParameters {
  course_id: number;
  competency_id: number;
}

export interface CompetencyRemoveCompetencyFromPlanParameters {
  plan_id: number;
  competency_id: number;
}

export interface CompetencyRemoveCompetencyFromTemplateParameters {
  template_id: number;
  competency_id: number;
}

export interface CompetencyRemoveRelatedCompetencyParameters {
  competency_id: number;
  related_competency_id: number;
}

export interface CompetencyReopenPlanParameters {
  plan_id: number;
}

export interface CompetencyReorderCourseCompetencyParameters {
  course_id: number;
  competency_id_from: number;
  competency_id_to: number;
}

export interface CompetencyReorderPlanCompetencyParameters {
  plan_id: number;
  competency_id_from: number;
  competency_id_to: number;
}

export interface CompetencyReorderTemplateCompetencyParameters {
  template_id: number;
  competency_id_from: number;
  competency_id_to: number;
}

export interface CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesParameters {
  id: number;
}

export interface CompetencySearchCompetenciesParameters {
  query: string;
  competency_framework_id: number;
}

export interface CompetencySetCourseCompetencyRuleoutcomeParameters {
  course_competency_id: number;
  rule_outcome: number;
}

export interface CompetencySetParentCompetencyParameters {
  competency_id: number;
  parentid: number;
}

export interface CompetencyTemplateHasRelatedDataParameters {
  id: number;
}

export interface CompetencyTemplateViewedParameters {
  id: number;
}

export interface CompetencyUnapprovePlanParameters {
  id: number;
}

export interface CompetencyUnlinkPlanFromTemplateParameters {
  plan_id: number;
}

export interface CompetencyUpdateCompetencyParameters {
  competency: JsonObject;
}

export interface CompetencyUpdateCompetencyFrameworkParameters {
  competency_framework: JsonObject;
}

export interface CompetencyUpdateCourseCompetencySettingsParameters {
  course_id: number;
  settings: JsonObject;
}

export interface CompetencyUpdatePlanParameters {
  plan: JsonObject;
}

export interface CompetencyUpdateTemplateParameters {
  template: JsonObject;
}

export interface CompetencyUserCompetencyCancelReviewRequestParameters {
  user_id: number;
  competency_id: number;
}

export interface CompetencyUserCompetencyRequestReviewParameters {
  user_id: number;
  competency_id: number;
}

export interface CompetencyUserCompetencyStartReviewParameters {
  user_id: number;
  competency_id: number;
}

export interface CompetencyUserCompetencyStopReviewParameters {
  user_id: number;
  competency_id: number;
}

export interface ContentbankCopyContentParameters {
  contentid: number;
  name: string;
}

export interface ContentbankDeleteContentParameters {
  contentids: number[];
}

export interface ContentbankRenameContentParameters {
  contentid: number;
  name: string;
}

export interface ContentbankSetContentVisibilityParameters {
  contentid: number;
  visibility: number;
}

export interface CourseAddContentItemToUserFavouritesParameters {
  component_name: string;
  content_item_id: number;
}

export interface CourseDeleteModulesParameters {
  course_module_ids: number[];
}

export interface CourseDuplicateCourseParameters {
  course_id: number;
  fullname: string;
  shortname: string;
  category_id: number;
  visible?: number;
  options?: JsonObject[];
}

export interface CourseEditModuleParameters {
  action: string;
  id: number;
  section_return?: number;
}

export interface CourseEditSectionParameters {
  action: string;
  id: number;
  section_return?: number;
}

export interface CourseGetActivityChooserFooterParameters {
  course_id: number;
  section_id: number;
}

export interface CourseGetCourseContentItemsParameters {
  course_id: number;
  sectionnum?: number;
}

export interface CourseGetEnrolledUsersByCmidParameters {
  course_module_id: number;
  group_id?: number;
  only_active?: boolean;
}

export interface CourseGetModuleParameters {
  id: number;
  section_return?: number;
}

export interface CourseImportCourseParameters {
  importfrom: number;
  importto: number;
  delete_content?: number;
  options?: JsonObject[];
}

export interface CourseRemoveContentItemFromUserFavouritesParameters {
  component_name: string;
  content_item_id: number;
}

export interface CourseToggleActivityRecommendationParameters {
  area: string;
  id: number;
}

export interface CourseformatCreateModuleParameters {
  course_id: number;
  modname: string;
  target_section_number: number;
  targetcmid?: number;
}

export interface CourseformatFileHandlersParameters {
  course_id: number;
}

export interface CourseformatGetSectionContentItemsParameters {
  course_id: number;
  section_id: number;
}

export interface CourseformatGetStateParameters {
  course_id: number;
}

export interface CourseformatNewModuleParameters {
  course_id: number;
  modname: string;
  target_section_id: number;
  targetcmid?: number;
}

export interface CourseformatUpdateCourseParameters {
  action: string;
  course_id: number;
  ids?: number[];
  target_section_id?: number;
  targetcmid?: number;
}

export interface CreateUserfeedbackActionRecordParameters {
  action: string;
  context_id: number;
}

export interface CustomfieldConvertCategoryParameters {
  category_id: number;
  component: string;
  area: string;
  item_id: number;
}

export interface CustomfieldCreateCategoryParameters {
  component: string;
  area: string;
  item_id: number;
}

export interface CustomfieldDeleteCategoryParameters {
  id: number;
}

export interface CustomfieldDeleteFieldParameters {
  id: number;
}

export interface CustomfieldMoveCategoryParameters {
  id: number;
  beforeid?: number;
}

export interface CustomfieldMoveFieldParameters {
  id: number;
  category_id: number;
  beforeid?: number;
}

export interface CustomfieldReloadTemplateParameters {
  component: string;
  area: string;
  item_id: number;
}

export interface CustomfieldToggleSharedParameters {
  category_id: number;
  component: string;
  area: string;
  item_id: number;
  state: boolean;
}

export interface DynamicTabsGetContentParameters {
  tab: string;
  jsondata: string;
}

export interface FetchNotificationsParameters {
  context_id: number;
}

export interface FilesUploadParameters {
  context_id?: number;
  component: string;
  filearea: string;
  item_id: number;
  filepath: string;
  filename: string;
  file_content: string;
  context_level?: string;
  instance_id?: number;
}

export interface FormDynamicFormParameters {
  form: string;
  formdata: string;
}

export interface FormGetFiletypesBrowserDataParameters {
  onlytypes?: string;
  allowall?: boolean;
  current?: string;
}

export interface GetFragmentParameters {
  component: string;
  callback: string;
  context_id: number;
  args?: JsonObject[];
}

export interface GetStringParameters {
  stringid: string;
  component?: string;
  lang?: string;
  string_parameters?: JsonObject[];
}

export interface GetStringsParameters {
  strings: JsonObject[];
}

export interface GetUserDatesParameters {
  context_id?: number;
  context_level?: string;
  instance_id?: number;
  timestamps: JsonObject[];
}

export interface GradingGetDefinitionsParameters {
  course_module_ids: number[];
  areaname: string;
  activeonly?: boolean;
}

export interface GradingGetGradingformInstancesParameters {
  definition_id: number;
  since?: number;
}

export interface GradingSaveDefinitionsParameters {
  areas: JsonObject[];
}

export interface MessageGetMessageProcessorParameters {
  user_id: number;
  name: string;
}

export interface MessageGetUnsentMessageParameters {}

export interface MessageSetDefaultNotificationParameters {
  preference: string;
  state: number;
}

export interface MessageSetUnsentMessageParameters {
  message: string;
  conversation_id: number;
  other_user_id: number;
}

export interface MoodlenetAuthCheckParameters {
  issuerid: number;
  course_id: number;
}

export interface MoodlenetGetShareInfoActivityParameters {
  course_module_id: number;
}

export interface MoodlenetGetSharedCourseInfoParameters {
  course_id: number;
}

export interface MoodlenetSendActivityParameters {
  issuerid: number;
  course_module_id: number;
  share_format: number;
}

export interface MoodlenetSendCourseParameters {
  issuerid: number;
  course_id: number;
  share_format: number;
  course_module_ids?: number[];
}

export interface NotesGetNotesParameters {
  notes: number[];
}

export interface NotesUpdateNotesParameters {
  notes?: JsonObject[];
}

export interface OutputLoadTemplateParameters {
  component: string;
  template: string;
  themename: string;
  include_comments?: boolean;
}

export interface OutputLoadTemplateWithDependenciesParameters {
  component: string;
  template: string;
  themename: string;
  include_comments?: boolean;
  lang?: string;
}

export interface OutputPollStoredProgressParameters {
  ids: number[];
}

export interface PaymentGetAvailableGatewaysParameters {
  component: string;
  payment_area: string;
  item_id: number;
}

export interface QuestionGetRandomQuestionSummariesParameters {
  category_id: number;
  include_subcategories: boolean;
  tagids: number[];
  context_id: number;
  limit?: number;
  offset?: number;
}

export interface QuestionMoveQuestionsParameters {
  new_context_id: number;
  new_category_id: number;
  question_ids: string;
  returnurl: string;
}

export interface QuestionSearchSharedBanksParameters {
  context_id: number;
  search: string;
  required_capabilities?: string[];
}

export interface ReportbuilderAudiencesDeleteParameters {
  report_id: number;
  instance_id: number;
}

export interface ReportbuilderColumnsAddParameters {
  report_id: number;
  unique_identifier: string;
}

export interface ReportbuilderColumnsDeleteParameters {
  report_id: number;
  columnid: number;
}

export interface ReportbuilderColumnsReorderParameters {
  report_id: number;
  columnid: number;
  position: number;
}

export interface ReportbuilderColumnsSortGetParameters {
  report_id: number;
}

export interface ReportbuilderColumnsSortReorderParameters {
  report_id: number;
  columnid: number;
  position: number;
}

export interface ReportbuilderColumnsSortToggleParameters {
  report_id: number;
  columnid: number;
  enabled: boolean;
  direction?: number;
}

export interface ReportbuilderConditionsAddParameters {
  report_id: number;
  unique_identifier: string;
}

export interface ReportbuilderConditionsDeleteParameters {
  report_id: number;
  condition_id: number;
}

export interface ReportbuilderConditionsReorderParameters {
  report_id: number;
  condition_id: number;
  position: number;
}

export interface ReportbuilderConditionsResetParameters {
  report_id: number;
}

export interface ReportbuilderFiltersAddParameters {
  report_id: number;
  unique_identifier: string;
}

export interface ReportbuilderFiltersDeleteParameters {
  report_id: number;
  filter_id: number;
}

export interface ReportbuilderFiltersReorderParameters {
  report_id: number;
  filter_id: number;
  position: number;
}

export interface ReportbuilderFiltersResetParameters {
  report_id: number;
  parameters?: string;
}

export interface ReportbuilderReportsDeleteParameters {
  report_id: number;
}

export interface ReportbuilderReportsGetParameters {
  report_id: number;
  editmode?: boolean;
  page_size?: number;
}

export interface ReportbuilderSchedulesDeleteParameters {
  report_id: number;
  scheduleid: number;
}

export interface ReportbuilderSchedulesSendParameters {
  report_id: number;
  scheduleid: number;
}

export interface ReportbuilderSchedulesToggleParameters {
  report_id: number;
  scheduleid: number;
  enabled: boolean;
}

export interface ReportbuilderSetFiltersParameters {
  report_id: number;
  parameters?: string;
  values: string;
}

export interface SearchGetRelevantUsersParameters {
  query: string;
  course_id: number;
}

export interface SessionTimeRemainingParameters {}

export interface SessionTouchParameters {}

export interface SmsSetGatewayStatusParameters {
  plugin: number;
  state: number;
}

export interface TagGetTagsParameters {
  tags: JsonObject[];
}

export interface TagUpdateTagsParameters {
  tags: JsonObject[];
}

export interface UpdateInplaceEditableParameters {
  component: string;
  item_type: string;
  item_id: string;
  value: string;
}

export interface UserGetUsersParameters {
  criteria: JsonObject[];
}

export interface UserSearchIdentityParameters {
  query: string;
}

export interface CustomfieldNumberRecalculateValueParameters {
  field_id: number;
  instance_id: number;
  component?: string;
  area?: string;
  item_id?: number;
}

export interface EnrolMetaAddInstancesParameters {
  instances?: JsonObject[];
}

export interface EnrolMetaDeleteInstancesParameters {
  instances?: JsonObject[];
}

export interface GradingformGuideGraderGradingpanelFetchParameters {
  component: string;
  context_id: number;
  item_name: string;
  graded_user_id: number;
}

export interface GradingformGuideGraderGradingpanelStoreParameters {
  component: string;
  context_id: number;
  item_name: string;
  graded_user_id: number;
  notifyuser?: boolean;
  formdata: string;
}

export interface GradingformRubricGraderGradingpanelFetchParameters {
  component: string;
  context_id: number;
  item_name: string;
  graded_user_id: number;
}

export interface GradingformRubricGraderGradingpanelStoreParameters {
  component: string;
  context_id: number;
  item_name: string;
  graded_user_id: number;
  notifyuser?: boolean;
  formdata: string;
}

export interface MediaVideojsGetLanguageParameters {
  lang: string;
}

export interface PaygwPaypalCreateTransactionCompleteParameters {
  component: string;
  payment_area: string;
  item_id: number;
  order_id: string;
}

export interface PaygwPaypalGetConfigForJsParameters {
  component: string;
  payment_area: string;
  item_id: number;
}

export interface QbankColumnsortorderSetColumnSizeParameters {
  sizes?: string;
  global?: boolean;
}

export interface QbankColumnsortorderSetColumnbankOrderParameters {
  columns?: string[];
  global?: boolean;
}

export interface QbankColumnsortorderSetHiddenColumnsParameters {
  columns?: string[];
  global?: boolean;
}

export interface QbankEditquestionSetStatusParameters {
  question_id: number;
  status: string;
}

export interface QbankManagecategoriesMoveCategoryParameters {
  page_context_id: number;
  category_id: number;
  target_parent_id: number;
  preceding_sibling_id: number;
}

export interface QbankTagquestionSubmitTagsFormParameters {
  question_id: number;
  context_id: number;
  formdata: string;
}

export interface QbankViewquestiontextSetQuestionTextFormatParameters {
  format: number;
}

export interface QuizaccessSebValidateQuizKeysParameters {
  course_module_id: number;
  url: string;
  configkey?: string;
  browser_exam_key?: string;
}

export interface ReportCompetencyDataForReportParameters {
  course_id: number;
  user_id: number;
  module_id: number;
}

export interface TinyAutosaveResetSessionParameters {
  context_id: number;
  pagehash: string;
  page_instance: string;
  elementid: string;
}

export interface TinyAutosaveResumeSessionParameters {
  context_id: number;
  pagehash: string;
  page_instance: string;
  elementid: string;
  draftid: number;
}

export interface TinyAutosaveUpdateSessionParameters {
  context_id: number;
  pagehash: string;
  page_instance: string;
  elementid: string;
  drafttext: string;
}

export interface TinyEquationFilterParameters {
  context_id: number;
  content: string;
  striptags?: boolean;
}

export interface TinyMediaPreviewParameters {
  context_id: number;
  content: string;
}

export interface AdminPresetsDeletePresetParameters {
  id: number;
}

export interface BehatGetEntityGeneratorParameters {
  entitytype: string;
}

export interface DataprivacyApproveDataRequestParameters {
  request_id: number;
}

export interface DataprivacyBulkApproveDataRequestsParameters {
  requestids: number[];
}

export interface DataprivacyBulkDenyDataRequestsParameters {
  requestids: number[];
}

export interface DataprivacyConfirmContextsForDeletionParameters {
  ids?: number[];
}

export interface DataprivacyCreateCategoryFormParameters {
  json_form_data: string;
}

export interface DataprivacyCreatePurposeFormParameters {
  json_form_data: string;
}

export interface DataprivacyDeleteCategoryParameters {
  id: number;
}

export interface DataprivacyDeletePurposeParameters {
  id: number;
}

export interface DataprivacyDenyDataRequestParameters {
  request_id: number;
}

export interface DataprivacyGetActivityOptionsParameters {
  nodefaults?: boolean;
}

export interface DataprivacyGetCategoryOptionsParameters {
  include_inherited?: boolean;
  include_not_set?: boolean;
}

export interface DataprivacyGetDataRequestParameters {
  request_id: number;
}

export interface DataprivacyGetPurposeOptionsParameters {
  include_inherited?: boolean;
  include_not_set?: boolean;
}

export interface DataprivacyGetUsersParameters {
  query: string;
}

export interface DataprivacyMarkCompleteParameters {
  request_id: number;
}

export interface DataprivacySetContextDefaultsParameters {
  context_level: number;
  category: number;
  purpose: number;
  activity?: string;
  override?: boolean;
}

export interface DataprivacySetContextFormParameters {
  json_form_data: string;
}

export interface DataprivacySetContextlevelFormParameters {
  json_form_data: string;
}

export interface DataprivacySubmitSelectedCoursesFormParameters {
  request_id: number;
  json_form_data: string;
}

export interface DataprivacyTreeExtraBranchesParameters {
  context_id: number;
  element: string;
}

export interface LpDataForCompetenciesManagePageParameters {
  competency_framework_id: number;
  search?: string;
}

export interface LpDataForCompetencyFrameworksManagePageParameters {
  page_context: JsonObject;
}

export interface LpDataForCompetencySummaryParameters {
  competency_id: number;
  include_related?: boolean;
  include_courses?: boolean;
}

export interface LpDataForRelatedCompetenciesSectionParameters {
  competency_id: number;
}

export interface LpDataForTemplateCompetenciesPageParameters {
  template_id: number;
  page_context: JsonObject;
}

export interface LpDataForTemplatesManagePageParameters {
  page_context: JsonObject;
}

export interface LpListCoursesUsingCompetencyParameters {
  id: number;
}

export interface LpSearchCohortsParameters {
  query: string;
  context: JsonObject;
  includes?: string;
  offset?: number;
  limit?: number;
}

export interface LpSearchUsersParameters {
  query: string;
  capability: string;
  offset?: number;
  limit?: string;
}

export interface PolicySubmitAcceptOnBehalfParameters {
  json_form_data: string;
}

export interface TemplatelibraryListTemplatesParameters {
  component?: string;
  search?: string;
  themename?: string;
}

export interface TemplatelibraryLoadCanonicalTemplateParameters {
  component: string;
  template: string;
}

export interface UsertoursCompleteTourParameters {
  tourid: number;
  context: number;
  pageurl: string;
  stepid: number;
  stepindex: number;
}

export interface UsertoursFetchAndStartTourParameters {
  tourid: number;
  context: number;
  pageurl: string;
}

export interface UsertoursResetTourParameters {
  tourid: number;
  context: number;
  pageurl: string;
}

export interface UsertoursStepShownParameters {
  tourid: number;
  context: number;
  pageurl: string;
  stepid: number;
  stepindex: number;
}

export interface XmldbInvokeMoveActionParameters {
  action: string;
  dir: string;
  table: string;
  field?: string;
  key?: string;
  index?: string;
  position: number;
}

export interface GradesGetEnrolledUsersForSearchWidgetParameters {
  course_id: number;
  actionbaseurl: string;
  group_id?: number;
}

export interface GradesGetGroupsForSearchWidgetParameters {
  course_id: number;
  course_module_id?: number;
}

export interface OutputLoadFontawesomeIconMapParameters {}

export interface ModAssignDeleteOverridesParameters {
  data: JsonObject;
}

export interface ModAssignGetOverridesParameters {
  assignid: number;
}

export interface ModAssignSaveOverridesParameters {
  data: JsonObject;
}

export interface ModChatGetChatLatestMessagesParameters {
  chatsid: string;
  chatlasttime?: number;
}

export interface ModChatGetChatUsersParameters {
  chatsid: string;
}

export interface ModChatGetChatsByCoursesParameters {
  course_ids?: number[];
}

export interface ModChatGetSessionMessagesParameters {
  chatid: number;
  sessionstart: number;
  sessionend: number;
  group_id?: number;
}

export interface ModChatGetSessionsParameters {
  chatid: number;
  group_id?: number;
  showall?: boolean;
}

export interface ModChatLoginUserParameters {
  chatid: number;
  group_id?: number;
}

export interface ModChatSendChatMessageParameters {
  chatsid: string;
  messagetext: string;
  beepid?: string;
}

export interface ModChatViewChatParameters {
  chatid: number;
}

export interface ModChatViewSessionsParameters {
  course_module_id: number;
  start?: number;
  end?: number;
}

export interface ModForumSetReadStateParameters {
  postid: number;
  targetstate: boolean;
}

export interface ModQuizGetUsersInReportParameters {
  course_module_id: number;
  mode: string;
  params: string;
}

export interface ModSurveyGetQuestionsParameters {
  surveyid: number;
}

export interface ModSurveyGetSurveysByCoursesParameters {
  course_ids?: number[];
}

export interface ModSurveySubmitAnswersParameters {
  surveyid: number;
  answers: JsonObject[];
}

export interface ModSurveyViewSurveyParameters {
  surveyid: number;
}

export interface ReportInsightsSetFixedPredictionParameters {
  predictionid: number;
}

export interface ReportInsightsSetNotusefulPredictionParameters {
  predictionid: number;
}

export interface GetSiteInfoResponse {
  site_name: string;
  site_url: string;
  moodle_version: string;
  moodle_release: string;
  user_id: number;
  username: string;
  full_name: string;
}

export type GetCoursesResponse = {
  id: number;
  fullname: string;
  shortname: string;
  category_id: number;
  visible: boolean;
  start_date: number | null;
  end_date: number | null;
}[];

export interface GetCourseResponse {
  id: number;
  fullname: string;
  shortname: string;
  category_id: number;
  visible: boolean;
  start_date: number | null;
  end_date: number | null;
}

export interface CreateCourseResponse {
  id: number;
  shortname: string;
}

export interface UpdateCourseResponse {
  updated: boolean;
  course_id: number;
}

export interface DeleteCourseResponse {
  deleted: boolean;
  course_id: number;
  warnings: JsonObject[];
}

export type GetCourseContentsResponse = JsonObject[];

export type GetUsersByFieldResponse = JsonObject[];

export interface CreateUserResponse {
  id: number;
  username: string;
}

export interface UpdateUserResponse {
  updated: boolean;
  user_id: number;
}

export interface DeleteUserResponse {
  deleted: boolean;
  user_id: number;
}

export interface EnrolUserResponse {
  enrolled: boolean;
  course_id: number;
  user_id: number;
  role_id: number;
}

export interface UnenrolUserResponse {
  unenrolled: boolean;
  course_id: number;
  user_id: number;
}

export type GetCourseGroupsResponse = JsonObject[];

export interface CreateGroupResponse {
  id: number;
  name: string;
}

export interface DeleteGroupResponse {
  deleted: boolean;
  group_id: number;
}

export interface AddGroupMemberResponse {
  added: boolean;
  group_id: number;
  user_id: number;
}

export interface RemoveGroupMemberResponse {
  removed: boolean;
  group_id: number;
  user_id: number;
}

export type GetCourseCategoriesResponse = {
  id: number;
  name: string;
  idnumber: string | null;
  description: string;
  parent_id: number;
  course_count: number;
  visible: boolean | null;
}[];

export interface GetCourseCategoryResponse {
  id: number;
  name: string;
  idnumber: string | null;
  description: string;
  parent_id: number;
  course_count: number;
  visible: boolean | null;
}

export type GetEnrolledUsersResponse = JsonObject[];

export type GetCohortsResponse = JsonObject[];

export interface GetGroupMembersResponse {
  group_id: number;
  user_ids: number[];
}

export type GetCourseGroupingsResponse = JsonObject[];

export interface GetActivityCompletionStatusesResponse {
  statuses: {
    cmid: number;
    modname: string;
    instance: number;
    state: number;
    timecompleted: number;
    tracking: number;
    overrideby?: number;
    valueused?: boolean;
    hascompletion?: boolean;
    isautomatic?: boolean;
    istrackeduser?: boolean;
    uservisible?: boolean;
    details: {
      rulename: string;
      rulevalue: {
        status: number;
        description: string;
      };
    }[];
    isoverallcomplete?: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseCompletionStatusResponse {
  completionstatus: {
    completed: boolean;
    aggregation: number;
    completions: {
      type: number;
      title: string;
      status: string;
      complete: boolean;
      timecompleted: number;
      details: {
        type: string;
        criteria: string;
        requirement: string;
        status: string;
      };
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCalendarEventsResponse {
  events: {
    id: number;
    name: string;
    description?: string;
    format: number;
    courseid: number;
    categoryid?: number;
    groupid: number;
    userid: number;
    repeatid: number;
    modulename?: string;
    instance: number;
    eventtype: string;
    timestart: number;
    timeduration: number;
    visible: number;
    uuid?: string;
    sequence: number;
    timemodified: number;
    subscriptionid?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradeItemsResponse {
  usergrades: {
    courseid: number;
    courseidnumber: string;
    userid: number;
    userfullname: string;
    useridnumber: string;
    maxdepth: number;
    gradeitems: {
      id: number;
      itemname: string;
      itemtype: string;
      itemmodule: string;
      iteminstance: number;
      itemnumber: number;
      idnumber: string;
      categoryid: number;
      outcomeid: number;
      scaleid: number;
      locked?: boolean;
      cmid?: number;
      weightraw?: number;
      weightformatted?: string;
      status?: string;
      graderaw?: number;
      gradedatesubmitted?: number;
      gradedategraded?: number;
      gradehiddenbydate?: boolean;
      gradeneedsupdate?: boolean;
      gradeishidden?: boolean;
      gradeislocked?: boolean;
      gradeisoverridden?: boolean;
      gradeformatted?: string;
      grademin?: number;
      grademax?: number;
      rangeformatted?: string;
      percentageformatted?: string;
      lettergradeformatted?: string;
      rank?: number;
      numusers?: number;
      averageformatted?: string;
      feedback?: string;
      feedbackformat?: number;
      parentcategoryid?: number;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateCourseCategoryResponse {
  id: number;
  name: string;
}

export interface UpdateCourseCategoryResponse {
  updated: boolean;
  category_id: number;
}

export interface DeleteCourseCategoryResponse {
  deleted: boolean;
  category_id: number;
  warnings: JsonObject[];
}

export type GetGroupResponse = {
  id: number;
  courseid: number;
  name: string;
  description: string;
  descriptionformat: number;
  enrolmentkey: string;
  idnumber: string;
  visibility: number;
  participation: boolean;
  customfields: {
    name: string;
    shortname: string;
    type: string;
    valueraw: string;
    value: string;
  }[];
}[];

export interface UpdateGroupResponse {
  updated: boolean;
  group_id: number;
}

export interface CreateGroupingResponse {
  id: number;
  name: string;
}

export type GetGroupingResponse = {
  id: number;
  courseid: number;
  name: string;
  description: string;
  descriptionformat: number;
  idnumber: string;
  customfields: {
    name: string;
    shortname: string;
    type: string;
    valueraw: string;
    value: string;
  }[];
  groups?: {
    id: number;
    courseid: number;
    name: string;
    description: string;
    descriptionformat: number;
    enrolmentkey: string;
    idnumber: string;
    customfields: {
      name: string;
      shortname: string;
      type: string;
      valueraw: string;
      value: string;
    }[];
  }[];
}[];

export interface UpdateGroupingResponse {
  updated: boolean;
  grouping_id: number;
}

export interface DeleteGroupingResponse {
  deleted: boolean;
  grouping_id: number;
}

export interface AddGroupToGroupingResponse {
  added: boolean;
  grouping_id: number;
  group_id: number;
}

export interface RemoveGroupFromGroupingResponse {
  removed: boolean;
  grouping_id: number;
  group_id: number;
}

export interface CreateCohortResponse {
  id: number;
  name: string;
}

export interface UpdateCohortResponse {
  updated: boolean;
  cohort_id: number;
}

export interface DeleteCohortResponse {
  deleted: boolean;
  cohort_id: number;
}

export interface GetCohortMembersResponse {
  cohort_id: number;
  user_ids: number[];
}

export interface SearchCohortsResponse {
  cohorts: {
    id: number;
    name: string;
    idnumber: string;
    description: string;
    descriptionformat: number;
    visible: boolean;
    theme?: string;
    customfields: {
      name: string;
      shortname: string;
      type: string;
      valueraw: string;
      value: string;
    }[];
  }[];
}

export interface AddCohortMemberResponse {
  added: boolean;
  cohort_id: number;
  user_id: number;
  warnings: JsonObject[];
}

export interface RemoveCohortMemberResponse {
  removed: boolean;
  cohort_id: number;
  user_id: number;
}

export interface AssignRoleResponse {
  assigned: boolean;
  role_id: number;
  user_id: number;
}

export interface UnassignRoleResponse {
  unassigned: boolean;
  role_id: number;
  user_id: number;
}

export type GetUserCoursesResponse = JsonObject[];

export type GetCourseEnrolmentMethodsResponse = JsonObject[];

export type GetEnrolledUsersWithCapabilityResponse = JsonObject[];

export type SearchEnrolledUsersResponse = {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname: string;
  initials?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  department?: string;
  institution?: string;
  idnumber?: string;
  interests?: string;
  firstaccess?: string;
  lastaccess?: string;
  auth?: string;
  suspended?: string;
  confirmed?: string;
  lang?: string;
  calendartype?: string;
  theme?: string;
  timezone?: string;
  mailformat?: string;
  trackforums?: string;
  description?: string;
  descriptionformat?: number;
  city?: string;
  country?: string;
  profileimageurlsmall: string;
  profileimageurl: string;
  customfields?: {
    type: string;
    value: string;
    displayvalue?: string;
    name: string;
    shortname: string;
  }[];
  preferences?: {
    name: string;
    value: string;
  }[];
}[];

export type GetPotentialEnrolmentUsersResponse = {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname: string;
  initials?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  department?: string;
  institution?: string;
  idnumber?: string;
  interests?: string;
  firstaccess?: string;
  lastaccess?: string;
  auth?: string;
  suspended?: string;
  confirmed?: string;
  lang?: string;
  calendartype?: string;
  theme?: string;
  timezone?: string;
  mailformat?: string;
  trackforums?: string;
  description?: string;
  descriptionformat?: number;
  city?: string;
  country?: string;
  profileimageurlsmall: string;
  profileimageurl: string;
  customfields?: {
    type: string;
    value: string;
    displayvalue?: string;
    name: string;
    shortname: string;
  }[];
  preferences?: {
    name: string;
    value: string;
  }[];
}[];

export interface GetSelfEnrolmentInfoResponse {
  id: number;
  courseid: number;
  type: string;
  name: string;
  status: string;
  enrolpassword?: string;
}

export interface SelfEnrolResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateUserEnrolmentResponse {
  result: boolean;
  validationerror: boolean;
}

export interface DeleteUserEnrolmentResponse {
  result: boolean;
  errors: {
    key: string;
    message: string;
  }[];
}

export interface GetGradesTableResponse {
  tables: {
    courseid: number;
    userid: number;
    userfullname: string;
    maxdepth: number;
    tabledata: {
      itemname?: {
        class: string;
        colspan: number;
        content: string;
        id: string;
      };
      leader?: {
        class: string;
        rowspan: number;
      };
      weight?: {
        class: string;
        content: string;
        headers: string;
      };
      grade?: {
        class: string;
        content: string;
        headers: string;
      };
      range?: {
        class: string;
        content: string;
        headers: string;
      };
      percentage?: {
        class: string;
        content: string;
        headers: string;
      };
      lettergrade?: {
        class: string;
        content: string;
        headers: string;
      };
      rank?: {
        class: string;
        content: string;
        headers: string;
      };
      average?: {
        class: string;
        content: string;
        headers: string;
      };
      feedback?: {
        class: string;
        content: string;
        headers: string;
      };
      contributiontocoursetotal?: {
        class: string;
        content: string;
        headers: string;
      };
      parentcategories: number[];
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserCourseGradesResponse {
  grades: {
    courseid: number;
    grade: string;
    rawgrade: string;
    rank?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradeAccessInformationResponse {
  canviewusergradereport: boolean;
  canviewmygrades: boolean;
  canviewallgrades: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradebookItemsResponse {
  gradeItems: {
    id: string;
    itemname: string;
    category?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetGradeTreeResponse = string;

export interface GetGradableUsersResponse {
  users: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradeFeedbackResponse {
  feedbacktext: string;
  title: string;
  fullname: string;
  picture: string;
  additionalfield: string;
}

export interface CreateGradeCategoryResponse {
  categoryids: number[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateGradeValueResponse {
  status: number;
}

export interface SetActivityCompletionStatusResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface OverrideActivityCompletionStatusResponse {
  cmid: number;
  userid: number;
  state: number;
  timecompleted: number;
  overrideby: number;
  tracking: number;
}

export interface MarkCourseSelfCompletedResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UploadDraftFileResponse {
  component: string;
  context_id: number;
  user_id: number;
  file_area: string;
  filename: string;
  file_path: string;
  item_id: number;
}

export interface DownloadFileResponse {
  destination_path: string;
  size: number;
  content_type: string | null;
}

export interface GetCourseAssignmentsResponse {
  courses: {
    id: number;
    fullname: string;
    shortname: string;
    timemodified: number;
    assignments: {
      id: number;
      coursemodule: number;
      course: number;
      name: string;
      intro: string;
      introformat: number;
      introfiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
      section?: number;
      visible?: boolean;
      groupmode?: number;
      groupingid?: number;
      lang?: string;
      enableaitools?: number;
      enabledaiactions?: string;
      cmid: number;
      nosubmissions: number;
      submissiondrafts: number;
      sendnotifications: number;
      sendlatenotifications: number;
      sendstudentnotifications: number;
      duedate: number;
      allowsubmissionsfromdate: number;
      grade: number;
      gradepenalty: number;
      timemodified: number;
      completionsubmit: number;
      cutoffdate: number;
      gradingduedate: number;
      teamsubmission: number;
      requireallteammemberssubmit: number;
      teamsubmissiongroupingid: number;
      blindmarking: number;
      hidegrader: number;
      revealidentities: number;
      attemptreopenmethod: string;
      maxattempts: number;
      markingworkflow: number;
      markingallocation: number;
      markercount: number;
      optionalmarkercount?: number;
      multimarkmethod: string;
      multimarkrounding: number;
      markinganonymous: number;
      requiresubmissionstatement: number;
      preventsubmissionnotingroup?: number;
      submissionstatement?: string;
      submissionstatementformat?: number;
      configs: {
        id?: number;
        assignment?: number;
        plugin: string;
        subtype: string;
        name: string;
        value: string;
      }[];
      introattachments?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
      activity?: string;
      activityformat?: number;
      activityattachments?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
      timelimit?: number;
      submissionattachments?: number;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAssignmentSubmissionsResponse {
  assignments: {
    assignmentid: number;
    submissions: {
      id: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      timestarted?: number;
      status: string;
      groupid: number;
      assignment?: number;
      latest?: number;
      plugins?: {
        type: string;
        name: string;
        fileareas?: {
          area: string;
          files?: {
            filename: string;
            filepath: string;
            filesize: number;
            fileurl: string;
            timemodified: number;
            mimetype: string;
            isexternal?: boolean;
            repositorytype?: string;
          }[];
        }[];
        editorfields?: {
          name: string;
          description: string;
          text: string;
          format: number;
        }[];
      }[];
      gradingstatus?: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAssignmentGradesResponse {
  assignments: {
    assignmentid: number;
    grades: {
      id: number;
      assignment?: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      grader: number;
      grade: string;
      gradefordisplay?: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAssignmentSubmissionStatusResponse {
  gradingsummary?: {
    participantcount: number;
    submissiondraftscount: number;
    submissionsenabled: boolean;
    submissionssubmittedcount: number;
    submissionsneedgradingcount: number;
    warnofungroupedusers: string;
  };
  lastattempt?: {
    submission: {
      id: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      timestarted?: number;
      status: string;
      groupid: number;
      assignment?: number;
      latest?: number;
      plugins?: {
        type: string;
        name: string;
        fileareas?: {
          area: string;
          files?: {
            filename: string;
            filepath: string;
            filesize: number;
            fileurl: string;
            timemodified: number;
            mimetype: string;
            isexternal?: boolean;
            repositorytype?: string;
          }[];
        }[];
        editorfields?: {
          name: string;
          description: string;
          text: string;
          format: number;
        }[];
      }[];
      gradingstatus?: string;
    };
    teamsubmission: {
      id: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      timestarted?: number;
      status: string;
      groupid: number;
      assignment?: number;
      latest?: number;
      plugins?: {
        type: string;
        name: string;
        fileareas?: {
          area: string;
          files?: {
            filename: string;
            filepath: string;
            filesize: number;
            fileurl: string;
            timemodified: number;
            mimetype: string;
            isexternal?: boolean;
            repositorytype?: string;
          }[];
        }[];
        editorfields?: {
          name: string;
          description: string;
          text: string;
          format: number;
        }[];
      }[];
      gradingstatus?: string;
    };
    submissiongroup?: number;
    submissiongroupmemberswhoneedtosubmit?: number[];
    submissionsenabled: boolean;
    locked: boolean;
    graded: boolean;
    canedit: boolean;
    caneditowner: boolean;
    cansubmit: boolean;
    extensionduedate: number;
    timelimit?: number;
    blindmarking: boolean;
    gradingstatus: string;
    usergroups: number[];
  };
  feedback?: {
    grade: {
      id: number;
      assignment?: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      grader: number;
      grade: string;
      gradefordisplay?: string;
    };
    gradefordisplay: string;
    gradeddate: number;
    plugins?: {
      type: string;
      name: string;
      fileareas?: {
        area: string;
        files?: {
          filename: string;
          filepath: string;
          filesize: number;
          fileurl: string;
          timemodified: number;
          mimetype: string;
          isexternal?: boolean;
          repositorytype?: string;
        }[];
      }[];
      editorfields?: {
        name: string;
        description: string;
        text: string;
        format: number;
      }[];
    }[];
  };
  previousattempts?: {
    attemptnumber: number;
    submission: {
      id: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      timestarted?: number;
      status: string;
      groupid: number;
      assignment?: number;
      latest?: number;
      plugins?: {
        type: string;
        name: string;
        fileareas?: {
          area: string;
          files?: {
            filename: string;
            filepath: string;
            filesize: number;
            fileurl: string;
            timemodified: number;
            mimetype: string;
            isexternal?: boolean;
            repositorytype?: string;
          }[];
        }[];
        editorfields?: {
          name: string;
          description: string;
          text: string;
          format: number;
        }[];
      }[];
      gradingstatus?: string;
    };
    grade: {
      id: number;
      assignment?: number;
      userid: number;
      attemptnumber: number;
      timecreated: number;
      timemodified: number;
      grader: number;
      grade: string;
      gradefordisplay?: string;
    };
    feedbackplugins?: {
      type: string;
      name: string;
      fileareas?: {
        area: string;
        files?: {
          filename: string;
          filepath: string;
          filesize: number;
          fileurl: string;
          timemodified: number;
          mimetype: string;
          isexternal?: boolean;
          repositorytype?: string;
        }[];
      }[];
      editorfields?: {
        name: string;
        description: string;
        text: string;
        format: number;
      }[];
    }[];
  }[];
  assignmentdata?: {
    attachments?: {
      intro?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
      activity?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
    activity?: string;
    activityformat?: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetAssignmentParticipantsResponse = JsonObject[];

export interface GetAssignmentParticipantResponse {
  id: number;
  fullname: string;
  submitted: boolean;
  requiregrading: boolean;
  grantedextension: boolean;
  blindmarking: boolean;
  allowsubmissionsfromdate: number;
  duedate: number;
  cutoffdate: number;
  duedatestr: string;
  groupid?: number;
  groupname?: string;
  submissionstatus?: string;
  user: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  };
}

export interface StartAssignmentSubmissionResponse {
  submissionid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type SaveAssignmentSubmissionResponse = JsonObject[];

export type SubmitAssignmentForGradingResponse = JsonObject[];

export interface SaveAssignmentGradeResponse {
  saved: boolean;
  assignment_id: number;
  user_id: number;
}

export type SetAssignmentUserFlagsResponse = JsonObject[];

export interface GetAssignmentUserFlagsResponse {
  assignments: {
    assignmentid: number;
    userflags: {
      id: number;
      userid: number;
      locked: number;
      mailed: number;
      extensionduedate: number;
      workflowstate?: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAssignmentUserMappingsResponse {
  assignments: {
    assignmentid: number;
    mappings: {
      id: number;
      userid: number;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type LockAssignmentSubmissionsResponse = JsonObject[];

export type UnlockAssignmentSubmissionsResponse = JsonObject[];

export type RevertAssignmentSubmissionsToDraftResponse = JsonObject[];

export type SetAssignmentExtensionResponse = JsonObject[];

export type RevealAssignmentIdentitiesResponse = JsonObject[];

export type CopyPreviousAssignmentAttemptResponse = JsonObject[];

export interface RemoveAssignmentSubmissionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewAssignmentResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewAssignmentSubmissionStatusResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewAssignmentGradingTableResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetCourseForumsResponse = JsonObject[];

export interface GetForumDiscussionsResponse {
  discussions: {
    id: number;
    name: string;
    groupid: number;
    timemodified: number;
    usermodified: number;
    timestart: number;
    timeend: number;
    discussion: number;
    parent: number;
    userid: number;
    created: number;
    modified: number;
    mailed: number;
    subject: string;
    message: string;
    messageformat: number;
    messagetrust: number;
    messageinlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: string;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    totalscore: number;
    mailnow: number;
    userfullname: string;
    userinitials?: string;
    usermodifiedfullname: string;
    usermodifiedinitials?: string;
    userpictureurl: string;
    usermodifiedpictureurl: string;
    numreplies: number;
    numunread: number;
    pinned: boolean;
    locked: boolean;
    starred: boolean;
    canreply: boolean;
    canlock: boolean;
    canfavourite: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetForumDiscussionPostsResponse {
  posts: Record<string, never>[];
  forumid: number;
  courseid: number;
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetForumPostResponse {
  post: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetForumPostsByUserResponse {
  discussions: {
    name: string;
    id: number;
    timecreated: number;
    authorfullname: string;
    posts: {
      userposts: Record<string, never>[];
      parentposts: Record<string, never>[];
    };
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetForumAccessInformationResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CanAddForumDiscussionResponse {
  status: boolean;
  canpindiscussions?: boolean;
  cancreateattachment?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateForumDiscussionResponse {
  discussionid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ReplyToForumPostResponse {
  postid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
  post: Record<string, never>;
  messages?: {
    type: string;
    message: string;
  }[];
}

export interface UpdateForumPostResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteForumPostResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface PrepareForumPostDraftResponse {
  draftitemid: number;
  files?: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  areaoptions: {
    name: string;
    value: string;
  }[];
  messagetext: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type SetForumSubscriptionResponse = Record<string, never>;

export type SetForumTrackingResponse = Record<string, never>;

export type SetForumDiscussionSubscriptionResponse = Record<string, never>;

export type SetForumDiscussionFavouriteResponse = Record<string, never>;

export type SetForumDiscussionPinResponse = Record<string, never>;

export interface SetForumDiscussionLockResponse {
  id: number;
  locked: boolean;
  times: {
    locked: number;
  };
}

export type MarkForumPostsReadResponse = boolean;

export interface ViewForumResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewForumDiscussionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseQuizzesResponse {
  quizzes: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    timeopen?: number;
    timeclose?: number;
    timelimit?: number;
    overduehandling?: string;
    graceperiod?: number;
    preferredbehaviour?: string;
    canredoquestions?: number;
    attempts?: number;
    attemptonlast?: number;
    grademethod?: number;
    decimalpoints?: number;
    questiondecimalpoints?: number;
    reviewattempt?: number;
    reviewcorrectness?: number;
    reviewmaxmarks?: number;
    reviewmarks?: number;
    reviewspecificfeedback?: number;
    reviewgeneralfeedback?: number;
    reviewrightanswer?: number;
    reviewoverallfeedback?: number;
    questionsperpage?: number;
    navmethod?: string;
    shuffleanswers?: number;
    sumgrades?: number;
    grade?: number;
    timecreated?: number;
    timemodified?: number;
    password?: string;
    subnet?: string;
    browsersecurity?: string;
    delay1?: number;
    delay2?: number;
    showuserpicture?: number;
    showblocks?: number;
    completionattemptsexhausted?: number;
    completionpass?: number;
    allowofflineattempts?: number;
    autosaveperiod?: number;
    hasfeedback?: number;
    hasquestions?: number;
    precreateattempts?: number;
    duedate?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserQuizAttemptsResponse {
  attempts: {
    id?: number;
    quiz?: number;
    userid?: number;
    attempt?: number;
    uniqueid?: number;
    layout?: string;
    currentpage?: number;
    preview?: number;
    state?: string;
    timestart?: number;
    timefinish?: number;
    timemodified?: number;
    timemodifiedoffline?: number;
    timecheckstate?: number;
    sumgrades?: number;
    gradeitemmarks?: {
      name: string;
      grade: number;
      maxgrade: number;
    }[];
    gradednotificationsenttime?: number;
    feedback?: {
      feedbacktext?: string;
      feedbackformat?: number;
      feedbackinlinefiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserQuizBestGradeResponse {
  hasgrade: boolean;
  grade?: number;
  feedback?: {
    feedbacktext?: string;
    feedbackformat?: number;
    feedbackinlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
  };
  gradetopass?: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizReviewOptionsResponse {
  someoptions: {
    name: string;
    value: number;
  }[];
  alloptions: {
    name: string;
    value: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface StartQuizAttemptResponse {
  attempt: {
    id?: number;
    quiz?: number;
    userid?: number;
    attempt?: number;
    uniqueid?: number;
    layout?: string;
    currentpage?: number;
    preview?: number;
    state?: string;
    timestart?: number;
    timefinish?: number;
    timemodified?: number;
    timemodifiedoffline?: number;
    timecheckstate?: number;
    sumgrades?: number;
    gradeitemmarks?: {
      name: string;
      grade: number;
      maxgrade: number;
    }[];
    gradednotificationsenttime?: number;
    feedback?: {
      feedbacktext?: string;
      feedbackformat?: number;
      feedbackinlinefiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizAttemptDataResponse {
  attempt: {
    id?: number;
    quiz?: number;
    userid?: number;
    attempt?: number;
    uniqueid?: number;
    layout?: string;
    currentpage?: number;
    preview?: number;
    state?: string;
    timestart?: number;
    timefinish?: number;
    timemodified?: number;
    timemodifiedoffline?: number;
    timecheckstate?: number;
    sumgrades?: number;
    gradeitemmarks?: {
      name: string;
      grade: number;
      maxgrade: number;
    }[];
    gradednotificationsenttime?: number;
    feedback?: {
      feedbacktext?: string;
      feedbackformat?: number;
      feedbackinlinefiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
  };
  messages: string[];
  nextpage: number;
  questions: {
    slot: number;
    type: string;
    page: number;
    questionnumber: string;
    number?: number;
    html: string;
    responsefileareas?: {
      area: string;
      files?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    }[];
    sequencecheck?: number;
    lastactiontime?: number;
    hasautosavedstep?: boolean;
    flagged: boolean;
    state?: string;
    stateclass?: string;
    status?: string;
    blockedbyprevious?: boolean;
    mark?: string;
    maxmark?: number;
    settings?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizAttemptSummaryResponse {
  questions: {
    slot: number;
    type: string;
    page: number;
    questionnumber: string;
    number?: number;
    html: string;
    responsefileareas?: {
      area: string;
      files?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    }[];
    sequencecheck?: number;
    lastactiontime?: number;
    hasautosavedstep?: boolean;
    flagged: boolean;
    state?: string;
    stateclass?: string;
    status?: string;
    blockedbyprevious?: boolean;
    mark?: string;
    maxmark?: number;
    settings?: string;
  }[];
  totalunanswered?: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SaveQuizAttemptResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ProcessQuizAttemptResponse {
  state: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizAttemptReviewResponse {
  grade: string;
  attempt: {
    id?: number;
    quiz?: number;
    userid?: number;
    attempt?: number;
    uniqueid?: number;
    layout?: string;
    currentpage?: number;
    preview?: number;
    state?: string;
    timestart?: number;
    timefinish?: number;
    timemodified?: number;
    timemodifiedoffline?: number;
    timecheckstate?: number;
    sumgrades?: number;
    gradeitemmarks?: {
      name: string;
      grade: number;
      maxgrade: number;
    }[];
    gradednotificationsenttime?: number;
    feedback?: {
      feedbacktext?: string;
      feedbackformat?: number;
      feedbackinlinefiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
  };
  additionaldata: {
    id: string;
    title: string;
    content: string;
  }[];
  questions: {
    slot: number;
    type: string;
    page: number;
    questionnumber: string;
    number?: number;
    html: string;
    responsefileareas?: {
      area: string;
      files?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    }[];
    sequencecheck?: number;
    lastactiontime?: number;
    hasautosavedstep?: boolean;
    flagged: boolean;
    state?: string;
    stateclass?: string;
    status?: string;
    blockedbyprevious?: boolean;
    mark?: string;
    maxmark?: number;
    settings?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizFeedbackForGradeResponse {
  feedbacktext: string;
  feedbacktextformat?: number;
  feedbackinlinefiles?: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizAccessInformationResponse {
  canattempt: boolean;
  canmanage: boolean;
  canpreview: boolean;
  canreviewmyattempts: boolean;
  canviewreports: boolean;
  accessrules: string[];
  activerulenames: string[];
  preventaccessreasons: string[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizAttemptAccessInformationResponse {
  endtime?: number;
  isfinished: boolean;
  ispreflightcheckrequired?: boolean;
  preventnewattemptreasons: string[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetQuizRequiredQuestionTypesResponse {
  questiontypes: string[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewQuizResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewQuizAttemptResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewQuizAttemptSummaryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewQuizAttemptReviewResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseBooksResponse {
  books: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    numbering: number;
    navstyle: number;
    customtitles: number;
    revision?: number;
    timecreated?: number;
    timemodified?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewBookResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseFoldersResponse {
  folders: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    revision: number;
    timemodified: number;
    display: number;
    showexpanded: number;
    showdownloadfolder: number;
    forcedownload: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewFolderResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseImscpPackagesResponse {
  imscps: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    revision?: number;
    keepold?: number;
    structure?: string;
    timemodified?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewImscpPackageResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseLabelsResponse {
  labels: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCoursePagesResponse {
  pages: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    content: string;
    contentformat: number;
    contentfiles: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    legacyfiles: number;
    legacyfileslast: number;
    display: number;
    displayoptions: string;
    revision: number;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewPageResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseResourcesResponse {
  resources: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    contentfiles: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    tobemigrated: number;
    legacyfiles: number;
    legacyfileslast: number;
    display: number;
    displayoptions: string;
    filterfiles: number;
    revision: number;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewResourceResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseUrlsResponse {
  urls: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    externalurl: string;
    display: number;
    displayoptions: string;
    parameters: string;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewUrlResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseChoicesResponse {
  choices: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    publish?: boolean;
    showresults?: number;
    display?: number;
    allowupdate?: boolean;
    allowmultiple?: boolean;
    showunanswered?: boolean;
    includeinactive?: boolean;
    limitanswers?: boolean;
    timeopen?: number;
    timeclose?: number;
    showpreview?: boolean;
    timemodified?: number;
    completionsubmit?: boolean;
    showavailable?: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetChoiceOptionsResponse {
  options: {
    id: number;
    text: string;
    maxanswers: number;
    displaylayout: boolean;
    countanswers: number;
    checked: boolean;
    disabled: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetChoiceResultsResponse {
  options: {
    id: number;
    text: string;
    maxanswer: number;
    userresponses: {
      userid: number;
      fullname: string;
      profileimageurl: string;
      answerid?: number;
      timemodified?: number;
    }[];
    numberofuser: number;
    percentageamount: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
  userresponse: {
    optionid: number;
    text: string;
  }[];
}

export interface SubmitChoiceResponseResponse {
  answers: {
    id: number;
    choiceid: number;
    userid: number;
    optionid: number;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteChoiceResponsesResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewChoiceResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseScormPackagesResponse {
  scorms: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    packagesize?: number;
    packageurl?: string;
    version?: string;
    maxgrade?: number;
    grademethod?: number;
    whatgrade?: number;
    maxattempt?: number;
    forcecompleted?: boolean;
    forcenewattempt?: number;
    lastattemptlock?: boolean;
    displayattemptstatus?: number;
    displaycoursestructure?: boolean;
    sha1hash?: string;
    md5hash?: string;
    revision?: number;
    launch?: number;
    skipview?: number;
    hidebrowse?: boolean;
    hidetoc?: number;
    nav?: number;
    navpositionleft?: number;
    navpositiontop?: number;
    auto?: boolean;
    popup?: number;
    width?: number;
    height?: number;
    timeopen?: number;
    timeclose?: number;
    scormtype?: string;
    reference?: string;
    protectpackagedownloads?: boolean;
    updatefreq?: number;
    options?: string;
    completionstatusrequired?: number;
    completionscorerequired?: number;
    completionstatusallscos?: number;
    autocommit?: boolean;
    timemodified?: number;
  }[];
  options?: {
    name: string;
    value: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetScormAttemptCountResponse {
  attemptscount: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetScormContentsResponse {
  scoes: {
    id: number;
    scorm: number;
    manifest: string;
    organization: string;
    parent: string;
    identifier: string;
    launch: string;
    scormtype: string;
    title: string;
    sortorder: number;
    extradata?: {
      element: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetScormUserDataResponse {
  data: {
    scoid: number;
    userdata: {
      element: string;
      value: string;
    }[];
    defaultdata: {
      element: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SaveScormTracksResponse {
  trackids: number[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetScormTracksResponse {
  data: {
    attempt: number;
    tracks: {
      element: string;
      value: string;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface LaunchScormContentResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetScormAccessInformationResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewScormResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseWikisResponse {
  wikis: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    timecreated?: number;
    timemodified?: number;
    firstpagetitle?: string;
    wikimode?: string;
    defaultformat?: string;
    forceformat?: number;
    editbegin?: number;
    editend?: number;
    cancreatepages: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWikiSubwikisResponse {
  subwikis: {
    id: number;
    wikiid: number;
    groupid: string;
    userid: number;
    canedit: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWikiPagesResponse {
  pages: {
    id: number;
    subwikiid: number;
    title: string;
    timecreated: number;
    timemodified: number;
    timerendered: number;
    userid: number;
    pageviews: number;
    readonly: number;
    caneditpage: boolean;
    firstpage: boolean;
    cachedcontent?: string;
    contentformat?: number;
    contentsize?: number;
    tags?: Record<string, never>[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWikiFilesResponse {
  files: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWikiPageResponse {
  page: {
    id: number;
    wikiid: number;
    subwikiid: number;
    groupid: number;
    userid: number;
    title: string;
    cachedcontent: string;
    contentformat?: number;
    caneditpage: boolean;
    version?: number;
    tags?: Record<string, never>[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWikiPageForEditingResponse {
  pagesection: {
    content?: string;
    contentformat?: string;
    version: number;
    warnings: {
      item: string;
      itemid: number;
      warningcode: string;
      message: string;
    }[];
  };
}

export interface CreateWikiPageResponse {
  pageid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateWikiPageResponse {
  pageid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewWikiResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewWikiPageResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseFeedbacksResponse {
  feedbacks: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackAccessInformationResponse {
  canviewanalysis: boolean;
  cancomplete: boolean;
  cansubmit: boolean;
  candeletesubmissions: boolean;
  canviewreports: boolean;
  canedititems: boolean;
  isempty: boolean;
  isopen: boolean;
  isalreadysubmitted: boolean;
  isanonymous: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackTemporaryCompletionResponse {
  feedback: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackItemsResponse {
  items: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface LaunchFeedbackResponse {
  gopage: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackPageResponse {
  items: Record<string, never>[];
  hasprevpage: boolean;
  hasnextpage: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SubmitFeedbackPageResponse {
  jumpto: number;
  completed: boolean;
  completionpagecontents: string;
  siteaftersubmit: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackAnalysisResponse {
  completedcount: number;
  itemscount: number;
  itemsdata: {
    item: Record<string, never>;
    data: string[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUnfinishedFeedbackResponsesResponse {
  responses: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFinishedFeedbackResponsesResponse {
  responses: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackNonRespondentsResponse {
  users: {
    courseid: number;
    userid: number;
    fullname: string;
    started: boolean;
  }[];
  total: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetFeedbackResponsesAnalysisResponse {
  attempts: {
    id: number;
    courseid: number;
    userid: number;
    timemodified: number;
    fullname: string;
    responses: {
      id: number;
      name: string;
      printval: string;
      rawval: string;
    }[];
  }[];
  totalattempts: number;
  anonattempts: {
    id: number;
    courseid: number;
    number: number;
    responses: {
      id: number;
      name: string;
      printval: string;
      rawval: string;
    }[];
  }[];
  totalanonattempts: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLastFeedbackCompletionResponse {
  completed: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type ReorderFeedbackQuestionsResponse = boolean;

export interface ViewFeedbackResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseH5pActivitiesResponse {
  h5pactivities: Record<string, never>[];
  h5pglobalsettings?: {
    enablesavestate: boolean;
    savestatefreq?: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetH5pAccessInformationResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetH5pAttemptsResponse {
  activityid: number;
  usersattempts: {
    userid: number;
    attempts: {
      id: number;
      h5pactivityid: number;
      userid: number;
      timecreated: number;
      timemodified: number;
      attempt: number;
      rawscore: number;
      maxscore: number;
      duration: number;
      completion?: number;
      success?: number;
      scaled: number;
    }[];
    scored?: {
      title: string;
      grademethod: string;
      attempts: {
        id: number;
        h5pactivityid: number;
        userid: number;
        timecreated: number;
        timemodified: number;
        attempt: number;
        rawscore: number;
        maxscore: number;
        duration: number;
        completion?: number;
        success?: number;
        scaled: number;
      }[];
    };
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetH5pResultsResponse {
  activityid: number;
  attempts: {
    id: number;
    h5pactivityid: number;
    userid: number;
    timecreated: number;
    timemodified: number;
    attempt: number;
    rawscore: number;
    maxscore: number;
    duration: number;
    completion?: number;
    success?: number;
    scaled: number;
    results?: {
      id: number;
      attemptid: number;
      subcontent: string;
      timecreated: number;
      interactiontype: string;
      description: string;
      content?: string;
      rawscore: number;
      maxscore: number;
      duration?: number;
      completion?: number;
      success?: number;
      optionslabel?: string;
      correctlabel?: string;
      answerlabel?: string;
      track?: boolean;
      options?: {
        description?: string;
        id?: string;
        correctanswer: {
          answer?: string;
          correct?: boolean;
          incorrect?: boolean;
          text?: boolean;
          checked?: boolean;
          unchecked?: boolean;
          pass?: boolean;
          fail?: boolean;
        };
        useranswer: {
          answer?: string;
          correct?: boolean;
          incorrect?: boolean;
          text?: boolean;
          checked?: boolean;
          unchecked?: boolean;
          pass?: boolean;
          fail?: boolean;
        };
      }[];
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetH5pUserAttemptsResponse {
  activityid: number;
  usersattempts: {
    userid: number;
    attempts: {
      id: number;
      h5pactivityid: number;
      userid: number;
      timecreated: number;
      timemodified: number;
      attempt: number;
      rawscore: number;
      maxscore: number;
      duration: number;
      completion?: number;
      success?: number;
      scaled: number;
    }[];
    scored?: {
      title: string;
      grademethod: string;
      attempts: {
        id: number;
        h5pactivityid: number;
        userid: number;
        timecreated: number;
        timemodified: number;
        attempt: number;
        rawscore: number;
        maxscore: number;
        duration: number;
        completion?: number;
        success?: number;
        scaled: number;
      }[];
    };
  }[];
  totalattempts: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface LogH5pReportViewResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewH5pActivityResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseDatabasesResponse {
  databases: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDatabaseAccessInformationResponse {
  groupid: number;
  canaddentry: boolean;
  canmanageentries: boolean;
  canapprove: boolean;
  timeavailable: boolean;
  inreadonlyperiod: boolean;
  numentries: number;
  entrieslefttoadd: number;
  entrieslefttoview: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDatabaseEntriesResponse {
  entries: Record<string, never>[];
  totalcount: number;
  totalfilesize: number;
  listviewcontents?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDatabaseEntryResponse {
  entry: Record<string, never>;
  entryviewcontents?: string;
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDatabaseFieldsResponse {
  fields: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SearchDatabaseEntriesResponse {
  entries: Record<string, never>[];
  totalcount: number;
  maxcount?: number;
  listviewcontents?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ApproveDatabaseEntryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteDatabaseEntryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateDatabaseEntryResponse {
  newentryid: number;
  generalnotifications: string[];
  fieldnotifications: {
    fieldname: string;
    notification: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateDatabaseEntryResponse {
  updated: boolean;
  generalnotifications: string[];
  fieldnotifications: {
    fieldname: string;
    notification: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteDatabasePresetsResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDatabasePresetMappingResponse {
  data?: {
    needsmapping: boolean;
    presetname: string;
    fieldstocreate: string;
    fieldstoremove: string;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewDatabaseResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseGlossariesResponse {
  glossaries: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    allowduplicatedentries: number;
    displayformat: string;
    mainglossary: number;
    showspecial: number;
    showalphabet: number;
    showall: number;
    allowcomments: number;
    allowprintview: number;
    usedynalink: number;
    defaultapproval: number;
    approvaldisplayformat: string;
    globalglossary: number;
    entbypage: number;
    editalways: number;
    rsstype: number;
    rssarticles: number;
    assessed: number;
    assesstimestart: number;
    assesstimefinish: number;
    scale: number;
    timecreated: number;
    timemodified: number;
    completionentries: number;
    browsemodes: string[];
    canaddentry?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByLetterResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByDateResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryCategoriesResponse {
  count: number;
  categories: {
    id: number;
    glossaryid: number;
    name: string;
    usedynalink: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByCategoryResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryAuthorsResponse {
  count: number;
  authors: {
    id: number;
    fullname: string;
    pictureurl: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByAuthorLetterResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByAuthorResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SearchGlossaryEntriesResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesByTermResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntriesToApproveResponse {
  count: number;
  entries: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  }[];
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGlossaryEntryResponse {
  entry: {
    id: number;
    glossaryid: number;
    userid: number;
    userfullname: string;
    userpictureurl: string;
    concept: string;
    definition: string;
    definitionformat: number;
    definitiontrust: boolean;
    definitioninlinefiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    attachment: boolean;
    attachments?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    timecreated: number;
    timemodified: number;
    teacherentry: boolean;
    sourceglossaryid: number;
    usedynalink: boolean;
    casesensitive: boolean;
    fullmatch: boolean;
    approved: boolean;
    tags?: Record<string, never>[];
  };
  ratinginfo: {
    contextid: number;
    component: string;
    ratingarea: string;
    canviewall?: boolean;
    canviewany?: boolean;
    scales?: {
      id: number;
      courseid?: number;
      name?: string;
      max: number;
      isnumeric: boolean;
      items?: {
        value: number;
        name: string;
      }[];
    }[];
    ratings?: {
      itemid: number;
      scaleid?: number;
      userid?: number;
      aggregate?: number;
      aggregatestr?: string;
      aggregatelabel?: string;
      count?: number;
      rating?: number;
      canrate?: boolean;
      canviewaggregate?: boolean;
    }[];
  };
  permissions?: {
    candelete: boolean;
    canupdate: boolean;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateGlossaryEntryResponse {
  entryid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateGlossaryEntryResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteGlossaryEntryResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface PrepareGlossaryEntryResponse {
  inlineattachmentsid: number;
  attachmentsid: number;
  areas: {
    area: string;
    options: {
      name: string;
      value: string;
    }[];
  }[];
  aliases: string[];
  categories: number[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewGlossaryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewGlossaryEntryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseBigbluebuttonActivitiesResponse {
  bigbluebuttonbns: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    meetingid: string;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CanJoinBigbluebuttonResponse {
  can_join: boolean;
  cmid: number;
}

export interface GetBigbluebuttonJoinUrlResponse {
  join_url?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBigbluebuttonRecordingsResponse {
  status: boolean;
  tabledata?: {
    activity: string;
    ping_interval: number;
    locale: string;
    profile_features: string[];
    columns: {
      key: string;
      label: string;
      width: string;
      type?: string;
      sortable?: boolean;
      allowHTML?: boolean;
      formatter?: string;
    }[];
    data: string;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBigbluebuttonRecordingsToImportResponse {
  status: boolean;
  tabledata?: {
    activity: string;
    ping_interval: number;
    locale: string;
    profile_features: string[];
    columns: {
      key: string;
      label: string;
      width: string;
      type?: string;
      sortable?: boolean;
      allowHTML?: boolean;
      formatter?: string;
    }[];
    data: string;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type UpdateBigbluebuttonRecordingResponse = Record<string, never>;

export interface EndBigbluebuttonMeetingResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ValidateBigbluebuttonCompletionResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBigbluebuttonMeetingInformationResponse {
  cmid: number;
  userlimit: number;
  bigbluebuttonbnid: string;
  groupid: number;
  meetingid: string;
  openingtime?: number;
  closingtime?: number;
  statusrunning?: boolean;
  statusclosed?: boolean;
  statusopen?: boolean;
  statusmessage?: string;
  startedat?: number;
  moderatorcount?: number;
  participantcount?: number;
  moderatorplural?: boolean;
  participantplural?: boolean;
  canjoin: boolean;
  ismoderator: boolean;
  usermustwaittojoin?: boolean;
  presentations: {
    url: string;
    iconname: string;
    icondesc: string;
    name: string;
  }[];
  joinurl: string;
  guestaccessenabled?: boolean;
  guestjoinurl?: string;
  guestpassword?: string;
  showpresentations?: boolean;
  features?: {
    name: string;
    isenabled: boolean;
  }[];
}

export interface ViewBigbluebuttonResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseLessonsResponse {
  lessons: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonResponse {
  lesson: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonAccessInformationResponse {
  canmanage: boolean;
  cangrade: boolean;
  canviewreports: boolean;
  reviewmode: boolean;
  attemptscount: number;
  lastpageseen: number;
  leftduringtimedsession: boolean;
  firstpageid: number;
  preventaccessreasons: {
    reason: string;
    data: string;
    message: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonQuestionAttemptsResponse {
  attempts: {
    id: number;
    lessonid: number;
    pageid: number;
    userid: number;
    answerid: number;
    retry: number;
    correct: number;
    useranswer: string;
    timeseen: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonUserGradeResponse {
  grade: number;
  formattedgrade: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonAttemptGradeResponse {
  grade: {
    nquestions: number;
    attempts: number;
    total: number;
    earned: number;
    grade: number;
    nmanual: number;
    manualpoints: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonContentPagesViewedResponse {
  pages: {
    id: number;
    lessonid: number;
    pageid: number;
    userid: number;
    retry: number;
    flag: number;
    timeseen: number;
    nextpageid: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonUserTimersResponse {
  timers: {
    id: number;
    lessonid: number;
    userid: number;
    starttime: number;
    lessontime: number;
    completed: number;
    timemodifiedoffline: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonPagesResponse {
  pages: {
    page: {
      id: number;
      lessonid: number;
      prevpageid: number;
      nextpageid: number;
      qtype: number;
      qoption: number;
      layout: number;
      display: number;
      timecreated: number;
      timemodified: number;
      title?: string;
      contents?: string;
      contentsformat?: number;
      displayinmenublock: boolean;
      type: number;
      typeid: number;
      typestring: string;
    };
    answerids: number[];
    jumps: number[];
    filescount: number;
    filessizetotal: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface LaunchLessonAttemptResponse {
  messages: {
    message: string;
    type: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonPageResponse {
  page: {
    id: number;
    lessonid: number;
    prevpageid: number;
    nextpageid: number;
    qtype: number;
    qoption: number;
    layout: number;
    display: number;
    timecreated: number;
    timemodified: number;
    title?: string;
    contents?: string;
    contentsformat?: number;
    displayinmenublock: boolean;
    type: number;
    typeid: number;
    typestring: string;
  };
  newpageid: number;
  pagecontent?: string;
  ongoingscore: string;
  progress: number;
  contentfiles: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  answers: {
    id: number;
    answerfiles: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    responsefiles: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    jumpto?: number;
    grade?: number;
    score?: number;
    flags?: number;
    timecreated?: number;
    timemodified?: number;
    answer?: string;
    answerformat?: number;
    response?: string;
    responseformat?: number;
  }[];
  messages: {
    message: string;
    type: string;
  }[];
  displaymenu: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SubmitLessonPageResponse {
  newpageid: number;
  inmediatejump: boolean;
  nodefaultresponse: boolean;
  feedback: string;
  attemptsremaining: number;
  correctanswer: boolean;
  noanswer: boolean;
  isessayquestion: boolean;
  maxattemptsreached: boolean;
  response: string;
  studentanswer: string;
  userresponse: string;
  reviewmode: boolean;
  ongoingscore: string;
  progress: number;
  displaymenu: boolean;
  messages: {
    message: string;
    type: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface FinishLessonAttemptResponse {
  data: {
    name: string;
    value: string;
    message: string;
  }[];
  messages: {
    message: string;
    type: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonAttemptsOverviewResponse {
  data?: {
    lessonscored: boolean;
    numofattempts: number;
    avescore: number;
    highscore: number;
    lowscore: number;
    avetime: number;
    hightime: number;
    lowtime: number;
    students?: {
      id: number;
      fullname: string;
      bestgrade: number;
      attempts: {
        try: number;
        grade: number;
        timestart: number;
        timeend: number;
        end: number;
      }[];
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonUserAttemptResponse {
  answerpages: {
    page: {
      id: number;
      lessonid: number;
      prevpageid: number;
      nextpageid: number;
      qtype: number;
      qoption: number;
      layout: number;
      display: number;
      timecreated: number;
      timemodified: number;
      title?: string;
      contents?: string;
      contentsformat?: number;
      displayinmenublock: boolean;
      type: number;
      typeid: number;
      typestring: string;
    };
    title: string;
    contents: string;
    qtype: string;
    grayout: number;
    answerdata?: {
      score: string;
      response: string;
      responseformat: number;
      answers?: string[][];
    };
  }[];
  userstats: {
    grade: number;
    completed: number;
    timetotake: number;
    gradeinfo: {
      nquestions: number;
      attempts: number;
      total: number;
      earned: number;
      grade: number;
      nmanual: number;
      manualpoints: number;
    };
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLessonPossibleJumpsResponse {
  jumps: {
    pageid: number;
    answerid: number;
    jumpto: number;
    calculatedjump: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewLessonResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseLtiToolsResponse {
  ltis: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    timecreated?: number;
    timemodified?: number;
    typeid?: number;
    toolurl?: string;
    securetoolurl?: string;
    instructorchoicesendname?: string;
    instructorchoicesendemailaddr?: number;
    instructorchoiceallowroster?: number;
    instructorchoiceallowsetting?: number;
    instructorcustomparameters?: string;
    instructorchoiceacceptgrades?: number;
    grade?: number;
    launchcontainer?: number;
    resourcekey?: string;
    password?: string;
    debuglaunch?: number;
    showtitlelaunch?: number;
    showdescriptionlaunch?: number;
    servicesalt?: string;
    icon?: string;
    secureicon?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetLtiLaunchDataResponse {
  endpoint: string;
  parameters: {
    name: string;
    value: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetLtiToolProxiesResponse = JsonObject[];

export type CreateLtiToolProxyResponse = JsonObject;

export type DeleteLtiToolProxyResponse = JsonObject;

export type GetLtiProxyRegistrationRequestResponse = JsonObject;

export type GetLtiToolTypesResponse = {
  id: number;
  name: string;
  description: string;
  platformid: string;
  clientid: string;
  deploymentid: number;
  urls: {
    icon: string;
    edit: string;
    course?: string;
    publickeyset: string;
    accesstoken: string;
    authrequest: string;
  };
  state: {
    text: string;
    pending: boolean;
    configured: boolean;
    rejected: boolean;
    unknown: boolean;
  };
  hascapabilitygroups: boolean;
  capabilitygroups: string[];
  courseid: number;
  instanceids: number[];
  instancecount: number;
}[];

export interface GetLtiToolTypesAndProxiesResponse {
  types: {
    id: number;
    name: string;
    description: string;
    platformid: string;
    clientid: string;
    deploymentid: number;
    urls: {
      icon: string;
      edit: string;
      course?: string;
      publickeyset: string;
      accesstoken: string;
      authrequest: string;
    };
    state: {
      text: string;
      pending: boolean;
      configured: boolean;
      rejected: boolean;
      unknown: boolean;
    };
    hascapabilitygroups: boolean;
    capabilitygroups: string[];
    courseid: number;
    instanceids: number[];
    instancecount: number;
  }[];
  proxies: JsonObject[];
  limit?: number;
  offset?: number;
}

export interface CountLtiToolTypesAndProxiesResponse {
  count: number;
}

export interface CreateLtiToolTypeResponse {
  id: number;
  name: string;
  description: string;
  platformid: string;
  clientid: string;
  deploymentid: number;
  urls: {
    icon: string;
    edit: string;
    course?: string;
    publickeyset: string;
    accesstoken: string;
    authrequest: string;
  };
  state: {
    text: string;
    pending: boolean;
    configured: boolean;
    rejected: boolean;
    unknown: boolean;
  };
  hascapabilitygroups: boolean;
  capabilitygroups: string[];
  courseid: number;
  instanceids: number[];
  instancecount: number;
}

export interface UpdateLtiToolTypeResponse {
  id: number;
  name: string;
  description: string;
  platformid: string;
  clientid: string;
  deploymentid: number;
  urls: {
    icon: string;
    edit: string;
    course?: string;
    publickeyset: string;
    accesstoken: string;
    authrequest: string;
  };
  state: {
    text: string;
    pending: boolean;
    configured: boolean;
    rejected: boolean;
    unknown: boolean;
  };
  hascapabilitygroups: boolean;
  capabilitygroups: string[];
  courseid: number;
  instanceids: number[];
  instancecount: number;
}

export type DeleteLtiToolTypeResponse = JsonObject;

export type DeleteCourseLtiToolTypeResponse = boolean;

export type SetLtiToolActivityChooserVisibilityResponse = boolean;

export type IsLtiCartridgeResponse = boolean;

export interface ViewLtiResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseWorkshopsResponse {
  workshops: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopAccessInformationResponse {
  creatingsubmissionallowed: boolean;
  modifyingsubmissionallowed: boolean;
  assessingallowed: boolean;
  assessingexamplesallowed: boolean;
  examplesassessedbeforesubmission: boolean;
  examplesassessedbeforeassessment: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopUserPlanResponse {
  userplan: {
    phases: {
      code: number;
      title: string;
      active: boolean;
      tasks: {
        code: string;
        title: string;
        link: string;
        details?: string;
        completed: string;
      }[];
      actions: {
        type?: string;
        label?: string;
        url: string;
        method?: string;
      }[];
    }[];
    examples: {
      id: number;
      title: string;
      assessmentid: number;
      grade: number;
      gradinggrade: number;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateWorkshopSubmissionResponse {
  status: boolean;
  submissionid?: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateWorkshopSubmissionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteWorkshopSubmissionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopSubmissionsResponse {
  submissions: Record<string, never>[];
  totalcount: number;
  totalfilesize: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopSubmissionResponse {
  submission: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopSubmissionAssessmentsResponse {
  assessments: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopAssessmentResponse {
  assessment: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopAssessmentFormResponse {
  dimenssionscount: number;
  descriptionfiles: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  options: {
    name: string;
    value: string;
  }[];
  fields: {
    name: string;
    value: string;
  }[];
  current: {
    name: string;
    value: string;
  }[];
  dimensionsinfo: {
    id: number;
    min: number;
    max: number;
    weight: string;
    scale?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopReviewerAssessmentsResponse {
  assessments: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateWorkshopAssessmentResponse {
  status: boolean;
  rawgrade?: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopGradesResponse {
  assessmentrawgrade?: number;
  assessmentlongstrgrade?: string;
  assessmentgradehidden?: boolean;
  submissionrawgrade?: number;
  submissionlongstrgrade?: string;
  submissiongradehidden?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface EvaluateWorkshopAssessmentResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetWorkshopGradesReportResponse {
  report: {
    grades: {
      userid: number;
      submissionid: number;
      submissiontitle: string;
      submissionmodified: number;
      submissiongrade?: number;
      gradinggrade?: number;
      submissiongradeover?: number;
      submissiongradeoverby?: number;
      submissionpublished?: number;
      reviewedby?: {
        userid: number;
        assessmentid: number;
        submissionid: number;
        grade: number;
        gradinggrade: number;
        gradinggradeover: number;
        weight: number;
      }[];
      reviewerof?: {
        userid: number;
        assessmentid: number;
        submissionid: number;
        grade: number;
        gradinggrade: number;
        gradinggradeover: number;
        weight: number;
      }[];
    }[];
    totalcount: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface EvaluateWorkshopSubmissionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewWorkshopResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewWorkshopSubmissionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type SaveAssignmentGradesResponse = null;

export type SubmitAssignmentGradingFormResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export interface GetUserQuizAttemptsLegacyResponse {
  attempts: {
    id?: number;
    quiz?: number;
    userid?: number;
    attempt?: number;
    uniqueid?: number;
    layout?: string;
    currentpage?: number;
    preview?: number;
    state?: string;
    timestart?: number;
    timefinish?: number;
    timemodified?: number;
    timemodifiedoffline?: number;
    timecheckstate?: number;
    sumgrades?: number;
    gradeitemmarks?: {
      name: string;
      grade: number;
      maxgrade: number;
    }[];
    gradednotificationsenttime?: number;
    feedback?: {
      feedbacktext?: string;
      feedbackformat?: number;
      feedbackinlinefiles?: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SetQuizQuestionVersionResponse {
  result: boolean;
}

export type ReopenQuizAttemptResponse = null;

export type GetReopenQuizAttemptConfirmationResponse = string;

export interface AddQuizRandomQuestionsResponse {
  message?: string;
}

export interface UpdateQuizRandomQuestionFilterResponse {
  message?: string;
}

export interface SaveQuizOverridesResponse {
  ids: number[];
}

export interface DeleteQuizOverridesResponse {
  ids: number[];
}

export interface GetQuizOverridesResponse {
  overrides: {
    id: number;
    quiz: number;
    userid: number;
    groupid: number;
    timeopen: number;
    timeclose: number;
    duedate: number;
    timelimit: number;
    attempts: number;
    password: string;
    reason: string;
    reasonformat: number;
  }[];
}

export type CreateQuizGradeItemsResponse = null;

export type DeleteQuizGradeItemsResponse = null;

export type UpdateQuizGradeItemsResponse = null;

export type UpdateQuizSlotsResponse = null;

export type GetQuizGradingSetupResponse = string;

export type CreateQuizGradeItemPerSectionResponse = null;

export type GetCalendarMonthResponse = Record<string, never>;

export type GetCalendarDayResponse = Record<string, never>;

export type GetCalendarUpcomingResponse = Record<string, never>;

export interface MoveCalendarEventResponse {
  event: Record<string, never>;
}

export interface CreateCalendarEventsResponse {
  events: {
    id: number;
    name: string;
    description?: string;
    format: number;
    courseid: number;
    groupid: number;
    userid: number;
    repeatid?: number;
    modulename?: string;
    instance: number;
    eventtype: string;
    timestart: number;
    timeduration: number;
    visible: number;
    uuid?: string;
    sequence: number;
    timemodified: number;
    subscriptionid?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type DeleteCalendarEventsResponse = null;

export type GetActionEventsByTimeResponse = Record<string, never>;

export type GetCourseActionEventsResponse = Record<string, never>;

export type GetCoursesActionEventsResponse = Record<string, never>;

export interface GetCalendarEventResponse {
  event: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SubmitCalendarEventFormResponse {
  event: Record<string, never>;
  validationerror: boolean;
}

export interface GetCalendarAccessInformationResponse {
  canmanageentries: boolean;
  canmanageownentries: boolean;
  canmanagegroupentries: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAllowedCalendarEventTypesResponse {
  allowedeventtypes: string[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCalendarExportTokenResponse {
  token: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBadgeResponse {
  badge: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserBadgesResponse {
  badges: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserBadgeByHashResponse {
  badge: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBlogEntriesResponse {
  entries: Record<string, never>[];
  totalentries: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewBlogEntriesResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetBlogAccessInformationResponse {
  canview: boolean;
  cansearch: boolean;
  canviewdrafts: boolean;
  cancreate: boolean;
  canmanageentries: boolean;
  canmanageexternal: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateBlogEntryResponse {
  entryid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateBlogEntryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DeleteBlogEntryResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface PrepareBlogEntryResponse {
  inlineattachmentsid: number;
  attachmentsid: number;
  areas: {
    area: string;
    options: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCommentsResponse {
  comments: {
    id: number;
    content: string;
    format: number;
    timecreated: number;
    strftimeformat: string;
    profileurl: string;
    fullname: string;
    time: string;
    avatar: string;
    userid: number;
    delete?: boolean;
  }[];
  count?: number;
  perpage?: number;
  canpost?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type CreateCommentsResponse = {
  id: number;
  content: string;
  format: number;
  timecreated: number;
  strftimeformat: string;
  profileurl: string;
  fullname: string;
  time: string;
  avatar: string;
  userid: number;
  delete?: boolean;
}[];

export type DeleteCommentsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type CreateNotesResponse = {
  clientnoteid?: string;
  noteid: number;
  errormessage?: string;
}[];

export type DeleteNotesResponse = null;

export interface GetCourseNotesResponse {
  sitenotes?: {
    id: number;
    courseid: number;
    userid: number;
    content: string;
    format: number;
    created: number;
    lastmodified: number;
    usermodified: number;
    publishstate: string;
  }[];
  coursenotes?: {
    id: number;
    courseid: number;
    userid: number;
    content: string;
    format: number;
    created: number;
    lastmodified: number;
    usermodified: number;
    publishstate: string;
  }[];
  personalnotes?: {
    id: number;
    courseid: number;
    userid: number;
    content: string;
    format: number;
    created: number;
    lastmodified: number;
    usermodified: number;
    publishstate: string;
  }[];
  canmanagesystemnotes?: boolean;
  canmanagecoursenotes?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewNotesResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetItemRatingsResponse {
  ratings: {
    id: number;
    userid: number;
    userpictureurl: string;
    userfullname: string;
    rating: string;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface RateItemResponse {
  success: boolean;
  aggregate?: string;
  count?: number;
  itemid?: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetActivityAllowedGroupsResponse {
  groups: {
    id: number;
    name: string;
    description: string;
    descriptionformat: number;
    idnumber: string;
    courseid?: number;
  }[];
  canaccessallgroups?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetActivityGroupModeResponse {
  groupmode: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserCourseGroupsResponse {
  groups: {
    id: number;
    name: string;
    description: string;
    descriptionformat: number;
    idnumber: string;
    courseid?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGroupsForSelectorResponse {
  groups: {
    id: string;
    name: string;
    groupimageurl?: string;
    participation: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetRecentlyAccessedItemsResponse = Record<string, never>[];

export type GetStarredCoursesResponse = Record<string, never>[];

export interface ViewPersonalPageResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateQuestionFlagResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface BrowseFilesResponse {
  parents: {
    contextid: number;
    component: string;
    filearea: string;
    itemid: number;
    filepath: string;
    filename: string;
  }[];
  files: {
    contextid: number;
    component: string;
    filearea: string;
    itemid: number;
    filepath: string;
    filename: string;
    isdir: boolean;
    url: string;
    timemodified: number;
    timecreated?: number;
    filesize?: number;
    author?: string;
    license?: string;
  }[];
}

export interface DeleteDraftFilesResponse {
  parentpaths: string[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUnusedDraftAreaResponse {
  component: string;
  contextid: number;
  userid: number;
  filearea: string;
  itemid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserPreferencesResponse {
  preferences: {
    name: string;
    value: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetPrivateFilesInformationResponse {
  filecount: number;
  foldercount: number;
  filesize: number;
  filesizewithoutreferences: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewCourseUserListResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewUserProfileResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface AgreeSitePolicyResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type AddPrivateFilesResponse = null;

export interface UpdateUserPictureResponse {
  success: boolean;
  profileimageurl?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface RemoveUserDeviceResponse {
  removed: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SearchSiteResponse {
  totalcount: number;
  results: Record<string, never>[];
}

export interface GetTopSearchResultsResponse {
  results: Record<string, never>[];
}

export interface GetSearchAreasResponse {
  areas: {
    id: string;
    categoryid: string;
    categoryname: string;
    name: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewSearchResultsResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTagAreasResponse {
  areas: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTagCollectionsResponse {
  collections: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTagCloudResponse {
  tags: {
    name: string;
    viewurl: string;
    flag?: boolean;
    isstandard?: boolean;
    count?: number;
    size?: number;
  }[];
  tagscount: number;
  totalcount: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTagIndexResponse {
  tagid: number;
  ta: number;
  component: string;
  itemtype: string;
  nextpageurl?: string;
  prevpageurl?: string;
  exclusiveurl?: string;
  exclusivetext?: string;
  title: string;
  content: string;
  hascontent: number;
  anchor?: string;
}

export type GetTagIndexByAreaResponse = {
  tagid: number;
  ta: number;
  component: string;
  itemtype: string;
  nextpageurl?: string;
  prevpageurl?: string;
  exclusiveurl?: string;
  exclusivetext?: string;
  title: string;
  content: string;
  hascontent: number;
  anchor?: string;
}[];

export interface GetCourseModuleResponse {
  cm: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: number;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    module: number;
    modname: string;
    instance: number;
    sectionnum: number;
    completion: number;
    idnumber?: string;
    added?: number;
    score?: number;
    indent?: number;
    visibleoncoursepage?: number;
    visibleold?: number;
    completiongradeitemnumber?: number;
    completionpassgrade?: number;
    completionview?: number;
    completionexpected?: number;
    showdescription?: number;
    downloadcontent?: number;
    availability?: string;
    grade?: number;
    scale?: string;
    gradepass?: string;
    gradecat?: number;
    advancedgrading?: {
      area: string;
      method: string;
    }[];
    outcomes?: {
      id: string;
      name: string;
      scale: string;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseModuleByInstanceResponse {
  cm: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: number;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    enableaitools?: number;
    enabledaiactions?: string;
    module: number;
    modname: string;
    instance: number;
    sectionnum: number;
    completion: number;
    idnumber?: string;
    added?: number;
    score?: number;
    indent?: number;
    visibleoncoursepage?: number;
    visibleold?: number;
    completiongradeitemnumber?: number;
    completionpassgrade?: number;
    completionview?: number;
    completionexpected?: number;
    showdescription?: number;
    downloadcontent?: number;
    availability?: string;
    grade?: number;
    scale?: string;
    gradepass?: string;
    gradecat?: number;
    advancedgrading?: {
      area: string;
      method: string;
    }[];
    outcomes?: {
      id: string;
      name: string;
      scale: string;
    }[];
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewCourseResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SearchCoursesResponse {
  total: number;
  courses: {
    id: number;
    fullname: string;
    displayname: string;
    shortname: string;
    courseimage?: string;
    categoryid: number;
    categoryname: string;
    sortorder?: number;
    summary: string;
    summaryformat: number;
    summaryfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    overviewfiles: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    showactivitydates: boolean;
    showcompletionconditions: boolean;
    contacts: {
      id: number;
      fullname: string;
    }[];
    enrollmentmethods: string[];
    customfields?: {
      name: string;
      shortname: string;
      type: string;
      valueraw: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseNavigationOptionsResponse {
  courses: {
    id: number;
    options: {
      name: string;
      available: boolean;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseAdministrationOptionsResponse {
  courses: {
    id: number;
    options: {
      name: string;
      available: boolean;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseUpdatesResponse {
  instances: {
    contextlevel: string;
    id: number;
    updates: {
      name: string;
      timeupdated?: number;
      itemids?: number[];
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTimelineCoursesResponse {
  courses: Record<string, never>[];
  nextoffset: number;
}

export interface SetFavouriteCoursesResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetRecentCoursesResponse = Record<string, never>[];

export interface CheckCourseUpdatesResponse {
  instances: {
    contextlevel: string;
    id: number;
    updates: {
      name: string;
      timeupdated?: number;
      itemids?: number[];
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTimelineCoursesWithEventsResponse {
  courses: Record<string, never>[];
  nextoffset: number;
  morecoursesavailable: boolean;
}

export interface ViewModuleInstanceListResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetCourseOverviewResponse = Record<string, never>;

export interface ViewCourseOverviewResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAvailableFiltersResponse {
  filters: {
    contextlevel: string;
    instanceid: number;
    contextid: number;
    filter: string;
    localstate: number;
    inheritedstate: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetAllFilterStatesResponse {
  filters: {
    contextlevel: string;
    instanceid: number;
    contextid: number;
    filter: string;
    state: number;
    sortorder: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetComponentStringsResponse = {
  stringid: string;
  string: string;
}[];

export type GetFontawesomeIconMapResponse = {
  component: string;
  pix: string;
  to: string;
}[];

export interface GetTrustedH5pFileResponse {
  files: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type IsPushNotificationSystemConfiguredResponse = boolean;

export interface GetPushPreferenceStatusesResponse {
  users: {
    userid: number;
    configured: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetUserPushDevicesResponse {
  devices: {
    id: number;
    appid: string;
    name: string;
    model: string;
    platform: string;
    version: string;
    pushid: string;
    uuid: string;
    enable: number;
    timecreated: number;
    timemodified: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SetPushDeviceEnabledResponse {
  success: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetPopupNotificationsResponse {
  notifications: {
    id: number;
    useridfrom: number;
    useridto: number;
    subject: string;
    shortenedsubject: string;
    text: string;
    fullmessage: string;
    fullmessageformat: number;
    fullmessagehtml: string;
    smallmessage: string;
    contexturl: string;
    contexturlname: string;
    timecreated: number;
    timecreatedpretty: string;
    timeread: number;
    read: boolean;
    deleted: boolean;
    iconurl: string;
    component?: string;
    eventtype?: string;
    customdata?: string;
  }[];
  unreadcount: number;
}

export type GetUnreadPopupNotificationCountResponse = number;

export interface GetGuestEnrolmentInformationResponse {
  instanceinfo: {
    id: number;
    courseid: number;
    type: string;
    name: string;
    status: boolean;
    passwordrequired: boolean;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ValidateGuestEnrolmentPasswordResponse {
  validated: boolean;
  hint?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type RegisterUserDeviceResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[][];

export interface UpdateUserDevicePublicKeyResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetCourseUserProfilesResponse = {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname: string;
  initials?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  department?: string;
  institution?: string;
  idnumber?: string;
  interests?: string;
  firstaccess?: string;
  lastaccess?: string;
  auth?: string;
  suspended?: string;
  confirmed?: string;
  lang?: string;
  calendartype?: string;
  theme?: string;
  timezone?: string;
  mailformat?: string;
  trackforums?: string;
  description?: string;
  descriptionformat?: number;
  city?: string;
  country?: string;
  profileimageurlsmall: string;
  profileimageurl: string;
  customfields?: {
    type: string;
    value: string;
    displayvalue?: string;
    name: string;
    shortname: string;
  }[];
  preferences?: {
    name: string;
    value: string;
  }[];
}[];

export interface SetUserPreferencesResponse {
  saved: {
    name: string;
    userid: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type UpdateUserPreferencesResponse = null;

export interface PreparePrivateFilesResponse {
  draftitemid: number;
  areaoptions: {
    name: string;
    value: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdatePrivateFilesResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetXapiStateResponse = string | null;

export type GetXapiStatesResponse = string[];

export type SaveXapiStateResponse = boolean;

export type DeleteXapiStateResponse = boolean;

export type DeleteXapiStatesResponse = boolean;

export type PostXapiStatementsResponse = boolean[];

export type ViewCompetencyResponse = boolean;

export type DeleteCompetencyEvidenceResponse = boolean;

export type GetCompetencyScaleValuesResponse = {
  id: number;
  name: string;
}[];

export type GradeCourseCompetencyResponse = boolean;

export type GetCourseCompetenciesResponse = {
  competency: Record<string, never>;
  coursecompetency: Record<string, never>;
}[];

export type ViewUserCompetencyResponse = boolean;

export type ViewUserCompetencyInCourseResponse = boolean;

export type ViewUserCompetencyInPlanResponse = boolean;

export type ViewUserCompetencyPlanResponse = boolean;

export interface GetCourseBlocksResponse {
  blocks: {
    instanceid: number;
    name: string;
    region: string;
    positionid: number;
    collapsible: boolean;
    dockable: boolean;
    weight?: number;
    visible?: boolean;
    contents?: {
      title: string;
      content: string;
      contentformat: number;
      footer: string;
      files: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
    configs?: {
      name: string;
      value: string;
      type: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDashboardBlocksResponse {
  blocks: {
    instanceid: number;
    name: string;
    region: string;
    positionid: number;
    collapsible: boolean;
    dockable: boolean;
    weight?: number;
    visible?: boolean;
    contents?: {
      title: string;
      content: string;
      contentformat: number;
      footer: string;
      files: {
        filename: string;
        filepath: string;
        filesize: number;
        fileurl: string;
        timemodified: number;
        mimetype: string;
        isexternal?: boolean;
        repositorytype?: string;
      }[];
    };
    configs?: {
      name: string;
      value: string;
      type: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetAddableBlocksResponse = {
  name: string;
  title: string;
  blockform: string;
}[];

export interface GetGradeSelectorUsersResponse {
  users: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradeSelectorGroupsResponse {
  groups: {
    id: string;
    name: string;
    groupimageurl?: string;
    participation: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetPointGradingPanelResponse {
  templatename: string;
  hasgrade: boolean;
  grade: {
    grade: number;
    usergrade: string;
    maxgrade: string;
    gradedby: string;
    timecreated: number;
    timemodified: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type SavePointGradingPanelResponse = JsonObject;

export interface GetScaleGradingPanelResponse {
  templatename: string;
  hasgrade: boolean;
  grade: {
    options: {
      value: number;
      title: string;
      selected: boolean;
    }[];
    usergrade: string;
    maxgrade: string;
    gradedby: string;
    timecreated: number;
    timemodified: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type SaveScaleGradingPanelResponse = JsonObject;

export interface GetGraderReportUsersResponse {
  users: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetGradeItemsForSelectorResponse {
  gradeitems: {
    id?: number;
    name?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewGradeOverviewReportResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewUserGradeReportResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface RecordInsightActionResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ListCustomReportsResponse {
  reports: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCustomReportResponse {
  details: Record<string, never>;
  data: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ViewCustomReportResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type CanViewSystemReportResponse = boolean;

export interface GetSystemReportResponse {
  data: Record<string, never>;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDynamicTableResponse {
  html: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTinyEditorConfigurationResponse {
  contextid: number;
  branding: boolean;
  extendedvalidelements: string;
  installedlanguages: {
    lang: string;
    name: string;
  }[];
  plugins: {
    name: string;
    settings: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetTinyPremiumApiKeyResponse {
  apikey: string;
  usecloud: boolean;
}

export interface GetDataPrivacyAccessInformationResponse {
  cancontactdpo: boolean;
  canmanagedatarequests: boolean;
  cancreatedatadownloadrequest: boolean;
  cancreatedatadeletionrequest: boolean;
  hasongoingdatadownloadrequest: boolean;
  hasongoingdatadeletionrequest: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CreateDataRequestResponse {
  datarequestid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CancelDataRequestResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ContactDataProtectionOfficerResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetDataRequestsResponse {
  requests: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetPolicyAcceptancesResponse {
  policies?: {
    policyid: number;
    versionid: number;
    agreementstyle: number;
    optional: number;
    revision: string;
    status: number;
    name: string;
    summary?: string;
    summaryformat: number;
    content?: string;
    contentformat: number;
    acceptance?: {
      status: number;
      lang: string;
      timemodified: number;
      usermodified: number;
      note?: string;
      modfullname?: string;
    };
    canaccept: boolean;
    candecline: boolean;
    canrevoke: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SetPolicyAcceptancesResponse {
  policyagreed: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetCourseCompetenciesPageResponse {
  courseid: number;
  pagecontextid: number;
  gradableuserid?: number;
  canmanagecompetencyframeworks: boolean;
  canmanagecoursecompetencies: boolean;
  canconfigurecoursecompetencies: boolean;
  cangradecompetencies: boolean;
  settings: Record<string, never>;
  statistics: Record<string, never>;
  competencies: {
    competency: Record<string, never>;
    coursecompetency: Record<string, never>;
    coursemodules: Record<string, never>[];
    usercompetencycourse: Record<string, never>;
    ruleoutcomeoptions: {
      value: number;
      text: string;
      selected: boolean;
    }[];
    comppath: Record<string, never>;
    plans: Record<string, never>[];
  }[];
  manageurl: string;
  pluginbaseurl: string;
}

export interface GetLearningPlanPageResponse {
  plan: Record<string, never>;
  contextid: number;
  pluginbaseurl: string;
  competencies: {
    competency: Record<string, never>;
    comppath: Record<string, never>;
    usercompetency: Record<string, never>;
    usercompetencyplan: Record<string, never>;
  }[];
  competencycount: number;
  proficientcompetencycount: number;
  proficientcompetencypercentage: number;
  proficientcompetencypercentageformatted: string;
}

export interface GetUserLearningPlansPageResponse {
  userid: number;
  plans: Record<string, never>[];
  pluginbaseurl: string;
  navigation: string[];
  canreaduserevidence: boolean;
  canmanageuserplans: boolean;
}

export type GetUserCompetencySummaryResponse = Record<string, never>;

export type GetCourseUserCompetencySummaryResponse = Record<string, never>;

export type GetPlanUserCompetencySummaryResponse = Record<string, never>;

export interface GetUserEvidenceListPageResponse {
  canmanage: boolean;
  userid: number;
  pluginbaseurl: string;
  evidence: Record<string, never>[];
  navigation: string[];
}

export interface GetUserEvidencePageResponse {
  userevidence: Record<string, never>;
  pluginbaseurl: string;
}

export type SendConversationMessagesResponse = {
  id: number;
  useridfrom: number;
  text: string;
  timecreated: number;
}[];

export type SendInstantMessagesResponse = {
  msgid: number;
  clientmsgid?: string;
  errormessage?: string;
  text?: string;
  timecreated?: number;
  conversationid?: number;
  useridfrom?: number;
  cantsendtouser?: string;
  candeletemessagesforallusers: boolean;
}[];

export type DeleteMessageContactsResponse = null;

export type MuteConversationsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type UnmuteConversationsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type BlockMessageUserResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type UnblockMessageUserResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type GetContactRequestsResponse = {
  id: number;
  fullname: string;
  initials?: string;
  profileurl: string;
  profileimageurl: string;
  profileimageurlsmall: string;
  isonline: boolean;
  showonlinestatus: boolean;
  isblocked: boolean;
  iscontact: boolean;
  isdeleted: boolean;
  canmessageevenifblocked: boolean;
  canmessage: boolean;
  requirescontact: boolean;
  cancreatecontact: boolean;
}[];

export type GetReceivedContactRequestCountResponse = number;

export type GetConversationMembersResponse = {
  id: number;
  fullname: string;
  initials?: string;
  profileurl: string;
  profileimageurl: string;
  profileimageurlsmall: string;
  isonline: boolean;
  showonlinestatus: boolean;
  isblocked: boolean;
  iscontact: boolean;
  isdeleted: boolean;
  canmessageevenifblocked: boolean;
  canmessage: boolean;
  requirescontact: boolean;
  cancreatecontact: boolean;
}[];

export interface CreateContactRequestResponse {
  request?: {
    id: number;
    userid: number;
    requesteduserid: number;
    timecreated: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type ConfirmContactRequestResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type DeclineContactRequestResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export interface SearchMessageUsersResponse {
  contacts: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
  noncontacts: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
}

export interface SearchMessagesResponse {
  contacts: {
    userid: number;
    fullname: string;
    initials?: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    ismessaging: boolean;
    sentfromcurrentuser: boolean;
    lastmessage: string;
    lastmessagedate: number;
    messageid: number;
    showonlinestatus: boolean;
    isonline: boolean;
    isread: boolean;
    isblocked: boolean;
    unreadcount: number;
    conversationid: number;
  }[];
}

export interface GetConversationBetweenUsersResponse {
  id: number;
  name: string;
  subname: string;
  imageurl: string;
  type: number;
  membercount: number;
  ismuted: boolean;
  isfavourite: boolean;
  isread: boolean;
  unreadcount: number;
  members: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
  messages: {
    id: number;
    useridfrom: number;
    text: string;
    timecreated: number;
  }[];
  candeletemessagesforallusers: boolean;
  cansendmessagetoconversation: boolean;
}

export interface GetSelfConversationResponse {
  id: number;
  name: string;
  subname: string;
  imageurl: string;
  type: number;
  membercount: number;
  ismuted: boolean;
  isfavourite: boolean;
  isread: boolean;
  unreadcount: number;
  members: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
  messages: {
    id: number;
    useridfrom: number;
    text: string;
    timecreated: number;
  }[];
  candeletemessagesforallusers: boolean;
  cansendmessagetoconversation: boolean;
}

export interface GetConversationMessagesResponse {
  id: number;
  members: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
  messages: {
    id: number;
    useridfrom: number;
    text: string;
    timecreated: number;
  }[];
}

export type GetMessageContactsResponse = {
  id: number;
  fullname: string;
  initials?: string;
  profileurl: string;
  profileimageurl: string;
  profileimageurlsmall: string;
  isonline: boolean;
  showonlinestatus: boolean;
  isblocked: boolean;
  iscontact: boolean;
  isdeleted: boolean;
  canmessageevenifblocked: boolean;
  canmessage: boolean;
  requirescontact: boolean;
  cancreatecontact: boolean;
}[];

export type SearchMessageContactsResponse = {
  id: number;
  fullname: string;
  profileimageurl?: string;
  profileimageurlsmall?: string;
}[];

export interface GetConversationsResponse {
  conversations: {
    id: number;
    name: string;
    subname: string;
    imageurl: string;
    type: number;
    membercount: number;
    ismuted: boolean;
    isfavourite: boolean;
    isread: boolean;
    unreadcount: number;
    members: {
      id: number;
      fullname: string;
      initials?: string;
      profileurl: string;
      profileimageurl: string;
      profileimageurlsmall: string;
      isonline: boolean;
      showonlinestatus: boolean;
      isblocked: boolean;
      iscontact: boolean;
      isdeleted: boolean;
      canmessageevenifblocked: boolean;
      canmessage: boolean;
      requirescontact: boolean;
      cancreatecontact: boolean;
    }[];
    messages: {
      id: number;
      useridfrom: number;
      text: string;
      timecreated: number;
    }[];
    candeletemessagesforallusers: boolean;
    cansendmessagetoconversation: boolean;
  }[];
}

export interface GetConversationResponse {
  id: number;
  name: string;
  subname: string;
  imageurl: string;
  type: number;
  membercount: number;
  ismuted: boolean;
  isfavourite: boolean;
  isread: boolean;
  unreadcount: number;
  members: {
    id: number;
    fullname: string;
    initials?: string;
    profileurl: string;
    profileimageurl: string;
    profileimageurlsmall: string;
    isonline: boolean;
    showonlinestatus: boolean;
    isblocked: boolean;
    iscontact: boolean;
    isdeleted: boolean;
    canmessageevenifblocked: boolean;
    canmessage: boolean;
    requirescontact: boolean;
    cancreatecontact: boolean;
  }[];
  messages: {
    id: number;
    useridfrom: number;
    text: string;
    timecreated: number;
  }[];
  candeletemessagesforallusers: boolean;
  cansendmessagetoconversation: boolean;
}

export interface GetMessagesResponse {
  messages: {
    id: number;
    useridfrom: number;
    useridto: number;
    subject: string;
    text: string;
    fullmessage: string;
    fullmessageformat: number;
    fullmessagehtml: string;
    smallmessage: string;
    notification: number;
    contexturl: string;
    contexturlname: string;
    timecreated: number;
    timeread: number;
    usertofullname: string;
    userfromfullname: string;
    component?: string;
    eventtype?: string;
    customdata?: string;
    iconurl?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetConversationCountsResponse {
  favourites: number;
  types: JsonObject;
}

export interface GetUnreadConversationCountsResponse {
  favourites: number;
  types: JsonObject;
}

export type GetUnreadConversationsCountResponse = number;

export type GetUnreadNotificationCountResponse = number;

export interface GetBlockedMessageUsersResponse {
  users: {
    id: number;
    fullname: string;
    profileimageurl?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GetMessageMemberInfoResponse = {
  id: number;
  fullname: string;
  initials?: string;
  profileurl: string;
  profileimageurl: string;
  profileimageurlsmall: string;
  isonline: boolean;
  showonlinestatus: boolean;
  isblocked: boolean;
  iscontact: boolean;
  isdeleted: boolean;
  canmessageevenifblocked: boolean;
  canmessage: boolean;
  requirescontact: boolean;
  cancreatecontact: boolean;
}[];

export interface MarkMessageReadResponse {
  messageid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MarkNotificationReadResponse {
  notificationid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type MarkAllNotificationsReadResponse = boolean;

export type MarkConversationReadResponse = null;

export type DeleteConversationsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export interface DeleteMessageResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type DeleteMessageForAllUsersResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type ConfigureMessageProcessorResponse = null;

export type GetUserNotificationPreferencesResponse = JsonObject;

export type GetUserMessagePreferencesResponse = JsonObject;

export type SetFavouriteConversationsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type UnsetFavouriteConversationsResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export interface ExplainTextWithAiResponse {
  success: boolean;
  timecreated: number;
  prompttext: string;
  generatedcontent: string;
  finishreason: string | null;
  error: boolean;
  errormessage: string | null;
}

export interface SummariseTextWithAiResponse {
  success: boolean;
  timecreated: number;
  prompttext: string;
  generatedcontent: string;
  finishreason: string | null;
  errorcode: string | null;
  error: boolean;
  errormessage: string | null;
}

export interface GenerateAiImageResponse {
  success: boolean;
  revisedprompt: string | null;
  drafturl: string | null;
  errorcode: string | null;
  error: boolean;
  errormessage: string | null;
}

export interface GenerateAiTextResponse {
  success: boolean;
  timecreated: number;
  prompttext: string;
  generatedcontent: string;
  finishreason: string | null;
  errorcode: string | null;
  error: boolean;
  errormessage: string | null;
}

export interface GetAiPolicyStatusResponse {
  status: boolean;
}

export interface SetAiPolicyStatusResponse {
  success: boolean;
}

export type GetAnalyticsContextsResponse = {
  id: number;
  name: string;
}[];

export interface GetMobilePluginsResponse {
  plugins: {
    component: string;
    version: string;
    addon: string;
    dependencies: string[];
    fileurl: string;
    filehash: string;
    filesize: number;
    handlers?: string;
    lang?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetMobilePublicConfigResponse {
  wwwroot: string;
  httpswwwroot: string;
  sitename: string;
  guestlogin: number;
  rememberusername: number;
  authloginviaemail: number;
  registerauth: string;
  forgottenpasswordurl: string;
  authinstructions: string;
  authnoneenabled: number;
  enablewebservices: number;
  enablemobilewebservice: number;
  maintenanceenabled: number;
  maintenancemessage: string;
  logourl?: string;
  compactlogourl?: string;
  typeoflogin: number;
  launchurl?: string;
  mobilecssurl?: string;
  tool_mobile_disabledfeatures?: string;
  identityproviders?: {
    name: string;
    iconurl: string;
    url: string;
  }[];
  country?: string;
  agedigitalconsentverification?: boolean;
  supportname?: string;
  supportemail?: string;
  supportpage?: string;
  supportavailability?: number;
  autolang?: number;
  lang?: string;
  langmenu?: number;
  langlist?: string;
  locale?: string;
  tool_mobile_minimumversion?: string;
  tool_mobile_iosappid?: string;
  tool_mobile_androidappid?: string;
  tool_mobile_setuplink?: string;
  tool_mobile_qrcodetype?: number;
  tool_mobile_enabledeeplinkautologin?: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
  showloginform: number;
  tool_mfa_enabled?: boolean;
  enableloginrecaptcha?: boolean;
  enableforgotpasswordrecaptcha?: boolean;
}

export interface GetMobileConfigResponse {
  settings: {
    name: string;
    value: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetMobileAutologinKeyResponse {
  key: string;
  autologinurl: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetMobileContentResponse {
  templates: {
    id: string;
    html: string;
  }[];
  javascript: string;
  otherdata: {
    name: string;
    value: string;
  }[];
  files: {
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
    mimetype: string;
    isexternal?: boolean;
    repositorytype?: string;
  }[];
  restrict: {
    users?: number[];
    courses?: number[];
  };
  disabled?: boolean;
}

export type CallMobileExternalFunctionsResponse = JsonObject;

export interface GetMobileQrLoginTokensResponse {
  token: string;
  privatetoken: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ValidateMobileSubscriptionKeyResponse {
  validated: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GetPolicyVersionResponse {
  result: {
    policy?: {
      name?: string;
      versionid?: number;
      content?: string;
    };
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface SearchMoodlenetCoursesResponse {
  courses: {
    id: number;
    fullname: string;
    hidden: number;
    viewurl: string;
    coursecategory: string;
    courseimage: string;
  }[];
}

export interface VerifyMoodlenetProfileResponse {
  result: boolean;
  message: string;
  domain: string | null;
}

export interface AuthEmailGetSignupSettingsResponse {
  namefields: string[];
  passwordpolicy?: string;
  sitepolicy?: string;
  sitepolicyhandler?: string;
  defaultcity?: string;
  country?: string;
  extendedusernamechars?: boolean;
  profilefields?: {
    id?: number;
    shortname?: string;
    name?: string;
    datatype?: string;
    description?: string;
    descriptionformat: number;
    categoryid?: number;
    categoryname?: string;
    sortorder?: number;
    required?: number;
    locked?: number;
    visible?: number;
    forceunique?: number;
    signup?: number;
    defaultdata?: string;
    defaultdataformat: number;
    param1?: string;
    param2?: string;
    param3?: string;
    param4?: string;
    param5?: string;
  }[];
  recaptchapublickey?: string;
  recaptchachallengehash?: string;
  recaptchachallengeimage?: string;
  recaptchachallengejs?: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface AuthEmailSignupUserResponse {
  success: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type BlockAccessreviewGetModuleDataResponse = {
  cmid: number;
  numerrors: number;
  numchecks: number;
}[];

export type BlockAccessreviewGetSectionDataResponse = {
  section: number;
  numerrors: number;
  numchecks: number;
}[];

export type AdminSetBlockProtectionResponse = Record<string, never>;

export type AdminSetPluginOrderResponse = Record<string, never>;

export type AdminSetPluginStateResponse = Record<string, never>;

export interface AiDeleteProviderInstanceResponse {
  result: boolean;
  message: string;
  messagetype: string;
}

export type AiSetActionResponse = JsonObject;

export type AiSetProviderOrderResponse = Record<string, never>;

export interface AiSetProviderStatusResponse {
  result: boolean;
  message: string;
  messagetype: string;
}

export interface AuthConfirmUserResponse {
  success: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface AuthIsAgeDigitalConsentVerificationEnabledResponse {
  status: boolean;
}

export interface AuthIsMinorResponse {
  status: boolean;
}

export interface AuthRequestPasswordResetResponse {
  status: string;
  notice: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface AuthResendConfirmationEmailResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface BackupGetAsyncBackupLinksBackupResponse {
  filesize: string;
  fileurl: string;
  restoreurl: string;
}

export interface BackupGetAsyncBackupLinksRestoreResponse {
  restoreurl: string;
}

export type BackupGetAsyncBackupProgressResponse = {
  status: number;
  progress: number;
  backupid: string;
  operation: string;
}[];

export type BackupGetCopyProgressResponse = {
  status: number;
  progress: number;
  backupid: string;
  operation: string;
}[];

export type BackupSubmitCopyFormResponse = string;

export interface BadgesDisableBadgesResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface BadgesEnableBadgesResponse {
  result: {
    badgeid: number;
    awards: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CalendarDeleteSubscriptionResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface CalendarGetTimestampsResponse {
  timestamps: {
    key: string;
    timestamp: number;
  }[];
}

export interface ChangeEditmodeResponse {
  success: boolean;
}

export interface CheckGetResultAdmintreeResponse {
  status: string;
  summary: string;
  html?: string;
  details?: string;
}

export type CompetencyAddCompetencyToCourseResponse = boolean;

export type CompetencyAddCompetencyToPlanResponse = boolean;

export type CompetencyAddCompetencyToTemplateResponse = boolean;

export type CompetencyAddRelatedCompetencyResponse = boolean;

export type CompetencyApprovePlanResponse = boolean;

export type CompetencyCompetencyFrameworkViewedResponse = boolean;

export type CompetencyCompletePlanResponse = boolean;

export type CompetencyCountCompetenciesResponse = number;

export type CompetencyCountCompetenciesInCourseResponse = number;

export type CompetencyCountCompetenciesInTemplateResponse = number;

export type CompetencyCountCompetencyFrameworksResponse = number;

export type CompetencyCountCourseModuleCompetenciesResponse = number;

export type CompetencyCountCoursesUsingCompetencyResponse = number;

export type CompetencyCountTemplatesResponse = number;

export type CompetencyCountTemplatesUsingCompetencyResponse = number;

export type CompetencyCreateCompetencyResponse = Record<string, never>;

export type CompetencyCreateCompetencyFrameworkResponse = Record<string, never>;

export type CompetencyCreatePlanResponse = Record<string, never>;

export type CompetencyCreateTemplateResponse = Record<string, never>;

export type CompetencyCreateUserEvidenceCompetencyResponse = Record<string, never>;

export type CompetencyDeleteCompetencyResponse = boolean;

export type CompetencyDeleteCompetencyFrameworkResponse = boolean;

export type CompetencyDeletePlanResponse = boolean;

export type CompetencyDeleteTemplateResponse = boolean;

export type CompetencyDeleteUserEvidenceResponse = boolean;

export type CompetencyDeleteUserEvidenceCompetencyResponse = boolean;

export type CompetencyDuplicateCompetencyFrameworkResponse = Record<string, never>;

export type CompetencyDuplicateTemplateResponse = Record<string, never>;

export type CompetencyGradeCompetencyResponse = Record<string, never>;

export type CompetencyGradeCompetencyInPlanResponse = Record<string, never>;

export type CompetencyListCompetenciesResponse = JsonObject[];

export type CompetencyListCompetenciesInTemplateResponse = JsonObject[];

export type CompetencyListCompetencyFrameworksResponse = JsonObject[];

export type CompetencyListCourseModuleCompetenciesResponse = {
  competency: JsonObject;
  coursemodulecompetency: JsonObject;
}[];

export type CompetencyListPlanCompetenciesResponse = {
  competency: JsonObject;
  usercompetency: JsonObject;
  usercompetencyplan: JsonObject;
}[];

export type CompetencyListTemplatesResponse = JsonObject[];

export type CompetencyListTemplatesUsingCompetencyResponse = JsonObject[];

export type CompetencyListUserPlansResponse = JsonObject[];

export type CompetencyMoveDownCompetencyResponse = boolean;

export type CompetencyMoveUpCompetencyResponse = boolean;

export type CompetencyPlanCancelReviewRequestResponse = boolean;

export type CompetencyPlanRequestReviewResponse = boolean;

export type CompetencyPlanStartReviewResponse = boolean;

export type CompetencyPlanStopReviewResponse = boolean;

export type CompetencyReadCompetencyResponse = Record<string, never>;

export type CompetencyReadCompetencyFrameworkResponse = Record<string, never>;

export type CompetencyReadPlanResponse = Record<string, never>;

export type CompetencyReadTemplateResponse = Record<string, never>;

export type CompetencyReadUserEvidenceResponse = Record<string, never>;

export type CompetencyRemoveCompetencyFromCourseResponse = boolean;

export type CompetencyRemoveCompetencyFromPlanResponse = boolean;

export type CompetencyRemoveCompetencyFromTemplateResponse = boolean;

export type CompetencyRemoveRelatedCompetencyResponse = boolean;

export type CompetencyReopenPlanResponse = boolean;

export type CompetencyReorderCourseCompetencyResponse = boolean;

export type CompetencyReorderPlanCompetencyResponse = boolean;

export type CompetencyReorderTemplateCompetencyResponse = boolean;

export type CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesResponse = boolean;

export type CompetencySearchCompetenciesResponse = JsonObject[];

export type CompetencySetCourseCompetencyRuleoutcomeResponse = boolean;

export type CompetencySetParentCompetencyResponse = boolean;

export type CompetencyTemplateHasRelatedDataResponse = boolean;

export type CompetencyTemplateViewedResponse = boolean;

export type CompetencyUnapprovePlanResponse = boolean;

export type CompetencyUnlinkPlanFromTemplateResponse = boolean;

export type CompetencyUpdateCompetencyResponse = boolean;

export type CompetencyUpdateCompetencyFrameworkResponse = boolean;

export type CompetencyUpdateCourseCompetencySettingsResponse = boolean;

export type CompetencyUpdatePlanResponse = Record<string, never>;

export type CompetencyUpdateTemplateResponse = boolean;

export type CompetencyUserCompetencyCancelReviewRequestResponse = boolean;

export type CompetencyUserCompetencyRequestReviewResponse = boolean;

export type CompetencyUserCompetencyStartReviewResponse = boolean;

export type CompetencyUserCompetencyStopReviewResponse = boolean;

export interface ContentbankCopyContentResponse {
  id: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ContentbankDeleteContentResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ContentbankRenameContentResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ContentbankSetContentVisibilityResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type CourseAddContentItemToUserFavouritesResponse = Record<string, never>;

export type CourseDeleteModulesResponse = null;

export interface CourseDuplicateCourseResponse {
  id: number;
  shortname: string;
}

export type CourseEditModuleResponse = string;

export type CourseEditSectionResponse = string;

export interface CourseGetActivityChooserFooterResponse {
  footer: boolean;
  customfooterjs?: string;
  customfootertemplate?: string;
  customcarouseltemplate?: string;
}

export interface CourseGetCourseContentItemsResponse {
  content_items: JsonObject[];
}

export interface CourseGetEnrolledUsersByCmidResponse {
  users: {
    id: string;
    profileimage?: string;
    fullname?: string;
    firstname?: string;
    lastname?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type CourseGetModuleResponse = string;

export type CourseImportCourseResponse = null;

export type CourseRemoveContentItemFromUserFavouritesResponse = Record<string, never>;

export interface CourseToggleActivityRecommendationResponse {
  id: number;
  area: string;
  status: boolean;
}

export type CourseformatCreateModuleResponse = string;

export type CourseformatFileHandlersResponse = {
  extension: string;
  module: string;
  message: string;
}[];

export interface CourseformatGetSectionContentItemsResponse {
  content_items: JsonObject[];
}

export type CourseformatGetStateResponse = string;

export type CourseformatNewModuleResponse = string;

export type CourseformatUpdateCourseResponse = string;

export type CreateUserfeedbackActionRecordResponse = null;

export type CustomfieldConvertCategoryResponse = boolean;

export type CustomfieldCreateCategoryResponse = number;

export type CustomfieldDeleteCategoryResponse = null;

export type CustomfieldDeleteFieldResponse = null;

export type CustomfieldMoveCategoryResponse = null;

export type CustomfieldMoveFieldResponse = null;

export interface CustomfieldReloadTemplateResponse {
  component: string;
  area: string;
  itemid: number;
  usescategories: boolean;
  hascategories: boolean;
  hassharedcategories: boolean;
  categories: {
    id: number;
    name: string;
    nameeditable: string;
    addfieldmenu: string;
    actionsmenu: string;
    movetitle: string;
    canedit: boolean;
    fields?: {
      name: string;
      shortname: string;
      type: string;
      id: number;
      actionsmenu: string;
      movetitle: string;
    }[];
    toggle?: string;
    extraclasses?: string;
  }[];
  canmovefields: boolean;
  canmovecategories: boolean;
}

export type CustomfieldToggleSharedResponse = boolean;

export interface DynamicTabsGetContentResponse {
  template: string;
  content: string;
  javascript: string;
}

export type FetchNotificationsResponse = {
  template: string;
  variables: {
    message: string;
    extraclasses: string;
    announce: string;
    closebutton: string;
  };
}[];

export interface FilesUploadResponse {
  contextid: number;
  component: string;
  filearea: string;
  itemid: number;
  filepath: string;
  filename: string;
  url: string;
}

export interface FormDynamicFormResponse {
  submitted: boolean;
  data?: string;
  html?: string;
  javascript?: string;
}

export interface FormGetFiletypesBrowserDataResponse {
  groups: {
    key: string;
    name: string;
    selectable: boolean;
    selected: boolean;
    ext: string;
    expanded: boolean;
    types: {
      key: string;
      name: string;
      selected: boolean;
      ext: string;
    }[];
  }[];
}

export interface GetFragmentResponse {
  html: string;
  javascript: string;
}

export type GetStringResponse = string;

export type GetStringsResponse = {
  stringid: string;
  component: string;
  lang: string;
  string: string;
}[];

export interface GetUserDatesResponse {
  dates: string[];
}

export interface GradingGetDefinitionsResponse {
  areas: {
    cmid: number;
    contextid: number;
    component: string;
    areaname: string;
    activemethod?: string;
    definitions: Record<string, never>[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GradingGetGradingformInstancesResponse {
  instances: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GradingSaveDefinitionsResponse = null;

export type MessageGetMessageProcessorResponse = JsonObject;

export interface MessageGetUnsentMessageResponse {
  message?: string;
  conversationid?: number;
  otheruserid?: number;
}

export type MessageSetDefaultNotificationResponse = JsonObject;

export type MessageSetUnsentMessageResponse = null;

export interface MoodlenetAuthCheckResponse {
  loginurl: string;
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MoodlenetGetShareInfoActivityResponse {
  name: string;
  type: string;
  server: string;
  supportpageurl: string;
  issuerid: number;
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MoodlenetGetSharedCourseInfoResponse {
  name: string;
  type: string;
  server: string;
  supportpageurl: string;
  issuerid: number;
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MoodlenetSendActivityResponse {
  status: boolean;
  resourceurl: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MoodlenetSendCourseResponse {
  status: boolean;
  resourceurl: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface NotesGetNotesResponse {
  notes: {
    noteid?: number;
    userid?: number;
    publishstate?: string;
    courseid?: number;
    text?: string;
    format?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type NotesUpdateNotesResponse = {
  item: string;
  itemid: number;
  warningcode: string;
  message: string;
}[];

export type OutputLoadTemplateResponse = string;

export interface OutputLoadTemplateWithDependenciesResponse {
  templates: {
    component: string;
    name: string;
    value: string;
  }[];
  strings: {
    component: string;
    name: string;
    value: string;
  }[];
}

export type OutputPollStoredProgressResponse = {
  id: number;
  uniqueid: string;
  progress: number;
  estimated: string;
  message: string;
  error?: string;
  timeout?: string;
}[];

export type PaymentGetAvailableGatewaysResponse = {
  shortname: string;
  name: string;
  description: string;
  surcharge: number;
  cost: string;
}[];

export interface QuestionGetRandomQuestionSummariesResponse {
  totalcount: number;
  questions: JsonObject[];
}

export type QuestionMoveQuestionsResponse = string;

export interface QuestionSearchSharedBanksResponse {
  sharedbanks: {
    value: number;
    label: string;
  }[];
}

export type ReportbuilderAudiencesDeleteResponse = boolean;

export type ReportbuilderColumnsAddResponse = Record<string, never>;

export type ReportbuilderColumnsDeleteResponse = Record<string, never>;

export type ReportbuilderColumnsReorderResponse = boolean;

export type ReportbuilderColumnsSortGetResponse = Record<string, never>;

export type ReportbuilderColumnsSortReorderResponse = Record<string, never>;

export type ReportbuilderColumnsSortToggleResponse = Record<string, never>;

export type ReportbuilderConditionsAddResponse = Record<string, never>;

export type ReportbuilderConditionsDeleteResponse = Record<string, never>;

export type ReportbuilderConditionsReorderResponse = Record<string, never>;

export type ReportbuilderConditionsResetResponse = Record<string, never>;

export type ReportbuilderFiltersAddResponse = Record<string, never>;

export type ReportbuilderFiltersDeleteResponse = Record<string, never>;

export type ReportbuilderFiltersReorderResponse = Record<string, never>;

export type ReportbuilderFiltersResetResponse = boolean;

export type ReportbuilderReportsDeleteResponse = boolean;

export type ReportbuilderReportsGetResponse = Record<string, never>;

export type ReportbuilderSchedulesDeleteResponse = boolean;

export type ReportbuilderSchedulesSendResponse = boolean;

export type ReportbuilderSchedulesToggleResponse = boolean;

export type ReportbuilderSetFiltersResponse = boolean;

export type SearchGetRelevantUsersResponse = {
  id: number;
  fullname: string;
  profileimageurlsmall: string;
}[];

export interface SessionTimeRemainingResponse {
  userid: number;
  timeremaining: number;
}

export type SessionTouchResponse = boolean;

export interface SmsSetGatewayStatusResponse {
  result: boolean;
  message: string;
  messagetype: string;
}

export interface TagGetTagsResponse {
  tags: {
    id: number;
    tagcollid: number;
    name: string;
    rawname: string;
    description: string;
    descriptionformat: number;
    flag?: number;
    official?: number;
    isstandard?: number;
    viewurl: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface TagUpdateTagsResponse {
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UpdateInplaceEditableResponse {
  displayvalue: string;
  component?: string;
  itemtype?: string;
  value?: string;
  itemid?: string;
  edithint?: string;
  editlabel?: string;
  editicon?: {
    key?: string;
    component?: string;
    title?: string;
  };
  type?: string;
  options?: string;
  linkeverything?: number;
}

export interface UserGetUsersResponse {
  users: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface UserSearchIdentityResponse {
  list: {
    id: string;
    fullname: string;
    extrafields?: {
      name: string;
      value: string;
    }[];
  }[];
  maxusersperpage: number;
  overflow: boolean;
}

export interface CustomfieldNumberRecalculateValueResponse {
  value: string;
}

export type EnrolMetaAddInstancesResponse = {
  metacourseid: number;
  courseid: string;
  status: boolean;
}[];

export type EnrolMetaDeleteInstancesResponse = {
  metacourseid: number;
  courseid: string;
  status: boolean;
}[];

export interface GradingformGuideGraderGradingpanelFetchResponse {
  templatename: string;
  hasgrade: boolean;
  grade: {
    instanceid: number;
    criterion: {
      id: number;
      name: string;
      maxscore: number;
      description: string;
      descriptionmarkers: string;
      score?: number;
      remark?: string;
    }[];
    hascomments: boolean;
    comments: {
      id: number;
      sortorder: number;
      description: string;
    }[];
    usergrade: string;
    maxgrade: string;
    gradedby: string;
    timecreated: number;
    timemodified: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GradingformGuideGraderGradingpanelStoreResponse = JsonObject;

export interface GradingformRubricGraderGradingpanelFetchResponse {
  templatename: string;
  hasgrade: boolean;
  grade: {
    instanceid: number;
    rubricmode: string;
    canedit: boolean;
    criteria: {
      id: number;
      description: string;
      remark?: string;
      levels: {
        id: number;
        criterionid: number;
        score: string;
        definition: string;
        checked: boolean;
      }[];
    }[];
    timecreated: number;
    usergrade: string;
    maxgrade: string;
    gradedby: string;
    timemodified: number;
  };
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type GradingformRubricGraderGradingpanelStoreResponse = JsonObject;

export type MediaVideojsGetLanguageResponse = string;

export type PaygwPaypalCreateTransactionCompleteResponse = JsonObject;

export interface PaygwPaypalGetConfigForJsResponse {
  clientid: string;
  brandname: string;
  cost: number;
  currency: string;
}

export type QbankColumnsortorderSetColumnSizeResponse = null;

export type QbankColumnsortorderSetColumnbankOrderResponse = null;

export type QbankColumnsortorderSetHiddenColumnsResponse = null;

export interface QbankEditquestionSetStatusResponse {
  status: boolean;
  statusname: string;
  error: string;
}

export type QbankManagecategoriesMoveCategoryResponse = {
  name: string;
  action: string;
  fields: {
    id: number;
    sortorder?: number;
    parent?: number;
    contextid?: number;
    draghandle?: boolean;
  };
}[];

export interface QbankTagquestionSubmitTagsFormResponse {
  status: boolean;
}

export type QbankViewquestiontextSetQuestionTextFormatResponse = null;

export interface QuizaccessSebValidateQuizKeysResponse {
  configkey: boolean;
  browserexamkey: boolean;
}

export interface ReportCompetencyDataForReportResponse {
  courseid: number;
  user: JsonObject;
  course: JsonObject;
  usercompetencies: {
    usercompetencycourse: JsonObject;
    competency: JsonObject;
  }[];
  pushratingstouserplans: boolean;
}

export type TinyAutosaveResetSessionResponse = Record<string, never>;

export interface TinyAutosaveResumeSessionResponse {
  drafttext: string;
}

export type TinyAutosaveUpdateSessionResponse = Record<string, never>;

export interface TinyEquationFilterResponse {
  content: string;
}

export interface TinyMediaPreviewResponse {
  content: string;
}

export type AdminPresetsDeletePresetResponse = null;

export interface BehatGetEntityGeneratorResponse {
  required?: string[];
}

export interface DataprivacyApproveDataRequestResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyBulkApproveDataRequestsResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyBulkDenyDataRequestsResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyConfirmContextsForDeletionResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyCreateCategoryFormResponse {
  category: JsonObject;
  validationerrors: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyCreatePurposeFormResponse {
  purpose: JsonObject;
  validationerrors: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyDeleteCategoryResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyDeletePurposeResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyDenyDataRequestResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyGetActivityOptionsResponse {
  options: {
    name: string;
    displayname: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyGetCategoryOptionsResponse {
  options: {
    id: number;
    name: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyGetDataRequestResponse {
  result: JsonObject;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyGetPurposeOptionsResponse {
  options: {
    id: number;
    name: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type DataprivacyGetUsersResponse = {
  id: string;
  fullname: string;
  extrafields?: {
    name: string;
    value: string;
  }[];
}[];

export interface DataprivacyMarkCompleteResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacySetContextDefaultsResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacySetContextFormResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacySetContextlevelFormResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacySubmitSelectedCoursesFormResponse {
  result: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface DataprivacyTreeExtraBranchesResponse {
  branches: {
    text: string;
    expandcontextid: number;
    expandelement: string;
    contextid: number;
    contextlevel: number;
    expanded: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface LpDataForCompetenciesManagePageResponse {
  framework: JsonObject;
  canmanage: boolean;
  pagecontextid: number;
  search: string;
  rulesmodules: string;
  pluginbaseurl: string;
}

export interface LpDataForCompetencyFrameworksManagePageResponse {
  competencyframeworks: JsonObject[];
  pluginbaseurl: string;
  navigation: string[];
  pagecontextid: number;
}

export type LpDataForCompetencySummaryResponse = Record<string, never>;

export interface LpDataForRelatedCompetenciesSectionResponse {
  relatedcompetencies: JsonObject[];
  showdeleterelatedaction: boolean;
}

export interface LpDataForTemplateCompetenciesPageResponse {
  template: JsonObject;
  pagecontextid: number;
  canmanagecompetencyframeworks: boolean;
  canmanagetemplatecompetencies: boolean;
  competencies: JsonObject[];
  manageurl: string;
  pluginbaseurl: string;
  statistics: JsonObject;
}

export interface LpDataForTemplatesManagePageResponse {
  templates: JsonObject[];
  pluginbaseurl: string;
  navigation: string[];
  pagecontextid: number;
  canmanage: boolean;
}

export type LpListCoursesUsingCompetencyResponse = JsonObject[];

export interface LpSearchCohortsResponse {
  cohorts: {
    id: number;
    name: string;
    idnumber: string;
    description: string;
    descriptionformat: number;
    visible: boolean;
    theme?: string;
    customfields: {
      name: string;
      shortname: string;
      type: string;
      valueraw: string;
      value: string;
    }[];
  }[];
}

export interface LpSearchUsersResponse {
  users: JsonObject[];
  count: number;
}

export type PolicySubmitAcceptOnBehalfResponse = boolean;

export type TemplatelibraryListTemplatesResponse = string[];

export type TemplatelibraryLoadCanonicalTemplateResponse = string;

export type UsertoursCompleteTourResponse = Record<string, never>;

export interface UsertoursFetchAndStartTourResponse {
  tourconfig?: {
    name: string;
    steps: {
      title: string;
      content: string;
      element: string;
      placement: string;
      delay?: number;
      backdrop?: boolean;
      reflex?: boolean;
      orphan?: boolean;
      stepid?: number;
    }[];
    endtourlabel: string;
    displaystepnumbers: boolean;
  };
}

export interface UsertoursResetTourResponse {
  startTour?: number;
}

export type UsertoursStepShownResponse = Record<string, never>;

export type XmldbInvokeMoveActionResponse = null;

export interface GradesGetEnrolledUsersForSearchWidgetResponse {
  users: {
    id: string;
    profileimage?: string;
    url?: string;
    fullname?: string;
    email?: string;
    active: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface GradesGetGroupsForSearchWidgetResponse {
  groups: {
    id: string;
    name: string;
    groupimageurl?: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export type OutputLoadFontawesomeIconMapResponse = {
  component: string;
  pix: string;
  to: string;
}[];

export interface ModAssignDeleteOverridesResponse {
  ids: number[];
}

export interface ModAssignGetOverridesResponse {
  overrides: {
    id: number;
    assignid: number;
    userid: number;
    groupid: number;
    sortorder: number;
    allowsubmissionsfromdate: number;
    duedate: number;
    cutoffdate: number;
    timelimit: number;
    reason: string;
    reasonformat: number;
  }[];
}

export interface ModAssignSaveOverridesResponse {
  ids: number[];
}

export interface ModChatGetChatLatestMessagesResponse {
  messages: {
    id: number;
    userid: number;
    system: boolean;
    message: string;
    timestamp: number;
  }[];
  chatnewlasttime: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatGetChatUsersResponse {
  users: {
    id: number;
    fullname: string;
    profileimageurl: string;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatGetChatsByCoursesResponse {
  chats: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    chatmethod?: string;
    keepdays?: number;
    studentlogs?: number;
    chattime?: number;
    schedule?: number;
    timemodified?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatGetSessionMessagesResponse {
  messages: Record<string, never>[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatGetSessionsResponse {
  sessions: {
    sessionstart: number;
    sessionend: number;
    sessionusers: {
      userid: number;
      messagecount: number;
    }[];
    iscomplete: boolean;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatLoginUserResponse {
  chatsid: string;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatSendChatMessageResponse {
  messageid: number;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatViewChatResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModChatViewSessionsResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModForumSetReadStateResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModQuizGetUsersInReportResponse {
  extrafields: string[];
  users: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    fullname: string;
    initials?: string;
    email?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    department?: string;
    institution?: string;
    idnumber?: string;
    interests?: string;
    firstaccess?: string;
    lastaccess?: string;
    auth?: string;
    suspended?: string;
    confirmed?: string;
    lang?: string;
    calendartype?: string;
    theme?: string;
    timezone?: string;
    mailformat?: string;
    trackforums?: string;
    description?: string;
    descriptionformat?: number;
    city?: string;
    country?: string;
    profileimageurlsmall: string;
    profileimageurl: string;
    customfields?: {
      type: string;
      value: string;
      displayvalue?: string;
      name: string;
      shortname: string;
    }[];
    preferences?: {
      name: string;
      value: string;
    }[];
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModSurveyGetQuestionsResponse {
  questions: {
    id: number;
    text: string;
    shorttext: string;
    multi: string;
    intro: string;
    type: number;
    options: string;
    parent: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModSurveyGetSurveysByCoursesResponse {
  surveys: {
    id: number;
    coursemodule: number;
    course: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles?: {
      filename: string;
      filepath: string;
      filesize: number;
      fileurl: string;
      timemodified: number;
      mimetype: string;
      isexternal?: boolean;
      repositorytype?: string;
    }[];
    section?: number;
    visible?: boolean;
    groupmode?: number;
    groupingid?: number;
    lang?: string;
    template?: number;
    days?: number;
    questions?: string;
    surveydone?: number;
    timecreated?: number;
    timemodified?: number;
  }[];
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModSurveySubmitAnswersResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ModSurveyViewSurveyResponse {
  status: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ReportInsightsSetFixedPredictionResponse {
  success: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface ReportInsightsSetNotusefulPredictionResponse {
  success: boolean;
  warnings: {
    item: string;
    itemid: number;
    warningcode: string;
    message: string;
  }[];
}

export interface MoodleOperationParameters {
  get_site_info: GetSiteInfoParameters;
  get_courses: GetCoursesParameters;
  get_course: GetCourseParameters;
  create_course: CreateCourseParameters;
  update_course: UpdateCourseParameters;
  delete_course: DeleteCourseParameters;
  get_course_contents: GetCourseContentsParameters;
  get_users_by_field: GetUsersByFieldParameters;
  create_user: CreateUserParameters;
  update_user: UpdateUserParameters;
  delete_user: DeleteUserParameters;
  enrol_user: EnrolUserParameters;
  unenrol_user: UnenrolUserParameters;
  get_course_groups: GetCourseGroupsParameters;
  create_group: CreateGroupParameters;
  delete_group: DeleteGroupParameters;
  add_group_member: AddGroupMemberParameters;
  remove_group_member: RemoveGroupMemberParameters;
  get_course_categories: GetCourseCategoriesParameters;
  get_course_category: GetCourseCategoryParameters;
  get_enrolled_users: GetEnrolledUsersParameters;
  get_cohorts: GetCohortsParameters;
  get_group_members: GetGroupMembersParameters;
  get_course_groupings: GetCourseGroupingsParameters;
  get_activity_completion_statuses: GetActivityCompletionStatusesParameters;
  get_course_completion_status: GetCourseCompletionStatusParameters;
  get_calendar_events: GetCalendarEventsParameters;
  get_grade_items: GetGradeItemsParameters;
  create_course_category: CreateCourseCategoryParameters;
  update_course_category: UpdateCourseCategoryParameters;
  delete_course_category: DeleteCourseCategoryParameters;
  get_group: GetGroupParameters;
  update_group: UpdateGroupParameters;
  create_grouping: CreateGroupingParameters;
  get_grouping: GetGroupingParameters;
  update_grouping: UpdateGroupingParameters;
  delete_grouping: DeleteGroupingParameters;
  add_group_to_grouping: AddGroupToGroupingParameters;
  remove_group_from_grouping: RemoveGroupFromGroupingParameters;
  create_cohort: CreateCohortParameters;
  update_cohort: UpdateCohortParameters;
  delete_cohort: DeleteCohortParameters;
  get_cohort_members: GetCohortMembersParameters;
  search_cohorts: SearchCohortsParameters;
  add_cohort_member: AddCohortMemberParameters;
  remove_cohort_member: RemoveCohortMemberParameters;
  assign_role: AssignRoleParameters;
  unassign_role: UnassignRoleParameters;
  get_user_courses: GetUserCoursesParameters;
  get_course_enrolment_methods: GetCourseEnrolmentMethodsParameters;
  get_enrolled_users_with_capability: GetEnrolledUsersWithCapabilityParameters;
  search_enrolled_users: SearchEnrolledUsersParameters;
  get_potential_enrolment_users: GetPotentialEnrolmentUsersParameters;
  get_self_enrolment_info: GetSelfEnrolmentInfoParameters;
  self_enrol: SelfEnrolParameters;
  update_user_enrolment: UpdateUserEnrolmentParameters;
  delete_user_enrolment: DeleteUserEnrolmentParameters;
  get_grades_table: GetGradesTableParameters;
  get_user_course_grades: GetUserCourseGradesParameters;
  get_grade_access_information: GetGradeAccessInformationParameters;
  get_gradebook_items: GetGradebookItemsParameters;
  get_grade_tree: GetGradeTreeParameters;
  get_gradable_users: GetGradableUsersParameters;
  get_grade_feedback: GetGradeFeedbackParameters;
  create_grade_category: CreateGradeCategoryParameters;
  update_grade_value: UpdateGradeValueParameters;
  set_activity_completion_status: SetActivityCompletionStatusParameters;
  override_activity_completion_status: OverrideActivityCompletionStatusParameters;
  mark_course_self_completed: MarkCourseSelfCompletedParameters;
  upload_draft_file: UploadDraftFileParameters;
  download_file: DownloadFileParameters;
  get_course_assignments: GetCourseAssignmentsParameters;
  get_assignment_submissions: GetAssignmentSubmissionsParameters;
  get_assignment_grades: GetAssignmentGradesParameters;
  get_assignment_submission_status: GetAssignmentSubmissionStatusParameters;
  get_assignment_participants: GetAssignmentParticipantsParameters;
  get_assignment_participant: GetAssignmentParticipantParameters;
  start_assignment_submission: StartAssignmentSubmissionParameters;
  save_assignment_submission: SaveAssignmentSubmissionParameters;
  submit_assignment_for_grading: SubmitAssignmentForGradingParameters;
  save_assignment_grade: SaveAssignmentGradeParameters;
  set_assignment_user_flags: SetAssignmentUserFlagsParameters;
  get_assignment_user_flags: GetAssignmentUserFlagsParameters;
  get_assignment_user_mappings: GetAssignmentUserMappingsParameters;
  lock_assignment_submissions: LockAssignmentSubmissionsParameters;
  unlock_assignment_submissions: UnlockAssignmentSubmissionsParameters;
  revert_assignment_submissions_to_draft: RevertAssignmentSubmissionsToDraftParameters;
  set_assignment_extension: SetAssignmentExtensionParameters;
  reveal_assignment_identities: RevealAssignmentIdentitiesParameters;
  copy_previous_assignment_attempt: CopyPreviousAssignmentAttemptParameters;
  remove_assignment_submission: RemoveAssignmentSubmissionParameters;
  view_assignment: ViewAssignmentParameters;
  view_assignment_submission_status: ViewAssignmentSubmissionStatusParameters;
  view_assignment_grading_table: ViewAssignmentGradingTableParameters;
  get_course_forums: GetCourseForumsParameters;
  get_forum_discussions: GetForumDiscussionsParameters;
  get_forum_discussion_posts: GetForumDiscussionPostsParameters;
  get_forum_post: GetForumPostParameters;
  get_forum_posts_by_user: GetForumPostsByUserParameters;
  get_forum_access_information: GetForumAccessInformationParameters;
  can_add_forum_discussion: CanAddForumDiscussionParameters;
  create_forum_discussion: CreateForumDiscussionParameters;
  reply_to_forum_post: ReplyToForumPostParameters;
  update_forum_post: UpdateForumPostParameters;
  delete_forum_post: DeleteForumPostParameters;
  prepare_forum_post_draft: PrepareForumPostDraftParameters;
  set_forum_subscription: SetForumSubscriptionParameters;
  set_forum_tracking: SetForumTrackingParameters;
  set_forum_discussion_subscription: SetForumDiscussionSubscriptionParameters;
  set_forum_discussion_favourite: SetForumDiscussionFavouriteParameters;
  set_forum_discussion_pin: SetForumDiscussionPinParameters;
  set_forum_discussion_lock: SetForumDiscussionLockParameters;
  mark_forum_posts_read: MarkForumPostsReadParameters;
  view_forum: ViewForumParameters;
  view_forum_discussion: ViewForumDiscussionParameters;
  get_course_quizzes: GetCourseQuizzesParameters;
  get_user_quiz_attempts: GetUserQuizAttemptsParameters;
  get_user_quiz_best_grade: GetUserQuizBestGradeParameters;
  get_quiz_review_options: GetQuizReviewOptionsParameters;
  start_quiz_attempt: StartQuizAttemptParameters;
  get_quiz_attempt_data: GetQuizAttemptDataParameters;
  get_quiz_attempt_summary: GetQuizAttemptSummaryParameters;
  save_quiz_attempt: SaveQuizAttemptParameters;
  process_quiz_attempt: ProcessQuizAttemptParameters;
  get_quiz_attempt_review: GetQuizAttemptReviewParameters;
  get_quiz_feedback_for_grade: GetQuizFeedbackForGradeParameters;
  get_quiz_access_information: GetQuizAccessInformationParameters;
  get_quiz_attempt_access_information: GetQuizAttemptAccessInformationParameters;
  get_quiz_required_question_types: GetQuizRequiredQuestionTypesParameters;
  view_quiz: ViewQuizParameters;
  view_quiz_attempt: ViewQuizAttemptParameters;
  view_quiz_attempt_summary: ViewQuizAttemptSummaryParameters;
  view_quiz_attempt_review: ViewQuizAttemptReviewParameters;
  get_course_books: GetCourseBooksParameters;
  view_book: ViewBookParameters;
  get_course_folders: GetCourseFoldersParameters;
  view_folder: ViewFolderParameters;
  get_course_imscp_packages: GetCourseImscpPackagesParameters;
  view_imscp_package: ViewImscpPackageParameters;
  get_course_labels: GetCourseLabelsParameters;
  get_course_pages: GetCoursePagesParameters;
  view_page: ViewPageParameters;
  get_course_resources: GetCourseResourcesParameters;
  view_resource: ViewResourceParameters;
  get_course_urls: GetCourseUrlsParameters;
  view_url: ViewUrlParameters;
  get_course_choices: GetCourseChoicesParameters;
  get_choice_options: GetChoiceOptionsParameters;
  get_choice_results: GetChoiceResultsParameters;
  submit_choice_response: SubmitChoiceResponseParameters;
  delete_choice_responses: DeleteChoiceResponsesParameters;
  view_choice: ViewChoiceParameters;
  get_course_scorm_packages: GetCourseScormPackagesParameters;
  get_scorm_attempt_count: GetScormAttemptCountParameters;
  get_scorm_contents: GetScormContentsParameters;
  get_scorm_user_data: GetScormUserDataParameters;
  save_scorm_tracks: SaveScormTracksParameters;
  get_scorm_tracks: GetScormTracksParameters;
  launch_scorm_content: LaunchScormContentParameters;
  get_scorm_access_information: GetScormAccessInformationParameters;
  view_scorm: ViewScormParameters;
  get_course_wikis: GetCourseWikisParameters;
  get_wiki_subwikis: GetWikiSubwikisParameters;
  get_wiki_pages: GetWikiPagesParameters;
  get_wiki_files: GetWikiFilesParameters;
  get_wiki_page: GetWikiPageParameters;
  get_wiki_page_for_editing: GetWikiPageForEditingParameters;
  create_wiki_page: CreateWikiPageParameters;
  update_wiki_page: UpdateWikiPageParameters;
  view_wiki: ViewWikiParameters;
  view_wiki_page: ViewWikiPageParameters;
  get_course_feedbacks: GetCourseFeedbacksParameters;
  get_feedback_access_information: GetFeedbackAccessInformationParameters;
  get_feedback_temporary_completion: GetFeedbackTemporaryCompletionParameters;
  get_feedback_items: GetFeedbackItemsParameters;
  launch_feedback: LaunchFeedbackParameters;
  get_feedback_page: GetFeedbackPageParameters;
  submit_feedback_page: SubmitFeedbackPageParameters;
  get_feedback_analysis: GetFeedbackAnalysisParameters;
  get_unfinished_feedback_responses: GetUnfinishedFeedbackResponsesParameters;
  get_finished_feedback_responses: GetFinishedFeedbackResponsesParameters;
  get_feedback_non_respondents: GetFeedbackNonRespondentsParameters;
  get_feedback_responses_analysis: GetFeedbackResponsesAnalysisParameters;
  get_last_feedback_completion: GetLastFeedbackCompletionParameters;
  reorder_feedback_questions: ReorderFeedbackQuestionsParameters;
  view_feedback: ViewFeedbackParameters;
  get_course_h5p_activities: GetCourseH5pActivitiesParameters;
  get_h5p_access_information: GetH5pAccessInformationParameters;
  get_h5p_attempts: GetH5pAttemptsParameters;
  get_h5p_results: GetH5pResultsParameters;
  get_h5p_user_attempts: GetH5pUserAttemptsParameters;
  log_h5p_report_view: LogH5pReportViewParameters;
  view_h5p_activity: ViewH5pActivityParameters;
  get_course_databases: GetCourseDatabasesParameters;
  get_database_access_information: GetDatabaseAccessInformationParameters;
  get_database_entries: GetDatabaseEntriesParameters;
  get_database_entry: GetDatabaseEntryParameters;
  get_database_fields: GetDatabaseFieldsParameters;
  search_database_entries: SearchDatabaseEntriesParameters;
  approve_database_entry: ApproveDatabaseEntryParameters;
  delete_database_entry: DeleteDatabaseEntryParameters;
  create_database_entry: CreateDatabaseEntryParameters;
  update_database_entry: UpdateDatabaseEntryParameters;
  delete_database_presets: DeleteDatabasePresetsParameters;
  get_database_preset_mapping: GetDatabasePresetMappingParameters;
  view_database: ViewDatabaseParameters;
  get_course_glossaries: GetCourseGlossariesParameters;
  get_glossary_entries_by_letter: GetGlossaryEntriesByLetterParameters;
  get_glossary_entries_by_date: GetGlossaryEntriesByDateParameters;
  get_glossary_categories: GetGlossaryCategoriesParameters;
  get_glossary_entries_by_category: GetGlossaryEntriesByCategoryParameters;
  get_glossary_authors: GetGlossaryAuthorsParameters;
  get_glossary_entries_by_author_letter: GetGlossaryEntriesByAuthorLetterParameters;
  get_glossary_entries_by_author: GetGlossaryEntriesByAuthorParameters;
  search_glossary_entries: SearchGlossaryEntriesParameters;
  get_glossary_entries_by_term: GetGlossaryEntriesByTermParameters;
  get_glossary_entries_to_approve: GetGlossaryEntriesToApproveParameters;
  get_glossary_entry: GetGlossaryEntryParameters;
  create_glossary_entry: CreateGlossaryEntryParameters;
  update_glossary_entry: UpdateGlossaryEntryParameters;
  delete_glossary_entry: DeleteGlossaryEntryParameters;
  prepare_glossary_entry: PrepareGlossaryEntryParameters;
  view_glossary: ViewGlossaryParameters;
  view_glossary_entry: ViewGlossaryEntryParameters;
  get_course_bigbluebutton_activities: GetCourseBigbluebuttonActivitiesParameters;
  can_join_bigbluebutton: CanJoinBigbluebuttonParameters;
  get_bigbluebutton_join_url: GetBigbluebuttonJoinUrlParameters;
  get_bigbluebutton_recordings: GetBigbluebuttonRecordingsParameters;
  get_bigbluebutton_recordings_to_import: GetBigbluebuttonRecordingsToImportParameters;
  update_bigbluebutton_recording: UpdateBigbluebuttonRecordingParameters;
  end_bigbluebutton_meeting: EndBigbluebuttonMeetingParameters;
  validate_bigbluebutton_completion: ValidateBigbluebuttonCompletionParameters;
  get_bigbluebutton_meeting_information: GetBigbluebuttonMeetingInformationParameters;
  view_bigbluebutton: ViewBigbluebuttonParameters;
  get_course_lessons: GetCourseLessonsParameters;
  get_lesson: GetLessonParameters;
  get_lesson_access_information: GetLessonAccessInformationParameters;
  get_lesson_question_attempts: GetLessonQuestionAttemptsParameters;
  get_lesson_user_grade: GetLessonUserGradeParameters;
  get_lesson_attempt_grade: GetLessonAttemptGradeParameters;
  get_lesson_content_pages_viewed: GetLessonContentPagesViewedParameters;
  get_lesson_user_timers: GetLessonUserTimersParameters;
  get_lesson_pages: GetLessonPagesParameters;
  launch_lesson_attempt: LaunchLessonAttemptParameters;
  get_lesson_page: GetLessonPageParameters;
  submit_lesson_page: SubmitLessonPageParameters;
  finish_lesson_attempt: FinishLessonAttemptParameters;
  get_lesson_attempts_overview: GetLessonAttemptsOverviewParameters;
  get_lesson_user_attempt: GetLessonUserAttemptParameters;
  get_lesson_possible_jumps: GetLessonPossibleJumpsParameters;
  view_lesson: ViewLessonParameters;
  get_course_lti_tools: GetCourseLtiToolsParameters;
  get_lti_launch_data: GetLtiLaunchDataParameters;
  get_lti_tool_proxies: GetLtiToolProxiesParameters;
  create_lti_tool_proxy: CreateLtiToolProxyParameters;
  delete_lti_tool_proxy: DeleteLtiToolProxyParameters;
  get_lti_proxy_registration_request: GetLtiProxyRegistrationRequestParameters;
  get_lti_tool_types: GetLtiToolTypesParameters;
  get_lti_tool_types_and_proxies: GetLtiToolTypesAndProxiesParameters;
  count_lti_tool_types_and_proxies: CountLtiToolTypesAndProxiesParameters;
  create_lti_tool_type: CreateLtiToolTypeParameters;
  update_lti_tool_type: UpdateLtiToolTypeParameters;
  delete_lti_tool_type: DeleteLtiToolTypeParameters;
  delete_course_lti_tool_type: DeleteCourseLtiToolTypeParameters;
  set_lti_tool_activity_chooser_visibility: SetLtiToolActivityChooserVisibilityParameters;
  is_lti_cartridge: IsLtiCartridgeParameters;
  view_lti: ViewLtiParameters;
  get_course_workshops: GetCourseWorkshopsParameters;
  get_workshop_access_information: GetWorkshopAccessInformationParameters;
  get_workshop_user_plan: GetWorkshopUserPlanParameters;
  create_workshop_submission: CreateWorkshopSubmissionParameters;
  update_workshop_submission: UpdateWorkshopSubmissionParameters;
  delete_workshop_submission: DeleteWorkshopSubmissionParameters;
  get_workshop_submissions: GetWorkshopSubmissionsParameters;
  get_workshop_submission: GetWorkshopSubmissionParameters;
  get_workshop_submission_assessments: GetWorkshopSubmissionAssessmentsParameters;
  get_workshop_assessment: GetWorkshopAssessmentParameters;
  get_workshop_assessment_form: GetWorkshopAssessmentFormParameters;
  get_workshop_reviewer_assessments: GetWorkshopReviewerAssessmentsParameters;
  update_workshop_assessment: UpdateWorkshopAssessmentParameters;
  get_workshop_grades: GetWorkshopGradesParameters;
  evaluate_workshop_assessment: EvaluateWorkshopAssessmentParameters;
  get_workshop_grades_report: GetWorkshopGradesReportParameters;
  evaluate_workshop_submission: EvaluateWorkshopSubmissionParameters;
  view_workshop: ViewWorkshopParameters;
  view_workshop_submission: ViewWorkshopSubmissionParameters;
  save_assignment_grades: SaveAssignmentGradesParameters;
  submit_assignment_grading_form: SubmitAssignmentGradingFormParameters;
  get_user_quiz_attempts_legacy: GetUserQuizAttemptsLegacyParameters;
  set_quiz_question_version: SetQuizQuestionVersionParameters;
  reopen_quiz_attempt: ReopenQuizAttemptParameters;
  get_reopen_quiz_attempt_confirmation: GetReopenQuizAttemptConfirmationParameters;
  add_quiz_random_questions: AddQuizRandomQuestionsParameters;
  update_quiz_random_question_filter: UpdateQuizRandomQuestionFilterParameters;
  save_quiz_overrides: SaveQuizOverridesParameters;
  delete_quiz_overrides: DeleteQuizOverridesParameters;
  get_quiz_overrides: GetQuizOverridesParameters;
  create_quiz_grade_items: CreateQuizGradeItemsParameters;
  delete_quiz_grade_items: DeleteQuizGradeItemsParameters;
  update_quiz_grade_items: UpdateQuizGradeItemsParameters;
  update_quiz_slots: UpdateQuizSlotsParameters;
  get_quiz_grading_setup: GetQuizGradingSetupParameters;
  create_quiz_grade_item_per_section: CreateQuizGradeItemPerSectionParameters;
  get_calendar_month: GetCalendarMonthParameters;
  get_calendar_day: GetCalendarDayParameters;
  get_calendar_upcoming: GetCalendarUpcomingParameters;
  move_calendar_event: MoveCalendarEventParameters;
  create_calendar_events: CreateCalendarEventsParameters;
  delete_calendar_events: DeleteCalendarEventsParameters;
  get_action_events_by_time: GetActionEventsByTimeParameters;
  get_course_action_events: GetCourseActionEventsParameters;
  get_courses_action_events: GetCoursesActionEventsParameters;
  get_calendar_event: GetCalendarEventParameters;
  submit_calendar_event_form: SubmitCalendarEventFormParameters;
  get_calendar_access_information: GetCalendarAccessInformationParameters;
  get_allowed_calendar_event_types: GetAllowedCalendarEventTypesParameters;
  get_calendar_export_token: GetCalendarExportTokenParameters;
  get_badge: GetBadgeParameters;
  get_user_badges: GetUserBadgesParameters;
  get_user_badge_by_hash: GetUserBadgeByHashParameters;
  get_blog_entries: GetBlogEntriesParameters;
  view_blog_entries: ViewBlogEntriesParameters;
  get_blog_access_information: GetBlogAccessInformationParameters;
  create_blog_entry: CreateBlogEntryParameters;
  update_blog_entry: UpdateBlogEntryParameters;
  delete_blog_entry: DeleteBlogEntryParameters;
  prepare_blog_entry: PrepareBlogEntryParameters;
  get_comments: GetCommentsParameters;
  create_comments: CreateCommentsParameters;
  delete_comments: DeleteCommentsParameters;
  create_notes: CreateNotesParameters;
  delete_notes: DeleteNotesParameters;
  get_course_notes: GetCourseNotesParameters;
  view_notes: ViewNotesParameters;
  get_item_ratings: GetItemRatingsParameters;
  rate_item: RateItemParameters;
  get_activity_allowed_groups: GetActivityAllowedGroupsParameters;
  get_activity_group_mode: GetActivityGroupModeParameters;
  get_user_course_groups: GetUserCourseGroupsParameters;
  get_groups_for_selector: GetGroupsForSelectorParameters;
  get_recently_accessed_items: GetRecentlyAccessedItemsParameters;
  get_starred_courses: GetStarredCoursesParameters;
  view_personal_page: ViewPersonalPageParameters;
  update_question_flag: UpdateQuestionFlagParameters;
  browse_files: BrowseFilesParameters;
  delete_draft_files: DeleteDraftFilesParameters;
  get_unused_draft_area: GetUnusedDraftAreaParameters;
  get_user_preferences: GetUserPreferencesParameters;
  get_private_files_information: GetPrivateFilesInformationParameters;
  view_course_user_list: ViewCourseUserListParameters;
  view_user_profile: ViewUserProfileParameters;
  agree_site_policy: AgreeSitePolicyParameters;
  add_private_files: AddPrivateFilesParameters;
  update_user_picture: UpdateUserPictureParameters;
  remove_user_device: RemoveUserDeviceParameters;
  search_site: SearchSiteParameters;
  get_top_search_results: GetTopSearchResultsParameters;
  get_search_areas: GetSearchAreasParameters;
  view_search_results: ViewSearchResultsParameters;
  get_tag_areas: GetTagAreasParameters;
  get_tag_collections: GetTagCollectionsParameters;
  get_tag_cloud: GetTagCloudParameters;
  get_tag_index: GetTagIndexParameters;
  get_tag_index_by_area: GetTagIndexByAreaParameters;
  get_course_module: GetCourseModuleParameters;
  get_course_module_by_instance: GetCourseModuleByInstanceParameters;
  view_course: ViewCourseParameters;
  search_courses: SearchCoursesParameters;
  get_course_navigation_options: GetCourseNavigationOptionsParameters;
  get_course_administration_options: GetCourseAdministrationOptionsParameters;
  get_course_updates: GetCourseUpdatesParameters;
  get_timeline_courses: GetTimelineCoursesParameters;
  set_favourite_courses: SetFavouriteCoursesParameters;
  get_recent_courses: GetRecentCoursesParameters;
  check_course_updates: CheckCourseUpdatesParameters;
  get_timeline_courses_with_events: GetTimelineCoursesWithEventsParameters;
  view_module_instance_list: ViewModuleInstanceListParameters;
  get_course_overview: GetCourseOverviewParameters;
  view_course_overview: ViewCourseOverviewParameters;
  get_available_filters: GetAvailableFiltersParameters;
  get_all_filter_states: GetAllFilterStatesParameters;
  get_component_strings: GetComponentStringsParameters;
  get_fontawesome_icon_map: GetFontawesomeIconMapParameters;
  get_trusted_h5p_file: GetTrustedH5pFileParameters;
  is_push_notification_system_configured: IsPushNotificationSystemConfiguredParameters;
  get_push_preference_statuses: GetPushPreferenceStatusesParameters;
  get_user_push_devices: GetUserPushDevicesParameters;
  set_push_device_enabled: SetPushDeviceEnabledParameters;
  get_popup_notifications: GetPopupNotificationsParameters;
  get_unread_popup_notification_count: GetUnreadPopupNotificationCountParameters;
  get_guest_enrolment_information: GetGuestEnrolmentInformationParameters;
  validate_guest_enrolment_password: ValidateGuestEnrolmentPasswordParameters;
  register_user_device: RegisterUserDeviceParameters;
  update_user_device_public_key: UpdateUserDevicePublicKeyParameters;
  get_course_user_profiles: GetCourseUserProfilesParameters;
  set_user_preferences: SetUserPreferencesParameters;
  update_user_preferences: UpdateUserPreferencesParameters;
  prepare_private_files: PreparePrivateFilesParameters;
  update_private_files: UpdatePrivateFilesParameters;
  get_xapi_state: GetXapiStateParameters;
  get_xapi_states: GetXapiStatesParameters;
  save_xapi_state: SaveXapiStateParameters;
  delete_xapi_state: DeleteXapiStateParameters;
  delete_xapi_states: DeleteXapiStatesParameters;
  post_xapi_statements: PostXapiStatementsParameters;
  view_competency: ViewCompetencyParameters;
  delete_competency_evidence: DeleteCompetencyEvidenceParameters;
  get_competency_scale_values: GetCompetencyScaleValuesParameters;
  grade_course_competency: GradeCourseCompetencyParameters;
  get_course_competencies: GetCourseCompetenciesParameters;
  view_user_competency: ViewUserCompetencyParameters;
  view_user_competency_in_course: ViewUserCompetencyInCourseParameters;
  view_user_competency_in_plan: ViewUserCompetencyInPlanParameters;
  view_user_competency_plan: ViewUserCompetencyPlanParameters;
  get_course_blocks: GetCourseBlocksParameters;
  get_dashboard_blocks: GetDashboardBlocksParameters;
  get_addable_blocks: GetAddableBlocksParameters;
  get_grade_selector_users: GetGradeSelectorUsersParameters;
  get_grade_selector_groups: GetGradeSelectorGroupsParameters;
  get_point_grading_panel: GetPointGradingPanelParameters;
  save_point_grading_panel: SavePointGradingPanelParameters;
  get_scale_grading_panel: GetScaleGradingPanelParameters;
  save_scale_grading_panel: SaveScaleGradingPanelParameters;
  get_grader_report_users: GetGraderReportUsersParameters;
  get_grade_items_for_selector: GetGradeItemsForSelectorParameters;
  view_grade_overview_report: ViewGradeOverviewReportParameters;
  view_user_grade_report: ViewUserGradeReportParameters;
  record_insight_action: RecordInsightActionParameters;
  list_custom_reports: ListCustomReportsParameters;
  get_custom_report: GetCustomReportParameters;
  view_custom_report: ViewCustomReportParameters;
  can_view_system_report: CanViewSystemReportParameters;
  get_system_report: GetSystemReportParameters;
  get_dynamic_table: GetDynamicTableParameters;
  get_tiny_editor_configuration: GetTinyEditorConfigurationParameters;
  get_tiny_premium_api_key: GetTinyPremiumApiKeyParameters;
  get_data_privacy_access_information: GetDataPrivacyAccessInformationParameters;
  create_data_request: CreateDataRequestParameters;
  cancel_data_request: CancelDataRequestParameters;
  contact_data_protection_officer: ContactDataProtectionOfficerParameters;
  get_data_requests: GetDataRequestsParameters;
  get_policy_acceptances: GetPolicyAcceptancesParameters;
  set_policy_acceptances: SetPolicyAcceptancesParameters;
  get_course_competencies_page: GetCourseCompetenciesPageParameters;
  get_learning_plan_page: GetLearningPlanPageParameters;
  get_user_learning_plans_page: GetUserLearningPlansPageParameters;
  get_user_competency_summary: GetUserCompetencySummaryParameters;
  get_course_user_competency_summary: GetCourseUserCompetencySummaryParameters;
  get_plan_user_competency_summary: GetPlanUserCompetencySummaryParameters;
  get_user_evidence_list_page: GetUserEvidenceListPageParameters;
  get_user_evidence_page: GetUserEvidencePageParameters;
  send_conversation_messages: SendConversationMessagesParameters;
  send_instant_messages: SendInstantMessagesParameters;
  delete_message_contacts: DeleteMessageContactsParameters;
  mute_conversations: MuteConversationsParameters;
  unmute_conversations: UnmuteConversationsParameters;
  block_message_user: BlockMessageUserParameters;
  unblock_message_user: UnblockMessageUserParameters;
  get_contact_requests: GetContactRequestsParameters;
  get_received_contact_request_count: GetReceivedContactRequestCountParameters;
  get_conversation_members: GetConversationMembersParameters;
  create_contact_request: CreateContactRequestParameters;
  confirm_contact_request: ConfirmContactRequestParameters;
  decline_contact_request: DeclineContactRequestParameters;
  search_message_users: SearchMessageUsersParameters;
  search_messages: SearchMessagesParameters;
  get_conversation_between_users: GetConversationBetweenUsersParameters;
  get_self_conversation: GetSelfConversationParameters;
  get_conversation_messages: GetConversationMessagesParameters;
  get_message_contacts: GetMessageContactsParameters;
  search_message_contacts: SearchMessageContactsParameters;
  get_conversations: GetConversationsParameters;
  get_conversation: GetConversationParameters;
  get_messages: GetMessagesParameters;
  get_conversation_counts: GetConversationCountsParameters;
  get_unread_conversation_counts: GetUnreadConversationCountsParameters;
  get_unread_conversations_count: GetUnreadConversationsCountParameters;
  get_unread_notification_count: GetUnreadNotificationCountParameters;
  get_blocked_message_users: GetBlockedMessageUsersParameters;
  get_message_member_info: GetMessageMemberInfoParameters;
  mark_message_read: MarkMessageReadParameters;
  mark_notification_read: MarkNotificationReadParameters;
  mark_all_notifications_read: MarkAllNotificationsReadParameters;
  mark_conversation_read: MarkConversationReadParameters;
  delete_conversations: DeleteConversationsParameters;
  delete_message: DeleteMessageParameters;
  delete_message_for_all_users: DeleteMessageForAllUsersParameters;
  configure_message_processor: ConfigureMessageProcessorParameters;
  get_user_notification_preferences: GetUserNotificationPreferencesParameters;
  get_user_message_preferences: GetUserMessagePreferencesParameters;
  set_favourite_conversations: SetFavouriteConversationsParameters;
  unset_favourite_conversations: UnsetFavouriteConversationsParameters;
  explain_text_with_ai: ExplainTextWithAiParameters;
  summarise_text_with_ai: SummariseTextWithAiParameters;
  generate_ai_image: GenerateAiImageParameters;
  generate_ai_text: GenerateAiTextParameters;
  get_ai_policy_status: GetAiPolicyStatusParameters;
  set_ai_policy_status: SetAiPolicyStatusParameters;
  get_analytics_contexts: GetAnalyticsContextsParameters;
  get_mobile_plugins: GetMobilePluginsParameters;
  get_mobile_public_config: GetMobilePublicConfigParameters;
  get_mobile_config: GetMobileConfigParameters;
  get_mobile_autologin_key: GetMobileAutologinKeyParameters;
  get_mobile_content: GetMobileContentParameters;
  call_mobile_external_functions: CallMobileExternalFunctionsParameters;
  get_mobile_qr_login_tokens: GetMobileQrLoginTokensParameters;
  validate_mobile_subscription_key: ValidateMobileSubscriptionKeyParameters;
  get_policy_version: GetPolicyVersionParameters;
  search_moodlenet_courses: SearchMoodlenetCoursesParameters;
  verify_moodlenet_profile: VerifyMoodlenetProfileParameters;
  auth_email_get_signup_settings: AuthEmailGetSignupSettingsParameters;
  auth_email_signup_user: AuthEmailSignupUserParameters;
  block_accessreview_get_module_data: BlockAccessreviewGetModuleDataParameters;
  block_accessreview_get_section_data: BlockAccessreviewGetSectionDataParameters;
  admin_set_block_protection: AdminSetBlockProtectionParameters;
  admin_set_plugin_order: AdminSetPluginOrderParameters;
  admin_set_plugin_state: AdminSetPluginStateParameters;
  ai_delete_provider_instance: AiDeleteProviderInstanceParameters;
  ai_set_action: AiSetActionParameters;
  ai_set_provider_order: AiSetProviderOrderParameters;
  ai_set_provider_status: AiSetProviderStatusParameters;
  auth_confirm_user: AuthConfirmUserParameters;
  auth_is_age_digital_consent_verification_enabled: AuthIsAgeDigitalConsentVerificationEnabledParameters;
  auth_is_minor: AuthIsMinorParameters;
  auth_request_password_reset: AuthRequestPasswordResetParameters;
  auth_resend_confirmation_email: AuthResendConfirmationEmailParameters;
  backup_get_async_backup_links_backup: BackupGetAsyncBackupLinksBackupParameters;
  backup_get_async_backup_links_restore: BackupGetAsyncBackupLinksRestoreParameters;
  backup_get_async_backup_progress: BackupGetAsyncBackupProgressParameters;
  backup_get_copy_progress: BackupGetCopyProgressParameters;
  backup_submit_copy_form: BackupSubmitCopyFormParameters;
  badges_disable_badges: BadgesDisableBadgesParameters;
  badges_enable_badges: BadgesEnableBadgesParameters;
  calendar_delete_subscription: CalendarDeleteSubscriptionParameters;
  calendar_get_timestamps: CalendarGetTimestampsParameters;
  change_editmode: ChangeEditmodeParameters;
  check_get_result_admintree: CheckGetResultAdmintreeParameters;
  competency_add_competency_to_course: CompetencyAddCompetencyToCourseParameters;
  competency_add_competency_to_plan: CompetencyAddCompetencyToPlanParameters;
  competency_add_competency_to_template: CompetencyAddCompetencyToTemplateParameters;
  competency_add_related_competency: CompetencyAddRelatedCompetencyParameters;
  competency_approve_plan: CompetencyApprovePlanParameters;
  competency_competency_framework_viewed: CompetencyCompetencyFrameworkViewedParameters;
  competency_complete_plan: CompetencyCompletePlanParameters;
  competency_count_competencies: CompetencyCountCompetenciesParameters;
  competency_count_competencies_in_course: CompetencyCountCompetenciesInCourseParameters;
  competency_count_competencies_in_template: CompetencyCountCompetenciesInTemplateParameters;
  competency_count_competency_frameworks: CompetencyCountCompetencyFrameworksParameters;
  competency_count_course_module_competencies: CompetencyCountCourseModuleCompetenciesParameters;
  competency_count_courses_using_competency: CompetencyCountCoursesUsingCompetencyParameters;
  competency_count_templates: CompetencyCountTemplatesParameters;
  competency_count_templates_using_competency: CompetencyCountTemplatesUsingCompetencyParameters;
  competency_create_competency: CompetencyCreateCompetencyParameters;
  competency_create_competency_framework: CompetencyCreateCompetencyFrameworkParameters;
  competency_create_plan: CompetencyCreatePlanParameters;
  competency_create_template: CompetencyCreateTemplateParameters;
  competency_create_user_evidence_competency: CompetencyCreateUserEvidenceCompetencyParameters;
  competency_delete_competency: CompetencyDeleteCompetencyParameters;
  competency_delete_competency_framework: CompetencyDeleteCompetencyFrameworkParameters;
  competency_delete_plan: CompetencyDeletePlanParameters;
  competency_delete_template: CompetencyDeleteTemplateParameters;
  competency_delete_user_evidence: CompetencyDeleteUserEvidenceParameters;
  competency_delete_user_evidence_competency: CompetencyDeleteUserEvidenceCompetencyParameters;
  competency_duplicate_competency_framework: CompetencyDuplicateCompetencyFrameworkParameters;
  competency_duplicate_template: CompetencyDuplicateTemplateParameters;
  competency_grade_competency: CompetencyGradeCompetencyParameters;
  competency_grade_competency_in_plan: CompetencyGradeCompetencyInPlanParameters;
  competency_list_competencies: CompetencyListCompetenciesParameters;
  competency_list_competencies_in_template: CompetencyListCompetenciesInTemplateParameters;
  competency_list_competency_frameworks: CompetencyListCompetencyFrameworksParameters;
  competency_list_course_module_competencies: CompetencyListCourseModuleCompetenciesParameters;
  competency_list_plan_competencies: CompetencyListPlanCompetenciesParameters;
  competency_list_templates: CompetencyListTemplatesParameters;
  competency_list_templates_using_competency: CompetencyListTemplatesUsingCompetencyParameters;
  competency_list_user_plans: CompetencyListUserPlansParameters;
  competency_move_down_competency: CompetencyMoveDownCompetencyParameters;
  competency_move_up_competency: CompetencyMoveUpCompetencyParameters;
  competency_plan_cancel_review_request: CompetencyPlanCancelReviewRequestParameters;
  competency_plan_request_review: CompetencyPlanRequestReviewParameters;
  competency_plan_start_review: CompetencyPlanStartReviewParameters;
  competency_plan_stop_review: CompetencyPlanStopReviewParameters;
  competency_read_competency: CompetencyReadCompetencyParameters;
  competency_read_competency_framework: CompetencyReadCompetencyFrameworkParameters;
  competency_read_plan: CompetencyReadPlanParameters;
  competency_read_template: CompetencyReadTemplateParameters;
  competency_read_user_evidence: CompetencyReadUserEvidenceParameters;
  competency_remove_competency_from_course: CompetencyRemoveCompetencyFromCourseParameters;
  competency_remove_competency_from_plan: CompetencyRemoveCompetencyFromPlanParameters;
  competency_remove_competency_from_template: CompetencyRemoveCompetencyFromTemplateParameters;
  competency_remove_related_competency: CompetencyRemoveRelatedCompetencyParameters;
  competency_reopen_plan: CompetencyReopenPlanParameters;
  competency_reorder_course_competency: CompetencyReorderCourseCompetencyParameters;
  competency_reorder_plan_competency: CompetencyReorderPlanCompetencyParameters;
  competency_reorder_template_competency: CompetencyReorderTemplateCompetencyParameters;
  competency_request_review_of_user_evidence_linked_competencies: CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesParameters;
  competency_search_competencies: CompetencySearchCompetenciesParameters;
  competency_set_course_competency_ruleoutcome: CompetencySetCourseCompetencyRuleoutcomeParameters;
  competency_set_parent_competency: CompetencySetParentCompetencyParameters;
  competency_template_has_related_data: CompetencyTemplateHasRelatedDataParameters;
  competency_template_viewed: CompetencyTemplateViewedParameters;
  competency_unapprove_plan: CompetencyUnapprovePlanParameters;
  competency_unlink_plan_from_template: CompetencyUnlinkPlanFromTemplateParameters;
  competency_update_competency: CompetencyUpdateCompetencyParameters;
  competency_update_competency_framework: CompetencyUpdateCompetencyFrameworkParameters;
  competency_update_course_competency_settings: CompetencyUpdateCourseCompetencySettingsParameters;
  competency_update_plan: CompetencyUpdatePlanParameters;
  competency_update_template: CompetencyUpdateTemplateParameters;
  competency_user_competency_cancel_review_request: CompetencyUserCompetencyCancelReviewRequestParameters;
  competency_user_competency_request_review: CompetencyUserCompetencyRequestReviewParameters;
  competency_user_competency_start_review: CompetencyUserCompetencyStartReviewParameters;
  competency_user_competency_stop_review: CompetencyUserCompetencyStopReviewParameters;
  contentbank_copy_content: ContentbankCopyContentParameters;
  contentbank_delete_content: ContentbankDeleteContentParameters;
  contentbank_rename_content: ContentbankRenameContentParameters;
  contentbank_set_content_visibility: ContentbankSetContentVisibilityParameters;
  course_add_content_item_to_user_favourites: CourseAddContentItemToUserFavouritesParameters;
  course_delete_modules: CourseDeleteModulesParameters;
  course_duplicate_course: CourseDuplicateCourseParameters;
  course_edit_module: CourseEditModuleParameters;
  course_edit_section: CourseEditSectionParameters;
  course_get_activity_chooser_footer: CourseGetActivityChooserFooterParameters;
  course_get_course_content_items: CourseGetCourseContentItemsParameters;
  course_get_enrolled_users_by_cmid: CourseGetEnrolledUsersByCmidParameters;
  course_get_module: CourseGetModuleParameters;
  course_import_course: CourseImportCourseParameters;
  course_remove_content_item_from_user_favourites: CourseRemoveContentItemFromUserFavouritesParameters;
  course_toggle_activity_recommendation: CourseToggleActivityRecommendationParameters;
  courseformat_create_module: CourseformatCreateModuleParameters;
  courseformat_file_handlers: CourseformatFileHandlersParameters;
  courseformat_get_section_content_items: CourseformatGetSectionContentItemsParameters;
  courseformat_get_state: CourseformatGetStateParameters;
  courseformat_new_module: CourseformatNewModuleParameters;
  courseformat_update_course: CourseformatUpdateCourseParameters;
  create_userfeedback_action_record: CreateUserfeedbackActionRecordParameters;
  customfield_convert_category: CustomfieldConvertCategoryParameters;
  customfield_create_category: CustomfieldCreateCategoryParameters;
  customfield_delete_category: CustomfieldDeleteCategoryParameters;
  customfield_delete_field: CustomfieldDeleteFieldParameters;
  customfield_move_category: CustomfieldMoveCategoryParameters;
  customfield_move_field: CustomfieldMoveFieldParameters;
  customfield_reload_template: CustomfieldReloadTemplateParameters;
  customfield_toggle_shared: CustomfieldToggleSharedParameters;
  dynamic_tabs_get_content: DynamicTabsGetContentParameters;
  fetch_notifications: FetchNotificationsParameters;
  files_upload: FilesUploadParameters;
  form_dynamic_form: FormDynamicFormParameters;
  form_get_filetypes_browser_data: FormGetFiletypesBrowserDataParameters;
  get_fragment: GetFragmentParameters;
  get_string: GetStringParameters;
  get_strings: GetStringsParameters;
  get_user_dates: GetUserDatesParameters;
  grading_get_definitions: GradingGetDefinitionsParameters;
  grading_get_gradingform_instances: GradingGetGradingformInstancesParameters;
  grading_save_definitions: GradingSaveDefinitionsParameters;
  message_get_message_processor: MessageGetMessageProcessorParameters;
  message_get_unsent_message: MessageGetUnsentMessageParameters;
  message_set_default_notification: MessageSetDefaultNotificationParameters;
  message_set_unsent_message: MessageSetUnsentMessageParameters;
  moodlenet_auth_check: MoodlenetAuthCheckParameters;
  moodlenet_get_share_info_activity: MoodlenetGetShareInfoActivityParameters;
  moodlenet_get_shared_course_info: MoodlenetGetSharedCourseInfoParameters;
  moodlenet_send_activity: MoodlenetSendActivityParameters;
  moodlenet_send_course: MoodlenetSendCourseParameters;
  notes_get_notes: NotesGetNotesParameters;
  notes_update_notes: NotesUpdateNotesParameters;
  output_load_template: OutputLoadTemplateParameters;
  output_load_template_with_dependencies: OutputLoadTemplateWithDependenciesParameters;
  output_poll_stored_progress: OutputPollStoredProgressParameters;
  payment_get_available_gateways: PaymentGetAvailableGatewaysParameters;
  question_get_random_question_summaries: QuestionGetRandomQuestionSummariesParameters;
  question_move_questions: QuestionMoveQuestionsParameters;
  question_search_shared_banks: QuestionSearchSharedBanksParameters;
  reportbuilder_audiences_delete: ReportbuilderAudiencesDeleteParameters;
  reportbuilder_columns_add: ReportbuilderColumnsAddParameters;
  reportbuilder_columns_delete: ReportbuilderColumnsDeleteParameters;
  reportbuilder_columns_reorder: ReportbuilderColumnsReorderParameters;
  reportbuilder_columns_sort_get: ReportbuilderColumnsSortGetParameters;
  reportbuilder_columns_sort_reorder: ReportbuilderColumnsSortReorderParameters;
  reportbuilder_columns_sort_toggle: ReportbuilderColumnsSortToggleParameters;
  reportbuilder_conditions_add: ReportbuilderConditionsAddParameters;
  reportbuilder_conditions_delete: ReportbuilderConditionsDeleteParameters;
  reportbuilder_conditions_reorder: ReportbuilderConditionsReorderParameters;
  reportbuilder_conditions_reset: ReportbuilderConditionsResetParameters;
  reportbuilder_filters_add: ReportbuilderFiltersAddParameters;
  reportbuilder_filters_delete: ReportbuilderFiltersDeleteParameters;
  reportbuilder_filters_reorder: ReportbuilderFiltersReorderParameters;
  reportbuilder_filters_reset: ReportbuilderFiltersResetParameters;
  reportbuilder_reports_delete: ReportbuilderReportsDeleteParameters;
  reportbuilder_reports_get: ReportbuilderReportsGetParameters;
  reportbuilder_schedules_delete: ReportbuilderSchedulesDeleteParameters;
  reportbuilder_schedules_send: ReportbuilderSchedulesSendParameters;
  reportbuilder_schedules_toggle: ReportbuilderSchedulesToggleParameters;
  reportbuilder_set_filters: ReportbuilderSetFiltersParameters;
  search_get_relevant_users: SearchGetRelevantUsersParameters;
  session_time_remaining: SessionTimeRemainingParameters;
  session_touch: SessionTouchParameters;
  sms_set_gateway_status: SmsSetGatewayStatusParameters;
  tag_get_tags: TagGetTagsParameters;
  tag_update_tags: TagUpdateTagsParameters;
  update_inplace_editable: UpdateInplaceEditableParameters;
  user_get_users: UserGetUsersParameters;
  user_search_identity: UserSearchIdentityParameters;
  customfield_number_recalculate_value: CustomfieldNumberRecalculateValueParameters;
  enrol_meta_add_instances: EnrolMetaAddInstancesParameters;
  enrol_meta_delete_instances: EnrolMetaDeleteInstancesParameters;
  gradingform_guide_grader_gradingpanel_fetch: GradingformGuideGraderGradingpanelFetchParameters;
  gradingform_guide_grader_gradingpanel_store: GradingformGuideGraderGradingpanelStoreParameters;
  gradingform_rubric_grader_gradingpanel_fetch: GradingformRubricGraderGradingpanelFetchParameters;
  gradingform_rubric_grader_gradingpanel_store: GradingformRubricGraderGradingpanelStoreParameters;
  media_videojs_get_language: MediaVideojsGetLanguageParameters;
  paygw_paypal_create_transaction_complete: PaygwPaypalCreateTransactionCompleteParameters;
  paygw_paypal_get_config_for_js: PaygwPaypalGetConfigForJsParameters;
  qbank_columnsortorder_set_column_size: QbankColumnsortorderSetColumnSizeParameters;
  qbank_columnsortorder_set_columnbank_order: QbankColumnsortorderSetColumnbankOrderParameters;
  qbank_columnsortorder_set_hidden_columns: QbankColumnsortorderSetHiddenColumnsParameters;
  qbank_editquestion_set_status: QbankEditquestionSetStatusParameters;
  qbank_managecategories_move_category: QbankManagecategoriesMoveCategoryParameters;
  qbank_tagquestion_submit_tags_form: QbankTagquestionSubmitTagsFormParameters;
  qbank_viewquestiontext_set_question_text_format: QbankViewquestiontextSetQuestionTextFormatParameters;
  quizaccess_seb_validate_quiz_keys: QuizaccessSebValidateQuizKeysParameters;
  report_competency_data_for_report: ReportCompetencyDataForReportParameters;
  tiny_autosave_reset_session: TinyAutosaveResetSessionParameters;
  tiny_autosave_resume_session: TinyAutosaveResumeSessionParameters;
  tiny_autosave_update_session: TinyAutosaveUpdateSessionParameters;
  tiny_equation_filter: TinyEquationFilterParameters;
  tiny_media_preview: TinyMediaPreviewParameters;
  admin_presets_delete_preset: AdminPresetsDeletePresetParameters;
  behat_get_entity_generator: BehatGetEntityGeneratorParameters;
  dataprivacy_approve_data_request: DataprivacyApproveDataRequestParameters;
  dataprivacy_bulk_approve_data_requests: DataprivacyBulkApproveDataRequestsParameters;
  dataprivacy_bulk_deny_data_requests: DataprivacyBulkDenyDataRequestsParameters;
  dataprivacy_confirm_contexts_for_deletion: DataprivacyConfirmContextsForDeletionParameters;
  dataprivacy_create_category_form: DataprivacyCreateCategoryFormParameters;
  dataprivacy_create_purpose_form: DataprivacyCreatePurposeFormParameters;
  dataprivacy_delete_category: DataprivacyDeleteCategoryParameters;
  dataprivacy_delete_purpose: DataprivacyDeletePurposeParameters;
  dataprivacy_deny_data_request: DataprivacyDenyDataRequestParameters;
  dataprivacy_get_activity_options: DataprivacyGetActivityOptionsParameters;
  dataprivacy_get_category_options: DataprivacyGetCategoryOptionsParameters;
  dataprivacy_get_data_request: DataprivacyGetDataRequestParameters;
  dataprivacy_get_purpose_options: DataprivacyGetPurposeOptionsParameters;
  dataprivacy_get_users: DataprivacyGetUsersParameters;
  dataprivacy_mark_complete: DataprivacyMarkCompleteParameters;
  dataprivacy_set_context_defaults: DataprivacySetContextDefaultsParameters;
  dataprivacy_set_context_form: DataprivacySetContextFormParameters;
  dataprivacy_set_contextlevel_form: DataprivacySetContextlevelFormParameters;
  dataprivacy_submit_selected_courses_form: DataprivacySubmitSelectedCoursesFormParameters;
  dataprivacy_tree_extra_branches: DataprivacyTreeExtraBranchesParameters;
  lp_data_for_competencies_manage_page: LpDataForCompetenciesManagePageParameters;
  lp_data_for_competency_frameworks_manage_page: LpDataForCompetencyFrameworksManagePageParameters;
  lp_data_for_competency_summary: LpDataForCompetencySummaryParameters;
  lp_data_for_related_competencies_section: LpDataForRelatedCompetenciesSectionParameters;
  lp_data_for_template_competencies_page: LpDataForTemplateCompetenciesPageParameters;
  lp_data_for_templates_manage_page: LpDataForTemplatesManagePageParameters;
  lp_list_courses_using_competency: LpListCoursesUsingCompetencyParameters;
  lp_search_cohorts: LpSearchCohortsParameters;
  lp_search_users: LpSearchUsersParameters;
  policy_submit_accept_on_behalf: PolicySubmitAcceptOnBehalfParameters;
  templatelibrary_list_templates: TemplatelibraryListTemplatesParameters;
  templatelibrary_load_canonical_template: TemplatelibraryLoadCanonicalTemplateParameters;
  usertours_complete_tour: UsertoursCompleteTourParameters;
  usertours_fetch_and_start_tour: UsertoursFetchAndStartTourParameters;
  usertours_reset_tour: UsertoursResetTourParameters;
  usertours_step_shown: UsertoursStepShownParameters;
  xmldb_invoke_move_action: XmldbInvokeMoveActionParameters;
  grades_get_enrolled_users_for_search_widget: GradesGetEnrolledUsersForSearchWidgetParameters;
  grades_get_groups_for_search_widget: GradesGetGroupsForSearchWidgetParameters;
  output_load_fontawesome_icon_map: OutputLoadFontawesomeIconMapParameters;
  mod_assign_delete_overrides: ModAssignDeleteOverridesParameters;
  mod_assign_get_overrides: ModAssignGetOverridesParameters;
  mod_assign_save_overrides: ModAssignSaveOverridesParameters;
  mod_chat_get_chat_latest_messages: ModChatGetChatLatestMessagesParameters;
  mod_chat_get_chat_users: ModChatGetChatUsersParameters;
  mod_chat_get_chats_by_courses: ModChatGetChatsByCoursesParameters;
  mod_chat_get_session_messages: ModChatGetSessionMessagesParameters;
  mod_chat_get_sessions: ModChatGetSessionsParameters;
  mod_chat_login_user: ModChatLoginUserParameters;
  mod_chat_send_chat_message: ModChatSendChatMessageParameters;
  mod_chat_view_chat: ModChatViewChatParameters;
  mod_chat_view_sessions: ModChatViewSessionsParameters;
  mod_forum_set_read_state: ModForumSetReadStateParameters;
  mod_quiz_get_users_in_report: ModQuizGetUsersInReportParameters;
  mod_survey_get_questions: ModSurveyGetQuestionsParameters;
  mod_survey_get_surveys_by_courses: ModSurveyGetSurveysByCoursesParameters;
  mod_survey_submit_answers: ModSurveySubmitAnswersParameters;
  mod_survey_view_survey: ModSurveyViewSurveyParameters;
  report_insights_set_fixed_prediction: ReportInsightsSetFixedPredictionParameters;
  report_insights_set_notuseful_prediction: ReportInsightsSetNotusefulPredictionParameters;
}

export interface MoodleOperationResponses {
  get_site_info: GetSiteInfoResponse;
  get_courses: GetCoursesResponse;
  get_course: GetCourseResponse;
  create_course: CreateCourseResponse;
  update_course: UpdateCourseResponse;
  delete_course: DeleteCourseResponse;
  get_course_contents: GetCourseContentsResponse;
  get_users_by_field: GetUsersByFieldResponse;
  create_user: CreateUserResponse;
  update_user: UpdateUserResponse;
  delete_user: DeleteUserResponse;
  enrol_user: EnrolUserResponse;
  unenrol_user: UnenrolUserResponse;
  get_course_groups: GetCourseGroupsResponse;
  create_group: CreateGroupResponse;
  delete_group: DeleteGroupResponse;
  add_group_member: AddGroupMemberResponse;
  remove_group_member: RemoveGroupMemberResponse;
  get_course_categories: GetCourseCategoriesResponse;
  get_course_category: GetCourseCategoryResponse;
  get_enrolled_users: GetEnrolledUsersResponse;
  get_cohorts: GetCohortsResponse;
  get_group_members: GetGroupMembersResponse;
  get_course_groupings: GetCourseGroupingsResponse;
  get_activity_completion_statuses: GetActivityCompletionStatusesResponse;
  get_course_completion_status: GetCourseCompletionStatusResponse;
  get_calendar_events: GetCalendarEventsResponse;
  get_grade_items: GetGradeItemsResponse;
  create_course_category: CreateCourseCategoryResponse;
  update_course_category: UpdateCourseCategoryResponse;
  delete_course_category: DeleteCourseCategoryResponse;
  get_group: GetGroupResponse;
  update_group: UpdateGroupResponse;
  create_grouping: CreateGroupingResponse;
  get_grouping: GetGroupingResponse;
  update_grouping: UpdateGroupingResponse;
  delete_grouping: DeleteGroupingResponse;
  add_group_to_grouping: AddGroupToGroupingResponse;
  remove_group_from_grouping: RemoveGroupFromGroupingResponse;
  create_cohort: CreateCohortResponse;
  update_cohort: UpdateCohortResponse;
  delete_cohort: DeleteCohortResponse;
  get_cohort_members: GetCohortMembersResponse;
  search_cohorts: SearchCohortsResponse;
  add_cohort_member: AddCohortMemberResponse;
  remove_cohort_member: RemoveCohortMemberResponse;
  assign_role: AssignRoleResponse;
  unassign_role: UnassignRoleResponse;
  get_user_courses: GetUserCoursesResponse;
  get_course_enrolment_methods: GetCourseEnrolmentMethodsResponse;
  get_enrolled_users_with_capability: GetEnrolledUsersWithCapabilityResponse;
  search_enrolled_users: SearchEnrolledUsersResponse;
  get_potential_enrolment_users: GetPotentialEnrolmentUsersResponse;
  get_self_enrolment_info: GetSelfEnrolmentInfoResponse;
  self_enrol: SelfEnrolResponse;
  update_user_enrolment: UpdateUserEnrolmentResponse;
  delete_user_enrolment: DeleteUserEnrolmentResponse;
  get_grades_table: GetGradesTableResponse;
  get_user_course_grades: GetUserCourseGradesResponse;
  get_grade_access_information: GetGradeAccessInformationResponse;
  get_gradebook_items: GetGradebookItemsResponse;
  get_grade_tree: GetGradeTreeResponse;
  get_gradable_users: GetGradableUsersResponse;
  get_grade_feedback: GetGradeFeedbackResponse;
  create_grade_category: CreateGradeCategoryResponse;
  update_grade_value: UpdateGradeValueResponse;
  set_activity_completion_status: SetActivityCompletionStatusResponse;
  override_activity_completion_status: OverrideActivityCompletionStatusResponse;
  mark_course_self_completed: MarkCourseSelfCompletedResponse;
  upload_draft_file: UploadDraftFileResponse;
  download_file: DownloadFileResponse;
  get_course_assignments: GetCourseAssignmentsResponse;
  get_assignment_submissions: GetAssignmentSubmissionsResponse;
  get_assignment_grades: GetAssignmentGradesResponse;
  get_assignment_submission_status: GetAssignmentSubmissionStatusResponse;
  get_assignment_participants: GetAssignmentParticipantsResponse;
  get_assignment_participant: GetAssignmentParticipantResponse;
  start_assignment_submission: StartAssignmentSubmissionResponse;
  save_assignment_submission: SaveAssignmentSubmissionResponse;
  submit_assignment_for_grading: SubmitAssignmentForGradingResponse;
  save_assignment_grade: SaveAssignmentGradeResponse;
  set_assignment_user_flags: SetAssignmentUserFlagsResponse;
  get_assignment_user_flags: GetAssignmentUserFlagsResponse;
  get_assignment_user_mappings: GetAssignmentUserMappingsResponse;
  lock_assignment_submissions: LockAssignmentSubmissionsResponse;
  unlock_assignment_submissions: UnlockAssignmentSubmissionsResponse;
  revert_assignment_submissions_to_draft: RevertAssignmentSubmissionsToDraftResponse;
  set_assignment_extension: SetAssignmentExtensionResponse;
  reveal_assignment_identities: RevealAssignmentIdentitiesResponse;
  copy_previous_assignment_attempt: CopyPreviousAssignmentAttemptResponse;
  remove_assignment_submission: RemoveAssignmentSubmissionResponse;
  view_assignment: ViewAssignmentResponse;
  view_assignment_submission_status: ViewAssignmentSubmissionStatusResponse;
  view_assignment_grading_table: ViewAssignmentGradingTableResponse;
  get_course_forums: GetCourseForumsResponse;
  get_forum_discussions: GetForumDiscussionsResponse;
  get_forum_discussion_posts: GetForumDiscussionPostsResponse;
  get_forum_post: GetForumPostResponse;
  get_forum_posts_by_user: GetForumPostsByUserResponse;
  get_forum_access_information: GetForumAccessInformationResponse;
  can_add_forum_discussion: CanAddForumDiscussionResponse;
  create_forum_discussion: CreateForumDiscussionResponse;
  reply_to_forum_post: ReplyToForumPostResponse;
  update_forum_post: UpdateForumPostResponse;
  delete_forum_post: DeleteForumPostResponse;
  prepare_forum_post_draft: PrepareForumPostDraftResponse;
  set_forum_subscription: SetForumSubscriptionResponse;
  set_forum_tracking: SetForumTrackingResponse;
  set_forum_discussion_subscription: SetForumDiscussionSubscriptionResponse;
  set_forum_discussion_favourite: SetForumDiscussionFavouriteResponse;
  set_forum_discussion_pin: SetForumDiscussionPinResponse;
  set_forum_discussion_lock: SetForumDiscussionLockResponse;
  mark_forum_posts_read: MarkForumPostsReadResponse;
  view_forum: ViewForumResponse;
  view_forum_discussion: ViewForumDiscussionResponse;
  get_course_quizzes: GetCourseQuizzesResponse;
  get_user_quiz_attempts: GetUserQuizAttemptsResponse;
  get_user_quiz_best_grade: GetUserQuizBestGradeResponse;
  get_quiz_review_options: GetQuizReviewOptionsResponse;
  start_quiz_attempt: StartQuizAttemptResponse;
  get_quiz_attempt_data: GetQuizAttemptDataResponse;
  get_quiz_attempt_summary: GetQuizAttemptSummaryResponse;
  save_quiz_attempt: SaveQuizAttemptResponse;
  process_quiz_attempt: ProcessQuizAttemptResponse;
  get_quiz_attempt_review: GetQuizAttemptReviewResponse;
  get_quiz_feedback_for_grade: GetQuizFeedbackForGradeResponse;
  get_quiz_access_information: GetQuizAccessInformationResponse;
  get_quiz_attempt_access_information: GetQuizAttemptAccessInformationResponse;
  get_quiz_required_question_types: GetQuizRequiredQuestionTypesResponse;
  view_quiz: ViewQuizResponse;
  view_quiz_attempt: ViewQuizAttemptResponse;
  view_quiz_attempt_summary: ViewQuizAttemptSummaryResponse;
  view_quiz_attempt_review: ViewQuizAttemptReviewResponse;
  get_course_books: GetCourseBooksResponse;
  view_book: ViewBookResponse;
  get_course_folders: GetCourseFoldersResponse;
  view_folder: ViewFolderResponse;
  get_course_imscp_packages: GetCourseImscpPackagesResponse;
  view_imscp_package: ViewImscpPackageResponse;
  get_course_labels: GetCourseLabelsResponse;
  get_course_pages: GetCoursePagesResponse;
  view_page: ViewPageResponse;
  get_course_resources: GetCourseResourcesResponse;
  view_resource: ViewResourceResponse;
  get_course_urls: GetCourseUrlsResponse;
  view_url: ViewUrlResponse;
  get_course_choices: GetCourseChoicesResponse;
  get_choice_options: GetChoiceOptionsResponse;
  get_choice_results: GetChoiceResultsResponse;
  submit_choice_response: SubmitChoiceResponseResponse;
  delete_choice_responses: DeleteChoiceResponsesResponse;
  view_choice: ViewChoiceResponse;
  get_course_scorm_packages: GetCourseScormPackagesResponse;
  get_scorm_attempt_count: GetScormAttemptCountResponse;
  get_scorm_contents: GetScormContentsResponse;
  get_scorm_user_data: GetScormUserDataResponse;
  save_scorm_tracks: SaveScormTracksResponse;
  get_scorm_tracks: GetScormTracksResponse;
  launch_scorm_content: LaunchScormContentResponse;
  get_scorm_access_information: GetScormAccessInformationResponse;
  view_scorm: ViewScormResponse;
  get_course_wikis: GetCourseWikisResponse;
  get_wiki_subwikis: GetWikiSubwikisResponse;
  get_wiki_pages: GetWikiPagesResponse;
  get_wiki_files: GetWikiFilesResponse;
  get_wiki_page: GetWikiPageResponse;
  get_wiki_page_for_editing: GetWikiPageForEditingResponse;
  create_wiki_page: CreateWikiPageResponse;
  update_wiki_page: UpdateWikiPageResponse;
  view_wiki: ViewWikiResponse;
  view_wiki_page: ViewWikiPageResponse;
  get_course_feedbacks: GetCourseFeedbacksResponse;
  get_feedback_access_information: GetFeedbackAccessInformationResponse;
  get_feedback_temporary_completion: GetFeedbackTemporaryCompletionResponse;
  get_feedback_items: GetFeedbackItemsResponse;
  launch_feedback: LaunchFeedbackResponse;
  get_feedback_page: GetFeedbackPageResponse;
  submit_feedback_page: SubmitFeedbackPageResponse;
  get_feedback_analysis: GetFeedbackAnalysisResponse;
  get_unfinished_feedback_responses: GetUnfinishedFeedbackResponsesResponse;
  get_finished_feedback_responses: GetFinishedFeedbackResponsesResponse;
  get_feedback_non_respondents: GetFeedbackNonRespondentsResponse;
  get_feedback_responses_analysis: GetFeedbackResponsesAnalysisResponse;
  get_last_feedback_completion: GetLastFeedbackCompletionResponse;
  reorder_feedback_questions: ReorderFeedbackQuestionsResponse;
  view_feedback: ViewFeedbackResponse;
  get_course_h5p_activities: GetCourseH5pActivitiesResponse;
  get_h5p_access_information: GetH5pAccessInformationResponse;
  get_h5p_attempts: GetH5pAttemptsResponse;
  get_h5p_results: GetH5pResultsResponse;
  get_h5p_user_attempts: GetH5pUserAttemptsResponse;
  log_h5p_report_view: LogH5pReportViewResponse;
  view_h5p_activity: ViewH5pActivityResponse;
  get_course_databases: GetCourseDatabasesResponse;
  get_database_access_information: GetDatabaseAccessInformationResponse;
  get_database_entries: GetDatabaseEntriesResponse;
  get_database_entry: GetDatabaseEntryResponse;
  get_database_fields: GetDatabaseFieldsResponse;
  search_database_entries: SearchDatabaseEntriesResponse;
  approve_database_entry: ApproveDatabaseEntryResponse;
  delete_database_entry: DeleteDatabaseEntryResponse;
  create_database_entry: CreateDatabaseEntryResponse;
  update_database_entry: UpdateDatabaseEntryResponse;
  delete_database_presets: DeleteDatabasePresetsResponse;
  get_database_preset_mapping: GetDatabasePresetMappingResponse;
  view_database: ViewDatabaseResponse;
  get_course_glossaries: GetCourseGlossariesResponse;
  get_glossary_entries_by_letter: GetGlossaryEntriesByLetterResponse;
  get_glossary_entries_by_date: GetGlossaryEntriesByDateResponse;
  get_glossary_categories: GetGlossaryCategoriesResponse;
  get_glossary_entries_by_category: GetGlossaryEntriesByCategoryResponse;
  get_glossary_authors: GetGlossaryAuthorsResponse;
  get_glossary_entries_by_author_letter: GetGlossaryEntriesByAuthorLetterResponse;
  get_glossary_entries_by_author: GetGlossaryEntriesByAuthorResponse;
  search_glossary_entries: SearchGlossaryEntriesResponse;
  get_glossary_entries_by_term: GetGlossaryEntriesByTermResponse;
  get_glossary_entries_to_approve: GetGlossaryEntriesToApproveResponse;
  get_glossary_entry: GetGlossaryEntryResponse;
  create_glossary_entry: CreateGlossaryEntryResponse;
  update_glossary_entry: UpdateGlossaryEntryResponse;
  delete_glossary_entry: DeleteGlossaryEntryResponse;
  prepare_glossary_entry: PrepareGlossaryEntryResponse;
  view_glossary: ViewGlossaryResponse;
  view_glossary_entry: ViewGlossaryEntryResponse;
  get_course_bigbluebutton_activities: GetCourseBigbluebuttonActivitiesResponse;
  can_join_bigbluebutton: CanJoinBigbluebuttonResponse;
  get_bigbluebutton_join_url: GetBigbluebuttonJoinUrlResponse;
  get_bigbluebutton_recordings: GetBigbluebuttonRecordingsResponse;
  get_bigbluebutton_recordings_to_import: GetBigbluebuttonRecordingsToImportResponse;
  update_bigbluebutton_recording: UpdateBigbluebuttonRecordingResponse;
  end_bigbluebutton_meeting: EndBigbluebuttonMeetingResponse;
  validate_bigbluebutton_completion: ValidateBigbluebuttonCompletionResponse;
  get_bigbluebutton_meeting_information: GetBigbluebuttonMeetingInformationResponse;
  view_bigbluebutton: ViewBigbluebuttonResponse;
  get_course_lessons: GetCourseLessonsResponse;
  get_lesson: GetLessonResponse;
  get_lesson_access_information: GetLessonAccessInformationResponse;
  get_lesson_question_attempts: GetLessonQuestionAttemptsResponse;
  get_lesson_user_grade: GetLessonUserGradeResponse;
  get_lesson_attempt_grade: GetLessonAttemptGradeResponse;
  get_lesson_content_pages_viewed: GetLessonContentPagesViewedResponse;
  get_lesson_user_timers: GetLessonUserTimersResponse;
  get_lesson_pages: GetLessonPagesResponse;
  launch_lesson_attempt: LaunchLessonAttemptResponse;
  get_lesson_page: GetLessonPageResponse;
  submit_lesson_page: SubmitLessonPageResponse;
  finish_lesson_attempt: FinishLessonAttemptResponse;
  get_lesson_attempts_overview: GetLessonAttemptsOverviewResponse;
  get_lesson_user_attempt: GetLessonUserAttemptResponse;
  get_lesson_possible_jumps: GetLessonPossibleJumpsResponse;
  view_lesson: ViewLessonResponse;
  get_course_lti_tools: GetCourseLtiToolsResponse;
  get_lti_launch_data: GetLtiLaunchDataResponse;
  get_lti_tool_proxies: GetLtiToolProxiesResponse;
  create_lti_tool_proxy: CreateLtiToolProxyResponse;
  delete_lti_tool_proxy: DeleteLtiToolProxyResponse;
  get_lti_proxy_registration_request: GetLtiProxyRegistrationRequestResponse;
  get_lti_tool_types: GetLtiToolTypesResponse;
  get_lti_tool_types_and_proxies: GetLtiToolTypesAndProxiesResponse;
  count_lti_tool_types_and_proxies: CountLtiToolTypesAndProxiesResponse;
  create_lti_tool_type: CreateLtiToolTypeResponse;
  update_lti_tool_type: UpdateLtiToolTypeResponse;
  delete_lti_tool_type: DeleteLtiToolTypeResponse;
  delete_course_lti_tool_type: DeleteCourseLtiToolTypeResponse;
  set_lti_tool_activity_chooser_visibility: SetLtiToolActivityChooserVisibilityResponse;
  is_lti_cartridge: IsLtiCartridgeResponse;
  view_lti: ViewLtiResponse;
  get_course_workshops: GetCourseWorkshopsResponse;
  get_workshop_access_information: GetWorkshopAccessInformationResponse;
  get_workshop_user_plan: GetWorkshopUserPlanResponse;
  create_workshop_submission: CreateWorkshopSubmissionResponse;
  update_workshop_submission: UpdateWorkshopSubmissionResponse;
  delete_workshop_submission: DeleteWorkshopSubmissionResponse;
  get_workshop_submissions: GetWorkshopSubmissionsResponse;
  get_workshop_submission: GetWorkshopSubmissionResponse;
  get_workshop_submission_assessments: GetWorkshopSubmissionAssessmentsResponse;
  get_workshop_assessment: GetWorkshopAssessmentResponse;
  get_workshop_assessment_form: GetWorkshopAssessmentFormResponse;
  get_workshop_reviewer_assessments: GetWorkshopReviewerAssessmentsResponse;
  update_workshop_assessment: UpdateWorkshopAssessmentResponse;
  get_workshop_grades: GetWorkshopGradesResponse;
  evaluate_workshop_assessment: EvaluateWorkshopAssessmentResponse;
  get_workshop_grades_report: GetWorkshopGradesReportResponse;
  evaluate_workshop_submission: EvaluateWorkshopSubmissionResponse;
  view_workshop: ViewWorkshopResponse;
  view_workshop_submission: ViewWorkshopSubmissionResponse;
  save_assignment_grades: SaveAssignmentGradesResponse;
  submit_assignment_grading_form: SubmitAssignmentGradingFormResponse;
  get_user_quiz_attempts_legacy: GetUserQuizAttemptsLegacyResponse;
  set_quiz_question_version: SetQuizQuestionVersionResponse;
  reopen_quiz_attempt: ReopenQuizAttemptResponse;
  get_reopen_quiz_attempt_confirmation: GetReopenQuizAttemptConfirmationResponse;
  add_quiz_random_questions: AddQuizRandomQuestionsResponse;
  update_quiz_random_question_filter: UpdateQuizRandomQuestionFilterResponse;
  save_quiz_overrides: SaveQuizOverridesResponse;
  delete_quiz_overrides: DeleteQuizOverridesResponse;
  get_quiz_overrides: GetQuizOverridesResponse;
  create_quiz_grade_items: CreateQuizGradeItemsResponse;
  delete_quiz_grade_items: DeleteQuizGradeItemsResponse;
  update_quiz_grade_items: UpdateQuizGradeItemsResponse;
  update_quiz_slots: UpdateQuizSlotsResponse;
  get_quiz_grading_setup: GetQuizGradingSetupResponse;
  create_quiz_grade_item_per_section: CreateQuizGradeItemPerSectionResponse;
  get_calendar_month: GetCalendarMonthResponse;
  get_calendar_day: GetCalendarDayResponse;
  get_calendar_upcoming: GetCalendarUpcomingResponse;
  move_calendar_event: MoveCalendarEventResponse;
  create_calendar_events: CreateCalendarEventsResponse;
  delete_calendar_events: DeleteCalendarEventsResponse;
  get_action_events_by_time: GetActionEventsByTimeResponse;
  get_course_action_events: GetCourseActionEventsResponse;
  get_courses_action_events: GetCoursesActionEventsResponse;
  get_calendar_event: GetCalendarEventResponse;
  submit_calendar_event_form: SubmitCalendarEventFormResponse;
  get_calendar_access_information: GetCalendarAccessInformationResponse;
  get_allowed_calendar_event_types: GetAllowedCalendarEventTypesResponse;
  get_calendar_export_token: GetCalendarExportTokenResponse;
  get_badge: GetBadgeResponse;
  get_user_badges: GetUserBadgesResponse;
  get_user_badge_by_hash: GetUserBadgeByHashResponse;
  get_blog_entries: GetBlogEntriesResponse;
  view_blog_entries: ViewBlogEntriesResponse;
  get_blog_access_information: GetBlogAccessInformationResponse;
  create_blog_entry: CreateBlogEntryResponse;
  update_blog_entry: UpdateBlogEntryResponse;
  delete_blog_entry: DeleteBlogEntryResponse;
  prepare_blog_entry: PrepareBlogEntryResponse;
  get_comments: GetCommentsResponse;
  create_comments: CreateCommentsResponse;
  delete_comments: DeleteCommentsResponse;
  create_notes: CreateNotesResponse;
  delete_notes: DeleteNotesResponse;
  get_course_notes: GetCourseNotesResponse;
  view_notes: ViewNotesResponse;
  get_item_ratings: GetItemRatingsResponse;
  rate_item: RateItemResponse;
  get_activity_allowed_groups: GetActivityAllowedGroupsResponse;
  get_activity_group_mode: GetActivityGroupModeResponse;
  get_user_course_groups: GetUserCourseGroupsResponse;
  get_groups_for_selector: GetGroupsForSelectorResponse;
  get_recently_accessed_items: GetRecentlyAccessedItemsResponse;
  get_starred_courses: GetStarredCoursesResponse;
  view_personal_page: ViewPersonalPageResponse;
  update_question_flag: UpdateQuestionFlagResponse;
  browse_files: BrowseFilesResponse;
  delete_draft_files: DeleteDraftFilesResponse;
  get_unused_draft_area: GetUnusedDraftAreaResponse;
  get_user_preferences: GetUserPreferencesResponse;
  get_private_files_information: GetPrivateFilesInformationResponse;
  view_course_user_list: ViewCourseUserListResponse;
  view_user_profile: ViewUserProfileResponse;
  agree_site_policy: AgreeSitePolicyResponse;
  add_private_files: AddPrivateFilesResponse;
  update_user_picture: UpdateUserPictureResponse;
  remove_user_device: RemoveUserDeviceResponse;
  search_site: SearchSiteResponse;
  get_top_search_results: GetTopSearchResultsResponse;
  get_search_areas: GetSearchAreasResponse;
  view_search_results: ViewSearchResultsResponse;
  get_tag_areas: GetTagAreasResponse;
  get_tag_collections: GetTagCollectionsResponse;
  get_tag_cloud: GetTagCloudResponse;
  get_tag_index: GetTagIndexResponse;
  get_tag_index_by_area: GetTagIndexByAreaResponse;
  get_course_module: GetCourseModuleResponse;
  get_course_module_by_instance: GetCourseModuleByInstanceResponse;
  view_course: ViewCourseResponse;
  search_courses: SearchCoursesResponse;
  get_course_navigation_options: GetCourseNavigationOptionsResponse;
  get_course_administration_options: GetCourseAdministrationOptionsResponse;
  get_course_updates: GetCourseUpdatesResponse;
  get_timeline_courses: GetTimelineCoursesResponse;
  set_favourite_courses: SetFavouriteCoursesResponse;
  get_recent_courses: GetRecentCoursesResponse;
  check_course_updates: CheckCourseUpdatesResponse;
  get_timeline_courses_with_events: GetTimelineCoursesWithEventsResponse;
  view_module_instance_list: ViewModuleInstanceListResponse;
  get_course_overview: GetCourseOverviewResponse;
  view_course_overview: ViewCourseOverviewResponse;
  get_available_filters: GetAvailableFiltersResponse;
  get_all_filter_states: GetAllFilterStatesResponse;
  get_component_strings: GetComponentStringsResponse;
  get_fontawesome_icon_map: GetFontawesomeIconMapResponse;
  get_trusted_h5p_file: GetTrustedH5pFileResponse;
  is_push_notification_system_configured: IsPushNotificationSystemConfiguredResponse;
  get_push_preference_statuses: GetPushPreferenceStatusesResponse;
  get_user_push_devices: GetUserPushDevicesResponse;
  set_push_device_enabled: SetPushDeviceEnabledResponse;
  get_popup_notifications: GetPopupNotificationsResponse;
  get_unread_popup_notification_count: GetUnreadPopupNotificationCountResponse;
  get_guest_enrolment_information: GetGuestEnrolmentInformationResponse;
  validate_guest_enrolment_password: ValidateGuestEnrolmentPasswordResponse;
  register_user_device: RegisterUserDeviceResponse;
  update_user_device_public_key: UpdateUserDevicePublicKeyResponse;
  get_course_user_profiles: GetCourseUserProfilesResponse;
  set_user_preferences: SetUserPreferencesResponse;
  update_user_preferences: UpdateUserPreferencesResponse;
  prepare_private_files: PreparePrivateFilesResponse;
  update_private_files: UpdatePrivateFilesResponse;
  get_xapi_state: GetXapiStateResponse;
  get_xapi_states: GetXapiStatesResponse;
  save_xapi_state: SaveXapiStateResponse;
  delete_xapi_state: DeleteXapiStateResponse;
  delete_xapi_states: DeleteXapiStatesResponse;
  post_xapi_statements: PostXapiStatementsResponse;
  view_competency: ViewCompetencyResponse;
  delete_competency_evidence: DeleteCompetencyEvidenceResponse;
  get_competency_scale_values: GetCompetencyScaleValuesResponse;
  grade_course_competency: GradeCourseCompetencyResponse;
  get_course_competencies: GetCourseCompetenciesResponse;
  view_user_competency: ViewUserCompetencyResponse;
  view_user_competency_in_course: ViewUserCompetencyInCourseResponse;
  view_user_competency_in_plan: ViewUserCompetencyInPlanResponse;
  view_user_competency_plan: ViewUserCompetencyPlanResponse;
  get_course_blocks: GetCourseBlocksResponse;
  get_dashboard_blocks: GetDashboardBlocksResponse;
  get_addable_blocks: GetAddableBlocksResponse;
  get_grade_selector_users: GetGradeSelectorUsersResponse;
  get_grade_selector_groups: GetGradeSelectorGroupsResponse;
  get_point_grading_panel: GetPointGradingPanelResponse;
  save_point_grading_panel: SavePointGradingPanelResponse;
  get_scale_grading_panel: GetScaleGradingPanelResponse;
  save_scale_grading_panel: SaveScaleGradingPanelResponse;
  get_grader_report_users: GetGraderReportUsersResponse;
  get_grade_items_for_selector: GetGradeItemsForSelectorResponse;
  view_grade_overview_report: ViewGradeOverviewReportResponse;
  view_user_grade_report: ViewUserGradeReportResponse;
  record_insight_action: RecordInsightActionResponse;
  list_custom_reports: ListCustomReportsResponse;
  get_custom_report: GetCustomReportResponse;
  view_custom_report: ViewCustomReportResponse;
  can_view_system_report: CanViewSystemReportResponse;
  get_system_report: GetSystemReportResponse;
  get_dynamic_table: GetDynamicTableResponse;
  get_tiny_editor_configuration: GetTinyEditorConfigurationResponse;
  get_tiny_premium_api_key: GetTinyPremiumApiKeyResponse;
  get_data_privacy_access_information: GetDataPrivacyAccessInformationResponse;
  create_data_request: CreateDataRequestResponse;
  cancel_data_request: CancelDataRequestResponse;
  contact_data_protection_officer: ContactDataProtectionOfficerResponse;
  get_data_requests: GetDataRequestsResponse;
  get_policy_acceptances: GetPolicyAcceptancesResponse;
  set_policy_acceptances: SetPolicyAcceptancesResponse;
  get_course_competencies_page: GetCourseCompetenciesPageResponse;
  get_learning_plan_page: GetLearningPlanPageResponse;
  get_user_learning_plans_page: GetUserLearningPlansPageResponse;
  get_user_competency_summary: GetUserCompetencySummaryResponse;
  get_course_user_competency_summary: GetCourseUserCompetencySummaryResponse;
  get_plan_user_competency_summary: GetPlanUserCompetencySummaryResponse;
  get_user_evidence_list_page: GetUserEvidenceListPageResponse;
  get_user_evidence_page: GetUserEvidencePageResponse;
  send_conversation_messages: SendConversationMessagesResponse;
  send_instant_messages: SendInstantMessagesResponse;
  delete_message_contacts: DeleteMessageContactsResponse;
  mute_conversations: MuteConversationsResponse;
  unmute_conversations: UnmuteConversationsResponse;
  block_message_user: BlockMessageUserResponse;
  unblock_message_user: UnblockMessageUserResponse;
  get_contact_requests: GetContactRequestsResponse;
  get_received_contact_request_count: GetReceivedContactRequestCountResponse;
  get_conversation_members: GetConversationMembersResponse;
  create_contact_request: CreateContactRequestResponse;
  confirm_contact_request: ConfirmContactRequestResponse;
  decline_contact_request: DeclineContactRequestResponse;
  search_message_users: SearchMessageUsersResponse;
  search_messages: SearchMessagesResponse;
  get_conversation_between_users: GetConversationBetweenUsersResponse;
  get_self_conversation: GetSelfConversationResponse;
  get_conversation_messages: GetConversationMessagesResponse;
  get_message_contacts: GetMessageContactsResponse;
  search_message_contacts: SearchMessageContactsResponse;
  get_conversations: GetConversationsResponse;
  get_conversation: GetConversationResponse;
  get_messages: GetMessagesResponse;
  get_conversation_counts: GetConversationCountsResponse;
  get_unread_conversation_counts: GetUnreadConversationCountsResponse;
  get_unread_conversations_count: GetUnreadConversationsCountResponse;
  get_unread_notification_count: GetUnreadNotificationCountResponse;
  get_blocked_message_users: GetBlockedMessageUsersResponse;
  get_message_member_info: GetMessageMemberInfoResponse;
  mark_message_read: MarkMessageReadResponse;
  mark_notification_read: MarkNotificationReadResponse;
  mark_all_notifications_read: MarkAllNotificationsReadResponse;
  mark_conversation_read: MarkConversationReadResponse;
  delete_conversations: DeleteConversationsResponse;
  delete_message: DeleteMessageResponse;
  delete_message_for_all_users: DeleteMessageForAllUsersResponse;
  configure_message_processor: ConfigureMessageProcessorResponse;
  get_user_notification_preferences: GetUserNotificationPreferencesResponse;
  get_user_message_preferences: GetUserMessagePreferencesResponse;
  set_favourite_conversations: SetFavouriteConversationsResponse;
  unset_favourite_conversations: UnsetFavouriteConversationsResponse;
  explain_text_with_ai: ExplainTextWithAiResponse;
  summarise_text_with_ai: SummariseTextWithAiResponse;
  generate_ai_image: GenerateAiImageResponse;
  generate_ai_text: GenerateAiTextResponse;
  get_ai_policy_status: GetAiPolicyStatusResponse;
  set_ai_policy_status: SetAiPolicyStatusResponse;
  get_analytics_contexts: GetAnalyticsContextsResponse;
  get_mobile_plugins: GetMobilePluginsResponse;
  get_mobile_public_config: GetMobilePublicConfigResponse;
  get_mobile_config: GetMobileConfigResponse;
  get_mobile_autologin_key: GetMobileAutologinKeyResponse;
  get_mobile_content: GetMobileContentResponse;
  call_mobile_external_functions: CallMobileExternalFunctionsResponse;
  get_mobile_qr_login_tokens: GetMobileQrLoginTokensResponse;
  validate_mobile_subscription_key: ValidateMobileSubscriptionKeyResponse;
  get_policy_version: GetPolicyVersionResponse;
  search_moodlenet_courses: SearchMoodlenetCoursesResponse;
  verify_moodlenet_profile: VerifyMoodlenetProfileResponse;
  auth_email_get_signup_settings: AuthEmailGetSignupSettingsResponse;
  auth_email_signup_user: AuthEmailSignupUserResponse;
  block_accessreview_get_module_data: BlockAccessreviewGetModuleDataResponse;
  block_accessreview_get_section_data: BlockAccessreviewGetSectionDataResponse;
  admin_set_block_protection: AdminSetBlockProtectionResponse;
  admin_set_plugin_order: AdminSetPluginOrderResponse;
  admin_set_plugin_state: AdminSetPluginStateResponse;
  ai_delete_provider_instance: AiDeleteProviderInstanceResponse;
  ai_set_action: AiSetActionResponse;
  ai_set_provider_order: AiSetProviderOrderResponse;
  ai_set_provider_status: AiSetProviderStatusResponse;
  auth_confirm_user: AuthConfirmUserResponse;
  auth_is_age_digital_consent_verification_enabled: AuthIsAgeDigitalConsentVerificationEnabledResponse;
  auth_is_minor: AuthIsMinorResponse;
  auth_request_password_reset: AuthRequestPasswordResetResponse;
  auth_resend_confirmation_email: AuthResendConfirmationEmailResponse;
  backup_get_async_backup_links_backup: BackupGetAsyncBackupLinksBackupResponse;
  backup_get_async_backup_links_restore: BackupGetAsyncBackupLinksRestoreResponse;
  backup_get_async_backup_progress: BackupGetAsyncBackupProgressResponse;
  backup_get_copy_progress: BackupGetCopyProgressResponse;
  backup_submit_copy_form: BackupSubmitCopyFormResponse;
  badges_disable_badges: BadgesDisableBadgesResponse;
  badges_enable_badges: BadgesEnableBadgesResponse;
  calendar_delete_subscription: CalendarDeleteSubscriptionResponse;
  calendar_get_timestamps: CalendarGetTimestampsResponse;
  change_editmode: ChangeEditmodeResponse;
  check_get_result_admintree: CheckGetResultAdmintreeResponse;
  competency_add_competency_to_course: CompetencyAddCompetencyToCourseResponse;
  competency_add_competency_to_plan: CompetencyAddCompetencyToPlanResponse;
  competency_add_competency_to_template: CompetencyAddCompetencyToTemplateResponse;
  competency_add_related_competency: CompetencyAddRelatedCompetencyResponse;
  competency_approve_plan: CompetencyApprovePlanResponse;
  competency_competency_framework_viewed: CompetencyCompetencyFrameworkViewedResponse;
  competency_complete_plan: CompetencyCompletePlanResponse;
  competency_count_competencies: CompetencyCountCompetenciesResponse;
  competency_count_competencies_in_course: CompetencyCountCompetenciesInCourseResponse;
  competency_count_competencies_in_template: CompetencyCountCompetenciesInTemplateResponse;
  competency_count_competency_frameworks: CompetencyCountCompetencyFrameworksResponse;
  competency_count_course_module_competencies: CompetencyCountCourseModuleCompetenciesResponse;
  competency_count_courses_using_competency: CompetencyCountCoursesUsingCompetencyResponse;
  competency_count_templates: CompetencyCountTemplatesResponse;
  competency_count_templates_using_competency: CompetencyCountTemplatesUsingCompetencyResponse;
  competency_create_competency: CompetencyCreateCompetencyResponse;
  competency_create_competency_framework: CompetencyCreateCompetencyFrameworkResponse;
  competency_create_plan: CompetencyCreatePlanResponse;
  competency_create_template: CompetencyCreateTemplateResponse;
  competency_create_user_evidence_competency: CompetencyCreateUserEvidenceCompetencyResponse;
  competency_delete_competency: CompetencyDeleteCompetencyResponse;
  competency_delete_competency_framework: CompetencyDeleteCompetencyFrameworkResponse;
  competency_delete_plan: CompetencyDeletePlanResponse;
  competency_delete_template: CompetencyDeleteTemplateResponse;
  competency_delete_user_evidence: CompetencyDeleteUserEvidenceResponse;
  competency_delete_user_evidence_competency: CompetencyDeleteUserEvidenceCompetencyResponse;
  competency_duplicate_competency_framework: CompetencyDuplicateCompetencyFrameworkResponse;
  competency_duplicate_template: CompetencyDuplicateTemplateResponse;
  competency_grade_competency: CompetencyGradeCompetencyResponse;
  competency_grade_competency_in_plan: CompetencyGradeCompetencyInPlanResponse;
  competency_list_competencies: CompetencyListCompetenciesResponse;
  competency_list_competencies_in_template: CompetencyListCompetenciesInTemplateResponse;
  competency_list_competency_frameworks: CompetencyListCompetencyFrameworksResponse;
  competency_list_course_module_competencies: CompetencyListCourseModuleCompetenciesResponse;
  competency_list_plan_competencies: CompetencyListPlanCompetenciesResponse;
  competency_list_templates: CompetencyListTemplatesResponse;
  competency_list_templates_using_competency: CompetencyListTemplatesUsingCompetencyResponse;
  competency_list_user_plans: CompetencyListUserPlansResponse;
  competency_move_down_competency: CompetencyMoveDownCompetencyResponse;
  competency_move_up_competency: CompetencyMoveUpCompetencyResponse;
  competency_plan_cancel_review_request: CompetencyPlanCancelReviewRequestResponse;
  competency_plan_request_review: CompetencyPlanRequestReviewResponse;
  competency_plan_start_review: CompetencyPlanStartReviewResponse;
  competency_plan_stop_review: CompetencyPlanStopReviewResponse;
  competency_read_competency: CompetencyReadCompetencyResponse;
  competency_read_competency_framework: CompetencyReadCompetencyFrameworkResponse;
  competency_read_plan: CompetencyReadPlanResponse;
  competency_read_template: CompetencyReadTemplateResponse;
  competency_read_user_evidence: CompetencyReadUserEvidenceResponse;
  competency_remove_competency_from_course: CompetencyRemoveCompetencyFromCourseResponse;
  competency_remove_competency_from_plan: CompetencyRemoveCompetencyFromPlanResponse;
  competency_remove_competency_from_template: CompetencyRemoveCompetencyFromTemplateResponse;
  competency_remove_related_competency: CompetencyRemoveRelatedCompetencyResponse;
  competency_reopen_plan: CompetencyReopenPlanResponse;
  competency_reorder_course_competency: CompetencyReorderCourseCompetencyResponse;
  competency_reorder_plan_competency: CompetencyReorderPlanCompetencyResponse;
  competency_reorder_template_competency: CompetencyReorderTemplateCompetencyResponse;
  competency_request_review_of_user_evidence_linked_competencies: CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesResponse;
  competency_search_competencies: CompetencySearchCompetenciesResponse;
  competency_set_course_competency_ruleoutcome: CompetencySetCourseCompetencyRuleoutcomeResponse;
  competency_set_parent_competency: CompetencySetParentCompetencyResponse;
  competency_template_has_related_data: CompetencyTemplateHasRelatedDataResponse;
  competency_template_viewed: CompetencyTemplateViewedResponse;
  competency_unapprove_plan: CompetencyUnapprovePlanResponse;
  competency_unlink_plan_from_template: CompetencyUnlinkPlanFromTemplateResponse;
  competency_update_competency: CompetencyUpdateCompetencyResponse;
  competency_update_competency_framework: CompetencyUpdateCompetencyFrameworkResponse;
  competency_update_course_competency_settings: CompetencyUpdateCourseCompetencySettingsResponse;
  competency_update_plan: CompetencyUpdatePlanResponse;
  competency_update_template: CompetencyUpdateTemplateResponse;
  competency_user_competency_cancel_review_request: CompetencyUserCompetencyCancelReviewRequestResponse;
  competency_user_competency_request_review: CompetencyUserCompetencyRequestReviewResponse;
  competency_user_competency_start_review: CompetencyUserCompetencyStartReviewResponse;
  competency_user_competency_stop_review: CompetencyUserCompetencyStopReviewResponse;
  contentbank_copy_content: ContentbankCopyContentResponse;
  contentbank_delete_content: ContentbankDeleteContentResponse;
  contentbank_rename_content: ContentbankRenameContentResponse;
  contentbank_set_content_visibility: ContentbankSetContentVisibilityResponse;
  course_add_content_item_to_user_favourites: CourseAddContentItemToUserFavouritesResponse;
  course_delete_modules: CourseDeleteModulesResponse;
  course_duplicate_course: CourseDuplicateCourseResponse;
  course_edit_module: CourseEditModuleResponse;
  course_edit_section: CourseEditSectionResponse;
  course_get_activity_chooser_footer: CourseGetActivityChooserFooterResponse;
  course_get_course_content_items: CourseGetCourseContentItemsResponse;
  course_get_enrolled_users_by_cmid: CourseGetEnrolledUsersByCmidResponse;
  course_get_module: CourseGetModuleResponse;
  course_import_course: CourseImportCourseResponse;
  course_remove_content_item_from_user_favourites: CourseRemoveContentItemFromUserFavouritesResponse;
  course_toggle_activity_recommendation: CourseToggleActivityRecommendationResponse;
  courseformat_create_module: CourseformatCreateModuleResponse;
  courseformat_file_handlers: CourseformatFileHandlersResponse;
  courseformat_get_section_content_items: CourseformatGetSectionContentItemsResponse;
  courseformat_get_state: CourseformatGetStateResponse;
  courseformat_new_module: CourseformatNewModuleResponse;
  courseformat_update_course: CourseformatUpdateCourseResponse;
  create_userfeedback_action_record: CreateUserfeedbackActionRecordResponse;
  customfield_convert_category: CustomfieldConvertCategoryResponse;
  customfield_create_category: CustomfieldCreateCategoryResponse;
  customfield_delete_category: CustomfieldDeleteCategoryResponse;
  customfield_delete_field: CustomfieldDeleteFieldResponse;
  customfield_move_category: CustomfieldMoveCategoryResponse;
  customfield_move_field: CustomfieldMoveFieldResponse;
  customfield_reload_template: CustomfieldReloadTemplateResponse;
  customfield_toggle_shared: CustomfieldToggleSharedResponse;
  dynamic_tabs_get_content: DynamicTabsGetContentResponse;
  fetch_notifications: FetchNotificationsResponse;
  files_upload: FilesUploadResponse;
  form_dynamic_form: FormDynamicFormResponse;
  form_get_filetypes_browser_data: FormGetFiletypesBrowserDataResponse;
  get_fragment: GetFragmentResponse;
  get_string: GetStringResponse;
  get_strings: GetStringsResponse;
  get_user_dates: GetUserDatesResponse;
  grading_get_definitions: GradingGetDefinitionsResponse;
  grading_get_gradingform_instances: GradingGetGradingformInstancesResponse;
  grading_save_definitions: GradingSaveDefinitionsResponse;
  message_get_message_processor: MessageGetMessageProcessorResponse;
  message_get_unsent_message: MessageGetUnsentMessageResponse;
  message_set_default_notification: MessageSetDefaultNotificationResponse;
  message_set_unsent_message: MessageSetUnsentMessageResponse;
  moodlenet_auth_check: MoodlenetAuthCheckResponse;
  moodlenet_get_share_info_activity: MoodlenetGetShareInfoActivityResponse;
  moodlenet_get_shared_course_info: MoodlenetGetSharedCourseInfoResponse;
  moodlenet_send_activity: MoodlenetSendActivityResponse;
  moodlenet_send_course: MoodlenetSendCourseResponse;
  notes_get_notes: NotesGetNotesResponse;
  notes_update_notes: NotesUpdateNotesResponse;
  output_load_template: OutputLoadTemplateResponse;
  output_load_template_with_dependencies: OutputLoadTemplateWithDependenciesResponse;
  output_poll_stored_progress: OutputPollStoredProgressResponse;
  payment_get_available_gateways: PaymentGetAvailableGatewaysResponse;
  question_get_random_question_summaries: QuestionGetRandomQuestionSummariesResponse;
  question_move_questions: QuestionMoveQuestionsResponse;
  question_search_shared_banks: QuestionSearchSharedBanksResponse;
  reportbuilder_audiences_delete: ReportbuilderAudiencesDeleteResponse;
  reportbuilder_columns_add: ReportbuilderColumnsAddResponse;
  reportbuilder_columns_delete: ReportbuilderColumnsDeleteResponse;
  reportbuilder_columns_reorder: ReportbuilderColumnsReorderResponse;
  reportbuilder_columns_sort_get: ReportbuilderColumnsSortGetResponse;
  reportbuilder_columns_sort_reorder: ReportbuilderColumnsSortReorderResponse;
  reportbuilder_columns_sort_toggle: ReportbuilderColumnsSortToggleResponse;
  reportbuilder_conditions_add: ReportbuilderConditionsAddResponse;
  reportbuilder_conditions_delete: ReportbuilderConditionsDeleteResponse;
  reportbuilder_conditions_reorder: ReportbuilderConditionsReorderResponse;
  reportbuilder_conditions_reset: ReportbuilderConditionsResetResponse;
  reportbuilder_filters_add: ReportbuilderFiltersAddResponse;
  reportbuilder_filters_delete: ReportbuilderFiltersDeleteResponse;
  reportbuilder_filters_reorder: ReportbuilderFiltersReorderResponse;
  reportbuilder_filters_reset: ReportbuilderFiltersResetResponse;
  reportbuilder_reports_delete: ReportbuilderReportsDeleteResponse;
  reportbuilder_reports_get: ReportbuilderReportsGetResponse;
  reportbuilder_schedules_delete: ReportbuilderSchedulesDeleteResponse;
  reportbuilder_schedules_send: ReportbuilderSchedulesSendResponse;
  reportbuilder_schedules_toggle: ReportbuilderSchedulesToggleResponse;
  reportbuilder_set_filters: ReportbuilderSetFiltersResponse;
  search_get_relevant_users: SearchGetRelevantUsersResponse;
  session_time_remaining: SessionTimeRemainingResponse;
  session_touch: SessionTouchResponse;
  sms_set_gateway_status: SmsSetGatewayStatusResponse;
  tag_get_tags: TagGetTagsResponse;
  tag_update_tags: TagUpdateTagsResponse;
  update_inplace_editable: UpdateInplaceEditableResponse;
  user_get_users: UserGetUsersResponse;
  user_search_identity: UserSearchIdentityResponse;
  customfield_number_recalculate_value: CustomfieldNumberRecalculateValueResponse;
  enrol_meta_add_instances: EnrolMetaAddInstancesResponse;
  enrol_meta_delete_instances: EnrolMetaDeleteInstancesResponse;
  gradingform_guide_grader_gradingpanel_fetch: GradingformGuideGraderGradingpanelFetchResponse;
  gradingform_guide_grader_gradingpanel_store: GradingformGuideGraderGradingpanelStoreResponse;
  gradingform_rubric_grader_gradingpanel_fetch: GradingformRubricGraderGradingpanelFetchResponse;
  gradingform_rubric_grader_gradingpanel_store: GradingformRubricGraderGradingpanelStoreResponse;
  media_videojs_get_language: MediaVideojsGetLanguageResponse;
  paygw_paypal_create_transaction_complete: PaygwPaypalCreateTransactionCompleteResponse;
  paygw_paypal_get_config_for_js: PaygwPaypalGetConfigForJsResponse;
  qbank_columnsortorder_set_column_size: QbankColumnsortorderSetColumnSizeResponse;
  qbank_columnsortorder_set_columnbank_order: QbankColumnsortorderSetColumnbankOrderResponse;
  qbank_columnsortorder_set_hidden_columns: QbankColumnsortorderSetHiddenColumnsResponse;
  qbank_editquestion_set_status: QbankEditquestionSetStatusResponse;
  qbank_managecategories_move_category: QbankManagecategoriesMoveCategoryResponse;
  qbank_tagquestion_submit_tags_form: QbankTagquestionSubmitTagsFormResponse;
  qbank_viewquestiontext_set_question_text_format: QbankViewquestiontextSetQuestionTextFormatResponse;
  quizaccess_seb_validate_quiz_keys: QuizaccessSebValidateQuizKeysResponse;
  report_competency_data_for_report: ReportCompetencyDataForReportResponse;
  tiny_autosave_reset_session: TinyAutosaveResetSessionResponse;
  tiny_autosave_resume_session: TinyAutosaveResumeSessionResponse;
  tiny_autosave_update_session: TinyAutosaveUpdateSessionResponse;
  tiny_equation_filter: TinyEquationFilterResponse;
  tiny_media_preview: TinyMediaPreviewResponse;
  admin_presets_delete_preset: AdminPresetsDeletePresetResponse;
  behat_get_entity_generator: BehatGetEntityGeneratorResponse;
  dataprivacy_approve_data_request: DataprivacyApproveDataRequestResponse;
  dataprivacy_bulk_approve_data_requests: DataprivacyBulkApproveDataRequestsResponse;
  dataprivacy_bulk_deny_data_requests: DataprivacyBulkDenyDataRequestsResponse;
  dataprivacy_confirm_contexts_for_deletion: DataprivacyConfirmContextsForDeletionResponse;
  dataprivacy_create_category_form: DataprivacyCreateCategoryFormResponse;
  dataprivacy_create_purpose_form: DataprivacyCreatePurposeFormResponse;
  dataprivacy_delete_category: DataprivacyDeleteCategoryResponse;
  dataprivacy_delete_purpose: DataprivacyDeletePurposeResponse;
  dataprivacy_deny_data_request: DataprivacyDenyDataRequestResponse;
  dataprivacy_get_activity_options: DataprivacyGetActivityOptionsResponse;
  dataprivacy_get_category_options: DataprivacyGetCategoryOptionsResponse;
  dataprivacy_get_data_request: DataprivacyGetDataRequestResponse;
  dataprivacy_get_purpose_options: DataprivacyGetPurposeOptionsResponse;
  dataprivacy_get_users: DataprivacyGetUsersResponse;
  dataprivacy_mark_complete: DataprivacyMarkCompleteResponse;
  dataprivacy_set_context_defaults: DataprivacySetContextDefaultsResponse;
  dataprivacy_set_context_form: DataprivacySetContextFormResponse;
  dataprivacy_set_contextlevel_form: DataprivacySetContextlevelFormResponse;
  dataprivacy_submit_selected_courses_form: DataprivacySubmitSelectedCoursesFormResponse;
  dataprivacy_tree_extra_branches: DataprivacyTreeExtraBranchesResponse;
  lp_data_for_competencies_manage_page: LpDataForCompetenciesManagePageResponse;
  lp_data_for_competency_frameworks_manage_page: LpDataForCompetencyFrameworksManagePageResponse;
  lp_data_for_competency_summary: LpDataForCompetencySummaryResponse;
  lp_data_for_related_competencies_section: LpDataForRelatedCompetenciesSectionResponse;
  lp_data_for_template_competencies_page: LpDataForTemplateCompetenciesPageResponse;
  lp_data_for_templates_manage_page: LpDataForTemplatesManagePageResponse;
  lp_list_courses_using_competency: LpListCoursesUsingCompetencyResponse;
  lp_search_cohorts: LpSearchCohortsResponse;
  lp_search_users: LpSearchUsersResponse;
  policy_submit_accept_on_behalf: PolicySubmitAcceptOnBehalfResponse;
  templatelibrary_list_templates: TemplatelibraryListTemplatesResponse;
  templatelibrary_load_canonical_template: TemplatelibraryLoadCanonicalTemplateResponse;
  usertours_complete_tour: UsertoursCompleteTourResponse;
  usertours_fetch_and_start_tour: UsertoursFetchAndStartTourResponse;
  usertours_reset_tour: UsertoursResetTourResponse;
  usertours_step_shown: UsertoursStepShownResponse;
  xmldb_invoke_move_action: XmldbInvokeMoveActionResponse;
  grades_get_enrolled_users_for_search_widget: GradesGetEnrolledUsersForSearchWidgetResponse;
  grades_get_groups_for_search_widget: GradesGetGroupsForSearchWidgetResponse;
  output_load_fontawesome_icon_map: OutputLoadFontawesomeIconMapResponse;
  mod_assign_delete_overrides: ModAssignDeleteOverridesResponse;
  mod_assign_get_overrides: ModAssignGetOverridesResponse;
  mod_assign_save_overrides: ModAssignSaveOverridesResponse;
  mod_chat_get_chat_latest_messages: ModChatGetChatLatestMessagesResponse;
  mod_chat_get_chat_users: ModChatGetChatUsersResponse;
  mod_chat_get_chats_by_courses: ModChatGetChatsByCoursesResponse;
  mod_chat_get_session_messages: ModChatGetSessionMessagesResponse;
  mod_chat_get_sessions: ModChatGetSessionsResponse;
  mod_chat_login_user: ModChatLoginUserResponse;
  mod_chat_send_chat_message: ModChatSendChatMessageResponse;
  mod_chat_view_chat: ModChatViewChatResponse;
  mod_chat_view_sessions: ModChatViewSessionsResponse;
  mod_forum_set_read_state: ModForumSetReadStateResponse;
  mod_quiz_get_users_in_report: ModQuizGetUsersInReportResponse;
  mod_survey_get_questions: ModSurveyGetQuestionsResponse;
  mod_survey_get_surveys_by_courses: ModSurveyGetSurveysByCoursesResponse;
  mod_survey_submit_answers: ModSurveySubmitAnswersResponse;
  mod_survey_view_survey: ModSurveyViewSurveyResponse;
  report_insights_set_fixed_prediction: ReportInsightsSetFixedPredictionResponse;
  report_insights_set_notuseful_prediction: ReportInsightsSetNotusefulPredictionResponse;
}

export interface TypedMoodleClient {
  operationNames(): MoodleOperationName[];
  callOperation<TName extends MoodleOperationName>(
    operationName: TName,
    parameters: MoodleOperationParameters[TName]
  ): Promise<MoodleOperationResponses[TName]>;
  get_site_info(parameters?: GetSiteInfoParameters): Promise<GetSiteInfoResponse>;
  get_courses(parameters: GetCoursesParameters): Promise<GetCoursesResponse>;
  get_course(parameters: GetCourseParameters): Promise<GetCourseResponse>;
  create_course(parameters: CreateCourseParameters): Promise<CreateCourseResponse>;
  update_course(parameters: UpdateCourseParameters): Promise<UpdateCourseResponse>;
  delete_course(parameters: DeleteCourseParameters): Promise<DeleteCourseResponse>;
  get_course_contents(parameters: GetCourseContentsParameters): Promise<GetCourseContentsResponse>;
  get_users_by_field(parameters: GetUsersByFieldParameters): Promise<GetUsersByFieldResponse>;
  create_user(parameters: CreateUserParameters): Promise<CreateUserResponse>;
  update_user(parameters: UpdateUserParameters): Promise<UpdateUserResponse>;
  delete_user(parameters: DeleteUserParameters): Promise<DeleteUserResponse>;
  enrol_user(parameters: EnrolUserParameters): Promise<EnrolUserResponse>;
  unenrol_user(parameters: UnenrolUserParameters): Promise<UnenrolUserResponse>;
  get_course_groups(parameters: GetCourseGroupsParameters): Promise<GetCourseGroupsResponse>;
  create_group(parameters: CreateGroupParameters): Promise<CreateGroupResponse>;
  delete_group(parameters: DeleteGroupParameters): Promise<DeleteGroupResponse>;
  add_group_member(parameters: AddGroupMemberParameters): Promise<AddGroupMemberResponse>;
  remove_group_member(parameters: RemoveGroupMemberParameters): Promise<RemoveGroupMemberResponse>;
  get_course_categories(parameters: GetCourseCategoriesParameters): Promise<GetCourseCategoriesResponse>;
  get_course_category(parameters: GetCourseCategoryParameters): Promise<GetCourseCategoryResponse>;
  get_enrolled_users(parameters: GetEnrolledUsersParameters): Promise<GetEnrolledUsersResponse>;
  get_cohorts(parameters: GetCohortsParameters): Promise<GetCohortsResponse>;
  get_group_members(parameters: GetGroupMembersParameters): Promise<GetGroupMembersResponse>;
  get_course_groupings(parameters: GetCourseGroupingsParameters): Promise<GetCourseGroupingsResponse>;
  get_activity_completion_statuses(parameters: GetActivityCompletionStatusesParameters): Promise<GetActivityCompletionStatusesResponse>;
  get_course_completion_status(parameters: GetCourseCompletionStatusParameters): Promise<GetCourseCompletionStatusResponse>;
  get_calendar_events(parameters: GetCalendarEventsParameters): Promise<GetCalendarEventsResponse>;
  get_grade_items(parameters: GetGradeItemsParameters): Promise<GetGradeItemsResponse>;
  create_course_category(parameters: CreateCourseCategoryParameters): Promise<CreateCourseCategoryResponse>;
  update_course_category(parameters: UpdateCourseCategoryParameters): Promise<UpdateCourseCategoryResponse>;
  delete_course_category(parameters: DeleteCourseCategoryParameters): Promise<DeleteCourseCategoryResponse>;
  get_group(parameters: GetGroupParameters): Promise<GetGroupResponse>;
  update_group(parameters: UpdateGroupParameters): Promise<UpdateGroupResponse>;
  create_grouping(parameters: CreateGroupingParameters): Promise<CreateGroupingResponse>;
  get_grouping(parameters: GetGroupingParameters): Promise<GetGroupingResponse>;
  update_grouping(parameters: UpdateGroupingParameters): Promise<UpdateGroupingResponse>;
  delete_grouping(parameters: DeleteGroupingParameters): Promise<DeleteGroupingResponse>;
  add_group_to_grouping(parameters: AddGroupToGroupingParameters): Promise<AddGroupToGroupingResponse>;
  remove_group_from_grouping(parameters: RemoveGroupFromGroupingParameters): Promise<RemoveGroupFromGroupingResponse>;
  create_cohort(parameters: CreateCohortParameters): Promise<CreateCohortResponse>;
  update_cohort(parameters: UpdateCohortParameters): Promise<UpdateCohortResponse>;
  delete_cohort(parameters: DeleteCohortParameters): Promise<DeleteCohortResponse>;
  get_cohort_members(parameters: GetCohortMembersParameters): Promise<GetCohortMembersResponse>;
  search_cohorts(parameters: SearchCohortsParameters): Promise<SearchCohortsResponse>;
  add_cohort_member(parameters: AddCohortMemberParameters): Promise<AddCohortMemberResponse>;
  remove_cohort_member(parameters: RemoveCohortMemberParameters): Promise<RemoveCohortMemberResponse>;
  assign_role(parameters: AssignRoleParameters): Promise<AssignRoleResponse>;
  unassign_role(parameters: UnassignRoleParameters): Promise<UnassignRoleResponse>;
  get_user_courses(parameters: GetUserCoursesParameters): Promise<GetUserCoursesResponse>;
  get_course_enrolment_methods(parameters: GetCourseEnrolmentMethodsParameters): Promise<GetCourseEnrolmentMethodsResponse>;
  get_enrolled_users_with_capability(parameters: GetEnrolledUsersWithCapabilityParameters): Promise<GetEnrolledUsersWithCapabilityResponse>;
  search_enrolled_users(parameters: SearchEnrolledUsersParameters): Promise<SearchEnrolledUsersResponse>;
  get_potential_enrolment_users(parameters: GetPotentialEnrolmentUsersParameters): Promise<GetPotentialEnrolmentUsersResponse>;
  get_self_enrolment_info(parameters: GetSelfEnrolmentInfoParameters): Promise<GetSelfEnrolmentInfoResponse>;
  self_enrol(parameters: SelfEnrolParameters): Promise<SelfEnrolResponse>;
  update_user_enrolment(parameters: UpdateUserEnrolmentParameters): Promise<UpdateUserEnrolmentResponse>;
  delete_user_enrolment(parameters: DeleteUserEnrolmentParameters): Promise<DeleteUserEnrolmentResponse>;
  get_grades_table(parameters: GetGradesTableParameters): Promise<GetGradesTableResponse>;
  get_user_course_grades(parameters: GetUserCourseGradesParameters): Promise<GetUserCourseGradesResponse>;
  get_grade_access_information(parameters: GetGradeAccessInformationParameters): Promise<GetGradeAccessInformationResponse>;
  get_gradebook_items(parameters: GetGradebookItemsParameters): Promise<GetGradebookItemsResponse>;
  get_grade_tree(parameters: GetGradeTreeParameters): Promise<GetGradeTreeResponse>;
  get_gradable_users(parameters: GetGradableUsersParameters): Promise<GetGradableUsersResponse>;
  get_grade_feedback(parameters: GetGradeFeedbackParameters): Promise<GetGradeFeedbackResponse>;
  create_grade_category(parameters: CreateGradeCategoryParameters): Promise<CreateGradeCategoryResponse>;
  update_grade_value(parameters: UpdateGradeValueParameters): Promise<UpdateGradeValueResponse>;
  set_activity_completion_status(parameters: SetActivityCompletionStatusParameters): Promise<SetActivityCompletionStatusResponse>;
  override_activity_completion_status(parameters: OverrideActivityCompletionStatusParameters): Promise<OverrideActivityCompletionStatusResponse>;
  mark_course_self_completed(parameters: MarkCourseSelfCompletedParameters): Promise<MarkCourseSelfCompletedResponse>;
  upload_draft_file(parameters: UploadDraftFileParameters): Promise<UploadDraftFileResponse>;
  download_file(parameters: DownloadFileParameters): Promise<DownloadFileResponse>;
  get_course_assignments(parameters: GetCourseAssignmentsParameters): Promise<GetCourseAssignmentsResponse>;
  get_assignment_submissions(parameters: GetAssignmentSubmissionsParameters): Promise<GetAssignmentSubmissionsResponse>;
  get_assignment_grades(parameters: GetAssignmentGradesParameters): Promise<GetAssignmentGradesResponse>;
  get_assignment_submission_status(parameters: GetAssignmentSubmissionStatusParameters): Promise<GetAssignmentSubmissionStatusResponse>;
  get_assignment_participants(parameters: GetAssignmentParticipantsParameters): Promise<GetAssignmentParticipantsResponse>;
  get_assignment_participant(parameters: GetAssignmentParticipantParameters): Promise<GetAssignmentParticipantResponse>;
  start_assignment_submission(parameters: StartAssignmentSubmissionParameters): Promise<StartAssignmentSubmissionResponse>;
  save_assignment_submission(parameters: SaveAssignmentSubmissionParameters): Promise<SaveAssignmentSubmissionResponse>;
  submit_assignment_for_grading(parameters: SubmitAssignmentForGradingParameters): Promise<SubmitAssignmentForGradingResponse>;
  save_assignment_grade(parameters: SaveAssignmentGradeParameters): Promise<SaveAssignmentGradeResponse>;
  set_assignment_user_flags(parameters: SetAssignmentUserFlagsParameters): Promise<SetAssignmentUserFlagsResponse>;
  get_assignment_user_flags(parameters: GetAssignmentUserFlagsParameters): Promise<GetAssignmentUserFlagsResponse>;
  get_assignment_user_mappings(parameters: GetAssignmentUserMappingsParameters): Promise<GetAssignmentUserMappingsResponse>;
  lock_assignment_submissions(parameters: LockAssignmentSubmissionsParameters): Promise<LockAssignmentSubmissionsResponse>;
  unlock_assignment_submissions(parameters: UnlockAssignmentSubmissionsParameters): Promise<UnlockAssignmentSubmissionsResponse>;
  revert_assignment_submissions_to_draft(parameters: RevertAssignmentSubmissionsToDraftParameters): Promise<RevertAssignmentSubmissionsToDraftResponse>;
  set_assignment_extension(parameters: SetAssignmentExtensionParameters): Promise<SetAssignmentExtensionResponse>;
  reveal_assignment_identities(parameters: RevealAssignmentIdentitiesParameters): Promise<RevealAssignmentIdentitiesResponse>;
  copy_previous_assignment_attempt(parameters: CopyPreviousAssignmentAttemptParameters): Promise<CopyPreviousAssignmentAttemptResponse>;
  remove_assignment_submission(parameters: RemoveAssignmentSubmissionParameters): Promise<RemoveAssignmentSubmissionResponse>;
  view_assignment(parameters: ViewAssignmentParameters): Promise<ViewAssignmentResponse>;
  view_assignment_submission_status(parameters: ViewAssignmentSubmissionStatusParameters): Promise<ViewAssignmentSubmissionStatusResponse>;
  view_assignment_grading_table(parameters: ViewAssignmentGradingTableParameters): Promise<ViewAssignmentGradingTableResponse>;
  get_course_forums(parameters: GetCourseForumsParameters): Promise<GetCourseForumsResponse>;
  get_forum_discussions(parameters: GetForumDiscussionsParameters): Promise<GetForumDiscussionsResponse>;
  get_forum_discussion_posts(parameters: GetForumDiscussionPostsParameters): Promise<GetForumDiscussionPostsResponse>;
  get_forum_post(parameters: GetForumPostParameters): Promise<GetForumPostResponse>;
  get_forum_posts_by_user(parameters: GetForumPostsByUserParameters): Promise<GetForumPostsByUserResponse>;
  get_forum_access_information(parameters: GetForumAccessInformationParameters): Promise<GetForumAccessInformationResponse>;
  can_add_forum_discussion(parameters: CanAddForumDiscussionParameters): Promise<CanAddForumDiscussionResponse>;
  create_forum_discussion(parameters: CreateForumDiscussionParameters): Promise<CreateForumDiscussionResponse>;
  reply_to_forum_post(parameters: ReplyToForumPostParameters): Promise<ReplyToForumPostResponse>;
  update_forum_post(parameters: UpdateForumPostParameters): Promise<UpdateForumPostResponse>;
  delete_forum_post(parameters: DeleteForumPostParameters): Promise<DeleteForumPostResponse>;
  prepare_forum_post_draft(parameters: PrepareForumPostDraftParameters): Promise<PrepareForumPostDraftResponse>;
  set_forum_subscription(parameters: SetForumSubscriptionParameters): Promise<SetForumSubscriptionResponse>;
  set_forum_tracking(parameters: SetForumTrackingParameters): Promise<SetForumTrackingResponse>;
  set_forum_discussion_subscription(parameters: SetForumDiscussionSubscriptionParameters): Promise<SetForumDiscussionSubscriptionResponse>;
  set_forum_discussion_favourite(parameters: SetForumDiscussionFavouriteParameters): Promise<SetForumDiscussionFavouriteResponse>;
  set_forum_discussion_pin(parameters: SetForumDiscussionPinParameters): Promise<SetForumDiscussionPinResponse>;
  set_forum_discussion_lock(parameters: SetForumDiscussionLockParameters): Promise<SetForumDiscussionLockResponse>;
  mark_forum_posts_read(parameters: MarkForumPostsReadParameters): Promise<MarkForumPostsReadResponse>;
  view_forum(parameters: ViewForumParameters): Promise<ViewForumResponse>;
  view_forum_discussion(parameters: ViewForumDiscussionParameters): Promise<ViewForumDiscussionResponse>;
  get_course_quizzes(parameters: GetCourseQuizzesParameters): Promise<GetCourseQuizzesResponse>;
  get_user_quiz_attempts(parameters: GetUserQuizAttemptsParameters): Promise<GetUserQuizAttemptsResponse>;
  get_user_quiz_best_grade(parameters: GetUserQuizBestGradeParameters): Promise<GetUserQuizBestGradeResponse>;
  get_quiz_review_options(parameters: GetQuizReviewOptionsParameters): Promise<GetQuizReviewOptionsResponse>;
  start_quiz_attempt(parameters: StartQuizAttemptParameters): Promise<StartQuizAttemptResponse>;
  get_quiz_attempt_data(parameters: GetQuizAttemptDataParameters): Promise<GetQuizAttemptDataResponse>;
  get_quiz_attempt_summary(parameters: GetQuizAttemptSummaryParameters): Promise<GetQuizAttemptSummaryResponse>;
  save_quiz_attempt(parameters: SaveQuizAttemptParameters): Promise<SaveQuizAttemptResponse>;
  process_quiz_attempt(parameters: ProcessQuizAttemptParameters): Promise<ProcessQuizAttemptResponse>;
  get_quiz_attempt_review(parameters: GetQuizAttemptReviewParameters): Promise<GetQuizAttemptReviewResponse>;
  get_quiz_feedback_for_grade(parameters: GetQuizFeedbackForGradeParameters): Promise<GetQuizFeedbackForGradeResponse>;
  get_quiz_access_information(parameters: GetQuizAccessInformationParameters): Promise<GetQuizAccessInformationResponse>;
  get_quiz_attempt_access_information(parameters: GetQuizAttemptAccessInformationParameters): Promise<GetQuizAttemptAccessInformationResponse>;
  get_quiz_required_question_types(parameters: GetQuizRequiredQuestionTypesParameters): Promise<GetQuizRequiredQuestionTypesResponse>;
  view_quiz(parameters: ViewQuizParameters): Promise<ViewQuizResponse>;
  view_quiz_attempt(parameters: ViewQuizAttemptParameters): Promise<ViewQuizAttemptResponse>;
  view_quiz_attempt_summary(parameters: ViewQuizAttemptSummaryParameters): Promise<ViewQuizAttemptSummaryResponse>;
  view_quiz_attempt_review(parameters: ViewQuizAttemptReviewParameters): Promise<ViewQuizAttemptReviewResponse>;
  get_course_books(parameters: GetCourseBooksParameters): Promise<GetCourseBooksResponse>;
  view_book(parameters: ViewBookParameters): Promise<ViewBookResponse>;
  get_course_folders(parameters: GetCourseFoldersParameters): Promise<GetCourseFoldersResponse>;
  view_folder(parameters: ViewFolderParameters): Promise<ViewFolderResponse>;
  get_course_imscp_packages(parameters: GetCourseImscpPackagesParameters): Promise<GetCourseImscpPackagesResponse>;
  view_imscp_package(parameters: ViewImscpPackageParameters): Promise<ViewImscpPackageResponse>;
  get_course_labels(parameters: GetCourseLabelsParameters): Promise<GetCourseLabelsResponse>;
  get_course_pages(parameters: GetCoursePagesParameters): Promise<GetCoursePagesResponse>;
  view_page(parameters: ViewPageParameters): Promise<ViewPageResponse>;
  get_course_resources(parameters: GetCourseResourcesParameters): Promise<GetCourseResourcesResponse>;
  view_resource(parameters: ViewResourceParameters): Promise<ViewResourceResponse>;
  get_course_urls(parameters: GetCourseUrlsParameters): Promise<GetCourseUrlsResponse>;
  view_url(parameters: ViewUrlParameters): Promise<ViewUrlResponse>;
  get_course_choices(parameters: GetCourseChoicesParameters): Promise<GetCourseChoicesResponse>;
  get_choice_options(parameters: GetChoiceOptionsParameters): Promise<GetChoiceOptionsResponse>;
  get_choice_results(parameters: GetChoiceResultsParameters): Promise<GetChoiceResultsResponse>;
  submit_choice_response(parameters: SubmitChoiceResponseParameters): Promise<SubmitChoiceResponseResponse>;
  delete_choice_responses(parameters: DeleteChoiceResponsesParameters): Promise<DeleteChoiceResponsesResponse>;
  view_choice(parameters: ViewChoiceParameters): Promise<ViewChoiceResponse>;
  get_course_scorm_packages(parameters: GetCourseScormPackagesParameters): Promise<GetCourseScormPackagesResponse>;
  get_scorm_attempt_count(parameters: GetScormAttemptCountParameters): Promise<GetScormAttemptCountResponse>;
  get_scorm_contents(parameters: GetScormContentsParameters): Promise<GetScormContentsResponse>;
  get_scorm_user_data(parameters: GetScormUserDataParameters): Promise<GetScormUserDataResponse>;
  save_scorm_tracks(parameters: SaveScormTracksParameters): Promise<SaveScormTracksResponse>;
  get_scorm_tracks(parameters: GetScormTracksParameters): Promise<GetScormTracksResponse>;
  launch_scorm_content(parameters: LaunchScormContentParameters): Promise<LaunchScormContentResponse>;
  get_scorm_access_information(parameters: GetScormAccessInformationParameters): Promise<GetScormAccessInformationResponse>;
  view_scorm(parameters: ViewScormParameters): Promise<ViewScormResponse>;
  get_course_wikis(parameters: GetCourseWikisParameters): Promise<GetCourseWikisResponse>;
  get_wiki_subwikis(parameters: GetWikiSubwikisParameters): Promise<GetWikiSubwikisResponse>;
  get_wiki_pages(parameters: GetWikiPagesParameters): Promise<GetWikiPagesResponse>;
  get_wiki_files(parameters: GetWikiFilesParameters): Promise<GetWikiFilesResponse>;
  get_wiki_page(parameters: GetWikiPageParameters): Promise<GetWikiPageResponse>;
  get_wiki_page_for_editing(parameters: GetWikiPageForEditingParameters): Promise<GetWikiPageForEditingResponse>;
  create_wiki_page(parameters: CreateWikiPageParameters): Promise<CreateWikiPageResponse>;
  update_wiki_page(parameters: UpdateWikiPageParameters): Promise<UpdateWikiPageResponse>;
  view_wiki(parameters: ViewWikiParameters): Promise<ViewWikiResponse>;
  view_wiki_page(parameters: ViewWikiPageParameters): Promise<ViewWikiPageResponse>;
  get_course_feedbacks(parameters: GetCourseFeedbacksParameters): Promise<GetCourseFeedbacksResponse>;
  get_feedback_access_information(parameters: GetFeedbackAccessInformationParameters): Promise<GetFeedbackAccessInformationResponse>;
  get_feedback_temporary_completion(parameters: GetFeedbackTemporaryCompletionParameters): Promise<GetFeedbackTemporaryCompletionResponse>;
  get_feedback_items(parameters: GetFeedbackItemsParameters): Promise<GetFeedbackItemsResponse>;
  launch_feedback(parameters: LaunchFeedbackParameters): Promise<LaunchFeedbackResponse>;
  get_feedback_page(parameters: GetFeedbackPageParameters): Promise<GetFeedbackPageResponse>;
  submit_feedback_page(parameters: SubmitFeedbackPageParameters): Promise<SubmitFeedbackPageResponse>;
  get_feedback_analysis(parameters: GetFeedbackAnalysisParameters): Promise<GetFeedbackAnalysisResponse>;
  get_unfinished_feedback_responses(parameters: GetUnfinishedFeedbackResponsesParameters): Promise<GetUnfinishedFeedbackResponsesResponse>;
  get_finished_feedback_responses(parameters: GetFinishedFeedbackResponsesParameters): Promise<GetFinishedFeedbackResponsesResponse>;
  get_feedback_non_respondents(parameters: GetFeedbackNonRespondentsParameters): Promise<GetFeedbackNonRespondentsResponse>;
  get_feedback_responses_analysis(parameters: GetFeedbackResponsesAnalysisParameters): Promise<GetFeedbackResponsesAnalysisResponse>;
  get_last_feedback_completion(parameters: GetLastFeedbackCompletionParameters): Promise<GetLastFeedbackCompletionResponse>;
  reorder_feedback_questions(parameters: ReorderFeedbackQuestionsParameters): Promise<ReorderFeedbackQuestionsResponse>;
  view_feedback(parameters: ViewFeedbackParameters): Promise<ViewFeedbackResponse>;
  get_course_h5p_activities(parameters: GetCourseH5pActivitiesParameters): Promise<GetCourseH5pActivitiesResponse>;
  get_h5p_access_information(parameters: GetH5pAccessInformationParameters): Promise<GetH5pAccessInformationResponse>;
  get_h5p_attempts(parameters: GetH5pAttemptsParameters): Promise<GetH5pAttemptsResponse>;
  get_h5p_results(parameters: GetH5pResultsParameters): Promise<GetH5pResultsResponse>;
  get_h5p_user_attempts(parameters: GetH5pUserAttemptsParameters): Promise<GetH5pUserAttemptsResponse>;
  log_h5p_report_view(parameters: LogH5pReportViewParameters): Promise<LogH5pReportViewResponse>;
  view_h5p_activity(parameters: ViewH5pActivityParameters): Promise<ViewH5pActivityResponse>;
  get_course_databases(parameters: GetCourseDatabasesParameters): Promise<GetCourseDatabasesResponse>;
  get_database_access_information(parameters: GetDatabaseAccessInformationParameters): Promise<GetDatabaseAccessInformationResponse>;
  get_database_entries(parameters: GetDatabaseEntriesParameters): Promise<GetDatabaseEntriesResponse>;
  get_database_entry(parameters: GetDatabaseEntryParameters): Promise<GetDatabaseEntryResponse>;
  get_database_fields(parameters: GetDatabaseFieldsParameters): Promise<GetDatabaseFieldsResponse>;
  search_database_entries(parameters: SearchDatabaseEntriesParameters): Promise<SearchDatabaseEntriesResponse>;
  approve_database_entry(parameters: ApproveDatabaseEntryParameters): Promise<ApproveDatabaseEntryResponse>;
  delete_database_entry(parameters: DeleteDatabaseEntryParameters): Promise<DeleteDatabaseEntryResponse>;
  create_database_entry(parameters: CreateDatabaseEntryParameters): Promise<CreateDatabaseEntryResponse>;
  update_database_entry(parameters: UpdateDatabaseEntryParameters): Promise<UpdateDatabaseEntryResponse>;
  delete_database_presets(parameters: DeleteDatabasePresetsParameters): Promise<DeleteDatabasePresetsResponse>;
  get_database_preset_mapping(parameters: GetDatabasePresetMappingParameters): Promise<GetDatabasePresetMappingResponse>;
  view_database(parameters: ViewDatabaseParameters): Promise<ViewDatabaseResponse>;
  get_course_glossaries(parameters: GetCourseGlossariesParameters): Promise<GetCourseGlossariesResponse>;
  get_glossary_entries_by_letter(parameters: GetGlossaryEntriesByLetterParameters): Promise<GetGlossaryEntriesByLetterResponse>;
  get_glossary_entries_by_date(parameters: GetGlossaryEntriesByDateParameters): Promise<GetGlossaryEntriesByDateResponse>;
  get_glossary_categories(parameters: GetGlossaryCategoriesParameters): Promise<GetGlossaryCategoriesResponse>;
  get_glossary_entries_by_category(parameters: GetGlossaryEntriesByCategoryParameters): Promise<GetGlossaryEntriesByCategoryResponse>;
  get_glossary_authors(parameters: GetGlossaryAuthorsParameters): Promise<GetGlossaryAuthorsResponse>;
  get_glossary_entries_by_author_letter(parameters: GetGlossaryEntriesByAuthorLetterParameters): Promise<GetGlossaryEntriesByAuthorLetterResponse>;
  get_glossary_entries_by_author(parameters: GetGlossaryEntriesByAuthorParameters): Promise<GetGlossaryEntriesByAuthorResponse>;
  search_glossary_entries(parameters: SearchGlossaryEntriesParameters): Promise<SearchGlossaryEntriesResponse>;
  get_glossary_entries_by_term(parameters: GetGlossaryEntriesByTermParameters): Promise<GetGlossaryEntriesByTermResponse>;
  get_glossary_entries_to_approve(parameters: GetGlossaryEntriesToApproveParameters): Promise<GetGlossaryEntriesToApproveResponse>;
  get_glossary_entry(parameters: GetGlossaryEntryParameters): Promise<GetGlossaryEntryResponse>;
  create_glossary_entry(parameters: CreateGlossaryEntryParameters): Promise<CreateGlossaryEntryResponse>;
  update_glossary_entry(parameters: UpdateGlossaryEntryParameters): Promise<UpdateGlossaryEntryResponse>;
  delete_glossary_entry(parameters: DeleteGlossaryEntryParameters): Promise<DeleteGlossaryEntryResponse>;
  prepare_glossary_entry(parameters: PrepareGlossaryEntryParameters): Promise<PrepareGlossaryEntryResponse>;
  view_glossary(parameters: ViewGlossaryParameters): Promise<ViewGlossaryResponse>;
  view_glossary_entry(parameters: ViewGlossaryEntryParameters): Promise<ViewGlossaryEntryResponse>;
  get_course_bigbluebutton_activities(parameters: GetCourseBigbluebuttonActivitiesParameters): Promise<GetCourseBigbluebuttonActivitiesResponse>;
  can_join_bigbluebutton(parameters: CanJoinBigbluebuttonParameters): Promise<CanJoinBigbluebuttonResponse>;
  get_bigbluebutton_join_url(parameters: GetBigbluebuttonJoinUrlParameters): Promise<GetBigbluebuttonJoinUrlResponse>;
  get_bigbluebutton_recordings(parameters: GetBigbluebuttonRecordingsParameters): Promise<GetBigbluebuttonRecordingsResponse>;
  get_bigbluebutton_recordings_to_import(parameters: GetBigbluebuttonRecordingsToImportParameters): Promise<GetBigbluebuttonRecordingsToImportResponse>;
  update_bigbluebutton_recording(parameters: UpdateBigbluebuttonRecordingParameters): Promise<UpdateBigbluebuttonRecordingResponse>;
  end_bigbluebutton_meeting(parameters: EndBigbluebuttonMeetingParameters): Promise<EndBigbluebuttonMeetingResponse>;
  validate_bigbluebutton_completion(parameters: ValidateBigbluebuttonCompletionParameters): Promise<ValidateBigbluebuttonCompletionResponse>;
  get_bigbluebutton_meeting_information(parameters: GetBigbluebuttonMeetingInformationParameters): Promise<GetBigbluebuttonMeetingInformationResponse>;
  view_bigbluebutton(parameters: ViewBigbluebuttonParameters): Promise<ViewBigbluebuttonResponse>;
  get_course_lessons(parameters: GetCourseLessonsParameters): Promise<GetCourseLessonsResponse>;
  get_lesson(parameters: GetLessonParameters): Promise<GetLessonResponse>;
  get_lesson_access_information(parameters: GetLessonAccessInformationParameters): Promise<GetLessonAccessInformationResponse>;
  get_lesson_question_attempts(parameters: GetLessonQuestionAttemptsParameters): Promise<GetLessonQuestionAttemptsResponse>;
  get_lesson_user_grade(parameters: GetLessonUserGradeParameters): Promise<GetLessonUserGradeResponse>;
  get_lesson_attempt_grade(parameters: GetLessonAttemptGradeParameters): Promise<GetLessonAttemptGradeResponse>;
  get_lesson_content_pages_viewed(parameters: GetLessonContentPagesViewedParameters): Promise<GetLessonContentPagesViewedResponse>;
  get_lesson_user_timers(parameters: GetLessonUserTimersParameters): Promise<GetLessonUserTimersResponse>;
  get_lesson_pages(parameters: GetLessonPagesParameters): Promise<GetLessonPagesResponse>;
  launch_lesson_attempt(parameters: LaunchLessonAttemptParameters): Promise<LaunchLessonAttemptResponse>;
  get_lesson_page(parameters: GetLessonPageParameters): Promise<GetLessonPageResponse>;
  submit_lesson_page(parameters: SubmitLessonPageParameters): Promise<SubmitLessonPageResponse>;
  finish_lesson_attempt(parameters: FinishLessonAttemptParameters): Promise<FinishLessonAttemptResponse>;
  get_lesson_attempts_overview(parameters: GetLessonAttemptsOverviewParameters): Promise<GetLessonAttemptsOverviewResponse>;
  get_lesson_user_attempt(parameters: GetLessonUserAttemptParameters): Promise<GetLessonUserAttemptResponse>;
  get_lesson_possible_jumps(parameters: GetLessonPossibleJumpsParameters): Promise<GetLessonPossibleJumpsResponse>;
  view_lesson(parameters: ViewLessonParameters): Promise<ViewLessonResponse>;
  get_course_lti_tools(parameters: GetCourseLtiToolsParameters): Promise<GetCourseLtiToolsResponse>;
  get_lti_launch_data(parameters: GetLtiLaunchDataParameters): Promise<GetLtiLaunchDataResponse>;
  get_lti_tool_proxies(parameters: GetLtiToolProxiesParameters): Promise<GetLtiToolProxiesResponse>;
  create_lti_tool_proxy(parameters: CreateLtiToolProxyParameters): Promise<CreateLtiToolProxyResponse>;
  delete_lti_tool_proxy(parameters: DeleteLtiToolProxyParameters): Promise<DeleteLtiToolProxyResponse>;
  get_lti_proxy_registration_request(parameters: GetLtiProxyRegistrationRequestParameters): Promise<GetLtiProxyRegistrationRequestResponse>;
  get_lti_tool_types(parameters: GetLtiToolTypesParameters): Promise<GetLtiToolTypesResponse>;
  get_lti_tool_types_and_proxies(parameters: GetLtiToolTypesAndProxiesParameters): Promise<GetLtiToolTypesAndProxiesResponse>;
  count_lti_tool_types_and_proxies(parameters: CountLtiToolTypesAndProxiesParameters): Promise<CountLtiToolTypesAndProxiesResponse>;
  create_lti_tool_type(parameters: CreateLtiToolTypeParameters): Promise<CreateLtiToolTypeResponse>;
  update_lti_tool_type(parameters: UpdateLtiToolTypeParameters): Promise<UpdateLtiToolTypeResponse>;
  delete_lti_tool_type(parameters: DeleteLtiToolTypeParameters): Promise<DeleteLtiToolTypeResponse>;
  delete_course_lti_tool_type(parameters: DeleteCourseLtiToolTypeParameters): Promise<DeleteCourseLtiToolTypeResponse>;
  set_lti_tool_activity_chooser_visibility(parameters: SetLtiToolActivityChooserVisibilityParameters): Promise<SetLtiToolActivityChooserVisibilityResponse>;
  is_lti_cartridge(parameters: IsLtiCartridgeParameters): Promise<IsLtiCartridgeResponse>;
  view_lti(parameters: ViewLtiParameters): Promise<ViewLtiResponse>;
  get_course_workshops(parameters: GetCourseWorkshopsParameters): Promise<GetCourseWorkshopsResponse>;
  get_workshop_access_information(parameters: GetWorkshopAccessInformationParameters): Promise<GetWorkshopAccessInformationResponse>;
  get_workshop_user_plan(parameters: GetWorkshopUserPlanParameters): Promise<GetWorkshopUserPlanResponse>;
  create_workshop_submission(parameters: CreateWorkshopSubmissionParameters): Promise<CreateWorkshopSubmissionResponse>;
  update_workshop_submission(parameters: UpdateWorkshopSubmissionParameters): Promise<UpdateWorkshopSubmissionResponse>;
  delete_workshop_submission(parameters: DeleteWorkshopSubmissionParameters): Promise<DeleteWorkshopSubmissionResponse>;
  get_workshop_submissions(parameters: GetWorkshopSubmissionsParameters): Promise<GetWorkshopSubmissionsResponse>;
  get_workshop_submission(parameters: GetWorkshopSubmissionParameters): Promise<GetWorkshopSubmissionResponse>;
  get_workshop_submission_assessments(parameters: GetWorkshopSubmissionAssessmentsParameters): Promise<GetWorkshopSubmissionAssessmentsResponse>;
  get_workshop_assessment(parameters: GetWorkshopAssessmentParameters): Promise<GetWorkshopAssessmentResponse>;
  get_workshop_assessment_form(parameters: GetWorkshopAssessmentFormParameters): Promise<GetWorkshopAssessmentFormResponse>;
  get_workshop_reviewer_assessments(parameters: GetWorkshopReviewerAssessmentsParameters): Promise<GetWorkshopReviewerAssessmentsResponse>;
  update_workshop_assessment(parameters: UpdateWorkshopAssessmentParameters): Promise<UpdateWorkshopAssessmentResponse>;
  get_workshop_grades(parameters: GetWorkshopGradesParameters): Promise<GetWorkshopGradesResponse>;
  evaluate_workshop_assessment(parameters: EvaluateWorkshopAssessmentParameters): Promise<EvaluateWorkshopAssessmentResponse>;
  get_workshop_grades_report(parameters: GetWorkshopGradesReportParameters): Promise<GetWorkshopGradesReportResponse>;
  evaluate_workshop_submission(parameters: EvaluateWorkshopSubmissionParameters): Promise<EvaluateWorkshopSubmissionResponse>;
  view_workshop(parameters: ViewWorkshopParameters): Promise<ViewWorkshopResponse>;
  view_workshop_submission(parameters: ViewWorkshopSubmissionParameters): Promise<ViewWorkshopSubmissionResponse>;
  save_assignment_grades(parameters: SaveAssignmentGradesParameters): Promise<SaveAssignmentGradesResponse>;
  submit_assignment_grading_form(parameters: SubmitAssignmentGradingFormParameters): Promise<SubmitAssignmentGradingFormResponse>;
  get_user_quiz_attempts_legacy(parameters: GetUserQuizAttemptsLegacyParameters): Promise<GetUserQuizAttemptsLegacyResponse>;
  set_quiz_question_version(parameters: SetQuizQuestionVersionParameters): Promise<SetQuizQuestionVersionResponse>;
  reopen_quiz_attempt(parameters: ReopenQuizAttemptParameters): Promise<ReopenQuizAttemptResponse>;
  get_reopen_quiz_attempt_confirmation(parameters: GetReopenQuizAttemptConfirmationParameters): Promise<GetReopenQuizAttemptConfirmationResponse>;
  add_quiz_random_questions(parameters: AddQuizRandomQuestionsParameters): Promise<AddQuizRandomQuestionsResponse>;
  update_quiz_random_question_filter(parameters: UpdateQuizRandomQuestionFilterParameters): Promise<UpdateQuizRandomQuestionFilterResponse>;
  save_quiz_overrides(parameters: SaveQuizOverridesParameters): Promise<SaveQuizOverridesResponse>;
  delete_quiz_overrides(parameters: DeleteQuizOverridesParameters): Promise<DeleteQuizOverridesResponse>;
  get_quiz_overrides(parameters: GetQuizOverridesParameters): Promise<GetQuizOverridesResponse>;
  create_quiz_grade_items(parameters: CreateQuizGradeItemsParameters): Promise<CreateQuizGradeItemsResponse>;
  delete_quiz_grade_items(parameters: DeleteQuizGradeItemsParameters): Promise<DeleteQuizGradeItemsResponse>;
  update_quiz_grade_items(parameters: UpdateQuizGradeItemsParameters): Promise<UpdateQuizGradeItemsResponse>;
  update_quiz_slots(parameters: UpdateQuizSlotsParameters): Promise<UpdateQuizSlotsResponse>;
  get_quiz_grading_setup(parameters: GetQuizGradingSetupParameters): Promise<GetQuizGradingSetupResponse>;
  create_quiz_grade_item_per_section(parameters: CreateQuizGradeItemPerSectionParameters): Promise<CreateQuizGradeItemPerSectionResponse>;
  get_calendar_month(parameters: GetCalendarMonthParameters): Promise<GetCalendarMonthResponse>;
  get_calendar_day(parameters: GetCalendarDayParameters): Promise<GetCalendarDayResponse>;
  get_calendar_upcoming(parameters: GetCalendarUpcomingParameters): Promise<GetCalendarUpcomingResponse>;
  move_calendar_event(parameters: MoveCalendarEventParameters): Promise<MoveCalendarEventResponse>;
  create_calendar_events(parameters: CreateCalendarEventsParameters): Promise<CreateCalendarEventsResponse>;
  delete_calendar_events(parameters: DeleteCalendarEventsParameters): Promise<DeleteCalendarEventsResponse>;
  get_action_events_by_time(parameters: GetActionEventsByTimeParameters): Promise<GetActionEventsByTimeResponse>;
  get_course_action_events(parameters: GetCourseActionEventsParameters): Promise<GetCourseActionEventsResponse>;
  get_courses_action_events(parameters: GetCoursesActionEventsParameters): Promise<GetCoursesActionEventsResponse>;
  get_calendar_event(parameters: GetCalendarEventParameters): Promise<GetCalendarEventResponse>;
  submit_calendar_event_form(parameters: SubmitCalendarEventFormParameters): Promise<SubmitCalendarEventFormResponse>;
  get_calendar_access_information(parameters: GetCalendarAccessInformationParameters): Promise<GetCalendarAccessInformationResponse>;
  get_allowed_calendar_event_types(parameters: GetAllowedCalendarEventTypesParameters): Promise<GetAllowedCalendarEventTypesResponse>;
  get_calendar_export_token(parameters?: GetCalendarExportTokenParameters): Promise<GetCalendarExportTokenResponse>;
  get_badge(parameters: GetBadgeParameters): Promise<GetBadgeResponse>;
  get_user_badges(parameters: GetUserBadgesParameters): Promise<GetUserBadgesResponse>;
  get_user_badge_by_hash(parameters: GetUserBadgeByHashParameters): Promise<GetUserBadgeByHashResponse>;
  get_blog_entries(parameters: GetBlogEntriesParameters): Promise<GetBlogEntriesResponse>;
  view_blog_entries(parameters: ViewBlogEntriesParameters): Promise<ViewBlogEntriesResponse>;
  get_blog_access_information(parameters?: GetBlogAccessInformationParameters): Promise<GetBlogAccessInformationResponse>;
  create_blog_entry(parameters: CreateBlogEntryParameters): Promise<CreateBlogEntryResponse>;
  update_blog_entry(parameters: UpdateBlogEntryParameters): Promise<UpdateBlogEntryResponse>;
  delete_blog_entry(parameters: DeleteBlogEntryParameters): Promise<DeleteBlogEntryResponse>;
  prepare_blog_entry(parameters: PrepareBlogEntryParameters): Promise<PrepareBlogEntryResponse>;
  get_comments(parameters: GetCommentsParameters): Promise<GetCommentsResponse>;
  create_comments(parameters: CreateCommentsParameters): Promise<CreateCommentsResponse>;
  delete_comments(parameters: DeleteCommentsParameters): Promise<DeleteCommentsResponse>;
  create_notes(parameters: CreateNotesParameters): Promise<CreateNotesResponse>;
  delete_notes(parameters: DeleteNotesParameters): Promise<DeleteNotesResponse>;
  get_course_notes(parameters: GetCourseNotesParameters): Promise<GetCourseNotesResponse>;
  view_notes(parameters: ViewNotesParameters): Promise<ViewNotesResponse>;
  get_item_ratings(parameters: GetItemRatingsParameters): Promise<GetItemRatingsResponse>;
  rate_item(parameters: RateItemParameters): Promise<RateItemResponse>;
  get_activity_allowed_groups(parameters: GetActivityAllowedGroupsParameters): Promise<GetActivityAllowedGroupsResponse>;
  get_activity_group_mode(parameters: GetActivityGroupModeParameters): Promise<GetActivityGroupModeResponse>;
  get_user_course_groups(parameters: GetUserCourseGroupsParameters): Promise<GetUserCourseGroupsResponse>;
  get_groups_for_selector(parameters: GetGroupsForSelectorParameters): Promise<GetGroupsForSelectorResponse>;
  get_recently_accessed_items(parameters: GetRecentlyAccessedItemsParameters): Promise<GetRecentlyAccessedItemsResponse>;
  get_starred_courses(parameters: GetStarredCoursesParameters): Promise<GetStarredCoursesResponse>;
  view_personal_page(parameters: ViewPersonalPageParameters): Promise<ViewPersonalPageResponse>;
  update_question_flag(parameters: UpdateQuestionFlagParameters): Promise<UpdateQuestionFlagResponse>;
  browse_files(parameters: BrowseFilesParameters): Promise<BrowseFilesResponse>;
  delete_draft_files(parameters: DeleteDraftFilesParameters): Promise<DeleteDraftFilesResponse>;
  get_unused_draft_area(parameters?: GetUnusedDraftAreaParameters): Promise<GetUnusedDraftAreaResponse>;
  get_user_preferences(parameters: GetUserPreferencesParameters): Promise<GetUserPreferencesResponse>;
  get_private_files_information(parameters: GetPrivateFilesInformationParameters): Promise<GetPrivateFilesInformationResponse>;
  view_course_user_list(parameters: ViewCourseUserListParameters): Promise<ViewCourseUserListResponse>;
  view_user_profile(parameters: ViewUserProfileParameters): Promise<ViewUserProfileResponse>;
  agree_site_policy(parameters?: AgreeSitePolicyParameters): Promise<AgreeSitePolicyResponse>;
  add_private_files(parameters: AddPrivateFilesParameters): Promise<AddPrivateFilesResponse>;
  update_user_picture(parameters: UpdateUserPictureParameters): Promise<UpdateUserPictureResponse>;
  remove_user_device(parameters: RemoveUserDeviceParameters): Promise<RemoveUserDeviceResponse>;
  search_site(parameters: SearchSiteParameters): Promise<SearchSiteResponse>;
  get_top_search_results(parameters: GetTopSearchResultsParameters): Promise<GetTopSearchResultsResponse>;
  get_search_areas(parameters: GetSearchAreasParameters): Promise<GetSearchAreasResponse>;
  view_search_results(parameters: ViewSearchResultsParameters): Promise<ViewSearchResultsResponse>;
  get_tag_areas(parameters?: GetTagAreasParameters): Promise<GetTagAreasResponse>;
  get_tag_collections(parameters?: GetTagCollectionsParameters): Promise<GetTagCollectionsResponse>;
  get_tag_cloud(parameters: GetTagCloudParameters): Promise<GetTagCloudResponse>;
  get_tag_index(parameters: GetTagIndexParameters): Promise<GetTagIndexResponse>;
  get_tag_index_by_area(parameters: GetTagIndexByAreaParameters): Promise<GetTagIndexByAreaResponse>;
  get_course_module(parameters: GetCourseModuleParameters): Promise<GetCourseModuleResponse>;
  get_course_module_by_instance(parameters: GetCourseModuleByInstanceParameters): Promise<GetCourseModuleByInstanceResponse>;
  view_course(parameters: ViewCourseParameters): Promise<ViewCourseResponse>;
  search_courses(parameters: SearchCoursesParameters): Promise<SearchCoursesResponse>;
  get_course_navigation_options(parameters: GetCourseNavigationOptionsParameters): Promise<GetCourseNavigationOptionsResponse>;
  get_course_administration_options(parameters: GetCourseAdministrationOptionsParameters): Promise<GetCourseAdministrationOptionsResponse>;
  get_course_updates(parameters: GetCourseUpdatesParameters): Promise<GetCourseUpdatesResponse>;
  get_timeline_courses(parameters: GetTimelineCoursesParameters): Promise<GetTimelineCoursesResponse>;
  set_favourite_courses(parameters: SetFavouriteCoursesParameters): Promise<SetFavouriteCoursesResponse>;
  get_recent_courses(parameters: GetRecentCoursesParameters): Promise<GetRecentCoursesResponse>;
  check_course_updates(parameters: CheckCourseUpdatesParameters): Promise<CheckCourseUpdatesResponse>;
  get_timeline_courses_with_events(parameters: GetTimelineCoursesWithEventsParameters): Promise<GetTimelineCoursesWithEventsResponse>;
  view_module_instance_list(parameters: ViewModuleInstanceListParameters): Promise<ViewModuleInstanceListResponse>;
  get_course_overview(parameters: GetCourseOverviewParameters): Promise<GetCourseOverviewResponse>;
  view_course_overview(parameters: ViewCourseOverviewParameters): Promise<ViewCourseOverviewResponse>;
  get_available_filters(parameters: GetAvailableFiltersParameters): Promise<GetAvailableFiltersResponse>;
  get_all_filter_states(parameters?: GetAllFilterStatesParameters): Promise<GetAllFilterStatesResponse>;
  get_component_strings(parameters: GetComponentStringsParameters): Promise<GetComponentStringsResponse>;
  get_fontawesome_icon_map(parameters?: GetFontawesomeIconMapParameters): Promise<GetFontawesomeIconMapResponse>;
  get_trusted_h5p_file(parameters: GetTrustedH5pFileParameters): Promise<GetTrustedH5pFileResponse>;
  is_push_notification_system_configured(parameters?: IsPushNotificationSystemConfiguredParameters): Promise<IsPushNotificationSystemConfiguredResponse>;
  get_push_preference_statuses(parameters: GetPushPreferenceStatusesParameters): Promise<GetPushPreferenceStatusesResponse>;
  get_user_push_devices(parameters: GetUserPushDevicesParameters): Promise<GetUserPushDevicesResponse>;
  set_push_device_enabled(parameters: SetPushDeviceEnabledParameters): Promise<SetPushDeviceEnabledResponse>;
  get_popup_notifications(parameters: GetPopupNotificationsParameters): Promise<GetPopupNotificationsResponse>;
  get_unread_popup_notification_count(parameters: GetUnreadPopupNotificationCountParameters): Promise<GetUnreadPopupNotificationCountResponse>;
  get_guest_enrolment_information(parameters: GetGuestEnrolmentInformationParameters): Promise<GetGuestEnrolmentInformationResponse>;
  validate_guest_enrolment_password(parameters: ValidateGuestEnrolmentPasswordParameters): Promise<ValidateGuestEnrolmentPasswordResponse>;
  register_user_device(parameters: RegisterUserDeviceParameters): Promise<RegisterUserDeviceResponse>;
  update_user_device_public_key(parameters: UpdateUserDevicePublicKeyParameters): Promise<UpdateUserDevicePublicKeyResponse>;
  get_course_user_profiles(parameters: GetCourseUserProfilesParameters): Promise<GetCourseUserProfilesResponse>;
  set_user_preferences(parameters: SetUserPreferencesParameters): Promise<SetUserPreferencesResponse>;
  update_user_preferences(parameters: UpdateUserPreferencesParameters): Promise<UpdateUserPreferencesResponse>;
  prepare_private_files(parameters?: PreparePrivateFilesParameters): Promise<PreparePrivateFilesResponse>;
  update_private_files(parameters: UpdatePrivateFilesParameters): Promise<UpdatePrivateFilesResponse>;
  get_xapi_state(parameters: GetXapiStateParameters): Promise<GetXapiStateResponse>;
  get_xapi_states(parameters: GetXapiStatesParameters): Promise<GetXapiStatesResponse>;
  save_xapi_state(parameters: SaveXapiStateParameters): Promise<SaveXapiStateResponse>;
  delete_xapi_state(parameters: DeleteXapiStateParameters): Promise<DeleteXapiStateResponse>;
  delete_xapi_states(parameters: DeleteXapiStatesParameters): Promise<DeleteXapiStatesResponse>;
  post_xapi_statements(parameters: PostXapiStatementsParameters): Promise<PostXapiStatementsResponse>;
  view_competency(parameters: ViewCompetencyParameters): Promise<ViewCompetencyResponse>;
  delete_competency_evidence(parameters: DeleteCompetencyEvidenceParameters): Promise<DeleteCompetencyEvidenceResponse>;
  get_competency_scale_values(parameters: GetCompetencyScaleValuesParameters): Promise<GetCompetencyScaleValuesResponse>;
  grade_course_competency(parameters: GradeCourseCompetencyParameters): Promise<GradeCourseCompetencyResponse>;
  get_course_competencies(parameters: GetCourseCompetenciesParameters): Promise<GetCourseCompetenciesResponse>;
  view_user_competency(parameters: ViewUserCompetencyParameters): Promise<ViewUserCompetencyResponse>;
  view_user_competency_in_course(parameters: ViewUserCompetencyInCourseParameters): Promise<ViewUserCompetencyInCourseResponse>;
  view_user_competency_in_plan(parameters: ViewUserCompetencyInPlanParameters): Promise<ViewUserCompetencyInPlanResponse>;
  view_user_competency_plan(parameters: ViewUserCompetencyPlanParameters): Promise<ViewUserCompetencyPlanResponse>;
  get_course_blocks(parameters: GetCourseBlocksParameters): Promise<GetCourseBlocksResponse>;
  get_dashboard_blocks(parameters: GetDashboardBlocksParameters): Promise<GetDashboardBlocksResponse>;
  get_addable_blocks(parameters: GetAddableBlocksParameters): Promise<GetAddableBlocksResponse>;
  get_grade_selector_users(parameters: GetGradeSelectorUsersParameters): Promise<GetGradeSelectorUsersResponse>;
  get_grade_selector_groups(parameters: GetGradeSelectorGroupsParameters): Promise<GetGradeSelectorGroupsResponse>;
  get_point_grading_panel(parameters: GetPointGradingPanelParameters): Promise<GetPointGradingPanelResponse>;
  save_point_grading_panel(parameters: SavePointGradingPanelParameters): Promise<SavePointGradingPanelResponse>;
  get_scale_grading_panel(parameters: GetScaleGradingPanelParameters): Promise<GetScaleGradingPanelResponse>;
  save_scale_grading_panel(parameters: SaveScaleGradingPanelParameters): Promise<SaveScaleGradingPanelResponse>;
  get_grader_report_users(parameters: GetGraderReportUsersParameters): Promise<GetGraderReportUsersResponse>;
  get_grade_items_for_selector(parameters: GetGradeItemsForSelectorParameters): Promise<GetGradeItemsForSelectorResponse>;
  view_grade_overview_report(parameters: ViewGradeOverviewReportParameters): Promise<ViewGradeOverviewReportResponse>;
  view_user_grade_report(parameters: ViewUserGradeReportParameters): Promise<ViewUserGradeReportResponse>;
  record_insight_action(parameters: RecordInsightActionParameters): Promise<RecordInsightActionResponse>;
  list_custom_reports(parameters: ListCustomReportsParameters): Promise<ListCustomReportsResponse>;
  get_custom_report(parameters: GetCustomReportParameters): Promise<GetCustomReportResponse>;
  view_custom_report(parameters: ViewCustomReportParameters): Promise<ViewCustomReportResponse>;
  can_view_system_report(parameters: CanViewSystemReportParameters): Promise<CanViewSystemReportResponse>;
  get_system_report(parameters: GetSystemReportParameters): Promise<GetSystemReportResponse>;
  get_dynamic_table(parameters: GetDynamicTableParameters): Promise<GetDynamicTableResponse>;
  get_tiny_editor_configuration(parameters: GetTinyEditorConfigurationParameters): Promise<GetTinyEditorConfigurationResponse>;
  get_tiny_premium_api_key(parameters: GetTinyPremiumApiKeyParameters): Promise<GetTinyPremiumApiKeyResponse>;
  get_data_privacy_access_information(parameters?: GetDataPrivacyAccessInformationParameters): Promise<GetDataPrivacyAccessInformationResponse>;
  create_data_request(parameters: CreateDataRequestParameters): Promise<CreateDataRequestResponse>;
  cancel_data_request(parameters: CancelDataRequestParameters): Promise<CancelDataRequestResponse>;
  contact_data_protection_officer(parameters: ContactDataProtectionOfficerParameters): Promise<ContactDataProtectionOfficerResponse>;
  get_data_requests(parameters: GetDataRequestsParameters): Promise<GetDataRequestsResponse>;
  get_policy_acceptances(parameters: GetPolicyAcceptancesParameters): Promise<GetPolicyAcceptancesResponse>;
  set_policy_acceptances(parameters: SetPolicyAcceptancesParameters): Promise<SetPolicyAcceptancesResponse>;
  get_course_competencies_page(parameters: GetCourseCompetenciesPageParameters): Promise<GetCourseCompetenciesPageResponse>;
  get_learning_plan_page(parameters: GetLearningPlanPageParameters): Promise<GetLearningPlanPageResponse>;
  get_user_learning_plans_page(parameters: GetUserLearningPlansPageParameters): Promise<GetUserLearningPlansPageResponse>;
  get_user_competency_summary(parameters: GetUserCompetencySummaryParameters): Promise<GetUserCompetencySummaryResponse>;
  get_course_user_competency_summary(parameters: GetCourseUserCompetencySummaryParameters): Promise<GetCourseUserCompetencySummaryResponse>;
  get_plan_user_competency_summary(parameters: GetPlanUserCompetencySummaryParameters): Promise<GetPlanUserCompetencySummaryResponse>;
  get_user_evidence_list_page(parameters: GetUserEvidenceListPageParameters): Promise<GetUserEvidenceListPageResponse>;
  get_user_evidence_page(parameters: GetUserEvidencePageParameters): Promise<GetUserEvidencePageResponse>;
  send_conversation_messages(parameters: SendConversationMessagesParameters): Promise<SendConversationMessagesResponse>;
  send_instant_messages(parameters: SendInstantMessagesParameters): Promise<SendInstantMessagesResponse>;
  delete_message_contacts(parameters: DeleteMessageContactsParameters): Promise<DeleteMessageContactsResponse>;
  mute_conversations(parameters: MuteConversationsParameters): Promise<MuteConversationsResponse>;
  unmute_conversations(parameters: UnmuteConversationsParameters): Promise<UnmuteConversationsResponse>;
  block_message_user(parameters: BlockMessageUserParameters): Promise<BlockMessageUserResponse>;
  unblock_message_user(parameters: UnblockMessageUserParameters): Promise<UnblockMessageUserResponse>;
  get_contact_requests(parameters: GetContactRequestsParameters): Promise<GetContactRequestsResponse>;
  get_received_contact_request_count(parameters: GetReceivedContactRequestCountParameters): Promise<GetReceivedContactRequestCountResponse>;
  get_conversation_members(parameters: GetConversationMembersParameters): Promise<GetConversationMembersResponse>;
  create_contact_request(parameters: CreateContactRequestParameters): Promise<CreateContactRequestResponse>;
  confirm_contact_request(parameters: ConfirmContactRequestParameters): Promise<ConfirmContactRequestResponse>;
  decline_contact_request(parameters: DeclineContactRequestParameters): Promise<DeclineContactRequestResponse>;
  search_message_users(parameters: SearchMessageUsersParameters): Promise<SearchMessageUsersResponse>;
  search_messages(parameters: SearchMessagesParameters): Promise<SearchMessagesResponse>;
  get_conversation_between_users(parameters: GetConversationBetweenUsersParameters): Promise<GetConversationBetweenUsersResponse>;
  get_self_conversation(parameters: GetSelfConversationParameters): Promise<GetSelfConversationResponse>;
  get_conversation_messages(parameters: GetConversationMessagesParameters): Promise<GetConversationMessagesResponse>;
  get_message_contacts(parameters: GetMessageContactsParameters): Promise<GetMessageContactsResponse>;
  search_message_contacts(parameters: SearchMessageContactsParameters): Promise<SearchMessageContactsResponse>;
  get_conversations(parameters: GetConversationsParameters): Promise<GetConversationsResponse>;
  get_conversation(parameters: GetConversationParameters): Promise<GetConversationResponse>;
  get_messages(parameters: GetMessagesParameters): Promise<GetMessagesResponse>;
  get_conversation_counts(parameters: GetConversationCountsParameters): Promise<GetConversationCountsResponse>;
  get_unread_conversation_counts(parameters: GetUnreadConversationCountsParameters): Promise<GetUnreadConversationCountsResponse>;
  get_unread_conversations_count(parameters: GetUnreadConversationsCountParameters): Promise<GetUnreadConversationsCountResponse>;
  get_unread_notification_count(parameters: GetUnreadNotificationCountParameters): Promise<GetUnreadNotificationCountResponse>;
  get_blocked_message_users(parameters: GetBlockedMessageUsersParameters): Promise<GetBlockedMessageUsersResponse>;
  get_message_member_info(parameters: GetMessageMemberInfoParameters): Promise<GetMessageMemberInfoResponse>;
  mark_message_read(parameters: MarkMessageReadParameters): Promise<MarkMessageReadResponse>;
  mark_notification_read(parameters: MarkNotificationReadParameters): Promise<MarkNotificationReadResponse>;
  mark_all_notifications_read(parameters: MarkAllNotificationsReadParameters): Promise<MarkAllNotificationsReadResponse>;
  mark_conversation_read(parameters: MarkConversationReadParameters): Promise<MarkConversationReadResponse>;
  delete_conversations(parameters: DeleteConversationsParameters): Promise<DeleteConversationsResponse>;
  delete_message(parameters: DeleteMessageParameters): Promise<DeleteMessageResponse>;
  delete_message_for_all_users(parameters: DeleteMessageForAllUsersParameters): Promise<DeleteMessageForAllUsersResponse>;
  configure_message_processor(parameters: ConfigureMessageProcessorParameters): Promise<ConfigureMessageProcessorResponse>;
  get_user_notification_preferences(parameters: GetUserNotificationPreferencesParameters): Promise<GetUserNotificationPreferencesResponse>;
  get_user_message_preferences(parameters: GetUserMessagePreferencesParameters): Promise<GetUserMessagePreferencesResponse>;
  set_favourite_conversations(parameters: SetFavouriteConversationsParameters): Promise<SetFavouriteConversationsResponse>;
  unset_favourite_conversations(parameters: UnsetFavouriteConversationsParameters): Promise<UnsetFavouriteConversationsResponse>;
  explain_text_with_ai(parameters: ExplainTextWithAiParameters): Promise<ExplainTextWithAiResponse>;
  summarise_text_with_ai(parameters: SummariseTextWithAiParameters): Promise<SummariseTextWithAiResponse>;
  generate_ai_image(parameters: GenerateAiImageParameters): Promise<GenerateAiImageResponse>;
  generate_ai_text(parameters: GenerateAiTextParameters): Promise<GenerateAiTextResponse>;
  get_ai_policy_status(parameters: GetAiPolicyStatusParameters): Promise<GetAiPolicyStatusResponse>;
  set_ai_policy_status(parameters: SetAiPolicyStatusParameters): Promise<SetAiPolicyStatusResponse>;
  get_analytics_contexts(parameters: GetAnalyticsContextsParameters): Promise<GetAnalyticsContextsResponse>;
  get_mobile_plugins(parameters?: GetMobilePluginsParameters): Promise<GetMobilePluginsResponse>;
  get_mobile_public_config(parameters?: GetMobilePublicConfigParameters): Promise<GetMobilePublicConfigResponse>;
  get_mobile_config(parameters: GetMobileConfigParameters): Promise<GetMobileConfigResponse>;
  get_mobile_autologin_key(parameters: GetMobileAutologinKeyParameters): Promise<GetMobileAutologinKeyResponse>;
  get_mobile_content(parameters: GetMobileContentParameters): Promise<GetMobileContentResponse>;
  call_mobile_external_functions(parameters: CallMobileExternalFunctionsParameters): Promise<CallMobileExternalFunctionsResponse>;
  get_mobile_qr_login_tokens(parameters: GetMobileQrLoginTokensParameters): Promise<GetMobileQrLoginTokensResponse>;
  validate_mobile_subscription_key(parameters: ValidateMobileSubscriptionKeyParameters): Promise<ValidateMobileSubscriptionKeyResponse>;
  get_policy_version(parameters: GetPolicyVersionParameters): Promise<GetPolicyVersionResponse>;
  search_moodlenet_courses(parameters: SearchMoodlenetCoursesParameters): Promise<SearchMoodlenetCoursesResponse>;
  verify_moodlenet_profile(parameters: VerifyMoodlenetProfileParameters): Promise<VerifyMoodlenetProfileResponse>;
  auth_email_get_signup_settings(parameters?: AuthEmailGetSignupSettingsParameters): Promise<AuthEmailGetSignupSettingsResponse>;
  auth_email_signup_user(parameters: AuthEmailSignupUserParameters): Promise<AuthEmailSignupUserResponse>;
  block_accessreview_get_module_data(parameters: BlockAccessreviewGetModuleDataParameters): Promise<BlockAccessreviewGetModuleDataResponse>;
  block_accessreview_get_section_data(parameters: BlockAccessreviewGetSectionDataParameters): Promise<BlockAccessreviewGetSectionDataResponse>;
  admin_set_block_protection(parameters: AdminSetBlockProtectionParameters): Promise<AdminSetBlockProtectionResponse>;
  admin_set_plugin_order(parameters: AdminSetPluginOrderParameters): Promise<AdminSetPluginOrderResponse>;
  admin_set_plugin_state(parameters: AdminSetPluginStateParameters): Promise<AdminSetPluginStateResponse>;
  ai_delete_provider_instance(parameters: AiDeleteProviderInstanceParameters): Promise<AiDeleteProviderInstanceResponse>;
  ai_set_action(parameters: AiSetActionParameters): Promise<AiSetActionResponse>;
  ai_set_provider_order(parameters: AiSetProviderOrderParameters): Promise<AiSetProviderOrderResponse>;
  ai_set_provider_status(parameters: AiSetProviderStatusParameters): Promise<AiSetProviderStatusResponse>;
  auth_confirm_user(parameters: AuthConfirmUserParameters): Promise<AuthConfirmUserResponse>;
  auth_is_age_digital_consent_verification_enabled(parameters?: AuthIsAgeDigitalConsentVerificationEnabledParameters): Promise<AuthIsAgeDigitalConsentVerificationEnabledResponse>;
  auth_is_minor(parameters: AuthIsMinorParameters): Promise<AuthIsMinorResponse>;
  auth_request_password_reset(parameters: AuthRequestPasswordResetParameters): Promise<AuthRequestPasswordResetResponse>;
  auth_resend_confirmation_email(parameters: AuthResendConfirmationEmailParameters): Promise<AuthResendConfirmationEmailResponse>;
  backup_get_async_backup_links_backup(parameters: BackupGetAsyncBackupLinksBackupParameters): Promise<BackupGetAsyncBackupLinksBackupResponse>;
  backup_get_async_backup_links_restore(parameters: BackupGetAsyncBackupLinksRestoreParameters): Promise<BackupGetAsyncBackupLinksRestoreResponse>;
  backup_get_async_backup_progress(parameters: BackupGetAsyncBackupProgressParameters): Promise<BackupGetAsyncBackupProgressResponse>;
  backup_get_copy_progress(parameters: BackupGetCopyProgressParameters): Promise<BackupGetCopyProgressResponse>;
  backup_submit_copy_form(parameters: BackupSubmitCopyFormParameters): Promise<BackupSubmitCopyFormResponse>;
  badges_disable_badges(parameters: BadgesDisableBadgesParameters): Promise<BadgesDisableBadgesResponse>;
  badges_enable_badges(parameters: BadgesEnableBadgesParameters): Promise<BadgesEnableBadgesResponse>;
  calendar_delete_subscription(parameters: CalendarDeleteSubscriptionParameters): Promise<CalendarDeleteSubscriptionResponse>;
  calendar_get_timestamps(parameters: CalendarGetTimestampsParameters): Promise<CalendarGetTimestampsResponse>;
  change_editmode(parameters: ChangeEditmodeParameters): Promise<ChangeEditmodeResponse>;
  check_get_result_admintree(parameters: CheckGetResultAdmintreeParameters): Promise<CheckGetResultAdmintreeResponse>;
  competency_add_competency_to_course(parameters: CompetencyAddCompetencyToCourseParameters): Promise<CompetencyAddCompetencyToCourseResponse>;
  competency_add_competency_to_plan(parameters: CompetencyAddCompetencyToPlanParameters): Promise<CompetencyAddCompetencyToPlanResponse>;
  competency_add_competency_to_template(parameters: CompetencyAddCompetencyToTemplateParameters): Promise<CompetencyAddCompetencyToTemplateResponse>;
  competency_add_related_competency(parameters: CompetencyAddRelatedCompetencyParameters): Promise<CompetencyAddRelatedCompetencyResponse>;
  competency_approve_plan(parameters: CompetencyApprovePlanParameters): Promise<CompetencyApprovePlanResponse>;
  competency_competency_framework_viewed(parameters: CompetencyCompetencyFrameworkViewedParameters): Promise<CompetencyCompetencyFrameworkViewedResponse>;
  competency_complete_plan(parameters: CompetencyCompletePlanParameters): Promise<CompetencyCompletePlanResponse>;
  competency_count_competencies(parameters: CompetencyCountCompetenciesParameters): Promise<CompetencyCountCompetenciesResponse>;
  competency_count_competencies_in_course(parameters: CompetencyCountCompetenciesInCourseParameters): Promise<CompetencyCountCompetenciesInCourseResponse>;
  competency_count_competencies_in_template(parameters: CompetencyCountCompetenciesInTemplateParameters): Promise<CompetencyCountCompetenciesInTemplateResponse>;
  competency_count_competency_frameworks(parameters: CompetencyCountCompetencyFrameworksParameters): Promise<CompetencyCountCompetencyFrameworksResponse>;
  competency_count_course_module_competencies(parameters: CompetencyCountCourseModuleCompetenciesParameters): Promise<CompetencyCountCourseModuleCompetenciesResponse>;
  competency_count_courses_using_competency(parameters: CompetencyCountCoursesUsingCompetencyParameters): Promise<CompetencyCountCoursesUsingCompetencyResponse>;
  competency_count_templates(parameters: CompetencyCountTemplatesParameters): Promise<CompetencyCountTemplatesResponse>;
  competency_count_templates_using_competency(parameters: CompetencyCountTemplatesUsingCompetencyParameters): Promise<CompetencyCountTemplatesUsingCompetencyResponse>;
  competency_create_competency(parameters: CompetencyCreateCompetencyParameters): Promise<CompetencyCreateCompetencyResponse>;
  competency_create_competency_framework(parameters: CompetencyCreateCompetencyFrameworkParameters): Promise<CompetencyCreateCompetencyFrameworkResponse>;
  competency_create_plan(parameters: CompetencyCreatePlanParameters): Promise<CompetencyCreatePlanResponse>;
  competency_create_template(parameters: CompetencyCreateTemplateParameters): Promise<CompetencyCreateTemplateResponse>;
  competency_create_user_evidence_competency(parameters: CompetencyCreateUserEvidenceCompetencyParameters): Promise<CompetencyCreateUserEvidenceCompetencyResponse>;
  competency_delete_competency(parameters: CompetencyDeleteCompetencyParameters): Promise<CompetencyDeleteCompetencyResponse>;
  competency_delete_competency_framework(parameters: CompetencyDeleteCompetencyFrameworkParameters): Promise<CompetencyDeleteCompetencyFrameworkResponse>;
  competency_delete_plan(parameters: CompetencyDeletePlanParameters): Promise<CompetencyDeletePlanResponse>;
  competency_delete_template(parameters: CompetencyDeleteTemplateParameters): Promise<CompetencyDeleteTemplateResponse>;
  competency_delete_user_evidence(parameters: CompetencyDeleteUserEvidenceParameters): Promise<CompetencyDeleteUserEvidenceResponse>;
  competency_delete_user_evidence_competency(parameters: CompetencyDeleteUserEvidenceCompetencyParameters): Promise<CompetencyDeleteUserEvidenceCompetencyResponse>;
  competency_duplicate_competency_framework(parameters: CompetencyDuplicateCompetencyFrameworkParameters): Promise<CompetencyDuplicateCompetencyFrameworkResponse>;
  competency_duplicate_template(parameters: CompetencyDuplicateTemplateParameters): Promise<CompetencyDuplicateTemplateResponse>;
  competency_grade_competency(parameters: CompetencyGradeCompetencyParameters): Promise<CompetencyGradeCompetencyResponse>;
  competency_grade_competency_in_plan(parameters: CompetencyGradeCompetencyInPlanParameters): Promise<CompetencyGradeCompetencyInPlanResponse>;
  competency_list_competencies(parameters: CompetencyListCompetenciesParameters): Promise<CompetencyListCompetenciesResponse>;
  competency_list_competencies_in_template(parameters: CompetencyListCompetenciesInTemplateParameters): Promise<CompetencyListCompetenciesInTemplateResponse>;
  competency_list_competency_frameworks(parameters: CompetencyListCompetencyFrameworksParameters): Promise<CompetencyListCompetencyFrameworksResponse>;
  competency_list_course_module_competencies(parameters: CompetencyListCourseModuleCompetenciesParameters): Promise<CompetencyListCourseModuleCompetenciesResponse>;
  competency_list_plan_competencies(parameters: CompetencyListPlanCompetenciesParameters): Promise<CompetencyListPlanCompetenciesResponse>;
  competency_list_templates(parameters: CompetencyListTemplatesParameters): Promise<CompetencyListTemplatesResponse>;
  competency_list_templates_using_competency(parameters: CompetencyListTemplatesUsingCompetencyParameters): Promise<CompetencyListTemplatesUsingCompetencyResponse>;
  competency_list_user_plans(parameters: CompetencyListUserPlansParameters): Promise<CompetencyListUserPlansResponse>;
  competency_move_down_competency(parameters: CompetencyMoveDownCompetencyParameters): Promise<CompetencyMoveDownCompetencyResponse>;
  competency_move_up_competency(parameters: CompetencyMoveUpCompetencyParameters): Promise<CompetencyMoveUpCompetencyResponse>;
  competency_plan_cancel_review_request(parameters: CompetencyPlanCancelReviewRequestParameters): Promise<CompetencyPlanCancelReviewRequestResponse>;
  competency_plan_request_review(parameters: CompetencyPlanRequestReviewParameters): Promise<CompetencyPlanRequestReviewResponse>;
  competency_plan_start_review(parameters: CompetencyPlanStartReviewParameters): Promise<CompetencyPlanStartReviewResponse>;
  competency_plan_stop_review(parameters: CompetencyPlanStopReviewParameters): Promise<CompetencyPlanStopReviewResponse>;
  competency_read_competency(parameters: CompetencyReadCompetencyParameters): Promise<CompetencyReadCompetencyResponse>;
  competency_read_competency_framework(parameters: CompetencyReadCompetencyFrameworkParameters): Promise<CompetencyReadCompetencyFrameworkResponse>;
  competency_read_plan(parameters: CompetencyReadPlanParameters): Promise<CompetencyReadPlanResponse>;
  competency_read_template(parameters: CompetencyReadTemplateParameters): Promise<CompetencyReadTemplateResponse>;
  competency_read_user_evidence(parameters: CompetencyReadUserEvidenceParameters): Promise<CompetencyReadUserEvidenceResponse>;
  competency_remove_competency_from_course(parameters: CompetencyRemoveCompetencyFromCourseParameters): Promise<CompetencyRemoveCompetencyFromCourseResponse>;
  competency_remove_competency_from_plan(parameters: CompetencyRemoveCompetencyFromPlanParameters): Promise<CompetencyRemoveCompetencyFromPlanResponse>;
  competency_remove_competency_from_template(parameters: CompetencyRemoveCompetencyFromTemplateParameters): Promise<CompetencyRemoveCompetencyFromTemplateResponse>;
  competency_remove_related_competency(parameters: CompetencyRemoveRelatedCompetencyParameters): Promise<CompetencyRemoveRelatedCompetencyResponse>;
  competency_reopen_plan(parameters: CompetencyReopenPlanParameters): Promise<CompetencyReopenPlanResponse>;
  competency_reorder_course_competency(parameters: CompetencyReorderCourseCompetencyParameters): Promise<CompetencyReorderCourseCompetencyResponse>;
  competency_reorder_plan_competency(parameters: CompetencyReorderPlanCompetencyParameters): Promise<CompetencyReorderPlanCompetencyResponse>;
  competency_reorder_template_competency(parameters: CompetencyReorderTemplateCompetencyParameters): Promise<CompetencyReorderTemplateCompetencyResponse>;
  competency_request_review_of_user_evidence_linked_competencies(parameters: CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesParameters): Promise<CompetencyRequestReviewOfUserEvidenceLinkedCompetenciesResponse>;
  competency_search_competencies(parameters: CompetencySearchCompetenciesParameters): Promise<CompetencySearchCompetenciesResponse>;
  competency_set_course_competency_ruleoutcome(parameters: CompetencySetCourseCompetencyRuleoutcomeParameters): Promise<CompetencySetCourseCompetencyRuleoutcomeResponse>;
  competency_set_parent_competency(parameters: CompetencySetParentCompetencyParameters): Promise<CompetencySetParentCompetencyResponse>;
  competency_template_has_related_data(parameters: CompetencyTemplateHasRelatedDataParameters): Promise<CompetencyTemplateHasRelatedDataResponse>;
  competency_template_viewed(parameters: CompetencyTemplateViewedParameters): Promise<CompetencyTemplateViewedResponse>;
  competency_unapprove_plan(parameters: CompetencyUnapprovePlanParameters): Promise<CompetencyUnapprovePlanResponse>;
  competency_unlink_plan_from_template(parameters: CompetencyUnlinkPlanFromTemplateParameters): Promise<CompetencyUnlinkPlanFromTemplateResponse>;
  competency_update_competency(parameters: CompetencyUpdateCompetencyParameters): Promise<CompetencyUpdateCompetencyResponse>;
  competency_update_competency_framework(parameters: CompetencyUpdateCompetencyFrameworkParameters): Promise<CompetencyUpdateCompetencyFrameworkResponse>;
  competency_update_course_competency_settings(parameters: CompetencyUpdateCourseCompetencySettingsParameters): Promise<CompetencyUpdateCourseCompetencySettingsResponse>;
  competency_update_plan(parameters: CompetencyUpdatePlanParameters): Promise<CompetencyUpdatePlanResponse>;
  competency_update_template(parameters: CompetencyUpdateTemplateParameters): Promise<CompetencyUpdateTemplateResponse>;
  competency_user_competency_cancel_review_request(parameters: CompetencyUserCompetencyCancelReviewRequestParameters): Promise<CompetencyUserCompetencyCancelReviewRequestResponse>;
  competency_user_competency_request_review(parameters: CompetencyUserCompetencyRequestReviewParameters): Promise<CompetencyUserCompetencyRequestReviewResponse>;
  competency_user_competency_start_review(parameters: CompetencyUserCompetencyStartReviewParameters): Promise<CompetencyUserCompetencyStartReviewResponse>;
  competency_user_competency_stop_review(parameters: CompetencyUserCompetencyStopReviewParameters): Promise<CompetencyUserCompetencyStopReviewResponse>;
  contentbank_copy_content(parameters: ContentbankCopyContentParameters): Promise<ContentbankCopyContentResponse>;
  contentbank_delete_content(parameters: ContentbankDeleteContentParameters): Promise<ContentbankDeleteContentResponse>;
  contentbank_rename_content(parameters: ContentbankRenameContentParameters): Promise<ContentbankRenameContentResponse>;
  contentbank_set_content_visibility(parameters: ContentbankSetContentVisibilityParameters): Promise<ContentbankSetContentVisibilityResponse>;
  course_add_content_item_to_user_favourites(parameters: CourseAddContentItemToUserFavouritesParameters): Promise<CourseAddContentItemToUserFavouritesResponse>;
  course_delete_modules(parameters: CourseDeleteModulesParameters): Promise<CourseDeleteModulesResponse>;
  course_duplicate_course(parameters: CourseDuplicateCourseParameters): Promise<CourseDuplicateCourseResponse>;
  course_edit_module(parameters: CourseEditModuleParameters): Promise<CourseEditModuleResponse>;
  course_edit_section(parameters: CourseEditSectionParameters): Promise<CourseEditSectionResponse>;
  course_get_activity_chooser_footer(parameters: CourseGetActivityChooserFooterParameters): Promise<CourseGetActivityChooserFooterResponse>;
  course_get_course_content_items(parameters: CourseGetCourseContentItemsParameters): Promise<CourseGetCourseContentItemsResponse>;
  course_get_enrolled_users_by_cmid(parameters: CourseGetEnrolledUsersByCmidParameters): Promise<CourseGetEnrolledUsersByCmidResponse>;
  course_get_module(parameters: CourseGetModuleParameters): Promise<CourseGetModuleResponse>;
  course_import_course(parameters: CourseImportCourseParameters): Promise<CourseImportCourseResponse>;
  course_remove_content_item_from_user_favourites(parameters: CourseRemoveContentItemFromUserFavouritesParameters): Promise<CourseRemoveContentItemFromUserFavouritesResponse>;
  course_toggle_activity_recommendation(parameters: CourseToggleActivityRecommendationParameters): Promise<CourseToggleActivityRecommendationResponse>;
  courseformat_create_module(parameters: CourseformatCreateModuleParameters): Promise<CourseformatCreateModuleResponse>;
  courseformat_file_handlers(parameters: CourseformatFileHandlersParameters): Promise<CourseformatFileHandlersResponse>;
  courseformat_get_section_content_items(parameters: CourseformatGetSectionContentItemsParameters): Promise<CourseformatGetSectionContentItemsResponse>;
  courseformat_get_state(parameters: CourseformatGetStateParameters): Promise<CourseformatGetStateResponse>;
  courseformat_new_module(parameters: CourseformatNewModuleParameters): Promise<CourseformatNewModuleResponse>;
  courseformat_update_course(parameters: CourseformatUpdateCourseParameters): Promise<CourseformatUpdateCourseResponse>;
  create_userfeedback_action_record(parameters: CreateUserfeedbackActionRecordParameters): Promise<CreateUserfeedbackActionRecordResponse>;
  customfield_convert_category(parameters: CustomfieldConvertCategoryParameters): Promise<CustomfieldConvertCategoryResponse>;
  customfield_create_category(parameters: CustomfieldCreateCategoryParameters): Promise<CustomfieldCreateCategoryResponse>;
  customfield_delete_category(parameters: CustomfieldDeleteCategoryParameters): Promise<CustomfieldDeleteCategoryResponse>;
  customfield_delete_field(parameters: CustomfieldDeleteFieldParameters): Promise<CustomfieldDeleteFieldResponse>;
  customfield_move_category(parameters: CustomfieldMoveCategoryParameters): Promise<CustomfieldMoveCategoryResponse>;
  customfield_move_field(parameters: CustomfieldMoveFieldParameters): Promise<CustomfieldMoveFieldResponse>;
  customfield_reload_template(parameters: CustomfieldReloadTemplateParameters): Promise<CustomfieldReloadTemplateResponse>;
  customfield_toggle_shared(parameters: CustomfieldToggleSharedParameters): Promise<CustomfieldToggleSharedResponse>;
  dynamic_tabs_get_content(parameters: DynamicTabsGetContentParameters): Promise<DynamicTabsGetContentResponse>;
  fetch_notifications(parameters: FetchNotificationsParameters): Promise<FetchNotificationsResponse>;
  files_upload(parameters: FilesUploadParameters): Promise<FilesUploadResponse>;
  form_dynamic_form(parameters: FormDynamicFormParameters): Promise<FormDynamicFormResponse>;
  form_get_filetypes_browser_data(parameters: FormGetFiletypesBrowserDataParameters): Promise<FormGetFiletypesBrowserDataResponse>;
  get_fragment(parameters: GetFragmentParameters): Promise<GetFragmentResponse>;
  get_string(parameters: GetStringParameters): Promise<GetStringResponse>;
  get_strings(parameters: GetStringsParameters): Promise<GetStringsResponse>;
  get_user_dates(parameters: GetUserDatesParameters): Promise<GetUserDatesResponse>;
  grading_get_definitions(parameters: GradingGetDefinitionsParameters): Promise<GradingGetDefinitionsResponse>;
  grading_get_gradingform_instances(parameters: GradingGetGradingformInstancesParameters): Promise<GradingGetGradingformInstancesResponse>;
  grading_save_definitions(parameters: GradingSaveDefinitionsParameters): Promise<GradingSaveDefinitionsResponse>;
  message_get_message_processor(parameters: MessageGetMessageProcessorParameters): Promise<MessageGetMessageProcessorResponse>;
  message_get_unsent_message(parameters?: MessageGetUnsentMessageParameters): Promise<MessageGetUnsentMessageResponse>;
  message_set_default_notification(parameters: MessageSetDefaultNotificationParameters): Promise<MessageSetDefaultNotificationResponse>;
  message_set_unsent_message(parameters: MessageSetUnsentMessageParameters): Promise<MessageSetUnsentMessageResponse>;
  moodlenet_auth_check(parameters: MoodlenetAuthCheckParameters): Promise<MoodlenetAuthCheckResponse>;
  moodlenet_get_share_info_activity(parameters: MoodlenetGetShareInfoActivityParameters): Promise<MoodlenetGetShareInfoActivityResponse>;
  moodlenet_get_shared_course_info(parameters: MoodlenetGetSharedCourseInfoParameters): Promise<MoodlenetGetSharedCourseInfoResponse>;
  moodlenet_send_activity(parameters: MoodlenetSendActivityParameters): Promise<MoodlenetSendActivityResponse>;
  moodlenet_send_course(parameters: MoodlenetSendCourseParameters): Promise<MoodlenetSendCourseResponse>;
  notes_get_notes(parameters: NotesGetNotesParameters): Promise<NotesGetNotesResponse>;
  notes_update_notes(parameters: NotesUpdateNotesParameters): Promise<NotesUpdateNotesResponse>;
  output_load_template(parameters: OutputLoadTemplateParameters): Promise<OutputLoadTemplateResponse>;
  output_load_template_with_dependencies(parameters: OutputLoadTemplateWithDependenciesParameters): Promise<OutputLoadTemplateWithDependenciesResponse>;
  output_poll_stored_progress(parameters: OutputPollStoredProgressParameters): Promise<OutputPollStoredProgressResponse>;
  payment_get_available_gateways(parameters: PaymentGetAvailableGatewaysParameters): Promise<PaymentGetAvailableGatewaysResponse>;
  question_get_random_question_summaries(parameters: QuestionGetRandomQuestionSummariesParameters): Promise<QuestionGetRandomQuestionSummariesResponse>;
  question_move_questions(parameters: QuestionMoveQuestionsParameters): Promise<QuestionMoveQuestionsResponse>;
  question_search_shared_banks(parameters: QuestionSearchSharedBanksParameters): Promise<QuestionSearchSharedBanksResponse>;
  reportbuilder_audiences_delete(parameters: ReportbuilderAudiencesDeleteParameters): Promise<ReportbuilderAudiencesDeleteResponse>;
  reportbuilder_columns_add(parameters: ReportbuilderColumnsAddParameters): Promise<ReportbuilderColumnsAddResponse>;
  reportbuilder_columns_delete(parameters: ReportbuilderColumnsDeleteParameters): Promise<ReportbuilderColumnsDeleteResponse>;
  reportbuilder_columns_reorder(parameters: ReportbuilderColumnsReorderParameters): Promise<ReportbuilderColumnsReorderResponse>;
  reportbuilder_columns_sort_get(parameters: ReportbuilderColumnsSortGetParameters): Promise<ReportbuilderColumnsSortGetResponse>;
  reportbuilder_columns_sort_reorder(parameters: ReportbuilderColumnsSortReorderParameters): Promise<ReportbuilderColumnsSortReorderResponse>;
  reportbuilder_columns_sort_toggle(parameters: ReportbuilderColumnsSortToggleParameters): Promise<ReportbuilderColumnsSortToggleResponse>;
  reportbuilder_conditions_add(parameters: ReportbuilderConditionsAddParameters): Promise<ReportbuilderConditionsAddResponse>;
  reportbuilder_conditions_delete(parameters: ReportbuilderConditionsDeleteParameters): Promise<ReportbuilderConditionsDeleteResponse>;
  reportbuilder_conditions_reorder(parameters: ReportbuilderConditionsReorderParameters): Promise<ReportbuilderConditionsReorderResponse>;
  reportbuilder_conditions_reset(parameters: ReportbuilderConditionsResetParameters): Promise<ReportbuilderConditionsResetResponse>;
  reportbuilder_filters_add(parameters: ReportbuilderFiltersAddParameters): Promise<ReportbuilderFiltersAddResponse>;
  reportbuilder_filters_delete(parameters: ReportbuilderFiltersDeleteParameters): Promise<ReportbuilderFiltersDeleteResponse>;
  reportbuilder_filters_reorder(parameters: ReportbuilderFiltersReorderParameters): Promise<ReportbuilderFiltersReorderResponse>;
  reportbuilder_filters_reset(parameters: ReportbuilderFiltersResetParameters): Promise<ReportbuilderFiltersResetResponse>;
  reportbuilder_reports_delete(parameters: ReportbuilderReportsDeleteParameters): Promise<ReportbuilderReportsDeleteResponse>;
  reportbuilder_reports_get(parameters: ReportbuilderReportsGetParameters): Promise<ReportbuilderReportsGetResponse>;
  reportbuilder_schedules_delete(parameters: ReportbuilderSchedulesDeleteParameters): Promise<ReportbuilderSchedulesDeleteResponse>;
  reportbuilder_schedules_send(parameters: ReportbuilderSchedulesSendParameters): Promise<ReportbuilderSchedulesSendResponse>;
  reportbuilder_schedules_toggle(parameters: ReportbuilderSchedulesToggleParameters): Promise<ReportbuilderSchedulesToggleResponse>;
  reportbuilder_set_filters(parameters: ReportbuilderSetFiltersParameters): Promise<ReportbuilderSetFiltersResponse>;
  search_get_relevant_users(parameters: SearchGetRelevantUsersParameters): Promise<SearchGetRelevantUsersResponse>;
  session_time_remaining(parameters?: SessionTimeRemainingParameters): Promise<SessionTimeRemainingResponse>;
  session_touch(parameters?: SessionTouchParameters): Promise<SessionTouchResponse>;
  sms_set_gateway_status(parameters: SmsSetGatewayStatusParameters): Promise<SmsSetGatewayStatusResponse>;
  tag_get_tags(parameters: TagGetTagsParameters): Promise<TagGetTagsResponse>;
  tag_update_tags(parameters: TagUpdateTagsParameters): Promise<TagUpdateTagsResponse>;
  update_inplace_editable(parameters: UpdateInplaceEditableParameters): Promise<UpdateInplaceEditableResponse>;
  user_get_users(parameters: UserGetUsersParameters): Promise<UserGetUsersResponse>;
  user_search_identity(parameters: UserSearchIdentityParameters): Promise<UserSearchIdentityResponse>;
  customfield_number_recalculate_value(parameters: CustomfieldNumberRecalculateValueParameters): Promise<CustomfieldNumberRecalculateValueResponse>;
  enrol_meta_add_instances(parameters: EnrolMetaAddInstancesParameters): Promise<EnrolMetaAddInstancesResponse>;
  enrol_meta_delete_instances(parameters: EnrolMetaDeleteInstancesParameters): Promise<EnrolMetaDeleteInstancesResponse>;
  gradingform_guide_grader_gradingpanel_fetch(parameters: GradingformGuideGraderGradingpanelFetchParameters): Promise<GradingformGuideGraderGradingpanelFetchResponse>;
  gradingform_guide_grader_gradingpanel_store(parameters: GradingformGuideGraderGradingpanelStoreParameters): Promise<GradingformGuideGraderGradingpanelStoreResponse>;
  gradingform_rubric_grader_gradingpanel_fetch(parameters: GradingformRubricGraderGradingpanelFetchParameters): Promise<GradingformRubricGraderGradingpanelFetchResponse>;
  gradingform_rubric_grader_gradingpanel_store(parameters: GradingformRubricGraderGradingpanelStoreParameters): Promise<GradingformRubricGraderGradingpanelStoreResponse>;
  media_videojs_get_language(parameters: MediaVideojsGetLanguageParameters): Promise<MediaVideojsGetLanguageResponse>;
  paygw_paypal_create_transaction_complete(parameters: PaygwPaypalCreateTransactionCompleteParameters): Promise<PaygwPaypalCreateTransactionCompleteResponse>;
  paygw_paypal_get_config_for_js(parameters: PaygwPaypalGetConfigForJsParameters): Promise<PaygwPaypalGetConfigForJsResponse>;
  qbank_columnsortorder_set_column_size(parameters: QbankColumnsortorderSetColumnSizeParameters): Promise<QbankColumnsortorderSetColumnSizeResponse>;
  qbank_columnsortorder_set_columnbank_order(parameters: QbankColumnsortorderSetColumnbankOrderParameters): Promise<QbankColumnsortorderSetColumnbankOrderResponse>;
  qbank_columnsortorder_set_hidden_columns(parameters: QbankColumnsortorderSetHiddenColumnsParameters): Promise<QbankColumnsortorderSetHiddenColumnsResponse>;
  qbank_editquestion_set_status(parameters: QbankEditquestionSetStatusParameters): Promise<QbankEditquestionSetStatusResponse>;
  qbank_managecategories_move_category(parameters: QbankManagecategoriesMoveCategoryParameters): Promise<QbankManagecategoriesMoveCategoryResponse>;
  qbank_tagquestion_submit_tags_form(parameters: QbankTagquestionSubmitTagsFormParameters): Promise<QbankTagquestionSubmitTagsFormResponse>;
  qbank_viewquestiontext_set_question_text_format(parameters: QbankViewquestiontextSetQuestionTextFormatParameters): Promise<QbankViewquestiontextSetQuestionTextFormatResponse>;
  quizaccess_seb_validate_quiz_keys(parameters: QuizaccessSebValidateQuizKeysParameters): Promise<QuizaccessSebValidateQuizKeysResponse>;
  report_competency_data_for_report(parameters: ReportCompetencyDataForReportParameters): Promise<ReportCompetencyDataForReportResponse>;
  tiny_autosave_reset_session(parameters: TinyAutosaveResetSessionParameters): Promise<TinyAutosaveResetSessionResponse>;
  tiny_autosave_resume_session(parameters: TinyAutosaveResumeSessionParameters): Promise<TinyAutosaveResumeSessionResponse>;
  tiny_autosave_update_session(parameters: TinyAutosaveUpdateSessionParameters): Promise<TinyAutosaveUpdateSessionResponse>;
  tiny_equation_filter(parameters: TinyEquationFilterParameters): Promise<TinyEquationFilterResponse>;
  tiny_media_preview(parameters: TinyMediaPreviewParameters): Promise<TinyMediaPreviewResponse>;
  admin_presets_delete_preset(parameters: AdminPresetsDeletePresetParameters): Promise<AdminPresetsDeletePresetResponse>;
  behat_get_entity_generator(parameters: BehatGetEntityGeneratorParameters): Promise<BehatGetEntityGeneratorResponse>;
  dataprivacy_approve_data_request(parameters: DataprivacyApproveDataRequestParameters): Promise<DataprivacyApproveDataRequestResponse>;
  dataprivacy_bulk_approve_data_requests(parameters: DataprivacyBulkApproveDataRequestsParameters): Promise<DataprivacyBulkApproveDataRequestsResponse>;
  dataprivacy_bulk_deny_data_requests(parameters: DataprivacyBulkDenyDataRequestsParameters): Promise<DataprivacyBulkDenyDataRequestsResponse>;
  dataprivacy_confirm_contexts_for_deletion(parameters: DataprivacyConfirmContextsForDeletionParameters): Promise<DataprivacyConfirmContextsForDeletionResponse>;
  dataprivacy_create_category_form(parameters: DataprivacyCreateCategoryFormParameters): Promise<DataprivacyCreateCategoryFormResponse>;
  dataprivacy_create_purpose_form(parameters: DataprivacyCreatePurposeFormParameters): Promise<DataprivacyCreatePurposeFormResponse>;
  dataprivacy_delete_category(parameters: DataprivacyDeleteCategoryParameters): Promise<DataprivacyDeleteCategoryResponse>;
  dataprivacy_delete_purpose(parameters: DataprivacyDeletePurposeParameters): Promise<DataprivacyDeletePurposeResponse>;
  dataprivacy_deny_data_request(parameters: DataprivacyDenyDataRequestParameters): Promise<DataprivacyDenyDataRequestResponse>;
  dataprivacy_get_activity_options(parameters: DataprivacyGetActivityOptionsParameters): Promise<DataprivacyGetActivityOptionsResponse>;
  dataprivacy_get_category_options(parameters: DataprivacyGetCategoryOptionsParameters): Promise<DataprivacyGetCategoryOptionsResponse>;
  dataprivacy_get_data_request(parameters: DataprivacyGetDataRequestParameters): Promise<DataprivacyGetDataRequestResponse>;
  dataprivacy_get_purpose_options(parameters: DataprivacyGetPurposeOptionsParameters): Promise<DataprivacyGetPurposeOptionsResponse>;
  dataprivacy_get_users(parameters: DataprivacyGetUsersParameters): Promise<DataprivacyGetUsersResponse>;
  dataprivacy_mark_complete(parameters: DataprivacyMarkCompleteParameters): Promise<DataprivacyMarkCompleteResponse>;
  dataprivacy_set_context_defaults(parameters: DataprivacySetContextDefaultsParameters): Promise<DataprivacySetContextDefaultsResponse>;
  dataprivacy_set_context_form(parameters: DataprivacySetContextFormParameters): Promise<DataprivacySetContextFormResponse>;
  dataprivacy_set_contextlevel_form(parameters: DataprivacySetContextlevelFormParameters): Promise<DataprivacySetContextlevelFormResponse>;
  dataprivacy_submit_selected_courses_form(parameters: DataprivacySubmitSelectedCoursesFormParameters): Promise<DataprivacySubmitSelectedCoursesFormResponse>;
  dataprivacy_tree_extra_branches(parameters: DataprivacyTreeExtraBranchesParameters): Promise<DataprivacyTreeExtraBranchesResponse>;
  lp_data_for_competencies_manage_page(parameters: LpDataForCompetenciesManagePageParameters): Promise<LpDataForCompetenciesManagePageResponse>;
  lp_data_for_competency_frameworks_manage_page(parameters: LpDataForCompetencyFrameworksManagePageParameters): Promise<LpDataForCompetencyFrameworksManagePageResponse>;
  lp_data_for_competency_summary(parameters: LpDataForCompetencySummaryParameters): Promise<LpDataForCompetencySummaryResponse>;
  lp_data_for_related_competencies_section(parameters: LpDataForRelatedCompetenciesSectionParameters): Promise<LpDataForRelatedCompetenciesSectionResponse>;
  lp_data_for_template_competencies_page(parameters: LpDataForTemplateCompetenciesPageParameters): Promise<LpDataForTemplateCompetenciesPageResponse>;
  lp_data_for_templates_manage_page(parameters: LpDataForTemplatesManagePageParameters): Promise<LpDataForTemplatesManagePageResponse>;
  lp_list_courses_using_competency(parameters: LpListCoursesUsingCompetencyParameters): Promise<LpListCoursesUsingCompetencyResponse>;
  lp_search_cohorts(parameters: LpSearchCohortsParameters): Promise<LpSearchCohortsResponse>;
  lp_search_users(parameters: LpSearchUsersParameters): Promise<LpSearchUsersResponse>;
  policy_submit_accept_on_behalf(parameters: PolicySubmitAcceptOnBehalfParameters): Promise<PolicySubmitAcceptOnBehalfResponse>;
  templatelibrary_list_templates(parameters: TemplatelibraryListTemplatesParameters): Promise<TemplatelibraryListTemplatesResponse>;
  templatelibrary_load_canonical_template(parameters: TemplatelibraryLoadCanonicalTemplateParameters): Promise<TemplatelibraryLoadCanonicalTemplateResponse>;
  usertours_complete_tour(parameters: UsertoursCompleteTourParameters): Promise<UsertoursCompleteTourResponse>;
  usertours_fetch_and_start_tour(parameters: UsertoursFetchAndStartTourParameters): Promise<UsertoursFetchAndStartTourResponse>;
  usertours_reset_tour(parameters: UsertoursResetTourParameters): Promise<UsertoursResetTourResponse>;
  usertours_step_shown(parameters: UsertoursStepShownParameters): Promise<UsertoursStepShownResponse>;
  xmldb_invoke_move_action(parameters: XmldbInvokeMoveActionParameters): Promise<XmldbInvokeMoveActionResponse>;
  grades_get_enrolled_users_for_search_widget(parameters: GradesGetEnrolledUsersForSearchWidgetParameters): Promise<GradesGetEnrolledUsersForSearchWidgetResponse>;
  grades_get_groups_for_search_widget(parameters: GradesGetGroupsForSearchWidgetParameters): Promise<GradesGetGroupsForSearchWidgetResponse>;
  output_load_fontawesome_icon_map(parameters?: OutputLoadFontawesomeIconMapParameters): Promise<OutputLoadFontawesomeIconMapResponse>;
  mod_assign_delete_overrides(parameters: ModAssignDeleteOverridesParameters): Promise<ModAssignDeleteOverridesResponse>;
  mod_assign_get_overrides(parameters: ModAssignGetOverridesParameters): Promise<ModAssignGetOverridesResponse>;
  mod_assign_save_overrides(parameters: ModAssignSaveOverridesParameters): Promise<ModAssignSaveOverridesResponse>;
  mod_chat_get_chat_latest_messages(parameters: ModChatGetChatLatestMessagesParameters): Promise<ModChatGetChatLatestMessagesResponse>;
  mod_chat_get_chat_users(parameters: ModChatGetChatUsersParameters): Promise<ModChatGetChatUsersResponse>;
  mod_chat_get_chats_by_courses(parameters: ModChatGetChatsByCoursesParameters): Promise<ModChatGetChatsByCoursesResponse>;
  mod_chat_get_session_messages(parameters: ModChatGetSessionMessagesParameters): Promise<ModChatGetSessionMessagesResponse>;
  mod_chat_get_sessions(parameters: ModChatGetSessionsParameters): Promise<ModChatGetSessionsResponse>;
  mod_chat_login_user(parameters: ModChatLoginUserParameters): Promise<ModChatLoginUserResponse>;
  mod_chat_send_chat_message(parameters: ModChatSendChatMessageParameters): Promise<ModChatSendChatMessageResponse>;
  mod_chat_view_chat(parameters: ModChatViewChatParameters): Promise<ModChatViewChatResponse>;
  mod_chat_view_sessions(parameters: ModChatViewSessionsParameters): Promise<ModChatViewSessionsResponse>;
  mod_forum_set_read_state(parameters: ModForumSetReadStateParameters): Promise<ModForumSetReadStateResponse>;
  mod_quiz_get_users_in_report(parameters: ModQuizGetUsersInReportParameters): Promise<ModQuizGetUsersInReportResponse>;
  mod_survey_get_questions(parameters: ModSurveyGetQuestionsParameters): Promise<ModSurveyGetQuestionsResponse>;
  mod_survey_get_surveys_by_courses(parameters: ModSurveyGetSurveysByCoursesParameters): Promise<ModSurveyGetSurveysByCoursesResponse>;
  mod_survey_submit_answers(parameters: ModSurveySubmitAnswersParameters): Promise<ModSurveySubmitAnswersResponse>;
  mod_survey_view_survey(parameters: ModSurveyViewSurveyParameters): Promise<ModSurveyViewSurveyResponse>;
  report_insights_set_fixed_prediction(parameters: ReportInsightsSetFixedPredictionParameters): Promise<ReportInsightsSetFixedPredictionResponse>;
  report_insights_set_notuseful_prediction(parameters: ReportInsightsSetNotusefulPredictionParameters): Promise<ReportInsightsSetNotusefulPredictionResponse>;
}

export type MoodleOperationParameter<TName extends MoodleOperationName> = MoodleOperationParameters[TName];
export type MoodleOperationResponse<TName extends MoodleOperationName> = MoodleOperationResponses[TName];
