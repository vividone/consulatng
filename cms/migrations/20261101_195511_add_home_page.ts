import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_menu_icon" AS ENUM('briefcase', 'file-text', 'id-card', 'plane', 'graduation-cap', 'users', 'globe', 'clipboard-check', 'bell', 'user-check', 'shield', 'clock', 'ear', 'sparkles', 'handshake', 'building');
  CREATE TYPE "public"."enum_home_page_pillars_icon" AS ENUM('briefcase', 'file-text', 'id-card', 'plane', 'graduation-cap', 'users', 'globe', 'clipboard-check', 'bell', 'user-check', 'shield', 'clock', 'ear', 'sparkles', 'handshake', 'building');
  CREATE TABLE "home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar DEFAULT '+',
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_pillars_icon" DEFAULT 'globe' NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"hero_primary_cta" varchar NOT NULL,
  	"hero_secondary_cta" varchar NOT NULL,
  	"welcome_heading" varchar NOT NULL,
  	"welcome_body" varchar NOT NULL,
  	"welcome_cta_label" varchar NOT NULL,
  	"welcome_image_id" integer,
  	"services_eyebrow" varchar NOT NULL,
  	"services_title" varchar NOT NULL,
  	"services_intro" varchar NOT NULL,
  	"trust_bar_heading" varchar NOT NULL,
  	"why_eyebrow" varchar NOT NULL,
  	"why_title" varchar NOT NULL,
  	"process_eyebrow" varchar NOT NULL,
  	"process_title" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_services_highlights_icon";
  CREATE TYPE "public"."enum_services_highlights_icon" AS ENUM('briefcase', 'file-text', 'id-card', 'plane', 'graduation-cap', 'users', 'globe', 'clipboard-check', 'bell', 'user-check', 'shield', 'clock', 'ear', 'sparkles', 'handshake', 'building');
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_services_highlights_icon";
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_highlights_icon" USING "icon"::"public"."enum_services_highlights_icon";
  ALTER TABLE "services" ADD COLUMN "menu_icon" "enum_services_menu_icon" DEFAULT 'briefcase' NOT NULL;
  -- Backfill the icons that were previously hardcoded by slug in
  -- components/layout/Navbar.tsx. Without this every existing service takes
  -- the column default and the header menu shows five identical briefcases.
  -- Done here rather than in the seed because the seed only touches services
  -- it creates, and because this must run once rather than reassert itself
  -- over an editor's later choice.
  UPDATE "services" SET "menu_icon" = 'file-text' WHERE "slug" = 'business-permit';
  UPDATE "services" SET "menu_icon" = 'users' WHERE "slug" = 'expatriate-quota';
  UPDATE "services" SET "menu_icon" = 'id-card' WHERE "slug" = 'e-cerpac';
  UPDATE "services" SET "menu_icon" = 'plane' WHERE "slug" = 'e-visas';
  UPDATE "services" SET "menu_icon" = 'graduation-cap' WHERE "slug" = 'training';
  -- Added nullable, backfilled, then constrained.
  --
  -- The generated statement was ADD COLUMN ... NOT NULL, which Postgres
  -- rejects on a table that already holds a row, reporting that the column
  -- contains null values. Every environment has
  -- exactly one site_settings row, so that would have failed the Vercel
  -- build, which runs payload migrate before next build.
  --
  -- The values below are the defaults these fields previously had as
  -- parameters of components/home/CTABanner.tsx, so an existing install
  -- comes out rendering precisely what it rendered before.
  ALTER TABLE "site_settings" ADD COLUMN "cta_heading" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_body" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_button_label" varchar;
  UPDATE "site_settings" SET
    "cta_heading" = COALESCE("cta_heading", 'Ready to simplify your immigration process in Nigeria?'),
    "cta_body" = COALESCE("cta_body", 'Speak with our team to discuss your requirements. ' || chr(10) || ' We respond within 24 hours.'),
    "cta_button_label" = COALESCE("cta_button_label", 'Book a Free Consultation');
  ALTER TABLE "site_settings" ALTER COLUMN "cta_heading" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "cta_body" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "cta_button_label" SET NOT NULL;
  ALTER TABLE "home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars" ADD CONSTRAINT "home_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_steps" ADD CONSTRAINT "home_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_keywords" ADD CONSTRAINT "home_page_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_welcome_image_id_media_id_fk" FOREIGN KEY ("welcome_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_stats_order_idx" ON "home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "home_page_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_pillars_order_idx" ON "home_page_pillars" USING btree ("_order");
  CREATE INDEX "home_page_pillars_parent_id_idx" ON "home_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_steps_order_idx" ON "home_page_steps" USING btree ("_order");
  CREATE INDEX "home_page_steps_parent_id_idx" ON "home_page_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_keywords_order_idx" ON "home_page_keywords" USING btree ("_order");
  CREATE INDEX "home_page_keywords_parent_id_idx" ON "home_page_keywords" USING btree ("_parent_id");
  CREATE INDEX "home_page_welcome_image_idx" ON "home_page" USING btree ("welcome_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_stats" CASCADE;
  DROP TABLE "home_page_pillars" CASCADE;
  DROP TABLE "home_page_steps" CASCADE;
  DROP TABLE "home_page_keywords" CASCADE;
  DROP TABLE "home_page" CASCADE;
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::text;
  DROP TYPE "public"."enum_services_highlights_icon";
  CREATE TYPE "public"."enum_services_highlights_icon" AS ENUM('ear', 'sparkles', 'handshake', 'shield', 'clock', 'users');
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DEFAULT 'sparkles'::"public"."enum_services_highlights_icon";
  ALTER TABLE "services_highlights" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_highlights_icon" USING "icon"::"public"."enum_services_highlights_icon";
  ALTER TABLE "services" DROP COLUMN "menu_icon";
  ALTER TABLE "site_settings" DROP COLUMN "cta_heading";
  ALTER TABLE "site_settings" DROP COLUMN "cta_body";
  ALTER TABLE "site_settings" DROP COLUMN "cta_button_label";
  DROP TYPE "public"."enum_services_menu_icon";
  DROP TYPE "public"."enum_home_page_pillars_icon";`)
}
