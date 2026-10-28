import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../lib/i18n';
import { domainX, graphX, graphY, polynomial, rational } from '../lib/l37-math';
import '../styles/l37-panels.css';

type Kind = 'mapping' | 'domain' | 'graph';
const copy = {
  fr: {
    mapping: {
      title: 'À vous : une entrée, combien de sorties ?',
      question:
        'Avant de changer le schéma : deux entrées peuvent-elles partager la même sortie ? Et une entrée avoir deux sorties ?',
      caption:
        'Les flèches représentent toutes les entrées du domaine A = {−1, 0, 1}. Les sorties dessinées ne représentent qu’une partie de ℝ.',
    },
    domain: {
      title: 'À vous : tester une entrée de r',
      question:
        'Prédisez le résultat pour x = 0, puis pour x = 1 : quelle vérification décide si le calcul est permis ?',
      caption:
        'Les cercles ouverts marquent les exclusions. La fenêtre dessinée est limitée ; le domaine continue des deux côtés.',
    },
    graph: {
      title: 'À vous : relier calcul, tableau et graphe',
      question:
        'Avant de sélectionner x = −1, prédisez f(−1). Sur quel axe le point sera-t-il situé ?',
      caption:
        'Fenêtre du graphe sur −2 ≤ x ≤ 2. Le curseur ajoute des pointillés qui relient le point aux axes. Les échelles des axes diffèrent.',
    },
  },
  en: {
    mapping: {
      title: 'Your turn: one input, how many outputs?',
      question:
        'Before changing the diagram: can two inputs share an output? Can one input have two outputs?',
      caption:
        'The arrows show every input of domain A = {−1, 0, 1}. The displayed outputs show only part of ℝ.',
    },
    domain: {
      title: 'Your turn: test an input of r',
      question:
        'Predict what happens at x = 0, then at x = 1: which check determines whether evaluation is allowed?',
      caption:
        'Open circles mark the exclusions. The drawing is a limited window; the domain continues in both directions.',
    },
    graph: {
      title: 'Your turn: connect calculation, table and graph',
      question:
        'Before selecting x = −1, predict f(−1). On which axis will the point lie?',
      caption:
        'Graph window on −2 ≤ x ≤ 2. The slider adds dashed guides connecting the point to the axes. The axes use different scales.',
    },
  },
};

function Graph({
  x,
  constant,
  locale,
}: {
  x: number;
  constant: number;
  locale: Locale;
}) {
  const y = polynomial(x) + constant - 3;
  const path = Array.from({ length: 201 }, (_, i) => {
    const input = -2 + i / 50;
    return `${i === 0 ? 'M' : 'L'}${graphX(input)},${graphY(polynomial(input) + constant - 3)}`;
  }).join(' ');
  return (
    <svg
      viewBox="0 0 430 320"
      role="img"
      aria-labelledby="l37-plot-title l37-plot-description"
      data-graph
    >
      <title id="l37-plot-title">
        {constant === 3 ? 'f' : 'F_c'}(x) = x³ + 2x + {constant}
      </title>
      <desc id="l37-plot-description">
        {locale === 'fr'
          ? 'Le point bleu suit la courbe. Ses coordonnées et le calcul sont donnés sous les commandes.'
          : 'The blue point follows the curve. Its coordinates and calculation appear below the controls.'}
      </desc>
      <rect width="430" height="320" fill="#fffdf8" />
      <g fill="#111" fontFamily="Arial, sans-serif" fontSize="20">
        <text x="20" y="25">
          {constant === 3 ? 'f' : 'F_c'}(x) = x³ + 2x + {constant}
        </text>
        <path
          d={`M35 ${graphY(0)}H400M${graphX(0)} 285V40`}
          stroke="#111"
          strokeWidth="2"
        />
        <text x="405" y={graphY(0) + 8} textAnchor="middle">
          x
        </text>
        <text x={graphX(0) + 14} y="45">
          y
        </text>
        {[-2, -1, 0, 1, 2].map((tick) => (
          <g key={tick}>
            <path
              d={`M${graphX(tick)} ${graphY(0) - 4}v8`}
              stroke="#111"
              strokeWidth="2"
            />
            <text x={graphX(tick)} y={graphY(0) + 25} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}
        {[-9, 3, 15].map((tick) => (
          <g key={tick}>
            <path
              d={`M${graphX(0) - 4} ${graphY(tick)}h8`}
              stroke="#111"
              strokeWidth="2"
            />
            <text x={graphX(0) - 10} y={graphY(tick) + 6} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        <text x="215" y="315" textAnchor="middle">
          {locale === 'fr' ? 'Entrée x → image' : 'Input x → output'}
        </text>
      </g>
      <path
        className="l37-curve"
        d={path}
        fill="none"
        stroke="#1455c0"
        strokeWidth="3"
      />
      {[-2, -1, 0, 1, 2].map((sample) => (
        <circle
          className="l37-moving"
          key={sample}
          cx={graphX(sample)}
          cy={graphY(polynomial(sample) + constant - 3)}
          r="4"
          fill="#111"
        />
      ))}
      <g
        stroke="#1455c0"
        strokeWidth="2"
        strokeDasharray="5 4"
        aria-hidden="true"
      >
        <line
          data-horizontal
          x1={graphX(0)}
          y1={graphY(y)}
          x2={graphX(x)}
          y2={graphY(y)}
        />
        <line
          data-vertical
          x1={graphX(x)}
          y1={graphY(0)}
          x2={graphX(x)}
          y2={graphY(y)}
        />
      </g>
      <circle
        className="l37-moving"
        data-moving-point
        cx={graphX(x)}
        cy={graphY(y)}
        r="7"
        stroke="#fffdf8"
        strokeWidth="2"
        fill="#1455c0"
      />
    </svg>
  );
}

export default function FunctionPanel({
  kind,
  locale,
}: {
  kind: Kind;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const text = copy[locale][kind];
  const id = `l37-${kind}`;
  const panel = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [ambiguous, setAmbiguous] = useState(false);
  const [x, setX] = useState(kind === 'domain' ? 1 : 0);
  const [constant, setConstant] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const format = (value: number) =>
    value.toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 6 });
  const name = constant === 3 ? 'f' : 'F_c';
  const y = polynomial(x) + constant - 3;
  const domain = rational(x);
  const allowed = domain.value !== null;

  useEffect(() => {
    setReady(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    motionChanged();
    media.addEventListener('change', motionChanged);
    const pauseHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pauseHidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) setPlaying(false);
    });
    if (panel.current) observer.observe(panel.current);
    return () => {
      media.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', pauseHidden);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (x >= 2) setPlaying(false);
      else setX(x + 0.25);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [playing, x, reducedMotion]);

  const selectX = (value: number) => {
    setPlaying(false);
    setX(value);
  };
  let result: string;
  let alt: string;
  let image: string;
  if (kind === 'mapping') {
    image = `l37-mapping-${ambiguous ? 'ambiguous' : 'square'}-${locale}.svg`;
    alt = ambiguous
      ? fr
        ? 'L’entrée −1 a deux flèches : vers 1 et vers 2. Ce n’est pas une fonction.'
        : 'Input −1 has two arrows: to 1 and to 2. This is not a function.'
      : fr
        ? 'Trois flèches : −1 vers 1, 0 vers 0, 1 vers 1. Une seule sortie par entrée.'
        : 'Three arrows: −1 to 1, 0 to 0, 1 to 1. One output per input.';
    result = ambiguous
      ? fr
        ? 'Pas une fonction : −1 reçoit deux sorties distinctes, 1 et 2.'
        : 'Not a function: −1 receives two distinct outputs, 1 and 2.'
      : fr
        ? 'C’est une fonction : chaque entrée a exactement une sortie. Les entrées −1 et 1 partagent l’image 1.'
        : 'This is a function: every input has exactly one output. Inputs −1 and 1 share the output 1.';
  } else if (kind === 'domain') {
    image = `l37-domain-${locale}.svg`;
    alt = fr
      ? 'Droite réelle avec des cercles ouverts en 0 et 2 : ces deux entrées sont exclues, toutes les autres sont autorisées.'
      : 'Real line with open circles at 0 and 2: these inputs are excluded; all others are allowed.';
    result =
      `x = ${format(x)} ; x − 2 = ${format(x - 2)} ; x(x − 2) = ${format(domain.denominator)} ; ` +
      (allowed
        ? fr
          ? `entrée autorisée. r(x) = ${format(domain.numerator)} / (${format(domain.denominator)}) ≈ ${format(domain.value!)}.`
          : `allowed input. r(x) = ${format(domain.numerator)} / (${format(domain.denominator)}) ≈ ${format(domain.value!)}.`
        : fr
          ? 'entrée interdite : division par zéro. r(x) n’est pas défini.'
          : 'forbidden input: division by zero. r(x) is undefined.');
  } else {
    image = `l37-polynomial-${locale}.svg`;
    alt = fr
      ? 'Courbe de f(x) = x³ + 2x + 3 passant par (−2 ; −9), (−1 ; 0), (0 ; 3), (1 ; 6) et (2 ; 15).'
      : 'Curve of f(x) = x³ + 2x + 3 through (−2; −9), (−1; 0), (0; 3), (1; 6) and (2; 15).';
    result = `${name}(${format(x)}) = (${format(x)})³ + 2 × (${format(x)}) + ${constant} = ${format(x ** 3)} + (${format(2 * x)}) + ${constant} = ${format(y)}. Point : (${format(x)} ; ${format(y)}).`;
  }
  return (
    <div
      ref={panel}
      className="l37-activity"
      data-l37-activity={kind}
      data-playing={playing}
      role="group"
      aria-labelledby={`${id}-title`}
    >
      <p id={`${id}-title`}>
        <strong>{text.title}</strong>
      </p>
      <p id={`${id}-question`}>
        {kind === 'graph' && constant !== 3
          ? fr
            ? `Pour la règle F_c avec c = ${constant}, prédisez F_c(−1), puis sélectionnez x = −1 pour vérifier.`
            : `For rule F_c with c = ${constant}, predict F_c(−1), then select x = −1 to check.`
          : text.question}
      </p>
      <figure>
        <div className="l37-plot">
          {kind === 'graph' && ready ? (
            <Graph x={x} constant={constant} locale={locale} />
          ) : (
            <img
              src={`/diagrams/functions/${image}`}
              alt={alt}
              width={kind === 'mapping' ? 440 : kind === 'domain' ? 480 : 430}
              height={kind === 'mapping' ? 240 : kind === 'domain' ? 130 : 320}
            />
          )}
          {kind === 'domain' && ready && (
            <svg
              className="l37-overlay"
              viewBox="0 0 480 130"
              aria-hidden="true"
            >
              <circle
                className="l37-moving"
                data-moving-point
                cx={domainX(x)}
                cy="85"
                r="9"
                strokeWidth="3"
                fill={allowed ? '#1455c0' : '#fffdf8'}
                stroke={allowed ? '#1455c0' : '#b92819'}
              />
            </svg>
          )}
        </div>
        <figcaption>{text.caption}</figcaption>
      </figure>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>{fr ? 'Manipuler l’exemple' : 'Explore the example'}</legend>
        {kind === 'mapping' ? (
          <>
            <label htmlFor={`${id}-select`}>
              {fr ? 'Choisir le schéma' : 'Choose the diagram'}
            </label>
            <select
              id={`${id}-select`}
              value={ambiguous ? 'ambiguous' : 'square'}
              onChange={(event) =>
                setAmbiguous(event.target.value === 'ambiguous')
              }
            >
              <option value="square">
                {fr ? 'Fonction g : x ↦ x²' : 'Function g: x ↦ x²'}
              </option>
              <option value="ambiguous">
                {fr ? 'Relation : ajouter −1 ↦ 2' : 'Relation: add −1 ↦ 2'}
              </option>
            </select>
          </>
        ) : (
          <>
            <label htmlFor={`${id}-x`}>
              {kind === 'domain'
                ? fr
                  ? 'Entrée x de r, de −1 à 3, par pas de 0,25'
                  : 'Input x of r, from −1 to 3, in steps of 0.25'
                : fr
                  ? 'Entrée x, de −2 à 2, par pas de 0,25'
                  : 'Input x, from −2 to 2, in steps of 0.25'}
            </label>
            <input
              id={`${id}-x`}
              type="range"
              min={kind === 'domain' ? -1 : -2}
              max={kind === 'domain' ? 3 : 2}
              step="0.25"
              value={x}
              aria-describedby={`${id}-question`}
              aria-valuetext={`${format(x)}, ${kind === 'graph' ? `${name}(x) = ${format(y)}` : allowed ? (fr ? 'autorisé' : 'allowed') : fr ? 'interdit' : 'forbidden'}`}
              onChange={(event) => selectX(Number(event.target.value))}
            />
            <div className="l37-actions">
              {(kind === 'domain' ? [0, 1, 2, -1] : [-1, 0, 2]).map((value) => (
                <button
                  type="button"
                  key={value}
                  data-input={value}
                  onClick={() => selectX(value)}
                >
                  {value === (kind === 'domain' ? 1 : 0)
                    ? `${fr ? 'Réinitialiser x' : 'Reset x'} : `
                    : ''}
                  x = {value}
                </button>
              ))}
              {kind === 'graph' && (
                <button
                  type="button"
                  data-play
                  aria-pressed={playing}
                  disabled={reducedMotion}
                  onClick={() => {
                    if (!playing) setX(-2);
                    setPlaying(!playing);
                  }}
                >
                  {playing
                    ? fr
                      ? 'Pause'
                      : 'Pause'
                    : fr
                      ? 'Animer le parcours'
                      : 'Animate the path'}
                </button>
              )}
            </div>
            {kind === 'graph' && (
              <>
                {reducedMotion && (
                  <p>
                    {fr
                      ? 'Mouvement réduit : utilisez le curseur ou les boutons, sans animation.'
                      : 'Reduced motion: use the slider or buttons, without animation.'}
                  </p>
                )}
                <details className="l37-theory">
                  <summary>
                    {fr
                      ? 'Explorer la règle (facultatif)'
                      : 'Explore the rule (optional)'}
                  </summary>
                  <p>
                    {fr
                      ? 'On explore F_c(x) = x³ + 2x + c. Pour c = 3, on retrouve la fonction f de la leçon. Changer c ajoute la même quantité à toutes les images ; le domaine reste ℝ.'
                      : 'Explore F_c(x) = x³ + 2x + c. At c = 3, this is the lesson’s function f. Changing c adds the same amount to every output; the domain remains ℝ.'}
                  </p>
                  <p id="l37-constant-question">
                    {fr
                      ? 'Si c passe de 3 à 4, où ira le point d’abscisse 0 ? Prédisez, puis vérifiez.'
                      : 'If c changes from 3 to 4, where will the point with input 0 move? Predict, then check.'}
                  </p>
                  <label htmlFor="l37-constant">
                    {fr ? 'Constante c, de 1 à 5' : 'Constant c, from 1 to 5'} :{' '}
                    {constant}
                  </label>
                  <input
                    id="l37-constant"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={constant}
                    aria-describedby="l37-constant-question"
                    onChange={(event) => {
                      setPlaying(false);
                      setConstant(Number(event.target.value));
                    }}
                  />
                  <button
                    type="button"
                    data-reset-rule
                    onClick={() => {
                      setPlaying(false);
                      setConstant(3);
                      setX(0);
                    }}
                  >
                    {fr
                      ? 'Retrouver f : c = 3, x = 0'
                      : 'Restore f: c = 3, x = 0'}
                  </button>
                </details>
              </>
            )}
          </>
        )}
      </fieldset>
      <output aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        {result}
      </output>
      {playing && (
        <p role="status">
          {fr
            ? 'Parcours en cours. Pause pour examiner un point.'
            : 'Path playing. Pause to inspect a point.'}
        </p>
      )}
      {kind === 'graph' && (
        <table>
          <caption>
            {fr
              ? 'Valeurs repères et sélection actuelle'
              : 'Reference values and current selection'}
            {constant !== 3 ? ` — F_c, c = ${constant}` : ''}
          </caption>
          <thead>
            <tr>
              <th scope="col">x</th>
              <th scope="col">{name}(x)</th>
            </tr>
          </thead>
          <tbody>
            {[-2, -1, 0, 1, 2].map((sample) => (
              <tr
                key={sample}
                data-sample-x={sample}
                data-active={sample === x}
              >
                <th scope="row">
                  {sample}
                  <span data-sample-marker>
                    {sample === x ? (fr ? ' ← sélection' : ' ← selected') : ''}
                  </span>
                </th>
                <td>{polynomial(sample) + constant - 3}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">
                {fr ? 'Sélection' : 'Selection'} :{' '}
                <span data-current-x>{format(x)}</span>
              </th>
              <td data-current-y>{format(y)}</td>
            </tr>
          </tbody>
        </table>
      )}
      <p data-static-note hidden={ready}>
        {fr
          ? 'Les figures et les exemples restent lisibles sans JavaScript. Activez JavaScript pour manipuler cet exemple.'
          : 'Figures and examples remain readable without JavaScript. Enable JavaScript to manipulate this example.'}
      </p>
    </div>
  );
}
