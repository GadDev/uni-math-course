import data from '../data/glossary.json';
import type { Locale } from './i18n';

export type GlossaryTranslation = {
  name: string;
  meaning: string;
  reading: string;
  explanation: string;
  confusion: string;
};
export type GlossaryEntry = {
  id: string;
  sourceId: string;
  category: string;
  notation: string;
  example: string;
  format?: string;
  exampleOrigin: string;
  sourcePages: number[];
  sourceContext?: 'supplement';
  fr: GlossaryTranslation;
  en: GlossaryTranslation;
};
export const glossary = data as Omit<typeof data, 'entries'> & {
  entries: GlossaryEntry[];
};
export const normalizeSearch = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

// Search the actual glyph as well as the TeX spelling and both translations.
const glyphs: Record<string, string> = {
  sum: '∑ Σ',
  sqrt: '√',
  Delta: 'Δ ∆',
  approx: '≈',
  neq: '≠',
  notin: '∉',
  mapsto: '↦',
  rightleftarrows: '⇄',
  longrightarrow: '→',
  div: '÷',
  square: '□',
  top: '⊤',
  neg: '¬',
  land: '∧',
  lor: '∨',
  Rightarrow: '⇒',
  Leftrightarrow: '⇔',
  equiv: '≡',
  geq: '≥',
  leq: '≤',
  infty: '∞',
  varnothing: '∅',
  in: '∈',
  subseteq: '⊆',
  cap: '∩',
  cup: '∪',
  times: '×',
  forall: '∀',
  exists: '∃',
  leftrightarrow: '↔',
  to: '→',
  mid: '|',
  cdot: '·',
};
export function searchText(entry: GlossaryEntry) {
  const text = [entry.notation, entry.example].join(' ');
  const numberGlyphs: Record<string, string> = {
    N: 'ℕ',
    Z: 'ℤ',
    Q: 'ℚ',
    R: 'ℝ',
  };
  const symbols = text
    .replace(/\\bar\s*\{?x\}?/g, 'x̄')
    .replace(/\\bar\s*\{?y\}?/g, 'ȳ ȳ')
    .replace(/\\hat\s*\{?y\}?/g, 'ŷ ŷ')
    .replace(
      /\\mathbb\s*\{?([NZQR])\}?/g,
      (_, name: string) => numberGlyphs[name] ?? name,
    )
    .replace(/\\([A-Za-z]+)/g, (_, name: string) => glyphs[name] ?? name);
  return normalizeSearch(
    [
      entry.id,
      text,
      symbols,
      ...Object.values(entry.fr),
      ...Object.values(entry.en),
    ].join(' '),
  );
}
export const glossaryCopy = {
  fr: {
    title: 'Le langage des maths',
    nav: 'Glossaire',
    label: 'LE CARNET DES SYMBOLES',
    intro:
      'Un signe, une idée. Retrouvez son sens et apprenez à lire la formule en français et en anglais.',
    search: 'Rechercher un symbole ou un mot',
    placeholder: '∧, ensemble, implication, subset…',
    category: 'Famille',
    all: 'Toutes les familles',
    reset: 'Effacer les filtres',
    count: 'entrées affichées',
    empty: 'Aucune entrée. Essayez un autre mot ou effacez les filtres.',
    reading: 'Se lit',
    explanation: 'En clair',
    confusion: 'À ne pas confondre',
    otherLanguage: 'Lire aussi en anglais',
    example: 'Exemple',
    teaching: 'Exemple pédagogique complémentaire',
    sourceExample: 'Formule ou notation du cours',
    pages: 'Pages PDF',
    link: 'Lien vers cette entrée',
    review: 'Repères de lecture',
    conventions:
      'Dans ce cours, les naturels comprennent zéro. Les intervalles gardent la notation française dans les deux langues. Le rôle des lettres dépend du contexte : A peut être une assertion ou un ensemble.',
    sourceNote:
      'Deux sources de Bruno Teheux : Logique (96 pages) et Droites (87 pages). Chaque entrée précise son document et ses pages, couverture comprise. Explications et lectures originales du projet ; aucune diapositive redistribuée.',
    discrepancyTitle: 'Logique, page 48 : un exemple à corriger',
    discrepancy:
      'Le cours marque comme vrai « il existe un humain plus vieux que tous les humains ». Avec une relation strictement « plus vieux », c’est faux : la personne choisie fait elle-même partie des humains et ne peut pas être plus vieille qu’elle-même.',
    droitesTitle: 'Droites, pages 66 et 81 : zéro et domaines',
    droitesNote:
      'Une somme de carrés est non négative : zéro est possible. Le coefficient de corrélation exige Sxx > 0 et Syy > 0 ; il est indéfini si tous les x ou tous les y sont identiques.',
    noScript:
      'Toutes les entrées restent lisibles sans JavaScript. Activez-le pour filtrer la liste.',
    policy:
      'Ce glossaire est en lecture libre. Les exercices interactifs et le suivi des progrès restent des fonctionnalités distinctes.',
  },
  en: {
    title: 'The language of maths',
    nav: 'Glossary',
    label: 'THE SYMBOL NOTEBOOK',
    intro:
      'One sign, one idea. Find its meaning and learn to read the formula in French and English.',
    search: 'Search for a symbol or word',
    placeholder: '∧, set, implication, ensemble…',
    category: 'Family',
    all: 'All families',
    reset: 'Clear filters',
    count: 'entries shown',
    empty: 'No entries. Try another word or clear the filters.',
    reading: 'Read aloud',
    explanation: 'In plain language',
    confusion: 'Common confusion',
    otherLanguage: 'Also read in French',
    example: 'Example',
    teaching: 'Additional teaching example',
    sourceExample: 'Course formula or notation',
    pages: 'PDF pages',
    link: 'Link to this entry',
    review: 'Reading guide',
    conventions:
      'In this course, natural numbers include zero. Intervals keep French notation in both languages. The role of a letter depends on context: A can be a statement or a set.',
    sourceNote:
      'Two sources by Bruno Teheux: Logic (96 pages) and Lines (87 pages). Each entry identifies its document and pages, counting the cover. Original project explanations and readings; no slides redistributed.',
    discrepancyTitle: 'Logic, page 48: an example needing correction',
    discrepancy:
      'The course marks “there exists a human older than all humans” as true. With a strict “older than” relation, this is false: the chosen person is themselves among the humans and cannot be older than themselves.',
    droitesTitle: 'Lines, pages 66 and 81: zero and domains',
    droitesNote:
      'A sum of squares is nonnegative: zero is possible. The correlation coefficient requires Sxx > 0 and Syy > 0; it is undefined if all x values or all y values are identical.',
    noScript:
      'Every entry remains readable without JavaScript. Enable it to filter the list.',
    policy:
      'This glossary is open reading. Interactive exercises and progress tracking remain separate features.',
  },
} satisfies Record<Locale, Record<string, string>>;
