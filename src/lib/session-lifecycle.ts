// One request owner for the header, private server-rendered pages and React islands.
// Notifications carry verified identity only; browser hints never authorize access.
export type SessionState =
  | { status: 'authenticated'; learner: string }
  | { status: 'anonymous' }
  | { status: 'unavailable' };

const listeners = new Set<(state: SessionState) => void>();
let pending: Promise<void> | undefined;
let started = false;

export function clearPracticeDrafts() {
  try {
    for (const key of Object.keys(sessionStorage))
      if (key.startsWith('um-practice:')) sessionStorage.removeItem(key);
  } catch {
    // Private in-memory state is cleared independently of storage availability.
  }
}

export function subscribeSession(listener: (state: SessionState) => void) {
  // Subscribers already load verified server state; replaying an older check
  // could incorrectly invalidate a freshly loaded account.
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function revalidateSession() {
  if (pending) return pending;
  pending = (async () => {
    let state: SessionState = { status: 'unavailable' };
    try {
      const response = await fetch('/api/auth/session/', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      if (response.status === 401) state = { status: 'anonymous' };
      else if (response.status === 200) {
        const data = (await response.json()) as { user?: { id?: unknown } };
        if (typeof data.user?.id === 'string')
          state = { status: 'authenticated', learner: data.user.id };
      }
    } catch {
      /* Transport failures are not evidence of logout. */
    }
    if (state.status === 'anonymous') clearPracticeDrafts();
    for (const listener of listeners) listener(state);
  })().finally(() => {
    pending = undefined;
  });
  return pending;
}

export function startSessionLifecycle() {
  if (started) return;
  started = true;
  const privatePage = () =>
    document.querySelector<HTMLElement>('[data-session-private]');
  const locale = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const unavailable =
    locale === 'en'
      ? 'Your session could not be checked. Please try again.'
      : 'Votre session n’a pas pu être vérifiée. Réessayez.';
  const notice = document.createElement('p');
  notice.setAttribute('role', 'status');
  notice.hidden = true;
  notice.textContent = unavailable;
  document.querySelector('.page')?.prepend(notice);
  let knownLearner = privatePage()?.dataset.sessionPrivate;
  let returned = false;
  let refresh: Promise<void> | undefined;
  let generation = 0;
  const refreshPrivate = () => {
    if (refresh) return refresh;
    const root = privatePage();
    if (!root) return Promise.resolve();
    const learner = root.dataset.sessionPrivate;
    const version = generation;
    refresh = (async () => {
      try {
        const response = await fetch(location.href, {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: AbortSignal.timeout(10000),
        });
        if (version !== generation) return;
        if (response.redirected) {
          root.replaceChildren();
          clearPracticeDrafts();
          location.reload();
          return;
        }
        if (!response.ok) {
          notice.hidden = false;
          return;
        }
        const html = new DOMParser().parseFromString(
          await response.text(),
          'text/html',
        );
        if (version !== generation) return;
        const next = html.querySelector<HTMLElement>('[data-session-private]');
        // Never install HTML for an identity different from the verified page owner.
        if (!next || next.dataset.sessionPrivate !== learner) {
          root.replaceChildren();
          clearPracticeDrafts();
          location.reload();
          return;
        }
        root.replaceWith(next);
        notice.hidden = true;
      } catch {
        notice.hidden = false;
      }
    })().finally(() => {
      refresh = undefined;
    });
    return refresh;
  };
  subscribeSession((state) => {
    notice.hidden = state.status !== 'unavailable';
    if (state.status === 'unavailable') {
      returned = false;
      return;
    }
    if (state.status === 'authenticated') {
      if (knownLearner && knownLearner !== state.learner) clearPracticeDrafts();
      knownLearner = state.learner;
    } else knownLearner = undefined;
    const menu = document.querySelector<HTMLElement>('[data-profile-menu]');
    const signIn = document.querySelector<HTMLElement>('.header-sign-in');
    const authenticated = state.status === 'authenticated';
    document.documentElement.classList.toggle(
      'has-session-hint',
      authenticated,
    );
    if (menu) menu.hidden = !authenticated;
    if (signIn) signIn.hidden = authenticated;
    const root = privatePage();
    if (
      root &&
      (!authenticated || root.dataset.sessionPrivate !== state.learner)
    ) {
      generation++;
      root.replaceChildren();
      clearPracticeDrafts();
      // Re-render through the existing protected route after removing old private HTML.
      location.reload();
    } else if (root && returned && root.dataset.sessionView === 'progress') {
      void refreshPrivate();
    }
    returned = false;
  });
  let scheduled: ReturnType<typeof setTimeout> | undefined;
  const checkOnReturn = () => {
    if (document.visibilityState !== 'visible') return;
    // Coalesce focus + visibilitychange + pageshow into one shared check.
    if (scheduled) clearTimeout(scheduled);
    scheduled = setTimeout(() => {
      scheduled = undefined;
      if (document.visibilityState !== 'visible') return;
      returned = true;
      void revalidateSession();
    }, 50);
  };
  window.addEventListener('focus', checkOnReturn);
  document.addEventListener('visibilitychange', checkOnReturn);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) checkOnReturn();
  });
  // Public anonymous reading stays free of account requests on initial navigation.
  if (
    privatePage() ||
    /(?:^|; )um-session=1/.test(document.cookie) ||
    document.querySelector('.practice-page')
  )
    void revalidateSession();
}
