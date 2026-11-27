import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import { formulaText } from '../lib/l04-boolean';
import { checkProofStep, proofLaws, proofs } from '../lib/boolean-proof';
import '../styles/l04-learning.css';

export default function BooleanProofLab({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [law, setLaw] = useState('');
  const [choice, setChoice] = useState('');
  const [feedback, setFeedback] = useState('');
  useEffect(() => setReady(true), []);
  const proof = proofs[index]!;
  const step = proof.steps[stepIndex];
  const target = proof.steps.at(-1)!.next;
  const reset = (next: number) => {
    setIndex(next);
    setStepIndex(0);
    setLaw('');
    setChoice('');
    setFeedback('');
  };

  function check() {
    if (!step || !law || !choice) return;
    const result = checkProofStep(proof, stepIndex, law, choice === 'right');
    if (result.status === 'formula') {
      const counter = result.counterexample;
      setFeedback(
        (fr ? 'Formule non équivalente. ' : 'Non-equivalent formula. ') +
          (counter
            ? 'A = ' +
              Number(counter.env.A) +
              ', B = ' +
              Number(counter.env.B) +
              ', C = ' +
              Number(counter.env.C) +
              ' : ' +
              Number(counter.left) +
              ' ≠ ' +
              Number(counter.right) +
              '. '
            : '') +
          step.reason[locale],
      );
    } else if (result.status === 'law') {
      setFeedback(
        (fr
          ? 'La formule est correcte, mais pas la loi. '
          : 'Correct formula, but not the law. ') + step.reason[locale],
      );
    } else {
      setStepIndex(stepIndex + 1);
      setLaw('');
      setChoice('');
      setFeedback(
        (fr ? 'Étape correcte. ' : 'Correct step. ') + step.reason[locale],
      );
    }
  }

  return (
    <section className="l04-lab" data-boolean-proof aria-labelledby={id}>
      <p id={id}>
        <strong>
          {fr ? 'Atelier de preuve algébrique' : 'Algebraic proof workshop'}
        </strong>
      </p>
      <div hidden={!ready} className="l04-controls l04-proof-screen">
        <label htmlFor={id + '-proof'}>{fr ? 'Preuve' : 'Proof'}</label>
        <select
          id={id + '-proof'}
          data-proof-example
          value={index}
          onChange={(event) => reset(Number(event.target.value))}
        >
          <option value="0">
            {fr ? '1 — Négation imbriquée' : '1 — Nested negation'}
          </option>
          <option value="1">
            {fr ? '2 — Simplification type examen' : '2 — Exam-style proof'}
          </option>
        </select>
        <p>
          {fr ? 'Objectif :' : 'Target:'}
          <span className="l04-formula">{formulaText(target)}</span>
        </p>
        <p data-proof-progress>
          {stepIndex}/{proof.steps.length}
        </p>
        <ol className="l04-proof-lines" aria-label={fr ? 'Preuve' : 'Proof'}>
          <li className="l04-formula">{formulaText(proof.start)}</li>
          {proof.steps.slice(0, stepIndex).map((item, i) => (
            <li key={i}>
              <span className="l04-formula">≡ {formulaText(item.next)}</span>
              <span>{proofLaws[item.law][locale]}</span>
            </li>
          ))}
        </ol>
        {step ? (
          <>
            <label htmlFor={id + '-law'}>
              {fr ? 'Loi à appliquer' : 'Law to apply'}
            </label>
            <select
              id={id + '-law'}
              data-proof-law
              value={law}
              onChange={(event) => {
                setLaw(event.target.value);
                setFeedback('');
              }}
            >
              <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
              {Object.entries(proofLaws).map(([key, label]) => (
                <option key={key} value={key}>
                  {label[locale]}
                </option>
              ))}
            </select>
            <label htmlFor={id + '-line'}>
              {fr ? 'Prochaine formule' : 'Next formula'}
            </label>
            <select
              id={id + '-line'}
              data-proof-line
              value={choice}
              onChange={(event) => {
                setChoice(event.target.value);
                setFeedback('');
              }}
            >
              <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
              {(stepIndex % 2 === 0
                ? ['wrong', 'right']
                : ['right', 'wrong']
              ).map((key) => (
                <option key={key} value={key}>
                  {formulaText(key === 'right' ? step.next : step.wrong)}
                </option>
              ))}
            </select>
            <button
              type="button"
              data-proof-check
              disabled={!law || !choice}
              onClick={check}
            >
              {fr ? 'Vérifier l’étape' : 'Check step'}
            </button>
          </>
        ) : (
          <p data-proof-complete>
            {fr ? 'Preuve terminée.' : 'Proof complete.'}
          </p>
        )}
        <p role="status" aria-atomic="true" data-proof-feedback>
          {feedback}
        </p>
        <button type="button" data-proof-reset onClick={() => reset(index)}>
          {fr ? 'Recommencer' : 'Restart'}
        </button>
      </div>
      <div className="l04-proof-static" hidden={ready} data-proof-static>
        <p>{fr ? 'Exemple fixe :' : 'Fixed example:'}</p>
        <ol className="l04-proof-lines">
          <li className="l04-formula">{formulaText(proofs[0]!.start)}</li>
          {proofs[0]!.steps.map((item, i) => (
            <li key={i}>
              <span className="l04-formula">≡ {formulaText(item.next)}</span>
              <span>{proofLaws[item.law][locale]}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
