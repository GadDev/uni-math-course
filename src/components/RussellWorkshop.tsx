import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import '../styles/l09-russell.css';

type Bit = 0 | 1;

export function RussellDiagrams({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  return (
    <figure className="l09-figure">
      <svg viewBox="0 0 320 220" role="img" aria-labelledby={id}>
        <title id={id}>
          {fr
            ? 'A contient 1, 2, 3 ; 4 est dehors. B contient 1 et le petit ensemble {2, 3}.'
            : 'A contains 1, 2, 3; 4 is outside. B contains 1 and the small set {2, 3}.'}
        </title>
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="10" y="12" width="240" height="78" rx="15" />
          <rect x="10" y="112" width="300" height="98" rx="15" />
          <rect x="125" y="137" width="165" height="58" rx="10" />
        </g>
        <g fill="currentColor" fontSize="15" textAnchor="middle">
          <text x="30" y="32">A</text>
          <text x="65" y="63">1</text>
          <text x="130" y="63">2</text>
          <text x="195" y="63">3</text>
          <text x="280" y="63">4</text>
          <text x="30" y="133">B</text>
          <text x="65" y="172">1</text>
          <text x="207" y="156">{'{2, 3}'}</text>
          <text x="168" y="180">2</text>
          <text x="246" y="180">3</text>
        </g>
      </svg>
      <figcaption>
        {fr
          ? 'La boîte intérieure est un seul élément de B ; ses éléments ne deviennent pas directement des éléments de B.'
          : 'The inner box is one element of B; its elements do not automatically become elements of B.'}
      </figcaption>
      <svg viewBox="0 0 320 115" role="img" aria-label={fr ? 'Boucle hypothétique X appartient à X, non un ensemble admis.' : 'Hypothetical loop X belongs to X, not an accepted set.'}>
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="125" y="64" width="70" height="40" rx="8" />
          <path d="M180 64 C260 0 60 0 140 64 m-12-5 12 5-4-12" strokeDasharray="5 3" />
        </g>
        <g fill="currentColor" textAnchor="middle" fontSize="16">
          <text x="160" y="44">X ∈ X ?</text>
          <text x="160" y="89">X</text>
        </g>
      </svg>
      <figcaption>
        {fr
          ? 'La boucle représente une question hypothétique, pas un exemple d’ensemble existant.'
          : 'The loop represents a hypothetical question, not an example of an existing set.'}
      </figcaption>
    </figure>
  );
}

export default function RussellWorkshop({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [assumption, setAssumption] = useState<Bit | null>(null);
  const [prediction, setPrediction] = useState<Bit | null>(null);
  const [seen, setSeen] = useState<Bit[]>([]);
  useEffect(() => setReady(true), []);
  const correct = assumption !== null && prediction === 1 - assumption;
  function predict(value: Bit) {
    setPrediction(value);
    if (assumption !== null && value === 1 - assumption) {
      setSeen((old) => old.includes(assumption) ? old : [...old, assumption]);
    }
  }
  function reset() {
    setAssumption(null);
    setPrediction(null);
    setSeen([]);
  }
  return (
    <section className="l09-lab" aria-labelledby={id} data-russell-workshop>
      <h3 id={id}>{fr ? 'Laboratoire de Russell' : 'Russell laboratory'}</h3>
      <p>{fr ? 'Supposons provisoirement que la collection E existe comme ensemble.' : 'Temporarily assume that collection E exists as a set.'}</p>
      <p className="l09-formula">{'E = {x | x ∉ x}'}</p>
      <p>{fr ? 'Un ensemble x est admis exactement quand il ne se contient pas lui-même. Testez x = E.' : 'A set x is admitted exactly when it does not contain itself. Test x = E.'}</p>
      <div className="l09-live" hidden={!ready}>
        <fieldset>
          <legend>{fr ? '1. Choisir une hypothèse' : '1. Choose an assumption'}</legend>
          {([1, 0] as const).map((value) => (
            <button type="button" key={value} aria-pressed={assumption === value} onClick={() => { setAssumption(value); setPrediction(null); }}>
              {value === 1 ? 'E ∈ E' : 'E ∉ E'}
            </button>
          ))}
        </fieldset>
        {assumption !== null && (
          <fieldset>
            <legend>{fr ? '2. Prédire la conséquence de la règle' : '2. Predict the consequence of the rule'}</legend>
            {([1, 0] as const).map((value) => (
              <button type="button" key={value} aria-pressed={prediction === value} onClick={() => predict(value)}>
                {value === 1 ? 'E ∈ E' : 'E ∉ E'}
              </button>
            ))}
          </fieldset>
        )}
        <div role="status" aria-atomic="true">
          {prediction !== null && (
            correct ? (
              <>
                <p className="l09-formula">{assumption === 1 ? 'E ∈ E ⇒ E ∉ E' : 'E ∉ E ⇒ E ∈ E'}</p>
                <p>{fr ? 'Bonne déduction : la conséquence contredit votre hypothèse.' : 'Correct deduction: the consequence contradicts your assumption.'}</p>
              </>
            ) : (
              <p>{fr ? 'Réessayez : appliquez la condition x ∉ x à E, sans répéter votre hypothèse.' : 'Try again: apply the condition x ∉ x to E instead of repeating your assumption.'}</p>
            )
          )}
          <p>{fr ? 'Cas correctement explorés' : 'Cases correctly explored'} : {seen.length}/2</p>
          {seen.length === 2 && (
            <p><strong>{fr ? 'Conclusion : aucun des deux cas ne fonctionne. Il faut rejeter la règle de compréhension sans restriction, pas les ensembles.' : 'Conclusion: neither case works. Reject unrestricted comprehension, not sets.'}</strong></p>
          )}
        </div>
        <button type="button" onClick={reset}>{fr ? 'Réinitialiser' : 'Reset'}</button>
      </div>
      <div className="l09-static" hidden={ready}>
        <details>
          <summary>{fr ? 'Version papier / sans interaction' : 'Paper / non-interactive version'}</summary>
          <p>E ∈ E ⇒ E ∉ E</p>
          <p>E ∉ E ⇒ E ∈ E</p>
          <p>{fr ? 'Les deux hypothèses donnent une contradiction ; E ne peut pas être un ensemble.' : 'Both assumptions yield a contradiction; E cannot be a set.'}</p>
        </details>
      </div>
    </section>
  );
}
