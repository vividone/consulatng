/**
 * Blog data source.
 *
 * Reads from WordPress when `WP_API_URL` is set, and from the local MDX files
 * in content/blog/ otherwise. Both paths return the same `BlogPost` shape, so
 * pages don't branch — only the `format` field differs, telling the renderer
 * whether it holds MDX source or WordPress HTML.
 *
 * The exported function names are unchanged from the MDX-only version on
 * purpose: app/blog/page.tsx, app/blog/[slug]/page.tsx and app/sitemap.ts
 * only ever imported through here, so switching the backing store touched
 * this file and nothing else. They are now async — that is the one change
 * callers had to absorb.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  fetchPost,
  fetchPostPreview,
  fetchPosts,
  isWpEnabled,
  toPlainText,
  type WpBlogPost,
} from "./wp";

export type BlogFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
  /** How `content` must be rendered: MDX source, or pre-rendered WP HTML. */
  format: "mdx" | "html";
  /** Last modified — falls back to `date` for MDX, which has no such field. */
  modified: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/* -------------------------------------------------------------------------
 * WordPress path
 * ---------------------------------------------------------------------- */

function fromWp(post: WpBlogPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    modified: post.modified,
    author: post.author,
    image: post.image?.url,
    imageAlt: post.image?.alt,
    content: post.html,
    format: "html",
    // Word count from the text, not the markup, or every post reads as long.
    readingTime: readingTime(toPlainText(post.html)),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  };
}

/* -------------------------------------------------------------------------
 * Local MDX path (fallback)
 * ---------------------------------------------------------------------- */

function mdxSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

function mdxPost(slug: string): BlogPost | null {
  const candidates = [
    path.join(BLOG_DIR, `${slug}.mdx`),
    path.join(BLOG_DIR, `${slug}.md`),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;

  return {
    slug,
    title: fm.title,
    excerpt: fm.excerpt,
    date: fm.date,
    modified: fm.date,
    author: fm.author,
    image: fm.image,
    content,
    format: "mdx",
    readingTime: readingTime(content),
  };
}

/* -------------------------------------------------------------------------
 * Public API
 * ---------------------------------------------------------------------- */

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isWpEnabled()) return mdxSlugs();
  return (await fetchPosts()).map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isWpEnabled()) return mdxPost(slug);
  const post = await fetchPost(slug);
  return post ? fromWp(post) : null;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!isWpEnabled()) {
    return mdxSlugs()
      .map((slug) => mdxPost(slug))
      .filter((p): p is BlogPost => p !== null)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }
  // WordPress already sorts by date descending.
  return (await fetchPosts()).map(fromWp);
}

/**
 * An unpublished post, for draft preview. WordPress only — there is no such
 * thing as an unpublished MDX file.
 */
export async function getPostPreview(slug: string): Promise<BlogPost | null> {
  if (!isWpEnabled()) return mdxPost(slug);
  const post = await fetchPostPreview(slug);
  return post ? fromWp(post) : null;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
