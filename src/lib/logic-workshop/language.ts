import { say } from './types.ts';

export const assertionExamples = [
  [
    'calculation',
    say('Sept est un nombre pair.', 'Seven is an even number.'),
    1,
  ],
  ['geometry', say('Un carré a quatre côtés.', 'A square has four sides.'), 0],
  ['request', say('Fermez la fenêtre.', 'Close the window.'), 2],
  ['question', say('Le fichier est-il lisible ?', 'Is the file readable?'), 2],
  [
    'variable',
    say(
      'x est supérieur à 5 (aucune valeur de x n’est donnée).',
      'x is greater than 5 (no value for x is given).',
    ),
    2,
  ],
  ['threshold', say('Pour x = 3, x ≥ 2.', 'For x = 3, x ≥ 2.'), 0],
  [
    'contradiction',
    say(
      'Le nombre 5 est à la fois pair et impair.',
      'The number 5 is both even and odd.',
    ),
    1,
  ],
  [
    'zero',
    say('0 appartient à l’ensemble vide.', '0 belongs to the empty set.'),
    1,
  ],
] as const;

export const translations = [
  [
    'export',
    say(
      'A : le rapport est exporté. B : le rapport est signé.',
      'A: the report is exported. B: the report is signed.',
    ),
    say(
      'Le rapport est exporté seulement s’il est signé.',
      'The report is exported only if it is signed.',
    ),
    'A ⇒ B',
  ],
  [
    'backup',
    say(
      'A : la sauvegarde est terminée. B : une notification est envoyée.',
      'A: backup is complete. B: a notification is sent.',
    ),
    say(
      'Une notification est envoyée si la sauvegarde est terminée.',
      'A notification is sent if backup is complete.',
    ),
    'A ⇒ B',
  ],
  [
    'door',
    say(
      'A : le badge est valide. B : la porte s’ouvre.',
      'A: the badge is valid. B: the door opens.',
    ),
    say(
      'Un badge valide est nécessaire pour que la porte s’ouvre.',
      'A valid badge is necessary for the door to open.',
    ),
    'B ⇒ A',
  ],
  [
    'build',
    say(
      'A : le lint passe. B : le build démarre.',
      'A: lint passes. B: the build starts.',
    ),
    say(
      'Il suffit que le lint passe pour que le build démarre.',
      'Passing lint is sufficient for the build to start.',
    ),
    'A ⇒ B',
  ],
  [
    'seat',
    say(
      'A : le siège est réservé. B : le billet est payé.',
      'A: the seat is reserved. B: the ticket is paid for.',
    ),
    say(
      'Le siège est réservé si et seulement si le billet est payé.',
      'The seat is reserved if and only if the ticket is paid for.',
    ),
    'A ⇔ B',
  ],
  [
    'signal',
    say(
      'A : le feu est vert. B : le passage est libre.',
      'A: the light is green. B: the crossing is clear.',
    ),
    say(
      'Même si le feu est vert, le passage n’est pas libre. Les deux faits sont constatés.',
      'Even though the light is green, the crossing is not clear. Both facts are observed.',
    ),
    'A ∧ ¬B',
  ],
  [
    'maintenance',
    say(
      'A : le serveur est joignable. B : le mode maintenance est actif.',
      'A: the server is reachable. B: maintenance mode is active.',
    ),
    say(
      'Il est faux que le serveur soit joignable ou que le mode maintenance soit actif.',
      'It is false that the server is reachable or that maintenance mode is active.',
    ),
    '¬(A ∨ B)',
  ],
  [
    'sensor',
    say(
      'A : le capteur gauche détecte un obstacle. B : le capteur droit détecte un obstacle.',
      'A: the left sensor detects an obstacle. B: the right sensor detects an obstacle.',
    ),
    say(
      'Au moins un capteur détecte un obstacle.',
      'At least one sensor detects an obstacle.',
    ),
    'A ∨ B',
  ],
  [
    'warning',
    say(
      'A : la batterie est faible. B : le système émet une alerte. C : le système est en charge.',
      'A: the battery is low. B: the system issues a warning. C: the system is charging.',
    ),
    say(
      'Si la batterie est faible et que le système n’est pas en charge, alors il émet une alerte.',
      'If the battery is low and the system is not charging, then it issues a warning.',
    ),
    '(A ∧ ¬C) ⇒ B',
  ],
  [
    'badge',
    say(
      'A : l’accès est accordé. B : le badge est valide. C : le code est correct.',
      'A: access is granted. B: the badge is valid. C: the code is correct.',
    ),
    say(
      'L’accès est accordé seulement si le badge est valide et que le code est correct.',
      'Access is granted only if the badge is valid and the code is correct.',
    ),
    'A ⇒ (B ∧ C)',
  ],
  [
    'invoice',
    say(
      'A : le paiement est reçu. B : la facture est clôturée.',
      'A: payment has been received. B: the invoice is closed.',
    ),
    say(
      'Niez la règle « Si le paiement est reçu, la facture est clôturée ».',
      'Negate the rule “If payment has been received, the invoice is closed”.',
    ),
    'A ∧ ¬B',
  ],
  [
    'record',
    say(
      'A : le dossier est validé. B : la liste de contrôle est complète.',
      'A: the record is approved. B: the checklist is complete.',
    ),
    say(
      'Écrivez la contraposée de « Un dossier validé a une liste de contrôle complète ».',
      'Write the contrapositive of “An approved record has a complete checklist”.',
    ),
    '¬B ⇒ ¬A',
  ],
  [
    'alert',
    say(
      'A : l’alarme retentit. B : la porte est ouverte.',
      'A: the alarm sounds. B: the door is open.',
    ),
    say(
      'Écrivez la réciproque de « Si la porte est ouverte, l’alarme retentit ».',
      'Write the converse of “If the door is open, the alarm sounds”.',
    ),
    'A ⇒ B',
  ],
  [
    'member',
    say(
      'A : le membre est inscrit. B : il reçoit les annonces.',
      'A: the member is registered. B: they receive announcements.',
    ),
    say(
      'Écrivez l’inverse de « Si le membre est inscrit, il reçoit les annonces ».',
      'Write the inverse of “If the member is registered, they receive announcements”.',
    ),
    '¬A ⇒ ¬B',
  ],
  [
    'train',
    say(
      'A : le train est à l’heure. B : le bus est à l’heure.',
      'A: the train is on time. B: the bus is on time.',
    ),
    say(
      'Exactement un des deux véhicules est à l’heure.',
      'Exactly one of the two vehicles is on time.',
    ),
    '(A ∨ B) ∧ ¬(A ∧ B)',
  ],
  [
    'login',
    say(
      'A : le nom est reconnu. B : le mot de passe est correct. C : la session s’ouvre.',
      'A: the username is recognised. B: the password is correct. C: the session opens.',
    ),
    say(
      'La session s’ouvre si et seulement si le nom est reconnu et le mot de passe correct.',
      'The session opens if and only if the username is recognised and the password is correct.',
    ),
    'C ⇔ (A ∧ B)',
  ],
] as const;

export const implicationCases = [
  [
    'divisibility',
    say(
      'Sur ℤ, si n est multiple de 6, alors n est divisible par 3. Quel n réfute la réciproque ?',
      'Over ℤ, if n is a multiple of 6, then n is divisible by 3. Which n refutes the converse?',
    ),
    ['6', '9', '14'],
    1,
    say(
      '9 est divisible par 3 mais n’est pas multiple de 6.',
      '9 is divisible by 3 but is not a multiple of 6.',
    ),
  ],
  [
    'square',
    say(
      'Sur ℝ, x > 3 implique x² > 9. Quel x réfute la réciproque ?',
      'Over ℝ, x > 3 implies x² > 9. Which x refutes the converse?',
    ),
    ['−4', '3', '4'],
    0,
    say(
      'Pour x = −4, x² = 16 > 9 mais x > 3 est faux.',
      'At x = −4, x² = 16 > 9 but x > 3 is false.',
    ),
  ],
  [
    'temperature',
    say(
      'Toute alerte rouge exige une mesure au-dessus du seuil. Quelle situation réfute cette règle ?',
      'A red alert requires a measurement above the threshold. Which situation refutes this rule?',
    ),
    [
      say('Mesure haute, pas d’alerte', 'High measurement, no alert'),
      say('Alerte rouge, mesure haute', 'Red alert, high measurement'),
      say(
        'Alerte rouge, mesure sous le seuil',
        'Red alert, measurement below threshold',
      ),
    ],
    2,
    say(
      'L’alerte est présente alors que sa condition nécessaire manque.',
      'The alert is present while its necessary condition fails.',
    ),
  ],
  [
    'rectangle',
    say(
      'La règle « Tout carré est un rectangle » est vraie. Quel objet réfute sa réciproque ?',
      'The rule “Every square is a rectangle” is true. Which object refutes its converse?',
    ),
    [
      say('Un carré de côté 2', 'A square of side 2'),
      say('Un rectangle 2 × 3', 'A 2 × 3 rectangle'),
      say('Un triangle', 'A triangle'),
    ],
    1,
    say(
      'Le rectangle 2 × 3 satisfait le nouvel antécédent et n’est pas un carré.',
      'The 2 × 3 rectangle meets the new antecedent and is not a square.',
    ),
  ],
  [
    'equivalent',
    say(
      'Quelle forme est toujours équivalente à la réciproque de A ⇒ B ?',
      'Which form is always equivalent to the converse of A ⇒ B?',
    ),
    ['¬B ⇒ ¬A', 'A ∧ ¬B', '¬A ⇒ ¬B'],
    2,
    say(
      'L’inverse de A ⇒ B est la contraposée de B ⇒ A.',
      'The inverse of A ⇒ B is the contrapositive of B ⇒ A.',
    ),
  ],
  [
    'false-antecedent',
    say(
      'Une règle dit « Si le téléchargement se termine, un résumé s’affiche ». Le téléchargement s’interrompt et aucun résumé ne s’affiche. Que vaut l’implication pour ce cas ?',
      'A rule says “If the download completes, a summary appears”. The download stops and no summary appears. What is the implication’s value in this case?',
    ),
    ['0', '1'],
    1,
    say(
      'Avec un antécédent faux, l’implication vaut 1.',
      'With a false antecedent, the implication is true.',
    ),
  ],
] as const;
