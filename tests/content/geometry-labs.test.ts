import test from 'node:test';
import assert from 'node:assert/strict';
import {
  equationTest,
  throughPoints,
  intersection,
  regionTest,
  toScreen,
  fromScreen,
  bresenham,
  sampleSegment,
  residualTable,
  centredSums,
  observations,
} from '../../src/lib/geometry-labs.ts';

test('equation transformations expose added solutions and circles use squared radius', () => {
  for (let x = -3; x <= 3; x++)
    for (let y = -3; y <= 3; y++) {
      const p = { x, y };
      const squared = equationTest('squared', p),
        multiplied = equationTest('multiplied', p);
      assert.equal(squared.left === squared.right, y === x || y === -x);
      assert.equal(multiplied.left === multiplied.right, y === x || x === 0);
    }
  assert.deepEqual(equationTest('circle', { x: 0, y: 2 }), {
    left: 4,
    right: 4,
  });
  assert.notEqual(
    equationTest('line', { x: 1, y: -1 }).left,
    equationTest('line', { x: 1, y: -1 }).right,
  );
});
test('two-point construction handles repeated points, verticals and reversed order', () => {
  assert.equal(throughPoints({ x: 1, y: 1 }, { x: 1, y: 1 }).kind, 'repeated');
  assert.deepEqual(throughPoints({ x: 1, y: 1 }, { x: 1, y: 4 }), {
    kind: 'vertical',
    x: 1,
  });
  for (const [a, b] of [
    [
      { x: 0, y: 2 },
      { x: 2, y: 0 },
    ],
    [
      { x: -3, y: 5 },
      { x: 4, y: -2 },
    ],
    [
      { x: 1, y: 4 },
      { x: 3, y: 10 },
    ],
  ]) {
    const r = throughPoints(a!, b!);
    assert.equal(r.kind, 'affine');
    if (r.kind !== 'affine') continue;
    assert.equal(r.m * a!.x + r.p, a!.y);
    assert.equal(r.m * b!.x + r.p, b!.y);
    assert.deepEqual(throughPoints(b!, a!), r);
  }
});
test('intersection classification agrees with substitution, including off-window points', () => {
  assert.deepEqual(intersection(2, 1, -1, 4), { kind: 'unique', x: 1, y: 3 });
  assert.deepEqual(intersection(2, 1, 2, 3), { kind: 'parallel' });
  assert.deepEqual(intersection(2, 1, 2, 1), { kind: 'coincident' });
  const r = intersection(2, 1, 1.75, 6);
  assert.equal(r.kind, 'unique');
  if (r.kind === 'unique') {
    assert.equal(r.x, 20);
    assert.equal(r.y, 41);
    assert.equal(1.75 * r.x + 6, r.y);
  }
});
test('half-plane boundaries and all three triangle constraints are enforced', () => {
  assert.equal(regionTest({ x: 2, y: 2 }, 'open').inside, false);
  assert.equal(regionTest({ x: 2, y: 2 }, 'closed').inside, true);
  for (const p of [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 3 },
    { x: 1, y: 1 },
  ])
    assert.equal(regionTest(p, 'triangle').inside, true);
  for (const p of [
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: 3, y: 2 },
  ])
    assert.equal(regionTest(p, 'triangle').inside, false);
});
test('screen transforms invert before rounding, reverse vertical changes and reject zero scales', () => {
  for (const sx of [10, 40, 60])
    for (const sy of [10, 50, 60])
      for (const p of [
        { x: 0, y: 0 },
        { x: -2, y: 3 },
        { x: 1.25, y: -0.5 },
      ]) {
        const s = toScreen(p, sx, sy)!;
        assert.deepEqual(fromScreen(s.u, s.v, sx, sy), p);
        assert.equal(toScreen({ x: p.x, y: p.y + 1 }, sx, sy)!.v - s.v, -sy);
      }
  assert.deepEqual(toScreen({ x: 2, y: 1 }, 50, 50), { u: 300, v: 100 });
  for (const scale of [0, -1, NaN, Infinity]) {
    assert.equal(toScreen({ x: 1, y: 1 }, scale, 1), null);
    assert.equal(fromScreen(1, 1, 1, scale), null);
  }
});
test('Bresenham agrees with independent exact integer rounding with ties down throughout the window', () => {
  for (let u2 = 1; u2 <= 12; u2++)
    for (let v2 = 0; v2 <= u2; v2++) {
      const steps = bresenham(u2, v2)!;
      assert.equal(steps.length, u2 + 1);
      for (const [i, p] of steps.entries()) {
        // Integer oracle: nearest height, with exact half-way values rounded down.
        assert.equal(p.y, Math.floor((2 * v2 * i + u2 - 1) / (2 * u2)));
        assert.equal(p.d, 2 * v2 * (p.x + 1) - u2 * (2 * p.y + 1));
        if (i === u2) {
          assert.equal(p.choice, 'end');
          assert.equal(p.y, v2);
          continue;
        }
        const next = steps[i + 1]!;
        assert.equal(next.x, p.x + 1);
        assert.equal(next.y, p.y + (p.d > 0 ? 1 : 0));
        assert.equal(next.d, p.d + 2 * v2 - (p.d > 0 ? 2 * u2 : 0));
      }
    }
  assert.equal(bresenham(2, 1)![0]!.choice, 'E');
  for (const [u, v] of [
    [0, 0],
    [3, 8],
    [4, -1],
    [2.5, 1],
    [13, 1],
  ])
    assert.equal(bresenham(u!, v!), null);
});
test('sampling chooses the main axis and keeps its separate upward tie convention', () => {
  assert.equal(sampleSegment(3, 8, 'x')!.length, 4);
  const rows = sampleSegment(3, 8, 'y')!;
  assert.equal(rows.length, 9);
  assert.deepEqual(
    rows.map((p) => p.x),
    [0, 0, 1, 1, 2, 2, 2, 3, 3],
  );
  assert.deepEqual(sampleSegment(2, 1, 'x'), [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ]);
  assert.deepEqual(sampleSegment(0, 0, 'x'), [{ x: 0, y: 0 }]);
  assert.equal(sampleSegment(0, 5, 'x'), null);
  assert.equal(sampleSegment(5, 0, 'y'), null);
});
test('residuals, squared loss and centred sums match independent rational examples', () => {
  assert.equal(residualTable(1, 1).loss, 1);
  assert.equal(residualTable(0, 2).loss, 1);
  const r = residualTable(0.5, 7 / 6);
  assert.ok(Math.abs(r.sum) < 1e-12);
  assert.ok(Math.abs(r.loss - 1 / 6) < 1e-12);
  assert.ok(Math.abs(r.mse! - 1 / 18) < 1e-12);
  const c = centredSums(observations)!;
  assert.equal(c.meanX, 1);
  assert.equal(c.meanY, 5 / 3);
  assert.equal(c.xx, 2);
  assert.equal(c.xy, 1);
  assert.ok(Math.abs(c.yy - 2 / 3) < 1e-12);
  assert.equal(centredSums([]), null);
  assert.equal(residualTable(1, 1, []).mse, null);
});

test('circles distinguish radius zero, boundary and disk interior', async () => {
  const { circleTest } = await import('../../src/lib/geometry-labs.ts');
  assert.equal(circleTest({ x: 2, y: -1 }, 3, { x: 5, y: -1 })!.onCircle, true);
  assert.equal(
    circleTest({ x: 2, y: -1 }, 3, { x: 2, y: -1 })!.onCircle,
    false,
  );
  assert.equal(circleTest({ x: 2, y: -1 }, 0, { x: 2, y: -1 })!.onCircle, true);
  assert.equal(circleTest({ x: 2, y: -1 }, 0, { x: 2, y: 0 })!.onCircle, false);
  assert.equal(circleTest({ x: 0, y: 0 }, -1, { x: 0, y: 0 }), null);
});
test('triangle same-side tests agree with independent barycentric coordinates in both orientations', async () => {
  const { triangleTest } = await import('../../src/lib/geometry-labs.ts');
  const a = { x: -1, y: 0 },
    b = { x: 4, y: 1 },
    c = { x: 0, y: 4 };
  const det = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  for (let x = -2; x <= 6; x++)
    for (let y = -2; y <= 6; y++) {
      const l1 = ((b.y - c.y) * (x - c.x) + (c.x - b.x) * (y - c.y)) / det;
      const l2 = ((c.y - a.y) * (x - c.x) + (a.x - c.x) * (y - c.y)) / det;
      const l3 = 1 - l1 - l2;
      const expected = l1 >= -1e-12 && l2 >= -1e-12 && l3 >= -1e-12;
      assert.equal(triangleTest([a, b, c], { x, y }).inside, expected);
      assert.equal(triangleTest([a, c, b], { x, y }).inside, expected);
    }
  for (const vertices of [
    [a, a, c],
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 0 },
    ],
  ] as [typeof a, typeof b, typeof c][]) {
    const r = triangleTest(vertices, { x: 1, y: 0 });
    assert.equal(r.degenerate, true);
    assert.equal(r.inside, null);
  }
});
test('quantization has an explicit tie rule, bounded error and a many-to-one inverse', async () => {
  const { roundPixel, quantizePoint } =
    await import('../../src/lib/geometry-labs.ts');
  for (const [x, expected] of [
    [0.5, 1],
    [-0.5, 0],
    [-1.5, -1],
    [8.5, 9],
  ])
    assert.equal(roundPixel(x!), expected);
  const a = quantizePoint({ x: 0.12, y: 0.12 }, 2, 2)!,
    b = quantizePoint({ x: 0.18, y: 0.18 }, 2, 2)!;
  assert.deepEqual([a.u, a.v], [b.u, b.v]);
  assert.deepEqual(a.recovered, { x: 0, y: 0 });
  for (const sx of [1, 2, 4])
    for (const sy of [1, 3, 4])
      for (let k = -100; k <= 400; k += 7) {
        const p = { x: k / 100, y: (k + 3) / 100 },
          q = quantizePoint(p, sx, sy)!;
        assert.ok(Math.abs(q.errorX) <= 1 / (2 * sx) + 1e-12);
        assert.ok(Math.abs(q.errorY) <= 1 / (2 * sy) + 1e-12);
      }
  const edge = quantizePoint({ x: 2.3, y: 0 }, 2, 2)!;
  assert.equal(edge.continuousVisible, true);
  assert.equal(edge.pixelVisible, false);
  assert.equal(quantizePoint({ x: 0, y: 0 }, 0, 2), null);
});
test('editable centred rows retain zero sums and separate spread from cross sign', async () => {
  const { centeredRows } = await import('../../src/lib/geometry-labs.ts');
  for (const data of [
    observations,
    [
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ],
    [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  ]) {
    const r = centeredRows(data)!;
    assert.ok(Math.abs(r.sumDx) < 1e-12);
    assert.ok(Math.abs(r.sumDy) < 1e-12);
    // Pairwise covariance identity is independent of subtracting means row by row.
    let cross = 0;
    for (const a of data)
      for (const b of data) cross += (a.x - b.x) * (a.y - b.y);
    assert.ok(Math.abs(r.xy - cross / (2 * data.length)) < 1e-12);
  }
  assert.equal(
    centeredRows([
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ])!.xy,
    -2,
  );
  assert.equal(
    centeredRows([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ])!.xx,
    0,
  );
});
