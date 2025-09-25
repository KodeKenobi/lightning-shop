import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "shopifyId",
      title: "Shopify ID",
      type: "string",
      description: "The original Shopify product ID",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Product Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "handle",
      title: "Product Handle",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "Brief description for product cards",
    }),
    defineField({
      name: "price",
      title: "Price (in cents)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price (in cents)",
      type: "number",
      description: "Original price before discount",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
      options: {
        list: [
          { title: "USD", value: "USD" },
          { title: "EUR", value: "EUR" },
          { title: "GBP", value: "GBP" },
          { title: "CAD", value: "CAD" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "url",
              title: "Image URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "altText",
              title: "Alt Text",
              type: "string",
            },
            {
              name: "isPrimary",
              title: "Primary Image",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "altText",
              subtitle: "url",
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "shopifyVariantId",
              title: "Shopify Variant ID",
              type: "string",
            },
            {
              name: "title",
              title: "Variant Title",
              type: "string",
            },
            {
              name: "price",
              title: "Price (in cents)",
              type: "number",
            },
            {
              name: "compareAtPrice",
              title: "Compare At Price (in cents)",
              type: "number",
            },
            {
              name: "sku",
              title: "SKU",
              type: "string",
            },
            {
              name: "quantity",
              title: "Quantity Available",
              type: "number",
            },
            {
              name: "availableForSale",
              title: "Available for Sale",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Electronics", value: "electronics" },
          { title: "Clothing", value: "clothing" },
          { title: "Home & Garden", value: "home-garden" },
          { title: "Sports", value: "sports" },
          { title: "Books", value: "books" },
          { title: "Beauty", value: "beauty" },
          { title: "Toys", value: "toys" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
      description: "Show this product in featured sections",
    }),
    defineField({
      name: "availableForSale",
      title: "Available for Sale",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Custom title for search engines",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Custom description for search engines",
    }),
    defineField({
      name: "lastSynced",
      title: "Last Synced from Shopify",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "price",
      media: "images.0.url",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title,
        subtitle: `$${(subtitle / 100).toFixed(2)}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Price Low-High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price High-Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Last Synced",
      name: "lastSyncedDesc",
      by: [{ field: "lastSynced", direction: "desc" }],
    },
  ],
});
