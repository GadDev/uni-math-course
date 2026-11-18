import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import type { Locale } from '../lib/i18n';
import {
  practiceCopy,
  topicCopy,
  workshopCopy,
} from '../lib/logic-workshop/copy';
import {
  lessonForTopic,
  levels,
  topics,
  type Grade,
  type Level,
  type PublicQuestion,
  type Topic,
} from '../lib/logic-workshop/types';

type Result = {
  question: PublicQuestion;
  firstTry: boolean;
  feedback: Extract<Grade, { state: 'correct' | 'revealed' }>;
};
type Answer = number | string | (number | null)[] | null;

async function request<T>(
  locale: Locale,
  seed: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch('/api/logic-workshop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locale, seed, ...body }),
  });
  if (!response.ok) throw new Error('Workshop request failed');
  return response.json() as Promise<T>;
}

function Feedback({
  result,
  locale,
}: {
  result: Result['feedback'];
  locale: Locale;
}) {
  return (
    <div className="logic-feedback">
      <strong>{result.message}</strong>
      <p>{result.solution}</p>
      {result.table && (
        <details>
          <summary>{practiceCopy.tableCheck[locale]}</summary>
          <div className="logic-table-scroll">
            <table>
              <thead>
                <tr>
                  {result.table.columns.map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.table.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

export default function LogicWorkshop({ locale }: { locale: Locale }) {
  const t = (key: keyof typeof practiceCopy) => practiceCopy[key][locale];
  const [topic, setTopic] = useState<Topic | 'mixed'>('mixed');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [current, setCurrent] = useState<PublicQuestion>();
  const [answer, setAnswer] = useState<Answer>(null);
  const [steps, setSteps] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Grade>();
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const focus = useRef<HTMLHeadingElement>(null);
  const position =
    results.length -
    Number(feedback?.state === 'correct' || feedback?.state === 'revealed');
  const final = feedback?.state === 'correct' || feedback?.state === 'revealed';
  const needsReview = results.filter((result) => !result.firstTry);

  useEffect(() => {
    focus.current?.focus();
  }, [current, finished]);

  function openQuestion(question: PublicQuestion) {
    setCurrent(question);
    setAnswer(
      question.kind === 'table' ? question.table.rows.map(() => null) : null,
    );
    setSteps([]);
    setMissed(false);
    setFeedback(undefined);
    setShowHint(false);
    setError(false);
  }

  async function start(ids?: string[]) {
    const nextSeed = crypto.randomUUID();
    setBusy(true);
    setError(false);
    try {
      const data = await request<{ questions: PublicQuestion[] }>(
        locale,
        nextSeed,
        ids ? { action: 'retry', ids } : { action: 'start', topic, level },
      );
      if (!data.questions[0]) throw new Error('Empty session');
      setSeed(nextSeed);
      setQuestions(data.questions);
      setResults([]);
      setFinished(false);
      openQuestion(data.questions[0]);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function check(reveal = false) {
    if (!current || busy) return;
    setError(false);
    setBusy(true);
    try {
      const grade = await request<Grade>(locale, seed, {
        action: reveal ? 'reveal' : 'grade',
        id: current.id,
        answer,
        steps,
      });
      setFeedback(grade);
      if (grade.state === 'incorrect') setMissed(true);
      if (grade.state === 'continue') {
        setSteps([...steps, Number(answer)]);
        setAnswer(null);
        setShowHint(false);
        setCurrent(grade.question);
      }
      if (grade.state === 'correct' || grade.state === 'revealed') {
        const updated = [
          ...results,
          {
            question: current,
            feedback: grade,
            firstTry: !missed && grade.state === 'correct',
          },
        ];
        setResults(updated);
        setFinished(updated.length === questions.length);
        if (updated.length < questions.length)
          requestAnimationFrame(() =>
            document.getElementById('logic-next')?.focus(),
          );
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (completeAnswer && !final) void check();
  }

  const completeAnswer = Array.isArray(answer)
    ? answer.every((cell) => cell !== null)
    : typeof answer === 'string'
      ? Boolean(answer.trim())
      : answer !== null;
  const reviewTopics = [
    ...new Set(needsReview.map(({ question }) => question.topic)),
  ];
  const lessonHref = (value: Topic) =>
    '/' + locale + '/lessons/' + lessonForTopic[value] + '/';
  const lastResult = results.at(-1);

  return (
    <section
      id="practice"
      className="logic-practice"
      aria-labelledby="logic-practice-title"
    >
      <h2 id="logic-practice-title">{workshopCopy.practice[locale]}</h2>
      {!current && (
        <form
          className="logic-setup"
          onSubmit={(event) => {
            event.preventDefault();
            void start();
          }}
        >
          <label htmlFor="logic-topic">{t('topic')}</label>
          <select
            id="logic-topic"
            value={topic}
            onChange={(event) =>
              setTopic(event.target.value as Topic | 'mixed')
            }
          >
            <option value="mixed">{t('mixed')}</option>
            {topics.map((value) => (
              <option key={value} value={value}>
                {topicCopy[value].title[locale]}
              </option>
            ))}
          </select>
          <label htmlFor="logic-level">{t('difficulty')}</label>
          <select
            id="logic-level"
            value={level}
            onChange={(event) => setLevel(event.target.value as Level | 'all')}
          >
            <option value="all">{t('all')}</option>
            {levels.map((value) => (
              <option key={value} value={value}>
                {t(value)}
              </option>
            ))}
          </select>
          <button type="submit" className="logic-action" disabled={busy}>
            {busy ? t('checking') : t('start')}
          </button>
        </form>
      )}
      {current && !finished && (
        <>
          <div className="logic-progress">
            <span>{topicCopy[current.topic].title[locale]}</span>
            <span>
              {t('question')} {position + 1} / {questions.length}
            </span>
          </div>
          <progress
            aria-label={t('question')}
            value={position + (final ? 1 : 0)}
            max={questions.length}
          />
          <h3 tabIndex={-1} ref={focus}>
            {current.prompt}
          </h3>
          {current.detail && <p className="logic-detail">{current.detail}</p>}
          <form onSubmit={submit}>
            <fieldset disabled={busy || final}>
              {(current.kind === 'choice' || current.kind === 'rewrite') && (
                <>
                  <legend className="logic-sr">{t('choice')}</legend>
                  <div className="logic-options">
                    {current.options.map((option, index) => (
                      <label key={index}>
                        <input
                          type="radio"
                          name="logic-answer"
                          value={index}
                          checked={answer === index}
                          onChange={() => setAnswer(index)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {current.kind === 'formula' && (
                <>
                  <legend>{t('answer')}</legend>
                  <p id="logic-syntax">{t('syntax')}</p>
                  <input
                    className="logic-formula"
                    id="logic-answer"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={160}
                    value={typeof answer === 'string' ? answer : ''}
                    aria-label={t('answer')}
                    aria-describedby="logic-syntax"
                    placeholder={t('formulaRequired')}
                    onChange={(event) => setAnswer(event.target.value)}
                  />
                  <div className="logic-symbols">
                    {['¬', '∧', '∨', '⇒', '⇔', '(', ')', '⊤', '0'].map(
                      (symbol) => (
                        <button
                          type="button"
                          key={symbol}
                          onClick={() => {
                            const input = document.getElementById(
                              'logic-answer',
                            ) as HTMLInputElement;
                            const from =
                              input.selectionStart ?? input.value.length;
                            const to = input.selectionEnd ?? from;
                            if (input.value.length - (to - from) >= 160) return;
                            setAnswer(
                              input.value.slice(0, from) +
                                symbol +
                                input.value.slice(to),
                            );
                            input.focus();
                            requestAnimationFrame(() =>
                              input.setSelectionRange(from + 1, from + 1),
                            );
                          }}
                        >
                          {symbol}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
              {current.kind === 'table' && (
                <>
                  <legend className="logic-sr">{t('table')}</legend>
                  <div className="logic-table-scroll">
                    <table>
                      <caption className="logic-sr">{t('table')}</caption>
                      <thead>
                        <tr>
                          {current.table.columns.map((column) => (
                            <th key={column} scope="col">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {current.table.rows.map((row, index) => {
                          const wrong =
                            feedback?.state === 'incorrect' &&
                            feedback.cells?.[index] === false;
                          return (
                            <tr key={index} data-review={wrong || undefined}>
                              {row.map((bit, i) => (
                                <td key={i}>{bit}</td>
                              ))}
                              <td>
                                <select
                                  aria-label={
                                    t('row') +
                                    ' ' +
                                    (index + 1) +
                                    ', ' +
                                    t('output')
                                  }
                                  aria-invalid={wrong || undefined}
                                  value={
                                    Array.isArray(answer)
                                      ? (answer[index] ?? '')
                                      : ''
                                  }
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    if (Array.isArray(answer))
                                      setAnswer(
                                        answer.map((bit, i) =>
                                          i === index
                                            ? value === ''
                                              ? null
                                              : Number(value)
                                            : bit,
                                        ),
                                      );
                                  }}
                                >
                                  <option value="">—</option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                </select>
                                {wrong && (
                                  <span className="logic-row-error">
                                    {t('wrong')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </fieldset>
            {!final && (
              <button
                type="submit"
                className="logic-action"
                disabled={!completeAnswer || busy}
              >
                {busy ? t('checking') : t('submit')}
              </button>
            )}
          </form>
          <div role="status" aria-live="polite">
            {feedback?.state === 'incorrect' && (
              <div className="logic-feedback">
                <p>{feedback.message}</p>
                {showHint ? (
                  <>
                    <p>{feedback.hint}</p>
                    <button
                      type="button"
                      className="logic-secondary"
                      disabled={busy}
                      onClick={() => void check(true)}
                    >
                      {t('reveal')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="logic-secondary"
                    onClick={() => setShowHint(true)}
                  >
                    {t('hint')}
                  </button>
                )}
              </div>
            )}
            {feedback?.state === 'continue' && <p>{feedback.message}</p>}
            {final && <Feedback result={feedback} locale={locale} />}
          </div>
          {final && (
            <button
              type="button"
              id="logic-next"
              className="logic-action"
              onClick={() => openQuestion(questions[results.length]!)}
            >
              {t('next')}
            </button>
          )}
        </>
      )}
      {finished && lastResult && (
        <div className="logic-complete">
          <h3 ref={focus} tabIndex={-1}>
            {t('finish')}
          </h3>
          <dl>
            <div>
              <dt>{t('firstTry')}</dt>
              <dd>
                {results.filter((result) => result.firstTry).length} /{' '}
                {results.length}
              </dd>
            </div>
            <div>
              <dt>{t('solved')}</dt>
              <dd>
                {
                  results.filter(
                    (result) => result.feedback.state === 'correct',
                  ).length
                }{' '}
                / {results.length}
              </dd>
            </div>
          </dl>
          {reviewTopics.length > 0 && (
            <div>
              <h4>{t('reviewTopics')}</h4>
              <ul>
                {reviewTopics.map((value) => (
                  <li key={value}>
                    <a href={lessonHref(value)}>
                      {topicCopy[value].title[locale]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h4>{t('finalFeedback')}</h4>
          <Feedback result={lastResult.feedback} locale={locale} />
          <div className="logic-actions">
            {needsReview.length > 0 && (
              <button
                type="button"
                className="logic-action"
                disabled={busy}
                onClick={() =>
                  void start(needsReview.map(({ question }) => question.id))
                }
              >
                {t('practiceAgain')}
              </button>
            )}
            <button
              type="button"
              className="logic-secondary"
              disabled={busy}
              onClick={() => {
                setCurrent(undefined);
                setFinished(false);
                setError(false);
                requestAnimationFrame(() =>
                  document.getElementById('logic-topic')?.focus(),
                );
              }}
            >
              {t('newSession')}
            </button>
            <a href={lessonHref(reviewTopics[0] ?? lastResult.question.topic)}>
              {t('continue')} →
            </a>
          </div>
        </div>
      )}
      {error && (
        <p className="logic-feedback" role="alert">
          {t('error')}
        </p>
      )}
    </section>
  );
}
