/** Public teaching examples only. No imports from the served exercise banks. */
export type Variable = 'A' | 'B' | 'C';
export type Assignment = Record<Variable, boolean>;
export type Formula =
  | Variable
  | boolean
  | { op: 'not'; term: Formula }
  | { op: 'and' | 'or'; left: Formula; right: Formula };
export type LabKind = 'rewrite' | 'morgan' | 'distribute';
type Bilingual = { fr: string; en: string };
export type Law = {
  id: string;
  kind: LabKind;
  title: Bilingual;
  variables: Variable[];
  left: Formula;
  right: Formula;
  wrong?: Formula;
  steps: { formula: Formula; reason: Bilingual }[];
};
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
const step = (formula: Formula, fr: string, en: string) => ({
  formula,
  reason: { fr, en },
});
const law = (
  id: string,
  kind: LabKind,
  fr: string,
  en: string,
  variables: Variable[],
  left: Formula,
  right: Formula,
  steps: Law['steps'],
  wrong?: Formula,
): Law => ({
  id,
  kind,
  title: { fr, en },
  variables,
  left,
  right,
  steps,
  wrong,
});
export const booleanLaws: Law[] = [
  law(
    'nested',
    'rewrite',
    'Deux étapes : nier un OU',
    'Two steps: negate OR',
    ['A', 'B'],
    not(or(not('A'), 'B')),
    and('A', not('B')),
    [
      step(
        and(not(not('A')), not('B')),
        'De Morgan : nier chaque partie et remplacer OU par ET.',
        'De Morgan: negate each part and replace OR with AND.',
      ),
      step(
        and('A', not('B')),
        'Double négation : NON NON A devient A.',
        'Double negation: NOT NOT A becomes A.',
      ),
    ],
    or('A', not('B')),
  ),
  ...(['and', 'or'] as const).map((op) => {
    const f = op === 'and' ? and : or;
    const name = op === 'and' ? ['ET', 'AND'] : ['OU', 'OR'];
    return law(
      `commute-${op}`,
      'rewrite',
      `Commutativité de ${name[0]}`,
      `Commutativity of ${name[1]}`,
      ['A', 'B'],
      f('A', 'B'),
      f('B', 'A'),
      [
        step(
          f('B', 'A'),
          'Commutativité : échanger les deux parties sans changer le connecteur.',
          'Commutativity: swap the two parts without changing the connective.',
        ),
      ],
    );
  }),
  ...(['and', 'or'] as const).map((op) => {
    const f = op === 'and' ? and : or;
    return law(
      `associate-${op}`,
      'rewrite',
      `Associativité de ${op === 'and' ? 'ET' : 'OU'}`,
      `Associativity of ${op === 'and' ? 'AND' : 'OR'}`,
      ['A', 'B', 'C'],
      f('A', f('B', 'C')),
      f(f('A', 'B'), 'C'),
      [
        step(
          f(f('A', 'B'), 'C'),
          'Associativité : déplacer le groupement entre connecteurs identiques.',
          'Associativity: move grouping between identical connectives.',
        ),
      ],
    );
  }),
  law(
    'double',
    'rewrite',
    'Double négation',
    'Double negation',
    ['A'],
    not(not('A')),
    'A',
    [
      step(
        'A',
        'Deux inversions rétablissent la valeur initiale.',
        'Two inversions restore the initial value.',
      ),
    ],
  ),
  law(
    'excluded',
    'rewrite',
    'Tiers exclu',
    'Excluded middle',
    ['A'],
    or('A', not('A')),
    true,
    [
      step(
        true,
        'A ou sa négation est vraie dans chaque affectation classique.',
        'A or its negation is true under every classical assignment.',
      ),
    ],
  ),
  law(
    'contradiction',
    'rewrite',
    'Non-contradiction',
    'Non-contradiction',
    ['A'],
    and('A', not('A')),
    false,
    [
      step(
        false,
        'A et sa négation ne sont jamais vraies ensemble.',
        'A and its negation are never both true.',
      ),
    ],
  ),
  law(
    'not-and',
    'morgan',
    'Nier un ET',
    'Negate AND',
    ['A', 'B'],
    not(and('A', 'B')),
    or(not('A'), not('B')),
    [
      step(
        or(not('A'), not('B')),
        'De Morgan : il suffit qu’au moins une condition manque.',
        'De Morgan: at least one condition must fail.',
      ),
    ],
    and(not('A'), not('B')),
  ),
  law(
    'not-or',
    'morgan',
    'Nier un OU',
    'Negate OR',
    ['A', 'B'],
    not(or('A', 'B')),
    and(not('A'), not('B')),
    [
      step(
        and(not('A'), not('B')),
        'De Morgan : les deux conditions doivent manquer.',
        'De Morgan: both conditions must fail.',
      ),
    ],
    or(not('A'), not('B')),
  ),
  law(
    'and-over-or',
    'distribute',
    'ET sur OU',
    'AND over OR',
    ['A', 'B', 'C'],
    and('A', or('B', 'C')),
    or(and('A', 'B'), and('A', 'C')),
    [
      step(
        or(and('A', 'B'), and('A', 'C')),
        'Distributivité : A accompagne B et accompagne C ; les deux branches sont conservées.',
        'Distributivity: A accompanies B and accompanies C; keep both branches.',
      ),
    ],
    and('A', 'B'),
  ),
  law(
    'or-over-and',
    'distribute',
    'OU sur ET',
    'OR over AND',
    ['A', 'B', 'C'],
    or('A', and('B', 'C')),
    and(or('A', 'B'), or('A', 'C')),
    [
      step(
        and(or('A', 'B'), or('A', 'C')),
        'Distributivité : recopier A dans les deux groupes et échanger les connecteurs.',
        'Distributivity: copy A into both groups and exchange the connectives.',
      ),
    ],
    or('A', 'B'),
  ),
];
export function evaluate(formula: Formula, env: Assignment): boolean {
  if (typeof formula === 'boolean') return formula;
  if (typeof formula === 'string') return env[formula];
  if (formula.op === 'not') return !evaluate(formula.term, env);
  return formula.op === 'and'
    ? evaluate(formula.left, env) && evaluate(formula.right, env)
    : evaluate(formula.left, env) || evaluate(formula.right, env);
}
/** Explicit grouping keeps rewriting visible, including associative regrouping. */
export function formulaText(formula: Formula): string {
  if (typeof formula === 'boolean') return formula ? '⊤' : '¬⊤';
  if (typeof formula === 'string') return formula;
  if (formula.op === 'not') return `¬${formulaText(formula.term)}`;
  return `(${formulaText(formula.left)} ${formula.op === 'and' ? '∧' : '∨'} ${formulaText(formula.right)})`;
}
export function assignments(variables: Variable[]): Assignment[] {
  return Array.from({ length: 2 ** variables.length }, (_, n) => {
    const env: Assignment = { A: false, B: false, C: false };
    variables.forEach((variable, i) => {
      env[variable] = Boolean((n >> (variables.length - 1 - i)) & 1);
    });
    return env;
  });
}
export function compare(left: Formula, right: Formula, variables: Variable[]) {
  const rows = assignments(variables).map((env) => ({
    env,
    left: evaluate(left, env),
    right: evaluate(right, env),
  }));
  return {
    rows,
    equivalent: rows.every((r) => r.left === r.right),
    counterexample: rows.find((r) => r.left !== r.right),
  };
}
