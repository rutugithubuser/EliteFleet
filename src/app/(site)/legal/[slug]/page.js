import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";
import { LEGAL_PAGE_QUERY, LEGAL_SLUGS_QUERY } from "@/sanity/lib/queries";
import styles from "./legal.module.css";

export const revalidate = 60;

// Pre-build every legal page added in Studio → Legal pages
export async function generateStaticParams() {
  const slugs = (await sanityFetch({ query: LEGAL_SLUGS_QUERY })) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await sanityFetch({ query: LEGAL_PAGE_QUERY, params: { slug } });
  return { title: page ? `${page.title} — Elite Fleet` : "Page not found — Elite Fleet" };
}

// "2026-09-26" -> "26 September 2026"
function formatDate(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Links typed in the Studio: outside sites open in a new tab
const components = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const page = await sanityFetch({ query: LEGAL_PAGE_QUERY, params: { slug } });
  if (!page) notFound();

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{page.title}</h1>
        {page.lastUpdated && (
          <p className={styles.updated}>Last updated {formatDate(page.lastUpdated)}</p>
        )}
      </header>
      <div className={styles.body}>
        {Array.isArray(page.body) && <PortableText value={page.body} components={components} />}
      </div>
    </article>
  );
}
