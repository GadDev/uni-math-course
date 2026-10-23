import type { Route } from '@playwright/test';
import type { PublicExercise } from '../../src/lib/exercises/grading.ts';

type Wire = [number, unknown];
const revive = ([tag, value]: Wire): unknown => {
  if (tag === 1) return (value as Wire[]).map(revive);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, revive(item as Wire)]),
    );
  return value;
};
const serialize = (value: unknown): Wire => {
  if (Array.isArray(value)) return [1, value.map(serialize)];
  if (value && typeof value === 'object')
    return [
      0,
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, serialize(item)]),
      ),
    ];
  return [0, value];
};

/** Alter only answer-free initial props to simulate a stale/differently ordered document. */
export async function rewritePracticePayload(
  route: Route,
  change: (data: { learner: string; exercises: PublicExercise[] }) => void,
) {
  const response = await route.fetch();
  const html = await response.text();
  let changed = false;
  const body = html.replace(
    /(<astro-island\b[^>]*\bprops=")([^"]*)(")/g,
    (all, prefix, encoded, suffix) => {
      const decoded = encoded
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      const props = JSON.parse(decoded);
      if (!props.initialData) return all;
      const data = revive(props.initialData) as Parameters<typeof change>[0];
      change(data);
      props.initialData = serialize(data);
      changed = true;
      const escaped = JSON.stringify(props)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return prefix + escaped + suffix;
    },
  );
  if (!changed) throw new Error('Missing initial practice payload');
  await route.fulfill({ response, body });
}
