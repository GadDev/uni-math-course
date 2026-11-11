# Final mock exam — blueprint and author review

Date: 2026-11-11. Status: mathematical author self-check; no independent review, university endorsement or hosted acceptance. All final-exam learner content is French, as requested; `/en/training-exams/final/` redirects to French. Existing bilingual chapter exams remain unchanged.

## Sources inspected

PR #138 was merged on 2026-11-11 as `06ba44929e3e189136d244bbf2ee93504ee9af14`. This change branches from that merge and reuses its catalogue, invited-user authentication, no-store policy, React/KaTeX rendering, exact rational parser, session lifecycle and print styles. It does not edit any existing immutable chapter bank or lesson release.

The supplied professor JSON was read locally and matched the SHA-256 in `TRAINING_EXAMS_REVIEW.md`: `9d720b23ad066c62e4feac364186efb8685f8ba0fa6cb018becadc8284c73ce8`. It contains 145 questions: 76 single, 36 multiple and 33 fill-ins. Three active quizzes explicitly select ten questions each, with question shuffling off. Raw option keys do not imply visible answer-position patterns because options may shuffle. The functions pool has 28 items (12/3/13); the straight-line pool has 30 (4/6/20). Original material is not redistributed.

Short stems, explicit domains, small exact calculations, production of numerical answers and distractors encoding a single misconception guide these new items. Examples of assessed distinctions include necessary/sufficient conditions, strict/non-strict domain bounds, signed slopes, reversed screen y coordinates, derivative versus function value, logarithm of product versus sum, prefix versus symbol injectivity, and average versus individual message length. This is an inferred style match, not a claim that the professor set these questions. Written problems and information-theory coverage are course-based additions; the supplied quizzes do not establish their final-exam format or weights.

The user supplied only one official assessment fact: a written final worth 100% of the course grade. Duration, weights, difficulty labels, partial-credit rules and the blueprint below are training choices. No calculator, permitted-notes or university negative-marking rule is inferred.

## Syllabus mapping

| Objective | Inspected lessons | Required paper slot |
| --- | --- | --- |
| Boolean expressions and truth tables | L02–L04, L07–L08 | logique-1 |
| Natural language and symbolic translation | L05–L06, L20 | logique-2 |
| Quantifiers, scope and negation | L11–L12, L16–L17, L19 | logique-3 |
| Real algebra and representations | L10, L21–L27; binary counting L43 | nombres-1–3 |
| Line equations and graphical representations | L28–L32 | droites-1–2 |
| Least-squares regression and interpretation | L34–L36 | droites-3 |
| Functions and their properties | L37 | fonctions-1 |
| Elementary derivatives and tangent interpretation | L38–L39, exponential L40, logarithm L41 | fonctions-2–3 |
| Exponentials and logarithms | L40–L42 | croissance-1–2 |
| Growth and computational complexity | L42 | croissance-3 |
| Shannon entropy, theoretical mean bound | L46–L48 | information-1 |
| Codes, prefix property and average length | L43–L47, L49 | information-2 |
| Huffman construction and mean length | L49 | information-3 |

L35 explicitly supplies least squares and residual checks; L42 supplies logarithm bases, integer versus real halving and growth comparisons. L48 states entropy and its hypotheses; L49 establishes greedy reinsertion, ties, prefix optimality and the binary symbol-by-symbol bound. Zero-probability entropy questions state the zero-term convention; Huffman questions use strictly positive weights and at least two symbols.

## Fixed two-hour blueprint

Each area has ten authored alternatives for each of three slots (30 per area; 180 total). Each attempt draws one item from each slot. There are no runtime numerical variants counted as extra questions. Stable item IDs, separate family IDs, objectives, prerequisite/revision lessons, difficulty, marks, minutes, corrections, misconceptions and author verification notes are stored in the immutable `exercises/final-exam/v1.json`.

| Area | Base / application / written problem | Questions per paper | Bank size | Marks | Work estimate |
| --- | --- | ---: | ---: | ---: | ---: |
| Logic and quantifiers | Boolean evaluation / translation / quantifiers | 3 | 30 | 10 | 18 min |
| Numbers and algebra | Calculation / valid transformations / worked problem | 3 | 30 | 10 | 18 min |
| Lines and regression | Coefficients / graphical representation / regression | 3 | 30 | 10 | 18 min |
| Functions and derivatives | Properties / derivative calculation / tangent reasoning | 3 | 30 | 10 | 18 min |
| Exponentials, logs, complexity | Exponentials / logarithms / growth reasoning | 3 | 30 | 10 | 18 min |
| Information and coding | Entropy / codes / Huffman construction | 3 | 30 | 10 | 18 min |
| **Total** | | **18** | **180** | **60** | **108 min + 12 min review** |

Base/application/problem slots carry 2/3/5 marks and estimated 4/6/8 minutes respectively, with author-assessed easy/medium/hard difficulty. These timings are conservative design estimates, not measurements from students. The final bank contains 60 numeric, 50 selected-response and 70 written questions. A paper contains 6 numeric, 5 selected-response and 7 written questions: **27 automatic marks and 33 self-assessed marks**. Repeated tasks differ in the requested reasoning and representation, not just constants. Related skills necessarily recur because every paper assesses the same syllabus.

## Selection and attempt contract

Selection proceeds slot by slot. It excludes a family already used in the paper, orders candidates by least recent family exposure, then least recent item exposure, and uses a seed to break equal ranks. There is no relaxation of topic, difficulty, marks or time. Once fresh families run out, the oldest family becomes eligible again. If a slot is missing or distinct-family coverage becomes impossible, generation fails rather than silently weakening the blueprint.

With the current ten-family pool in each slot, retained complete history permits ten successive papers without repeating any item, using all 180 questions; attempt eleven can repeat. This is tested, not a promise under cleared history or future bank changes. A separate test supplies a numerical sibling family to verify that unseen siblings do not outrank genuinely fresh families. The current authored bank has one item per family; the family mechanism supports later variants.

The server generates a seed and start timestamp and returns an explicit answer-free projection. IDs, seed, current bank version, fixed authored parameters (in the question snapshot), shuffled option order, deadline and responses are stored in the existing session-cleared tab namespace, with the verified learner ID. No parameter generator is used. Reload does not select again. History is a bounded per-item last-seen map; it survives new attempts and reloads in the same tab but is not synced across devices or tabs and is lost when tab storage is cleared or the session changes. New tabs may inherit an initial sessionStorage copy according to browser behavior, then diverge.

The countdown uses an absolute 120-minute deadline. It continues away from the page. At expiry, inputs freeze; the learner explicitly confirms submission to reveal corrections. The timer is a browser training aid and is not tamper-resistant official exam enforcement. The API validates exact blueprint membership and version but does not certify exam conditions or elapsed time. A failed grading request preserves responses. A successful submission persists a locked answer snapshot; after reload the same snapshot is re-marked on request. Self-marking selections reset on reload and are explicitly disclosed as temporary.

## Grading and access

Selected-response questions require the exact correct set, with no negative marks. Numeric fields share the question marks equally, with partial credit between fields. The existing exact rational parser accepts signed integers, comma/dot finite decimals and fractions of signed integers; bounded input is never evaluated as code. Nonterminating exact fractions must be entered as fractions. The sole approximate entropy item discloses a numeric tolerance of 0.001. No tolerance applies to other fields.

Written responses are returned with earned=null, a model solution and point-by-point rubric. Learners may work on paper, including graphs and Huffman trees. Any correct alternative tree/code is accepted by the rubric, including left/right swaps and valid tie choices. No string equality against one model bit pattern is used. An estimated /20 total appears only when every manual criterion has been assessed. The automatic subtotal and manual subtotal remain separate, by topic and overall. This does not claim automatic symbolic proof checking, graph grading or teacher assessment.

Question keys, rubric solutions and explanations remain server-only until submission. The final API and private page use existing verified-user auth, same-origin POST, bounded JSON, owner consistency, version and response-shape checks, and private no-store middleware. Client owner hints do not authorize grading. Session change clears in-memory answers, stored drafts and history. No database migration, dependency or paid infrastructure is introduced; results do not affect saved attempts or mastery. Authenticated exams remain online-only, outside the offline reading allowlist.

## Verification scope

All items received mathematical author self-check, reflected in the rows below. Automated checks independently enumerate Boolean tables, numerically differentiate functions, calculate entropy, verify prefix codes and optimal Huffman merge costs, and exercise exact grading, projections, selection exhaustion, reproducibility and private routes. Formula rendering is checked with strict KaTeX for every authored mathematical string. Browser/API tests cover keyboard start, mobile layout, hidden solutions, exact server marking, self-assessment, refresh/order recovery, expiry, request retry, printing, storage failure and account changes.

These checks do not constitute independent mathematical or translation review. The feature is French-only; a full English final bank is outside this request. Hosted acceptance is separate from local and CI verification. Final command results are recorded in the pull request.

## Per-item author verification

Each row is one independently assessable bank item, not an answer field. Corrections and individual option feedback are stored with it.

| ID | Family / objective | Revision | Author cross-check |
| --- | --- | --- | --- |
| FINAL-logique-1-01 | table-implication | L03 | Les quatre affectations ont été énumérées; chaque sous-formule est calculée avant le connecteur extérieur. |
| FINAL-logique-1-02 | table-exclusive | L03 | Les quatre affectations ont été énumérées; chaque sous-formule est calculée avant le connecteur extérieur. |
| FINAL-logique-1-03 | table-negation-conjonction | L03 | Les quatre affectations ont été énumérées; chaque sous-formule est calculée avant le connecteur extérieur. |
| FINAL-logique-1-04 | table-biconditionnelle | L03 | Les quatre affectations ont été énumérées; chaque sous-formule est calculée avant le connecteur extérieur. |
| FINAL-logique-1-05 | denombrement-valuations | L03 | Énumération explicite des trois témoins satisfaisants parmi huit valuations. |
| FINAL-logique-1-06 | compter-contre-exemples | L05 | Les témoins sont (1,0,0),(0,1,0),(1,1,0). |
| FINAL-logique-1-07 | evaluer-priorites | L02 | Substitution des trois valeurs, sans utiliser une prétendue associativité entre ET et OU. |
| FINAL-logique-1-08 | coherence-contraintes | L04 | Les deux autres couples échouent au premier système; aucune valeur de P ne satisfait sa contradiction. |
| FINAL-logique-1-09 | cardinal-operations | L15 | Inclusion-exclusion donne 3+2−1=4 et \|A\B\|=3−1=2. |
| FINAL-logique-1-10 | decomposition-shannon-booleenne | L03 | Énumération des témoins (1,1,0),(1,1,1),(0,0,1),(0,1,1); la conjonction des deux termes contient P∧¬P. |
| FINAL-logique-2-01 | necessaire-acces | L20 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-02 | suffisante-sauvegarde | L06 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-03 | contraposee-capteur | L06 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-04 | negation-promesse | L05 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-05 | traduction-ou-inclusif | L02 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-06 | traduction-ni-ni | L02 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-07 | traduction-exactement-un | L03 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-08 | retour-langage-naturel | L07 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-09 | construire-avec-ou-non | L08 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-2-10 | regle-contre-modele | L20 | Vérification par les quatre couples de valeurs ou par le cas concret qui viole exactement la règle. |
| FINAL-logique-3-01 | nier-universel | L12 | x=1 est un second témoin indépendant. |
| FINAL-logique-3-02 | nier-existentiel | L12 | Partition exhaustive des naturels en 0,1 et n≥2. |
| FINAL-logique-3-03 | ordre-quantificateurs | L17 | La substitution x=y réfute tout candidat, pas seulement un exemple. |
| FINAL-logique-3-04 | negation-imbriquee | L12 | Si U est vide la formule initiale est vraie et sa négation fausse; cela contrôle le quantificateur extérieur. |
| FINAL-logique-3-05 | quantificateur-borne | L11 | Si A est vide aucun témoin de la négation ne peut être trouvé. |
| FINAL-logique-3-06 | quantifier-unique | L11 | Le prédicat x≥2 aurait deux témoins et viole la partie universelle. |
| FINAL-logique-3-07 | contre-exemple-divisibilite | L11 | Le témoin impair 3 convient aussi; zéro ne réfute pas l’implication. |
| FINAL-logique-3-08 | domaine-change-verite | L11 | La contradiction de parité utilise une fraction irréductible, pas un développement décimal. |
| FINAL-logique-3-09 | relation-matrice | L17 | La matrice 2×2 a deux 1 sur la diagonale et aucune colonne complète. |
| FINAL-logique-3-10 | all-any-vide | L19 | La négation du premier est l’existence d’un x≤0, impossible dans le vide. |
| FINAL-nombres-1-01 | priorite-signe | L21 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-02 | fractions-somme | L23 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-03 | fractions-division | L23 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-04 | puissances-negatives | L23 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-05 | racine-valeur-absolue | L23 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-06 | evaluer-factorise | L22 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-07 | somme-indice | L26 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-08 | moyenne-ponderee | L26 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-09 | distance-plan | L27 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-1-10 | representation-binaire | L43 | Calcul direct recoupé par substitution, opérations inverses ou énumération des termes explicités dans la correction. |
| FINAL-nombres-2-01 | factorisation-difference | L22 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-02 | developper-identite | L22 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-03 | domaine-simplification | L23 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-04 | ensembles-nombres | L10 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-05 | intervalle-inequation | L24 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-06 | inequation-carre | L24 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-07 | racines-proprietes | L23 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-08 | systeme-coincident | L25 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-09 | rationalite-representation | L10 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-2-10 | produit-signe | L24 | Développement ou contre-exemple explicite dans le retour de chaque option. |
| FINAL-nombres-3-01 | equation-fraction-domaine | L24 | La substitution de 5 satisfait l’équation initiale; 2 demeure interdit. |
| FINAL-nombres-3-02 | equation-produit-nul | L24 | Les deux substitutions donnent respectivement 0=0 et 16=16. |
| FINAL-nombres-3-03 | equation-racine | L24 | x=−2 échoue directement car 1≠−1. |
| FINAL-nombres-3-04 | systeme-elimination | L25 | Substitution indépendante dans chacune des deux équations. |
| FINAL-nombres-3-05 | modele-tarifs | L25 | À n=8 les deux valent 28; à 9, A vaut 30 et B 31. |
| FINAL-nombres-3-06 | inequation-rationnelle | L24 | Les tests −3,0,2 donnent des signes positif,négatif,positif. |
| FINAL-nombres-3-07 | moyenne-valeur-manquante | L26 | 3+5+8+8=24 et 24−4×6=0. |
| FINAL-nombres-3-08 | factoriser-trinome | L22 | Le développement redonne le trinôme; x=0 donne −6. |
| FINAL-nombres-3-09 | distance-milieu | L27 | Les deux distances égales valent la moitié de AB. |
| FINAL-nombres-3-10 | representation-bits-capacite | L43 | Quatre bits sont insuffisants; cinq offrent exactement 32 possibilités. |
| FINAL-droites-1-01 | pente-deux-points | L30 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-02 | point-pente | L29 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-03 | cartesienne-vers-affine | L29 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-04 | intercepts-axes | L29 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-05 | accroissement-signe | L29 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-06 | intersection-affines | L30 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-07 | horizontale | L29 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-08 | pixel-aller | L32 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-09 | pixel-retour | L32 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-1-10 | parallele-point | L30 | Vérification par substitution des coordonnées, des accroissements ou par application de la transformation inverse. |
| FINAL-droites-2-01 | tracer-affine | L29 | Les deux points satisfont y=−2x+4. |
| FINAL-droites-2-02 | lire-graphique | L30 | Les deux points du graphique satisfont y=x+1. |
| FINAL-droites-2-03 | verticale-graphique | L28 | Dans le quotient des accroissements, Δx=0 et Δy≠0. |
| FINAL-droites-2-04 | equation-normee | L28 | Les deux intersections satisfont 2x−4y=8. |
| FINAL-droites-2-05 | demi-plan-test | L31 | Le point (0,3) échoue tandis que (0,0) convient. |
| FINAL-droites-2-06 | coincidence-parallelisme | L30 | Multiplier d1 par 2 donne d2; d1 réécrite donne y=2x−3. |
| FINAL-droites-2-07 | transformer-droite-pixels | L32 | Les deux pixels satisfont v=290−2u. |
| FINAL-droites-2-08 | modele-depuis-table | L29 | Le point central est le milieu des deux autres. |
| FINAL-droites-2-09 | lecture-deux-courbes | L30 | Le résidu est nul dans chacune des deux équations. |
| FINAL-droites-2-10 | pente-unites | L29 | V(8)=66 et V(30)=0. |
| FINAL-droites-3-01 | regression-brute | L35 | Calcul indépendant par les moments bruts : n=3, Σx=3, Σy=5, Σx²=5, Σxy=6. La somme des résidus est nulle. |
| FINAL-droites-3-02 | regression-prediction | L35 | Calcul indépendant par les moments bruts : n=3, Σx=6, Σy=11, Σx²=14, Σxy=25. La somme des résidus est nulle. |
| FINAL-droites-3-03 | regression-residus | L35 | Calcul indépendant par les moments bruts : n=3, Σx=3, Σy=6, Σx²=5, Σxy=7. La somme des résidus est nulle. |
| FINAL-droites-3-04 | regression-centree | L35 | Calcul indépendant par les moments bruts : n=3, Σx=0, Σy=6, Σx²=2, Σxy=-4. La somme des résidus est nulle. |
| FINAL-droites-3-05 | regression-horizontale | L35 | Calcul indépendant par les moments bruts : n=3, Σx=0, Σy=6, Σx²=2, Σxy=0. La somme des résidus est nulle. |
| FINAL-droites-3-06 | regression-translation | L35 | Calcul indépendant par les moments bruts : n=3, Σx=3, Σy=10, Σx²=5, Σxy=13. La somme des résidus est nulle. |
| FINAL-droites-3-07 | regression-echelle | L35 | Calcul indépendant par les moments bruts : n=3, Σx=3, Σy=5, Σx²=5, Σxy=8. La somme des résidus est nulle. |
| FINAL-droites-3-08 | regression-sens | L35 | Calcul indépendant par les moments bruts : n=3, Σx=6, Σy=6, Σx²=14, Σxy=13. La somme des résidus est nulle. |
| FINAL-droites-3-09 | regression-erreur-carree | L35 | Calcul indépendant par les moments bruts : n=3, Σx=3, Σy=7, Σx²=5, Σxy=9. La somme des résidus est nulle. |
| FINAL-droites-3-10 | regression-passer-moyennes | L35 | Calcul indépendant par les moments bruts : n=4, Σx=10, Σy=24, Σx²=30, Σxy=69. La somme des résidus est nulle. |
| FINAL-fonctions-1-01 | domaine-rationnel | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-02 | domaine-racine | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-03 | image-antecedents | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-04 | injectivite-carre | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-05 | parite | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-06 | graphique-fonction | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-07 | reciproque-affine | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-08 | composition | L37 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-09 | derivee-definition | L38 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-1-10 | derivee-valeur-absolue | L38 | Chaque option est contrôlée par la définition ou un contre-exemple donné dans son retour. |
| FINAL-fonctions-2-01 | derivee-polynome | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-02 | derivee-quotient | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-03 | derivee-produit | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-04 | derivee-racine | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-05 | derivee-inverse | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-06 | derivee-logarithme | L41 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-07 | derivee-exponentielle-composee | L41 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-08 | derivee-composition-polynome | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-09 | derivee-affine-combinaison | L39 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-2-10 | derivee-log-compose | L41 | Contrôle par dérivation algébrique et quotient symétrique numérique aux points du domaine. |
| FINAL-fonctions-3-01 | tangente-polynome | L39 | La différence f(x)−(10x−15)=(x−2)²(x+4) possède un facteur carré. |
| FINAL-fonctions-3-02 | difference-quotient | L38 | La règle de puissance donne f′(1)=2+3=5. |
| FINAL-fonctions-3-03 | vitesse-secante | L38 | Le quotient avec un pas h depuis t=1 vaut 4+h; pour h=2 il vaut 6. |
| FINAL-fonctions-3-04 | tangente-horizontale | L39 | La forme carrée prouve le minimum indépendamment du seul test f′=0. |
| FINAL-fonctions-3-05 | tangente-parallele | L39 | f(x)−(−4x−4)=(x+2)². |
| FINAL-fonctions-3-06 | tangente-log | L41 | La pente du quotient ln(1+h)/h tend vers 1. |
| FINAL-fonctions-3-07 | tangente-exponentielle | L41 | Le développement différentiel donne e^h−2h=1−h+o(h). |
| FINAL-fonctions-3-08 | tangente-reciproque | L39 | À x=2 la droite donne 1/2 et sa pente est −1/4. |
| FINAL-fonctions-3-09 | point-anguleux | L38 | Les deux suites h=1/n et h=−1/n produisent deux limites distinctes. |
| FINAL-fonctions-3-10 | tangente-donnees-locales | L39 | Les fonctions 13−2x et 13−2x+(x−3)² ont les mêmes valeur/dérivée en 3 mais diffèrent en 10. |
| FINAL-croissance-1-01 | expo-produit | L40 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-02 | expo-quotient | L40 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-03 | expo-puissance | L40 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-04 | expo-equation-meme-base | L42 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-05 | expo-equation-inverse | L40 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-06 | expo-decroit | L42 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-07 | expo-initiale-taux | L42 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-08 | expo-bases-compatibles | L42 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-09 | expo-negatif-constant | L40 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-1-10 | expo-transforme-log | L41 | Vérification par substitution dans les expressions de départ ou injection de l’exponentielle. |
| FINAL-croissance-2-01 | log-produit | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-02 | log-domaine-produit | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-03 | log-equation-domaines | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-04 | log-changement-base | L42 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-05 | log-base-admissible | L42 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-06 | log-puissance-domaine | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-07 | log-inequation-base | L42 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-08 | log-zero-signe | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-09 | log-quotient-equation | L41 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-2-10 | log-exposant-inconnu | L42 | Les identités sont vérifiées par les lois inverses; chaque fausse option possède un défaut de domaine ou un contre-exemple. |
| FINAL-croissance-3-01 | classes-ordre | L42 | Les rapports successifs tendent vers zéro; le contre-exemple n=3 distingue l’ordre éventuel de l’ordre partout. |
| FINAL-croissance-3-02 | cout-terme-dominant | L42 | B−A=n²−7n−998; son signe diffère pour les deux tailles. |
| FINAL-croissance-3-03 | doublement-couts | L42 | E(8)/E(4)=256/16=16. |
| FINAL-croissance-3-04 | divisions-entieres | L42 | 2⁶≤70<2⁷ confirme le compte 6. |
| FINAL-croissance-3-05 | boucles-produit | L42 | Pour n=10 les comptes sont 100 et 20, puis le rapport vaut n/2. |
| FINAL-croissance-3-06 | boucle-triangulaire | L42 | Doubler la somme en sens inverse donne n paires de somme n+1. |
| FINAL-croissance-3-07 | bases-log-croissance | L42 | À n=100, log₁₀n=2 et le rapport reste ln10/ln2. |
| FINAL-croissance-3-08 | expo-polynome-petit-grand | L42 | n³/2ⁿ tend vers zéro; les deux calculs illustrent un croisement sans le démontrer à eux seuls. |
| FINAL-croissance-3-09 | log-linear-travail | L42 | 1024=2¹⁰ et le rapport des deux coûts vaut n. |
| FINAL-croissance-3-10 | budget-operations | L42 | 33²=1089 et 2¹¹=2048 dépassent immédiatement le budget. |
| FINAL-information-1-01 | entropie-uniforme | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-02 | entropie-dyadique | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-03 | entropie-proba-manquante | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-04 | entropie-effectifs | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-05 | entropie-symbole-impossible | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-06 | entropie-source-certaine | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-07 | entropie-non-dyadique | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-08 | entropie-maximale | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-09 | entropie-permutation | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-1-10 | entropie-borne-code | L48 | Somme directe −Σp log₂p, avec normalisation explicite; les distributions dyadiques utilisent des logarithmes entiers. |
| FINAL-information-2-01 | code-prefixe-test | L45 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-02 | code-ambigu-exemple | L45 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-03 | code-non-prefixe-decodable | L45 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-04 | code-concatener | L44 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-05 | code-decoder | L45 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-06 | code-moyenne-vs-fixe | L47 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-07 | code-optimalite-affectation | L47 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-08 | code-limite-shannon | L49 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-09 | code-fusion-reinsertion | L49 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-2-10 | code-moyenne-vs-taille | L47 | Vérification par parcours des mots, collision explicite, espérance ou propriété de Huffman sous les hypothèses annoncées. |
| FINAL-information-3-01 | huffman-trois-symboles | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=14, somme des poids de fusion=14. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-02 | huffman-egalites | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=8, somme des poids de fusion=8. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-03 | huffman-cinq-symboles | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=19, somme des poids de fusion=19. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-04 | huffman-dyadique-egalite | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=30, somme des poids de fusion=30. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-05 | huffman-long-message | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=11, somme des poids de fusion=11. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-06 | huffman-poids-proportions | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=20, somme des poids de fusion=20. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-07 | huffman-comparer-affectations | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=13, somme des poids de fusion=13. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-08 | huffman-source-binaire | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=10, somme des poids de fusion=10. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-09 | huffman-grand-poids | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=35, somme des poids de fusion=35. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
| FINAL-information-3-10 | huffman-contre-fusion | L49 | Contrôle indépendant : coût pondéré Σpoids×longueur=33, somme des poids de fusion=33. L’arbre donne un code préfixe; la récursion de Huffman donne le coût optimal. |
