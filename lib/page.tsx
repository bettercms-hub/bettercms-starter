import type { Metadata } from "next";
import { getPage, readForms } from "@bettercms-ai/next";
import { BcmsBlocks } from "@bettercms-ai/next/blocks";
import { SiteChrome } from "../components/SiteChrome";
import { JsonLd } from "../components/JsonLd";
import { brandName, jsonLd, metadata as seoMetadata } from "./seo";

/** Render a CMS page (Home/About/Contact) from the build snapshot, inside the site's chrome.
 *  The page's block tree is the body; a `form` block resolves against `readForms()`. */
export function CmsPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  const { forms, turnstileSiteKey } = readForms();
  return (
    <SiteChrome>
      <main id="main" className="page-body">
        {page?.blocks?.length ? (
          <>
            <JsonLd data={jsonLd({ title: page.title, metaTitle: page.metaTitle, metaDescription: page.metaDescription })} />
            <BcmsBlocks blocks={page.blocks} forms={forms} turnstileSiteKey={turnstileSiteKey ?? undefined} />
          </>
        ) : (
          <div>
            <p className="empty-note">
              This page has no published content yet — add blocks to it in BetterCMS and publish.
            </p>
          </div>
        )}
      </main>
    </SiteChrome>
  );
}

/** The route's <head>, page-over-site: per-page meta layered over the `site` global's SEO
 *  defaults (seoTitle / seoDescription / ogImage / twitterHandle), none of which the starter
 *  read before. `fallbackTitle` covers a page that isn't published yet. */
export function pageMetadata(slug: string, fallbackTitle?: string): Metadata {
  const page = getPage(slug);
  if (!page) return seoMetadata({ title: fallbackTitle ?? brandName() });
  return seoMetadata({ title: page.title, metaTitle: page.metaTitle, metaDescription: page.metaDescription });
}
