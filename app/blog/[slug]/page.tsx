import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { CTABanner } from "@/components/home/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { getAllPostSlugs, getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <article className="bg-white">
        <header className="border-b border-grey-200 bg-grey-50">
          <div className="container-prose max-w-3xl py-14 sm:py-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
            <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight text-grey-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-grey-700">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-grey-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readingTime} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
            </div>
          </div>
        </header>

        <div className="container-prose max-w-3xl py-14 sm:py-20">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-grey-900 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-grey-900">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-grey-200 bg-grey-50 py-14 sm:py-20">
          <div className="container-prose">
            <h2 className="mb-8 font-display text-2xl font-bold text-grey-900">
              Related articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-2xl border border-grey-200 bg-white p-7 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="text-xs text-grey-500">{formatDate(r.date)}</div>
                  <h3 className="mt-2 font-display text-lg font-bold text-grey-900 group-hover:text-accent">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey-700">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
