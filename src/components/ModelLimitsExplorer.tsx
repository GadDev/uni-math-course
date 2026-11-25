import { useEffect, useId, useState } from 'react';
import { centredSums, type Point } from '../lib/geometry-labs';
import type { Locale } from '../lib/i18n';
import { format, NumberControl, Plot } from './GeometryLabPrimitives';
import '../styles/geometry-labs.css';
import '../styles/model-limits.css';

const scenarios = [
  'positive',
  'negative',
  'curve',
  'constantX',
  'constantY',
  'outlier',
] as const;
type Scenario = (typeof scenarios)[number];
const base: Record<Scenario, Point[]> = {
  positive: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  negative: [
    { x: 0, y: 3 },
    { x: 1, y: 2 },
    { x: 2, y: 1 },
  ],
  curve: [
    { x: -1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  constantX: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
  ],
  constantY: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  outlier: Array.from({ length: 6 }, (_, i) => ({ x: i, y: i })),
};

const labels: Record<Scenario, [string, string]> = {
  positive: ['Association positive', 'Positive association'],
  negative: ['Alignement décroissant', 'Decreasing alignment'],
  curve: ['Parabole', 'Parabola'],
  constantX: ['x constant', 'Constant x'],
  constantY: ['y constant', 'Constant y'],
  outlier: ['Valeur atypique', 'Outlier'],
};

function CorrelationView({
  scenario,
  include,
  height,
  fr,
  id,
}: {
  scenario: Scenario;
  include: boolean;
  height: number;
  fr: boolean;
  id: string;
}) {
  const extra = scenario === 'outlier' && include;
  const points = extra
    ? [...base[scenario], { x: 6, y: height }]
    : base[scenario];
  const sums = centredSums(points)!;
  const r =
    sums.xx > 0 && sums.yy > 0
      ? Math.max(-1, Math.min(1, sums.xy / Math.sqrt(sums.xx * sums.yy)))
      : null;
  const m = sums.xx > 0 ? sums.xy / sums.xx : null;
  const p = m === null ? null : sums.meanY - m * sums.meanX;
  const f = (n: number) => format(n, fr);
  return (
    <>
      <figure>
        <Plot
          id={id}
          fr={fr}
          centered={scenario !== 'outlier'}
          description={
            fr
              ? 'Points observés, droite ajustée si définie, croix pour le point ajouté.'
              : 'Observed points, fitted line if defined, cross for the added point.'
          }
        >
          {(X, Y) => (
            <>
              {scenario === 'outlier' && (
                <path
                  className="geo-dashed"
                  d={`M${X(-4)},${Y(-4)}L${X(8)},${Y(8)}`}
                />
              )}
              {m !== null && p !== null && (
                <path
                  className="geo-line"
                  d={`M${X(-5)},${Y(-5 * m + p)}L${X(8)},${Y(8 * m + p)}`}
                />
              )}
              {points.map((point, i) =>
                extra && i === points.length - 1 ? (
                  <path
                    key={i}
                    className="geo-line"
                    d={`M${X(point.x) - 6},${Y(point.y) - 6}l12,12m-12,0l12,-12`}
                  />
                ) : (
                  <circle
                    key={i}
                    className="geo-point"
                    cx={X(point.x)}
                    cy={Y(point.y)}
                    r="6"
                  />
                ),
              )}
            </>
          )}
        </Plot>
        <figcaption>
          {fr
            ? 'Trait continu : droite ajustée. '
            : 'Solid line: fitted line. '}
          {scenario === 'outlier' &&
            (fr
              ? 'Tirets : modèle initial ; croix : point ajouté.'
              : 'Dashes: original model; cross: added point.')}
        </figcaption>
      </figure>
      <div className="geo-results" aria-live="polite">
        <p data-correlation-sums>
          Sxx = {f(sums.xx)} ; Sxy = {f(sums.xy)} ; Syy = {f(sums.yy)}.
        </p>
        <p data-correlation-value>
          r {r === null ? (fr ? 'indéfini' : 'undefined') : `≈ ${f(r)}`}
        </p>
        <p data-correlation-fit>
          {m === null || p === null
            ? fr
              ? 'Pente non unique.'
              : 'Slope not unique.'
            : `m ≈ ${f(m)} ; p ≈ ${f(p)}`}
        </p>
        <p>
          {r === null
            ? fr
              ? 'Une variable est constante : le dénominateur vaut zéro.'
              : 'One variable is constant: the denominator is zero.'
            : scenario === 'curve'
              ? fr
                ? 'Relation quadratique exacte, association linéaire nulle.'
                : 'Exact quadratic relationship, zero linear association.'
              : fr
                ? 'Le coefficient mesure une association linéaire, pas une cause.'
                : 'The coefficient measures linear association, not a cause.'}
        </p>
      </div>
    </>
  );
}

const historical = [8.2, 7, 6.5, 5.3, 5.2, 4, 4.6, 4.5, 4.2, 3.7];
const predict = (t: number) => 7.32 - 0.445 * t;

function ExtrapolationView({
  year,
  fr,
  id,
}: {
  year: number;
  fr: boolean;
  id: string;
}) {
  const t = year - 2000;
  const prediction = predict(t);
  const X = (n: number) => 48 + n * 17;
  const Y = (n: number) => 230 - n * 22;
  return (
    <>
      <figure>
        <svg viewBox="0 0 440 310" role="img" aria-labelledby={`${id}-title`}>
          <title id={`${id}-title`}>
            {fr
              ? 'Consommation de margarine : observations de 2000 à 2009 et prolongement du modèle'
              : 'Margarine consumption: observations from 2000 to 2009 and model extension'}
          </title>
          <rect
            className="geo-region"
            x={X(9)}
            y="30"
            width={X(20) - X(9)}
            height="244"
          />
          <g className="geo-grid">
            {[-2, 0, 2, 4, 6, 8].map((n) => (
              <path key={n} d={`M48,${Y(n)}H388`} />
            ))}
          </g>
          <path className="geo-axes" d="M48,30V274 M48,230H400" />
          {[-2, 0, 2, 4, 6, 8].map((n) => (
            <text key={n} x="40" y={Y(n) + 6} textAnchor="end">
              {n}
            </text>
          ))}
          {[0, 5, 10, 15, 20].map((n) => (
            <text key={n} x={X(n)} y="300" textAnchor="middle">
              {n}
            </text>
          ))}
          <text x="400" y="300">
            t
          </text>
          <text x="10" y="24">
            y
          </text>
          <path
            className="geo-line"
            d={`M${X(0)},${Y(predict(0))}L${X(9)},${Y(predict(9))}`}
          />
          <path
            className="geo-dashed"
            d={`M${X(9)},${Y(predict(9))}L${X(20)},${Y(predict(20))}`}
          />
          {historical.map((y, i) => (
            <circle key={i} className="geo-point" cx={X(i)} cy={Y(y)} r="5" />
          ))}
          <rect
            className="geo-prediction"
            x={X(t) - 6}
            y={Y(prediction) - 6}
            width="12"
            height="12"
          />
        </svg>
        <figcaption>
          {fr
            ? 'Zone grisée : hors de la plage observée ; carré : prédiction. t = 0 en 2000.'
            : 'Shaded area: beyond the observed range; square: prediction. t = 0 in 2000.'}
        </figcaption>
      </figure>
      <div className="geo-results" aria-live="polite">
        <p data-extrapolation-result>
          t = {t} ; ŷ ≈ {format(prediction, fr)}.
        </p>
        <p data-extrapolation-domain>
          {t <= 9
            ? fr
              ? 'Dans la plage observée : fiabilité à vérifier.'
              : 'Within observed range: reliability still needs checking.'
            : fr
              ? 'Extrapolation : hors de la plage observée.'
              : 'Extrapolation: outside the observed range.'}
        </p>
        {prediction < 0 && (
          <p data-extrapolation-impossible>
            {fr
              ? 'Consommation négative : résultat impossible dans la réalité.'
              : 'Negative consumption: impossible in reality.'}
          </p>
        )}
      </div>
    </>
  );
}

export default function ModelLimitsExplorer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('positive');
  const [include, setInclude] = useState(false);
  const [height, setHeight] = useState(-2);
  const [year, setYear] = useState(2005);
  useEffect(() => setReady(true), []);
  return (
    <section className="geo-lab" data-model-limits>
      <p className="geo-title">
        {fr ? 'Corrélation et point atypique' : 'Correlation and outliers'}
      </p>
      <div className="geo-live">
        <div className="geo-visual">
          <CorrelationView
            scenario={scenario}
            include={include}
            height={height}
            fr={fr}
            id={`${id}-corr`}
          />
          <p hidden={ready} data-static-note>
            {fr
              ? 'Exemple fixe sans JavaScript.'
              : 'Fixed example without JavaScript.'}
          </p>
        </div>
        <fieldset hidden={!ready}>
          <legend>{fr ? 'Choisir un nuage' : 'Choose a scatterplot'}</legend>
          <label htmlFor={`${id}-scenario`}>
            {fr ? 'Jeu de données' : 'Dataset'}
          </label>
          <select
            id={`${id}-scenario`}
            value={scenario}
            onChange={(e) => setScenario(e.currentTarget.value as Scenario)}
          >
            {scenarios.map((s) => (
              <option value={s} key={s}>
                {labels[s][fr ? 0 : 1]}
              </option>
            ))}
          </select>
          {scenario === 'outlier' && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={include}
                  onChange={(e) => setInclude(e.currentTarget.checked)}
                />{' '}
                {fr ? 'Ajouter le point atypique (6, y)' : 'Add outlier (6, y)'}
              </label>
              {include && (
                <NumberControl
                  label="y"
                  value={height}
                  min={-2}
                  max={6}
                  onChange={setHeight}
                  fr={fr}
                />
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setScenario('positive');
              setInclude(false);
              setHeight(-2);
            }}
          >
            {fr ? 'Réinitialiser le nuage' : 'Reset scatterplot'}
          </button>
        </fieldset>
      </div>
      <p className="geo-title">
        {fr ? 'Extrapoler dans le temps' : 'Extrapolate in time'}
      </p>
      <div className="geo-live">
        <div className="geo-visual">
          <ExtrapolationView year={year} fr={fr} id={`${id}-extra`} />
        </div>
        <fieldset hidden={!ready}>
          <legend>{fr ? 'Choisir une année' : 'Choose a year'}</legend>
          <NumberControl
            label={fr ? 'Année' : 'Year'}
            value={year}
            min={2000}
            max={2020}
            onChange={setYear}
            fr={fr}
          />
          <button type="button" onClick={() => setYear(2017)}>
            2017
          </button>
          <button type="button" onClick={() => setYear(2005)}>
            {fr ? 'Réinitialiser l’année' : 'Reset year'}
          </button>
        </fieldset>
      </div>
      <div className="geo-print">
        <CorrelationView
          scenario="outlier"
          include
          height={-2}
          fr={fr}
          id={`${id}-print-corr`}
        />
        <ExtrapolationView year={2017} fr={fr} id={`${id}-print-extra`} />
      </div>
    </section>
  );
}
