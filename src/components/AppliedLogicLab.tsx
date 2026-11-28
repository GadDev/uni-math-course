import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  accessFacts,
  courses,
  files,
  initialRelation,
  listFacts,
  relationFacts,
  students,
} from '../lib/applied-logic';
import '../styles/applied-logic.css';

type Mode = 'relation' | 'sql' | 'python' | 'access';

function Prediction({
  fr,
  formula,
  truth,
  reason,
}: {
  fr: boolean;
  formula: string;
  truth: boolean;
  reason: string;
}) {
  const [guess, setGuess] = useState<boolean | null>(null);
  return (
    <fieldset>
      <legend>{formula}</legend>
      <div className="applied-actions">
        {[true, false].map((value) => (
          <button
            type="button"
            key={String(value)}
            aria-pressed={guess === value}
            onClick={() => setGuess(value)}
          >
            {value ? (fr ? 'Vrai' : 'True') : fr ? 'Faux' : 'False'}
          </button>
        ))}
      </div>
      <p role="status" aria-atomic="true">
        {guess !== null &&
          (guess === truth
            ? fr
              ? 'Bonne réponse. '
              : 'Correct. '
            : fr
              ? 'À revoir. '
              : 'Try again. ') + reason}
      </p>
    </fieldset>
  );
}

function Matrix({
  fr,
  grid,
  columns,
  toggle,
}: {
  fr: boolean;
  grid: boolean[][];
  columns: readonly string[];
  toggle: (row: number, col: number) => void;
}) {
  return (
    <table>
      <caption>
        {fr ? 'Modifier les cases de la relation' : 'Change relation cells'}
      </caption>
      <thead>
        <tr>
          <th scope="col">{fr ? 'Objet' : 'Object'}</th>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={s}>
            <th scope="row">{s}</th>
            {columns.map((c, j) => (
              <td key={c}>
                <button
                  type="button"
                  aria-label={s + ', ' + c}
                  aria-pressed={grid[i]?.[j] ?? false}
                  onClick={() => toggle(i, j)}
                >
                  {grid[i]?.[j] ? '1' : '0'}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const listPresets = [[], [5], [1, 3, 2], [1, 3, 1], [1, 2, 2], [3, 3]];

export default function AppliedLogicLab({
  locale,
  mode,
}: {
  locale: Locale;
  mode: Mode;
}) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [grid, setGrid] = useState(initialRelation.map((r) => [...r]));
  const [admins, setAdmins] = useState([true, false, false]);
  const [list, setList] = useState(2);
  const [sql, setSql] = useState('prog');
  const [reveal, setReveal] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [revision, setRevision] = useState(0);
  useEffect(() => setReady(true), []);

  function clear() {
    setReveal(false);
    setCursor(0);
    setRevision((r) => r + 1);
  }
  function toggle(i: number, j: number) {
    setGrid((old) =>
      old.map((row, r) =>
        row.map((cell, c) => (r === i && c === j ? !cell : cell)),
      ),
    );
    clear();
  }
  function reset() {
    setGrid(initialRelation.map((r) => [...r]));
    setAdmins([true, false, false]);
    setList(2);
    setSql('prog');
    clear();
  }

  const relation = relationFacts(grid);
  const t = listPresets[list]!;
  const listResult = listFacts(t);
  const inspected = listResult.adjacent.slice(0, cursor);
  const stopped =
    inspected.some((row) => !row.pass) || cursor >= listResult.adjacent.length;
  const access = accessFacts(grid, admins);
  const set = (names: readonly string[]) =>
    names.length ? '{' + names.join(', ') + '}' : '∅';
  const namedPairs = (pairs: readonly (readonly [number, number])[]) =>
    set(pairs.map(([u, f]) => '(' + students[u] + ', ' + files[f] + ')'));
  const query =
    sql === 'prog'
      ? "SELECT i.etudiant FROM Inscrit i WHERE i.cours = 'prog';"
      : sql === 'none'
        ? 'SELECT e.id FROM Etudiant e WHERE NOT EXISTS (SELECT * FROM Inscrit i WHERE i.etudiant = e.id);'
        : 'SELECT NOT EXISTS (SELECT * FROM Etudiant e WHERE NOT EXISTS (SELECT * FROM Inscrit i WHERE i.etudiant = e.id));';

  return (
    <section
      className="applied-lab"
      data-applied-lab={mode}
      aria-labelledby={id}
    >
      <h3 id={id}>{fr ? 'Atelier interactif' : 'Interactive workshop'}</h3>
      <p>
        {fr
          ? 'Modifiez les données, prédisez, puis justifiez les résultats.'
          : 'Change the data, predict, then justify the results.'}
      </p>
      <div className="applied-live" hidden={!ready}>
        {mode !== 'python' && (
          <Matrix
            fr={fr}
            grid={grid}
            columns={mode === 'access' ? files : courses}
            toggle={toggle}
          />
        )}
        {mode === 'relation' && (
          <div key={revision}>
            <button
              type="button"
              onClick={() => {
                setGrid([
                  [true, false],
                  [false, true],
                  [false, true],
                ]);
                clear();
              }}
            >
              {fr
                ? 'Chaque étudiant, un cours différent'
                : 'Each student, possibly different course'}
            </button>
            <p>
              {fr
                ? 'Produit : 6 couples. Relation :'
                : 'Product: 6 pairs. Relation:'}{' '}
              {grid.flat().filter(Boolean).length}
            </p>
            <Prediction
              fr={fr}
              formula="∀ x ∈ E ∃ c ∈ C I(x,c)"
              truth={relation.every}
              reason={
                relation.every
                  ? fr
                    ? 'Chaque ligne contient un 1.'
                    : 'Every row contains a 1.'
                  : (fr ? 'Lignes vides : ' : 'Empty rows: ') +
                    set(relation.missing)
              }
            />
            <Prediction
              fr={fr}
              formula="∃ c ∈ C ∀ x ∈ E I(x,c)"
              truth={relation.common.length > 0}
              reason={
                (fr ? 'Colonnes entièrement vraies : ' : 'All-true columns: ') +
                set(relation.common)
              }
            />
            <Prediction
              fr={fr}
              formula="∃ x ∈ E ∀ c ∈ C I(x,c)"
              truth={relation.allCourses.length > 0}
              reason={
                (fr ? 'Lignes entièrement vraies : ' : 'All-true rows: ') +
                set(relation.allCourses)
              }
            />
          </div>
        )}
        {mode === 'sql' && (
          <>
            <label htmlFor={id + '-query'}>
              {fr ? 'Requête à évaluer' : 'Query to evaluate'}
            </label>
            <select
              id={id + '-query'}
              value={sql}
              onChange={(e) => {
                setSql(e.currentTarget.value);
                clear();
              }}
            >
              <option value="prog">
                {fr ? 'Inscrits en prog' : 'Enrolled in prog'}
              </option>
              <option value="none">{fr ? 'Aucun cours' : 'No courses'}</option>
              <option value="all">
                {fr
                  ? 'Chaque étudiant a un cours'
                  : 'Every student has a course'}
              </option>
            </select>
            <pre className="applied-query">
              <code>{query}</code>
            </pre>
            <p>
              {fr
                ? 'Notez le résultat attendu. Pour la sous-requête, fixez un étudiant à la fois.'
                : 'Write the expected result. For the subquery, fix one student at a time.'}
            </p>
            <button type="button" onClick={() => setReveal(!reveal)}>
              {fr ? 'Afficher / masquer la trace' : 'Show / hide trace'}
            </button>
            {reveal && (
              <div data-sql-result>
                {sql === 'prog' && (
                  <table>
                    <caption>
                      {fr
                        ? 'Parcours des lignes Inscrit'
                        : 'Scan Enrolled rows'}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">id</th>
                        <th scope="col">cours</th>
                        <th scope="col">WHERE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grid.flatMap((row, i) =>
                        row.flatMap((cell, j) =>
                          cell
                            ? [
                                <tr key={i + '-' + j}>
                                  <td>{students[i]}</td>
                                  <td>{courses[j]}</td>
                                  <td>{j === 1 ? 'TRUE' : 'FALSE'}</td>
                                </tr>,
                              ]
                            : [],
                        ),
                      )}
                    </tbody>
                  </table>
                )}
                <table>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">{fr ? 'Inscriptions' : 'Enrolments'}</th>
                      <th scope="col">
                        {sql === 'prog' ? "cours = 'prog'" : 'NOT EXISTS'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s}>
                        <th scope="row">{s}</th>
                        <td>{set(courses.filter((_, j) => grid[i]?.[j]))}</td>
                        <td>
                          {String(
                            sql === 'prog'
                              ? grid[i]?.[1]
                              : !grid[i]?.some(Boolean),
                          ).toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p role="status">
                  {fr ? 'Résultat : ' : 'Result: '}
                  {sql === 'prog'
                    ? set(relation.prog)
                    : sql === 'none'
                      ? set(relation.missing)
                      : String(relation.every).toUpperCase()}
                </p>
              </div>
            )}
          </>
        )}
        {mode === 'python' && (
          <>
            <label htmlFor={id + '-list'}>
              {fr ? 'Choisir une liste' : 'Choose a list'}
            </label>
            <select
              id={id + '-list'}
              value={list}
              onChange={(e) => {
                setList(Number(e.currentTarget.value));
                clear();
              }}
            >
              {listPresets.map((values, i) => (
                <option value={i} key={i}>
                  {JSON.stringify(values)}
                </option>
              ))}
            </select>
            <p>
              n = {t.length} ; J = {set(t.map((_, i) => String(i)))} ; K ={' '}
              {set(listResult.adjacent.map(({ i }) => String(i)))}
            </p>
            <fieldset data-python-trace>
              <legend>
                {fr
                  ? 'Exécuter all, une comparaison à la fois'
                  : 'Execute all, one comparison at a time'}
              </legend>
              <p className="applied-actions">
                {t.map((value, i) => (
                  <span key={i}>
                    [{i}] = {value}
                  </span>
                ))}
              </p>
              <ol>
                {inspected.map(({ i, j, pass }) => (
                  <li key={i}>
                    t[{i}] ≤ t[{j}] : {t[i]} ≤ {t[j]} →{' '}
                    {pass ? 'True' : 'False'}
                  </li>
                ))}
              </ol>
              <p role="status">
                {stopped
                  ? inspected.some((row) => !row.pass)
                    ? fr
                      ? 'Arrêt au premier échec : False.'
                      : 'Stopped at first failure: False.'
                    : fr
                      ? 'Tous les tests réussissent : True.'
                      : 'All tests pass: True.'
                  : fr
                    ? 'Comparaisons restantes.'
                    : 'Comparisons remain.'}
              </p>
              <button
                type="button"
                disabled={stopped}
                onClick={() => setCursor((i) => i + 1)}
              >
                {fr ? 'Étape suivante' : 'Next step'}
              </button>
              <button type="button" onClick={() => setCursor(0)}>
                {fr ? 'Rejouer la trace' : 'Replay trace'}
              </button>
            </fieldset>
            <div key={revision}>
              <Prediction
                fr={fr}
                formula="all(t[i] <= t[i+1] for i in range(n-1))"
                truth={listResult.sorted}
                reason={
                  listResult.adjacent
                    .map(
                      ({ i, j, pass }) =>
                        t[i] + ' ≤ ' + t[j] + ' : ' + String(pass),
                    )
                    .join(' ; ') ||
                  (fr
                    ? 'Aucune comparaison : all = True.'
                    : 'No comparisons: all = True.')
                }
              />
              <Prediction
                fr={fr}
                formula="any(t[i] == t[j] for i in range(n) for j in range(i+1,n))"
                truth={listResult.duplicate}
                reason={
                  (fr ? 'Paires témoins : ' : 'Witness pairs: ') +
                  set(
                    listResult.pairs
                      .filter((p) => p.pass)
                      .map(({ i, j }) => '(' + i + ', ' + j + ')'),
                  )
                }
              />
              <Prediction
                fr={fr}
                formula="any(all(t[j] <= t[i] for j in range(n)) for i in range(n))"
                truth={listResult.hasMaximum}
                reason={
                  (fr ? 'Indices maximaux : ' : 'Maximum indices: ') +
                  set(
                    listResult.maxima
                      .filter((r) => r.comparisons.every((c) => c.pass))
                      .map((r) => String(r.i)),
                  )
                }
              />
            </div>
            <button type="button" onClick={() => setReveal(!reveal)}>
              {fr
                ? 'Afficher / masquer les comparaisons'
                : 'Show / hide comparisons'}
            </button>
            {reveal && (
              <table>
                <caption>
                  {fr
                    ? 'Recherche du maximum : tester chaque candidat i'
                    : 'Maximum search: test each candidate i'}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">i</th>
                    <th scope="col">t[i]</th>
                    <th scope="col">
                      {fr ? 'Tests pour chaque j' : 'Tests for each j'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listResult.maxima.map((r) => (
                    <tr key={r.i}>
                      <th scope="row">{r.i}</th>
                      <td>{t[r.i]}</td>
                      <td>
                        {r.comparisons
                          .map((c) => 'j=' + c.j + ': ' + String(c.pass))
                          .join(' ; ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {mode === 'access' && (
          <>
            <fieldset>
              <legend>{fr ? 'Administrateurs' : 'Administrators'}</legend>
              {students.map((s, i) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={admins[i]}
                    onChange={() => {
                      setAdmins((old) => old.map((v, j) => (i === j ? !v : v)));
                      clear();
                    }}
                  />
                  {s}{' '}
                </label>
              ))}
            </fieldset>
            <div key={revision}>
              <Prediction
                fr={fr}
                formula="∀u ∈ U ∀f ∈ F (S(u,f) ⇒ A(u))"
                truth={access.violations.length === 0}
                reason={
                  (fr
                    ? 'Suppressions autorisées sans rôle : '
                    : 'Allowed deletions without role: ') +
                  namedPairs(access.violations)
                }
              />
              <Prediction
                fr={fr}
                formula="∀u ∈ U (A(u) ⇒ ∀f ∈ F S(u,f))"
                truth={access.missing.length === 0}
                reason={
                  (fr
                    ? 'Administrateurs sans permission : '
                    : 'Administrators missing permission: ') +
                  namedPairs(access.missing)
                }
              />
              <Prediction
                fr={fr}
                formula="∃f ∈ F ∀u ∈ U ¬S(u,f)"
                truth={access.inaccessible.length > 0}
                reason={
                  (fr
                    ? 'Fichiers sans permission : '
                    : 'Files without permission: ') + set(access.inaccessible)
                }
              />
            </div>
          </>
        )}
        <button type="button" onClick={reset}>
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>
      </div>
      <div className="applied-static" hidden={ready}>
        <p>
          {fr
            ? 'Sans interaction : utilisez les tableaux et exemples résolus de la leçon.'
            : 'Without interaction: use the tables and worked examples in the lesson.'}
        </p>
      </div>
    </section>
  );
}
