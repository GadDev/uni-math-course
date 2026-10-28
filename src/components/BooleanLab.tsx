import { useEffect, useId, useState } from 'react';
import {
  booleanLaws,
  compare,
  evaluate,
  formulaText,
  type Assignment,
  type LabKind,
  type Law,
} from '../lib/l04-boolean';
import type { Locale } from '../lib/i18n';
import '../styles/l04-learning.css';

const copy = {
  fr: {
    titles: {
      rewrite: 'À vous : réécrire sans changer le sens',
      morgan: 'À vous : explorer les deux lois de De Morgan',
      distribute: 'À vous : développer et factoriser',
    },
    goals: {
      rewrite:
        'Objectif : distinguer un accord sur une ligne d’une équivalence sur toutes les lignes.',
      morgan: 'Objectif : comprendre pourquoi nier un groupe échange ET et OU.',
      distribute:
        'Objectif : recopier la partie commune et conserver les deux branches.',
    },
    questions: {
      rewrite:
        'Prédisez les résultats pour A = 1 et B = 0. Un accord ici suffirait-il pour conclure ?',
      morgan:
        'Si une seule condition manque, NON(A ET B) est-il vrai ? Et NON(A OU B) ?',
      distribute:
        'Avec A = 1, B = 0, C = 1, peut-on supprimer la branche contenant C ?',
    },
    law: 'Loi à explorer',
    direction: 'Sens de lecture',
    expand: 'Développer',
    factor: 'Factoriser',
    mistake: 'Tester une réécriture incorrecte',
    reset: 'Réinitialiser',
    values: 'Choisir les valeurs',
    local: 'Pour votre affectation',
    same: 'Même valeur ici. Cela seul ne prouve pas une équivalence.',
    different: 'Valeurs différentes ici : cette ligne réfute l’équivalence.',
    yes: 'Équivalence vérifiée : accord sur toutes les lignes.',
    no: 'Pas d’équivalence : au moins une ligne diffère.',
    counter: 'Contre-exemple',
    see: 'Afficher ce contre-exemple',
    full: 'Table complète',
    current: 'Ligne choisie',
    result: 'Comparaison',
    equal: 'accord',
    unequal: 'désaccord',
    proof: 'Pourquoi ça marche : réécriture correcte',
    initial: 'Exemple fixe pour étudier sur papier',
    takeaway:
      'Un accord local illustre ; l’accord sur toutes les lignes prouve ; un désaccord suffit à réfuter.',
    static:
      'Exemple initial lisible sans JavaScript. Les commandes apparaissent quand l’activité est prête.',
    map: 'Carte des quatre affectations possibles',
    universe: 'Univers U : les quatre choix de A et B',
    shaded:
      'Les cases hachurées rendent G vraie. Les nombres donnent G et D ; « choisie » repère votre affectation.',
    chosen: 'choisie',
    read: 'G = expression de gauche ; D = expression de droite. 0 = faux, 1 = vrai.',
    method:
      'Chaque transformation ci-dessous conserve la table de vérité. La variante incorrecte sert à chercher une erreur.',
  },
  en: {
    titles: {
      rewrite: 'Your turn: rewrite without changing meaning',
      morgan: 'Your turn: explore both De Morgan laws',
      distribute: 'Your turn: expand and factor',
    },
    goals: {
      rewrite:
        'Goal: distinguish agreement on one row from equivalence on every row.',
      morgan: 'Goal: understand why negating a group exchanges AND and OR.',
      distribute: 'Goal: copy the common part and keep both branches.',
    },
    questions: {
      rewrite:
        'Predict the results for A = 1 and B = 0. Would agreement here be enough to conclude?',
      morgan:
        'If only one condition fails, is NOT(A AND B) true? What about NOT(A OR B)?',
      distribute:
        'With A = 1, B = 0, C = 1, can you delete the branch containing C?',
    },
    law: 'Law to explore',
    direction: 'Reading direction',
    expand: 'Expand',
    factor: 'Factor',
    mistake: 'Test an incorrect rewrite',
    reset: 'Reset',
    values: 'Choose values',
    local: 'For your assignment',
    same: 'Same value here. This alone does not prove equivalence.',
    different: 'Different values here: this row refutes equivalence.',
    yes: 'Equivalence verified: agreement on every row.',
    no: 'Not equivalent: at least one row differs.',
    counter: 'Counterexample',
    see: 'Show this counterexample',
    full: 'Complete table',
    current: 'Selected row',
    result: 'Comparison',
    equal: 'agree',
    unequal: 'differ',
    proof: 'Why it works: correct rewriting',
    initial: 'Fixed example for studying on paper',
    takeaway:
      'Local agreement illustrates; agreement on every row proves; one disagreement refutes.',
    static:
      'Initial example readable without JavaScript. Controls appear when the activity is ready.',
    map: 'Map of the four possible assignments',
    universe: 'Universe U: all four choices of A and B',
    shaded:
      'Hatched cells make G true. Numbers give G and D; “selected” marks your assignment.',
    chosen: 'selected',
    read: 'G = left expression; D = right expression. 0 = false, 1 = true.',
    method:
      'Each transformation below preserves the truth table. The incorrect variant is an error-finding exercise.',
  },
};
const bit = (value: boolean) => Number(value);
const initialEnv: Assignment = { A: true, B: false, C: true };
function assignmentText(env: Assignment, law: Law) {
  return law.variables.map((v) => `${v} = ${bit(env[v])}`).join(', ');
}
function TruthTable({
  law,
  left,
  right,
  env,
  locale,
}: {
  law: Law;
  left: Law['left'];
  right: Law['right'];
  env: Assignment;
  locale: Locale;
}) {
  const t = copy[locale];
  return (
    <div
      className="l04-table-wrap"
      tabIndex={0}
      role="region"
      aria-label={t.full}
    >
      <table>
        <caption>
          {t.full} — {2 ** law.variables.length}{' '}
          {locale === 'fr' ? 'affectations' : 'assignments'}
        </caption>
        <thead>
          <tr>
            <th scope="col">{locale === 'fr' ? 'Repère' : 'Marker'}</th>
            {law.variables.map((v) => (
              <th key={v} scope="col">
                {v}
              </th>
            ))}
            <th scope="col">G</th>
            <th scope="col">D</th>
            <th scope="col">{t.result}</th>
          </tr>
        </thead>
        <tbody>
          {compare(left, right, law.variables).rows.map((row) => {
            const key = law.variables.map((v) => bit(row.env[v])).join('');
            const current = law.variables.every((v) => row.env[v] === env[v]);
            return (
              <tr
                key={key}
                data-row={key}
                data-current={current}
                aria-current={current ? 'true' : undefined}
              >
                <th scope="row">
                  {current ? '→' : '·'}
                  <span className="visually-hidden">
                    {current ? t.current : key}
                  </span>
                </th>
                {law.variables.map((v) => (
                  <td key={v}>{bit(row.env[v])}</td>
                ))}
                <td data-left>{bit(row.left)}</td>
                <td data-right>{bit(row.right)}</td>
                <td>
                  {row.left === row.right ? '=' : '≠'}
                  <span className="visually-hidden">
                    {' '}
                    {row.left === row.right ? t.equal : t.unequal}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function RegionMap({
  law,
  right,
  env,
  locale,
}: {
  law: Law;
  right: Law['right'];
  env: Assignment;
  locale: Locale;
}) {
  const t = copy[locale];
  const hatchId = `hatch-${useId().replaceAll(':', '')}`;
  return (
    <figure className="l04-map">
      <svg
        viewBox="0 0 440 270"
        role="img"
        aria-label={`${t.map}. ${t.universe}. ${t.shaded}`}
      >
        <defs>
          <pattern
            id={hatchId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 8L8 0" stroke="#768399" strokeWidth="1" />
          </pattern>
        </defs>
        <rect
          x="2"
          y="2"
          width="436"
          height="266"
          fill="#fffdf8"
          stroke="#172b4d"
          strokeWidth="2"
        />
        <text x="15" y="28" fontSize="22" fill="#172b4d">
          {locale === 'fr' ? 'U : quatre affectations' : 'U: four assignments'}
        </text>
        {compare(law.left, right, law.variables).rows.map((r, i) => {
          const x = 12 + (i % 2) * 212,
            y = 45 + Math.floor(i / 2) * 106;
          const current = r.env.A === env.A && r.env.B === env.B;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="202"
                height="96"
                fill={r.left ? `url(#${hatchId})` : '#fffdf8'}
                stroke="#172b4d"
                strokeWidth={current ? 4 : 1}
              />
              <rect
                x={x + 8}
                y={y + 7}
                width="186"
                height="79"
                fill="#fffdf8"
              />
              <text x={x + 15} y={y + 30} fontSize="24" fill="#172b4d">
                A = {bit(r.env.A)}, B = {bit(r.env.B)}
              </text>
              <text x={x + 15} y={y + 56} fontSize="24" fill="#172b4d">
                G = {bit(r.left)} ; D = {bit(r.right)}
              </text>
              {current && (
                <text x={x + 15} y={y + 79} fontSize="20" fill="#172b4d">
                  → {t.chosen}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>{t.shaded}</figcaption>
    </figure>
  );
}
function Steps({ law, locale }: { law: Law; locale: Locale }) {
  return (
    <ol className="l04-steps">
      {law.steps.map((s, i) => (
        <li key={i}>
          <span className="l04-formula">{formulaText(s.formula)}</span> —{' '}
          {s.reason[locale]}
        </li>
      ))}
    </ol>
  );
}
export default function BooleanLab({
  kind,
  locale,
}: {
  kind: LabKind;
  locale: Locale;
}) {
  const choices = booleanLaws.filter((l) => l.kind === kind);
  const first = choices[0]!;
  const [id, setId] = useState(first.id);
  const [env, setEnv] = useState<Assignment>({ ...initialEnv });
  const [wrong, setWrong] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const law = choices.find((l) => l.id === id)!;
  const candidate = wrong && law.wrong ? law.wrong : law.right;
  const left = reverse ? candidate : law.left,
    right = reverse ? law.left : candidate;
  const result = compare(left, right, law.variables);
  const localLeft = evaluate(left, env),
    localRight = evaluate(right, env);
  const t = copy[locale];
  const prefix = `l04-${kind}`;
  const Heading = kind === 'rewrite' ? 'h3' : 'h4';
  return (
    <section
      className="l04-lab"
      data-lab={kind}
      data-ready={ready}
      aria-labelledby={`${prefix}-title`}
    >
      <Heading id={`${prefix}-title`}>{t.titles[kind]}</Heading>
      <p>{t.goals[kind]}</p>
      <p className="l04-prediction">
        <strong>
          {locale === 'fr' ? 'Avant de manipuler : ' : 'Before manipulating: '}
        </strong>
        {t.questions[kind]}
      </p>
      <div className="l04-screen">
        <div className="l04-controls">
          <label htmlFor={`${prefix}-law`}>{t.law}</label>
          <select
            id={`${prefix}-law`}
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setWrong(false);
              setReverse(false);
            }}
          >
            {choices.map((l) => (
              <option value={l.id} key={l.id}>
                {l.title[locale]}
              </option>
            ))}
          </select>
          {kind === 'distribute' && (
            <>
              <label htmlFor={`${prefix}-direction`}>{t.direction}</label>
              <select
                id={`${prefix}-direction`}
                value={reverse ? 'reverse' : 'forward'}
                onChange={(e) => setReverse(e.target.value === 'reverse')}
              >
                <option value="forward">{t.expand}</option>
                <option value="reverse">{t.factor}</option>
              </select>
            </>
          )}
          <fieldset>
            <legend>{t.values}</legend>
            {law.variables.map((v) => (
              <label key={v} className="l04-value">
                {v}
                <select
                  aria-label={`${v} — ${t.values}`}
                  value={String(bit(env[v]))}
                  onChange={(e) =>
                    setEnv({ ...env, [v]: e.target.value === '1' })
                  }
                >
                  <option value="0">
                    0 — {locale === 'fr' ? 'faux' : 'false'}
                  </option>
                  <option value="1">
                    1 — {locale === 'fr' ? 'vrai' : 'true'}
                  </option>
                </select>
              </label>
            ))}
          </fieldset>
          {law.wrong && (
            <label className="l04-check">
              <input
                type="checkbox"
                checked={wrong}
                onChange={(e) => setWrong(e.target.checked)}
              />
              {t.mistake}
            </label>
          )}
          <button
            type="button"
            onClick={() => {
              setId(first.id);
              setEnv({ ...initialEnv });
              setWrong(false);
              setReverse(false);
            }}
          >
            {t.reset}
          </button>
        </div>
        {!ready && <p data-static-note>{t.static}</p>}
        <p className="l04-formula" data-expression-left>
          G : {formulaText(left)}
        </p>
        <p className="l04-formula" data-expression-right>
          D : {formulaText(right)}
        </p>
        <p className="l04-small">{t.read}</p>
        <div
          className="l04-result"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p>
            <strong>
              {t.local} : {assignmentText(env, law)}
            </strong>
          </p>
          <p data-local>
            G = {bit(localLeft)} ; D = {bit(localRight)}.{' '}
            {localLeft === localRight ? t.same : t.different}
          </p>
          <p data-global>
            <strong>{result.equivalent ? t.yes : t.no}</strong>
          </p>
          {result.counterexample && (
            <p data-counterexample>
              {t.counter} : {assignmentText(result.counterexample.env, law)} → G
              = {bit(result.counterexample.left)}, D ={' '}
              {bit(result.counterexample.right)}.
            </p>
          )}
        </div>
        {result.counterexample && (
          <button
            className="l04-controls"
            type="button"
            onClick={() => setEnv({ ...result.counterexample!.env })}
          >
            {t.see}
          </button>
        )}
        {kind === 'morgan' && (
          <RegionMap law={law} right={candidate} env={env} locale={locale} />
        )}
        <TruthTable
          law={law}
          left={left}
          right={right}
          env={env}
          locale={locale}
        />
        <details className="l04-solution">
          <summary>{t.proof}</summary>
          <p>{t.method}</p>
          <p className="l04-formula">{formulaText(law.left)}</p>
          <Steps law={law} locale={locale} />
          {reverse && (
            <p>
              {locale === 'fr'
                ? 'Pour factoriser, lire ces transformations de bas en haut.'
                : 'To factor, read these transformations from bottom to top.'}
            </p>
          )}
        </details>
      </div>
      <div className="l04-print-example">
        <p>
          <strong>
            {t.initial} : {first.title[locale]}
          </strong>
        </p>
        <div className="l04-print-grid">
          <div>
            <p className="l04-formula">G : {formulaText(first.left)}</p>
            <p className="l04-formula">D : {formulaText(first.right)}</p>
            <p>
              {assignmentText(initialEnv, first)} → G ={' '}
              {bit(evaluate(first.left, initialEnv))}, D ={' '}
              {bit(evaluate(first.right, initialEnv))}.
            </p>
            <p>{t.read}</p>
            <Steps law={first} locale={locale} />
          </div>
          <div>
            {kind === 'morgan' && (
              <RegionMap
                law={first}
                right={first.right}
                env={initialEnv}
                locale={locale}
              />
            )}
            <TruthTable
              law={first}
              left={first.left}
              right={first.right}
              env={initialEnv}
              locale={locale}
            />
          </div>
        </div>
      </div>
      <p className="l04-takeaway">{t.takeaway}</p>
    </section>
  );
}
