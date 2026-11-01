import type { CollectionConfig } from "payload";
import { isStaff } from "../access";
import {
  revalidateCollection,
  revalidateCollectionOnDelete,
} from "../revalidate";

/**
 * Replaces the hardcoded CLIENTS array in components/home/TrustBar.tsx.
 *
 * The marquee lays logos out with next/image at a fixed height, which needs
 * real intrinsic dimensions. Those come from the uploaded Media record, so
 * there is no width/height field here to get wrong by hand.
 */
export const ClientLogos: CollectionConfig = {
  slug: "client-logos",
  labels: { singular: "Client Logo", plural: "Client Logos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    group: "Content",
    description: "The scrolling logo bar on the home page.",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateCollection("client-logos")],
    afterDelete: [revalidateCollectionOnDelete("client-logos")],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Used as the logo's alt text." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    { name: "order", type: "number", required: true, defaultValue: 0 },
  ],
};
