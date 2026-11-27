import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import Tex from './Tex';
import '../styles/l39-panels.css';

const rules = [
  ['constant', 'Constante', 'Constant'],
  ['power', 'Puissance de x', 'Power of x'],
  ['sum', 'Somme', 'Sum'],
  ['factor', 'Facteur constant', 'Constant factor'],
  ['product', 'Produit', 'Product'],
  ['quotient', 'Quotient', 'Quotient'],
  ['chain', 'Composition', 'Composition'],
] as const;

const examples = [
  {
    expression: '9',
    rule: 'constant',
    reason: ['Aucune dépendance en x.', 'No dependence on x.'],
    steps: ['D(9)=0'],
  },
  {
    expression: 'x^5',
    rule: 'power',
    reason: [
      'La base est x et l’exposant est un entier positif.',
      'The base is x and the exponent is a positive integer.',
    ],
    steps: ['D(x^5)=5x^{5-1}', '5x^4'],
  },
  {
    expression: '4x^3+x-7',
    rule: 'sum',
    reason: [
      'La dernière opération combine des termes par addition ou soustraction.',
      'The outer operation combines terms by addition or subtraction.',
    ],
    steps: ['4D(x^3)+D(x)-D(7)', '12x^2+1'],
  },
  {
    expression: '7x^3',
    rule: 'factor',
    reason: [
      'Le facteur 7 est constant : il reste devant la dérivée.',
      'The factor 7 is constant: it stays in front of the derivative.',
    ],
    steps: ['7D(x^3)', '21x^2'],
  },
  {
    expression: 'x^3(x-2)',
    rule: 'product',
    reason: [
      'Les deux facteurs varient : garder un facteur non dérivé dans chaque terme.',
      'Both factors vary: keep an undifferentiated factor in each term.',
    ],
    steps: [
      'u=x^3,\\quad v=x-2',
      "u'=3x^2,\\quad v'=1",
      '3x^2(x-2)+x^3',
      '4x^3-6x^2',
    ],
  },
  {
    expression: '\\frac{x+2}{x-2}',
    rule: 'quotient',
    reason: [
      'La dernière opération divise deux expressions. Conserver la restriction du dénominateur.',
      'The last operation divides two expressions. Retain the denominator restriction.',
    ],
    steps: [
      'x\\ne2',
      "u'=1,\\quad v'=1",
      '\\frac{(x-2)-(x+2)}{(x-2)^2}',
      '-\\frac4{(x-2)^2},\\quad x\\ne2',
    ],
  },
  {
    expression: '(3x-2)^4',
    rule: 'chain',
    reason: [
      'La puissance agit sur un groupe entier, pas sur x seul.',
      'The power acts on an entire group, not on x alone.',
    ],
    steps: ["u=3x-2,\\quad u'=3", '4u^3\\cdot3', '12(3x-2)^3'],
  },
  {
    expression: '\\frac{(x+2)^3}{x-4}',
    rule: 'quotient',
    reason: [
      'Le quotient est extérieur ; la chaîne intervient ensuite dans le numérateur.',
      'The quotient is outermost; the chain rule then applies in the numerator.',
    ],
    steps: [
      'x\\ne4',
      "u=(x+2)^3,\\quad u'=3(x+2)^2",
      "v=x-4,\\quad v'=1",
      '\\frac{3(x+2)^2(x-4)-(x+2)^3}{(x-4)^2},\\quad x\\ne4',
    ],
  },
] as const;

function MathLine({ value }: { value: string }) {
  return <Tex text={'$' + value + '$'} />;
}

export default function DerivativeRuleLab({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(0);
  useEffect(() => setReady(true), []);
  const example = examples[index]!;
  const correct = checked && choice === example.rule;
  const reset = (next: number) => {
    setIndex(next);
    setChoice('');
    setChecked(false);
    setShown(0);
  };
  return (
    <section
      className="l39-panel l39-rule-lab"
      data-l39-rule-lab
      aria-labelledby={id}
    >
      <p id={id} className="l39-panel-title">
        {fr
          ? 'Atelier : quelle règle choisir ?'
          : 'Workshop: which rule to choose?'}
      </p>
      <p>
        {index + 1} / {examples.length}
      </p>
      <p className="l39-rule-math">
        <MathLine value={example.expression} />
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>
          {fr
            ? 'Règle la plus directe pour la forme écrite (sans développer)'
            : 'Most direct rule for the written form (without expanding)'}
        </legend>
        <label htmlFor={id + '-rule'}>
          {fr ? 'Choisir la règle' : 'Choose the rule'}
        </label>
        <select
          id={id + '-rule'}
          data-rule-choice
          value={choice}
          onChange={(event) => {
            setChoice(event.target.value);
            setChecked(false);
            setShown(0);
          }}
        >
          <option value="">{fr ? 'Sélectionner…' : 'Select…'}</option>
          {rules.map(([value, french, english]) => (
            <option key={value} value={value}>
              {fr ? french : english}
            </option>
          ))}
        </select>
        <div className="l39-actions">
          <button
            type="button"
            data-rule-check
            disabled={!choice || checked}
            onClick={() => setChecked(true)}
          >
            {fr ? 'Vérifier' : 'Check'}
          </button>
          <button
            type="button"
            data-rule-reveal
            disabled={!correct || shown === example.steps.length}
            onClick={() => setShown((n) => n + 1)}
          >
            {fr ? 'Étape suivante' : 'Next step'}
          </button>
        </div>
        <p role="status" data-rule-feedback>
          {checked &&
            (correct
              ? 'Correct. '
              : fr
                ? 'À revoir. Repérez la dernière opération. '
                : 'Try again. Identify the last operation. ')}
          {checked && example.reason[fr ? 0 : 1]}
        </p>
        {correct && (
          <ol data-rule-steps aria-live="polite">
            {example.steps.slice(0, shown).map((step, i) => (
              <li key={i} className="l39-rule-math">
                <MathLine value={step} />
              </li>
            ))}
          </ol>
        )}
        <div className="l39-actions">
          <button
            type="button"
            data-rule-prev
            disabled={index === 0}
            onClick={() => reset(index - 1)}
          >
            {fr ? 'Précédent' : 'Previous'}
          </button>
          <button
            type="button"
            data-rule-next
            disabled={index === examples.length - 1}
            onClick={() => reset(index + 1)}
          >
            {fr ? 'Exemple suivant' : 'Next example'}
          </button>
          <button type="button" data-rule-reset onClick={() => reset(0)}>
            {fr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      </fieldset>
      <div hidden={ready} data-rule-static>
        <p>
          {fr
            ? 'Exemple fixe : reconnaître une composition, puis dériver l’extérieur et l’intérieur.'
            : 'Fixed example: recognise a composition, then differentiate the outer and inner functions.'}
        </p>
        <p className="l39-rule-math">
          <MathLine value="(3x-2)^4" />
        </p>
        {examples[6].steps.map((step) => (
          <p key={step} className="l39-rule-math">
            <MathLine value={step} />
          </p>
        ))}
      </div>
      <div className="l39-rule-print">
        <p>
          {fr
            ? 'Exemple de révision : composition'
            : 'Revision example: composition'}
        </p>
        <p>
          <MathLine value="(3x-2)^4" />
        </p>
        {examples[6].steps.map((step) => (
          <p key={step}>
            <MathLine value={step} />
          </p>
        ))}
      </div>
    </section>
  );
}
