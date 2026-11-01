import type { CollectionConfig } from "payload";
import { isPublishedOrStaff, isStaff } from "../access";
import { revalidatePost, revalidatePostOnDelete } from "../revalidate";

/**
 * Blog posts — replaces content/blog/*.mdx.
 *
 * Drafts and versions are enabled, which is the main thing the MDX files
 * could not give the client: writing a post without publishing it, and
 * seeing what changed.
 *
 * `publishedAt` is separate from Payload's own createdAt because the three
 * existing MDX posts carry their own dates, and the sitemap and article
 * schema both read it. Defaulting it to now() on publish is handled in the
 * hook below rather than by `defaultValue`, which would stamp drafts too.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
    group: "Content",
  },
  access: {
    read: isPublishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 20,
  },
  defaultSort: "-publishedAt",
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Stamp a publish date the first time it actually goes live.
        if (data._status === "published" && !data.publishedAt) {
          return { ...data, publishedAt: new Date().toISOString() };
        }
        return data;
      },
    ],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostOnDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "The URL segment, e.g. 'understanding-e-cerpac'. Changing it breaks existing links.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: {
        description:
          "Shown on the blog index and used as the meta description when no SEO override is set.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "Set automatically on first publish. Override for backdated posts.",
      },
    },
    {
      name: "author",
      type: "text",
      required: true,
      defaultValue: "Consulat Team",
      admin: { position: "sidebar" },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { position: "sidebar" },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "seo",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        {
          name: "title",
          type: "text",
          admin: { description: "Overrides the post title in search results." },
        },
        {
          name: "description",
          type: "textarea",
          maxLength: 200,
          admin: { description: "Overrides the excerpt as the meta description." },
        },
      ],
    },
  ],
};
