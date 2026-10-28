// Public worked-example logic. Never import a private exercise bank here.
export function implicationValues(a: boolean, b: boolean) {
  return {
    implication: !a || b,
    negation: a && !b,
    negatedOperands: a || !b,
  };
}
