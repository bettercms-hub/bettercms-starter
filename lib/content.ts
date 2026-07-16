import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Image } from "./cms";

/**
 * Read content entries from the deploy Action's build snapshot (`bcms-content.json`,
 * `collections` keyed by model slug, depth-1 hydrated). Pages + forms come from the SDK's
 * readers (`getPage`/`readForms`); entries we read here. Absent file → empty (e.g. before
 * `npm run fetch-content` locally).
 */
export type SnapshotEntry<T> = { slug: string; data: T };

let cache: Record<string, SnapshotEntry<unknown>[]> | null = null;

function collections(): Record<string, SnapshotEntry<unknown>[]> {
  if (cache) return cache;
  try {
    const raw = readFileSync(resolve(process.cwd(), "bcms-content.json"), "utf8");
    cache = (JSON.parse(raw).collections ?? {}) as Record<string, SnapshotEntry<unknown>[]>;
  } catch {
    cache = {};
  }
  return cache;
}

export function listEntries<T>(model: string): SnapshotEntry<T>[] {
  return (collections()[model] ?? []) as SnapshotEntry<T>[];
}

export function getEntry<T>(model: string, slug: string): SnapshotEntry<T> | undefined {
  return listEntries<T>(model).find((e) => e.slug === slug);
}

/** Singleton models (site/home/…) have exactly one entry — return its data. */
export function getSingleton<T>(model: string): T | undefined {
  return listEntries<T>(model)[0]?.data;
}

// ── Site globals (the `site` singleton: brand/nav/footer chrome, editable in the CMS) ──────────
/** Repeatable/zoned-array fields arrive as `{ repeatable: [...] }` at delivery depth ≥ 1. */
export type Repeatable<T> = { repeatable?: T[] };
export type NavLink = { label: string; href: string };
export type Social = { label: string; href: string };
/** The `site` global — brand + chrome + SEO defaults, all editable in the CMS.
 *  Every field here is seeded by the template and rendered somewhere; if you add one,
 *  render it, and if you stop rendering one, drop it from the seed. */
export type Site = {
  brandName?: string;
  navLinks?: Repeatable<NavLink>;
  footerTagline?: string;
  socials?: Repeatable<Social>;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: Image;
  twitterHandle?: string;
};
/** Unwrap a repeatable field to a plain list. */
export function items<T>(field?: Repeatable<T>): T[] {
  return Array.isArray(field?.repeatable) ? field.repeatable : [];
}
