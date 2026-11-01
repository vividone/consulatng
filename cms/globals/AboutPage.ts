import type { GlobalConfig } from "payload";
import { isStaff } from "../access";
import { iconOptions } from "../icon-options";
import { revalidatePage } from "../revalidate";

/**
 * About page content.
 *
 * The team grid is not here — team members are their own collection, and
 * this page renders whatever is in it.
 */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: {
    group: "Pages",
    description:
      "Everything on /about except the team members, who are managed under Content.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidatePage("/about")] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
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
              name: "bridgeHeading",
              type: "text",
              required: true,
              admin: {
                description:
                  "Overlaid on the sliding photographs beneath the hero.",
              },
            },
            { name: "bridgeText", type: "textarea", required: true },
          ],
        },
        {
          label: "Our Story",
          fields: [
            { name: "storyEyebrow", type: "text", required: true },
            { name: "storyTitle", type: "text", required: true },
            { name: "storyBody", type: "richText", required: true },
          ],
        },
        {
          label: "Mission",
          fields: [
            { name: "missionEyebrow", type: "text", required: true },
            {
              name: "missionStatement",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "Shown large on the blue band. One or two sentences reads best.",
              },
            },
          ],
        },
        {
          label: "Values",
          fields: [
            { name: "valuesEyebrow", type: "text", required: true },
            { name: "valuesTitle", type: "text", required: true },
            {
              name: "values",
              type: "array",
              labels: { singular: "Value", plural: "Values" },
              admin: {
                description:
                  "Shown in a single row of four on large screens, so four reads best.",
              },
              fields: [
                {
                  name: "icon",
                  type: "select",
                  required: true,
                  defaultValue: "shield",
                  options: iconOptions,
                },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Team",
          fields: [
            { name: "teamEyebrow", type: "text", required: true },
            { name: "teamTitle", type: "text", required: true },
            { name: "teamIntro", type: "textarea", required: true },
          ],
        },
        {
          label: "Call to Action",
          fields: [
            {
              name: "ctaHeading",
              type: "text",
              required: true,
              admin: {
                description:
                  "Overrides the shared banner heading in Site Settings for this page.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "seoTitle", type: "text", required: true },
            { name: "seoDescription", type: "textarea", required: true },
            {
              name: "keywords",
              type: "array",
              labels: { singular: "Keyword", plural: "Keywords" },
              fields: [{ name: "keyword", type: "text", required: true }],
            },
          ],
        },
      ],
    },
  ],
};
