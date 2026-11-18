import { say } from './types.ts';

export const workshopCopy = {
  title: say(
    'Atelier de logique propositionnelle',
    'Propositional logic workshop',
  ),
  intro: say(
    'Testez une règle, cherchez la ligne qui la contredit, puis entraînez-vous sur les exercices du chapitre 1.',
    'Test a rule, look for the row that breaks it, then practise with questions from Chapter 1.',
  ),
  pdf: say(
    'Télécharger la fiche d’examen (PDF)',
    'Download the exam reference (French PDF)',
  ),
  review: say('Réviser une technique', 'Review a technique'),
  example: say('Voir l’exemple guidé', 'See a worked example'),
  practice: say('À vous de jouer', 'Try it yourself'),
  course: say('Cours · Chapitre 1', 'Course · Chapter 1'),
  laws: say('Table des lois booléennes', 'Boolean law reference'),
  lawName: say('Loi', 'Law'),
  rule: say('Équivalence', 'Equivalence'),
  advanced: say('Approfondissement', 'Extension'),
  noJs: say(
    'Activez JavaScript pour répondre aux questions. Les exemples et la fiche PDF restent disponibles.',
    'Enable JavaScript to answer questions. Worked examples and the PDF are available here.',
  ),
};

export const topicCopy = {
  truth: {
    title: say('Assertions et tables de vérité', 'Assertions and truth tables'),
    summary: say(
      'Repérez ce qui peut être vrai ou faux. Calculez les groupes intérieurs avant le connecteur principal.',
      'Identify what can be true or false. Evaluate the inner groups before the main connective.',
    ),
    example: say(
      'Pour A = 1 et B = 0, ¬B vaut 1, donc A ∧ ¬B vaut 1. Sur les quatre lignes 00, 01, 10, 11, la colonne est 0, 0, 1, 0. La formule est contingente.',
      'When A = 1 and B = 0, ¬B is true, so A ∧ ¬B is true. Across the four rows 00, 01, 10, 11, its column is 0, 0, 1, 0. The formula is contingent.',
    ),
  },
  implication: {
    title: say(
      'Implication et langage courant',
      'Implication in everyday language',
    ),
    summary: say(
      'Pour A ⇒ B, A suffit et B est nécessaire. Repérez le sens de « si » et de « seulement si ».',
      'In A ⇒ B, A is sufficient and B is necessary. Identify the direction of “if” and “only if”.',
    ),
    example: say(
      '« Un fichier est publié seulement s’il est relu » signifie publié ⇒ relu. La réciproque est relu ⇒ publié, l’inverse ¬publié ⇒ ¬relu et la contraposée ¬relu ⇒ ¬publié. Un fichier relu mais gardé en brouillon réfute la réciproque. Il faudrait un fichier publié sans relecture pour réfuter la règle initiale.',
      '“A file is published only if it has been reviewed” means published ⇒ reviewed. The converse is reviewed ⇒ published, the inverse ¬published ⇒ ¬reviewed, and the contrapositive ¬reviewed ⇒ ¬published. A reviewed file still in draft refutes the converse. A published file without a review would refute the original rule.',
    ),
  },
  equivalence: {
    title: say(
      'Biconditionnelle et équivalence',
      'Biconditional and equivalence',
    ),
    summary: say(
      '⇔ produit une valeur sur chaque ligne. ≡ affirme que toutes les lignes coïncident.',
      '⇔ produces a truth value on each row. ≡ says that the columns agree on every row.',
    ),
    example: say(
      'Si A = B = 0, les deux implications de A ⇔ B valent 1 et la biconditionnelle vaut 1. À la ligne A = 1, B = 0, elle vaut 0. Les colonnes de A et de B diffèrent sur cette ligne, donc A et B ne sont pas équivalentes.',
      'When A = B = 0, both implications in A ⇔ B are true, so the biconditional is true. On row A = 1, B = 0, it is false. The columns for A and B differ on that row, so A and B are not equivalent.',
    ),
  },
  laws: {
    title: say(
      'Lois booléennes et simplification',
      'Boolean laws and simplification',
    ),
    summary: say(
      'Réécrivez un groupe à la fois et nommez la loi utilisée à chaque étape.',
      'Rewrite one group at a time and name the law used at each step.',
    ),
    example: say(
      '¬(¬A ∨ B) ≡ ¬¬A ∧ ¬B (De Morgan) ≡ A ∧ ¬B (double négation). Pour vérifier, comparez toutes les lignes de la formule de départ et du résultat.',
      '¬(¬A ∨ B) ≡ ¬¬A ∧ ¬B (De Morgan) ≡ A ∧ ¬B (double negation). To check, compare every row of the starting formula and the result.',
    ),
  },
};

export const practiceCopy = {
  mixed: say('Tous les thèmes', 'Mixed topics'),
  all: say('Tous les niveaux', 'All levels'),
  discovery: say('Découverte', 'Discovery'),
  exam: say('Préparation à l’examen', 'Exam practice'),
  challenge: say('Défi', 'Challenge'),
  topic: say('Thème', 'Topic'),
  difficulty: say('Niveau', 'Level'),
  start: say('Démarrer une série', 'Start a session'),
  checking: say('Chargement…', 'Loading…'),
  question: say('Question', 'Question'),
  choice: say('Votre choix', 'Your choice'),
  answer: say('Votre formule', 'Your formula'),
  syntax: say(
    'Utilisez A, B, C et des parenthèses. Vous pouvez aussi saisir !, &, |, -> et <->.',
    'Use A, B, C and parentheses. You can also type !, &, |, -> and <->.',
  ),
  formulaRequired: say(
    'Saisissez votre traduction en symboles.',
    'Enter your translation in symbols.',
  ),
  submit: say('Vérifier', 'Check answer'),
  hint: say('Voir un indice', 'Show a hint'),
  reveal: say('Afficher la solution', 'Reveal the solution'),
  next: say('Question suivante', 'Next question'),
  finish: say('Série terminée !', 'Session complete!'),
  firstTry: say('Résolues du premier coup', 'Solved on the first try'),
  solved: say(
    'Résolues sans afficher la solution',
    'Solved without revealing the solution',
  ),
  practiceAgain: say(
    'Reprendre les questions à revoir',
    'Retry questions to review',
  ),
  newSession: say('Nouvelle série', 'New session'),
  reviewTopics: say('Thèmes à revoir', 'Topics to revisit'),
  continue: say('Continuer avec une leçon', 'Continue with a lesson'),
  table: say('Table de vérité', 'Truth table'),
  tableCheck: say(
    'Vérification par table de vérité',
    'Check with a truth table',
  ),
  row: say('Ligne', 'Row'),
  output: say('valeur de la formule', 'value of the formula'),
  wrong: say('À revoir', 'Review'),
  error: say(
    'La réponse n’a pas pu être chargée. Réessayez : votre saisie est conservée.',
    'The response could not be loaded. Try again. Your input has been kept.',
  ),
  finalFeedback: say(
    'Retour sur la dernière question',
    'Feedback on the final question',
  ),
};
