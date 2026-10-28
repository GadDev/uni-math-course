import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fractionCalculation,
  gcd,
  rational,
  signedPowers,
  factorValues,
  linearEquation,
  sumDifference,
  indexedSum,
  physicalDistance,
  type FractionOperation,
} from '../../src/lib/algebra-methods.ts';

test('fraction operations give exact reduced results and keep denominator signs consistent', () => {
  for (const [op, a, b, c, d, n, q] of [
    ['add', 1, 2, 1, 3, 5, 6],
    ['subtract', 3, 4, 1, 6, 7, 12],
    ['multiply', 2, 3, 3, 5, 2, 5],
    ['divide', 3, 4, 9, 8, 2, 3],
    ['add', 1, -2, 1, 3, -1, 6],
    ['divide', 1, -2, 1, -3, 3, 2],
    ['subtract', 1, 2, -1, 3, 5, 6],
    ['multiply', 0, 5, 2, 3, 0, 1],
  ] as const) {
    const result = fractionCalculation(op, a, b, c, d);
    assert.ok(!('error' in result));
    assert.deepEqual(result.result, { numerator: n, denominator: q });
  }
  for (const values of [
    [1, 0, 1, 2],
    [1, 2, 1, 0],
    [NaN, 2, 1, 3],
    [1.5, 2, 1, 3],
    [13, 2, 1, 3],
  ])
    assert.deepEqual(
      fractionCalculation(
        'add',
        ...(values as [number, number, number, number]),
      ),
      { error: 'input' },
    );
  assert.deepEqual(fractionCalculation('divide', 1, 2, 0, 3), {
    error: 'zero-divisor',
  });
  assert.throws(() => rational(1, 0), RangeError);
});

test('fraction results satisfy cross-multiplied integer identities across signed inputs', () => {
  for (let k = 1; k <= 300; k++) {
    const a = (k % 25) - 12,
      b = ((k % 12) + 1) * (k % 2 ? -1 : 1),
      c = ((7 * k) % 25) - 12,
      d = (((5 * k) % 12) + 1) * (k % 3 ? -1 : 1);
    for (const op of [
      'add',
      'subtract',
      'multiply',
      'divide',
    ] as FractionOperation[]) {
      const got = fractionCalculation(op, a, b, c, d);
      if (op === 'divide' && c === 0) {
        assert.ok('error' in got);
        continue;
      }
      assert.ok(!('error' in got));
      const { numerator: n, denominator: q } = got.result;
      assert.ok(q > 0);
      assert.equal(gcd(n, q), 1);
      const expected =
        op === 'add'
          ? a * d + c * b
          : op === 'subtract'
            ? a * d - c * b
            : op === 'multiply'
              ? a * c
              : a * d;
      const denominator = op === 'divide' ? b * c : b * d;
      assert.equal(
        n * denominator || 0,
        expected * q || 0,
        `${op}: ${a}/${b}, ${c}/${d}`,
      );
    }
  }
});

test('powers and factorisations agree with repeated products and expansion on the offered values', () => {
  for (let a = 0; a <= 4; a++)
    for (let n = 2; n <= 5; n++) {
      const p = signedPowers(a, n);
      let product = 1;
      for (let i = 0; i < n; i++) product *= -a;
      assert.equal(p.inside, product || 0);
      assert.equal(p.outside, -Math.abs(product) || 0);
      if (n % 2 === 1) assert.equal(p.inside, p.outside);
    }
  for (let pattern = 0; pattern < 3; pattern++)
    for (let x = -4; x <= 4; x++) {
      const f = factorValues(pattern, x);
      assert.ok(f.expanded === f.factored);
    }
});

test('equation and system methods preserve both original conditions, including zero coefficients', () => {
  assert.equal(linearEquation(0, 5, 5).kind, 'all');
  assert.equal(linearEquation(0, 5, 6).kind, 'none');
  for (let a = -4; a <= 4; a++)
    for (let b = -5; b <= 5; b++)
      for (let c = -5; c <= 12; c++) {
        const e = linearEquation(a, b, c);
        if (e.kind === 'unique')
          assert.equal(
            a * e.result.numerator + b * e.result.denominator,
            c * e.result.denominator,
          );
      }
  for (let s = 0; s <= 10; s++)
    for (let d = -5; d <= 5; d++) {
      const p = sumDifference(s, d);
      assert.equal(p.x + p.y, s);
      assert.equal(p.x - p.y, d);
    }
});

test('sigma includes both bounds and agrees with a telescoping odd-number sum', () => {
  for (let r = 0; r <= 5; r++)
    for (let s = 0; s <= 6; s++) {
      const odd = indexedSum(r, s, null);
      if (r > s) {
        assert.equal(odd, null);
        continue;
      }
      assert.ok(odd);
      assert.equal(odd.terms.length, s - r + 1);
      assert.equal(odd.total, s * s - (r - 1) * (r - 1));
      for (const c of [-3, 0, 5])
        assert.equal(indexedSum(r, s, c)!.total, (s - r + 1) * c);
    }
});

test('physical distances convert units before applying Pythagoras', () => {
  assert.equal(physicalDistance(3, 4, 1, 1).distance, 5);
  assert.ok(
    Math.abs(physicalDistance(3, 4, 2, 1).distance - Math.sqrt(52)) < 1e-12,
  );
  for (let unit = 1; unit <= 3; unit++)
    for (const [dx, dy] of [
      [3, 4],
      [-3, -4],
      [0, 0],
      [0, 4],
    ]) {
      const p = physicalDistance(dx!, dy!, unit, unit);
      assert.equal(p.distance, unit * p.coordinateLength);
    }
});
