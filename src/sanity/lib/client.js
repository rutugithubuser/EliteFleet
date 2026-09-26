import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The site refreshes its content every 60 seconds (see sanityFetch below),
  // so we read straight from Sanity's API instead of its CDN, as Sanity recommends.
  useCdn: false,
  // Only ever show published content on the website, never drafts
  perspective: "published",
});

/**
 * Fetch content from Sanity for the website.
 * Results are cached and refreshed at most every `revalidate` seconds,
 * so edits made in the Studio appear on the site within about a minute.
 */
export function sanityFetch({ query, params = {}, revalidate = 60 }) {
  return client.fetch(query, params, { next: { revalidate } });
}
