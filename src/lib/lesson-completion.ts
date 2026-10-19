import { completionCopy } from './completion-copy';
import { revalidateSession, subscribeSession } from './session-lifecycle';

/** Static reading contains no private state. Only verified sessions load it. */
export function initCompletion() {
  const root = document.querySelector<HTMLElement>('[data-completion]');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const text =
    completionCopy[document.documentElement.lang === 'en' ? 'en' : 'fr'];
  const status = root.querySelector<HTMLElement>('[data-completion-status]')!;
  const toggle = root.querySelector<HTMLButtonElement>(
    '[data-completion-toggle]',
  );
  const retry = root.querySelector<HTMLButtonElement>(
    '[data-completion-retry]',
  )!;
  const signIn = root.querySelector<HTMLElement>('[data-completion-sign-in]')!;
  const lessonId = root.dataset.lesson;
  const lessonIds = JSON.parse(root.dataset.lessons ?? '[]') as string[];
  let learner: string | undefined;
  let completed = new Set<string>();
  let revision = 0;
  let ready = false;
  let saving = false;
  const badges = () =>
    document.querySelectorAll<HTMLElement>('[data-completion-badge]');
  const clear = () => {
    ready = false;
    completed.clear();
    for (const badge of badges()) badge.hidden = true;
    if (toggle) toggle.hidden = true;
    retry.hidden = true;
    status.hidden = true;
  };
  const render = () => {
    ready = true;
    status.hidden = false;
    const count = lessonIds.filter((id) => completed.has(id)).length;
    status.textContent =
      (lessonId
        ? `${completed.has(lessonId) ? '✓ ' + text.completed : text.incomplete} · `
        : '') + text.count(count, lessonIds.length);
    if (toggle) {
      toggle.hidden = false;
      toggle.disabled = false;
      toggle.textContent = completed.has(lessonId!) ? text.undo : text.mark;
    }
    for (const badge of badges())
      badge.hidden = !completed.has(badge.dataset.completionBadge!);
    retry.hidden = true;
    signIn.hidden = true;
  };
  const fail = () => {
    ready = false;
    if (toggle) toggle.disabled = true;
    status.hidden = false;
    status.textContent = text.error;
    retry.hidden = false;
  };
  const load = async () => {
    if (!learner) return;
    const owner = learner;
    const version = ++revision;
    ready = false;
    if (toggle) toggle.disabled = true;
    signIn.hidden = true;
    retry.hidden = true;
    status.hidden = false;
    status.textContent = text.loading;
    try {
      const response = await fetch('/api/lesson-completions/', {
        credentials: 'same-origin',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (version !== revision) return;
      if (
        !response.ok ||
        data.learnerId !== owner ||
        !Array.isArray(data.completedLessonIds) ||
        data.completedLessonIds.some((id: unknown) => typeof id !== 'string')
      ) {
        if (
          response.status === 401 ||
          (data.learnerId && data.learnerId !== owner)
        ) {
          clear();
          void revalidateSession();
        } else fail();
        return;
      }
      completed = new Set(data.completedLessonIds);
      render();
    } catch {
      if (version === revision) fail();
    }
  };
  toggle?.addEventListener('click', async () => {
    if (!ready || !learner || !lessonId || saving) return;
    const owner = learner;
    const desired = !completed.has(lessonId);
    const version = ++revision;
    saving = true;
    ready = false;
    toggle.disabled = true;
    status.textContent = text.saving;
    try {
      const response = await fetch('/api/lesson-completions/', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedLearnerId: owner,
          lessonId,
          completed: desired,
        }),
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (version !== revision) return;
      if (
        !response.ok ||
        data.learnerId !== owner ||
        data.lessonId !== lessonId ||
        data.completed !== desired
      ) {
        if (response.status === 401 || response.status === 409) {
          clear();
          void revalidateSession();
        } else fail();
        return;
      }
      if (desired) completed.add(lessonId);
      else completed.delete(lessonId);
      render();
    } catch {
      if (version === revision) fail();
    } finally {
      saving = false;
    }
  });
  retry.addEventListener('click', () => void revalidateSession());
  subscribeSession((state) => {
    if (state.status === 'unavailable') {
      ++revision;
      fail();
      return;
    }
    if (state.status === 'anonymous') {
      ++revision;
      learner = undefined;
      clear();
      signIn.hidden = false;
      return;
    }
    if (learner !== state.learner) {
      ++revision;
      clear();
      learner = state.learner;
      saving = false;
    } else if (saving) return;
    void load();
  });
  // Reuses the header's shared in-flight lookup; anonymous reading does none.
  if (/(?:^|; )um-session=1/.test(document.cookie)) void revalidateSession();
}
