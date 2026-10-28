import { useEffect, useState, type ReactNode } from 'react';
import type { Locale } from '../lib/i18n';
import {
  circleTest,
  triangleTest,
  quantizePoint,
  centeredRows,
  type Point,
} from '../lib/geometry-labs';
import { NumberControl, Plot, format } from './GeometryLabPrimitives';
import '../styles/geometry-labs.css';

type Kind = 'circle' | 'triangle' | 'rounding' | 'centering';
const initial: Record<Kind, number[]> = {
  circle: [2, -1, 3, 5, -1],
  triangle: [0, 0, 4, 0, 0, 3, 1, 1],
  rounding: [0.12, 0.12, 2, 2],
  centering: [0, 1, 1, 2, 2, 2],
};
const copy: Record<
  Kind,
  {
    title: [string, string];
    goal: [string, string];
    question: [string, string];
    challenge: [string, string];
  }
> = {
  circle: {
    title: ['Construire un cercle', 'Build a circle'],
    goal: [
      'Relier centre, rayon, équation et distance.',
      'Connect centre, radius, equation and distance.',
    ],
    question: [
      'Prévision : déplacer le centre change-t-il le rayon ? Que reste-t-il lorsque r = 0 ?',
      'Predict: does moving the centre change the radius? What remains when r = 0?',
    ],
    challenge: [
      'Choisissez C = (2 ; −1), r = 3 et P = (5 ; −1). Vérifiez l’appartenance.',
      'Choose C = (2; −1), r = 3 and P = (5; −1). Check membership.',
    ],
  },
  triangle: {
    title: [
      'Construire trois demi-plans avec un triangle',
      'Build three half-planes from a triangle',
    ],
    goal: [
      'Comprendre les trois tests et reconnaître un triangle aplati.',
      'Understand all three tests and recognise a flattened triangle.',
    ],
    question: [
      'Prévision : inverser l’ordre des sommets change-t-il les points du triangle ?',
      'Predict: does reversing vertex order change the points inside the triangle?',
    ],
    challenge: [
      'Gardez A = (0 ; 0), B = (4 ; 0), puis placez C = (2 ; 0). Pourquoi faut-il arrêter le remplissage ?',
      'Keep A = (0; 0), B = (4; 0), then place C = (2; 0). Why must filling stop?',
    ],
  },
  rounding: {
    title: [
      'Arrondir un point : quelle information perd-on ?',
      'Round a point: what information is lost?',
    ],
    goal: [
      'Comparer position continue, indice entier et retour après arrondi.',
      'Compare continuous position, integer index and inverse after rounding.',
    ],
    question: [
      'Prévision : deux points différents peuvent-ils allumer le même pixel ?',
      'Predict: can two different points light the same pixel?',
    ],
    challenge: [
      'Choisissez P = (0,12 ; 0,12) et sₓ = sᵧ = 2. Comparez avec Q = P + (0,06 ; 0,06).',
      'Choose P = (0.12; 0.12) and sₓ = sᵧ = 2. Compare with Q = P + (0.06; 0.06).',
    ],
  },
  centering: {
    title: [
      'Centrer un nuage et construire les sommes',
      'Centre a cloud and build the sums',
    ],
    goal: [
      'Relier les moyennes aux écarts, aux carrés et aux produits.',
      'Connect means to deviations, squares and products.',
    ],
    question: [
      'Prévision : si les écarts centrés s’additionnent à zéro, leurs carrés s’additionnent-ils aussi à zéro ?',
      'Predict: if centred deviations sum to zero, do their squares also sum to zero?',
    ],
    challenge: [
      'Obtenez Sxy négatif sans rendre Sxx nul. Expliquez les signes des produits.',
      'Obtain negative Sxy without making Sxx zero. Explain the signs of the products.',
    ],
  },
};
const points = (v: number[]) =>
  [0, 2, 4].map((i) => ({ x: v[i]!, y: v[i + 1]! })) as [Point, Point, Point];
function View({
  kind,
  v,
  fr,
  id,
  centered = false,
}: {
  kind: Kind;
  v: number[];
  fr: boolean;
  id: string;
  centered?: boolean;
}) {
  const f = (n: number) => format(n, fr),
    pair = (p: Point) => `(${f(p.x)} ; ${f(p.y)})`;
  let graph: ReactNode,
    result: ReactNode,
    table: ReactNode = null;
  const mark = (
    X: (n: number) => number,
    Y: (n: number) => number,
    p: Point,
    label: string,
    square = false,
  ) => (
    <g>
      {square ? (
        <rect
          className="geo-prediction"
          x={X(p.x) - 5}
          y={Y(p.y) - 5}
          width="10"
          height="10"
        />
      ) : (
        <circle className="geo-point" cx={X(p.x)} cy={Y(p.y)} r="5" />
      )}
      <text x={X(p.x) + 8} y={Y(p.y) + (square ? 24 : -10)}>
        {label}
      </text>
    </g>
  );
  if (kind === 'rounding') {
    const p = { x: v[0]!, y: v[1]! },
      q = { x: p.x + 0.06, y: p.y + 0.06 };
    const a = quantizePoint(p, v[2]!, v[3]!)!,
      b = quantizePoint(q, v[2]!, v[3]!)!;
    const X = (u: number) => 40 + 40 * u,
      Y = (vv: number) => 40 + 40 * vv;
    graph = (
      <svg
        viewBox="0 0 440 440"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>
          {fr
            ? 'Positions continues et grille des indices'
            : 'Continuous positions and index grid'}
        </title>
        <desc id={`${id}-desc`}>
          {fr
            ? 'u vers la droite, v vers le bas. P est un disque, Q une croix ; le carré marque l’indice arrondi de P. Les valeurs exactes et arrondies sont écrites sous le dessin.'
            : 'u rightwards, v downwards. P is a disk, Q a cross; the square marks P’s rounded index. Coordinates are written below.'}
        </desc>
        <rect className="geo-screen" x="40" y="40" width="360" height="360" />
        <g className="geo-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${X(i)},40V400 M40,${Y(i)}H400`} />
          ))}
        </g>
        {[0, 2, 4, 6, 8].map((i) => (
          <g key={i}>
            <text x={X(i)} y="425" textAnchor="middle">
              {i}
            </text>
            <text x="30" y={Y(i) + 6} textAnchor="end">
              {i}
            </text>
          </g>
        ))}
        <text x="405" y="27">
          u
        </text>
        <text x="15" y="414">
          v
        </text>
        {a.continuousVisible && (
          <circle
            className="geo-point"
            cx={X(a.screen.u)}
            cy={Y(a.screen.v)}
            r="5"
          />
        )}
        {b.continuousVisible && (
          <path
            className="geo-axes"
            d={`M${X(b.screen.u) - 5},${Y(b.screen.v) - 5}l10,10m-10,0l10,-10`}
          />
        )}
        {a.pixelVisible && (
          <rect
            className="geo-prediction"
            x={X(a.u) - 9}
            y={Y(a.v) - 9}
            width="18"
            height="18"
          />
        )}
      </svg>
    );
    result = (
      <>
        <p>
          {fr
            ? 'Image 9 × 9 : indices entiers de 0 à 8. Les intersections de la grille représentent les indices, pas les surfaces des cases. Origine mathématique en (4 ; 4).'
            : '9 × 9 image: integer indices from 0 to 8. Grid intersections represent indices, not cell areas. Mathematical origin at (4; 4).'}
        </p>
        <p>
          u = 4 + sₓx ; v = 4 − sᵧy.{' '}
          {fr
            ? 'Arrondi au plus proche ; à mi-chemin, entier supérieur, y compris pour les valeurs négatives.'
            : 'Round to nearest; halfway ties choose the greater integer, also for negative values.'}
        </p>
        <p data-quantization>
          P = {pair(p)} → ({f(a.screen.u)} ; {f(a.screen.v)}) → ({a.u} ; {a.v}).
        </p>
        <p data-roundtrip>
          {fr ? 'Retour après arrondi' : 'Inverse after rounding'} :{' '}
          {pair(a.recovered)}. {fr ? 'Erreurs signées' : 'Signed errors'} : Δx ≈{' '}
          {f(a.errorX)}, Δy ≈ {f(a.errorY)}.
        </p>
        <p>
          |Δx| ≤ 1/(2sₓ) ≈ {f(1 / (2 * v[2]!))} ; |Δy| ≤ 1/(2sᵧ) ≈{' '}
          {f(1 / (2 * v[3]!))}.
        </p>
        <p>
          Q = {pair(q)} → ({f(b.screen.u)} ; {f(b.screen.v)}) → ({b.u} ; {b.v}).{' '}
          {a.u === b.u && a.v === b.v
            ? fr
              ? 'Même indice pour deux points distincts : l’arrondi n’est pas inversible.'
              : 'Same index for two distinct points: rounding is not invertible.'
            : fr
              ? 'Ces deux points donnent ici des indices différents.'
              : 'These points produce different indices here.'}
        </p>
        <p data-pixel-visibility>
          {a.pixelVisible
            ? fr
              ? 'Le pixel arrondi de P est dans l’image.'
              : 'P’s rounded pixel is inside the image.'
            : fr
              ? 'Indice arrondi hors image : aucun pixel de P n’est affiché.'
              : 'Rounded index outside the image: no pixel for P is displayed.'}
          {a.continuousVisible &&
            !a.pixelVisible &&
            (fr
              ? ' La position continue était pourtant dans la fenêtre : il faut contrôler les bornes après l’arrondi.'
              : ' The continuous position was inside the window: check bounds after rounding.')}
        </p>
      </>
    );
  } else {
    graph = (
      <Plot
        id={id}
        fr={fr}
        centered={kind === 'centering'}
        description={
          fr
            ? 'Axes de même échelle. Lisez les coordonnées et les calculs sous la figure.'
            : 'Equal axis scales. Read coordinates and calculations below the figure.'
        }
      >
        {(X, Y) => {
          if (kind === 'circle') {
            const c = { x: v[0]!, y: v[1]! },
              p = { x: v[3]!, y: v[4]! },
              r = v[2]!;
            return (
              <>
                {r > 0 && (
                  <circle
                    className="geo-line"
                    cx={X(c.x)}
                    cy={Y(c.y)}
                    r={X(r) - X(0)}
                  />
                )}
                <path
                  className="geo-dashed"
                  d={`M${X(c.x)},${Y(c.y)}h${X(r) - X(0)}`}
                />
                <text x={X(c.x + r / 2)} y={Y(c.y) + 23}>
                  r
                </text>
                {mark(X, Y, c, 'C', true)}
                {mark(X, Y, p, 'P')}
              </>
            );
          }
          if (kind === 'triangle') {
            const vertices = points(v),
              p = { x: v[6]!, y: v[7]! },
              test = triangleTest(vertices, p);
            const polygon = vertices
              .map((p) => `${X(p.x)},${Y(p.y)}`)
              .join(' ');
            return (
              <>
                {!test.degenerate && (
                  <polygon className="geo-region" points={polygon} />
                )}
                <polygon className="geo-line" points={polygon} />
                {vertices.map((p, i) => (
                  <g key={i}>{mark(X, Y, p, ['A', 'B', 'C'][i]!)}</g>
                ))}
                {mark(X, Y, p, 'P', true)}
              </>
            );
          }
          const c = centeredRows(points(v))!;
          return (
            <>
              <path
                className="geo-dashed"
                d={`M${X(centered ? 0 : c.meanX)},20V380 M40,${Y(centered ? 0 : c.meanY)}H400`}
              />
              {c.rows.map((r, i) => (
                <g key={i}>
                  {mark(X, Y, centered ? { x: r.dx, y: r.dy } : r, `P${i + 1}`)}
                </g>
              ))}
              {mark(
                X,
                Y,
                { x: centered ? 0 : c.meanX, y: centered ? 0 : c.meanY },
                'G',
                true,
              )}
            </>
          );
        }}
      </Plot>
    );
    if (kind === 'circle') {
      const c = { x: v[0]!, y: v[1]! },
        p = { x: v[3]!, y: v[4]! },
        r = circleTest(c, v[2]!, p)!;
      result = (
        <>
          <p>
            C = {pair(c)} ; r = {f(v[2]!)} ; P = {pair(p)}.
          </p>
          <p>
            (x − ({f(c.x)}))² + (y − ({f(c.y)}))² = {f(r.radiusSquared)}.
          </p>
          <p>
            CP² = ({f(r.dx)})² + ({f(r.dy)})² = {f(r.distanceSquared)} ; CP ≈{' '}
            {f(Math.sqrt(r.distanceSquared))}.
          </p>
          <p data-circle-membership>
            {r.onCircle
              ? fr
                ? 'P satisfait l’égalité.'
                : 'P satisfies the equality.'
              : fr
                ? 'P ne satisfait pas l’égalité.'
                : 'P does not satisfy the equality.'}
            {r.distanceSquared < r.radiusSquared &&
              (fr
                ? ' Il est à l’intérieur du disque, mais pas sur le cercle.'
                : ' It is inside the disk, but not on the circle.')}
          </p>
          {v[2] === 0 && (
            <p>
              {fr
                ? 'r = 0 : l’ensemble se réduit au seul centre C, ce n’est plus un cercle de rayon strictement positif.'
                : 'r = 0: the set reduces to centre C alone, not a circle of strictly positive radius.'}
            </p>
          )}
        </>
      );
    }
    if (kind === 'triangle') {
      const vertices = points(v),
        p = { x: v[6]!, y: v[7]! },
        r = triangleTest(vertices, p);
      result = (
        <>
          <p>
            {vertices
              .map((p, i) => `${['A', 'B', 'C'][i]} = ${pair(p)}`)
              .join(' ; ')}
            .
          </p>
          <p>
            {fr ? 'Aire' : 'Area'} = {f(r.area)}.{' '}
            {fr
              ? 'Échanger B et C inverse les signes des équations de bord et des références associées ; le test de même côté conserve la même région.'
              : 'Swapping B and C reverses the signs of the edge equations and corresponding references; the same-side test preserves the region.'}
          </p>
          <p data-triangle-result>
            {r.degenerate
              ? fr
                ? 'Sommets alignés ou répétés : triangle dégénéré. Remplissage et test intérieur arrêtés.'
                : 'Aligned or repeated vertices: degenerate triangle. Filling and interior testing stopped.'
              : r.inside
                ? fr
                  ? 'P satisfait les trois contraintes : il est dans le triangle fermé.'
                  : 'P satisfies all three constraints: it is inside the closed triangle.'
                : fr
                  ? 'P échoue à au moins une contrainte : il est exclu.'
                  : 'P fails at least one constraint: it is excluded.'}
          </p>
          <p>
            {fr
              ? 'Pour chaque côté, f(x,y) = ax + by + c. Comparez le signe de f(P) à celui du sommet opposé. Zéro pour P signifie bord inclus ; zéro pour la référence signale la dégénérescence.'
              : 'For each edge, f(x,y) = ax + by + c. Compare f(P)’s sign with the opposite vertex’s sign. Zero for P means included boundary; zero for the reference means degeneracy.'}
          </p>
        </>
      );
      table = (
        <div
          className="geo-table"
          role="region"
          tabIndex={0}
          aria-label={
            fr
              ? 'Tableau de calcul, défilement horizontal'
              : 'Calculation table, horizontal scrolling'
          }
        >
          <table>
            <caption>
              {fr
                ? 'Les trois tests de même côté'
                : 'The three same-side tests'}
            </caption>
            <thead>
              <tr>
                {[
                  fr ? 'Côté' : 'Edge',
                  'f(x,y)',
                  'f(P)',
                  fr ? 'f(sommet opposé)' : 'f(opposite vertex)',
                  fr ? 'Test' : 'Test',
                ].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.edges.map((e, i) => (
                <tr key={i}>
                  <th scope="row">{['AB', 'BC', 'CA'][i]}</th>
                  <td>
                    ({e.a})x + ({e.b})y + ({e.c})
                  </td>
                  <td>{f(e.value)}</td>
                  <td>{f(e.reference)}</td>
                  <td>
                    {r.degenerate
                      ? '—'
                      : e.accepted
                        ? fr
                          ? 'Accepté'
                          : 'Accepted'
                        : fr
                          ? 'Exclu'
                          : 'Excluded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (kind === 'centering') {
      const c = centeredRows(points(v))!;
      result = (
        <>
          <p>
            x̄ ≈ {f(c.meanX)} ; ȳ ≈ {f(c.meanY)}.{' '}
            {fr
              ? 'Carré G : moyenne des coordonnées.'
              : 'Square G: coordinate means.'}
          </p>
          <p>
            {centered
              ? fr
                ? 'Vue centrée : G est à l’origine ; chaque point a pour coordonnées (xᵢ − x̄ ; yᵢ − ȳ).'
                : 'Centred view: G is at the origin; each point has coordinates (xᵢ − x̄; yᵢ − ȳ).'
              : fr
                ? 'Vue brute : les lignes en tirets passent par les deux moyennes.'
                : 'Raw view: dashed lines pass through the two means.'}
          </p>
          <p data-centered-sums>
            Σ(xᵢ − x̄) ≈ {f(c.sumDx)} ; Σ(yᵢ − ȳ) ≈ {f(c.sumDy)}.
          </p>
          <p data-centered-products>
            Sxx ≈ {f(c.xx)} ; Sxy ≈ {f(c.xy)} ; Syy ≈ {f(c.yy)}.
          </p>
          {c.xx === 0 && (
            <p>
              {fr
                ? 'Toutes les abscisses sont égales : aucune dispersion horizontale, donc Sxx = 0. On ne peut pas diviser par Sxx.'
                : 'All horizontal coordinates are equal: no horizontal spread, hence Sxx = 0. Division by Sxx is impossible.'}
            </p>
          )}
          {c.yy === 0 && (
            <p>
              {fr
                ? 'Toutes les ordonnées sont égales : Syy = 0.'
                : 'All vertical coordinates are equal: Syy = 0.'}
            </p>
          )}
        </>
      );
      table = (
        <div
          className="geo-table"
          role="region"
          tabIndex={0}
          aria-label={
            fr
              ? 'Tableau de calcul, défilement horizontal'
              : 'Calculation table, horizontal scrolling'
          }
        >
          <table>
            <caption>
              {fr
                ? 'Calculer avant de sommer (valeurs affichées arrondies)'
                : 'Calculate before summing (displayed values rounded)'}
            </caption>
            <thead>
              <tr>
                {[
                  'i',
                  'xᵢ',
                  'yᵢ',
                  'xᵢ − x̄',
                  'yᵢ − ȳ',
                  '(xᵢ − x̄)²',
                  '(xᵢ − x̄)(yᵢ − ȳ)',
                  '(yᵢ − ȳ)²',
                ].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  {[r.x, r.y, r.dx, r.dy, r.xx, r.xy, r.yy].map((n, j) => (
                    <td key={j}>{f(n)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
  return (
    <>
      <figure>
        {graph}
        <figcaption>
          {kind === 'rounding' && (
            <span>
              {fr
                ? 'Disque : P ; croix : Q ; carré : indice arrondi de P. '
                : 'Disk: P; cross: Q; square: P’s rounded index. '}
            </span>
          )}
          {fr
            ? 'Manipulez, observez, puis expliquez le lien entre le dessin et le calcul. Le dessin illustre les résultats ; les valeurs permettent de les vérifier.'
            : 'Manipulate, observe, then explain how drawing and calculation connect. The drawing illustrates the results; values let you check them.'}
        </figcaption>
      </figure>
      <div
        className="geo-results"
        data-results
        aria-live="polite"
        aria-atomic="true"
      >
        {result}
      </div>
      {table}
      <p className="geo-precision">
        {fr
          ? '≈ indique un arrondi à quatre décimales au plus. Les sommes utilisent les valeurs non arrondies. La fenêtre ne montre qu’une partie du plan.'
          : '≈ indicates rounding to at most four decimal places. Sums use unrounded values. The window shows only part of the plane.'}
      </p>
    </>
  );
}
export default function GeometryExtensions({
  kind,
  locale,
}: {
  kind: Kind;
  locale: Locale;
}) {
  const fr = locale === 'fr',
    spec = copy[kind],
    t = (pair: [string, string]) => pair[fr ? 0 : 1],
    id = `geo-${kind}`;
  const [ready, setReady] = useState(false),
    [v, setV] = useState([...initial[kind]]),
    [selection, setSelection] = useState(0),
    [centered, setCentered] = useState(false),
    [feedback, setFeedback] = useState(''),
    [epoch, setEpoch] = useState(0);
  useEffect(() => setReady(true), []);
  const set = (i: number, n: number) => {
    setV((old) => old.map((x, j) => (i === j ? n : x)));
    setFeedback('');
  };
  const number = (
    i: number,
    label: string,
    min: number,
    max: number,
    step: number = 1,
  ) => (
    <NumberControl
      key={`${epoch}-${i}`}
      label={label}
      value={v[i]!}
      min={min}
      max={max}
      step={step}
      onChange={(n) => set(i, n)}
      fr={fr}
    />
  );
  const preset = (values: number[]) => {
    setV(values);
    setFeedback('');
    setEpoch((e) => e + 1);
  };
  const check = () => {
    let ok = false,
      explanation = '';
    if (kind === 'circle') {
      ok = v.every((n, i) => n === [2, -1, 3, 5, -1][i]);
      explanation = fr
        ? 'CP² = (5 − 2)² + (−1 + 1)² = 9 = r². Le rayon vaut 3, pas 9.'
        : 'CP² = (5 − 2)² + (−1 + 1)² = 9 = r². Radius is 3, not 9.';
    }
    if (kind === 'triangle') {
      ok = v.slice(0, 6).every((n, i) => n === [0, 0, 4, 0, 2, 0][i]);
      explanation = fr
        ? 'Les trois sommets sont sur y = 0 : aire nulle. Le sommet opposé est sur chaque droite non dégénérée, il ne peut choisir un demi-plan intérieur.'
        : 'All three vertices are on y = 0: zero area. The opposite vertex lies on each nondegenerate edge line and cannot select an interior half-plane.';
    }
    if (kind === 'rounding') {
      ok = v.every((n, i) => n === [0.12, 0.12, 2, 2][i]);
      explanation = fr
        ? 'P donne (4,24 ; 3,76) et Q donne (4,36 ; 3,64). Les deux s’arrondissent à (4 ; 4), dont le retour est (0 ; 0). Les deux positions d’origine sont perdues.'
        : 'P gives (4.24; 3.76) and Q gives (4.36; 3.64). Both round to (4; 4), whose inverse is (0; 0). Both original positions are lost.';
    }
    if (kind === 'centering') {
      const c = centeredRows(points(v))!;
      ok = c.xy < 0 && c.xx > 0;
      explanation = fr
        ? 'Les produits négatifs l’emportent dans Sxy. Les écarts centrés ont une somme nulle, mais les carrés restent positifs lorsque les abscisses ne sont pas toutes égales.'
        : 'Negative products dominate Sxy. Centred deviations sum to zero, but squared deviations remain positive when horizontal coordinates are not all equal.';
    }
    setFeedback(
      `${ok ? (fr ? 'Défi réussi.' : 'Challenge complete.') : fr ? 'À reprendre : vérifiez les réglages du défi.' : 'Try again: check the challenge settings.'} ${explanation}`,
    );
  };
  return (
    <section
      className="geo-lab"
      data-geometry-lab={kind}
      aria-label={t(spec.title)}
    >
      <p className="geo-title">{t(spec.title)}</p>
      <p>
        <strong>{fr ? 'Objectif : ' : 'Objective: '}</strong>
        {t(spec.goal)}
      </p>
      <p>{t(spec.question)}</p>
      <div className="geo-live">
        <div className="geo-visual">
          <View kind={kind} v={v} fr={fr} id={id} centered={centered} />
          <p hidden={ready} data-static-note>
            {fr
              ? 'Exemple fixe sans JavaScript ; les méthodes et corrections restent disponibles.'
              : 'Fixed example without JavaScript; methods and worked solutions remain available.'}
          </p>
        </div>
        <fieldset hidden={!ready}>
          <legend>
            {fr
              ? 'Manipulez les contrôles, observez les résultats, puis expliquez.'
              : 'Manipulate the controls, observe the results, then explain.'}
          </legend>
          <p>
            {fr
              ? 'Les bornes des contrôles servent à explorer une fenêtre lisible. Les cas limites sont expliqués sous le dessin.'
              : 'Control bounds keep the window readable. Boundary cases are explained below the drawing.'}
          </p>
          {kind === 'circle' && (
            <>
              {number(0, 'a (C)', -2, 3)}
              {number(1, 'b (C)', -2, 3)}
              {number(2, 'r', 0, 3)}
              {number(3, 'x (P)', -3, 6)}
              {number(4, 'y (P)', -3, 6)}
            </>
          )}
          {(kind === 'triangle' || kind === 'centering') && (
            <>
              <label>
                {kind === 'triangle'
                  ? fr
                    ? 'Sommet à modifier'
                    : 'Vertex to edit'
                  : fr
                    ? 'Observation à modifier'
                    : 'Observation to edit'}
                <select
                  value={selection}
                  onChange={(e) => {
                    setSelection(Number(e.target.value));
                    setEpoch((x) => x + 1);
                    setFeedback('');
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <option key={i} value={i}>
                      {kind === 'triangle' ? ['A', 'B', 'C'][i] : `P${i + 1}`}
                    </option>
                  ))}
                </select>
              </label>
              {number(
                2 * selection,
                `x (${kind === 'triangle' ? ['A', 'B', 'C'][selection] : `P${selection + 1}`})`,
                -2,
                6,
              )}
              {number(
                2 * selection + 1,
                `y (${kind === 'triangle' ? ['A', 'B', 'C'][selection] : `P${selection + 1}`})`,
                -2,
                6,
              )}
              {kind === 'triangle' ? (
                <>
                  {number(6, 'x (P)', -2, 6)}
                  {number(7, 'y (P)', -2, 6)}
                  <button
                    type="button"
                    onClick={() =>
                      preset([
                        ...v.slice(0, 2),
                        ...v.slice(4, 6),
                        ...v.slice(2, 4),
                        ...v.slice(6),
                      ])
                    }
                  >
                    {fr ? 'Inverser B et C' : 'Swap B and C'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    aria-pressed={centered}
                    onClick={() => setCentered(!centered)}
                  >
                    {centered
                      ? fr
                        ? 'Afficher les coordonnées brutes'
                        : 'Show raw coordinates'
                      : fr
                        ? 'Afficher les coordonnées centrées'
                        : 'Show centred coordinates'}
                  </button>
                  <button
                    type="button"
                    onClick={() => preset([0, 2, 1, 1, 2, 0])}
                  >
                    {fr ? 'Essayer Sxy négatif' : 'Try negative Sxy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => preset([1, 1, 1, 2, 1, 3])}
                  >
                    {fr ? 'Essayer Sxx = 0' : 'Try Sxx = 0'}
                  </button>
                </>
              )}
            </>
          )}
          {kind === 'rounding' && (
            <>
              {number(0, 'x (P)', -1, 4, 0.01)}
              {number(1, 'y (P)', -1, 4, 0.01)}
              {number(2, 'sₓ', 1, 4)}
              {number(3, 'sᵧ', 1, 4)}
            </>
          )}
          <p>
            <strong>{fr ? 'Défi : ' : 'Challenge: '}</strong>
            {t(spec.challenge)}
          </p>
          <button
            type="button"
            onClick={(e) => {
              const inputs = e.currentTarget
                .closest('fieldset')!
                .querySelectorAll<HTMLInputElement>('input[type="number"]');
              if (Array.from(inputs).every((input) => input.reportValidity()))
                check();
            }}
          >
            {fr ? 'Vérifier le défi' : 'Check challenge'}
          </button>
          <p role="status" data-feedback>
            {feedback}
          </p>
          <button
            type="button"
            onClick={() => {
              preset([...initial[kind]]);
              setSelection(0);
              setCentered(false);
            }}
          >
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </fieldset>
      </div>
      <div className="geo-print">
        <p>
          <strong>
            {fr ? 'Exemple fixe à imprimer' : 'Fixed example for printing'}
          </strong>
        </p>
        <View kind={kind} v={initial[kind]} fr={fr} id={`${id}-print`} />
      </div>
      <p className="geo-reflect">
        <strong>{fr ? 'Expliquez : ' : 'Explain: '}</strong>
        {fr
          ? 'quelle observation confirme le calcul ? Reproduisez un cas sur papier et indiquez ses conditions de validité.'
          : 'which observation confirms the calculation? Reproduce a case on paper and state its conditions of validity.'}
      </p>
    </section>
  );
}
