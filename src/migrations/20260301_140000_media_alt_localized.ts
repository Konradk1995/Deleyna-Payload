import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create media_locales table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "media_locales" (
      "alt" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
  `)

  // Add alt column if table already existed without it
  await db.execute(sql`
    ALTER TABLE "media_locales" ADD COLUMN IF NOT EXISTS "alt" varchar;
  `)

  // Add foreign key if not exists
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'media_locales_parent_id_fk' AND table_name = 'media_locales'
      ) THEN
        ALTER TABLE "media_locales"
          ADD CONSTRAINT "media_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // Add unique constraint if not exists
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'media_locales_locale_parent_id_unique' AND table_name = 'media_locales'
      ) THEN
        ALTER TABLE "media_locales"
          ADD CONSTRAINT "media_locales_locale_parent_id_unique"
          UNIQUE("_locale", "_parent_id");
      END IF;
    END $$;
  `)

  // Migrate existing alt text from media to media_locales for both locales
  await db.execute(sql`
    INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT m."alt", 'de', m."id"
    FROM "media" m
    WHERE m."alt" IS NOT NULL
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "alt" = EXCLUDED."alt";
  `)

  await db.execute(sql`
    INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT m."alt", 'en', m."id"
    FROM "media" m
    WHERE m."alt" IS NOT NULL
    ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET "alt" = EXCLUDED."alt";
  `)

  // Drop alt from main media table
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "alt";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-add alt column to media table
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "alt" varchar;
  `)

  // Copy DE alt back as the default
  await db.execute(sql`
    UPDATE "media" m
    SET "alt" = ml."alt"
    FROM "media_locales" ml
    WHERE ml."_parent_id" = m."id" AND ml."_locale" = 'de';
  `)
}
