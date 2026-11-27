import {
  assignments,
  evaluate,
  formulaText,
  type Formula,
  type Variable,
} from './l04-boolean.ts';

const not = (term: Formula): Formula =>
  typeof term === 'object' && term.op === 'not'
    ? term.term
    : { op: 'not', term };
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
const join = (terms: Formula[], op: 'and' | 'or'): Formula =>
  terms.reduce(op === 'and' ? and : or);

export type NormalExample = {
  id: string;
  name: { fr: string; en: string };
  variables: Variable[];
  outputs: string;
  simplified: Formula;
  wrong: Formula;
  reason: { fr: string; en: string };
};

const alwaysTrue = or('A', not('A'));
const alwaysFalse = not(alwaysTrue);

/** Public examples, independent of the selected exercise bank. */
export const normalExamples: NormalExample[] = [
  {
    id: 'source',
    name: { fr: 'Cours : deux lignes', en: 'Lecture: two rows' },
    variables: ['A', 'B', 'C'],
    outputs: '00100010',
    simplified: and('B', not('C')),
    wrong: or('B', not('C')),
    reason: {
      fr: 'Factoriser y ∧ ¬z ; ¬x ∨ x vaut 1.',
      en: 'Factor out y ∧ ¬z; ¬x ∨ x is 1.',
    },
  },
  {
    id: 'exam',
    name: { fr: 'Type examen : trois lignes', en: 'Exam style: three rows' },
    variables: ['A', 'B', 'C'],
    outputs: '10110000',
    simplified: and(not('A'), or('B', not('C'))),
    wrong: or(not('A'), or('B', not('C'))),
    reason: {
      fr: 'Factoriser ¬x, puis utiliser le tiers exclu et la distributivité.',
      en: 'Factor out ¬x, then use excluded middle and distributivity.',
    },
  },
  {
    id: 'zero',
    name: { fr: 'Constante 0', en: 'Constant 0' },
    variables: ['A', 'B'],
    outputs: '0000',
    simplified: alwaysFalse,
    wrong: alwaysTrue,
    reason: {
      fr: 'Aucun minterme : nier la tautologie x ∨ ¬x.',
      en: 'No minterms: negate the tautology x ∨ ¬x.',
    },
  },
  {
    id: 'one',
    name: { fr: 'Constante 1', en: 'Constant 1' },
    variables: ['A', 'B'],
    outputs: '1111',
    simplified: alwaysTrue,
    wrong: alwaysFalse,
    reason: {
      fr: 'Toutes les affectations sont acceptées : tiers exclu.',
      en: 'Every assignment is accepted: excluded middle.',
    },
  },
];

export function trueRows(outputs: string) {
  return [...outputs].flatMap((value, i) => (value === '1' ? [i] : []));
}

export function rowBits(row: number, count: number) {
  return row.toString(2).padStart(count, '0');
}

export function minterm(variables: Variable[], row: number): Formula {
  const bits = rowBits(row, variables.length);
  return join(
    variables.map((variable, i) => (bits[i] === '1' ? variable : not(variable))),
    'and',
  );
}

export function canonicalDnf(variables: Variable[], outputs: string): Formula {
  const terms = trueRows(outputs).map((row) => minterm(variables, row));
  return terms.length ? join(terms, 'or') : alwaysFalse;
}

/** Rewrites AND recursively; input is a literal/AND/OR tree. */
export function orNot(formula: Formula): Formula {
  if (typeof formula !== 'object') return formula;
  if (formula.op === 'not') return not(orNot(formula.term));
  const left = orNot(formula.left);
  const right = orNot(formula.right);
  if (formula.op === 'and') return not(or(not(left), not(right)));
  if (formula.op === 'or') return or(left, right);
  throw new Error('Expected a DNF expression');
}

export function normalText(formula: Formula) {
  return formulaText(formula).replace(/[ABC]/g, (v) =>
    v === 'A' ? 'x' : v === 'B' ? 'y' : 'z',
  );
}

export function firstMismatch(example: NormalExample, formula: Formula) {
  return assignments(example.variables).findIndex(
    (row, i) => Number(evaluate(formula, row)) !== Number(example.outputs[i]),
  );
}

export function joinChoices(example: NormalExample): Formula[] {
  const terms = trueRows(example.outputs).map((row) =>
    minterm(example.variables, row),
  );
  return terms.length
    ? [canonicalDnf(example.variables, example.outputs), join(terms, 'and')]
    : [alwaysFalse, alwaysTrue];
}
