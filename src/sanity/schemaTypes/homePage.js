import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroLabel",
      title: "Hero small label",
      description: 'The gold line above the headline, e.g. "Luxury & Premium Car Rental · Dubai, UAE"',
      type: "string",
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline (plain part)",
      description: 'Black text, e.g. "Drive Dubai."',
      type: "string",
    }),
    defineField({
      name: "heroHeadlineAccent",
      title: "Headline (gold part)",
      description: 'Gold italic text, e.g. "Your Way."',
      type: "string",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("Keep it under 160 characters so it fits the layout"),
    }),
    defineField({
      name: "heroSlides",
      title: "Hero slides",
      description: "The cars shown in the big hero image, in order",
      type: "array",
      of: [
        defineArrayMember({
          name: "heroSlide",
          title: "Hero slide",
          type: "object",
          fields: [
            defineField({
              name: "car",
              title: "Car",
              type: "reference",
              to: [{ type: "car" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "wideImage",
              title: "Wide photo (optional)",
              description:
                "Leave empty to use the car's own photo. Only add one if you want a different, wider shot here.",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Photo description",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "car.name", media: "wideImage", carImage: "car.image" },
            prepare: ({ title, media, carImage }) => ({ title, media: media ?? carImage }),
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: "featuredVehicles",
      title: "Featured vehicles",
      description: 'Cars in "The Signature Collection" slider, in order',
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "car" }] })],
      validation: (Rule) => Rule.unique().max(8),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});