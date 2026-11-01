import {
  Bell,
  Briefcase,
  Building2,
  ClipboardCheck,
  Clock,
  Ear,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  IdCard,
  Plane,
  Shield,
  Sparkles,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/cms/icon-options";

/**
 * Maps every icon the back office offers to its drawing.
 *
 * Typed as `Record<IconName, LucideIcon>` on purpose: IconName is derived
 * from the options list in cms/icon-options.ts, so adding an option without
 * adding its component here is a compile error rather than a blank square
 * on the live site.
 */
export const ICONS: Record<IconName, LucideIcon> = {
  briefcase: Briefcase,
  "file-text": FileText,
  "id-card": IdCard,
  plane: Plane,
  "graduation-cap": GraduationCap,
  users: Users,
  globe: Globe2,
  "clipboard-check": ClipboardCheck,
  bell: Bell,
  "user-check": UserRoundCheck,
  shield: Shield,
  clock: Clock,
  ear: Ear,
  sparkles: Sparkles,
  handshake: HeartHandshake,
  building: Building2,
};

/**
 * Resolves a stored icon name. Falls back to the briefcase rather than
 * returning undefined: content coming from the database should never be
 * able to crash a render, and an older document may hold a name that has
 * since been removed from the options.
 */
export function iconFor(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name as IconName]) || Briefcase;
}
