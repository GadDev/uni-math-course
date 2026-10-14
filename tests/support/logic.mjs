import { readFile } from 'node:fs/promises';
import { validateBank } from '../../scripts/check-content.mjs';

export const loadBank = async (lessonId) =>
  validateBank(
    JSON.parse(
      await readFile(
        new URL(`../../exercises/${lessonId}/v1.json`, import.meta.url),
        'utf8',
      ),
    ),
  );

export const itemOf = (bank, id) => bank.exercises.find((e) => e.id === id);

// Every assignment of the given variables, in standard row order.
export const envsOf = (vars) =>
  Array.from({ length: 2 ** vars.length }, (_, n) =>
    Object.fromEntries(
      vars.map((v, i) => [v, Boolean((n >> (vars.length - 1 - i)) & 1)]),
    ),
  );

export const rowId = (env, vars) =>
  vars.map((v) => String(Number(env[v]))).join('');

export const equivalent = (f, g, vars) =>
  envsOf(vars).every((env) => f(env) === g(env));

export const implies = (a, b) => !a || b;
export const iff = (a, b) => a === b;
