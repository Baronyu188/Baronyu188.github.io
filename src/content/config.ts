import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    summary: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const sections = defineCollection({
  type: 'data',
  schema: z.any()
});

export const collections = {
  blog,
  sections
};
