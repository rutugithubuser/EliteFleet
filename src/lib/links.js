// Every place a button or link on the site can go, in one file.
// When a new page is built (e.g. the real booking page), update it here
// and every button that points to it follows automatically.
//
// Section links start with "/" (e.g. "/#fleet") so they also work
// from other pages: they go back to the homepage and scroll to the section.

export const LINKS = {
  // Homepage sections
  home: "/",
  fleetSection: "/#fleet",
  about: "/#about",
  contact: "/#contact",

  // Pages (currently "coming soon" pages, to be replaced by the Figma designs)
  fleet: "/fleet",
  car: (slug) => `/fleet/${slug}`,
  booking: "/booking",
  bookCar: (slug) => `/booking?car=${encodeURIComponent(slug)}`,
  chauffeur: "/chauffeur",

  // Editable in Sanity (Studio → Legal pages)
  legal: (slug) => `/legal/${slug}`,
};
