const schema: ContentType[] = [
  {
    title: "Pages",
    handle: "pages",
    description: "A collection of web pages",
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
        title: "Featured Image",
        handle: "featuredImage",
        type: "media",
        isRequired: true,
      },
      {
        title: "Body",
        handle: "body",
        type: "richtext",
        isRequired: true,
      },
    ],
  },
];

export default schema;
