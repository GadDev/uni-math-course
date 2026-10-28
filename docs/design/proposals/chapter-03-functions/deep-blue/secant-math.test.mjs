import { test } from 'node:test';
import assert from 'node:assert/strict';
import { f, derivative, secantSlope } from './secant-math.mjs';
test('source parabola and derivative at P=(1,0.5)', () => {
  assert.equal(f(1), 0.5);
  assert.equal(derivative(1), 1);
});
test('secant slopes match PDF slide progression and approach 1', () => {
  for (const [h, expected] of [[2,2],[1,1.5],[0.5,1.25],[0.25,1.125],[0.1,1.05],[-1,0.5],[-2,0]]) {
    assert.ok(Math.abs(secantSlope(1,h) - expected) < 1e-10, 'h='+h);
  }
  assert.ok(Math.abs(secantSlope(1,0.01)-1) < 0.006);
  assert.ok(Math.abs(secantSlope(1,-0.01)-1) < 0.006);
});
test('quotient is undefined at h=0, even though derivative exists', () => {
  assert.equal(secantSlope(1,0), null);
  assert.equal(derivative(1), 1);
});
