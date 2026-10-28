import type { AstroIntegration } from 'astro';
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only statically generated public reading pages may be cached.
export function isOfflineReadingPath(path: string): boolean {
  return /^\/(?:fr|en)\/(?:lessons\/L\d{2}\/|chapters\/C0[234]\/|glossary\/|numbers\/|exercises\/|offline\/)?$/.test(
    path,
  );
}

export function offlinePagePaths(paths: string[]): string[] {
  return [
    ...new Set(
      paths
        .map((path) => {
          const url = '/' + path.replace(/^\/+/, '');
          return url.endsWith('/') ? url : url + '/';
        })
        .filter(isOfflineReadingPath),
    ),
  ].sort();
}

async function listAssets(root: string, folder: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(directory: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
    for (const item of entries) {
      const path = join(directory, item.name);
      if (item.isDirectory()) await walk(path);
      else if (item.isFile())
        files.push('/' + relative(root, path).split(sep).join('/'));
    }
  }
  await walk(join(root, folder));
  return files;
}

export function offlinePwaManifest(): AstroIntegration {
  return {
    name: 'uni-math-offline-manifest',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        const root = fileURLToPath(dir);
        const publicPages = offlinePagePaths(
          pages.map((page) => page.pathname),
        );
        if (!publicPages.some((page) => page.includes('/lessons/L01/')))
          throw new Error('Offline index has no public lessons');
        const assets = (
          await Promise.all(
            ['_astro', 'diagrams', 'fonts', 'icons'].map((folder) =>
              listAssets(root, folder),
            ),
          )
        ).flat();
        const resources = [
          ...new Set([...assets, '/favicon.svg', '/manifest.webmanifest']),
        ].sort();
        await writeFile(
          join(root, 'offline-index.json'),
          JSON.stringify({
            pages: publicPages,
            assets: resources,
          }) + '\n',
        );
      },
    },
  };
}
