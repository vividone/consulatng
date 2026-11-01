import type { GlobalConfig } from "payload";
import { isAdmin } from "../access";
import { revalidateSettings } from "../revalidate";

/**
 * Replaces the SITE constant in lib/constants.ts.
 *
 * Admin-only to change: these values appear in the footer, the contact page,
 * the LocalBusiness structured data and the default destination for the
 * contact form. A wrong phone number here is wrong everywhere at once.
 *
 * Deliberately NOT moved here: NAV_LINKS and SERVICES. Those drive routing
 * and the five service pages are bespoke components, so making them editable
 * would let an editor create a nav entry pointing at a page that does not
 * exist. They stay in code until the service pages themselves are modelled.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            {
              name: "description",
              type: "textarea",
              required: true,
              maxLength: 200,
              admin: { description: "Default meta description for the site." },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "email", type: "email", required: true },
            { name: "phone", type: "text", required: true },
            { name: "phoneSecondary", type: "text" },
            { name: "landline", type: "text" },
            {
              name: "whatsappNumber",
              type: "text",
              required: true,
              admin: {
                description:
                  "Digits only with country code, e.g. 2348141657981. The display format and wa.me link are both derived from this, so they cannot drift apart.",
              },
            },
            {
              name: "whatsappMessage",
              type: "text",
              admin: { description: "Pre-filled text in the WhatsApp chat." },
            },
            { name: "hours", type: "text", required: true },
            {
              name: "calendarUrl",
              type: "text",
              required: true,
              admin: { description: "The 'Book a Free Consultation' destination." },
            },
          ],
        },
        {
          label: "Address",
          fields: [
            { name: "streetAddress", type: "text", required: true },
            { name: "addressLocality", type: "text", required: true },
            { name: "addressRegion", type: "text", required: true },
            {
              name: "addressCountry",
              type: "text",
              required: true,
              defaultValue: "NG",
              admin: { description: "ISO country code, used in structured data." },
            },
          ],
        },
        {
          label: "Social",
          fields: [
            { name: "linkedin", type: "text" },
            { name: "twitter", type: "text" },
            { name: "instagram", type: "text" },
          ],
        },
      ],
    },
  ],
};
