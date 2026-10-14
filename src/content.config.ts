import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/lessons' }),
  schema: z.object({
    lessonId: z.string().regex(/^L\d{2}$/),
    locale: z.enum(['fr', 'en']),
    version: z.number().int().positive(),
    status: z.literal('pilot'),
    title: z.string(),
    summary: z.string(),
    minutes: z.number().positive(),
    objectives: z.array(z.string()),
    prerequisites: z.array(z.string()),
    sourcePages: z.array(z.number().int().positive()),
  }),
});
export const collections = { lessons };
