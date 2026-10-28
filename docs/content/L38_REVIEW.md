# L38 — De la sécante à la dérivée

Révision du 28 octobre 2026. État : auto-vérification pédagogique, mathématique et bilingue assistée par IA ; aucune relecture humaine indépendante ni validation du site déployé n’est revendiquée. La page publique et les sources à partir du commit `0b6badb` ont été consultées. Le PDF d’origine n’était pas disponible pour une nouvelle comparaison.

## Bilan et priorités

Les calculs de la leçon initiale sont corrects : pour f(x)=x²/2 en x₀=1, la pente de la sécante est 1+h/2 pour h non nul, sa limite vaut 1 et la tangente a pour équation y=x−1/2. Les difficultés portent surtout sur les étapes laissées implicites et l’absence de visualisation au fil de la lecture.

| Priorité | Passage ou section initiale | Obstacle pour un débutant | Amélioration réalisée |
| --- | --- | --- | --- |
| P1 | « Objectifs et prérequis » : quotient affiché avant l’introduction de x₀ et h. | Une nouvelle notation ressemble à un prérequis déjà maîtrisé. | Commencer par la question de la pente en un point, vérifier trois prérequis et expliquer chaque symbole avant le quotient. |
| P1 | « Pourquoi parler de vitesse ? » : distance et position sont rapprochées sans distinction. | Le quotient de positions donne un déplacement signé par unité de temps ; il ne donne pas toujours une distance totale divisée par une durée. | Utiliser s(t) pour la position, préciser les unités et le signe, montrer un exemple numérique. |
| P1 | « Définition de la dérivée » : limite finie et intervalle ouvert mentionnés sans explication. | Ni la notion de limite ni le rôle des deux côtés et du domaine ne sont accessibles. | Expliquer « autant que souhaité », puis préciser I ouvert, x₀ dans I, h non nul, x₀+h dans I et limite réelle finie commune. Relier Df(x₀) à f′(x₀). |
| P1 | « Exemple fil rouge » : passage immédiat du quotient à 1+h/2. | Le développement et la condition autorisant la simplification disparaissent. | Montrer successivement le carré, la soustraction et la division pour h non nul. |
| P1 | « Du numérique à la tangente » : h qui diminue et tableau essentiellement positif. | Un h négatif peut augmenter tout en se rapprochant de zéro ; un tableau ne prouve pas une limite. | Parler de la diminution de la valeur absolue, conserver les cinq valeurs d’origine, ajouter deux valeurs négatives et justifier la limite par l’écart h/2. |
| P1 | « Équation de la tangente » : pente et ordonnée peu distinguées. | Confusion possible entre f(x₀), f′(x₀), f′ et une équation de droite. | Calcul point → pente → équation ; contrôle du point et de la pente ; graphe séparé de f′. |
| P2 | « Essayez depuis les deux côtés » : renvoi à un prototype absent de la page. | L’étudiant doit quitter la lecture ou imaginer les mouvements. | Deux activités intégrées aux passages concernés ; ajouter le coin de la valeur absolue pour expliquer l’échec d’une limite commune. |
| P2 | Aucune synthèse sélective. | Le lecteur ne sait pas distinguer l’essentiel des manipulations exploratoires. | Trois mémos locaux, une fiche finale et trois questions avec corrections repliables. |

La progression est désormais : motivation → pente entre deux points → exemple détaillé → exploration → définition → tangente → fonction dérivée → contre-exemple → synthèse. La famille quadratique reste une application du quotient ; les règles générales de calcul restent réservées à L39.

## Passages réécrits représentatifs

> Une pente entre **deux points** décrit une variation moyenne. Comment parler de pente **en un seul point** d’une courbe ? Nous allons rapprocher les deux points, observer les pentes et donner un sens précis à leur valeur limite.

> Ici, h est un **écart d’abscisses**, pas une hauteur.

> Le tableau suggère une valeur limite égale à 1. La formule le justifie : la différence entre la pente et 1 est h/2, qui devient aussi petite que l’on veut lorsque h se rapproche suffisamment de zéro.

> La dérivée est une pente ; elle n’est pas l’équation de la droite.

La rédaction complète reste dans [la leçon française](../../content/lessons/L38/fr.mdx), avec sa [traduction anglaise](../../content/lessons/L38/en.mdx).

## Spécifications des interactions réalisées

| Interaction et objectif | Manipulation | Réponses visibles | Question de prédiction | Ce qu’il faut comprendre |
| --- | --- | --- | --- | --- |
| Sécante → tangente : comprendre une limite bilatérale. Placée après le tableau. | Curseur natif h de −2 à 2,5, pas 0,01 ; boutons −0,1, 0 et 0,1 ; réinitialisation. P reste (1 ; 1/2). | Q, droite PQ, triangle horizontal/vertical, écart, variation verticale et pente. La tangente de pente 1 reste dessinée. À h=0, disparition de PQ et du triangle, explication du quotient 0/0 non défini. | « Prédisez les pentes pour h = 0,1 et h = −0,1. Sont-elles égales ? Vers quel nombre se rapprochent-elles ? » | Les quotients peuvent différer avant la limite ; leur limite commune n’est pas une division par zéro. |
| Parabole, dérivée et tangente : distinguer règle, pente locale et droite. Placée après la dérivation de la formule générale. | Curseurs et saisies numériques pour a dans [−2,2], b et c dans [−3,3], x₀ dans [−3,3], pas 0,1 ; exemple x² ; retour à x²/2 en x₀=1. | Courbe de f, P, tangente ; second graphe de f′ avec R=(x₀,f′(x₀)) ; formules, valeurs locales, équations point–pente et simplifiée ; traitement affine/constant quand a=0. | « Avant de modifier c, prédisez : la courbe, la dérivée et la tangente vont-elles toutes changer ? » Puis tester le sommet et le signe de la pente. | Modifier c translate f et la tangente sans changer f′. Déplacer x₀ change le point étudié. La hauteur sur le graphe de f′ représente la pente sur le graphe de f. |

Les bornes des commandes sont des limites d’exploration, pas des domaines mathématiques. Les deux graphes partagent la même fenêtre horizontale [−4,4]. Leurs échelles verticales sont graduées et s’adaptent aux coefficients ; elles peuvent différer. Le texte indique de lire les valeurs plutôt que de comparer les angles. Les valeurs calculées sont arrondies au plus à quatre décimales et signalées par ≈.

Les saisies invalides ne remplacent pas la dernière valeur valide ; une explication liée au champ apparaît, puis la valeur valide est restaurée à la sortie du champ. Les deux panneaux se réinitialisent indépendamment.

## Visuels et accessibilité

- Triangle statique auprès de la définition d’une pente : P=(1,1/2), Q=(3,9/2), h=2, variation verticale 4 et pente 2. Les échelles inégales sont signalées.
- Triangle dynamique et distinction des traits : courbe continue bleue, tangente rouge en tirets, sécante continue sombre, guides en pointillés ; la légende et les valeurs écrites complètent la couleur.
- Graphes synchronisés de f et f′, gradués, avec titres et descriptions accessibles ; P et R portent les mêmes abscisses.
- Contre-exemple statique en V près de la discussion des deux côtés : pente −1 à gauche et +1 à droite, aucune pente limite commune.
- Commandes HTML natives, noms accessibles, focus visible, cibles de 44 px au moins. Pas de capture tactile du défilement ni d’animation automatique. Les annonces sont regroupées après 250 ms sans nouvelle modification.
- Le contenu, les formules KaTeX/MathML, les graphes et leurs valeurs initiales sont rendus côté serveur. Les commandes ne sont exposées qu’après hydratation. Les corrections utilisent une ouverture native utilisable sans JavaScript.

Les SVG sont des dessins mathématiques originaux ; aucun visuel tiers ou généré approximativement n’est utilisé.

## Choix Astro, MDX et React

Inspection : `package.json`, `astro.config.ts`, `src/content.config.ts`, la route de leçon, `FunctionPanel.tsx`, `SecantExplorer.astro`, les contrôles de contenu et les tests existants.

React **et MDX étaient déjà installés et configurés**. La collection charge les fichiers `.md` et `.mdx`, et la route appelle `render(lesson)` puis `<Content />`. L37 fournit déjà le modèle d’une leçon MDX avec îlots React. Le changement reprend ce modèle pour la seule paire L38, avec deux instances du même composant et `client:visible`. Les URL et la génération du sommaire restent dans le circuit Astro existant.

Le composant Astro/TypeScript du chapitre suffit à sa démonstration simple, mais ses coordonnées fixes ne couvrent pas la nouvelle famille de courbes. Ici, React synchronise les coefficients, deux graphes, plusieurs équations et les deux modes d’interaction à partir d’un même état. Ce bénéfice concret justifie son emploi ; aucune nouvelle dépendance, bibliothèque de tracé ou infrastructure n’est ajoutée. Le cours écrit reste en MDX, pas dans React. Les autres leçons ne chargent pas ces explorateurs.

Référence technique : [composants et hydratation Astro](https://docs.astro.build/en/guides/framework-components/).

## Auto-vérification mathématique et bilingue

- Exemple initial : quotient 1+h/2 pour h non nul ; sept valeurs exactes du tableau, deux côtés, dérivée 1, tangente y=x−1/2.
- Famille quadratique : développement du quotient en 2ax₀+b+ah. Limite 2ax₀+b. L’ordonnée à l’origine de la tangente est c−ax₀², ce qui fournit une seconde vérification de la forme point–pente.
- Contrôle demandé : pour x² en 1, image 1, pente 2, tangente y=2x−1.
- Cas concave, convexe, sommet de pente nulle, fonction affine et fonction constante vérifiés. Une différence centrée indépendante contrôle les dérivées numériques ; les sécantes sont aussi comparées au quotient direct hors de zéro.
- Le calcul stable des sécantes évite la soustraction de flottants presque égaux, mais retourne explicitement une absence de valeur pour h=0 : le prolongement algébrique n’est pas confondu avec le quotient initial.
- Déplacement de c : dérivée inchangée et déplacement identique de l’ordonnée à l’origine de la tangente. Valeur absolue : quotients −1 et +1, donc absence de dérivée en zéro.
- Versions de lecture française et anglaise : 2. Mêmes objectifs, prérequis, sections, formules, activités et réponses. Les notations françaises du cours sont conservées. Les empreintes de lecture et la référence française de traduction sont renouvelées après cette auto-vérification.
- La banque publiée `exercises/L38/v1.json` reste inchangée. Son auto-vérification existante demeure dans [CHAPTER_03_REVIEW.md](CHAPTER_03_REVIEW.md). Ce document renouvelle les éléments relatifs à la lecture et à sa traduction, sans attribuer une nouvelle validation humaine à la banque.

## Validation locale

- Environnement : Node **24.19.0** et pnpm **11.25.0**, versions du dépôt ; installation à partir du fichier de verrouillage, sans modification des dépendances.
- `pnpm check` : **réussi** après les derniers ajustements. Documentation, politique de publication, cohérence du contenu et des traductions, types, formatage, **313 tests réussis**, puis build Vercel de production. Le contrôle des types signale zéro erreur et zéro avertissement, avec huit indications préexistantes hors de L38.
- Suite ciblée L38, chapitre 3 et navigation de langue L37 : **17/17 tests navigateur réussis** après les derniers ajustements visuels. Les 12 tests propres à L38 couvrent les deux langues, les deux côtés de zéro, l’absence de sécante à h=0, la tangente y=2x−1, les changements de coefficients, les cas affine/constant, les commandes synchronisées, les erreurs de saisie, le focus et le clavier, les liens de langue, le tactile, le mode sombre, les vues 320/375/768/1440 px, l’absence de débordement des panneaux et des graduations (y compris pour la fonction nulle), et l’affichage sans JavaScript. Quatre tests supplémentaires couvrent la navigation du chapitre et son explorateur existant ; le dernier contrôle le changement de langue de L37.
- Branche actualisée sur `416c57c` (version 0.15.0), qui inclut la révision de L05 reçue pendant ce travail. Suite navigateur complète sur cette base : **290 réussis, 5 échecs sur 295**. Trois échecs concernent le débordement de l’en-tête français à **1051 px** dans `chapter-navigation`, `reading` et `theme`. Ces trois tests ont été réexécutés dans un checkout inchangé du commit initial `0b6badb`, avec le même navigateur : **les trois échecs s’y reproduisent**. Les deux autres sont des délais dépassés, sur la navigation de langue de L37 et une manipulation du panneau L38 anglais ; **ces deux cas réussissent dans la relance ciblée finale de 17 tests**. La suite complète n’est donc pas présentée comme entièrement réussie. Aucun correctif d’en-tête n’est inclus dans cette révision de leçon.
- Le téléchargement standard de Chromium par Playwright a fourni une archive tronquée. Les tests ont utilisé temporairement Chromium **153.0.8010.0**, via l’option existante `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, sans ajouter de dépendance au projet.
- Inspection visuelle des graphes et commandes en français sur ordinateur et mobile : axes, points, valeurs et encadrés sont lisibles. Les graphes de f et f′ sont juxtaposés à partir de 1200 px et empilés sur les écrans plus étroits. L’étiquette h du triangle est décalée pour ne pas recouvrir la graduation de l’axe.
- Le build contient deux îlots sur L38 ; les mathématiques et graphes initiaux sont disponibles avant leur hydratation. Le test d’isolation de L37 pointe désormais sur L39, puisque L38 comporte à son tour des îlots.

Les tests automatisés et cette auto-vérification ne constituent pas une relecture mathématique indépendante, un essai manuel avec lecteur d’écran ou une validation sur appareil physique. Aucun déploiement en production ni changement de la banque d’exercices n’est réalisé dans cette révision.
