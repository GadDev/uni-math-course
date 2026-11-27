import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const svg = (lang: string) =>
  readFileSync(
    `public/diagrams/information/l52-log-tangent-${lang}.svg`,
    'utf8',
  );

test('original logarithm figure plots ln(x) below its tangent on shared numeric axes', () => {
  for (const locale of ['fr', 'en']) {
    const drawing = svg(locale);
    const curve = drawing.match(/data-function="ln" points="([^"]+)"/);
    assert.ok(curve);
    const points = curve[1]!
      .split(' ')
      .map((pair) => pair.split(',').map(Number));
    assert.equal(points.length, 111);
    for (const [screenX, screenY] of points) {
      // Inverse affine scales from the published axes: x 0..3, y -1.5..2.5.
      const x = (screenX! - 60) / 120;
      const y = (285 - screenY!) / 50 - 1.5;
      assert.ok(x > 0);
      assert.ok(Math.abs(y - Math.log(x)) < 0.00001);
      assert.ok(y <= x - 1 + 0.00001);
    }
    assert.match(drawing, /cx="180\.0000" cy="210\.0000"/);
    const tangent = [...drawing.matchAll(/<line ([^>]+)\/>/g)].find(
      (m) => m[1]!.includes('x1="60.0"') && m[1]!.includes('stroke-dasharray'),
    );
    assert.ok(tangent);
    const coordinates = ['x1', 'y1', 'x2', 'y2'].map((key) =>
      Number(tangent[1]!.match(new RegExp(`${key}="([^"]+)"`))![1]),
    );
    assert.deepEqual(coordinates, [60, 260, 420, 110]);
    assert.match(drawing, /stroke-dasharray="7 5"/);
  }
  const points = (drawing: string) =>
    drawing.match(/data-function="ln" points="([^"]+)"/)![1];
  assert.equal(points(svg('fr')), points(svg('en')));
});
