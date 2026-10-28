import { useEffect, useState } from 'react';
import Tex from './Tex';
import {
  fractionCalculation,
  type FractionOperation,
  type Rational,
} from '../lib/algebra-methods';
import '../styles/algebra-methods.css';

type Locale = 'fr' | 'en';
const symbols = {
  add: '+',
  subtract: '-',
  multiply: String.raw`\times`,
  divide: String.raw`\div`,
};
const texFraction = ({ numerator: n, denominator: d }: Rational) =>
  d === 1 ? String(n) : String.raw`\frac{${n}}{${d}}`;
const initial = ['1', '2', '1', '3'];

function FractionView({
  operation,
  values,
  locale,
}: {
  operation: FractionOperation;
  values: number[];
  locale: Locale;
}) {
  const fr = locale === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);
  const [a = 0, b = 0, c = 0, d = 0] = values;
  const data = fractionCalculation(operation, a, b, c, d);
  if ('error' in data)
    return (
      <p role="status" data-fraction-error>
        {data.error === 'zero-divisor'
          ? t(
              'La deuxième fraction vaut zéro : on ne peut pas diviser par zéro. Changez son numérateur ou choisissez une autre opération.',
              'The second fraction equals zero: division by zero is undefined. Change its numerator or choose another operation.',
            )
          : t(
              'Utilisez des entiers de −12 à 12. Chaque dénominateur doit être non nul ; une case vide ne représente pas zéro.',
              'Use integers from −12 to 12. Each denominator must be nonzero; an empty field does not mean zero.',
            )}
      </p>
    );
  const { first, second, common, left, right, raw, result, divisor } = data;
  const additive = operation === 'add' || operation === 'subtract';
  const op = symbols[operation];
  const steps = [
    {
      note: t(
        'Lire l’opération et placer les signes au numérateur.',
        'Read the operation and put signs in the numerator.',
      ),
      tex: `${texFraction(first)} ${op} ${texFraction(second)}`,
    },
    additive
      ? {
          note: t(
            `Choisir ${common} comme dénominateur commun. Multiplier le haut et le bas par le même nombre conserve chaque fraction.`,
            `Choose ${common} as common denominator. Multiplying top and bottom by the same number preserves each fraction.`,
          ),
          tex: String.raw`\frac{${first.numerator}\times${common / first.denominator}}{${first.denominator}\times${common / first.denominator}} ${op} \frac{${second.numerator}\times${common / second.denominator}}{${second.denominator}\times${common / second.denominator}} = \frac{${left}}{${common}} ${op} \frac{${right}}{${common}}`,
        }
      : operation === 'multiply'
        ? {
            note: t(
              'Multiplier les numérateurs entre eux et les dénominateurs entre eux. Aucun dénominateur commun n’est nécessaire.',
              'Multiply the numerators together and the denominators together. No common denominator is needed.',
            ),
            tex: String.raw`\frac{${first.numerator}\times(${second.numerator})}{${first.denominator}\times${second.denominator}}`,
          }
        : {
            note: t(
              'Garder la première fraction et multiplier par l’inverse de la deuxième, qui est non nulle.',
              'Keep the first fraction and multiply by the reciprocal of the nonzero second fraction.',
            ),
            tex: String.raw`${texFraction(first)}\times\frac{${second.denominator}}{${second.numerator}} = \frac{${first.numerator}\times${second.denominator}}{${first.denominator}\times(${second.numerator})}`,
          },
    {
      note: t(
        'Effectuer le calcul, puis simplifier la fraction obtenue.',
        'Calculate, then reduce the resulting fraction.',
      ),
      tex: additive
        ? String.raw`\frac{${left}${op}(${right})}{${common}} = ${texFraction(raw)} = ${texFraction(result)}`
        : `${texFraction(raw)} = ${texFraction(result)}`,
    },
  ];
  const strips =
    additive &&
    common <= 24 &&
    [left, right, raw.numerator].every((n) => Math.abs(n) <= common);
  return (
    <>
      <p
        data-fraction-result
        data-numerator={result.numerator}
        data-denominator={result.denominator}
        role="status"
      >
        {t('Résultat exact', 'Exact result')} :{' '}
        <Tex text={String.raw`$\displaystyle ${texFraction(result)}$`} />.
      </p>
      <ol className="method-steps">
        {steps.map((step, i) => (
          <li key={i}>
            <p>{step.note}</p>
            <div
              className="method-math"
              tabIndex={0}
              aria-label={t(
                `Calcul, étape ${i + 1}`,
                `Calculation, step ${i + 1}`,
              )}
            >
              <Tex text={String.raw`$\displaystyle ${step.tex}$`} />
            </div>
          </li>
        ))}
      </ol>
      <p>
        {divisor > 1
          ? t(
              `On a divisé le numérateur et le dénominateur par ${divisor}.`,
              `We divided the numerator and denominator by ${divisor}.`,
            )
          : t(
              'Fraction irréductible ; le signe est placé au numérateur.',
              'Reduced fraction; the sign is placed in the numerator.',
            )}
      </p>
      {strips ? (
        <figure className="fraction-strips">
          <svg
            viewBox="0 0 400 235"
            role="img"
            aria-label={t(
              `Trois bandes découpées en ${common} parts : première fraction, deuxième fraction, résultat. Une bande entière représente une unité.`,
              `Three bars divided into ${common} parts: first fraction, second fraction, result. One whole bar represents one unit.`,
            )}
          >
            <title>
              {t(
                'Même taille de parts avant addition ou soustraction',
                'Equal-sized parts before adding or subtracting',
              )}
            </title>
            {[left, right, raw.numerator].map((n, row) => (
              <g key={row}>
                <text x="20" y={25 + 75 * row}>
                  {row === 0 ? 'A' : row === 1 ? 'B' : t('Résultat', 'Result')}{' '}
                  : {n}/{common}
                </text>
                {Array.from({ length: common }, (_, i) => (
                  <rect
                    key={i}
                    x={20 + (i * 360) / common}
                    y={35 + 75 * row}
                    width={360 / common}
                    height="30"
                    className={
                      i < Math.abs(n) ? 'fraction-filled' : 'fraction-empty'
                    }
                  />
                ))}
                {n < 0 && (
                  <text x="385" y={58 + 75 * row}>
                    −
                  </text>
                )}
              </g>
            ))}
          </svg>
          <figcaption>
            {t(
              'Une bande = une unité ; les cases montrent la valeur absolue. Le signe est écrit dans l’étiquette. A et B sont les fractions de départ, pas forcément les contributions signées à une soustraction.',
              'One bar = one unit; cells show absolute value. The sign is written in the label. A and B are the original fractions, not necessarily the signed contributions to subtraction.',
            )}
          </figcaption>
        </figure>
      ) : additive ? (
        <p>
          {t(
            'Pour ces valeurs, suivez les fractions exactes ci-dessus. Les bandes ne sont montrées que pour des parts assez grandes et des valeurs entre −1 et 1, afin de rester lisibles.',
            'For these values, follow the exact fractions above. Bars are shown only for sufficiently large parts and values between −1 and 1, so they stay readable.',
          )}
        </p>
      ) : null}
      <p>
        {t(
          'Expliquer : pourquoi garde-t-on un dénominateur commun pour additionner ou soustraire, alors qu’un produit se calcule directement ? Pour une division, vérifiez en multipliant le résultat par le diviseur.',
          'Explain: why do addition and subtraction need a common denominator, while multiplication can proceed directly? For division, check by multiplying the result by the divisor.',
        )}
      </p>
    </>
  );
}

export default function FractionExplorer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);
  const [ready, setReady] = useState(false);
  const [raw, setRaw] = useState(initial);
  const [operation, setOperation] = useState<FractionOperation>('add');
  useEffect(() => setReady(true), []);
  const values = raw.map((s) => (s.trim() === '' ? NaN : Number(s)));
  const reset = () => {
    setRaw([...initial]);
    setOperation('add');
  };
  const names = fr
    ? ['Addition', 'Soustraction', 'Multiplication', 'Division']
    : ['Addition', 'Subtraction', 'Multiplication', 'Division'];
  return (
    <section
      className="algebra-lab method-lab"
      data-fraction-lab
      aria-labelledby="fractions-title"
    >
      <p className="algebra-title" id="fractions-title">
        {t(
          'À vous : les quatre opérations sur les fractions',
          'Your turn: the four fraction operations',
        )}
      </p>
      <p>
        {t(
          'Objectif : choisir la bonne règle et suivre chaque transformation, du calcul initial à la fraction simplifiée.',
          'Goal: choose the right rule and follow every transformation from the original calculation to the reduced fraction.',
        )}
      </p>
      <p>
        <strong>
          {t(
            'Prédire : 1/2 + 1/3 donne-t-il 2/5 ? Quelle opération permettrait de multiplier directement les dénominateurs ?',
            'Predict: does 1/2 + 1/3 give 2/5? Which operation lets you multiply denominators directly?',
          )}
        </strong>
      </p>
      <div className="method-live">
        <fieldset hidden={!ready}>
          <legend>
            {t('Manipuler les fractions', 'Manipulate the fractions')}
          </legend>
          <label htmlFor="fraction-operation">
            {t('Opération', 'Operation')}
            <select
              id="fraction-operation"
              value={operation}
              onChange={(e) =>
                setOperation(e.target.value as FractionOperation)
              }
            >
              {(['add', 'subtract', 'multiply', 'divide'] as const).map(
                (op, i) => (
                  <option key={op} value={op}>
                    {names[i]}
                  </option>
                ),
              )}
            </select>
          </label>
          <div className="method-controls">
            {raw.map((value, i) => (
              <label key={i} htmlFor={`fraction-${i}`}>
                {
                  (fr
                    ? [
                        'Numérateur de A',
                        'Dénominateur de A',
                        'Numérateur de B',
                        'Dénominateur de B',
                      ]
                    : [
                        'A numerator',
                        'A denominator',
                        'B numerator',
                        'B denominator',
                      ])[i]
                }
                <input
                  id={`fraction-${i}`}
                  type="number"
                  min="-12"
                  max="12"
                  step="1"
                  value={value}
                  aria-describedby="fraction-input-help"
                  aria-invalid={
                    !Number.isInteger(values[i]) ||
                    Math.abs(values[i]!) > 12 ||
                    (i % 2 === 1 && values[i] === 0)
                  }
                  onChange={(e) =>
                    setRaw((current) =>
                      current.map((s, j) => (i === j ? e.target.value : s)),
                    )
                  }
                />
              </label>
            ))}
          </div>
          <p id="fraction-input-help">
            {t(
              'Entiers de −12 à 12 ; dénominateurs non nuls. La fenêtre de l’atelier ne limite pas les règles mathématiques.',
              'Integers from −12 to 12; nonzero denominators. The workshop window does not limit the mathematical rules.',
            )}
          </p>
          <div className="method-actions">
            {[
              {
                op: 'subtract',
                values: ['3', '4', '1', '6'],
                label: '3/4 − 1/6',
              },
              {
                op: 'multiply',
                values: ['2', '3', '3', '5'],
                label: '2/3 × 3/5',
              },
              {
                op: 'divide',
                values: ['3', '4', '9', '8'],
                label: '3/4 ÷ 9/8',
              },
            ].map((p) => (
              <button
                type="button"
                key={p.op}
                onClick={() => {
                  setOperation(p.op as FractionOperation);
                  setRaw(p.values);
                }}
              >
                {p.label}
              </button>
            ))}
            <button type="button" onClick={reset}>
              {t('Réinitialiser', 'Reset')}
            </button>
          </div>
        </fieldset>
        <p hidden={ready}>
          {t(
            'Exemple fixe : 1/2 + 1/3. Les étapes restent lisibles sans JavaScript.',
            'Fixed example: 1/2 + 1/3. Steps remain readable without JavaScript.',
          )}
        </p>
        <FractionView operation={operation} values={values} locale={locale} />
      </div>
      <div className="method-print">
        <p>
          {t(
            'Exemple de référence pour l’impression : addition. Les quatre méthodes figurent dans le mémo juste avant cet atelier.',
            'Print reference example: addition. All four methods are in the reminder just before this workshop.',
          )}
        </p>
        <FractionView operation="add" values={[1, 2, 1, 3]} locale={locale} />
      </div>
    </section>
  );
}
