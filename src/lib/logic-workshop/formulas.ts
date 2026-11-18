import { formulaText, type Formula, type Variable } from '../l04-boolean.ts';

type Binary = Extract<Formula, { left: Formula }>['op'];
const operators: Record<string, Binary> = {
  '∧': 'and',
  '∨': 'or',
  '⇒': 'implies',
  '⇔': 'iff',
};
const precedence = ['⇔', '⇒', '∨', '∧'];
const variables = ['A', 'B', 'C'] as const;

export function parseFormula(input: string): Formula | null {
  if (input.length > 160) return null;
  const source = input
    .toUpperCase()
    .replace(/\s+/g, '')
    .replaceAll('<=>', '⇔')
    .replaceAll('<->', '⇔')
    .replaceAll('=>', '⇒')
    .replaceAll('->', '⇒')
    .replace(/[!~]/g, '¬')
    .replace(/&&|[&·⋅*]/g, '∧')
    .replace(/\|\||[|+]/g, '∨')
    .replace(/[’′]/g, "'");
  if (!source || /[^ABC01⊤⊥¬∧∨⇒⇔()']/.test(source)) return null;
  let position = 0;

  function atom(): Formula {
    const token = source[position++];
    if (token === '¬') return { op: 'not', term: atom() };
    let result: Formula;
    if (token === '(') {
      result = expression(0);
      if (source[position++] !== ')') throw new Error('Missing parenthesis');
    } else if (token === '1' || token === '⊤') result = true;
    else if (token === '0' || token === '⊥') result = false;
    else if (token === 'A' || token === 'B' || token === 'C') result = token;
    else throw new Error('Expected an operand');

    while (source[position] === "'") {
      position++;
      result = { op: 'not', term: result };
    }
    return result;
  }

  function expression(level: number): Formula {
    if (level === precedence.length) return atom();
    const symbol = precedence[level]!;
    let left = expression(level + 1);
    while (source[position] === symbol) {
      position++;
      // Implication associates to the right. Other operators group left.
      left = {
        op: operators[symbol]!,
        left,
        right: expression(symbol === '⇒' ? level : level + 1),
      };
    }
    return left;
  }

  try {
    const result = expression(0);
    return position === source.length ? result : null;
  } catch {
    return null;
  }
}

export function readFormula(input: string): Formula {
  const formula = parseFormula(input);
  if (formula === null) throw new Error('Invalid workshop formula ' + input);
  return formula;
}

export function usedVariables(...formulas: Formula[]): Variable[] {
  const text = formulas.map(formulaText).join('');
  return variables.filter((variable) => text.includes(variable));
}

export function display(formula: Formula): string {
  const text = formulaText(formula);
  return text.startsWith('(') ? text.slice(1, -1) : text;
}
