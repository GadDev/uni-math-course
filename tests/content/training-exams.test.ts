import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import {
  publicExam,
  gradeExam,
  equivalentNumber,
  parseExamResponses,
} from '../../src/lib/training-exams/grading.ts';
import type {
  ExamResponses,
  Localized,
  TrainingExam,
} from '../../src/lib/training-exams/types.ts';
import { authRoute, safeReturn } from '../../src/lib/auth/policy.ts';
import { isOfflineReadingPath } from '../../scripts/offline-manifest.ts';

const exams = ['C01', 'C02', 'C03'].map(
  (chapter) =>
    JSON.parse(
      readFileSync(`exercises/exams/${chapter}/v1.json`, 'utf8'),
    ) as TrainingExam,
);
const maths = (text: string) =>
  [...text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]!);
const bilingual = (value: Localized) => {
  assert.deepEqual(Object.keys(value).sort(), ['en', 'fr']);
  assert.ok(value.fr.trim() && value.en.trim());
  assert.deepEqual(
    maths(value.fr),
    maths(value.en),
    'FR/EN mathematical notation must match',
  );
  for (const formula of maths(value.fr))
    katex.renderToString(formula, {
      throwOnError: true,
      strict: 'error',
      trust: false,
    });
};

for (const exam of exams) {
  test(`${exam.id}: complete bilingual contract, notation and explicit provenance`, () => {
    assert.equal(exam.questions.length, 20);
    assert.equal(exam.version, 1);
    assert.equal(exam.suggestedMinutes, 60);
    assert.equal(exam.review.mathematics, 'author-self-check');
    assert.equal(exam.review.translation, 'author-self-check');
    assert.ok(readFileSync(exam.review.evidence, 'utf8').length);
    assert.equal(exam.provenance.origin, 'original-project-work');
    assert.equal(exam.grading.partialCredit, false);
    assert.equal(exam.grading.negativeMarking, false);
    assert.equal(exam.grading.pointsPerQuestion, 1);
    assert.equal(new Set(exam.questions.map((q) => q.id)).size, 20);
    bilingual(exam.title);
    for (const q of exam.questions) {
      assert.match(q.id, new RegExp(`^${exam.id}-Q\\d{2}$`));
      assert.ok(['easy', 'medium', 'hard'].includes(q.difficulty));
      assert.ok(q.prerequisites.length && q.objective);
      bilingual(q.prompt);
      bilingual(q.explanation);
      bilingual(q.pitfall);
      if (q.type === 'numeric') {
        assert.ok(q.fields.length);
        assert.equal(new Set(q.fields.map((f) => f.id)).size, q.fields.length);
        for (const f of q.fields) {
          bilingual(f.label);
          assert.ok(equivalentNumber(f.answer, f.answer));
        }
      } else {
        assert.ok(q.options.length >= 2);
        assert.equal(
          new Set(q.options.map((o) => o.id)).size,
          q.options.length,
        );
        assert.equal(new Set(q.answer).size, q.answer.length);
        assert.ok(q.answer.every((id) => q.options.some((o) => o.id === id)));
        assert.ok(
          q.type === 'single' ? q.answer.length === 1 : q.answer.length > 1,
        );
        for (const o of q.options) {
          bilingual(o.label);
          bilingual(o.feedback);
        }
      }
    }
  });

  test(`${exam.id}: server projection never delivers solutions before submission`, () => {
    const projection = publicExam(exam);
    const forbidden = [
      'answer',
      'explanation',
      'feedback',
      'pitfall',
      'review',
      'grading',
    ];
    const visit = (value: unknown) => {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        assert.ok(!forbidden.includes(key), key);
        visit(child);
      }
    };
    visit(projection);
    assert.equal(projection.questions.length, 20);
    assert.ok(parseExamResponses(projection, {}));
  });

  test(`${exam.id}: whole-question marking, skipped items and multi-select exactness`, () => {
    const answers: ExamResponses = Object.fromEntries(
      exam.questions.map((q) => [
        q.id,
        q.type === 'numeric'
          ? Object.fromEntries(q.fields.map((f) => [f.id, f.answer]))
          : [...q.answer].reverse(),
      ]),
    );
    assert.equal(gradeExam(exam, parseExamResponses(exam, answers)!).score, 20);
    assert.equal(gradeExam(exam, {}).score, 0);
    assert.ok(gradeExam(exam, {}).questions.every((r) => r.skipped));
    const multi = exam.questions.find((q) => q.type === 'multi')!;
    if (multi.type === 'numeric') throw new Error('Expected multi');
    const missed = { ...answers, [multi.id]: multi.answer.slice(1) };
    assert.equal(gradeExam(exam, missed).score, 19);
    const extra = multi.options.find((o) => !multi.answer.includes(o.id))!.id;
    assert.equal(
      gradeExam(exam, { ...answers, [multi.id]: [...multi.answer, extra] })
        .score,
      19,
    );
    const numeric = exam.questions.find((q) => q.type === 'numeric')!;
    if (numeric.type !== 'numeric') throw new Error('Expected numeric');
    assert.equal(
      gradeExam(exam, {
        ...answers,
        [numeric.id]: { [numeric.fields[0]!.id]: '999' },
      }).score,
      19,
    );
    assert.equal(
      parseExamResponses(exam, { ...answers, unexpected: [] }),
      null,
    );
    assert.equal(parseExamResponses(exam, { [multi.id]: ['a', 'a'] }), null);
    assert.equal(parseExamResponses(exam, { [multi.id]: ['unknown'] }), null);
    assert.equal(
      parseExamResponses(exam, { [numeric.id]: { unknown: '1' } }),
      null,
    );
    assert.equal(
      parseExamResponses(exam, {
        [numeric.id]: { [numeric.fields[0]!.id]: 1 },
      }),
      null,
    );
  });
}

test('numeric equivalence is exact and bounded; no evaluation or rounding shortcut', () => {
  for (const [given, expected] of [
    ['1,50', '3/2'],
    [' 6 / 4 ', '3/2'],
    ['−2', '-2'],
    ['-1/-2', '0.5'],
    ['+.5', '1/2'],
    ['-0', '0'],
    ['2.', '2'],
  ])
    assert.ok(equivalentNumber(given!, expected!));
  for (const given of [
    '1/0',
    'NaN',
    'Infinity',
    '2+1',
    '1e3',
    '<script>',
    '1,2,3',
    '',
    '9'.repeat(65),
  ])
    assert.equal(equivalentNumber(given, '3'), false);
  assert.equal(equivalentNumber('0.333333333333', '1/3'), false);
  assert.equal(equivalentNumber('9007199254740993', '9007199254740992'), false);
});

test('mock exam authentication, redirects and offline exclusions are explicit', () => {
  for (const chapter of ['C01', 'C02', 'C03']) {
    const path = `/fr/training-exams/${chapter}/`;
    assert.equal(authRoute(path), true);
    assert.equal(authRoute(`/api/training-exams/${chapter}/`), true);
    assert.equal(safeReturn(path, 'fr'), path);
    assert.equal(isOfflineReadingPath(path), false);
  }
  assert.equal(authRoute('/fr/training-exams/'), false);
  for (const path of [
    '/fr/training-exams/C04/',
    '/fr/training-exams/C01/?grade=20',
    '/fr/training-exams/%43%30%31/',
  ])
    assert.equal(safeReturn(path, 'fr'), '/fr/account/');
});

test('Chapter 1 truth-table keys agree with exhaustive Boolean enumeration', () => {
  const exam = exams[0]!;
  const key = (n: number) => {
    const q = exam.questions[n - 1]!;
    assert.notEqual(q.type, 'numeric');
    return q.type === 'numeric' ? [] : q.answer;
  };
  const imp = (p: boolean, q: boolean) => !p || q;
  const rows = [false, true].flatMap((p) =>
    [false, true].map((q) => ({ p, q })),
  );
  const col = rows.map(({ p, q }) => Number(imp(p, q)));
  const table = exam.questions[2]!;
  assert.equal(
    table.type === 'single' &&
      table.options.find((o) => o.id === key(3)[0])?.label.fr,
    `$(${col.join(',')})$`,
  );
  const candidates: Record<string, (p: boolean, q: boolean) => boolean> = {
    a: (p) => p || !p,
    b: imp,
    c: (p, q) => imp(p && q, p),
    d: (p) => p && !p,
    e: (p, q) => imp(p, q) === imp(!q, !p),
  };
  assert.deepEqual(
    Object.entries(candidates)
      .filter(([, f]) => rows.every(({ p, q }) => f(p, q)))
      .map(([id]) => id),
    key(4),
  );
  for (const { p, q } of rows) {
    assert.equal(!imp(p, q), p && !q);
    assert.equal(!(!p || !q), p && q);
  }
  assert.deepEqual(key(5), ['a']);
  assert.deepEqual(key(8), ['b']);
  assert.deepEqual(key(19), ['a', 'c']);
  assert.equal([].every(Boolean), true);
  assert.equal([].some(Boolean), false);
});

test('Chapter 2 numerical keys agree with point substitution and independent OLS sums', () => {
  const exam = exams[1]!;
  const fields = (n: number) => {
    const q = exam.questions[n - 1]!;
    assert.equal(q.type, 'numeric');
    return Object.fromEntries(
      q.type === 'numeric' ? q.fields.map((f) => [f.id, f.answer]) : [],
    );
  };
  const number = (s: string) => {
    const [a, b] = s.split('/').map(Number);
    return a! / (b ?? 1);
  };
  for (const [n, points] of [
    [3, [[3, 1]]],
    [
      4,
      [
        [-2, 4],
        [4, 1],
      ],
    ],
    [
      5,
      [
        [2, 9],
        [6, 19],
      ],
    ],
    [
      6,
      [
        [0, 2],
        [4, 0],
      ],
    ],
  ] as const) {
    const f = fields(n);
    for (const [x, y] of points)
      assert.ok(Math.abs(number(f.m!) * x + number(f.p!) - y) < 1e-12);
  }
  const intersection = fields(11);
  const x = number(intersection.x!);
  const y = number(intersection.y!);
  assert.ok(Math.abs(y - (2 * x - 1)) < 1e-12);
  assert.ok(Math.abs(y - (-x + 4)) < 1e-12);
  const data = [
    [0, 1],
    [1, 2],
    [2, 4],
  ];
  const sx = 3,
    sy = 7,
    sxx = 5,
    sxy = 10;
  const slope = (3 * sxy - sx * sy) / (3 * sxx - sx * sx);
  const intercept = (sy - slope * sx) / 3;
  const f = fields(19);
  assert.equal(number(f.m!), slope);
  assert.ok(Math.abs(number(f.p!) - intercept) < 1e-12);
  const residuals = data.map(([x, y]) => y! - slope * x! - intercept);
  assert.ok(Math.abs(residuals.reduce((a, b) => a + b, 0)) < 1e-12);
  assert.ok(Math.abs(number(f.r!) - residuals[1]!) < 1e-12);
  assert.deepEqual(fields(16), { u: '380', v: '320' });
  const world = fields(17);
  assert.equal(500 + 40 * number(world.x!), 560);
  assert.equal(400 - 40 * number(world.y!), 460);
});

test('Chapter 3 numerical keys agree with finite differences and tangent incidence', () => {
  const exam = exams[2]!;
  const fields = (n: number) => {
    const q = exam.questions[n - 1]!;
    assert.equal(q.type, 'numeric');
    return Object.fromEntries(
      q.type === 'numeric' ? q.fields.map((f) => [f.id, Number(f.answer)]) : [],
    );
  };
  const derivative = (f: (x: number) => number, x: number) =>
    (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
  assert.ok(
    Math.abs(derivative((x) => x * x - 3 * x, 2) - fields(7).derivative!) <
      1e-8,
  );
  assert.equal(fields(8).average, (2 * 9 + 3 - (2 + 1)) / 2);
  assert.ok(
    Math.abs(derivative((x) => 2 * x * x + x, 1) - fields(8).instant!) < 1e-8,
  );
  const tangent = fields(13);
  assert.equal(tangent.m! + tangent.p!, 2);
  assert.ok(Math.abs(derivative((x) => x ** 3 + x, 1) - tangent.m!) < 1e-8);
  assert.ok(
    Math.abs(derivative((x) => Math.log(x ** 4), 2) - fields(18).derivative!) <
      1e-8,
  );
  const logs = fields(19);
  assert.equal(2 ** logs.positive!, 256);
  assert.equal(2 ** logs.negative!, 1 / 32);
  assert.equal(40 * 2 ** logs.time!, 1280);
  for (const x of [-2, 0, 2])
    assert.ok(
      Math.abs(
        (Math.exp(4 * x + 1) * Math.exp(2 - 4 * x)) /
          Math.exp(-2) /
          Math.exp(fields(15).k!) -
          1,
      ) < 1e-12,
    );
});
