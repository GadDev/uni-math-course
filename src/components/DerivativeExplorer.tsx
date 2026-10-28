import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import {
  derivative,
  plotLimit,
  quadratic,
  secantSlope,
  tangent,
  vertexX,
  type Quadratic,
} from '../lib/l38-math';
import '../styles/l38-explorers.css';

const initial: Quadratic = { a: 0.5, b: 0, c: 0 };
type Kind = 'secant' | 'tangent';
const format = (n: number, locale: Locale) =>
  (Math.abs(n) < 1e-10 ? 0 : n).toLocaleString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { maximumFractionDigits: 4 },
  );

function expression(terms: [number, string][], locale: Locale) {
  const parts = terms
    .filter(([value]) => Math.abs(value) > 1e-10)
    .map(([value, variable], index) => {
      const sign = value < 0 ? '− ' : index ? '+ ' : '';
      const coefficient =
        variable && Math.abs(value) === 1
          ? ''
          : format(Math.abs(value), locale);
      return `${sign}${coefficient}${variable}`;
    });
  return parts.join(' ') || '0';
}

function Parameter({
  name,
  label,
  min,
  max,
  value,
  onChange,
  locale,
}: {
  name: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  locale: Locale;
}) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const valid =
    draft !== '' &&
    Number.isFinite(Number(draft)) &&
    Number(draft) >= min &&
    Number(draft) <= max &&
    Math.abs(Number(draft) * 10 - Math.round(Number(draft) * 10)) < 1e-8;
  return (
    <div className="l38-parameter">
      <label htmlFor={`${id}-range`}>{label}</label>
      <input
        id={`${id}-range`}
        data-control={name}
        type="range"
        min={min}
        max={max}
        step="0.1"
        value={value}
        aria-valuetext={format(value, locale)}
        aria-describedby={`${id}-help`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <label className="visually-hidden" htmlFor={`${id}-number`}>
        {label} — {locale === 'fr' ? 'saisie numérique' : 'numeric input'}
      </label>
      <input
        id={`${id}-number`}
        data-number={name}
        type="number"
        required
        min={min}
        max={max}
        step="0.1"
        value={draft}
        aria-invalid={!valid}
        aria-describedby={`${id}-help`}
        onChange={(event) => {
          setDraft(event.target.value);
          if (event.target.validity.valid) onChange(Number(event.target.value));
        }}
        onBlur={() => setDraft(String(value))}
      />
      <small id={`${id}-help`}>
        {locale === 'fr' ? 'De' : 'From'} {min} {locale === 'fr' ? 'à' : 'to'}{' '}
        {max}, {locale === 'fr' ? 'pas de 0,1' : 'step 0.1'}.
        {!valid &&
          (locale === 'fr'
            ? ' Valeur invalide : le graphe conserve la dernière valeur valide.'
            : ' Invalid value: the graph keeps the last valid value.')}
      </small>
    </div>
  );
}

function Plot({
  model,
  x0,
  h,
  mode,
  locale,
}: {
  model: Quadratic;
  x0: number;
  h: number;
  mode: 'secant' | 'function' | 'derivative';
  locale: Locale;
}) {
  const id = useId().replaceAll(':', '');
  const fr = locale === 'fr';
  const isDerivative = mode === 'derivative';
  const fn = (x: number) =>
    isDerivative ? derivative(model, x) : quadratic(model, x);
  const samples = Array.from({ length: 241 }, (_, i) => -4 + i / 30);
  const limit = mode === 'secant' ? 12 : plotLimit(samples.map(fn));
  const X = (x: number) => 50 + (x + 4) * 47.5;
  const Y = (y: number) => 170 - (y / limit) * 120;
  const path = samples
    .map((x, i) => `${i ? 'L' : 'M'}${X(x)},${Y(fn(x))}`)
    .join(' ');
  const { y0, slope, intercept } = tangent(model, x0);
  const secant = secantSlope(model, x0, h);
  const title = isDerivative
    ? fr
      ? 'Graphe de la fonction dérivée f′'
      : 'Graph of the derivative function f′'
    : fr
      ? 'Courbe de f et droites de pente'
      : 'Graph of f and slope lines';
  const line = (m: number, k: number) =>
    `M${X(-4)},${Y(-4 * m + k)}L${X(4)},${Y(4 * m + k)}`;
  return (
    <figure>
      <svg
        viewBox="0 0 480 360"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        data-plot={mode}
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>
          {fr
            ? 'Axes gradués. Les valeurs du point et de la pente sont aussi données en texte sous les commandes.'
            : 'Numbered axes. Point values and slope also appear as text below the controls.'}
        </desc>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x="50" y="50" width="380" height="240" />
          </clipPath>
        </defs>
        <g className="l38-grid" aria-hidden="true">
          {[-4, -2, 0, 2, 4].map((x) => (
            <path key={x} d={`M${X(x)} 50V290`} />
          ))}
          {[-1, -0.5, 0, 0.5, 1].map((ratio) => (
            <path key={ratio} d={`M50 ${Y(ratio * limit)}H430`} />
          ))}
        </g>
        <g className="l38-axes">
          <path d={`M50 ${Y(0)}H450M${X(0)} 300V35`} />
          <text x="460" y={Y(0) + 7}>
            x
          </text>
          <text x={X(0) + 13} y="30">
            y
          </text>
          {[-4, -2, 0, 2, 4].map((x) => (
            <text key={x} x={X(x)} y={Y(0) + 23} textAnchor="middle">
              {x}
            </text>
          ))}
          {[-1, -0.5, 0.5, 1].map((ratio) => (
            <text key={ratio} x="46" y={Y(ratio * limit) + 6} textAnchor="end">
              {format(ratio * limit, locale)}
            </text>
          ))}
        </g>
        <g clipPath={`url(#${id}-clip)`}>
          <path className="l38-curve" d={path} data-curve />
          {!isDerivative && (
            <path
              className="l38-tangent"
              d={line(slope, intercept)}
              data-tangent
            />
          )}
          {mode === 'secant' && secant !== null && (
            <>
              <path
                className="l38-secant"
                d={line(secant, y0 - secant * x0)}
                data-secant
              />
              <path
                className="l38-triangle"
                d={`M${X(x0)} ${Y(y0)}H${X(x0 + h)}V${Y(quadratic(model, x0 + h))}`}
              />
              <text
                className="l38-label"
                x={(X(x0) + X(x0 + h)) / 2}
                y={Y(y0) + 48}
                textAnchor="middle"
              >
                h
              </text>
              <text
                className="l38-label"
                x={X(x0 + h) + 8}
                y={(Y(y0) + Y(quadratic(model, x0 + h))) / 2 - 8}
              >
                Δy
              </text>
              <circle
                className="l38-q"
                cx={X(x0 + h)}
                cy={Y(quadratic(model, x0 + h))}
                r="7"
                data-q
              />
              <text
                className="l38-label"
                x={X(x0 + h) + 12}
                y={Y(quadratic(model, x0 + h)) - 12}
              >
                Q
              </text>
            </>
          )}
          <path className="l38-guide" d={`M${X(x0)} ${Y(0)}V${Y(fn(x0))}`} />
          <circle
            className="l38-p"
            cx={X(x0)}
            cy={Y(fn(x0))}
            r="7"
            data-point
          />
          <text className="l38-label" x={X(x0) - 16} y={Y(fn(x0)) - 14}>
            {isDerivative ? 'R' : 'P'}
          </text>
        </g>
        <text className="l38-label" x="50" y="335">
          {isDerivative ? 'R = (x₀ ; f′(x₀))' : 'P = (x₀ ; f(x₀))'}
        </text>
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
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
  const secantMode = kind === 'secant';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [model, setModel] = useState(initial);
  const [x0, setX0] = useState(1);
  const [h, setH] = useState(2);
  const [revision, setRevision] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => setReady(true), []);
  const result = tangent(model, x0);
  const secant = secantSlope(model, x0, h);
  const fText = expression(
    [
      [model.a, 'x²'],
      [model.b, 'x'],
      [model.c, ''],
    ],
    locale,
  );
  const derivativeText = expression(
    [
      [2 * model.a, 'x'],
      [model.b, ''],
    ],
    locale,
  );
  const tangentText = expression(
    [
      [result.slope, 'x'],
      [result.intercept, ''],
    ],
    locale,
  );
  const undefinedText = fr ? 'non définie (h = 0)' : 'undefined (h = 0)';
  const summary = secantMode
    ? `h = ${format(h, locale)} ; ${fr ? 'pente de la sécante' : 'secant slope'} : ${secant === null ? undefinedText : format(secant, locale)} ; f′(1) = 1.`
    : `f(x) = ${fText} ; f′(x) = ${derivativeText} ; x₀ = ${format(x0, locale)} ; f(x₀) ≈ ${format(result.y0, locale)} ; f′(x₀) ≈ ${format(result.slope, locale)} ; ${fr ? 'tangente' : 'tangent'} : y ≈ ${tangentText}.`;
  useEffect(() => {
    if (!ready) return;
    const timeout = window.setTimeout(() => setAnnouncement(summary), 250);
    return () => window.clearTimeout(timeout);
  }, [summary, ready]);
  const reset = (next = initial) => {
    setModel(next);
    setX0(1);
    setH(2);
    setRevision((n) => n + 1);
  };
  return (
    <section
      className="l38-explorer"
      data-l38-explorer={kind}
      aria-labelledby={`${id}-title`}
    >
      <p id={`${id}-title`} className="l38-title">
        <strong>
          {secantMode
            ? fr
              ? 'À vous : rapprocher Q de P'
              : 'Your turn: bring Q closer to P'
            : fr
              ? 'À vous : parabole, dérivée et tangente'
              : 'Your turn: parabola, derivative and tangent'}
        </strong>
      </p>
      <p id={`${id}-question`}>
        {secantMode
          ? fr
            ? 'Prédisez les pentes pour h = 0,1 et h = −0,1. Sont-elles égales ? Vers quel nombre se rapprochent-elles ?'
            : 'Predict the slopes for h = 0.1 and h = −0.1. Are they equal? Which number do they approach?'
          : fr
            ? 'Avant de modifier c, prédisez : la courbe, la dérivée et la tangente vont-elles toutes changer ?'
            : 'Before changing c, predict: will the curve, derivative and tangent all change?'}
      </p>
      <div className="l38-plots">
        <Plot
          model={model}
          x0={x0}
          h={h}
          mode={secantMode ? 'secant' : 'function'}
          locale={locale}
        />
        {!secantMode && (
          <Plot model={model} x0={x0} h={h} mode="derivative" locale={locale} />
        )}
      </div>
      <p className="l38-legend">
        <span className="l38-key-curve">
          ━━ {secantMode ? 'f(x) = x²/2' : `f(x) = ${fText}`}
        </span>{' '}
        <span className="l38-key-tangent">
          ┄┄ {fr ? 'Tangente en P' : 'Tangent at P'}
        </span>{' '}
        {secantMode ? (
          <span>
            ━━ {fr ? 'Sécante PQ (si h ≠ 0)' : 'Secant PQ (when h ≠ 0)'}
          </span>
        ) : (
          <span>f′(x) = {derivativeText}</span>
        )}
      </p>
      <p className="l38-caption">
        {fr
          ? 'Fenêtres : −4 ≤ x ≤ 4 ; les graphes continuent au-delà. Les axes x et y ont des échelles différentes : lisez la pente avec les graduations, pas avec l’angle dessiné.'
          : 'Windows: −4 ≤ x ≤ 4; graphs continue beyond them. The x and y axes have different scales: read slope using the numbered axes, not the drawn angle.'}
        {!secantMode &&
          (fr
            ? ' Les échelles verticales s’adaptent aux coefficients et peuvent différer entre les deux graphes.'
            : ' Vertical scales adapt to the coefficients and may differ between the two graphs.')}
      </p>
      <fieldset
        hidden={!ready}
        disabled={!ready}
        aria-describedby={`${id}-question`}
      >
        <legend>{fr ? 'Manipuler l’exemple' : 'Explore the example'}</legend>
        {secantMode ? (
          <>
            <label htmlFor={`${id}-h`}>
              {fr ? 'Écart horizontal h' : 'Horizontal gap h'} :{' '}
              {format(h, locale)}
            </label>
            <input
              id={`${id}-h`}
              data-control="h"
              type="range"
              min="-2"
              max="2.5"
              step="0.01"
              value={h}
              aria-valuetext={summary}
              onChange={(e) => setH(Number(e.target.value))}
            />
            <div className="l38-actions">
              {[-0.1, 0, 0.1].map((value) => (
                <button
                  key={value}
                  type="button"
                  data-h={value}
                  onClick={() => setH(value)}
                >
                  {value === 0
                    ? fr
                      ? 'Examiner h = 0'
                      : 'Inspect h = 0'
                    : `h = ${format(value, locale)}`}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="l38-parameters" key={revision}>
            {(['a', 'b', 'c'] as const).map((name) => (
              <Parameter
                key={name}
                name={name}
                label={`${fr ? 'Coefficient' : 'Coefficient'} ${name}`}
                min={name === 'a' ? -2 : -3}
                max={name === 'a' ? 2 : 3}
                value={model[name]}
                onChange={(value) =>
                  setModel((previous) => ({ ...previous, [name]: value }))
                }
                locale={locale}
              />
            ))}
            <Parameter
              name="x0"
              label={
                fr
                  ? 'Abscisse x₀ du point de tangence'
                  : 'Abscissa x₀ of the tangency point'
              }
              min={-3}
              max={3}
              value={x0}
              onChange={setX0}
              locale={locale}
            />
          </div>
        )}
        <div className="l38-actions">
          {!secantMode && (
            <button
              type="button"
              data-square
              onClick={() => reset({ a: 1, b: 0, c: 0 })}
            >
              {fr ? 'Exemple f(x) = x²' : 'Example f(x) = x²'}
            </button>
          )}
          <button type="button" data-reset onClick={() => reset()}>
            {fr ? 'Réinitialiser : x²/2, x₀ = 1' : 'Reset: x²/2, x₀ = 1'}
          </button>
        </div>
      </fieldset>
      <div className="l38-values">
        {secantMode ? (
          <>
            <p>
              h = <strong data-h-value>{format(h, locale)}</strong> ; Δy = f(1 +
              h) − f(1) ≈ {format(quadratic(model, 1 + h) - 0.5, locale)}.
            </p>
            <p>
              {fr ? 'Pente de la sécante' : 'Secant slope'} :{' '}
              <strong data-secant-value>
                {secant === null ? undefinedText : format(secant, locale)}
              </strong>
              .
            </p>
            <p data-zero-explanation>
              {secant === null
                ? fr
                  ? 'P et Q coïncident : pas de droite PQ déterminée par deux points distincts, et le quotient est 0/0, non défini. La tangente reste dessinée ; sa pente 1 est la limite.'
                  : 'P and Q coincide: no line PQ determined by two distinct points, and the quotient is 0/0, undefined. The tangent remains drawn; its slope 1 is the limit.'
                : fr
                  ? 'La sécante a pour pente 1 + h/2. La tangente a pour pente f′(1) = 1. Δy désigne la variation verticale.'
                  : 'The secant slope is 1 + h/2. The tangent slope is f′(1) = 1. Δy denotes the vertical change.'}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>{fr ? 'Fonction dérivée' : 'Derivative function'}</strong>{' '}
              : f′(x) = <span data-derivative-formula>{derivativeText}</span>.
            </p>
            <p>
              <strong>
                {fr
                  ? 'Valeurs au point choisi'
                  : 'Values at the selected point'}
              </strong>{' '}
              : x₀ = {format(x0, locale)} ; f(x₀) ≈{' '}
              <span data-y0>{format(result.y0, locale)}</span> ; f′(x₀) ≈{' '}
              <span data-slope>{format(result.slope, locale)}</span>.
            </p>
            <p>
              <strong>
                {fr
                  ? 'Tangente, forme point–pente'
                  : 'Tangent, point–slope form'}
              </strong>{' '}
              : y ≈ ({format(result.y0, locale)}) + (
              {format(result.slope, locale)})(x − ({format(x0, locale)})).
            </p>
            <p>
              <strong>
                {fr ? 'Équation simplifiée' : 'Simplified equation'}
              </strong>{' '}
              : <span data-tangent-equation>y ≈ {tangentText}</span>.
            </p>
            <p data-family>
              {model.a === 0
                ? fr
                  ? 'a = 0 : f est affine (constante si b = 0). Sa dérivée est la constante b et chaque tangente est la droite elle-même.'
                  : 'a = 0: f is affine (constant when b = 0). Its derivative is the constant b and each tangent is the line itself.'
                : fr
                  ? `Le sommet a pour abscisse −b/(2a) ≈ ${format(vertexX(model)!, locale)}. À cette abscisse, f′ vaut 0 : la tangente est horizontale.`
                  : `The vertex has abscissa −b/(2a) ≈ ${format(vertexX(model)!, locale)}. There f′ is 0: the tangent is horizontal.`}
            </p>
            <p>
              {fr
                ? 'Les valeurs numériques sont arrondies à quatre décimales au plus (≈). Les formules symboliques de la leçon sont exactes.'
                : 'Numerical values are rounded to at most four decimal places (≈). The symbolic formulas in the lesson are exact.'}
            </p>
          </>
        )}
      </div>
      <span
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </span>
      <p hidden={ready} data-static-note>
        {fr
          ? 'Les graphes et les valeurs initiales restent lisibles sans JavaScript. Activez JavaScript pour utiliser les commandes.'
          : 'The graphs and initial values remain readable without JavaScript. Enable JavaScript to use the controls.'}
      </p>
    </section>
  );
}
