import { useEffect, useId, useState } from 'react';
import { centredSums, observations, residualTable } from '../lib/geometry-labs';
import type { Locale } from '../lib/i18n';
import { format, NumberControl, Plot } from './GeometryLabPrimitives';
import '../styles/geometry-labs.css';

const sums = centredSums(observations)!;
const bestM = sums.xy / sums.xx;
const bestP = sums.meanY - bestM * sums.meanX;
const bestLoss = residualTable(bestM, bestP).loss;
const intercept = (m: number) => sums.meanY - m * sums.meanX;

function View({
  m,
  p,
  anchored,
  fr,
  id,
}: {
  m: number;
  p: number;
  anchored: boolean;
  fr: boolean;
  id: string;
}) {
  const f = (n: number) => format(n, fr);
  const r = residualTable(m, p);
  const X = (s: number) => 45 + ((s + 1) * 350) / 3;
  const Y = (loss: number) => 260 - (loss * 220) / 5;
  const lossAt = (s: number) => residualTable(s, intercept(s)).loss;
  const curve = Array.from({ length: 121 }, (_, i) => {
    const s = -1 + (3 * i) / 120;
    return `${i ? 'L' : 'M'}${X(s)},${Y(lossAt(s))}`;
  }).join(' ');
  return (
    <>
      <figure>
        <Plot
          id={id}
          fr={fr}
          residual
          description={
            fr
              ? 'Les observations restent fixes. La droite continue est le modèle ; le losange est le point moyen.'
              : 'Observations stay fixed. The solid line is the model; the diamond is the mean point.'
          }
        >
          {(x, y) => (
            <>
              <path
                className="geo-line"
                d={`M${x(-0.5)},${y(p - 0.5 * m)}L${x(3.5)},${y(p + 3.5 * m)}`}
              />
              {observations.map((point, i) => (
                <g key={i}>
                  <path
                    className="geo-dashed"
                    d={`M${x(point.x)},${y(point.y)}V${y(m * point.x + p)}`}
                  />
                  <circle
                    className="geo-point"
                    cx={x(point.x)}
                    cy={y(point.y)}
                    r="6"
                  />
                </g>
              ))}
              <path
                className="geo-prediction"
                d={`M${x(sums.meanX)},${y(sums.meanY) - 8}l8,8 -8,8 -8,-8Z`}
              />
              <text x={x(sums.meanX) + 12} y={y(sums.meanY) + 20}>
                G
              </text>
            </>
          )}
        </Plot>
        <figcaption>
          {fr
            ? 'G = (1 ; 5/3). Les tirets indiquent les résidus verticaux.'
            : 'G = (1 ; 5/3). Dashed segments indicate vertical residuals.'}
        </figcaption>
      </figure>
      <figure>
        <svg
          viewBox="0 0 440 310"
          role="img"
          aria-labelledby={`${id}-loss-title`}
        >
          <title id={`${id}-loss-title`}>
            {fr
              ? 'Perte quadratique des droites passant par G, minimum en m = 0,5'
              : 'Squared loss of lines through G, minimum at m = 0.5'}
          </title>
          <g className="geo-grid">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <path key={n} d={`M45,${Y(n)}H395`} />
            ))}
          </g>
          <path className="geo-axes" d="M45,30V260H410" />
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <text key={n} x="34" y={Y(n) + 6} textAnchor="end">
              {n}
            </text>
          ))}
          {[-1, 0, 0.5, 1, 2].map((n) => (
            <text key={n} x={X(n)} y="285" textAnchor="middle">
              {f(n)}
            </text>
          ))}
          <text x="15" y="25">S</text>
          <text x="414" y="257">m</text>
          <path className="geo-line" d={curve} />
          <path
            className="geo-dashed"
            d={`M${X(bestM)},40V260`}
          />
          <circle
            className="geo-point"
            cx={X(bestM)}
            cy={Y(bestLoss)}
            r="6"
          />
          {anchored && (
            <rect
              className="geo-prediction"
              x={X(m) - 5}
              y={Y(r.loss) - 5}
              width="10"
              height="10"
            />
          )}
        </svg>
        <figcaption>
          {fr
            ? 'Courbe de S lorsque p = ȳ − mx̄. Le disque marque le minimum ; le carré marque votre pente en mode ancré.'
            : 'Curve of S when p = ȳ − mx̄. The disk marks the minimum; the square marks your slope in anchored mode.'}
        </figcaption>
      </figure>
      <div className="geo-results" aria-live="polite" aria-atomic="true">
        <p data-regression-parameters>
          m = {f(m)} ; p ≈ {f(p)}.
        </p>
        <p data-regression-mean>
          ŷ(1) ≈ {f(m + p)} ; ȳ ≈ {f(sums.meanY)}.{' '}
          {Math.abs(m + p - sums.meanY) < 1e-10
            ? fr
              ? 'La droite passe par G.'
              : 'The line passes through G.'
            : fr
              ? 'La droite ne passe pas par G.'
              : 'The line does not pass through G.'}
        </p>
        <p data-regression-loss>
          Σe ≈ {f(r.sum)} ; S ≈ {f(r.loss)} ; S min ≈ {f(bestLoss)}.
        </p>
        <p data-regression-gap>
          {fr ? 'Écart au minimum' : 'Gap to minimum'} ≈{' '}
          {f(Math.max(0, r.loss - bestLoss))}.
        </p>
        <p>
          {fr
            ? 'Le minimum exact est S = 1/6, atteint pour m = 1/2 et p = 7/6.'
            : 'The exact minimum is S = 1/6, attained at m = 1/2 and p = 7/6.'}
        </p>
      </div>
    </>
  );
}

export default function RegressionExplorer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [m, setM] = useState(1);
  const [p, setP] = useState(1);
  const [anchored, setAnchored] = useState(false);
  useEffect(() => setReady(true), []);
  const activeP = anchored ? intercept(m) : p;
  return (
    <section
      className="geo-lab"
      data-regression-explorer
      aria-label={fr ? 'Explorer la droite de régression' : 'Explore regression'}
    >
      <p className="geo-title">
        {fr ? 'Trouver la perte minimale' : 'Find the minimum loss'}
      </p>
      <div className="geo-live">
        <div className="geo-visual">
          <View m={m} p={activeP} anchored={anchored} fr={fr} id={id} />
          <p hidden={ready} data-static-note>
            {fr ? 'Exemple fixe sans JavaScript.' : 'Fixed example without JavaScript.'}
          </p>
        </div>
        <fieldset hidden={!ready}>
          <legend>{fr ? 'Ajuster la droite' : 'Adjust the line'}</legend>
          <NumberControl
            label="m"
            value={m}
            min={-1}
            max={2}
            step={0.25}
            onChange={setM}
            fr={fr}
          />
          {!anchored && (
            <NumberControl
              label="p"
              value={p}
              min={-1}
              max={3}
              step="any"
              onChange={setP}
              fr={fr}
            />
          )}
          <label>
            <input
              type="checkbox"
              checked={anchored}
              onChange={(event) => {
                setP(activeP);
                setAnchored(event.currentTarget.checked);
              }}
            />{' '}
            {fr ? 'Ancrer la droite en G' : 'Anchor the line at G'}
          </label>
          <button type="button" onClick={() => setAnchored(true)}>
            {fr ? 'Choisir le meilleur p à cette pente' : 'Choose best p at this slope'}
          </button>
          <button
            type="button"
            onClick={() => {
              setM(bestM);
              setP(bestP);
              setAnchored(true);
            }}
          >
            {fr ? 'Afficher la droite optimale' : 'Show the optimal line'}
          </button>
          <button
            type="button"
            onClick={() => {
              setM(1);
              setP(1);
              setAnchored(false);
            }}
          >
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
          <p>
            {fr
              ? 'Comparez la perte avant et après ancrage, puis changez m. Le point moyen ne suffit pas à déterminer la pente.'
              : 'Compare loss before and after anchoring, then change m. The mean point alone does not determine slope.'}
          </p>
        </fieldset>
      </div>
      <div className="geo-print">
        <p>{fr ? 'Exemple fixe : droite optimale' : 'Fixed example: optimal line'}</p>
        <View
          m={bestM}
          p={bestP}
          anchored
          fr={fr}
          id={`${id}-print`}
        />
      </div>
    </section>
  );
}
