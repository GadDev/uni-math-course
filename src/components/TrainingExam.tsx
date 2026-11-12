import { useEffect, useRef, useState } from 'react';
import Tex from './Tex';
import ExamGraph from './ExamGraph';
import { revalidateSession, subscribeSession } from '../lib/session-lifecycle';
import { examCopy } from '../lib/training-exams/copy';
import { parseExamResponses } from '../lib/training-exams/responses';
import type {
  ExamResponses,
  ExamResult,
  PublicExam,
  PublicQuestion,
} from '../lib/training-exams/types';

function complete(q: PublicQuestion, responses: ExamResponses) {
  const value = responses[q.id];
  return q.type === 'numeric'
    ? q.fields.every(
        (f) => !!(value as Record<string, string> | undefined)?.[f.id]?.trim(),
      )
    : Array.isArray(value) && value.length > 0;
}

export default function TrainingExam({
  exam,
  learner,
  locale,
}: {
  exam: PublicExam;
  learner: string;
  locale: 'fr' | 'en';
}) {
  const t = examCopy[locale];
  const key = `um-practice:exam:${exam.id}:v${exam.version}`;
  const [responses, setResponses] = useState<ExamResponses>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [timer, setTimer] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [repeated, setRepeated] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const saveAllowed = useRef(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(key) ?? 'null');
      if (
        stored?.learner === learner &&
        stored.version === exam.version &&
        Number.isFinite(stored.startedAt) &&
        stored.startedAt > 0 &&
        stored.startedAt <= Date.now()
      ) {
        const restored = parseExamResponses(exam, stored.responses);
        if (restored) {
          setResponses(restored);
          setStartedAt(stored.startedAt);
        }
      } else if (stored) {
        sessionStorage.removeItem(key);
      }
    } catch {
      setStorageUnavailable(true);
    }
    setHydrated(true);
    return () => {
      generation.current++;
      request.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !startedAt || result || invalid || !saveAllowed.current)
      return;
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          learner,
          version: exam.version,
          startedAt,
          responses,
        }),
      );
    } catch {
      setStorageUnavailable(true);
    }
  }, [hydrated, startedAt, responses, result, invalid]);

  useEffect(
    () =>
      subscribeSession((state) => {
        if (state.status === 'unavailable') {
          setUnavailable(true);
          return;
        }
        setUnavailable(false);
        if (state.status === 'anonymous' || state.learner !== learner) {
          saveAllowed.current = false;
          generation.current++;
          request.current?.abort();
          setInvalid(true);
          setResponses({});
          setResult(null);
          setStartedAt(null);
          setBusy(false);
          try {
            sessionStorage.removeItem(key);
          } catch {
            /* In-memory data is already cleared. */
          }
        }
      }),
    [learner, key],
  );

  useEffect(() => {
    if (!startedAt || result || !timer) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startedAt, result, timer]);

  useEffect(() => {
    if (confirm || result) heading.current?.focus();
  }, [confirm, result]);

  const count = exam.questions.filter((q) => complete(q, responses)).length;
  const elapsed = Math.max(0, Math.floor((now - (startedAt ?? now)) / 1000));
  const signIn = `/${locale}/sign-in/?${new URLSearchParams({ next: `/${locale}/training-exams/${exam.chapterId}/` })}`;
  const update = (id: string, value: ExamResponses[string]) => {
    setConfirm(false);
    setError('');
    setResponses((old) => ({ ...old, [id]: value }));
  };

  async function submit() {
    if (busy || invalid || unavailable) return;
    const version = generation.current;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/training-exams/${exam.chapterId}/`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          version: exam.version,
          expectedLearnerId: learner,
          responses,
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(15000),
        ]),
      });
      if (generation.current !== version) return;
      const data = await response.json();
      if (response.status === 401 || data.error === 'learner_context_changed') {
        saveAllowed.current = false;
        setInvalid(true);
        setResponses({});
        setStartedAt(null);
        try {
          sessionStorage.removeItem(key);
        } catch {
          /* Storage may be unavailable. */
        }
        return;
      }
      if (
        !response.ok ||
        data.examId !== exam.id ||
        data.version !== exam.version
      )
        throw new Error('marking_failed');
      setResult(data as ExamResult);
      setConfirm(false);
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* Scores are never stored locally. */
      }
    } catch {
      if (generation.current === version) setError(t.error);
    } finally {
      if (generation.current === version) setBusy(false);
    }
  }

  if (invalid)
    return (
      <div role="alert">
        <p>{t.session}</p>
        <a className="primary-link" href={signIn}>
          {t.login}
        </a>
      </div>
    );

  return (
    <div className="training-exam" data-exam={exam.id}>
      <p>{t.independent}</p>
      {storageUnavailable && <p role="status">{t.storageUnavailable}</p>}
      {unavailable && (
        <div className="exam-error" role="alert">
          <p>{t.unavailable}</p>
          <button type="button" onClick={() => void revalidateSession()}>
            {t.retrySession}
          </button>
        </div>
      )}
      {!startedAt ? (
        <section className="exam-preparation">
          <h2>{t.preparation}</h2>
          <p>{t.format}</p>
          <p>{t.rules}</p>
          <p>{t.marking}</p>
          <p>{t.privacy}</p>
          <p className="status">{t.review}</p>
          {repeated && <p>{t.repeat}</p>}
          <button
            type="button"
            className="primary-link"
            disabled={!hydrated || unavailable}
            onClick={() => {
              const time = Date.now();
              setNow(time);
              setStartedAt(time);
            }}
          >
            {t.start}
          </button>
        </section>
      ) : (
        <>
          {!result && (
            <div className="exam-toolbar">
              <p aria-live="polite">
                {count} / {exam.questions.length} {t.completed}
              </p>
              {timer && (
                <p>
                  {t.elapsed}{' '}
                  <span role="timer" aria-live="off">
                    {Math.floor(elapsed / 60)}:
                    {String(elapsed % 60).padStart(2, '0')}
                  </span>
                </p>
              )}
              <button type="button" onClick={() => setTimer((value) => !value)}>
                {timer ? t.hideTimer : t.showTimer}
              </button>
            </div>
          )}
          {result && (
            <section
              className="exam-results"
              aria-labelledby="exam-result-title"
            >
              <p className="eyebrow">{t.score}</p>
              <h2 id="exam-result-title" tabIndex={-1} ref={heading}>
                {result.score} / {result.total}
              </h2>
              <h3>{t.reviewPlan}</h3>
              {result.score === result.total ? (
                <p>{t.mastered}</p>
              ) : (
                <ul>
                  {[
                    ...new Set(
                      exam.questions
                        .filter(
                          (q) =>
                            !result.questions.find((r) => r.id === q.id)
                              ?.correct,
                        )
                        .map((q) => q.lessonId),
                    ),
                  ].map((lesson) => (
                    <li key={lesson}>
                      <a href={`/${locale}/lessons/${lesson}/`}>
                        {t.revise} {lesson}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <p>{t.review}</p>
            </section>
          )}
          <nav
            className="exam-question-nav"
            aria-label={
              locale === 'fr'
                ? 'Naviguer entre les questions'
                : 'Navigate questions'
            }
          >
            {exam.questions.map((q, i) => (
              <a
                key={q.id}
                href={`#${q.id}`}
                aria-label={`${t.question} ${i + 1}`}
                data-complete={complete(q, responses)}
              >
                {String(i + 1).padStart(2, '0')}
                {complete(q, responses) && <span aria-hidden="true"> ✓</span>}
              </a>
            ))}
          </nav>
          <p>{t.marking}</p>
          <p id="numeric-help">{t.numericHelp}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setConfirm(true);
            }}
          >
            {exam.questions.map((q, i) => {
              const marked = result?.questions.find((r) => r.id === q.id);
              const value = responses[q.id];
              return (
                <section
                  key={q.id}
                  id={q.id}
                  className="exam-question"
                  data-question={q.id}
                >
                  <h2>
                    {String(i + 1).padStart(2, '0')} <span>{t.question}</span>
                  </h2>
                  <p id={`${q.id}-prompt`}>
                    <Tex text={q.prompt[locale]} />
                  </p>
                  {q.graph && <ExamGraph kind={q.graph} locale={locale} />}
                  <fieldset
                    disabled={busy || !!result || unavailable}
                    aria-describedby={`${q.id}-prompt${q.type === 'numeric' ? ' numeric-help' : ''}`}
                  >
                    <legend>
                      {q.type === 'single'
                        ? t.single
                        : q.type === 'multi'
                          ? t.multi
                          : t.numeric}
                    </legend>
                    {q.type === 'numeric' ? (
                      <div className="exam-fields">
                        {q.fields.map((field) => (
                          <label key={field.id}>
                            <span>
                              <Tex text={field.label[locale]} />
                            </span>
                            <input
                              type="text"
                              autoComplete="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              maxLength={64}
                              name={`${q.id}-${field.id}`}
                              value={
                                (value as Record<string, string> | undefined)?.[
                                  field.id
                                ] ?? ''
                              }
                              onChange={(event) =>
                                update(q.id, {
                                  ...((value ?? {}) as Record<string, string>),
                                  [field.id]: event.target.value,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="exam-options">
                        {q.options.map((option) => (
                          <label key={option.id}>
                            <input
                              type={q.type === 'single' ? 'radio' : 'checkbox'}
                              name={q.id}
                              value={option.id}
                              checked={
                                Array.isArray(value) &&
                                value.includes(option.id)
                              }
                              onChange={(event) =>
                                update(
                                  q.id,
                                  q.type === 'single'
                                    ? [option.id]
                                    : event.target.checked
                                      ? [
                                          ...((value ?? []) as string[]),
                                          option.id,
                                        ]
                                      : ((value ?? []) as string[]).filter(
                                          (id) => id !== option.id,
                                        ),
                                )
                              }
                            />
                            <span className="exam-option-letter">
                              {option.id.toUpperCase()}
                            </span>
                            <span>
                              <Tex text={option.label[locale]} />
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    {q.type !== 'numeric' && !result && (
                      <button type="button" onClick={() => update(q.id, [])}>
                        {t.clear}
                      </button>
                    )}
                  </fieldset>
                  {marked && (
                    <div
                      className="exam-solution"
                      data-correct={marked.correct}
                    >
                      <h3>
                        {marked.correct
                          ? `✓ ${t.correct}`
                          : marked.skipped
                            ? t.skipped
                            : t.incorrect}{' '}
                        · {marked.correct ? 1 : 0}/1
                      </h3>
                      {q.type === 'numeric' ? (
                        <ul>
                          {q.fields.map((f) => (
                            <li key={f.id}>
                              <Tex text={f.label[locale]} /> — {t.yours}:{' '}
                              {(value as Record<string, string> | undefined)?.[
                                f.id
                              ] || '∅'}{' '}
                              · {t.expected}:{' '}
                              {(marked.answer as Record<string, string>)[f.id]}{' '}
                              {marked.fields?.[f.id] ? '✓' : '✗'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul>
                          {q.options.map((o) => (
                            <li key={o.id}>
                              <strong>
                                {o.id.toUpperCase()} ·{' '}
                                {marked.feedback?.find((f) => f.id === o.id)
                                  ?.correct
                                  ? t.true
                                  : t.false}
                              </strong>{' '}
                              —{' '}
                              <Tex
                                text={
                                  marked.feedback?.find((f) => f.id === o.id)
                                    ?.text[locale] ?? ''
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      <p>
                        <Tex text={marked.explanation[locale]} />
                      </p>
                      <p>
                        <strong>{t.pitfall}.</strong>{' '}
                        <Tex text={marked.pitfall[locale]} />
                      </p>
                      <a href={`/${locale}/lessons/${q.lessonId}/`}>
                        {t.revise} {q.lessonId} →
                      </a>
                    </div>
                  )}
                </section>
              );
            })}
            {!result && (
              <div className="exam-finish">
                {!confirm ? (
                  <button
                    type="submit"
                    className="primary-link"
                    disabled={busy || unavailable}
                  >
                    {t.finish}
                  </button>
                ) : (
                  <section aria-labelledby="exam-confirm">
                    <h2 id="exam-confirm" tabIndex={-1} ref={heading}>
                      {t.finish}
                    </h2>
                    <p>
                      {count < exam.questions.length
                        ? `${exam.questions.length - count} ${t.unanswered}`
                        : t.ready}
                    </p>
                    <button
                      type="button"
                      className="primary-link"
                      disabled={busy || unavailable}
                      onClick={() => void submit()}
                    >
                      {busy ? t.submitting : t.submit}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirm(false)}
                    >
                      {t.back}
                    </button>
                  </section>
                )}
                {error && <p role="alert">{error}</p>}
              </div>
            )}
          </form>
          {result && (
            <button
              type="button"
              className="primary-link"
              onClick={() => {
                setResult(null);
                setResponses({});
                setStartedAt(null);
                setRepeated(true);
                setError('');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              {t.restart}
            </button>
          )}
        </>
      )}
    </div>
  );
}
