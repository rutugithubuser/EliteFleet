import Link from "next/link";
import { LINKS } from "@/lib/links";

// Last-resort slug when a caller only has the display name ("SUV" -> "suv").
// Sanity's category slugs are plain lowercase names, so this matches them.
function slugify(name = "") {
  return name.trim().toLowerCase();
}

// A link that opens the Fleet page pre-filtered to one category:
// /fleet?category=luxury, /fleet?category=suv, ...
export default function CategoryLink({ category, slug, className, children }) {
  return (
    <Link href={LINKS.fleetCategory(slug || slugify(category))} className={className}>
      {children}
    </Link>
  );
}
