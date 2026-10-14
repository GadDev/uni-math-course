#!/usr/bin/env node
// Second-derivation helper for propositional-logic answer keys.
// Brute-forces every truth assignment, so it is an independent route from the
// hand derivation. It parses a small formula language itself (no eval).
//
// Usage (from any directory):
//   node .claude/skills/math-course-studio/scripts/logic-check.mjs <bank.json> <checks.json>
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

const normalise = (text) =>
  text
    .replaceAll('¬', '!')
    .replaceAll('∧', '&')
    .replaceAll('∨', '|')
    .replaceAll('⊕', '^')
    .replaceAll('⇔', '<=>')
    .replaceAll('⇒', '=>');

function tokenise(text) {
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
    tokens.push(match[1]);
    index = pattern.lastIndex;
  }
  return tokens;
}

// Returns an AST: {op, args} | {variable} | {constant}
export function parseFormula(text) {
  const tokens = tokenise(text);
  let position = 0;
  const peek = () => tokens[position];
  const take = (expected) => {
    const token = tokens[position++];
    if (expected && token !== expected)
      throw new Error(`Expected "${expected}" but found "${token ?? 'end'}" in "${text}"`);
    return token;
  };
  const binary = (operator, next, rightAssociative = false) => {
    const parse = () => {
      const left = next();
      if (peek() !== operator) return left;
      take();
      const right = rightAssociative ? parse() : null;
      if (rightAssociative) return { op: operator, args: [left, right] };
      let node = { op: operator, args: [left, next()] };
      while (peek() === operator) {
        take();
        node = { op: operator, args: [node, next()] };
      }
      return node;
    };
    return parse;
  };
  const primary = () => {
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

export function evaluate(node, assignment) {
  if ('constant' in node) return node.constant;
  if ('variable' in node) {
    if (!(node.variable in assignment))
      throw new Error(`No value for variable ${node.variable}`);
    return assignment[node.variable];
  }
  const [a, b] = node.args.map((arg) => evaluate(arg, assignment));
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

export function variablesOf(node, found = new Set()) {
  if ('variable' in node) found.add(node.variable);
  for (const arg of node.args ?? []) variablesOf(arg, found);
  return found;
}

// All assignments over `variables`, in the repository's standard row order
// (first variable is the most significant bit; false before true).
export function* assignments(variables) {
  const count = 2 ** variables.length;
  for (let n = 0; n < count; n++) {
    const bits = n.toString(2).padStart(variables.length, '0');
    yield {
      id: bits,
      values: Object.fromEntries(variables.map((v, i) => [v, bits[i] === '1'])),
    };
  }
}

export function classify(formula) {
  const tree = parseFormula(formula);
  const variables = [...variablesOf(tree)].sort();
  const results = [...assignments(variables)].map(({ values }) => evaluate(tree, values));
  if (results.every(Boolean)) return 'tautology';
  if (results.every((value) => !value)) return 'contradiction';
  return 'contingent';
}

export function equivalent(left, right) {
  const a = parseFormula(left);
  const b = parseFormula(right);
  const variables = [...new Set([...variablesOf(a), ...variablesOf(b)])].sort();
  return [...assignments(variables)].every(
    ({ values }) => evaluate(a, values) === evaluate(b, values),
  );
}

// Compare a truth-table item's answer key with the formula, row by row.
export function checkTable(item, formula) {
  const tree = parseFormula(formula);
  const variables = item.variables ?? ['A', 'B'];
  const problems = [];
  for (const row of item.rows) {
    const values = Object.fromEntries(variables.map((v) => [v, row[v]]));
    const expected = evaluate(tree, values);
    if (item.answer[row.id] !== expected)
      problems.push(`row ${row.id}: key says ${item.answer[row.id]}, formula gives ${expected}`);
  }
  return problems;
}

export function runChecks(bank, checks) {
  const results = [];
  for (const check of checks) {
    const label = check.id ?? check.kind;
    let problems = [];
    try {
      if (check.kind === 'table') {
        const item = bank.exercises.find((exercise) => exercise.id === check.id);
        if (!item) problems = [`no exercise ${check.id} in the bank`];
        else if (item.type !== 'truth-table') problems = [`${check.id} is not a truth-table item`];
        else problems = checkTable(item, check.formula);
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
      problems = [error.message];
    }
    results.push({ label, problems });
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [bankPath, checksPath] = process.argv.slice(2);
  if (!bankPath || !checksPath) {
    console.error('Usage: logic-check.mjs <bank.json> <checks.json>');
    process.exit(2);
  }
  const bank = JSON.parse(await readFile(bankPath, 'utf8'));
  const checks = JSON.parse(await readFile(checksPath, 'utf8'));
  const results = runChecks(bank, checks);
  let failed = 0;
  for (const { label, problems } of results) {
    if (problems.length) {
      failed++;
      console.error(`FAIL ${label}`);
      for (const problem of problems) console.error(`  ${problem}`);
    } else console.log(`ok   ${label}`);
  }
  if (failed) {
    console.error(`${failed} of ${results.length} check(s) failed`);
    process.exit(1);
  }
  console.log(`All ${results.length} check(s) agree with the keys. Propositional items only; this is one route of the double derivation.`);
}
