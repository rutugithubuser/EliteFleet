import { defineArrayMember, defineField, defineType } from "sanity";

// Simple text pages linked from the footer: Privacy Policy, Terms & Conditions, FAQ...
// Each published page appears in the footer automatically.
export const legalPageType = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: 'Shown in the footer and at the top of the page, e.g. "Privacy Policy"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      description: 'Click "Generate". The page will live at /legal/<this>',
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
    }),
    defineField({
      name: "body",
      title: "Page text",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Sub-heading", value: "h3" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Footer order",
      description: "Lower numbers show first in the footer",
      type: "number",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [
    { title: "Footer order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/legal/${subtitle}` : "" }),
  },
});
