// Safe public release metadata, with no answers. Mathematical and bilingual
// author self-checks and existing exceptions are selected by the registry.
import releases from '../../content/releases.json' with { type: 'json' };

export const PILOT_LESSON = 'L05';
export const lessonReleases: Readonly<
  Record<
    string,
    {
      version: number;
      review: string;
      practice?: boolean;
      translation: { review: string };
    }
  >
> = releases.lessons;
export const RELEASED_LESSONS: readonly string[] = Object.keys(
  lessonReleases,
).filter((id) => lessonReleases[id]?.practice !== false);
export const isReviewed = (lessonId: string) =>
  lessonReleases[lessonId]?.review === 'self-checked' &&
  lessonReleases[lessonId]?.translation.review === 'self-checked';
