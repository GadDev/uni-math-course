// Public worked-example logic. Never import a private exercise bank here.
import { bit, implies } from './l07-logic.ts';

export function implicationValues(a: boolean, b: boolean) {
  const implication = Boolean(implies(bit(a), bit(b)));
  return {
    implication,
    negation: !implication,
    negatedOperands: Boolean(implies(bit(!a), bit(!b))),
  };
}

export function challengeValue(task: string, a: boolean, b: boolean) {
  return task === 'converse'
    ? implicationValues(b, a).implication
    : implicationValues(a, b).implication;
}
