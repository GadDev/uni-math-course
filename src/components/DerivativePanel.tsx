import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import type { Locale } from '../lib/i18n';
import {
  clampA,
  derivative,
  plotX,
  plotY,
  squareSecant,
  tangent,
  value,
} from '../lib/l39-math';
import type { Curve } from '../lib/l39-math';
import '../styles/l39-panels.css';

type Kind = 'secant' | 'tangent';

function Plot({
  id,
  title,
  description,
  fn,
  children,
  derivativePlot = false,
}: {
  id: string;
  title: string;
  description: string;
  fn: (x: number) => number;
  children: ReactNode;
  derivativePlot?: boolean;
}) {
  const path = Array.from({ length: 241 }, (_, i) => {
    const x = -3.4 + (6.8 * i) / 240;
    return `${i ? 'L' : 'M'}${plotX(x)},${plotY(fn(x))}`;
  }).join(' ');
  return (
    <svg
      viewBox="0 0 520 350"
      role="group"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="45" y="35" width="430" height="270" />
        </clipPath>
      </defs>
      <rect width="520" height="350" fill="#fffdf8" />
      <g stroke="#dedad0" strokeWidth="1" aria-hidden="true">
        {[-3, -2, -1, 1, 2, 3].map((x) => (
          <path key={x} d={`M${plotX(x)} 35V305`} />
        ))}
        {[-4, -2, 2, 4, 6, 8, 10].map((y) => (
          <path key={y} d={`M45 ${plotY(y)}H475`} />
        ))}
      </g>
      <path
        d={`M45 ${plotY(0)}H488M${plotX(0)} 305V25`}
        stroke="#242424"
        strokeWidth="1.5"
      />
      <g fontSize="17" fontFamily="system-ui, sans-serif" fill="#242424">
        <text x="12" y="22">
          {title}
        </text>
        <text x="495" y={plotY(0) + 6}>
          x
        </text>
        <text x={plotX(0) + 8} y="40">
          y
        </text>
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <text key={x} x={plotX(x)} y={plotY(0) + 23} textAnchor="middle">
            {x}
          </text>
        ))}
        {[-4, -2, 2, 4, 6, 8, 10].map((y) => (
          <text key={y} x={plotX(0) - 10} y={plotY(y) + 6} textAnchor="end">
            {y}
          </text>
        ))}
      </g>
      <g clipPath={`url(#${id}-clip)`}>
        <path
          data-curve
          d={path}
          fill="none"
          stroke={derivativePlot ? '#7544a3' : '#1455c0'}
          strokeWidth="3"
          strokeDasharray={derivativePlot ? '3 3' : undefined}
        />
        {children}
      </g>
    </svg>
  );
}

export default function DerivativePanel({
  kind,
  locale,
}: {
  kind: Kind;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const secant = kind === 'secant';
  const id = `l39-${kind}`;
  const svgContainer = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [a, setA] = useState(1);
  const [magnitude, setMagnitude] = useState(1);
  const [sign, setSign] = useState(1);
  const [curve, setCurve] = useState<Curve>('square');
  const [answer, setAnswer] = useState('');
  const dragging = useRef(false);
  useEffect(() => setReady(true), []);

  const h = sign * magnitude;
  const y = value(curve, a);
  const slope = derivative(curve, a);
  const quotient = squareSecant(a, h)!;
  const fmt = (n: number) =>
    (Object.is(n, -0) ? 0 : n).toLocaleString(fr ? 'fr-FR' : 'en-US', {
      maximumFractionDigits: 6,
    });
  const definition = curve === 'square' ? 'f(x) = x²' : 'f(x) = x³ − 3x';
  const derivativeDefinition =
    curve === 'square' ? 'f′(x) = 2x' : 'f′(x) = 3x² − 3';
  const equation = `y = (${fmt(y)}) + (${fmt(slope)}) × (x − (${fmt(a)}))`;
  const chooseA = (next: number) => {
    setA(clampA(next));
    setAnswer('');
  };
  const reset = () => {
    chooseA(1);
    setMagnitude(1);
    setSign(1);
    setCurve('square');
  };
  const keyboard = (event: KeyboardEvent<SVGCircleElement>) => {
    const next =
      event.key === 'Home'
        ? -2
        : event.key === 'End'
          ? 2
          : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
            ? a - 0.05
            : event.key === 'ArrowRight' || event.key === 'ArrowUp'
              ? a + 0.05
              : null;
    if (next !== null) {
      event.preventDefault();
      chooseA(next);
    }
  };
  const drag = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgContainer.current?.querySelector('svg');
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    chooseA(((local.x - 45) / 430) * 6.8 - 3.4);
  };
  const feedback =
    answer === ''
      ? ''
      : answer === 'zero'
        ? fr
          ? 'Exact : une tangente horizontale a une pente nulle, donc f′(a) = 0. Le point peut être au-dessus ou au-dessous de l’axe x.'
          : 'Correct: a horizontal tangent has zero slope, so f′(a) = 0. Its point can lie above or below the x-axis.'
        : fr
          ? 'Une tangente horizontale garde la même hauteur : sa pente vaut 0. Cherchez f′(a) = 0 ; f(a) donne la hauteur, pas la pente.'
          : 'A horizontal tangent keeps the same height: its slope is 0. Look for f′(a) = 0; f(a) gives height, not slope.';
  const slopeText =
    slope === 0
      ? fr
        ? 'Pente nulle : tangente horizontale.'
        : 'Zero slope: horizontal tangent.'
      : slope > 0
        ? fr
          ? 'Pente positive : la tangente monte de gauche à droite.'
          : 'Positive slope: the tangent rises from left to right.'
        : fr
          ? 'Pente négative : la tangente descend de gauche à droite.'
          : 'Negative slope: the tangent falls from left to right.';

  return (
    <section
      className="l39-panel"
      data-l39-panel={kind}
      aria-labelledby={`${id}-heading`}
    >
      <p className="l39-panel-title" id={`${id}-heading`}>
        {secant
          ? fr
            ? 'À vous : de la sécante à la tangente'
            : 'Your turn: from secant to tangent'
          : fr
            ? 'À vous : explorer la dérivée et la tangente'
            : 'Your turn: explore derivative and tangent'}
      </p>
      <p>
        {secant
          ? fr
            ? 'Objectif : distinguer une pente moyenne et sa limite. Avant de réduire h, prédisez la pente vers laquelle la sécante va se rapprocher.'
            : 'Goal: distinguish an average slope from its limit. Before reducing h, predict the slope that the secant will approach.'
          : fr
            ? 'Objectif : relier hauteur, pente et équation. Avant de choisir a = 0, prédisez si la tangente sera horizontale.'
            : 'Goal: connect height, slope and equation. Before choosing a = 0, predict whether the tangent will be horizontal.'}
      </p>
      <fieldset hidden={!ready}>
        <legend>{fr ? 'Manipuler le graphique' : 'Explore the graph'}</legend>
        {!secant && (
          <label htmlFor={`${id}-curve`}>
            {fr ? 'Fonction sur ℝ' : 'Function on ℝ'}
            <select
              id={`${id}-curve`}
              value={curve}
              onChange={(e) => {
                setCurve(e.target.value as Curve);
                setAnswer('');
              }}
            >
              <option value="square">f(x) = x²</option>
              <option value="cubic">f(x) = x³ − 3x</option>
            </select>
          </label>
        )}
        <label htmlFor={`${id}-a`}>
          {fr ? 'Abscisse du point A' : 'Input of point A'} : a = {fmt(a)}
        </label>
        <input
          id={`${id}-a`}
          type="range"
          min="-2"
          max="2"
          step="0.05"
          value={a}
          aria-valuetext={`a = ${fmt(a)}`}
          onChange={(e) => chooseA(Number(e.target.value))}
        />
        {secant && (
          <>
            <label htmlFor={`${id}-sign`}>
              {fr ? 'Côté d’approche de B' : 'Side from which B approaches'}
            </label>
            <select
              id={`${id}-sign`}
              value={sign}
              onChange={(e) => setSign(Number(e.target.value))}
            >
              <option value="1">
                {fr
                  ? 'Depuis la droite : h positif'
                  : 'From the right: positive h'}
              </option>
              <option value="-1">
                {fr
                  ? 'Depuis la gauche : h négatif'
                  : 'From the left: negative h'}
              </option>
            </select>
            <label htmlFor={`${id}-h`}>
              |h| = {fmt(magnitude)}{' '}
              {fr ? '(distance horizontale)' : '(horizontal distance)'}
            </label>
            <input
              id={`${id}-h`}
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={magnitude}
              aria-valuetext={`|h| = ${fmt(magnitude)}`}
              onChange={(e) => setMagnitude(Number(e.target.value))}
            />
            <div className="l39-actions">
              {[1, 0.1, 0.01, 0.001].map((n) => (
                <button type="button" key={n} onClick={() => setMagnitude(n)}>
                  |h| = {fmt(n)}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="l39-actions">
          {[-1, 0, 1].map((n) => (
            <button type="button" key={n} onClick={() => chooseA(n)}>
              a = {n}
            </button>
          ))}
          <button type="button" onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <p data-static-note hidden={ready}>
        {fr
          ? 'Exemple fixe : a = 1, f(x) = x². Le graphique et les explications restent lisibles sans JavaScript ; les commandes deviennent disponibles avec JavaScript.'
          : 'Fixed example: a = 1, f(x) = x². Graph and explanations remain readable without JavaScript; controls become available with JavaScript.'}
      </p>
      <div ref={svgContainer} className="l39-plot">
        <Plot
          id={`${id}-function`}
          title={definition}
          fn={(x) => value(curve, x)}
          description={
            fr
              ? 'Courbe en trait continu, tangente en tirets et point A. Les coordonnées et les pentes sont données sous le graphique.'
              : 'Solid curve, dashed tangent and point A. Coordinates and slopes appear below the graph.'
          }
        >
          <line
            data-tangent
            x1={plotX(-3.4)}
            x2={plotX(3.4)}
            y1={plotY(tangent(curve, a, -3.4))}
            y2={plotY(tangent(curve, a, 3.4))}
            stroke="#b44018"
            strokeWidth="2.5"
            strokeDasharray="9 5"
          />
          {secant && (
            <>
              <line
                data-secant
                x1={plotX(-3.4)}
                x2={plotX(3.4)}
                y1={plotY(y + quotient * (-3.4 - a))}
                y2={plotY(y + quotient * (3.4 - a))}
                stroke="#252525"
                strokeWidth="2"
              />
              <path
                data-slope-triangle
                d={`M${plotX(a)},${plotY(y)}H${plotX(a + h)}V${plotY(value('square', a + h))}`}
                stroke="#252525"
                strokeWidth="2"
                strokeDasharray="2 4"
                fill="none"
              />
              <rect
                data-point-b
                x={plotX(a + h) - 6}
                y={plotY(value('square', a + h)) - 6}
                width="12"
                height="12"
                fill="#252525"
              />
              <text
                x={plotX(a + h) + 9}
                y={plotY(value('square', a + h)) - 9}
                fill="#252525"
                fontSize="18"
              >
                B
              </text>
            </>
          )}
          <circle
            data-point-a
            cx={plotX(a)}
            cy={plotY(y)}
            r="12"
            fill="#1455c0"
            stroke="#fffdf8"
            strokeWidth="2"
            role={ready ? 'slider' : undefined}
            tabIndex={ready ? 0 : undefined}
            aria-label={
              ready
                ? fr
                  ? 'Déplacer A horizontalement'
                  : 'Move A horizontally'
                : undefined
            }
            aria-valuemin={ready ? -2 : undefined}
            aria-valuemax={ready ? 2 : undefined}
            aria-valuenow={ready ? a : undefined}
            aria-valuetext={
              ready ? `a = ${fmt(a)}, f(a) = ${fmt(y)}` : undefined
            }
            onKeyDown={keyboard}
            onPointerDown={(event) => {
              dragging.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.focus();
              drag(event);
            }}
            onPointerMove={(event) => {
              if (dragging.current) drag(event);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
            onLostPointerCapture={() => {
              dragging.current = false;
            }}
          />
          <text
            x={plotX(a) - 22}
            y={plotY(y) - 15}
            fill="#1455c0"
            fontSize="18"
          >
            A
          </text>
        </Plot>
      </div>
      <p className="l39-legend">
        {fr
          ? 'Courbe : bleu continu · Tangente : orange en tirets · A : disque'
          : 'Curve: solid blue · Tangent: orange dashes · A: disk'}
        {secant &&
          (fr
            ? ' · Sécante : noir continu · B : carré · Triangle pointillé : Δx = h horizontalement, Δy verticalement'
            : ' · Secant: solid black · B: square · Dotted triangle: horizontal Δx = h, vertical Δy')}
      </p>
      <p className="l39-hint">
        {fr
          ? 'Fenêtre limitée ; les axes n’ont pas la même échelle. Déplacez A horizontalement ou utilisez le curseur et les boutons. Flèches : pas de 0,05 ; Début/Fin : bornes. Sur écran tactile, seul le point intercepte le déplacement horizontal.'
          : 'Limited window; the axes use different scales. Move A horizontally or use the slider and buttons. Arrows: steps of 0.05; Home/End: endpoints. On touchscreens only the point captures horizontal dragging.'}
      </p>
      <output aria-live="polite" aria-atomic="true">
        <span data-coordinates>
          A = ({fmt(a)} ; {fmt(y)})
        </span>
        {secant && (
          <>
            <span data-b-coordinates>
              B = ({fmt(a + h)} ; {fmt(value('square', a + h))})
            </span>
            <span>
              Δx = h = {fmt(h)} ; Δy = f(a+h) − f(a) ≈ {fmt(h * quotient)}
            </span>
            <span data-quotient>
              {fr ? 'Pente de la sécante' : 'Secant slope'} : [f(a+h) − f(a)] /
              h = 2a + h ≈ {fmt(quotient)}
            </span>
          </>
        )}
        <span data-value>f(a) ≈ {fmt(y)}</span>
        <span data-derivative>f′(a) ≈ {fmt(slope)}</span>
        <span data-equation>
          {fr ? 'Tangente' : 'Tangent'} : {equation}
        </span>
        <span data-slope-description>{slopeText}</span>
      </output>
      {secant ? (
        <>
          <p>
            {fr
              ? 'Pour chaque h non nul, on obtient encore une sécante. Le tableau garde a fixe et compare les deux côtés ; les pentes tendent vers 2a. Les valeurs affichées sont arrondies à six décimales au maximum.'
              : 'Every nonzero h still gives a secant. The table keeps a fixed and compares both sides; the slopes tend to 2a. Displayed values are rounded to at most six decimal places.'}
          </p>
          <table>
            <caption>
              {fr
                ? 'Même point A, des écarts de plus en plus petits'
                : 'Same point A, progressively smaller gaps'}
            </caption>
            <thead>
              <tr>
                <th scope="col">|h|</th>
                <th scope="col">h &lt; 0</th>
                <th scope="col">h &gt; 0</th>
              </tr>
            </thead>
            <tbody>
              {[1, 0.1, 0.01, 0.001].map((n) => (
                <tr key={n}>
                  <th scope="row">{fmt(n)}</th>
                  <td>{fmt(squareSecant(a, -n)!)}</td>
                  <td>{fmt(squareSecant(a, n)!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="l39-warning">
            {fr
              ? 'h ne vaut jamais 0 ici. À h = 0, le quotient serait indéfini (0/0) : la dérivée 2a est sa limite, pas la valeur de ce quotient en zéro.'
              : 'h is never 0 here. At h = 0 the quotient would be undefined (0/0): derivative 2a is its limit, not the value of this quotient at zero.'}
          </p>
        </>
      ) : (
        <>
          <p>
            {fr
              ? 'Le point du second graphique a la même abscisse a. Sa hauteur est f′(a), c’est-à-dire la pente de la tangente du premier graphique. La courbe de f′ n’est pas cette tangente.'
              : 'The point on the second graph has the same input a. Its height is f′(a), the tangent slope on the first graph. The curve of f′ is not that tangent.'}
          </p>
          <div className="l39-plot">
            <Plot
              id={`${id}-derivative`}
              title={derivativeDefinition}
              fn={(x) => derivative(curve, x)}
              derivativePlot
              description={
                fr
                  ? 'Courbe de la dérivée en pointillés violets ; le losange a pour coordonnées (a ; f′(a)).'
                  : 'Purple dotted derivative curve; the diamond has coordinates (a; f′(a)).'
              }
            >
              <path
                data-derivative-point
                d={`M${plotX(a)} ${plotY(slope) - 9}l9 9-9 9-9-9Z`}
                fill="#7544a3"
                stroke="#fffdf8"
                strokeWidth="2"
              />
            </Plot>
          </div>
          <p>
            {fr
              ? 'Dérivée : violet pointillé · Point (a ; f′(a)) : losange.'
              : 'Derivative: purple dots · Point (a; f′(a)): diamond.'}
          </p>
          <fieldset hidden={!ready}>
            <legend>
              {fr
                ? 'Défi : trouver une tangente horizontale'
                : 'Challenge: find a horizontal tangent'}
            </legend>
            <label htmlFor={`${id}-challenge`}>
              {fr
                ? 'Quelle condition chercher avant de déplacer A ?'
                : 'Which condition should you look for before moving A?'}
            </label>
            <select
              id={`${id}-challenge`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              <option value="">
                {fr ? 'Choisir une réponse' : 'Choose an answer'}
              </option>
              <option value="height">f(a) = 0</option>
              <option value="zero">f′(a) = 0</option>
              <option value="one">f′(a) = 1</option>
            </select>
            <p role="status">{feedback}</p>
            <p data-challenge-state>
              {slope === 0
                ? fr
                  ? 'Vous avez trouvé une tangente horizontale : comparez sa hauteur à sa pente.'
                  : 'You found a horizontal tangent: compare its height with its slope.'
                : fr
                  ? 'À vous : déplacez A jusqu’à obtenir f′(a) = 0. Essayez aussi la fonction cubique.'
                  : 'Your turn: move A until f′(a) = 0. Try the cubic function too.'}
            </p>
          </fieldset>
          <details>
            <summary>
              {fr
                ? 'Voir une solution et un contre-exemple'
                : 'Show a solution and a counterexample'}
            </summary>
            <p>
              {fr
                ? 'Pour x² : a = 0 donne f(0) = 0 et f′(0) = 0. Pour x³ − 3x : a = 1 donne f(1) = −2 mais f′(1) = 0 : une tangente horizontale n’est pas forcément l’axe x. À a = 0, la tangente y = −3x traverse la courbe cubique.'
                : 'For x²: a = 0 gives f(0) = 0 and f′(0) = 0. For x³ − 3x: a = 1 gives f(1) = −2 but f′(1) = 0: a horizontal tangent need not be the x-axis. At a = 0, tangent y = −3x crosses the cubic curve.'}
            </p>
          </details>
        </>
      )}
    </section>
  );
}
