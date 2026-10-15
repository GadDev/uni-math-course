// Lessons whose exercise bank is served to signed-in learners. Holds no answers,
// so prerendered pages may import it. L05 is the reviewed pilot; L01–L04 and
// L06–L20 are released at the maintainer's request before a human mathematical
// and translation review, and their pages say so.
import releases from '../../content/releases.json';

export const PILOT_LESSON = 'L05';
export const lessonReleases: Readonly<
  Record<string, { version: number; review: string }>
> = releases.lessons;
export const RELEASED_LESSONS: readonly string[] = Object.keys(lessonReleases);
export const isReviewed = (lessonId: string) =>
  lessonReleases[lessonId]?.review === 'self-checked';
