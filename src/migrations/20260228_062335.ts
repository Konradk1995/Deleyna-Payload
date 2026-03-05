import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."l_ap" ADD VALUE 'primary-pill';
  ALTER TYPE "public"."l_ap" ADD VALUE 'secondary-glass';
  ALTER TYPE "public"."l_ap" ADD VALUE 'copper';`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "pages_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::text;
  ALTER TABLE "pages_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "pages_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::text;
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE text;
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE text;
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::text;
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "talents_archive_cta_button" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "talents_archive_cta_button" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."l_ap";
  CREATE TYPE "public"."l_ap" AS ENUM('primary', 'secondary', 'outline');
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE "public"."l_ap" USING "button_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::"public"."l_ap";
  ALTER TABLE "pages_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "pages_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE "public"."l_ap" USING "button_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_pages_v_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "posts_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE "public"."l_ap" USING "button_appearance"::"public"."l_ap";
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "_posts_v_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE "public"."l_ap" USING "button_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "button_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_cta" ALTER COLUMN "button_appearance" SET DATA TYPE "public"."l_ap" USING "button_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'outline'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_info_cards_top_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_info_cards_cards" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_education" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_coaching" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_stats" ALTER COLUMN "cta_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_blocks_stats" ALTER COLUMN "cta_appearance" SET DATA TYPE "public"."l_ap" USING "cta_appearance"::"public"."l_ap";
  ALTER TABLE "talents_archive_cta_button" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "talents_archive_cta_button" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "link_appearance" SET DEFAULT 'primary'::"public"."l_ap";
  ALTER TABLE "header_cta_buttons" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."l_ap" USING "link_appearance"::"public"."l_ap";`)
}
