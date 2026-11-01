import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

/**
 * Staff logins for the admin.
 *
 * This is Payload's auth collection, which means it is also the single login
 * for the operations side when that arrives — the whole point of putting the
 * CMS and the ops platform in one app rather than two.
 *
 * `role` deliberately mirrors the `staff_role` enum in the reference schema
 * (db/reference-schema/0001_core_schema.sql) so the two models do not drift
 * before the ops collections are added.
 */
export const Staff: CollectionConfig = {
  slug: "staff",
  auth: true,
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "email", "role"],
    group: "Access",
  },
  access: {
    // Only an admin can create, change or delete a login. Everyone signed in
    // can read the list, which the ops side needs for assignment dropdowns.
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "officer",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Officer", value: "officer" },
        { label: "Accounts", value: "accounts" },
      ],
      admin: {
        description:
          "Admins manage logins and site settings. Officers handle day-to-day matters.",
      },
    },
  ],
};
