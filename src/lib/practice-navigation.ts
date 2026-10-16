import type { Locale } from './i18n';

export type PracticeTarget = { exerciseId: string; version: number };

// Accept only this bounded navigation contract; never arbitrary return params.
export function practiceTarget(
  params: URLSearchParams,
  lessonId: string,
): PracticeTarget | null {
  if (
    params.size !== 2 ||
    params.getAll('exercise').length !== 1 ||
    params.getAll('version').length !== 1
  )
    return null;
  const exerciseId = params.get('exercise') ?? '';
  const version = params.get('version') ?? '';
  if (
    !/^L\d{2}-E\d{2}$/.test(exerciseId) ||
    exerciseId.slice(0, 3) !== lessonId ||
    !/^[1-9]\d{0,8}$/.test(version)
  )
    return null;
  return { exerciseId, version: Number(version) };
}

export function practiceHref(
  locale: Locale,
  lessonId: string,
  target?: PracticeTarget | null,
): string {
  const path = `/${locale}/lessons/${lessonId}/practice/`;
  return target
    ? `${path}?${new URLSearchParams({ exercise: target.exerciseId, version: String(target.version) })}`
    : path;
}
