import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compare, formulaText } from '../../src/lib/l04-boolean.ts';
import { questionBank } from '../../src/lib/logic-workshop/bank.ts';
import {
  display,
  readFormula,
  usedVariables,
} from '../../src/lib/logic-workshop/formulas.ts';
import {
  gradeAnswer,
  publicQuestion,
  workshopRequest,
} from '../../src/lib/logic-workshop/grading.ts';
import { rules } from '../../src/lib/logic-workshop/laws.ts';
import { levels, topics } from '../../src/lib/logic-workshop/types.ts';

const seed = 'abc123';
const get = (id: string) =>
  questionBank.find((question) => question.id === id)!;

test('bilingual bank has over 100 distinct tasks and covers each topic at each level', () => {
  assert.ok(questionBank.length > 100);
  assert.equal(
    new Set(questionBank.map(({ id }) => id)).size,
    questionBank.length,
  );
  const signatures = questionBank.map((q) =>
    q.kind === 'table'
      ? q.kind + formulaText(q.formula)
      : q.kind === 'rewrite'
        ? q.kind + formulaText(q.start)
        : q.kind + q.prompt.fr + q.detail?.fr,
  );
  assert.equal(new Set(signatures).size, questionBank.length);
  for (const topic of topics)
    for (const level of levels) {
      assert.ok(
        questionBank.some((q) => q.topic === topic && q.level === level),
      );
    }
  for (const question of questionBank) {
    assert.ok(
      question.prompt.fr &&
        question.prompt.en &&
        question.hint.fr &&
        question.hint.en &&
        question.solution.fr &&
        question.solution.en,
    );
    assert.match(question.prerequisite, /^L0[1-8]$/);
    if (question.kind === 'choice') {
      assert.equal(
        new Set(question.options.map((choice) => choice.fr)).size,
        question.options.length,
      );
      assert.equal(
        new Set(question.options.map((choice) => choice.en)).size,
        question.options.length,
      );
      assert.ok(
        question.correct.length &&
          question.correct.every((index) => Boolean(question.options[index])),
      );
    }
  }
});

test('all reference rules hold on every assignment and every offered puzzle path finishes', () => {
  for (const { key, left, right } of rules) {
    assert.ok(compare(left, right, usedVariables(left, right)).equivalent, key);
  }
  for (const question of questionBank) {
    if (question.kind !== 'rewrite') continue;
    let solutions = 0;
    function walk(current: ReturnType<typeof publicQuestion>, steps: number[]) {
      assert.equal(current.kind, 'rewrite');
      if (current.kind !== 'rewrite' || question.kind !== 'rewrite') return;
      assert.ok(steps.length < 7);
      let valid = 0;
      current.options.forEach((_, index) => {
        const result = gradeAnswer(question, 'en', seed, index, steps);
        assert.ok(result);
        if (result.state === 'continue') {
          valid++;
          walk(result.question, [...steps, index]);
        }
        if (result.state === 'correct') {
          valid++;
          solutions++;
          assert.ok(
            result.table?.rows.every((row) => row.at(-1) === row.at(-2)),
          );
        }
      });
      assert.ok(valid, question.id + ' has a dead end');
    }
    walk(publicQuestion(question, 'en', seed), []);
    assert.ok(solutions > 1, question.id + ' should accept more than one path');
  }
});

test('symbolic answers accept semantic variants and enforce a requested arrow form', () => {
  const status = (id: string, answer: string) =>
    gradeAnswer(get(id), 'fr', seed, answer, [])?.state;
  assert.equal(status('translate-export', '!A | B'), 'correct');
  assert.equal(status('translate-export', 'B -> A'), 'incorrect');
  assert.equal(status('translate-export', '(A -> B'), 'incorrect');
  assert.equal(status('translate-export', '(!A | B) & (C | !C)'), 'incorrect');
  assert.equal(status('translate-record', 'A ⇒ B'), 'incorrect');
  assert.equal(status('translate-record', '¬B ⇒ ¬A'), 'correct');
  assert.equal(display(readFormula('A ⇒ B ⇒ C')), 'A ⇒ (B ⇒ C)');
});

test('all witness rows are accepted and table errors identify the incorrect cell', () => {
  const status = (id: string, answer: unknown) =>
    gradeAnswer(get(id), 'en', seed, answer, []);
  assert.equal(status('compare-2', 2)?.state, 'correct');
  assert.equal(status('compare-2', 3)?.state, 'correct');
  assert.equal(status('compare-2', 0)?.state, 'incorrect');
  assert.deepEqual(status('table-1', [0, 0]), {
    state: 'incorrect',
    message: 'Recalculate the marked rows.',
    hint: 'Evaluate parentheses and negations before combining values.',
    cells: [false, true],
  });
  assert.equal(status('table-1', [1, 0])?.state, 'correct');
});

test('sessions are seeded, contain no repeats, and keep grading data out of public payloads', () => {
  const body = {
    action: 'start',
    locale: 'en',
    seed,
    topic: 'mixed',
    level: 'all',
  };
  const first = workshopRequest(body);
  assert.ok(first && 'questions' in first);
  assert.deepEqual(first, workshopRequest(body));
  assert.notDeepEqual(first, workshopRequest({ ...body, seed: 'ac2026' }));
  assert.deepEqual(
    new Set(first.questions.map((question) => question.topic)),
    new Set(topics),
  );
  assert.equal(first.questions.length, 8);
  assert.equal(new Set(first.questions.map(({ id }) => id)).size, 8);
  for (const question of questionBank) {
    const json = publicQuestion(question, 'en', seed);
    assert.equal(Object.hasOwn(json, 'correct'), false);
    assert.equal(Object.hasOwn(json, 'hint'), false);
    assert.equal(Object.hasOwn(json, 'solution'), false);
    if (json.kind === 'table')
      assert.ok(
        json.table.rows.every(
          (row) => row.length === json.table.columns.length - 1,
        ),
      );
  }
  assert.equal(
    workshopRequest({ ...body, action: 'grade', id: 'table-1', answer: [1] }),
    null,
  );
});
