/**
 * Head metadata + JSON-LD, resolved page-over-site.
 *
 * The `site` global seeds seoTitle / seoDescription / ogImage / twitterHandle — none of which
 * anything rendered before. They're editable in the CMS, so they resolve here rather than being
 * hard-coded per route.
 *
 * `buildMetadata` (@bettercms-ai/next) maps the merge onto a Next `Metadata`; `resolveSeo`
 * (@bettercms-ai/sdk) gives us the same merge for the JSON-LD, which Next's Metadata can't
 * carry. Both delegate to the resolver the Astro adapter and the server renderer use, so every
 * surface emits identical SEO.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@bettercms-ai/next";
import { resolveSeo } from "@bettercms-ai/sdk";
import { getSingleton, type Site } from "./content";
import { authorData, type Author, type BlogPostFields, type CaseStudyFields } from "./cms";

type Json = Record<string, unknown>;
type SeoArgs = {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  schema?: Json | Json[];
};

const site = (): Site | undefined => getSingleton<Site>("site");

function defaults() {
  const s = site();
  return {
    metaTitle: s?.seoTitle,
    metaDescription: s?.seoDescription,
    ogImage: s?.ogImage?.url ?? null,
    twitterHandle: s?.twitterHandle ?? null,
    siteSchema: s ? organizationSchema(s) : undefined,
  };
}

const input = (a: SeoArgs) => ({
  title: a.title,
  metaTitle: a.metaTitle,
  metaDescription: a.metaDescription,
  metaJson: a.schema ? { schema: a.schema } : null,
});

/** A route's `generateMetadata` value. */
export const metadata = (args: SeoArgs): Metadata => buildMetadata(input(args), defaults());

/** JSON-LD nodes for the route — Next's Metadata can't carry them, so the page renders them. */
export const jsonLd = (args: SeoArgs): Json[] => resolveSeo(input(args), defaults()).jsonLd;

/** The brand, from the CMS. The single source for <title>, the nav, and the footer. */
export const brandName = (): string => site()?.brandName ?? "Harbor";

// ── Schema builders (https://schema.org) ────────────────────────────────────────────────────

export const organizationSchema = (s: Site): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: s.brandName,
  ...(s.seoDescription ? { description: s.seoDescription } : {}),
  ...(s.ogImage?.url ? { logo: s.ogImage.url } : {}),
});

export const blogPostingSchema = (post: BlogPostFields): Json => {
  const author: Author | null = authorData(post.author);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage?.url ? { image: post.coverImage.url } : {}),
    ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
    ...(author ? { author: { "@type": "Person", name: author.name, ...(author.role ? { jobTitle: author.role } : {}) } } : {}),
  };
};

export const caseStudySchema = (c: CaseStudyFields): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: c.title,
  ...(c.summary ? { description: c.summary } : {}),
  ...(c.coverImage?.url ? { image: c.coverImage.url } : {}),
  ...(c.client ? { about: c.client } : {}),
});
