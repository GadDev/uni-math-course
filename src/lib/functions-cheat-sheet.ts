import type { Locale } from './i18n';

type Bilingual = Record<Locale, string>;

export type FunctionReference = {
  id: string;
  formula: string;
  reading: Bilingual;
  explanation: Bilingual;
  example?: string;
};

export const domainChecks: FunctionReference[] = [
  {
    id: 'fraction',
    formula: 'f(x)=\\frac1{x-2}\\quad\\Rightarrow\\quad x\\ne2',
    reading: {
      fr: 'Un sur x moins deux : x ne doit pas être égal à deux.',
      en: 'One over x minus two: x must not equal two.',
    },
    explanation: {
      fr: 'Au dénominateur, 0 est interdit. Exemple : x = 2 provoquerait une division par zéro.',
      en: 'A denominator may never be zero. For example, x = 2 would give division by zero.',
    },
  },
  {
    id: 'root',
    formula: 'g(x)=\\sqrt{x+3}\\quad\\Rightarrow\\quad x\\ge-3',
    reading: {
      fr: 'Racine carrée de x plus trois : x est supérieur ou égal à moins trois.',
      en: 'Square root of x plus three: x is greater than or equal to negative three.',
    },
    explanation: {
      fr: 'Sous une racine paire réelle, l’expression doit être positive ou nulle.',
      en: 'Inside an even root over the reals, the expression must be nonnegative.',
    },
  },
  {
    id: 'log',
    formula: 'h(x)=\\ln(x-1)\\quad\\Rightarrow\\quad x>1',
    reading: {
      fr: 'Logarithme népérien de x moins un : x est strictement supérieur à un.',
      en: 'Natural log of x minus one: x must be strictly greater than one.',
    },
    explanation: {
      fr: 'Le logarithme réel accepte uniquement des arguments strictement positifs.',
      en: 'The real logarithm only accepts strictly positive inputs.',
    },
  },
];

export const derivativeRules: FunctionReference[] = [
  {
    id: 'constant',
    formula: "f(x)=c\\quad\\Longrightarrow\\quad f'(x)=0",
    reading: {
      fr: 'La dérivée d’une constante est zéro.',
      en: 'The derivative of a constant is zero.',
    },
    explanation: {
      fr: 'Une droite horizontale ne monte ni ne descend.',
      en: 'A horizontal line does not rise or fall.',
    },
    example: '(7)^{\\prime}=0',
  },
  {
    id: 'power',
    formula: "\\big(x^n\\big)'=nx^{n-1}",
    reading: {
      fr: 'Descendre l’exposant devant x, puis soustraire un à cet exposant.',
      en: 'Bring the exponent to the front, then subtract one from it.',
    },
    explanation: {
      fr: 'Pour n réel, règle valable pour x > 0 ; ailleurs, il faut vérifier que la fonction et la dérivée existent.',
      en: 'For any real n, this rule works when x > 0; elsewhere, check that the function and derivative exist.',
    },
    example: "(x^3)'=3x^2",
  },
  {
    id: 'exponential',
    formula: "(e^x)'=e^x",
    reading: {
      fr: 'La dérivée de exponentielle de x est encore exponentielle de x.',
      en: 'The derivative of e to the x is e to the x again.',
    },
    explanation: {
      fr: 'L’exponentielle est sa propre dérivée.',
      en: 'The exponential function is its own derivative.',
    },
    example: "(3e^x)'=3e^x",
  },
  {
    id: 'natural-log',
    formula: "(\\ln x)'=\\frac1x\\qquad(x>0)",
    reading: {
      fr: 'La dérivée de logarithme népérien de x vaut un sur x.',
      en: 'The derivative of natural log of x equals one over x.',
    },
    explanation: {
      fr: 'Le logarithme népérien n’est défini que pour x strictement positif.',
      en: 'The natural logarithm is defined only for positive x.',
    },
    example: "(\\ln x)'=\\frac1x",
  },
  {
    id: 'linearity',
    formula: "(a u+b v)'=a u'+b v'",
    reading: {
      fr: 'On dérive séparément les termes et on conserve les coefficients constants.',
      en: 'Differentiate each term separately and keep the constant coefficients.',
    },
    explanation: {
      fr: 'Valable lorsque u et v sont dérivables.',
      en: 'Applies when both u and v are differentiable.',
    },
    example: "(3x^2+5x)'=6x+5",
  },
  {
    id: 'product',
    formula: "(uv)'=u'v+uv'",
    reading: {
      fr: 'Dérivée du premier fois le second, plus premier fois dérivée du second.',
      en: 'Derivative of the first times the second, plus the first times derivative of the second.',
    },
    explanation: {
      fr: 'Attention : ce n’est pas simplement u’ fois v’.',
      en: 'Watch out: it is not just u prime times v prime.',
    },
    example: "(x^2e^x)'=2xe^x+x^2e^x",
  },
  {
    id: 'quotient',
    formula: "\\left(\\frac uv\\right)'=\\frac{u'v-uv'}{v^2}",
    reading: {
      fr: 'Dérivée du haut fois le bas, moins haut fois dérivée du bas, sur le bas au carré.',
      en: 'Top derivative times bottom minus top times bottom derivative, divided by bottom squared.',
    },
    explanation: {
      fr: 'On ne peut pas diviser par zéro : v(x) doit être différent de zéro.',
      en: 'Division by zero is forbidden: v(x) must not be zero.',
    },
    example: "\\left(\\frac{x}{x+1}\\right)'=\\frac1{(x+1)^2}",
  },
  {
    id: 'chain',
    formula: "(u(v(x)))'=u'(v(x))\\,v'(x)",
    reading: {
      fr: 'Dériver la fonction extérieure, puis multiplier par la dérivée intérieure.',
      en: 'Differentiate the outer function, then multiply by the inner derivative.',
    },
    explanation: {
      fr: 'La règle de la chaîne s’applique aux fonctions composées.',
      en: 'Use the chain rule for a function inside another function.',
    },
    example: "((3x+1)^2)'=6(3x+1)",
  },
];

export const exponentialLogLaws: FunctionReference[] = [
  {
    id: 'inverse',
    formula: '\\ln(e^x)=x,\\quad e^{\\ln x}=x\\ (x>0)',
    reading: {
      fr: 'Le logarithme défait l’exponentielle et inversement, avec x positif pour exponentielle de log x.',
      en: 'Log undoes exponential, and exponential undoes log, with positive x for exp of log x.',
    },
    explanation: {
      fr: 'Dans la première identité, x peut être tout réel. Dans la deuxième, x > 0.',
      en: 'In the first identity, x is any real number; in the second, x > 0.',
    },
    example: '\\ln(e^3)=3,\\quad e^{\\ln5}=5',
  },
  {
    id: 'exp-add',
    formula: 'e^{a+b}=e^a e^b',
    reading: {
      fr: 'Addition des exposants devient multiplication des exponentielles.',
      en: 'Adding exponents becomes multiplication of exponential values.',
    },
    explanation: {
      fr: 'Pour a et b réels.',
      en: 'For any real a and b.',
    },
    example: 'e^{2+3}=e^2e^3',
  },
  {
    id: 'exp-sub',
    formula: 'e^{a-b}=\\frac{e^a}{e^b}',
    reading: {
      fr: 'Soustraire les exposants revient à diviser les exponentielles.',
      en: 'Subtracting exponents means dividing exponentials.',
    },
    explanation: {
      fr: 'Le dénominateur e puissance b est toujours positif.',
      en: 'The denominator e to the b is always positive.',
    },
    example: 'e^{5-2}=\\frac{e^5}{e^2}',
  },
  {
    id: 'exp-power',
    formula: '(e^a)^b=e^{ab}',
    reading: {
      fr: 'Puissance d’une puissance : multiplier les exposants.',
      en: 'Power raised to a power: multiply the exponents.',
    },
    explanation: {
      fr: 'Pour a et b réels, puisque e puissance a est positif.',
      en: 'For real a and b, since e to the a is positive.',
    },
  },
  {
    id: 'log-product',
    formula: '\\ln(ab)=\\ln(a)+\\ln(b)',
    reading: {
      fr: 'Logarithme d’un produit : somme des logarithmes.',
      en: 'Log of a product: add the logarithms.',
    },
    explanation: {
      fr: 'Attention : a > 0 et b > 0.',
      en: 'Important: a > 0 and b > 0.',
    },
    example: '\\ln(2\\cdot3)=\\ln2+\\ln3',
  },
  {
    id: 'log-quotient',
    formula: '\\ln\\left(\\frac ab\\right)=\\ln(a)-\\ln(b)',
    reading: {
      fr: 'Logarithme d’un quotient : différence des logarithmes.',
      en: 'Log of a quotient: subtract the logarithms.',
    },
    explanation: {
      fr: 'Avec a > 0 et b > 0.',
      en: 'When a > 0 and b > 0.',
    },
  },
  {
    id: 'log-power',
    formula: '\\ln(a^k)=k\\ln(a)',
    reading: {
      fr: 'L’exposant k passe devant le logarithme en multiplication.',
      en: 'Move the exponent k in front of the logarithm as a multiplier.',
    },
    explanation: {
      fr: 'Avec a > 0 et k réel.',
      en: 'With a > 0 and real k.',
    },
    example: '\\ln(4^3)=3\\ln4',
  },
];

export const growthValues = [
  { id: 'constant', formula: '1', n8: 1, n16: 1 },
  { id: 'log', formula: '\\log_2 n', n8: 3, n16: 4 },
  { id: 'linear', formula: 'n', n8: 8, n16: 16 },
  { id: 'nlogn', formula: 'n\\log_2 n', n8: 24, n16: 64 },
  { id: 'quadratic', formula: 'n^2', n8: 64, n16: 256 },
  { id: 'exponential', formula: '2^n', n8: 256, n16: 65536 },
] as const;

export const functionChapterCopy = {
  fr: {
    title: 'Chapitre 3 — Fonctions, dérivées et logarithmes',
    intro: 'Un rappel progressif de L37 à L42 : lire les symboles, reconnaître la méthode, refaire un exemple, puis vérifier le domaine.',
    basicsTitle: '01. Fonctions, domaines et graphiques',
    basicsIntro: 'Une fonction est une machine : chaque entrée autorisée x donne exactement une sortie f(x). La sortie devient la hauteur du point sur le graphique.',
    basicsNotation: 'Se lit : « f de A vers les réels ; à x on associe f de x ». f(x) n’est pas f multiplié par x.',
    basicsExample: 'Exemple : f(x) = x². À x = 3, la sortie vaut 9 : on place le point (3, 9).',
    vertical: 'Test de la droite verticale : si une verticale coupe une courbe deux fois, ce n’est pas le graphe d’une fonction de x.',
    domainsTitle: 'Trois vérifications de domaine',
    reading: 'Lecture à voix haute',
    explanation: 'Explication et piège à éviter',
    notation: 'Formule',
    symmetryTitle: 'Fonctions paires et impaires',
    even: 'Paire : f(−x) = f(x). Même hauteur à gauche et à droite : symétrie par rapport à l’axe vertical.',
    odd: 'Impaire : f(−x) = −f(x). Symétrie centrale : tourner le graphe de 180° autour de l’origine.',
    symmetryExample: 'x² est paire : f(−2) = f(2) = 4. x³ est impaire : f(−2) = −8 = −f(2). Le domaine doit aussi être symétrique.',
    secantsTitle: '02. De la sécante à la dérivée',
    secantsIntro: 'Une sécante relie deux points d’une courbe et donne une pente moyenne. Quand le deuxième point s’approche du premier, cette pente peut tendre vers la pente instantanée : la dérivée.',
    secantsReading: 'Se lit : « f de x plus h moins f de x, le tout divisé par h ». h est un petit déplacement horizontal non nul.',
    derivativeReading: 'Se lit : « f prime de x égale la limite, quand h tend vers zéro, du quotient des variations ». Si cette limite existe, elle mesure la pente de la tangente.',
    tangentReading: 'Se lit : « y égale f de a plus f prime de a fois x moins a ». À x = a, on est au point (a, f(a)).',
    secantExample: 'Exemple f(x) = x² au point a = 1 : avec h = 1, la pente sécante vaut 3 ; avec h = 0,1, elle vaut 2,1. En rapprochant h de 0, on obtient f’(1) = 2 et la tangente y = 2x − 1.',
    derivativeSigns: 'Sur un intervalle où la fonction est dérivable : f’ > 0 signifie croissante ; f’ < 0 signifie décroissante. f’ = 0 en un point ne garantit pas un maximum ou un minimum.',
    secantPlot: 'La sécante approche la tangente pour f(x) = x² près de x = 1',
    secantCaption: 'Courbe y = x², point A(1, 1), sécante pour h = 0,5 et tangente y = 2x − 1.',
    rulesTitle: '03. Calculer une dérivée sans refaire la limite',
    rulesIntro: 'Identifier la forme avant d’appliquer la règle : nombre constant, puissance, produit, quotient ou fonction composée. Vérifier ensuite les entrées autorisées.',
    rulesFunction: 'Forme',
    rulesDerivative: 'Dérivée et lecture',
    rulesExample: 'Mini-exemple',
    workedTitle: 'Exemple pas à pas : la règle de la chaîne',
    workedText: 'Pour (3x + 1)², la fonction extérieure est « carré » et l’intérieur est 3x + 1. On dérive le carré, puis on multiplie par la dérivée intérieure 3.',
    expTitle: '04–05. Exponentielle et logarithme népérien',
    expIntro: 'e ≈ 2,718 est un nombre fixe. e^x est une fonction définie pour tous les réels et toujours positive. ln(x) est la fonction inverse qui retrouve l’exposant ; elle exige x > 0.',
    inversePlot: 'Les courbes e puissance x et ln(x) sont symétriques par rapport à y = x',
    inverseCaption: 'e^x passe par (0, 1) ; ln(x) passe par (1, 0). Les deux courbes se reflètent de part et d’autre de y = x.',
    keyValues: 'Valeurs à savoir : e⁰ = 1, e¹ = e ≈ 2,718, ln(1) = 0 et ln(e) = 1.',
    lawsTitle: 'Lois des puissances et des logarithmes',
    logTraps: 'À éviter : ln(a + b) n’est généralement pas ln(a) + ln(b). Les formules contenant ln(a) et ln(b) supposent a > 0 et b > 0.',
    growthTitle: '06. Changement de base et croissance des algorithmes',
    growthIntro: 'En informatique, log₂(n) sert notamment à compter combien de fois on peut diviser une taille par deux. Le changement de base permet de retrouver ce logarithme avec ln.',
    baseReading: 'Se lit : « logarithme en base b de x égale logarithme népérien de x sur logarithme népérien de b ». Conditions : x > 0, b > 0 et b ≠ 1.',
    generalBaseReading: 'Se lit : « b puissance x égale exponentielle de x fois logarithme népérien de b » (b > 0). Sa dérivée multiplie par ln(b).',
    baseExample: 'Exemple : log₂(8) = 3, car 2³ = 8. Pour b = 2, la dérivée de 2^x est 2^x ln(2).',
    hierarchy: 'Pour n de plus en plus grand : constante ≪ logarithme ≪ linéaire ≪ n log n ≪ quadratique ≪ exponentielle. Le symbole ≪ signifie ici « croît asymptotiquement beaucoup moins vite », pas une inégalité vraie pour tout petit n.',
    growthTable: 'Comparer les valeurs (modèles de croissance, pas des secondes)',
    growthReminder: 'Attention : une comparaison asymptotique décrit la croissance pour de grands n. Les constantes, le matériel et l’algorithme concret comptent aussi.',
    lessons: 'Réviser les leçons L37 à L42',
  },
  en: {
    title: 'Chapter 3 — Functions, derivatives and logarithms',
    intro: 'A step-by-step guide to L37–L42: read the symbols, spot the method, follow a worked example, then check the domain.',
    basicsTitle: '01. Functions, domains and graphs',
    basicsIntro: 'A function is a machine: every allowed input x produces exactly one output f(x). That output is the height of the point on the graph.',
    basicsNotation: 'Read: “f from A to the real numbers; x maps to f of x.” f(x) does not mean f multiplied by x.',
    basicsExample: 'Example: f(x) = x². At x = 3, the output is 9: plot the point (3, 9).',
    vertical: 'Vertical-line test: if a vertical line crosses a curve twice, it cannot be the graph of a function of x.',
    domainsTitle: 'Three domain checks',
    reading: 'Read aloud',
    explanation: 'Explanation and trap',
    notation: 'Formula',
    symmetryTitle: 'Even and odd functions',
    even: 'Even: f(−x) = f(x). Equal heights left and right: symmetry across the vertical y-axis.',
    odd: 'Odd: f(−x) = −f(x). Central symmetry: rotate the graph 180° around the origin.',
    symmetryExample: 'x² is even: f(−2) = f(2) = 4. x³ is odd: f(−2) = −8 = −f(2). The domain must also be symmetric.',
    secantsTitle: '02. From secants to derivatives',
    secantsIntro: 'A secant connects two points on the curve and gives an average slope. As the second point approaches the first, that slope may approach an instantaneous slope: the derivative.',
    secantsReading: 'Read: “f of x plus h minus f of x, all divided by h.” h is a nonzero horizontal step.',
    derivativeReading: 'Read: “f prime of x equals the limit, as h tends to zero, of the difference quotient.” If this limit exists, it is the tangent slope.',
    tangentReading: 'Read: “y equals f of a plus f prime of a times x minus a.” At x = a, the point is (a, f(a)).',
    secantExample: 'Example f(x) = x² at a = 1: with h = 1 the secant slope is 3; with h = 0.1 it is 2.1. As h approaches 0, f’(1) = 2 and the tangent is y = 2x − 1.',
    derivativeSigns: 'On an interval where a function is differentiable: f’ > 0 means increasing and f’ < 0 means decreasing. f’ = 0 at one point does not guarantee a maximum or minimum.',
    secantPlot: 'A secant approaches the tangent to f(x) = x² near x = 1',
    secantCaption: 'Curve y = x², point A(1, 1), secant with h = 0.5, and tangent y = 2x − 1.',
    rulesTitle: '03. Differentiate without taking the limit every time',
    rulesIntro: 'First identify the shape: constant, power, product, quotient or composition. Then check allowed inputs.',
    rulesFunction: 'Function form',
    rulesDerivative: 'Derivative and reading',
    rulesExample: 'Mini-example',
    workedTitle: 'Step-by-step example: chain rule',
    workedText: 'For (3x + 1)², the outer function is squaring and the inner expression is 3x + 1. Differentiate the square, then multiply by the inner derivative 3.',
    expTitle: '04–05. Exponentials and natural logarithms',
    expIntro: 'e ≈ 2.718 is a fixed number. e^x is defined for every real x and is always positive. ln(x) is its inverse and recovers the exponent; it requires x > 0.',
    inversePlot: 'The curves e to the x and ln(x) reflect across y = x',
    inverseCaption: 'e^x passes through (0, 1); ln(x) passes through (1, 0). The curves are mirror images across y = x.',
    keyValues: 'Key values: e⁰ = 1, e¹ = e ≈ 2.718, ln(1) = 0 and ln(e) = 1.',
    lawsTitle: 'Exponent and logarithm laws',
    logTraps: 'Avoid this trap: ln(a + b) is generally not ln(a) + ln(b). Formulas with ln(a) and ln(b) require a > 0 and b > 0.',
    growthTitle: '06. Changing bases and algorithmic growth',
    growthIntro: 'In computing, log₂(n) helps count repeated halvings of an input size. Change of base lets us calculate it using ln.',
    baseReading: 'Read: “log base b of x equals natural log of x over natural log of b.” Conditions: x > 0, b > 0 and b ≠ 1.',
    generalBaseReading: 'Read: “b to the x equals e to the x times natural log of b” (b > 0). Its derivative multiplies by ln(b).',
    baseExample: 'Example: log₂(8) = 3 because 2³ = 8. For b = 2, the derivative of 2^x is 2^x ln(2).',
    hierarchy: 'For larger and larger n: constant ≪ logarithmic ≪ linear ≪ n log n ≪ quadratic ≪ exponential. Here ≪ means “grows asymptotically much more slowly”, not an inequality true for every small n.',
    growthTable: 'Compare values (growth models, not seconds)',
    growthReminder: 'Remember: asymptotic comparison describes growth for large n. Constant factors, hardware and the actual algorithm also matter.',
    lessons: 'Review lessons L37 through L42',
  },
} as const satisfies Record<Locale, Record<
  'title' | 'intro' | 'basicsTitle' | 'basicsIntro' | 'basicsNotation' | 'basicsExample' |
  'vertical' | 'domainsTitle' | 'reading' | 'explanation' | 'notation' | 'symmetryTitle' |
  'even' | 'odd' | 'symmetryExample' | 'secantsTitle' | 'secantsIntro' |
  'secantsReading' | 'derivativeReading' | 'tangentReading' | 'secantExample' |
  'derivativeSigns' | 'secantPlot' | 'secantCaption' | 'rulesTitle' | 'rulesIntro' |
  'rulesFunction' | 'rulesDerivative' | 'rulesExample' | 'workedTitle' | 'workedText' |
  'expTitle' | 'expIntro' | 'inversePlot' | 'inverseCaption' | 'keyValues' |
  'lawsTitle' | 'logTraps' | 'growthTitle' | 'growthIntro' | 'baseReading' |
  'generalBaseReading' | 'baseExample' | 'hierarchy' | 'growthTable' |
  'growthReminder' | 'lessons',
  string
>>;
