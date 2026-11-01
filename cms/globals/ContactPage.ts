import type { GlobalConfig } from "payload";
import { isStaff } from "../access";
import { revalidatePage } from "../revalidate";

/**
 * Contact page wording.
 *
 * The address, phone numbers, email, WhatsApp number and opening hours are
 * NOT here — they live in Site Settings, because the footer, the contact
 * page and the organisation structured data all have to agree. Duplicating
 * them would mean a phone number could be changed in one place and stay
 * wrong in the other two.
 *
 * The map is generated from the Site Settings address too, so it follows a
 * move automatically.
 */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: {
    group: "Pages",
    description:
      "Headings and wording on /contact. The actual contact details come from Site Settings.",
  },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidatePage("/contact")] },
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
          ],
        },
        {
          label: "Contact Details",
          fields: [
            { name: "infoHeading", type: "text", required: true },
            { name: "infoIntro", type: "textarea", required: true },
          ],
        },
        {
          label: "Booking Card",
          description: "The bordered panel beneath the contact details.",
          fields: [
            { name: "bookingEyebrow", type: "text", required: true },
            { name: "bookingHeading", type: "text", required: true },
            { name: "bookingBody", type: "textarea", required: true },
            {
              name: "bookingButtonLabel",
              type: "text",
              required: true,
              admin: { description: "Links to the booking URL in Site Settings." },
            },
          ],
        },
        {
          label: "Enquiry Form",
          fields: [
            { name: "formHeading", type: "text", required: true },
            { name: "formIntro", type: "textarea", required: true },
          ],
        },
        {
          label: "Map",
          fields: [
            { name: "mapHeading", type: "text", required: true },
            { name: "mapIntro", type: "textarea", required: true },
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
