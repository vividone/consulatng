import type { CollectionConfig } from "payload";
import { isStaff } from "../access";

/**
 * Uploaded images.
 *
 * Local disk in development. On Vercel the filesystem is read-only, so
 * production needs @payloadcms/storage-s3 or Vercel Blob wired in here —
 * see db/README.md "Open issues". Without it, uploads fail silently in the
 * sense that they work locally and break on deploy.
 *
 * `alt` is required rather than optional: a CMS that permits empty alt text
 * produces an inaccessible site one upload at a time.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: undefined, position: "centre" },
      { name: "card", width: 896, height: undefined, position: "centre" },
      { name: "hero", width: 1920, height: undefined, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe the image for screen readers. If it is purely decorative, write 'Decorative'.",
      },
    },
  ],
};
