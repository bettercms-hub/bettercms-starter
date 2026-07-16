import Link from "next/link";
import type { Metadata } from "next";
import { listEntries } from "../../lib/content";
import type { CaseStudyFields } from "../../lib/cms";
import { SiteChrome } from "../../components/SiteChrome";
import { brandName, metadata as seoMetadata } from "../../lib/seo";

export const generateMetadata = (): Metadata =>
  seoMetadata({ title: `Case studies — ${brandName()}`, metaDescription: `Selected work from ${brandName()}.` });

export default function CaseStudiesIndex() {
  const items = listEntries<CaseStudyFields>("case-study");
  return (
    <SiteChrome>
      <main id="main" className="container">
        <header className="page-head">
          <h1>Case studies</h1>
          <p>A closer look at what we’ve shipped, and how.</p>
        </header>
        {items.length === 0 ? (
          <p className="empty-note">No published case studies yet.</p>
        ) : (
          <div className="card-grid">
            {items.map(({ slug, data }) => (
              <article className="card" key={slug}>
                <Link href={`/case-studies/${slug}`}>
                  {data.coverImage?.url && (
                    <img className="thumb" src={data.coverImage.url} alt={data.coverImage.alt ?? ""} loading="lazy" />
                  )}
                  <div className="body">
                    {data.client && <span className="eyebrow">{data.client}</span>}
                    <h3>{data.title}</h3>
                    {data.summary && <p>{data.summary}</p>}
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
