import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BcmsField } from "@bettercms-ai/next";
import { listEntries, getEntry } from "../../../lib/content";
import type { CaseStudyFields } from "../../../lib/cms";
import { SiteChrome } from "../../../components/SiteChrome";
import { JsonLd } from "../../../components/JsonLd";
import { caseStudySchema, jsonLd, metadata as seoMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return listEntries<CaseStudyFields>("case-study").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getEntry<CaseStudyFields>("case-study", slug);
  if (!cs) return {};
  return seoMetadata({ title: cs.data.title, metaDescription: cs.data.summary });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getEntry<CaseStudyFields>("case-study", slug);
  if (!cs) notFound();

  const f = cs.data;
  const seoArgs = { title: f.title, metaDescription: f.summary, schema: caseStudySchema(f) };

  return (
    <SiteChrome>
      <main id="main">
        <JsonLd data={jsonLd(seoArgs)} />
        <article className="article">
          <Link className="back-link" href="/case-studies">← Back to case studies</Link>
          <BcmsField path="title"><h1>{f.title}</h1></BcmsField>
          {f.client && <BcmsField path="client"><p className="byline">{f.client}</p></BcmsField>}
          {f.coverImage?.url && <img className="cover" src={f.coverImage.url} alt={f.coverImage.alt ?? ""} data-bcms-field="coverImage" data-bcms-kind="image" />}
          {f.summary && <BcmsField path="summary"><p className="prose summary">{f.summary}</p></BcmsField>}
          {f.body?.html && <BcmsField path="body" kind="richtext"><div className="prose" dangerouslySetInnerHTML={{ __html: f.body.html }} /></BcmsField>}
        </article>
      </main>
    </SiteChrome>
  );
}
