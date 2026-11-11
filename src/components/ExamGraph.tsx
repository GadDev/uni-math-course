import { useId } from 'react';

export default function ExamGraph({
  kind,
  locale,
}: {
  kind: 'values' | 'tangent' | 'line';
  locale: 'fr' | 'en';
}) {
  const id = useId();
  const descriptions = {
    values: {
      fr: 'Courbe passant par (0, 3), (1, 0), (2, −1), (3, 0) et (4, 3). Son unique minimum est (2, −1).',
      en: 'Curve through (0, 3), (1, 0), (2, −1), (3, 0) and (4, 3). Its unique minimum is (2, −1).',
    },
    tangent: {
      fr: 'Courbe passant par (1, 2). Sa tangente en ce point passe par (0, 4) et (2, 0). La tangente est en pointillés.',
      en: 'Curve through (1, 2). Its tangent there passes through (0, 4) and (2, 0). The tangent is dashed.',
    },
    line: {
      fr: 'Droite passant par (0, 2), (2, 1) et (4, 0).',
      en: 'Straight line through (0, 2), (2, 1) and (4, 0).',
    },
  };
  const px = (x: number) => 55 + 80 * x;
  const py = (y: number) => 220 - 36 * y;
  const curve = Array.from({ length: 81 }, (_, i) => {
    const x = i / 20;
    const y = kind === 'values' ? (x - 2) ** 2 - 1 : (x - 2) ** 2 + 1;
    return `${i === 0 ? 'M' : 'L'}${px(x)},${py(y)}`;
  }).join(' ');
  const points =
    kind === 'values'
      ? [
          [0, 3],
          [1, 0],
          [2, -1],
          [3, 0],
          [4, 3],
        ]
      : kind === 'line'
        ? [
            [0, 2],
            [2, 1],
            [4, 0],
          ]
        : [
            [0, 4],
            [1, 2],
            [2, 0],
          ];
  return (
    <figure className="exam-graph">
      <svg
        viewBox="0 0 440 300"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>
          {locale === 'fr' ? 'Graphique de la question' : 'Question graph'}
        </title>
        <desc id={`${id}-desc`}>{descriptions[kind][locale]}</desc>
        {[-1, 0, 1, 2, 3, 4, 5].map((y) => (
          <g key={y}>
            <path d={`M40 ${py(y)}H390`} className="exam-grid" />
            <text x="30" y={py(y) + 5} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((x) => (
          <g key={x}>
            <path d={`M${px(x)} 30V265`} className="exam-grid" />
            <text x={px(x)} y="287" textAnchor="middle">
              {x}
            </text>
          </g>
        ))}
        <path d={`M40 ${py(0)}H405M${px(0)} 270V20`} className="exam-axis" />
        <text x="412" y={py(0) + 5}>
          x
        </text>
        <text x={px(0) - 5} y="15">
          y
        </text>
        {kind === 'line' ? (
          <path
            d={`M${px(0)} ${py(2)}L${px(4)} ${py(0)}`}
            className="exam-curve"
          />
        ) : (
          <path d={curve} className="exam-curve" />
        )}
        {kind === 'tangent' && (
          <path
            d={`M${px(0)} ${py(4)}L${px(2.5)} ${py(-1)}`}
            className="exam-tangent"
          />
        )}
        {points.map(([x, y], i) => (
          <circle key={i} cx={px(x!)} cy={py(y!)} r="4" fill="currentColor" />
        ))}
      </svg>
      <figcaption>
        {locale === 'fr'
          ? 'Chaque graduation vaut une unité.'
          : 'Each tick represents one unit.'}
      </figcaption>
    </figure>
  );
}
