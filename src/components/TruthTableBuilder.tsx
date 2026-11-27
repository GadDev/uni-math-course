import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  buildTruthTable,
  columnLabel,
  firstColumnIssue,
  operandValues,
  truthExamples,
} from '../lib/truth-table-builder';
import '../styles/truth-table-builder.css';

export default function TruthTableBuilder({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [errorRow, setErrorRow] = useState<number | null>(null);
  useEffect(() => setReady(true), []);

  const example = truthExamples[index]!;
  const { rows, columns, values } = buildTruthTable(example);
  const complete = active === columns.length;
  const name = (row: (typeof rows)[number]) =>
    example.variables.map((variable) => Number(row[variable])).join('');

  function reset(next: number) {
    setIndex(next);
    setActive(0);
    setAnswers([]);
    setFeedback('');
    setErrorRow(null);
  }

  function check() {
    if (complete) return;
    const issue = firstColumnIssue(answers, values[active]!);
    if (issue) {
      const label = columnLabel(columns[active]!);
      const row = rows[issue.row]!;
      const prefix =
        (fr ? 'Ligne ' : 'Row ') + name(row) + ' — ' + label + ': ';
      const operands = operandValues(columns[active]!, row).join(' ; ');
      setErrorRow(issue.row);
      setFeedback(
        prefix +
          (issue.missing
            ? fr
              ? 'cellule vide. '
              : 'empty cell. '
            : fr
              ? 'valeur incorrecte. '
              : 'incorrect value. ') +
          operands +
          (operands ? '. ' : '') +
          (fr ? 'Recalculez cette opération.' : 'Recompute this operation.'),
      );
      return;
    }
    setActive(active + 1);
    setAnswers([]);
    setErrorRow(null);
    setFeedback(
      active + 1 === columns.length
        ? fr
          ? 'Table complète : toutes les colonnes sont correctes.'
          : 'Table complete: every column is correct.'
        : fr
          ? 'Colonne correcte. Passez à la suivante.'
          : 'Correct column. Continue to the next one.',
    );
  }

  return (
    <section className="truth-builder" data-truth-builder aria-labelledby={id}>
      <p id={id}>
        <strong>
          {fr ? 'Atelier : construire une table' : 'Workshop: build a table'}
        </strong>
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>
          {fr ? 'Construire colonne par colonne' : 'Build column by column'}
        </legend>
        <label htmlFor={id + '-example'}>{fr ? 'Exemple' : 'Example'}</label>
        <select
          id={id + '-example'}
          data-truth-example
          value={index}
          onChange={(event) => reset(Number(event.target.value))}
        >
          {truthExamples.map((item, i) => (
            <option key={item.id} value={i}>
              {columnLabel(item.formula)}
            </option>
          ))}
        </select>
        <p data-truth-progress>
          {active}/{columns.length}{' '}
          {fr ? 'colonnes validées' : 'columns checked'}
        </p>
        <p>
          {complete
            ? fr
              ? 'Toutes les colonnes sont validées.'
              : 'Every column is checked.'
            : (fr ? 'Colonne à calculer : ' : 'Column to calculate: ') +
              columnLabel(columns[active]!)}
        </p>
        <div
          className="truth-builder-scroll"
          role="region"
          aria-label={fr ? 'Table de vérité' : 'Truth table'}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {example.variables.map((variable) => (
                  <th key={variable} scope="col">
                    {variable}
                  </th>
                ))}
                {columns.map((column, i) => (
                  <th key={i} scope="col" data-active={i === active}>
                    {columnLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={name(row)}>
                  {example.variables.map((variable) => (
                    <td key={variable}>{Number(row[variable])}</td>
                  ))}
                  {columns.map((column, ci) => (
                    <td key={ci} data-active={ci === active}>
                      {ci < active ? (
                        values[ci]![ri]
                      ) : ci === active ? (
                        <select
                          data-truth-cell={ri}
                          aria-label={
                            (fr ? 'Ligne ' : 'Row ') +
                            name(row) +
                            ', ' +
                            columnLabel(column)
                          }
                          aria-invalid={errorRow === ri}
                          value={answers[ri] ?? ''}
                          onChange={(event) => {
                            const next = [...answers];
                            next[ri] = event.target.value;
                            setAnswers(next);
                            setErrorRow(null);
                            setFeedback('');
                          }}
                        >
                          <option value="">?</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      ) : (
                        <span aria-label={fr ? 'Non disponible' : 'Locked'}>
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p role="status" aria-atomic="true" data-truth-feedback>
          {feedback}
        </p>
        <div className="truth-builder-actions">
          <button
            type="button"
            data-truth-check
            disabled={complete}
            onClick={check}
          >
            {fr ? 'Vérifier la colonne' : 'Check column'}
          </button>
          <button type="button" data-truth-reset onClick={() => reset(index)}>
            {fr ? 'Recommencer' : 'Restart'}
          </button>
        </div>
      </fieldset>
      <p data-truth-static hidden={ready}>
        {fr
          ? 'Sans JavaScript, utilisez la table complétée de la page 14 dans la partie Calculer.'
          : 'Without JavaScript, use the completed page 14 table in the Calculate section.'}
      </p>
      <p className="truth-builder-print">
        {fr
          ? 'Sur papier : reprendre la table de la page 14, cacher les résultats et recalculer chaque colonne.'
          : 'On paper: use the page 14 table, cover the answers and recalculate each column.'}
      </p>
    </section>
  );
}
