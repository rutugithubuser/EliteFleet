import { notFound } from "next/navigation";

// Any unknown web address lands here and shows (site)/not-found.js,
// so visitors still get the navbar and footer.
export default function Missing() {
  notFound();
}
