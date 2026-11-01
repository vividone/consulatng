import type { GlobalConfig } from "payload";
import { isStaff } from "../access";
import { revalidatePage } from "../revalidate";

/**
 * The two index pages whose own wording is small: /services and /faq.
 *
 * Both are mostly generated from a collection — the service cards and the
 * FAQ accordion — so all that belongs here is the banner at the top and, for
 * the FAQ page, its own closing call to action.
 *
 * Separate globals rather than one shared "listing page" record, because
 * they are different pages and a shared record would make an edit to one
 * silently change the other.
 */

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
  admin: {
    group: "Pages",
    description:
      "The banner and introduction on /services. The service cards themselves come from the Services collection.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidatePage("/services")] },
  fields: [
    {
      name: "heroEyebrow",
      type: "text",
      required: true,
      defaultValue: "Immigration Simplified",
    },
    { name: "heroTitle", type: "text", required: true },
    { name: "heroSubtitle", type: "textarea", required: true },
    {
      name: "intro",
      type: "textarea",
      required: true,
      admin: {
        description: "Centred paragraph above the service cards.",
      },
    },
    { name: "seoTitle", type: "text", required: true },
    { name: "seoDescription", type: "textarea", required: true },
    {
      name: "keywords",
      type: "array",
      labels: { singular: "Keyword", plural: "Keywords" },
      fields: [{ name: "keyword", type: "text", required: true }],
    },
  ],
};

export const FaqPage: GlobalConfig = {
  slug: "faq-page",
  label: "FAQ Page",
  admin: {
    group: "Pages",
    description:
      "The banner and closing panel on /faq. The questions themselves are managed under Content → FAQs.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidatePage("/faq")] },
  fields: [
    {
      name: "heroEyebrow",
      type: "text",
      required: true,
      defaultValue: "Immigration Simplified",
    },
    { name: "heroTitle", type: "text", required: true },
    { name: "heroSubtitle", type: "textarea", required: true },
    {
      name: "ctaHeading",
      type: "text",
      required: true,
      admin: {
        description:
          "Overrides the shared banner in Site Settings for this page.",
      },
    },
    { name: "ctaBody", type: "textarea", required: true },
    { name: "seoTitle", type: "text", required: true },
    { name: "seoDescription", type: "textarea", required: true },
    {
      name: "keywords",
      type: "array",
      labels: { singular: "Keyword", plural: "Keywords" },
      fields: [{ name: "keyword", type: "text", required: true }],
    },
  ],
};
