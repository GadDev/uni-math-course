import { useId, useState } from 'react';
import {
  binaryBlocks,
  entropy,
  entropyBound,
  gibbs,
  kraft,
  canonicalPrefix,
  probabilities,
  questionTree,
  type TheoryNode,
} from '../lib/information-theory';
import '../styles/information-labs.css';
import './information-theory-lab.css';

type Mode = 'decisions' | 'kraft' | 'gibbs' | 'bound' | 'blocks';
type Props = { mode: Mode; locale: 'fr' | 'en' };
const number = (x: number, locale: string) =>
  x.toLocaleString(locale, { maximumFractionDigits: 5 });

/** Every branch asks whether the symbol belongs to the right-hand set: no=0, yes=1. */
function Tree({ root, fr }: { root: TheoryNode; fr: boolean }) {
  let leaf = 0;
  const count = root.labels.length;
  const nodes: {
    node: TheoryNode;
    x: number;
    y: number;
    parent?: { x: number; y: number };
    bit?: string;
  }[] = [];
  const visit = (node: TheoryNode, depth: number): { x: number; y: number } => {
    const y = 24 + depth * 65;
    if (node.symbol !== undefined) {
      const point = { x: 30 + leaf++ * (580 / Math.max(1, count - 1)), y };
      nodes.push({ node, ...point });
      return point;
    }
    const left = visit(node.left!, depth + 1),
      right = visit(node.right!, depth + 1);
    const point = { x: (left.x + right.x) / 2, y };
    nodes.find((n) => n.node === node.left)!.parent = point;
    nodes.find((n) => n.node === node.left)!.bit = '0';
    nodes.find((n) => n.node === node.right)!.parent = point;
    nodes.find((n) => n.node === node.right)!.bit = '1';
    nodes.push({ node, ...point });
    return point;
  };
  visit(root, 0);
  const height = Math.max(...nodes.map((n) => n.y)) + 24;
  return (
    <svg
      className="theory-tree"
      viewBox={`0 0 640 ${height}`}
      role="img"
      aria-label={
        fr
          ? 'Arbre de questions : non 0 à gauche, oui 1 à droite. Les chemins sont détaillés dans la table.'
          : 'Question tree: no 0 left, yes 1 right. Paths are detailed in the table.'
      }
    >
      {nodes
        .filter((n) => n.parent)
        .map((n) => (
          <g key={`edge-${n.node.labels.join('')}`}>
            <line x1={n.parent!.x} y1={n.parent!.y} x2={n.x} y2={n.y} />
            <text x={(n.x + n.parent!.x) / 2 + 8} y={(n.y + n.parent!.y) / 2}>
              {n.bit}
            </text>
          </g>
        ))}
      {nodes.map((n) => (
        <g key={n.node.labels.join('')}>
          <circle cx={n.x} cy={n.y} r={16} />
          <text x={n.x} y={n.y + 5} textAnchor="middle">
            {n.node.symbol ?? '?'}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function InformationTheoryLab({ mode, locale }: Props) {
  const fr = locale === 'fr',
    id = useId();
  const [raw, setRaw] = useState(
    mode === 'blocks' ? ['2', '1'] : ['2', '1', '1'],
  );
  const [qRaw, setQRaw] = useState(['1', '1', '2']);
  const [lengthRaw, setLengthRaw] = useState(
    mode === 'kraft' ? ['1', '2', '3', '3'] : ['1', '2', '2'],
  );
  const [strategy, setStrategy] = useState<
    'huffman' | 'balanced' | 'sequential'
  >('huffman');
  const [preset, setPreset] = useState('three');
  const [blockSize, setBlockSize] = useState(2);
  const [symbol, setSymbol] = useState('A');
  const [mergeStep, setMergeStep] = useState(0);
  const valid = (values: string[], max: number) =>
    values.every((v) => /^\d+$/.test(v) && +v >= 1 && +v <= max);
  const weights = raw.map(Number),
    lengths = lengthRaw.map(Number);
  const p = valid(raw, 20) ? probabilities(weights) : null;
  const k = valid(lengthRaw, 8) ? kraft(lengths) : null;
  const q = valid(qRaw, 20) ? probabilities(qRaw.map(Number)) : null;
  const tree =
    p && mode === 'decisions' ? questionTree(weights, strategy) : null;
  const comparison = p && q ? gibbs(p, q) : null;
  const exactlySameModel =
    comparison &&
    weights.every(
      (w, i) =>
        w * qRaw.map(Number).reduce((a, b) => a + b, 0) ===
        Number(qRaw[i]) * weights.reduce((a, b) => a + b, 0),
    );
  const bound = p && k ? entropyBound(weights, lengths) : null;
  const blocks =
    p && mode === 'blocks' ? binaryBlocks(weights, blockSize) : null;
  const title = {
    decisions: fr ? 'Des questions aux codes' : 'From questions to codes',
    kraft: fr ? 'Explorer les longueurs' : 'Explore code lengths',
    gibbs: fr ? 'Comparer deux modèles' : 'Compare two models',
    bound: fr ? 'Suivre la preuve numérique' : 'Follow the numerical proof',
    blocks: fr ? 'Coder par blocs indépendants' : 'Code independent blocks',
  }[mode];
  function inputs(
    values: string[],
    update: (v: string[]) => void,
    label: string,
    max: number,
  ) {
    return (
      <div className="theory-inputs">
        {values.map((v, i) => (
          <label key={i}>
            {label} {String.fromCharCode(65 + i)}
            <input
              type="number"
              min="1"
              max={max}
              step="1"
              value={v}
              onChange={(e) => {
                update(
                  values.map((old, j) => (i === j ? e.target.value : old)),
                );
                setMergeStep(0);
              }}
            />
          </label>
        ))}
      </div>
    );
  }
  function reset() {
    setRaw(mode === 'blocks' ? ['2', '1'] : ['2', '1', '1']);
    setQRaw(['1', '1', '2']);
    setLengthRaw(mode === 'kraft' ? ['1', '2', '3', '3'] : ['1', '2', '2']);
    setStrategy('huffman');
    setPreset('three');
    setBlockSize(2);
    setSymbol('A');
    setMergeStep(0);
  }
  const invalid =
    (mode !== 'kraft' && !p) ||
    ((mode === 'kraft' || mode === 'bound') && !k) ||
    (mode === 'gibbs' && !q);
  return (
    <section
      className="theory-lab"
      data-theory-lab={mode}
      aria-labelledby={`${id}-title`}
    >
      <h3 id={`${id}-title`}>{title}</h3>
      <p className="theory-static">
        {fr
          ? 'Référence initiale calculée ci-dessous. Les exemples et solutions de la leçon restent utilisables sans JavaScript et à l’impression.'
          : 'The initial reference is calculated below. Lesson examples and solutions remain usable without JavaScript and in print.'}
      </p>
      <p>
        {fr
          ? 'Décimales arrondies à cinq chiffres après la virgule. Une égalité théorique ne se déduit pas de valeurs arrondies identiques.'
          : 'Decimals are rounded to five places. Identical rounded values do not establish a theoretical equality.'}
      </p>
      <fieldset className="theory-controls">
        <legend>
          {fr ? 'Paramètres de l’expérience' : 'Experiment settings'}
        </legend>
        {mode === 'decisions' && (
          <>
            <div className="theory-field">
              <label htmlFor={`${id}-source`}>{fr ? 'Source' : 'Source'}</label>
              <select
                id={`${id}-source`}
                value={preset}
                onChange={(e) => {
                  setPreset(e.target.value);
                  setRaw(
                    e.target.value === 'die'
                      ? ['1', '1', '1', '1', '1', '1']
                      : ['2', '1', '1'],
                  );
                  setSymbol('A');
                }}
              >
                <option value="three">
                  {fr ? 'Trois symboles (2, 1, 1)' : 'Three symbols (2, 1, 1)'}
                </option>
                <option value="die">
                  {fr
                    ? 'Six faces (effectifs initiaux égaux)'
                    : 'Six faces (equal initial counts)'}
                </option>
              </select>
            </div>
            <div className="theory-field">
              <label htmlFor={`${id}-strategy`}>
                {fr ? 'Stratégie' : 'Strategy'}
              </label>
              <select
                id={`${id}-strategy`}
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as typeof strategy)}
              >
                <option value="huffman">Huffman</option>
                <option value="balanced">
                  {fr
                    ? 'Partager les symboles en deux'
                    : 'Split the symbols in two'}
                </option>
                <option value="sequential">
                  {fr
                    ? 'Tester un symbole à la fois'
                    : 'Test one symbol at a time'}
                </option>
              </select>
            </div>
          </>
        )}
        {mode !== 'kraft' && inputs(raw, setRaw, fr ? 'Effectif' : 'Count', 20)}
        {mode === 'gibbs' &&
          inputs(
            qRaw,
            setQRaw,
            fr ? 'Poids du modèle q' : 'Model q weight',
            20,
          )}
        {(mode === 'kraft' || mode === 'bound') &&
          inputs(lengthRaw, setLengthRaw, fr ? 'Longueur' : 'Length', 8)}
        {mode === 'blocks' && (
          <div className="theory-field">
            <label htmlFor={`${id}-block-size`}>
              {fr ? 'Symboles par bloc n' : 'Symbols per block n'}
            </label>
            <select
              id={`${id}-block-size`}
              value={blockSize}
              onChange={(e) => {
                setBlockSize(+e.target.value);
                setMergeStep(0);
              }}
            >
              {[1, 2, 3].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
        {mode === 'decisions' && (
          <div className="theory-field">
            <label htmlFor={`${id}-symbol`}>
              {fr ? 'Symbole à retrouver' : 'Symbol to identify'}
            </label>
            <select
              id={`${id}-symbol`}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              {raw.map((_, i) => (
                <option key={i}>{String.fromCharCode(65 + i)}</option>
              ))}
            </select>
          </div>
        )}
        {mode === 'gibbs' && (
          <button type="button" onClick={() => setQRaw([...raw])}>
            {fr ? 'Utiliser q = p' : 'Use q = p'}
          </button>
        )}
        {blocks && (
          <button
            type="button"
            data-merge
            disabled={mergeStep >= blocks.merges.length}
            onClick={() => setMergeStep((s) => s + 1)}
          >
            {fr ? 'Expliquer la fusion suivante' : 'Explain the next merge'} (
            {mergeStep}/{blocks.merges.length})
          </button>
        )}
        <button type="button" onClick={reset} data-reset>
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>
      </fieldset>
      <div className="theory-results" aria-live="polite" aria-atomic="true">
        <div
          className="theory-state"
          key={[
            ...raw,
            ...qRaw,
            ...lengthRaw,
            strategy,
            blockSize,
            preset,
            symbol,
          ].join('|')}
        >
          {invalid && (
            <p role="alert">
              {fr
                ? 'Saisissez des entiers de 1 à 20 pour les effectifs et de 1 à 8 pour les longueurs. Aucune valeur invalide n’est remplacée automatiquement.'
                : 'Enter integer counts from 1 to 20 and lengths from 1 to 8. Invalid values are not replaced automatically.'}
            </p>
          )}
          {!invalid && (
            <>
              {mode !== 'kraft' && (
                <p>
                  {fr
                    ? 'Modèle : probabilités = effectifs / total.'
                    : 'Model: probabilities = counts / total.'}{' '}
                  {mode === 'blocks' &&
                    (fr
                      ? 'Les symboles successifs sont indépendants et de même loi.'
                      : 'Successive symbols are independent and identically distributed.')}
                </p>
              )}
              {tree && p && (
                <>
                  <Tree root={tree.root} fr={fr} />
                  <p>
                    {fr
                      ? 'À chaque nœud : « Le symbole appartient-il à la branche droite ? » Non = 0 ; oui = 1.'
                      : 'At each node: “Does the symbol belong to the right branch?” No = 0; yes = 1.'}
                  </p>
                  <table>
                    <caption>
                      {fr
                        ? 'Chemins et nombre de questions'
                        : 'Paths and question counts'}
                    </caption>
                    <thead>
                      <tr>
                        <th>{fr ? 'Symbole' : 'Symbol'}</th>
                        <th>p</th>
                        <th>{fr ? 'Chemin' : 'Path'}</th>
                        <th>{fr ? 'Questions' : 'Questions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.map((x, i) => {
                        const s = String.fromCharCode(65 + i);
                        return (
                          <tr key={s}>
                            <th>{s}</th>
                            <td>{number(x, locale)}</td>
                            <td>
                              <code>{tree.code[s]}</code>
                            </td>
                            <td>{tree.code[s]!.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p>
                    <output>
                      H = {number(entropy(p)!, locale)} ; L ={' '}
                      {number(tree.mean, locale)}
                    </output>{' '}
                    {fr
                      ? 'bits et questions en moyenne.'
                      : 'bits and questions on average.'}
                  </p>
                  <p>
                    {symbol} : <code>{tree.code[symbol]}</code> (
                    {fr ? '0 = non, 1 = oui' : '0 = no, 1 = yes'}).{' '}
                    {fr
                      ? 'La moyenne peut être fractionnaire même si chaque trajet compte un nombre entier de questions.'
                      : 'The average may be fractional even though every path has an integer question count.'}
                  </p>
                </>
              )}
              {mode === 'kraft' && k && (
                <>
                  <p>
                    <output>
                      K = {k.numerator}/{k.denominator} ={' '}
                      {number(k.value, locale)}
                    </output>
                  </p>
                  {k.value <= 1 ? (
                    <>
                      <p>
                        {fr
                          ? 'Ces longueurs admettent un code préfixe. Voici une construction ; ceci ne vérifie pas une autre attribution de mots.'
                          : 'These lengths admit a prefix code. This is one construction; it does not verify another word assignment.'}
                      </p>
                      <table>
                        <caption>
                          {fr
                            ? 'Code préfixe construit'
                            : 'Constructed prefix code'}
                        </caption>
                        <thead>
                          <tr>
                            <th>{fr ? 'Symbole' : 'Symbol'}</th>
                            <th>{fr ? 'Longueur' : 'Length'}</th>
                            <th>{fr ? 'Mot' : 'Word'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {canonicalPrefix(lengths)!.map((word, i) => (
                            <tr key={i}>
                              <th>{String.fromCharCode(65 + i)}</th>
                              <td>{lengths[i]}</td>
                              <td>
                                <code>{word}</code>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <p>
                      {fr
                        ? 'K > 1 : aucun code binaire à décodage unique ne peut avoir ces longueurs.'
                        : 'K > 1: no binary uniquely decodable code can have these lengths.'}
                    </p>
                  )}
                  <p>
                    {fr
                      ? 'Contre-exemple fixe : A→0, B→01, C→10 donne K = 1, mais 010 code AC et BA.'
                      : 'Fixed counterexample: A→0, B→01, C→10 gives K = 1, but 010 encodes both AC and BA.'}
                  </p>
                </>
              )}
              {mode === 'gibbs' && comparison && p && q && (
                <>
                  <table>
                    <caption>
                      {fr
                        ? 'Distribution réelle p et modèle q'
                        : 'Actual distribution p and model q'}
                    </caption>
                    <thead>
                      <tr>
                        <th>{fr ? 'Symbole' : 'Symbol'}</th>
                        <th>p</th>
                        <th>q</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.map((x, i) => (
                        <tr key={i}>
                          <th>{String.fromCharCode(65 + i)}</th>
                          <td>{number(x, locale)}</td>
                          <td>{number(q[i]!, locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>
                    <output>
                      H(p) = {number(comparison.entropy, locale)} ; −Σ p log₂ q
                      = {number(comparison.cross, locale)} ;{' '}
                      {fr ? 'écart' : 'gap'} ={' '}
                      {number(Math.max(0, comparison.gap), locale)}
                    </output>
                  </p>
                  <p className="theory-exact-model">
                    {exactlySameModel
                      ? fr
                        ? 'Égalité exacte : p = q.'
                        : 'Exact equality: p = q.'
                      : fr
                        ? 'Modèles différents : inégalité stricte avant arrondi.'
                        : 'Different models: strict inequality before rounding.'}
                  </p>
                  <p>
                    {fr
                      ? 'Égalité exactement lorsque p = q. Les logarithmes sont des longueurs idéales, pas nécessairement des longueurs entières de mots codes.'
                      : 'Equality exactly when p = q. Logarithms are ideal lengths, not necessarily integer codeword lengths.'}
                  </p>
                </>
              )}
              {mode === 'bound' &&
                (bound ? (
                  <>
                    <p>
                      {fr
                        ? 'Un code préfixe est construit à partir des longueurs.'
                        : 'A prefix code is constructed from the lengths.'}
                    </p>
                    <table>
                      <caption>
                        {fr
                          ? 'Normaliser les poids 2⁻ˡ'
                          : 'Normalising the weights 2⁻ˡ'}
                      </caption>
                      <thead>
                        <tr>
                          <th>{fr ? 'Symbole' : 'Symbol'}</th>
                          <th>p</th>
                          <th>{fr ? 'Code' : 'Code'}</th>
                          <th>q = 2⁻ˡ/K</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bound.p.map((x, i) => (
                          <tr key={i}>
                            <th>{String.fromCharCode(65 + i)}</th>
                            <td>{number(x, locale)}</td>
                            <td>
                              <code>{bound.code[i]}</code>
                            </td>
                            <td>{number(bound.q[i]!, locale)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p>
                      <output>
                        H = {number(bound.entropy, locale)} ≤ L + log₂ K ={' '}
                        {number(bound.cross, locale)} ≤ L ={' '}
                        {number(bound.mean, locale)}
                      </output>
                    </p>
                    <p>
                      K = {number(bound.k, locale)}.{' '}
                      {fr
                        ? 'L’égalité H = L exige à la fois K = 1 et pᵢ = 2⁻ˡⁱ pour chaque symbole.'
                        : 'Equality H = L requires both K = 1 and pᵢ = 2⁻ˡⁱ for every symbol.'}
                    </p>
                  </>
                ) : (
                  <p>
                    {fr
                      ? 'K > 1 : ces longueurs ne permettent pas un code à décodage unique. La chaîne de la preuve ne s’applique pas.'
                      : 'K > 1: these lengths cannot form a uniquely decodable code. The proof chain does not apply.'}
                  </p>
                ))}
              {blocks && (
                <>
                  <table>
                    <caption>
                      {fr ? 'Code de Huffman des blocs' : 'Block Huffman code'}
                    </caption>
                    <thead>
                      <tr>
                        <th>{fr ? 'Bloc' : 'Block'}</th>
                        <th>p</th>
                        <th>{fr ? 'Code' : 'Code'}</th>
                        <th>{fr ? 'Longueur' : 'Length'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blocks.blocks.map((b) => (
                        <tr key={b.symbol}>
                          <th>{b.symbol}</th>
                          <td>{number(b.probability, locale)}</td>
                          <td>
                            <code>{blocks.code[b.symbol]}</code>
                          </td>
                          <td>{blocks.code[b.symbol]!.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>
                    <output>
                      H(S) = {number(blocks.entropy, locale)} ; H(Sⁿ) ={' '}
                      {number(blocks.blockEntropy, locale)} ; Lₙ ={' '}
                      {number(blocks.mean, locale)} ; Lₙ/n ={' '}
                      {number(blocks.perSymbol, locale)}
                    </output>
                  </p>
                  <p>
                    {fr
                      ? 'H et Lₙ/n : bits par symbole initial. H(Sⁿ) et Lₙ : bits par bloc.'
                      : 'H and Lₙ/n: bits per original symbol. H(Sⁿ) and Lₙ: bits per block.'}
                  </p>
                  <p>
                    H(S) ≤ Lₙ/n &lt; H(S) + 1/n = {number(blocks.upper, locale)}
                    . {fr ? 'Entrées du dictionnaire :' : 'Codebook entries:'}{' '}
                    {blocks.blocks.length}.
                  </p>
                  <div className="theory-merges">
                    <p>
                      {fr ? 'Fusions expliquées :' : 'Explained merges:'}{' '}
                      <output>
                        {mergeStep}/{blocks.merges.length}
                      </output>
                      .{' '}
                      {fr
                        ? 'Chaque somme est réinsérée avant de choisir les deux poids minimaux suivants.'
                        : 'Reinsert every sum before choosing the next two minimum weights.'}
                    </p>
                    <ol>
                      {blocks.merges.slice(0, mergeStep).map((m, i) => (
                        <li className="theory-merge" key={i}>
                          {m.a} + {m.b} = {m.sum}
                        </li>
                      ))}
                    </ol>
                    <p>
                      {fr
                        ? 'Des ex æquo peuvent produire d’autres codes de même coût.'
                        : 'Ties may produce other codes with the same cost.'}
                    </p>
                  </div>
                  <p className="theory-print-merges">
                    {blocks.merges
                      .map((m) => `${m.a} + ${m.b} = ${m.sum}`)
                      .join(' ; ')}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
