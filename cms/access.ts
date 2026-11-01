import type { Access } from "payload";

/** Anyone signed in to the admin. */
export const isStaff: Access = ({ req }) => Boolean(req.user);

/** Admins only — for destructive or privilege-granting operations. */
export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

/**
 * Published content is readable without authentication, because the public
 * site reads through the Local API during static generation and an
 * unauthenticated request must still see it. Drafts stay staff-only.
 */
export const isPublishedOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};
