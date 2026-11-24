import {
  assignments,
  compare,
  evaluate,
  formulaText,
  type Formula,
} from '../l04-boolean.ts';
import type { Locale } from '../i18n.ts';
import { questionBank, type Question } from './bank.ts';
import { display, parseFormula, usedVariables } from './formulas.ts';
import { lawTitles, rewrites } from './laws.ts';
import {
  levels,
  say,
  topics,
  type Grade,
  type PublicQuestion,
} from './types.ts';

const questionById = new Map(
  questionBank.map((question) => [question.id, question]),
);
type Chain = Extract<Question, { kind: 'rewrite' }>;

function hash(text: string) {
  let value = 2166136261;
  for (const character of text)
    value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return value >>> 0;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const items = [...values];
  let value = hash(seed);
  for (let last = items.length - 1; last > 0; last--) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const index = Math.floor((value / 2 ** 32) * (last + 1));
    [items[last], items[index]] = [items[index]!, items[last]!];
  }
  return items;
}

function choiceOrder(
  question: Extract<Question, { kind: 'choice' }>,
  seed: string,
) {
  const indices = question.options.map((_, index) => index);
  return question.comparison ? indices : shuffle(indices, seed + question.id);
}

function same(left: Formula, right: Formula) {
  return formulaText(left) === formulaText(right);
}

function chainOptions(question: Chain, current: Formula, seed: string) {
  function reachesGoal(term: Formula, depth: number): boolean {
    if (same(term, question.goal)) return true;
    return (
      depth > 0 &&
      rewrites(term, question.laws).some(({ next }) =>
        reachesGoal(next, depth - 1),
      )
    );
  }

  const valid = rewrites(current, question.laws).filter(({ next }) =>
    reachesGoal(next, 6),
  );
  const allMoves = rewrites(
    current,
    Object.keys(lawTitles) as (keyof typeof lawTitles)[],
  );
  const distractors = valid.slice(0, 2).map(({ next }, index) => {
    const plausible = shuffle(
      Object.keys(lawTitles) as (keyof typeof lawTitles)[],
      question.id + formulaText(current) + index,
    );
    const wrongLaw = plausible.find(
      (id) => !allMoves.some((move) => move.id === id && same(move.next, next)),
    )!;
    return { id: wrongLaw, next };
  });
  return shuffle(
    [
      ...valid.map((move) => ({ ...move, correct: true })),
      ...distractors.map((move) => ({ ...move, correct: false })),
    ],
    seed + question.id + formulaText(current),
  );
}

function tableOf(left: Formula, right?: Formula) {
  const variables =
    right === undefined ? usedVariables(left) : usedVariables(left, right);
  const columns =
    right === undefined
      ? [...variables, display(left)]
      : [...variables, 'P', 'Q'];
  const rows = assignments(variables).map((env) => [
    ...variables.map((variable) => Number(env[variable])),
    Number(evaluate(left, env)),
    ...(right === undefined ? [] : [Number(evaluate(right, env))]),
  ]);
  return { columns, rows };
}

export function publicQuestion(
  question: Question,
  locale: Locale,
  seed: string,
  current?: Formula,
): PublicQuestion {
  const base = {
    id: question.id,
    topic: question.topic,
    prompt: question.prompt[locale],
    detail: question.detail?.[locale],
  };
  switch (question.kind) {
    case 'choice':
      return {
        ...base,
        kind: 'choice',
        options: choiceOrder(question, seed).map(
          (index) => question.options[index]![locale],
        ),
      };
    case 'table': {
      const { columns, rows } = tableOf(question.formula);
      return {
        ...base,
        kind: 'table',
        table: { columns, rows: rows.map((row) => row.slice(0, -1)) },
      };
    }
    case 'formula':
      return { ...base, kind: 'formula' };
    case 'rewrite': {
      const term = current ?? question.start;
      return {
        ...base,
        kind: 'rewrite',
        detail: display(term) + '   →   ' + display(question.goal),
        options: chainOptions(question, term, seed).map(
          ({ id, next }) => display(next) + '  ·  ' + lawTitles[id][locale],
        ),
      };
    }
  }
}

function sessionQuestions(topic: unknown, level: unknown, seed: string) {
  if (topic !== 'mixed' && !topics.some((value) => value === topic))
    return null;
  if (level !== 'all' && !levels.some((value) => value === level)) return null;
  const pool = questionBank.filter(
    (q) =>
      (topic === 'mixed' || q.topic === topic) &&
      (level === 'all' || q.level === level),
  );
  const shuffled = shuffle(pool, seed);
  if (topic !== 'mixed') return shuffled.slice(0, 6);
  const spread = topics.flatMap(
    (value) => shuffled.find((q) => q.topic === value) ?? [],
  );
  return shuffle(
    [
      ...spread,
      ...shuffled
        .filter((q) => !spread.includes(q))
        .slice(0, 8 - spread.length),
    ],
    seed + 'mixed',
  );
}

function indexOf(answer: unknown, length: number): number | null {
  return typeof answer === 'number' &&
    Number.isInteger(answer) &&
    answer >= 0 &&
    answer < length
    ? answer
    : null;
}

export function gradeAnswer(
  question: Question,
  locale: Locale,
  seed: string,
  answer: unknown,
  steps: unknown,
  reveal = false,
): Grade | null {
  const fr = locale === 'fr';
  const done = (state: 'correct' | 'revealed'): Grade => ({
    state,
    message:
      state === 'correct'
        ? fr
          ? 'Bien joué !'
          : 'Well done!'
        : fr
          ? 'Solution expliquée'
          : 'Worked solution',
    solution: question.solution[locale],
    table:
      question.kind === 'table'
        ? tableOf(question.formula)
        : question.kind === 'choice' && question.comparison
          ? tableOf(...question.comparison)
          : question.kind === 'rewrite'
            ? tableOf(question.start, question.goal)
            : undefined,
  });
  const incorrect = (message: string, cells?: boolean[]): Grade => ({
    state: 'incorrect',
    message,
    hint: question.hint[locale],
    cells,
  });

  if (reveal) return done('revealed');
  switch (question.kind) {
    case 'choice': {
      const order = choiceOrder(question, seed);
      const index = indexOf(answer, order.length);
      if (index === null) return null;
      const selected = order[index]!;
      if (question.correct.includes(selected)) return done('correct');
      const message = question.comparison
        ? selected === 0
          ? say(
              'Au moins une ligne donne deux valeurs différentes.',
              'At least one row produces different values.',
            )
          : say(
              'Sur cette ligne, les deux formules ont la même valeur.',
              'On that row, the two formulas have the same value.',
            )
        : question.id.startsWith('law-')
          ? say(
              'Cette loi ne donne pas directement la réécriture affichée.',
              'That law does not directly produce the displayed rewrite.',
            )
          : say(
              'Ce choix ne correspond pas à l’énoncé.',
              'This choice does not match the statement.',
            );
      return incorrect(message[locale]);
    }
    case 'table': {
      const expected = tableOf(question.formula).rows.map((row) => row.at(-1));
      if (
        !Array.isArray(answer) ||
        answer.length !== expected.length ||
        answer.some((bit) => bit !== 0 && bit !== 1)
      )
        return null;
      const cells = expected.map((bit, index) => bit === answer[index]);
      return cells.every(Boolean)
        ? done('correct')
        : incorrect(
            fr
              ? 'Reprenez le calcul sur les lignes signalées.'
              : 'Recalculate the marked rows.',
            cells,
          );
    }
    case 'formula': {
      if (typeof answer !== 'string') return null;
      const parsed = parseFormula(answer);
      if (parsed === null)
        return incorrect(
          fr
            ? 'La formule contient un symbole inattendu ou des parenthèses mal fermées.'
            : 'The formula contains an unexpected symbol or mismatched parentheses.',
        );
      if (
        usedVariables(parsed).some(
          (variable) => !question.variables.includes(variable),
        )
      ) {
        return incorrect(
          fr
            ? 'Utilisez uniquement les variables de l’énoncé.'
            : 'Use only the variables defined in the question.',
        );
      }
      if (question.exact)
        return same(parsed, question.formula)
          ? done('correct')
          : incorrect(
              fr
                ? 'Vérifiez l’ordre et la négation des deux côtés de la flèche.'
                : 'Check the order and negation on both sides of the arrow.',
            );
      const witness = compare(
        question.formula,
        parsed,
        question.variables,
      ).counterexample;
      if (!witness) return done('correct');
      const values = question.variables
        .map((variable) => variable + '=' + Number(witness.env[variable]))
        .join(', ');
      return incorrect(
        fr
          ? 'Votre formule ne traduit pas le cas ' + values + '.'
          : 'Your formula does not match the statement when ' + values + '.',
      );
    }
    case 'rewrite': {
      if (!Array.isArray(steps) || steps.length > 7) return null;
      let current = question.start;
      for (const step of steps) {
        const options = chainOptions(question, current, seed);
        const index = indexOf(step, options.length);
        if (index === null || !options[index]?.correct) return null;
        current = options[index]!.next;
      }
      const options = chainOptions(question, current, seed);
      const index = indexOf(answer, options.length);
      if (index === null) return null;
      const move = options[index]!;
      if (!move.correct)
        return incorrect(
          fr
            ? 'La loi choisie ne justifie pas ce passage.'
            : 'The chosen law does not justify this step.',
        );
      if (same(move.next, question.goal)) return done('correct');
      return {
        state: 'continue',
        message: fr
          ? 'Étape validée. Continuez la simplification.'
          : 'Step accepted. Keep simplifying.',
        question: publicQuestion(question, locale, seed, move.next),
      };
    }
  }
}

export function workshopRequest(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { action, locale, seed, topic, level, ids, id, answer, steps } =
    body as Record<string, unknown>;
  if (
    (locale !== 'fr' && locale !== 'en') ||
    typeof seed !== 'string' ||
    !/^[\da-f-]{1,64}$/i.test(seed)
  )
    return null;
  if (action === 'start') {
    const questions = sessionQuestions(topic, level, seed);
    return questions
      ? {
          questions: questions.map((question) =>
            publicQuestion(question, locale, seed),
          ),
        }
      : null;
  }
  if (action === 'retry') {
    if (
      !Array.isArray(ids) ||
      !ids.length ||
      ids.length > 8 ||
      new Set(ids).size !== ids.length
    )
      return null;
    const questions = ids.map((identifier) =>
      typeof identifier === 'string' ? questionById.get(identifier) : undefined,
    );
    if (questions.some((question) => !question)) return null;
    return {
      questions: shuffle(questions, seed).map((question) =>
        publicQuestion(question!, locale, seed),
      ),
    };
  }
  const question = typeof id === 'string' ? questionById.get(id) : undefined;
  if (question && (action === 'grade' || action === 'reveal'))
    return gradeAnswer(
      question,
      locale,
      seed,
      answer,
      steps,
      action === 'reveal',
    );
  return null;
}
