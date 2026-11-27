import {
  assignments,
  evaluate,
  formulaText,
  type Assignment,
  type Formula,
  type Variable,
} from './l04-boolean.ts';

const not = (term: Formula): Formula => ({ op: 'not', term });
const and = (left: Formula, right: Formula): Formula => ({
  op: 'and',
  left,
  right,
});
const or = (left: Formula, right: Formula): Formula => ({
  op: 'or',
  left,
  right,
});

type Example = {
  id: string;
  variables: Variable[];
  formula: Formula;
};

/** Public examples, not imported from any graded bank. */
export const truthExamples: Example[] = [
  {
    id: 'source',
    variables: ['A', 'B'],
    formula: and('A', or('B', not('A'))),
  },
  {
    id: 'negated',
    variables: ['A', 'B'],
    formula: not(and('A', not('B'))),
  },
  {
    id: 'three',
    variables: ['A', 'B', 'C'],
    formula: and(or('A', not('B')), or('B', 'C')),
  },
];

/** Postorder traversal ensures each operand precedes its parent column. */
export function truthColumns(formula: Formula): Formula[] {
  const result: Formula[] = [];
  const seen = new Set<string>();
  function visit(node: Formula) {
    if (typeof node !== 'object') return;
    if (node.op === 'not') visit(node.term);
    else {
      visit(node.left);
      visit(node.right);
    }
    const key = formulaText(node);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(node);
    }
  }
  visit(formula);
  return result.length ? result : [formula];
}

export function columnLabel(formula: Formula) {
  const text = formulaText(formula);
  return text.startsWith('(') ? text.slice(1, -1) : text;
}

export function buildTruthTable(example: Example) {
  const rows = assignments(example.variables);
  const columns = truthColumns(example.formula);
  const values = columns.map((column) =>
    rows.map((row) => Number(evaluate(column, row))),
  );
  return { rows, columns, values };
}

export function operandValues(formula: Formula, row: Assignment) {
  if (typeof formula !== 'object') return [];
  const operands =
    formula.op === 'not' ? [formula.term] : [formula.left, formula.right];
  return operands.map(
    (operand) => columnLabel(operand) + ' = ' + Number(evaluate(operand, row)),
  );
}

/** Return the earliest missing or wrong entry in the active column. */
export function firstColumnIssue(
  answers: readonly string[],
  expected: readonly number[],
) {
  const row = expected.findIndex((value, i) => answers[i] !== String(value));
  if (row === -1) return null;
  return { row, missing: !answers[row], expected: expected[row]! };
}
