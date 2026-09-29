import { defineField, defineType } from "sanity";

export const carType = defineType({
  name: "car",
  title: "Car",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: 'e.g. "Rolls-Royce Cullinan"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: 'Click "Generate" to create it from the name',
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      description: 'The small gold label above the name, e.g. "Rolls-Royce"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Also used as the badge on the photo",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceOnRequest",
      title: "Price on request",
      description: 'Turn on to show "Rates on request" instead of a price',
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "pricePerDay",
      title: "Price per day (AED)",
      description: "Numbers only, e.g. 3999. The site adds the commas.",
      type: "number",
      hidden: ({ document }) => Boolean(document?.priceOnRequest),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.priceOnRequest) return true;
          if (value === undefined || value === null) {
            return 'Add a price, or turn on "Price on request"';
          }
          if (value <= 0) return "Price must be more than 0";
          return true;
        }),
    }),
    defineField({
      name: "seats",
      title: "Seats",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1).max(12),
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
      options: {
        list: ["Automatic", "Manual"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "Automatic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dailyKmLimit",
      title: "Daily km limit",
      description: "Optional. Numbers only, e.g. 250",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      description: "Click the crop icon and set the focus point on the car",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Photo description",
          description: 'e.g. "Black Rolls-Royce Cullinan parked outdoors"',
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    // Extra photos for the gallery (main image + thumbnails). Optional — the
    // page falls back to the main photo when this is empty.
    defineField({
      name: "gallery",
      title: "Gallery photos",
      description: "More photos for the vehicle detail page (main image + thumbnails). Optional.",
      type: "array",
      of: [
        defineField({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Photo description",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "year",
      title: "Model year",
      description: 'Shown before the car name, e.g. 2025. Optional.',
      type: "number",
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      description: "A short paragraph under the gallery on the detail page.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "topSpeed",
      title: "Top speed",
      description: 'e.g. "250 km/h". Optional.',
      type: "string",
    }),
    defineField({
      name: "engine",
      title: "Engine",
      description: 'e.g. "6.75L V12". Optional.',
      type: "string",
    }),
    defineField({
      name: "fuel",
      title: "Fuel type",
      description: 'e.g. "Petrol". Optional.',
      type: "string",
    }),
    defineField({
      name: "driveType",
      title: "Drive type",
      description: 'e.g. "4WD". Optional.',
      type: "string",
    }),
    defineField({
      name: "includes",
      title: "Rental includes",
      description: "Check-list under 'Rental Includes' on the detail page. Leave empty for the defaults.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers show first",
      type: "number",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "brand", media: "image" },
  },
});