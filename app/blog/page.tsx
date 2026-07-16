import Link from "next/link";
import type { Metadata } from "next";
import { listEntries } from "../../lib/content";
import type { BlogPostFields } from "../../lib/cms";
import { SiteChrome } from "../../components/SiteChrome";
import { brandName, metadata as seoMetadata } from "../../lib/seo";

export const generateMetadata = (): Metadata =>
  seoMetadata({ title: `Blog — ${brandName()}`, metaDescription: `Writing from the ${brandName()} team.` });

export default function BlogIndex() {
  const items = listEntries<BlogPostFields>("blog-post");
  return (
    <SiteChrome>
      <main id="main" className="container">
        <header className="page-head">
          <h1>Blog</h1>
          <p>Notes, updates, and what we’re thinking about.</p>
        </header>
        {items.length === 0 ? (
          <p className="empty-note">No published posts yet.</p>
        ) : (
          <div className="card-grid">
            {items.map(({ slug, data }) => (
              <article className="card" key={slug}>
                <Link href={`/blog/${slug}`}>
                  {data.coverImage?.url && (
                    <img className="thumb" src={data.coverImage.url} alt={data.coverImage.alt ?? ""} loading="lazy" />
                  )}
                  <div className="body">
                    {data.publishedDate && <span className="eyebrow">{data.publishedDate}</span>}
                    <h3>{data.title}</h3>
                    {data.excerpt && <p>{data.excerpt}</p>}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </SiteChrome>
  );
}
