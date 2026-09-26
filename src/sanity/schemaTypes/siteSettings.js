import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Phone number",
      description: 'As it should appear on the site, e.g. "+971 58 521 0105"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description: "Digits only, with country code, no + or spaces. e.g. 971585210105",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^\d{8,15}$/, { name: "digits only" }),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      description: 'e.g. "8:00 AM – 10:00 PM"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pickupLocations",
      title: "Pickup locations",
      description: "The list in the booking bar dropdown",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.min(1).unique(),
    }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube link", type: "url" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});