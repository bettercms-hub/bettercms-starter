import Link from "next/link";
import type { Metadata } from "next";
import { SiteChrome } from "../components/SiteChrome";
import { brandName, metadata as seoMetadata } from "../lib/seo";

/** The site had no 404 page at all — an unknown URL fell through to the host's default. */
export const generateMetadata = (): Metadata =>
  seoMetadata({ title: `Page not found — ${brandName()}`, metaDescription: "That page doesn’t exist." });

export default function NotFound() {
  return (
    <SiteChrome>
      <main id="main" className="notfound">
        <h1>Page not found</h1>
        <p>That link is broken, or the page has moved.</p>
        <Link className="bcms-button bcms-button--primary" href="/">Back to home</Link>
      </main>
    </SiteChrome>
  );
}
