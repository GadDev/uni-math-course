export const students = ['ana', 'ben', 'cleo'] as const;
export const courses = ['math', 'prog'] as const;
export const files = ['f1', 'f2'] as const;
export const initialRelation = [[true, true], [false, true], [false, false]];

export function relationFacts(grid: readonly (readonly boolean[])[]) {
  return {
    every: grid.every((row) => row.some(Boolean)),
    common: courses.filter((_, c) => grid.every((row) => row[c])),
    allCourses: students.filter((_, s) => grid[s]?.every(Boolean)),
    missing: students.filter((_, s) => !grid[s]?.some(Boolean)),
    prog: students.filter((_, s) => grid[s]?.[1]),
  };
}

export function listFacts(values: readonly number[]) {
  const adjacent = values.slice(0, -1).map((v, i) => ({
    i,
    j: i + 1,
    pass: v <= values[i + 1]!,
  }));
  const pairs = values.flatMap((v, i) =>
    values.slice(i + 1).map((w, k) => ({
      i,
      j: i + k + 1,
      pass: v === w,
    })),
  );
  const maxima = values.map((v, i) => ({
    i,
    comparisons: values.map((w, j) => ({ j, pass: w <= v })),
  }));
  return {
    adjacent,
    pairs,
    maxima,
    sorted: adjacent.every((row) => row.pass),
    duplicate: pairs.some((row) => row.pass),
    hasMaximum: maxima.some((row) =>
      row.comparisons.every((cell) => cell.pass),
    ),
  };
}

export function accessFacts(
  grid: readonly (readonly boolean[])[],
  admins: readonly boolean[],
) {
  const violations = grid.flatMap((row, u) =>
    row.flatMap((can, f) =>
      can && !admins[u] ? [[u, f] as const] : [],
    ),
  );
  const missing = grid.flatMap((row, u) =>
    row.flatMap((can, f) =>
      admins[u] && !can ? [[u, f] as const] : [],
    ),
  );
  const inaccessible = files.filter((_, f) => grid.every((row) => !row[f]));
  return { violations, missing, inaccessible };
}
