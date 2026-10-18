---
lessonId: L36
locale: fr
version: 2
status: extended
title: "Corrélation et limites des modèles"
summary: "Interpréter une corrélation, éviter les conclusions causales et situer l’apprentissage automatique."
minutes: 45
objectives: [L36-O01, L36-O02, L36-O03, L36-O04, L36-O05, L36-O06]
prerequisites: [L34, L35]
sourcePages: [62, 80, 81, 82, 83, 84, 85, 86, 87]
---
# Corrélation et limites des modèles

## Objectifs et prérequis

- Calculer une corrélation définie.
- Interpréter signe et intensité.
- Distinguer association et causalité.
- Repérer extrapolation et valeurs atypiques.
- Distinguer entraînement et inférence.
- Évaluer les limites des résumés numériques.

Prérequis : L34, L35. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-62" class="source-topic-marker"></span>

## Une découverte troublante : les données du PDF

**PDF, page 62 — données historiques reprises, explication originale.** Chaque ligne décrit une année. $x_i$ est la consommation annuelle américaine de margarine, en livres par personne ; $y_i$ est le nombre de divorces pour mille habitants dans le Maine. Les unités et populations sont différentes : une ressemblance de tendance ne prouve pas une cause.

| Année | $x_i$ | $y_i$ |
| --- | --- | --- |
| 2000 | 8,2 | 5,0 |
| 2001 | 7,0 | 4,7 |
| 2002 | 6,5 | 4,6 |
| 2003 | 5,3 | 4,4 |
| 2004 | 5,2 | 4,3 |
| 2005 | 4,0 | 4,1 |
| 2006 | 4,6 | 4,2 |
| 2007 | 4,5 | 4,2 |
| 2008 | 4,2 | 4,2 |
| 2009 | 3,7 | 4,1 |

Le PDF attribue ces données à l’illustration de Tyler Vigen fondée sur des données USDA et CDC. Nous les utilisons comme exemple du cours, sans prétendre établir une relation causale ni actualiser ces statistiques. Le nuage semble proche d’une droite : cela motive le modèle, mais ne le justifie pas encore.

Suivre maintenant [Le modèle](../L34/#pdf-63), puis les résidus, les moindres carrés et leur calcul. Revenir ensuite au [vocabulaire du machine learning](#pdf-80).

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/margarine.svg" alt="Nuage des dix couples historiques de margarine et divorces, avec les unités indiquées sur les axes." width="440" height="360" loading="lazy" />
<figcaption>Deux séries qui évoluent ensemble ne démontrent pas une causalité.</figcaption>
</figure>

<p class="source-next"><a href="/fr/lessons/L34/#pdf-63">Suite du PDF : Le modèle →</a></p>

<span id="pdf-80" class="source-topic-marker"></span>

## Du calcul à l’apprentissage automatique

Dans ce modèle supervisé, $x$ est une entrée ou caractéristique, $y$ une cible et $(m,p)$ les paramètres appris. L’entraînement choisit les paramètres en minimisant une perte sur les données d’entraînement. L’inférence utilise ces paramètres fixés pour produire une prédiction. Une faible erreur d’entraînement ne garantit pas une faible erreur sur de nouvelles données : réserver des données de validation aide à évaluer la généralisation.


<p class="source-next"><a href="/fr/lessons/L36/#pdf-81">Suite du PDF : Le coefficient de corrélation →</a></p>

<span id="pdf-81" class="source-topic-marker"></span>

## Définir avant d’interpréter

Pour $S_{xx}>0$ et $S_{yy}>0$, la corrélation de Pearson est $r=S_{xy}/\sqrt{S_{xx}S_{yy}}$. Elle est sans unité et vérifie $-1\le r\le1$. Son signe est celui de la pente de régression. Si une des deux variables est constante, la formule est indéfinie : on ne lui attribue pas automatiquement zéro.

## Exemple guidé : signe et ajustement

Pour les points $(0,3),(1,2),(2,1)$, les moyennes valent $(1,2)$ et $S_{xx}=S_{yy}=2$, $S_{xy}=-2$. Donc $r=-1$ et la droite $y=-x+3$ ajuste exactement les observations. Sous les conditions de définition, $|r|=1$ équivaut à un ajustement affine parfait. Une corrélation proche de zéro exclut une forte association linéaire, pas toute relation.

## Exemple guidé : relation non linéaire

Les points $(-1,1),(0,0),(1,1)$ suivent exactement $y=x^2$. Pourtant $S_{xy}=0$ et $r=0$, car les produits centrés opposés s’annulent. Tracer les données révèle la courbure qu’un nombre ne montre pas. De même, des jeux de données différents peuvent partager des moyennes, variances et une même droite de régression tout en ayant des formes très différentes.

<p class="source-next"><a href="/fr/lessons/L36/#pdf-82">Suite du PDF : Limite 1 : corrélation et causalité →</a></p>

<span id="pdf-82" class="source-topic-marker"></span>

## Limite 1 : corrélation n’est pas causalité

**PDF, page 82.** La margarine et les divorces diminuent tous deux au cours de la période ; leur corrélation est proche de $0{,}99$. Cela ne démontre pas que changer la consommation d’un aliment change les divorces. L’année est une variable commune à examiner, et une association statistique ne fournit pas le mécanisme d’une cause.

Le PDF évoque aussi une association entre chocolat et prix Nobel à l’échelle de pays. Ce type de comparaison pose la même question : quels autres facteurs pourraient expliquer les deux mesures ? Il ne constitue pas une expérience où l’on change une seule variable.

**Exemple supplémentaire conservé.** Les ventes de glaces et la fréquentation d’une piscine peuvent augmenter avec la chaleur. Une **variable cachée** est un facteur non inclus dans le modèle qui pourrait contribuer aux deux tendances. Chercher un tel facteur vaut mieux que transformer un coefficient en conseil pratique.

<p class="source-next"><a href="/fr/lessons/L36/#pdf-83">Suite du PDF : Limite 2 : le quartet d’Anscombe →</a></p>

<span id="pdf-83" class="source-topic-marker"></span>

## Limite 2 : le quartet d’Anscombe

**PDF, page 83.** Quatre jeux de données peuvent avoir presque les mêmes moyennes, la même droite ajustée et la même corrélation, tout en racontant des histoires très différentes. Les dessins suivants retracent les données classiques du quartet, plutôt que copier les figures du PDF.

Pour chaque jeu, la droite est approximativement $\hat y=0{,}5x+3$ et la corrélation proche de $0{,}82$. Ces égalités sont approximatives avec les données décimales publiées. Le premier nuage ressemble à une relation affine bruitée ; le deuxième est courbé ; le troisième contient un point atypique ; le quatrième est presque vertical avec un point isolé qui pèse fortement sur l’ajustement.

**Question guidée supplémentaire.** Pourquoi la droite du deuxième dessin est-elle insuffisante malgré son coefficient de corrélation ? Parce qu’une courbe systématique reste visible : un résumé linéaire ne raconte pas toute la relation. Avant de calculer, regarder les points ; après avoir calculé, les regarder à nouveau.

Référence des données : [documentation officielle du jeu anscombe dans R](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/anscombe.html).

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/anscombe-1.svg" alt="Nuage approximativement affine." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 1 — Nuage approximativement affine.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/anscombe-2.svg" alt="Nuage avec une courbure nette." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 2 — Nuage avec une courbure nette.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/anscombe-3.svg" alt="Nuage avec un point atypique." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 3 — Nuage avec un point atypique.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/anscombe-4.svg" alt="Nuage presque vertical et un point isolé." width="440" height="360" loading="lazy" />
<figcaption>Anscombe 4 — Nuage presque vertical et un point isolé.</figcaption>
</figure>

<p class="source-next"><a href="/fr/lessons/L36/#pdf-84">Suite du PDF : Limite 3 : valeurs aberrantes →</a></p>

<span id="pdf-84" class="source-topic-marker"></span>

## Limite 3 : une valeur aberrante peut faire basculer la droite

**Principe du PDF, page 84 ; données supplémentaires originales ci-dessous.** Les carrés donnent beaucoup de poids à une grande erreur. Six points $(0,0),(1,1),(2,2),(3,3),(4,4),(5,5)$ sont parfaitement sur $y=x$. Ajouter $(6,-2)$ change l’ajustement en $\hat y=x/7+10/7$ : la pente passe de $1$ à environ $0{,}143$.

Le point ajouté est signalé par une croix et les deux modèles ont des styles de trait différents. Un point atypique peut être une erreur de saisie, un phénomène réel ou l’indice d’un modèle incomplet. Vérifier sa provenance avant de le supprimer ; ne pas l’effacer simplement pour rendre la droite plus jolie.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/outlier.svg" alt="Six points sur y égale x et un point ajouté en 6,moins 2 ; deux droites montrent l’ajustement avant et après." width="440" height="360" loading="lazy" />
<figcaption>Le même critère peut produire une droite très différente après un seul ajout.</figcaption>
</figure>

<p class="source-next"><a href="/fr/lessons/L36/#pdf-85">Suite du PDF : Limite 4 : extrapolation →</a></p>

<span id="pdf-85" class="source-topic-marker"></span>

## Limite 4 : extrapoler au-delà des observations

**Exemple du PDF, pages 85–86.** La consommation observée se situe entre $3{,}7$ et $8{,}2$ livres par personne et par an. Prédire à $x=2$ extrapole hors de cette plage. Même à l’intérieur, une prévision exige des hypothèses et une validation : sa fiabilité n’est pas garantie par la seule position de $x$.

Le PDF propose aussi le modèle de consommation selon le temps : $\text{margarine}\approx-0{,}445t+7{,}32$, avec $t=0$ en 2000. Résoudre $-0{,}445t+7{,}32=0$ donne $t\approx16{,}45$. Pour 2017, $t=17$ et le modèle donne environ $-0{,}245$ livre : une consommation négative n’a pas de sens ici. La droite continue mathématiquement ; la situation réelle impose des limites.

**Exemple supplémentaire.** Un tarif affine observé pour un à dix objets n’est pas automatiquement valable pour mille : une remise ou une capacité maximale peut changer la règle. Toujours noter l’intervalle où les données ont été observées.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/extrapolation.svg" alt="Modèle temporel de margarine prolongé après les années observées ; il passe sous zéro vers t égal 16,45." width="440" height="360" loading="lazy" />
<figcaption>La zone hachurée est hors de la période observée 2000–2009.</figcaption>
</figure>

## Association, causalité et domaine

Les ventes de glaces et la fréquentation d’une piscine peuvent augmenter ensemble parce qu’il fait chaud. Cette association ne prouve pas que l’une cause l’autre. Une prédiction au-delà des entrées observées est une extrapolation et demande une justification supplémentaire. Même à l’intérieur de l’intervalle, la fiabilité dépend des données, des hypothèses et d’une validation ; elle n’est jamais garantie par la seule position de l’entrée. Une valeur atypique peut modifier fortement la droite et mérite une enquête, pas une suppression automatique.


<p class="source-next"><a href="/fr/lessons/L36/#pdf-87">Suite du PDF : Et ensuite ? →</a></p>

<span id="pdf-87" class="source-topic-marker"></span>

## Ce que cette introduction prépare

Plusieurs caractéristiques conduiront à des modèles à plusieurs paramètres. Les perceptrons, réseaux non linéaires et méthodes de descente de gradient sont des pistes ultérieures annoncées par la source. Leur calcul n’est pas requis ici : le chapitre fournit les fondations algébriques, la notion de perte et la distinction entre ajuster un modèle et l’évaluer.

**Exemples du PDF, page 87.** Un prix d’appartement peut dépendre de la surface $x_1$ et de l’étage $x_2$ : $y\approx m_1x_1+m_2x_2+p$. Les paramètres se multiplient, mais l’idée de perte reste la même. Pour une classification, le signe de $ax+by-c$ peut choisir entre deux étiquettes, comme « spam » et « non spam » : c’est le lien avec les demi-plans. Par exemple, la règle fictive $x+y-3>0$ classe $(2,2)$ d’un côté et $(0,1)$ de l’autre. Une vraie application exige des données et une évaluation.

Quand aucune formule directe ne donne les paramètres, la descente de gradient cherche à diminuer la perte par petits ajustements. C’est un aperçu : les dérivées et les réseaux de neurones ne sont pas des prérequis cachés de ce chapitre.

<p class="source-next"><a href="/fr/chapters/C02/">Revoir le plan du chapitre →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
