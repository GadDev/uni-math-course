import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  logLabels,
  logPoint,
  logSecant,
  logTangent,
  logPlotX as X,
  logPlotY as Y,
  type LogCurve,
} from '../lib/logarithm-explorer';
import '../styles/logarithm-teaching.css';

type Mode = 'secant' | 'tangent';
type GraphProps = {
  id: string;
  locale: Locale;
  mode: Mode;
  a: number;
  h: number;
  curve: LogCurve;
  reveal: boolean;
};

function Graph({ id, locale, mode, a, h, curve, reveal }: GraphProps) {
  const fr = locale === 'fr';
  const point = logPoint(curve, a)!;
  const b = a + h;
  const secant = logSecant(a, h)!;
  const curvePath = Array.from({ length: 501 }, (_, index) => {
    const x = 0.02 + (6.18 * index) / 500;
    return `${index ? 'L' : 'M'}${X(x).toFixed(2)},${Y(logPoint(curve, x)!.value).toFixed(2)}`;
  }).join(' ');
  const line = (slope: number) =>
    `M${X(-0.5)},${Y(point.value + slope * (-0.5 - a))} L${X(6.2)},${Y(point.value + slope * (6.2 - a))}`;
  return (
    <svg
      viewBox="0 0 600 390"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>
        {`${logLabels[curve]} — ${fr ? 'repère cartésien' : 'Cartesian coordinates'}`}
      </title>
      <desc id={`${id}-desc`}>
        {fr
          ? 'Abscisses x de 0 à 6, ordonnées y de −3 à 4. La courbe existe seulement pour x positif. Les valeurs et les pentes sont données sous la figure.'
          : 'Horizontal x from 0 to 6, vertical y from −3 to 4. The curve exists only for positive x. Values and slopes are given below the figure.'}
      </desc>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="54" y="32" width="510" height="315" />
        </clipPath>
      </defs>
      <g className="l41-grid" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((x) => (
          <path key={`x${x}`} d={`M${X(x)},32V347`} />
        ))}
        {[-3, -2, -1, 1, 2, 3, 4].map((y) => (
          <path key={`y${y}`} d={`M54,${Y(y)}H564`} />
        ))}
      </g>
      <g className="l41-axes" aria-hidden="true">
        <path d={`M54,${Y(0)}H576 M${X(0)},347V19`} />
        {[0, 1, 2, 3, 4, 5, 6].map((x) => (
          <text key={x} x={X(x)} y={Y(0) + 20} textAnchor="middle">
            {x}
          </text>
        ))}
        {[-3, -2, -1, 1, 2, 3, 4].map((y) => (
          <text key={y} x={X(0) - 10} y={Y(y) + 5} textAnchor="end">
            {y}
          </text>
        ))}
        <text x="581" y={Y(0) + 5}>
          x
        </text>
        <text x={X(0) + 10} y="27">
          y
        </text>
      </g>
      <g clipPath={`url(#${id}-clip)`}>
        <path className="l41-curve" d={curvePath} data-curve />
        {reveal && (
          <path className="l41-tangent" d={line(point.slope)} data-tangent />
        )}
        {mode === 'secant' && (
          <>
            <path className="l41-secant" d={line(secant)} data-secant />
            <path
              className="l41-guides"
              d={`M${X(a)},${Y(point.value)}H${X(b)}V${Y(Math.log(b))}`}
            />
            <rect
              data-point-b
              x={X(b) - 5}
              y={Y(Math.log(b)) - 5}
              width="10"
              height="10"
            />
            <text x={X(b) + 10} y={Y(Math.log(b)) + 23}>
              B
            </text>
            <text
              x={(X(a) + X(b)) / 2}
              y={Y(point.value) + 23}
              textAnchor="middle"
            >
              h
            </text>
          </>
        )}
        <circle data-point-a cx={X(a)} cy={Y(point.value)} r="6" />
        <text x={X(a) + 10} y={Y(point.value) - 12}>
          A
        </text>
      </g>
    </svg>
  );
}

export default function LogarithmExplorer({
  mode,
  locale,
}: {
  mode: Mode;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const id = `l41-${mode}`;
  const [ready, setReady] = useState(false);
  const [a, setA] = useState(1);
  const [h, setH] = useState(1);
  const [aText, setAText] = useState('1');
  const [hText, setHText] = useState('1');
  const [curve, setCurve] = useState<LogCurve>('ln');
  const [prediction, setPrediction] = useState('');
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setReady(true), []);
  const format = (n: number) =>
    (Math.abs(n) < 1e-12 ? 0 : n).toLocaleString(fr ? 'fr-FR' : 'en-US', {
      maximumFractionDigits: 6,
    });
  const invalidA =
    aText.trim() === '' ||
    !Number.isFinite(Number(aText)) ||
    Number(aText) < 0.25 ||
    Number(aText) > 4;
  const invalidH =
    hText.trim() === '' ||
    !Number.isFinite(Number(hText)) ||
    Math.abs(Number(hText)) < 0.001 ||
    Math.abs(Number(hText)) > 2 ||
    a + Number(hText) <= 0;
  const error = invalidA
    ? fr
      ? 'Choisissez a entre 0,25 et 4. Le graphe conserve la dernière valeur valide.'
      : 'Choose a between 0.25 and 4. The graph keeps the last valid value.'
    : mode === 'secant' && invalidH
      ? fr
        ? 'Il faut 0,001 ≤ |h| ≤ 2 et a + h > 0. h = 0 est interdit. Le graphe conserve la dernière valeur valide.'
        : 'Use 0.001 ≤ |h| ≤ 2 and a + h > 0. h = 0 is forbidden. The graph keeps the last valid value.'
      : '';
  const applyH = (next: number) => {
    setH(next);
    setHText(String(next));
  };
  const applyA = (next: number) => {
    setA(next);
    setAText(String(next));
    if (next + h <= 0) applyH(-next / 2);
    setRevealed(false);
  };
  const point = logPoint(curve, a)!;
  const slope = point.slope;
  const sign = slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'zero';
  const direction =
    sign === 'positive'
      ? fr
        ? 'monte'
        : 'rises'
      : sign === 'negative'
        ? fr
          ? 'descend'
          : 'falls'
        : fr
          ? 'est horizontale'
          : 'is horizontal';
  const show = mode === 'secant' || revealed || !ready;
  const equation = `y ≈ ${format(point.value)} + (${format(slope)}) × (x − ${format(a)})`;
  return (
    <section
      className="l41-lab"
      data-l41-lab={mode}
      aria-label={
        mode === 'secant'
          ? fr
            ? 'De la sécante à la tangente'
            : 'From secant to tangent'
          : fr
            ? 'Construire une tangente'
            : 'Build a tangent'
      }
    >
      <p className="l41-lab-title">
        {mode === 'secant'
          ? fr
            ? 'À vous de jouer — Rapprocher B de A'
            : 'Your turn — Bring B towards A'
          : fr
            ? 'À vous de jouer — Prévoir la tangente'
            : 'Your turn — Predict the tangent'}
      </p>
      <div className="l41-live">
        <div className="l41-visual">
          <figure>
            <Graph
              id={id}
              locale={locale}
              mode={mode}
              a={a}
              h={h}
              curve={curve}
              reveal={show}
            />
            <figcaption>
              {logLabels[curve]} ·{' '}
              {fr
                ? 'Courbe : trait épais. Tangente : tirets.'
                : 'Curve: thick line. Tangent: dashed.'}{' '}
              {mode === 'secant' &&
                (fr
                  ? 'Sécante AB : trait fin. Point A : disque ; B : carré. Le coude pointillé montre le déplacement horizontal h, puis la variation verticale.'
                  : 'Secant AB: thin line. A: disk; B: square. The dotted corner shows horizontal change h, then vertical change.')}{' '}
              {fr
                ? 'Fenêtre fixe ; les deux axes ont des échelles différentes. Lisez les graduations, pas l’angle à l’écran.'
                : 'Fixed window; the axes use different scales. Read the ticks, not the on-screen angle.'}
            </figcaption>
          </figure>

          <p>
            A = ({format(a)} ; {format(point.value)})
            {mode === 'secant' &&
              ` ; B = (${format(a + h)} ; ${format(Math.log(a + h))})`}
          </p>
          {mode === 'secant' && Math.log(a + h) < -3.5 && (
            <p data-outside-window>
              {fr
                ? 'B est sous la fenêtre du graphique ; ses coordonnées restent affichées. Rapprochez h de zéro pour le revoir.'
                : 'B is below the graph window; its coordinates remain displayed. Bring h closer to zero to see it again.'}
            </p>
          )}
          <output aria-live="polite" aria-atomic="true" data-results>
            {mode === 'secant' ? (
              <>
                <span>
                  {fr ? 'Pente de la sécante' : 'Secant slope'} = [ln(a + h) −
                  ln(a)] / h ≈{' '}
                  <strong data-secant-value>{format(logSecant(a, h)!)}</strong>
                </span>
                <span>
                  {fr ? 'Pente de la tangente' : 'Tangent slope'} = f′(a) = 1/a
                  ≈ <strong data-slope-value>{format(slope)}</strong>
                </span>
              </>
            ) : show ? (
              <>
                {ready && (
                  <span>
                    {prediction === sign
                      ? fr
                        ? 'Prévision correcte.'
                        : 'Correct prediction.'
                      : fr
                        ? 'À revoir : utilisez le signe de la dérivée.'
                        : 'Try again: use the sign of the derivative.'}
                  </span>
                )}
                <span>
                  {curve === 'ln'
                    ? 'f′(a) = 1/a'
                    : curve === 'negative'
                      ? 'g′(a) = −1/a'
                      : 'k′(a) = 2 ln(a)/a'}{' '}
                  ≈ <strong data-slope-value>{format(slope)}</strong>.{' '}
                  {fr ? 'La tangente' : 'The tangent'} {direction}.
                </span>
                <span data-equation>{equation}</span>
                <span>
                  {fr
                    ? 'Contrôle : pour x = a, la droite redonne la hauteur du point A.'
                    : 'Check: at x = a, the line returns the height of point A.'}{' '}
                  {format(logTangent(curve, a, a)!)}
                </span>
              </>
            ) : (
              <span>
                {fr
                  ? 'Faites une prévision puis vérifiez pour afficher la tangente, sa pente et son équation.'
                  : 'Make a prediction and check it to show the tangent, its slope and equation.'}
              </span>
            )}
          </output>
          <p>
            {fr
              ? '≈ indique un arrondi numérique. Cette expérience illustre le résultat ; elle ne démontre pas une limite. Une tangente décrit la courbe localement.'
              : '≈ indicates numerical rounding. This experiment illustrates the result; it does not prove a limit. A tangent describes a curve locally.'}
          </p>
          <p data-static-note hidden={ready}>
            {fr
              ? 'Exemple fixe sans JavaScript : A = (1 ; 0). Activez JavaScript pour manipuler les contrôles ; les méthodes et les corrections restent disponibles ci-dessous.'
              : 'Static example without JavaScript: A = (1; 0). Enable JavaScript for controls; methods and worked solutions remain available below.'}
          </p>
        </div>
        <fieldset hidden={!ready}>
          <legend>
            {fr
              ? 'Manipuler, prévoir, puis vérifier'
              : 'Explore, predict, then check'}
          </legend>
          {mode === 'tangent' && (
            <label htmlFor={`${id}-curve`}>
              {fr ? 'Fonction (domaine : x > 0)' : 'Function (domain: x > 0)'}
              <select
                id={`${id}-curve`}
                value={curve}
                onChange={(event) => {
                  setCurve(event.target.value as LogCurve);
                  setRevealed(false);
                  setPrediction('');
                }}
              >
                {Object.entries(logLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label htmlFor={`${id}-a`}>
            {fr ? 'Déplacer A : abscisse a' : 'Move A: coordinate a'} ={' '}
            {format(a)}
          </label>
          <input
            id={`${id}-a`}
            type="range"
            min="0.25"
            max="4"
            step="any"
            value={a}
            aria-valuetext={`a = ${format(a)}`}
            onChange={(event) => applyA(Number(event.target.value))}
          />
          <label htmlFor={`${id}-a-number`}>
            {fr ? 'Saisir a (de 0,25 à 4)' : 'Enter a (0.25 to 4)'}
          </label>
          <input
            id={`${id}-a-number`}
            type="number"
            min="0.25"
            max="4"
            step="any"
            value={aText}
            aria-invalid={invalidA}
            aria-describedby={`${id}-error`}
            onChange={(event) => {
              const raw = event.target.value;
              setAText(raw);
              const next = Number(raw);
              if (
                raw.trim() &&
                Number.isFinite(next) &&
                next >= 0.25 &&
                next <= 4
              )
                applyA(next);
            }}
          />
          {mode === 'secant' && (
            <>
              <p id={`${id}-question`}>
                {fr
                  ? 'Prévision : quand h se rapproche de zéro, vers quelle pente va la sécante ? Essayez des h positifs, puis négatifs.'
                  : 'Predict: as h approaches zero, which slope does the secant approach? Try positive then negative h.'}
              </p>
              <label htmlFor={`${id}-h`}>
                {fr
                  ? 'Écart horizontal h (zéro sauté)'
                  : 'Horizontal gap h (zero skipped)'}{' '}
                = {format(h)}
              </label>
              <input
                id={`${id}-h`}
                type="range"
                min={Math.max(-2, -a + 0.001)}
                max="2"
                step="any"
                value={h}
                aria-valuetext={`h = ${format(h)}`}
                aria-describedby={`${id}-question`}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  applyH(
                    Math.abs(next) < 0.001
                      ? next === 0
                        ? h < 0
                          ? 0.001
                          : -0.001
                        : Math.sign(next) * 0.001
                      : next,
                  );
                }}
              />
              <label htmlFor={`${id}-h-number`}>
                {fr
                  ? 'Saisir h (a + h doit rester positif)'
                  : 'Enter h (a + h must remain positive)'}
              </label>
              <input
                id={`${id}-h-number`}
                type="number"
                min="-2"
                max="2"
                step="any"
                value={hText}
                aria-invalid={invalidH}
                aria-describedby={`${id}-error`}
                onChange={(event) => {
                  const raw = event.target.value;
                  setHText(raw);
                  const next = Number(raw);
                  if (
                    raw.trim() &&
                    Number.isFinite(next) &&
                    Math.abs(next) >= 0.001 &&
                    Math.abs(next) <= 2 &&
                    a + next > 0
                  )
                    setH(next);
                }}
              />
              <div className="l41-actions">
                {[0.1, 0.001, -0.1, -0.001].map((next) => (
                  <button type="button" key={next} onClick={() => applyH(next)}>
                    h = {format(next)}
                  </button>
                ))}
              </div>
              <p>
                {fr
                  ? 'Si déplacer A rend a + h non positif, h est ajusté à −a/2. La restriction a > 0 et a + h > 0 vient du logarithme ; les autres bornes servent à explorer une fenêtre lisible.'
                  : 'If moving A makes a + h nonpositive, h is adjusted to −a/2. The restrictions a > 0 and a + h > 0 come from the logarithm; the other bounds keep the exploration readable.'}
              </p>
            </>
          )}
          {mode === 'tangent' && (
            <>
              <label htmlFor={`${id}-prediction`}>
                {fr
                  ? 'Ici, la tangente devrait-elle monter, descendre ou être horizontale ?'
                  : 'Here, should the tangent rise, fall or be horizontal?'}
                <select
                  id={`${id}-prediction`}
                  value={prediction}
                  onChange={(event) => {
                    setPrediction(event.target.value);
                    setRevealed(false);
                  }}
                >
                  <option value="">
                    {fr ? 'Choisir une prévision' : 'Choose a prediction'}
                  </option>
                  <option value="positive">{fr ? 'Monter' : 'Rise'}</option>
                  <option value="negative">{fr ? 'Descendre' : 'Fall'}</option>
                  <option value="zero">
                    {fr ? 'Être horizontale' : 'Be horizontal'}
                  </option>
                </select>
              </label>
              <button
                type="button"
                disabled={!prediction || !!error}
                onClick={() => setRevealed(true)}
              >
                {fr ? 'Vérifier ma prévision' : 'Check my prediction'}
              </button>
            </>
          )}
          <p id={`${id}-error`} role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              setA(1);
              setH(1);
              setAText('1');
              setHText('1');
              setCurve('ln');
              setPrediction('');
              setRevealed(false);
            }}
          >
            {fr ? 'Réinitialiser : a = 1' : 'Reset: a = 1'}
            {mode === 'secant' ? ', h = 1' : ', f(x) = ln(x)'}
          </button>
        </fieldset>
      </div>
      <div className="l41-print-only">
        <Graph
          id={`${id}-print`}
          locale={locale}
          mode={mode}
          a={1}
          h={1}
          curve="ln"
          reveal
        />
        <p>
          {fr ? 'Exemple fixe à imprimer' : 'Fixed example for printing'} : f(x)
          = ln(x), A = (1 ; 0), f′(1) = 1, y = x − 1.
          {mode === 'secant' &&
            ' B = (2 ; ln(2)), h = 1, m = ln(2) ≈ 0,693147.'}
        </p>
      </div>
    </section>
  );
}
