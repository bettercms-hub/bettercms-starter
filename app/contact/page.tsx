import type { Metadata } from "next";
import { CmsPage, pageMetadata } from "../../lib/page";
import { brandName } from "../../lib/seo";

export const generateMetadata = (): Metadata => pageMetadata("contact", `Contact — ${brandName()}`);

export default function ContactPage() {
  return <CmsPage slug="contact" />;
}
