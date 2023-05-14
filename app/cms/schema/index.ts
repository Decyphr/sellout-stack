import { SchemaType } from "@cms/types";

const schema: SchemaType = [
  {
    title: "Pages",
    handle: "pages",
    description: "A collection of pages",
    fields: [
      {
        title: "Title",
        handle: "title",
        type: "text",
        isRequired: true,
      },
      {
        title: "Slug",
        handle: "slug",
        type: "text",
        isRequired: true,
      },
      {
        title: "Content",
        handle: "content",
        type: "richtext",
        description: "The main content of the page",
        isRequired: true,
      },
      {
        title: "SEO",
        handle: "seo",
        type: "text",
      },
      {
        title: "Open Graph",
        handle: "openGraph",
        type: "text",
      },
    ],
  },
  {
    title: "Posts",
    handle: "posts",
    description: "A collection of posts",
    fields: [
      {
        title: "Title",
        handle: "title",
        type: "text",
        isRequired: true,
      },
      {
        title: "Slug",
        handle: "slug",
        type: "text",
        isRequired: true,
      },
      {
        title: "Content",
        handle: "content",
        type: "richtext",
        description: "The main content of the post",
        isRequired: true,
      },
      {
        title: "SEO",
        handle: "seo",
        type: "text",
      },
      {
        title: "Open Graph",
        handle: "openGraph",
        type: "text",
      },
    ],
  },
];

export default schema;
