import {
  assignments,
  compare,
  evaluate,
  formulaText,
  type Formula,
} from '../l04-boolean.ts';
import { display, readFormula, usedVariables } from './formulas.ts';
import {
  assertionExamples,
  implicationCases,
  translations,
} from './language.ts';
import { lawGroups, lawTitles, rewrites, rules, type LawId } from './laws.ts';
import { say, type Bilingual, type Level, type Topic } from './types.ts';

type Base = {
  id: string;
  topic: Topic;
  level: Level;
  prerequisite: string;
  prompt: Bilingual;
  detail?: Bilingual;
  hint: Bilingual;
  solution: Bilingual;
};
type Choice = {
  kind: 'choice';
  options: Bilingual[];
  correct: number[];
  comparison?: [Formula, Formula];
};
type TruthTable = { kind: 'table'; formula: Formula };
type Construct = {
  kind: 'formula';
  formula: Formula;
  exact: boolean;
  variables: ReturnType<typeof usedVariables>;
};
type Chain = { kind: 'rewrite'; start: Formula; goal: Formula; laws: LawId[] };
export type Question = Base & (Choice | TruthTable | Construct | Chain);
const mathematical = (text: string) => say(text, text);
const truthOptions = [
  say('Assertion vraie', 'True assertion'),
  say('Assertion fausse', 'False assertion'),
  say('Pas une assertion', 'Not an assertion'),
];
const assertionHint = say(
  'Cherchez une valeur de vérité déterminée dans le contexte donné.',
  'Look for a definite truth value in the given context.',
);
const assertionReasons = [
  say(
    'La phrase affirme un fait vrai dans le contexte donné.',
    'The sentence makes a true claim in the given context.',
  ),
  say(
    'La phrase a une valeur de vérité déterminée : 0.',
    'The sentence has a definite truth value: 0.',
  ),
  say(
    'Une question, une consigne ou une phrase à variable libre n’a pas de valeur de vérité fixée ici.',
    'A question, a command or a sentence with a free variable has no fixed truth value here.',
  ),
];

const assertions: Question[] = assertionExamples.map(
  ([key, detail, answer]) => ({
    id: 'assertion-' + key,
    kind: 'choice',
    topic: 'truth',
    level: 'discovery',
    prerequisite: 'L01',
    prompt: say(
      'Comment classer cet énoncé ?',
      'How should this sentence be classified?',
    ),
    detail,
    options: truthOptions,
    correct: [answer],
    hint: assertionHint,
    solution: assertionReasons[answer]!,
  }),
);

const truthFixtures = [
  '¬A',
  'A ∧ B',
  'A ∨ B',
  '¬(A ∧ B)',
  '¬(A ∨ B)',
  'A ∧ ¬B',
  '¬A ∨ B',
  'A ⇒ B',
  'A ⇔ B',
  'A ∨ ¬A',
  'A ∧ ¬A',
  '(A ∨ B) ∧ ¬(A ∧ B)',
  '¬(A ⇒ B)',
  '(A ⇒ B) ∧ (B ⇒ A)',
  '(A ⇒ B) ∨ (B ⇒ A)',
  '(A ⇒ B) ∧ (¬A ⇒ B)',
  '(A ∧ B) ⇒ C',
  'A ⇒ (B ∧ C)',
  'A ⇒ (B ∨ C)',
  '(A ∨ B) ⇒ C',
  '(A ⇔ B) ⇒ C',
  'A ⇔ (B ∨ C)',
  '(A ⇒ B) ∧ (B ⇒ C)',
  '((A ⇒ B) ∧ (B ⇒ C)) ⇒ (A ⇒ C)',
  '((A ⇒ B) ∧ B) ⇒ A',
  '(A ⇔ B) ∧ (B ⇔ C)',
  '¬(A ⇒ (B ⇒ C))',
  '(A ⇒ B) ⇔ (A ⇒ C)',
  '(A ∧ B) ∨ (¬A ∧ C)',
] as const;

const tables: Question[] = truthFixtures.map((source, index) => {
  const formula = readFormula(source);
  const variables = usedVariables(formula);
  const values = assignments(variables).map((env) =>
    Number(evaluate(formula, env)),
  );
  const label = values.every((value) => value === 1)
    ? say('C’est une tautologie.', 'It is a tautology.')
    : values.every((value) => value === 0)
      ? say('C’est une contradiction.', 'It is a contradiction.')
      : say(
          'La colonne contient des 0 et des 1 : la formule est contingente.',
          'The column contains both 0 and 1: the formula is contingent.',
        );
  return {
    id: 'table-' + (index + 1),
    kind: 'table',
    topic: 'truth',
    prerequisite: 'L03',
    level: index < 11 ? 'discovery' : index < 23 ? 'exam' : 'challenge',
    prompt: say('Complétez la dernière colonne.', 'Complete the final column.'),
    formula,
    hint: /[⇒⇔]/.test(source)
      ? say(
          'Calculez les groupes intérieurs. Une implication vaut 0 uniquement pour 1 ⇒ 0 ; une biconditionnelle vaut 1 si ses deux parties ont la même valeur.',
          'Evaluate the inner groups. An implication is false only for 1 ⇒ 0; a biconditional is true when both sides have the same value.',
        )
      : say(
          'Calculez les parenthèses et les négations avant de combiner les valeurs.',
          'Evaluate parentheses and negations before combining values.',
        ),
    solution: label,
  };
});

const templateHints: Record<string, Bilingual> = {
  'A ⇒ B': say(
    'Identifiez la condition suffisante : placez-la à gauche de ⇒.',
    'Identify the sufficient condition and place it to the left of ⇒.',
  ),
  'B ⇒ A': say(
    'Cherchez ce qui est exigé. Cette condition est le conséquent.',
    'Find what is required. That condition is the consequent.',
  ),
  'A ⇔ B': say(
    'La règle affirme les deux sens.',
    'The rule asserts both directions.',
  ),
  'A ∧ ¬B': say(
    'Le premier événement a lieu et le second manque.',
    'The first event happens and the second is absent.',
  ),
  '¬(A ∨ B)': say(
    'La négation porte sur toute la disjonction.',
    'The negation applies to the entire disjunction.',
  ),
  'A ∨ B': say(
    'Le cas où les deux capteurs détectent compte aussi.',
    'The case where both sensors detect something also counts.',
  ),
  '(A ∧ ¬C) ⇒ B': say(
    'Regroupez les deux conditions avant la flèche.',
    'Group the two conditions before the arrow.',
  ),
  'A ⇒ (B ∧ C)': say(
    'Les deux exigences sont nécessaires et forment le conséquent.',
    'Both requirements are necessary and make up the consequent.',
  ),
  '¬B ⇒ ¬A': say(
    'Échangez les deux côtés et niez-les.',
    'Swap the two sides and negate them.',
  ),
  '¬A ⇒ ¬B': say(
    'Gardez l’ordre initial et niez chaque côté.',
    'Keep the original order and negate each side.',
  ),
  '(A ∨ B) ∧ ¬(A ∧ B)': say(
    'Combinez « au moins un » et « pas les deux ».',
    'Combine “at least one” with “not both”.',
  ),
  'C ⇔ (A ∧ B)': say(
    'Regroupez les deux conditions et exprimez les deux sens.',
    'Group both conditions and express both directions.',
  ),
};

const language: Question[] = translations.map(
  ([key, definitions, detail, source], index) => {
    const hint =
      key === 'alert'
        ? say(
            'Échangez antécédent et conséquent.',
            'Swap antecedent and consequent.',
          )
        : templateHints[source]!;
    return {
      id: 'translate-' + key,
      kind: 'formula',
      topic: 'implication',
      prerequisite: index < 6 ? 'L05' : 'L06',
      level: index < 6 ? 'discovery' : index < 14 ? 'exam' : 'challenge',
      prompt: detail,
      detail: definitions,
      hint,
      solution: say(
        display(readFormula(source)) + ' — ' + hint.fr,
        display(readFormula(source)) + ' — ' + hint.en,
      ),
      formula: readFormula(source),
      exact: ['record', 'alert', 'member'].includes(key),
      variables: /\bC\b/.test(definitions.en) ? ['A', 'B', 'C'] : ['A', 'B'],
    };
  },
);

const cases: Question[] = implicationCases.map(
  ([key, prompt, options, answer, solution], index) => ({
    id: 'implication-' + key,
    kind: 'choice',
    topic: 'implication',
    level: index === 4 ? 'challenge' : 'exam',
    prerequisite: 'L06',
    prompt,
    options: options.map((option) =>
      typeof option === 'string' ? mathematical(option) : option,
    ),
    correct: [answer],
    solution,
    hint:
      index < 4
        ? say(
            'Un contre-exemple a un antécédent vrai et un conséquent faux pour la règle à réfuter.',
            'A counterexample makes the antecedent true and the consequent false for the rule being refuted.',
          )
        : say(
            'Vérifiez l’ordre des deux côtés et testez les lignes 01 et 10.',
            'Check the order of the two sides and test rows 01 and 10.',
          ),
  }),
);

const pairFixtures: readonly (readonly [string, string, boolean])[] = [
  ['A ⇒ B', '¬A ∨ B', true],
  ['A ⇒ B', 'B ⇒ A', false],
  ['A ⇒ B', '¬B ⇒ ¬A', true],
  ['A ∨ B', 'A ∧ B', false],
  ['¬(A ∧ B)', '¬A ∧ ¬B', false],
  ['A ⇔ B', '(A ⇒ B) ∧ (B ⇒ A)', true],
  ['A ⇔ B', 'A ∧ B', false],
  ['¬(A ⇒ B)', '¬A ⇒ ¬B', false],
  ['(A ⇒ B) ∧ (A ⇒ C)', 'A ⇒ (B ∧ C)', true],
  ['(A ⇒ C) ∧ (B ⇒ C)', '(A ∨ B) ⇒ C', true],
  ['A ⇒ (B ⇒ C)', '(A ⇒ B) ⇒ C', false],
  ['A ⇔ (B ⇔ C)', '(A ⇔ B) ⇔ C', true],
  ['(A ∧ ¬B) ∨ (¬A ∧ B)', '¬(A ⇔ B)', true],
  ['A ∧ (B ∨ C)', '(A ∧ B) ∨ C', false],
  ['(A ⇒ B) ∨ (B ⇒ A)', '1', true],
  ['(A ⇒ B) ∧ (B ⇒ C)', 'A ⇒ C', false],
  ['(A ∨ B) ∧ (A ∨ ¬B)', 'A', true],
  ['(A ⇒ B) ∧ (¬A ⇒ C)', 'B ∨ C', false],
  ['A ⇒ (B ∨ C)', '(A ⇒ B) ∧ (A ⇒ C)', false],
  ['(A ∧ B) ⇒ C', 'A ⇒ (B ⇒ C)', true],
  ['¬(A ⇒ (B ⇒ C))', 'A ∧ B ∧ ¬C', true],
  ['(A ⇔ B) ∨ (B ⇔ C)', '1', false],
  ['(A ⇔ B) ⇒ C', 'A ⇔ (B ⇒ C)', false],
  ['(A ⇒ B) ⇔ (A ⇒ C)', '¬A ∨ (B ⇔ C)', true],
  ['(A ∨ B) ⇔ C', '(A ⇔ C) ∨ (B ⇔ C)', false],
  ['(A ⇔ B) ∧ (B ⇔ C)', '(A ∧ B ∧ C) ∨ (¬A ∧ ¬B ∧ ¬C)', true],
];

const pairs: Question[] = pairFixtures.map(
  ([a, b, expectedEquivalent], index) => {
    const left = readFormula(a);
    const right = readFormula(b);
    const variables = usedVariables(left, right);
    const { equivalent, rows } = compare(left, right, variables);
    if (equivalent !== expectedEquivalent)
      throw new Error('Invalid equivalence fixture ' + index);
    const assignment = (env: (typeof rows)[number]['env']) =>
      variables
        .map((variable) => variable + '=' + Number(env[variable]))
        .join(', ');
    const differences = rows
      .map((row, i) => (row.left !== row.right ? i + 1 : 0))
      .filter(Boolean);
    const options = [
      say(
        'Équivalentes : aucune ligne ne diffère.',
        'Equivalent: no rows differ.',
      ),
      ...rows.map(({ env }) => mathematical(assignment(env))),
    ];
    const witness = rows.find((row) => row.left !== row.right);
    return {
      id: 'compare-' + (index + 1),
      kind: 'choice',
      topic: 'equivalence',
      level: index < 8 ? 'discovery' : index < 19 ? 'exam' : 'challenge',
      prerequisite: 'L07',
      prompt: say(
        'Les formules sont-elles équivalentes ? Sinon, choisissez une ligne qui les distingue.',
        'Are the formulas equivalent? If not, choose a row that distinguishes them.',
      ),
      detail: mathematical(
        'P = ' + display(left) + '   ·   Q = ' + display(right),
      ),
      options,
      correct: equivalent ? [0] : differences,
      comparison: [left, right],
      hint: say(
        'Comparez P et Q sur la même ligne. Une seule différence suffit ; pour conclure à l’équivalence, il faut toutes les lignes.',
        'Compare P and Q on the same row. One difference is enough; equivalence requires every row.',
      ),
      solution: witness
        ? say(
            'Par exemple, ' +
              assignment(witness.env) +
              ' donne P = ' +
              Number(witness.left) +
              ' et Q = ' +
              Number(witness.right) +
              '.',
            'For example, ' +
              assignment(witness.env) +
              ' gives P = ' +
              Number(witness.left) +
              ' and Q = ' +
              Number(witness.right) +
              '.',
          )
        : say(
            'Les colonnes coïncident partout : P ⇔ Q est une tautologie, donc P ≡ Q.',
            'The columns agree everywhere: P ⇔ Q is a tautology, so P ≡ Q.',
          ),
    };
  },
);

const laws: Question[] = rules.map(({ key, id, left, right }, index) => {
  const ids = lawGroups.map(([lawId]) => lawId);
  const possible = rewrites(left, ids).filter(
    ({ next }) => formulaText(next) === formulaText(right),
  );
  const foilIds = ids.filter(
    (lawId) => !possible.some((move) => move.id === lawId),
  );
  const options = [
    id,
    foilIds[index % foilIds.length]!,
    foilIds[(index + 4) % foilIds.length]!,
    foilIds[(index + 8) % foilIds.length]!,
  ];
  return {
    id: 'law-' + key,
    kind: 'choice',
    topic: 'laws',
    prerequisite: 'L04',
    level: id === 'consensus' ? 'challenge' : index < 13 ? 'discovery' : 'exam',
    prompt: say(
      'Quelle loi donne directement cette réécriture ?',
      'Which law gives this rewrite directly?',
    ),
    detail: mathematical(display(left) + ' ≡ ' + display(right)),
    options: options.map((lawId) => lawTitles[lawId]),
    correct: [0],
    hint: say(
      'Repérez le groupe qui change et comparez les connecteurs des deux côtés.',
      'Find the group that changes and compare the connectives on each side.',
    ),
    solution: say(
      'La règle appliquée est « ' + lawTitles[id].fr + ' ».',
      'The rule applied is “' + lawTitles[id].en + '”.',
    ),
  };
});

const chainFixtures: readonly (readonly [
  string,
  string,
  readonly LawId[],
  string,
  string,
])[] = [
  [
    '¬¬A ∧ (B ∨ 0)',
    'A ∧ B',
    ['double', 'identity'],
    'Enlevez les deux négations et utilisez l’élément neutre du OU.',
    'Remove the double negation and apply the OR identity.',
  ],
  [
    '(A ∨ A) ∧ (B ∧ 1)',
    'A ∧ B',
    ['idempotence', 'identity'],
    'Réduisez le doublon puis le ET avec ⊤, dans l’ordre de votre choix.',
    'Reduce the duplicate and remove AND true, in either order.',
  ],
  [
    '(A ∨ (A ∧ B)) ∨ (C ∧ 0)',
    'A',
    ['absorption', 'domination', 'identity'],
    'Absorbez A ∧ B et réduisez C ∧ ¬⊤, puis utilisez l’élément neutre.',
    'Absorb A ∧ B, reduce C ∧ ¬⊤, then apply identity.',
  ],
  [
    '¬(A ∨ ¬B) ∨ (C ∧ ¬C)',
    '¬A ∧ B',
    ['morgan', 'double', 'complement', 'identity'],
    'Appliquez De Morgan à gauche et la non-contradiction à droite. Retirez la double négation et le OU avec ¬⊤.',
    'Apply De Morgan on the left and non-contradiction on the right. Remove the double negation and OR false.',
  ],
  [
    '¬(A ⇒ B) ∧ (C ∨ ¬C)',
    'A ∧ ¬B',
    ['negate', 'complement', 'identity'],
    'Niez l’implication et appliquez le tiers exclu. Le ET avec ⊤ disparaît.',
    'Negate the implication and use excluded middle. AND true disappears.',
  ],
  [
    '(A ⇒ B) ∧ (C ∨ (C ∧ A))',
    '(¬A ∨ B) ∧ C',
    ['eliminate', 'absorption'],
    'Remplacez l’implication par une disjonction et utilisez l’absorption.',
    'Replace the implication with a disjunction and use absorption.',
  ],
  [
    '¬(A ∧ ¬(B ∨ B))',
    '¬A ∨ B',
    ['morgan', 'double', 'idempotence'],
    'Appliquez De Morgan au groupe extérieur, annulez la double négation puis retirez le doublon.',
    'Apply De Morgan to the outer group, cancel the double negation and remove the duplicate.',
  ],
  [
    '((A ∧ B) ∨ (¬A ∧ C) ∨ (B ∧ C)) ∧ 1',
    '(A ∧ B) ∨ (¬A ∧ C)',
    ['consensus', 'identity'],
    'Retirez B ∧ C par consensus et simplifiez le ET avec ⊤.',
    'Remove B ∧ C by consensus and simplify AND true.',
  ],
];
const chains: Question[] = chainFixtures.map(
  ([start, goal, allowed, fr, en], index) => ({
    id: 'chain-' + (index + 1),
    kind: 'rewrite',
    topic: 'laws',
    level: index < 3 ? 'exam' : 'challenge',
    prerequisite: 'L04',
    prompt: say(
      'Choisissez une réécriture et la loi qui la justifie. Une seule transformation par étape.',
      'Choose a rewrite and the law that justifies it. Make one change per step.',
    ),
    start: readFormula(start),
    goal: readFormula(goal),
    laws: [...allowed],
    hint: say(
      'Regardez les groupes intérieurs. Il est parfois possible de simplifier deux endroits dans l’ordre de votre choix.',
      'Look at the inner groups. Sometimes you can simplify two places in either order.',
    ),
    solution: say(fr, en),
  }),
);

// Original items model the exercise formats in Logique_01 and Revision (exercises 1–3).
export const questionBank = [
  ...assertions,
  ...tables,
  ...language,
  ...cases,
  ...pairs,
  ...laws,
  ...chains,
];
