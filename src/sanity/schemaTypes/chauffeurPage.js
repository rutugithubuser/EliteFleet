import { defineArrayMember, defineField, defineType } from "sanity";

// Content for the Chauffeur page (/chauffeur). Every field is optional:
// anything left empty falls back to the text and photos from the Figma design.
export const chauffeurPageType = defineType({
  name: "chauffeurPage",
  title: "Chauffeur page",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero photo",
      description:
        "The big photo at the top. Leave empty to use the Rolls-Royce Phantom photo. Set the focus point on the car.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Photo description", type: "string" }),
      ],
    }),
    defineField({
      name: "services",
      title: "Services",
      description:
        'The 4 services under "Driven, Your Way." Their names also fill the Service dropdown in the request form.',
      type: "array",
      of: [
        defineArrayMember({
          name: "service",
          title: "Service",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Name",
              description: 'e.g. "Airport Transfers"',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Short description",
              type: "text",
              rows: 2,
              validation: (Rule) =>
                Rule.max(90).warning("Keep it under 90 characters so the 4 columns stay even"),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Person (chauffeur)", value: "user" },
                  { title: "Plane (airport)", value: "plane" },
                  { title: "Briefcase (business)", value: "briefcase" },
                  { title: "Glass (events)", value: "event" },
                ],
                layout: "radio",
              },
              initialValue: "user",
            }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (Rule) => Rule.max(4).warning("The design fits 4 services"),
    }),
    defineField({
      name: "fleetImage",
      title: "Chauffeur-ready fleet photo",
      description:
        'The tall photo next to "Choose the car. We\'ll handle the drive." (desktop and tablet only)',
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Photo description", type: "string" }),
      ],
    }),
    defineField({
      name: "chauffeurCars",
      title: "Chauffeur-ready cars",
      description: "The cars listed with a driver, in this order. Seats come from each car.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "car" }] })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Chauffeur page" }),
  },
});
