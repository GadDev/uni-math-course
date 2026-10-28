import { useEffect, useId, useState, type ReactNode } from 'react';
import {
  equationTest,
  throughPoints,
  intersection,
  regionTest,
  toScreen,
  fromScreen,
  bresenham,
  sampleSegment,
  residualTable,
  observations,
  type Curve,
} from '../lib/geometry-labs';
import type { Locale } from '../lib/i18n';
import '../styles/geometry-labs.css';

type Kind =
  | 'membership'
  | 'slope'
  | 'points'
  | 'intersection'
  | 'region'
  | 'screen'
  | 'sampling'
  | 'raster'
  | 'residuals';
type Spec = {
  title: [string, string];
  goal: [string, string];
  question: [string, string];
  challenge: [string, string];
  initial: number[];
  choice: string;
};
const specs: Record<Kind, Spec> = {
  membership: {
    title: [
      'Tester un point et une équation',
      'Test a point against an equation',
    ],
    goal: [
      'Relier une substitution exacte au point du dessin.',
      'Connect an exact substitution to the plotted point.',
    ],
    question: [
      'Prévision : élever y = x au carré conserve-t-il exactement les mêmes points ?',
      'Predict: does squaring y = x preserve exactly the same points?',
    ],
    challenge: [
      'Choisissez y² = x², puis P = (1 ; −1) : trouvez un point ajouté par le carré.',
      'Choose y² = x², then P = (1; −1): find a point added by squaring.',
    ],
    initial: [1, 3],
    choice: 'line',
  },
  slope: {
    title: ['Faire varier m et p', 'Vary m and p'],
    goal: [
      'Distinguer inclinaison, passage par (0 ; p) et variation.',
      'Distinguish slope, crossing at (0; p), and change.',
    ],
    question: [
      'Prévision : si seul p augmente, la pente change-t-elle ?',
      'Predict: if only p increases, does the slope change?',
    ],
    challenge: [
      'Construisez y = −0,5x + 2 : pour Δx = 2, vérifiez Δy = −1.',
      'Build y = −0.5x + 2: for Δx = 2, check Δy = −1.',
    ],
    initial: [2, 1],
    choice: '',
  },
  points: {
    title: [
      'Construire une droite avec A et B',
      'Build a line through A and B',
    ],
    goal: [
      'Calculer la pente ou reconnaître un cas où elle ne se définit pas.',
      'Calculate slope or recognise when it is undefined.',
    ],
    question: [
      'Prévision : que se passe-t-il si les abscisses deviennent égales ?',
      'Predict: what happens when the horizontal coordinates become equal?',
    ],
    challenge: [
      'Placez A = (1 ; 1) et B = (1 ; 4). Expliquez pourquoi on ne divise pas par zéro.',
      'Set A = (1; 1) and B = (1; 4). Explain why division by zero is avoided.',
    ],
    initial: [1, 1, 3, 5],
    choice: '',
  },
  intersection: {
    title: [
      'Explorer les trois intersections',
      'Explore the three intersection cases',
    ],
    goal: [
      'Relier élimination algébrique et nombre de points communs.',
      'Connect algebraic elimination to the number of common points.',
    ],
    question: [
      'Prévision : rapprocher les pentes garantit-il une intersection visible dans la fenêtre ?',
      'Predict: do similar slopes guarantee an intersection inside the window?',
    ],
    challenge: [
      'Gardez y = 2x + 1 et choisissez y = 2x + 3 : obtenez zéro solution.',
      'Keep y = 2x + 1 and choose y = 2x + 3: obtain no solution.',
    ],
    initial: [-1, 4],
    choice: 'affine',
  },
  region: {
    title: [
      'Tester une région, bord compris ou exclu',
      'Test a region with or without its boundary',
    ],
    goal: [
      'Vérifier toutes les contraintes et distinguer < de ≤.',
      'Check every constraint and distinguish < from ≤.',
    ],
    question: [
      'Prévision : un point de la frontière est-il toujours accepté ?',
      'Predict: is a boundary point always accepted?',
    ],
    challenge: [
      'Choisissez le triangle et P = (4 ; 0). Vérifiez que ce sommet satisfait les trois contraintes.',
      'Choose the triangle and P = (4; 0). Check that this vertex satisfies all three constraints.',
    ],
    initial: [1, 1],
    choice: 'closed',
  },
  screen: {
    title: [
      'Passer du plan à l’écran et revenir',
      'Map the plane to the screen and back',
    ],
    goal: [
      'Expliquer le signe moins et l’effet des échelles.',
      'Explain the minus sign and the effect of scale.',
    ],
    question: [
      'Prévision : si y augmente, v augmente-t-il ou diminue-t-il ?',
      'Predict: when y increases, does v increase or decrease?',
    ],
    challenge: [
      'Avec P = (2 ; 1), choisissez sₓ = sᵧ = 50. Retrouvez (u ; v) = (300 ; 100).',
      'With P = (2; 1), choose sₓ = sᵧ = 50. Obtain (u; v) = (300; 100).',
    ],
    initial: [2, 1, 40, 40],
    choice: '',
  },
  sampling: {
    title: ['Choisir colonnes ou lignes', 'Choose columns or rows'],
    goal: [
      'Comprendre pourquoi une pente forte demande un parcours par lignes.',
      'Understand why a steep slope needs traversal by rows.',
    ],
    question: [
      'Prévision : combien de pixels obtient-on de (0 ; 0) à (3 ; 8) en parcourant les colonnes ?',
      'Predict: how many pixels result from (0; 0) to (3; 8) when traversing columns?',
    ],
    challenge: [
      'Fixez l’extrémité (3 ; 8), puis parcourez les lignes : obtenez neuf pixels sans grands sauts.',
      'Set endpoint (3; 8), then traverse rows: obtain nine pixels without large gaps.',
    ],
    initial: [3, 8],
    choice: 'x',
  },
  raster: {
    title: ['Bresenham, un pas à la fois', 'Bresenham, one step at a time'],
    goal: [
      'Relier milieu, décision entière et pixel suivant dans l’octant annoncé.',
      'Connect midpoint, integer decision and next pixel in the stated octant.',
    ],
    question: [
      'Prévision : pour d = 0, choisit-on E ou NE dans cette leçon ?',
      'Predict: for d = 0, does this lesson choose E or NE?',
    ],
    challenge: [
      'Choisissez (u₂ ; v₂) = (2 ; 1), revenez au pas 0 et prévoyez le prochain pixel.',
      'Choose (u₂; v₂) = (2; 1), return to step 0 and predict the next pixel.',
    ],
    initial: [5, 2, 0],
    choice: 'E',
  },
  residuals: {
    title: [
      'Ajuster un modèle et mesurer ses résidus',
      'Adjust a model and measure its residuals',
    ],
    goal: [
      'Comparer une somme signée, S et S/n sur les mêmes données.',
      'Compare a signed sum, S and S/n on the same data.',
    ],
    question: [
      'Prévision : une somme de résidus nulle signifie-t-elle que tous les points sont sur la droite ?',
      'Predict: does a zero residual sum put every point on the line?',
    ],
    challenge: [
      'Choisissez m = 0,5 et p = 7/6 avec le bouton dédié. Observez Σe ≈ 0 mais S = 1/6.',
      'Choose m = 0.5 and p = 7/6 using the dedicated button. Observe Σe ≈ 0 but S = 1/6.',
    ],
    initial: [1, 1],
    choice: '',
  },
};
const equations: Record<Curve, string> = {
  line: 'y = 2x + 1',
  circle: 'x² + y² = 4',
  parabola: 'y = x²',
  sideways: 'x = y²',
  squared: 'y² = x²',
  multiplied: 'xy = x²',
};
const format = (n: number, fr: boolean) =>
  (Math.abs(n) < 1e-12 ? 0 : n).toLocaleString(fr ? 'fr-FR' : 'en-US', {
    maximumFractionDigits: 4,
  });
function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  fr,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number | 'any';
  onChange: (n: number) => void;
  fr: boolean;
}) {
  const id = useId();
  const [raw, setRaw] = useState(String(value));
  const [bad, setBad] = useState(false);
  useEffect(() => {
    setRaw(String(value));
    setBad(false);
  }, [value]);
  return (
    <div className="geo-control">
      <label htmlFor={id}>
        {label} : {format(value, fr)}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value, fr)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <label className="geo-number-label" htmlFor={`${id}-number`}>
        {fr ? 'Saisir' : 'Enter'} {label}
      </label>
      <input
        id={`${id}-number`}
        type="number"
        required
        min={min}
        max={max}
        step={step}
        value={raw}
        aria-invalid={bad}
        aria-describedby={`${id}-error`}
        onChange={(e) => {
          const text = e.target.value,
            n = Number(text);
          setRaw(text);
          const valid =
            text.trim() !== '' &&
            Number.isFinite(n) &&
            n >= min &&
            n <= max &&
            (step === 'any' ||
              Math.abs((n - min) / step - Math.round((n - min) / step)) < 1e-8);
          setBad(!valid);
          if (valid) onChange(n);
        }}
      />
      <span id={`${id}-error`} role="alert">
        {bad
          ? fr
            ? `Valeur entre ${format(min, fr)} et ${format(max, fr)}${step === 'any' ? '' : `, par pas de ${format(step, fr)}`}. Le dessin conserve la dernière valeur valide.`
            : `Use ${min} to ${max}${step === 'any' ? '' : `, in steps of ${step}`}. The drawing keeps the last valid value.`
          : ''}
      </span>
    </div>
  );
}
function Plot({
  id,
  fr,
  pixel = false,
  residual = false,
  children,
  description,
}: {
  id: string;
  fr: boolean;
  pixel?: boolean;
  residual?: boolean;
  children: (X: (n: number) => number, Y: (n: number) => number) => ReactNode;
  description: string;
}) {
  const min = pixel ? -1 : residual ? -0.5 : -4,
    max = pixel ? 13 : residual ? 3.5 : 8;
  const X = (x: number) => 40 + ((x - min) * 360) / (max - min),
    Y = (y: number) => 380 - ((y - min) * 360) / (max - min);
  const ticks = pixel ? [0, 4, 8, 12] : residual ? [0, 1, 2, 3] : [-4, 0, 4, 8];
  return (
    <svg
      viewBox="0 0 440 430"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>
        {fr
          ? 'Repère cartésien, verticale vers le haut'
          : 'Cartesian coordinates, vertical axis upwards'}
      </title>
      <desc id={`${id}-desc`}>{description}</desc>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="40" y="20" width="360" height="360" />
        </clipPath>
      </defs>
      <g className="geo-grid" aria-hidden="true">
        {ticks.map((t) => (
          <path key={t} d={`M${X(t)},20V380 M40,${Y(t)}H400`} />
        ))}
      </g>
      <g className="geo-axes" aria-hidden="true">
        <path d={`M40,${Y(0)}H410 M${X(0)},390V10`} />
        {ticks.map((t) => (
          <g key={t}>
            <text x={X(t)} y="410" textAnchor="middle">
              {t}
            </text>
            {t !== 0 && (
              <text x="34" y={Y(t) + 6} textAnchor="end">
                {t}
              </text>
            )}
          </g>
        ))}
        <text x="414" y={Y(0) - 8}>
          {pixel ? 'u' : 'x'}
        </text>
        <text x={X(0) + 10} y="18">
          {pixel ? 'v' : 'y'}
        </text>
      </g>
      <g clipPath={`url(#${id}-clip)`}>{children(X, Y)}</g>
    </svg>
  );
}
function LabView({
  kind,
  v,
  choice,
  fr,
  id,
}: {
  kind: Kind;
  v: number[];
  choice: string;
  fr: boolean;
  id: string;
}) {
  const f = (n: number) => format(n, fr),
    pt = (x: number, y: number) => `(${f(x)} ; ${f(y)})`;
  let result: ReactNode = null,
    graph: ReactNode = null,
    table: ReactNode = null;
  const description = fr
    ? 'Les axes ont la même échelle. Les calculs et coordonnées sont écrits sous le dessin.'
    : 'Axes have equal scales. Calculations and coordinates are given below the drawing.';
  const line = (
    X: (n: number) => number,
    Y: (n: number) => number,
    m: number,
    p: number,
    dashed = false,
  ) => (
    <path
      className={dashed ? 'geo-dashed' : 'geo-line'}
      d={`M${X(-4)},${Y(-4 * m + p)}L${X(8)},${Y(8 * m + p)}`}
    />
  );
  const point = (
    X: (n: number) => number,
    Y: (n: number) => number,
    x: number,
    y: number,
    label: string,
  ) => (
    <g>
      <circle className="geo-point" cx={X(x)} cy={Y(y)} r="5" />
      <text x={X(x) + 8} y={Y(y) - 9}>
        {label}
      </text>
    </g>
  );
  if (kind === 'screen') {
    const s = toScreen({ x: v[0]!, y: v[1]! }, v[2]!, v[3]!)!,
      back = fromScreen(s.u, s.v, v[2]!, v[3]!)!;
    const visible = s.u >= 0 && s.u < 400 && s.v >= 0 && s.v < 300;
    graph = (
      <svg
        viewBox="0 0 460 370"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>
          {fr ? 'Écran de 400 × 300 pixels' : '400 × 300 pixel screen'}
        </title>
        <desc id={`${id}-desc`}>
          {fr
            ? 'u augmente vers la droite, v vers le bas. Le centre O est en (200 ; 150). Les coordonnées du point P figurent sous le dessin.'
            : 'u increases rightwards, v downwards. Centre O is at (200; 150). Point P coordinates are written below.'}
        </desc>
        <rect className="geo-screen" x="30" y="30" width="400" height="300" />
        <path
          className="geo-axes"
          d="M30,30H440 M30,30V345 M230,30V330 M30,180H430"
        />
        <text x="435" y="23">
          u
        </text>
        <text x="10" y="350">
          v
        </text>
        <text x="34" y="25">
          0
        </text>
        <text x="230" y="352" textAnchor="middle">
          200
        </text>
        <text x="430" y="352" textAnchor="end">
          400
        </text>
        <text x="235" y="173">
          O
        </text>
        {visible && (
          <g>
            <path
              className="geo-dashed"
              d={`M230,180H${30 + s.u}V${30 + s.v}`}
            />
            <circle className="geo-point" cx={30 + s.u} cy={30 + s.v} r="5" />
            <text
              x={s.u > 365 ? 15 + s.u : 38 + s.u}
              y={s.v < 20 ? 55 + s.v : 20 + s.v}
            >
              P
            </text>
          </g>
        )}
      </svg>
    );
    result = (
      <>
        <p>
          u = 200 + {f(v[2]!)} × ({f(v[0]!)}) = {f(s.u)} ; v = 150 − {f(v[3]!)}{' '}
          × ({f(v[1]!)}) = {f(s.v)}.
        </p>
        <p>
          {fr ? 'Retour continu' : 'Continuous inverse'} : x = (u − 200)/sₓ ={' '}
          {f(back.x)} ; y = (150 − v)/sᵧ = {f(back.y)}.
        </p>
        <p data-visibility>
          {visible
            ? fr
              ? 'P est dans la fenêtre.'
              : 'P is inside the window.'
            : fr
              ? 'P est hors image : sa transformation reste correcte.'
              : 'P is outside the image: its transformation remains correct.'}
        </p>
        <p>
          {fr
            ? 'Le rectangle représente l’écran, pas des unités mathématiques. À échelles différentes, les angles et les formes peuvent être déformés. Aucun arrondi en pixel n’est effectué ici.'
            : 'The rectangle represents the screen, not mathematical units. Unequal scales may distort angles and shapes. No pixel rounding is applied here.'}
        </p>
      </>
    );
  } else {
    graph = (
      <Plot
        id={id}
        fr={fr}
        pixel={kind === 'raster' || kind === 'sampling'}
        residual={kind === 'residuals'}
        description={description}
      >
        {(X, Y) => {
          if (kind === 'membership') {
            const c = choice as Curve;
            const parabola = (side: boolean) => (
              <path
                className="geo-line"
                d={Array.from({ length: 161 }, (_, i) => {
                  const t = -4 + i / 20;
                  return `${i ? 'L' : 'M'}${X(side ? t * t : t)},${Y(side ? t : t * t)}`;
                }).join(' ')}
              />
            );
            return (
              <>
                {c === 'line' ? (
                  line(X, Y, 2, 1)
                ) : c === 'circle' ? (
                  <circle
                    className="geo-line"
                    cx={X(0)}
                    cy={Y(0)}
                    r={X(2) - X(0)}
                  />
                ) : c === 'parabola' ? (
                  parabola(false)
                ) : c === 'sideways' ? (
                  parabola(true)
                ) : (
                  <>
                    {line(X, Y, 1, 0)}
                    {c === 'squared' ? (
                      line(X, Y, -1, 0, true)
                    ) : (
                      <path className="geo-dashed" d={`M${X(0)},20V380`} />
                    )}
                  </>
                )}
                {point(X, Y, v[0]!, v[1]!, 'P')}
              </>
            );
          }
          if (kind === 'slope')
            return (
              <>
                {line(X, Y, v[0]!, v[1]!)}
                <path
                  className="geo-dashed"
                  d={`M${X(0)},${Y(v[1]!)}H${X(2)}V${Y(2 * v[0]! + v[1]!)}`}
                />
                {point(X, Y, 0, v[1]!, 'A')}
                {point(X, Y, 2, 2 * v[0]! + v[1]!, 'B')}
              </>
            );
          if (kind === 'points') {
            const a = { x: v[0]!, y: v[1]! },
              b = { x: v[2]!, y: v[3]! },
              r = throughPoints(a, b);
            return (
              <>
                {r.kind === 'affine' ? (
                  line(X, Y, r.m, r.p)
                ) : r.kind === 'vertical' ? (
                  <path className="geo-line" d={`M${X(r.x)},20V380`} />
                ) : null}
                {point(X, Y, a.x, a.y, 'A')}
                {point(X, Y, b.x, b.y, 'B')}
              </>
            );
          }
          if (kind === 'intersection') {
            const r = intersection(2, 1, v[0]!, v[1]!);
            return (
              <>
                {line(X, Y, 2, 1)}
                {choice === 'vertical' ? (
                  <>
                    <path className="geo-dashed" d={`M${X(v[1]!)},20V380`} />
                    {point(X, Y, v[1]!, 2 * v[1]! + 1, 'I')}
                  </>
                ) : (
                  <>
                    {line(X, Y, v[0]!, v[1]!, true)}
                    {r.kind === 'unique' && point(X, Y, r.x, r.y, 'I')}
                  </>
                )}
              </>
            );
          }
          if (kind === 'region')
            return (
              <>
                <polygon
                  className="geo-region"
                  points={(choice === 'triangle'
                    ? [
                        [0, 0],
                        [4, 0],
                        [0, 3],
                      ]
                    : [
                        [-4, -4],
                        [8, -4],
                        [8, -1],
                        [-4, 5],
                      ]
                  )
                    .map(([x, y]) => `${X(x!)},${Y(y!)}`)
                    .join(' ')}
                />
                {choice === 'triangle' ? (
                  <path
                    className="geo-line"
                    d={`M${X(0)},${Y(0)}L${X(4)},${Y(0)}L${X(0)},${Y(3)}Z`}
                  />
                ) : (
                  line(X, Y, -0.5, 3, choice === 'open')
                )}
                {point(X, Y, v[0]!, v[1]!, 'P')}
              </>
            );
          if (kind === 'residuals')
            return (
              <>
                {line(X, Y, v[0]!, v[1]!)}
                {observations.map((p, i) => (
                  <g key={i}>
                    <path
                      className="geo-dashed"
                      d={`M${X(p.x)},${Y(p.y)}V${Y(v[0]! * p.x + v[1]!)}`}
                    />
                    {point(X, Y, p.x, p.y, `P${i + 1}`)}
                    <rect
                      className="geo-prediction"
                      x={X(p.x) - 4}
                      y={Y(v[0]! * p.x + v[1]!) - 4}
                      width="8"
                      height="8"
                    />
                  </g>
                ))}
              </>
            );
          const steps =
            kind === 'raster'
              ? bresenham(v[0]!, v[1]!)
              : sampleSegment(v[0]!, v[1]!, choice as 'x' | 'y');
          const active =
            kind === 'raster'
              ? Math.min(v[2]!, Math.max(0, (steps?.length ?? 1) - 1))
              : Infinity;
          return (
            <>
              <path
                className="geo-dashed"
                d={`M${X(0)},${Y(0)}L${X(v[0]!)},${Y(v[1]!)}`}
              />
              {steps?.map((p, i) => (
                <rect
                  key={i}
                  className={i <= active ? 'geo-pixel' : 'geo-future'}
                  x={X(p.x) - 9}
                  y={Y(p.y) - 9}
                  width="18"
                  height="18"
                />
              ))}
              {kind === 'raster' &&
                steps &&
                point(X, Y, steps[active]!.x, steps[active]!.y, 'P')}
            </>
          );
        }}
      </Plot>
    );
    if (kind === 'membership') {
      const r = equationTest(choice as Curve, { x: v[0]!, y: v[1]! });
      result = (
        <>
          <p>
            {equations[choice as Curve]} ; P = {pt(v[0]!, v[1]!)}.
          </p>
          <p>
            {fr ? 'Membre gauche' : 'Left side'} = {f(r.left)} ;{' '}
            {fr ? 'membre droit' : 'right side'} = {f(r.right)}.
          </p>
          <p>
            {r.left === r.right
              ? fr
                ? 'Égalité vraie : P appartient à la courbe.'
                : 'True equality: P lies on the curve.'
              : fr
                ? 'Égalité fausse : P n’appartient pas à la courbe.'
                : 'False equality: P does not lie on the curve.'}
          </p>
          {['squared', 'multiplied'].includes(choice) && (
            <p>
              {fr
                ? 'Le trait continu est y = x ; les tirets montrent les points supplémentaires. Testez P dans les deux équations pour conclure.'
                : 'The solid line is y = x; dashes show additional points. Test P in both equations to conclude.'}
            </p>
          )}
        </>
      );
    }
    if (kind === 'slope')
      result = (
        <>
          <p>
            y = ({f(v[0]!)})x + ({f(v[1]!)}).
          </p>
          <p>
            A = {pt(0, v[1]!)} ; B = {pt(2, 2 * v[0]! + v[1]!)}.
          </p>
          <p>
            Δx = 2 ; Δy = {f(2 * v[0]!)} ; Δy/Δx = {f(v[0]!)} = m.
          </p>
          <p>
            {fr
              ? 'La marche en tirets compare deux variations ; p se lit au passage sur l’axe vertical.'
              : 'The dashed step compares two changes; p is read at the vertical-axis crossing.'}
          </p>
        </>
      );
    if (kind === 'points') {
      const r = throughPoints({ x: v[0]!, y: v[1]! }, { x: v[2]!, y: v[3]! });
      result = (
        <>
          <p>
            Δx = {f(v[2]! - v[0]!)} ; Δy = {f(v[3]! - v[1]!)}.
          </p>
          <p>
            {r.kind === 'repeated'
              ? fr
                ? 'A = B : un seul point, une infinité de droites possibles.'
                : 'A = B: one point, infinitely many possible lines.'
              : r.kind === 'vertical'
                ? fr
                  ? `Verticale x = ${f(r.x)}. Δx = 0 : la pente est indéfinie, pas nulle.`
                  : `Vertical x = ${f(r.x)}. Δx = 0: slope is undefined, not zero.`
                : `m ≈ ${f(r.m)} ; p ≈ ${f(r.p)} ; y ≈ (${f(r.m)})x + (${f(r.p)}).`}
          </p>
          {r.kind === 'affine' && (
            <p>
              {fr
                ? 'Contrôle des hauteurs dans la droite obtenue'
                : 'Check heights in the resulting line'}{' '}
              : y(A) ≈ {f(r.m * v[0]! + r.p)}, y(B) ≈ {f(r.m * v[2]! + r.p)}.
            </p>
          )}
        </>
      );
    }
    if (kind === 'intersection') {
      const r = intersection(2, 1, v[0]!, v[1]!);
      const x =
          choice === 'vertical' ? v[1]! : r.kind === 'unique' ? r.x : null,
        y = x === null ? null : 2 * x + 1;
      result = (
        <>
          <p>
            {fr ? 'Trait continu' : 'Solid'} : y = 2x + 1.{' '}
            {fr ? 'Tirets' : 'Dashed'} :{' '}
            {choice === 'vertical'
              ? `x = ${f(v[1]!)}`
              : `y = (${f(v[0]!)})x + (${f(v[1]!)})`}
            .
          </p>
          {choice !== 'vertical' && (
            <p>
              ({f(2 - v[0]!)})x = {f(v[1]! - 1)}.
            </p>
          )}
          <p>
            {x !== null
              ? `${fr ? 'Intersection unique' : 'Unique intersection'} : I ≈ ${pt(x, y!)}.`
              : r.kind === 'parallel'
                ? fr
                  ? 'Égalité impossible : parallèles distinctes, aucune solution.'
                  : 'Impossible equality: distinct parallel lines, no solution.'
                : fr
                  ? 'Identité : droites confondues, une infinité de solutions. Conservez y = 2x + 1.'
                  : 'Identity: coincident lines, infinitely many solutions. Retain y = 2x + 1.'}
          </p>
          {x !== null && (x < -4 || x > 8 || y! < -4 || y! > 8) && (
            <p>
              {fr
                ? 'I est hors de la fenêtre : cela ne signifie pas que les droites sont parallèles.'
                : 'I is outside the window: that does not make the lines parallel.'}
            </p>
          )}
        </>
      );
    }
    if (kind === 'region') {
      const r = regionTest(
        { x: v[0]!, y: v[1]! },
        choice as 'closed' | 'open' | 'triangle',
      );
      result = (
        <>
          <p>
            {choice === 'triangle'
              ? 'x ≥ 0 ; y ≥ 0 ; 12 − 3x − 4y ≥ 0'
              : `x + 2y ${choice === 'open' ? '<' : '≤'} 6`}
            .
          </p>
          <p>
            {fr ? 'Valeurs des tests' : 'Test values'} :{' '}
            {r.values.map(f).join(' ; ')}.{' '}
            {choice === 'triangle'
              ? fr
                ? 'Il faut trois valeurs positives ou nulles.'
                : 'All three must be nonnegative.'
              : fr
                ? 'On teste le signe de f = x + 2y − 6.'
                : 'Test the sign of f = x + 2y − 6.'}
          </p>
          <p>
            {r.inside
              ? fr
                ? 'P est accepté.'
                : 'P is accepted.'
              : fr
                ? 'P est exclu.'
                : 'P is excluded.'}
          </p>
          <p>
            {fr
              ? 'La zone remplie indique le côté retenu ; le trait pointillé exclut le bord, le trait continu l’inclut.'
              : 'The filled region marks the retained side; a dashed boundary is excluded, a solid boundary is included.'}
          </p>
        </>
      );
    }
    if (kind === 'sampling' || kind === 'raster') {
      const steps =
        kind === 'raster'
          ? bresenham(v[0]!, v[1]!)
          : sampleSegment(v[0]!, v[1]!, choice as 'x' | 'y');
      if (!steps)
        result = (
          <p role="status">
            {kind === 'raster'
              ? fr
                ? 'Octant non autorisé : il faut des entiers, 1 ≤ u₂ ≤ 12 et 0 ≤ v₂ ≤ u₂. Transformez le repère avant d’utiliser cette variante.'
                : 'Unsupported octant: use integers, 1 ≤ u₂ ≤ 12 and 0 ≤ v₂ ≤ u₂. Transform coordinates before using this variant.'
              : fr
                ? 'L’axe choisi ne varie pas : ne divisez pas par zéro. Changez d’axe ; si les deux extrémités coïncident, affichez un seul pixel.'
                : 'The selected axis does not change: avoid division by zero. Switch axes; if both endpoints coincide, display a single pixel.'}
          </p>
        );
      else {
        const step =
          kind === 'raster'
            ? (steps as ReturnType<typeof bresenham>)![
                Math.min(v[2]!, steps.length - 1)
              ]!
            : null;
        result = (
          <>
            <p>
              {fr
                ? 'Pixels (extrémités incluses)'
                : 'Pixels (both endpoints included)'}{' '}
              : {steps.map((p) => pt(p.x, p.y)).join(' → ')}.
            </p>
            <p>
              {steps.length} {steps.length === 1 ? 'pixel.' : 'pixels.'}{' '}
              {fr
                ? 'Les carrés pleins montrent les pixels retenus ; le segment idéal est en tirets. Axes vers le haut.'
                : 'Filled squares mark selected pixels; the ideal segment is dashed. Vertical axis upwards.'}
            </p>
            {step && (
              <p data-decision>
                P = {pt(step.x, step.y)} ; d = {step.d} ;{' '}
                {step.choice === 'end'
                  ? fr
                    ? 'extrémité atteinte, aucun pas suivant.'
                    : 'endpoint reached, no next step.'
                  : `${fr ? 'prochain pas' : 'next step'} : ${step.choice} (${step.d > 0 ? 'd > 0' : 'd ≤ 0'}). ${fr ? 'Mise à jour' : 'Update'} : d ← d + ${step.choice === 'E' ? 2 * v[1]! : 2 * v[1]! - 2 * v[0]!}.`}
              </p>
            )}
            {kind === 'sampling' && (
              <p>
                {fr
                  ? 'Arrondi au plus proche ; à mi-chemin, entier supérieur. Cette règle diffère du choix E de Bresenham en cas d’égalité.'
                  : 'Round to nearest; halfway ties choose the greater integer. This differs from Bresenham’s E tie rule.'}
              </p>
            )}
          </>
        );
      }
    }
    if (kind === 'residuals') {
      const r = residualTable(v[0]!, v[1]!);
      result = (
        <>
          <p>
            ŷ ≈ ({f(v[0]!)})x + ({f(v[1]!)}). Σe ≈ {f(r.sum)} ; S ≈ {f(r.loss)}{' '}
            ; MSE = S/3 ≈ {f(r.mse!)}.
          </p>
          <p>
            {fr
              ? 'Disques : observations ; carrés : prédictions ; tirets verticaux : résidus. Une somme signée nulle permet encore des erreurs.'
              : 'Disks: observations; squares: predictions; vertical dashes: residuals. A zero signed sum still permits errors.'}
          </p>
        </>
      );
      table = (
        <div className="geo-table">
          <table>
            <caption>
              {fr
                ? 'Calculs sur les trois observations fixes'
                : 'Calculations for the three fixed observations'}
            </caption>
            <thead>
              <tr>
                {['xᵢ', 'yᵢ', 'ŷᵢ', 'eᵢ = yᵢ − ŷᵢ', 'eᵢ²'].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row, i) => (
                <tr key={i}>
                  {[row.x, row.y, row.predicted, row.e, row.square].map(
                    (n, j) => (
                      <td key={j}>{f(n)}</td>
                    ),
                  )}
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
          {fr
            ? 'Observez le dessin, puis vérifiez avec les calculs ci-dessous. Un tracé illustre ; il ne remplace pas une preuve.'
            : 'Observe the drawing, then check the calculations below. A plot illustrates; it does not replace a proof.'}
        </figcaption>
      </figure>
      <div
        className="geo-results"
        aria-live="polite"
        aria-atomic="true"
        data-results
      >
        {result}
      </div>
      {table}
      <p className="geo-precision">
        {fr
          ? '≈ signale un arrondi ; les valeurs numériques non entières sont affichées avec au plus quatre décimales. La fenêtre ne montre qu’une partie du plan.'
          : '≈ marks rounding; noninteger numerical values use at most four decimal places. The window shows only part of the plane.'}
      </p>
    </>
  );
}
export default function GeometryLab({
  kind,
  locale,
}: {
  kind: Kind;
  locale: Locale;
}) {
  const fr = locale === 'fr',
    spec = specs[kind],
    t = (pair: [string, string]) => pair[fr ? 0 : 1],
    id = `geo-${kind}`;
  const [ready, setReady] = useState(false),
    [v, setV] = useState([...spec.initial]),
    [choice, setChoice] = useState(spec.choice),
    [feedback, setFeedback] = useState(''),
    [epoch, setEpoch] = useState(0);
  useEffect(() => setReady(true), []);
  const set = (i: number, n: number) => {
    setV((old) =>
      old.map((a, j) => (i === j ? n : kind === 'raster' && j === 2 ? 0 : a)),
    );
    setFeedback('');
  };
  const number = (
    i: number,
    label: string,
    min: number,
    max: number,
    step: number | 'any' = 1,
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
  const select = (label: string, options: [string, string][]) => (
    <label>
      {label}
      <select
        value={choice}
        onChange={(e) => {
          setChoice(e.target.value);
          setFeedback('');
        }}
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
  const check = () => {
    let ok = false,
      explanation = '';
    switch (kind) {
      case 'membership':
        ok = choice === 'squared' && v[0] === 1 && v[1] === -1;
        explanation = fr
          ? '(−1)² = 1², mais −1 ≠ 1. Le carré ajoute des solutions.'
          : '(−1)² = 1², but −1 ≠ 1. Squaring adds solutions.';
        break;
      case 'slope':
        ok = v[0] === -0.5 && v[1] === 2;
        explanation = fr
          ? 'Δy = mΔx = −0,5 × 2 = −1, et (0 ; 2) reste sur la droite.'
          : 'Δy = mΔx = −0.5 × 2 = −1, and (0; 2) remains on the line.';
        break;
      case 'points':
        ok = v.every((n, i) => n === [1, 1, 1, 4][i]);
        explanation = fr
          ? 'Δx = 0 et Δy = 3 : x = 1 est verticale. A = B serait un autre cas, sans droite unique.'
          : 'Δx = 0 and Δy = 3: x = 1 is vertical. A = B would be a different case, with no unique line.';
        break;
      case 'intersection':
        ok = choice === 'affine' && v[0] === 2 && v[1] === 3;
        explanation = fr
          ? 'Éliminer 2x donne 1 = 3, impossible. Avec p = 1, les droites seraient confondues.'
          : 'Eliminating 2x gives 1 = 3, impossible. With p = 1, the lines would coincide.';
        break;
      case 'region':
        ok = choice === 'triangle' && v[0] === 4 && v[1] === 0;
        explanation = fr
          ? 'Les tests donnent 4 ≥ 0, 0 ≥ 0 et 12 − 12 − 0 = 0 ≥ 0. Le bord est inclus.'
          : 'Tests give 4 ≥ 0, 0 ≥ 0 and 12 − 12 − 0 = 0 ≥ 0. The boundary is included.';
        break;
      case 'screen':
        ok = v.every((n, i) => n === [2, 1, 50, 50][i]);
        explanation = fr
          ? 'u = 200 + 50 × 2 = 300 ; v = 150 − 50 × 1 = 100. Monter fait diminuer v.'
          : 'u = 200 + 50 × 2 = 300; v = 150 − 50 × 1 = 100. Moving up decreases v.';
        break;
      case 'sampling':
        ok = choice === 'y' && v[0] === 3 && v[1] === 8;
        explanation = fr
          ? 'Les lignes 0 à 8 donnent neuf pixels ; les colonnes 0 à 3 n’en donnent que quatre.'
          : 'Rows 0 through 8 give nine pixels; columns 0 through 3 give only four.';
        break;
      case 'raster':
        ok = v[0] === 2 && v[1] === 1 && v[2] === 0 && choice === 'E';
        explanation = fr
          ? 'd = 2 × 1 − 2 = 0 : on choisit E, donc (1 ; 0). Le test NE exige d > 0.'
          : 'd = 2 × 1 − 2 = 0: choose E, hence (1; 0). NE requires d > 0.';
        break;
      case 'residuals':
        ok = v[0] === 0.5 && v[1] === 7 / 6;
        explanation = fr
          ? 'Les résidus sont −1/6, 1/3 et −1/6. Leur somme vaut 0, mais leurs carrés totalisent 1/6.'
          : 'Residuals are −1/6, 1/3 and −1/6. They sum to 0, but their squares sum to 1/6.';
        break;
    }
    setFeedback(
      `${ok ? (fr ? 'Défi réussi.' : 'Challenge complete.') : fr ? 'À reprendre : reproduisez les réglages du défi.' : 'Try again: reproduce the challenge settings.'} ${explanation}`,
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
          <LabView kind={kind} v={v} choice={choice} fr={fr} id={id} />
          <p hidden={ready} data-static-note>
            {fr
              ? 'Exemple fixe sans JavaScript. Les méthodes et les corrections restent lisibles ; les contrôles apparaissent quand l’activité est prête.'
              : 'Fixed example without JavaScript. Methods and worked solutions remain readable; controls appear when the activity is ready.'}
          </p>
        </div>
        <fieldset hidden={!ready}>
          <legend>
            {fr
              ? 'Manipulez les contrôles, puis expliquez ce qui change.'
              : 'Manipulate the controls, then explain what changes.'}
          </legend>
          <p>
            {fr
              ? 'Les bornes numériques servent à garder une fenêtre lisible ; les restrictions mathématiques sont précisées dans le résultat.'
              : 'Numerical bounds keep the window readable; mathematical restrictions are stated in the result.'}
          </p>
          {kind === 'membership' && (
            <>
              {select(
                fr ? 'Équation' : 'Equation',
                Object.entries(equations) as [string, string][],
              )}
              {number(0, 'x', -3, 6)}
              {number(1, 'y', -3, 6)}
            </>
          )}
          {(kind === 'slope' || kind === 'residuals') && (
            <>
              {number(0, 'm', -2, 3, 0.25)}
              {number(1, 'p', -2, 4, kind === 'residuals' ? 'any' : 0.25)}
              {kind === 'residuals' && (
                <button
                  type="button"
                  onClick={() => {
                    setV([0.5, 7 / 6]);
                    setEpoch((e) => e + 1);
                    setFeedback('');
                  }}
                >
                  {fr ? 'Essayer m = 1/2, p = 7/6' : 'Try m = 1/2, p = 7/6'}
                </button>
              )}
            </>
          )}
          {kind === 'points' && (
            <>
              {number(0, 'x₁ (A)', -3, 6)}
              {number(1, 'y₁ (A)', -3, 6)}
              {number(2, 'x₂ (B)', -3, 6)}
              {number(3, 'y₂ (B)', -3, 6)}
            </>
          )}
          {kind === 'intersection' && (
            <>
              {select(fr ? 'Deuxième droite' : 'Second line', [
                ['affine', 'y = mx + p'],
                ['vertical', 'x = p'],
              ])}
              {choice === 'affine' && number(0, 'm', -2, 3, 0.25)}
              {number(1, 'p', -2, 6, 0.25)}
            </>
          )}
          {kind === 'region' && (
            <>
              {select(fr ? 'Région' : 'Region', [
                ['closed', 'x + 2y ≤ 6'],
                ['open', 'x + 2y < 6'],
                ['triangle', fr ? 'Triangle fermé' : 'Closed triangle'],
              ])}
              {number(0, 'x', -3, 6)}
              {number(1, 'y', -3, 6)}
            </>
          )}
          {kind === 'screen' && (
            <>
              {number(0, 'x', -4, 6)}
              {number(1, 'y', -4, 6)}
              {number(2, 'sₓ', 10, 60, 10)}
              {number(3, 'sᵧ', 10, 60, 10)}
            </>
          )}
          {(kind === 'sampling' || kind === 'raster') && (
            <>
              {number(
                0,
                kind === 'raster' ? 'u₂' : 'x₂',
                kind === 'raster' ? 1 : 0,
                12,
              )}
              {number(1, kind === 'raster' ? 'v₂' : 'y₂', 0, 12)}
              {kind === 'sampling' ? (
                select(fr ? 'Axe parcouru' : 'Traversal axis', [
                  ['x', fr ? 'Colonnes' : 'Columns'],
                  ['y', fr ? 'Lignes' : 'Rows'],
                ])
              ) : (
                <>
                  {number(2, fr ? 'Pas' : 'Step', 0, v[0]!)}
                  {select(
                    fr
                      ? 'Ma prévision pour le prochain pas'
                      : 'My prediction for the next step',
                    [
                      ['E', 'E'],
                      ['NE', 'NE'],
                    ],
                  )}
                </>
              )}
            </>
          )}
          <p>
            <strong>{fr ? 'Défi : ' : 'Challenge: '}</strong>
            {t(spec.challenge)}
          </p>
          <button
            type="button"
            onClick={(event) => {
              const inputs = event.currentTarget
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
              setV([...spec.initial]);
              setChoice(spec.choice);
              setFeedback('');
              setEpoch((e) => e + 1);
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
        <LabView
          kind={kind}
          v={spec.initial}
          choice={spec.choice}
          fr={fr}
          id={`${id}-print`}
        />
      </div>
      <p className="geo-reflect">
        <strong>{fr ? 'Expliquez : ' : 'Explain: '}</strong>
        {fr
          ? 'quelle relation entre le calcul et le dessin justifie votre réponse ? Reproduisez un exemple sur papier.'
          : 'which relationship between calculation and drawing justifies your answer? Reproduce an example on paper.'}
      </p>
    </section>
  );
}
