import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('de', 'en');
  CREATE TYPE "public"."l_t" AS ENUM('reference', 'custom', 'archive');
  CREATE TYPE "public"."l_ar" AS ENUM('posts', 'talents');
  CREATE TYPE "public"."l_ap" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_layout" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  CREATE TYPE "public"."enum_pages_blocks_gallery_variant" AS ENUM('grid', 'masonry', 'slider', 'lightbox');
  CREATE TYPE "public"."enum_pages_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_faq_layout" AS ENUM('accordion', 'list', 'twoColumn');
  CREATE TYPE "public"."enum_pages_blocks_sticky_media_overlay_opacity" AS ENUM('0', '10', '20', '30', '40', '50', '60', '70', '80');
  CREATE TYPE "public"."enum_pages_blocks_masonry_grid_audience_cards_size" AS ENUM('large', 'medium');
  CREATE TYPE "public"."th" AS ENUM('dark', 'light');
  CREATE TYPE "public"."ls" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_masonry_grid_variant" AS ENUM('benefits', 'audience');
  CREATE TYPE "public"."enum_pages_blocks_masonry_grid_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."tt" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_masonry_grid_section_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_slider_card_style" AS ENUM('compact', 'featured');
  CREATE TYPE "public"."enum_pages_blocks_slider_source_collection" AS ENUM('posts', 'talents');
  CREATE TYPE "public"."enum_pages_blocks_slider_badge_field" AS ENUM('none', 'title', 'category');
  CREATE TYPE "public"."enum_pages_blocks_slider_sort_by" AS ENUM('publishedAt', 'title', 'manual');
  CREATE TYPE "public"."ip" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_big_text_heading_level" AS ENUM('h2', 'h3');
  CREATE TYPE "public"."enum_pages_blocks_step_section_layout" AS ENUM('cards', 'timeline', 'flow');
  CREATE TYPE "public"."enum_pages_blocks_step_section_card_display" AS ENUM('number', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_step_section_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_step_section_cta_position" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_step_section_flow_container_style" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum_pages_blocks_info_cards_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_services_services_icon" AS ENUM('users', 'calendar', 'handshake', 'globe');
  CREATE TYPE "public"."enum_pages_blocks_education_programs_icon" AS ENUM('graduationCap', 'users', 'briefcase', 'zap');
  CREATE TYPE "public"."enum_pages_blocks_coaching_benefits_icon" AS ENUM('award', 'trendingUp', 'target', 'heart');
  CREATE TYPE "public"."enum_pages_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum_pages_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'FAQPage', 'ContactPage', 'AboutPage', 'CollectionPage');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'fullWidth', 'landing', 'blogListing');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'centeredVideo', 'textLeftAligned', 'textMiddleAligned');
  CREATE TYPE "public"."enum_pages_hero_background_style" AS ENUM('dark', 'light', 'gradient');
  CREATE TYPE "public"."enum_pages_hero_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_hero_right_side" AS ENUM('image', 'features', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_content_layout" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_variant" AS ENUM('grid', 'masonry', 'slider', 'lightbox');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_layout" AS ENUM('accordion', 'list', 'twoColumn');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_media_overlay_opacity" AS ENUM('0', '10', '20', '30', '40', '50', '60', '70', '80');
  CREATE TYPE "public"."enum__pages_v_blocks_masonry_grid_audience_cards_size" AS ENUM('large', 'medium');
  CREATE TYPE "public"."enum__pages_v_blocks_masonry_grid_variant" AS ENUM('benefits', 'audience');
  CREATE TYPE "public"."enum__pages_v_blocks_masonry_grid_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_masonry_grid_section_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_slider_card_style" AS ENUM('compact', 'featured');
  CREATE TYPE "public"."enum__pages_v_blocks_slider_source_collection" AS ENUM('posts', 'talents');
  CREATE TYPE "public"."enum__pages_v_blocks_slider_badge_field" AS ENUM('none', 'title', 'category');
  CREATE TYPE "public"."enum__pages_v_blocks_slider_sort_by" AS ENUM('publishedAt', 'title', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_big_text_heading_level" AS ENUM('h2', 'h3');
  CREATE TYPE "public"."enum__pages_v_blocks_step_section_layout" AS ENUM('cards', 'timeline', 'flow');
  CREATE TYPE "public"."enum__pages_v_blocks_step_section_card_display" AS ENUM('number', 'icon');
  CREATE TYPE "public"."enum__pages_v_blocks_step_section_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_step_section_cta_position" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_step_section_flow_container_style" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_info_cards_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_services_services_icon" AS ENUM('users', 'calendar', 'handshake', 'globe');
  CREATE TYPE "public"."enum__pages_v_blocks_education_programs_icon" AS ENUM('graduationCap', 'users', 'briefcase', 'zap');
  CREATE TYPE "public"."enum__pages_v_blocks_coaching_benefits_icon" AS ENUM('award', 'trendingUp', 'target', 'heart');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum__pages_v_version_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'FAQPage', 'ContactPage', 'AboutPage', 'CollectionPage');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('default', 'fullWidth', 'landing', 'blogListing');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'centeredVideo', 'textLeftAligned', 'textMiddleAligned');
  CREATE TYPE "public"."enum__pages_v_version_hero_background_style" AS ENUM('dark', 'light', 'gradient');
  CREATE TYPE "public"."enum__pages_v_version_hero_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_version_hero_right_side" AS ENUM('image', 'features', 'off');
  CREATE TYPE "public"."enum_posts_blocks_content_layout" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_posts_blocks_content_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_posts_blocks_gallery_variant" AS ENUM('grid', 'masonry', 'slider', 'lightbox');
  CREATE TYPE "public"."enum_posts_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_posts_blocks_faq_layout" AS ENUM('accordion', 'list', 'twoColumn');
  CREATE TYPE "public"."enum_posts_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  CREATE TYPE "public"."enum_posts_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'FAQPage', 'ContactPage', 'AboutPage', 'Service', 'Product');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_blocks_content_layout" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_content_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_variant" AS ENUM('grid', 'masonry', 'slider', 'lightbox');
  CREATE TYPE "public"."enum__posts_v_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__posts_v_blocks_faq_layout" AS ENUM('accordion', 'list', 'twoColumn');
  CREATE TYPE "public"."enum__posts_v_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  CREATE TYPE "public"."enum__posts_v_version_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'FAQPage', 'ContactPage', 'AboutPage', 'Service', 'Product');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum_talents_measurements_hair" AS ENUM('black', 'brown', 'blonde', 'red', 'auburn', 'gray', 'white', 'highlights', 'other');
  CREATE TYPE "public"."enum_talents_measurements_eyes" AS ENUM('brown', 'blue', 'green', 'hazel', 'gray', 'amber');
  CREATE TYPE "public"."enum_talents_languages" AS ENUM('de', 'en', 'fr', 'es', 'it', 'pt', 'ru', 'tr', 'pl', 'nl', 'zh', 'ja', 'ko', 'ar', 'hi', 'mandarin');
  CREATE TYPE "public"."enum_talents_sedcard_template" AS ENUM('classic');
  CREATE TYPE "public"."enum_talents_card_style" AS ENUM('', 'sage', 'peach', 'cream');
  CREATE TYPE "public"."enum_talents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_talents_category" AS ENUM('dancer', 'model', 'both');
  CREATE TYPE "public"."enum__talents_v_version_measurements_hair" AS ENUM('black', 'brown', 'blonde', 'red', 'auburn', 'gray', 'white', 'highlights', 'other');
  CREATE TYPE "public"."enum__talents_v_version_measurements_eyes" AS ENUM('brown', 'blue', 'green', 'hazel', 'gray', 'amber');
  CREATE TYPE "public"."enum__talents_v_version_languages" AS ENUM('de', 'en', 'fr', 'es', 'it', 'pt', 'ru', 'tr', 'pl', 'nl', 'zh', 'ja', 'ko', 'ar', 'hi', 'mandarin');
  CREATE TYPE "public"."enum__talents_v_version_sedcard_template" AS ENUM('classic');
  CREATE TYPE "public"."enum__talents_v_version_card_style" AS ENUM('', 'sage', 'peach', 'cream');
  CREATE TYPE "public"."enum__talents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__talents_v_published_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum__talents_v_version_category" AS ENUM('dancer', 'model', 'both');
  CREATE TYPE "public"."enum_talent_skills_skill_group" AS ENUM('dance', 'modeling', 'acting', 'fitness', 'other');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_forms_form_category" AS ENUM('contact', 'talent_booking', 'become_talent', 'job_inquiry', 'other');
  CREATE TYPE "public"."enum_form_submissions_category" AS ENUM('contact', 'talent_booking', 'become_talent', 'job_inquiry', 'other');
  CREATE TYPE "public"."enum_form_submissions_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_talents_archive_blocks_content_layout" AS ENUM('default', 'narrow', 'wide', 'full');
  CREATE TYPE "public"."enum_talents_archive_blocks_content_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  CREATE TYPE "public"."enum_talents_archive_blocks_gallery_variant" AS ENUM('grid', 'masonry', 'slider', 'lightbox');
  CREATE TYPE "public"."enum_talents_archive_blocks_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_talents_archive_blocks_faq_layout" AS ENUM('accordion', 'list', 'twoColumn');
  CREATE TYPE "public"."enum_talents_archive_blocks_sticky_media_overlay_opacity" AS ENUM('0', '10', '20', '30', '40', '50', '60', '70', '80');
  CREATE TYPE "public"."enum_talents_archive_blocks_masonry_grid_audience_cards_size" AS ENUM('large', 'medium');
  CREATE TYPE "public"."enum_talents_archive_blocks_masonry_grid_variant" AS ENUM('benefits', 'audience');
  CREATE TYPE "public"."enum_talents_archive_blocks_masonry_grid_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_masonry_grid_section_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_talents_archive_blocks_slider_card_style" AS ENUM('compact', 'featured');
  CREATE TYPE "public"."enum_talents_archive_blocks_slider_source_collection" AS ENUM('posts', 'talents');
  CREATE TYPE "public"."enum_talents_archive_blocks_slider_badge_field" AS ENUM('none', 'title', 'category');
  CREATE TYPE "public"."enum_talents_archive_blocks_slider_sort_by" AS ENUM('publishedAt', 'title', 'manual');
  CREATE TYPE "public"."enum_talents_archive_blocks_big_text_heading_level" AS ENUM('h2', 'h3');
  CREATE TYPE "public"."enum_talents_archive_blocks_step_section_layout" AS ENUM('cards', 'timeline', 'flow');
  CREATE TYPE "public"."enum_talents_archive_blocks_step_section_card_display" AS ENUM('number', 'icon');
  CREATE TYPE "public"."enum_talents_archive_blocks_step_section_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_step_section_cta_position" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum_talents_archive_blocks_step_section_flow_container_style" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum_talents_archive_blocks_info_cards_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_services_services_icon" AS ENUM('users', 'calendar', 'handshake', 'globe');
  CREATE TYPE "public"."enum_talents_archive_blocks_education_programs_icon" AS ENUM('graduationCap', 'users', 'briefcase', 'zap');
  CREATE TYPE "public"."enum_talents_archive_blocks_coaching_benefits_icon" AS ENUM('award', 'trendingUp', 'target', 'heart');
  CREATE TYPE "public"."enum_talents_archive_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum_talents_archive_showcase_mode" AS ENUM('featured', 'manual');
  CREATE TYPE "public"."enum_sedcard_settings_default_template" AS ENUM('classic');
  CREATE TYPE "public"."enum_header_card_nav_items_media_display" AS ENUM('image', 'latestBlog');
  CREATE TYPE "public"."enum_header_language_switcher_placement" AS ENUM('header', 'footer', 'header-footer');
  CREATE TYPE "public"."enum_header_theme_toggle_placement" AS ENUM('header', 'footer', 'header-footer', 'hidden');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'tiktok', 'github', 'dribbble', 'behance');
  CREATE TYPE "public"."enum_seo_social_media_same_as_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'github');
  CREATE TYPE "public"."enum_seo_business_info_business_type" AS ENUM('LocalBusiness', 'ProfessionalService', 'Organization');
  CREATE TYPE "public"."enum_seo_business_info_price_range" AS ENUM('€', '€€', '€€€');
  CREATE TYPE "public"."enum_seo_ai_and_crawlers_llm_txt_content_update_schedule" AS ENUM('daily', 'weekly', 'monthly');
  CREATE TYPE "public"."enum_seo_sitemaps_indexing_change_frequency" AS ENUM('daily', 'weekly', 'monthly');
  CREATE TYPE "public"."enum_seo_schema_templates_website_schema_language" AS ENUM('de-DE', 'en-US');
  CREATE TYPE "public"."enum_theme_settings_default_theme" AS ENUM('dark', 'light', 'system');
  CREATE TYPE "public"."enum_theme_settings_color_preset" AS ENUM('deleyna-dark', 'deleyna-light');
  CREATE TYPE "public"."enum_cookie_banner_trigger_placement" AS ENUM('footer', 'floating', 'floating-right');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_content_layout" DEFAULT 'default',
  	"background_color" "enum_pages_blocks_content_background_color" DEFAULT 'white',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'default',
  	"headline" varchar,
  	"text" varchar,
  	"background_image_id" integer,
  	"button_type" "l_t" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_archive" "l_ar",
  	"button_label" varchar,
  	"button_appearance" "l_ap" DEFAULT 'primary',
  	"button_track_clicks" boolean,
  	"button_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_gallery_variant" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"generate_schema" boolean DEFAULT true,
  	"layout" "enum_pages_blocks_faq_layout" DEFAULT 'accordion',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_sticky_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"subtitle" varchar,
  	"media_id" integer,
  	"overlay_opacity" "enum_pages_blocks_sticky_media_overlay_opacity" DEFAULT '50',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_masonry_grid_tabs_card_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_blocks_masonry_grid_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"background_media_id" integer,
  	"size" "enum_pages_blocks_masonry_grid_audience_cards_size" DEFAULT 'large',
  	"theme" "th" DEFAULT 'dark',
  	"link_style" "ls" DEFAULT 'default',
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_blocks_masonry_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_masonry_grid_variant" DEFAULT 'benefits',
  	"badge" varchar,
  	"heading" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum_pages_blocks_masonry_grid_background_color" DEFAULT 'white',
  	"highlight_card_title" varchar,
  	"highlight_card_description" varchar,
  	"highlight_card_text_tone" "tt" DEFAULT 'light',
  	"highlight_card_background_media_id" integer,
  	"highlight_card_link_type" "l_t" DEFAULT 'reference',
  	"highlight_card_link_new_tab" boolean,
  	"highlight_card_link_url" varchar,
  	"highlight_card_link_archive" "l_ar",
  	"highlight_card_link_label" varchar,
  	"highlight_card_link_track_clicks" boolean,
  	"highlight_card_link_tracking_event_name" varchar,
  	"tabs_card_text_tone" "tt" DEFAULT 'dark',
  	"tabs_card_background_media_id" integer,
  	"cashflow_card_title" varchar,
  	"cashflow_card_description" varchar,
  	"cashflow_card_text_tone" "tt" DEFAULT 'light',
  	"cashflow_card_background_media_id" integer,
  	"cashflow_card_link_type" "l_t" DEFAULT 'reference',
  	"cashflow_card_link_new_tab" boolean,
  	"cashflow_card_link_url" varchar,
  	"cashflow_card_link_archive" "l_ar",
  	"cashflow_card_link_label" varchar,
  	"cashflow_card_link_track_clicks" boolean,
  	"cashflow_card_link_tracking_event_name" varchar,
  	"video_card_title" varchar,
  	"video_card_description" varchar,
  	"video_card_text_tone" "tt" DEFAULT 'light',
  	"video_card_background_media_id" integer,
  	"video_card_link_type" "l_t" DEFAULT 'reference',
  	"video_card_link_new_tab" boolean,
  	"video_card_link_url" varchar,
  	"video_card_link_archive" "l_ar",
  	"video_card_link_track_clicks" boolean,
  	"video_card_link_tracking_event_name" varchar,
  	"section_tone" "enum_pages_blocks_masonry_grid_section_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"card_style" "enum_pages_blocks_slider_card_style" DEFAULT 'compact',
  	"source_collection" "enum_pages_blocks_slider_source_collection" DEFAULT 'posts',
  	"badge_field" "enum_pages_blocks_slider_badge_field" DEFAULT 'none',
  	"static_badge" varchar,
  	"header_eyebrow" varchar,
  	"header_heading" varchar,
  	"header_description" varchar,
  	"items_limit" numeric DEFAULT 6,
  	"sort_by" "enum_pages_blocks_slider_sort_by" DEFAULT 'publishedAt',
  	"compact_fields_show_image" boolean DEFAULT true,
  	"featured_fields_image_position" "ip" DEFAULT 'right',
  	"featured_fields_show_fallback_image" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_big_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_level" "enum_pages_blocks_big_text_heading_level" DEFAULT 'h2',
  	"line_one" varchar,
  	"line_one_highlight" varchar,
  	"line_two" varchar,
  	"line_two_highlight" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_step_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"description" varchar,
  	"subtitle" varchar,
  	"icon_id" integer,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_step_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_step_section_layout" DEFAULT 'cards',
  	"card_display" "enum_pages_blocks_step_section_card_display" DEFAULT 'number',
  	"background_color" "enum_pages_blocks_step_section_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"intro" jsonb,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"cta_position" "enum_pages_blocks_step_section_cta_position" DEFAULT 'center',
  	"flow_container_style" "enum_pages_blocks_step_section_flow_container_style" DEFAULT 'none',
  	"flow_description" varchar,
  	"result_title" varchar,
  	"result_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_cards_top_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"body" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'outline',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_blocks_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_pages_blocks_info_cards_background_color" DEFAULT 'muted',
  	"tagline" varchar,
  	"title" varchar,
  	"content_below_cards" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_services_services_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_education_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_education_programs_icon",
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"level" varchar
  );
  
  CREATE TABLE "pages_blocks_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_coaching_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_coaching_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_coaching_coaches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"available" boolean DEFAULT true
  );
  
  CREATE TABLE "pages_blocks_coaching" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"benefits_subheading" varchar DEFAULT 'What You''ll Gain',
  	"coaches_subheading" varchar DEFAULT 'Our Lead Coaches',
  	"cta_text" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"form_id" integer,
  	"email_label" varchar DEFAULT 'Email Us',
  	"email" varchar,
  	"phone_label" varchar DEFAULT 'Call Us',
  	"phone" varchar,
  	"address_label" varchar DEFAULT 'Visit Us',
  	"address" varchar,
  	"social_label" varchar DEFAULT 'Follow Us',
  	"social_url" varchar,
  	"social_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title_line1" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_talents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"layout" "enum_pages_blocks_featured_talents_layout" DEFAULT 'carousel',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"bio" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_settings_og_image_id" integer,
  	"page_settings_schema_type" "enum_pages_page_settings_schema_type" DEFAULT 'WebPage',
  	"page_settings_include_breadcrumbs" boolean DEFAULT true,
  	"page_settings_include_organization" boolean DEFAULT true,
  	"page_settings_no_index" boolean DEFAULT false,
  	"page_settings_no_follow" boolean DEFAULT false,
  	"page_settings_exclude_from_sitemap" boolean DEFAULT false,
  	"page_settings_exclude_from_l_l_m" boolean DEFAULT false,
  	"page_settings_canonical_url" varchar,
  	"page_settings_priority" numeric DEFAULT 0.5,
  	"slug" varchar,
  	"parent_id" integer,
  	"template" "enum_pages_template" DEFAULT 'default',
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_badge" varchar,
  	"hero_headline" varchar,
  	"hero_subtext" varchar,
  	"hero_rich_text" jsonb,
  	"hero_headline_highlight" varchar,
  	"hero_media_id" integer,
  	"hero_hero_logo_id" integer,
  	"hero_background_style" "enum_pages_hero_background_style" DEFAULT 'dark',
  	"hero_alignment" "enum_pages_hero_alignment" DEFAULT 'left',
  	"hero_right_side" "enum_pages_hero_right_side" DEFAULT 'image',
  	"hero_show_scroll_indicator" boolean DEFAULT true,
  	"hero_video_id" integer,
  	"hero_video_url" varchar,
  	"hero_poster_image_id" integer,
  	"hero_muted" boolean DEFAULT true,
  	"hero_loop" boolean DEFAULT true,
  	"hero_auto_play" boolean DEFAULT true,
  	"hero_plays_inline" boolean DEFAULT true,
  	"page_settings_meta_title" varchar,
  	"page_settings_meta_description" varchar,
  	"page_settings_meta_keywords" varchar,
  	"page_settings_og_title" varchar,
  	"page_settings_og_description" varchar,
  	"page_settings_schema_markup" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_content_layout" DEFAULT 'default',
  	"background_color" "enum__pages_v_blocks_content_background_color" DEFAULT 'white',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'default',
  	"headline" varchar,
  	"text" varchar,
  	"background_image_id" integer,
  	"button_type" "l_t" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_archive" "l_ar",
  	"button_label" varchar,
  	"button_appearance" "l_ap" DEFAULT 'primary',
  	"button_track_clicks" boolean,
  	"button_tracking_event_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_gallery_variant" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_gallery_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"generate_schema" boolean DEFAULT true,
  	"layout" "enum__pages_v_blocks_faq_layout" DEFAULT 'accordion',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"subtitle" varchar,
  	"media_id" integer,
  	"overlay_opacity" "enum__pages_v_blocks_sticky_media_overlay_opacity" DEFAULT '50',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_masonry_grid_tabs_card_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_masonry_grid_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"background_media_id" integer,
  	"size" "enum__pages_v_blocks_masonry_grid_audience_cards_size" DEFAULT 'large',
  	"theme" "th" DEFAULT 'dark',
  	"link_style" "ls" DEFAULT 'default',
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_masonry_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_masonry_grid_variant" DEFAULT 'benefits',
  	"badge" varchar,
  	"heading" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum__pages_v_blocks_masonry_grid_background_color" DEFAULT 'white',
  	"highlight_card_title" varchar,
  	"highlight_card_description" varchar,
  	"highlight_card_text_tone" "tt" DEFAULT 'light',
  	"highlight_card_background_media_id" integer,
  	"highlight_card_link_type" "l_t" DEFAULT 'reference',
  	"highlight_card_link_new_tab" boolean,
  	"highlight_card_link_url" varchar,
  	"highlight_card_link_archive" "l_ar",
  	"highlight_card_link_label" varchar,
  	"highlight_card_link_track_clicks" boolean,
  	"highlight_card_link_tracking_event_name" varchar,
  	"tabs_card_text_tone" "tt" DEFAULT 'dark',
  	"tabs_card_background_media_id" integer,
  	"cashflow_card_title" varchar,
  	"cashflow_card_description" varchar,
  	"cashflow_card_text_tone" "tt" DEFAULT 'light',
  	"cashflow_card_background_media_id" integer,
  	"cashflow_card_link_type" "l_t" DEFAULT 'reference',
  	"cashflow_card_link_new_tab" boolean,
  	"cashflow_card_link_url" varchar,
  	"cashflow_card_link_archive" "l_ar",
  	"cashflow_card_link_label" varchar,
  	"cashflow_card_link_track_clicks" boolean,
  	"cashflow_card_link_tracking_event_name" varchar,
  	"video_card_title" varchar,
  	"video_card_description" varchar,
  	"video_card_text_tone" "tt" DEFAULT 'light',
  	"video_card_background_media_id" integer,
  	"video_card_link_type" "l_t" DEFAULT 'reference',
  	"video_card_link_new_tab" boolean,
  	"video_card_link_url" varchar,
  	"video_card_link_archive" "l_ar",
  	"video_card_link_track_clicks" boolean,
  	"video_card_link_tracking_event_name" varchar,
  	"section_tone" "enum__pages_v_blocks_masonry_grid_section_tone" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"card_style" "enum__pages_v_blocks_slider_card_style" DEFAULT 'compact',
  	"source_collection" "enum__pages_v_blocks_slider_source_collection" DEFAULT 'posts',
  	"badge_field" "enum__pages_v_blocks_slider_badge_field" DEFAULT 'none',
  	"static_badge" varchar,
  	"header_eyebrow" varchar,
  	"header_heading" varchar,
  	"header_description" varchar,
  	"items_limit" numeric DEFAULT 6,
  	"sort_by" "enum__pages_v_blocks_slider_sort_by" DEFAULT 'publishedAt',
  	"compact_fields_show_image" boolean DEFAULT true,
  	"featured_fields_image_position" "ip" DEFAULT 'right',
  	"featured_fields_show_fallback_image" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_big_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_level" "enum__pages_v_blocks_big_text_heading_level" DEFAULT 'h2',
  	"line_one" varchar,
  	"line_one_highlight" varchar,
  	"line_two" varchar,
  	"line_two_highlight" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_step_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"description" varchar,
  	"subtitle" varchar,
  	"icon_id" integer,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_step_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_step_section_layout" DEFAULT 'cards',
  	"card_display" "enum__pages_v_blocks_step_section_card_display" DEFAULT 'number',
  	"background_color" "enum__pages_v_blocks_step_section_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"intro" jsonb,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"cta_position" "enum__pages_v_blocks_step_section_cta_position" DEFAULT 'center',
  	"flow_container_style" "enum__pages_v_blocks_step_section_flow_container_style" DEFAULT 'none',
  	"flow_description" varchar,
  	"result_title" varchar,
  	"result_description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_cards_top_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"body" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'outline',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" "enum__pages_v_blocks_info_cards_background_color" DEFAULT 'muted',
  	"tagline" varchar,
  	"title" varchar,
  	"content_below_cards" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_services_services_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_education_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_education_programs_icon",
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"level" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coaching_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_coaching_benefits_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coaching_coaches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"available" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_coaching" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"benefits_subheading" varchar DEFAULT 'What You''ll Gain',
  	"coaches_subheading" varchar DEFAULT 'Our Lead Coaches',
  	"cta_text" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"form_id" integer,
  	"email_label" varchar DEFAULT 'Email Us',
  	"email" varchar,
  	"phone_label" varchar DEFAULT 'Call Us',
  	"phone" varchar,
  	"address_label" varchar DEFAULT 'Visit Us',
  	"address" varchar,
  	"social_label" varchar DEFAULT 'Follow Us',
  	"social_url" varchar,
  	"social_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title_line1" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_talents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"layout" "enum__pages_v_blocks_featured_talents_layout" DEFAULT 'carousel',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"image_id" integer,
  	"bio" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_page_settings_og_image_id" integer,
  	"version_page_settings_schema_type" "enum__pages_v_version_page_settings_schema_type" DEFAULT 'WebPage',
  	"version_page_settings_include_breadcrumbs" boolean DEFAULT true,
  	"version_page_settings_include_organization" boolean DEFAULT true,
  	"version_page_settings_no_index" boolean DEFAULT false,
  	"version_page_settings_no_follow" boolean DEFAULT false,
  	"version_page_settings_exclude_from_sitemap" boolean DEFAULT false,
  	"version_page_settings_exclude_from_l_l_m" boolean DEFAULT false,
  	"version_page_settings_canonical_url" varchar,
  	"version_page_settings_priority" numeric DEFAULT 0.5,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_template" "enum__pages_v_version_template" DEFAULT 'default',
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_badge" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_subtext" varchar,
  	"version_hero_rich_text" jsonb,
  	"version_hero_headline_highlight" varchar,
  	"version_hero_media_id" integer,
  	"version_hero_hero_logo_id" integer,
  	"version_hero_background_style" "enum__pages_v_version_hero_background_style" DEFAULT 'dark',
  	"version_hero_alignment" "enum__pages_v_version_hero_alignment" DEFAULT 'left',
  	"version_hero_right_side" "enum__pages_v_version_hero_right_side" DEFAULT 'image',
  	"version_hero_show_scroll_indicator" boolean DEFAULT true,
  	"version_hero_video_id" integer,
  	"version_hero_video_url" varchar,
  	"version_hero_poster_image_id" integer,
  	"version_hero_muted" boolean DEFAULT true,
  	"version_hero_loop" boolean DEFAULT true,
  	"version_hero_auto_play" boolean DEFAULT true,
  	"version_hero_plays_inline" boolean DEFAULT true,
  	"version_page_settings_meta_title" varchar,
  	"version_page_settings_meta_description" varchar,
  	"version_page_settings_meta_keywords" varchar,
  	"version_page_settings_og_title" varchar,
  	"version_page_settings_og_description" varchar,
  	"version_page_settings_schema_markup" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "posts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_posts_blocks_content_layout" DEFAULT 'default',
  	"background_color" "enum_posts_blocks_content_background_color" DEFAULT 'white',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "posts_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_gallery_variant" DEFAULT 'grid',
  	"columns" "enum_posts_blocks_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "posts_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"generate_schema" boolean DEFAULT true,
  	"layout" "enum_posts_blocks_faq_layout" DEFAULT 'accordion',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_cta_variant" DEFAULT 'default',
  	"headline" varchar,
  	"text" varchar,
  	"background_image_id" integer,
  	"button_type" "l_t" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_archive" "l_ar",
  	"button_label" varchar,
  	"button_appearance" "l_ap" DEFAULT 'primary',
  	"button_track_clicks" boolean,
  	"button_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"page_settings_og_image_id" integer,
  	"page_settings_schema_type" "enum_posts_page_settings_schema_type" DEFAULT 'WebPage',
  	"page_settings_custom_schema" varchar,
  	"page_settings_no_index" boolean DEFAULT false,
  	"page_settings_no_follow" boolean DEFAULT false,
  	"page_settings_exclude_from_sitemap" boolean DEFAULT false,
  	"page_settings_exclude_from_l_l_m" boolean DEFAULT false,
  	"page_settings_canonical_url" varchar,
  	"page_settings_priority" numeric DEFAULT 0.5,
  	"slug" varchar,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"page_settings_meta_title" varchar,
  	"page_settings_meta_description" varchar,
  	"page_settings_meta_keywords" varchar,
  	"page_settings_og_title" varchar,
  	"page_settings_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_posts_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__posts_v_blocks_content_layout" DEFAULT 'default',
  	"background_color" "enum__posts_v_blocks_content_background_color" DEFAULT 'white',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_gallery_variant" DEFAULT 'grid',
  	"columns" "enum__posts_v_blocks_gallery_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"generate_schema" boolean DEFAULT true,
  	"layout" "enum__posts_v_blocks_faq_layout" DEFAULT 'accordion',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_cta_variant" DEFAULT 'default',
  	"headline" varchar,
  	"text" varchar,
  	"background_image_id" integer,
  	"button_type" "l_t" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_archive" "l_ar",
  	"button_label" varchar,
  	"button_appearance" "l_ap" DEFAULT 'primary',
  	"button_track_clicks" boolean,
  	"button_tracking_event_name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_featured_image_id" integer,
  	"version_page_settings_og_image_id" integer,
  	"version_page_settings_schema_type" "enum__posts_v_version_page_settings_schema_type" DEFAULT 'WebPage',
  	"version_page_settings_custom_schema" varchar,
  	"version_page_settings_no_index" boolean DEFAULT false,
  	"version_page_settings_no_follow" boolean DEFAULT false,
  	"version_page_settings_exclude_from_sitemap" boolean DEFAULT false,
  	"version_page_settings_exclude_from_l_l_m" boolean DEFAULT false,
  	"version_page_settings_canonical_url" varchar,
  	"version_page_settings_priority" numeric DEFAULT 0.5,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_page_settings_meta_title" varchar,
  	"version_page_settings_meta_description" varchar,
  	"version_page_settings_meta_keywords" varchar,
  	"version_page_settings_og_title" varchar,
  	"version_page_settings_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "talents_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "talents_measurements_hair" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_talents_measurements_hair",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "talents_measurements_eyes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_talents_measurements_eyes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "talents_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_talents_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "talents_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "talents_experience_locales" (
  	"title" varchar,
  	"year" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "talents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"featured_image_id" integer,
  	"measurements_height" varchar,
  	"measurements_bust" varchar,
  	"measurements_waist" varchar,
  	"measurements_hips" varchar,
  	"measurements_shoe_size" varchar,
  	"measurements_confection_size" varchar,
  	"booking_email" varchar,
  	"social_media_instagram" varchar,
  	"social_media_tiktok" varchar,
  	"social_media_website" varchar,
  	"sedcard_image1_id" integer,
  	"sedcard_image2_id" integer,
  	"sedcard_image3_id" integer,
  	"sedcard_image4_id" integer,
  	"sedcard_template" "enum_talents_sedcard_template" DEFAULT 'classic',
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"card_style" "enum_talents_card_style",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_talents_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "talents_locales" (
  	"category" "enum_talents_category" DEFAULT 'dancer',
  	"bio" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "talents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"talent_skills_id" integer
  );
  
  CREATE TABLE "_talents_v_version_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_talents_v_version_measurements_hair" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__talents_v_version_measurements_hair",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_talents_v_version_measurements_eyes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__talents_v_version_measurements_eyes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_talents_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__talents_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_talents_v_version_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_talents_v_version_experience_locales" (
  	"title" varchar,
  	"year" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_talents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_featured_image_id" integer,
  	"version_measurements_height" varchar,
  	"version_measurements_bust" varchar,
  	"version_measurements_waist" varchar,
  	"version_measurements_hips" varchar,
  	"version_measurements_shoe_size" varchar,
  	"version_measurements_confection_size" varchar,
  	"version_booking_email" varchar,
  	"version_social_media_instagram" varchar,
  	"version_social_media_tiktok" varchar,
  	"version_social_media_website" varchar,
  	"version_sedcard_image1_id" integer,
  	"version_sedcard_image2_id" integer,
  	"version_sedcard_image3_id" integer,
  	"version_sedcard_image4_id" integer,
  	"version_sedcard_template" "enum__talents_v_version_sedcard_template" DEFAULT 'classic',
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_card_style" "enum__talents_v_version_card_style",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__talents_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__talents_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_talents_v_locales" (
  	"version_category" "enum__talents_v_version_category" DEFAULT 'dancer',
  	"version_bio" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_talents_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"talent_skills_id" integer
  );
  
  CREATE TABLE "talent_skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"skill_group" "enum_talent_skills_skill_group" DEFAULT 'other',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "talent_skills_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_talent_selection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'talentSelection' NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_talent_selection_locales" (
  	"label" varchar DEFAULT 'Ausgewählte Talente',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"form_category" "enum_forms_form_category" DEFAULT 'contact',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"category" "enum_form_submissions_category",
  	"locale" "enum_form_submissions_locale" DEFAULT 'de',
  	"read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"talents_id" integer,
  	"talent_skills_id" integer,
  	"users_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_archive" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"posts_per_page" numeric DEFAULT 12,
  	"show_categories" boolean DEFAULT true,
  	"show_featured" boolean DEFAULT true,
  	"show_cta" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "posts_archive_locales" (
  	"hero_headline" varchar DEFAULT 'Blog',
  	"hero_description" varchar,
  	"cta_headline" varchar,
  	"cta_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_talents_archive_blocks_content_layout" DEFAULT 'default',
  	"background_color" "enum_talents_archive_blocks_content_background_color" DEFAULT 'white',
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_talents_archive_blocks_cta_variant" DEFAULT 'default',
  	"headline" varchar NOT NULL,
  	"text" varchar,
  	"background_image_id" integer,
  	"button_type" "l_t" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_archive" "l_ar",
  	"button_label" varchar NOT NULL,
  	"button_appearance" "l_ap" DEFAULT 'primary',
  	"button_track_clicks" boolean,
  	"button_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_talents_archive_blocks_gallery_variant" DEFAULT 'grid',
  	"columns" "enum_talents_archive_blocks_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"generate_schema" boolean DEFAULT true,
  	"layout" "enum_talents_archive_blocks_faq_layout" DEFAULT 'accordion',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_sticky_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"subtitle" varchar,
  	"media_id" integer NOT NULL,
  	"overlay_opacity" "enum_talents_archive_blocks_sticky_media_overlay_opacity" DEFAULT '50',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_masonry_grid_tabs_card_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_masonry_grid_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"background_media_id" integer,
  	"size" "enum_talents_archive_blocks_masonry_grid_audience_cards_size" DEFAULT 'large',
  	"theme" "th" DEFAULT 'dark',
  	"link_style" "ls" DEFAULT 'default',
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_masonry_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_talents_archive_blocks_masonry_grid_variant" DEFAULT 'benefits',
  	"badge" varchar,
  	"heading" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum_talents_archive_blocks_masonry_grid_background_color" DEFAULT 'white',
  	"highlight_card_title" varchar,
  	"highlight_card_description" varchar,
  	"highlight_card_text_tone" "tt" DEFAULT 'light',
  	"highlight_card_background_media_id" integer,
  	"highlight_card_link_type" "l_t" DEFAULT 'reference',
  	"highlight_card_link_new_tab" boolean,
  	"highlight_card_link_url" varchar,
  	"highlight_card_link_archive" "l_ar",
  	"highlight_card_link_label" varchar,
  	"highlight_card_link_track_clicks" boolean,
  	"highlight_card_link_tracking_event_name" varchar,
  	"tabs_card_text_tone" "tt" DEFAULT 'dark',
  	"tabs_card_background_media_id" integer,
  	"cashflow_card_title" varchar,
  	"cashflow_card_description" varchar,
  	"cashflow_card_text_tone" "tt" DEFAULT 'light',
  	"cashflow_card_background_media_id" integer,
  	"cashflow_card_link_type" "l_t" DEFAULT 'reference',
  	"cashflow_card_link_new_tab" boolean,
  	"cashflow_card_link_url" varchar,
  	"cashflow_card_link_archive" "l_ar",
  	"cashflow_card_link_label" varchar,
  	"cashflow_card_link_track_clicks" boolean,
  	"cashflow_card_link_tracking_event_name" varchar,
  	"video_card_title" varchar,
  	"video_card_description" varchar,
  	"video_card_text_tone" "tt" DEFAULT 'light',
  	"video_card_background_media_id" integer,
  	"video_card_link_type" "l_t" DEFAULT 'reference',
  	"video_card_link_new_tab" boolean,
  	"video_card_link_url" varchar,
  	"video_card_link_archive" "l_ar",
  	"video_card_link_track_clicks" boolean,
  	"video_card_link_tracking_event_name" varchar,
  	"section_tone" "enum_talents_archive_blocks_masonry_grid_section_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"card_style" "enum_talents_archive_blocks_slider_card_style" DEFAULT 'compact' NOT NULL,
  	"source_collection" "enum_talents_archive_blocks_slider_source_collection" DEFAULT 'posts' NOT NULL,
  	"badge_field" "enum_talents_archive_blocks_slider_badge_field" DEFAULT 'none',
  	"static_badge" varchar,
  	"header_eyebrow" varchar,
  	"header_heading" varchar NOT NULL,
  	"header_description" varchar,
  	"items_limit" numeric DEFAULT 6,
  	"sort_by" "enum_talents_archive_blocks_slider_sort_by" DEFAULT 'publishedAt',
  	"compact_fields_show_image" boolean DEFAULT true,
  	"featured_fields_image_position" "ip" DEFAULT 'right',
  	"featured_fields_show_fallback_image" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_big_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_level" "enum_talents_archive_blocks_big_text_heading_level" DEFAULT 'h2',
  	"line_one" varchar NOT NULL,
  	"line_one_highlight" varchar,
  	"line_two" varchar,
  	"line_two_highlight" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_step_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"subtitle" varchar,
  	"icon_id" integer,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "talents_archive_blocks_step_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_talents_archive_blocks_step_section_layout" DEFAULT 'cards',
  	"card_display" "enum_talents_archive_blocks_step_section_card_display" DEFAULT 'number',
  	"background_color" "enum_talents_archive_blocks_step_section_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"intro" jsonb,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar NOT NULL,
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"cta_position" "enum_talents_archive_blocks_step_section_cta_position" DEFAULT 'center',
  	"flow_container_style" "enum_talents_archive_blocks_step_section_flow_container_style" DEFAULT 'none',
  	"flow_description" varchar,
  	"result_title" varchar,
  	"result_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_info_cards_top_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar NOT NULL,
  	"link_appearance" "l_ap" DEFAULT 'outline',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_info_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_talents_archive_blocks_info_cards_background_color" DEFAULT 'muted',
  	"tagline" varchar,
  	"title" varchar NOT NULL,
  	"content_below_cards" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_talents_archive_blocks_services_services_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_education_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_talents_archive_blocks_education_programs_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"duration" varchar,
  	"level" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_coaching_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_talents_archive_blocks_coaching_benefits_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_coaching_coaches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"available" boolean DEFAULT true
  );
  
  CREATE TABLE "talents_archive_blocks_coaching" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"benefits_subheading" varchar DEFAULT 'What You''ll Gain',
  	"coaches_subheading" varchar DEFAULT 'Our Lead Coaches',
  	"cta_text" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar NOT NULL,
  	"form_id" integer NOT NULL,
  	"email_label" varchar DEFAULT 'Email Us',
  	"email" varchar,
  	"phone_label" varchar DEFAULT 'Call Us',
  	"phone" varchar,
  	"address_label" varchar DEFAULT 'Visit Us',
  	"address" varchar,
  	"social_label" varchar DEFAULT 'Follow Us',
  	"social_url" varchar,
  	"social_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title_line1" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"cta_type" "l_t" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_archive" "l_ar",
  	"cta_label" varchar,
  	"cta_appearance" "l_ap" DEFAULT 'primary',
  	"cta_track_clicks" boolean,
  	"cta_tracking_event_name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_featured_talents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar,
  	"layout" "enum_talents_archive_blocks_featured_talents_layout" DEFAULT 'carousel',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"image_id" integer,
  	"bio" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"overline" varchar,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_cta_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_archive" "l_ar",
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_cta_button_locales" (
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"showcase_enabled" boolean DEFAULT true,
  	"showcase_mode" "enum_talents_archive_showcase_mode" DEFAULT 'featured',
  	"showcase_max_slides" numeric DEFAULT 8,
  	"showcase_autoplay" boolean DEFAULT true,
  	"hero_image_id" integer,
  	"show_filters" boolean DEFAULT true,
  	"show_hair_filter" boolean DEFAULT true,
  	"show_eye_filter" boolean DEFAULT true,
  	"show_skills_filter" boolean DEFAULT true,
  	"show_cta" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "talents_archive_locales" (
  	"hero_headline" varchar DEFAULT 'Unsere Talente',
  	"hero_description" varchar,
  	"filter_labels_all" varchar DEFAULT 'Alle',
  	"filter_labels_dancers" varchar DEFAULT 'Tänzer',
  	"filter_labels_models" varchar DEFAULT 'Models',
  	"cta_headline" varchar DEFAULT 'Du bist ein Talent?',
  	"cta_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "talents_archive_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"talents_id" integer,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "sedcard_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_frontend_download" boolean DEFAULT false,
  	"default_template" "enum_sedcard_settings_default_template" DEFAULT 'classic',
  	"agency_logo_id" integer,
  	"footer_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "form_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_form_id" integer,
  	"enable_turnstile" boolean DEFAULT false,
  	"enable_auto_reply" boolean DEFAULT false,
  	"auto_reply_email_field" varchar DEFAULT 'email',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "form_settings_locales" (
  	"auto_reply_subject" varchar,
  	"auto_reply_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_card_nav_items_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar NOT NULL,
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "header_card_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"label_link_type" "l_t" DEFAULT 'reference',
  	"label_link_new_tab" boolean,
  	"label_link_url" varchar,
  	"label_link_archive" "l_ar",
  	"label_link_track_clicks" boolean,
  	"label_link_tracking_event_name" varchar,
  	"media_display" "enum_header_card_nav_items_media_display" DEFAULT 'image',
  	"image_id" integer
  );
  
  CREATE TABLE "header_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar NOT NULL,
  	"link_appearance" "l_ap" DEFAULT 'primary',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"language_switcher_placement" "enum_header_language_switcher_placement" DEFAULT 'header',
  	"theme_toggle_placement" "enum_header_theme_toggle_placement" DEFAULT 'header',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"posts_id" integer,
  	"talents_id" integer
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_bottom_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "footer_bottom_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"contact_show_contact" boolean DEFAULT true,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"show_cookie_settings" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"description" varchar,
  	"contact_title" varchar DEFAULT 'Kontakt',
  	"contact_address" varchar,
  	"copyright" varchar DEFAULT '© {year} Meine Agentur. Alle Rechte vorbehalten.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seo_social_media_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_seo_social_media_same_as_platform",
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"favicon_id" integer,
  	"apple_touch_icon_id" integer,
  	"business_info_business_type" "enum_seo_business_info_business_type" DEFAULT 'ProfessionalService',
  	"business_info_founding_date" varchar DEFAULT '2024',
  	"business_info_price_range" "enum_seo_business_info_price_range" DEFAULT '€€',
  	"contact_info_email" varchar,
  	"contact_info_telephone" varchar,
  	"contact_info_street_address" varchar,
  	"contact_info_address_locality" varchar,
  	"contact_info_postal_code" varchar,
  	"contact_info_address_country" varchar DEFAULT 'DE',
  	"social_media_website" varchar,
  	"social_media_logo_id" integer,
  	"ai_and_crawlers_allow_a_i_training" boolean DEFAULT true,
  	"ai_and_crawlers_llm_txt_enabled" boolean DEFAULT true,
  	"ai_and_crawlers_llm_txt_content_update_schedule" "enum_seo_ai_and_crawlers_llm_txt_content_update_schedule" DEFAULT 'weekly',
  	"ai_and_crawlers_llm_txt_content_content_areas_text" varchar,
  	"ai_and_crawlers_robots_extra_rules" varchar,
  	"sitemaps_indexing_enabled" boolean DEFAULT true,
  	"sitemaps_indexing_include_pages" boolean DEFAULT true,
  	"sitemaps_indexing_include_posts" boolean DEFAULT true,
  	"sitemaps_indexing_change_frequency" "enum_seo_sitemaps_indexing_change_frequency" DEFAULT 'weekly',
  	"sitemaps_indexing_priority" numeric DEFAULT 0.5,
  	"sitemaps_indexing_exclude_paths_text" varchar,
  	"analytics_rybbit_enabled" boolean DEFAULT false,
  	"analytics_rybbit_site_id" varchar,
  	"analytics_rybbit_script_url" varchar DEFAULT 'https://app.rybbit.io/api/script.js',
  	"analytics_google_analytics_enabled" boolean DEFAULT false,
  	"analytics_google_analytics_measurement_id" varchar,
  	"analytics_google_analytics_require_consent" boolean DEFAULT true,
  	"analytics_google_tag_manager_enabled" boolean DEFAULT false,
  	"analytics_google_tag_manager_container_id" varchar,
  	"schema_templates_website_schema_enable_search" boolean DEFAULT true,
  	"schema_templates_website_schema_search_endpoint" varchar DEFAULT '/suche?q={search_term_string}',
  	"schema_templates_website_schema_language" "enum_seo_schema_templates_website_schema_language" DEFAULT 'de-DE',
  	"schema_templates_include_breadcrumbs" boolean DEFAULT true,
  	"schema_templates_include_organization" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_locales" (
  	"business_info_name" varchar DEFAULT 'Meine Agentur' NOT NULL,
  	"business_info_description" varchar NOT NULL,
  	"ai_and_crawlers_llm_txt_content_citation_policy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "theme_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_theme" "enum_theme_settings_default_theme" DEFAULT 'dark' NOT NULL,
  	"color_preset" "enum_theme_settings_color_preset" DEFAULT 'deleyna-dark',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cookie_banner" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"trigger_placement" "enum_cookie_banner_trigger_placement" DEFAULT 'floating' NOT NULL,
  	"policies_privacy_policy_id" integer,
  	"policies_imprint_id" integer,
  	"analytics_enabled" boolean DEFAULT true,
  	"marketing_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cookie_banner_locales" (
  	"banner_title" varchar DEFAULT 'Cookie-Einstellungen' NOT NULL,
  	"banner_description" varchar DEFAULT 'Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. Du kannst deine Einstellungen jederzeit anpassen.' NOT NULL,
  	"banner_accept_all_label" varchar DEFAULT 'Alle akzeptieren' NOT NULL,
  	"banner_reject_label" varchar DEFAULT 'Nur notwendige' NOT NULL,
  	"banner_settings_label" varchar DEFAULT 'Einstellungen' NOT NULL,
  	"banner_save_label" varchar DEFAULT 'Auswahl speichern' NOT NULL,
  	"modal_title" varchar DEFAULT 'Cookie-Einstellungen verwalten' NOT NULL,
  	"modal_description" varchar DEFAULT 'Hier kannst du deine Cookie-Präferenzen anpassen. Notwendige Cookies sind für die Grundfunktionen der Website erforderlich.' NOT NULL,
  	"policies_privacy_policy_label" varchar DEFAULT 'Datenschutzerklärung' NOT NULL,
  	"policies_imprint_label" varchar DEFAULT 'Impressum',
  	"necessary_label" varchar DEFAULT 'Notwendig' NOT NULL,
  	"necessary_description" varchar DEFAULT 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.' NOT NULL,
  	"analytics_label" varchar DEFAULT 'Analyse' NOT NULL,
  	"analytics_description" varchar DEFAULT 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.' NOT NULL,
  	"marketing_label" varchar DEFAULT 'Marketing' NOT NULL,
  	"marketing_description" varchar DEFAULT 'Diese Cookies werden verwendet, um Werbung relevanter für dich zu machen.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unread_form_submissions_de" numeric DEFAULT 0,
  	"unread_form_submissions_en" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_features" ADD CONSTRAINT "pages_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_media" ADD CONSTRAINT "pages_blocks_sticky_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_media" ADD CONSTRAINT "pages_blocks_sticky_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid_tabs_card_tabs" ADD CONSTRAINT "pages_blocks_masonry_grid_tabs_card_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "pages_blocks_masonry_grid_audience_cards_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "pages_blocks_masonry_grid_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid" ADD CONSTRAINT "pages_blocks_masonry_grid_highlight_card_background_media_id_media_id_fk" FOREIGN KEY ("highlight_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid" ADD CONSTRAINT "pages_blocks_masonry_grid_tabs_card_background_media_id_media_id_fk" FOREIGN KEY ("tabs_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid" ADD CONSTRAINT "pages_blocks_masonry_grid_cashflow_card_background_media_id_media_id_fk" FOREIGN KEY ("cashflow_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid" ADD CONSTRAINT "pages_blocks_masonry_grid_video_card_background_media_id_media_id_fk" FOREIGN KEY ("video_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_masonry_grid" ADD CONSTRAINT "pages_blocks_masonry_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slider" ADD CONSTRAINT "pages_blocks_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_big_text" ADD CONSTRAINT "pages_blocks_big_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_section_steps" ADD CONSTRAINT "pages_blocks_step_section_steps_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_section_steps" ADD CONSTRAINT "pages_blocks_step_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_step_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_step_section" ADD CONSTRAINT "pages_blocks_step_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_cards_top_cards" ADD CONSTRAINT "pages_blocks_info_cards_top_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_cards_cards" ADD CONSTRAINT "pages_blocks_info_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_cards_cards" ADD CONSTRAINT "pages_blocks_info_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_cards" ADD CONSTRAINT "pages_blocks_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_services" ADD CONSTRAINT "pages_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_education_programs" ADD CONSTRAINT "pages_blocks_education_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_education" ADD CONSTRAINT "pages_blocks_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coaching_benefits" ADD CONSTRAINT "pages_blocks_coaching_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coaching_coaches" ADD CONSTRAINT "pages_blocks_coaching_coaches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_coaching" ADD CONSTRAINT "pages_blocks_coaching_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_talents" ADD CONSTRAINT "pages_blocks_featured_talents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_page_settings_og_image_id_media_id_fk" FOREIGN KEY ("page_settings_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_hero_logo_id_media_id_fk" FOREIGN KEY ("hero_hero_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_poster_image_id_media_id_fk" FOREIGN KEY ("hero_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_features" ADD CONSTRAINT "_pages_v_version_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_media" ADD CONSTRAINT "_pages_v_blocks_sticky_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_media" ADD CONSTRAINT "_pages_v_blocks_sticky_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid_tabs_card_tabs" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_tabs_card_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_audience_cards_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_highlight_card_background_media_id_media_id_fk" FOREIGN KEY ("highlight_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_tabs_card_background_media_id_media_id_fk" FOREIGN KEY ("tabs_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_cashflow_card_background_media_id_media_id_fk" FOREIGN KEY ("cashflow_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_video_card_background_media_id_media_id_fk" FOREIGN KEY ("video_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_masonry_grid" ADD CONSTRAINT "_pages_v_blocks_masonry_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slider" ADD CONSTRAINT "_pages_v_blocks_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_big_text" ADD CONSTRAINT "_pages_v_blocks_big_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_step_section_steps" ADD CONSTRAINT "_pages_v_blocks_step_section_steps_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_step_section_steps" ADD CONSTRAINT "_pages_v_blocks_step_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_step_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_step_section" ADD CONSTRAINT "_pages_v_blocks_step_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_cards_top_cards" ADD CONSTRAINT "_pages_v_blocks_info_cards_top_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ADD CONSTRAINT "_pages_v_blocks_info_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ADD CONSTRAINT "_pages_v_blocks_info_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_cards" ADD CONSTRAINT "_pages_v_blocks_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_services" ADD CONSTRAINT "_pages_v_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_education_programs" ADD CONSTRAINT "_pages_v_blocks_education_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_education" ADD CONSTRAINT "_pages_v_blocks_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coaching_benefits" ADD CONSTRAINT "_pages_v_blocks_coaching_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coaching_coaches" ADD CONSTRAINT "_pages_v_blocks_coaching_coaches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_coaching" ADD CONSTRAINT "_pages_v_blocks_coaching_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_stats" ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_talents" ADD CONSTRAINT "_pages_v_blocks_featured_talents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_page_settings_og_image_id_media_id_fk" FOREIGN KEY ("version_page_settings_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_hero_logo_id_media_id_fk" FOREIGN KEY ("version_hero_hero_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_poster_image_id_media_id_fk" FOREIGN KEY ("version_hero_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_content" ADD CONSTRAINT "posts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_gallery_images" ADD CONSTRAINT "posts_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_gallery_images" ADD CONSTRAINT "posts_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_gallery" ADD CONSTRAINT "posts_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq_items" ADD CONSTRAINT "posts_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq" ADD CONSTRAINT "posts_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta" ADD CONSTRAINT "posts_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta" ADD CONSTRAINT "posts_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_page_settings_og_image_id_media_id_fk" FOREIGN KEY ("page_settings_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content" ADD CONSTRAINT "_posts_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_gallery_images" ADD CONSTRAINT "_posts_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_gallery_images" ADD CONSTRAINT "_posts_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_gallery" ADD CONSTRAINT "_posts_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq_items" ADD CONSTRAINT "_posts_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq" ADD CONSTRAINT "_posts_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta" ADD CONSTRAINT "_posts_v_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta" ADD CONSTRAINT "_posts_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_page_settings_og_image_id_media_id_fk" FOREIGN KEY ("version_page_settings_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_gallery_images" ADD CONSTRAINT "talents_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_gallery_images" ADD CONSTRAINT "talents_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_measurements_hair" ADD CONSTRAINT "talents_measurements_hair_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_measurements_eyes" ADD CONSTRAINT "talents_measurements_eyes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_languages" ADD CONSTRAINT "talents_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_experience" ADD CONSTRAINT "talents_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_experience_locales" ADD CONSTRAINT "talents_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_sedcard_image1_id_media_id_fk" FOREIGN KEY ("sedcard_image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_sedcard_image2_id_media_id_fk" FOREIGN KEY ("sedcard_image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_sedcard_image3_id_media_id_fk" FOREIGN KEY ("sedcard_image3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_sedcard_image4_id_media_id_fk" FOREIGN KEY ("sedcard_image4_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_locales" ADD CONSTRAINT "talents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_rels" ADD CONSTRAINT "talents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_rels" ADD CONSTRAINT "talents_rels_talent_skills_fk" FOREIGN KEY ("talent_skills_id") REFERENCES "public"."talent_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_gallery_images" ADD CONSTRAINT "_talents_v_version_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v_version_gallery_images" ADD CONSTRAINT "_talents_v_version_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_measurements_hair" ADD CONSTRAINT "_talents_v_version_measurements_hair_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_measurements_eyes" ADD CONSTRAINT "_talents_v_version_measurements_eyes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_languages" ADD CONSTRAINT "_talents_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_experience" ADD CONSTRAINT "_talents_v_version_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_version_experience_locales" ADD CONSTRAINT "_talents_v_version_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_talents_v_version_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_parent_id_talents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_sedcard_image1_id_media_id_fk" FOREIGN KEY ("version_sedcard_image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_sedcard_image2_id_media_id_fk" FOREIGN KEY ("version_sedcard_image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_sedcard_image3_id_media_id_fk" FOREIGN KEY ("version_sedcard_image3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_sedcard_image4_id_media_id_fk" FOREIGN KEY ("version_sedcard_image4_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v_locales" ADD CONSTRAINT "_talents_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_rels" ADD CONSTRAINT "_talents_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_talents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_talents_v_rels" ADD CONSTRAINT "_talents_v_rels_talent_skills_fk" FOREIGN KEY ("talent_skills_id") REFERENCES "public"."talent_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talent_skills_locales" ADD CONSTRAINT "talent_skills_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talent_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_talent_selection" ADD CONSTRAINT "forms_blocks_talent_selection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_talent_selection_locales" ADD CONSTRAINT "forms_blocks_talent_selection_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_talent_selection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_talent_skills_fk" FOREIGN KEY ("talent_skills_id") REFERENCES "public"."talent_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_archive_locales" ADD CONSTRAINT "posts_archive_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_content" ADD CONSTRAINT "talents_archive_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_cta" ADD CONSTRAINT "talents_archive_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_cta" ADD CONSTRAINT "talents_archive_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_gallery_images" ADD CONSTRAINT "talents_archive_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_gallery_images" ADD CONSTRAINT "talents_archive_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_gallery" ADD CONSTRAINT "talents_archive_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_faq_items" ADD CONSTRAINT "talents_archive_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_faq" ADD CONSTRAINT "talents_archive_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_sticky_media" ADD CONSTRAINT "talents_archive_blocks_sticky_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_sticky_media" ADD CONSTRAINT "talents_archive_blocks_sticky_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid_tabs_card_tabs" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_tabs_card_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_audience_cards_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid_audience_cards" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_masonry_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_highlight_card_background_media_id_media_id_fk" FOREIGN KEY ("highlight_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_tabs_card_background_media_id_media_id_fk" FOREIGN KEY ("tabs_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_cashflow_card_background_media_id_media_id_fk" FOREIGN KEY ("cashflow_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_video_card_background_media_id_media_id_fk" FOREIGN KEY ("video_card_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_masonry_grid" ADD CONSTRAINT "talents_archive_blocks_masonry_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_slider" ADD CONSTRAINT "talents_archive_blocks_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_form_block" ADD CONSTRAINT "talents_archive_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_form_block" ADD CONSTRAINT "talents_archive_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_big_text" ADD CONSTRAINT "talents_archive_blocks_big_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_step_section_steps" ADD CONSTRAINT "talents_archive_blocks_step_section_steps_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_step_section_steps" ADD CONSTRAINT "talents_archive_blocks_step_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_step_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_step_section" ADD CONSTRAINT "talents_archive_blocks_step_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_info_cards_top_cards" ADD CONSTRAINT "talents_archive_blocks_info_cards_top_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ADD CONSTRAINT "talents_archive_blocks_info_cards_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ADD CONSTRAINT "talents_archive_blocks_info_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_info_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_info_cards" ADD CONSTRAINT "talents_archive_blocks_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_services_services" ADD CONSTRAINT "talents_archive_blocks_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_services" ADD CONSTRAINT "talents_archive_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_education_programs" ADD CONSTRAINT "talents_archive_blocks_education_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_education" ADD CONSTRAINT "talents_archive_blocks_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_coaching_benefits" ADD CONSTRAINT "talents_archive_blocks_coaching_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_coaching_coaches" ADD CONSTRAINT "talents_archive_blocks_coaching_coaches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_coaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_coaching" ADD CONSTRAINT "talents_archive_blocks_coaching_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_contact" ADD CONSTRAINT "talents_archive_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_contact" ADD CONSTRAINT "talents_archive_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_stats_stats" ADD CONSTRAINT "talents_archive_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_stats" ADD CONSTRAINT "talents_archive_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_featured_talents" ADD CONSTRAINT "talents_archive_blocks_featured_talents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_team_members" ADD CONSTRAINT "talents_archive_blocks_team_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_team_members" ADD CONSTRAINT "talents_archive_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_team" ADD CONSTRAINT "talents_archive_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_cta_button" ADD CONSTRAINT "talents_archive_cta_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_cta_button_locales" ADD CONSTRAINT "talents_archive_cta_button_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_cta_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive" ADD CONSTRAINT "talents_archive_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_locales" ADD CONSTRAINT "talents_archive_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_rels" ADD CONSTRAINT "talents_archive_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_rels" ADD CONSTRAINT "talents_archive_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_rels" ADD CONSTRAINT "talents_archive_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_rels" ADD CONSTRAINT "talents_archive_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedcard_settings" ADD CONSTRAINT "sedcard_settings_agency_logo_id_media_id_fk" FOREIGN KEY ("agency_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_settings" ADD CONSTRAINT "form_settings_contact_form_id_forms_id_fk" FOREIGN KEY ("contact_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_settings_locales" ADD CONSTRAINT "form_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_card_nav_items_links" ADD CONSTRAINT "header_card_nav_items_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_card_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_card_nav_items" ADD CONSTRAINT "header_card_nav_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_card_nav_items" ADD CONSTRAINT "header_card_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_cta_buttons" ADD CONSTRAINT "header_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_talents_fk" FOREIGN KEY ("talents_id") REFERENCES "public"."talents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_links" ADD CONSTRAINT "footer_bottom_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_bottom_links" ADD CONSTRAINT "footer_bottom_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_links_locales" ADD CONSTRAINT "footer_bottom_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_bottom_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_social_media_same_as" ADD CONSTRAINT "seo_social_media_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_apple_touch_icon_id_media_id_fk" FOREIGN KEY ("apple_touch_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_social_media_logo_id_media_id_fk" FOREIGN KEY ("social_media_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cookie_banner" ADD CONSTRAINT "cookie_banner_policies_privacy_policy_id_pages_id_fk" FOREIGN KEY ("policies_privacy_policy_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cookie_banner" ADD CONSTRAINT "cookie_banner_policies_imprint_id_pages_id_fk" FOREIGN KEY ("policies_imprint_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cookie_banner_locales" ADD CONSTRAINT "cookie_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cookie_banner"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_links_locale_idx" ON "pages_hero_links" USING btree ("_locale");
  CREATE INDEX "pages_hero_features_order_idx" ON "pages_hero_features" USING btree ("_order");
  CREATE INDEX "pages_hero_features_parent_id_idx" ON "pages_hero_features" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_features_locale_idx" ON "pages_hero_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_locale_idx" ON "pages_blocks_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_background_image_idx" ON "pages_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_locale_idx" ON "pages_blocks_gallery_images" USING btree ("_locale");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_locale_idx" ON "pages_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_sticky_media_order_idx" ON "pages_blocks_sticky_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_media_parent_id_idx" ON "pages_blocks_sticky_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sticky_media_path_idx" ON "pages_blocks_sticky_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_sticky_media_locale_idx" ON "pages_blocks_sticky_media" USING btree ("_locale");
  CREATE INDEX "pages_blocks_sticky_media_media_idx" ON "pages_blocks_sticky_media" USING btree ("media_id");
  CREATE INDEX "pages_blocks_masonry_grid_tabs_card_tabs_order_idx" ON "pages_blocks_masonry_grid_tabs_card_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_masonry_grid_tabs_card_tabs_parent_id_idx" ON "pages_blocks_masonry_grid_tabs_card_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_masonry_grid_tabs_card_tabs_locale_idx" ON "pages_blocks_masonry_grid_tabs_card_tabs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_masonry_grid_audience_cards_order_idx" ON "pages_blocks_masonry_grid_audience_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_masonry_grid_audience_cards_parent_id_idx" ON "pages_blocks_masonry_grid_audience_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_masonry_grid_audience_cards_locale_idx" ON "pages_blocks_masonry_grid_audience_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_masonry_grid_audience_cards_background_medi_idx" ON "pages_blocks_masonry_grid_audience_cards" USING btree ("background_media_id");
  CREATE INDEX "pages_blocks_masonry_grid_order_idx" ON "pages_blocks_masonry_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_masonry_grid_parent_id_idx" ON "pages_blocks_masonry_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_masonry_grid_path_idx" ON "pages_blocks_masonry_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_masonry_grid_locale_idx" ON "pages_blocks_masonry_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_masonry_grid_highlight_card_highlight_card__idx" ON "pages_blocks_masonry_grid" USING btree ("highlight_card_background_media_id");
  CREATE INDEX "pages_blocks_masonry_grid_tabs_card_tabs_card_background_idx" ON "pages_blocks_masonry_grid" USING btree ("tabs_card_background_media_id");
  CREATE INDEX "pages_blocks_masonry_grid_cashflow_card_cashflow_card_ba_idx" ON "pages_blocks_masonry_grid" USING btree ("cashflow_card_background_media_id");
  CREATE INDEX "pages_blocks_masonry_grid_video_card_video_card_backgrou_idx" ON "pages_blocks_masonry_grid" USING btree ("video_card_background_media_id");
  CREATE INDEX "pages_blocks_slider_order_idx" ON "pages_blocks_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_slider_parent_id_idx" ON "pages_blocks_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slider_path_idx" ON "pages_blocks_slider" USING btree ("_path");
  CREATE INDEX "pages_blocks_slider_locale_idx" ON "pages_blocks_slider" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_locale_idx" ON "pages_blocks_form_block" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_big_text_order_idx" ON "pages_blocks_big_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_big_text_parent_id_idx" ON "pages_blocks_big_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_big_text_path_idx" ON "pages_blocks_big_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_big_text_locale_idx" ON "pages_blocks_big_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_section_steps_order_idx" ON "pages_blocks_step_section_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_section_steps_parent_id_idx" ON "pages_blocks_step_section_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_section_steps_locale_idx" ON "pages_blocks_step_section_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_step_section_steps_icon_idx" ON "pages_blocks_step_section_steps" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_step_section_order_idx" ON "pages_blocks_step_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_step_section_parent_id_idx" ON "pages_blocks_step_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_step_section_path_idx" ON "pages_blocks_step_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_step_section_locale_idx" ON "pages_blocks_step_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_info_cards_top_cards_order_idx" ON "pages_blocks_info_cards_top_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_cards_top_cards_parent_id_idx" ON "pages_blocks_info_cards_top_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_cards_top_cards_locale_idx" ON "pages_blocks_info_cards_top_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_info_cards_cards_order_idx" ON "pages_blocks_info_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_cards_cards_parent_id_idx" ON "pages_blocks_info_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_cards_cards_locale_idx" ON "pages_blocks_info_cards_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_info_cards_cards_icon_idx" ON "pages_blocks_info_cards_cards" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_info_cards_order_idx" ON "pages_blocks_info_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_info_cards_parent_id_idx" ON "pages_blocks_info_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_info_cards_path_idx" ON "pages_blocks_info_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_info_cards_locale_idx" ON "pages_blocks_info_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_services_order_idx" ON "pages_blocks_services_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_services_parent_id_idx" ON "pages_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_services_locale_idx" ON "pages_blocks_services_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_locale_idx" ON "pages_blocks_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_education_programs_order_idx" ON "pages_blocks_education_programs" USING btree ("_order");
  CREATE INDEX "pages_blocks_education_programs_parent_id_idx" ON "pages_blocks_education_programs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_education_programs_locale_idx" ON "pages_blocks_education_programs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_education_order_idx" ON "pages_blocks_education" USING btree ("_order");
  CREATE INDEX "pages_blocks_education_parent_id_idx" ON "pages_blocks_education" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_education_path_idx" ON "pages_blocks_education" USING btree ("_path");
  CREATE INDEX "pages_blocks_education_locale_idx" ON "pages_blocks_education" USING btree ("_locale");
  CREATE INDEX "pages_blocks_coaching_benefits_order_idx" ON "pages_blocks_coaching_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_coaching_benefits_parent_id_idx" ON "pages_blocks_coaching_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coaching_benefits_locale_idx" ON "pages_blocks_coaching_benefits" USING btree ("_locale");
  CREATE INDEX "pages_blocks_coaching_coaches_order_idx" ON "pages_blocks_coaching_coaches" USING btree ("_order");
  CREATE INDEX "pages_blocks_coaching_coaches_parent_id_idx" ON "pages_blocks_coaching_coaches" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coaching_coaches_locale_idx" ON "pages_blocks_coaching_coaches" USING btree ("_locale");
  CREATE INDEX "pages_blocks_coaching_order_idx" ON "pages_blocks_coaching" USING btree ("_order");
  CREATE INDEX "pages_blocks_coaching_parent_id_idx" ON "pages_blocks_coaching" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_coaching_path_idx" ON "pages_blocks_coaching" USING btree ("_path");
  CREATE INDEX "pages_blocks_coaching_locale_idx" ON "pages_blocks_coaching" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_locale_idx" ON "pages_blocks_contact" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contact_form_idx" ON "pages_blocks_contact" USING btree ("form_id");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_stats_locale_idx" ON "pages_blocks_stats_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_locale_idx" ON "pages_blocks_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_featured_talents_order_idx" ON "pages_blocks_featured_talents" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_talents_parent_id_idx" ON "pages_blocks_featured_talents" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_talents_path_idx" ON "pages_blocks_featured_talents" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_talents_locale_idx" ON "pages_blocks_featured_talents" USING btree ("_locale");
  CREATE INDEX "pages_blocks_team_members_order_idx" ON "pages_blocks_team_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_members_parent_id_idx" ON "pages_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_members_locale_idx" ON "pages_blocks_team_members" USING btree ("_locale");
  CREATE INDEX "pages_blocks_team_members_image_idx" ON "pages_blocks_team_members" USING btree ("image_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_locale_idx" ON "pages_blocks_team" USING btree ("_locale");
  CREATE INDEX "pages_page_settings_page_settings_og_image_idx" ON "pages" USING btree ("page_settings_og_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages_locales" USING btree ("hero_media_id");
  CREATE INDEX "pages_hero_hero_hero_logo_idx" ON "pages_locales" USING btree ("hero_hero_logo_id");
  CREATE INDEX "pages_hero_hero_video_idx" ON "pages_locales" USING btree ("hero_video_id");
  CREATE INDEX "pages_hero_hero_poster_image_idx" ON "pages_locales" USING btree ("hero_poster_image_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id","locale");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id","locale");
  CREATE INDEX "pages_rels_talents_id_idx" ON "pages_rels" USING btree ("talents_id","locale");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_links_locale_idx" ON "_pages_v_version_hero_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_features_order_idx" ON "_pages_v_version_hero_features" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_features_parent_id_idx" ON "_pages_v_version_hero_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_features_locale_idx" ON "_pages_v_version_hero_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_locale_idx" ON "_pages_v_blocks_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_background_image_idx" ON "_pages_v_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_locale_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_locale_idx" ON "_pages_v_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_sticky_media_order_idx" ON "_pages_v_blocks_sticky_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_media_parent_id_idx" ON "_pages_v_blocks_sticky_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_media_path_idx" ON "_pages_v_blocks_sticky_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sticky_media_locale_idx" ON "_pages_v_blocks_sticky_media" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_sticky_media_media_idx" ON "_pages_v_blocks_sticky_media" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_tabs_card_tabs_order_idx" ON "_pages_v_blocks_masonry_grid_tabs_card_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_masonry_grid_tabs_card_tabs_parent_id_idx" ON "_pages_v_blocks_masonry_grid_tabs_card_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_tabs_card_tabs_locale_idx" ON "_pages_v_blocks_masonry_grid_tabs_card_tabs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_masonry_grid_audience_cards_order_idx" ON "_pages_v_blocks_masonry_grid_audience_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_masonry_grid_audience_cards_parent_id_idx" ON "_pages_v_blocks_masonry_grid_audience_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_audience_cards_locale_idx" ON "_pages_v_blocks_masonry_grid_audience_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_masonry_grid_audience_cards_background_m_idx" ON "_pages_v_blocks_masonry_grid_audience_cards" USING btree ("background_media_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_order_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_masonry_grid_parent_id_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_path_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_masonry_grid_locale_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_masonry_grid_highlight_card_highlight_ca_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("highlight_card_background_media_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_tabs_card_tabs_card_backgro_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("tabs_card_background_media_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_cashflow_card_cashflow_card_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("cashflow_card_background_media_id");
  CREATE INDEX "_pages_v_blocks_masonry_grid_video_card_video_card_backg_idx" ON "_pages_v_blocks_masonry_grid" USING btree ("video_card_background_media_id");
  CREATE INDEX "_pages_v_blocks_slider_order_idx" ON "_pages_v_blocks_slider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slider_parent_id_idx" ON "_pages_v_blocks_slider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slider_path_idx" ON "_pages_v_blocks_slider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_slider_locale_idx" ON "_pages_v_blocks_slider" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_locale_idx" ON "_pages_v_blocks_form_block" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_big_text_order_idx" ON "_pages_v_blocks_big_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_big_text_parent_id_idx" ON "_pages_v_blocks_big_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_big_text_path_idx" ON "_pages_v_blocks_big_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_big_text_locale_idx" ON "_pages_v_blocks_big_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_step_section_steps_order_idx" ON "_pages_v_blocks_step_section_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_step_section_steps_parent_id_idx" ON "_pages_v_blocks_step_section_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_step_section_steps_locale_idx" ON "_pages_v_blocks_step_section_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_step_section_steps_icon_idx" ON "_pages_v_blocks_step_section_steps" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_step_section_order_idx" ON "_pages_v_blocks_step_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_step_section_parent_id_idx" ON "_pages_v_blocks_step_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_step_section_path_idx" ON "_pages_v_blocks_step_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_step_section_locale_idx" ON "_pages_v_blocks_step_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_info_cards_top_cards_order_idx" ON "_pages_v_blocks_info_cards_top_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_cards_top_cards_parent_id_idx" ON "_pages_v_blocks_info_cards_top_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_cards_top_cards_locale_idx" ON "_pages_v_blocks_info_cards_top_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_info_cards_cards_order_idx" ON "_pages_v_blocks_info_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_cards_cards_parent_id_idx" ON "_pages_v_blocks_info_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_cards_cards_locale_idx" ON "_pages_v_blocks_info_cards_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_info_cards_cards_icon_idx" ON "_pages_v_blocks_info_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_info_cards_order_idx" ON "_pages_v_blocks_info_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_info_cards_parent_id_idx" ON "_pages_v_blocks_info_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_info_cards_path_idx" ON "_pages_v_blocks_info_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_info_cards_locale_idx" ON "_pages_v_blocks_info_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_services_order_idx" ON "_pages_v_blocks_services_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_services_parent_id_idx" ON "_pages_v_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_services_locale_idx" ON "_pages_v_blocks_services_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_locale_idx" ON "_pages_v_blocks_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_education_programs_order_idx" ON "_pages_v_blocks_education_programs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_education_programs_parent_id_idx" ON "_pages_v_blocks_education_programs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_education_programs_locale_idx" ON "_pages_v_blocks_education_programs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_education_order_idx" ON "_pages_v_blocks_education" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_education_parent_id_idx" ON "_pages_v_blocks_education" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_education_path_idx" ON "_pages_v_blocks_education" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_education_locale_idx" ON "_pages_v_blocks_education" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_coaching_benefits_order_idx" ON "_pages_v_blocks_coaching_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coaching_benefits_parent_id_idx" ON "_pages_v_blocks_coaching_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coaching_benefits_locale_idx" ON "_pages_v_blocks_coaching_benefits" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_coaching_coaches_order_idx" ON "_pages_v_blocks_coaching_coaches" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coaching_coaches_parent_id_idx" ON "_pages_v_blocks_coaching_coaches" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coaching_coaches_locale_idx" ON "_pages_v_blocks_coaching_coaches" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_coaching_order_idx" ON "_pages_v_blocks_coaching" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_coaching_parent_id_idx" ON "_pages_v_blocks_coaching" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_coaching_path_idx" ON "_pages_v_blocks_coaching" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_coaching_locale_idx" ON "_pages_v_blocks_coaching" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_locale_idx" ON "_pages_v_blocks_contact" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contact_form_idx" ON "_pages_v_blocks_contact" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_stats_locale_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_locale_idx" ON "_pages_v_blocks_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_featured_talents_order_idx" ON "_pages_v_blocks_featured_talents" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_talents_parent_id_idx" ON "_pages_v_blocks_featured_talents" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_talents_path_idx" ON "_pages_v_blocks_featured_talents" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_talents_locale_idx" ON "_pages_v_blocks_featured_talents" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_team_members_order_idx" ON "_pages_v_blocks_team_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_members_parent_id_idx" ON "_pages_v_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_members_locale_idx" ON "_pages_v_blocks_team_members" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_team_members_image_idx" ON "_pages_v_blocks_team_members" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_locale_idx" ON "_pages_v_blocks_team" USING btree ("_locale");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_page_settings_version_page_settings_og__idx" ON "_pages_v" USING btree ("version_page_settings_og_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v_locales" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_hero_logo_idx" ON "_pages_v_locales" USING btree ("version_hero_hero_logo_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_video_idx" ON "_pages_v_locales" USING btree ("version_hero_video_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_poster_image_idx" ON "_pages_v_locales" USING btree ("version_hero_poster_image_id");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX "_pages_v_rels_talents_id_idx" ON "_pages_v_rels" USING btree ("talents_id","locale");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "posts_blocks_content_order_idx" ON "posts_blocks_content" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_parent_id_idx" ON "posts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_content_path_idx" ON "posts_blocks_content" USING btree ("_path");
  CREATE INDEX "posts_blocks_content_locale_idx" ON "posts_blocks_content" USING btree ("_locale");
  CREATE INDEX "posts_blocks_gallery_images_order_idx" ON "posts_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "posts_blocks_gallery_images_parent_id_idx" ON "posts_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_gallery_images_locale_idx" ON "posts_blocks_gallery_images" USING btree ("_locale");
  CREATE INDEX "posts_blocks_gallery_images_image_idx" ON "posts_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "posts_blocks_gallery_order_idx" ON "posts_blocks_gallery" USING btree ("_order");
  CREATE INDEX "posts_blocks_gallery_parent_id_idx" ON "posts_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_gallery_path_idx" ON "posts_blocks_gallery" USING btree ("_path");
  CREATE INDEX "posts_blocks_gallery_locale_idx" ON "posts_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "posts_blocks_faq_items_order_idx" ON "posts_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_faq_items_parent_id_idx" ON "posts_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_faq_items_locale_idx" ON "posts_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "posts_blocks_faq_order_idx" ON "posts_blocks_faq" USING btree ("_order");
  CREATE INDEX "posts_blocks_faq_parent_id_idx" ON "posts_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_faq_path_idx" ON "posts_blocks_faq" USING btree ("_path");
  CREATE INDEX "posts_blocks_faq_locale_idx" ON "posts_blocks_faq" USING btree ("_locale");
  CREATE INDEX "posts_blocks_cta_order_idx" ON "posts_blocks_cta" USING btree ("_order");
  CREATE INDEX "posts_blocks_cta_parent_id_idx" ON "posts_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_cta_path_idx" ON "posts_blocks_cta" USING btree ("_path");
  CREATE INDEX "posts_blocks_cta_locale_idx" ON "posts_blocks_cta" USING btree ("_locale");
  CREATE INDEX "posts_blocks_cta_background_image_idx" ON "posts_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_page_settings_page_settings_og_image_idx" ON "posts" USING btree ("page_settings_og_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_locale_idx" ON "posts_rels" USING btree ("locale");
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id","locale");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id","locale");
  CREATE INDEX "posts_rels_talents_id_idx" ON "posts_rels" USING btree ("talents_id","locale");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id","locale");
  CREATE INDEX "_posts_v_blocks_content_order_idx" ON "_posts_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_content_parent_id_idx" ON "_posts_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_content_path_idx" ON "_posts_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_content_locale_idx" ON "_posts_v_blocks_content" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_gallery_images_order_idx" ON "_posts_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_gallery_images_parent_id_idx" ON "_posts_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_gallery_images_locale_idx" ON "_posts_v_blocks_gallery_images" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_gallery_images_image_idx" ON "_posts_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_posts_v_blocks_gallery_order_idx" ON "_posts_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_gallery_parent_id_idx" ON "_posts_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_gallery_path_idx" ON "_posts_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_gallery_locale_idx" ON "_posts_v_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_faq_items_order_idx" ON "_posts_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_faq_items_parent_id_idx" ON "_posts_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_items_locale_idx" ON "_posts_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_faq_order_idx" ON "_posts_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_faq_parent_id_idx" ON "_posts_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_path_idx" ON "_posts_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_faq_locale_idx" ON "_posts_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_cta_order_idx" ON "_posts_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_cta_parent_id_idx" ON "_posts_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_cta_path_idx" ON "_posts_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_cta_locale_idx" ON "_posts_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_cta_background_image_idx" ON "_posts_v_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_page_settings_version_page_settings_og__idx" ON "_posts_v" USING btree ("version_page_settings_og_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_locale_idx" ON "_posts_v_rels" USING btree ("locale");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX "_posts_v_rels_talents_id_idx" ON "_posts_v_rels" USING btree ("talents_id","locale");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id","locale");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_gallery_images_order_idx" ON "talents_gallery_images" USING btree ("_order");
  CREATE INDEX "talents_gallery_images_parent_id_idx" ON "talents_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "talents_gallery_images_image_idx" ON "talents_gallery_images" USING btree ("image_id");
  CREATE INDEX "talents_measurements_hair_order_idx" ON "talents_measurements_hair" USING btree ("order");
  CREATE INDEX "talents_measurements_hair_parent_idx" ON "talents_measurements_hair" USING btree ("parent_id");
  CREATE INDEX "talents_measurements_eyes_order_idx" ON "talents_measurements_eyes" USING btree ("order");
  CREATE INDEX "talents_measurements_eyes_parent_idx" ON "talents_measurements_eyes" USING btree ("parent_id");
  CREATE INDEX "talents_languages_order_idx" ON "talents_languages" USING btree ("order");
  CREATE INDEX "talents_languages_parent_idx" ON "talents_languages" USING btree ("parent_id");
  CREATE INDEX "talents_experience_order_idx" ON "talents_experience" USING btree ("_order");
  CREATE INDEX "talents_experience_parent_id_idx" ON "talents_experience" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "talents_experience_locales_locale_parent_id_unique" ON "talents_experience_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_featured_image_idx" ON "talents" USING btree ("featured_image_id");
  CREATE INDEX "talents_sedcard_image1_idx" ON "talents" USING btree ("sedcard_image1_id");
  CREATE INDEX "talents_sedcard_image2_idx" ON "talents" USING btree ("sedcard_image2_id");
  CREATE INDEX "talents_sedcard_image3_idx" ON "talents" USING btree ("sedcard_image3_id");
  CREATE INDEX "talents_sedcard_image4_idx" ON "talents" USING btree ("sedcard_image4_id");
  CREATE UNIQUE INDEX "talents_slug_idx" ON "talents" USING btree ("slug");
  CREATE INDEX "talents_updated_at_idx" ON "talents" USING btree ("updated_at");
  CREATE INDEX "talents_created_at_idx" ON "talents" USING btree ("created_at");
  CREATE INDEX "talents__status_idx" ON "talents" USING btree ("_status");
  CREATE UNIQUE INDEX "talents_locales_locale_parent_id_unique" ON "talents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_rels_order_idx" ON "talents_rels" USING btree ("order");
  CREATE INDEX "talents_rels_parent_idx" ON "talents_rels" USING btree ("parent_id");
  CREATE INDEX "talents_rels_path_idx" ON "talents_rels" USING btree ("path");
  CREATE INDEX "talents_rels_talent_skills_id_idx" ON "talents_rels" USING btree ("talent_skills_id");
  CREATE INDEX "_talents_v_version_gallery_images_order_idx" ON "_talents_v_version_gallery_images" USING btree ("_order");
  CREATE INDEX "_talents_v_version_gallery_images_parent_id_idx" ON "_talents_v_version_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_talents_v_version_gallery_images_image_idx" ON "_talents_v_version_gallery_images" USING btree ("image_id");
  CREATE INDEX "_talents_v_version_measurements_hair_order_idx" ON "_talents_v_version_measurements_hair" USING btree ("order");
  CREATE INDEX "_talents_v_version_measurements_hair_parent_idx" ON "_talents_v_version_measurements_hair" USING btree ("parent_id");
  CREATE INDEX "_talents_v_version_measurements_eyes_order_idx" ON "_talents_v_version_measurements_eyes" USING btree ("order");
  CREATE INDEX "_talents_v_version_measurements_eyes_parent_idx" ON "_talents_v_version_measurements_eyes" USING btree ("parent_id");
  CREATE INDEX "_talents_v_version_languages_order_idx" ON "_talents_v_version_languages" USING btree ("order");
  CREATE INDEX "_talents_v_version_languages_parent_idx" ON "_talents_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_talents_v_version_experience_order_idx" ON "_talents_v_version_experience" USING btree ("_order");
  CREATE INDEX "_talents_v_version_experience_parent_id_idx" ON "_talents_v_version_experience" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_talents_v_version_experience_locales_locale_parent_id_uniqu" ON "_talents_v_version_experience_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_talents_v_parent_idx" ON "_talents_v" USING btree ("parent_id");
  CREATE INDEX "_talents_v_version_version_featured_image_idx" ON "_talents_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_talents_v_version_version_sedcard_image1_idx" ON "_talents_v" USING btree ("version_sedcard_image1_id");
  CREATE INDEX "_talents_v_version_version_sedcard_image2_idx" ON "_talents_v" USING btree ("version_sedcard_image2_id");
  CREATE INDEX "_talents_v_version_version_sedcard_image3_idx" ON "_talents_v" USING btree ("version_sedcard_image3_id");
  CREATE INDEX "_talents_v_version_version_sedcard_image4_idx" ON "_talents_v" USING btree ("version_sedcard_image4_id");
  CREATE INDEX "_talents_v_version_version_slug_idx" ON "_talents_v" USING btree ("version_slug");
  CREATE INDEX "_talents_v_version_version_updated_at_idx" ON "_talents_v" USING btree ("version_updated_at");
  CREATE INDEX "_talents_v_version_version_created_at_idx" ON "_talents_v" USING btree ("version_created_at");
  CREATE INDEX "_talents_v_version_version__status_idx" ON "_talents_v" USING btree ("version__status");
  CREATE INDEX "_talents_v_created_at_idx" ON "_talents_v" USING btree ("created_at");
  CREATE INDEX "_talents_v_updated_at_idx" ON "_talents_v" USING btree ("updated_at");
  CREATE INDEX "_talents_v_snapshot_idx" ON "_talents_v" USING btree ("snapshot");
  CREATE INDEX "_talents_v_published_locale_idx" ON "_talents_v" USING btree ("published_locale");
  CREATE INDEX "_talents_v_latest_idx" ON "_talents_v" USING btree ("latest");
  CREATE INDEX "_talents_v_autosave_idx" ON "_talents_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_talents_v_locales_locale_parent_id_unique" ON "_talents_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_talents_v_rels_order_idx" ON "_talents_v_rels" USING btree ("order");
  CREATE INDEX "_talents_v_rels_parent_idx" ON "_talents_v_rels" USING btree ("parent_id");
  CREATE INDEX "_talents_v_rels_path_idx" ON "_talents_v_rels" USING btree ("path");
  CREATE INDEX "_talents_v_rels_talent_skills_id_idx" ON "_talents_v_rels" USING btree ("talent_skills_id");
  CREATE UNIQUE INDEX "talent_skills_slug_idx" ON "talent_skills" USING btree ("slug");
  CREATE INDEX "talent_skills_updated_at_idx" ON "talent_skills" USING btree ("updated_at");
  CREATE INDEX "talent_skills_created_at_idx" ON "talent_skills" USING btree ("created_at");
  CREATE UNIQUE INDEX "talent_skills_locales_locale_parent_id_unique" ON "talent_skills_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_talents_id_idx" ON "redirects_rels" USING btree ("talents_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_talent_selection_order_idx" ON "forms_blocks_talent_selection" USING btree ("_order");
  CREATE INDEX "forms_blocks_talent_selection_parent_id_idx" ON "forms_blocks_talent_selection" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_talent_selection_path_idx" ON "forms_blocks_talent_selection" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_talent_selection_locales_locale_parent_id_uniqu" ON "forms_blocks_talent_selection_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_talents_id_idx" ON "payload_locked_documents_rels" USING btree ("talents_id");
  CREATE INDEX "payload_locked_documents_rels_talent_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("talent_skills_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_archive_locales_locale_parent_id_unique" ON "posts_archive_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_archive_blocks_content_order_idx" ON "talents_archive_blocks_content" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_content_parent_id_idx" ON "talents_archive_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_content_path_idx" ON "talents_archive_blocks_content" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_content_locale_idx" ON "talents_archive_blocks_content" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_cta_order_idx" ON "talents_archive_blocks_cta" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_cta_parent_id_idx" ON "talents_archive_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_cta_path_idx" ON "talents_archive_blocks_cta" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_cta_locale_idx" ON "talents_archive_blocks_cta" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_cta_background_image_idx" ON "talents_archive_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "talents_archive_blocks_gallery_images_order_idx" ON "talents_archive_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_gallery_images_parent_id_idx" ON "talents_archive_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_gallery_images_locale_idx" ON "talents_archive_blocks_gallery_images" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_gallery_images_image_idx" ON "talents_archive_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "talents_archive_blocks_gallery_order_idx" ON "talents_archive_blocks_gallery" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_gallery_parent_id_idx" ON "talents_archive_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_gallery_path_idx" ON "talents_archive_blocks_gallery" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_gallery_locale_idx" ON "talents_archive_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_faq_items_order_idx" ON "talents_archive_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_faq_items_parent_id_idx" ON "talents_archive_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_faq_items_locale_idx" ON "talents_archive_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_faq_order_idx" ON "talents_archive_blocks_faq" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_faq_parent_id_idx" ON "talents_archive_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_faq_path_idx" ON "talents_archive_blocks_faq" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_faq_locale_idx" ON "talents_archive_blocks_faq" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_sticky_media_order_idx" ON "talents_archive_blocks_sticky_media" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_sticky_media_parent_id_idx" ON "talents_archive_blocks_sticky_media" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_sticky_media_path_idx" ON "talents_archive_blocks_sticky_media" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_sticky_media_locale_idx" ON "talents_archive_blocks_sticky_media" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_sticky_media_media_idx" ON "talents_archive_blocks_sticky_media" USING btree ("media_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_tabs_card_tabs_order_idx" ON "talents_archive_blocks_masonry_grid_tabs_card_tabs" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_masonry_grid_tabs_card_tabs_parent_id_idx" ON "talents_archive_blocks_masonry_grid_tabs_card_tabs" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_tabs_card_tabs_locale_idx" ON "talents_archive_blocks_masonry_grid_tabs_card_tabs" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_masonry_grid_audience_cards_order_idx" ON "talents_archive_blocks_masonry_grid_audience_cards" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_masonry_grid_audience_cards_parent_id_idx" ON "talents_archive_blocks_masonry_grid_audience_cards" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_audience_cards_locale_idx" ON "talents_archive_blocks_masonry_grid_audience_cards" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_masonry_grid_audience_cards_backg_idx" ON "talents_archive_blocks_masonry_grid_audience_cards" USING btree ("background_media_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_order_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_masonry_grid_parent_id_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_path_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_masonry_grid_locale_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_masonry_grid_highlight_card_highl_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("highlight_card_background_media_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_tabs_card_tabs_card__idx" ON "talents_archive_blocks_masonry_grid" USING btree ("tabs_card_background_media_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_cashflow_card_cashfl_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("cashflow_card_background_media_id");
  CREATE INDEX "talents_archive_blocks_masonry_grid_video_card_video_car_idx" ON "talents_archive_blocks_masonry_grid" USING btree ("video_card_background_media_id");
  CREATE INDEX "talents_archive_blocks_slider_order_idx" ON "talents_archive_blocks_slider" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_slider_parent_id_idx" ON "talents_archive_blocks_slider" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_slider_path_idx" ON "talents_archive_blocks_slider" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_slider_locale_idx" ON "talents_archive_blocks_slider" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_form_block_order_idx" ON "talents_archive_blocks_form_block" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_form_block_parent_id_idx" ON "talents_archive_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_form_block_path_idx" ON "talents_archive_blocks_form_block" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_form_block_locale_idx" ON "talents_archive_blocks_form_block" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_form_block_form_idx" ON "talents_archive_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "talents_archive_blocks_big_text_order_idx" ON "talents_archive_blocks_big_text" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_big_text_parent_id_idx" ON "talents_archive_blocks_big_text" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_big_text_path_idx" ON "talents_archive_blocks_big_text" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_big_text_locale_idx" ON "talents_archive_blocks_big_text" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_step_section_steps_order_idx" ON "talents_archive_blocks_step_section_steps" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_step_section_steps_parent_id_idx" ON "talents_archive_blocks_step_section_steps" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_step_section_steps_locale_idx" ON "talents_archive_blocks_step_section_steps" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_step_section_steps_icon_idx" ON "talents_archive_blocks_step_section_steps" USING btree ("icon_id");
  CREATE INDEX "talents_archive_blocks_step_section_order_idx" ON "talents_archive_blocks_step_section" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_step_section_parent_id_idx" ON "talents_archive_blocks_step_section" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_step_section_path_idx" ON "talents_archive_blocks_step_section" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_step_section_locale_idx" ON "talents_archive_blocks_step_section" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_info_cards_top_cards_order_idx" ON "talents_archive_blocks_info_cards_top_cards" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_info_cards_top_cards_parent_id_idx" ON "talents_archive_blocks_info_cards_top_cards" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_info_cards_top_cards_locale_idx" ON "talents_archive_blocks_info_cards_top_cards" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_info_cards_cards_order_idx" ON "talents_archive_blocks_info_cards_cards" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_info_cards_cards_parent_id_idx" ON "talents_archive_blocks_info_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_info_cards_cards_locale_idx" ON "talents_archive_blocks_info_cards_cards" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_info_cards_cards_icon_idx" ON "talents_archive_blocks_info_cards_cards" USING btree ("icon_id");
  CREATE INDEX "talents_archive_blocks_info_cards_order_idx" ON "talents_archive_blocks_info_cards" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_info_cards_parent_id_idx" ON "talents_archive_blocks_info_cards" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_info_cards_path_idx" ON "talents_archive_blocks_info_cards" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_info_cards_locale_idx" ON "talents_archive_blocks_info_cards" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_services_services_order_idx" ON "talents_archive_blocks_services_services" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_services_services_parent_id_idx" ON "talents_archive_blocks_services_services" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_services_services_locale_idx" ON "talents_archive_blocks_services_services" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_services_order_idx" ON "talents_archive_blocks_services" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_services_parent_id_idx" ON "talents_archive_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_services_path_idx" ON "talents_archive_blocks_services" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_services_locale_idx" ON "talents_archive_blocks_services" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_education_programs_order_idx" ON "talents_archive_blocks_education_programs" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_education_programs_parent_id_idx" ON "talents_archive_blocks_education_programs" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_education_programs_locale_idx" ON "talents_archive_blocks_education_programs" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_education_order_idx" ON "talents_archive_blocks_education" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_education_parent_id_idx" ON "talents_archive_blocks_education" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_education_path_idx" ON "talents_archive_blocks_education" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_education_locale_idx" ON "talents_archive_blocks_education" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_coaching_benefits_order_idx" ON "talents_archive_blocks_coaching_benefits" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_coaching_benefits_parent_id_idx" ON "talents_archive_blocks_coaching_benefits" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_coaching_benefits_locale_idx" ON "talents_archive_blocks_coaching_benefits" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_coaching_coaches_order_idx" ON "talents_archive_blocks_coaching_coaches" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_coaching_coaches_parent_id_idx" ON "talents_archive_blocks_coaching_coaches" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_coaching_coaches_locale_idx" ON "talents_archive_blocks_coaching_coaches" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_coaching_order_idx" ON "talents_archive_blocks_coaching" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_coaching_parent_id_idx" ON "talents_archive_blocks_coaching" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_coaching_path_idx" ON "talents_archive_blocks_coaching" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_coaching_locale_idx" ON "talents_archive_blocks_coaching" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_contact_order_idx" ON "talents_archive_blocks_contact" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_contact_parent_id_idx" ON "talents_archive_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_contact_path_idx" ON "talents_archive_blocks_contact" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_contact_locale_idx" ON "talents_archive_blocks_contact" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_contact_form_idx" ON "talents_archive_blocks_contact" USING btree ("form_id");
  CREATE INDEX "talents_archive_blocks_stats_stats_order_idx" ON "talents_archive_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_stats_stats_parent_id_idx" ON "talents_archive_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_stats_stats_locale_idx" ON "talents_archive_blocks_stats_stats" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_stats_order_idx" ON "talents_archive_blocks_stats" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_stats_parent_id_idx" ON "talents_archive_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_stats_path_idx" ON "talents_archive_blocks_stats" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_stats_locale_idx" ON "talents_archive_blocks_stats" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_featured_talents_order_idx" ON "talents_archive_blocks_featured_talents" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_featured_talents_parent_id_idx" ON "talents_archive_blocks_featured_talents" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_featured_talents_path_idx" ON "talents_archive_blocks_featured_talents" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_featured_talents_locale_idx" ON "talents_archive_blocks_featured_talents" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_team_members_order_idx" ON "talents_archive_blocks_team_members" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_team_members_parent_id_idx" ON "talents_archive_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_team_members_locale_idx" ON "talents_archive_blocks_team_members" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_team_members_image_idx" ON "talents_archive_blocks_team_members" USING btree ("image_id");
  CREATE INDEX "talents_archive_blocks_team_order_idx" ON "talents_archive_blocks_team" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_team_parent_id_idx" ON "talents_archive_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_team_path_idx" ON "talents_archive_blocks_team" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_team_locale_idx" ON "talents_archive_blocks_team" USING btree ("_locale");
  CREATE INDEX "talents_archive_cta_button_order_idx" ON "talents_archive_cta_button" USING btree ("_order");
  CREATE INDEX "talents_archive_cta_button_parent_id_idx" ON "talents_archive_cta_button" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "talents_archive_cta_button_locales_locale_parent_id_unique" ON "talents_archive_cta_button_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_archive_hero_image_idx" ON "talents_archive" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "talents_archive_locales_locale_parent_id_unique" ON "talents_archive_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_archive_rels_order_idx" ON "talents_archive_rels" USING btree ("order");
  CREATE INDEX "talents_archive_rels_parent_idx" ON "talents_archive_rels" USING btree ("parent_id");
  CREATE INDEX "talents_archive_rels_path_idx" ON "talents_archive_rels" USING btree ("path");
  CREATE INDEX "talents_archive_rels_locale_idx" ON "talents_archive_rels" USING btree ("locale");
  CREATE INDEX "talents_archive_rels_talents_id_idx" ON "talents_archive_rels" USING btree ("talents_id","locale");
  CREATE INDEX "talents_archive_rels_pages_id_idx" ON "talents_archive_rels" USING btree ("pages_id","locale");
  CREATE INDEX "talents_archive_rels_posts_id_idx" ON "talents_archive_rels" USING btree ("posts_id","locale");
  CREATE INDEX "sedcard_settings_agency_logo_idx" ON "sedcard_settings" USING btree ("agency_logo_id");
  CREATE INDEX "form_settings_contact_form_idx" ON "form_settings" USING btree ("contact_form_id");
  CREATE UNIQUE INDEX "form_settings_locales_locale_parent_id_unique" ON "form_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_card_nav_items_links_order_idx" ON "header_card_nav_items_links" USING btree ("_order");
  CREATE INDEX "header_card_nav_items_links_parent_id_idx" ON "header_card_nav_items_links" USING btree ("_parent_id");
  CREATE INDEX "header_card_nav_items_links_locale_idx" ON "header_card_nav_items_links" USING btree ("_locale");
  CREATE INDEX "header_card_nav_items_order_idx" ON "header_card_nav_items" USING btree ("_order");
  CREATE INDEX "header_card_nav_items_parent_id_idx" ON "header_card_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_card_nav_items_locale_idx" ON "header_card_nav_items" USING btree ("_locale");
  CREATE INDEX "header_card_nav_items_image_idx" ON "header_card_nav_items" USING btree ("image_id");
  CREATE INDEX "header_cta_buttons_order_idx" ON "header_cta_buttons" USING btree ("_order");
  CREATE INDEX "header_cta_buttons_parent_id_idx" ON "header_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "header_cta_buttons_locale_idx" ON "header_cta_buttons" USING btree ("_locale");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_locale_idx" ON "header_rels" USING btree ("locale");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id","locale");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id","locale");
  CREATE INDEX "header_rels_talents_id_idx" ON "header_rels" USING btree ("talents_id","locale");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_page_idx" ON "footer_columns_links" USING btree ("page_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_bottom_links_order_idx" ON "footer_bottom_links" USING btree ("_order");
  CREATE INDEX "footer_bottom_links_parent_id_idx" ON "footer_bottom_links" USING btree ("_parent_id");
  CREATE INDEX "footer_bottom_links_page_idx" ON "footer_bottom_links" USING btree ("page_id");
  CREATE UNIQUE INDEX "footer_bottom_links_locales_locale_parent_id_unique" ON "footer_bottom_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seo_social_media_same_as_order_idx" ON "seo_social_media_same_as" USING btree ("_order");
  CREATE INDEX "seo_social_media_same_as_parent_id_idx" ON "seo_social_media_same_as" USING btree ("_parent_id");
  CREATE INDEX "seo_favicon_idx" ON "seo" USING btree ("favicon_id");
  CREATE INDEX "seo_apple_touch_icon_idx" ON "seo" USING btree ("apple_touch_icon_id");
  CREATE INDEX "seo_social_media_social_media_logo_idx" ON "seo" USING btree ("social_media_logo_id");
  CREATE UNIQUE INDEX "seo_locales_locale_parent_id_unique" ON "seo_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cookie_banner_policies_policies_privacy_policy_idx" ON "cookie_banner" USING btree ("policies_privacy_policy_id");
  CREATE INDEX "cookie_banner_policies_policies_imprint_idx" ON "cookie_banner" USING btree ("policies_imprint_id");
  CREATE UNIQUE INDEX "cookie_banner_locales_locale_parent_id_unique" ON "cookie_banner_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_hero_features" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_sticky_media" CASCADE;
  DROP TABLE "pages_blocks_masonry_grid_tabs_card_tabs" CASCADE;
  DROP TABLE "pages_blocks_masonry_grid_audience_cards" CASCADE;
  DROP TABLE "pages_blocks_masonry_grid" CASCADE;
  DROP TABLE "pages_blocks_slider" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_big_text" CASCADE;
  DROP TABLE "pages_blocks_step_section_steps" CASCADE;
  DROP TABLE "pages_blocks_step_section" CASCADE;
  DROP TABLE "pages_blocks_info_cards_top_cards" CASCADE;
  DROP TABLE "pages_blocks_info_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_info_cards" CASCADE;
  DROP TABLE "pages_blocks_services_services" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_education_programs" CASCADE;
  DROP TABLE "pages_blocks_education" CASCADE;
  DROP TABLE "pages_blocks_coaching_benefits" CASCADE;
  DROP TABLE "pages_blocks_coaching_coaches" CASCADE;
  DROP TABLE "pages_blocks_coaching" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_featured_talents" CASCADE;
  DROP TABLE "pages_blocks_team_members" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_features" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_media" CASCADE;
  DROP TABLE "_pages_v_blocks_masonry_grid_tabs_card_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_masonry_grid_audience_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_masonry_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_slider" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_big_text" CASCADE;
  DROP TABLE "_pages_v_blocks_step_section_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_step_section" CASCADE;
  DROP TABLE "_pages_v_blocks_info_cards_top_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_info_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_info_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_services_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services" CASCADE;
  DROP TABLE "_pages_v_blocks_education_programs" CASCADE;
  DROP TABLE "_pages_v_blocks_education" CASCADE;
  DROP TABLE "_pages_v_blocks_coaching_benefits" CASCADE;
  DROP TABLE "_pages_v_blocks_coaching_coaches" CASCADE;
  DROP TABLE "_pages_v_blocks_coaching" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_talents" CASCADE;
  DROP TABLE "_pages_v_blocks_team_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "posts_blocks_content" CASCADE;
  DROP TABLE "posts_blocks_gallery_images" CASCADE;
  DROP TABLE "posts_blocks_gallery" CASCADE;
  DROP TABLE "posts_blocks_faq_items" CASCADE;
  DROP TABLE "posts_blocks_faq" CASCADE;
  DROP TABLE "posts_blocks_cta" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_blocks_content" CASCADE;
  DROP TABLE "_posts_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_posts_v_blocks_gallery" CASCADE;
  DROP TABLE "_posts_v_blocks_faq_items" CASCADE;
  DROP TABLE "_posts_v_blocks_faq" CASCADE;
  DROP TABLE "_posts_v_blocks_cta" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "talents_gallery_images" CASCADE;
  DROP TABLE "talents_measurements_hair" CASCADE;
  DROP TABLE "talents_measurements_eyes" CASCADE;
  DROP TABLE "talents_languages" CASCADE;
  DROP TABLE "talents_experience" CASCADE;
  DROP TABLE "talents_experience_locales" CASCADE;
  DROP TABLE "talents" CASCADE;
  DROP TABLE "talents_locales" CASCADE;
  DROP TABLE "talents_rels" CASCADE;
  DROP TABLE "_talents_v_version_gallery_images" CASCADE;
  DROP TABLE "_talents_v_version_measurements_hair" CASCADE;
  DROP TABLE "_talents_v_version_measurements_eyes" CASCADE;
  DROP TABLE "_talents_v_version_languages" CASCADE;
  DROP TABLE "_talents_v_version_experience" CASCADE;
  DROP TABLE "_talents_v_version_experience_locales" CASCADE;
  DROP TABLE "_talents_v" CASCADE;
  DROP TABLE "_talents_v_locales" CASCADE;
  DROP TABLE "_talents_v_rels" CASCADE;
  DROP TABLE "talent_skills" CASCADE;
  DROP TABLE "talent_skills_locales" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_blocks_talent_selection" CASCADE;
  DROP TABLE "forms_blocks_talent_selection_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "posts_archive" CASCADE;
  DROP TABLE "posts_archive_locales" CASCADE;
  DROP TABLE "talents_archive_blocks_content" CASCADE;
  DROP TABLE "talents_archive_blocks_cta" CASCADE;
  DROP TABLE "talents_archive_blocks_gallery_images" CASCADE;
  DROP TABLE "talents_archive_blocks_gallery" CASCADE;
  DROP TABLE "talents_archive_blocks_faq_items" CASCADE;
  DROP TABLE "talents_archive_blocks_faq" CASCADE;
  DROP TABLE "talents_archive_blocks_sticky_media" CASCADE;
  DROP TABLE "talents_archive_blocks_masonry_grid_tabs_card_tabs" CASCADE;
  DROP TABLE "talents_archive_blocks_masonry_grid_audience_cards" CASCADE;
  DROP TABLE "talents_archive_blocks_masonry_grid" CASCADE;
  DROP TABLE "talents_archive_blocks_slider" CASCADE;
  DROP TABLE "talents_archive_blocks_form_block" CASCADE;
  DROP TABLE "talents_archive_blocks_big_text" CASCADE;
  DROP TABLE "talents_archive_blocks_step_section_steps" CASCADE;
  DROP TABLE "talents_archive_blocks_step_section" CASCADE;
  DROP TABLE "talents_archive_blocks_info_cards_top_cards" CASCADE;
  DROP TABLE "talents_archive_blocks_info_cards_cards" CASCADE;
  DROP TABLE "talents_archive_blocks_info_cards" CASCADE;
  DROP TABLE "talents_archive_blocks_services_services" CASCADE;
  DROP TABLE "talents_archive_blocks_services" CASCADE;
  DROP TABLE "talents_archive_blocks_education_programs" CASCADE;
  DROP TABLE "talents_archive_blocks_education" CASCADE;
  DROP TABLE "talents_archive_blocks_coaching_benefits" CASCADE;
  DROP TABLE "talents_archive_blocks_coaching_coaches" CASCADE;
  DROP TABLE "talents_archive_blocks_coaching" CASCADE;
  DROP TABLE "talents_archive_blocks_contact" CASCADE;
  DROP TABLE "talents_archive_blocks_stats_stats" CASCADE;
  DROP TABLE "talents_archive_blocks_stats" CASCADE;
  DROP TABLE "talents_archive_blocks_featured_talents" CASCADE;
  DROP TABLE "talents_archive_blocks_team_members" CASCADE;
  DROP TABLE "talents_archive_blocks_team" CASCADE;
  DROP TABLE "talents_archive_cta_button" CASCADE;
  DROP TABLE "talents_archive_cta_button_locales" CASCADE;
  DROP TABLE "talents_archive" CASCADE;
  DROP TABLE "talents_archive_locales" CASCADE;
  DROP TABLE "talents_archive_rels" CASCADE;
  DROP TABLE "sedcard_settings" CASCADE;
  DROP TABLE "form_settings" CASCADE;
  DROP TABLE "form_settings_locales" CASCADE;
  DROP TABLE "header_card_nav_items_links" CASCADE;
  DROP TABLE "header_card_nav_items" CASCADE;
  DROP TABLE "header_cta_buttons" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_bottom_links" CASCADE;
  DROP TABLE "footer_bottom_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "seo_social_media_same_as" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TABLE "seo_locales" CASCADE;
  DROP TABLE "theme_settings" CASCADE;
  DROP TABLE "cookie_banner" CASCADE;
  DROP TABLE "cookie_banner_locales" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."l_t";
  DROP TYPE "public"."l_ar";
  DROP TYPE "public"."l_ap";
  DROP TYPE "public"."enum_pages_blocks_content_layout";
  DROP TYPE "public"."enum_pages_blocks_content_background_color";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_gallery_variant";
  DROP TYPE "public"."enum_pages_blocks_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_faq_layout";
  DROP TYPE "public"."enum_pages_blocks_sticky_media_overlay_opacity";
  DROP TYPE "public"."enum_pages_blocks_masonry_grid_audience_cards_size";
  DROP TYPE "public"."th";
  DROP TYPE "public"."ls";
  DROP TYPE "public"."enum_pages_blocks_masonry_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_masonry_grid_background_color";
  DROP TYPE "public"."tt";
  DROP TYPE "public"."enum_pages_blocks_masonry_grid_section_tone";
  DROP TYPE "public"."enum_pages_blocks_slider_card_style";
  DROP TYPE "public"."enum_pages_blocks_slider_source_collection";
  DROP TYPE "public"."enum_pages_blocks_slider_badge_field";
  DROP TYPE "public"."enum_pages_blocks_slider_sort_by";
  DROP TYPE "public"."ip";
  DROP TYPE "public"."enum_pages_blocks_big_text_heading_level";
  DROP TYPE "public"."enum_pages_blocks_step_section_layout";
  DROP TYPE "public"."enum_pages_blocks_step_section_card_display";
  DROP TYPE "public"."enum_pages_blocks_step_section_background_color";
  DROP TYPE "public"."enum_pages_blocks_step_section_cta_position";
  DROP TYPE "public"."enum_pages_blocks_step_section_flow_container_style";
  DROP TYPE "public"."enum_pages_blocks_info_cards_background_color";
  DROP TYPE "public"."enum_pages_blocks_services_services_icon";
  DROP TYPE "public"."enum_pages_blocks_education_programs_icon";
  DROP TYPE "public"."enum_pages_blocks_coaching_benefits_icon";
  DROP TYPE "public"."enum_pages_blocks_featured_talents_layout";
  DROP TYPE "public"."enum_pages_page_settings_schema_type";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_hero_background_style";
  DROP TYPE "public"."enum_pages_hero_alignment";
  DROP TYPE "public"."enum_pages_hero_right_side";
  DROP TYPE "public"."enum__pages_v_blocks_content_layout";
  DROP TYPE "public"."enum__pages_v_blocks_content_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_variant";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_faq_layout";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_media_overlay_opacity";
  DROP TYPE "public"."enum__pages_v_blocks_masonry_grid_audience_cards_size";
  DROP TYPE "public"."enum__pages_v_blocks_masonry_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_masonry_grid_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_masonry_grid_section_tone";
  DROP TYPE "public"."enum__pages_v_blocks_slider_card_style";
  DROP TYPE "public"."enum__pages_v_blocks_slider_source_collection";
  DROP TYPE "public"."enum__pages_v_blocks_slider_badge_field";
  DROP TYPE "public"."enum__pages_v_blocks_slider_sort_by";
  DROP TYPE "public"."enum__pages_v_blocks_big_text_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_step_section_layout";
  DROP TYPE "public"."enum__pages_v_blocks_step_section_card_display";
  DROP TYPE "public"."enum__pages_v_blocks_step_section_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_step_section_cta_position";
  DROP TYPE "public"."enum__pages_v_blocks_step_section_flow_container_style";
  DROP TYPE "public"."enum__pages_v_blocks_info_cards_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_services_services_icon";
  DROP TYPE "public"."enum__pages_v_blocks_education_programs_icon";
  DROP TYPE "public"."enum__pages_v_blocks_coaching_benefits_icon";
  DROP TYPE "public"."enum__pages_v_blocks_featured_talents_layout";
  DROP TYPE "public"."enum__pages_v_version_page_settings_schema_type";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_background_style";
  DROP TYPE "public"."enum__pages_v_version_hero_alignment";
  DROP TYPE "public"."enum__pages_v_version_hero_right_side";
  DROP TYPE "public"."enum_posts_blocks_content_layout";
  DROP TYPE "public"."enum_posts_blocks_content_background_color";
  DROP TYPE "public"."enum_posts_blocks_gallery_variant";
  DROP TYPE "public"."enum_posts_blocks_gallery_columns";
  DROP TYPE "public"."enum_posts_blocks_faq_layout";
  DROP TYPE "public"."enum_posts_blocks_cta_variant";
  DROP TYPE "public"."enum_posts_page_settings_schema_type";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_blocks_content_layout";
  DROP TYPE "public"."enum__posts_v_blocks_content_background_color";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_variant";
  DROP TYPE "public"."enum__posts_v_blocks_gallery_columns";
  DROP TYPE "public"."enum__posts_v_blocks_faq_layout";
  DROP TYPE "public"."enum__posts_v_blocks_cta_variant";
  DROP TYPE "public"."enum__posts_v_version_page_settings_schema_type";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_talents_measurements_hair";
  DROP TYPE "public"."enum_talents_measurements_eyes";
  DROP TYPE "public"."enum_talents_languages";
  DROP TYPE "public"."enum_talents_sedcard_template";
  DROP TYPE "public"."enum_talents_card_style";
  DROP TYPE "public"."enum_talents_status";
  DROP TYPE "public"."enum_talents_category";
  DROP TYPE "public"."enum__talents_v_version_measurements_hair";
  DROP TYPE "public"."enum__talents_v_version_measurements_eyes";
  DROP TYPE "public"."enum__talents_v_version_languages";
  DROP TYPE "public"."enum__talents_v_version_sedcard_template";
  DROP TYPE "public"."enum__talents_v_version_card_style";
  DROP TYPE "public"."enum__talents_v_version_status";
  DROP TYPE "public"."enum__talents_v_published_locale";
  DROP TYPE "public"."enum__talents_v_version_category";
  DROP TYPE "public"."enum_talent_skills_skill_group";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_forms_form_category";
  DROP TYPE "public"."enum_form_submissions_category";
  DROP TYPE "public"."enum_form_submissions_locale";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_talents_archive_blocks_content_layout";
  DROP TYPE "public"."enum_talents_archive_blocks_content_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_cta_variant";
  DROP TYPE "public"."enum_talents_archive_blocks_gallery_variant";
  DROP TYPE "public"."enum_talents_archive_blocks_gallery_columns";
  DROP TYPE "public"."enum_talents_archive_blocks_faq_layout";
  DROP TYPE "public"."enum_talents_archive_blocks_sticky_media_overlay_opacity";
  DROP TYPE "public"."enum_talents_archive_blocks_masonry_grid_audience_cards_size";
  DROP TYPE "public"."enum_talents_archive_blocks_masonry_grid_variant";
  DROP TYPE "public"."enum_talents_archive_blocks_masonry_grid_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_masonry_grid_section_tone";
  DROP TYPE "public"."enum_talents_archive_blocks_slider_card_style";
  DROP TYPE "public"."enum_talents_archive_blocks_slider_source_collection";
  DROP TYPE "public"."enum_talents_archive_blocks_slider_badge_field";
  DROP TYPE "public"."enum_talents_archive_blocks_slider_sort_by";
  DROP TYPE "public"."enum_talents_archive_blocks_big_text_heading_level";
  DROP TYPE "public"."enum_talents_archive_blocks_step_section_layout";
  DROP TYPE "public"."enum_talents_archive_blocks_step_section_card_display";
  DROP TYPE "public"."enum_talents_archive_blocks_step_section_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_step_section_cta_position";
  DROP TYPE "public"."enum_talents_archive_blocks_step_section_flow_container_style";
  DROP TYPE "public"."enum_talents_archive_blocks_info_cards_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_services_services_icon";
  DROP TYPE "public"."enum_talents_archive_blocks_education_programs_icon";
  DROP TYPE "public"."enum_talents_archive_blocks_coaching_benefits_icon";
  DROP TYPE "public"."enum_talents_archive_blocks_featured_talents_layout";
  DROP TYPE "public"."enum_talents_archive_showcase_mode";
  DROP TYPE "public"."enum_sedcard_settings_default_template";
  DROP TYPE "public"."enum_header_card_nav_items_media_display";
  DROP TYPE "public"."enum_header_language_switcher_placement";
  DROP TYPE "public"."enum_header_theme_toggle_placement";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_seo_social_media_same_as_platform";
  DROP TYPE "public"."enum_seo_business_info_business_type";
  DROP TYPE "public"."enum_seo_business_info_price_range";
  DROP TYPE "public"."enum_seo_ai_and_crawlers_llm_txt_content_update_schedule";
  DROP TYPE "public"."enum_seo_sitemaps_indexing_change_frequency";
  DROP TYPE "public"."enum_seo_schema_templates_website_schema_language";
  DROP TYPE "public"."enum_theme_settings_default_theme";
  DROP TYPE "public"."enum_theme_settings_color_preset";
  DROP TYPE "public"."enum_cookie_banner_trigger_placement";`)
}
