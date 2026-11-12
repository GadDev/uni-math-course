import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import katex from 'katex';
import { bank } from '../../src/lib/final-exam/bank.ts';
import {
  grade,
  projectPaper,
  reconstruct,
  selectQuestions,
} from '../../src/lib/final-exam/engine.ts';
import {
  completed,
  parseHistory,
  parseResponses,
  validStoredPaper,
} from '../../src/lib/final-exam/responses.ts';
import {
  BANK_VERSION,
  DURATION_MS,
  blueprint,
  topics,
  type History,
  type Responses,
} from '../../src/lib/final-exam/types.ts';
import { equivalentNumber } from '../../src/lib/training-exams/grading.ts';
import { authRoute, safeReturn } from '../../src/lib/auth/policy.ts';

const perfect = (ids: string[]): Responses =>
  Object.fromEntries(
    ids.map((id) => {
      const q = bank.find((q) => q.id === id)!;
      return [
        id,
        q.type === 'written'
          ? 'Démarche rédigée'
          : q.type === 'numeric'
            ? Object.fromEntries(q.fields.map((f) => [f.id, f.answer]))
            : q.answer,
      ];
    }),
  );
test('180 complete original items cover all blueprint slots; keys, rubrics, links and mathematics render', () => {
  assert.equal(bank.length, 180);
  assert.equal(new Set(bank.map((q) => q.id)).size, 180);
  assert.equal(new Set(bank.map((q) => q.family)).size, 180);
  assert.equal(new Set(bank.map((q) => q.prompt)).size, 180);
  for (const slot of blueprint) {
    const pool = bank.filter((q) => q.slot === slot.slot);
    assert.equal(pool.length, 10);
    for (const q of pool) {
      assert.equal(q.topic, slot.topic);
      assert.equal(q.marks, slot.marks);
      assert.equal(q.minutes, slot.minutes);
      assert.equal(q.difficulty, slot.difficulty);
    }
  }
  assert.equal(
    blueprint.reduce((s, b) => s + b.marks, 0),
    60,
  );
  assert.equal(
    blueprint.reduce((s, b) => s + b.minutes, 0),
    108,
  );
  for (const q of bank) {
    for (const field of [
      'objective',
      'explanation',
      'pitfall',
      'verification',
    ] as const)
      assert.ok(q[field].length > 10, q.id + field);
    assert.ok(
      ['md', 'mdx'].some((ext) =>
        existsSync(`content/lessons/${q.lessonId}/fr.${ext}`),
      ),
      q.id,
    );
    if (q.type === 'written')
      assert.equal(
        q.rubric.reduce((s, r) => s + r.points, 0),
        q.marks,
      );
    else if (q.type === 'numeric') {
      assert.ok(q.fields.length > 0);
      for (const f of q.fields)
        assert.ok(equivalentNumber(f.answer, f.answer), q.id);
    } else {
      assert.equal(q.answer.length, q.type === 'single' ? 1 : q.answer.length);
      assert.ok(q.answer.length > 0);
      assert.equal(new Set(q.answer).size, q.answer.length);
      for (const a of q.answer) assert.ok(q.options.some((o) => o.id === a));
      assert.equal(
        new Set(q.options.map((o) => o.label)).size,
        q.options.length,
        q.id,
      );
      for (const o of q.options) assert.ok(o.feedback.length > 10);
    }
    const walk = (v: unknown) => {
      if (typeof v === 'string')
        for (const m of v.matchAll(/\$([^$]+)\$/g))
          katex.renderToString(m[1]!, { throwOnError: true, strict: 'error' });
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(q);
  }
});
test('ten attempts exhaust the 180-item bank without repeats; later attempts preserve coverage', () => {
  let history: History = [];
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const chosen = selectQuestions(history, i + 1);
    assert.equal(chosen.length, 18);
    assert.equal(new Set(chosen.map((q) => q.family)).size, 18);
    assert.equal(
      chosen.reduce((s, q) => s + q.marks, 0),
      60,
    );
    for (const q of chosen) {
      assert.ok(!seen.has(q.id));
      seen.add(q.id);
      history.push({ id: q.id, seen: 1000 + i });
    }
  }
  assert.equal(seen.size, 180);
  const again = selectQuestions(history, 42);
  assert.deepEqual(
    again.map((q) => q.slot),
    blueprint.map((b) => b.slot),
  );
  assert.ok(
    again.every((q) => history.find((h) => h.id === q.id)!.seen === 1000),
  );
});
test('family recency outranks unseen numerical siblings and malformed empty slots fail closed', () => {
  const source = structuredClone(bank);
  const first = source.find((q) => q.slot === 'logique-1')!;
  source.find((q) => q.slot === 'logique-1' && q.id !== first.id)!.family =
    first.family;
  assert.notEqual(
    selectQuestions([{ id: first.id, seen: Date.now() }], 99, source)[0]!
      .family,
    first.family,
  );
  assert.throws(() =>
    selectQuestions(
      [],
      1,
      source.filter((q) => q.slot !== 'information-3'),
    ),
  );
});
test('projected papers omit all solution data, and seed/order/version survive reconstruction', () => {
  for (let seed = 0; seed < 12; seed++) {
    const paper = projectPaper(selectQuestions([], seed), seed, 1000);
    assert.ok(validStoredPaper(paper));
    assert.deepEqual(
      reconstruct(paper.ids, paper.seed, paper.startedAt),
      paper,
    );
    assert.equal(paper.deadline - paper.startedAt, DURATION_MS);
    const serialized = JSON.stringify(paper);
    for (const key of [
      'answer',
      'explanation',
      'feedback',
      'rubric',
      'verification',
      'pitfall',
    ])
      assert.ok(!serialized.includes(`"${key}"`));
    const answers = perfect(paper.ids);
    const parsed = parseResponses(paper, answers);
    assert.ok(parsed);
    assert.deepEqual(parsed, answers);
    const result = grade(paper, parsed);
    assert.equal(result.automatic, 27);
    assert.equal(result.automaticMaximum, 27);
    assert.equal(result.manualMaximum, 33);
    assert.equal(result.marks.filter((m) => m.earned === null).length, 7);
  }
  const orders = new Set(
    Array.from({ length: 10 }, (_, seed) =>
      projectPaper([bank.find((q) => q.type === 'single')!], seed, 1000)
        .questions[0]!.options!.map((o) => o.id)
        .join(''),
    ),
  );
  assert.ok(orders.size > 1);
});
test('paper and response contracts reject substitutions, duplicates, extra fields and invalid formats', () => {
  const paper = projectPaper(selectQuestions([], 1), 1, 1000);
  assert.equal(reconstruct([...paper.ids].reverse(), 1, 1000), null);
  assert.equal(reconstruct(paper.ids, NaN, 1000), null);
  assert.equal(reconstruct(paper.ids, 1, Date.now() + 120000), null);
  assert.equal(
    reconstruct(
      paper.ids.map(() => paper.ids[0]),
      1,
      1000,
    ),
    null,
  );
  assert.equal(validStoredPaper({ ...paper, version: 99 }), false);
  assert.equal(validStoredPaper({ ...paper, deadline: 123 }), false);
  assert.equal(parseResponses(paper, { foreign: ['a'] }), null);
  assert.equal(parseHistory([{ id: 'x', seen: Infinity }]), null);
  assert.equal(
    parseHistory(Array.from({ length: 181 }, () => ({ id: 'x', seen: 1000 }))),
    null,
  );
  const numeric = paper.questions.find((q) => q.type === 'numeric')!;
  assert.equal(parseResponses(paper, { [numeric.id]: { foreign: '1' } }), null);
  assert.equal(
    parseResponses(paper, { [numeric.id]: { a: '1'.repeat(65) } }),
    null,
  );
  const choice = paper.questions.find((q) => q.type === 'single')!;
  assert.equal(parseResponses(paper, { [choice.id]: ['a', 'a'] }), null);
  const written = paper.questions.find((q) => q.type === 'written')!;
  assert.equal(parseResponses(paper, { [written.id]: 'x'.repeat(2001) }), null);
  assert.equal(completed(paper, {}, written.id), false);
  assert.equal(
    completed(paper, { [written.id]: 'sur papier' }, written.id),
    true,
  );
});
test('exact fractions, rounded entropy, partial numeric marks and multiple selections have distinct contracts', () => {
  const chosen = selectQuestions([], 11);
  const entropy = bank.find((q) => q.family === 'entropie-non-dyadique')!;
  const numeric = bank.find((q) => q.family === 'fractions-somme')!;
  const multi = bank.find((q) => q.family === 'ensembles-nombres')!;
  const paper = projectPaper([entropy, numeric, multi], 5, 1000);
  const responses: Responses = {
    [entropy.id]: { a: '0,811', b: '2' },
    [numeric.id]: { a: '34/48' },
    [multi.id]: multi.type === 'multi' ? [multi.answer[0]!] : [],
  };
  const result = grade(paper, responses);
  assert.equal(result.marks[0]!.earned, 2);
  assert.equal(result.marks[1]!.earned, 2);
  assert.equal(result.marks[2]!.earned, 0);
  responses[entropy.id] = { a: '0.82', b: '2' };
  assert.equal(grade(paper, responses).marks[0]!.earned, 1);
  responses[numeric.id] = { a: '0.7083' };
  assert.equal(grade(paper, responses).marks[1]!.earned, 0);
  responses[entropy.id] = { a: 'NaN', b: '1/0' };
  assert.equal(grade(paper, responses).marks[0]!.earned, 0);
});
test('all Boolean table keys agree with independent enumeration', () => {
  const formulas: Record<string, (p: boolean, q: boolean) => boolean> = {
    'table-implication': (p, q) => !p || q,
    'table-exclusive': (p, q) => p !== q,
    'table-negation-conjonction': (p, q) => !(p && q),
    'table-biconditionnelle': (p, q) => p === q,
  };
  for (const [family, fn] of Object.entries(formulas)) {
    const q = bank.find((q) => q.family === family)!;
    assert.equal(q.type, 'numeric');
    if (q.type !== 'numeric') continue;
    const expected = [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ].map(([p, q]) => Number(fn(p!, q!)));
    assert.deepEqual(
      q.fields.map((f) => Number(f.answer)),
      expected,
    );
  }
});
test('every derivative key agrees with finite differences at its actual evaluation points', () => {
  const specs: [string, (x: number) => number, number[]][] = [
    ['derivee-polynome', (x) => 2 * x ** 3 - 3 * x * x + 4 * x - 7, [0, 1, 2]],
    ['derivee-quotient', (x) => (3 * x + 1) / (x - 2), [0, 3]],
    ['derivee-produit', (x) => (x * x + 1) * Math.exp(x), [0, 1]],
    ['derivee-racine', Math.sqrt, [4, 9]],
    ['derivee-inverse', (x) => 1 / (x * x), [1, -2]],
    ['derivee-logarithme', (x) => Math.log(x) + 2 * x, [1, 2]],
    ['derivee-exponentielle-composee', (x) => Math.exp(3 * x), [0]],
    ['derivee-composition-polynome', (x) => (2 * x - 1) ** 3, [0, 1]],
    [
      'derivee-affine-combinaison',
      (x) => (x * x) / 2 - (3 * x) / 4 + 9,
      [0, 2],
    ],
    ['derivee-log-compose', (x) => Math.log(2 * x + 1), [0, 1]],
  ];
  const num = (s: string) => {
    const [a, b] = s.split('/').map(Number);
    return a! / (b ?? 1);
  };
  for (const [family, fn, points] of specs) {
    const q = bank.find((q) => q.family === family)!;
    if (q.type !== 'numeric') assert.fail();
    for (const [i, x] of points.entries()) {
      let expected = num(q.fields[i]!.answer);
      if (family === 'derivee-polynome')
        expected =
          num(q.fields[0]!.answer) * x * x +
          num(q.fields[1]!.answer) * x +
          num(q.fields[2]!.answer);
      if (family === 'derivee-produit' && i === 1) expected *= Math.E;
      const h = 1e-5;
      assert.ok(
        Math.abs((fn(x + h) - fn(x - h)) / (2 * h) - expected) < 1e-5,
        `${family} at ${x}`,
      );
    }
  }
});
test('entropy keys and all Huffman exemplar codes independently match Shannon and optimal merge costs', () => {
  const probability: Record<string, number[]> = {
    'entropie-uniforme': Array(8).fill(1 / 8),
    'entropie-dyadique': [0.5, 0.25, 0.125, 0.125],
    'entropie-proba-manquante': [0.5, 0.25, 0.25],
    'entropie-effectifs': [0.5, 0.25, 0.25],
    'entropie-symbole-impossible': [0.5, 0.5, 0],
    'entropie-source-certaine': [1, 0, 0],
    'entropie-non-dyadique': [0.25, 0.75],
    'entropie-maximale': [0.25, 0.25, 0.25, 0.25],
    'entropie-permutation': [0.25, 0.5, 0.25],
    'entropie-borne-code': [0.5, 0.25, 0.125, 0.125],
  };
  for (const [family, ps] of Object.entries(probability)) {
    const q = bank.find((q) => q.family === family)!;
    if (q.type !== 'numeric') assert.fail();
    const field = q.fields[family === 'entropie-proba-manquante' ? 1 : 0]!;
    const [n, d] = field.answer.split('/').map(Number);
    const value = n! / (d ?? 1);
    const h = -ps.reduce((s, p) => s + (p ? p * Math.log2(p) : 0), 0);
    assert.ok(Math.abs(value - h) < 1e-6, family);
  }
  for (const q of bank.filter(
    (q) => q.topic === 'information' && q.type === 'written',
  )) {
    const weights = [...q.prompt.split('.')[0]!.matchAll(/([A-Z]):(\d+)/g)].map(
      (m) => ({
        symbol: m[1]!,
        weight: Number(m[2]),
      }),
    );
    const codes = new Map(
      [
        ...q.explanation.split('Les poids')[0]!.matchAll(/([A-Z]):([01]+)/g),
      ].map((m) => [m[1]!, m[2]!]),
    );
    assert.equal(codes.size, weights.length, q.id);
    for (const [a, ca] of codes)
      for (const [b, cb] of codes) if (a !== b) assert.ok(!cb.startsWith(ca));
    const cost = weights.reduce(
      (s, w) => s + w.weight * codes.get(w.symbol)!.length,
      0,
    );
    const queue = weights.map((w) => w.weight);
    let optimum = 0;
    while (queue.length > 1) {
      queue.sort((a, b) => a - b);
      const sum = queue.shift()! + queue.shift()!;
      optimum += sum;
      queue.push(sum);
    }
    assert.equal(cost, optimum, q.id);
    const total = weights.reduce((s, w) => s + w.weight, 0);
    const h = -weights.reduce((s, w) => {
      const p = w.weight / total;
      return s + p * Math.log2(p);
    }, 0);
    assert.ok(h <= cost / total + 1e-12 && cost / total < h + 1, q.id);
  }
});
test('final routes use existing private auth/no-store policy and preserve the login return destination', () => {
  for (const path of [
    '/fr/training-exams/final/',
    '/en/training-exams/final/',
    '/api/training-exams/final/',
  ])
    assert.ok(authRoute(path));
  assert.equal(
    safeReturn('/fr/training-exams/final/', 'fr'),
    '/fr/training-exams/final/',
  );
  assert.equal(authRoute('/api/training-exams/final/other/'), false);
  assert.equal(BANK_VERSION, 1);
  assert.equal(Object.keys(topics).length, 6);
});

test('remaining numeric keys agree with independent arithmetic across every topic', () => {
  const values: Record<string, number[]> = {
    'denombrement-valuations': [2 ** 3, 2 ** 2 - 1],
    'compter-contre-exemples': [3],
    'evaluer-priorites': [
      Number(!false || (true && false)),
      Number((!false || true) && false),
    ],
    'coherence-contraintes': [2, 0],
    'cardinal-operations': [0, 1, new Set([0, 2, 4, 2, 3]).size],
    'decomposition-shannon-booleenne': [4, 0],
    'priorite-signe': [-(3 ** 2) + 2 * (5 - 1), (-3) ** 2 + 2 * (5 - 1)],
    'fractions-somme': [5 / 6 - 3 / 8 + 1 / 4],
    'fractions-division': [7 / 10 / (-14 / 15)],
    'puissances-negatives': [2 ** -3, 3 ** 4 / 3 ** 2],
    'racine-valeur-absolue': [Math.sqrt((-5) ** 2), -Math.sqrt(25)],
    'evaluer-factorise': [(-2 - 3) * (2 * -2 + 1), 2 * (-2) ** 2 - 5 * -2 - 3],
    'somme-indice': [[1, 2, 3, 4].reduce((s, k) => s + 2 * k - 1, 0), 4],
    'moyenne-ponderee': [(2 * 3 + 4 * 6) / 6],
    'distance-plan': [Math.hypot(3, 4), 3 ** 2 + 4 ** 2],
    'representation-binaire': [parseInt('10110', 2), 2 ** 5, 3 / 4 - 1 / 8],
    'pente-deux-points': [(-1 - 5) / (4 - -2), 5 - ((-1 - 5) / (4 - -2)) * -2],
    'point-pente': [-4 - (3 / 2) * 2, (3 / 2) * 6 - 7],
    'cartesienne-vers-affine': [-3 / 2, 8 / 2],
    'intercepts-axes': [12 / 4, 12 / -3],
    'accroissement-signe': [1 - 7, (-2 / 3) * (1 - 7)],
    'intersection-affines': [(6 + 3) / (2 + 1), 2 * ((6 + 3) / (2 + 1)) - 3],
    horizontale: [0, -3],
    'pixel-aller': [320 + 40 * -2, 240 - 40 * 3],
    'pixel-retour': [(350 - 300) / 20, (200 - 275) / 50],
    'parallele-point': [-4, 2 - -4 * -1],
    'expo-produit': [2 + 3, Math.exp(0)],
    'expo-quotient': [4 - 1, 2 - -1],
    'expo-puissance': [-2 * 3 + 1, Math.exp(0)],
    'expo-equation-meme-base': [(3 + 1) / 2, 3 ** (2 - 1)],
    'expo-equation-inverse': [(-3 - 1) / 2, -3],
    'expo-decroit': [(1 / 2) ** -2, (1 / 2) ** 3],
    'expo-initiale-taux': [12 * 2 ** 0, Math.log2(96 / 12)],
    'expo-bases-compatibles': [6, 2 ** 6],
    'expo-negatif-constant': [2 * Math.exp(0) - 5, 0],
    'expo-transforme-log': [Math.exp(Math.log(2 ** 3)), Math.log(Math.exp(-4))],
  };
  for (const [family, expected] of Object.entries(values)) {
    const q = bank.find((q) => q.family === family)!;
    if (q.type !== 'numeric') assert.fail(family);
    assert.equal(q.fields.length, expected.length, family);
    q.fields.forEach((f, i) => {
      const [n, d] = f.answer.split('/').map(Number);
      assert.ok(
        Math.abs(n! / (d ?? 1) - expected[i]!) < 1e-9,
        `${family} field ${i}`,
      );
    });
  }
  const covered = bank.filter(
    (q) =>
      q.type === 'numeric' &&
      (q.family in values ||
        q.slot === 'fonctions-2' ||
        q.slot === 'information-1' ||
        q.family.startsWith('table-')),
  );
  assert.equal(covered.length, 60);
});

test('every regression model agrees with raw-moment least squares and centered residual identities', () => {
  for (const q of bank.filter((q) => q.slot === 'droites-3')) {
    const points = [...q.prompt.matchAll(/\((-?\d+),(-?\d+)\)/g)].map(
      (m) => [Number(m[1]), Number(m[2])] as const,
    );
    assert.ok(points.length >= 3);
    const n = points.length,
      sx = points.reduce((s, p) => s + p[0], 0),
      sy = points.reduce((s, p) => s + p[1], 0);
    const sxx = points.reduce((s, p) => s + p[0] ** 2, 0),
      sxy = points.reduce((s, p) => s + p[0] * p[1], 0);
    const m = (n * sxy - sx * sy) / (n * sxx - sx * sx),
      b = (sy - m * sx) / n;
    const parse = (v: string) => {
      const [a, d] = v.split('/').map(Number);
      return a! / (d ?? 1);
    };
    const storedM = q.explanation.match(/\$m=([^$]+)\$/)![1]!,
      storedB = q.explanation.match(/\$b=([^$]+)\$/)![1]!;
    assert.ok(Math.abs(m - parse(storedM)) < 1e-10, q.id);
    assert.ok(Math.abs(b - parse(storedB)) < 1e-10, q.id);
    assert.ok(
      Math.abs(points.reduce((s, [x, y]) => s + y - m * x - b, 0)) < 1e-10,
    );
    assert.ok(
      Math.abs(points.reduce((s, [x, y]) => s + x * (y - m * x - b), 0)) <
        1e-10,
    );
  }
});
