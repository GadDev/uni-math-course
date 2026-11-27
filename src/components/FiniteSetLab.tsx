import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  even,
  powerSet,
  predicateSummary,
  setResult,
  type SetOperation,
} from '../lib/finite-set-learning';
import '../styles/finite-set-learning.css';

type Lesson = 'L11' | 'L12' | 'L13' | 'L14' | 'L15';
const setText = (values: readonly (string | number)[]) =>
  values.length ? `{${values.join(', ')}}` : '∅';
const domains = [[0, 1, 2], [0, 2], []] as const;
const filters = [[0, 1, 2, 3, 4, 5], [1, 3, 5], []] as const;
const bases = [['a', 'b'], ['a'], []] as const;
const ambients = [[0, 1, 2, 3], [0, 1, 2, 3, 4], []] as const;
const operationLabels = {
  union: 'A ∪ B',
  intersection: 'A ∩ B',
  'outside-union': 'C ∖ (A ∪ B)',
  'outside-intersection': 'C ∖ (A ∩ B)',
};

export default function FiniteSetLab({
  lesson,
  locale,
}: {
  lesson: Lesson;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState(0);
  const [quantifier, setQuantifier] = useState('all');
  const [operation, setOperation] = useState<SetOperation>('outside-union');
  const [target, setTarget] = useState(3);
  const [prediction, setPrediction] = useState('');
  const [checked, setChecked] = useState(false);
  useEffect(() => setReady(true), []);
  const clear = () => {
    setPrediction('');
    setChecked(false);
  };
  const reset = () => {
    setPreset(0);
    setQuantifier('all');
    setOperation('outside-union');
    setTarget(3);
    clear();
  };
  const domain =
    lesson === 'L13'
      ? filters[preset]!
      : lesson === 'L15'
        ? ambients[preset]!
        : domains[preset]!;
  const summary = predicateSummary(domain);
  const base = bases[preset]!;
  const subsets = powerSet(base);
  const a = domain.filter((x) => x === 0 || x === 2);
  const b = domain.filter((x) => x === 1 || x === 2);
  const result =
    lesson === 'L15' ? setResult(domain, a, b, operation) : domain.filter(even);
  const quantified = quantifier === 'all' ? summary.all : summary.some;
  const truth =
    lesson === 'L11'
      ? quantified
      : lesson === 'L12'
        ? !quantified
        : lesson === 'L13'
          ? result.includes(0)
          : lesson === 'L14'
            ? subsets.length === 4
            : result.includes(target);
  const question =
    lesson === 'L11' || lesson === 'L12'
      ? `${lesson === 'L12' ? '¬(' : ''}${quantifier === 'all' ? '∀' : '∃'}x ∈ X, P(x)${lesson === 'L12' ? ')' : ''}`
      : lesson === 'L13'
        ? '0 ∈ {x ∈ X | P(x)}'
        : lesson === 'L14'
          ? '|𝒫(A)| = 4'
          : `${target} ∈ ${operationLabels[operation]}`;
  const bool = (value: boolean) =>
    value ? (fr ? 'vrai' : 'true') : fr ? 'faux' : 'false';
  const resultText =
    lesson === 'L14'
      ? `A = ${setText(base)}; 𝒫(A) = {${subsets.map(setText).join(', ')}}; |𝒫(A)| = ${subsets.length}.`
      : lesson === 'L15'
        ? `C = ${setText(domain)}; A = ${setText(a)}; B = ${setText(b)}; ${operationLabels[operation]} = ${setText(result)}.`
        : `X = ${setText(domain)}; {x ∈ X | P(x)} = ${setText(result)}.`;
  const explanation =
    lesson === 'L11' || lesson === 'L12'
      ? fr
        ? `Témoins de P : ${setText(summary.witnesses)}. Contre-exemples à « tous vérifient P » : ${setText(summary.counterexamples)}. ∀ vaut ${bool(summary.all)}, ∃ vaut ${bool(summary.some)}. ${lesson === 'L12' ? 'NON inverse la vérité de toute l’assertion.' : 'Un témoin suffit à ∃ ; aucun contre-exemple ne doit exister pour ∀.'}`
        : `Witnesses for P: ${setText(summary.witnesses)}. Counterexamples to “all satisfy P”: ${setText(summary.counterexamples)}. ∀ is ${bool(summary.all)}, ∃ is ${bool(summary.some)}. ${lesson === 'L12' ? 'NOT reverses the truth of the entire assertion.' : 'One witness suffices for ∃; ∀ allows no counterexample.'}`
      : lesson === 'L13'
        ? fr
          ? 'Un élément est gardé seulement s’il appartient au domaine ET réussit le test. Zéro est pair, mais il doit aussi être candidat.'
          : 'Keep an element only if it is in the domain AND passes the test. Zero is even, but it must also be a candidate.'
        : lesson === 'L14'
          ? fr
            ? 'Deux choix par élément : garder ou non. Avec zéro élément, on obtient encore une partie : ∅.'
            : 'Two choices per element: include or exclude. With zero elements, there is still one subset: ∅.'
          : fr
            ? 'Le complément est pris dans C. Un objet hors de C ne peut appartenir à aucun résultat de cet outil. Comparez les deux expressions de de Morgan sur papier.'
            : 'Complements are relative to C. An object outside C cannot belong to any result in this tool. Compare both De Morgan expressions on paper.';
  return (
    <section
      className="finite-lab"
      data-finite-lab={lesson}
      aria-label={fr ? 'Atelier sur un modèle fini' : 'Finite-model workshop'}
    >
      <p>
        {fr
          ? 'Prédisez, vérifiez, puis expliquez une ligne du tableau. Cet entraînement public ne sauvegarde pas de score.'
          : 'Predict, check, then explain one table row. This public practice does not save a score.'}
      </p>
      <fieldset hidden={!ready}>
        <legend>{fr ? 'Choisir le modèle' : 'Choose the model'}</legend>
        <label htmlFor={`${lesson}-domain`}>
          {lesson === 'L14' ? 'A' : lesson === 'L15' ? 'C' : 'X'}
        </label>
        <select
          id={`${lesson}-domain`}
          value={preset}
          onChange={(event) => {
            setPreset(Number(event.target.value));
            clear();
          }}
        >
          {(lesson === 'L14'
            ? bases
            : lesson === 'L15'
              ? ambients
              : lesson === 'L13'
                ? filters
                : domains
          ).map((values, i) => (
            <option key={i} value={i}>
              {setText(values)}
            </option>
          ))}
        </select>
        {(lesson === 'L11' || lesson === 'L12') && (
          <>
            <label htmlFor={`${lesson}-quantifier`}>
              {fr ? 'Quantificateur' : 'Quantifier'}
            </label>
            <select
              id={`${lesson}-quantifier`}
              value={quantifier}
              onChange={(event) => {
                setQuantifier(event.target.value);
                clear();
              }}
            >
              <option value="all">∀</option>
              <option value="some">∃</option>
            </select>
          </>
        )}
        {lesson === 'L15' && (
          <>
            <label htmlFor={`${lesson}-operation`}>
              {fr ? 'Opération' : 'Operation'}
            </label>
            <select
              id={`${lesson}-operation`}
              value={operation}
              onChange={(event) => {
                setOperation(event.target.value as SetOperation);
                clear();
              }}
            >
              {Object.entries(operationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <label htmlFor={`${lesson}-target`}>
              {fr ? 'Élément testé' : 'Element to test'}
            </label>
            <select
              id={`${lesson}-target`}
              value={target}
              onChange={(event) => {
                setTarget(Number(event.target.value));
                clear();
              }}
            >
              {[0, 1, 2, 3, 4].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </>
        )}
        {lesson !== 'L14' && lesson !== 'L15' && (
          <p>P(x) : {fr ? 'x est pair' : 'x is even'}.</p>
        )}
        {lesson === 'L14' && (
          <p>
            {fr
              ? 'Les barres |𝒫(A)| donnent le nombre de parties de A.'
              : 'The bars |𝒫(A)| give the number of subsets of A.'}
          </p>
        )}
        <p data-finite-question>{question}</p>
        <label htmlFor={`${lesson}-prediction`}>
          {fr ? 'Votre prédiction' : 'Your prediction'}
        </label>
        <select
          id={`${lesson}-prediction`}
          value={prediction}
          onChange={(event) => {
            setPrediction(event.target.value);
            setChecked(false);
          }}
        >
          <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
          <option value="true">{fr ? 'Vrai' : 'True'}</option>
          <option value="false">{fr ? 'Faux' : 'False'}</option>
        </select>
        <div className="finite-actions">
          <button
            type="button"
            disabled={!prediction}
            onClick={() => setChecked(true)}
          >
            {fr ? 'Vérifier' : 'Check'}
          </button>
          <button type="button" onClick={reset}>
            {fr ? 'Recommencer' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <p role="status" className="finite-feedback">
        {checked
          ? `${(prediction === 'true') === truth ? (fr ? 'Exact.' : 'Correct.') : fr ? 'À revoir.' : 'Try again.'} ${question} : ${bool(truth)}. ${explanation}`
          : ''}
      </p>
      <div data-finite-results hidden={ready && !checked}>
        <p data-finite-result>{resultText}</p>
        {lesson !== 'L14' && (
          <table>
            <caption>
              {fr ? 'Vérification élément par élément' : 'Check each element'}
            </caption>
            <thead>
              <tr>
                <th scope="col">x</th>
                {lesson === 'L15' ? (
                  <>
                    <th scope="col">x ∈ A</th>
                    <th scope="col">x ∈ B</th>
                  </>
                ) : (
                  <th scope="col">P(x)</th>
                )}
                <th scope="col">
                  {lesson === 'L11' || lesson === 'L12'
                    ? fr
                      ? 'Témoin de P'
                      : 'Witness for P'
                    : lesson === 'L15'
                      ? fr
                        ? 'Dans le résultat'
                        : 'In result'
                      : fr
                        ? 'Gardé'
                        : 'Kept'}
                </th>
              </tr>
            </thead>
            <tbody>
              {domain.map((x) => (
                <tr key={x}>
                  <th scope="row">{x}</th>
                  {lesson === 'L15' ? (
                    <>
                      <td>{bool(a.includes(x))}</td>
                      <td>{bool(b.includes(x))}</td>
                    </>
                  ) : (
                    <td>{bool(even(x))}</td>
                  )}
                  <td>{bool(result.includes(x))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {domain.length === 0 && lesson !== 'L14' && (
          <p>
            {fr
              ? 'Domaine vide : aucune ligne, aucun témoin, aucun contre-exemple.'
              : 'Empty domain: no rows, no witness, no counterexample.'}
          </p>
        )}
      </div>
      <details className="finite-static">
        <summary>
          {fr
            ? 'Exemple fixe et explication pour le papier'
            : 'Fixed example and explanation for paper'}
        </summary>
        <p>
          {lesson === 'L14'
            ? 'A = {a,b}; 𝒫(A) = {∅, {a}, {b}, {a,b}}.'
            : lesson === 'L15'
              ? 'C = {0,1,2,3}; A = {0,2}; B = {1,2}; C ∖ (A ∪ B) = {3}.'
              : 'X = {0,1,2}; P(0) = 1, P(1) = 0, P(2) = 1; ∀ = 0, ∃ = 1; ¬∀ = 1, ¬∃ = 0.'}
        </p>
        <p>
          {fr
            ? 'Sans JavaScript, ce modèle fixe et les corrections dépliables de la leçon restent utilisables.'
            : 'Without JavaScript, this fixed model and the lesson’s expandable corrections remain usable.'}
        </p>
      </details>
    </section>
  );
}
