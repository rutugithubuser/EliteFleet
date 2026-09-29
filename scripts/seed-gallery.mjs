// Fills each car's empty "gallery" field with copies of its own main photo, so
// the vehicle detail page renders its thumbnail row while real extra photos are
// still being shot and uploaded.
//
// Every car in the dataset currently has gallery: null, which makes
// VehicleGallery fall back to a single image and hide the thumbnails. This
// reuses the existing main photo N times so the layer can be reviewed.
//
//   node scripts/seed-gallery.mjs            # dry run, prints the plan
//   node scripts/seed-gallery.mjs --write    # actually writes to Sanity
//
// Writing needs a Sanity token with Editor (or higher) rights:
//
//   npx sanity login                         # stores a token in ~/.config
//   node scripts/seed-gallery.mjs --write
//
// Or pass one explicitly:  SANITY_API_TOKEN=... node scripts/seed-gallery.mjs --write
//
// Safe to re-run: cars that already have gallery photos are skipped.

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const write = process.argv.includes("--write");
const copies = Number(process.env.SEED_GALLERY_COPIES || 4);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-23";

// `npx sanity login` stores its token on disk, so prefer that over requiring the
// caller to paste a secret into the environment.
function storedToken() {
  const candidates = [
    process.env.SANITY_CONFIG_PATH,
    join(homedir(), ".config", "sanity", "config.json"),
    join(homedir(), ".config", "sanity", "config.jsonc"),
    join(homedir(), "AppData", "Roaming", "sanity", "config.json"),
  ].filter(Boolean);

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const config = JSON.parse(readFileSync(path, "utf8"));
      const entry = (config.projects || [])[projectId];
      const found = entry?.auth || entry?.token;
      if (found) return found;
    } catch {
      /* config.jsonc and partial files are fine to skip */
    }
  }
  return null;
}

const token = process.env.SANITY_API_TOKEN || storedToken();

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET.");
  process.exit(1);
}

const readClient = createClient({ projectId, dataset, apiVersion, useCdn: false });
const writeClient = token
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, token })
  : null;

const cars = await readClient.fetch(
  `*[_type == "car"] | order(name asc) {
     _id, name, gallery, "asset": image.asset._ref, "alt": image.alt,
     "crop": image.crop, "hotspot": image.hotspot
   }`,
);

if (!cars.length) {
  console.error("No cars found. Check the project/dataset.");
  process.exit(1);
}

const pending = cars.filter((car) => !car.gallery?.length && car.asset);
const skipped = cars.filter((car) => car.gallery?.length);
const broken = cars.filter((car) => !car.asset);

console.log(`Cars: ${cars.length}`);
console.log(`  need gallery : ${pending.length}`);
console.log(`  already set  : ${skipped.length}`);
console.log(`  no main photo: ${broken.length}`);
for (const car of broken) console.log(`    ! ${car._id} (${car.name}) has no image asset`);
console.log(`\nCopies per car: ${copies}`);

if (!pending.length) {
  console.log("\nNothing to do.");
  process.exit(0);
}

if (!write) {
  console.log("\nDry run. Pass --write to apply.");
  for (const car of pending) {
    console.log(`  would set ${copies} gallery photos on "${car.name}" (${car._id})`);
  }
  process.exit(0);
}

if (!writeClient) {
  console.error("\nNo write token. Run `npx sanity login` or set SANITY_API_TOKEN.");
  process.exit(1);
}

let patched = 0;
for (const car of pending) {
  const gallery = Array.from({ length: copies }, (_, i) => ({
    _key: `seed-${i + 1}`,
    _type: "image",
    asset: { _type: "reference", _ref: car.asset },
    alt: car.alt || car.name,
    ...(car.crop ? { crop: car.crop } : {}),
    ...(car.hotspot ? { hotspot: car.hotspot } : {}),
  }));

  await writeClient.patch(car._id).set({ gallery }).commit();
  patched += 1;
  console.log(`  ✓ ${car.name}`);
}

console.log(`\nDone. ${patched} car(s) updated.`);
console.log("Replace these duplicates with real photos in the Studio when ready.");
