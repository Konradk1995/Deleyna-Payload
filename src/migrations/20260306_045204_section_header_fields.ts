import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_highlights_variant" AS ENUM('mediaGrid', 'checklist');
  CREATE TYPE "public"."enum_pages_blocks_highlights_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_highlights_variant" AS ENUM('mediaGrid', 'checklist');
  CREATE TYPE "public"."enum__pages_v_blocks_highlights_background_color" AS ENUM('white', 'muted');
  CREATE TYPE "public"."enum_talents_archive_blocks_highlights_variant" AS ENUM('mediaGrid', 'checklist');
  CREATE TYPE "public"."enum_talents_archive_blocks_highlights_background_color" AS ENUM('white', 'muted');
  CREATE TABLE "pages_blocks_highlights_highlight_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_highlights_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"variant" "enum_pages_blocks_highlights_variant" DEFAULT 'checklist',
  	"background_color" "enum_pages_blocks_highlights_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"title" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"section_link_type" "l_t" DEFAULT 'reference',
  	"section_link_new_tab" boolean,
  	"section_link_url" varchar,
  	"section_link_archive" "l_ar",
  	"section_link_label" varchar,
  	"section_link_appearance" "l_ap" DEFAULT 'primary',
  	"section_link_track_clicks" boolean,
  	"section_link_tracking_event_name" varchar,
  	"media_id" integer,
  	"checklist_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlights_highlight_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlights_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"variant" "enum__pages_v_blocks_highlights_variant" DEFAULT 'checklist',
  	"background_color" "enum__pages_v_blocks_highlights_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"title" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"section_link_type" "l_t" DEFAULT 'reference',
  	"section_link_new_tab" boolean,
  	"section_link_url" varchar,
  	"section_link_archive" "l_ar",
  	"section_link_label" varchar,
  	"section_link_appearance" "l_ap" DEFAULT 'primary',
  	"section_link_track_clicks" boolean,
  	"section_link_tracking_event_name" varchar,
  	"media_id" integer,
  	"checklist_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_highlights_highlight_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_highlights_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "talents_archive_blocks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"variant" "enum_talents_archive_blocks_highlights_variant" DEFAULT 'checklist' NOT NULL,
  	"background_color" "enum_talents_archive_blocks_highlights_background_color" DEFAULT 'white',
  	"badge" varchar,
  	"title" varchar,
  	"title_highlight" varchar,
  	"description" varchar,
  	"section_link_type" "l_t" DEFAULT 'reference',
  	"section_link_new_tab" boolean,
  	"section_link_url" varchar,
  	"section_link_archive" "l_ar",
  	"section_link_label" varchar,
  	"section_link_appearance" "l_ap" DEFAULT 'primary',
  	"section_link_track_clicks" boolean,
  	"section_link_tracking_event_name" varchar,
  	"media_id" integer,
  	"checklist_heading" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_services" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "pages_blocks_education" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "pages_blocks_coaching" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "pages_blocks_contact" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "pages_blocks_featured_talents" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "pages_blocks_team" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_services" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_education" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_coaching" RENAME COLUMN "overline" TO "title_highlight";
  ALTER TABLE "_pages_v_blocks_contact" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_stats" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_featured_talents" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "_pages_v_blocks_team" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "talents_archive_blocks_services" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "talents_archive_blocks_education" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "talents_archive_blocks_coaching" RENAME COLUMN "overline" TO "title_highlight";
  ALTER TABLE "talents_archive_blocks_contact" RENAME COLUMN "overline" TO "title_highlight";
  ALTER TABLE "talents_archive_blocks_featured_talents" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "talents_archive_blocks_team" RENAME COLUMN "overline" TO "badge";
  ALTER TABLE "talents_archive_blocks_services" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "talents_archive_blocks_team" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "badge" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_services" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_education" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_coaching" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "badge" varchar;
  ALTER TABLE "pages_blocks_featured_talents" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_featured_talents" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_team" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "pages_blocks_team" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "badge" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_services" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_education" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_coaching" ADD COLUMN "badge" varchar;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_featured_talents" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_featured_talents" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN "description" varchar;
  ALTER TABLE "posts_blocks_faq" ADD COLUMN "badge" varchar;
  ALTER TABLE "posts_blocks_faq" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "_posts_v_blocks_faq" ADD COLUMN "badge" varchar;
  ALTER TABLE "_posts_v_blocks_faq" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "users" ADD COLUMN "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN "_verificationtoken" varchar;
  ALTER TABLE "talents_archive_blocks_faq" ADD COLUMN "badge" varchar;
  ALTER TABLE "talents_archive_blocks_faq" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_services" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_education" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_coaching" ADD COLUMN "badge" varchar;
  ALTER TABLE "talents_archive_blocks_contact" ADD COLUMN "badge" varchar;
  ALTER TABLE "talents_archive_blocks_contact" ADD COLUMN "description" varchar;
  ALTER TABLE "talents_archive_blocks_stats" ADD COLUMN "badge" varchar;
  ALTER TABLE "talents_archive_blocks_featured_talents" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_featured_talents" ADD COLUMN "description" varchar;
  ALTER TABLE "talents_archive_blocks_team" ADD COLUMN "title_highlight" varchar;
  ALTER TABLE "talents_archive_blocks_team" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_highlights_highlight_items" ADD CONSTRAINT "pages_blocks_highlights_highlight_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights_highlight_items" ADD CONSTRAINT "pages_blocks_highlights_highlight_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights_checklist_items" ADD CONSTRAINT "pages_blocks_highlights_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights" ADD CONSTRAINT "pages_blocks_highlights_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlights" ADD CONSTRAINT "pages_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_highlight_items" ADD CONSTRAINT "_pages_v_blocks_highlights_highlight_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_highlight_items" ADD CONSTRAINT "_pages_v_blocks_highlights_highlight_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights_checklist_items" ADD CONSTRAINT "_pages_v_blocks_highlights_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights" ADD CONSTRAINT "_pages_v_blocks_highlights_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlights" ADD CONSTRAINT "_pages_v_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_highlights_highlight_items" ADD CONSTRAINT "talents_archive_blocks_highlights_highlight_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_highlights_highlight_items" ADD CONSTRAINT "talents_archive_blocks_highlights_highlight_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_highlights_checklist_items" ADD CONSTRAINT "talents_archive_blocks_highlights_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_highlights" ADD CONSTRAINT "talents_archive_blocks_highlights_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_highlights" ADD CONSTRAINT "talents_archive_blocks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_highlights_highlight_items_order_idx" ON "pages_blocks_highlights_highlight_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_highlight_items_parent_id_idx" ON "pages_blocks_highlights_highlight_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_highlight_items_locale_idx" ON "pages_blocks_highlights_highlight_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_highlights_highlight_items_icon_idx" ON "pages_blocks_highlights_highlight_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_highlights_checklist_items_order_idx" ON "pages_blocks_highlights_checklist_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_checklist_items_parent_id_idx" ON "pages_blocks_highlights_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_checklist_items_locale_idx" ON "pages_blocks_highlights_checklist_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_highlights_order_idx" ON "pages_blocks_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlights_parent_id_idx" ON "pages_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlights_path_idx" ON "pages_blocks_highlights" USING btree ("_path");
  CREATE INDEX "pages_blocks_highlights_locale_idx" ON "pages_blocks_highlights" USING btree ("_locale");
  CREATE INDEX "pages_blocks_highlights_media_idx" ON "pages_blocks_highlights" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_highlights_highlight_items_order_idx" ON "_pages_v_blocks_highlights_highlight_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_highlight_items_parent_id_idx" ON "_pages_v_blocks_highlights_highlight_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_highlight_items_locale_idx" ON "_pages_v_blocks_highlights_highlight_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_highlights_highlight_items_icon_idx" ON "_pages_v_blocks_highlights_highlight_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_highlights_checklist_items_order_idx" ON "_pages_v_blocks_highlights_checklist_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_checklist_items_parent_id_idx" ON "_pages_v_blocks_highlights_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_checklist_items_locale_idx" ON "_pages_v_blocks_highlights_checklist_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_highlights_order_idx" ON "_pages_v_blocks_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlights_parent_id_idx" ON "_pages_v_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlights_path_idx" ON "_pages_v_blocks_highlights" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlights_locale_idx" ON "_pages_v_blocks_highlights" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_highlights_media_idx" ON "_pages_v_blocks_highlights" USING btree ("media_id");
  CREATE INDEX "talents_archive_blocks_highlights_highlight_items_order_idx" ON "talents_archive_blocks_highlights_highlight_items" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_highlights_highlight_items_parent_id_idx" ON "talents_archive_blocks_highlights_highlight_items" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_highlights_highlight_items_locale_idx" ON "talents_archive_blocks_highlights_highlight_items" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_highlights_highlight_items_icon_idx" ON "talents_archive_blocks_highlights_highlight_items" USING btree ("icon_id");
  CREATE INDEX "talents_archive_blocks_highlights_checklist_items_order_idx" ON "talents_archive_blocks_highlights_checklist_items" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_highlights_checklist_items_parent_id_idx" ON "talents_archive_blocks_highlights_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_highlights_checklist_items_locale_idx" ON "talents_archive_blocks_highlights_checklist_items" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_highlights_order_idx" ON "talents_archive_blocks_highlights" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_highlights_parent_id_idx" ON "talents_archive_blocks_highlights" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_highlights_path_idx" ON "talents_archive_blocks_highlights" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_highlights_locale_idx" ON "talents_archive_blocks_highlights" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_highlights_media_idx" ON "talents_archive_blocks_highlights" USING btree ("media_id");
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "overline";
  ALTER TABLE "talents_archive_blocks_stats" DROP COLUMN "overline";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_highlights_highlight_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_highlights_checklist_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_highlights_highlight_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_highlights_checklist_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_highlights_highlight_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_highlights_checklist_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_highlights" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_highlights_highlight_items" CASCADE;
  DROP TABLE "pages_blocks_highlights_checklist_items" CASCADE;
  DROP TABLE "pages_blocks_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights_highlight_items" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights_checklist_items" CASCADE;
  DROP TABLE "_pages_v_blocks_highlights" CASCADE;
  DROP TABLE "talents_archive_blocks_highlights_highlight_items" CASCADE;
  DROP TABLE "talents_archive_blocks_highlights_checklist_items" CASCADE;
  DROP TABLE "talents_archive_blocks_highlights" CASCADE;
  ALTER TABLE "pages_blocks_services" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_education" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_coaching" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_contact" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_featured_talents" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_team" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_education" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_coaching" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_contact" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_stats" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_featured_talents" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_team" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_services" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_education" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_coaching" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_contact" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_stats" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_featured_talents" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_team" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "talents_archive_blocks_services" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "talents_archive_blocks_contact" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "talents_archive_blocks_team" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_stats" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "_pages_v_blocks_services" RENAME COLUMN "badge" TO "overline";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "badge";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_services" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_education" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_coaching" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_featured_talents" DROP COLUMN "title_highlight";
  ALTER TABLE "pages_blocks_featured_talents" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_team" DROP COLUMN "badge";
  ALTER TABLE "pages_blocks_team" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "badge";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_services" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_education" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_coaching" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_featured_talents" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_featured_talents" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN "title_highlight";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN "description";
  ALTER TABLE "posts_blocks_faq" DROP COLUMN "badge";
  ALTER TABLE "posts_blocks_faq" DROP COLUMN "title_highlight";
  ALTER TABLE "_posts_v_blocks_faq" DROP COLUMN "badge";
  ALTER TABLE "_posts_v_blocks_faq" DROP COLUMN "title_highlight";
  ALTER TABLE "users" DROP COLUMN "_verified";
  ALTER TABLE "users" DROP COLUMN "_verificationtoken";
  ALTER TABLE "talents_archive_blocks_faq" DROP COLUMN "badge";
  ALTER TABLE "talents_archive_blocks_faq" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_services" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_education" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_coaching" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_contact" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_contact" DROP COLUMN "description";
  ALTER TABLE "talents_archive_blocks_featured_talents" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_featured_talents" DROP COLUMN "description";
  ALTER TABLE "talents_archive_blocks_team" DROP COLUMN "title_highlight";
  ALTER TABLE "talents_archive_blocks_team" DROP COLUMN "description";
  DROP TYPE "public"."enum_pages_blocks_highlights_variant";
  DROP TYPE "public"."enum_pages_blocks_highlights_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_highlights_variant";
  DROP TYPE "public"."enum__pages_v_blocks_highlights_background_color";
  DROP TYPE "public"."enum_talents_archive_blocks_highlights_variant";
  DROP TYPE "public"."enum_talents_archive_blocks_highlights_background_color";`)
}
