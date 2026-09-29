"use client";

// A <script> that runs while the page first loads (before anything is shown),
// e.g. to pick light/night mode without a white flash.
// On the server it's a normal script; in the browser React renders it as
// text/plain, so React doesn't warn about script tags and it doesn't run twice.
// (Pattern from Next.js docs: "Preventing flash before hydration".)
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
