import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  checkEvidence,
  evaluateDomain,
  evaluatePredicate,
  predicates,
  universe,
  type PredicateId,
} from '../lib/l11-quantifiers';
import '../styles/l11-quantifiers.css';

type EvidenceKind = 'witness' | 'counterexample';
type Guess = boolean | null;

function EvidenceQuestion({
  fr,
  domain,
  predicate,
  kind,
}: {
  fr: boolean;
  domain: readonly number[];
  predicate: PredicateId;
  kind: EvidenceKind;
}) {
  const id = useId();
  const [choice, setChoice] = useState('');
  const [checked, setChecked] = useState(false);
  const candidate = choice === 'none' ? null : Number(choice);
  const valid = checkEvidence(predicate, domain, kind, candidate);
  const question =
    kind === 'witness'
      ? fr
        ? 'Trouver un témoin : x ∈ X et P(x) vraie'
        : 'Find a witness: x ∈ X and P(x) true'
      : fr
        ? 'Trouver un contre-exemple : x ∈ X et P(x) fausse'
        : 'Find a counterexample: x ∈ X and P(x) false';
  const reason = valid
    ? fr
      ? 'Bonne réponse. Le candidat satisfait exactement les conditions demandées.'
      : 'Correct. The selection meets the required conditions.'
    : candidate !== null && !domain.includes(candidate)
      ? fr
        ? 'Hors du domaine : cet objet ne peut pas servir de preuve.'
        : 'Outside the domain: this object cannot serve as evidence.'
      : candidate === null
        ? fr
          ? 'Il existe au moins un élément admissible. Examinez le tableau.'
          : 'At least one suitable element exists. Examine the table.'
        : fr
          ? 'Dans le domaine, mais la valeur de P(x) ne convient pas.'
          : 'In the domain, but P(x) has the wrong truth value.';

  return (
    <fieldset data-evidence={kind}>
      <legend>{question}</legend>
      <label htmlFor={id}>{fr ? 'Votre choix' : 'Your choice'}</label>
      <select
        id={id}
        value={choice}
        onChange={(event) => {
          setChoice(event.currentTarget.value);
          setChecked(false);
        }}
      >
        <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
        {universe.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
        <option value="none">
          {fr ? 'Aucun élément ne convient' : 'No suitable element'}
        </option>
      </select>
      <button
        type="button"
        disabled={choice === ''}
        onClick={() => setChecked(true)}
      >
        {fr ? 'Vérifier' : 'Check'}
      </button>
      <p role="status" aria-atomic="true">
        {checked ? reason : ''}
      </p>
    </fieldset>
  );
}

export default function QuantifierLab({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [domain, setDomain] = useState<number[]>([1, 2, 4]);
  const [predicate, setPredicate] = useState<PredicateId>('even');
  const [tested, setTested] = useState<number[]>([]);
  const [universalGuess, setUniversalGuess] = useState<Guess>(null);
  const [existentialGuess, setExistentialGuess] = useState<Guess>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => setReady(true), []);

  const result = evaluateDomain(predicate, domain);
  const truth = (value: boolean) =>
    value ? (fr ? 'Vrai' : 'True') : fr ? 'Faux' : 'False';

  function clearAnswers() {
    setTested([]);
    setUniversalGuess(null);
    setExistentialGuess(null);
    setRevision((previous) => previous + 1);
  }

  function changeDomain(next: number[]) {
    setDomain(next.sort((a, b) => a - b));
    clearAnswers();
  }

  const feedback = (guess: boolean, actual: boolean) =>
    guess === actual
      ? fr
        ? 'Bonne réponse. '
        : 'Correct. '
      : fr
        ? 'À revoir. '
        : 'Try again. ';

  const universalReason =
    domain.length === 0
      ? fr
        ? 'Aucun élément du domaine ne peut violer la règle : vérité par vacuité.'
        : 'No domain element can violate the rule: vacuous truth.'
      : result.universal
        ? fr
          ? 'Chaque élément du domaine vérifie P.'
          : 'Every element of the domain satisfies P.'
        : fr
          ? 'Au moins un élément du domaine échoue au test.'
          : 'At least one element of the domain fails the test.';

  const existentialReason = result.existential
    ? fr
      ? 'Au moins un élément du domaine vérifie P.'
      : 'At least one element of the domain satisfies P.'
    : fr
      ? 'Aucun élément du domaine ne vérifie P.'
      : 'No element of the domain satisfies P.';

  return (
    <section className="l11-lab" aria-labelledby={id} data-quantifier-lab>
      <h3 id={id}>
        {fr ? 'Laboratoire des quantificateurs' : 'Quantifier laboratory'}
      </h3>
      <p>
        {fr
          ? 'Choisissez le domaine et le prédicat. Calculez P(x), prédisez les deux assertions, puis trouvez une preuve.'
          : 'Choose the domain and predicate. Evaluate P(x), predict both assertions, then find evidence.'}
      </p>
      <div className="l11-live" hidden={!ready}>
        <fieldset>
          <legend>
            {fr ? '1. Construire le domaine X' : '1. Build domain X'}
          </legend>
          <div className="l11-controls">
            {universe.map((x) => (
              <label key={x}>
                <input
                  type="checkbox"
                  checked={domain.includes(x)}
                  onChange={() =>
                    changeDomain(
                      domain.includes(x)
                        ? domain.filter((value) => value !== x)
                        : [...domain, x],
                    )
                  }
                />
                {x}
              </label>
            ))}
          </div>
          <p data-domain>
            X = {domain.length ? '{' + domain.join(', ') + '}' : '∅'}
          </p>
          <button type="button" onClick={() => changeDomain([])}>
            {fr ? 'Vider X' : 'Empty X'}
          </button>
        </fieldset>
        <label htmlFor={id + '-predicate'}>
          {fr ? '2. Choisir P(x)' : '2. Choose P(x)'}
        </label>
        <select
          id={id + '-predicate'}
          value={predicate}
          onChange={(event) => {
            const next = event.currentTarget.value;
            if (next === 'even' || next === 'greater' || next === 'square') {
              setPredicate(next);
              clearAnswers();
            }
          }}
        >
          {Object.entries(predicates).map(([key, labels]) => (
            <option key={key} value={key}>
              {labels[fr ? 0 : 1]}
            </option>
          ))}
        </select>
        <table>
          <caption>
            {fr
              ? '3. Évaluer uniquement les éléments de X'
              : '3. Evaluate only members of X'}
          </caption>
          <thead>
            <tr>
              <th scope="col">x</th>
              <th scope="col">P(x)</th>
              <th scope="col">{fr ? 'Action' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {domain.map((x) => (
              <tr key={x}>
                <th scope="row">{x}</th>
                <td>
                  {tested.includes(x)
                    ? truth(evaluatePredicate(predicate, x))
                    : '?'}
                </td>
                <td>
                  <button
                    type="button"
                    aria-label={fr ? 'Tester ' + x : 'Test ' + x}
                    onClick={() =>
                      setTested((previous) =>
                        previous.includes(x) ? previous : [...previous, x],
                      )
                    }
                  >
                    {fr ? 'Tester' : 'Test'}
                  </button>
                </td>
              </tr>
            ))}
            {domain.length === 0 && (
              <tr>
                <td colSpan={3}>
                  {fr ? 'Aucun élément à tester.' : 'No element to test.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {(
          [
            [
              '∀ x ∈ X, P(x)',
              universalGuess,
              setUniversalGuess,
              result.universal,
              universalReason,
            ],
            [
              '∃ x ∈ X, P(x)',
              existentialGuess,
              setExistentialGuess,
              result.existential,
              existentialReason,
            ],
          ] as const
        ).map(([formula, guess, setGuess, actual, reason], index) => (
          <fieldset
            key={formula}
            data-quantifier={index === 0 ? 'all' : 'some'}
          >
            <legend>{formula}</legend>
            <div className="l11-controls">
              {[true, false].map((value) => (
                <button
                  type="button"
                  key={String(value)}
                  aria-pressed={guess === value}
                  onClick={() => setGuess(value)}
                >
                  {truth(value)}
                </button>
              ))}
            </div>
            <p role="status" aria-atomic="true">
              {guess !== null &&
                feedback(guess, actual) + truth(actual) + '. ' + reason}
            </p>
          </fieldset>
        ))}
        <EvidenceQuestion
          key={'w' + revision}
          fr={fr}
          domain={domain}
          predicate={predicate}
          kind="witness"
        />
        <EvidenceQuestion
          key={'c' + revision}
          fr={fr}
          domain={domain}
          predicate={predicate}
          kind="counterexample"
        />
        <button
          type="button"
          onClick={() => {
            setPredicate('even');
            changeDomain([1, 2, 4]);
          }}
        >
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>
      </div>
      <div className="l11-static" hidden={ready}>
        <p>
          {fr
            ? 'Exemple fixe : P(x) signifie « x est pair ».'
            : 'Fixed example: P(x) means “x is even”.'}
        </p>
        <p>X = {'{1, 2, 4}'} : ∀ = 0, ∃ = 1 ; P(1) = 0, P(2) = P(4) = 1.</p>
        <p>X = ∅ : ∀ = 1, ∃ = 0.</p>
      </div>
    </section>
  );
}
