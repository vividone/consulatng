import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { CTABanner } from "@/components/home/CTABanner";
import { getAllPosts, formatDate } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Immigration Insights & Resources — Consulat",
  description:
    "Articles, guides, and regulatory updates on immigration and work permits in Nigeria.",
  path: "/blog",
  keywords: ["Nigeria immigration blog", "immigration news Nigeria", "CERPAC guide", "expatriate quota Nigeria"],
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Immigration Insights & Resources"
        subtitle="Stay informed with the latest updates, regulatory changes, and practical guides on immigration and work permits in Nigeria."
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="container-prose">
          <div className="mx-auto mb-14 max-w-3xl text-center text-lg leading-relaxed text-grey-700">
            <p>
              Our team publishes regular updates to help HR professionals, business leaders, and immigration managers stay ahead of regulatory changes and compliance requirements in Nigeria.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-grey-700">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 100}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary via-primary-light to-accent" />
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center gap-4 text-xs text-grey-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
                        </span>
                      </div>
                      <h2 className="mt-4 font-display text-xl font-bold leading-snug text-grey-900 group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-grey-700">
                        {post.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Read article
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
