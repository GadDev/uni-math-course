import { useEffect, useId, useState, type ReactNode } from 'react';
import {
  averageLength,
  binaryWords,
  codes,
  decodings,
  distribution,
  encode,
  entropy,
  huffman,
  isPrefixFree,
  type CodeName,
  type HuffmanNode,
} from '../lib/information-labs';
import '../styles/information-labs.css';

type Locale = 'fr' | 'en';
type Lesson = 43 | 44 | 45 | 46 | 47 | 48 | 49;
interface ActivityProps {
  locale: Locale;
  ready: boolean;
  print?: boolean;
}
const word = (value: string) => value || 'ε';
const number = (value: number, locale: Locale) =>
  (Object.is(value, -0) ? 0 : value).toLocaleString(locale, {
    maximumFractionDigits: 4,
  });
const copy = (locale: Locale) => (fr: string, en: string) =>
  locale === 'fr' ? fr : en;

function Numeric({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step="1"
        value={Number.isNaN(value) ? '' : value}
        aria-invalid={!Number.isInteger(value) || value < min || value > max}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
      />
    </label>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="info-actions">{children}</div>;
}

function CodeSelect({
  value,
  set,
  locale,
}: {
  value: CodeName;
  set: (value: CodeName) => void;
  locale: Locale;
}) {
  const id = useId();
  const t = copy(locale);
  return (
    <label htmlFor={id}>
      {t('Table de codage', 'Code table')}
      <select
        id={id}
        value={value}
        onChange={(e) => set(e.target.value as CodeName)}
      >
        {Object.keys(codes).map((name) => (
          <option key={name} value={name}>
            {name} :{' '}
            {Object.entries(codes[name as CodeName])
              .map(([s, w]) => `${s}→${w}`)
              .join(', ')}
          </option>
        ))}
      </select>
    </label>
  );
}

function Counts({
  values,
  set,
  minimum,
  locale,
  letters = 'xyz',
}: {
  values: number[];
  set: (values: number[]) => void;
  minimum: number;
  locale: Locale;
  letters?: string;
}) {
  const id = useId();
  const t = copy(locale);
  return (
    <div className="info-counts">
      {values.map((value, i) => (
        <Numeric
          key={i}
          id={`${id}-${i}`}
          label={`${t('Effectif', 'Count')} ${letters[i]} (${minimum}–20)`}
          value={value}
          min={minimum}
          max={20}
          onChange={(next) => set(values.map((n, j) => (i === j ? next : n)))}
        />
      ))}
    </div>
  );
}

function Bars({
  values,
  labels,
  locale,
}: {
  values: number[];
  labels: string[];
  locale: Locale;
}) {
  const t = copy(locale);
  return (
    <figure className="info-figure">
      <svg
        viewBox="0 0 440 185"
        role="img"
        aria-label={t(
          'Probabilités : longueur proportionnelle à p, de 0 à 1',
          'Probabilities: bar lengths proportional to p, from 0 to 1',
        )}
      >
        {[0, 0.5, 1].map((tick) => (
          <g key={tick}>
            <line
              x1={65 + 275 * tick}
              x2={65 + 275 * tick}
              y1="18"
              y2="145"
              stroke="currentColor"
              strokeDasharray="3 4"
              opacity="0.4"
            />
            <text x={65 + 275 * tick} y="169" textAnchor="middle">
              {number(tick, locale)}
            </text>
          </g>
        ))}
        {values.map((p, i) => (
          <g key={i}>
            <text x="8" y={43 + i * 40}>
              {labels[i]}
            </text>
            <rect
              x="65"
              y={25 + i * 40}
              width={275 * p}
              height="24"
              fill="currentColor"
              opacity="0.7"
            />
            <text x="355" y={43 + i * 40}>
              {number(p, locale)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        {t(
          'Échelle commune : une barre entière vaut 1. Le tableau donne aussi les fractions exactes.',
          'Common scale: a full bar represents 1. The table also gives exact fractions.',
        )}
      </figcaption>
    </figure>
  );
}

function Bits({ locale, ready, print }: ActivityProps) {
  const t = copy(locale),
    id = useId();
  const [n, setN] = useState(3),
    [m, setM] = useState(9);
  const valid =
    Number.isInteger(n) &&
    n >= 0 &&
    n <= 8 &&
    Number.isInteger(m) &&
    m >= 1 &&
    m <= 256;
  const capacity = 2 ** n;
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>{t('Choisir une capacité', 'Choose a capacity')}</legend>
        <Numeric
          id={`${id}-n`}
          label={t('Nombre de bits n (0–8)', 'Number of bits n (0–8)')}
          value={n}
          min={0}
          max={8}
          onChange={setN}
        />
        <Numeric
          id={`${id}-m`}
          label={t('Nombre d’états M (1–256)', 'Number of states M (1–256)')}
          value={m}
          min={1}
          max={256}
          onChange={setM}
        />
        <Actions>
          <button
            onClick={() => {
              setN(3);
              setM(8);
            }}
          >
            {t('8 états', '8 states')}
          </button>
          <button
            onClick={() => {
              setN(0);
              setM(1);
            }}
          >
            {t('Mot vide', 'Empty word')}
          </button>
          <button
            data-reset
            onClick={() => {
              setN(3);
              setM(9);
            }}
          >
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {valid ? (
          <>
            2^{n} = {capacity} {t('mots possibles', 'possible words')}. M = {m}.{' '}
            {capacity >= m
              ? t(
                  `Capacité suffisante : ${capacity - m} mots inutilisés.`,
                  `Enough capacity: ${capacity - m} unused words.`,
                )
              : t(
                  `Capacité insuffisante : il manque ${m - capacity} mots.`,
                  `Insufficient capacity: ${m - capacity} words missing.`,
                )}{' '}
            {t('Minimum à longueur fixe', 'Fixed-length minimum')} :{' '}
            {Math.ceil(Math.log2(m))} bit(s).
          </>
        ) : (
          t(
            'Saisissez des entiers dans les intervalles indiqués.',
            'Enter integers within the stated ranges.',
          )
        )}
      </output>
      {valid && (
        <figure className="info-figure">
          <div className="info-words">
            {binaryWords(n)
              .slice(0, 16)
              .map((w) => (
                <code key={w}>{word(w)}</code>
              ))}
          </div>
          <figcaption>
            {t('Mots de longueur exactement', 'Words of length exactly')} {n}.{' '}
            {capacity > 16 &&
              t(
                `Les 16 premiers sur ${capacity} sont affichés.`,
                `Showing the first 16 of ${capacity}.`,
              )}{' '}
            {n === 0 &&
              t(
                'ε désigne l’unique mot vide, pas le bit 0.',
                'ε denotes the sole empty word, not the bit 0.',
              )}
          </figcaption>
        </figure>
      )}
    </>
  );
}

function Substitution({ locale, ready, print }: ActivityProps) {
  const t = copy(locale),
    id = useId();
  const [message, setMessage] = useState('xyzx'),
    [name, setName] = useState<CodeName>('c2');
  const valid = /^[xyz]{0,12}$/.test(message);
  const bits = valid ? encode(message, codes[name])! : '';
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>{t('Coder un message', 'Encode a message')}</legend>
        <CodeSelect value={name} set={setName} locale={locale} />
        <label htmlFor={id}>
          {t(
            'Message : x, y, z uniquement ; 12 symboles maximum',
            'Message: only x, y, z; at most 12 symbols',
          )}
          <input
            id={id}
            value={message}
            maxLength={12}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!valid}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <Actions>
          <button onClick={() => setMessage('zz')}>zz</button>
          <button onClick={() => setMessage('')}>ε</button>
          <button
            data-reset
            onClick={() => {
              setMessage('xyzx');
              setName('c2');
            }}
          >
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {valid ? (
          <>
            {name}({word(message)}) = <code>{word(bits)}</code> ;{' '}
            {message.length} {t('symboles source', 'source symbols')} →{' '}
            {bits.length} bits.
          </>
        ) : (
          t(
            'Utilisez seulement x, y et z (12 symboles maximum).',
            'Use only x, y and z (at most 12 symbols).',
          )
        )}
      </output>
      {valid && (
        <table>
          <caption>
            {t(
              'Concaténation : les séparations restent pédagogiques',
              'Concatenation: separators are teaching aids only',
            )}
          </caption>
          <thead>
            <tr>
              <th>{t('Étape', 'Step')}</th>
              <th>{t('Symbole', 'Symbol')}</th>
              <th>{t('Mot code', 'Codeword')}</th>
              <th>{t('Bits cumulés', 'Accumulated bits')}</th>
            </tr>
          </thead>
          <tbody>
            {[...message].map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{s}</td>
                <td>
                  <code>{codes[name][s as 'x' | 'y' | 'z']}</code>
                </td>
                <td>
                  <code>{encode(message.slice(0, i + 1), codes[name])}</code>
                </td>
              </tr>
            ))}
            {!message && (
              <tr>
                <td>0</td>
                <td>ε</td>
                <td>ε</td>
                <td>0 bit</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

function Decoding({ locale, ready, print }: ActivityProps) {
  const t = copy(locale),
    id = useId();
  const [name, setName] = useState<CodeName>('c1'),
    [bits, setBits] = useState('001');
  const valid = /^[01]{0,12}$/.test(bits);
  const results = valid ? decodings(bits, codes[name]) : [];
  const prefix = isPrefixFree(codes[name]);
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>
          {t('Chercher toutes les découpes', 'Find all parsings')}
        </legend>
        <CodeSelect value={name} set={setName} locale={locale} />
        <label htmlFor={id}>
          {t('Suite binaire (0–12 bits)', 'Binary string (0–12 bits)')}
          <input
            id={id}
            value={bits}
            maxLength={12}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!valid}
            onChange={(e) => setBits(e.target.value)}
          />
        </label>
        <Actions>
          <button
            onClick={() => {
              setName('c2');
              setBits('0010110');
            }}
          >
            c2 : 0010110
          </button>
          <button
            onClick={() => {
              setName('d');
              setBits('01011');
            }}
          >
            d : 01011
          </button>
          <button onClick={() => setBits('')}>ε</button>
          <button
            data-reset
            onClick={() => {
              setName('c1');
              setBits('001');
            }}
          >
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {!valid ? (
          t(
            'Saisissez uniquement 0 et 1 (12 bits maximum).',
            'Enter only 0 and 1 (at most 12 bits).',
          )
        ) : (
          <>
            {word(bits)} : {results.length}{' '}
            {t('décodage(s) complet(s)', 'complete decoding(s)')}.{' '}
            {results.length > 1
              ? t(
                  'Collision trouvée : ce code n’est pas à décodage unique.',
                  'Collision found: this code is not uniquely decodable.',
                )
              : results.length === 0
                ? t(
                    'Aucun message source ne donne ces bits avec cette table.',
                    'No source message produces these bits with this table.',
                  )
                : t(
                    'Ce mot a un seul décodage ; cela ne prouve pas une propriété de tous les messages.',
                    'This word has one decoding; that alone proves no property of all messages.',
                  )}
          </>
        )}
      </output>
      <p>
        {t(
          'Test de préfixe sur toute la table',
          'Prefix test on the whole table',
        )}{' '}
        : {prefix ? t('oui', 'yes') : t('non', 'no')}.{' '}
        {name === 'c2' &&
          t(
            'c2 est néanmoins à décodage unique, par l’argument des zéros donné dans la leçon.',
            'c2 is nevertheless uniquely decodable, by the zero-boundary argument in the lesson.',
          )}
      </p>
      {valid && results.length > 0 && (
        <table>
          <caption>
            {t(
              'Toutes les origines possibles de ces bits',
              'All possible origins of these bits',
            )}
          </caption>
          <thead>
            <tr>
              <th>{t('Message', 'Message')}</th>
              <th>
                {t(
                  'Découpe expliquée (barres non transmises)',
                  'Explained parsing (bars are not transmitted)',
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((message) => (
              <tr key={message}>
                <td>{word(message)}</td>
                <td>
                  <code>
                    {[...message]
                      .map((s) => codes[name][s as 'x' | 'y' | 'z'])
                      .join(' | ') || 'ε'}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function Frequencies({ locale, ready, print }: ActivityProps) {
  const t = copy(locale);
  const [counts, setCounts] = useState([6, 3, 1]);
  const ps = distribution(counts),
    total = counts.reduce((a, b) => a + b, 0);
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>
          {t('Observer puis normaliser', 'Observe then normalise')}
        </legend>
        <Counts values={counts} set={setCounts} minimum={0} locale={locale} />
        <Actions>
          <button onClick={() => setCounts([1, 1, 1])}>
            {t('Équiprobable', 'Uniform')}
          </button>
          <button onClick={() => setCounts([0, 3, 1])}>
            {t('x absent', 'No x observed')}
          </button>
          <button onClick={() => setCounts([0, 0, 0])}>
            {t('Échantillon vide', 'Empty sample')}
          </button>
          <button data-reset onClick={() => setCounts([6, 3, 1])}>
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {ps ? (
          <>
            N = {counts.join(' + ')} = {total}.{' '}
            {t('Somme des fréquences', 'Sum of frequencies')} = {total}/{total}{' '}
            = 1.
          </>
        ) : (
          t(
            'Il faut des effectifs entiers entre 0 et 20 et un total N strictement positif. Pour N = 0, les fréquences sont indéfinies.',
            'Counts must be integers from 0 to 20 with total N strictly positive. At N = 0, frequencies are undefined.',
          )
        )}
      </output>
      {ps && (
        <>
          <Bars values={ps} labels={['x', 'y', 'z']} locale={locale} />
          <table>
            <caption>
              {t(
                'Fréquences observées, pas garanties futures',
                'Observed frequencies, not future guarantees',
              )}
            </caption>
            <thead>
              <tr>
                <th>{t('Symbole', 'Symbol')}</th>
                <th>{t('Effectif', 'Count')}</th>
                <th>p̂ = nᵢ/N</th>
              </tr>
            </thead>
            <tbody>
              {ps.map((p, i) => (
                <tr key={i}>
                  <td>{'xyz'[i]}</td>
                  <td>{counts[i]}</td>
                  <td>
                    {counts[i]}/{total} ≈ {number(p, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {counts.includes(0) && (
            <p>
              {t(
                'Une fréquence empirique nulle ne démontre pas que le symbole est impossible. Pour appliquer le modèle pᵢ > 0, choisissez un support pertinent et un modèle, plutôt que de diviser par zéro ou de modifier les données en silence.',
                'A zero empirical frequency does not prove impossibility. To use the pᵢ > 0 model, choose an appropriate support and model rather than divide by zero or silently alter the data.',
              )}
            </p>
          )}
        </>
      )}
    </>
  );
}

function Mean({ locale, ready, print }: ActivityProps) {
  const t = copy(locale);
  const [counts, setCounts] = useState([2, 1, 1]),
    [name, setName] = useState<CodeName>('c2');
  const ps = distribution(counts, 1),
    total = counts.reduce((a, b) => a + b, 0);
  const lengths = Object.values(codes[name]).map((w) => w.length);
  const numerator = counts.reduce((sum, n, i) => sum + n * lengths[i]!, 0);
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>{t('Pondérer les longueurs', 'Weight the lengths')}</legend>
        <Counts values={counts} set={setCounts} minimum={1} locale={locale} />
        <CodeSelect value={name} set={setName} locale={locale} />
        <Actions>
          <button
            onClick={() => {
              setCounts([2, 1, 1]);
              setName('d');
            }}
          >
            d : L = 3/2
          </button>
          <button onClick={() => setCounts([1, 1, 1])}>
            {t('Même fréquence', 'Equal frequency')}
          </button>
          <button
            data-reset
            onClick={() => {
              setCounts([2, 1, 1]);
              setName('c2');
            }}
          >
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {ps ? (
          <>
            L({name}) = (
            {counts.map((n, i) => `${n} × ${lengths[i]}`).join(' + ')})/{total}{' '}
            = {numerator}/{total} ≈ {number(numerator / total, locale)}{' '}
            {t('bits par symbole source', 'bits per source symbol')}.{' '}
            {name === 'c1' &&
              t(
                'Attention : c1 est ambigu, même si sa moyenne est calculable.',
                'Warning: c1 is ambiguous, although its average can be calculated.',
              )}
          </>
        ) : (
          t(
            'Saisissez trois effectifs entiers de 1 à 20.',
            'Enter three integer counts from 1 to 20.',
          )
        )}
      </output>
      {ps && (
        <>
          <table>
            <caption>
              {t(
                'Chaque symbole apporte pᵢ fois sa longueur',
                'Each symbol contributes pᵢ times its length',
              )}
            </caption>
            <thead>
              <tr>
                <th>{t('Symbole', 'Symbol')}</th>
                <th>pᵢ</th>
                <th>{t('Code / longueur', 'Code / length')}</th>
                <th>pᵢ |wᵢ|</th>
              </tr>
            </thead>
            <tbody>
              {ps.map((p, i) => (
                <tr key={i}>
                  <td>{'xyz'[i]}</td>
                  <td>
                    {counts[i]}/{total}
                  </td>
                  <td>
                    {Object.values(codes[name])[i]} / {lengths[i]}
                  </td>
                  <td>
                    {counts[i]! * lengths[i]!}/{total} ≈{' '}
                    {number(p * lengths[i]!, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <caption>
              {t(
                'Comparer à distribution identique',
                'Compare using the same distribution',
              )}
            </caption>
            <thead>
              <tr>
                <th>{t('Code', 'Code')}</th>
                <th>L ≈</th>
                <th>{t('Décodage unique', 'Unique decoding')}</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(codes) as CodeName[]).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>
                    {number(
                      averageLength(
                        ps,
                        Object.values(codes[key]).map((w) => w.length),
                      ),
                      locale,
                    )}
                  </td>
                  <td>
                    {key === 'c1'
                      ? t('non : x et zy', 'no: x and zy')
                      : t('oui (voir L45)', 'yes (see L45)')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function Entropy({ locale, ready, print }: ActivityProps) {
  const t = copy(locale),
    id = useId();
  const [p, setP] = useState(0.25);
  const h = entropy([p, 1 - p]);
  const points = Array.from(
    { length: 101 },
    (_, i) =>
      `${55 + (330 * i) / 100},${235 - 180 * entropy([i / 100, 1 - i / 100])!}`,
  ).join(' ');
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>
          {t('Déplacer la probabilité', 'Change the probability')}
        </legend>
        <label htmlFor={id}>
          p(x) = {number(p, locale)} ; p(y) = 1 − p(x)
          <input
            id={id}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={p}
            onChange={(e) => setP(e.target.valueAsNumber)}
          />
        </label>
        <Actions>
          <button onClick={() => setP(0.5)}>p = 1/2</button>
          <button onClick={() => setP(0)}>p = 0</button>
          <button onClick={() => setP(1)}>p = 1</button>
          <button data-reset onClick={() => setP(0.25)}>
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        H = p(x) I(x) + p(y) I(y) ≈ {number(h!, locale)}{' '}
        {t('bit par symbole source', 'bits per source symbol')}.{' '}
        {p === 0 || p === 1
          ? t(
              'Source certaine : la contribution du symbole impossible vaut 0 par limite, sans calculer log₂(0).',
              'Certain source: the impossible symbol contributes 0 by a limit, without evaluating log₂(0).',
            )
          : t(
              'I(x) augmente quand p(x) diminue ; H tient compte des deux symboles.',
              'I(x) increases as p(x) decreases; H accounts for both symbols.',
            )}
      </output>
      <figure className="info-figure">
        <svg
          viewBox="0 0 440 290"
          role="img"
          aria-label={t(
            'Entropie binaire H en fonction de p(x), maximum 1 à p = 1/2',
            'Binary entropy H against p(x), maximum 1 at p = 1/2',
          )}
        >
          <path d="M55 45V235H395" fill="none" stroke="currentColor" />
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <text x={55 + v * 330} y="261" textAnchor="middle">
                {number(v, locale)}
              </text>
              <text x="37" y={241 - v * 180} textAnchor="end">
                {number(v, locale)}
              </text>
            </g>
          ))}
          <text x="55" y="25">
            H (bit/symbole)
          </text>
          <text x="398" y="282" textAnchor="end">
            p(x)
          </text>
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx={55 + p * 330}
            cy={235 - h! * 180}
            r="7"
            fill="currentColor"
          />
        </svg>
        <figcaption>
          {t(
            'Le point suit votre distribution. Les deux axes ont une échelle linéaire de 0 à 1. La courbe illustre le modèle binaire, pas toutes les sources.',
            'The point follows your distribution. Both axes are linear from 0 to 1. This curve illustrates the binary model, not every source.',
          )}
        </figcaption>
      </figure>
      <table>
        <caption>
          {t(
            'Surprise individuelle puis moyenne pondérée',
            'Individual surprise then weighted mean',
          )}
        </caption>
        <thead>
          <tr>
            <th>{t('Symbole', 'Symbol')}</th>
            <th>pᵢ</th>
            <th>Iᵢ = −log₂(pᵢ)</th>
            <th>pᵢ Iᵢ</th>
          </tr>
        </thead>
        <tbody>
          {[p, 1 - p].map((probability, i) => (
            <tr key={i}>
              <td>{'xy'[i]}</td>
              <td>{number(probability, locale)}</td>
              <td>
                {probability === 0
                  ? t('non définie (limite +∞)', 'undefined (limit +∞)')
                  : `≈ ${number(-Math.log2(probability), locale)}`}
              </td>
              <td>
                {probability === 0
                  ? t('0 par limite', '0 by a limit')
                  : `≈ ${number(-probability * Math.log2(probability), locale)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Tree({ forest, locale }: { forest: HuffmanNode[]; locale: Locale }) {
  const t = copy(locale);
  const leaves = (node: HuffmanNode): number =>
    node.left && node.right ? leaves(node.left) + leaves(node.right) : 1;
  const draw = (
    node: HuffmanNode,
    lo: number,
    hi: number,
    depth: number,
    path: string,
  ): ReactNode => {
    const x = (lo + hi) / 2,
      y = 32 + depth * 72;
    const children = node.left && node.right;
    const split = children
      ? lo + ((hi - lo) * leaves(node.left!)) / leaves(node)
      : x;
    return (
      <g key={path}>
        {children &&
          [node.left!, node.right!].map((child, i) => {
            const a = i === 0 ? lo : split,
              b = i === 0 ? split : hi,
              childX = (a + b) / 2;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={y + 15}
                  x2={childX}
                  y2={y + 57}
                  stroke="currentColor"
                />
                <text
                  x={(x + childX) / 2 + (i ? 10 : -10)}
                  y={y + 43}
                  textAnchor="middle"
                >
                  {i}
                </text>
                {draw(child, a, b, depth + 1, path + i)}
              </g>
            );
          })}
        <rect
          x={x - (children ? 25 : 34)}
          y={y - 16}
          width={children ? 50 : 68}
          height="32"
          rx="4"
          fill="var(--paper)"
          stroke="currentColor"
        />
        <text x={x} y={y + 6} textAnchor="middle">
          {children ? node.weight : `${node.symbols}:${node.weight}`}
        </text>
      </g>
    );
  };
  return (
    <figure className="info-figure">
      <svg
        viewBox="0 0 440 285"
        role="img"
        aria-label={t(
          'Forêt de Huffman : poids des nœuds, branche gauche 0, droite 1 ; détails dans la trace et la table',
          'Huffman forest: node weights, left edge 0, right edge 1; details in the trace and table',
        )}
      >
        {forest.map((node, i) => {
          const total = forest.reduce((sum, tree) => sum + leaves(tree), 0);
          const before = forest
            .slice(0, i)
            .reduce((sum, tree) => sum + leaves(tree), 0);
          return draw(
            node,
            5 + (before * 430) / total,
            5 + ((before + leaves(node)) * 430) / total,
            0,
            String(i),
          );
        })}
      </svg>
      <figcaption>
        {t(
          'Les boîtes avec une lettre sont les feuilles. Un nœud intérieur porte la somme des poids de ses descendants. Les positions ne représentent pas une échelle numérique.',
          'Lettered boxes are leaves. An internal node carries the sum of descendant weights. Positions have no numerical scale.',
        )}
      </figcaption>
    </figure>
  );
}

export function HuffmanDiagram({ locale }: { locale: Locale }) {
  return <Tree locale={locale} forest={[huffman([8, 4, 2, 2])!.root]} />;
}

function Huffman({ locale, ready, print }: ActivityProps) {
  const t = copy(locale);
  const [counts, setCounts] = useState([8, 4, 2, 2]),
    [step, setStep] = useState(print ? 3 : 0);
  const result = huffman(counts);
  const current = result?.steps[step];
  const change = (values: number[]) => {
    setCounts(values);
    setStep(0);
  };
  const ps = distribution(counts, 1);
  return (
    <>
      <fieldset className="info-controls" hidden={!ready || print}>
        <legend>
          {t(
            'Construire l’arbre, une fusion à la fois',
            'Build the tree, one merge at a time',
          )}
        </legend>
        <Counts
          values={counts}
          set={change}
          minimum={1}
          locale={locale}
          letters="ABCD"
        />
        <Actions>
          <button
            disabled={!result || step === 0}
            onClick={() => setStep(step - 1)}
          >
            {t('Étape précédente', 'Previous step')}
          </button>
          <button
            data-step
            disabled={!result || step === 3}
            onClick={() => setStep(step + 1)}
          >
            {t('Fusion suivante', 'Next merge')}
          </button>
          <button onClick={() => change([1, 1, 1, 1])}>
            {t('Poids égaux', 'Equal weights')}
          </button>
          <button onClick={() => change([20, 1, 1, 1])}>
            {t('A très fréquent', 'Very frequent A')}
          </button>
          <button data-reset onClick={() => change([8, 4, 2, 2])}>
            {t('Réinitialiser', 'Reset')}
          </button>
        </Actions>
      </fieldset>
      <output aria-live={print ? 'off' : 'polite'}>
        {current ? (
          <>
            {t('Étape', 'Step')} {step}/3.{' '}
            {current.pair
              ? `${current.pair[0].symbols} (${current.pair[0].weight}) + ${current.pair[1].symbols} (${current.pair[1].weight}) = ${current.pair[0].weight + current.pair[1].weight}. `
              : t(
                  'Choisissez les deux poids minimaux.',
                  'Choose the two smallest weights.',
                )}
            {step < 3
              ? t(
                  `Prochaine paire : ${current.forest[0]!.symbols} et ${current.forest[1]!.symbols}.`,
                  `Next pair: ${current.forest[0]!.symbols} and ${current.forest[1]!.symbols}.`,
                )
              : t(
                  'Une racine : la construction est terminée.',
                  'One root: construction is complete.',
                )}
          </>
        ) : (
          t(
            'Quatre effectifs entiers de 1 à 20 sont nécessaires.',
            'Four integer counts from 1 to 20 are required.',
          )
        )}
      </output>
      {result && current && ps && (
        <>
          <Tree forest={current.forest} locale={locale} />
          <ol className="info-trace">
            {result.steps.slice(1, step + 1).map((s, i) => (
              <li key={i}>
                {s.pair![0].symbols}:{s.pair![0].weight} + {s.pair![1].symbols}:
                {s.pair![1].weight} → {s.pair![0].weight + s.pair![1].weight}.{' '}
                {t('Nouvelle liste triée', 'New sorted list')} :{' '}
                {s.forest
                  .map((node) => `${node.symbols}:${node.weight}`)
                  .join(', ')}
                .
              </li>
            ))}
          </ol>
          {step === 3 && (
            <>
              <table>
                <caption>
                  {t(
                    'Lire les chemins : 0 à gauche, 1 à droite',
                    'Read paths: 0 left, 1 right',
                  )}
                </caption>
                <thead>
                  <tr>
                    <th>{t('Symbole', 'Symbol')}</th>
                    <th>{t('Poids', 'Weight')}</th>
                    <th>{t('Code', 'Code')}</th>
                    <th>nᵢ |wᵢ|</th>
                  </tr>
                </thead>
                <tbody>
                  {[...'ABCD'].map((s, i) => (
                    <tr key={s}>
                      <td>{s}</td>
                      <td>{counts[i]}</td>
                      <td>{result.code[s]}</td>
                      <td>
                        {counts[i]} × {result.code[s]!.length} ={' '}
                        {counts[i]! * result.code[s]!.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                {t(
                  'Total des bits pour ces effectifs',
                  'Total bits for these counts',
                )}{' '}
                ={' '}
                {counts
                  .map((n, i) => n * result.code['ABCD'[i]!]!.length)
                  .reduce((a, b) => a + b, 0)}
                . L ≈{' '}
                {number(
                  averageLength(
                    ps,
                    [...'ABCD'].map((s) => result.code[s]!.length),
                  ),
                  locale,
                )}{' '}
                {t(
                  'bits par symbole ; code fixe : 2. Le coût de l’arbre est exclu.',
                  'bits per symbol; fixed code: 2. The tree cost is excluded.',
                )}
              </p>
            </>
          )}
        </>
      )}
    </>
  );
}

const activities = {
  43: Bits,
  44: Substitution,
  45: Decoding,
  46: Frequencies,
  47: Mean,
  48: Entropy,
  49: Huffman,
};

export default function InformationExplorer({
  lesson,
  locale,
}: {
  lesson: Lesson;
  locale: Locale;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const Activity = activities[lesson],
    t = copy(locale);
  return (
    <section
      className="info-lab"
      data-info-lesson={lesson}
      data-ready={ready}
      aria-label={t('Laboratoire guidé', 'Guided laboratory')}
    >
      <div className="info-screen">
        <Activity locale={locale} ready={ready} />
        {!ready && (
          <p className="info-static-note">
            {t(
              'Exemple de référence lisible sans JavaScript. Les commandes deviennent disponibles avec JavaScript.',
              'Reference example readable without JavaScript. Controls become available with JavaScript.',
            )}
          </p>
        )}
      </div>
      <div className="info-print">
        <p>
          <strong>
            {t(
              'Expérience sur papier — exemple de référence',
              'Paper experiment — reference example',
            )}
          </strong>
        </p>
        <Activity locale={locale} ready={false} print />
      </div>
      <p className="info-rounding">
        {t(
          'Le signe ≈ annonce une valeur décimale arrondie à quatre décimales au plus ; les fractions restent exactes.',
          'The ≈ sign indicates a decimal rounded to at most four places; fractions remain exact.',
        )}
      </p>
    </section>
  );
}
