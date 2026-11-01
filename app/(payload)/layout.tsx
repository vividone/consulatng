/* Payload's admin root layout. Generated scaffolding — see
   https://payloadcms.com/docs/admin/overview. The site's own root layout
   lives at app/(site)/layout.tsx; Next permits two roots only because there
   is no app/layout.tsx. */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
/* Defines Payload's theme scale (--color-base-*, --theme-elevation-*).
   @payloadcms/ui ships the component styles but not these variables, and it
   references --theme-elevation-* 23 times, so without this import every
   background, border and text colour in the admin resolves to nothing and
   the interface renders unstyled. */
import "@payloadcms/next/css";
import React from "react";

import { importMap } from "./backoffice/importMap";
import "./custom.scss";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
