import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageLoader } from "@/components/shared/PageLoader";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";
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

// A function, not a const: the default description now comes from the CMS,
// and module-scope cannot await.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — Immigration & Work Permit Services in Nigeria`,
      template: `%s — ${SITE.name}`,
    },
    description: settings.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.legalName }],
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    formatDetection: { telephone: true, email: true, address: true },
    // The default card, for routes that do not call buildMetadata — the 404
    // page, principally. Pages that do call it set their own identical one.
    openGraph: {
      siteName: SITE.name,
      type: "website",
      locale: "en_GB",
      images: [{ url: `${SITE.url}/og`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [`${SITE.url}/og`] },
    // Next.js auto-generates <link rel="icon"> from app/icon.png and
    // <link rel="apple-touch-icon"> from app/apple-icon.png — no override needed.
  };
}

export const viewport: Viewport = {
  themeColor: "#0829A5",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    slogan: SITE.tagline,
    url: SITE.url,
    email: settings.email,
    telephone: settings.phone,
    description: settings.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      addressCountry: settings.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    // Drop any social link the client has not filled in, rather than
    // emitting an empty string Google will flag as invalid.
    sameAs: [settings.linkedin, settings.twitter, settings.instagram].filter(
      Boolean,
    ),
  };

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationSchema} />
        <PageLoader />
        <Navbar calendarUrl={settings.calendarUrl} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
