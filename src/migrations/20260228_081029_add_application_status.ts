import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_grid_variant" AS ENUM('logos', 'text');
  CREATE TYPE "public"."enum_pages_blocks_schedule_layout" AS ENUM('list', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_grid_variant" AS ENUM('logos', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_schedule_layout" AS ENUM('list', 'grid');
  CREATE TYPE "public"."enum_form_submissions_application_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_talents_archive_blocks_logo_grid_variant" AS ENUM('logos', 'text');
  CREATE TYPE "public"."enum_talents_archive_blocks_schedule_layout" AS ENUM('list', 'grid');
  CREATE TABLE "pages_blocks_logo_grid_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_logo_grid_variant" DEFAULT 'logos',
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_schedule_classes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"coach" varchar,
  	"date_text" varchar,
  	"time" varchar,
  	"level" varchar,
  	"location" varchar,
  	"notes" varchar,
  	"booking_link" varchar
  );
  
  CREATE TABLE "pages_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"subtitle" varchar,
  	"layout" "enum_pages_blocks_schedule_layout" DEFAULT 'list',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_grid_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_logo_grid_variant" DEFAULT 'logos',
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schedule_classes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"coach" varchar,
  	"date_text" varchar,
  	"time" varchar,
  	"level" varchar,
  	"location" varchar,
  	"notes" varchar,
  	"booking_link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"subtitle" varchar,
  	"layout" "enum__pages_v_blocks_schedule_layout" DEFAULT 'list',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_logo_grid_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_talents_archive_blocks_logo_grid_variant" DEFAULT 'logos',
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_schedule_classes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"coach" varchar,
  	"date_text" varchar,
  	"time" varchar,
  	"level" varchar,
  	"location" varchar,
  	"notes" varchar,
  	"booking_link" varchar
  );
  
  CREATE TABLE "talents_archive_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"subtitle" varchar,
  	"layout" "enum_talents_archive_blocks_schedule_layout" DEFAULT 'list',
  	"block_name" varchar
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "application_status" "enum_form_submissions_application_status" DEFAULT 'pending';
  ALTER TABLE "form_submissions" ADD COLUMN "rejection_reason" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "linked_talent_id" integer;
  ALTER TABLE "pages_blocks_logo_grid_clients" ADD CONSTRAINT "pages_blocks_logo_grid_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid_clients" ADD CONSTRAINT "pages_blocks_logo_grid_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid" ADD CONSTRAINT "pages_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule_classes" ADD CONSTRAINT "pages_blocks_schedule_classes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule" ADD CONSTRAINT "pages_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_grid_clients" ADD CONSTRAINT "_pages_v_blocks_logo_grid_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_grid_clients" ADD CONSTRAINT "_pages_v_blocks_logo_grid_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_grid" ADD CONSTRAINT "_pages_v_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule_classes" ADD CONSTRAINT "_pages_v_blocks_schedule_classes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule" ADD CONSTRAINT "_pages_v_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_logo_grid_clients" ADD CONSTRAINT "talents_archive_blocks_logo_grid_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_logo_grid_clients" ADD CONSTRAINT "talents_archive_blocks_logo_grid_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_logo_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_logo_grid" ADD CONSTRAINT "talents_archive_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_schedule_classes" ADD CONSTRAINT "talents_archive_blocks_schedule_classes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive_blocks_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "talents_archive_blocks_schedule" ADD CONSTRAINT "talents_archive_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."talents_archive"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_grid_clients_order_idx" ON "pages_blocks_logo_grid_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_grid_clients_parent_id_idx" ON "pages_blocks_logo_grid_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_grid_clients_locale_idx" ON "pages_blocks_logo_grid_clients" USING btree ("_locale");
  CREATE INDEX "pages_blocks_logo_grid_clients_logo_idx" ON "pages_blocks_logo_grid_clients" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_grid_order_idx" ON "pages_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_grid_parent_id_idx" ON "pages_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_grid_path_idx" ON "pages_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_grid_locale_idx" ON "pages_blocks_logo_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_schedule_classes_order_idx" ON "pages_blocks_schedule_classes" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_classes_parent_id_idx" ON "pages_blocks_schedule_classes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_classes_locale_idx" ON "pages_blocks_schedule_classes" USING btree ("_locale");
  CREATE INDEX "pages_blocks_schedule_order_idx" ON "pages_blocks_schedule" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_parent_id_idx" ON "pages_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_path_idx" ON "pages_blocks_schedule" USING btree ("_path");
  CREATE INDEX "pages_blocks_schedule_locale_idx" ON "pages_blocks_schedule" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_logo_grid_clients_order_idx" ON "_pages_v_blocks_logo_grid_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_grid_clients_parent_id_idx" ON "_pages_v_blocks_logo_grid_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_grid_clients_locale_idx" ON "_pages_v_blocks_logo_grid_clients" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_logo_grid_clients_logo_idx" ON "_pages_v_blocks_logo_grid_clients" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_grid_order_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_grid_parent_id_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_grid_path_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_grid_locale_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_schedule_classes_order_idx" ON "_pages_v_blocks_schedule_classes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schedule_classes_parent_id_idx" ON "_pages_v_blocks_schedule_classes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schedule_classes_locale_idx" ON "_pages_v_blocks_schedule_classes" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_schedule_order_idx" ON "_pages_v_blocks_schedule" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schedule_parent_id_idx" ON "_pages_v_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schedule_path_idx" ON "_pages_v_blocks_schedule" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_schedule_locale_idx" ON "_pages_v_blocks_schedule" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_logo_grid_clients_order_idx" ON "talents_archive_blocks_logo_grid_clients" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_logo_grid_clients_parent_id_idx" ON "talents_archive_blocks_logo_grid_clients" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_logo_grid_clients_locale_idx" ON "talents_archive_blocks_logo_grid_clients" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_logo_grid_clients_logo_idx" ON "talents_archive_blocks_logo_grid_clients" USING btree ("logo_id");
  CREATE INDEX "talents_archive_blocks_logo_grid_order_idx" ON "talents_archive_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_logo_grid_parent_id_idx" ON "talents_archive_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_logo_grid_path_idx" ON "talents_archive_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_logo_grid_locale_idx" ON "talents_archive_blocks_logo_grid" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_schedule_classes_order_idx" ON "talents_archive_blocks_schedule_classes" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_schedule_classes_parent_id_idx" ON "talents_archive_blocks_schedule_classes" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_schedule_classes_locale_idx" ON "talents_archive_blocks_schedule_classes" USING btree ("_locale");
  CREATE INDEX "talents_archive_blocks_schedule_order_idx" ON "talents_archive_blocks_schedule" USING btree ("_order");
  CREATE INDEX "talents_archive_blocks_schedule_parent_id_idx" ON "talents_archive_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "talents_archive_blocks_schedule_path_idx" ON "talents_archive_blocks_schedule" USING btree ("_path");
  CREATE INDEX "talents_archive_blocks_schedule_locale_idx" ON "talents_archive_blocks_schedule" USING btree ("_locale");
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_linked_talent_id_talents_id_fk" FOREIGN KEY ("linked_talent_id") REFERENCES "public"."talents"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_linked_talent_idx" ON "form_submissions" USING btree ("linked_talent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_grid_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schedule_classes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_grid_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schedule_classes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_logo_grid_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_logo_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_schedule_classes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "talents_archive_blocks_schedule" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_logo_grid_clients" CASCADE;
  DROP TABLE "pages_blocks_logo_grid" CASCADE;
  DROP TABLE "pages_blocks_schedule_classes" CASCADE;
  DROP TABLE "pages_blocks_schedule" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_grid_clients" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_schedule_classes" CASCADE;
  DROP TABLE "_pages_v_blocks_schedule" CASCADE;
  DROP TABLE "talents_archive_blocks_logo_grid_clients" CASCADE;
  DROP TABLE "talents_archive_blocks_logo_grid" CASCADE;
  DROP TABLE "talents_archive_blocks_schedule_classes" CASCADE;
  DROP TABLE "talents_archive_blocks_schedule" CASCADE;
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_linked_talent_id_talents_id_fk";
  
  DROP INDEX "form_submissions_linked_talent_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "application_status";
  ALTER TABLE "form_submissions" DROP COLUMN "rejection_reason";
  ALTER TABLE "form_submissions" DROP COLUMN "linked_talent_id";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_schedule_layout";
  DROP TYPE "public"."enum__pages_v_blocks_logo_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_schedule_layout";
  DROP TYPE "public"."enum_form_submissions_application_status";
  DROP TYPE "public"."enum_talents_archive_blocks_logo_grid_variant";
  DROP TYPE "public"."enum_talents_archive_blocks_schedule_layout";`)
}
