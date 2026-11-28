import assert from 'node:assert/strict';
import katex from 'katex';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  even,
  powerSet,
  predicateSummary,
  setResult,
} from '../../src/lib/finite-set-learning.ts';

test('quantifier, negation and comprehension models include every finite domain and the empty case', () => {
  for (const domain of powerSet([0, 1, 2, 3, 4])) {
    const summary = predicateSummary(domain);
    assert.equal(
      summary.all,
      domain.every((x) => x === 0 || x === 2 || x === 4),
    );
    assert.equal(
      summary.some,
      domain.includes(0) || domain.includes(2) || domain.includes(4),
    );
    assert.equal(
      !summary.all,
      domain.some((x) => x === 1 || x === 3),
    );
    assert.equal(
      !summary.some,
      domain.every((x) => x === 1 || x === 3),
    );
    assert.deepEqual(
      summary.witnesses,
      domain.filter((x) => x / 2 === Math.floor(x / 2)),
    );
    assert.equal(
      summary.witnesses.length + summary.counterexamples.length,
      domain.length,
    );
  }
  assert.deepEqual(predicateSummary([]), {
    witnesses: [],
    counterexamples: [],
    all: true,
    some: false,
  });
  assert.equal(even(0), true);
  assert.deepEqual(
    [-2, -1, 0, 1, 2, 3].filter((x) => x * x <= 4),
    [-2, -1, 0, 1, 2],
  );
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((x) => x % 2 === 1),
    [1, 3, 5, 7],
  );
});

test('power-set construction produces each subset once, including the two empty-set levels', () => {
  for (let n = 0; n <= 5; n++) {
    const base = Array.from({ length: n }, (_, i) => i);
    const actual = powerSet(base)
      .map((subset) => subset.join(','))
      .sort();
    const expected = Array.from({ length: 2 ** n }, (_, mask) =>
      base.filter((_, i) => (mask & (1 << i)) !== 0).join(','),
    ).sort();
    assert.deepEqual(actual, expected);
    assert.equal(new Set(actual).size, 2 ** n);
  }
  assert.deepEqual(powerSet([]), [[]]);
  assert.deepEqual(powerSet([[]]), [[], [[]]]);
});

test('both De Morgan operations match independent complement expressions for all small ambient sets', () => {
  for (const ambient of powerSet([0, 1, 2, 3])) {
    for (const a of powerSet(ambient))
      for (const b of powerSet(ambient)) {
        const ca = ambient.filter((x) => !a.includes(x));
        const cb = ambient.filter((x) => !b.includes(x));
        assert.deepEqual(
          setResult(ambient, a, b, 'outside-union'),
          ca.filter((x) => cb.includes(x)),
        );
        assert.deepEqual(
          setResult(ambient, a, b, 'outside-intersection'),
          ambient.filter((x) => ca.includes(x) || cb.includes(x)),
        );
        assert.deepEqual(
          setResult(ambient, a, b, 'union'),
          [...new Set([...a, ...b])].sort((x, y) => x - y),
        );
        assert.deepEqual(
          setResult(ambient, a, b, 'intersection'),
          a.filter((x) => b.includes(x)),
        );
      }
  }
  assert.deepEqual(
    setResult([0, 1, 2, 3, 4, 5], [0, 2, 4], [2, 3], 'outside-union'),
    [1, 5],
  );
  assert.deepEqual(
    setResult([0, 1, 2, 3, 4, 5, 6], [0, 2, 4], [2, 3], 'outside-union'),
    [1, 5, 6],
  );
});

test('L11–L15 six-stage readings preserve mathematical and heading parity in both languages', async () => {
  const math = (s: string) =>
    s.match(/\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$).*?(?<!\$)\$(?!\$)/g);
  for (let n = 11; n <= 15; n++) {
    const fr = await readFile(`content/lessons/L${n}/fr.mdx`, 'utf8');
    const en = await readFile(`content/lessons/L${n}/en.mdx`, 'utf8');
    assert.deepEqual(math(fr), math(en), `L${n}`);
    for (const formula of math(fr) || []) {
      katex.renderToString(formula.replace(/^\$\$?|\$\$?$/g, ''), {
        throwOnError: true,
      });
    }
    assert.equal((fr.match(/^## /gm) || []).length, 6);
    assert.equal((en.match(/^## /gm) || []).length, 6);
    assert.equal(
      (fr.match(/^### /gm) || []).length,
      (en.match(/^### /gm) || []).length,
    );
    assert.match(fr, /version: 4/);
    assert.match(en, /version: 4/);
  }
});
