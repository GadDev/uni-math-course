import { useEffect, useState, type ReactNode } from 'react';
import {
  initialAlgebraState,
  domainValues,
  inequality,
  lineSystem,
  meanData,
  pointGeometry,
  realInput,
  type AlgebraKind,
} from '../lib/algebra-explorers';
import '../styles/algebra-explorers.css';

type Locale = 'fr' | 'en';
const copy = {
  precedence: [
    [
      'Priorités : changer les parenthèses',
      'Precedence: change the parentheses',
    ],
    [
      'Objectif : relier un regroupement à l’ordre des opérations.',
      'Goal: connect grouping with operation order.',
    ],
    [
      'Prédire : avec 2, 3 et 4, les deux regroupements donnent-ils le même résultat ?',
      'Predict: with 2, 3 and 4, do both groupings give the same result?',
    ],
    [
      'Expliquer : quelle opération devient prioritaire avec les parenthèses ? Essayez aussi a = 0 : une égalité ponctuelle prouve-t-elle une identité ?',
      'Explain: which operation takes priority with parentheses? Also try a = 0: does agreement at one value prove an identity?',
    ],
  ],
  area: [
    [
      'Identité remarquable : retrouver les quatre aires',
      'Standard identity: recover the four areas',
    ],
    [
      'Objectif : comprendre pourquoi le carré d’une somme contient 2ab.',
      'Goal: understand why a squared sum contains 2ab.',
    ],
    [
      'Prédire : si a = 2 et b = 3, quelle aire manque dans a² + b² ?',
      'Predict: if a = 2 and b = 3, which area is missing from a² + b²?',
    ],
    [
      'Expliquer : repérez les deux rectangles ab. Le dessin utilise des longueurs positives ; la distributivité prouve l’identité pour tous les réels.',
      'Explain: locate both ab rectangles. The drawing uses positive lengths; distributivity proves the identity for all real numbers.',
    ],
  ],
  domain: [
    [
      'Domaines : une valeur peut-elle être utilisée ?',
      'Domains: can a value be used?',
    ],
    [
      'Objectif : conserver les restrictions après simplification et distinguer les racines.',
      'Goal: preserve restrictions after cancellation and distinguish roots.',
    ],
    [
      'Prédire : à x = 3, le quotient initial peut-il valoir 6 ? Et à x = −2, quelles racines sont définies ?',
      'Predict: at x = 3, can the original quotient equal 6? At x = −2, which roots are defined?',
    ],
    [
      'Expliquer : le cercle ouvert est un trou, pas un point à ajouter. Comparez ensuite x = 0 et x = −2 dans le tableau.',
      'Explain: the open circle is a hole, not an extra point. Then compare x = 0 and x = −2 in the table.',
    ],
  ],
  inequality: [
    ['Inéquation : retourner l’ordre', 'Inequality: reverse the order'],
    [
      'Objectif : relier signe du coefficient, borne et ensemble de solutions.',
      'Goal: connect coefficient sign, boundary and solution set.',
    ],
    [
      'Prédire : dans ax + c > 0, que devient le sens si a passe de −2 à 2 ? Que se passe-t-il si a = 0 ?',
      'Predict: in ax + c > 0, how does the direction change when a goes from −2 to 2? What if a = 0?',
    ],
    [
      'Expliquer : testez la borne elle-même, puis changez > en ≥. Un point plein inclut la borne ; un cercle ouvert l’exclut.',
      'Explain: test the boundary itself, then change > to ≥. A filled point includes the boundary; an open circle excludes it.',
    ],
  ],
  system: [
    [
      'Système : zéro, une ou une infinité de solutions',
      'System: zero, one or infinitely many solutions',
    ],
    [
      'Objectif : relier l’élimination algébrique aux points communs de deux droites.',
      'Goal: connect algebraic elimination with common points of two lines.',
    ],
    [
      'Prédire : si m = 1, suffit-il de connaître m pour compter les solutions ? Comparez b = 1 et b = 3.',
      'Predict: if m = 1, is m enough to count solutions? Compare b = 1 and b = 3.',
    ],
    [
      'Expliquer : une solution doit appartenir aux deux droites. Distinguez 0x = 0 et 0x = 2 avant toute division.',
      'Explain: a solution must lie on both lines. Distinguish 0x = 0 from 0x = 2 before dividing.',
    ],
  ],
  mean: [
    [
      'Sigma et moyenne : équilibrer les écarts',
      'Sigma and mean: balance the deviations',
    ],
    [
      'Objectif : dérouler une somme et comprendre la compensation des écarts.',
      'Goal: expand a sum and understand cancellation of deviations.',
    ],
    [
      'Prédire : avec 2, 5 et 8, quelle est la moyenne ? Si 8 devient 9, de combien augmente-t-elle ?',
      'Predict: for 2, 5 and 8, what is the mean? If 8 becomes 9, how much does it increase?',
    ],
    [
      'Expliquer : les écarts se compensent sans être tous nuls. Gardez trois données et augmentez une seule valeur de 1 : la moyenne augmente de 1/3.',
      'Explain: deviations cancel without all being zero. Keep three observations and increase just one by 1: the mean increases by 1/3.',
    ],
  ],
  distance: [
    [
      'Distance : construire le triangle rectangle',
      'Distance: build the right triangle',
    ],
    [
      'Objectif : distinguer déplacements signés, distance et milieu.',
      'Goal: distinguish signed changes, distance and midpoint.',
    ],
    [
      'Prédire : de A = (0 ; 0) à B = (3 ; 4), la distance vaut-elle 7 ou 5 ? Et si l’on échange A et B ?',
      'Predict: from A = (0; 0) to B = (3; 4), is the distance 7 or 5? What if A and B are swapped?',
    ],
    [
      'Expliquer : changez les signes des déplacements, puis faites coïncider A et B. Les carrés rendent la distance symétrique ; elle n’est nulle que pour deux points confondus.',
      'Explain: change the signs of the displacements, then make A and B coincide. Squares make distance symmetric; it is zero only for coincident points.',
    ],
  ],
};

function Grid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={title}>
      <title>{title}</title>
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i} className="algebra-grid">
          <line x1={20 + 30 * i} x2={20 + 30 * i} y1="20" y2="380" />
          <line y1={20 + 30 * i} y2={20 + 30 * i} x1="20" x2="380" />
        </g>
      ))}
      <path className="algebra-axis" d="M20 200H380M200 20V380" />
      <text x="380" y="192">
        x
      </text>
      <text x="210" y="22">
        y
      </text>
      {[-4, -2, 0, 2, 4].map((v) => (
        <g key={v}>
          <text x={200 + 30 * v} y="220" textAnchor="middle">
            {v}
          </text>
          {v !== 0 && (
            <text x="190" y={206 - 30 * v} textAnchor="end">
              {v}
            </text>
          )}
        </g>
      ))}
      {children}
    </svg>
  );
}
const px = (x: number) => 200 + 30 * x;
const py = (y: number) => 200 - 30 * y;

function LabView({
  kind,
  values: v,
  locale,
}: {
  kind: AlgebraKind;
  values: number[];
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);
  const f = (n: number) => {
    if (!Number.isFinite(n))
      return t('hors précision numérique', 'beyond numerical precision');
    return (Object.is(n, -0) ? 0 : n).toLocaleString(
      fr ? 'fr-FR' : 'en-US',
      Math.abs(n) > 1e6 || (n !== 0 && Math.abs(n) < 0.0001)
        ? { notation: 'scientific', maximumFractionDigits: 4 }
        : { maximumFractionDigits: 4 },
    );
  };
  const [a = 0, b = 0, c = 0, d = 0] = v;
  if (kind === 'precedence') {
    const first = d ? a + b : b * c;
    const result = d ? first * c : a + first;
    return (
      <>
        <p className="algebra-equation" data-expression>
          {d
            ? `(${f(a)} + (${f(b)})) × (${f(c)})`
            : `${f(a)} + (${f(b)}) × (${f(c)})`}
        </p>
        <ol>
          <li>
            {d
              ? t('Parenthèses', 'Parentheses')
              : t('Multiplication prioritaire', 'Multiplication first')}{' '}
            : {d ? `${f(a)} + (${f(b)})` : `(${f(b)}) × (${f(c)})`} = {f(first)}
            .
          </li>
          <li>
            {d
              ? t('Puis multiplication', 'Then multiply')
              : t('Puis addition', 'Then add')}{' '}
            : {d ? `${f(first)} × (${f(c)})` : `${f(a)} + (${f(first)})`} ={' '}
            <strong data-result>{f(result)}</strong>.
          </li>
        </ol>
        <p aria-live="polite" aria-atomic="true">
          {t('Comparer', 'Compare')} : a + bc = {f(a + b * c)} ; (a + b)c ={' '}
          {f((a + b) * c)}.
        </p>
        <p>
          {t(
            'Les parenthèses autour d’un nombre signé évitent une ambiguïté ; celles autour de a + b changent le groupe à calculer.',
            'Parentheses around a signed number avoid ambiguity; those around a + b change which group is evaluated.',
          )}
        </p>
      </>
    );
  }
  if (kind === 'area') {
    const s = 28,
      x = 45,
      y = 35;
    return (
      <>
        <svg
          viewBox={`0 0 ${90 + 28 * (a + b)} ${70 + 28 * (a + b)}`}
          role="img"
          aria-label={t(
            'Carré de côté a plus b partagé en quatre aires',
            'Square of side a plus b divided into four areas',
          )}
        >
          <title>
            {t(
              'Deux carrés et deux rectangles',
              'Two squares and two rectangles',
            )}
          </title>
          <rect
            className="algebra-area-square"
            x={x}
            y={y}
            width={a * s}
            height={a * s}
          />
          <rect
            className="algebra-area-cross"
            x={x + a * s}
            y={y}
            width={b * s}
            height={a * s}
          />
          <rect
            className="algebra-area-cross"
            x={x}
            y={y + a * s}
            width={a * s}
            height={b * s}
          />
          <rect
            className="algebra-area-square"
            x={x + a * s}
            y={y + a * s}
            width={b * s}
            height={b * s}
          />
          <text x={x + (a * s) / 2} y={y + (a * s) / 2 + 6} textAnchor="middle">
            a²
          </text>
          <text
            x={x + a * s + (b * s) / 2}
            y={y + (a * s) / 2 + 6}
            textAnchor="middle"
          >
            ab
          </text>
          <text
            x={x + (a * s) / 2}
            y={y + a * s + (b * s) / 2 + 6}
            textAnchor="middle"
          >
            ab
          </text>
          <text
            x={x + a * s + (b * s) / 2}
            y={y + a * s + (b * s) / 2 + 6}
            textAnchor="middle"
          >
            b²
          </text>
          <text x={x + (a * s) / 2} y="25" textAnchor="middle">
            a
          </text>
          <text x={x + a * s + (b * s) / 2} y="25" textAnchor="middle">
            b
          </text>
        </svg>
        <p data-result aria-live="polite" aria-atomic="true">
          (a + b)² = {f((a + b) ** 2)} = {f(a * a)} + {f(a * b)} + {f(a * b)} +{' '}
          {f(b * b)}.
        </p>
        <p>
          {t(
            'Aire oubliée si l’on écrit seulement a² + b²',
            'Area omitted by writing only a² + b²',
          )}{' '}
          : 2ab = <strong>{f(2 * a * b)}</strong>.
        </p>
      </>
    );
  }
  if (kind === 'domain') {
    const data = domainValues(a);
    const value = (n: number | null) =>
      n === null ? t('Non défini', 'Undefined') : `≈ ${f(n)}`;
    return (
      <>
        <svg
          viewBox="0 0 400 280"
          role="img"
          aria-label={t(
            'Droite y égale x plus 3 avec un trou en (3 ; 6)',
            'Line y equals x plus 3 with a hole at (3; 6)',
          )}
        >
          <title>
            {t(
              'Le quotient simplifié conserve le trou',
              'Cancellation preserves the hole',
            )}
          </title>
          <path className="algebra-axis" d="M20 230H380M200 10V260" />
          <path className="algebra-line" d="M50 270L350 70" />
          <circle className="algebra-hole" cx="290" cy="110" r="7" />
          <text x="300" y="100">
            (3 ; 6)
          </text>
          <text x="380" y="250">
            x
          </text>
          <text x="210" y="22">
            y
          </text>
          <text x="193" y="250">
            0
          </text>
          <text x="290" y="250">
            3
          </text>
          {a !== 3 && (
            <circle
              className="algebra-point"
              cx={200 + 30 * a}
              cy={230 - 20 * (a + 3)}
              r="6"
            />
          )}
        </svg>
        <table>
          <caption>
            {t(
              'Même entrée, domaines différents',
              'Same input, different domains',
            )}{' '}
            : x = {String(a)}
          </caption>
          <thead>
            <tr>
              <th>{t('Expression', 'Expression')}</th>
              <th>{t('Domaine', 'Domain')}</th>
              <th>{t('Valeur', 'Value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">(x² − 9)/(x − 3)</th>
              <td>x ≠ 3</td>
              <td data-quotient aria-live="polite">
                {value(data.quotient)}
              </td>
            </tr>
            <tr>
              <th scope="row">√x</th>
              <td>x ≥ 0</td>
              <td data-root>{value(data.root)}</td>
            </tr>
            <tr>
              <th scope="row">√(x²) = |x|</th>
              <td>x ∈ ℝ</td>
              <td>{value(data.rootSquare)}</td>
            </tr>
            <tr>
              <th scope="row">x⁻¹ = 1/x</th>
              <td>x ≠ 0</td>
              <td>{value(data.reciprocal)}</td>
            </tr>
          </tbody>
        </table>
        <p>
          {t(
            'Le graphe représente uniquement le quotient, avec des échelles différentes sur les axes. Valeurs arrondies à quatre décimales au maximum.',
            'The graph shows only the quotient, with different axis scales. Values are rounded to at most four decimal places.',
          )}
        </p>
      </>
    );
  }
  if (kind === 'inequality') {
    const inclusive = d === 1;
    const rel = inclusive ? '≥' : '>';
    const solved = inequality(a, b, inclusive);
    const boundary = ('boundary' in solved ? solved.boundary : 0) ?? 0;
    const direction =
      solved.kind === 'left' ? (inclusive ? '≤' : '<') : inclusive ? '≥' : '>';
    const accepted = inclusive ? a * c + b >= 0 : a * c + b > 0;
    const condition =
      solved.kind === 'all'
        ? 'S = ℝ'
        : solved.kind === 'none'
          ? 'S = ∅'
          : `x ${direction} ${f(boundary)}`;
    const interval =
      solved.kind === 'left'
        ? `]−∞ ; ${f(boundary)}${inclusive ? ']' : '['}`
        : `${inclusive ? '[' : ']'}${f(boundary)} ; +∞[`;
    return (
      <>
        <p>
          ({f(a)})x + ({f(b)}) {rel} 0
        </p>
        <p>
          {a === 0
            ? t(
                'Le membre gauche est constant : aucune division par zéro.',
                'The left side is constant: no division by zero.',
              )
            : `(${f(a)})x ${rel} ${f(-b)} → ${condition}`}
        </p>
        <p data-solution aria-live="polite" aria-atomic="true">
          <strong>{condition}</strong>
          {solved.kind === 'left' || solved.kind === 'right'
            ? ` ; S = ${interval}`
            : ''}
        </p>
        <svg viewBox="0 0 400 150" role="img" aria-label={condition}>
          <title>{condition}</title>
          <path className="algebra-axis" d="M20 75H380" />
          {solved.kind === 'all' && (
            <path
              className="algebra-ray"
              d="M20 75H380M30 67L20 75L30 83M370 67L380 75L370 83"
            />
          )}
          {(solved.kind === 'left' || solved.kind === 'right') && (
            <>
              <path
                className="algebra-ray"
                d={
                  solved.kind === 'left'
                    ? `M${px(boundary)} 75H20M30 67L20 75L30 83`
                    : `M${px(boundary)} 75H380M370 67L380 75L370 83`
                }
              />
              <circle
                className={inclusive ? 'algebra-point' : 'algebra-hole'}
                cx={px(boundary)}
                cy="75"
                r="7"
              />
              <text x={px(boundary)} y="52" textAnchor="middle">
                {f(boundary)}
              </text>
            </>
          )}
          {[-4, -2, 0, 2, 4].map((n) => (
            <text key={n} x={px(n)} y="105" textAnchor="middle">
              {n}
            </text>
          ))}
          <path className="algebra-guide" d={`M${px(c)} 75v45`} />
          <text x={px(c)} y="142" textAnchor="middle">
            x = {f(c)}
          </text>
        </svg>
        <p data-test>
          {t('Test', 'Test')} : x = {f(c)} → ax + c = {f(a * c + b)} →{' '}
          {accepted
            ? t('convient', 'satisfies')
            : t('ne convient pas', 'does not satisfy')}
          .
        </p>
        <p>
          {a < 0
            ? t(
                'Diviser par a négatif inverse le sens.',
                'Dividing by negative a reverses the direction.',
              )
            : a > 0
              ? t(
                  'Diviser par a positif conserve le sens.',
                  'Dividing by positive a preserves the direction.',
                )
              : t(
                  'Comparez directement c à zéro.',
                  'Compare c directly with zero.',
                )}
        </p>
      </>
    );
  }
  if (kind === 'system') {
    const data = lineSystem(a, b);
    return (
      <>
        <p>
          {t(
            'Deux conditions à satisfaire ensemble',
            'Two conditions to satisfy together',
          )}{' '}
          : y = x + 1 ; y = ({f(a)})x + ({f(b)}).
        </p>
        <Grid
          title={t(
            'Droite continue y = x + 1 et droite en tirets y = mx + b ; même échelle sur les axes',
            'Solid line y = x + 1 and dashed line y = mx + b; equal axis scales',
          )}
        >
          <svg
            x="20"
            y="20"
            width="360"
            height="360"
            viewBox="20 20 360 360"
            overflow="hidden"
          >
            <line
              className="algebra-line"
              x1={px(-6)}
              y1={py(-5)}
              x2={px(6)}
              y2={py(7)}
            />
            <line
              className="algebra-line algebra-dashed"
              x1={px(-6)}
              y1={py(a * -6 + b)}
              x2={px(6)}
              y2={py(a * 6 + b)}
            />
          </svg>
          {data.kind === 'unique' && (
            <circle
              className="algebra-point"
              cx={px(data.x)}
              cy={py(data.y)}
              r="7"
            />
          )}
        </Grid>
        <p>
          {t('Éliminer y donne', 'Eliminating y gives')} : ({f(1 - a)})x ={' '}
          {f(b - 1)}.
        </p>
        <p data-solution aria-live="polite" aria-atomic="true">
          {data.kind === 'unique'
            ? `${t('Solution unique', 'Unique solution')} : (x ; y) = (${f(data.x)} ; ${f(data.y)}).`
            : data.kind === 'same'
              ? t(
                  'Infinité de solutions : tous les couples (x ; x + 1), x ∈ ℝ. Les droites sont confondues.',
                  'Infinitely many solutions: all pairs (x; x + 1), x ∈ ℝ. The lines coincide.',
                )
              : t(
                  'Aucune solution : les droites sont parallèles et distinctes.',
                  'No solution: the lines are parallel and distinct.',
                )}
        </p>
        {data.kind === 'unique' && (
          <p>
            {t(
              'Vérification des deux membres droits',
              'Check both right sides',
            )}{' '}
            : x + 1 = {f(data.x + 1)} ; mx + b = {f(a * data.x + b)} = y.
          </p>
        )}
      </>
    );
  }
  if (kind === 'mean') {
    const dataValues = v.slice(1, a + 1);
    const data = meanData(dataValues)!;
    return (
      <>
        <p data-sum>
          Σᵢ₌₁ⁿ xᵢ = {dataValues.map((n) => `(${f(n)})`).join(' + ')} ={' '}
          {f(data.total)} ; n = {a}.
        </p>
        <p data-mean aria-live="polite" aria-atomic="true">
          {t('Moyenne', 'Mean')} : x̄ = {f(data.total)} / {a} ≈{' '}
          <strong>{f(data.mean)}</strong>.
        </p>
        <svg
          viewBox="0 0 400 180"
          role="img"
          aria-label={t(
            'Observations sur une droite graduée et moyenne en tirets',
            'Observations on a number line and mean shown dashed',
          )}
        >
          <title>
            {t(
              'Les écarts se compensent autour de la moyenne',
              'Deviations balance around the mean',
            )}
          </title>
          <path className="algebra-axis" d="M20 135H380" />
          {[-5, 0, 5, 10].map((n) => (
            <text key={n} x={40 + 20 * (n + 5)} y="160" textAnchor="middle">
              {n}
            </text>
          ))}
          <path
            className="algebra-guide"
            d={`M${40 + 20 * (data.mean + 5)} 15V135`}
          />
          {dataValues.map((n, i) => (
            <g key={i}>
              <path
                className="algebra-ray"
                d={`M${40 + 20 * (data.mean + 5)} ${35 + 25 * i}H${40 + 20 * (n + 5)}`}
              />
              <circle
                className="algebra-point"
                cx={40 + 20 * (n + 5)}
                cy={35 + 25 * i}
                r="5"
              />
              <text x={40 + 20 * (n + 5)} y={28 + 25 * i} textAnchor="middle">
                x{i + 1}
              </text>
            </g>
          ))}
        </svg>
        <table>
          <caption>
            {t(
              'Écarts signés à la moyenne (arrondis)',
              'Signed deviations from the mean (rounded)',
            )}
          </caption>
          <thead>
            <tr>
              <th>i</th>
              <th>xᵢ</th>
              <th>xᵢ − x̄</th>
            </tr>
          </thead>
          <tbody>
            {dataValues.map((n, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{f(n)}</td>
                <td>{f(data.deviations[i]!)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p data-centered>
          Σᵢ₌₁ⁿ (xᵢ − x̄) = {f(data.total)} − {a} × ({f(data.total)}/{a}) = 0.
        </p>
        <p>
          {t(
            'L’identité est exacte. Les valeurs décimales du tableau sont arrondies ; leur somme affichée peut présenter un petit écart.',
            'The identity is exact. Decimal values in the table are rounded; adding the displayed values may leave a small residual.',
          )}
        </p>
      </>
    );
  }
  const g = pointGeometry(a, b, c, d);
  return (
    <>
      <Grid
        title={t(
          'Repère orthonormé : A, B, milieu M et triangle rectangle ; même unité sur les deux axes',
          'Orthonormal coordinates: A, B, midpoint M and right triangle; same unit on both axes',
        )}
      >
        <path
          className="algebra-guide"
          d={`M${px(a)} ${py(b)}H${px(c)}V${py(d)}`}
        />
        <line
          className="algebra-line"
          x1={px(a)}
          y1={py(b)}
          x2={px(c)}
          y2={py(d)}
        />
        <circle className="algebra-point" cx={px(a)} cy={py(b)} r="7" />
        <rect
          className="algebra-point"
          x={px(c) - 6}
          y={py(d) - 6}
          width="12"
          height="12"
        />
        <path
          className="algebra-midpoint"
          d={`M${px(g.mx)} ${py(g.my) - 6}l6 6-6 6-6-6Z`}
        />
        <text x={px(a) - 20} y={py(b) - 14}>
          A
        </text>
        <text x={px(c) + 10} y={py(d) - 12}>
          B
        </text>
      </Grid>
      <p>
        A = ({f(a)} ; {f(b)}) ; B = ({f(c)} ; {f(d)}) ; M = ({f(g.mx)} ;{' '}
        {f(g.my)}).
      </p>
      <p data-displacement>
        Δx = {f(c)} − ({f(a)}) = {f(g.dx)} ; Δy = {f(d)} − ({f(b)}) = {f(g.dy)}.
      </p>
      <p data-distance aria-live="polite" aria-atomic="true">
        d² = ({f(g.dx)})² + ({f(g.dy)})² = {f(g.dx * g.dx + g.dy * g.dy)} ; d ≈{' '}
        <strong>{f(g.distance)}</strong>.
      </p>
      <p>
        {t(
          'A : disque ; B : carré ; M : losange. Le trajet en pointillés a pour longueur |Δx| + |Δy| ; le segment direct a pour longueur d.',
          'A: disk; B: square; M: diamond. The dotted route has length |Δx| + |Δy|; the direct segment has length d.',
        )}
      </p>
      {g.distance === 0 && (
        <p>
          {t(
            'Les points coïncident : le triangle est aplati et la distance vaut zéro.',
            'The points coincide: the triangle collapses and the distance is zero.',
          )}
        </p>
      )}
    </>
  );
}

export default function AlgebraExplorer({
  kind,
  locale,
}: {
  kind: AlgebraKind;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);
  const idx = fr ? 0 : 1;
  const [values, setValues] = useState<number[]>([
    ...initialAlgebraState[kind],
  ]);
  const [raw, setRaw] = useState('2');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const input = realInput(raw, -5, 5);
  const invalid = kind === 'domain' && input === null;
  const update = (i: number, n: number) =>
    setValues((current) => current.map((v, j) => (i === j ? n : v)));
  const id = `algebra-${kind}`;
  const reset = () => {
    setValues([...initialAlgebraState[kind]]);
    setRaw('2');
  };
  const range = (label: string, i: number, min: number, max: number) => (
    <label key={i} htmlFor={`${id}-${i}`}>
      {label} : <span>{values[i]}</span>
      <input
        id={`${id}-${i}`}
        type="range"
        min={min}
        max={max}
        step="1"
        value={values[i]}
        onChange={(e) => update(i, Number(e.target.value))}
      />
    </label>
  );
  return (
    <section
      className="algebra-lab"
      data-algebra-lab={kind}
      aria-labelledby={`${id}-title`}
    >
      <p className="algebra-title" id={`${id}-title`}>
        {copy[kind][0]![idx]}
      </p>
      <p>{copy[kind][1]![idx]}</p>
      <p>
        <strong>{copy[kind][2]![idx]}</strong>
      </p>
      <div className="algebra-live">
        <fieldset hidden={!ready}>
          <legend>{t('Manipuler', 'Manipulate')}</legend>
          {kind === 'precedence' && (
            <>
              {range('a', 0, -5, 5)}
              {range('b', 1, -5, 5)}
              {range('c', 2, -5, 5)}
              <label>
                <input
                  type="checkbox"
                  checked={values[3] === 1}
                  onChange={(e) => update(3, Number(e.target.checked))}
                />{' '}
                {t('Regrouper a + b : (a + b)c', 'Group a + b: (a + b)c')}
              </label>
            </>
          )}
          {kind === 'area' && (
            <>
              {range(t('Longueur a', 'Length a'), 0, 1, 5)}
              {range(t('Longueur b', 'Length b'), 1, 1, 5)}
            </>
          )}
          {kind === 'domain' && (
            <label htmlFor={`${id}-x`}>
              x ∈ [−5 ; 5]
              <input
                id={`${id}-x`}
                type="number"
                min="-5"
                max="5"
                step="any"
                value={raw}
                aria-invalid={invalid}
                aria-describedby={`${id}-error`}
                onChange={(e) => {
                  setRaw(e.target.value);
                  const n = realInput(e.target.value, -5, 5);
                  if (n !== null) update(0, n);
                }}
              />
            </label>
          )}
          {kind === 'inequality' && (
            <>
              {range('a', 0, -4, 4)}
              {range('c', 1, -4, 4)}
              {range(t('Valeur test x', 'Test value x'), 2, -5, 5)}
              <label>
                <input
                  type="checkbox"
                  checked={values[3] === 1}
                  onChange={(e) => update(3, Number(e.target.checked))}
                />{' '}
                {t(
                  'Inclure l’égalité : ≥ au lieu de >',
                  'Include equality: ≥ instead of >',
                )}
              </label>
            </>
          )}
          {kind === 'system' && (
            <>
              {range('m', 0, -2, 3)}
              {range('b', 1, -3, 3)}
            </>
          )}
          {kind === 'mean' && (
            <>
              {range(
                t('Nombre de données n', 'Number of observations n'),
                0,
                1,
                4,
              )}
              {values
                .slice(1, values[0]! + 1)
                .map((_, i) => range(`x${i + 1}`, i + 1, -5, 10))}
            </>
          )}
          {kind === 'distance' && (
            <>
              {range(t('Abscisse de A', 'A horizontal coordinate'), 0, -4, 4)}
              {range(t('Ordonnée de A', 'A vertical coordinate'), 1, -4, 4)}
              {range(t('Abscisse de B', 'B horizontal coordinate'), 2, -4, 4)}
              {range(t('Ordonnée de B', 'B vertical coordinate'), 3, -4, 4)}
            </>
          )}
          <button type="button" onClick={reset}>
            {t('Réinitialiser', 'Reset')}
          </button>
        </fieldset>
        <p hidden={ready}>
          {t(
            'Exemple fixe lisible sans JavaScript. Les commandes apparaissent avec JavaScript.',
            'Fixed example readable without JavaScript. Controls appear with JavaScript.',
          )}
        </p>
        <p id={`${id}-error`} role="status">
          {invalid
            ? t(
                'Saisissez un réel entre −5 et 5. Aucun résultat n’est affiché pour cette saisie invalide.',
                'Enter a real number between −5 and 5. No result is shown for this invalid input.',
              )
            : ''}
        </p>
        {!invalid && <LabView kind={kind} values={values} locale={locale} />}
      </div>
      <div className="algebra-print">
        <p>
          {t(
            'Exemple de référence pour l’impression (valeurs initiales).',
            'Reference example for printing (initial values).',
          )}
        </p>
        <LabView
          kind={kind}
          values={initialAlgebraState[kind]}
          locale={locale}
        />
      </div>
      <p>{copy[kind][3]![idx]}</p>
    </section>
  );
}
