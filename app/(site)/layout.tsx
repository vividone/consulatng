import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageLoader } from "@/components/shared/PageLoader";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Immigration & Work Permit Services in Nigeria`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: true },
  // Next.js auto-generates <link rel="icon"> from app/icon.png and
  // <link rel="apple-touch-icon"> from app/apple-icon.png — no override needed.
};

export const viewport: Viewport = {
  themeColor: "#0829A5",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE.url}/#organization`,
  name: SITE.legalName,
  alternateName: SITE.name,
  slogan: SITE.tagline,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.streetAddress,
    addressLocality: SITE.address.addressLocality,
    addressRegion: SITE.address.addressRegion,
    addressCountry: SITE.address.addressCountry,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  sameAs: [SITE.social.linkedin, SITE.social.twitter, SITE.social.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationSchema} />
        <PageLoader />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
