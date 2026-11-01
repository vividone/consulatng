/**
 * The icon vocabulary offered in the back office.
 *
 * Plain data, no JSX, so Payload's config can import it. The actual drawings
 * live in components/shared/icons.tsx, which is typed as a complete record
 * over `IconName` — add a value here without adding the component there and
 * the build fails rather than shipping a blank square.
 *
 * Icons are a fixed list because each one is a React component that has to
 * be bundled. A free-text field would let an editor type a name that cannot
 * resolve to anything.
 */
export const ICON_OPTIONS = [
  { label: "Briefcase (business)", value: "briefcase" },
  { label: "Document (paperwork)", value: "file-text" },
  { label: "ID card (permits)", value: "id-card" },
  { label: "Aeroplane (travel)", value: "plane" },
  { label: "Graduation cap (training)", value: "graduation-cap" },
  { label: "People (team)", value: "users" },
  { label: "Globe (international)", value: "globe" },
  { label: "Clipboard with tick (process)", value: "clipboard-check" },
  { label: "Bell (alerts, monitoring)", value: "bell" },
  { label: "Person with tick (account management)", value: "user-check" },
  { label: "Shield (compliance)", value: "shield" },
  { label: "Clock (speed)", value: "clock" },
  { label: "Ear (listening)", value: "ear" },
  { label: "Sparkles (quality)", value: "sparkles" },
  { label: "Handshake (partnership)", value: "handshake" },
  { label: "Building (offices)", value: "building" },
] as const;

export type IconName = (typeof ICON_OPTIONS)[number]["value"];

/** Mutable copy, because Payload's `options` expects a plain array. */
export const iconOptions = ICON_OPTIONS.map((o) => ({ ...o }));
