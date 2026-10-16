---
lessonId: L36
locale: fr
version: 1
status: extended
title: "Corrélation et limites des modèles"
summary: "Interpréter une corrélation, éviter les conclusions causales et situer l’apprentissage automatique."
minutes: 22
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

## Définir avant d’interpréter

Pour $S_{xx}>0$ et $S_{yy}>0$, la corrélation de Pearson est $r=S_{xy}/\sqrt{S_{xx}S_{yy}}$. Elle est sans unité et vérifie $-1\le r\le1$. Son signe est celui de la pente de régression. Si une des deux variables est constante, la formule est indéfinie : on ne lui attribue pas automatiquement zéro.

## Exemple guidé : signe et ajustement

Pour les points $(0,3),(1,2),(2,1)$, les moyennes valent $(1,2)$ et $S_{xx}=S_{yy}=2$, $S_{xy}=-2$. Donc $r=-1$ et la droite $y=-x+3$ ajuste exactement les observations. Sous les conditions de définition, $|r|=1$ équivaut à un ajustement affine parfait. Une corrélation proche de zéro exclut une forte association linéaire, pas toute relation.

## Exemple guidé : relation non linéaire

Les points $(-1,1),(0,0),(1,1)$ suivent exactement $y=x^2$. Pourtant $S_{xy}=0$ et $r=0$, car les produits centrés opposés s’annulent. Tracer les données révèle la courbure qu’un nombre ne montre pas. De même, des jeux de données différents peuvent partager des moyennes, variances et une même droite de régression tout en ayant des formes très différentes.

## Association, causalité et domaine

Les ventes de glaces et la fréquentation d’une piscine peuvent augmenter ensemble parce qu’il fait chaud. Cette association ne prouve pas que l’une cause l’autre. Une prédiction au-delà des entrées observées est une extrapolation et demande une justification supplémentaire. Même à l’intérieur de l’intervalle, la fiabilité dépend des données, des hypothèses et d’une validation ; elle n’est jamais garantie par la seule position de l’entrée. Une valeur atypique peut modifier fortement la droite et mérite une enquête, pas une suppression automatique.

## Du calcul à l’apprentissage automatique

Dans ce modèle supervisé, $x$ est une entrée ou caractéristique, $y$ une cible et $(m,p)$ les paramètres appris. L’entraînement choisit les paramètres en minimisant une perte sur les données d’entraînement. L’inférence utilise ces paramètres fixés pour produire une prédiction. Une faible erreur d’entraînement ne garantit pas une faible erreur sur de nouvelles données : réserver des données de validation aide à évaluer la généralisation.

## Ce que cette introduction prépare

Plusieurs caractéristiques conduiront à des modèles à plusieurs paramètres. Les perceptrons, réseaux non linéaires et méthodes de descente de gradient sont des pistes ultérieures annoncées par la source. Leur calcul n’est pas requis ici : le chapitre fournit les fondations algébriques, la notion de perte et la distinction entre ajuster un modèle et l’évaluer.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
