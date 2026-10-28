import { useEffect, useRef, useState } from 'react';
import L42Plot, { type Point, type Series } from './L42Plot';
import {
  HALVING_MAX,
  cost,
  costFamilies,
  derivative,
  formatNumber,
  functionValue,
  halvingTrace,
  logBase,
  secantSlope,
  type CostId,
  type FunctionId,
} from '../lib/l42-math';
import '../styles/l42-explorers.css';

type Locale = 'fr' | 'en';
type Props = { locale: Locale };

function useLab(tick: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(tick);
  callback.current = tick;
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setReady(true);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener('change', update);
    const hidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', hidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) setPlaying(false);
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', hidden);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => callback.current(), 850);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);
  return { ref, ready, reduced, playing, setPlaying };
}

function StaticNote({ ready, locale }: { ready: boolean; locale: Locale }) {
  return (
    <p className="l42-static-note" hidden={ready}>
      {locale === 'fr'
        ? 'Exemple de référence : le graphique et les calculs restent lisibles sans JavaScript. Les commandes deviennent disponibles avec JavaScript.'
        : 'Reference example: the graph and calculations remain readable without JavaScript. Controls become available with JavaScript.'}
    </p>
  );
}

export function HalvingExplorer({ locale }: Props) {
  const fr = locale === 'fr';
  const [input, setInput] = useState('64');
  const [step, setStep] = useState(0);
  const trace = halvingTrace(input.trim() ? Number(input) : NaN);
  const valid = trace.length > 0;
  const last = trace.length - 1;
  const current = Math.min(step, Math.max(0, last));
  const lab = useLab(() => {
    if (current >= last - 1) lab.setPlaying(false);
    setStep((s) => Math.min(s + 1, last));
  });
  const change = (value: string) => {
    lab.setPlaying(false);
    setInput(value);
    setStep(0);
  };
  const f = (n: number) => formatNumber(n, locale);
  return (
    <div ref={lab.ref} className="l42-lab" data-l42="halving">
      <p className="l42-objective">
        <strong>{fr ? 'Objectif : ' : 'Goal: '}</strong>
        {fr
          ? 'Relier chaque exécution du corps de la boucle à une ligne du tableau et compter les divisions.'
          : 'Connect each loop-body execution to a table row and count the divisions.'}
      </p>
      <p id="l42-half-question">
        {fr
          ? 'Prédisez : 63, 64 et 65 demandent-ils le même nombre de divisions ?'
          : 'Predict: do 63, 64 and 65 require the same number of divisions?'}
      </p>
      <fieldset hidden={!lab.ready} className="l42-controls">
        <legend>{fr ? 'Piloter la boucle' : 'Control the loop'}</legend>
        <label htmlFor="l42-half-n">
          {fr
            ? 'Entier initial n (1 à 1 048 576)'
            : 'Initial integer n (1 to 1,048,576)'}
        </label>
        <input
          id="l42-half-n"
          type="number"
          min="1"
          max={HALVING_MAX}
          step="1"
          value={input}
          aria-invalid={!valid}
          aria-describedby="l42-half-question l42-half-result"
          onChange={(e) => change(e.target.value)}
        />
        <div className="l42-actions">
          {[1, 63, 64, 65].map((n) => (
            <button type="button" key={n} onClick={() => change(String(n))}>
              n = {n}
            </button>
          ))}
        </div>
        <div className="l42-actions">
          <button
            type="button"
            data-step
            disabled={!valid || current >= last}
            onClick={() => {
              lab.setPlaying(false);
              setStep(current + 1);
            }}
          >
            {fr ? 'Étape suivante' : 'Next step'}
          </button>
          <button
            type="button"
            data-play
            disabled={!valid || current >= last || lab.reduced}
            aria-pressed={lab.playing}
            onClick={() => lab.setPlaying(!lab.playing)}
          >
            {lab.playing ? 'Pause' : fr ? 'Lire la boucle' : 'Play loop'}
          </button>
          <button type="button" data-reset onClick={() => change('64')}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
        {lab.reduced && (
          <p>
            {fr
              ? 'Mouvement réduit : avancez avec « Étape suivante ».'
              : 'Reduced motion: use “Next step”.'}
          </p>
        )}
      </fieldset>
      <output
        id="l42-half-result"
        aria-live={lab.playing ? 'off' : 'polite'}
        aria-atomic="true"
      >
        {valid
          ? fr
            ? `Après ${current} division(s), m = ${f(trace[current]!)}. Total pour cette entrée : ${last} = ⌊log₂(${input})⌋. ${current === last ? 'La condition m > 1 est fausse : arrêt.' : 'La condition m > 1 est vraie.'}`
            : `After ${current} division(s), m = ${f(trace[current]!)}. Total for this input: ${last} = ⌊log₂(${input})⌋. ${current === last ? 'Condition m > 1 is false: stop.' : 'Condition m > 1 is true.'}`
          : fr
            ? 'Saisissez un entier de 1 à 1 048 576 ; aucune boucle n’est exécutée pour une entrée invalide.'
            : 'Enter an integer from 1 to 1,048,576; no loop runs for an invalid input.'}
      </output>
      {valid && (
        <>
          <L42Plot
            locale={locale}
            title={fr ? 'Trace de la boucle' : 'Loop trace'}
            description={
              fr
                ? 'Les points entiers suivent les divisions arrondies vers le bas. Les segments guident la lecture ; la boucle ne parcourt pas leurs valeurs intermédiaires.'
                : 'Integer points follow floor-rounded divisions. Segments guide reading; the loop does not visit intermediate values.'
            }
            xLabel={fr ? 'Nombre de divisions k' : 'Number of divisions k'}
            yLabel={fr ? 'Valeur restante m' : 'Remaining value m'}
            xRange={[0, Math.max(1, last)]}
            yRange={[0, trace[0]!]}
            series={[
              {
                name: fr ? 'Trace complète' : 'Complete trace',
                color: '#777',
                dash: '4 4',
                points: trace.map((n, i) => [i, n]),
              },
              {
                name: fr ? 'Étapes exécutées' : 'Executed steps',
                color: '#174ea6',
                points: trace.slice(0, current + 1).map((n, i) => [i, n]),
              },
            ]}
            markers={[{ point: [current, trace[current]!], label: 'M' }]}
          />
          <table>
            <caption>
              {fr
                ? 'Trace complète ; la flèche indique la position actuelle'
                : 'Complete trace; the arrow marks the current position'}
            </caption>
            <thead>
              <tr>
                <th scope="col">k</th>
                <th scope="col">m</th>
                <th scope="col">{fr ? 'Calcul effectué' : 'Calculation'}</th>
              </tr>
            </thead>
            <tbody>
              {trace.map((n, i) => (
                <tr key={i} data-active={i === current}>
                  <th scope="row">
                    {i}
                    {i === current ? ' ←' : ''}
                  </th>
                  <td>{f(n)}</td>
                  <td>
                    {i
                      ? `⌊${trace[i - 1]}/2⌋ = ${n}`
                      : fr
                        ? 'Valeur initiale'
                        : 'Initial value'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <StaticNote ready={lab.ready} locale={locale} />
    </div>
  );
}

export function LogExplorer({ locale }: Props) {
  const fr = locale === 'fr';
  const [a, setA] = useState('2');
  const [x, setX] = useState('8');
  const lab = useLab(() => {});
  const base = a.trim() ? Number(a) : NaN;
  const input = x.trim() ? Number(x) : NaN;
  const y = logBase(base, input);
  const valid =
    y !== null && base >= 0.1 && base <= 10 && input >= 0.1 && input <= 16;
  const f = (n: number) => formatNumber(n, locale);
  const reset = () => {
    setA('2');
    setX('8');
  };
  const curve: Point[] = valid
    ? Array.from({ length: 161 }, (_, i) => {
        const t = 0.1 + (15.9 * i) / 160;
        return [t, logBase(base, t)!];
      })
    : [];
  const ys = curve.map((p) => p[1]);
  const min = Math.floor(Math.min(-1, ...ys));
  const max = Math.ceil(Math.max(1, ...ys));
  return (
    <div ref={lab.ref} className="l42-lab" data-l42="log">
      <p className="l42-objective">
        <strong>{fr ? 'Objectif : ' : 'Goal: '}</strong>
        {fr
          ? 'Passer d’une puissance au logarithme et lire la même relation sur la courbe.'
          : 'Move from a power to a logarithm and read the same relation on the curve.'}
      </p>
      <p id="l42-log-question">
        {fr
          ? 'Prédisez : avec a = 0,5 et x = 8, le logarithme est-il positif ou négatif ?'
          : 'Predict: for a = 0.5 and x = 8, is the logarithm positive or negative?'}
      </p>
      <fieldset hidden={!lab.ready} className="l42-controls">
        <legend>
          {fr ? 'Choisir la base et l’entrée' : 'Choose base and input'}
        </legend>
        <label htmlFor="l42-log-a">
          {fr ? 'Base a (0,1 à 10, sauf 1)' : 'Base a (0.1 to 10, except 1)'}
        </label>
        <input
          id="l42-log-a"
          type="number"
          min="0.1"
          max="10"
          step="any"
          value={a}
          aria-invalid={
            !Number.isFinite(base) || base < 0.1 || base > 10 || base === 1
          }
          aria-describedby="l42-log-result"
          onChange={(e) => setA(e.target.value)}
        />
        <label htmlFor="l42-log-x">
          {fr ? 'Entrée x (0,1 à 16)' : 'Input x (0.1 to 16)'}
        </label>
        <input
          id="l42-log-x"
          type="number"
          min="0.1"
          max="16"
          step="any"
          value={x}
          aria-invalid={!Number.isFinite(input) || input < 0.1 || input > 16}
          aria-describedby="l42-log-result l42-log-question"
          onChange={(e) => setX(e.target.value)}
        />
        <div className="l42-actions">
          <button
            type="button"
            onClick={() => {
              setA('0.5');
              setX('8');
            }}
          >
            a = {f(0.5)} ; x = 8
          </button>
          <button type="button" data-reset onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <output id="l42-log-result" aria-live="polite" aria-atomic="true">
        {valid
          ? `y = logₐ(x) = ln(${f(input)}) / ln(${f(base)}) ≈ ${f(Math.log(input))} / ${f(Math.log(base))} ≈ ${f(y)}. (${f(base)})^(${f(y)}) ≈ ${f(input)}. ${fr ? (base > 1 ? 'Courbe croissante.' : 'Courbe décroissante.') : base > 1 ? 'Increasing curve.' : 'Decreasing curve.'}`
          : fr
            ? 'Entrée invalide : il faut 0,1 ≤ a ≤ 10, a ≠ 1 et 0,1 ≤ x ≤ 16 dans cet outil. Le logarithme réel exige a > 0, a ≠ 1 et x > 0.'
            : 'Invalid input: this tool requires 0.1 ≤ a ≤ 10, a ≠ 1 and 0.1 ≤ x ≤ 16. A real logarithm requires a > 0, a ≠ 1 and x > 0.'}
      </output>
      {valid && (
        <>
          <p>
            {fr
              ? 'Coordonnées du point sélectionné'
              : 'Selected point coordinates'}{' '}
            : P ≈ ({f(input)} ; {f(y)}).
          </p>
          <L42Plot
            locale={locale}
            title={`y = logₐ(x), a = ${f(base)}`}
            description={
              fr
                ? 'Fenêtre 0,1 ≤ x ≤ 16 ; l’axe vertical s’adapte à la base. La courbe passe toujours par (1 ; 0). Les bornes de l’outil ne limitent pas le domaine mathématique.'
                : 'Window 0.1 ≤ x ≤ 16; the vertical scale adapts to the base. Every curve passes through (1, 0). Tool bounds do not limit the mathematical domain.'
            }
            xLabel="x"
            yLabel="y = logₐ(x)"
            xRange={[0, 16]}
            yRange={[min, max]}
            series={[
              {
                name: `logₐ(x), a = ${f(base)}`,
                color: '#174ea6',
                points: curve,
              },
            ]}
            markers={[{ point: [input, y], label: 'P' }]}
          />
          <table>
            <caption>
              {fr
                ? 'Valeurs repères et sélection'
                : 'Reference values and selection'}
            </caption>
            <thead>
              <tr>
                <th scope="col">x</th>
                <th scope="col">logₐ(x) ≈</th>
              </tr>
            </thead>
            <tbody>
              {[1, base, input].map((v, i) => (
                <tr key={i}>
                  <th scope="row">
                    {f(v)}
                    {i === 2 ? ' ← P' : ''}
                  </th>
                  <td>{f(logBase(base, v)!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <StaticNote ready={lab.ready} locale={locale} />
    </div>
  );
}

export function ComplexityExplorer({ locale }: Props) {
  const fr = locale === 'fr';
  const [n, setN] = useState(8);
  const defaults: CostId[] = [
    'constant',
    'log',
    'linear',
    'nlog',
    'square',
    'exp',
  ];
  const [selected, setSelected] = useState<CostId[]>(defaults);
  const [logScale, setLogScale] = useState(true);
  const lab = useLab(() => {
    if (n >= 63) lab.setPlaying(false);
    setN((v) => Math.min(64, v + 1));
  });
  const f = (v: number) => formatNumber(v, locale);
  const maxN = Math.max(2, n);
  const families = costFamilies.filter((family) =>
    selected.includes(family.id),
  );
  const maxValue = Math.max(
    1,
    ...families.map((family) => cost(family.id, maxN)),
  );
  const yMax = logScale
    ? Math.max(1, Math.ceil(Math.log10(maxValue)))
    : maxValue;
  const series: Series[] = families.map((family) => ({
    name: family.label,
    color: family.color,
    dash: family.dash,
    points: Array.from({ length: maxN }, (_, i): Point => [
      i + 1,
      cost(family.id, i + 1),
    ])
      .filter(([, v]) => !logScale || v > 0)
      .map(([x, v]) => [x, logScale ? Math.log10(v) : v]),
  }));
  return (
    <div ref={lab.ref} className="l42-lab" data-l42="complexity">
      <p className="l42-objective">
        <strong>{fr ? 'Objectif : ' : 'Goal: '}</strong>
        {fr
          ? 'Comparer des modèles de coût pour une même taille d’entrée, sans confondre valeur et ordre de croissance.'
          : 'Compare cost models at the same input size without confusing values and growth rates.'}
      </p>
      <p id="l42-cost-question">
        {fr
          ? 'Prédisez : à n = 8, n² ou 2ⁿ est-il le plus grand ? Et à n = 4 ?'
          : 'Predict: at n = 8, is n² or 2ⁿ larger? What about n = 4?'}
      </p>
      <fieldset hidden={!lab.ready} className="l42-controls">
        <legend>{fr ? 'Comparer les coûts' : 'Compare costs'}</legend>
        <label htmlFor="l42-cost-n">
          {fr ? 'Taille de l’entrée n' : 'Input size n'} : {n}
        </label>
        <input
          id="l42-cost-n"
          type="range"
          min="1"
          max="64"
          step="1"
          value={n}
          aria-valuetext={`n = ${n}`}
          aria-describedby="l42-cost-question"
          onChange={(e) => {
            lab.setPlaying(false);
            setN(Number(e.target.value));
          }}
        />
        <div className="l42-options">
          {costFamilies.map((family) => (
            <label key={family.id}>
              <input
                type="checkbox"
                checked={selected.includes(family.id)}
                onChange={() => {
                  lab.setPlaying(false);
                  setSelected((ids) =>
                    ids.includes(family.id)
                      ? ids.filter((id) => id !== family.id)
                      : [...ids, family.id],
                  );
                }}
              />{' '}
              {family.label}
            </label>
          ))}
        </div>
        <label htmlFor="l42-cost-scale">
          {fr ? 'Échelle verticale' : 'Vertical scale'}
        </label>
        <select
          id="l42-cost-scale"
          value={logScale ? 'log' : 'linear'}
          onChange={(e) => {
            lab.setPlaying(false);
            setLogScale(e.target.value === 'log');
          }}
        >
          <option value="log">
            {fr ? 'Logarithmique (base 10)' : 'Logarithmic (base 10)'}
          </option>
          <option value="linear">{fr ? 'Linéaire' : 'Linear'}</option>
        </select>
        <div className="l42-actions">
          <button
            type="button"
            data-play
            aria-pressed={lab.playing}
            disabled={lab.reduced || n >= 64}
            onClick={() => lab.setPlaying(!lab.playing)}
          >
            {lab.playing ? 'Pause' : fr ? 'Animer n' : 'Animate n'}
          </button>
          <button
            type="button"
            data-reset
            onClick={() => {
              lab.setPlaying(false);
              setN(8);
              setSelected(defaults);
              setLogScale(true);
            }}
          >
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
        {lab.reduced && (
          <p>
            {fr
              ? 'Mouvement réduit : utilisez le curseur.'
              : 'Reduced motion: use the slider.'}
          </p>
        )}
      </fieldset>
      <output aria-live={lab.playing ? 'off' : 'polite'} aria-atomic="true">
        n = {n}.{' '}
        {families.length
          ? families
              .map((family) => `${family.label} ≈ ${f(cost(family.id, n))}`)
              .join(' ; ')
          : fr
            ? 'Sélectionnez au moins une famille pour tracer une courbe.'
            : 'Select at least one family to plot a curve.'}
      </output>
      <p data-scale-note>
        {logScale
          ? fr
            ? 'Échelle logarithmique : des distances verticales égales représentent des facteurs égaux, pas des additions. Les valeurs nulles de log₂(1) et 1 log₂(1) sont omises du graphe, mais restent dans le tableau.'
            : 'Logarithmic scale: equal vertical distances mean equal factors, not equal additions. Zero values of log₂(1) and 1 log₂(1) are omitted from the graph but remain in the table.'
          : fr
            ? 'Échelle linéaire : des distances verticales égales représentent des écarts de coût égaux. Une croissance rapide peut écraser visuellement les autres courbes ; désélectionnez-la pour les examiner.'
            : 'Linear scale: equal vertical distances mean equal cost differences. Fast growth may visually flatten other curves; deselect it to inspect them.'}
      </p>
      <L42Plot
        locale={locale}
        title={fr ? 'Familles de complexité' : 'Complexity families'}
        description={
          fr
            ? `Fenêtre 1 ≤ n ≤ ${maxN}. Les points sont calculés pour des entiers ; les segments guident la lecture. Les axes s’adaptent à n et aux courbes sélectionnées. Ces coûts illustratifs ne sont pas des durées mesurées.`
            : `Window 1 ≤ n ≤ ${maxN}. Points are evaluated at integers; segments guide reading. Axes adapt to n and the selected curves. These illustrative costs are not measured durations.`
        }
        xLabel={fr ? 'Taille n' : 'Input size n'}
        yLabel={fr ? 'Coût illustratif' : 'Illustrative cost'}
        xRange={[1, maxN]}
        yRange={[0, yMax]}
        series={series}
        yTickLabel={
          logScale
            ? (v) =>
                (10 ** v).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                  notation: v >= 4 ? 'scientific' : 'standard',
                  maximumFractionDigits: 1,
                })
            : undefined
        }
      />
      <table>
        <caption>
          {fr
            ? `Tous les modèles à n = ${n} (≈ : valeur arrondie si nécessaire)`
            : `All models at n = ${n} (≈: rounded if needed)`}
        </caption>
        <thead>
          <tr>
            <th scope="col">{fr ? 'Modèle' : 'Model'}</th>
            <th scope="col">{fr ? 'Coût ≈' : 'Cost ≈'}</th>
          </tr>
        </thead>
        <tbody>
          {costFamilies.map((family) => (
            <tr key={family.id} data-cost={family.id}>
              <th scope="row">{family.label}</th>
              <td>{f(cost(family.id, n))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <StaticNote ready={lab.ready} locale={locale} />
    </div>
  );
}

export function TangentExplorer({ locale }: Props) {
  const fr = locale === 'fr';
  const [kind, setKind] = useState<FunctionId>('square');
  const [x, setX] = useState(1);
  const [h, setH] = useState(1);
  const lab = useLab(() => {
    setH((v) => {
      const next =
        Math.sign(v) *
        Math.max(0.001, Math.round((Math.abs(v) / 2) * 1000) / 1000);
      if (Math.abs(next) <= 0.001) lab.setPlaying(false);
      return next;
    });
  });
  const f = (v: number) => formatNumber(v, locale);
  const name = kind === 'square' ? 'x²' : kind === 'exp' ? '2ˣ' : 'log₂(x)';
  const y = functionValue(kind, x);
  const slope = derivative(kind, x);
  const secant = secantSlope(kind, x, h);
  const xmin = kind === 'log' ? 0.1 : -2;
  const xmax = 4;
  const ymin = kind === 'log' ? -4 : -2;
  const ymax = kind === 'log' ? 4 : 17;
  const sample = (fn: (v: number) => number): Point[] =>
    Array.from({ length: 181 }, (_, i) => {
      const v = xmin + ((xmax - xmin) * i) / 180;
      return [v, fn(v)];
    });
  const series: Series[] = [
    {
      name: `f(x) = ${name}`,
      color: '#174ea6',
      points: sample((v) => functionValue(kind, v)),
    },
    {
      name: fr ? 'Tangente' : 'Tangent',
      color: '#006d77',
      dash: '8 4',
      points: sample((v) => y + slope * (v - x)),
    },
    ...(secant === null
      ? []
      : [
          {
            name: fr ? 'Sécante' : 'Secant',
            color: '#bc1534',
            dash: '3 3',
            points: sample((v) => y + secant * (v - x)),
          },
        ]),
  ];
  const reset = () => {
    lab.setPlaying(false);
    setKind('square');
    setX(1);
    setH(1);
  };
  return (
    <div ref={lab.ref} className="l42-lab" data-l42="tangent">
      <p className="l42-objective">
        <strong>{fr ? 'Objectif : ' : 'Goal: '}</strong>
        {fr
          ? 'Distinguer hauteur, pente de sécante et dérivée ; construire la tangente au point P.'
          : 'Distinguish height, secant slope and derivative; construct the tangent at P.'}
      </p>
      <p id="l42-tangent-question">
        {fr
          ? 'Pour x² au point x₀ = 1, prédisez la pente lorsque h passe de 1 à 0,1, puis à −0,1.'
          : 'For x² at x₀ = 1, predict the slope as h changes from 1 to 0.1, then to −0.1.'}
      </p>
      <fieldset hidden={!lab.ready} className="l42-controls">
        <legend>
          {fr
            ? 'Explorer la sécante et la tangente'
            : 'Explore secant and tangent'}
        </legend>
        <label htmlFor="l42-function">{fr ? 'Fonction' : 'Function'}</label>
        <select
          id="l42-function"
          value={kind}
          onChange={(e) => {
            lab.setPlaying(false);
            setKind(e.target.value as FunctionId);
            setX(1);
            setH(1);
          }}
        >
          <option value="square">x²</option>
          <option value="exp">2ˣ</option>
          <option value="log">log₂(x)</option>
        </select>
        <label htmlFor="l42-x0">
          {fr ? 'Abscisse du point P, x₀' : 'Input at P, x₀'} : {f(x)}
        </label>
        <input
          id="l42-x0"
          type="range"
          min={kind === 'log' ? 0.5 : -1}
          max="2"
          step="0.1"
          value={x}
          aria-valuetext={`x₀ = ${f(x)}`}
          onChange={(e) => {
            lab.setPlaying(false);
            setX(Number(e.target.value));
          }}
        />
        <label htmlFor="l42-h">
          {fr ? 'Écart h (−1 à 1)' : 'Gap h (−1 to 1)'} : {f(h)}
        </label>
        <input
          id="l42-h"
          type="range"
          min="-1"
          max="1"
          step="0.001"
          value={h}
          aria-valuetext={`h = ${f(h)}`}
          aria-describedby="l42-tangent-question l42-tangent-result"
          onChange={(e) => {
            lab.setPlaying(false);
            setH(Number(e.target.value));
          }}
        />
        <div className="l42-actions">
          {[1, 0.1, -0.1].map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => {
                lab.setPlaying(false);
                setH(v);
              }}
            >
              h = {f(v)}
            </button>
          ))}
          <button
            type="button"
            data-play
            disabled={lab.reduced || secant === null || Math.abs(h) <= 0.001}
            aria-pressed={lab.playing}
            onClick={() => lab.setPlaying(!lab.playing)}
          >
            {lab.playing
              ? 'Pause'
              : fr
                ? 'Rapprocher Q de P'
                : 'Bring Q closer to P'}
          </button>
          <button type="button" data-reset onClick={reset}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
        {lab.reduced && (
          <p>
            {fr
              ? 'Mouvement réduit : choisissez h avec le curseur ou les boutons.'
              : 'Reduced motion: choose h with the slider or buttons.'}
          </p>
        )}
      </fieldset>
      <output
        id="l42-tangent-result"
        aria-live={lab.playing ? 'off' : 'polite'}
        aria-atomic="true"
      >
        P ≈ ({f(x)} ; {f(y)}).{' '}
        {secant === null
          ? fr
            ? h === 0
              ? 'À h = 0, le quotient est indéfini. La tangente utilise la dérivée, pas une division par zéro.'
              : 'Q est hors du domaine : x₀ + h doit être strictement positif. La sécante est masquée.'
            : h === 0
              ? 'At h = 0 the quotient is undefined. The tangent uses the derivative, not division by zero.'
              : 'Q is outside the domain: x₀ + h must be positive. The secant is hidden.'
          : `Q ≈ (${f(x + h)} ; ${f(functionValue(kind, x + h))}). [f(${f(x + h)}) − f(${f(x)})] / (${f(h)}) ≈ ${f(secant)}.`}{' '}
        {fr ? 'Dérivée' : 'Derivative'} f′({f(x)}) ≈ {f(slope)}.{' '}
        {fr ? 'Tangente' : 'Tangent'} : y ≈ {f(y)} + ({f(slope)}) × (x − ({f(x)}
        )).
      </output>
      <p>
        {fr
          ? 'La fenêtre du graphique reste fixe pour chaque fonction : un changement de pente ne provient pas d’un zoom automatique. Le quotient est calculé sous une forme algébriquement équivalente pour limiter les erreurs d’arrondi.'
          : 'The graph window stays fixed for each function: slope changes do not come from automatic zoom. An algebraically equivalent quotient reduces rounding error.'}
      </p>
      <L42Plot
        locale={locale}
        title={`f(x) = ${name}`}
        description={
          fr
            ? 'P est le point de tangence. Q détermine la sécante lorsqu’il est distinct de P et dans le domaine. La tangente reste visible, même lorsque la sécante n’est pas définie.'
            : 'P is the tangent point. Q determines the secant when distinct from P and in the domain. The tangent remains visible when the secant is undefined.'
        }
        xLabel="x"
        yLabel="y = f(x)"
        xRange={[kind === 'log' ? 0 : xmin, xmax]}
        yRange={[ymin, ymax]}
        xTicks={kind === 'log' ? [0, 1, 2, 3, 4] : [-2, 0, 2, 4]}
        yTicks={kind === 'log' ? [-4, -2, 0, 2, 4] : [0, 4, 8, 12, 16]}
        series={series}
        markers={[
          { point: [x, y], label: 'P' },
          ...(secant === null
            ? []
            : [
                {
                  point: [x + h, functionValue(kind, x + h)] as Point,
                  label: 'Q',
                },
              ]),
        ]}
      />
      <table>
        <caption>
          {fr
            ? 'Approche des deux côtés au point P choisi'
            : 'Approach from both sides at the selected P'}
        </caption>
        <thead>
          <tr>
            <th scope="col">h</th>
            <th scope="col">{fr ? 'Pente sécante ≈' : 'Secant slope ≈'}</th>
          </tr>
        </thead>
        <tbody>
          {[-0.1, -0.01, 0, 0.01, 0.1].map((v) => (
            <tr key={v}>
              <th scope="row">{f(v)}</th>
              <td>
                {v === 0
                  ? fr
                    ? 'Quotient indéfini'
                    : 'Undefined quotient'
                  : f(secantSlope(kind, x, v)!)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {fr
          ? 'La dérivée est une limite : quelques valeurs numériques l’illustrent sans en constituer une preuve. Le bouton animé s’arrête à |h| = 0,001 ; il ne calcule jamais le quotient à h = 0.'
          : 'The derivative is a limit: numeric samples illustrate it without proving it. Animation stops at |h| = 0.001; it never evaluates the quotient at h = 0.'}
      </p>
      <StaticNote ready={lab.ready} locale={locale} />
    </div>
  );
}
