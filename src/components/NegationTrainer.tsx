import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import '../styles/l12-negation.css';

const cases = [
  {
    original: '∀ x ∈ ℝ (x > 3)',
    steps: [
      ['∃ x ∈ ℝ ¬(x > 3)', '∀ x ∈ ℝ ¬(x > 3)', '∃ x ∈ ℕ ¬(x > 3)'],
      ['∃ x ∈ ℝ (x < 3)', '∃ x ∈ ℝ (x ≤ 3)', '∃ x ∈ ℝ (x ≥ 3)'],
    ],
    answers: [0, 1],
    rules: ['all', 'boundary'],
  },
  {
    original: '∃ n ∈ ℤ (n ≥ 0)',
    steps: [
      ['∃ n ∈ ℤ ¬(n ≥ 0)', '∀ n ∈ ℤ ¬(n ≥ 0)', '∀ x ∈ ℤ ¬(n ≥ 0)'],
      ['∀ n ∈ ℤ (n < 0)', '∀ n ∈ ℤ (n ≤ 0)', '∀ n ∈ ℤ (n > 0)'],
    ],
    answers: [1, 0],
    rules: ['some', 'boundary'],
  },
  {
    original: '∀ x ∈ ℝ ∃ y ∈ ℝ (xy < 1)',
    steps: [
      ['∀ x ∈ ℝ ¬[∃ y ∈ ℝ (xy < 1)]', '∃ y ∈ ℝ ¬[∃ x ∈ ℝ (xy < 1)]', '∃ x ∈ ℝ ¬[∃ y ∈ ℝ (xy < 1)]'],
      ['∃ x ∈ ℝ ∀ y ∈ ℝ ¬(xy < 1)', '∀ y ∈ ℝ ∃ x ∈ ℝ ¬(xy < 1)', '∃ x ∈ ℝ ∀ x ∈ ℝ ¬(xy < 1)'],
      ['∃ x ∈ ℝ ∀ y ∈ ℝ (xy > 1)', '∃ x ∈ ℝ ∀ y ∈ ℝ (xy ≥ 1)', '∃ x ∈ ℝ ∀ y ∈ ℝ (xy ≤ 1)'],
    ],
    answers: [2, 0, 1],
    rules: ['all', 'some', 'boundary'],
  },
  {
    original: '∃ x ∈ ℝ [(x > 0) ⇒ ∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]',
    steps: [
      ['∀ x ∈ ℝ ¬[(x > 0) ⇒ ∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]', '∃ x ∈ ℝ ¬[(x > 0) ⇒ ∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]'],
      ['∀ x ∈ ℝ [(x ≤ 0) ∧ ¬∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]', '∀ x ∈ ℝ [(x > 0) ∧ ¬∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]', '∀ x ∈ ℝ [(x > 0) ⇒ ¬∀ y ∈ ℝ (y ≤ x ∨ y ≥ 2x)]'],
      ['∀ x ∈ ℝ [(x > 0) ∧ ∀ y ∈ ℝ ¬(y ≤ x ∨ y ≥ 2x)]', '∀ x ∈ ℝ [(x > 0) ∧ ∃ x ∈ ℝ ¬(y ≤ x ∨ y ≥ 2x)]', '∀ x ∈ ℝ [(x > 0) ∧ ∃ y ∈ ℝ ¬(y ≤ x ∨ y ≥ 2x)]'],
      ['∀ x ∈ ℝ [(x > 0) ∧ ∃ y ∈ ℝ (y > x ∧ y < 2x)]', '∀ x ∈ ℝ [(x > 0) ∧ ∃ y ∈ ℝ (y > x ∨ y < 2x)]', '∀ x ∈ ℝ [(x > 0) ∧ ∃ y ∈ ℝ (y ≥ x ∧ y ≤ 2x)]'],
    ],
    answers: [0, 1, 2, 0],
    rules: ['some', 'implication', 'all', 'morgan'],
  },
] as const;

const explanations = {
  all: ['¬∀ devient ∃¬. Gardez le même domaine et la même variable.', '¬∀ becomes ∃¬. Keep the same domain and variable.'],
  some: ['¬∃ devient ∀¬. Gardez le même domaine et la même variable.', '¬∃ becomes ∀¬. Keep the same domain and variable.'],
  boundary: ['La négation inverse le test et change la présence de l’égalité : > devient ≤, ≥ devient <.', 'Negation reverses the comparison and changes equality inclusion: > becomes ≤, ≥ becomes <.'],
  implication: ['¬(A ⇒ B) ≡ A ∧ ¬B. L’antécédent reste inchangé ; seul le conséquent est nié.', '¬(A ⇒ B) ≡ A ∧ ¬B. Keep the antecedent; negate only the consequent.'],
  morgan: ['¬(A ∨ B) ≡ ¬A ∧ ¬B. Niez chaque comparaison en respectant les bornes.', '¬(A ∨ B) ≡ ¬A ∧ ¬B. Negate each comparison, respecting endpoints.'],
} as const;

export default function NegationTrainer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const lang = fr ? 0 : 1;
  const id = useId();
  const [ready, setReady] = useState(false);
  const [example, setExample] = useState(0);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  useEffect(() => setReady(true), []);
  const current = cases[example]!;
  const complete = step === current.steps.length;
  const correct = choice !== null && choice === current.answers[step];

  function reset(next: number) {
    setExample(next);
    setStep(0);
    setChoice(null);
  }

  return (
    <section className="l12-lab" data-negation-trainer aria-labelledby={id}>
      <h3 id={id}>{fr ? 'Atelier : pousser la négation' : 'Workshop: push negation inward'}</h3>
      <p>{fr ? 'Choisissez une formule et transformez une couche à la fois. Les erreurs ne font pas avancer.' : 'Choose a formula and transform one layer at a time. Incorrect steps do not advance.'}</p>
      <div className="l12-live" hidden={!ready}>
        <label htmlFor={id + '-case'}>{fr ? 'Formule à nier' : 'Formula to negate'}</label>
        <select id={id + '-case'} value={example} onChange={(event) => reset(Number(event.currentTarget.value))}>
          {cases.map((item, index) => <option key={item.original} value={index}>{index + 1}. {item.original}</option>)}
        </select>
        <p className="l12-formula">¬[{current.original}]</p>
        <p>{fr ? 'Étapes validées' : 'Validated steps'} : {step}/{current.steps.length}</p>
        <ol>
          {current.steps.slice(0, step).map((options, index) => (
            <li className="l12-formula" key={index}>{options[current.answers[index]!]}</li>
          ))}
        </ol>
        {!complete && (
          <fieldset>
            <legend>{fr ? 'Quelle est la prochaine transformation ?' : 'What is the next transformation?'}</legend>
            {current.steps[step]!.map((option, index) => (
              <label className="l12-option" key={option}>
                <input type="radio" name={id + '-step'} checked={choice === index} onChange={() => setChoice(index)} />
                <span>{option}</span>
              </label>
            ))}
            <p role="status" aria-atomic="true">
              {choice !== null && (
                (correct ? (fr ? 'Bonne réponse. ' : 'Correct. ') : (fr ? 'À revoir. ' : 'Try again. ')) +
                explanations[current.rules[step]!][lang]
              )}
            </p>
            <button type="button" disabled={!correct} onClick={() => { setStep((old) => old + 1); setChoice(null); }}>
              {fr ? 'Valider et continuer' : 'Confirm and continue'}
            </button>
          </fieldset>
        )}
        {complete && <p role="status" data-complete>{fr ? 'Transformation terminée. Relisez les étapes et justifiez-les sur papier.' : 'Transformation complete. Review and justify each step on paper.'}</p>}
        <button type="button" onClick={() => reset(example)}>{fr ? 'Réinitialiser' : 'Reset'}</button>
      </div>
      <div className="l12-static" hidden={ready}>
        <p>{fr ? 'Exemple fixe :' : 'Fixed example:'} ¬[∀ x ∈ ℝ ∃ y ∈ ℝ (xy &lt; 1)]</p>
        <p>∃ x ∈ ℝ ¬[∃ y ∈ ℝ (xy &lt; 1)]</p>
        <p>∃ x ∈ ℝ ∀ y ∈ ℝ ¬(xy &lt; 1)</p>
        <p>∃ x ∈ ℝ ∀ y ∈ ℝ (xy ≥ 1)</p>
      </div>
    </section>
  );
}
