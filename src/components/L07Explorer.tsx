import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  assignments,
  biconditional,
  compareRow,
  evidence,
  implies,
  isPairId,
  pairs,
  type Bit,
  type PairId,
} from '../lib/l07-logic';
import '../styles/l07-explorers.css';

function RowExample({ a, b, fr }: { a: Bit; b: Bit; fr: boolean }) {
  const id = useId();
  const forward = implies(a, b);
  const backward = implies(b, a);
  const result = biconditional(a, b);
  const explanation =
    a === b
      ? a === 0
        ? fr
          ? 'Les deux antécédents sont faux : aucune implication n’est contredite. Les deux implications valent 1, donc leur ET vaut 1. Cela ne rend pas A ou B vraie.'
          : 'Both antecedents are false: neither implication is contradicted. Both implications are 1, so their AND is 1. This does not make A or B true.'
        : fr
          ? 'Les deux assertions sont vraies : chaque sens est respecté, donc leur ET vaut 1.'
          : 'Both assertions are true: both directions hold, so their AND is 1.'
      : fr
        ? `Le sens ${forward === 0 ? 'A ⇒ B' : 'B ⇒ A'} échoue : son antécédent vaut 1 et son conséquent vaut 0. Un seul échec suffit à rendre le ET faux.`
        : `Direction ${forward === 0 ? 'A ⇒ B' : 'B ⇒ A'} fails: its antecedent is 1 and its consequent is 0. One failed direction makes the AND false.`;
  return (
    <>
      <figure>
        <svg viewBox="0 0 480 230" role="img" aria-labelledby={`${id}-title`}>
          <title id={`${id}-title`}>
            {`A = ${a}, B = ${b} ; A ⇒ B = ${forward}, B ⇒ A = ${backward} ; A ⇔ B = ${result}`}
          </title>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="15" y="90" width="105" height="58" rx="5" />
            <rect x="360" y="90" width="105" height="58" rx="5" />
            <path d="M68 90V60H413V80m-6-8 6 8 6-8" />
            <path d="M413 148V178H68V158m-6 8 6-8 6 8" />
          </g>
          <g
            fill="currentColor"
            fontFamily="sans-serif"
            fontSize="20"
            textAnchor="middle"
          >
            <text x="68" y="126">
              A = {a}
            </text>
            <text x="413" y="126">
              B = {b}
            </text>
            <text x="240" y="40">
              A ⇒ B = {forward}
            </text>
            <text x="240" y="211">
              B ⇒ A = {backward}
            </text>
            <text x="240" y="110">
              {fr ? 'Deux sens, un ET' : 'Both directions'}
            </text>
            <text x="240" y="141">
              {forward} ∧ {backward} = {result}
            </text>
          </g>
        </svg>
        <figcaption>
          {fr
            ? 'Chaque flèche représente un sens de l’implication. La biconditionnelle exige les deux à la fois ; les nombres donnent le résultat sans dépendre des couleurs.'
            : 'Each arrow represents one direction of implication. The biconditional requires both at once; the numbers convey the result without relying on colour.'}
        </figcaption>
      </figure>
      <div role="status" aria-atomic="true" data-row-result>
        <p className="l07-calculation">
          (A ⇒ B) ∧ (B ⇒ A) = {forward} ∧ {backward} = {result}
        </p>
        <p>{explanation}</p>
      </div>
      <table>
        <caption>
          {fr
            ? 'Les quatre affectations ; la ligne choisie est encadrée.'
            : 'All four assignments; the selected row is outlined.'}
        </caption>
        <thead>
          <tr>
            {['A', 'B', 'A ⇒ B', 'B ⇒ A', 'A ⇔ B'].map((label) => (
              <th scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map(([x, y]) => (
            <tr
              key={`${x}${y}`}
              aria-current={a === x && b === y ? 'true' : undefined}
            >
              <th scope="row">{x}</th>
              <td>{y}</td>
              <td>{implies(x, y)}</td>
              <td>{implies(y, x)}</td>
              <td>{biconditional(x, y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ComparisonTable({
  pair,
  seen,
  current,
  fr,
}: {
  pair: PairId;
  seen: readonly number[];
  current: number;
  fr: boolean;
}) {
  const proof = evidence(pair, seen);
  const witness = proof.counterexample;
  return (
    <>
      <p className="l07-calculation" data-pair-formulas>
        P = {pairs[pair].p} ; Q = {pairs[pair].q}
      </p>
      {pair === 'doubleNegation' && (
        <p>
          {fr
            ? 'Ici, P et Q dépendent seulement de A : changer B ne change rien. Deux lignes suffiraient ; les quatre lignes affichées répètent ces deux cas.'
            : 'Here P and Q depend only on A: changing B has no effect. Two rows would suffice; the four displayed rows repeat those two cases.'}
        </p>
      )}
      <table>
        <caption>
          {fr
            ? 'Comparer P et Q, puis leur biconditionnelle. « ? » signifie : ligne non examinée.'
            : 'Compare P and Q, then their biconditional. “?” means: row not examined.'}
        </caption>
        <thead>
          <tr>
            {['A', 'B', 'P', 'Q', 'P ⇔ Q'].map((label) => (
              <th scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map(([a, b], i) => {
            const row = compareRow(pair, a, b);
            return (
              <tr
                key={i}
                data-examined={seen.includes(i)}
                aria-current={current === i ? 'true' : undefined}
              >
                <th scope="row">{a}</th>
                <td>{b}</td>
                {[row.p, row.q, row.agreement].map((value, j) => (
                  <td key={j}>
                    {seen.includes(i) ? (
                      value
                    ) : (
                      <span aria-label={fr ? 'Non examinée' : 'Not examined'}>
                        ?
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p role="status" aria-atomic="true" data-evidence={proof.state}>
        <strong>
          {fr
            ? `${proof.count}/4 lignes examinées. `
            : `${proof.count}/4 rows examined. `}
        </strong>
        {witness
          ? fr
            ? `Équivalence réfutée : pour A = ${witness.a}, B = ${witness.b}, P = ${witness.p} et Q = ${witness.q}. Donc P ⇔ Q = 0. Cette seule ligne suffit.`
            : `Equivalence refuted: at A = ${witness.a}, B = ${witness.b}, P = ${witness.p} and Q = ${witness.q}. So P ⇔ Q = 0. This single row suffices.`
          : proof.state === 'proved'
            ? fr
              ? 'Équivalence établie par table exhaustive : P ⇔ Q vaut 1 sur toutes les affectations. Donc P ≡ Q. Les formules choisies n’ont pas d’autre variable.'
              : 'Equivalence established by an exhaustive table: P ⇔ Q is 1 on every assignment. Therefore P ≡ Q. The selected formulas have no other variables.'
            : fr
              ? 'Accord sur les lignes examinées, mais conclusion encore impossible : il reste des affectations à vérifier. Un accord local ne suffit pas.'
              : 'Agreement on the examined rows, but no conclusion yet: some assignments remain unchecked. Local agreement is not enough.'}
      </p>
    </>
  );
}

export default function L07Explorer({
  kind,
  locale,
}: {
  kind: 'row' | 'equivalence';
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const [pair, setPair] = useState<PairId>('converse');
  const [seen, setSeen] = useState<number[]>([0]);
  const [current, setCurrent] = useState(0);
  useEffect(() => setReady(true), []);
  const prediction: Record<PairId, string> = fr
    ? {
        converse:
          'Au départ, les deux implications valent 1 pour A = B = 0. Sont-elles équivalentes pour autant ? Choisissez une autre ligne avant de conclure.',
        implication:
          'Que vaudra P ⇔ Q à la ligne A = 1, B = 0, où P et Q sont toutes deux fausses ? Vérifiez ensuite toutes les lignes.',
        deMorgan:
          'Quand A et B valent 1, que valent P, Q et leur biconditionnelle ? Cet accord suffit-il à lui seul à établir l’équivalence ?',
        wrongMorgan:
          'Le ET à droite peut-il remplacer le OU de la loi de Morgan ? Cherchez une ligne où une seule entrée est vraie.',
        doubleNegation:
          'Quand A est fausse, P et Q le sont aussi. Que vaut leur biconditionnelle ? Est-ce compatible avec une équivalence ?',
      }
    : {
        converse:
          'Initially, both implications are 1 at A = B = 0. Does that make them equivalent? Choose another row before concluding.',
        implication:
          'What will P ⇔ Q be at A = 1, B = 0, where P and Q are both false? Then check every row.',
        deMorgan:
          'When A and B are 1, what are P, Q and their biconditional? Is this agreement alone enough to establish equivalence?',
        wrongMorgan:
          'Can AND on the right replace OR in De Morgan’s law? Look for a row with exactly one true input.',
        doubleNegation:
          'When A is false, P and Q are false too. What is their biconditional? Is this compatible with equivalence?',
      };
  const reset = () => {
    setA(0);
    setB(0);
    setPair('converse');
    setSeen([0]);
    setCurrent(0);
  };
  return (
    <section
      className="l07-lab"
      data-l07-lab={kind}
      aria-labelledby={`${id}-title`}
    >
      <p id={`${id}-title`} className="l07-lab-title">
        {kind === 'row'
          ? fr
            ? 'À vous : faire fonctionner les deux sens'
            : 'Your turn: make both directions work'
          : fr
            ? 'À vous : une ligne ou toute la table ?'
            : 'Your turn: one row or the whole table?'}
      </p>
      <p>
        {kind === 'row'
          ? fr
            ? 'Objectif : relier les valeurs de A et B aux deux implications, puis à leur ET.'
            : 'Goal: connect the values of A and B to both implications, then to their AND.'
          : fr
            ? 'Objectif : distinguer une observation, un contre-exemple et une vérification exhaustive.'
            : 'Goal: distinguish an observation, a counterexample and an exhaustive check.'}
      </p>
      <p id={`${id}-prediction`} className="l07-prediction">
        <strong>{fr ? 'Prédisez : ' : 'Predict: '}</strong>
        {kind === 'row'
          ? fr
            ? 'A = B = 0 au départ. Si vous changez seulement A en 1, quel sens échoue ? Et si vous mettez ensuite B à 1 ?'
            : 'Start with A = B = 0. If you change only A to 1, which direction fails? What if you then set B to 1?'
          : prediction[pair]}
      </p>
      <div className="l07-live" hidden={!ready}>
        <fieldset disabled={!ready} aria-describedby={`${id}-prediction`}>
          <legend>{fr ? 'Manipuler les valeurs' : 'Change the values'}</legend>
          {kind === 'row' ? (
            <div className="l07-controls">
              {(['A', 'B'] as const).map((label) => (
                <label key={label}>
                  {fr ? `Valeur de ${label}` : `Value of ${label}`}
                  <select
                    value={label === 'A' ? a : b}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      if (value === '0' || value === '1')
                        (label === 'A' ? setA : setB)(Number(value) as Bit);
                    }}
                  >
                    <option value="0">0 — {fr ? 'faux' : 'false'}</option>
                    <option value="1">1 — {fr ? 'vrai' : 'true'}</option>
                  </select>
                </label>
              ))}
            </div>
          ) : (
            <>
              <label htmlFor={`${id}-pair`}>
                {fr ? 'Formules à comparer' : 'Formulas to compare'}
              </label>
              <select
                id={`${id}-pair`}
                value={pair}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  if (isPairId(value)) {
                    setPair(value);
                    setSeen([0]);
                    setCurrent(0);
                  }
                }}
              >
                {Object.entries(pairs).map(([key, value]) => (
                  <option key={key} value={key}>
                    P : {value.p} ; Q : {value.q}
                  </option>
                ))}
              </select>
              <div className="l07-actions">
                {assignments.map(([x, y], i) => (
                  <button
                    type="button"
                    key={i}
                    aria-pressed={current === i}
                    data-examine={i}
                    onClick={() => {
                      setCurrent(i);
                      setSeen((previous) =>
                        previous.includes(i) ? previous : [...previous, i],
                      );
                    }}
                  >
                    {fr ? 'Examiner' : 'Examine'} A={x}, B={y}
                    {seen.includes(i) ? ' ✓' : ''}
                  </button>
                ))}
              </div>
            </>
          )}
          <button type="button" className="l07-reset" onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </fieldset>
        {kind === 'row' ? (
          <RowExample a={a} b={b} fr={fr} />
        ) : (
          <ComparisonTable pair={pair} seen={seen} current={current} fr={fr} />
        )}
      </div>
      <div className="l07-static" hidden={ready}>
        <p>
          <strong>
            {fr
              ? 'Exemple de référence, conservé à l’impression.'
              : 'Reference example, retained in print.'}
          </strong>
        </p>
        {kind === 'row' ? (
          <RowExample a={0} b={0} fr={fr} />
        ) : (
          <ComparisonTable
            pair="converse"
            seen={[0, 1, 2, 3]}
            current={1}
            fr={fr}
          />
        )}
        <p>
          {fr
            ? 'Sans JavaScript, cet exemple reste lisible ; activez-le pour manipuler les valeurs.'
            : 'This example remains readable without JavaScript; enable it to change the values.'}
        </p>
      </div>
      <p>
        <strong>{fr ? 'Pour expliquer : ' : 'Explain: '}</strong>
        {kind === 'row'
          ? fr
            ? 'Pourquoi A ⇔ B peut-elle être vraie alors que A et B sont fausses ? Pourquoi A ∧ B ne conviendrait-elle pas ?'
            : 'Why can A ⇔ B be true when A and B are false? Why would A ∧ B not work?'
          : fr
            ? 'Essayez aussi P = A et Q = ¬¬A. Pourquoi les deux formules peuvent-elles être équivalentes sans être des tautologies ?'
            : 'Also try P = A and Q = ¬¬A. Why can the formulas be equivalent without being tautologies?'}
      </p>
      <p className="l07-note">
        {fr
          ? 'Exploration publique, sans compte ni note enregistrée. Une expérience illustre ; la vérification de toutes les affectations d’une table finie constitue ici une preuve.'
          : 'Public exploration, with no account or saved grade. An experiment illustrates; checking every assignment in a finite truth table constitutes a proof here.'}
      </p>
    </section>
  );
}
