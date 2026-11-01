import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_values_icon" AS ENUM('briefcase', 'file-text', 'id-card', 'plane', 'graduation-cap', 'users', 'globe', 'clipboard-check', 'bell', 'user-check', 'shield', 'clock', 'ear', 'sparkles', 'handshake', 'building');
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_values_icon" DEFAULT 'shield' NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Immigration Simplified' NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"bridge_heading" varchar NOT NULL,
  	"bridge_text" varchar NOT NULL,
  	"story_eyebrow" varchar NOT NULL,
  	"story_title" varchar NOT NULL,
  	"story_body" jsonb NOT NULL,
  	"mission_eyebrow" varchar NOT NULL,
  	"mission_statement" varchar NOT NULL,
  	"values_eyebrow" varchar NOT NULL,
  	"values_title" varchar NOT NULL,
  	"team_eyebrow" varchar NOT NULL,
  	"team_title" varchar NOT NULL,
  	"team_intro" varchar NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Immigration Simplified' NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "faq_page_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "faq_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Immigration Simplified' NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"cta_body" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Immigration Simplified' NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"info_heading" varchar NOT NULL,
  	"info_intro" varchar NOT NULL,
  	"booking_eyebrow" varchar NOT NULL,
  	"booking_heading" varchar NOT NULL,
  	"booking_body" varchar NOT NULL,
  	"booking_button_label" varchar NOT NULL,
  	"form_heading" varchar NOT NULL,
  	"form_intro" varchar NOT NULL,
  	"map_heading" varchar NOT NULL,
  	"map_intro" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_keywords" ADD CONSTRAINT "about_page_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_keywords" ADD CONSTRAINT "services_page_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_keywords" ADD CONSTRAINT "faq_page_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_keywords" ADD CONSTRAINT "contact_page_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_keywords_order_idx" ON "about_page_keywords" USING btree ("_order");
  CREATE INDEX "about_page_keywords_parent_id_idx" ON "about_page_keywords" USING btree ("_parent_id");
  CREATE INDEX "services_page_keywords_order_idx" ON "services_page_keywords" USING btree ("_order");
  CREATE INDEX "services_page_keywords_parent_id_idx" ON "services_page_keywords" USING btree ("_parent_id");
  CREATE INDEX "faq_page_keywords_order_idx" ON "faq_page_keywords" USING btree ("_order");
  CREATE INDEX "faq_page_keywords_parent_id_idx" ON "faq_page_keywords" USING btree ("_parent_id");
  CREATE INDEX "contact_page_keywords_order_idx" ON "contact_page_keywords" USING btree ("_order");
  CREATE INDEX "contact_page_keywords_parent_id_idx" ON "contact_page_keywords" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_keywords" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "services_page_keywords" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "faq_page_keywords" CASCADE;
  DROP TABLE "faq_page" CASCADE;
  DROP TABLE "contact_page_keywords" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TYPE "public"."enum_about_page_values_icon";`)
}
