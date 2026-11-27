import { compare, type Formula } from './l04-boolean.ts';

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

export const proofLaws = {
  morgan: { fr: 'De Morgan', en: 'De Morgan' },
  double: { fr: 'Double négation', en: 'Double negation' },
  commute: { fr: 'Commutativité', en: 'Commutativity' },
  distribute: { fr: 'Distributivité', en: 'Distributivity' },
  excluded: { fr: 'Tiers exclu', en: 'Excluded middle' },
  identity: { fr: 'Élément neutre', en: 'Identity law' },
} as const;

export type ProofLaw = keyof typeof proofLaws;
type ProofStep = {
  law: ProofLaw;
  next: Formula;
  wrong: Formula;
  reason: { fr: string; en: string };
};

type Proof = {
  start: Formula;
  steps: ProofStep[];
};

export const proofs: Proof[] = [
  {
    start: not(and(not('C'), 'B')),
    steps: [
      {
        law: 'morgan',
        next: or(not(not('C')), not('B')),
        wrong: and(not(not('C')), not('B')),
        reason: {
          fr: 'Nier les deux parties et remplacer ET par OU.',
          en: 'Negate both parts and replace AND with OR.',
        },
      },
      {
        law: 'double',
        next: or('C', not('B')),
        wrong: or('C', 'B'),
        reason: {
          fr: 'Annuler les deux NON sur C ; conserver NON B.',
          en: 'Cancel the two NOTs on C; retain NOT B.',
        },
      },
    ],
  },
  {
    start: or(and('A', not('B')), 'B'),
    steps: [
      {
        law: 'commute',
        next: or('B', and('A', not('B'))),
        wrong: and('B', and('A', not('B'))),
        reason: {
          fr: 'Échanger les deux branches sans modifier OU.',
          en: 'Swap the two branches without changing OR.',
        },
      },
      {
        law: 'distribute',
        next: and(or('B', 'A'), or('B', not('B'))),
        wrong: or(or('B', 'A'), or('B', not('B'))),
        reason: {
          fr: 'Recopier B dans les deux branches ; relier par ET.',
          en: 'Copy B into both branches; join with AND.',
        },
      },
      {
        law: 'excluded',
        next: and(or('B', 'A'), true),
        wrong: and(or('B', 'A'), false),
        reason: {
          fr: 'B OU NON B vaut toujours vrai ; garder B OU A.',
          en: 'B OR NOT B is always true; keep B OR A.',
        },
      },
      {
        law: 'identity',
        next: or('B', 'A'),
        wrong: true,
        reason: {
          fr: 'ET avec la constante vraie conserve la formule.',
          en: 'AND with true preserves the formula.',
        },
      },
      {
        law: 'commute',
        next: or('A', 'B'),
        wrong: and('A', 'B'),
        reason: {
          fr: 'Échanger A et B sans changer le connecteur.',
          en: 'Swap A and B without changing the connective.',
        },
      },
    ],
  },
];

export function checkProofStep(
  proof: Proof,
  index: number,
  law: string,
  correctFormula: boolean,
) {
  const step = proof.steps[index]!;
  if (!correctFormula) {
    const before = index === 0 ? proof.start : proof.steps[index - 1]!.next;
    const result = compare(before, step.wrong, ['A', 'B', 'C']);
    return {
      status: 'formula' as const,
      counterexample: result.counterexample,
    };
  }
  if (law !== step.law) return { status: 'law' as const };
  return { status: 'correct' as const };
}
