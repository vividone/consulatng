import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { CTABanner } from "@/components/home/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  formatDate,
  getPostBySlug,
  getPosts,
  readingTime,
  resolveImage,
} from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // getPosts() already excludes drafts, which is what kept a slug-less
  // autosaved draft out of here. The guard stays because a bad slug should
  // cost one missing page, not the whole deployment: Next fails the entire
  // build if any param is not a string.
  return (await getPosts())
    .map((p) => p.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug !== "")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    // Prefer the editor's SEO overrides when they have set them.
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);
  const cover = resolveImage(post.coverImage);
  const published = post.publishedAt ?? post.createdAt;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: published,
    // Freshness is a ranking input; datePublished alone leaves Google
    // assuming the article has never been revised.
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    ...(cover ? { image: cover.url } : {}),
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
                <Calendar className="h-4 w-4" /> {formatDate(published)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {readingTime(post.content)} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
            </div>
          </div>
        </header>

        {cover && (
          <div className="container-prose max-w-4xl pt-10 sm:pt-14">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-prose max-w-3xl py-14 sm:py-20">
          {/*
            RichText renders Payload's Lexical JSON to React elements. Not
            dangerouslySetInnerHTML: there is no HTML string anywhere in this
            path, so there is nothing to sanitise and no injection surface.
          */}
          <RichText
            data={post.content}
            className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-grey-900 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-grey-900"
          />
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
                  <div className="text-xs text-grey-500">
                    {formatDate(r.publishedAt ?? r.createdAt)}
                  </div>
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
