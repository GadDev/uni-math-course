import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import '../styles/l10-sets.css';

const objects = [
  { label: '0', elements: null },
  { label: '1', elements: null },
  { label: '2', elements: null },
  { label: '∅', elements: [] },
  { label: '{0}', elements: ['0'] },
  { label: '{1}', elements: ['1'] },
  { label: '{1, 2}', elements: ['1', '2'] },
  { label: '{∅}', elements: ['∅'] },
] as const;

const presets: readonly (readonly string[])[] = [
  ['1', '2'],
  ['0', '{0}'],
  ['1', '{1}', '∅'],
  ['∅'],
  [],
];

function notation(elements: readonly string[]) {
  return elements.length ? '{' + elements.join(', ') + '}' : '∅';
}

export default function SetExplorer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(0);
  const [object, setObject] = useState(5);
  const [memberGuess, setMemberGuess] = useState<boolean | null>(null);
  const [subsetGuess, setSubsetGuess] = useState<boolean | null>(null);
  useEffect(() => setReady(true), []);

  const a = presets[preset]!;
  const candidate = objects[object]!;
  const member = a.includes(candidate.label);
  const missing = candidate.elements?.find((element) => !a.includes(element));
  const subset = candidate.elements === null ? null : missing === undefined;

  function clearGuesses() {
    setMemberGuess(null);
    setSubsetGuess(null);
  }
  const truth = (value: boolean) =>
    value ? (fr ? 'Vrai' : 'True') : fr ? 'Faux' : 'False';
  const feedback = (guess: boolean, result: boolean) =>
    guess === result
      ? fr
        ? 'Bonne réponse. '
        : 'Correct. '
      : fr
        ? 'À revoir. '
        : 'Try again. ';

  return (
    <section className="l10-lab" aria-labelledby={id} data-set-explorer>
      <h3 id={id}>{fr ? 'Laboratoire des ensembles' : 'Set laboratory'}</h3>
      <p>
        {fr
          ? 'Choisissez A et un objet à tester. Prédisez séparément les réponses : un ensemble peut être un élément, un sous-ensemble, les deux ou aucun des deux.'
          : 'Choose A and an object to test. Predict each answer separately: a set can be an element, a subset, both or neither.'}
      </p>
      <div className="l10-live" hidden={!ready}>
        <label htmlFor={id + '-preset'}>{fr ? 'Ensemble A' : 'Set A'}</label>
        <select
          id={id + '-preset'}
          value={preset}
          onChange={(event) => {
            setPreset(Number(event.currentTarget.value));
            clearGuesses();
          }}
        >
          {presets.map((elements, index) => (
            <option key={index} value={index}>
              {notation(elements)}
            </option>
          ))}
        </select>
        <figure className="l10-box">
          <figcaption>A = {notation(a)}</figcaption>
          <div className="l10-elements">
            {a.length ? (
              a.map((element) => (
                <span className="l10-token" key={element}>
                  {element}
                </span>
              ))
            ) : (
              <span>{fr ? 'Aucun élément' : 'No elements'}</span>
            )}
          </div>
          <p>
            {fr
              ? 'Chaque tuile est un élément direct de A.'
              : 'Each tile is a direct element of A.'}
          </p>
        </figure>
        <label htmlFor={id + '-object'}>
          {fr ? 'Objet à tester' : 'Object to test'}
        </label>
        <select
          id={id + '-object'}
          value={object}
          onChange={(event) => {
            setObject(Number(event.currentTarget.value));
            clearGuesses();
          }}
        >
          {objects.map((entry, index) => (
            <option key={entry.label} value={index}>
              {entry.label}
            </option>
          ))}
        </select>
        <fieldset>
          <legend>{candidate.label} ∈ A ?</legend>
          <div className="l10-actions">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={memberGuess === value}
                onClick={() => setMemberGuess(value)}
              >
                {truth(value)}
              </button>
            ))}
          </div>
          <p role="status" aria-atomic="true" data-member-feedback>
            {memberGuess !== null && (
              <>
                <strong>{feedback(memberGuess, member)}</strong>
                {candidate.label} {member ? '∈' : '∉'} A.{' '}
                {member
                  ? fr
                    ? 'Cet objet figure directement parmi les éléments.'
                    : 'This object is listed directly among the elements.'
                  : fr
                    ? 'Cet objet ne figure pas directement parmi les éléments.'
                    : 'This object is not listed directly among the elements.'}
              </>
            )}
          </p>
        </fieldset>
        {subset === null ? (
          <p data-not-applicable>
            {fr
              ? 'Inclusion : non applicable ici. Le candidat est un nombre, pas un ensemble dans la convention du cours.'
              : 'Inclusion: not applicable here. The candidate is a number, not a set in the course convention.'}
          </p>
        ) : (
          <fieldset>
            <legend>{candidate.label} ⊆ A ?</legend>
            <div className="l10-actions">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-pressed={subsetGuess === value}
                  onClick={() => setSubsetGuess(value)}
                >
                  {truth(value)}
                </button>
              ))}
            </div>
            <p role="status" aria-atomic="true" data-subset-feedback>
              {subsetGuess !== null && (
                <>
                  <strong>{feedback(subsetGuess, subset)}</strong>
                  {candidate.label} {subset ? '⊆' : '⊈'} A.{' '}
                  {missing !== undefined
                    ? (fr ? 'Élément manquant : ' : 'Missing element: ') +
                      missing +
                      ' ∉ A.'
                    : candidate.elements?.length === 0
                      ? fr
                        ? 'L’ensemble vide ne contient aucun contre-exemple.'
                        : 'The empty set contains no counterexample.'
                      : fr
                        ? 'Tous les éléments du candidat sont dans A.'
                        : 'Every element of the candidate is in A.'}
                </>
              )}
            </p>
          </fieldset>
        )}
        <button
          type="button"
          onClick={() => {
            setPreset(0);
            setObject(5);
            clearGuesses();
          }}
        >
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>
      </div>
      <div className="l10-static" hidden={ready}>
        <p>
          A = {'{1, 2}'} : {'{1}'} ∉ A ; {'{1}'} ⊆ A.
        </p>
        <p>
          A = {'{0, {0}}'} : {'{0}'} ∈ A ; {'{0}'} ⊆ A.
        </p>
        <p>A = ∅ : ∅ ∉ A ; ∅ ⊆ A.</p>
      </div>
    </section>
  );
}
