# L04 — Revue pédagogique et laboratoires booléens

## Périmètre et constat

Revue du 28 octobre 2026, base `416c57c5d91bf3b341fb72dd4dc87b79811f3dcb`. Le HTML public de <https://uni-math-course.vercel.app/fr/lessons/L04/> a été téléchargé et son article lu ; le moteur de recherche ne pouvait pas ouvrir cette URL. Les constats d’architecture proviennent du dépôt.

L04 traite l’équivalence sémantique, les lois booléennes, les tautologies, contradictions et contre-exemples (pages 15–19 selon la carte existante). **Les dérivées, sécantes et tangentes appartiennent à L38**, après l’introduction aux fonctions L37 ; elles ne sont pas des prérequis de L04. Aucune modification de ces autres leçons n’est incluse. Le PDF original n’a pas été fourni ; aucune nouvelle comparaison directe au PDF n’est revendiquée.

Priorités : (1) expliciter les symboles et la méthode de vérification ; (2) distinguer accord local et équivalence globale par manipulation ; (3) détailler les transformations et donner une pratique avant correction ; (4) conserver une lecture et une impression autonomes.

## Passages précis et corrections

| Passage initial | Difficulté possible | Changement |
| --- | --- | --- |
| « pour toute affectation » dans la définition ; explication du mot seulement après plusieurs sections | Un débutant ne sait pas ce qu’il doit faire varier. | Définition locale du mot, mémo 0/1 et NON/ET/OU inclusif, comptage de 4 et 8 lignes avant la définition. |
| « Deux assertions A et B sont sémantiquement équivalentes » | Formalisme avant motivation ; confusion entre un accord sur une situation et une loi. | Deux contrôles d’accès équivalents, puis exemple ET/OU qui coïncide sur 11 mais échoue sur 10. |
| « NOT inverse la valeur » dans le français | Changement de vocabulaire inutile. | NON et notation cohérente. |
| « Calculez les deux membres sur les huit affectations » | La construction des lignes et les calculs intermédiaires sont implicites. | Méthode en quatre gestes, ordre binaire expliqué et ligne 010 entièrement calculée avant la table existante. |
| Distributivité : « A accompagne chaque possibilité » | La copie des branches et le rôle de la factorisation restent abstraits. | Calcul 101, erreur de branche oubliée, méthode développer/factoriser et laboratoire réversible. |
| De Morgan : deux formules en une phrase puis une seule table | Les deux lois risquent d’être confondues ; nier les termes sans changer le connecteur semble plausible. | Méthode en quatre étapes, raisonnement par échec, seconde table, carte des quatre cas et variante erronée réfutable. |
| « Corrections : … » juste après les trois questions | La réponse se lit avant l’essai. | Correction native repliable avec justification de chaque étape ; défi de négation imbriquée avec explication. |
| « Ce travail guidé […] n’est pas une réponse indépendante pour mesurer la maîtrise » | Le vocabulaire du système d’évaluation interrompt l’apprentissage. | Consigne concrète : cacher les colonnes puis les reconstruire sur papier. |
| Un seul paragraphe « À retenir » | Peu utile pour retrouver une méthode pendant un exercice. | Fiche de révision : lois, mode d’emploi, trois erreurs fréquentes et auto-évaluation. |

Extraits nouveaux : « Un accord ne prouve donc rien au-delà de sa ligne » ; « En développant, recopiez la partie commune dans chaque branche » ; « Pour que A OU B échoue, les deux doivent échouer ». Le texte complet français est dans [fr.mdx](../../content/lessons/L04/fr.mdx), avec version anglaise alignée [en.mdx](../../content/lessons/L04/en.mdx).

## Interactions et visuels

| Activité et objectif | Manipulation | Résultat mis à jour | Prédiction et état initial |
| --- | --- | --- | --- |
| Réécrire sans changer le sens : séparer accord local et équivalence | Choix parmi huit exemples (réécriture imbriquée, deux commutativités, deux associativités, double négation, tiers exclu, non-contradiction), valeurs 0/1, variante incorrecte pour l’exemple imbriqué | Deux expressions, calcul local, table exhaustive, ligne marquée par flèche et encadrement, verdict global, contre-exemple sélectionnable, étapes justifiées | Prédire les résultats en A=1, B=0 ; l’accord suffit-il ? Exemple initial : NON(NON A OU B). |
| De Morgan : comprendre les deux négations de groupes | Choisir ET/OU, A/B, activer l’erreur qui conserve le connecteur | Carte des quatre affectations de l’univers U, hachures pour la vérité de G, valeurs G/D, table et contre-exemple | Une seule condition manquante suffit-elle ? Initial : NON(A ET B), A=1, B=0. |
| Distributivité : conserver les deux branches dans les deux sens | Choisir ET sur OU ou OU sur ET, développer/factoriser, A/B/C, tester la branche supprimée | Expressions et calculs, huit lignes, verdict et témoin, explication de la réécriture correcte | Peut-on supprimer la branche C en 101 ? Initial : ET sur OU, 101. |

Chaque laboratoire a son propre état et une remise à zéro complète. Les formes proposées sont structurées en arbres typés ; il n’y a ni saisie de code exécuté ni import des corrigés de pratique. Les étapes correctes restent explicitement séparées de la variante fautive. Le sens inverse échange réellement les formules et les colonnes, et indique de lire les étapes de bas en haut.

Le schéma original de groupement est conservé à son emplacement et expliqué. La nouvelle carte De Morgan est un découpage exact des quatre affectations, sans demander les notions d’intersection ou de complément d’ensembles qui arrivent plus tard. Les nombres, flèches, mots et hachures portent le sens sans dépendre de la couleur.

## Architecture, accessibilité et impression

Le dépôt configure déjà `react()` et `mdx()` ; la collection charge `**/*.{md,mdx}` et la route appelle `render(lesson)` puis `<Content />`. Le même parcours extrait les titres et relie leurs ancres FR/EN. Les deux sources L04 deviennent MDX pour composer les trois laboratoires au contact des explications. Les titres de contenu et leur hiérarchie sont conservés entre les langues.

React est utile ici pour synchroniser expressions, tables complètes, erreurs, témoins et diagramme entre plusieurs commandes. Trois îles `client:visible` réutilisent un seul composant et un module mathématique public. Aucune dépendance ou intégration nouvelle ; pas de modification de la route commune. La prose et l’état initial sont rendus côté serveur ; les commandes apparaissent après hydratation. Les solutions natives restent ouvrables sans JavaScript.

Les listes, boutons et cases sont natifs, étiquetés, hauts d’au moins 44 px, avec focus visible ; les tables ont légendes et en-têtes et une région défilable au clavier. Une région de statut polie annonce calcul, verdict et témoin. Pas d’animation. La fiche imprimée et les exemples fixes sont indépendants de la dernière manipulation ; les commandes et la navigation sont masquées, les corrections développées et la fiche de révision démarre sur une nouvelle page.

## Auto-vérification mathématique et bilingue

Révision assistée par IA et auto-vérification de l’auteur, sans relecture humaine indépendante revendiquée. La banque publiée L04 **v6 est inchangée** ; son contrôle antérieur reste documenté dans [la revue de clarté](LESSON_CLARITY_REVIEW_2026-10-23.md) et [la correction initiale](corrections/L04_2026-10-16.md). La lecture passe de v4 à **v5** dans les deux langues ; seules ses empreintes et les références de revue sont renouvelées.

Vérification indépendante des colonnes binaires, dans l’ordre 00, 01, 10, 11 ou 000 à 111 : NON(NON A OU B) = 0010 ; NON(A ET B) = 1110 ; NON(A OU B) = 1000 ; ET sur OU = 00000111 ; OU sur ET = 00011111. Chaque transformation intermédiaire est vérifiée contre ces colonnes, et non seulement contre une autre sortie du même évaluateur. Les cinq variantes fautives ont à la fois un accord local et un témoin réel de désaccord. La distinction entre ≡ et le connecteur ⇔ reste conservée ; les constantes suivent ⊤ et NON ⊤.

Les deux textes ont été comparés pour les hypothèses, définitions, formules, ordre des affectations, exemples 11/10/101/010, méthodes, défis, solutions et pratique publique/enregistrée. Les chaînes mathématiques et la hiérarchie de titres sont également comparées automatiquement pendant la préparation. Cette vérification ne certifie pas une traduction humaine.

## Captures de référence

- [De Morgan sur ordinateur](../design/implementation/l04/morgan-fr-desktop.webp).
- [De Morgan à 320 px](../design/implementation/l04/morgan-fr-mobile.webp).
- [Distributivité à 320 px, thème sombre](../design/implementation/l04/distributivity-fr-mobile-dark.webp).

## Validation

Branche actualisée sur `08ae1e5` (fusion des améliorations L39 et L41), sans changement de périmètre L04. Exécution avec **Node 24.19.0** et **pnpm 11.25.0**, dépendances verrouillées.

- **`pnpm check` : réussi**, avec documentation/liens, politique de publication, 49 leçons bilingues, TypeScript (0 erreur), formatage, **327 tests** et compilation de production Vercel.
- **L04 : 13/13 scénarios navigateur réussis** dans la suite finale. Ils couvrent les 12 exemples et leurs tables attendues indépendantes, les quatre affectations de chaque de Morgan, les huit affectations de chaque distributivité, le sens inverse, les erreurs/témoins, la remise à zéro et l’indépendance des états.
- **Suite navigateur complète sur la base actualisée : 314 réussis, 3 échecs sur 317**. Les seuls échecs concernent l’en-tête français à **1051 px** dans `chapter-navigation`, `reading` et `theme` : largeur de document 1052 px. Les trois mêmes tests échouent sur un checkout détaché inchangé de `416c57c`, dont le statut Git reste propre ; aucun fichier d’en-tête ou de thème n’a changé dans les deux fusions suivantes. Aucune assertion n’est assouplie. La suite complète et le contrôle CI requis ne sont donc pas présentés comme verts.
- **Clavier, mobile et lecture sans JavaScript : vérifiés.** Listes natives par Début/Fin, focus visible, solutions par Entrée/Espace, cibles de commande d’au moins 44 px, tables accessibles au clavier ; vues 320/375/768/1440 px dans les deux thèmes ; tactile et préférence de mouvement réduit ; lecture publique et solutions sans JavaScript. Aucune hydratation booléenne dans L03 ; le script d’implication de L05 reste séparé.
- **Inspection visuelle :** trois laboratoires sur ordinateur, carte De Morgan à 320 px et distributivité en thème sombre ; labels agrandis après inspection. Les deux impressions A4 ont été rendues en PNG et inspectées : **12 pages françaises**, **11 anglaises**, dont une fiche de révision sur une page. Calculs et preuves fixes sont placés à côté de leur table sur papier ; les commandes sont masquées et les corrections développées. Les PDF sont des sorties temporaires de vérification, pas des documents de cours supplémentaires dans Git.
- **Immutabilité :** `CONTENT_BASE_REF=origin/main node scripts/check-immutable-exercises.ts` réussi ; aucune banque modifiée. Formules françaises/anglaises et niveaux de titres comparés ; `git diff --check` réussi.

Le téléchargement Chromium standard du Playwright verrouillé retourne une archive tronquée dans cet environnement. Les essais utilisent **Chromium 153.0.8010.0** temporaire via `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, déjà prévu par le dépôt ; aucun navigateur ou réglage d’environnement n’est ajouté au projet. La validation avec le navigateur CI standard, un lecteur d’écran réel, des appareils physiques et des étudiants n’est pas revendiquée. La validation mathématique/traduction reste une auto-vérification assistée par IA. Aucune fusion ni publication manuelle du site n’est effectuée.
