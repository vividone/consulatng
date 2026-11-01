import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";

/**
 * ⚠ NOT LEGALLY REVIEWED.
 *
 * Drafted to describe accurately what this site actually does: the contact
 * form fields in components/shared/ContactForm.tsx, the Resend delivery in
 * app/api/contact/route.ts, the Google Maps embed on /contact, and Google
 * Fonts in app/layout.tsx. Every processor named below is one the site really
 * uses — nothing is boilerplate filler.
 *
 * It still needs sign-off from Consulat's counsel before it can be relied on,
 * particularly the retention period (currently unstated for a reason — nobody
 * has decided it) and the NDPA representations.
 *
 * If the site later adds analytics, a chat widget, or the training payment
 * gateway, this page must be updated in the same change.
 */

const LAST_UPDATED = "7 October 2026";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Consulat Ltd collects, uses, and protects personal information submitted through consulatng.net.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`How we handle personal information collected through this website. Last updated ${LAST_UPDATED}.`}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-3xl">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-grey-900 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-grey-900">
            <h2>Who we are</h2>
            <p>
              {SITE.legalName} (&ldquo;Consulat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is an
              immigration consulting firm registered in Nigeria, with offices at{" "}
              {settings.streetAddress}, {settings.addressLocality},{" "}
              {settings.addressRegion}. We are the data controller for personal
              information collected through {SITE.domain}.
            </p>
            <p>
              This policy covers the website only. Personal data you provide to us in
              the course of an immigration engagement — passport data, employment
              contracts, corporate records — is governed by the engagement agreement
              between Consulat and the client company, not by this page.
            </p>

            <h2>What we collect</h2>
            <p>
              <strong>Information you give us.</strong> When you submit the enquiry
              form we collect your name, company name, email address, telephone
              number (if provided), the service you are interested in, the size of
              the delegation you are enquiring about, and anything you write in the
              message field.
            </p>
            <p>
              <strong>Information collected automatically.</strong> Our hosting
              provider records standard server logs for every request, including IP
              address, browser type and the pages requested. These are used to keep
              the site available and to limit abuse of the enquiry form.
            </p>
            <p>
              <strong>Cookies.</strong> This website sets no cookies of its own and
              runs no analytics or advertising trackers. The embedded Google Map on
              our contact page is served by Google and may set cookies under
              Google&rsquo;s own terms; you can avoid this by not visiting that page.
            </p>

            <h2>Why we use it, and on what basis</h2>
            <p>
              We use enquiry form submissions solely to respond to your enquiry and,
              where it leads to an engagement, to carry out the work. The lawful
              basis is your consent in submitting the form, and our legitimate
              interest in responding to a business enquiry addressed to us.
            </p>
            <p>
              We use server logs for security and availability, on the basis of our
              legitimate interest in operating the site safely.
            </p>
            <p>
              We do not sell personal information, and we do not use it for
              automated decision-making or profiling.
            </p>

            <h2>Who else processes it</h2>
            <p>
              We use a small number of service providers, each of which processes
              data on our instructions:
            </p>
            <ul>
              <li>
                <strong>Resend</strong> — delivers enquiry form submissions to our
                inbox by email. Processed outside Nigeria.
              </li>
              <li>
                <strong>Vercel</strong> — hosts this website and holds the server
                logs described above. Processed outside Nigeria.
              </li>
              <li>
                <strong>Google</strong> — serves the web fonts used across the site
                and the map embedded on our contact page.
              </li>
            </ul>
            <p>
              Where personal information is processed outside Nigeria, we rely on the
              provider&rsquo;s contractual data protection commitments. We will
              otherwise disclose personal information only where required by law or
              by a competent regulatory authority.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not lead to an engagement are retained only for as
              long as needed to deal with the enquiry and any follow-up, and are then
              deleted. Where an enquiry becomes a client engagement, retention is
              governed by that engagement and by the record-keeping obligations that
              apply to immigration work.
            </p>

            <h2>Your rights</h2>
            <p>
              Under the Nigeria Data Protection Act 2023 you may ask us to confirm
              what personal information we hold about you, provide a copy of it,
              correct it if it is wrong, delete it, or restrict how we use it. You
              may also withdraw consent at any time, and object to processing carried
              out on the basis of our legitimate interests.
            </p>
            <p>
              To exercise any of these, email{" "}
              <a href={`mailto:${settings.email}`}>{settings.email}</a>. We will respond
              within the period required by law. If you are not satisfied with our
              response, you may complain to the Nigeria Data Protection Commission.
            </p>

            <h2>Security</h2>
            <p>
              This site is served over HTTPS and enquiry submissions are rate-limited
              and transmitted encrypted. No transmission over the internet can be
              guaranteed completely secure, and we ask that you do not send passport
              scans, identity documents or other sensitive material through the
              enquiry form. We will tell you how to send those securely once an
              engagement begins.
            </p>

            <h2>Changes</h2>
            <p>
              We will update this page when our practices change, and will revise the
              date at the top when we do.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy should go to{" "}
              <a href={`mailto:${settings.email}`}>{settings.email}</a> or through our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
