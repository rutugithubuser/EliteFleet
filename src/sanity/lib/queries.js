import { defineQuery } from "next-sanity";

// Fields for a car card (fleet grids, featured cars, related cars, booking summary)
const carCardFields = /* groq */ `
  _id,
  name,
  brand,
  "slug": slug.current,
  "category": category->name,
  pricePerDay,
  priceOnRequest,
  seats,
  transmission,
  dailyKmLimit,
  order,
  year,
  "image": image{ asset, crop, hotspot, alt }
`;

// Everything about one car, for its details page
const carFields = /* groq */ `
  ${carCardFields},
  overview,
  topSpeed,
  engine,
  fuel,
  driveType,
  "includes": includes[],
  "gallery": gallery[]{ asset, crop, hotspot, alt }
`;

// Every car in Sanity, in "Display order" (then by name)
const allCars = /* groq */ `*[_type == "car" && defined(slug.current)] | order(order asc, name asc){ ${carCardFields} }`;

// Everything the homepage needs, fetched in one request
export const HOME_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    address,
    openingHours,
    pickupLocations,
    instagramUrl,
    facebookUrl,
    youtubeUrl
  },
  "home": *[_type == "homePage"][0]{
    heroLabel,
    heroHeadline,
    heroHeadlineAccent,
    heroDescription,
    "heroSlides": heroSlides[defined(car)]{
      _key,
      "image": wideImage{ asset, crop, hotspot, alt },
      "car": car->{ ${carCardFields} }
    },
    "featured": featuredVehicles[]->{ ${carCardFields} }
  },
  "cars": ${allCars},
  "categories": *[_type == "category"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    "image": tileImage{ asset, crop, hotspot, alt }
  },
  "testimonials": *[_type == "testimonial" && showOnSite != false] | order(order asc){
    _id,
    name,
    location,
    quote
  }
}`);

// Shared by every website page: navbar + footer content
export const SITE_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    address,
    openingHours,
    instagramUrl,
    facebookUrl,
    youtubeUrl
  },
  "categories": *[_type == "category"] | order(order asc){ _id, name },
  "legalPages": *[_type == "legalPage" && defined(slug.current)] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current
  }
}`);

// Everything the /fleet page needs: settings, category pills and every car
export const FLEET_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    openingHours
  },
  "categories": *[_type == "category"] | order(order asc){
    _id,
    name,
    "slug": slug.current
  },
  "cars": ${allCars}
}`);

// One car, for /fleet/[slug]
export const CAR_QUERY = defineQuery(`*[_type == "car" && slug.current == $slug][0]{ ${carFields} }`);

// The car details page: the car, up to 3 others in the same category, and the booking settings
export const CAR_PAGE_QUERY = defineQuery(`{
  "car": *[_type == "car" && slug.current == $slug][0]{ ${carFields} },
  "related": *[_type == "car" && defined(slug.current) && slug.current != $slug
    && category._ref == *[_type == "car" && slug.current == $slug][0].category._ref
  ] | order(order asc, name asc)[0...3]{ ${carCardFields} },
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    pickupLocations
  }
}`);

// All car slugs, so each car page is pre-built
export const CAR_SLUGS_QUERY = defineQuery(`*[_type == "car" && defined(slug.current)].slug.current`);

// One legal page, for /legal/[slug]
export const LEGAL_PAGE_QUERY = defineQuery(`*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  lastUpdated,
  body
}`);

export const LEGAL_SLUGS_QUERY = defineQuery(`*[_type == "legalPage" && defined(slug.current)].slug.current`);

// Everything the /booking page needs (the chosen car is picked from "cars" by its slug)
export const BOOKING_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    pickupLocations
  },
  "cars": ${allCars}
}`);

// Everything the Chauffeur page needs
export const CHAUFFEUR_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    pickupLocations
  },
  "page": *[_type == "chauffeurPage"][0]{
    "heroImage": heroImage{ asset, crop, hotspot, alt },
    "fleetImage": fleetImage{ asset, crop, hotspot, alt },
    services[]{ _key, title, description, icon },
    "cars": chauffeurCars[]->{ _id, name, seats, "slug": slug.current }
  }
}`);
