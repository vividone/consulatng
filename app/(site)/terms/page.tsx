import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";

/**
 * ⚠ NOT LEGALLY REVIEWED. See the same note in app/privacy/page.tsx.
 *
 * These are website terms only — they deliberately say nothing about the terms
 * of an immigration engagement, which belong in Consulat's client agreement.
 * The limitation of liability and governing law clauses in particular need
 * counsel's sign-off before this is relied on.
 */

const LAST_UPDATED = "7 October 2026";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms governing use of the Consulat Ltd website at consulatng.net.",
  path: "/terms",
});

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle={`The terms on which you may use this website. Last updated ${LAST_UPDATED}.`}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose max-w-3xl">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-grey-900 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-grey-900">
            <h2>About these terms</h2>
            <p>
              This website is operated by {SITE.legalName}, a company registered in
              Nigeria. By using {SITE.domain} you accept these terms. If you do not
              accept them, please do not use the site.
            </p>

            <h2>This site is information, not advice</h2>
            <p>
              The content on this site describes the services we offer and explains
              Nigerian immigration procedures in general terms. It is not legal
              advice and must not be relied on as a substitute for advice on your own
              circumstances.
            </p>
            <p>
              Immigration rules, fees and processing times in Nigeria change, often
              at short notice. We update this site in good faith but do not warrant
              that every statement on it reflects the position at the moment you read
              it. Before acting on anything here, speak to us or to another qualified
              adviser.
            </p>

            <h2>Enquiries do not create an engagement</h2>
            <p>
              Submitting the enquiry form, booking a consultation, or corresponding
              with us by email, telephone or WhatsApp does not create a
              client relationship or oblige either party to proceed. We are engaged
              only when both parties have signed a written engagement agreement,
              and that agreement — not this page — governs the work, the fees and
              the respective obligations.
            </p>

            <h2>Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                use the enquiry form to send unsolicited, abusive, fraudulent or
                automated submissions;
              </li>
              <li>
                attempt to gain unauthorised access to the site, its servers or any
                connected system;
              </li>
              <li>
                scrape, copy or republish substantial parts of the site for
                commercial purposes without our written permission; or
              </li>
              <li>use the site in any way that breaks Nigerian law.</li>
            </ul>
            <p>
              We may restrict access to the site, including by blocking an IP
              address, where we reasonably believe it is being misused.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The text, design, logos and graphics on this site belong to{" "}
              {SITE.legalName} or are used under licence. Client and partner
              logos shown on the site remain the property of their respective
              owners and are displayed with permission. You may read, print and
              share pages for your own non-commercial reference; any other use
              needs our written permission.
            </p>

            <h2>Links to other sites</h2>
            <p>
              This site links to third-party services, including our consultation
              booking page, WhatsApp, and Nigerian government resources. We do not
              control those sites and are not responsible for their content,
              availability or privacy practices.
            </p>

            <h2>Availability and liability</h2>
            <p>
              We aim to keep the site available but do not guarantee uninterrupted
              access, and we may change or withdraw any part of it without notice.
            </p>
            <p>
              To the fullest extent permitted by Nigerian law, we exclude liability
              for any loss arising from use of, or inability to use, this site, or
              from reliance on its content. Nothing in these terms excludes liability
              for fraud, or for anything else that cannot lawfully be excluded.
            </p>
            <p>
              This clause concerns the website. Our liability in respect of
              immigration work carried out for a client is governed by the
              engagement agreement for that work.
            </p>

            <h2>Privacy</h2>
            <p>
              Our <Link href="/privacy">Privacy Policy</Link> explains what we do
              with personal information submitted through this site and forms part of
              these terms.
            </p>

            <h2>Changes</h2>
            <p>
              We may revise these terms from time to time. The version published here
              at the time you use the site is the one that applies, and the date at
              the top shows when it last changed.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of
              Nigeria, and the courts of Lagos State have exclusive jurisdiction over
              any dispute arising from them.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms should go to{" "}
              <a href={`mailto:${settings.email}`}>{settings.email}</a> or through our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
