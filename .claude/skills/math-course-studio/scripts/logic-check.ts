#!/usr/bin/env node
// Second-derivation helper for propositional-logic answer keys.
// Enumerates finite Boolean assignments as a different author self-check route.
// This is not independent peer review. The parser uses no eval.
//
// Usage (from any directory):
//   node .claude/skills/math-course-studio/scripts/logic-check.ts <bank.json> <checks.json>
//
// checks.json is an array. Entry kinds:
//   { "id": "L03-E02", "kind": "table", "formula": "(A => B) <=> (!B => !A)" }
//       the bank item's truth-table `answer` must equal the formula on every row
//   { "kind": "equivalent", "left": "A => B", "right": "!A | B", "expected": true }
//   { "kind": "classify", "formula": "A | !A", "expected": "tautology" }
//       expected: tautology | contradiction | contingent
//   { "kind": "value", "formula": "A => B", "assignment": { "A": true, "B": false }, "expected": false }
//
// Syntax: variables [A-Za-z][A-Za-z0-9_]*, constants true/false, operators
// ! & | ^ => <=> and parentheses. Unicode ¬ ∧ ∨ ⊕ ⇒ ⇔ are accepted. Precedence,
// tightest first: ! , & , ^ , | , => (right-associative) , <=> .
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export type Assignment = Record<string, boolean>;
type Operator = '!' | '&' | '|' | '^' | '=>' | '<=>';
export type FormulaNode =
  | { constant: boolean }
  | { variable: string }
  | { op: Operator; args: FormulaNode[] };
type CheckItem = {
  id: string;
  type: string;
  variables?: string[];
  rows?: ({ id: string } & Record<string, unknown>)[];
  answer?: Record<string, unknown>;
};
type CheckBank = { exercises: CheckItem[] };

const normalise = (text: string) =>
  text
    .replaceAll('¬', '!')
    .replaceAll('∧', '&')
    .replaceAll('∨', '|')
    .replaceAll('⊕', '^')
    .replaceAll('⇔', '<=>')
    .replaceAll('⇒', '=>');

function tokenise(text: string) {
  const tokens = [];
  const source = normalise(text);
  const pattern = /\s*(<=>|=>|[!&|^()]|[A-Za-z][A-Za-z0-9_]*)/y;
  let index = 0;
  while (index < source.length) {
    pattern.lastIndex = index;
    const match = pattern.exec(source);
    if (!match) {
      if (/^\s*$/.test(source.slice(index))) break;
      throw new Error(`Unexpected character at ${index} in "${text}"`);
    }
    tokens.push(match[1]!);
    index = pattern.lastIndex;
  }
  return tokens;
}

// Returns an AST: {op, args} | {variable} | {constant}
export function parseFormula(text: string): FormulaNode {
  const tokens = tokenise(text);
  let position = 0;
  const peek = () => tokens[position];
  const take = (expected?: string) => {
    const token = tokens[position++];
    if (expected && token !== expected)
      throw new Error(`Expected "${expected}" but found "${token ?? 'end'}" in "${text}"`);
    return token;
  };
  const binary = (operator: Operator, next: () => FormulaNode, rightAssociative = false) => {
    const parse = (): FormulaNode => {
      const left = next();
      if (peek() !== operator) return left;
      take();
      const right = rightAssociative ? parse() : null;
      if (rightAssociative) return { op: operator, args: [left, right!] };
      let node: FormulaNode = { op: operator, args: [left, next()] };
      while (peek() === operator) {
        take();
        node = { op: operator, args: [node, next()] };
      }
      return node;
    };
    return parse;
  };
  const primary = (): FormulaNode => {
    const token = take();
    if (token === undefined) throw new Error(`Unexpected end of "${text}"`);
    if (token === '!') return { op: '!', args: [primary()] };
    if (token === '(') {
      const inner = iff();
      take(')');
      return inner;
    }
    if (token === 'true') return { constant: true };
    if (token === 'false') return { constant: false };
    if (/^[A-Za-z]/.test(token)) return { variable: token };
    throw new Error(`Unexpected "${token}" in "${text}"`);
  };
  const and = binary('&', primary);
  const xor = binary('^', and);
  const or = binary('|', xor);
  const implies = binary('=>', or, true);
  const iff = binary('<=>', implies);
  const tree = iff();
  if (position !== tokens.length)
    throw new Error(`Trailing "${tokens[position]}" in "${text}"`);
  return tree;
}

export function evaluate(node: FormulaNode, assignment: Assignment): boolean {
  if ('constant' in node) return node.constant;
  if ('variable' in node) {
    if (!Object.hasOwn(assignment, node.variable))
      throw new Error(`No value for variable ${node.variable}`);
    if (typeof assignment[node.variable] !== 'boolean')
      throw new Error(`Variable ${node.variable} must have a Boolean value`);
    return assignment[node.variable]!;
  }
  const [a, b] = node.args.map((arg) => evaluate(arg, assignment)) as [boolean, boolean];
  switch (node.op) {
    case '!': return !a;
    case '&': return a && b;
    case '|': return a || b;
    case '^': return a !== b;
    case '=>': return !a || b;
    case '<=>': return a === b;
    default: throw new Error(`Unknown operator ${node.op}`);
  }
}

export function variablesOf(node: FormulaNode, found = new Set<string>()): Set<string> {
  if ('variable' in node) found.add(node.variable);
  for (const arg of ('args' in node ? node.args : [])) variablesOf(arg, found);
  return found;
}

// All assignments over `variables`, in the repository's standard row order
// (first variable is the most significant bit; false before true).
export function* assignments(variables: string[]) {
  const count = 2 ** variables.length;
  for (let n = 0; n < count; n++) {
    const bits = n.toString(2).padStart(variables.length, '0');
    yield {
      id: bits,
      values: Object.fromEntries(variables.map((v, i) => [v, bits[i] === '1'])),
    };
  }
}

export function classify(formula: string) {
  const tree = parseFormula(formula);
  const variables = [...variablesOf(tree)].sort();
  const results = [...assignments(variables)].map(({ values }) => evaluate(tree, values));
  if (results.every(Boolean)) return 'tautology';
  if (results.every((value) => !value)) return 'contradiction';
  return 'contingent';
}

export function equivalent(left: string, right: string) {
  const a = parseFormula(left);
  const b = parseFormula(right);
  const variables = [...new Set([...variablesOf(a), ...variablesOf(b)])].sort();
  return [...assignments(variables)].every(
    ({ values }) => evaluate(a, values) === evaluate(b, values),
  );
}

// Compare a complete truth-table key with the supplied formula. The caller must
// separately check that this formula expresses the bilingual prompt.
export function checkTable(item: CheckItem, formula: string) {
  const tree = parseFormula(formula);
  const variables = item.variables ?? ['A', 'B'];
  if (!Array.isArray(variables) || !variables.length ||
      new Set(variables).size !== variables.length ||
      variables.some((name) => typeof name !== 'string' || !/^[A-Za-z][A-Za-z0-9_]*$/.test(name) || ['true', 'false'].includes(name)))
    return ['table variables must be distinct variable names'];
  const undeclared = [...variablesOf(tree)].filter((name) => !variables.includes(name));
  if (undeclared.length) return [`formula uses undeclared variable(s): ${undeclared.join(', ')}`];
  const expectedRows = [...assignments(variables)];
  const ids = expectedRows.map(({ id }) => id);
  if (!Array.isArray(item.rows) || item.rows.length !== ids.length ||
      item.rows.some((row) => !row || !ids.includes(row.id)) ||
      new Set(item.rows.map((row) => row.id)).size !== ids.length)
    return ['table must contain each Boolean assignment exactly once'];
  if (!item.answer || typeof item.answer !== 'object' || Array.isArray(item.answer) ||
      Object.keys(item.answer).length !== ids.length ||
      ids.some((id) => !Object.hasOwn(item.answer!, id) || typeof item.answer![id] !== 'boolean'))
    return ['answer key must contain one Boolean value for every assignment'];
  const rows = new Map(item.rows.map((row) => [row.id, row]));
  const problems = [];
  for (const { id, values } of expectedRows) {
    const row = rows.get(id);
    if (variables.some((name) => !Object.hasOwn(row!, name) || row![name] !== values[name])) {
      problems.push(`row ${id}: variable values do not match the labelled assignment`);
      continue;
    }
    const expected = evaluate(tree, values);
    if (item.answer![id] !== expected)
      problems.push(`row ${id}: key says ${item.answer![id]}, formula gives ${expected}`);
  }
  return problems;
}

export function runChecks(bank: CheckBank, checks: unknown) {
  if (!Array.isArray(checks) || checks.length === 0)
    throw new Error('Verification manifest must be a non-empty array of checks');
  if (!Array.isArray(bank?.exercises) || bank.exercises.some((item) =>
      !item || typeof item.id !== 'string' || !['single-choice', 'truth-table'].includes(item.type)) ||
      new Set(bank.exercises.map((item) => item.id)).size !== bank.exercises.length)
    throw new Error('Bank must contain distinct exercise IDs with supported types');
  const results = [];
  for (const [index, check] of checks.entries()) {
    const label = check?.id ?? check?.kind ?? `check ${index + 1}`;
    let problems: string[] = [];
    let answerKeyId;
    try {
      if (!check || typeof check !== 'object' || Array.isArray(check))
        throw new Error('Check must be an object');
      if (check.kind === 'table') {
        const item = bank.exercises.find((exercise) => exercise.id === check.id);
        if (!item) problems = [`no exercise ${check.id} in the bank`];
        else if (item.type !== 'truth-table') problems = [`${check.id} is not a truth-table item`];
        else {
          answerKeyId = item.id;
          problems = checkTable(item, check.formula);
        }
      } else if (check.kind === 'equivalent') {
        if (equivalent(check.left, check.right) !== check.expected)
          problems = [`equivalence of "${check.left}" and "${check.right}" is not ${check.expected}`];
      } else if (check.kind === 'classify') {
        const actual = classify(check.formula);
        if (actual !== check.expected)
          problems = [`"${check.formula}" is ${actual}, expected ${check.expected}`];
      } else if (check.kind === 'value') {
        const actual = evaluate(parseFormula(check.formula), check.assignment);
        if (actual !== check.expected)
          problems = [`"${check.formula}" gives ${actual}, expected ${check.expected}`];
      } else {
        problems = [`unknown check kind "${check.kind}"`];
      }
    } catch (error) {
      problems = [(error instanceof Error ? error.message : String(error))];
    }
    const verificationScope = ['table', 'equivalent', 'classify'].includes(check?.kind)
      ? 'exhaustive finite Boolean assignments'
      : check?.kind === 'value' ? 'one supplied Boolean assignment' : 'unverified';
    results.push({ label, kind: check?.kind, answerKeyId, verificationScope, problems });
  }
  return results;
}

export function verificationReport(bank: CheckBank, checks: unknown) {
  const results = runChecks(bank, checks);
  const tables = bank.exercises.filter((item) => item.type === 'truth-table').map((item) => item.id);
  const attempted = new Set(results.map((result) => result.answerKeyId).filter(Boolean));
  const failed = tables.filter((id) => results.some((result) => result.answerKeyId === id && result.problems.length));
  const matched = tables.filter((id) => attempted.has(id) && !failed.includes(id));
  const unchecked = tables.filter((id) => !attempted.has(id));
  const supplemental = results.filter((result) => result.kind !== 'table');
  const unsupported = bank.exercises.filter((item) => item.type !== 'truth-table').map((item) => item.id);
  const coverage = {
    tables, matched, failed, unchecked, unsupported,
    supplementalPassed: supplemental.filter((result) => !result.problems.length).length,
    supplementalFailed: supplemental.filter((result) => result.problems.length).length,
  };
  return { results, coverage, ok: results.every((result) => !result.problems.length) && unchecked.length === 0 };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [bankPath, checksPath] = process.argv.slice(2);
  if (!bankPath || !checksPath) {
    console.error('Usage: logic-check.ts <bank.json> <checks.json>');
    process.exit(2);
  }
  try {
    const bank = JSON.parse(await readFile(bankPath, 'utf8'));
    const checks = JSON.parse(await readFile(checksPath, 'utf8'));
    const { results, coverage, ok } = verificationReport(bank, checks);
    for (const { label, kind, verificationScope, problems } of results) {
      const scope = kind === 'table' ? 'answer-key comparison' : 'supplemental';
      if (problems.length) {
        console.error(`FAIL ${label} (${scope}; ${verificationScope})`);
        for (const problem of problems) console.error(`  ${problem}`);
      } else console.log(`ok   ${label} (${scope}; ${verificationScope})`);
    }
    const list = (ids: string[]) => ids.join(', ') || 'none';
    console.log(`Truth-table keys matched against supplied formulas: ${coverage.matched.length}/${coverage.tables.length} (${list(coverage.matched)}).`);
    console.log(`Failed key comparisons: ${list(coverage.failed)}.`);
    console.log(`UNVERIFIED truth-table keys (no linked check): ${list(coverage.unchecked)}.`);
    console.log(`NOT automatically verified (single-choice keys): ${list(coverage.unsupported)}.`);
    console.log(`Supplemental checks: ${coverage.supplementalPassed} passed, ${coverage.supplementalFailed} failed; these do not compare stored answer keys, even when labelled with an exercise ID.`);
    console.log('Scope: table, equivalence and classification checks enumerate finite Boolean assignments of the supplied formulas; value checks test only one supplied assignment. Prompt/formula correspondence, prose, alternatives and translations require mathematical review. This is an author self-check, not independent peer review.');
    if (!ok) {
      console.error('Verification incomplete or failed; no complete truth-table key coverage is claimed.');
      process.exitCode = 1;
    } else if (coverage.tables.length) {
      console.log('Complete truth-table key coverage against supplied formulas; other mathematical review remains required.');
    } else {
      console.log('No truth-table answer keys in this bank; supplemental checks passed, but no stored answer keys were automatically verified.');
    }
  } catch (error) {
    console.error(`Verification could not complete: ${(error instanceof Error ? error.message : String(error))}`);
    process.exitCode = 1;
  }
}
