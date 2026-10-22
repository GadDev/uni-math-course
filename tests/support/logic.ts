import assert from 'node:assert/strict';
import type {
  ExerciseBank,
  BankExercise,
} from '../../scripts/content-types.ts';
export type Environment = Record<string, boolean>;
export type Formula = (env: Environment) => boolean | undefined;
import { readFile } from 'node:fs/promises';
import { validateBank } from '../../scripts/check-content.ts';

export const loadBank = async (lessonId: string) => {
  const releases = JSON.parse(
    await readFile(
      new URL('../../content/releases.json', import.meta.url),
      'utf8',
    ),
  );
  const version = releases.lessons[lessonId].version;
  return validateBank(
    JSON.parse(
      await readFile(
        new URL(
          `../../exercises/${lessonId}/v${version}.json`,
          import.meta.url,
        ),
        'utf8',
      ),
    ),
  );
};

export function itemOf(bank: ExerciseBank, id: string) {
  const item = bank.exercises.find((e) => e.id === id);
  assert.ok(item, `Missing exercise ${id}`);
  return item;
}
export function choiceOf(bank: ExerciseBank, id: string) {
  const item = itemOf(bank, id);
  assert.equal(item.type, 'single-choice');
  assert.ok(item.type === 'single-choice');
  return item;
}
export function tableOf(bank: ExerciseBank, id: string) {
  const item = itemOf(bank, id);
  assert.ok(item.type === 'truth-table');
  return item;
}

// Every assignment of the given variables, in standard row order.
export const envsOf = (vars: string[]) =>
  Array.from({ length: 2 ** vars.length }, (_, n) =>
    Object.fromEntries(
      vars.map((v, i) => [v, Boolean((n >> (vars.length - 1 - i)) & 1)]),
    ),
  );

export const rowId = (env: Environment, vars: string[]) =>
  vars.map((v) => String(Number(env[v]))).join('');

export const equivalent = (f: Formula, g: Formula, vars: string[]) =>
  envsOf(vars).every((env) => f(env) === g(env));

export const implies = (a: unknown, b: unknown) => !a || Boolean(b);
export const iff = (a: unknown, b: unknown) => a === b;
