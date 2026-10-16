---
lessonId: L26
locale: fr
version: 1
status: extended
title: "Sommes, moyennes et centrage"
summary: "Lire la notation sigma, calculer une moyenne et comprendre les écarts centrés."
minutes: 15
objectives: [L26-O01, L26-O02, L26-O03, L26-O04, L26-O05, L26-O06]
prerequisites: [L21, L23]
sourcePages: [25, 26]
---
# Sommes, moyennes et centrage

## Objectifs et prérequis

- Développer une somme indicée.
- Compter les termes.
- Utiliser la linéarité.
- Calculer une moyenne.
- Centrer des données.
- Analyser les limites d’une somme.

Prérequis : L21, L23. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

## Sigma est une instruction de répétition

Pour une suite finie de réels, $\sum_{i=1}^n a_i=a_1+\cdots+a_n$. L’indice est une variable locale : le renommer ne change pas la somme si toutes ses occurrences changent ensemble. De $i=r$ à $i=s$ avec $r\le s$, il existe $s-r+1$ termes. Ici les moyennes portent toujours sur un nombre entier $n\ge1$ de données.

## Exemple guidé : dérouler avant de simplifier

La somme $\sum_{i=2}^4(2i-1)$ vaut $3+5+7=15$. Il y a trois termes, pas quatre. Une vérification utilise la linéarité : $2\sum_{i=2}^4i-\sum_{i=2}^41=2(2+3+4)-3=15$. Le terme constant est répété autant de fois que l’indice prend de valeurs.

## Moyenne et unités

La moyenne est $\bar x=(1/n)\sum_{i=1}^n x_i$. Elle possède la même unité que les observations. Pour les valeurs $2,5,8$, elle vaut $5$. Chaque donnée contribue une fois ; faire la moyenne de moyennes de groupes n’est correct sans pondération que lorsque les groupes ont les mêmes effectifs. Un échantillon vide n’a pas de moyenne définie par cette formule.

## Exemple guidé : les écarts à la moyenne

Pour les données $1,4,7$, la moyenne vaut $4$ et les écarts valent $-3,0,3$. Leur somme est nulle. Plus généralement, $\sum_i(x_i-\bar x)=\sum_i x_i-n\bar x=0$. Cette propriété ne signifie pas que chaque écart est nul. Des données dispersées peuvent avoir des écarts qui se compensent exactement.

## Somme des carrés et carré de la somme

Pour $1$ et $-1$, la somme vaut zéro, mais la somme des carrés vaut $2$. Le carré de la somme contient des termes croisés ; il ne s’obtient pas en élevant chaque terme séparément au carré. Cette distinction sera essentielle pour mesurer des erreurs de prédiction sans que leurs signes se compensent.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
