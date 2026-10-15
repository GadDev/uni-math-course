import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { existsSync } from 'node:fs';
import { safeOrigin } from './src/lib/auth/policy.ts';

if (existsSync('.env')) process.loadEnvFile('.env');
const site = safeOrigin(process.env.AUTH_SITE_URL ?? '');
const testBuild = process.env.ASTRO_TEST_BUILD === '1';

export default defineConfig({
  integrations: [react()],
  // The local production test server uses Node; deployed builds use Vercel.
  adapter: testBuild ? node({ mode: 'standalone' }) : vercel(),
  outDir: testBuild ? './.test-build/' : './dist/',
  i18n: {
    defaultLocale: 'fr',
    locales: ['en', 'fr'],
    routing: {
      redirectToDefaultLocale: true
    },
  },
  security: {
    allowedDomains: testBuild
      ? [
          { protocol: 'http', hostname: '127.0.0.1', port: '4321' },
          { protocol: 'http', hostname: '127.0.0.1', port: '4323' },
        ]
      : site
        ? [
            {
              protocol: site.protocol.slice(0, -1),
              hostname: site.hostname,
              ...(site.port ? { port: site.port } : {}),
            },
          ]
        : [],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { output: 'htmlAndMathml', throwOnError: true }],
      ],
    }),
  },
});
