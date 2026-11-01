import type { CollectionConfig } from "payload";
import { isStaff } from "../access";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../revalidate";

/** Replaces the hardcoded TESTIMONIALS array in components/home/Testimonials.tsx. */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "personName",
    defaultColumns: ["personName", "country", "order"],
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
    afterChange: [revalidateCollection("testimonials")],
    afterDelete: [revalidateCollectionOnDelete("testimonials")],
  },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "personName", label: "Name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "country", type: "text", required: true },
    {
      name: "flag",
      type: "text",
      required: true,
      admin: {
        description:
          "Flag emoji, e.g. 🇳🇬. Rendered aria-hidden, with the country name read instead.",
      },
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
