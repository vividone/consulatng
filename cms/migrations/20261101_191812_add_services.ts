import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_highlights_icon" AS ENUM('ear', 'sparkles', 'handshake', 'shield', 'clock', 'users');
  CREATE TYPE "public"."enum_services_sections_align" AS ENUM('left', 'center');
  CREATE TABLE "services_covers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "services_cover_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services_cover_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "services_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_services_highlights_icon" DEFAULT 'sparkles' NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "services_sections_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"align" "enum_services_sections_align" DEFAULT 'left' NOT NULL,
  	"intro" jsonb,
  	"outro" jsonb
  );
  
  CREATE TABLE "services_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"short_title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"card_image_id" integer,
  	"hero_eyebrow" varchar DEFAULT 'Immigration Simplified' NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar NOT NULL,
  	"banner_image_id" integer,
  	"banner_alt" varchar,
  	"intro" jsonb NOT NULL,
  	"intro_image_id" integer,
  	"intro_image_alt" varchar,
  	"cover_heading" varchar DEFAULT 'What We Cover',
  	"cover_image_id" integer,
  	"cover_image_alt" varchar,
  	"highlights_heading" varchar,
  	"cta_heading" varchar NOT NULL,
  	"cta_body" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_service_type" varchar NOT NULL,
  	"schema_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "services_covers" ADD CONSTRAINT "services_covers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_cover_items_bullets" ADD CONSTRAINT "services_cover_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_cover_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_cover_items" ADD CONSTRAINT "services_cover_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_highlights" ADD CONSTRAINT "services_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sections_checklist" ADD CONSTRAINT "services_sections_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_sections" ADD CONSTRAINT "services_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_keywords" ADD CONSTRAINT "services_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_covers_order_idx" ON "services_covers" USING btree ("_order");
  CREATE INDEX "services_covers_parent_id_idx" ON "services_covers" USING btree ("_parent_id");
  CREATE INDEX "services_cover_items_bullets_order_idx" ON "services_cover_items_bullets" USING btree ("_order");
  CREATE INDEX "services_cover_items_bullets_parent_id_idx" ON "services_cover_items_bullets" USING btree ("_parent_id");
  CREATE INDEX "services_cover_items_order_idx" ON "services_cover_items" USING btree ("_order");
  CREATE INDEX "services_cover_items_parent_id_idx" ON "services_cover_items" USING btree ("_parent_id");
  CREATE INDEX "services_highlights_order_idx" ON "services_highlights" USING btree ("_order");
  CREATE INDEX "services_highlights_parent_id_idx" ON "services_highlights" USING btree ("_parent_id");
  CREATE INDEX "services_sections_checklist_order_idx" ON "services_sections_checklist" USING btree ("_order");
  CREATE INDEX "services_sections_checklist_parent_id_idx" ON "services_sections_checklist" USING btree ("_parent_id");
  CREATE INDEX "services_sections_order_idx" ON "services_sections" USING btree ("_order");
  CREATE INDEX "services_sections_parent_id_idx" ON "services_sections" USING btree ("_parent_id");
  CREATE INDEX "services_keywords_order_idx" ON "services_keywords" USING btree ("_order");
  CREATE INDEX "services_keywords_parent_id_idx" ON "services_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_card_image_idx" ON "services" USING btree ("card_image_id");
  CREATE INDEX "services_banner_image_idx" ON "services" USING btree ("banner_image_id");
  CREATE INDEX "services_intro_image_idx" ON "services" USING btree ("intro_image_id");
  CREATE INDEX "services_cover_image_idx" ON "services" USING btree ("cover_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_covers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_cover_items_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_cover_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sections_checklist" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_covers" CASCADE;
  DROP TABLE "services_cover_items_bullets" CASCADE;
  DROP TABLE "services_cover_items" CASCADE;
  DROP TABLE "services_highlights" CASCADE;
  DROP TABLE "services_sections_checklist" CASCADE;
  DROP TABLE "services_sections" CASCADE;
  DROP TABLE "services_keywords" CASCADE;
  DROP TABLE "services" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  DROP TYPE "public"."enum_services_highlights_icon";
  DROP TYPE "public"."enum_services_sections_align";`)
}
