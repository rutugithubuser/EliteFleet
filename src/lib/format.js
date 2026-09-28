// Small helpers for turning Sanity data into the text shown on the site.

// The address exactly as the company writes it. Studio still carries the old
// "Al Quoz" spelling, so every place that shows the address goes through
// siteAddress() below — that keeps one source of truth for the correction.
export const SITE_ADDRESS = "Al Tayer Warehouses, Al Goze Industrial First, UAE";

// The address to display: the Studio value when there is one (corrected to the
// spelling above), otherwise the constant.
export function siteAddress(address) {
  return (address || SITE_ADDRESS).replace(/Al Quoz/g, "Al Goze");
}

// 3999 -> "AED 3,999"
export function formatAed(amount) {
  return `AED ${Number(amount).toLocaleString("en-US")}`;
}

// A car's price line, e.g. "AED 3,999 / day" or "Rates on request"
export function carPriceLabel(car) {
  if (!car || car.priceOnRequest || car.pricePerDay == null) return "Rates on request";
  return `${formatAed(car.pricePerDay)} / day`;
}

// A car's spec list, e.g. ["5 Seats", "Automatic", "350 km"]
export function carSpecs(car) {
  const specs = [];
  if (car.seats) specs.push(`${car.seats} Seats`);
  if (car.transmission) specs.push(car.transmission);
  if (car.dailyKmLimit) specs.push(`${car.dailyKmLimit} km`);
  return specs;
}

// "971585210105" -> "https://wa.me/971585210105"
export function whatsappLink(number) {
  return number ? `https://wa.me/${number}` : null;
}

// "+971 58 521 0105" -> "tel:+971585210105"
export function phoneLink(phone) {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}
