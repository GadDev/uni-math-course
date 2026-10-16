---
lessonId: L34
locale: fr
version: 1
status: extended
title: "Modèles affines et résidus"
summary: "Mesurer l’erreur verticale d’un modèle et construire une perte quadratique."
minutes: 18
objectives: [L34-O01, L34-O02, L34-O03, L34-O04, L34-O05, L34-O06]
prerequisites: [L26, L29]
sourcePages: [63, 64, 65, 66, 67]
---
# Modèles affines et résidus

## Objectifs et prérequis

- Calculer une prédiction.
- Calculer un résidu signé.
- Expliquer la compensation des erreurs.
- Calculer une perte quadratique.
- Calculer les sommes centrées.
- Comparer des critères de modèle.

Prérequis : L26, L29. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

## Un modèle n’est pas une égalité des données

À chaque entrée $x_i$, le modèle prédit $\hat y_i=mx_i+p$. L’observation $y_i$ peut différer. Le résidu est $e_i=y_i-\hat y_i$. Un résidu positif signifie que le point observé est au-dessus de la droite, et donc que le modèle sous-estime cette observation. Nous ajustons les erreurs verticales, pas les distances perpendiculaires à la droite.

## Exemple guidé : calculer les résidus

Pour les données $(0,1),(1,2),(2,2)$ et le modèle $\hat y=x+1$, les prédictions sont $1,2,3$. Les résidus sont $0,0,-1$ et leur somme des carrés vaut $1$. Le dernier résidu négatif indique une surestimation. Changer de convention de signe ne changerait pas les carrés, mais changerait l’interprétation du signe.

## Une perte qui ne se compense pas

La perte des moindres carrés est $S(m,p)=\sum_{i=1}^n(y_i-mx_i-p)^2$, avec $n\ge1$. Elle est positive ou nulle, et vaut zéro exactement si toutes les prédictions sont exactes sur les données. La moyenne quadratique des erreurs est $\mathrm{MSE}=S/n$. Pour un même jeu de données, minimiser l’une ou l’autre donne les mêmes paramètres. Les carrés amplifient les grands résidus.

## Exemple guidé : une somme trompeuse

Les résidus $-2,2$ ont une somme nulle mais une perte $8$. Les résidus $1,1$ ont une somme $2$ mais une perte $2$. Choisir seulement la plus petite somme signée favoriserait à tort le premier modèle ; des résidus négatifs très grands pourraient même rendre ce critère arbitrairement négatif.

## Trois sommes utiles

Définir $S_{xx}=\sum_i(x_i-\bar x)^2$, $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$ et $S_{yy}=\sum_i(y_i-\bar y)^2$. Pour $(0,1),(2,3)$, les moyennes sont $(1,2)$ et ces trois sommes valent toutes $2$. Les sommes de carrés ne sont jamais négatives, mais la somme croisée peut être négative. Ces quantités prépareront le calcul de la meilleure droite.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
