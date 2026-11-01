import { Link } from "@payloadcms/ui";
import React from "react";

import "./index.scss";

/**
 * Sidebar link to the staff guide, rendered after the collection links.
 *
 * The guide only helps if people can find it without being told where it
 * is, which means a permanent place in the navigation rather than a URL
 * somebody has to remember.
 *
 * The href is written out rather than built from config because this is a
 * server component rendered inside the admin, where the admin route is
 * already fixed by payload.config.ts. If that route ever moves off
 * /backoffice, this changes with it.
 */
export function UserGuideLink() {
  return (
    <Link className="user-guide-link" href="/backoffice/user-guide">
      <span aria-hidden="true">?</span>
      Staff guide
    </Link>
  );
}
