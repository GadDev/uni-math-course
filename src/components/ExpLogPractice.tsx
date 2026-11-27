import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';
import { equationTasks, type EquationTask } from '../lib/exp-log-practice';
import Tex from './Tex';
import '../styles/exp-log-learning.css';

function Task({
  task,
  locale,
  ready,
}: {
  task: EquationTask;
  locale: Locale;
  ready: boolean;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const fr = locale === 'fr';
  const feedback = submitted === null ? undefined : task.choices[submitted];
  return (
    <section className="equation-task" data-equation-task={task.id}>
      <p>
        <Tex text={task.prompt[locale]} />
      </p>
      <fieldset hidden={!ready}>
        <legend>
          {fr
            ? 'Écrivez votre démarche, puis choisissez'
            : 'Write your working, then choose'}
        </legend>
        {task.choices.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={task.id}
              value={index}
              checked={choice === index}
              onChange={() => {
                setChoice(index);
                setSubmitted(null);
              }}
            />
            <Tex text={option.text} />
          </label>
        ))}
        <div className="equation-actions">
          <button
            type="button"
            disabled={choice === null}
            onClick={() => setSubmitted(choice)}
          >
            {fr ? 'Vérifier' : 'Check'}
          </button>
          <button
            type="button"
            onClick={() => {
              setChoice(null);
              setSubmitted(null);
              setOpen(false);
            }}
          >
            {fr ? 'Recommencer' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <p
        className="equation-feedback"
        role="status"
        aria-live="polite"
        data-correct={feedback ? Boolean(feedback.correct) : undefined}
      >
        {feedback?.feedback[locale] ?? ''}
      </p>
      <details
        className="equation-correction"
        open={open}
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary>
          {fr
            ? 'Voir la démarche et la vérification'
            : 'See working and verification'}
        </summary>
        <p>
          <Tex text={task.solution[locale]} />
        </p>
      </details>
    </section>
  );
}

export default function ExpLogPractice({
  lesson,
  locale,
}: {
  lesson: 'L40' | 'L41' | 'L42';
  locale: Locale;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className="equation-practice" data-equation-practice={lesson}>
      <p>
        {locale === 'fr'
          ? 'Auto-entraînement : écrivez le domaine, les étapes et une substitution sur papier avant de choisir. Les réponses ne sont pas enregistrées. Sans JavaScript, utilisez les corrections dépliables.'
          : 'Self-study: write the domain, steps and a substitution on paper before choosing. Answers are not saved. Without JavaScript, use the expandable corrections.'}
      </p>
      {equationTasks[lesson].map((task) => (
        <Task key={task.id} task={task} locale={locale} ready={ready} />
      ))}
    </div>
  );
}
