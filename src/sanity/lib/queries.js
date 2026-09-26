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
