import Link from "next/link";
import type { ReactNode } from "react";
import { getSingleton, items, type NavLink, type Site } from "../lib/content";

/** Nav + footer for the code-driven entry routes (blog / case studies). The CMS marketing
 *  pages bring their own navbar/footer blocks; these mirror them for visual consistency.
 *  Brand/nav/tagline read from the `site` global so they're editable in the CMS, falling back
 *  to the starter defaults when absent. */
const DEFAULT_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const site = getSingleton<Site>("site");
  const brand = site?.brandName ?? "Acme";
  const nav = items(site?.navLinks).length ? items(site?.navLinks) : DEFAULT_NAV;
  const tagline =
    site?.footerTagline ?? "Ship structured content faster. A marketing starter powered by BetterCMS.";

  return (
    <>
      <nav className="site-nav">
        <Link className="brand" href="/">{brand}<span className="dot">.</span></Link>
        <div className="links">
          {nav.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <Link className="bcms-button bcms-button--primary" href="/contact">Contact</Link>
        </div>
      </nav>
      {children}
      <footer className="site-footer">
        <div className="site-footer-cols">
          <div className="site-footer-brand">
            <Link className="brand" href="/">{brand}<span className="dot">.</span></Link>
            <p>{tagline}</p>
          </div>
          <div className="site-footer-col">
            <h4>Explore</h4>
            <ul>
              {nav.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="site-footer-col">
            <h4>Get started</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href="https://bettercms.ai" target="_blank" rel="noreferrer">BetterCMS</a></li>
            </ul>
          </div>
        </div>
        <p className="site-footer-copy">© {new Date().getFullYear()} {brand}. Built with BetterCMS.</p>
      </footer>
    </>
  );
}
