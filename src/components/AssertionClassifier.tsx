import { useEffect, useId, useState } from 'react';
import type { Locale } from '../lib/i18n';
import '../styles/l01-classifier.css';

const categories = [
  ['true', 'Assertion vraie', 'True assertion'],
  ['false', 'Assertion fausse', 'False assertion'],
  [
    'unknown',
    'Assertion : valeur non établie',
    'Assertion: value not established',
  ],
  ['none', 'Pas une assertion', 'Not an assertion'],
] as const;

const examples = [
  {
    sentence: [
      'Douze est divisible par quatre.',
      'Twelve is divisible by four.',
    ],
    answer: 'true',
    reason: [
      '12 = 3 × 4. Une valeur unique est établie : 1.',
      '12 = 3 × 4. One truth value is established: 1.',
    ],
  },
  {
    sentence: ['Vingt et un est pair.', 'Twenty-one is even.'],
    answer: 'false',
    reason: [
      '21 est impair. L’énoncé reste une assertion, de valeur 0.',
      '21 is odd. The statement is still an assertion, with value 0.',
    ],
  },
  {
    sentence: ['Quel est le résultat ?', 'What is the result?'],
    answer: 'none',
    reason: [
      'Une question demande une information, elle ne l’affirme pas.',
      'A question requests information rather than asserting it.',
    ],
  },
  {
    sentence: ['Ce programme est rapide.', 'This program is fast.'],
    answer: 'none',
    reason: [
      'Il manque un critère de rapidité et des conditions de mesure.',
      'A speed criterion and measurement conditions are missing.',
    ],
  },
  {
    sentence: [
      'Le fichier F, dans sa version enregistrée v1, dépasse 1000 octets.',
      'File F, in its recorded version v1, exceeds 1000 bytes.',
    ],
    answer: 'unknown',
    reason: [
      'La taille n’est pas fournie. La phrase a une valeur unique, mais on ne sait pas laquelle.',
      'The size is not supplied. The statement has one truth value, but we do not know which.',
    ],
  },
  {
    sentence: ['Lisez le prochain paragraphe.', 'Read the next paragraph.'],
    answer: 'none',
    reason: [
      'Une consigne ne décrit pas un fait vrai ou faux.',
      'An instruction does not state a true or false fact.',
    ],
  },
  {
    sentence: [
      'L’énoncé que vous lisez ici est faux.',
      'The statement you are reading here is false.',
    ],
    answer: 'none',
    reason: [
      'Vraie implique fausse, et fausse implique vraie : aucune valeur cohérente.',
      'True implies false, and false implies true: no consistent value.',
    ],
  },
  {
    sentence: [
      'Cette phrase contient le mot « phrase ».',
      'This sentence contains the word “sentence”.',
    ],
    answer: 'true',
    reason: [
      'On peut vérifier le texte. L’auto-référence n’est pas toujours paradoxale.',
      'We can inspect the text. Self-reference is not always paradoxical.',
    ],
  },
] as const;

export default function AssertionClassifier({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const id = useId();
  const lang = fr ? 0 : 1;
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => setReady(true), []);

  const example = examples[index]!;
  const move = (next: number) => {
    setIndex(next);
    setChoice(null);
  };

  return (
    <section
      className="l01-classifier"
      data-l01-classifier
      aria-labelledby={id}
    >
      <p id={id}>
        <strong>
          {fr
            ? 'Atelier : est-ce une assertion ?'
            : 'Workshop: is it an assertion?'}
        </strong>
      </p>
      <fieldset hidden={!ready} disabled={!ready}>
        <legend>
          {fr ? 'Classer la phrase' : 'Classify the sentence'} ({index + 1}/
          {examples.length})
        </legend>
        <p data-classifier-sentence>{example.sentence[lang]}</p>
        <div className="l01-options">
          {categories.map(([value, french, english]) => (
            <button
              type="button"
              key={value}
              data-classifier-choice={value}
              aria-pressed={choice === value}
              onClick={() => setChoice(value)}
            >
              {fr ? french : english}
            </button>
          ))}
        </div>
        <p role="status" aria-atomic="true" data-classifier-feedback>
          {choice !== null && (
            <>
              <strong>
                {choice === example.answer
                  ? fr
                    ? 'Bonne réponse. '
                    : 'Correct. '
                  : fr
                    ? 'À revoir. '
                    : 'Try again. '}
              </strong>
              {example.reason[lang]}
            </>
          )}
        </p>
        <div className="l01-navigation">
          <button
            type="button"
            data-classifier-prev
            disabled={index === 0}
            onClick={() => move(index - 1)}
          >
            {fr ? 'Précédent' : 'Previous'}
          </button>
          <button type="button" data-classifier-reset onClick={() => move(0)}>
            {fr ? 'Recommencer' : 'Restart'}
          </button>
          <button
            type="button"
            data-classifier-next
            disabled={index === examples.length - 1}
            onClick={() => move(index + 1)}
          >
            {fr ? 'Suivant' : 'Next'}
          </button>
        </div>
      </fieldset>
      <div data-classifier-static hidden={ready}>
        <p>
          {fr
            ? 'Exemple fixe : « Seize est impair. »'
            : 'Fixed example: “Sixteen is odd.”'}
        </p>
        <p>
          {fr
            ? 'Assertion fausse : 16 = 2 × 8. Sa valeur est 0, pas une absence de valeur.'
            : 'False assertion: 16 = 2 × 8. Its value is 0, not an absence of a value.'}
        </p>
      </div>
    </section>
  );
}
