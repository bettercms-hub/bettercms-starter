/** Field shapes seeded by the "Marketing Starter" template. Image fields are `{ url, alt }`;
 *  richtext fields are `{ html }`; references hydrate to the nested entry at depth >= 1. */
export type Image = { url: string; alt?: string };
export type RichText = { html: string };

export type Author = { name: string; role?: string; bio?: string; avatar?: Image };
/** A depth>=1 hydrated reference: the nested entry in raw delivery shape (`data`). */
export type HydratedAuthor = { slug: string; data?: Author };

export type BlogPostFields = {
  title: string;
  excerpt?: string;
  coverImage?: Image;
  body?: RichText;
  author?: HydratedAuthor | string;
  publishedDate?: string;
};

export type CaseStudyFields = {
  title: string;
  client?: string;
  summary?: string;
  coverImage?: Image;
  body?: RichText;
};

/** Resolve a hydrated author reference (id string at depth 0 → null). */
export function authorData(author: BlogPostFields["author"]): Author | null {
  if (!author || typeof author === "string") return null;
  return author.data ?? null;
}
