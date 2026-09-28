// Every place a button or link on the site can go, in one file.
// When a new page is built (e.g. the real booking page), update it here
// and every button that points to it follows automatically.
//
// Section links start with "/" (e.g. "/#about") so they also work
// from other pages: they go back to the homepage and scroll to the section.

export const LINKS = {
  // Homepage sections
  home: "/",
  about: "/#about",
  contact: "/#contact",

  // Pages (fleet is fully built; the rest are still "coming soon")
  fleet: "/fleet",
  // Fleet page pre-filtered by category, e.g. "/fleet?category=luxury"
  // (category slugs come from Sanity; see the `category` document type)
  fleetCategory: (slug) => `/fleet?category=${encodeURIComponent(slug)}`,
  car: (slug) => `/fleet/${slug}`,
  booking: "/booking",
  bookCar: (slug) => `/booking?car=${encodeURIComponent(slug)}`,
  chauffeur: "/chauffeur",

  // Editable in Sanity (Studio → Legal pages)
  legal: (slug) => `/legal/${slug}`,
};
