import type { Locale } from './i18n';

type Bilingual = Record<Locale, string>;

export type GeometryFormula = {
  id: string;
  formula: string;
  reading: Bilingual;
  meaning: Bilingual;
};

export const geometryFormulae: GeometryFormula[] = [
  {
    id: 'line',
    formula: 'y=mx+p',
    reading: {
      fr: 'y égale m fois x plus p.',
      en: 'y equals m times x plus p.',
    },
    meaning: {
      fr: 'Équation d’une droite non verticale : m est la pente et p l’ordonnée à l’origine.',
      en: 'Equation of a non-vertical line: m is the slope and p is the y-intercept.',
    },
  },
  {
    id: 'slope',
    formula: 'm=\\frac{y_B-y_A}{x_B-x_A}',
    reading: {
      fr: 'm égale y B moins y A, divisé par x B moins x A.',
      en: 'm equals y B minus y A divided by x B minus x A.',
    },
    meaning: {
      fr: 'Variation verticale divisée par variation horizontale ; il faut x B différent de x A.',
      en: 'Vertical change divided by horizontal change; x B must differ from x A.',
    },
  },
  {
    id: 'intercept',
    formula: 'p=y_A-mx_A',
    reading: {
      fr: 'p égale y A moins m fois x A.',
      en: 'p equals y A minus m times x A.',
    },
    meaning: {
      fr: 'On remplace les coordonnées d’un point de la droite pour trouver p.',
      en: 'Substitute a point on the line to find p.',
    },
  },
  {
    id: 'solve-x',
    formula: 'x=\\frac{y-p}{m}\\quad(m\\ne0)',
    reading: {
      fr: 'x égale y moins p, divisé par m, si m est non nul.',
      en: 'x equals y minus p divided by m, when m is nonzero.',
    },
    meaning: {
      fr: 'Pour retrouver x quand y est donné : on isole x.',
      en: 'Given y, solve the line equation for x.',
    },
  },
  {
    id: 'x-intercept',
    formula: 'x=-\\frac{p}{m}\\quad(m\\ne0)',
    reading: {
      fr: 'x égale moins p sur m, si m est non nul.',
      en: 'x equals negative p over m, if m is nonzero.',
    },
    meaning: {
      fr: 'Abscisse à l’origine : on pose y = 0 et on résout.',
      en: 'x-intercept: set y = 0, then solve.',
    },
  },
  {
    id: 'mean-x',
    formula: '\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i',
    reading: {
      fr: 'x barre égale la somme des x i, divisée par n.',
      en: 'x bar equals the sum of the x i values divided by n.',
    },
    meaning: {
      fr: 'Moyenne des abscisses des n points.',
      en: 'Mean of the x-coordinates for n points.',
    },
  },
  {
    id: 'mean-y',
    formula: '\\bar{y}=\\frac{1}{n}\\sum_{i=1}^{n}y_i',
    reading: {
      fr: 'y barre égale la somme des y i, divisée par n.',
      en: 'y bar equals the sum of the y i values divided by n.',
    },
    meaning: {
      fr: 'Moyenne des ordonnées des n points.',
      en: 'Mean of the y-coordinates for n points.',
    },
  },
  {
    id: 'regression-slope',
    formula:
      'm=\\frac{\\sum_{i=1}^{n}(x_i-\\bar{x})(y_i-\\bar{y})}{\\sum_{i=1}^{n}(x_i-\\bar{x})^2}',
    reading: {
      fr: 'm égale la somme des produits des écarts à la moyenne, divisée par la somme des carrés des écarts des x.',
      en: 'm equals the sum of products of deviations from the means, divided by the sum of squared x-deviations.',
    },
    meaning: {
      fr: 'Pente de la droite de régression des moindres carrés, si les x ne sont pas tous égaux.',
      en: 'Least-squares regression slope, provided the x-values are not all equal.',
    },
  },
  {
    id: 'regression-intercept',
    formula: 'p=\\bar{y}-m\\bar{x}',
    reading: {
      fr: 'p égale y barre moins m fois x barre.',
      en: 'p equals y bar minus m times x bar.',
    },
    meaning: {
      fr: 'La droite de régression passe par le point moyen (x barre, y barre).',
      en: 'The regression line passes through the mean point (x bar, y bar).',
    },
  },
];

export type GeometryStep = {
  id: string;
  text: Bilingual;
  formula?: string;
};

export type GeometryMethod = {
  id: string;
  title: Bilingual;
  intro: Bilingual;
  steps: GeometryStep[];
  exampleFormula?: string;
  example: Bilingual;
};

export const geometryMethods: GeometryMethod[] = [
  {
    id: 'chart-to-equation',
    title: {
      fr: 'Du graphique vers l’équation',
      en: 'From a chart to an equation',
    },
    intro: {
      fr: 'Quand une droite est déjà dessinée sur un repère cartésien :',
      en: 'When a line is already drawn on Cartesian axes:',
    },
    steps: [
      {
        id: 'read-p',
        text: {
          fr: 'Lire p à l’endroit où la droite coupe l’axe vertical (x = 0).',
          en: 'Read p where the line crosses the vertical axis (x = 0).',
        },
        formula: '(0,p)',
      },
      {
        id: 'choose-points',
        text: {
          fr: 'Choisir deux points précis A et B aux intersections du quadrillage.',
          en: 'Choose two exact grid-intersection points A and B on the line.',
        },
        formula: 'A(x_A,y_A),\\ B(x_B,y_B)',
      },
      {
        id: 'calculate-slope',
        text: {
          fr: 'Calculer la pente : montée divisée par déplacement horizontal.',
          en: 'Calculate slope: rise divided by run.',
        },
        formula: 'm=\\frac{\\Delta y}{\\Delta x}',
      },
    ],
    exampleFormula: 'p=1,\\quad m=\\frac{5-1}{2-0}=2,\\quad y=2x+1',
    example: {
      fr: 'Exemple : la droite passe par (0, 1) et (2, 5). On lit p = 1, puis m = 2.',
      en: 'Example: the line passes through (0, 1) and (2, 5). Read p = 1, then calculate m = 2.',
    },
  },
  {
    id: 'points-to-equation',
    title: {
      fr: 'De deux points vers l’équation',
      en: 'From two points to an equation',
    },
    intro: {
      fr: 'Sans dessin, utiliser les coordonnées de A et B :',
      en: 'Without a chart, use the coordinates of A and B:',
    },
    steps: [
      {
        id: 'slope',
        text: {
          fr: 'Calculer m si les abscisses sont différentes.',
          en: 'Calculate m when the x-coordinates differ.',
        },
        formula: 'm=\\frac{y_B-y_A}{x_B-x_A}',
      },
      {
        id: 'intercept',
        text: {
          fr: 'Remplacer A dans y = mx + p pour calculer p.',
          en: 'Substitute A into y = mx + p to find p.',
        },
        formula: 'p=y_A-mx_A',
      },
      {
        id: 'finish',
        text: {
          fr: 'Écrire l’équation et vérifier avec le second point B.',
          en: 'Write the equation and check it using the second point B.',
        },
        formula: 'y=mx+p',
      },
    ],
    exampleFormula: 'A(1,3),\\ B(3,7)\\ \\Rightarrow\\ m=2,\\ p=1,\\ y=2x+1',
    example: {
      fr: 'Si x A = x B et A et B sont distincts, la droite est verticale : x = x A. Il n’existe pas de pente m finie.',
      en: 'If x A = x B and A and B are distinct, the line is vertical: x = x A. There is no finite slope m.',
    },
  },
  {
    id: 'equation-to-chart',
    title: {
      fr: 'De l’équation vers le graphique',
      en: 'From an equation to a chart',
    },
    intro: {
      fr: 'Pour tracer une droite dans un repère cartésien :',
      en: 'To draw a line on Cartesian axes:',
    },
    steps: [
      {
        id: 'first-point',
        text: {
          fr: 'Placer le premier point à l’ordonnée à l’origine.',
          en: 'Plot the first point at the y-intercept.',
        },
        formula: '(0,p)',
      },
      {
        id: 'rise-run',
        text: {
          fr: 'Écrire m comme une fraction : avancer selon le dénominateur et monter ou descendre selon le numérateur.',
          en: 'Express m as a fraction: move right by the denominator and up/down by the numerator.',
        },
        formula: 'm=\\frac{\\Delta y}{\\Delta x}',
      },
      {
        id: 'draw',
        text: {
          fr: 'Placer le deuxième point puis tracer la droite à la règle.',
          en: 'Mark the second point, then connect both points with a ruler.',
        },
      },
    ],
    exampleFormula: 'y=2x+1\\ \\Rightarrow\\ (0,1),\\ (1,3),\\ (2,5)',
    example: {
      fr: 'Avec m = 2 = 2/1 : avancer de 1 et monter de 2.',
      en: 'With m = 2 = 2/1: move right 1 and up 2.',
    },
  },
  {
    id: 'coordinates',
    title: {
      fr: 'Retrouver une coordonnée ou une intersection',
      en: 'Find a missing coordinate or intercept',
    },
    intro: {
      fr: 'Partir de y = mx + p et identifier la donnée connue :',
      en: 'Start from y = mx + p and identify what is already given:',
    },
    steps: [
      {
        id: 'given-x',
        text: {
          fr: 'Si x est donné, remplacer x pour calculer y.',
          en: 'Given x, substitute it to calculate y.',
        },
        formula: 'y=mx+p',
      },
      {
        id: 'given-y',
        text: {
          fr: 'Si y est donné, isoler x (uniquement si m est non nul).',
          en: 'Given y, isolate x (only when m is nonzero).',
        },
        formula: 'x=\\frac{y-p}{m}',
      },
      {
        id: 'axes',
        text: {
          fr: 'Pour l’intersection avec l’axe des x, poser y = 0.',
          en: 'To find the x-intercept, set y = 0.',
        },
        formula: 'x=-\\frac{p}{m}\\quad(m\\ne0)',
      },
    ],
    exampleFormula: 'y=2x+1:\\quad x=3\\Rightarrow y=7;\\quad y=5\\Rightarrow x=2',
    example: {
      fr: 'Exception : si m = 0, la droite est horizontale y = p. Elle ne coupe pas l’axe des x si p ≠ 0 ; si p = 0, elle coïncide avec cet axe.',
      en: 'Exception: if m = 0, the line is horizontal y = p. It never crosses the x-axis if p ≠ 0; when p = 0, it is the x-axis.',
    },
  },
  {
    id: 'point-test',
    title: {
      fr: 'Vérifier qu’un point appartient à la droite',
      en: 'Check whether a point lies on the line',
    },
    intro: {
      fr: 'Pour tester C(x C, y C), remplacer x dans le membre de droite :',
      en: 'To test C(x C, y C), substitute its x-value into the right side:',
    },
    steps: [
      {
        id: 'compare',
        text: {
          fr: 'Le point appartient à la droite exactement si les deux membres sont égaux.',
          en: 'The point lies on the line exactly when both sides are equal.',
        },
        formula: 'y_C\\stackrel{?}{=}mx_C+p',
      },
    ],
    exampleFormula: 'C(2,5):\\quad 5=2\\times2+1\\ \\checkmark',
    example: {
      fr: 'Sur y = 2x + 1, le point C(2, 5) appartient à la droite ; (2, 4) n’y appartient pas.',
      en: 'For y = 2x + 1, the point C(2, 5) is on the line; (2, 4) is not.',
    },
  },
];

export const regressionSteps: GeometryStep[] = [
  {
    id: 'means',
    text: {
      fr: 'Calculer les moyennes des n coordonnées.',
      en: 'Compute the means of the n x-values and y-values.',
    },
    formula:
      '\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i,\\quad\\bar{y}=\\frac{1}{n}\\sum_{i=1}^{n}y_i',
  },
  {
    id: 'slope',
    text: {
      fr: 'Calculer la pente avec les écarts centrés à la moyenne.',
      en: 'Calculate the slope using deviations from the means.',
    },
    formula:
      'm=\\frac{\\sum_{i=1}^{n}(x_i-\\bar{x})(y_i-\\bar{y})}{\\sum_{i=1}^{n}(x_i-\\bar{x})^2}',
  },
  {
    id: 'intercept',
    text: {
      fr: 'Déduire p : la droite passe par le point moyen.',
      en: 'Find p: the fitted line passes through the mean point.',
    },
    formula: 'p=\\bar{y}-m\\bar{x}',
  },
];

export const geometryCopy = {
  fr: {
    title: 'Droites, géométrie analytique et régression',
    intro:
      'Du graphique à l’équation, puis de l’équation au graphique. Notation du cours : y = mx + p (et non y = mx + b).',
    coreTitle: 'La formule de la droite',
    slopeTitle: 'Pente m (coefficient directeur)',
    interceptTitle: 'Ordonnée à l’origine p',
    slopePositive: 'm > 0 : la droite monte de gauche à droite.',
    slopeNegative: 'm < 0 : la droite descend de gauche à droite.',
    slopeZero: 'm = 0 : la droite est horizontale, y = p.',
    slopeVertical: 'Droite verticale : x = c, donc pas de forme y = mx + p.',
    interceptExplanation: 'La droite coupe l’axe des y au point (0, p).',
    formulaTitle: 'Lire les formules à voix haute',
    notation: 'Formule',
    readingFr: 'Lecture en français',
    readingEn: 'Reading in English',
    meaning: 'À quoi elle sert',
    methodsTitle: 'Méthodes dans les deux sens',
    graphTitle: 'Exemple cartésien : y = 2x + 1',
    graphCaption:
      'Points A(0, 1) et B(2, 5). La pente vaut 4/2 = 2 et l’ordonnée à l’origine vaut 1.',
    exampleLabel: 'Exemple et piège à éviter',
    regressionTitle: 'Droite de régression (moindres carrés)',
    regressionIntro:
      'Pour ajuster une droite y = mx + p à des observations (xᵢ, yᵢ), on minimise la somme des carrés des écarts verticaux.',
    regressionExample:
      'Exemple : (1, 2), (2, 2), (3, 5). On trouve x̄ = 2, ȳ = 3, m = 3/2 et p = 0 : y = 1,5x. Le point moyen (2, 3) est sur cette droite.',
    regressionConstraint:
      'Condition : il faut au moins deux observations et des x non tous égaux, sinon le dénominateur est nul. Une droite de régression n’a pas besoin de passer par chaque point observé.',
    warning:
      'Attention aux divisions par zéro : les formules contenant 1/m supposent m ≠ 0. Une droite verticale s’écrit x = c, pas y = mx + p.',
  },
  en: {
    title: 'Analytic geometry, straight lines and regression',
    intro:
      'From chart to equation, then equation to chart. Course notation: y = mx + p (not y = mx + b).',
    coreTitle: 'The straight-line equation',
    slopeTitle: 'Slope / gradient m',
    interceptTitle: 'Y-intercept p',
    slopePositive: 'm > 0: the line rises from left to right.',
    slopeNegative: 'm < 0: the line falls from left to right.',
    slopeZero: 'm = 0: the line is horizontal, y = p.',
    slopeVertical: 'Vertical line: x = c, so it cannot be written as y = mx + p.',
    interceptExplanation: 'The line crosses the y-axis at the point (0, p).',
    formulaTitle: 'Read the formulas aloud',
    notation: 'Formula',
    readingFr: 'French reading',
    readingEn: 'English reading',
    meaning: 'What it is for',
    methodsTitle: 'Forward and reverse methods',
    graphTitle: 'Cartesian example: y = 2x + 1',
    graphCaption:
      'Points A(0, 1) and B(2, 5). The slope is 4/2 = 2, and the y-intercept is 1.',
    exampleLabel: 'Example and common trap',
    regressionTitle: 'Least-squares regression line',
    regressionIntro:
      'To fit y = mx + p to observed data (xᵢ, yᵢ), minimize the sum of squared vertical residuals.',
    regressionExample:
      'Example: (1, 2), (2, 2), (3, 5). Then x̄ = 2, ȳ = 3, m = 3/2 and p = 0: y = 1.5x. The mean point (2, 3) lies on this line.',
    regressionConstraint:
      'Conditions: at least two observations and non-identical x-values; otherwise the denominator is zero. The regression line need not pass through each observed data point.',
    warning:
      'Watch out for division by zero: formulas with 1/m require m ≠ 0. A vertical line is x = c, not y = mx + p.',
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    intro: string;
    coreTitle: string;
    slopeTitle: string;
    interceptTitle: string;
    slopePositive: string;
    slopeNegative: string;
    slopeZero: string;
    slopeVertical: string;
    interceptExplanation: string;
    formulaTitle: string;
    notation: string;
    readingFr: string;
    readingEn: string;
    meaning: string;
    methodsTitle: string;
    graphTitle: string;
    graphCaption: string;
    exampleLabel: string;
    regressionTitle: string;
    regressionIntro: string;
    regressionExample: string;
    regressionConstraint: string;
    warning: string;
  }
>;
