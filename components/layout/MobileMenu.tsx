"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, CALENDAR_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal targets only exist client-side. Track when we can use document.body.
  useEffect(() => setMounted(true), []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const drawer = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
      // High z-index + explicit inline backgroundColor escapes any parent
      // stacking context (e.g. Navbar's backdrop-blur) AND guarantees a
      // solid background even if the bg-white utility ever gets purged.
      className="fixed inset-0 z-[90] flex flex-col bg-white"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex h-20 items-center justify-between px-6 shadow-sm">
        <Logo className="h-10 w-auto" />
        <button
          type="button"
          aria-label="Close menu"
          className="rounded-md p-2 text-grey-900 transition hover:bg-grey-100"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-8 pt-4" aria-label="Mobile">
        <ul className="space-y-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-grey-900 hover:bg-grey-50 hover:text-accent"
              >
                {link.label}
              </Link>
              {"children" in link && link.children && (
                <ul className="ml-4 space-y-1 border-l border-grey-200 pl-4">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-base text-grey-700 hover:text-accent"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild className="w-full">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Book a Free Consultation
            </a>
          </Button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className="rounded-md p-2 text-grey-900 transition hover:bg-grey-100"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Render the drawer to document.body so it isn't trapped inside the
          navbar's backdrop-blur stacking context. */}
      {mounted && open && createPortal(drawer, document.body)}
    </div>
  );
}
