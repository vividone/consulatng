import type { CollectionConfig } from "payload";
import { isStaff } from "../access";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../revalidate";

/**
 * Replaces the hardcoded TEAM array in app/(site)/about/page.tsx.
 *
 * `bio` is an array of paragraphs rather than one rich-text field because
 * TeamGrid renders them as discrete <p> elements in a modal, and the existing
 * data is already shaped that way.
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team Member", plural: "Team Members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateCollection("team-members")],
    afterDelete: [revalidateCollectionOnDelete("team-members")],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "bio",
      type: "array",
      minRows: 1,
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
