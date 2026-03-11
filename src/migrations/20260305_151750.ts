import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_sticky_media_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_media_content_layout" AS ENUM('mediaLeft', 'mediaRight');
  CREATE TYPE "public"."enum_pages_blocks_featured_talents_size" AS ENUM('normal', 'hero');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_marquee_banner_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_pages_blocks_marquee_banner_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_sticky_media_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_media_content_layout" AS ENUM('mediaLeft', 'mediaRight');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_talents_size" AS ENUM('normal', 'hero');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_banner_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_banner_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum_posts_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__posts_v_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_talents_archive_blocks_sticky_media_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_media_content_layout" AS ENUM('mediaLeft', 'mediaRight');
  CREATE TYPE "public"."enum_talents_archive_blocks_featured_talents_size" AS ENUM('normal', 'hero');
  CREATE TYPE "public"."enum_talents_archive_blocks_testimonial_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_map_height" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_talents_archive_blocks_marquee_banner_speed" AS ENUM('slow', 'normal', 'fast');
  CREATE TYPE "public"."enum_talents_archive_blocks_marquee_banner_appearance" AS ENUM('solid', 'outline');
  ALTER TYPE "public"."enum_pages_blocks_cta_variant" ADD VALUE 'split' BEFORE 'banner';
  ALTER TYPE "public"."enum_pages_blocks_featured_talents_layout" ADD VALUE 'premium' BEFORE 'grid';
  ALTER TYPE "public"."enum_pages_page_settings_schema_type" ADD VALUE 'BlogPosting' BEFORE 'FAQPage';
  ALTER TYPE "public"."enum_pages_page_settings_schema_type" ADD VALUE 'Service';
  ALTER TYPE "public"."enum_pages_page_settings_schema_type" ADD VALUE 'Product';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_variant" ADD VALUE 'split' BEFORE 'banner';
  ALTER TYPE "public"."enum__pages_v_blocks_featured_talents_layout" ADD VALUE 'premium' BEFORE 'grid';
  ALTER TYPE "public"."enum__pages_v_version_page_settings_schema_type" ADD VALUE 'BlogPosting' BEFORE 'FAQPage';
  ALTER TYPE "public"."enum__pages_v_version_page_settings_schema_type" ADD VALUE 'Service';
  ALTER TYPE "public"."enum__pages_v_version_page_settings_schema_type" ADD VALUE 'Product';
  ALTER TYPE "public"."enum_posts_blocks_cta_variant" ADD VALUE 'split' BEFORE 'banner';
  ALTER TYPE "public"."enum_posts_page_settings_schema_type" ADD VALUE 'CollectionPage' BEFORE 'Service';
  ALTER TYPE "public"."enum__posts_v_blocks_cta_variant" ADD VALUE 'split' BEFORE 'banner';
  ALTER TYPE "public"."enum__posts_v_version_page_settings_schema_type" ADD VALUE 'CollectionPage' BEFORE 'Service';
  ALTER TYPE "public"."enum_talents_archive_blocks_cta_variant" ADD VALUE 'split' BEFORE 'banner';
  ALTER TYPE "public"."enum_talents_archive_blocks_featured_talents_layout" ADD VALUE 'premium' BEFORE 'grid';
  CREATE TABLE "pages_blocks_media_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary-pill',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_media_content_layout" DEFAULT 'mediaLeft',
  	"media_id" integer,
  	"tagline" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_impressum_representatives_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_impressum" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_company" varchar,
  	"heading_contact" varchar,
  	"heading_representatives" varchar,
  	"heading_register" varchar,
  	"heading_content_responsible" varchar,
  	"heading_disclaimer" varchar,
  	"heading_liability_content" varchar,
  	"heading_liability_links" varchar,
  	"heading_copyright" varchar,
  	"heading_eu_dispute" varchar,
  	"company_name" varchar,
  	"street" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"country" varchar DEFAULT 'Deutschland',
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"representatives_label" varchar DEFAULT 'Geschäftsführer:',
  	"register_court" varchar,
  	"register_number" varchar,
  	"vat_id" varchar,
  	"content_responsible_name" varchar,
  	"liability_content" jsonb,
  	"liability_links" jsonb,
  	"copyright" jsonb,
  	"eu_dispute_intro" jsonb,
  	"eu_dispute_url" varchar DEFAULT 'https://ec.europa.eu/consumers/odr/',
  	"eu_dispute_closing" jsonb,
  	"date_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_legal_content_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_legal_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"toc_label" varchar DEFAULT 'Inhaltsverzeichnis',
  	"date_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"media_id" integer,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum_pages_blocks_testimonial_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location" varchar,
  	"height" "enum_pages_blocks_map_height" DEFAULT 'medium',
  	"zoom" numeric DEFAULT 14,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"speed" "enum_pages_blocks_marquee_banner_speed" DEFAULT 'normal',
  	"appearance" "enum_pages_blocks_marquee_banner_appearance" DEFAULT 'solid',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar,
  	"link_appearance" "l_ap" DEFAULT 'primary-pill',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_media_content_layout" DEFAULT 'mediaLeft',
  	"media_id" integer,
  	"tagline" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_impressum_representatives_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_impressum" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_company" varchar,
  	"heading_contact" varchar,
  	"heading_representatives" varchar,
  	"heading_register" varchar,
  	"heading_content_responsible" varchar,
  	"heading_disclaimer" varchar,
  	"heading_liability_content" varchar,
  	"heading_liability_links" varchar,
  	"heading_copyright" varchar,
  	"heading_eu_dispute" varchar,
  	"company_name" varchar,
  	"street" varchar,
  	"postal_code" varchar,
  	"city" varchar,
  	"country" varchar DEFAULT 'Deutschland',
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"representatives_label" varchar DEFAULT 'Geschäftsführer:',
  	"register_court" varchar,
  	"register_number" varchar,
  	"vat_id" varchar,
  	"content_responsible_name" varchar,
  	"liability_content" jsonb,
  	"liability_links" jsonb,
  	"copyright" jsonb,
  	"eu_dispute_intro" jsonb,
  	"eu_dispute_url" varchar DEFAULT 'https://ec.europa.eu/consumers/odr/',
  	"eu_dispute_closing" jsonb,
  	"date_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_legal_content_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_legal_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"toc_label" varchar DEFAULT 'Inhaltsverzeichnis',
  	"date_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"media_id" integer,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum__pages_v_blocks_testimonial_background_color" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"location" varchar,
  	"height" "enum__pages_v_blocks_map_height" DEFAULT 'medium',
  	"zoom" numeric DEFAULT 14,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"speed" "enum__pages_v_blocks_marquee_banner_speed" DEFAULT 'normal',
  	"appearance" "enum__pages_v_blocks_marquee_banner_appearance" DEFAULT 'solid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location" varchar,
  	"height" "enum_posts_blocks_map_height" DEFAULT 'medium',
  	"zoom" numeric DEFAULT 14,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"location" varchar,
  	"height" "enum__posts_v_blocks_map_height" DEFAULT 'medium',
  	"zoom" numeric DEFAULT 14,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_page_break" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_page_break_locales" (
  	"step_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_image_upload" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'portfolioImages' NOT NULL,
  	"max_files" numeric DEFAULT 6,
  	"max_file_size_m_b" numeric DEFAULT 8,
  	"width" numeric,
  	"min_width" numeric DEFAULT 1000,
  	"min_height" numeric DEFAULT 1400,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_image_upload_locales" (
  	"label" varchar DEFAULT 'Portfolio-Bilder',
  	"help_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_media_content_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "l_t" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_archive" "l_ar",
  	"link_label" varchar NOT NULL,
  	"link_appearance" "l_ap" DEFAULT 'primary-pill',
  	"link_track_clicks" boolean,
  	"link_tracking_event_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_media_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_talents_archive_blocks_media_content_layout" DEFAULT 'mediaLeft',
  	"media_id" integer NOT NULL,
  	"tagline" varchar,
  	"headline" varchar NOT NULL,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_impressum_representatives_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_impressum" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_company" varchar,
  	"heading_contact" varchar,
  	"heading_representatives" varchar,
  	"heading_register" varchar,
  	"heading_content_responsible" varchar,
  	"heading_disclaimer" varchar,
  	"heading_liability_content" varchar,
  	"heading_liability_links" varchar,
  	"heading_copyright" varchar,
  	"heading_eu_dispute" varchar,
  	"company_name" varchar NOT NULL,
  	"street" varchar NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar DEFAULT 'Deutschland' NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"representatives_label" varchar DEFAULT 'Geschäftsführer:',
  	"register_court" varchar,
  	"register_number" varchar,
  	"vat_id" varchar,
  	"content_responsible_name" varchar NOT NULL,
  	"liability_content" jsonb,
  	"liability_links" jsonb,
  	"copyright" jsonb,
  	"eu_dispute_intro" jsonb,
  	"eu_dispute_url" varchar DEFAULT 'https://ec.europa.eu/consumers/odr/',
  	"eu_dispute_closing" jsonb,
  	"date_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_legal_content_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"content" jsonb NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_legal_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"toc_label" varchar DEFAULT 'Inhaltsverzeichnis',
  	"date_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_testimonial_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"media_id" integer,
  	"logo_id" integer
  );
  
  CREATE TABLE "talents_archive_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"headline" varchar,
  	"headline_highlight" varchar,
  	"background_color" "enum_talents_archive_blocks_testimonial_background_color" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location" varchar NOT NULL,
  	"height" "enum_talents_archive_blocks_map_height" DEFAULT 'medium',
  	"zoom" numeric DEFAULT 14,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_marquee_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"speed" "enum_talents_archive_blocks_marquee_banner_speed" DEFAULT 'normal',
  	"appearance" "enum_talents_archive_blocks_marquee_banner_appearance" DEFAULT 'solid',
  	"block_name" varchar
  );
  
  CREATE TABLE "notion_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"api_key" varchar,
  	"database_id" varchar,
  	"sync_on_publish" boolean DEFAULT true,
  	"archive_on_delete" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'Was du gewinnst';
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Unsere Lead-Coaches';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'E-Mail schreiben';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Anrufen';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Besuchen';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Folgen';
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'Was du gewinnst';
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Unsere Lead-Coaches';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'E-Mail schreiben';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Anrufen';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Besuchen';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Folgen';
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'Was du gewinnst';
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Unsere Lead-Coaches';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'E-Mail schreiben';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Anrufen';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Besuchen';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Folgen';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_sticky_media" ADD COLUMN "background_color" "enum_pages_blocks_sticky_media_background_color" DEFAULT 'white';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "overline" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_info_cards" ADD COLUMN "side_media_id" integer;
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_featured_talents" ADD COLUMN "randomize" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_featured_talents" ADD COLUMN "size" "enum_pages_blocks_featured_talents_size" DEFAULT 'normal';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_media_mobile_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_video_mobile_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_video_url_mobile" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_poster_image_mobile_id" integer;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_blocks_sticky_media" ADD COLUMN "background_color" "enum__pages_v_blocks_sticky_media_background_color" DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "overline" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_info_cards" ADD COLUMN "side_media_id" integer;
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_featured_talents" ADD COLUMN "randomize" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_featured_talents" ADD COLUMN "size" "enum__pages_v_blocks_featured_talents_size" DEFAULT 'normal';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_media_mobile_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_video_mobile_id" integer;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_video_url_mobile" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_poster_image_mobile_id" integer;
  ALTER TABLE "media" ADD COLUMN "performance_note" varchar;
  ALTER TABLE "posts_blocks_cta" ADD COLUMN "media_id" integer;
  ALTER TABLE "posts" ADD COLUMN "page_settings_include_breadcrumbs" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "page_settings_include_organization" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "class_details_map_embed_url" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "page_settings_schema_markup" varchar;
  ALTER TABLE "_posts_v_blocks_cta" ADD COLUMN "media_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_page_settings_include_breadcrumbs" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_page_settings_include_organization" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_map_embed_url" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_page_settings_schema_markup" varchar;
  ALTER TABLE "talents" ADD COLUMN "cutout_image_id" integer;
  ALTER TABLE "talents" ADD COLUMN "height_num" numeric;
  ALTER TABLE "_talents_v" ADD COLUMN "version_cutout_image_id" integer;
  ALTER TABLE "_talents_v" ADD COLUMN "version_height_num" numeric;
  ALTER TABLE "form_submissions" ADD COLUMN "application_validation_notes" varchar;
  ALTER TABLE "talents_archive_blocks_cta" ADD COLUMN "media_id" integer;
  ALTER TABLE "talents_archive_blocks_sticky_media" ADD COLUMN "background_color" "enum_talents_archive_blocks_sticky_media_background_color" DEFAULT 'white';
  ALTER TABLE "talents_archive_blocks_form_block" ADD COLUMN "overline" varchar;
  ALTER TABLE "talents_archive_blocks_form_block" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "talents_archive_blocks_form_block" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_form_block" ADD COLUMN "description" varchar;
  ALTER TABLE "talents_archive_blocks_info_cards" ADD COLUMN "side_media_id" integer;
  ALTER TABLE "talents_archive_blocks_stats" ADD COLUMN "title" varchar;
  ALTER TABLE "talents_archive_blocks_featured_talents" ADD COLUMN "randomize" boolean DEFAULT false;
  ALTER TABLE "talents_archive_blocks_featured_talents" ADD COLUMN "size" "enum_talents_archive_blocks_featured_talents_size" DEFAULT 'normal';
  ALTER TABLE "form_settings" ADD COLUMN "turnstile_site_key" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "turnstile_secret_key" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "resend_api_key" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "resend_from_address" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "resend_from_name" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "enable_upstash" boolean DEFAULT false;
  ALTER TABLE "form_settings" ADD COLUMN "upstash_redis_url" varchar;
  ALTER TABLE "form_settings" ADD COLUMN "upstash_redis_token" varchar;
  ALTER TABLE "pages_blocks_media_content_links" ADD CONSTRAINT "pages_blocks_media_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content" ADD CONSTRAINT "pages_blocks_media_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_content" ADD CONSTRAINT "pages_blocks_media_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_impressum_representatives_names" ADD CONSTRAINT "pages_blocks_impressum_representatives_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_impressum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_impressum" ADD CONSTRAINT "pages_blocks_impressum_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_content_sections" ADD CONSTRAINT "pages_blocks_legal_content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_legal_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_content" ADD CONSTRAINT "pages_blocks_legal_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_items" ADD CONSTRAINT "pages_blocks_testimonial_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_items" ADD CONSTRAINT "pages_blocks_testimonial_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_items" ADD CONSTRAINT "pages_blocks_testimonial_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_items" ADD CONSTRAINT "pages_blocks_testimonial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial" ADD CONSTRAINT "pages_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_banner" ADD CONSTRAINT "pages_blocks_marquee_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content_links" ADD CONSTRAINT "_pages_v_blocks_media_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content" ADD CONSTRAINT "_pages_v_blocks_media_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_content" ADD CONSTRAINT "_pages_v_blocks_media_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_impressum_representatives_names" ADD CONSTRAINT "_pages_v_blocks_impressum_representatives_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_impressum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_impressum" ADD CONSTRAINT "_pages_v_blocks_impressum_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_legal_content_sections" ADD CONSTRAINT "_pages_v_blocks_legal_content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_legal_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_legal_content" ADD CONSTRAINT "_pages_v_blocks_legal_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_items" ADD CONSTRAINT "_pages_v_blocks_testimonial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial" ADD CONSTRAINT "_pages_v_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map" ADD CONSTRAINT "_pages_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_banner" ADD CONSTRAINT "_pages_v_blocks_marquee_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_map" ADD CONSTRAINT "posts_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_map" ADD CONSTRAINT "_posts_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_page_break" ADD CONSTRAINT "forms_blocks_page_break_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_page_break_locales" ADD CONSTRAINT "forms_blocks_page_break_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_page_break"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_image_upload" ADD CONSTRAINT "forms_blocks_image_upload_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_image_upload_locales" ADD CONSTRAINT "forms_blocks_image_upload_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_image_upload"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_media_content_links" ADD CONSTRAINT "talents_archive_blocks_media_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_media_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_media_content" ADD CONSTRAINT "talents_archive_blocks_media_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_media_content" ADD CONSTRAINT "talents_archive_blocks_media_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_impressum_representatives_names" ADD CONSTRAINT "talents_archive_blocks_impressum_representatives_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_impressum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_impressum" ADD CONSTRAINT "talents_archive_blocks_impressum_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_legal_content_sections" ADD CONSTRAINT "talents_archive_blocks_legal_content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_legal_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_legal_content" ADD CONSTRAINT "talents_archive_blocks_legal_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_testimonial_items" ADD CONSTRAINT "talents_archive_blocks_testimonial_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_testimonial_items" ADD CONSTRAINT "talents_archive_blocks_testimonial_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_testimonial_items" ADD CONSTRAINT "talents_archive_blocks_testimonial_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_testimonial_items" ADD CONSTRAINT "talents_archive_blocks_testimonial_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_testimonial" ADD CONSTRAINT "talents_archive_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_map" ADD CONSTRAINT "talents_archive_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_marquee_banner" ADD CONSTRAINT "talents_archive_blocks_marquee_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_media_content_links_order_idx" ON "pages_blocks_media_content_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_content_links_parent_id_idx" ON "pages_blocks_media_content_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_content_links_locale_idx" ON "pages_blocks_media_content_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_media_content_order_idx" ON "pages_blocks_media_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_content_parent_id_idx" ON "pages_blocks_media_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_content_path_idx" ON "pages_blocks_media_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_content_locale_idx" ON "pages_blocks_media_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_media_content_media_idx" ON "pages_blocks_media_content" USING btree ("media_id");
  CREATE INDEX "pages_blocks_impressum_representatives_names_order_idx" ON "pages_blocks_impressum_representatives_names" USING btree ("_order");
  CREATE INDEX "pages_blocks_impressum_representatives_names_parent_id_idx" ON "pages_blocks_impressum_representatives_names" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impressum_representatives_names_locale_idx" ON "pages_blocks_impressum_representatives_names" USING btree ("_locale");
  CREATE INDEX "pages_blocks_impressum_order_idx" ON "pages_blocks_impressum" USING btree ("_order");
  CREATE INDEX "pages_blocks_impressum_parent_id_idx" ON "pages_blocks_impressum" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_impressum_path_idx" ON "pages_blocks_impressum" USING btree ("_path");
  CREATE INDEX "pages_blocks_impressum_locale_idx" ON "pages_blocks_impressum" USING btree ("_locale");
  CREATE INDEX "pages_blocks_legal_content_sections_order_idx" ON "pages_blocks_legal_content_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_content_sections_parent_id_idx" ON "pages_blocks_legal_content_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_legal_content_sections_locale_idx" ON "pages_blocks_legal_content_sections" USING btree ("_locale");
  CREATE INDEX "pages_blocks_legal_content_order_idx" ON "pages_blocks_legal_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_content_parent_id_idx" ON "pages_blocks_legal_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_legal_content_path_idx" ON "pages_blocks_legal_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_legal_content_locale_idx" ON "pages_blocks_legal_content" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonial_items_order_idx" ON "pages_blocks_testimonial_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_items_parent_id_idx" ON "pages_blocks_testimonial_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_items_locale_idx" ON "pages_blocks_testimonial_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonial_items_avatar_idx" ON "pages_blocks_testimonial_items" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonial_items_media_idx" ON "pages_blocks_testimonial_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_testimonial_items_logo_idx" ON "pages_blocks_testimonial_items" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_testimonial_order_idx" ON "pages_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_parent_id_idx" ON "pages_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_path_idx" ON "pages_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonial_locale_idx" ON "pages_blocks_testimonial" USING btree ("_locale");
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_locale_idx" ON "pages_blocks_map" USING btree ("_locale");
  CREATE INDEX "pages_blocks_marquee_banner_order_idx" ON "pages_blocks_marquee_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_banner_parent_id_idx" ON "pages_blocks_marquee_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_banner_path_idx" ON "pages_blocks_marquee_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_marquee_banner_locale_idx" ON "pages_blocks_marquee_banner" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_media_content_links_order_idx" ON "_pages_v_blocks_media_content_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_content_links_parent_id_idx" ON "_pages_v_blocks_media_content_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_content_links_locale_idx" ON "_pages_v_blocks_media_content_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_media_content_order_idx" ON "_pages_v_blocks_media_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_content_parent_id_idx" ON "_pages_v_blocks_media_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_content_path_idx" ON "_pages_v_blocks_media_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_content_locale_idx" ON "_pages_v_blocks_media_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_media_content_media_idx" ON "_pages_v_blocks_media_content" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_impressum_representatives_names_order_idx" ON "_pages_v_blocks_impressum_representatives_names" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impressum_representatives_names_parent_id_idx" ON "_pages_v_blocks_impressum_representatives_names" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impressum_representatives_names_locale_idx" ON "_pages_v_blocks_impressum_representatives_names" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_impressum_order_idx" ON "_pages_v_blocks_impressum" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_impressum_parent_id_idx" ON "_pages_v_blocks_impressum" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_impressum_path_idx" ON "_pages_v_blocks_impressum" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_impressum_locale_idx" ON "_pages_v_blocks_impressum" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_legal_content_sections_order_idx" ON "_pages_v_blocks_legal_content_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_legal_content_sections_parent_id_idx" ON "_pages_v_blocks_legal_content_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_legal_content_sections_locale_idx" ON "_pages_v_blocks_legal_content_sections" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_legal_content_order_idx" ON "_pages_v_blocks_legal_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_legal_content_parent_id_idx" ON "_pages_v_blocks_legal_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_legal_content_path_idx" ON "_pages_v_blocks_legal_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_legal_content_locale_idx" ON "_pages_v_blocks_legal_content" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonial_items_order_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_items_parent_id_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_items_locale_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonial_items_avatar_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonial_items_media_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_testimonial_items_logo_idx" ON "_pages_v_blocks_testimonial_items" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_testimonial_order_idx" ON "_pages_v_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_parent_id_idx" ON "_pages_v_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_path_idx" ON "_pages_v_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonial_locale_idx" ON "_pages_v_blocks_testimonial" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_map_order_idx" ON "_pages_v_blocks_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_parent_id_idx" ON "_pages_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_path_idx" ON "_pages_v_blocks_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_locale_idx" ON "_pages_v_blocks_map" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_marquee_banner_order_idx" ON "_pages_v_blocks_marquee_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_banner_parent_id_idx" ON "_pages_v_blocks_marquee_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_banner_path_idx" ON "_pages_v_blocks_marquee_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marquee_banner_locale_idx" ON "_pages_v_blocks_marquee_banner" USING btree ("_locale");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_map_order_idx" ON "posts_blocks_map" USING btree ("_order");
  CREATE INDEX "posts_blocks_map_parent_id_idx" ON "posts_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_map_path_idx" ON "posts_blocks_map" USING btree ("_path");
  CREATE INDEX "posts_blocks_map_locale_idx" ON "posts_blocks_map" USING btree ("_locale");
  CREATE INDEX "_posts_v_blocks_map_order_idx" ON "_posts_v_blocks_map" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_map_parent_id_idx" ON "_posts_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_map_path_idx" ON "_posts_v_blocks_map" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_map_locale_idx" ON "_posts_v_blocks_map" USING btree ("_locale");
  CREATE INDEX "forms_blocks_page_break_order_idx" ON "forms_blocks_page_break" USING btree ("_order");
  CREATE INDEX "forms_blocks_page_break_parent_id_idx" ON "forms_blocks_page_break" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_page_break_path_idx" ON "forms_blocks_page_break" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_page_break_locales_locale_parent_id_unique" ON "forms_blocks_page_break_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_image_upload_order_idx" ON "forms_blocks_image_upload" USING btree ("_order");
  CREATE INDEX "forms_blocks_image_upload_parent_id_idx" ON "forms_blocks_image_upload" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_image_upload_path_idx" ON "forms_blocks_image_upload" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_image_upload_locales_locale_parent_id_unique" ON "forms_blocks_image_upload_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "talents_archive_blocks_media_content_links_order_idx" ON "talents_archive_blocks_media_content_links" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_media_content_links_parent_id_idx" ON "talents_archive_blocks_media_content_links" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_media_content_links_locale_idx" ON "talents_archive_blocks_media_content_links" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_media_content_order_idx" ON "talents_archive_blocks_media_content" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_media_content_parent_id_idx" ON "talents_archive_blocks_media_content" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_media_content_path_idx" ON "talents_archive_blocks_media_content" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_media_content_locale_idx" ON "talents_archive_blocks_media_content" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_media_content_media_idx" ON "talents_archive_blocks_media_content" USING btree ("media_id");
  CREATE INDEX "talents_archive_blocks_impressum_representatives_names_order_idx" ON "talents_archive_blocks_impressum_representatives_names" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_impressum_representatives_names_parent_id_idx" ON "talents_archive_blocks_impressum_representatives_names" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_impressum_representatives_names_locale_idx" ON "talents_archive_blocks_impressum_representatives_names" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_impressum_order_idx" ON "talents_archive_blocks_impressum" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_impressum_parent_id_idx" ON "talents_archive_blocks_impressum" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_impressum_path_idx" ON "talents_archive_blocks_impressum" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_impressum_locale_idx" ON "talents_archive_blocks_impressum" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_legal_content_sections_order_idx" ON "talents_archive_blocks_legal_content_sections" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_legal_content_sections_parent_id_idx" ON "talents_archive_blocks_legal_content_sections" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_legal_content_sections_locale_idx" ON "talents_archive_blocks_legal_content_sections" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_legal_content_order_idx" ON "talents_archive_blocks_legal_content" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_legal_content_parent_id_idx" ON "talents_archive_blocks_legal_content" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_legal_content_path_idx" ON "talents_archive_blocks_legal_content" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_legal_content_locale_idx" ON "talents_archive_blocks_legal_content" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_testimonial_items_order_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_testimonial_items_parent_id_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_testimonial_items_locale_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_testimonial_items_avatar_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("avatar_id");
  CREATE INDEX "talents_archive_blocks_testimonial_items_media_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("media_id");
  CREATE INDEX "talents_archive_blocks_testimonial_items_logo_idx" ON "talents_archive_blocks_testimonial_items" USING btree ("logo_id");
  CREATE INDEX "talents_archive_blocks_testimonial_order_idx" ON "talents_archive_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_testimonial_parent_id_idx" ON "talents_archive_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_testimonial_path_idx" ON "talents_archive_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_testimonial_locale_idx" ON "talents_archive_blocks_testimonial" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_map_order_idx" ON "talents_archive_blocks_map" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_map_parent_id_idx" ON "talents_archive_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_map_path_idx" ON "talents_archive_blocks_map" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_map_locale_idx" ON "talents_archive_blocks_map" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_marquee_banner_order_idx" ON "talents_archive_blocks_marquee_banner" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_marquee_banner_parent_id_idx" ON "talents_archive_blocks_marquee_banner" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_marquee_banner_path_idx" ON "talents_archive_blocks_marquee_banner" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_marquee_banner_locale_idx" ON "talents_archive_blocks_marquee_banner" USING btree ("_locale");
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_info_cards" ADD CONSTRAINT "pages_blocks_info_cards_side_media_id_media_id_fk" FOREIGN KEY ("side_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_video_mobile_id_media_id_fk" FOREIGN KEY ("hero_video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_hero_poster_image_mobile_id_media_id_fk" FOREIGN KEY ("hero_poster_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_info_cards" ADD CONSTRAINT "_pages_v_blocks_info_cards_side_media_id_media_id_fk" FOREIGN KEY ("side_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_video_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_hero_poster_image_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_poster_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta" ADD CONSTRAINT "posts_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta" ADD CONSTRAINT "_posts_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents" ADD CONSTRAINT "talents_cutout_image_id_media_id_fk" FOREIGN KEY ("cutout_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_talents_v" ADD CONSTRAINT "_talents_v_version_cutout_image_id_media_id_fk" FOREIGN KEY ("version_cutout_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_cta" ADD CONSTRAINT "talents_archive_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_info_cards" ADD CONSTRAINT "talents_archive_blocks_info_cards_side_media_id_media_id_fk" FOREIGN KEY ("side_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_media_idx" ON "pages_blocks_cta" USING btree ("media_id");
  CREATE INDEX "pages_blocks_info_cards_side_media_idx" ON "pages_blocks_info_cards" USING btree ("side_media_id");
  CREATE INDEX "pages_hero_hero_media_mobile_idx" ON "pages_locales" USING btree ("hero_media_mobile_id");
  CREATE INDEX "pages_hero_hero_video_mobile_idx" ON "pages_locales" USING btree ("hero_video_mobile_id");
  CREATE INDEX "pages_hero_hero_poster_image_mobile_idx" ON "pages_locales" USING btree ("hero_poster_image_mobile_id");
  CREATE INDEX "_pages_v_blocks_cta_media_idx" ON "_pages_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_info_cards_side_media_idx" ON "_pages_v_blocks_info_cards" USING btree ("side_media_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_mobile_idx" ON "_pages_v_locales" USING btree ("version_hero_media_mobile_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_video_mobile_idx" ON "_pages_v_locales" USING btree ("version_hero_video_mobile_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_poster_image_mobile_idx" ON "_pages_v_locales" USING btree ("version_hero_poster_image_mobile_id");
  CREATE INDEX "posts_blocks_cta_media_idx" ON "posts_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_cta_media_idx" ON "_posts_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "talents_name_idx" ON "talents" USING btree ("name");
  CREATE INDEX "talents_category_idx" ON "talents" USING btree ("category");
  CREATE INDEX "talents_cutout_image_idx" ON "talents" USING btree ("cutout_image_id");
  CREATE INDEX "_talents_v_version_version_name_idx" ON "_talents_v" USING btree ("version_name");
  CREATE INDEX "_talents_v_version_version_category_idx" ON "_talents_v" USING btree ("version_category");
  CREATE INDEX "_talents_v_version_version_cutout_image_idx" ON "_talents_v" USING btree ("version_cutout_image_id");
  CREATE INDEX "talents_archive_blocks_cta_media_idx" ON "talents_archive_blocks_cta" USING btree ("media_id");
  CREATE INDEX "talents_archive_blocks_info_cards_side_media_idx" ON "talents_archive_blocks_info_cards" USING btree ("side_media_id");
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "title_line1";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "title_line1";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "posts" DROP COLUMN "page_settings_custom_schema";
  ALTER TABLE "_posts_v" DROP COLUMN "version_page_settings_custom_schema";
  ALTER TABLE "talents_archive_blocks_stats" DROP COLUMN "title_line1";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_content_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_impressum_representatives_names" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_impressum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_legal_content_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_legal_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonial_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonial" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_marquee_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_content_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_impressum_representatives_names" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_impressum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_legal_content_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_legal_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonial_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonial" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_marquee_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_page_break" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_page_break_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_image_upload" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_image_upload_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_media_content_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_media_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_impressum_representatives_names" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_impressum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_legal_content_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_legal_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_testimonial_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_testimonial" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_marquee_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "notion_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_media_content_links" CASCADE;
  DROP TABLE "pages_blocks_media_content" CASCADE;
  DROP TABLE "pages_blocks_impressum_representatives_names" CASCADE;
  DROP TABLE "pages_blocks_impressum" CASCADE;
  DROP TABLE "pages_blocks_legal_content_sections" CASCADE;
  DROP TABLE "pages_blocks_legal_content" CASCADE;
  DROP TABLE "pages_blocks_testimonial_items" CASCADE;
  DROP TABLE "pages_blocks_testimonial" CASCADE;
  DROP TABLE "pages_blocks_map" CASCADE;
  DROP TABLE "pages_blocks_marquee_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content_links" CASCADE;
  DROP TABLE "_pages_v_blocks_media_content" CASCADE;
  DROP TABLE "_pages_v_blocks_impressum_representatives_names" CASCADE;
  DROP TABLE "_pages_v_blocks_impressum" CASCADE;
  DROP TABLE "_pages_v_blocks_legal_content_sections" CASCADE;
  DROP TABLE "_pages_v_blocks_legal_content" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial" CASCADE;
  DROP TABLE "_pages_v_blocks_map" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee_banner" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "posts_blocks_map" CASCADE;
  DROP TABLE "_posts_v_blocks_map" CASCADE;
  DROP TABLE "forms_blocks_page_break" CASCADE;
  DROP TABLE "forms_blocks_page_break_locales" CASCADE;
  DROP TABLE "forms_blocks_image_upload" CASCADE;
  DROP TABLE "forms_blocks_image_upload_locales" CASCADE;
  DROP TABLE "talents_archive_blocks_media_content_links" CASCADE;
  DROP TABLE "talents_archive_blocks_media_content" CASCADE;
  DROP TABLE "talents_archive_blocks_impressum_representatives_names" CASCADE;
  DROP TABLE "talents_archive_blocks_impressum" CASCADE;
  DROP TABLE "talents_archive_blocks_legal_content_sections" CASCADE;
  DROP TABLE "talents_archive_blocks_legal_content" CASCADE;
  DROP TABLE "talents_archive_blocks_testimonial_items" CASCADE;
  DROP TABLE "talents_archive_blocks_testimonial" CASCADE;
  DROP TABLE "talents_archive_blocks_map" CASCADE;
  DROP TABLE "talents_archive_blocks_marquee_banner" CASCADE;
  DROP TABLE "notion_settings" CASCADE;
  ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_info_cards" DROP CONSTRAINT "pages_blocks_info_cards_side_media_id_media_id_fk";
  
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_hero_media_mobile_id_media_id_fk";
  
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_hero_video_mobile_id_media_id_fk";
  
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_hero_poster_image_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta" DROP CONSTRAINT "_pages_v_blocks_cta_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_info_cards" DROP CONSTRAINT "_pages_v_blocks_info_cards_side_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_hero_media_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_hero_video_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_version_hero_poster_image_mobile_id_media_id_fk";
  
  ALTER TABLE "posts_blocks_cta" DROP CONSTRAINT "posts_blocks_cta_media_id_media_id_fk";
  
  ALTER TABLE "_posts_v_blocks_cta" DROP CONSTRAINT "_posts_v_blocks_cta_media_id_media_id_fk";
  
  ALTER TABLE "talents" DROP CONSTRAINT "talents_cutout_image_id_media_id_fk";
  
  ALTER TABLE "_talents_v" DROP CONSTRAINT "_talents_v_version_cutout_image_id_media_id_fk";
  
  ALTER TABLE "talents_archive_blocks_cta" DROP CONSTRAINT "talents_archive_blocks_cta_media_id_media_id_fk";
  
  ALTER TABLE "talents_archive_blocks_info_cards" DROP CONSTRAINT "talents_archive_blocks_info_cards_side_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum_pages_blocks_cta_variant";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_cta_variant" USING "variant"::"public"."enum_pages_blocks_cta_variant";
  ALTER TABLE "pages_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::text;
  DROP TYPE "public"."enum_pages_blocks_featured_talents_layout";
  CREATE TYPE "public"."enum_pages_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  ALTER TABLE "pages_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::"public"."enum_pages_blocks_featured_talents_layout";
  ALTER TABLE "pages_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_featured_talents_layout" USING "layout"::"public"."enum_pages_blocks_featured_talents_layout";
  ALTER TABLE "pages" ALTER COLUMN "page_settings_schema_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "page_settings_schema_type" SET DEFAULT 'WebPage'::text;
  DROP TYPE "public"."enum_pages_page_settings_schema_type";
  CREATE TYPE "public"."enum_pages_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'FAQPage', 'ContactPage', 'AboutPage', 'CollectionPage');
  ALTER TABLE "pages" ALTER COLUMN "page_settings_schema_type" SET DEFAULT 'WebPage'::"public"."enum_pages_page_settings_schema_type";
  ALTER TABLE "pages" ALTER COLUMN "page_settings_schema_type" SET DATA TYPE "public"."enum_pages_page_settings_schema_type" USING "page_settings_schema_type"::"public"."enum_pages_page_settings_schema_type";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_cta_variant";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_cta_variant" USING "variant"::"public"."enum__pages_v_blocks_cta_variant";
  ALTER TABLE "_pages_v_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::text;
  DROP TYPE "public"."enum__pages_v_blocks_featured_talents_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  ALTER TABLE "_pages_v_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::"public"."enum__pages_v_blocks_featured_talents_layout";
  ALTER TABLE "_pages_v_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE "public"."enum__pages_v_blocks_featured_talents_layout" USING "layout"::"public"."enum__pages_v_blocks_featured_talents_layout";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_settings_schema_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_settings_schema_type" SET DEFAULT 'WebPage'::text;
  DROP TYPE "public"."enum__pages_v_version_page_settings_schema_type";
  CREATE TYPE "public"."enum__pages_v_version_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'FAQPage', 'ContactPage', 'AboutPage', 'CollectionPage');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_settings_schema_type" SET DEFAULT 'WebPage'::"public"."enum__pages_v_version_page_settings_schema_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_page_settings_schema_type" SET DATA TYPE "public"."enum__pages_v_version_page_settings_schema_type" USING "version_page_settings_schema_type"::"public"."enum__pages_v_version_page_settings_schema_type";
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_posts_blocks_cta_variant";
  CREATE TYPE "public"."enum_posts_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum_posts_blocks_cta_variant";
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_posts_blocks_cta_variant" USING "variant"::"public"."enum_posts_blocks_cta_variant";
  ALTER TABLE "posts" ALTER COLUMN "page_settings_schema_type" SET DATA TYPE text;
  ALTER TABLE "posts" ALTER COLUMN "page_settings_schema_type" SET DEFAULT 'WebPage'::text;
  DROP TYPE "public"."enum_posts_page_settings_schema_type";
  CREATE TYPE "public"."enum_posts_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'FAQPage', 'ContactPage', 'AboutPage', 'Service', 'Product');
  ALTER TABLE "posts" ALTER COLUMN "page_settings_schema_type" SET DEFAULT 'WebPage'::"public"."enum_posts_page_settings_schema_type";
  ALTER TABLE "posts" ALTER COLUMN "page_settings_schema_type" SET DATA TYPE "public"."enum_posts_page_settings_schema_type" USING "page_settings_schema_type"::"public"."enum_posts_page_settings_schema_type";
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__posts_v_blocks_cta_variant";
  CREATE TYPE "public"."enum__posts_v_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum__posts_v_blocks_cta_variant";
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__posts_v_blocks_cta_variant" USING "variant"::"public"."enum__posts_v_blocks_cta_variant";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_page_settings_schema_type" SET DATA TYPE text;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_page_settings_schema_type" SET DEFAULT 'WebPage'::text;
  DROP TYPE "public"."enum__posts_v_version_page_settings_schema_type";
  CREATE TYPE "public"."enum__posts_v_version_page_settings_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'FAQPage', 'ContactPage', 'AboutPage', 'Service', 'Product');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_page_settings_schema_type" SET DEFAULT 'WebPage'::"public"."enum__posts_v_version_page_settings_schema_type";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_page_settings_schema_type" SET DATA TYPE "public"."enum__posts_v_version_page_settings_schema_type" USING "version_page_settings_schema_type"::"public"."enum__posts_v_version_page_settings_schema_type";
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_talents_archive_blocks_cta_variant";
  CREATE TYPE "public"."enum_talents_archive_blocks_cta_variant" AS ENUM('default', 'background', 'banner');
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "variant" SET DEFAULT 'default'::"public"."enum_talents_archive_blocks_cta_variant";
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_talents_archive_blocks_cta_variant" USING "variant"::"public"."enum_talents_archive_blocks_cta_variant";
  ALTER TABLE "talents_archive_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::text;
  DROP TYPE "public"."enum_talents_archive_blocks_featured_talents_layout";
  CREATE TYPE "public"."enum_talents_archive_blocks_featured_talents_layout" AS ENUM('carousel', 'grid');
  ALTER TABLE "talents_archive_blocks_featured_talents" ALTER COLUMN "layout" SET DEFAULT 'carousel'::"public"."enum_talents_archive_blocks_featured_talents_layout";
  ALTER TABLE "talents_archive_blocks_featured_talents" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_talents_archive_blocks_featured_talents_layout" USING "layout"::"public"."enum_talents_archive_blocks_featured_talents_layout";
  DROP INDEX "pages_blocks_cta_media_idx";
  DROP INDEX "pages_blocks_info_cards_side_media_idx";
  DROP INDEX "pages_hero_hero_media_mobile_idx";
  DROP INDEX "pages_hero_hero_video_mobile_idx";
  DROP INDEX "pages_hero_hero_poster_image_mobile_idx";
  DROP INDEX "_pages_v_blocks_cta_media_idx";
  DROP INDEX "_pages_v_blocks_info_cards_side_media_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_mobile_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_video_mobile_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_poster_image_mobile_idx";
  DROP INDEX "posts_blocks_cta_media_idx";
  DROP INDEX "_posts_v_blocks_cta_media_idx";
  DROP INDEX "talents_name_idx";
  DROP INDEX "talents_category_idx";
  DROP INDEX "talents_cutout_image_idx";
  DROP INDEX "_talents_v_version_version_name_idx";
  DROP INDEX "_talents_v_version_version_category_idx";
  DROP INDEX "_talents_v_version_version_cutout_image_idx";
  DROP INDEX "talents_archive_blocks_cta_media_idx";
  DROP INDEX "talents_archive_blocks_info_cards_side_media_idx";
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'What You''ll Gain';
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Our Lead Coaches';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'Email Us';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Call Us';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Visit Us';
  ALTER TABLE "pages_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Follow Us';
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'What You''ll Gain';
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Our Lead Coaches';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'Email Us';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Call Us';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Visit Us';
  ALTER TABLE "_pages_v_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Follow Us';
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "benefits_subheading" SET DEFAULT 'What You''ll Gain';
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "coaches_subheading" SET DEFAULT 'Our Lead Coaches';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "email_label" SET DEFAULT 'Email Us';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "phone_label" SET DEFAULT 'Call Us';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "address_label" SET DEFAULT 'Visit Us';
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "social_label" SET DEFAULT 'Follow Us';
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "posts" ADD COLUMN "page_settings_custom_schema" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_page_settings_custom_schema" varchar;
  ALTER TABLE "talents_archive_blocks_stats" ADD COLUMN "title_line1" varchar;
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "media_id";
  ALTER TABLE "pages_blocks_sticky_media" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "overline";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "title_line1";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_info_cards" DROP COLUMN "side_media_id";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_featured_talents" DROP COLUMN "randomize";
  ALTER TABLE "pages_blocks_featured_talents" DROP COLUMN "size";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_media_mobile_id";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_video_mobile_id";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_video_url_mobile";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_poster_image_mobile_id";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_blocks_sticky_media" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "overline";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "title_line1";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_info_cards" DROP COLUMN "side_media_id";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_featured_talents" DROP COLUMN "randomize";
  ALTER TABLE "_pages_v_blocks_featured_talents" DROP COLUMN "size";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_media_mobile_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_video_mobile_id";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_video_url_mobile";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_poster_image_mobile_id";
  ALTER TABLE "media" DROP COLUMN "performance_note";
  ALTER TABLE "posts_blocks_cta" DROP COLUMN "media_id";
  ALTER TABLE "posts" DROP COLUMN "page_settings_include_breadcrumbs";
  ALTER TABLE "posts" DROP COLUMN "page_settings_include_organization";
  ALTER TABLE "posts" DROP COLUMN "class_details_map_embed_url";
  ALTER TABLE "posts_locales" DROP COLUMN "page_settings_schema_markup";
  ALTER TABLE "_posts_v_blocks_cta" DROP COLUMN "media_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_page_settings_include_breadcrumbs";
  ALTER TABLE "_posts_v" DROP COLUMN "version_page_settings_include_organization";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_map_embed_url";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_page_settings_schema_markup";
  ALTER TABLE "talents" DROP COLUMN "cutout_image_id";
  ALTER TABLE "talents" DROP COLUMN "height_num";
  ALTER TABLE "_talents_v" DROP COLUMN "version_cutout_image_id";
  ALTER TABLE "_talents_v" DROP COLUMN "version_height_num";
  ALTER TABLE "form_submissions" DROP COLUMN "application_validation_notes";
  ALTER TABLE "talents_archive_blocks_cta" DROP COLUMN "media_id";
  ALTER TABLE "talents_archive_blocks_sticky_media" DROP COLUMN "background_color";
  ALTER TABLE "talents_archive_blocks_form_block" DROP COLUMN "overline";
  ALTER TABLE "talents_archive_blocks_form_block" DROP COLUMN "title_line1";
  ALTER TABLE "talents_archive_blocks_form_block" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_form_block" DROP COLUMN "description";
  ALTER TABLE "talents_archive_blocks_info_cards" DROP COLUMN "side_media_id";
  ALTER TABLE "talents_archive_blocks_stats" DROP COLUMN "title";
  ALTER TABLE "talents_archive_blocks_featured_talents" DROP COLUMN "randomize";
  ALTER TABLE "talents_archive_blocks_featured_talents" DROP COLUMN "size";
  ALTER TABLE "form_settings" DROP COLUMN "turnstile_site_key";
  ALTER TABLE "form_settings" DROP COLUMN "turnstile_secret_key";
  ALTER TABLE "form_settings" DROP COLUMN "resend_api_key";
  ALTER TABLE "form_settings" DROP COLUMN "resend_from_address";
  ALTER TABLE "form_settings" DROP COLUMN "resend_from_name";
  ALTER TABLE "form_settings" DROP COLUMN "enable_upstash";
  ALTER TABLE "form_settings" DROP COLUMN "upstash_redis_url";
  ALTER TABLE "form_settings" DROP COLUMN "upstash_redis_token";
  DROP TYPE "public"."enum_pages_blocks_sticky_media_background_color";
  DROP TYPE "public"."enum_pages_blocks_media_content_layout";
  DROP TYPE "public"."enum_pages_blocks_featured_talents_size";
  DROP TYPE "public"."enum_pages_blocks_testimonial_background_color";
  DROP TYPE "public"."enum_pages_blocks_map_height";
  DROP TYPE "public"."enum_pages_blocks_marquee_banner_speed";
  DROP TYPE "public"."enum_pages_blocks_marquee_banner_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_sticky_media_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_media_content_layout";
  DROP TYPE "public"."enum__pages_v_blocks_featured_talents_size";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_map_height";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_banner_speed";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_banner_appearance";
  DROP TYPE "public"."enum_posts_blocks_map_height";
  DROP TYPE "public"."enum__posts_v_blocks_map_height";
  DROP TYPE "public"."enum_talents_archive_blocks_sticky_media_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_media_content_layout";
  DROP TYPE "public"."enum_talents_archive_blocks_featured_talents_size";
  DROP TYPE "public"."enum_talents_archive_blocks_testimonial_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_map_height";
  DROP TYPE "public"."enum_talents_archive_blocks_marquee_banner_speed";
  DROP TYPE "public"."enum_talents_archive_blocks_marquee_banner_appearance";`)
}
