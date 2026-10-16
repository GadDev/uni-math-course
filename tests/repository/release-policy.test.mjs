import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateReleaseApproval } from '../../scripts/check-release.mjs';

const pending = {
  approved: false,
  approvedBy: null,
  approvedAt: null,
  evidence: null,
};
const accepted = {
  approved: true,
  approvedBy: 'Synthetic test operator',
  approvedAt: '2026-10-16T10:00:00Z',
  evidence: 'docs/PILOT_ACCEPTANCE.md',
};

test('the unreleased scaffold can merge while hosted acceptance is pending', () => {
  validateReleaseApproval('0.0.0', '0.0.0', pending);
});
test('first and later release versions fail closed without acceptance', () => {
  for (const version of ['0.1.0', '0.0.1', '0.2.0', '1.0.0']) {
    assert.throws(
      () => validateReleaseApproval(version, version, pending),
      /Hosted pilot acceptance pending/,
    );
  }
});
test('approval requires an operator, time and authoritative evidence', () => {
  for (const field of ['approvedBy', 'approvedAt', 'evidence']) {
    assert.throws(() =>
      validateReleaseApproval('0.1.0', '0.1.0', { ...accepted, [field]: null }),
    );
  }
  validateReleaseApproval('0.1.0', '0.1.0', accepted);
  assert.throws(() =>
    validateReleaseApproval('0.0.0', '0.0.0', {
      ...accepted,
      approvedBy: null,
    }),
  );
});
test('version drift and missing approval cannot silently pass', () => {
  assert.throws(
    () => validateReleaseApproval('0.1.0', '0.0.0', accepted),
    /versions differ/,
  );
  assert.throws(
    () => validateReleaseApproval('0.0.0', '0.0.0', {}),
    /approval must be explicit/,
  );
});
