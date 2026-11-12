import type { Locale } from './i18n';

type Bilingual = Record<Locale, string>;

export type IntersectionCase = {
  id: string;
  name: Bilingual;
  condition: string;
  result: Bilingual;
};

export const intersectionCases: IntersectionCase[] = [
  {
    id: 'secant',
    name: { fr: 'Sécantes', en: 'Intersecting' },
    condition: 'm_1\\ne m_2',
    result: { fr: '1 point commun', en: '1 common point' },
  },
  {
    id: 'parallel',
    name: { fr: 'Strictement parallèles', en: 'Strictly parallel' },
    condition: 'm_1=m_2,\\ p_1\\ne p_2',
    result: { fr: '0 point commun', en: '0 common points' },
  },
  {
    id: 'coincident',
    name: { fr: 'Confondues', en: 'Coincident / Same line' },
    condition: 'm_1=m_2,\\ p_1=p_2',
    result: { fr: 'Une infinité de points', en: 'Infinitely many points' },
  },
];

export const lineExtraCopy = {
  fr: {
    intersectionTitle: 'Intersection de deux droites : les 3 situations',
    intersectionIntro:
      'Pour D₁ : y = m₁x + p₁ et D₂ : y = m₂x + p₂, comparer d’abord les pentes.',
    caseHeader: 'Situation',
    conditionHeader: 'Condition',
    resultHeader: 'Intersection',
    intersectionHow:
      'Si les pentes sont différentes, égaliser les deux équations :',
    intersectionExample:
      'Exemple : D₁ : y = 2x + 1 et D₂ : y = −x + 7. On obtient x = 2 puis y = 5 : l’intersection est (2, 5).',
    verticalException:
      'Attention : ce tableau suppose deux droites non verticales. Pour une verticale x = c, remplacer directement x par c dans l’autre équation. Deux verticales distinctes sont parallèles ; deux fois x = c désigne la même droite.',
    halfPlaneTitle: 'Inégalités : les deux demi-plans',
    halfPlaneIntro:
      'La droite y = mx + p sépare le plan en deux régions. Une inégalité indique de quel côté se situent les points autorisés.',
    above: 'Au-dessus de la droite',
    below: 'En dessous de la droite',
    border:
      'Avec ≥ ou ≤, la frontière est incluse ; avec > ou <, elle est exclue.',
    shadeTitle: 'Astuce : choisir un point test',
    shadeInstructions:
      'Tester (0, 0) s’il n’est pas sur la droite. Si le calcul est vrai, garder le côté contenant l’origine ; sinon, choisir l’autre côté.',
    shadeExample:
      'Pour y > 2x + 1 : au point (0, 0), on teste 0 > 1, ce qui est faux. On choisit donc la région opposée à (0, 0).',
    shadeOnLine:
      'Si (0, 0) est sur la droite, tester un autre point qui n’est pas sur la frontière.',
    halfPlaneDiagram: 'Droite frontière et demi-plans au-dessus et en dessous',
  },
  en: {
    intersectionTitle: 'Intersection of two lines: 3 situations',
    intersectionIntro:
      'For D₁: y = m₁x + p₁ and D₂: y = m₂x + p₂, compare the slopes first.',
    caseHeader: 'Situation',
    conditionHeader: 'Condition',
    resultHeader: 'Intersections',
    intersectionHow: 'If the slopes differ, set both equations equal:',
    intersectionExample:
      'Example: D₁: y = 2x + 1 and D₂: y = −x + 7. This gives x = 2, then y = 5: the intersection is (2, 5).',
    verticalException:
      'Important: the table assumes two non-vertical lines. For a vertical line x = c, substitute x = c into the other equation. Distinct vertical lines are parallel; two identical equations x = c describe the same line.',
    halfPlaneTitle: 'Inequalities: the two half-planes',
    halfPlaneIntro:
      'The line y = mx + p divides the plane into two regions. An inequality tells you which side contains the allowed points.',
    above: 'Above the line',
    below: 'Below the line',
    border:
      'With ≥ or ≤, the boundary is included; with > or <, it is excluded.',
    shadeTitle: 'Quick method: test a point',
    shadeInstructions:
      'Test (0, 0) if it is not on the line. If the inequality is true, keep the side containing the origin; otherwise shade the opposite side.',
    shadeExample:
      'For y > 2x + 1: at (0, 0), the test is 0 > 1, which is false. Shade the side opposite to (0, 0).',
    shadeOnLine:
      'If (0, 0) lies on the line, test another point outside the boundary.',
    halfPlaneDiagram: 'Boundary line and the half-planes above and below',
  },
} as const satisfies Record<
  Locale,
  {
    intersectionTitle: string;
    intersectionIntro: string;
    caseHeader: string;
    conditionHeader: string;
    resultHeader: string;
    intersectionHow: string;
    intersectionExample: string;
    verticalException: string;
    halfPlaneTitle: string;
    halfPlaneIntro: string;
    above: string;
    below: string;
    border: string;
    shadeTitle: string;
    shadeInstructions: string;
    shadeExample: string;
    shadeOnLine: string;
    halfPlaneDiagram: string;
  }
>;

export const pixelCopy = {
  fr: {
    title: 'Droites sur écran : pixels et Bresenham',
    intro:
      'Un repère mathématique et un écran n’ont pas le même axe vertical. Voici comment convertir les coordonnées et choisir les pixels d’une droite.',
    coordinatesTitle: 'Du repère mathématique (x, y) aux pixels (c, r)',
    coordinatesExplain:
      'Sur un écran, (0, 0) se trouve en haut à gauche. La colonne c augmente vers la droite, la ligne r augmente vers le bas. En mathématiques, y augmente vers le haut.',
    originTitle: 'Décaler l’origine au centre de l’écran',
    originRead:
      'c vaut c zéro plus x. r vaut r zéro moins y : le signe moins inverse la direction verticale.',
    scalingTitle: 'Changer d’échelle : s pixels par unité',
    scalingRead: 'c vaut c zéro plus s fois x ; r vaut r zéro moins s fois y.',
    conversionExample:
      'Exemple : centre (100, 80), s = 10 et point (2, 3). Alors c = 120 et r = 50. Pour afficher un pixel, arrondir les coordonnées obtenues.',
    axesDiagram: 'Axes : y monte en mathématiques, r descend à l’écran',
    naiveTitle: 'Tracé naïf : pourquoi des trous apparaissent',
    naiveIntro:
      'On calcule un point sur la droite puis on arrondit à un pixel entier. Il faut avancer sur le bon axe pour ne pas sauter de lignes ou de colonnes.',
    gentle: 'Si |m| ≤ 1 : avancer x de 1 puis calculer y = mx + p.',
    steep: 'Si |m| > 1 : avancer y de 1 puis calculer x = (y − p)/m.',
    vertical:
      'Pour une droite verticale, x reste constant et on fait varier y.',
    naiveExample:
      'Exemple : de (0, 0) à (2, 5), m = 2,5. En avançant uniquement en x, les y arrondis sont 0, 3 et 5 : les lignes intermédiaires sont sautées.',
    bresTitle: 'Algorithme de Bresenham : uniquement des entiers',
    bresScope:
      'Version de base ci-dessous : pixels entiers, x₁ > x₀ et 0 ≤ Δy ≤ Δx, dans un repère mathématique où y monte. Les autres octants demandent une adaptation.',
    bresChoices:
      'À chaque colonne suivante, choisir E (x + 1, y) ou NE (x + 1, y + 1).',
    init: 'Initialiser les différences et la variable de décision :',
    algorithmLabel: 'Pseudo-code (sans flottants, additions dans la boucle)',
    traceTitle: 'Exemple guidé de (0, 0) à (5, 3)',
    traceIntro:
      'Δx = 5, Δy = 3, D = 1 au départ. En cas d’égalité D = 0, cette convention choisit NE.',
    traceX: 'Pixel tracé',
    traceD: 'D avant choix',
    traceChoice: 'Pas suivant',
    traceNext: 'D après choix',
    last: 'Fin',
    diagramTitle: 'Pixels choisis par Bresenham',
    coordinateCaution:
      'Attention au signe : NE monte dans le repère mathématique (y + 1). Sur un écran, le même mouvement vers le haut correspond à r − 1, pas r + 1. Convertir les coordonnées avant de dessiner.',
    integerNote:
      'Les multiplications par 2 sont faites une fois avant la boucle ; la boucle n’utilise ensuite que comparaisons et additions.',
  },
  en: {
    title: 'Lines on a screen: pixels and Bresenham',
    intro:
      'Mathematical coordinates and screen pixels have opposite vertical axes. Learn to convert coordinates and choose a connected set of pixels.',
    coordinatesTitle: 'From mathematical coordinates (x, y) to pixels (c, r)',
    coordinatesExplain:
      'On a screen, (0, 0) is the top-left corner. Column c grows to the right and row r grows downward. In mathematics, y grows upward.',
    originTitle: 'Shift the origin to the screen center',
    originRead:
      'c equals c zero plus x. r equals r zero minus y: the minus sign reverses the vertical direction.',
    scalingTitle: 'Change units: s pixels per mathematical unit',
    scalingRead:
      'c equals c zero plus s times x; r equals r zero minus s times y.',
    conversionExample:
      'Example: center (100, 80), s = 10 and point (2, 3). Then c = 120 and r = 50. Round the resulting coordinates to select an integer pixel.',
    axesDiagram: 'Axes: mathematical y increases upward, screen r downward',
    naiveTitle: 'Naive rasterisation: why gaps appear',
    naiveIntro:
      'Calculate points along the line, then round to integer pixels. Step along the appropriate axis to avoid skipping whole rows or columns.',
    gentle: 'If |m| ≤ 1: step x by 1, then calculate y = mx + p.',
    steep: 'If |m| > 1: step y by 1, then calculate x = (y − p)/m.',
    vertical: 'For a vertical line, x remains fixed while y changes.',
    naiveExample:
      'Example: from (0, 0) to (2, 5), m = 2.5. Stepping only in x gives rounded y-values 0, 3 and 5, skipping intermediate rows.',
    bresTitle: 'Bresenham’s line algorithm: integers only',
    bresScope:
      'Basic case below: integer pixels, x₁ > x₀ and 0 ≤ Δy ≤ Δx, in mathematical coordinates where y grows upward. Other octants need adaptations.',
    bresChoices:
      'At each next column, choose E (x + 1, y) or NE (x + 1, y + 1).',
    init: 'Initialize differences and the decision variable:',
    algorithmLabel: 'Pseudocode (no floating-point; additions inside the loop)',
    traceTitle: 'Worked example from (0, 0) to (5, 3)',
    traceIntro:
      'Δx = 5, Δy = 3 and the initial decision D = 1. This convention chooses NE when D = 0.',
    traceX: 'Plotted pixel',
    traceD: 'D before choice',
    traceChoice: 'Next step',
    traceNext: 'D after choice',
    last: 'End',
    diagramTitle: 'Pixels selected by Bresenham',
    coordinateCaution:
      'Mind the sign: NE rises in mathematical coordinates (y + 1). On a screen, moving up means row r − 1, not r + 1. Convert coordinates before plotting.',
    integerNote:
      'Multiplications by 2 are computed once before the loop; the loop then uses only comparisons and additions.',
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    intro: string;
    coordinatesTitle: string;
    coordinatesExplain: string;
    originTitle: string;
    originRead: string;
    scalingTitle: string;
    scalingRead: string;
    conversionExample: string;
    axesDiagram: string;
    naiveTitle: string;
    naiveIntro: string;
    gentle: string;
    steep: string;
    vertical: string;
    naiveExample: string;
    bresTitle: string;
    bresScope: string;
    bresChoices: string;
    init: string;
    algorithmLabel: string;
    traceTitle: string;
    traceIntro: string;
    traceX: string;
    traceD: string;
    traceChoice: string;
    traceNext: string;
    last: string;
    diagramTitle: string;
    coordinateCaution: string;
    integerNote: string;
  }
>;

export type BresenhamTrace = {
  x: number;
  y: number;
  decision: number;
  move: 'E' | 'NE' | 'END';
  nextDecision: number | null;
};

export function bresenhamGentle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): BresenhamTrace[] {
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (
    ![x0, y0, x1, y1].every(Number.isInteger) ||
    dx <= 0 ||
    dy < 0 ||
    dy > dx
  ) {
    throw new RangeError(
      'Requires integer endpoints, dx > 0 and 0 <= dy <= dx',
    );
  }
  let x = x0;
  let y = y0;
  let decision = 2 * dy - dx;
  const eastDelta = 2 * dy;
  const northEastDelta = 2 * (dy - dx);
  const trace: BresenhamTrace[] = [];
  for (; x <= x1; x += 1) {
    if (x === x1) {
      trace.push({ x, y, decision, move: 'END', nextDecision: null });
      break;
    }
    const move = decision < 0 ? 'E' : 'NE';
    const nextDecision = decision + (move === 'E' ? eastDelta : northEastDelta);
    trace.push({ x, y, decision, move, nextDecision });
    if (move === 'NE') y += 1;
    decision = nextDecision;
  }
  return trace;
}

export const bresenhamExample = bresenhamGentle(0, 0, 5, 3);

export type RegressionRow = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  product: number;
  squared: number;
  prediction: number;
  residual: number;
};

export function regressionLeastSquares(
  points: readonly (readonly [number, number])[],
) {
  if (
    points.length < 2 ||
    points.some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y))
  ) {
    throw new RangeError('At least two finite observations are needed');
  }
  const meanX = points.reduce((sum, [x]) => sum + x, 0) / points.length;
  const meanY = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  const centered = points.map(([x, y]) => ({
    x,
    y,
    dx: x - meanX,
    dy: y - meanY,
  }));
  const numerator = centered.reduce((sum, row) => sum + row.dx * row.dy, 0);
  const denominator = centered.reduce((sum, row) => sum + row.dx * row.dx, 0);
  if (denominator === 0)
    throw new RangeError('The x-values must not all be equal');
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const rows: RegressionRow[] = centered.map((row) => {
    const prediction = slope * row.x + intercept;
    const residual = row.y - prediction;
    return {
      ...row,
      product: row.dx * row.dy,
      squared: row.dx * row.dx,
      prediction,
      residual,
    };
  });
  const ssr = rows.reduce((sum, row) => sum + row.residual ** 2, 0);
  return { meanX, meanY, numerator, denominator, slope, intercept, rows, ssr };
}

export const regressionExample = regressionLeastSquares([
  [1, 2],
  [2, 2],
  [3, 5],
]);

export type RegressionLimit = {
  id: string;
  title: Bilingual;
  meaning: Bilingual;
  caution: Bilingual;
};

export const regressionLimits: RegressionLimit[] = [
  {
    id: 'correlation',
    title: { fr: 'Corrélation ≠ causalité', en: 'Correlation ≠ causation' },
    meaning: {
      fr: 'Deux variables évoluent ensemble sans qu’une soit forcément la cause de l’autre.',
      en: 'Two variables may move together without one causing the other.',
    },
    caution: {
      fr: 'Une troisième variable cachée peut expliquer l’association.',
      en: 'A hidden third variable may drive the relationship.',
    },
  },
  {
    id: 'anscombe',
    title: { fr: 'Quartet d’Anscombe', en: 'Anscombe’s quartet' },
    meaning: {
      fr: 'Quatre nuages de points très différents peuvent partager les mêmes statistiques résumées et presque la même régression.',
      en: 'Four very different scatterplots can share matching summary statistics and essentially the same fitted line.',
    },
    caution: {
      fr: 'Tracer le nuage de points avant d’interpréter la formule.',
      en: 'Plot the data before interpreting the formula.',
    },
  },
  {
    id: 'outliers',
    title: { fr: 'Valeurs aberrantes', en: 'Outliers' },
    meaning: {
      fr: 'Un point extrême peut fortement déplacer la droite estimée.',
      en: 'One extreme observation can strongly influence the fitted line.',
    },
    caution: {
      fr: 'Le carré amplifie les grands résidus : vérifier les points isolés.',
      en: 'Squaring magnifies large residuals: inspect isolated points.',
    },
  },
  {
    id: 'extrapolation',
    title: { fr: 'Extrapolation', en: 'Extrapolation' },
    meaning: {
      fr: 'Prédire hors de la plage des x mesurés.',
      en: 'Predicting beyond the observed x-range.',
    },
    caution: {
      fr: 'Une relation linéaire peut ne plus tenir loin des observations.',
      en: 'A linear pattern may fail outside the measured interval.',
    },
  },
];

export const regressionCopy = {
  fr: {
    title: 'Régression linéaire : méthode des moindres carrés',
    intro:
      'Quand les données ne sont pas parfaitement alignées, on cherche une droite qui résume leur tendance. On distingue valeur observée et valeur prédite.',
    modelTitle: 'Le modèle : observé ou prédit ?',
    actual: 'yᵢ : valeur réellement mesurée.',
    predicted: 'ŷᵢ : valeur calculée par la droite pour xᵢ (prédiction).',
    residualTitle: 'Résidu : mesurer l’erreur verticale',
    residualPositive:
      'eᵢ > 0 : point au-dessus de la droite ; le modèle sous-estime.',
    residualNegative:
      'eᵢ < 0 : point en dessous de la droite ; le modèle surestime.',
    residualZero: 'eᵢ = 0 : le point est exactement sur la droite.',
    ssrTitle: 'Pourquoi additionner les carrés des erreurs ?',
    ssrExplain:
      'Sans carré, un résidu positif et un négatif peuvent s’annuler. Les moindres carrés minimisent la somme des carrés des résidus (SSR).',
    unique:
      'La solution (m, p) est unique pour au moins deux observations dont les x ne sont pas tous égaux.',
    procedureTitle: 'Calculer une régression à la main',
    procedureIntro:
      'Lire ∑ comme « somme ». Pour chaque ligne, calculer les écarts aux deux moyennes, puis le produit et le carré.',
    tableTitle: 'Tableau de calcul pour 3 points',
    top: 'Somme numérateur de m',
    bottom: 'Somme dénominateur de m',
    sums: 'Sommes',
    meansCheck:
      'Vérification : les écarts des x et des y à leur moyenne s’additionnent chacun à zéro.',
    formulaResult:
      'Résultat pour cet exemple : m = 3/2 = 1,5 ; p = 0 ; ŷ = 1,5x.',
    centroid: 'La droite estimée passe toujours par le point moyen (x̄, ȳ).',
    predictionTitle: 'Prédiction et calcul en sens inverse',
    forward: 'Valeur x connue : remplacer x dans ŷ = mx + p.',
    backward: 'Cible ŷ connue : isoler x si m ≠ 0.',
    predictionsExample:
      'Avec ŷ = 1,5x : pour x = 2, ŷ = 3. Pour viser ŷ = 3, il faut x = 2. Attention : x = 4 serait déjà hors de la plage observée 1 à 3.',
    flatCase:
      'Si m = 0, ŷ = p est constant : une cible égale à p est atteinte pour tout x ; une autre cible n’a pas de solution.',
    residualExample:
      'Dans cet exemple, les résidus valent 0,5 ; −1 ; 0,5. Donc SSR = 0,25 + 1 + 0,25 = 1,5.',
    limitsTitle: 'Quatre limites à connaître pour l’examen',
    limitHeader: 'Limite',
    meaningHeader: 'Signification',
    warningHeader: 'À retenir',
    plotTitle: 'Nuage de points, droite et résidus',
    plotCaption:
      'Points observés (1, 2), (2, 2), (3, 5) ; droite ajustée ŷ = 1,5x. Les segments verticaux représentent les résidus.',
  },
  en: {
    title: 'Linear regression: least squares',
    intro:
      'When data points do not fall exactly on a line, find the straight line summarizing the trend. Distinguish observed and predicted values.',
    modelTitle: 'The model: observed or predicted?',
    actual: 'yᵢ: actual value observed in the data.',
    predicted: 'ŷᵢ: predicted value computed from xᵢ by the line.',
    residualTitle: 'Residual: measure the vertical error',
    residualPositive: 'eᵢ > 0: point above the line; the model under-predicts.',
    residualNegative: 'eᵢ < 0: point below the line; the model over-predicts.',
    residualZero: 'eᵢ = 0: the point sits exactly on the line.',
    ssrTitle: 'Why square and add errors?',
    ssrExplain:
      'Without squares, positive and negative residuals could cancel. Least squares minimizes the sum of squared residuals (SSR).',
    unique:
      'The solution (m, p) is unique when at least two observations have non-identical x-values.',
    procedureTitle: 'Calculate regression by hand',
    procedureIntro:
      'Read ∑ as “sum”. For each observation, calculate deviations from both means, their product and the square.',
    tableTitle: 'Calculation table for three points',
    top: 'Sum in numerator of m',
    bottom: 'Sum in denominator of m',
    sums: 'Totals',
    meansCheck:
      'Check: the x-deviations and the y-deviations each add to zero.',
    formulaResult: 'Example result: m = 3/2 = 1.5; p = 0; ŷ = 1.5x.',
    centroid: 'The fitted line always passes through the mean point (x̄, ȳ).',
    predictionTitle: 'Forward prediction and reverse target',
    forward: 'Given x: substitute it into ŷ = mx + p.',
    backward: 'Given a target ŷ: solve for x when m ≠ 0.',
    predictionsExample:
      'With ŷ = 1.5x: at x = 2, predict ŷ = 3. To target ŷ = 3, use x = 2. Beware: x = 4 would already be outside the observed range 1 to 3.',
    flatCase:
      'If m = 0, ŷ = p is constant: a target equal to p works for every x; any other target has no solution.',
    residualExample:
      'For this example, residuals are 0.5, −1, 0.5, giving SSR = 0.25 + 1 + 0.25 = 1.5.',
    limitsTitle: 'Four limitations to know for the exam',
    limitHeader: 'Limitation',
    meaningHeader: 'Meaning',
    warningHeader: 'Remember',
    plotTitle: 'Scatterplot, fitted line and residuals',
    plotCaption:
      'Observed points (1, 2), (2, 2), (3, 5); fitted line ŷ = 1.5x. Vertical segments represent residuals.',
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    intro: string;
    modelTitle: string;
    actual: string;
    predicted: string;
    residualTitle: string;
    residualPositive: string;
    residualNegative: string;
    residualZero: string;
    ssrTitle: string;
    ssrExplain: string;
    unique: string;
    procedureTitle: string;
    procedureIntro: string;
    tableTitle: string;
    top: string;
    bottom: string;
    sums: string;
    meansCheck: string;
    formulaResult: string;
    centroid: string;
    predictionTitle: string;
    forward: string;
    backward: string;
    predictionsExample: string;
    flatCase: string;
    residualExample: string;
    limitsTitle: string;
    limitHeader: string;
    meaningHeader: string;
    warningHeader: string;
    plotTitle: string;
    plotCaption: string;
  }
>;
