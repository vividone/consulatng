import type { CollectionConfig } from "payload";
import { isStaff } from "../access";
import { iconOptions } from "../icon-options";
import { revalidateService, revalidateServiceOnDelete } from "../revalidate";

/**
 * Services — the five immigration service lines, and their detail pages.
 *
 * Replaces the SERVICES array in lib/constants.ts together with the five
 * hand-written page files under app/(site)/services/. Those pages were
 * near-identical in structure but duplicated in full, so adding a sixth
 * service meant a developer and a deploy. That is precisely the work this
 * platform exists to remove.
 *
 * The fields mirror the existing design rather than offering free-form
 * blocks: staff edit copy, images and list items, and the layout cannot be
 * broken by an editor. Each tab below maps to one band of the rendered page,
 * top to bottom.
 *
 * Two tabs are optional because the five pages are not quite uniform:
 * four use the "What We Cover" grid, while Training instead uses a row of
 * icon highlights. A service renders whichever of those it has content for.
 */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "order"],
    group: "Content",
    description:
      "Each entry is one service and its page at /services/<slug>. Order controls the sequence in the nav, the home page and prev/next links.",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateService],
    afterDelete: [revalidateServiceOnDelete],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, admin: { width: "60%" } },
        {
          name: "order",
          type: "number",
          required: true,
          defaultValue: 0,
          admin: { width: "40%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "shortTitle",
          type: "text",
          required: true,
          admin: {
            width: "50%",
            description: "Used in the navigation menu and prev/next links.",
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: {
            width: "50%",
            description:
              "The URL: /services/<slug>. Changing this changes a live, indexed URL — only do it deliberately.",
          },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: {
        description:
          "One or two sentences. Shown on the service cards on the home page and the services index.",
      },
    },
    {
      name: "covers",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      admin: {
        description:
          "Short checklist shown on the service card. Only the first four appear there, so put the most compelling first.",
      },
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "menuIcon",
      type: "select",
      required: true,
      defaultValue: "briefcase",
      options: iconOptions,
      admin: {
        description:
          "Shown beside this service in the header's Services menu.",
      },
    },
    {
      name: "cardImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Photo on the service card. Without one the card falls back to the brand gradient.",
      },
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          description: "The banner at the top of the service page.",
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
              name: "bannerImage",
              type: "upload",
              relationTo: "media",
              admin: { description: "Wide image directly beneath the hero." },
            },
            {
              name: "bannerAlt",
              type: "text",
              admin: {
                description:
                  "Describes the banner for screen readers. Leave blank only if the image is purely decorative.",
              },
            },
          ],
        },
        {
          label: "Introduction",
          description: "The opening prose, before the detailed breakdown.",
          fields: [
            { name: "intro", type: "richText", required: true },
            {
              name: "introImage",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional. When set, the intro becomes two columns with this image beside it.",
              },
            },
            {
              name: "introImageAlt",
              type: "text",
              admin: { condition: (_, s) => Boolean(s?.introImage) },
            },
          ],
        },
        {
          label: "What We Cover",
          description:
            "The grid of what the service includes. Leave the items empty to omit this band entirely.",
          fields: [
            {
              name: "coverHeading",
              type: "text",
              defaultValue: "What We Cover",
            },
            {
              name: "coverItems",
              type: "array",
              labels: { singular: "Item", plural: "Items" },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                {
                  name: "bullets",
                  type: "array",
                  labels: { singular: "Bullet", plural: "Bullets" },
                  admin: {
                    description:
                      "Optional sub-points listed beneath the description.",
                  },
                  fields: [{ name: "text", type: "text", required: true }],
                },
              ],
            },
            { name: "coverImage", type: "upload", relationTo: "media" },
            {
              name: "coverImageAlt",
              type: "text",
              admin: { condition: (_, s) => Boolean(s?.coverImage) },
            },
          ],
        },
        {
          label: "Highlights",
          description:
            "A row of icon cards. An alternative to the grid above — used by Training. Leave empty to omit.",
          fields: [
            { name: "highlightsHeading", type: "text" },
            {
              name: "highlights",
              type: "array",
              labels: { singular: "Highlight", plural: "Highlights" },
              fields: [
                {
                  name: "icon",
                  type: "select",
                  required: true,
                  defaultValue: "sparkles",
                  admin: {
                    description:
                      "Icons are a fixed list because each maps to a drawing that ships with the site.",
                  },
                  options: iconOptions,

                },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Extra Sections",
          description:
            "Free-standing sections after the main breakdown — eligibility criteria, benefits, outcomes.",
          fields: [
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section", plural: "Sections" },
              fields: [
                { name: "heading", type: "text", required: true },
                {
                  name: "align",
                  type: "select",
                  required: true,
                  defaultValue: "left",
                  options: [
                    { label: "Left", value: "left" },
                    { label: "Centred", value: "center" },
                  ],
                },
                {
                  name: "intro",
                  type: "richText",
                  admin: { description: "Prose above the checklist." },
                },
                {
                  name: "checklist",
                  type: "array",
                  labels: { singular: "Item", plural: "Items" },
                  admin: {
                    description: "Each item renders with a tick beside it.",
                  },
                  fields: [{ name: "text", type: "text", required: true }],
                },
                {
                  name: "outro",
                  type: "richText",
                  admin: { description: "Prose below the checklist." },
                },
              ],
            },
          ],
        },
        {
          label: "Call to Action",
          description: "The closing panel at the foot of the page.",
          fields: [
            { name: "ctaHeading", type: "text", required: true },
            { name: "ctaBody", type: "textarea", required: true },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seoTitle",
              type: "text",
              required: true,
              admin: { description: "The browser tab and search result title." },
            },
            {
              name: "seoDescription",
              type: "textarea",
              required: true,
              admin: {
                description: "The grey text under the search result. Aim for 150–160 characters.",
              },
            },
            {
              name: "keywords",
              type: "array",
              labels: { singular: "Keyword", plural: "Keywords" },
              fields: [{ name: "keyword", type: "text", required: true }],
            },
            {
              name: "schemaServiceType",
              type: "text",
              required: true,
              admin: {
                description:
                  "Names this service in the structured data search engines read. Usually the plain service name.",
              },
            },
            {
              name: "schemaDescription",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "A one-sentence description of the service for the same structured data.",
              },
            },
          ],
        },
      ],
    },
  ],
};
