import type { CollectionConfig } from "payload";
import { isStaff } from "../access";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../revalidate";

/**
 * Replaces the hardcoded FAQS array in lib/faqs.ts.
 *
 * Answers are plain text, not rich text, on purpose: they render inside an
 * accordion AND feed the FAQPage structured data on /faq, where markup is not
 * allowed. Giving editors a rich-text field here would produce invalid
 * schema.org output the first time someone bolded a word.
 */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Content",
    description: "Shown on /faq, in the order set below.",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateCollection("faqs")],
    afterDelete: [revalidateCollectionOnDelete("faqs")],
  },
  fields: [
    { name: "question", type: "text", required: true },
    {
      name: "answer",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Plain text only — this also feeds Google's FAQ rich result, which rejects markup.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
