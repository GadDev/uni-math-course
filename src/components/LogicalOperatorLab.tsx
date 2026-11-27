import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import { operatorExamples, operatorValue } from '../lib/logical-operators';
import '../styles/logical-operator-lab.css';

export default function LogicalOperatorLab({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const [selected, setSelected] = useState('and');
  const [prediction, setPrediction] = useState<number | null>(null);
  useEffect(() => setReady(true), []);

  const example = operatorExamples.find((item) => item.id === selected)!;
  const value = operatorValue(example, a, b);

  const reset = () => {
    setA(true);
    setB(true);
    setSelected('and');
    setPrediction(null);
  };

  return (
    <section className="operator-lab" data-operator-lab aria-labelledby={id}>
      <p id={id}>
        <strong>
          {fr ? 'Laboratoire des connecteurs' : 'Logical operator lab'}
        </strong>
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>{fr ? 'Choisir et prédire' : 'Choose and predict'}</legend>
        <div className="operator-actions">
          <label>
            <input
              type="checkbox"
              checked={a}
              data-operator-input="A"
              onChange={(event) => {
                setA(event.target.checked);
                setPrediction(null);
              }}
            />
            A = {Number(a)}
          </label>
          <label>
            <input
              type="checkbox"
              checked={b}
              data-operator-input="B"
              onChange={(event) => {
                setB(event.target.checked);
                setPrediction(null);
              }}
            />
            B = {Number(b)}
          </label>
        </div>
        <label htmlFor={id + '-formula'}>{fr ? 'Formule' : 'Formula'}</label>
        <select
          id={id + '-formula'}
          data-operator-formula
          value={selected}
          onChange={(event) => {
            setSelected(event.target.value);
            setPrediction(null);
          }}
        >
          {operatorExamples.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <p>
          {example.label} :{' '}
          {fr ? 'Quelle est la valeur ?' : 'What is its value?'}
        </p>
        <div className="operator-actions">
          {[0, 1].map((choice) => (
            <button
              key={choice}
              type="button"
              data-operator-predict={choice}
              aria-pressed={prediction === choice}
              onClick={() => setPrediction(choice)}
            >
              {choice} —{' '}
              {choice === 1 ? (fr ? 'Vrai' : 'True') : fr ? 'Faux' : 'False'}
            </button>
          ))}
          <button type="button" data-operator-reset onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
        <p role="status" aria-atomic="true" data-operator-feedback>
          {prediction !== null && (
            <>
              <strong>
                {prediction === value
                  ? fr
                    ? 'Bonne réponse. '
                    : 'Correct. '
                  : fr
                    ? 'À revoir. '
                    : 'Try again. '}
              </strong>
              {example.label} = <span data-operator-result>{value}</span>.{' '}
              {example.reason[locale]}
            </>
          )}
        </p>
      </fieldset>
      <details data-operator-comparison>
        <summary>
          {fr ? 'Comparer toutes les formules' : 'Compare all formulas'}
        </summary>
        <p>
          A = {Number(a)}, B = {Number(b)}
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">{fr ? 'Formule' : 'Formula'}</th>
              <th scope="col">{fr ? 'Valeur' : 'Value'}</th>
            </tr>
          </thead>
          <tbody>
            {operatorExamples.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.label}</th>
                <td>{operatorValue(item, a, b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <div hidden={ready} data-operator-static>
        <p>
          {fr
            ? 'Exemple fixe : A = B = 1. ET et OU valent 1, XOR vaut 0.'
            : 'Fixed example: A = B = 1. AND and OR are 1, XOR is 0.'}
        </p>
        <p>
          {fr
            ? 'NON A vaut 0 ; (¬A) ∨ B vaut 1 ; ¬(A ∨ B) vaut 0.'
            : 'NOT A is 0; (¬A) ∨ B is 1; ¬(A ∨ B) is 0.'}
        </p>
      </div>
      <div className="operator-print">
        <p>
          A = B = 1 : A ∧ B = 1 ; A ∨ B = 1 ; A XOR B = 0 ; ¬A = 0 ; (¬A) ∨ B =
          1 ; ¬(A ∨ B) = 0 ; ⊤ = 1.
        </p>
      </div>
    </section>
  );
}
