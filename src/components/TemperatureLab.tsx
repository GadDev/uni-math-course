import { useEffect, useState } from 'react';
import type { Locale } from '../lib/i18n';
import '../styles/geometry-labs.css';

const x = (c: number) => 52 + ((c + 40) / 140) * 300;
const y = (f: number) => 254 - ((f + 40) / 260) * 220;

export default function TemperatureLab({
  locale,
  interactive = false,
}: {
  locale: Locale;
  interactive?: boolean;
}) {
  const fr = locale === 'fr';
  const [c, setC] = useState(20);
  const [inverse, setInverse] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const f = 1.8 * c + 32;
  const fmt = (n: number) =>
    new Intl.NumberFormat(fr ? 'fr-FR' : 'en-GB', {
      maximumFractionDigits: 2,
    }).format(n);
  const plot = (showPoint: boolean) => (
    <figure>
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label={
          fr
            ? 'Conversion : A (0; 32), B (100; 212), variation horizontale 100, verticale 180.'
            : 'Conversion: A (0; 32), B (100; 212), horizontal change 100, vertical change 180.'
        }
      >
        <path className="geo-axes" d={`M52,${y(0)}H370 M${x(0)},20V254`} />
        <path
          className="geo-line"
          d={`M${x(-40)},${y(-40)}L${x(100)},${y(212)}`}
        />
        <path
          className="geo-dashed"
          d={`M${x(0)},${y(32)}H${x(100)}V${y(212)}`}
        />
        <circle className="geo-point" cx={x(0)} cy={y(32)} r="5" />
        <circle className="geo-point" cx={x(100)} cy={y(212)} r="5" />
        <g style={{ fontSize: '14px' }}>
          <text x={x(0) - 8} y={y(32) - 10} textAnchor="end">
            A (0; 32)
          </text>
          <text x={x(100)} y={y(212) - 10} textAnchor="end">
            B (100; 212)
          </text>
          <text x={x(50)} y={y(32) + 22} textAnchor="middle">
            ΔC = 100
          </text>
          <text x={x(100) - 8} y={y(122)} textAnchor="end">
            ΔF = 180
          </text>
          <text x="365" y={y(0) + 25} textAnchor="end">
            C (°C)
          </text>
          <text x={x(0) + 8} y="22">
            F (°F)
          </text>
        </g>
        {showPoint && (
          <g>
            <path
              className="geo-dashed"
              d={`M${x(c)},${y(0)}V${y(f)}H${x(0)}`}
            />
            <rect
              className="geo-prediction"
              x={x(c) - 4}
              y={y(f) - 4}
              width="8"
              height="8"
            />
          </g>
        )}
      </svg>
      <figcaption>
        {fr
          ? 'A : départ à 32 °F. B : arrivée à 212 °F. Le triangle indique les deux variations.'
          : 'A: start at 32 °F. B: reach 212 °F. The triangle shows both changes.'}
      </figcaption>
    </figure>
  );
  return (
    <section
      className="geo-lab"
      data-temperature-lab={interactive ? 'interactive' : 'static'}
      aria-label="Conversion"
    >
      {plot(interactive)}
      {interactive && (
        <>
          <p role="status">
            C = {fmt(c)} °C ; F = {fmt(f)} °F
          </p>
          <p>
            {inverse
              ? `C = (${fmt(f)} − 32) / ${fmt(1.8)} ≈ ${fmt(c)}`
              : `F = ${fmt(1.8)} × (${fmt(c)}) + 32 ≈ ${fmt(f)}`}
          </p>
          <fieldset hidden={!ready}>
            <legend>
              {fr ? 'Sens de conversion' : 'Conversion direction'}
            </legend>
            <button
              type="button"
              aria-pressed={!inverse}
              onClick={() => setInverse(false)}
            >
              °C → °F
            </button>
            <button
              type="button"
              aria-pressed={inverse}
              onClick={() => setInverse(true)}
            >
              °F → °C
            </button>
            <label>
              {inverse ? 'F (°F)' : 'C (°C)'}
              <input
                type="range"
                min={-40}
                max={inverse ? 212 : 100}
                step={inverse ? 0.2 : 1}
                value={inverse ? f : c}
                aria-valuetext={`${fmt(inverse ? f : c)} ${inverse ? '°F' : '°C'}`}
                onChange={(event) => {
                  const value = Number(event.currentTarget.value);
                  setC(inverse ? (value - 32) / 1.8 : value);
                }}
              />
            </label>
            <button type="button" onClick={() => setC(0)}>
              0 °C
            </button>
            <button type="button" onClick={() => setC(20)}>
              20 °C
            </button>
            <button type="button" onClick={() => setC(100)}>
              100 °C
            </button>
          </fieldset>
        </>
      )}
    </section>
  );
}
