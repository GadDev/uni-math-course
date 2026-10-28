# L05 — Revue pédagogique et interactions, 28 octobre 2026

La leçon est mathématiquement correcte dans ses formules principales et son exemple numérique. Son intuition des cartes est un bon point de départ. Elle demande cependant à un débutant d’accepter trop vite les lignes où l’antécédent est faux, puis de passer d’une règle générale à une formule concernant une carte. Les améliorations ci-dessous sont implémentées dans les deux langues ; le présent compte rendu et la leçon demandée restent en français.

Ordre de priorité :

1. **P1 — Comprendre avant de calculer.** Donner la définition par le seul cas d’échec avant la formule ; expliquer explicitement les deux lignes où A est fausse et distinguer une carte de toutes les cartes.
2. **P1 — Retrouver les étapes manquantes.** Définir contre-exemple, affectation et les symboles à leur première utilisation ; annoncer L03/L04 comme prérequis ; dérouler de Morgan et la double négation.
3. **P2 — Manipuler les exemples existants.** Ajouter une exploration libre des quatre cartes, des seuils 5/10 et des deux formules de négation, avec une prédiction avant chaque manipulation.
4. **P2 — Voir la structure.** Ajouter quatre cartes légendées, deux rangées d’entiers et les étapes dévoilables de la négation. Conserver une lecture complète sans JavaScript.

## Périmètre observé

Page publique consultée : <https://uni-math-course.vercel.app/fr/lessons/L05/>. Dépôt : <https://github.com/GadDev/uni-math-course>, base `6029895` (release 0.14.0). La lecture HTTP a permis d’inspecter le HTML publié ; le moteur de recherche n’a pas pu ouvrir cette URL. Les observations sur l’architecture proviennent des fichiers du dépôt, pas d’une supposition fondée sur l’extension Markdown.

Fichiers déterminants : `content/lessons/L05/{fr,en}.md`, `src/content.config.ts`, `src/pages/[locale]/lessons/[lessonId].astro`, `astro.config.ts`, `package.json`, `src/components/SecantExplorer.astro`, la route de pratique et les contrôles de publication. Le PDF source n’a pas été fourni pour cette revue ; la plage 20–23 est celle déjà déclarée par le projet, sans nouvelle affirmation de conformité au PDF.

## Explications qui pouvaient bloquer un débutant

| Passage initial précis | Risque de confusion | Correction implémentée |
| --- | --- | --- |
| « La règle échoue pour une carte rouge sans tampon. Elle ne dit rien sur les cartes bleues » | L’étudiant peut comprendre « indéterminé » plutôt que « implication vraie » quand A est fausse. | Définition par le seul échec, explication de la vérité par vacuité et lecture commentée des deux premières lignes. |
| « On peut calculer l’implication avec » suivi immédiatement de la formule | L’algorithme arrive avant la raison de cette table. | Définition et quatre cas d’abord ; réécriture NON A OU B ensuite, reliée aux cartes. |
| « toutes les affectations » | Affectation n’est pas expliqué localement. | « tous les choix de valeurs de A et B », puis rattachement aux quatre lignes. |
| Couleurs exclusives précisées après la table | Il faut revenir en arrière pour savoir si bleue signifie NON rouge. | Hypothèse rouge/bleue uniforme énoncée dès l’introduction. |
| « A garantit B » et « si B manque, A ne peut pas être vraie » | Le statut de l’implication est implicite ; les directions nécessaire/suffisant sont faciles à inverser. | « Quand A ⇒ B est vraie », deux lectures distinctes et un entier n fixé avant les assertions numériques. |
| Rappel des naturels après l’exemple | Le domaine arrive après son utilisation. | Définition de ℕ, zéro compris, avant n > 10 et n > 5. |
| « Nier la règle, c’est décrire son échec » | Confusion entre NON pour une carte fixée et négation d’une assertion portant sur toutes les cartes. | Distinction explicite : pour toutes les cartes, la négation affirme l’existence d’au moins un contre-exemple. Aucun quantificateur formel prématuré. |
| Passage direct de NON(NON A OU B) à A ET NON B | Deux opérations sont cachées et L04 n’est évoquée qu’après le calcul. | Prérequis L04 annoncé ; trois étapes ouvrables : réécriture, de Morgan, double négation. |
| « Ce travail guidé […] n’est pas une réponse indépendante pour mesurer la maîtrise » | Le vocabulaire d’évaluation coupe le raisonnement. | Formulation plus directe : exploration guidée ; distinction avec la pratique enregistrée à la fin. |
| « Une pause avant les symboles » placée après toutes les formules | La pause arrive trop tard pour jouer le rôle annoncé. | Intuition déplacée en amont ; cette section devient une vérification à reformuler sans tableau, avec réponse masquée. |

## Passages réécrits concrets

### Avant la table de vérité

> Définition : l’implication est fausse exactement lorsque A est vraie et B est fausse. Elle est vraie dans les trois autres cas.
>
> Pourquoi la déclarer vraie quand A est fausse ? Ici, « vraie » signifie que cette combinaison ne constitue pas l’échec interdit. Cela ne signifie ni que B est vraie, ni qu’A et B ont un lien causal.

### Pour nécessaire et suffisant

> Si n est plus grand que 10, il est forcément plus grand que 5. Cela vaut pour tout entier naturel : dépasser 10 suffit à garantir qu’on dépasse 5.
>
> B est une condition nécessaire pour A : B doit être vraie pour qu’A puisse être vraie. Mais B seule ne garantit pas A.

L’exemple 8 est conservé et le curseur rend visibles les frontières strictes : 5 ne satisfait pas n > 5 ; 10 satisfait n > 5 mais ne satisfait pas n > 10.

### Pour la négation

> Pour une carte fixée, nier l’implication revient à décrire son seul échec : la condition est remplie ET le résultat exigé manque.
>
> Pour nier la règle portant sur toutes les cartes, on dit : « il existe au moins une carte rouge sans tampon ». On ne dit pas que toutes les cartes sont rouges et sans tampon.

La leçon complète réécrite reste dans [fr.md](../../content/lessons/L05/fr.md). Les exemples d’origine sont conservés et enrichis à leur emplacement.

## Spécifications des interactions implémentées

| Interaction et emplacement | Concept et objectif | Manipulation | Mise à jour | Question de prédiction ou réflexion |
| --- | --- | --- | --- | --- |
| **Quatre cartes**, après l’exemple guidé bleu sans tampon | Relier les valeurs de A/B au seul échec, sans confondre conformité locale et preuve générale. | Deux listes natives : couleur rouge/bleue et présence/absence de tampon. État initial : bleue sans tampon. | Carte décrite en texte et accent coloré ; calcul NON A OU B ; justification ; encadrement de la ligne correspondante dans la table existante. | « Gardez la carte sans tampon et changez seulement sa couleur. Quand l’implication devient-elle fausse ? » |
| **Seuils 5/10**, à côté de l’exemple numérique nécessaire/suffisant | Comprendre la direction de l’implication et réfuter sa réciproque avec un entier. | Curseur entier n entre 0 et 15, initialement 8 ; flèches, Début et Fin au clavier. | Valeur de n, repère vertical, vérité de A : n > 10 et B : n > 5, valeurs des deux implications et explication du témoin. | « Que se passe-t-il à n = 5 puis à n = 10 ? Trouvez tous les entiers qui réfutent la réciproque avant de déplacer le curseur. » |
| **Trois étapes de négation**, après la négation de la règle des cartes | Identifier les règles successives plutôt que mémoriser un saut algébrique. | Ouvrir/fermer chaque étape avec un élément HTML details/summary, y compris sans JavaScript. | Révélation de la réécriture, de de Morgan, puis de la double négation. Chaque résumé nomme l’opération. | « Essayez de prévoir l’étape suivante avant de l’ouvrir. » |
| **Comparer les négations**, après le piège NON A ⇒ NON B | Distinguer nier une formule et nier ses deux termes ; comprendre qu’un seul désaccord réfute une équivalence. | Deux listes natives A/B, initialement A = B = 1, indépendantes de celles des cartes. | Valeurs de A ⇒ B, NON(A ⇒ B), A ET NON B et NON A ⇒ NON B ; explication de l’accord local ou du désaccord. | « Pour A = B = 1, la négation et l’implication entre les termes niés ont-elles la même valeur ? Testez ensuite les trois autres cas. » |

Ces exemples sont publics, explicatifs et non enregistrés. Ils n’importent aucun corrigé de la banque privée. Les sorties modifiées sont annoncées par des régions `aria-live="polite"` atomiques ; la couleur n’est jamais le seul indice. Les contrôles sont désactivés tant que le script n’est pas initialisé, avec un état initial lisible et un message noscript.

## Visuels et articulation avec le texte

- **Quatre cartes en grille 2 × 2**, immédiatement après l’intuition : [dessin français](../../public/diagrams/logic/L05-cards-fr.svg). Les mots rouge/bleue, avec/sans tampon et « ÉCHEC » donnent l’information indépendamment des couleurs. Les trois autres cases portent « Aucun échec », sans prétendre prouver la règle générale.
- **Deux rangées d’entiers**, intégrées à l’exploration des seuils : B commence à 6, A à 11. Les cercles ouverts marquent 5 et 10, les points représentent les entiers autorisés et les flèches continuent au-delà de la fenêtre. Le texte dit explicitement que le curseur ne constitue pas une preuve sur tout ℕ.
- **Calcul dévoilé en trois étapes**, au contact de la formule de négation : remplacer l’implication, nier le OU, éliminer NON NON. Chaque ligne est expliquée en mots. Il n’est pas nécessaire d’apprendre la notation des ensembles avant de comprendre ces visuels.

## Décision Astro / React / MDX

**Constat dans le code.** Le glob de `src/content.config.ts` charge `**/*.md` depuis `content/lessons`. La route appelle `render(lesson)` puis `<Content />`, et extrait les titres pour les sommaires et les correspondances FR/EN. KaTeX/MathML passent par remark-math et rehype-katex. React, ReactDOM et `@astrojs/react` sont installés ; `react()` figure déjà dans les intégrations. La pratique utilise une île React. MDX n’est pas installé actuellement.

**React est donc possible.** Une île telle que `<ImplicationExplorer client:visible />`, importée dans une page Astro ou dans un fichier MDX, pourrait rendre son état initial côté serveur et charger son interaction à l’apparition. Astro ne se limite pas au Markdown simple. Voir les documentations officielles : [îles](https://docs.astro.build/en/concepts/islands/), [intégration React](https://docs.astro.build/en/guides/integrations-guide/react/), [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/).

**Choix pour L05.** Les trois petits états manipulables et les révélations ne justifient ni une nouvelle couche React sur la lecture ni une migration du circuit de publication. Le précédent `SecantExplorer.astro` montre déjà le modèle composant Astro + script typé + contrôles natifs. Ici, `ImplicationExplorers.astro` apporte uniquement le script et le style ; les textes, figures, états initiaux et contrôles restent dans les fichiers Markdown. Le composant est rendu uniquement pour L05 ; le module de cette interaction est absent de L04. Dans la compilation vérifiée, Astro l’intègre directement au HTML de L05 : 3 169 octets de JavaScript minifié, sans ajout du runtime React. Les révélations natives et les figures n’ont besoin d’aucun JavaScript.

**Quand reconsidérer React/MDX.** React offrirait un bénéfice si plusieurs laboratoires réutilisaient un état complexe, des vues synchronisées ou des bibliothèques déjà écrites en React. MDX permettrait alors une composition directe de composants au milieu de la prose. Cela demanderait aussi d’adapter le glob et les outils de publication aujourd’hui liés aux chemins `.md` (`check-content`, empreintes et autres lecteurs), de préserver l’extraction des titres et de maintenir les deux langues. Aucune de ces migrations n’est nécessaire ici. Aucune dépendance n’a été ajoutée.

## Vérification mathématique et publication

Revue effectuée par Codex avec assistance d’IA : auto-vérification de l’auteur, pas revue mathématique indépendante ni validation humaine de traduction.

- Les quatre affectations donnent **1, 1, 0, 1** pour l’implication, **0, 0, 1, 0** pour sa négation et **1, 0, 1, 1** pour NON A ⇒ NON B. La définition par le seul échec et la réécriture NON A OU B se recoupent.
- De Morgan donne NON(NON A OU B) ≡ NON NON A ET NON B ≡ A ET NON B. L’argument verbal et les quatre affectations corroborent le calcul.
- Pour n naturel, n > 10 implique n > 5 par ordre des nombres. Les échecs de la réciproque satisfont n > 5 et n ≤ 10, donc exactement 6–10. Cela justifie la conclusion sur tout ℕ, indépendamment des 16 valeurs de la démonstration.
- Pour nier l’assertion portant sur toutes les cartes, un témoin suffit ; la formule propositionnelle affichée concerne une carte fixée. Les deux niveaux sont explicitement séparés.
- Les versions française et anglaise ont été comparées pour les hypothèses de couleur, les quatre cas, les seuils stricts, les domaines, les étapes de négation, les avertissements sur preuve générale et les sorties des interactions. Le contrôle des chaînes mathématiques et des titres complète cette lecture sans certifier à lui seul la traduction.

La version de lecture passe de 4 à 5 dans les deux langues. La banque sélectionnée reste **v3**, sans modification d’exercice ni de contrat de notation. Les preuves précédentes de revue de la banque restent dans [la revue de clarté du 23 octobre](LESSON_CLARITY_REVIEW_2026-10-23.md) et ses documents liés. Le registre renouvelle uniquement les empreintes des deux leçons, l’empreinte de la source française de traduction et les liens vers cette preuve de révision.

## Résultats de validation

Exécution avec **Node 24.19.0**, **pnpm 11.25.0** et Chrome Headless Shell **156.0.8078.4**, version de Chromium correspondant au Playwright verrouillé. Le téléchargement standard via le CDN retournait une page HTML ; le même navigateur sans interface a été obtenu depuis le stockage officiel Chrome for Testing. Aucun réglage du dépôt n’a été modifié pour cet environnement.

- **`pnpm check` : réussi.** Documentation et liens, politique de publication, 49 leçons bilingues, types (0 erreur), formatage, **302 tests réussis** et compilation de production Vercel réussie. Les huit suggestions TypeScript existantes ne sont pas des erreurs.
- **Nouveaux scénarios L05 : 11/11 réussis.** Les quatre affectations sont vérifiées dans les deux laboratoires, avec indépendance de leurs états ; les 16 entiers du curseur, 5 et 10 compris, sont parcourus au clavier. Les résultats attendus sont définis indépendamment des calculs du composant.
- **Accessibilité et mobile : vérifiés automatiquement et visuellement.** Noms accessibles des contrôles, focus visible, manipulation au clavier et ouverture/fermeture par Entrée/Espace ; dimensions de cibles d’au moins 44 px ; absence de débordement à 320, 375, 768 et 1280 px dans les deux langues et les deux thèmes ; lecture et révélations natives avec JavaScript désactivé. Captures inspectées des trois laboratoires et du dessin des cartes en français à 375 et 1280 px. Aucun essai avec un lecteur d’écran réel ni étude auprès d’étudiants n’est revendiqué.
- **Chargement : vérifié.** L05 ne contient aucune île React. Le module d’exploration est présent uniquement dans cette leçon et absent de L04 ; les états initiaux et toutes les explications restent lisibles sans JavaScript.
- **`pnpm test:e2e` complet : 264 réussis, 3 échecs.** Les trois échecs portent sur l’en-tête français à **1051 px** dans `chapter-navigation`, `reading` et `theme` : largeur mesurée **1052 px**, limite attendue **1051 px**. Ils ne sont pas masqués ni assouplis. Le même débordement est reproduit dans un checkout détaché de la base `6029895`, sans les changements de L05. Il s’agit d’un défaut antérieur de la navigation partagée, laissé hors du périmètre de cette leçon ; la suite complète n’est donc pas présentée comme entièrement verte.

La vérification mathématique reste une auto-vérification documentée. Le passage en production de la leçon et la correction de l’en-tête nécessitent les décisions de maintenance habituelles ; cette modification est proposée en PR brouillon, sans fusion ni déploiement manuel.
