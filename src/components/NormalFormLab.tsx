import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  canonicalDnf,
  firstMismatch,
  joinChoices,
  minterm,
  normalExamples,
  normalText,
  orNot,
  rowBits,
  trueRows,
} from '../lib/normal-form';
import '../styles/normal-form-lab.css';

export default function NormalFormLab({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [termIndex, setTermIndex] = useState(0);
  const [signs, setSigns] = useState<string[]>([]);
  const [choice, setChoice] = useState('');
  const [feedback, setFeedback] = useState('');
  useEffect(() => setReady(true), []);
  const example = normalExamples[index]!;
  const rows = trueRows(example.outputs);
  const count = example.variables.length;
  const names = ['x', 'y', 'z'].slice(0, count);
  const current = rows[termIndex];
  const choices =
    stage === 2
      ? joinChoices(example)
      : stage === 3
        ? [example.simplified, example.wrong]
        : [orNot(example.simplified), orNot(example.wrong)];
  const labels = fr
    ? ['Lignes vraies', 'Mintermes', 'FND', 'Simplifier', 'OU et NON']
    : ['True rows', 'Minterms', 'DNF', 'Simplify', 'OR and NOT'];

  function reset(next: number) {
    setIndex(next);
    setStage(0);
    setSelected([]);
    setTermIndex(0);
    setSigns([]);
    setChoice('');
    setFeedback('');
  }

  function check() {
    if (stage === 0) {
      const wrong = [...example.outputs].findIndex(
        (value, i) => selected.includes(i) !== (value === '1'),
      );
      if (wrong >= 0) {
        setFeedback(
          (fr ? 'Revoir la ligne ' : 'Check row ') +
            rowBits(wrong, count) +
            ' : f = ' +
            example.outputs[wrong],
        );
        return;
      }
      setStage(rows.length ? 1 : 2);
      setFeedback(fr ? 'Lignes correctes.' : 'Correct rows.');
    } else if (stage === 1 && current !== undefined) {
      const bits = rowBits(current, count);
      const wrong = [...bits].findIndex((bit, i) => signs[i] !== bit);
      if (wrong >= 0) {
        setFeedback(
          (fr ? 'Revoir le littéral ' : 'Check literal ') +
            names[wrong] +
            ' : ' +
            bits[wrong] +
            (bits[wrong] === '0'
              ? fr
                ? ' → lettre niée.'
                : ' → negated letter.'
              : fr
                ? ' → lettre positive.'
                : ' → positive letter.'),
        );
        return;
      }
      setSigns([]);
      setTermIndex(termIndex + 1);
      if (termIndex + 1 === rows.length) setStage(2);
      setFeedback(fr ? 'Minterme correct.' : 'Correct minterm.');
    } else if (stage >= 2 && stage <= 4 && choice !== '') {
      const formula = choices[Number(choice)]!;
      const mismatch = firstMismatch(example, formula);
      if (mismatch >= 0) {
        setFeedback(
          (fr ? 'Contre-exemple : ' : 'Counterexample: ') +
            rowBits(mismatch, count) +
            ' ; f = ' +
            example.outputs[mismatch],
        );
        return;
      }
      setStage(stage + 1);
      setChoice('');
      setFeedback(
        stage === 3
          ? example.reason[locale]
          : fr
            ? 'Formule équivalente sur toute la table.'
            : 'Equivalent formula across the whole table.',
      );
    }
  }

  return (
    <section className="normal-lab" data-normal-lab aria-labelledby={id}>
      <p id={id}>
        <strong>{fr ? 'Atelier de forme normale' : 'Normal form lab'}</strong>
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>{fr ? 'Construire pas à pas' : 'Build step by step'}</legend>
        <label htmlFor={id + '-example'}>{fr ? 'Exemple' : 'Example'}</label>
        <select
          id={id + '-example'}
          data-normal-example
          value={index}
          onChange={(event) => reset(Number(event.target.value))}
        >
          {normalExamples.map((item, i) => (
            <option key={item.id} value={i}>
              {item.name[locale]}
            </option>
          ))}
        </select>
        <p data-normal-stage={stage}>
          {stage < 5
            ? stage + 1 + '/5 — ' + labels[stage]
            : fr
              ? 'Construction terminée.'
              : 'Construction complete.'}
        </p>
        <table>
          <thead>
            <tr>
              {names.map((name) => (
                <th key={name} scope="col">
                  {name}
                </th>
              ))}
              <th scope="col">f</th>
              <th scope="col">{fr ? 'Choix' : 'Pick'}</th>
            </tr>
          </thead>
          <tbody>
            {[...example.outputs].map((value, i) => (
              <tr key={i}>
                {[...rowBits(i, count)].map((bit, j) => (
                  <td key={j}>{bit}</td>
                ))}
                <td>{value}</td>
                <td>
                  {stage === 0 ? (
                    <input
                      type="checkbox"
                      data-normal-row={i}
                      aria-label={rowBits(i, count)}
                      checked={selected.includes(i)}
                      onChange={(event) => {
                        setSelected(
                          event.target.checked
                            ? [...selected, i]
                            : selected.filter((row) => row !== i),
                        );
                        setFeedback('');
                      }}
                    />
                  ) : selected.includes(i) ? (
                    '✓'
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stage >= 1 && (
          <div>
            {rows.slice(0, termIndex).map((row) => (
              <p className="normal-formula" key={row}>
                {rowBits(row, count)} :{' '}
                {normalText(minterm(example.variables, row))}
              </p>
            ))}
          </div>
        )}
        {stage === 1 && current !== undefined && (
          <div>
            <p>
              {fr ? 'Construire le minterme de ' : 'Build the minterm for '}
              {rowBits(current, count)}
            </p>
            {names.map((name, i) => (
              <label key={name}>
                {name}
                <select
                  data-normal-sign={i}
                  value={signs[i] ?? ''}
                  onChange={(event) => {
                    const next = [...signs];
                    next[i] = event.target.value;
                    setSigns(next);
                    setFeedback('');
                  }}
                >
                  <option value="">?</option>
                  <option value="0">¬{name}</option>
                  <option value="1">{name}</option>
                </select>
              </label>
            ))}
          </div>
        )}
        {stage >= 3 && (
          <p className="normal-formula">
            FND : {normalText(canonicalDnf(example.variables, example.outputs))}
          </p>
        )}
        {stage >= 4 && (
          <p className="normal-formula">
            {fr ? 'Simplifiée : ' : 'Simplified: '}
            {normalText(example.simplified)}
          </p>
        )}
        {stage >= 2 && stage <= 4 && (
          <div>
            <p>{fr ? 'Choisir la formule' : 'Choose the formula'}</p>
            {[1, 0].map((i) => (
              <label className="normal-choice" key={i}>
                <input
                  type="radio"
                  name={id + '-formula'}
                  data-normal-choice={i}
                  checked={choice === String(i)}
                  onChange={() => {
                    setChoice(String(i));
                    setFeedback('');
                  }}
                />
                <span className="normal-formula">{normalText(choices[i]!)}</span>
              </label>
            ))}
          </div>
        )}
        {stage === 5 && (
          <p className="normal-formula" data-normal-result>
            {normalText(orNot(example.simplified))}
          </p>
        )}
        <p role="status" aria-atomic="true" data-normal-feedback>
          {feedback}
        </p>
        {stage < 5 && (
          <button
            type="button"
            data-normal-check
            disabled={stage >= 2 && choice === ''}
            onClick={check}
          >
            {fr ? 'Vérifier' : 'Check'}
          </button>
        )}
        <button type="button" data-normal-reset onClick={() => reset(index)}>
          {fr ? 'Recommencer' : 'Restart'}
        </button>
      </fieldset>
      <div data-normal-static hidden={ready}>
        <p>
          {fr
            ? 'Exemple fixe du cours : sorties 1 sur 010 et 110.'
            : 'Fixed lecture example: output 1 at 010 and 110.'}
        </p>
        <p className="normal-formula">
          {normalText(canonicalDnf(['A', 'B', 'C'], '00100010'))}
        </p>
        <p className="normal-formula">≡ (y ∧ ¬z) ≡ ¬(¬y ∨ z)</p>
      </div>
    </section>
  );
}
