import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkTable,
  verificationReport,
} from '../../.claude/skills/math-course-studio/scripts/logic-check.ts';

type FixtureItem = {
  id: string;
  type: string;
  variables?: string[];
  rows?: ({ id: string } & Record<string, unknown>)[];
  answer?: Record<string, unknown>;
};
type MutableTable = FixtureItem & {
  rows: NonNullable<FixtureItem['rows']>;
  answer: NonNullable<FixtureItem['answer']>;
};
function tableFor(id: string, source = bank): MutableTable {
  const item = source.exercises.find((item) => item.id === id);
  assert.ok(item && item.rows && item.answer);
  return item as MutableTable;
}
const script = fileURLToPath(
  new URL(
    '../../.claude/skills/math-course-studio/scripts/logic-check.ts',
    import.meta.url,
  ),
);
const bank: { exercises: FixtureItem[] } = JSON.parse(
  await readFile(
    new URL('../../exercises/L07/v2.json', import.meta.url),
    'utf8',
  ),
);
const tables = bank.exercises
  .filter((item) => item.type === 'truth-table')
  .map((item) => tableFor(item.id));
const checks = [
  { id: 'L07-E02', kind: 'table', formula: 'A <=> B' },
  { id: 'L07-E05', kind: 'table', formula: '!(A & B) <=> (!A | !B)' },
];
const supplemental = {
  id: 'L07-E05',
  kind: 'equivalent',
  left: 'A => B',
  right: '!A | B',
  expected: true,
};

async function cli(input: unknown, manifest: unknown) {
  const directory = await mkdtemp(join(tmpdir(), 'math-coverage-'));
  try {
    const bankPath = join(directory, 'bank.json');
    const checksPath = join(directory, 'checks.json');
    await writeFile(bankPath, JSON.stringify(input));
    await writeFile(checksPath, JSON.stringify(manifest));
    return spawnSync(process.execPath, [script, bankPath, checksPath], {
      cwd: directory,
      encoding: 'utf8',
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

const noCompleteClaim = (
  result: ReturnType<typeof cli> extends Promise<infer R> ? R : never,
) => assert.doesNotMatch(result.stdout, /^Complete truth-table key coverage/m);

test('empty and malformed manifests fail instead of claiming zero successful checks', async () => {
  for (const manifest of [[], {}, null, [null], [7], [{ kind: 'unknown' }]]) {
    const result = await cli(bank, manifest);
    assert.equal(result.status, 1, JSON.stringify(manifest));
    noCompleteClaim(result);
    assert.doesNotMatch(result.stdout, /All .*agree with the keys/);
  }
});

test('a supplemental check with an exercise ID does not cover a wrong stored answer', async () => {
  const wrong = structuredClone(bank);
  tableFor('L07-E05', wrong).answer['00'] = false;
  const report = verificationReport(wrong, [supplemental]);
  assert.equal(report.ok, false);
  assert.deepEqual(report.coverage.matched, []);
  assert.deepEqual(
    report.coverage.unchecked,
    tables.map((item) => item.id),
  );
  assert.equal(report.coverage.supplementalPassed, 1);
  const result = await cli(wrong, [supplemental]);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /UNVERIFIED truth-table keys.*L07-E02, L07-E05/);
  assert.match(result.stdout, /Supplemental checks: 1 passed/);
  noCompleteClaim(result);
});

test('partial coverage lists the matched key and omitted wrong key, and fails', async () => {
  const wrong = structuredClone(bank);
  tableFor('L07-E05', wrong).answer['00'] = false;
  const result = await cli(wrong, [checks[0]]);
  assert.equal(result.status, 1);
  assert.match(
    result.stdout,
    /matched against supplied formulas: 1\/2 \(L07-E02\)/,
  );
  assert.match(result.stdout, /UNVERIFIED truth-table keys.*L07-E05/);
  noCompleteClaim(result);
});

test('complete linked coverage succeeds while leaving single-choice semantics unverified', async () => {
  const result = await cli(bank, [...checks, supplemental]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /matched against supplied formulas: 2\/2 \(L07-E02, L07-E05\)/,
  );
  assert.match(
    result.stdout,
    /NOT automatically verified.*L07-E01, L07-E03, L07-E04, L07-E06/,
  );
  assert.match(result.stdout, /Scope: table, equivalence and classification/);
  assert.match(
    result.stdout,
    /Complete truth-table key coverage against supplied formulas/,
  );
  assert.doesNotMatch(result.stdout, /All .*agree with the keys/);
});

test('a failed linked key is reported even when other checks pass', async () => {
  const wrong = structuredClone(bank);
  tableFor('L07-E02', wrong).answer['01'] = true;
  const result = await cli(wrong, [...checks, supplemental]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /row 01: key says true, formula gives false/);
  assert.match(result.stdout, /Failed key comparisons: L07-E02/);
  assert.match(
    result.stdout,
    /matched against supplied formulas: 1\/2 \(L07-E05\)/,
  );
  noCompleteClaim(result);
});

test('duplicate checks cannot inflate coverage or conceal a contradictory comparison', () => {
  assert.deepEqual(
    verificationReport(bank, [...checks, checks[0]]).coverage.matched,
    ['L07-E02', 'L07-E05'],
  );
  const report = verificationReport(bank, [
    ...checks,
    { ...checks[0], formula: 'A & B' },
  ]);
  assert.equal(report.ok, false);
  assert.deepEqual(report.coverage.matched, ['L07-E05']);
  assert.deepEqual(report.coverage.failed, ['L07-E02']);
});

test('incomplete, duplicated or mislabelled Boolean rows cannot count as key verification', () => {
  const table = tables[0]!;
  const changed = (mutate: (item: MutableTable) => void) => {
    const item = structuredClone(table);
    mutate(item);
    return item;
  };
  const malformed = [
    changed((item) => {
      item.rows = [];
    }),
    changed((item) => {
      item.rows.pop();
    }),
    changed((item) => {
      item.rows[1] = item.rows[0]!;
    }),
    changed((item) => {
      item.rows[0]!.A = true;
    }),
    changed((item) => {
      item.rows[0]!.A = 0;
    }),
    changed((item) => {
      delete item.answer['00'];
    }),
    changed((item) => {
      item.answer['00'] = 1;
    }),
    changed((item) => {
      item.variables = ['A', 'A'];
    }),
    changed((item) => {
      item.variables = [];
    }),
  ];
  for (const item of malformed)
    assert.ok(checkTable(item, 'A <=> B').length > 0);
  assert.match(checkTable(table, 'A <=> C').join(), /undeclared variable/);
});

test('unknown exercise IDs or single-choice links fail without counting coverage', () => {
  for (const id of ['absent', 'L07-E04']) {
    const report = verificationReport(bank, [
      ...checks,
      { kind: 'table', id, formula: 'true' },
    ]);
    assert.equal(report.ok, false);
    assert.ok(report.results.at(-1)!.problems.length);
    assert.deepEqual(report.coverage.matched, ['L07-E02', 'L07-E05']);
  }
  const duplicate = structuredClone(bank);
  duplicate.exercises[1]!.id = duplicate.exercises[0]!.id;
  assert.throws(
    () => verificationReport(duplicate, checks),
    /distinct exercise IDs/,
  );
});

test('supplemental-only banks may pass their checks without claiming any key was verified', async () => {
  const noTables = {
    exercises: bank.exercises.filter((item) => item.type === 'single-choice'),
  };
  const result = await cli(noTables, [supplemental]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /No truth-table answer keys.*no stored answer keys were automatically verified/,
  );
  assert.match(
    result.stdout,
    /matched against supplied formulas: 0\/0 \(none\)/,
  );
  noCompleteClaim(result);
});

test('value checks require own Boolean assignments, not inherited or truthy values', () => {
  for (const assignment of [{}, { A: 1 }, { A: 'false' }]) {
    const report = verificationReport({ exercises: [] }, [
      { kind: 'value', formula: 'A', assignment, expected: true },
    ]);
    assert.equal(report.ok, false);
  }
  const report = verificationReport({ exercises: [] }, [
    { kind: 'value', formula: '!constructor', assignment: {}, expected: false },
  ]);
  assert.equal(report.ok, false);
});

test('scope reporting distinguishes a single assignment from exhaustive formula checks', async () => {
  const valueCheck = {
    kind: 'value',
    formula: 'A => B',
    assignment: { A: true, B: false },
    expected: false,
  };
  const report = verificationReport(bank, [...checks, valueCheck]);
  assert.equal(
    report.results[0]!.verificationScope,
    'exhaustive finite Boolean assignments',
  );
  assert.equal(
    report.results.at(-1)!.verificationScope,
    'one supplied Boolean assignment',
  );
  const result = await cli(bank, [...checks, valueCheck]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /value \(supplemental; one supplied Boolean assignment\)/,
  );
});
