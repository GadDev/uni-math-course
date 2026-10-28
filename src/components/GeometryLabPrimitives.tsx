import { useEffect, useId, useState, type ReactNode } from 'react';

export const format = (n: number, fr: boolean) =>
  (Math.abs(n) < 1e-12 ? 0 : n).toLocaleString(fr ? 'fr-FR' : 'en-US', {
    maximumFractionDigits: 4,
  });
export function NumberControl({
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
export function Plot({
  id,
  fr,
  pixel = false,
  residual = false,
  centered = false,
  children,
  description,
}: {
  id: string;
  fr: boolean;
  pixel?: boolean;
  residual?: boolean;
  centered?: boolean;
  children: (X: (n: number) => number, Y: (n: number) => number) => ReactNode;
  description: string;
}) {
  const min = pixel ? -1 : residual ? -0.5 : centered ? -5 : -4,
    max = pixel ? 13 : residual ? 3.5 : centered ? 5 : 8;
  const X = (x: number) => 40 + ((x - min) * 360) / (max - min),
    Y = (y: number) => 380 - ((y - min) * 360) / (max - min);
  const ticks = pixel
    ? [0, 4, 8, 12]
    : residual
      ? [0, 1, 2, 3]
      : centered
        ? [-4, -2, 0, 2, 4]
        : [-4, 0, 4, 8];
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
