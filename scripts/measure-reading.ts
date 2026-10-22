// Cold-load CSS/JS transfer over local HTTP with real gzip responses.
// Build with `pnpm build`, then run `node scripts/measure-reading.ts`.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

const root = resolve('.vercel/output/static');
const fileOf = async (pathname: string) => {
  let path = resolve(root, '.' + decodeURIComponent(pathname));
  if (!path.startsWith(root + sep)) throw new Error('Outside static output');
  if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
  return path;
};
const types: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const server = createServer(async (request, response) => {
  try {
    const path = await fileOf(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    const body = await readFile(path);
    const gzip = /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
    response.writeHead(200, {
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      Vary: 'Accept-Encoding',
      ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
    });
    response.end(gzip ? gzipSync(body) : body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  });
  const origin = `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
  const pages = [];
  for (const locale of ['fr', 'en']) {
    for (const route of [`/${locale}/`, `/${locale}/lessons/L05/`]) {
      const context = await browser.newContext();
      try {
        const page = await context.newPage();
        await page.goto(origin + route, { waitUntil: 'networkidle' });
        const resources = await page.evaluate(() =>
          performance.getEntriesByType('resource').map((entry) => ({
            url: entry.name,
            encodedBodySize: (entry as PerformanceResourceTiming)
              .encodedBodySize,
            transferSize: (entry as PerformanceResourceTiming).transferSize,
          })),
        );
        const totals = {
          css: { requests: 0, rawBytes: 0, gzipBodyBytes: 0, transferBytes: 0 },
          js: { requests: 0, rawBytes: 0, gzipBodyBytes: 0, transferBytes: 0 },
        };
        for (const resource of resources) {
          const url = new URL(resource.url);
          const kind = url.pathname.endsWith('.css')
            ? 'css'
            : url.pathname.endsWith('.js')
              ? 'js'
              : null;
          if (!kind || url.origin !== origin) continue;
          const body = await readFile(await fileOf(url.pathname));
          if (resource.encodedBodySize !== gzipSync(body).length)
            throw new Error(
              `Expected a cold gzip transfer for ${url.pathname}`,
            );
          totals[kind].requests++;
          totals[kind].rawBytes += body.length;
          totals[kind].gzipBodyBytes += resource.encodedBodySize;
          totals[kind].transferBytes += resource.transferSize;
        }
        pages.push({ route, ...totals });
      } finally {
        await context.close();
      }
    }
  }
  console.log(
    JSON.stringify(
      {
        node: process.version,
        browser: browser.version(),
        compression: 'gzip (Node default level)',
        scope:
          'Cold CSS/JS requests; excludes HTML, inline scripts, fonts, TLS and CDN behavior',
        pages,
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
