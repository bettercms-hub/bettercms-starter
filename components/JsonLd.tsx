/** Structured data — one <script> per schema node. The 50 KB cap is a guard against a
 *  runaway CMS field ending up inline in every page's <head>. Next's Metadata can't carry
 *  JSON-LD, so routes render it in the body. */
export function JsonLd({ data }: { data: Array<Record<string, unknown>> }) {
  const blobs = data.filter(Boolean).map((s) => JSON.stringify(s)).filter((j) => j.length <= 50_000);
  return (
    <>
      {blobs.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      ))}
    </>
  );
}
