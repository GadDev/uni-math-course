/** Pedagogical LZW: one-based codes, explicit shared alphabet, no resets or bit packing.
 * Decoding keeps the professor's pending `u?` separate from completed entries. */
export type Entry = { code: number; word: string };
export type LzwStep = {
  before: Entry[];
  after: Entry[];
  w: string;
  c: string;
  phrase: string;
  emitted: number | null;
  added: Entry | null;
  pendingBefore: Entry | null;
  pending: Entry | null;
  special: boolean;
  final: boolean;
  consumed: number;
};
export type LzwResult = {
  alphabet: string;
  message: string;
  codes: number[];
  steps: LzwStep[];
};
export type LzwError = 'alphabet' | 'message' | 'codes' | 'unknown-code';
export class LzwInputError extends Error {
  reason: LzwError;
  constructor(reason: LzwError) {
    super(reason);
    this.reason = reason;
  }
}

export function initialDictionary(alphabet: string): Entry[] {
  if (
    !/^[A-Z]{1,8}$/.test(alphabet) ||
    new Set(alphabet).size !== alphabet.length
  )
    throw new LzwInputError('alphabet');
  return [...alphabet].map((word, index) => ({ code: index + 1, word }));
}

export function parseCodes(input: string): number[] {
  const values = input.trim().split(/[\s,;]+/);
  if (
    values.length > 96 ||
    values.some(
      (value) =>
        !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)),
    )
  )
    throw new LzwInputError('codes');
  return values.map(Number);
}

export function encodeLzw(message: string, alphabet: string): LzwResult {
  let dictionary = initialDictionary(alphabet);
  if (
    !message.length ||
    message.length > 96 ||
    [...message].some((c) => !alphabet.includes(c))
  )
    throw new LzwInputError('message');
  const steps: LzwStep[] = [];
  const codes: number[] = [];
  let w = message[0]!;
  for (let index = 1; index < message.length; index++) {
    const c = message[index]!;
    const before = dictionary;
    const found = dictionary.some((entry) => entry.word === w + c);
    const added = found ? null : { code: dictionary.length + 1, word: w + c };
    const emitted = found
      ? null
      : dictionary.find((entry) => entry.word === w)!.code;
    if (added) dictionary = [...dictionary, added];
    if (emitted !== null) codes.push(emitted);
    steps.push({
      before,
      after: dictionary,
      w,
      c,
      phrase: w + c,
      emitted,
      added,
      pendingBefore: null,
      pending: null,
      special: false,
      final: false,
      consumed: index + 1,
    });
    w = found ? w + c : c;
  }
  const emitted = dictionary.find((entry) => entry.word === w)!.code;
  codes.push(emitted);
  steps.push({
    before: dictionary,
    after: dictionary,
    w,
    c: '',
    phrase: w,
    emitted,
    added: null,
    pendingBefore: null,
    pending: null,
    special: false,
    final: true,
    consumed: message.length,
  });
  return { alphabet, message, codes, steps };
}

export function decodeLzw(codes: number[], alphabet: string): LzwResult {
  let dictionary = initialDictionary(alphabet);
  if (
    !codes.length ||
    codes.length > 96 ||
    codes.some((code) => !Number.isSafeInteger(code) || code < 1)
  )
    throw new LzwInputError('codes');
  const steps: LzwStep[] = [];
  let previous = '';
  let message = '';
  for (const [index, code] of codes.entries()) {
    const before = dictionary;
    const next = dictionary.length + 1;
    const pendingBefore = previous
      ? { code: next, word: previous + '?' }
      : null;
    const known = dictionary.find((entry) => entry.code === code);
    const special = !known && !!previous && code === next;
    if (!known && !special) throw new LzwInputError('unknown-code');
    const phrase = known?.word ?? previous + previous[0]!;
    const added = previous ? { code: next, word: previous + phrase[0]! } : null;
    if (added) dictionary = [...dictionary, added];
    message += phrase;
    // A bounded sandbox, including for valid but very expansive custom codes.
    if (message.length > 96) throw new LzwInputError('message');
    steps.push({
      before,
      after: dictionary,
      w: previous,
      c: String(code),
      phrase,
      emitted: code,
      added,
      pendingBefore,
      pending: { code: dictionary.length + 1, word: phrase + '?' },
      special,
      final: index === codes.length - 1,
      consumed: index + 1,
    });
    previous = phrase;
  }
  return { alphabet, message, codes: [...codes], steps };
}

export const lzwExamples = [
  { message: 'BANANABANANA', alphabet: 'ABN' },
  { message: 'LALALALALA', alphabet: 'AL' },
  { message: 'ABABABA', alphabet: 'AB' },
  { message: 'ANANAS', alphabet: 'ANS' },
  { message: 'AAAAAA', alphabet: 'A' },
] as const;
export type Difficulty = 'starter' | 'intermediate' | 'advanced';
/** Stable integer PRNG. The seed and level completely determine the exercise. */
export function generateLzw(seed: number, level: Difficulty): LzwResult {
  if (!Number.isInteger(seed) || seed < 1 || seed > 0xffffffff)
    throw new LzwInputError('codes');
  let state = seed >>> 0;
  const random = (n: number) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return Math.floor((state / 0x100000000) * n);
  };
  const alphabet =
    level === 'starter' ? 'AB' : level === 'intermediate' ? 'ABN' : 'ABCD';
  const length = level === 'starter' ? 8 : level === 'intermediate' ? 20 : 40;
  const motif = Array.from(
    { length: level === 'advanced' ? 5 : 3 },
    () => alphabet[random(alphabet.length)]!,
  ).join('');
  let message = '';
  // Advanced exercises deliberately begin with a case that needs the special rule.
  if (level === 'advanced') message = 'ABABABA';
  while (message.length < length)
    message += random(4) === 0 ? alphabet[random(alphabet.length)] : motif;
  return encodeLzw(message.slice(0, length), alphabet);
}
