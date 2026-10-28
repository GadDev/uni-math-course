import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  derivative,
  formula,
  plotX,
  plotY,
  secantSlope,
  tangent,
  value,
  type Curve,
} from '../lib/l40-math';
import '../styles/l40-explorers.css';

type Kind = 'secant' | 'tangent' | 'linked';
const copy = {
  fr: {
    secant: {
      title: 'À vous — de la sécante à la dérivée',
      goal: 'Comparer un taux moyen à la pente en un point.',
      question:
        'Prédisez : en a = 0, les pentes pour h = 0,1 et h = −0,1 seront-elles du même côté de 1 ?',
    },
    tangent: {
      title: 'À vous — déplacer le point de tangence',
      goal: 'Relier le point A, la pente et l’équation de la tangente.',
      question:
        'Avant d’afficher la tangente : pour eˣ en a = 0, sa pente vaut-elle 0 ou 1 ? Essayez ensuite les fonctions de comparaison.',
    },
    linked: {
      title: 'À vous — relier f et sa dérivée f′',
      goal: 'Lire sur f′ la pente observée sur f à la même abscisse.',
      question:
        'Prédisez : les graphes de eˣ et de sa dérivée se superposent-ils ? Est-ce encore vrai pour e⁻ˣ ou x² ?',
    },
  },
  en: {
    secant: {
      title: 'Your turn — from secant to derivative',
      goal: 'Compare an average rate with the slope at one point.',
      question:
        'Predict: at a = 0, will the slopes for h = 0.1 and h = −0.1 lie on the same side of 1?',
    },
    tangent: {
      title: 'Your turn — move the point of tangency',
      goal: 'Connect point A, slope and the tangent equation.',
      question:
        'Before revealing the tangent: for eˣ at a = 0, is its slope 0 or 1? Then try the comparison functions.',
    },
    linked: {
      title: 'Your turn — connect f and its derivative f′',
      goal: 'Read on f′ the slope observed on f at the same input.',
      question:
        'Predict: do the graphs of eˣ and its derivative coincide? Is this still true for e⁻ˣ or x²?',
    },
  },
};

function Plot({
  curve,
  a,
  h,
  kind,
  locale,
  showTangent,
  derivativeView = false,
}: {
  curve: Curve;
  a: number;
  h: number;
  kind: Kind;
  locale: Locale;
  showTangent: boolean;
  derivativeView?: boolean;
}) {
  const fr = locale === 'fr';
  const id = `l40-${kind}-${derivativeView ? 'derivative' : 'function'}`;
  const f = derivativeView ? derivative : value;
  const path = Array.from({ length: 201 }, (_, i) => {
    const x = -2.2 + (4.4 * i) / 200;
    return `${i === 0 ? 'M' : 'L'}${plotX(x)},${plotY(f(curve, x))}`;
  }).join(' ');
  const y = f(curve, a);
  const slope = secantSlope(curve, a, h);
  const secant = !derivativeView && kind === 'secant' && slope !== null;
  const tangentVisible = !derivativeView && showTangent;
  return (
    <svg
      viewBox="0 0 600 410"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>
        {derivativeView
          ? fr
            ? 'Graphe de f′ et point M'
            : 'Graph of f′ and point M'
          : fr
            ? 'Graphe de f et point A'
            : 'Graph of f and point A'}
      </title>
      <desc id={`${id}-desc`}>
        {fr
          ? 'Axes gradués x et y. Les valeurs et les pentes sont données en texte sous la figure. La fenêtre ne représente qu’une partie du graphe.'
          : 'Labelled x and y axes. Values and slopes are provided in text below the figure. The window shows only part of the graph.'}
      </desc>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="55" y="35" width="510" height="330" />
        </clipPath>
      </defs>
      {[-2, -1, 0, 1, 2].map((x) => (
        <g key={`x-${x}`}>
          <path className="l40-grid" d={`M${plotX(x)} 35V365`} />
          <text x={plotX(x)} y="389" textAnchor="middle">
            {x}
          </text>
        </g>
      ))}
      {[-4, -2, 0, 2, 4, 6, 8].map((yTick) => (
        <g key={`y-${yTick}`}>
          <path className="l40-grid" d={`M55 ${plotY(yTick)}H565`} />
          <text x="43" y={plotY(yTick) + 5} textAnchor="end">
            {yTick}
          </text>
        </g>
      ))}
      <path className="l40-axis" d={`M55 ${plotY(0)}H578M${plotX(0)} 365V22`} />
      <text x="580" y={plotY(0) - 8}>
        x
      </text>
      <text x={plotX(0) + 10} y="23">
        y
      </text>
      <g clipPath={`url(#${id}-clip)`}>
        <path className="l40-curve" d={path} />
        <path
          className="l40-guide"
          d={`M${plotX(a)} ${plotY(0)}V${plotY(y)}H${plotX(0)}`}
        />
        {tangentVisible && (
          <line
            className="l40-tangent"
            data-tangent
            x1={plotX(-2.2)}
            y1={plotY(tangent(curve, a, -2.2))}
            x2={plotX(2.2)}
            y2={plotY(tangent(curve, a, 2.2))}
          />
        )}
        {secant && (
          <>
            <line
              className="l40-secant"
              data-secant
              x1={plotX(-2.2)}
              y1={plotY(value(curve, a) + slope * (-2.2 - a))}
              x2={plotX(2.2)}
              y2={plotY(value(curve, a) + slope * (2.2 - a))}
            />
            <path
              className="l40-change"
              d={`M${plotX(a)} ${plotY(y)}H${plotX(a + h)}V${plotY(value(curve, a + h))}`}
            />
            {Math.abs(h) >= 0.2 && (
              <>
                <text
                  className="l40-label"
                  x={(plotX(a) + plotX(a + h)) / 2}
                  y={plotY(y) + 23}
                  textAnchor="middle"
                >
                  Δx = h
                </text>
                <text
                  className="l40-label"
                  x={plotX(a + h) + 10}
                  y={(plotY(y) + plotY(value(curve, a + h))) / 2}
                >
                  Δy
                </text>
              </>
            )}
            <rect
              data-point-b
              x={plotX(a + h) - 6}
              y={plotY(value(curve, a + h)) - 6}
              width="12"
              height="12"
              className="l40-b"
            />
            <text
              className="l40-label"
              x={plotX(a + h) + 10}
              y={plotY(value(curve, a + h)) - 10}
            >
              B
            </text>
          </>
        )}
        <circle
          data-point-a
          cx={plotX(a)}
          cy={plotY(y)}
          r="7"
          className="l40-a"
        />
        <text className="l40-label" x={plotX(a) - 18} y={plotY(y) - 12}>
          {derivativeView ? 'M' : 'A'}
        </text>
      </g>
      <text x="65" y="25">
        {derivativeView ? 'y = f′(x)' : `y = f(x) = ${formula[curve]}`}
      </text>
    </svg>
  );
}

export default function DerivativeExplorer({
  kind,
  locale,
}: {
  kind: Kind;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const text = copy[locale][kind];
  const id = `l40-${kind}`;
  const [ready, setReady] = useState(false);
  const [curve, setCurve] = useState<Curve>('exp');
  const [a, setA] = useState(0);
  const [h, setH] = useState(1);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setReady(true), []);
  const format = (n: number) =>
    n.toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 6 });
  const fa = value(curve, a);
  const m = derivative(curve, a);
  const slope = secantSlope(curve, a, h);
  const showTangent = kind !== 'tangent' || revealed;
  const equation = `y ≈ ${format(fa)} + (${format(m)}) × (x − (${format(a)}))`;
  const reset = () => {
    setA(0);
    setH(1);
    setCurve('exp');
    setRevealed(false);
  };
  return (
    <section
      className="l40-activity"
      data-l40-activity={kind}
      aria-labelledby={`${id}-title`}
    >
      <p className="l40-activity-title" id={`${id}-title`}>
        {text.title}
      </p>
      <p>{text.goal}</p>
      <p className="l40-question">{text.question}</p>
      <figure>
        <Plot
          curve={curve}
          a={a}
          h={h}
          kind={kind}
          locale={locale}
          showTangent={showTangent}
        />
        <figcaption>
          {fr
            ? kind === 'secant'
              ? 'Courbe : trait continu épais. Tangente : tirets. Sécante : trait fin, point B carré. A est le point rond.'
              : 'Courbe : trait continu épais. La tangente, lorsqu’elle est affichée, est en tirets. A est le point rond.'
            : kind === 'secant'
              ? 'Curve: thick solid line. Tangent: dashes. Secant: thin line, square point B. A is the round point.'
              : 'Curve: thick solid line. The tangent, when shown, is dashed. A is the round point.'}{' '}
          {fr
            ? 'Graduations : 1 en x, 2 en y ; les axes n’ont pas la même échelle.'
            : 'Ticks: 1 on x, 2 on y; axes have different scales.'}
        </figcaption>
      </figure>
      <fieldset disabled={!ready}>
        <legend>{fr ? 'Manipuler le graphique' : 'Explore the graph'}</legend>
        {kind !== 'secant' && (
          <>
            <label htmlFor={`${id}-curve`}>
              {fr
                ? 'Fonction (domaine : tous les réels)'
                : 'Function (domain: all real numbers)'}
            </label>
            <select
              id={`${id}-curve`}
              value={curve}
              onChange={(event) => setCurve(event.target.value as Curve)}
            >
              <option value="exp">
                {fr ? 'eˣ — exponentielle de x' : 'eˣ — exponential of x'}
              </option>
              <option value="decay">
                {fr
                  ? 'e⁻ˣ — comparaison : exposant −x'
                  : 'e⁻ˣ — comparison: exponent −x'}
              </option>
              <option value="square">
                {fr
                  ? 'x² — comparaison : fonction carré'
                  : 'x² — comparison: square function'}
              </option>
            </select>
          </>
        )}
        <label htmlFor={`${id}-a`}>
          {fr ? 'Abscisse a du point A' : 'Input a of point A'} : {format(a)}
        </label>
        <input
          id={`${id}-a`}
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={a}
          aria-valuetext={`a = ${format(a)}`}
          onChange={(event) => {
            const n = event.target.valueAsNumber;
            if (Number.isFinite(n)) setA(Math.max(-1, Math.min(1, n)));
          }}
        />
        {kind === 'secant' && (
          <>
            <label htmlFor={`${id}-h`}>
              {fr ? 'Écart horizontal h = Δx' : 'Horizontal change h = Δx'} :{' '}
              {format(h)}
            </label>
            <input
              id={`${id}-h`}
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={h}
              aria-valuetext={`h = ${format(h)}`}
              onChange={(event) => {
                const n = event.target.valueAsNumber;
                if (Number.isFinite(n)) setH(Math.max(-1, Math.min(1, n)));
              }}
            />
            <div className="l40-actions">
              {[-0.1, -0.01, 0, 0.01, 0.1].map((n) => (
                <button
                  type="button"
                  key={n}
                  data-h-preset={n}
                  onClick={() => setH(n)}
                >
                  h = {format(n)}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="l40-actions">
          {kind === 'tangent' && (
            <button
              type="button"
              aria-pressed={revealed}
              onClick={() => setRevealed(!revealed)}
            >
              {revealed
                ? fr
                  ? 'Masquer la tangente'
                  : 'Hide the tangent'
                : fr
                  ? 'Vérifier : afficher la tangente'
                  : 'Check: reveal the tangent'}
            </button>
          )}
          <button type="button" onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <div className="l40-readings" aria-live="polite" aria-atomic="true">
        <dl>
          <div>
            <dt>{fr ? 'Point sur f' : 'Point on f'}</dt>
            <dd>
              A ≈ ({format(a)} ; {format(fa)})
            </dd>
          </div>
          {kind === 'secant' && (
            <>
              <div>
                <dt>{fr ? 'Variation horizontale' : 'Horizontal change'}</dt>
                <dd>Δx = h = {format(h)}</dd>
              </div>
              <div>
                <dt>{fr ? 'Variation verticale' : 'Vertical change'}</dt>
                <dd>Δy ≈ {format(h === 0 ? 0 : slope! * h)}</dd>
              </div>
              <div>
                <dt>{fr ? 'Point sur f' : 'Point on f'}</dt>
                <dd>
                  B ≈ ({format(a + h)} ; {format(value(curve, a + h))})
                </dd>
              </div>
              <div>
                <dt>
                  {fr ? 'Pente de la sécante : Δy / h' : 'Secant slope: Δy / h'}
                </dt>
                <dd data-slope>
                  {slope === null
                    ? fr
                      ? 'Indéfinie (h = 0)'
                      : 'Undefined (h = 0)'
                    : `≈ ${format(slope)}`}
                </dd>
              </div>
            </>
          )}
          {showTangent && (
            <div>
              <dt>{fr ? 'Pente de la tangente' : 'Tangent slope'}</dt>
              <dd data-derivative>
                f′({format(a)}) ≈ {format(m)}
              </dd>
            </div>
          )}
        </dl>
        {showTangent && (
          <p data-equation>
            {fr
              ? 'Tangente (coefficients arrondis)'
              : 'Tangent (rounded coefficients)'}{' '}
            : {equation}
          </p>
        )}
        {kind === 'secant' && (
          <p data-feedback>
            {h === 0
              ? fr
                ? 'À h = 0, A et B coïncident : il n’y a plus de sécante et le quotient 0/0 est indéfini. La tangente reste définie grâce à la limite.'
                : 'At h = 0, A and B coincide: there is no secant and 0/0 is undefined. The tangent remains defined by the limit.'
              : fr
                ? 'Pour eˣ, h positif donne une pente supérieure à eᵃ ; h négatif donne une pente inférieure. Des deux côtés, elle tend vers eᵃ quand h tend vers 0.'
                : 'For eˣ, positive h gives a slope above eᵃ; negative h gives a slope below it. From either side, it tends to eᵃ as h tends to 0.'}
          </p>
        )}
        {kind !== 'secant' && showTangent && (
          <p data-feedback>
            {curve === 'exp'
              ? fr
                ? 'eᵃ est toujours positif : eˣ est strictement croissante sur ℝ. Sa pente et sa hauteur sont égales au même a.'
                : 'eᵃ is always positive: eˣ is strictly increasing on ℝ. Its slope and height are equal at the same a.'
              : curve === 'decay'
                ? fr
                  ? 'La hauteur e⁻ᵃ est positive mais la pente −e⁻ᵃ est négative : e⁻ˣ est strictement décroissante sur ℝ.'
                  : 'Height e⁻ᵃ is positive but slope −e⁻ᵃ is negative: e⁻ˣ is strictly decreasing on ℝ.'
                : fr
                  ? 'Pour x², f′(a) = 2a : pente négative à gauche de 0, nulle en 0, positive à droite. Une pente nulle en un point ne rend pas la fonction constante sur un intervalle.'
                  : 'For x², f′(a) = 2a: negative slope left of 0, zero at 0, positive right of 0. Zero slope at one point does not make the function constant on an interval.'}
          </p>
        )}
      </div>
      {kind === 'linked' && (
        <details className="l40-linked">
          <summary>
            {fr
              ? 'Afficher le graphe lié de f′'
              : 'Show the linked graph of f′'}
          </summary>
          <figure>
            <Plot
              curve={curve}
              a={a}
              h={h}
              kind={kind}
              locale={locale}
              showTangent={false}
              derivativeView
            />
            <figcaption>
              {fr
                ? 'Même abscisse et mêmes échelles. Sur ce deuxième graphe, l’ordonnée de M est la pente sur le premier, pas la hauteur de A.'
                : 'Same input and scales. On this second graph, the height of M is the slope on the first graph, not the height of A.'}
            </figcaption>
          </figure>
          <p data-linked-point>
            M ≈ ({format(a)} ; {format(m)})
          </p>
        </details>
      )}
      <p className="l40-static-note" hidden={ready}>
        {fr
          ? 'Figure et exemple fixes, lisibles sans JavaScript. Au départ : e⁰ = 1, f′(0) = 1 et tangente y = 1 + x. Activez JavaScript pour utiliser les curseurs.'
          : 'Static figure and example remain readable without JavaScript. Initially: e⁰ = 1, f′(0) = 1 and tangent y = 1 + x. Enable JavaScript to use the sliders.'}
      </p>
      <p className="l40-numerical-note">
        {fr
          ? 'Valeurs numériques arrondies à six décimales. Le dessin et les essais illustrent les résultats ; ils ne prouvent pas l’existence d’une limite.'
          : 'Numerical values are rounded to six decimal places. The drawing and experiments illustrate the results; they do not prove that a limit exists.'}
      </p>
    </section>
  );
}
