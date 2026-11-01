/* Payload's admin root layout. Generated scaffolding — see
   https://payloadcms.com/docs/admin/overview. The site's own root layout
   lives at app/(site)/layout.tsx; Next permits two roots only because there
   is no app/layout.tsx. */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
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
