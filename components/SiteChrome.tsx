import Link from "next/link";
import type { ReactNode } from "react";
import { readForms } from "@bettercms-ai/next";
import { getSingleton, items, type NavLink, type Site } from "../lib/content";
import { brandName } from "../lib/seo";
import { NewsletterForm } from "./NewsletterForm";

/** The site's chrome: N1b nav + Ft7 footer, wrapped around every route.
 *
 *  Everything comes from the `site` global, so rebranding happens in the CMS, not here.
 *
 *  The nav CTA is DERIVED from navLinks (the last entry) rather than appended to them: the old
 *  nav hard-coded a Contact button on top of the seeded Contact link, and the old Ft3 footer
 *  hard-coded it a third time next to a full link index. Contact rendered 3× on every page.
 *
 *  Ft7 (newsletter-first) replaces that Ft3 (four link columns + social row + copyright) — the
 *  most-recognised AI footer fingerprint, and one this genre bans. It also gives the seeded
 *  `socials` and the seeded Newsletter form somewhere to live; both rendered nowhere before. */

const FALLBACK_NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const site = getSingleton<Site>("site");
  const brand = brandName();
  const nav = items(site?.navLinks).length ? items(site?.navLinks) : FALLBACK_NAV;
  /** The last link is the CTA — one button, never a duplicate of a link beside it. */
  const cta = nav.at(-1);
  const links = nav.slice(0, -1);
  const tagline = site?.footerTagline ?? "A marketing starter powered by BetterCMS.";
  const socials = items(site?.socials);
  /** The seeded Newsletter form. Matched by name: seeding mints fresh ids, so the id in the
   *  template JSON is never the id in a real project. */
  const newsletter = readForms().forms.find((f) => /newsletter/i.test(f.name ?? ""));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <nav className="site-nav" aria-label="Primary">
        <Link className="brand" href="/">{brand}<span className="dot">.</span></Link>
        <div className="links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          {cta && (
            <Link className="bcms-button bcms-button--primary nav-cta" href={cta.href}>{cta.label}</Link>
          )}
        </div>
      </nav>
      {children}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-say">
            <h2>{tagline}</h2>
          </div>
          {newsletter ? (
            <NewsletterForm form={newsletter} />
          ) : (
            <p className="newsletter-note">Add a Newsletter form in the CMS and it appears here.</p>
          )}
        </div>
        <div className="site-footer-meta">
          <Link className="brand" href="/">{brand}<span className="dot">.</span></Link>
          <nav aria-label="Footer">
            {nav.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          {socials.length > 0 && (
            <div className="site-footer-socials">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
              ))}
            </div>
          )}
          <p className="site-footer-copy">© {new Date().getFullYear()} {brand}</p>
        </div>
      </footer>
    </>
  );
}
