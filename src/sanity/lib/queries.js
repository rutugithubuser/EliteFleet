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
  "image": image{ asset, crop, hotspot, alt }
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
  "cars": *[_type == "car"] | order(order asc, name asc){ ${carFields} },
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
