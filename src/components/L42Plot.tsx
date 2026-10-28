import { useId } from 'react';
import { formatNumber } from '../lib/l42-math';

export type Point = [number, number];
export type Series = {
  name: string;
  points: Point[];
  color: string;
  dash?: string;
};

/** Small bounded SVG plot; axes and tabular alternatives stay server rendered. */
export default function L42Plot({
  title,
  description,
  xLabel,
  yLabel,
  xRange,
  yRange,
  series,
  markers = [],
  locale,
  yTickLabel,
  xTicks,
  yTicks,
}: {
  title: string;
  description: string;
  xLabel: string;
  yLabel: string;
  xRange: Point;
  yRange: Point;
  series: Series[];
  markers?: { point: Point; label: string }[];
  locale: 'fr' | 'en';
  yTickLabel?: (y: number) => string;
  xTicks?: number[];
  yTicks?: number[];
}) {
  const id = useId();
  const X = (x: number) =>
    78 + ((x - xRange[0]) / (xRange[1] - xRange[0])) * 344;
  const Y = (y: number) =>
    252 - ((y - yRange[0]) / (yRange[1] - yRange[0])) * 212;
  const ticks = (range: Point) => [
    range[0],
    (range[0] + range[1]) / 2,
    range[1],
  ];
  const axisNumber = (value: number) =>
    value.toLocaleString(
      locale === 'fr' ? 'fr-FR' : 'en-US',
      Math.abs(value) >= 1000 || (value !== 0 && Math.abs(value) < 0.001)
        ? { notation: 'scientific', maximumFractionDigits: 1 }
        : { maximumFractionDigits: 2 },
    );
  return (
    <figure className="l42-figure">
      <svg
        viewBox="0 0 480 320"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{description}</desc>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x="77" y="39" width="346" height="214" />
          </clipPath>
        </defs>
        <rect width="480" height="320" fill="#fffdf8" />
        <g fill="#161616" fontFamily="Arial, sans-serif" fontSize="17">
          <text x="12" y="24">
            {yLabel}
          </text>
          {(yTicks ?? ticks(yRange)).map((tick) => (
            <g key={tick}>
              <path d={`M78 ${Y(tick)}H422`} stroke="#c9c5bb" />
              <text x="69" y={Y(tick) + 6} textAnchor="end" fontSize="15">
                {yTickLabel ? yTickLabel(tick) : axisNumber(tick)}
              </text>
            </g>
          ))}
          {(xTicks ?? ticks(xRange)).map((tick) => (
            <g key={tick}>
              <path d={`M${X(tick)} 40V258`} stroke="#c9c5bb" />
              <text x={X(tick)} y="278" textAnchor="middle">
                {formatNumber(tick, locale)}
              </text>
            </g>
          ))}
          <path
            d="M78 40V252H422"
            fill="none"
            stroke="#161616"
            strokeWidth="2"
          />
          {yRange[0] < 0 && yRange[1] > 0 && (
            <path d={`M78 ${Y(0)}H422`} stroke="#555" />
          )}
          {xRange[0] < 0 && xRange[1] > 0 && (
            <path d={`M${X(0)} 40V252`} stroke="#555" />
          )}
          <text x="250" y="309" textAnchor="middle">
            {xLabel}
          </text>
        </g>
        <g clipPath={`url(#${id}-clip)`}>
          {series.map((line) => (
            <path
              key={line.name}
              data-series={line.name}
              d={line.points
                .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
                .map(
                  ([x, y], i) =>
                    `${i ? 'L' : 'M'}${X(x).toFixed(3)},${Y(y).toFixed(3)}`,
                )
                .join(' ')}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeDasharray={line.dash}
            />
          ))}
        </g>
        {markers.map(({ point: [x, y], label }) => (
          <g key={label}>
            <circle
              data-point={label}
              cx={X(x)}
              cy={Y(y)}
              r="6"
              fill="#111"
              stroke="#fffdf8"
              strokeWidth="2"
            />
            <text
              x={X(x) + 8}
              y={Math.max(54, Y(y) - 10)}
              fontSize="17"
              fill="#111"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{description}</figcaption>
      <ul
        className="l42-legend"
        aria-label={locale === 'fr' ? 'Légende' : 'Legend'}
      >
        {series.map((line) => (
          <li key={line.name}>
            <svg width="32" height="12" aria-hidden="true">
              <path
                d="M0 6H32"
                stroke={line.color}
                strokeWidth="3"
                strokeDasharray={line.dash}
              />
            </svg>
            {line.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}
