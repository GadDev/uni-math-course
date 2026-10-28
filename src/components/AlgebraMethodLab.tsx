import { useEffect, useState } from 'react';
import Tex from './Tex';
import {
  methodDefaults,
  signedPowers,
  factorValues,
  linearEquation,
  sumDifference,
  indexedSum,
  physicalDistance,
  type MethodKind,
} from '../lib/algebra-methods';
import '../styles/algebra-methods.css';

type Locale = 'fr' | 'en';
type Step = { note: string; tex: string };
const copy = {
  powers: [
    [
      'Signes et puissances : qui reçoit l’exposant ?',
      'Signs and powers: what receives the exponent?',
    ],
    [
      'Objectif : distinguer l’opposé d’une puissance et la puissance d’un nombre négatif.',
      'Goal: distinguish the opposite of a power from the power of a negative number.',
    ],
    [
      'Prédire : avec a = 3, les deux écritures donnent-elles la même valeur pour un exposant pair ? Et impair ?',
      'Predict: with a = 3, do both expressions give the same value for an even exponent? An odd one?',
    ],
    [
      'Expliquer : les parenthèses changent la base. Un accord pour un exposant impair ne permet pas de supprimer les parenthèses pour tous les exposants.',
      'Explain: parentheses change the base. Agreement for an odd exponent does not let you remove parentheses for every exponent.',
    ],
  ],
  factor: [
    [
      'Factoriser : reconnaître, regrouper, vérifier',
      'Factorise: recognise, group, verify',
    ],
    [
      'Objectif : choisir une méthode et reconstruire une forme factorisée.',
      'Goal: choose a method and reconstruct a factorised form.',
    ],
    [
      'Prédire : voyez-vous d’abord un facteur commun, une différence de carrés ou un carré parfait ?',
      'Predict: do you first see a common factor, a difference of squares or a perfect square?',
    ],
    [
      'Expliquer : redévelopper prouve l’identité pour tout réel. Changer x ne donne qu’une vérification numérique ; essayez aussi x = 0 sans diviser par x.',
      'Explain: expanding back proves the identity for every real number. Changing x gives only a numerical check; also try x = 0 without dividing by x.',
    ],
  ],
  equation: [
    [
      'Équation : faire la même opération des deux côtés',
      'Equation: do the same operation on both sides',
    ],
    [
      'Objectif : isoler x par des transformations réversibles et traiter le coefficient nul.',
      'Goal: isolate x through reversible transformations and handle a zero coefficient.',
    ],
    [
      'Prédire : comment enlever +b ? Peut-on ensuite diviser par a si a vaut zéro ?',
      'Predict: how can you remove +b? Can you then divide by a if a is zero?',
    ],
    [
      'Expliquer : le terme ne traverse pas le signe égal par magie. On soustrait le même nombre aux deux membres ; on divise ensuite seulement par un nombre non nul.',
      'Explain: a term does not cross the equals sign by magic. Subtract the same number from both sides; then divide only by a nonzero number.',
    ],
  ],
  elimination: [
    [
      'Résoudre un système : comparer deux méthodes',
      'Solve a system: compare two methods',
    ],
    [
      'Objectif : suivre substitution et élimination jusqu’au couple vérifié.',
      'Goal: follow substitution and elimination to a verified solution pair.',
    ],
    [
      'Prédire : dans x + y = s et x − y = d, quelle opération fait disparaître y ?',
      'Predict: in x + y = s and x − y = d, which operation makes y disappear?',
    ],
    [
      'Expliquer : les deux méthodes conduisent au même couple. On conserve une équation pour retrouver y et on vérifie les deux conditions initiales.',
      'Explain: both methods lead to the same pair. Retain an equation to recover y and check both original conditions.',
    ],
  ],
  sigma: [
    [
      'Sigma : dérouler les bornes et compter les termes',
      'Sigma: expand the bounds and count the terms',
    ],
    [
      'Objectif : remplacer l’indice par chaque valeur et compter les bornes incluses.',
      'Goal: replace the index by every value and count the included endpoints.',
    ],
    [
      'Prédire : de i = 2 à i = 4, combien de termes faut-il écrire ? Le terme constant change-t-il avec i ?',
      'Predict: from i = 2 to i = 4, how many terms must you write? Does a constant term change with i?',
    ],
    [
      'Expliquer : l’indice parcourt les positions, pas les valeurs à additionner. Déplacer une borne change le nombre de termes ; une constante se répète une fois par indice.',
      'Explain: the index runs through positions, not the values to add. Moving a bound changes the term count; a constant repeats once per index.',
    ],
  ],
  scales: [
    [
      'Unités du repère : convertir avant Pythagore',
      'Coordinate units: convert before Pythagoras',
    ],
    [
      'Objectif : distinguer écart de coordonnées et déplacement physique en mètres.',
      'Goal: distinguish coordinate differences from physical displacement in metres.',
    ],
    [
      'Prédire : si une unité horizontale passe de 1 m à 2 m, le même écart de coordonnées représente-t-il encore la même distance ?',
      'Predict: if one horizontal unit changes from 1 m to 2 m, does the same coordinate difference still represent the same distance?',
    ],
    [
      'Expliquer : le dessin est gradué en mètres, avec des axes perpendiculaires et la même échelle physique. Les coordonnées de départ restent identiques quand vous changez leur unité.',
      'Explain: the drawing is graduated in metres, with perpendicular axes and the same physical scale. The original coordinates remain identical when you change their unit.',
    ],
  ],
};
const rationalTex = (n: number, d: number) =>
  d === 1 ? String(n) : String.raw`\frac{${n}}{${d}}`;

function methodWork(
  kind: MethodKind,
  v: number[],
  locale: Locale,
): { steps: Step[]; summary: string; error?: string } {
  const t = (a: string, b: string) => (locale === 'fr' ? a : b);
  const [a = 0, b = 0, c = 0, d = 0] = v;
  if (kind === 'powers') {
    const p = signedPowers(a, b);
    return {
      summary: `−aⁿ = ${p.outside} ; (−a)ⁿ = ${p.inside}`,
      steps: [
        {
          note: t(
            'Sans parenthèses : calculer la puissance positive, puis prendre son opposé.',
            'Without parentheses: calculate the positive power, then take its opposite.',
          ),
          tex: String.raw`-${a}^{${b}}=-(${a}^{${b}})=${p.outside}`,
        },
        {
          note: t(
            'Avec parenthèses : chaque facteur porte le signe moins.',
            'With parentheses: every factor carries the minus sign.',
          ),
          tex: String.raw`(-${a})^{${b}}=${Array.from({ length: b }, () => `(-${a})`).join(String.raw`\times`)}=${p.inside}`,
        },
        {
          note:
            b % 2 === 0
              ? t(
                  'Un nombre pair de facteurs négatifs donne un résultat non négatif. À a = 0, les deux résultats sont nuls.',
                  'An even number of negative factors gives a nonnegative result. At a = 0, both results are zero.',
                )
              : t(
                  'Un nombre impair de facteurs négatifs donne un résultat négatif si a est positif, et zéro si a est nul.',
                  'An odd number of negative factors gives a negative result if a is positive, and zero if a is zero.',
                ),
          tex: String.raw`${p.outside}${p.outside === p.inside ? '=' : String.raw`\ne`}${p.inside}`,
        },
      ],
    };
  }
  if (kind === 'factor') {
    const f = factorValues(a, b);
    const forms = [
      ['6x^2-9x', '3x(2x)-3x(3)', '3x(2x-3)', '3x(2x-3)=6x^2-9x'],
      ['x^2-9', 'x^2-3^2', '(x-3)(x+3)', '(x-3)(x+3)=x^2+3x-3x-9=x^2-9'],
      [
        'x^2+6x+9',
        String.raw`x^2+2\times x\times3+3^2`,
        '(x+3)^2',
        '(x+3)(x+3)=x^2+6x+9',
      ],
    ][a]!;
    return {
      summary: `x = ${b} : ${t('forme développée', 'expanded form')} = ${f.expanded} ; ${t('forme factorisée', 'factorised form')} = ${f.factored}`,
      steps: [
        {
          note: t(
            'Lire l’expression de départ.',
            'Read the original expression.',
          ),
          tex: forms[0]!,
        },
        {
          note:
            a === 0
              ? t(
                  'Repérer le facteur 3x dans chacun des deux termes.',
                  'Locate factor 3x in both terms.',
                )
              : a === 1
                ? t(
                    'Reconnaître deux carrés séparés par un moins.',
                    'Recognise two squares separated by subtraction.',
                  )
                : t(
                    'Reconnaître deux carrés et deux fois leur produit.',
                    'Recognise two squares and twice their product.',
                  ),
          tex: forms[1]!,
        },
        {
          note: t(
            'Écrire la forme factorisée sans changer le domaine réel.',
            'Write the factorised form without changing the real domain.',
          ),
          tex: forms[2]!,
        },
        {
          note: t(
            'Contrôler par distributivité, pour tous les réels.',
            'Check by distributivity, for all real numbers.',
          ),
          tex: forms[3]!,
        },
      ],
    };
  }
  if (kind === 'equation') {
    const e = linearEquation(a, b, c);
    const base: Step[] = [
      {
        note: t(
          'Condition initiale sur les réels.',
          'Original condition over the reals.',
        ),
        tex: String.raw`(${a})x+(${b})=${c}`,
      },
      {
        note: t(
          'Soustraire b aux deux membres.',
          'Subtract b from both sides.',
        ),
        tex: String.raw`(${a})x+(${b})-(${b})=${c}-(${b})`,
      },
      {
        note: t('Réduire chaque membre.', 'Simplify each side.'),
        tex: String.raw`(${a})x=${c - b}`,
      },
    ];
    if (e.kind !== 'unique')
      return {
        summary: e.kind === 'all' ? 'S = ℝ' : 'S = ∅',
        steps: [
          ...base,
          {
            note: t(
              'Le coefficient est nul : comparer les constantes, sans diviser par zéro.',
              'The coefficient is zero: compare the constants without dividing by zero.',
            ),
            tex: String.raw`0=${c - b}${String.raw`\quad\Longrightarrow\quad S=`}${e.kind === 'all' ? String.raw`\mathbb R` : String.raw`\varnothing`}`,
          },
        ],
      };
    const r = e.result!;
    return {
      summary: `x = ${r.numerator}${r.denominator === 1 ? '' : `/${r.denominator}`}`,
      steps: [
        ...base,
        {
          note: t(
            'Diviser les deux membres par a, qui est non nul.',
            'Divide both sides by nonzero a.',
          ),
          tex: String.raw`x=${rationalTex(c - b, a)}=${rationalTex(r.numerator, r.denominator)}`,
        },
        {
          note: t(
            'Remplacer x dans l’équation initiale pour vérifier.',
            'Substitute x into the original equation to check.',
          ),
          tex: String.raw`(${a})\times(${rationalTex(r.numerator, r.denominator)})+(${b})=${c}`,
        },
      ],
    };
  }
  if (kind === 'elimination') {
    const s = sumDifference(a, b);
    const xTex = rationalTex(a + b, 2);
    const yTex = rationalTex(a - b, 2);
    const fmt = (n: number) =>
      n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US');
    const steps: Step[] = [
      {
        note: t(
          'Les deux conditions doivent être vraies ensemble.',
          'Both conditions must hold together.',
        ),
        tex: String.raw`x+y=${a},\qquad x-y=${b}`,
      },
    ];
    if (c === 0)
      steps.push(
        {
          note: t(
            'Additionner les lignes : +y et −y s’annulent. Garder aussi une équation initiale.',
            'Add the rows: +y and −y cancel. Also retain an original equation.',
          ),
          tex: String.raw`(x+y)+(x-y)=${a}+(${b})`,
        },
        {
          note: t('Isoler x.', 'Isolate x.'),
          tex: String.raw`2x=${a + b}\quad\Longrightarrow\quad x=${rationalTex(a + b, 2)}`,
        },
      );
    else
      steps.push(
        {
          note: t(
            'Isoler y dans la première ligne et substituer dans la seconde.',
            'Isolate y in the first row and substitute in the second.',
          ),
          tex: String.raw`y=${a}-x,\qquad x-(${a}-x)=${b}`,
        },
        {
          note: t(
            'Distribuer le moins, puis isoler x.',
            'Distribute the minus sign, then isolate x.',
          ),
          tex: String.raw`2x-${a}=${b}\quad\Longrightarrow\quad x=${rationalTex(a + b, 2)}`,
        },
      );
    steps.push(
      {
        note: t(
          'Revenir à la première équation pour retrouver y.',
          'Return to the first equation to recover y.',
        ),
        tex: String.raw`y=${a}-(${xTex})=${yTex}`,
      },
      {
        note: t('Vérifier les deux équations.', 'Check both equations.'),
        tex: String.raw`(${xTex})+(${yTex})=${a},\qquad (${xTex})-(${yTex})=${b}`,
      },
    );
    return { summary: `(x ; y) = (${fmt(s.x)} ; ${fmt(s.y)})`, steps };
  }
  if (kind === 'sigma') {
    const sum = indexedSum(a, b, c === 0 ? null : d);
    if (!sum)
      return {
        summary: '',
        steps: [],
        error: t(
          'Dans cet atelier, la borne de départ doit être inférieure ou égale à la borne d’arrivée. Changez une borne.',
          'In this workshop, the starting bound must not exceed the ending bound. Change one bound.',
        ),
      };
    const term = c === 0 ? '(2i-1)' : `(${d})`;
    return {
      summary: `${sum.terms.length} ${t('termes', 'terms')} ; ${t('somme', 'sum')} = ${sum.total}`,
      steps: [
        {
          note: t(
            'Lire l’indice et les deux bornes incluses.',
            'Read the index and both included bounds.',
          ),
          tex: String.raw`\sum_{i=${a}}^{${b}}${term}`,
        },
        {
          note: t(
            'Compter les indices avant de calculer.',
            'Count the indices before calculating.',
          ),
          tex: String.raw`${b}-${a}+1=${sum.terms.length}`,
        },
        {
          note: t(
            'Remplacer i par chaque valeur, une fois.',
            'Replace i by each value, once.',
          ),
          tex: sum.terms
            .map((x) =>
              c === 0 ? String.raw`(2\times${x.index}-1)` : `(${d})`,
            )
            .join('+'),
        },
        {
          note: t(
            'Additionner les termes obtenus.',
            'Add the resulting terms.',
          ),
          tex: String.raw`${sum.terms.map((x) => `(${x.value})`).join('+')}=${sum.total}`,
        },
      ],
    };
  }
  const p = physicalDistance(a, b, c, d);
  return {
    summary: `${t('Distance physique', 'Physical distance')} ≈ ${p.distance.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 4 })} m`,
    steps: [
      {
        note: t(
          'Garder les écarts de coordonnées, avec leurs signes.',
          'Retain coordinate differences, with their signs.',
        ),
        tex: String.raw`\Delta x=${a},\quad\Delta y=${b}`,
      },
      {
        note: t(
          'Convertir chaque déplacement dans la même unité : le mètre.',
          'Convert both displacements to the same unit: metres.',
        ),
        tex: String.raw`X=(${a})\times${c}=${p.horizontal}\,\mathrm m,\quad Y=(${b})\times${d}=${p.vertical}\,\mathrm m`,
      },
      {
        note: t(
          'Appliquer Pythagore aux longueurs physiques.',
          'Apply Pythagoras to the physical lengths.',
        ),
        tex: String.raw`D=\sqrt{(${p.horizontal})^2+(${p.vertical})^2}=\sqrt{${p.horizontal ** 2 + p.vertical ** 2}}\,\mathrm m`,
      },
    ],
  };
}

function WorkView({
  kind,
  values,
  locale,
  active = 0,
  showSummary = true,
}: {
  kind: MethodKind;
  values: number[];
  locale: Locale;
  active?: number;
  showSummary?: boolean;
}) {
  const work = methodWork(kind, values, locale);
  if (work.error)
    return (
      <p data-method-error role="status">
        {work.error}
      </p>
    );
  const fr = locale === 'fr';
  return (
    <>
      <ol className="method-steps">
        {work.steps.map((s, i) => (
          <li key={i} data-active={i === active}>
            <p>{s.note}</p>
            <div
              className="method-math"
              tabIndex={0}
              aria-label={
                fr ? `Calcul, étape ${i + 1}` : `Calculation, step ${i + 1}`
              }
            >
              <Tex text={String.raw`$\displaystyle ${s.tex}$`} />
            </div>
          </li>
        ))}
      </ol>
      {kind === 'scales' && (
        <svg
          viewBox="0 0 400 330"
          role="img"
          aria-label={
            fr
              ? 'Triangle physique ; les deux axes sont gradués en mètres avec la même échelle.'
              : 'Physical triangle; both axes are graduated in metres with the same scale.'
          }
        >
          <title>
            {fr
              ? 'Convertir les déplacements avant de mesurer'
              : 'Convert displacements before measuring'}
          </title>
          <path className="algebra-axis" d="M30 160H370M200 25V295" />
          {[-10, 0, 10].map((n) => (
            <g key={n}>
              <text x={200 + 10 * n} y="185" textAnchor="middle">
                {n}
              </text>
              {n !== 0 && (
                <text x="190" y={166 - 10 * n} textAnchor="end">
                  {n}
                </text>
              )}
            </g>
          ))}
          <path
            className="algebra-guide"
            d={`M200 160H${200 + 10 * values[0]! * values[2]!}V${160 - 10 * values[1]! * values[3]!}`}
          />
          <path
            className="algebra-line"
            d={`M200 160L${200 + 10 * values[0]! * values[2]!} ${160 - 10 * values[1]! * values[3]!}`}
          />
          <circle
            className="algebra-point"
            cx={200 + 10 * values[0]! * values[2]!}
            cy={160 - 10 * values[1]! * values[3]!}
            r="6"
          />
          <text x="325" y="215">
            X (m)
          </text>
          <text x="215" y="28">
            Y (m)
          </text>
        </svg>
      )}
      {showSummary && (
        <p data-method-result role="status">
          {work.summary}
        </p>
      )}
      {kind === 'scales' && (
        <p>
          {fr
            ? 'D est une longueur physique en mètres. Le nombre calculé directement à partir des coordonnées brutes ne tient pas compte des unités différentes. Si les deux unités valent 2 m, la distance physique vaut deux fois la distance en unités de coordonnées.'
            : 'D is a physical length in metres. The number calculated directly from raw coordinates does not account for different units. If both units are 2 m, physical distance is twice the distance in coordinate units.'}
        </p>
      )}
    </>
  );
}

export default function AlgebraMethodLab({
  kind,
  locale,
}: {
  kind: MethodKind;
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);
  const idx = fr ? 0 : 1;
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState<number[]>([...methodDefaults[kind]]);
  const [step, setStep] = useState(0);
  useEffect(() => setReady(true), []);
  const update = (i: number, n: number) => {
    setValues((v) => v.map((x, j) => (i === j ? n : x)));
    setStep(0);
  };
  const id = `method-${kind}`;
  const range = (label: string, i: number, min: number, max: number) => (
    <label key={i} htmlFor={`${id}-${i}`}>
      {label} : {values[i]}
      <input
        id={`${id}-${i}`}
        type="range"
        min={min}
        max={max}
        step="1"
        value={values[i]}
        onChange={(e) => update(i, Number(e.target.value))}
      />
    </label>
  );
  const select = (label: string, i: number, options: string[]) => (
    <label htmlFor={`${id}-${i}`}>
      {label}
      <select
        id={`${id}-${i}`}
        value={values[i]}
        onChange={(e) => update(i, Number(e.target.value))}
      >
        {options.map((s, j) => (
          <option key={j} value={j}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
  const work = methodWork(kind, values, locale);
  return (
    <section
      className="algebra-lab method-lab"
      data-method-lab={kind}
      aria-labelledby={`${id}-title`}
    >
      <p className="algebra-title" id={`${id}-title`}>
        {copy[kind][0]![idx]}
      </p>
      <p>{copy[kind][1]![idx]}</p>
      <p>
        <strong>{copy[kind][2]![idx]}</strong>
      </p>
      <div className="method-live">
        <fieldset hidden={!ready}>
          <legend>
            {t(
              'Manipuler, puis parcourir les étapes',
              'Manipulate, then walk through the steps',
            )}
          </legend>
          {kind === 'powers' && (
            <>
              {range(
                t('Valeur positive ou nulle a', 'Nonnegative value a'),
                0,
                0,
                4,
              )}
              {range(t('Exposant entier n', 'Integer exponent n'), 1, 2, 5)}
            </>
          )}
          {kind === 'factor' && (
            <>
              {select(
                t('Expression à factoriser', 'Expression to factorise'),
                0,
                ['6x² − 9x', 'x² − 9', 'x² + 6x + 9'],
              )}
              {range(t('Valeur test x', 'Test value x'), 1, -4, 4)}
            </>
          )}
          {kind === 'equation' && (
            <>
              {range('a', 0, -4, 4)}
              {range('b', 1, -5, 5)}
              {range('c', 2, -5, 12)}
            </>
          )}
          {kind === 'elimination' && (
            <>
              {range('s', 0, 0, 10)}
              {range('d', 1, -5, 5)}
              {select(
                t('Méthode', 'Method'),
                2,
                fr
                  ? ['Élimination', 'Substitution']
                  : ['Elimination', 'Substitution'],
              )}
            </>
          )}
          {kind === 'sigma' && (
            <>
              {range(t('Borne de départ r', 'Starting bound r'), 0, 0, 5)}
              {range(t('Borne d’arrivée s', 'Ending bound s'), 1, 0, 6)}
              {select(t('Terme à additionner', 'Term to add'), 2, [
                '2i − 1',
                t('Constante c', 'Constant c'),
              ])}
              {values[2] === 1 && range('c', 3, -3, 5)}
            </>
          )}
          {kind === 'scales' && (
            <>
              {range('Δx', 0, -4, 4)}
              {range('Δy', 1, -4, 4)}
              {range(
                t('Mètres par unité horizontale', 'Metres per horizontal unit'),
                2,
                1,
                3,
              )}
              {range(
                t('Mètres par unité verticale', 'Metres per vertical unit'),
                3,
                1,
                3,
              )}
            </>
          )}
          <div className="method-actions">
            <button
              type="button"
              disabled={step === 0 || !!work.error}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              {t('Étape précédente', 'Previous step')}
            </button>
            <button
              type="button"
              disabled={step >= work.steps.length - 1 || !!work.error}
              onClick={() => setStep((s) => s + 1)}
            >
              {t('Étape suivante', 'Next step')}
            </button>
            <button
              type="button"
              onClick={() => {
                setValues([...methodDefaults[kind]]);
                setStep(0);
              }}
            >
              {t('Réinitialiser', 'Reset')}
            </button>
          </div>
          <p aria-live="polite" data-active-step>
            {work.error
              ? ''
              : `${t('Étape sélectionnée', 'Selected step')} ${step + 1}/${work.steps.length} : ${work.steps[step]?.note}`}
          </p>
          {!work.error && (
            <div
              className="method-math method-current"
              data-current-math
              tabIndex={0}
              aria-label={t(
                'Calcul de l’étape sélectionnée',
                'Calculation for the selected step',
              )}
            >
              <Tex
                text={String.raw`$\displaystyle ${work.steps[step]!.tex}$`}
              />
            </div>
          )}
        </fieldset>
        <p hidden={ready}>
          {t(
            'Exemple fixe : toutes les étapes restent lisibles sans JavaScript.',
            'Fixed example: all steps remain readable without JavaScript.',
          )}
        </p>
        {!work.error && (
          <p data-method-result role="status">
            {work.summary}
          </p>
        )}
        <WorkView
          kind={kind}
          values={values}
          locale={locale}
          active={step}
          showSummary={false}
        />
      </div>
      <div className="method-print">
        <p>
          {t(
            'Exemple de référence pour l’impression : valeurs initiales, toutes les étapes.',
            'Print reference example: initial values, all steps.',
          )}
        </p>
        <WorkView kind={kind} values={methodDefaults[kind]} locale={locale} />
      </div>
      <p>{copy[kind][3]![idx]}</p>
    </section>
  );
}
