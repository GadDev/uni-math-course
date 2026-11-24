import { progressCopy } from './progress-copy';
import { lessonReleases } from './released-lessons';
import { practiceHref } from './practice-navigation';
import { revalidateSession, subscribeSession } from './session-lifecycle';
import type { StudyResume } from './study-progress';

export function initStudyResume() {
  const root = document.querySelector<HTMLElement>('[data-study-resume]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const locale = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const text = progressCopy[locale];
  const status = root.querySelector<HTMLElement>('[data-study-resume-status]')!;
  const link = root.querySelector<HTMLAnchorElement>(
    '[data-study-resume-link]',
  )!;
  const retry = root.querySelector<HTMLButtonElement>(
    '[data-study-resume-retry]',
  )!;
  let revision = 0;
  const clear = () => {
    link.hidden = true;
    link.removeAttribute('href');
    link.textContent = '';
    retry.hidden = true;
  };
  retry.addEventListener('click', () => void revalidateSession());
  subscribeSession(async (state) => {
    const version = ++revision;
    clear();
    root.hidden = state.status === 'anonymous';
    if (state.status === 'anonymous') return;
    status.textContent =
      state.status === 'unavailable' ? text.unavailable : text.loading;
    retry.hidden = state.status !== 'unavailable';
    if (state.status !== 'authenticated') return;
    try {
      const response = await fetch('/api/study-resume/', {
        credentials: 'same-origin',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (version !== revision) return;
      if (!response.ok || data.learnerId !== state.learner)
        throw new Error('unavailable');
      if (data.resume === null) {
        status.textContent = text.noSavedActivity;
        return;
      }
      const resume = data.resume as StudyResume;
      if (
        !Object.hasOwn(lessonReleases, resume.lessonId) ||
        !Number.isFinite(Date.parse(resume.at)) ||
        !['reading', 'practice'].includes(resume.kind) ||
        (resume.kind === 'practice' &&
          (!/^L\d{2}-E\d{2}$/.test(resume.exerciseId ?? '') ||
            resume.exerciseId?.slice(0, 3) !== resume.lessonId ||
            !Number.isSafeInteger(resume.version) ||
            (resume.version ?? 0) < 1))
      )
        throw new Error('invalid resume');
      status.textContent = text.resumeHint;
      link.href =
        resume.kind === 'reading'
          ? `/${locale}/lessons/${resume.lessonId}/`
          : practiceHref(locale, resume.lessonId, {
              exerciseId: resume.exerciseId!,
              version: resume.version!,
            });
      link.textContent = `${resume.kind === 'reading' ? text.readingCompleted : text.attempted} · ${resume.lessonId} →`;
      link.hidden = false;
    } catch {
      if (version !== revision) return;
      clear();
      status.textContent = text.unavailable;
      retry.hidden = false;
    }
  });
  // The shared lifecycle verifies the cookie hint before any private request.
  if (/(?:^|; )um-session=1/.test(document.cookie)) void revalidateSession();
}
