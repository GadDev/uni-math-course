/** PDF topic order, independently of stable lesson and exercise identities.
 * Repeated slide builds are folded into one topic. Page 1 is the PDF title. */
const topic = (page: number, lessonId: string, fr: string, en: string) => ({
  page,
  lessonId,
  title: { fr, en },
});

export const droitesSourceParts = [
  {
    title: {
      fr: 'Calcul algébrique dans ℝ : les règles du jeu',
      en: 'Algebra in ℝ: the rules of the game',
    },
    topics: [
      topic(4, 'L21', 'Priorité des opérations', 'Order of operations'),
      topic(6, 'L21', 'Les règles de base', 'Basic rules'),
      topic(7, 'L22', 'Développer et factoriser', 'Expanding and factorising'),
      topic(13, 'L23', 'Fractions', 'Fractions'),
      topic(
        14,
        'L23',
        'Puissances et racines carrées',
        'Powers and square roots',
      ),
      topic(
        15,
        'L22',
        'Identités remarquables',
        'Standard algebraic identities',
      ),
      topic(19, 'L24', 'Résoudre une équation', 'Solving an equation'),
      topic(21, 'L24', 'Inéquations', 'Inequalities'),
      topic(
        23,
        'L25',
        'Systèmes de deux équations',
        'Systems of two equations',
      ),
      topic(25, 'L26', 'La notation sigma (Σ)', 'Sigma notation (Σ)'),
      topic(
        26,
        'L26',
        'Moyenne et écarts centrés',
        'Mean and centred deviations',
      ),
    ],
  },
  {
    title: {
      fr: 'Repère cartésien et équations',
      en: 'Cartesian coordinates and equations',
    },
    topics: [
      topic(28, 'L27', 'Le repère cartésien', 'The Cartesian frame'),
      topic(
        29,
        'L27',
        'Distance entre deux points',
        'Distance between two points',
      ),
      topic(31, 'L28', 'Équation cartésienne', 'Cartesian equation'),
      topic(33, 'L28', 'Une galerie de courbes', 'A gallery of curves'),
      topic(
        35,
        'L28',
        'Une courbe, plusieurs équations',
        'One curve, several equations',
      ),
    ],
  },
  {
    title: { fr: 'La droite', en: 'The straight line' },
    topics: [
      topic(37, 'L29', 'Tracer une droite', 'Plotting a straight line'),
      topic(38, 'L29', 'Pente et ordonnée à l’origine', 'Slope and intercept'),
      topic(39, 'L29', 'L’effet de m et de p', 'The effects of m and p'),
      topic(
        40,
        'L30',
        'Une droite à partir de deux points',
        'A line through two points',
      ),
      topic(
        44,
        'L30',
        'Intersection de deux droites',
        'Intersection of two lines',
      ),
      topic(46, 'L30', 'Trois situations', 'Three situations'),
      topic(50, 'L31', 'Les deux demi-plans', 'The two half-planes'),
    ],
  },
  {
    title: { fr: 'Les droites à l’écran', en: 'Lines on a screen' },
    topics: [
      topic(
        53,
        'L32',
        'L’écran est une grille de pixels',
        'The screen is a pixel grid',
      ),
      topic(
        54,
        'L32',
        'Du repère à l’écran : centrer',
        'From coordinates to screen: centring',
      ),
      topic(55, 'L32', 'Changer d’unité', 'Changing units'),
      topic(
        56,
        'L33',
        'Rastériser : quels pixels allumer ?',
        'Rasterising: which pixels?',
      ),
      topic(58, 'L33', 'Corriger les trous', 'Fixing gaps'),
      topic(59, 'L33', 'L’idée de Bresenham', 'Bresenham’s idea'),
      topic(60, 'L31', 'Remplir un triangle', 'Filling a triangle'),
    ],
  },
  {
    title: {
      fr: 'Introduction au machine learning : la droite de régression',
      en: 'Introduction to machine learning: the regression line',
    },
    topics: [
      topic(62, 'L36', 'Une découverte troublante', 'A puzzling discovery'),
      topic(63, 'L34', 'Le modèle', 'The model'),
      topic(65, 'L34', 'Mesurer l’erreur', 'Measuring error'),
      topic(
        67,
        'L34',
        'La méthode des moindres carrés',
        'The least-squares method',
      ),
      topic(68, 'L35', 'La formule', 'The formula'),
      topic(69, 'L35', 'Compléter le carré', 'Completing the square'),
      topic(70, 'L35', 'Preuve : le meilleur p', 'Proof: the best p'),
      topic(72, 'L35', 'Preuve : le meilleur m', 'Proof: the best m'),
      topic(
        73,
        'L35',
        'À la main, sur quatre années',
        'By hand, using four years',
      ),
      topic(77, 'L35', 'Résultat et prédiction', 'Result and prediction'),
      topic(79, 'L35', 'En Python', 'In Python'),
      topic(
        80,
        'L36',
        'Vous venez de faire du machine learning',
        'You have just done machine learning',
      ),
      topic(
        81,
        'L36',
        'Le coefficient de corrélation',
        'The correlation coefficient',
      ),
      topic(
        82,
        'L36',
        'Limite 1 : corrélation et causalité',
        'Limit 1: correlation and causation',
      ),
      topic(
        83,
        'L36',
        'Limite 2 : le quartet d’Anscombe',
        'Limit 2: Anscombe’s quartet',
      ),
      topic(84, 'L36', 'Limite 3 : valeurs aberrantes', 'Limit 3: outliers'),
      topic(85, 'L36', 'Limite 4 : extrapolation', 'Limit 4: extrapolation'),
      topic(87, 'L36', 'Et ensuite ?', 'What comes next?'),
    ],
  },
] as const;

export const droitesSourceTopics = droitesSourceParts.flatMap((part) => [
  ...part.topics,
]);
