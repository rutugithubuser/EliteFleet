import { defineQuery } from "next-sanity";

// Fields shared by every place a car is shown
const carFields = /* groq */ `
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
  "image": image{ asset, crop, hotspot, alt },
  year,
  overview,
  topSpeed,
  engine,
  fuel,
  driveType,
  "includes": includes[],
  "gallery": gallery[]{ asset, crop, hotspot, alt }
`;

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
      "car": car->{ ${carFields} }
    },
    "featured": featuredVehicles[]->{ ${carFields} }
  },
  // (The fleet cars themselves come from src/data/vehicles.js — see below.)
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
  },
  "cars": *[_type == "car"] | order(order asc, name asc){ ${carFields} }
}`);

// Categories + site settings for the /fleet page. The cars themselves come
// from the static 12-vehicle list in src/data/vehicles.js, so the `cars`
// half of the old FLEET_QUERY is no longer fetched there (homepage sections
// still fetch their own Sanity cars).
export const FLEET_META_QUERY = defineQuery(`{
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
  }
}`);

// One car, for /fleet/[slug]
export const CAR_QUERY = defineQuery(`*[_type == "car" && slug.current == $slug][0]{ ${carFields} }`);

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

// Everything the /booking page needs
export const BOOKING_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    phone,
    whatsappNumber,
    email,
    pickupLocations
  }
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
