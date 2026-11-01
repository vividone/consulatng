import type { GlobalConfig } from "payload";
import { isStaff } from "../access";
import { iconOptions } from "../icon-options";
import { revalidatePage } from "../revalidate";

/**
 * Home page content.
 *
 * A global rather than a collection: there is exactly one home page, and a
 * collection would invite a second. The tabs run top to bottom in the order
 * the bands appear on the page, so an editor can find a section by scrolling
 * the live site and picking the matching tab.
 *
 * Testimonials, client logos and the services stack are not here — they are
 * their own collections, and this page just renders whatever is in them.
 */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  admin: {
    group: "Pages",
    description:
      "Everything on the home page except the testimonials, client logos and service cards, which come from their own collections.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidatePage("/")] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          description: "The dark banner at the very top.",
          fields: [
            {
              name: "heroTitle",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "The main headline. It animates in word by word and wraps automatically.",
              },
            },
            { name: "heroSubtitle", type: "textarea", required: true },
            {
              type: "row",
              fields: [
                {
                  name: "heroPrimaryCta",
                  label: "Primary button label",
                  type: "text",
                  required: true,
                  admin: { width: "50%", description: "Links to /services." },
                },
                {
                  name: "heroSecondaryCta",
                  label: "Secondary button label",
                  type: "text",
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "Links to the booking URL in Site Settings.",
                  },
                },
              ],
            },
            {
              name: "stats",
              type: "array",
              labels: { singular: "Statistic", plural: "Statistics" },
              maxRows: 3,
              admin: {
                description:
                  "The three counters beneath the buttons. They count up from zero when the page loads.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "number",
                      required: true,
                      admin: { width: "33%" },
                    },
                    {
                      name: "suffix",
                      type: "text",
                      defaultValue: "+",
                      admin: { width: "33%" },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: { width: "34%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Welcome",
          description: "The two-column introduction below the hero.",
          fields: [
            { name: "welcomeHeading", type: "text", required: true },
            { name: "welcomeBody", type: "textarea", required: true },
            { name: "welcomeCtaLabel", type: "text", required: true },
            {
              name: "welcomeImage",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Decorative illustration, shown on large screens only. Hidden from screen readers.",
              },
            },
          ],
        },
        {
          label: "Services",
          description: "Heading above the service cards.",
          fields: [
            { name: "servicesEyebrow", type: "text", required: true },
            { name: "servicesTitle", type: "text", required: true },
            { name: "servicesIntro", type: "textarea", required: true },
          ],
        },
        {
          label: "Client Logos",
          fields: [
            {
              name: "trustBarHeading",
              type: "text",
              required: true,
              admin: {
                description:
                  "The small caption above the scrolling client logos.",
              },
            },
          ],
        },
        {
          label: "Why Consulat",
          fields: [
            { name: "whyEyebrow", type: "text", required: true },
            { name: "whyTitle", type: "text", required: true },
            {
              name: "pillars",
              type: "array",
              labels: { singular: "Pillar", plural: "Pillars" },
              admin: {
                description:
                  "Shown in a single row of four on large screens, so four reads best.",
              },
              fields: [
                {
                  name: "icon",
                  type: "select",
                  required: true,
                  defaultValue: "globe",
                  options: iconOptions,
                },
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "How We Work",
          fields: [
            { name: "processEyebrow", type: "text", required: true },
            { name: "processTitle", type: "text", required: true },
            {
              name: "steps",
              type: "array",
              labels: { singular: "Step", plural: "Steps" },
              admin: {
                description:
                  "Numbered automatically in order. Four fit the row on large screens.",
              },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
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
