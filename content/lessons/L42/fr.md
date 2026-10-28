---
lessonId: L42
locale: fr
version: 1
status: extended
title: "Changer de base et comparer les algorithmes"
summary: "Relier exponentielles, logarithmes en base 2 et croissance des coûts algorithmiques."
minutes: 38
objectives: [L42-O01, L42-O02, L42-O03, L42-O04, L42-O05, L42-O06]
prerequisites: [L39, L40, L41]
sourcePages: [18, 19]
---
# Changer de base et comparer les algorithmes

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 18, 19.

## Objectifs et prérequis

En informatique, les logarithmes aident à décrire l’effet de la taille des entrées sur le temps de calcul. Avant cela, il faut savoir changer de base.

$$a^x=e^{x\ln(a)}\qquad(a>0)$$

Les lois de l’exponentielle et du logarithme sont les prérequis immédiats.

## Toutes les bases positives

La définition du PDF fonctionne pour une base positive. La fonction existe aussi pour la base un : elle est alors constante et n’a pas de logarithme réciproque.

$$1^x=1,\qquad D(a^x)=\ln(a)\,a^x$$

Pour une base supérieure à un, la fonction croît ; pour une base comprise strictement entre zéro et un, elle décroît.

## Le logarithme en base a

La réciproque nécessite une base positive et différente de un. La division par ln(a) explique pourquoi la base un est interdite ici.

$$\log_a(x)=\frac{\ln(x)}{\ln(a)}\qquad(x>0,\ a>0,\ a\ne1)$$

$$\log_2(8)=3\qquad\text{car}\qquad 2^3=8$$

En informatique, la base deux est courante parce que diviser par deux fait diminuer rapidement un problème.

## Comprendre une boucle qui divise par deux

Imaginez une recherche qui divise à chaque étape la taille de l’ensemble restant. La valeur logarithmique compte le nombre de divisions par deux.

$$2^k=n\quad\Longleftrightarrow\quad k=\log_2(n)$$

$$\log_2(64)=6$$

L’exemple décrit une idée de complexité ; il ne prétend pas que chaque algorithme de recherche réalise toujours exactement ce nombre d’étapes.

## Dérivation et changement de base

Utilisez la règle de la chaîne pour dériver l’exponentielle de base a, puis la règle du logarithme pour sa réciproque.

$$D(2^x)=\ln(2)\,2^x$$

$$D\log_2(x)=\frac{1}{x\ln(2)}\qquad(x>0)$$

Les facteurs ln(2) et son inverse sont différents : vérifiez le sens de la fonction avant de dériver.

## Comparer les familles de complexité

La figure de la page 19 montre plusieurs familles sur une même fenêtre de valeurs. Elle invite à comparer leurs croissances, sans transformer un dessin limité en preuve universelle.

$$1,\quad\log_2(n),\quad\sqrt n,\quad n,\quad n\log_2(n),\quad 2^n,\quad n!$$

Pour de grandes tailles d’entrée, une courbe exponentielle domine les courbes polynomiales ; cette affirmation est un enrichissement théorique, pas une démonstration du dessin seul.

## Dernier exercice de synthèse

Calculez des coûts sur la même entrée, puis justifiez l’ordre choisi. Des valeurs exactes sont plus fiables qu’une lecture à l’œil sur une échelle compressée.

$$n=8:\quad\log_2(n)=3,\quad n=8,\quad n\log_2(n)=24,\quad 2^n=256$$

Vérifiez toujours le domaine d’un logarithme et les unités lorsqu’un coût représente du temps ou de la mémoire.

