import { formulaText, type Formula, type Variable } from '../l04-boolean.ts';
import { readFormula } from './formulas.ts';
import { say } from './types.ts';

export const lawGroups = [
  [
    'identity',
    say('Élément neutre', 'Identity'),
    [
      ['A ∨ 0', 'A'],
      ['A ∧ 1', 'A'],
    ],
  ],
  [
    'domination',
    say('Domination', 'Domination'),
    [
      ['A ∨ 1', '1'],
      ['A ∧ 0', '0'],
    ],
  ],
  [
    'idempotence',
    say('Idempotence', 'Idempotence'),
    [
      ['A ∨ A', 'A'],
      ['A ∧ A', 'A'],
    ],
  ],
  [
    'complement',
    say(
      'Tiers exclu et non-contradiction',
      'Excluded middle and non-contradiction',
    ),
    [
      ['A ∨ ¬A', '1'],
      ['A ∧ ¬A', '0'],
    ],
  ],
  ['double', say('Double négation', 'Double negation'), [['¬¬A', 'A']]],
  [
    'commutative',
    say('Commutativité', 'Commutativity'),
    [
      ['A ∨ B', 'B ∨ A'],
      ['A ∧ B', 'B ∧ A'],
    ],
  ],
  [
    'associative',
    say('Associativité', 'Associativity'),
    [
      ['(A ∨ B) ∨ C', 'A ∨ (B ∨ C)'],
      ['(A ∧ B) ∧ C', 'A ∧ (B ∧ C)'],
    ],
  ],
  [
    'distributive',
    say('Distributivité', 'Distributivity'),
    [
      ['A ∧ (B ∨ C)', '(A ∧ B) ∨ (A ∧ C)'],
      ['A ∨ (B ∧ C)', '(A ∨ B) ∧ (A ∨ C)'],
    ],
  ],
  [
    'absorption',
    say('Absorption', 'Absorption'),
    [
      ['A ∨ (A ∧ B)', 'A'],
      ['A ∧ (A ∨ B)', 'A'],
    ],
  ],
  [
    'morgan',
    say('Lois de De Morgan', 'De Morgan’s laws'),
    [
      ['¬(A ∨ B)', '¬A ∧ ¬B'],
      ['¬(A ∧ B)', '¬A ∨ ¬B'],
    ],
  ],
  [
    'consensus',
    say('Théorème du consensus', 'Consensus theorem'),
    [['(A ∧ B) ∨ (¬A ∧ C) ∨ (B ∧ C)', '(A ∧ B) ∨ (¬A ∧ C)']],
  ],
  [
    'eliminate',
    say('Élimination de l’implication', 'Implication elimination'),
    [['A ⇒ B', '¬A ∨ B']],
  ],
  [
    'negate',
    say('Négation de l’implication', 'Negating an implication'),
    [['¬(A ⇒ B)', 'A ∧ ¬B']],
  ],
  [
    'biconditional',
    say('Définition de la biconditionnelle', 'Definition of the biconditional'),
    [['A ⇔ B', '(A ⇒ B) ∧ (B ⇒ A)']],
  ],
] as const;

export type LawId = (typeof lawGroups)[number][0];
export const lawTitles = Object.fromEntries(
  lawGroups.map(([id, title]) => [id, title]),
) as Record<LawId, (typeof lawGroups)[number][1]>;
export const rules = lawGroups.flatMap(([id, , examples]) =>
  (examples as readonly (readonly [string, string])[]).map(
    ([left, right], index) => ({
      id,
      key: id + '-' + (index + 1),
      left: readFormula(left),
      right: readFormula(right),
    }),
  ),
);

type Bindings = Partial<Record<Variable, Formula>>;
function match(pattern: Formula, term: Formula, values: Bindings): boolean {
  if (typeof pattern === 'string') {
    const bound = values[pattern];
    if (bound !== undefined) return formulaText(term) === formulaText(bound);
    values[pattern] = term;
    return true;
  }
  if (typeof pattern === 'boolean' || typeof term !== 'object')
    return pattern === term;
  if (pattern.op === 'not')
    return term.op === 'not' && match(pattern.term, term.term, values);
  return (
    term.op === pattern.op &&
    match(pattern.left, term.left, values) &&
    match(pattern.right, term.right, values)
  );
}

function substitute(pattern: Formula, values: Bindings): Formula {
  if (typeof pattern === 'string') return values[pattern] ?? pattern;
  if (typeof pattern === 'boolean') return pattern;
  if (pattern.op === 'not')
    return { ...pattern, term: substitute(pattern.term, values) };
  return {
    ...pattern,
    left: substitute(pattern.left, values),
    right: substitute(pattern.right, values),
  };
}

function apply(term: Formula, left: Formula, right: Formula): Formula[] {
  const values: Bindings = {};
  const root = match(left, term, values) ? [substitute(right, values)] : [];
  if (typeof term !== 'object') return root;
  if (term.op === 'not')
    return [
      ...root,
      ...apply(term.term, left, right).map((next) => ({ ...term, term: next })),
    ];
  return [
    ...root,
    ...apply(term.left, left, right).map((next) => ({ ...term, left: next })),
    ...apply(term.right, left, right).map((next) => ({ ...term, right: next })),
  ];
}

export function rewrites(term: Formula, allowed: readonly LawId[]) {
  const seen = new Set<string>();
  return rules
    .filter(({ id }) => allowed.includes(id))
    .flatMap(({ id, left, right }) =>
      apply(term, left, right).flatMap((next) => {
        const text = formulaText(next);
        const key = id + ':' + text;
        if (seen.has(key) || text === formulaText(term)) return [];
        seen.add(key);
        return [{ id, next }];
      }),
    );
}
