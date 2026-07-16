import type { Metadata } from "next";
import { CmsPage, pageMetadata } from "../../lib/page";
import { brandName } from "../../lib/seo";

export const generateMetadata = (): Metadata => pageMetadata("about", `About — ${brandName()}`);

export default function AboutPage() {
  return <CmsPage slug="about" />;
}
