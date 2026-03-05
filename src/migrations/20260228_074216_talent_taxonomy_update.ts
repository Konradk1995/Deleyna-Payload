import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_post_type" AS ENUM('article', 'news', 'class');
  CREATE TYPE "public"."enum_posts_class_details_level" AS ENUM('open', 'beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__posts_v_version_post_type" AS ENUM('article', 'news', 'class');
  CREATE TYPE "public"."enum__posts_v_version_class_details_level" AS ENUM('open', 'beginner', 'intermediate', 'advanced');
  ALTER TABLE "posts" ADD COLUMN "post_type" "enum_posts_post_type" DEFAULT 'article';
  ALTER TABLE "posts" ADD COLUMN "class_details_class_date" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "class_details_class_end_date" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "class_details_level" "enum_posts_class_details_level";
  ALTER TABLE "posts" ADD COLUMN "class_details_max_participants" numeric;
  ALTER TABLE "posts" ADD COLUMN "class_details_booking_url" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_studio_name" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_studio_city" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_studio_address" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_dance_style" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_duration" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "class_details_price_info" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_post_type" "enum__posts_v_version_post_type" DEFAULT 'article';
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_class_date" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_class_end_date" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_level" "enum__posts_v_version_class_details_level";
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_max_participants" numeric;
  ALTER TABLE "_posts_v" ADD COLUMN "version_class_details_booking_url" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_studio_name" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_studio_city" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_studio_address" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_dance_style" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_duration" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_class_details_price_info" varchar;
  ALTER TABLE "talents" ADD COLUMN "category" "enum_talents_category" DEFAULT 'dancer';
  ALTER TABLE "_talents_v" ADD COLUMN "version_category" "enum__talents_v_version_category" DEFAULT 'dancer';
  ALTER TABLE "talents_locales" DROP COLUMN "category";
  ALTER TABLE "_talents_v_locales" DROP COLUMN "version_category";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "talents_locales" ADD COLUMN "category" "enum_talents_category" DEFAULT 'dancer';
  ALTER TABLE "_talents_v_locales" ADD COLUMN "version_category" "enum__talents_v_version_category" DEFAULT 'dancer';
  ALTER TABLE "posts" DROP COLUMN "post_type";
  ALTER TABLE "posts" DROP COLUMN "class_details_class_date";
  ALTER TABLE "posts" DROP COLUMN "class_details_class_end_date";
  ALTER TABLE "posts" DROP COLUMN "class_details_level";
  ALTER TABLE "posts" DROP COLUMN "class_details_max_participants";
  ALTER TABLE "posts" DROP COLUMN "class_details_booking_url";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_studio_name";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_studio_city";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_studio_address";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_dance_style";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_duration";
  ALTER TABLE "posts_locales" DROP COLUMN "class_details_price_info";
  ALTER TABLE "_posts_v" DROP COLUMN "version_post_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_class_date";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_class_end_date";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_level";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_max_participants";
  ALTER TABLE "_posts_v" DROP COLUMN "version_class_details_booking_url";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_studio_name";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_studio_city";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_studio_address";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_dance_style";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_duration";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_class_details_price_info";
  ALTER TABLE "talents" DROP COLUMN "category";
  ALTER TABLE "_talents_v" DROP COLUMN "version_category";
  DROP TYPE "public"."enum_posts_post_type";
  DROP TYPE "public"."enum_posts_class_details_level";
  DROP TYPE "public"."enum__posts_v_version_post_type";
  DROP TYPE "public"."enum__posts_v_version_class_details_level";`)
}
