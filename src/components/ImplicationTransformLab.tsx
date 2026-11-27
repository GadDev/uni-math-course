import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import { assignments } from '../lib/l07-logic';
import {
  transformEvidence,
  transformIds,
  transformRow,
  transforms,
  type Transform,
} from '../lib/implication-transforms';
import '../styles/implication-transform-lab.css';

export default function ImplicationTransformLab({
  locale,
}: {
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [task, setTask] = useState<Transform>('contrapositive');
  const [choice, setChoice] = useState('');
  const [validated, setValidated] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [seen, setSeen] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  useEffect(() => setReady(true), []);

  const row = transformRow(task, ...assignments[rowIndex]!);
  const evidence = transformEvidence(task, seen);
  const reset = (next: Transform) => {
    setTask(next);
    setChoice('');
    setValidated(false);
    setRowIndex(0);
    setPrediction('');
    setSeen([]);
    setFeedback('');
  };

  function checkFormula() {
    const correct = choice === task;
    setValidated(correct);
    setFeedback(
      (correct
        ? fr
          ? 'Bonne transformation. '
          : 'Correct transformation. '
        : fr
          ? 'À revoir. '
          : 'Try again. ') + transforms[task].reason[locale],
    );
  }

  function checkRow() {
    if (prediction !== String(row.value)) {
      setFeedback(
        fr
          ? 'À revoir : évaluez les négations et le connecteur.'
          : 'Try again: evaluate negations and the connective.',
      );
      return;
    }
    setSeen((previous) => [...new Set([...previous, rowIndex])]);
    setFeedback(
      (fr ? 'Bonne réponse. ' : 'Correct. ') +
        transforms[task].label +
        ' = ' +
        row.value,
    );
  }

  return (
    <section className="transform-lab" data-transform-lab aria-labelledby={id}>
      <p id={id}>
        <strong>
          {fr ? 'Atelier des transformations' : 'Transformation workshop'}
        </strong>
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>A ⇒ B</legend>
        <label htmlFor={id + '-task'}>{fr ? 'Mission' : 'Task'}</label>
        <select
          id={id + '-task'}
          data-transform-task
          value={task}
          onChange={(event) => reset(event.target.value as Transform)}
        >
          {transformIds.map((key) => (
            <option key={key} value={key}>
              {transforms[key].name[locale]}
            </option>
          ))}
        </select>
        <label htmlFor={id + '-formula'}>{fr ? 'Formule' : 'Formula'}</label>
        <select
          id={id + '-formula'}
          data-transform-formula
          disabled={validated}
          value={choice}
          onChange={(event) => {
            setChoice(event.target.value);
            setFeedback('');
          }}
        >
          <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
          {transformIds.map((key) => (
            <option key={key} value={key}>
              {transforms[key].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-transform-check
          disabled={!choice || validated}
          onClick={checkFormula}
        >
          {fr ? 'Vérifier la formule' : 'Check formula'}
        </button>
        {validated && (
          <>
            <label htmlFor={id + '-row'}>
              {fr ? 'Affectation' : 'Assignment'}
            </label>
            <select
              id={id + '-row'}
              data-transform-row
              value={rowIndex}
              onChange={(event) => {
                setRowIndex(Number(event.target.value));
                setPrediction('');
                setFeedback('');
              }}
            >
              {assignments.map(([a, b], i) => (
                <option key={i} value={i}>
                  A = {a}, B = {b}
                </option>
              ))}
            </select>
            <label htmlFor={id + '-prediction'}>
              {transforms[task].label} = ?
            </label>
            <select
              id={id + '-prediction'}
              data-transform-prediction
              value={prediction}
              onChange={(event) => {
                setPrediction(event.target.value);
                setFeedback('');
              }}
            >
              <option value="">?</option>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
            <button
              type="button"
              data-transform-check-row
              disabled={prediction === ''}
              onClick={checkRow}
            >
              {fr ? 'Vérifier la ligne' : 'Check row'}
            </button>
            <div className="transform-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">A, B</th>
                    <th scope="col">A ⇒ B</th>
                    <th scope="col">{transforms[task].label}</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(([a, b], i) => {
                    const result = transformRow(task, a, b);
                    return (
                      <tr key={i}>
                        <th scope="row">
                          {a}, {b}
                        </th>
                        <td>{seen.includes(i) ? result.original : '—'}</td>
                        <td>{seen.includes(i) ? result.value : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p data-transform-evidence role="status" aria-atomic="true">
              {evidence.count}/4.{' '}
              {evidence.state === 'refuted'
                ? (fr ? 'Équivalence réfutée : ' : 'Equivalence refuted: ') +
                  'A = ' +
                  evidence.counterexample!.a +
                  ', B = ' +
                  evidence.counterexample!.b
                : evidence.state === 'proved'
                  ? fr
                    ? 'Équivalence démontrée.'
                    : 'Equivalence proved.'
                  : fr
                    ? 'Preuve incomplète.'
                    : 'Incomplete evidence.'}
            </p>
          </>
        )}
        <p data-transform-feedback role="status" aria-atomic="true">
          {feedback}
        </p>
        <button type="button" data-transform-reset onClick={() => reset(task)}>
          {fr ? 'Recommencer' : 'Restart'}
        </button>
      </fieldset>
      <div data-transform-static hidden={ready}>
        <p>
          {fr
            ? 'Exemple fixe : A = 0, B = 1. La règle et sa contraposée valent 1 ; la réciproque vaut 0.'
            : 'Fixed example: A = 0, B = 1. The rule and its contrapositive are 1; the converse is 0.'}
        </p>
      </div>
    </section>
  );
}
