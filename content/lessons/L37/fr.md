---
lessonId: L37
locale: fr
version: 1
status: extended
title: "Fonctions, domaines et graphiques"
summary: "Comprendre la notion de fonction, trouver un domaine et lire des points sur un graphe."
minutes: 32
objectives: [L37-O01, L37-O02, L37-O03, L37-O04, L37-O05, L37-O06]
prerequisites: [L23, L27]
sourcePages: [2, 3, 4]
---
# Fonctions, domaines et graphiques

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 2, 3, 4.

## Objectifs et prérequis

Reconnaître une fonction comme une règle donnant une seule sortie pour chaque entrée autorisée. Retrouver un domaine, calculer une image et interpréter un point du graphe.

$$f:A\longrightarrow\mathbb R,\qquad x\longmapsto f(x)$$

Révisez les fractions et les coordonnées des leçons L23 et L27 avant de commencer.

## Qu’est-ce qu’une fonction ?

Une fonction attribue une valeur réelle à chaque entrée de son domaine. Deux entrées différentes peuvent avoir la même sortie ; une même entrée ne peut pas recevoir deux sorties différentes.

$$f(x)=x^3+2x+3$$

Pour cette fonction polynomiale, on peut remplacer x par n’importe quel réel.

## Le domaine n’est pas facultatif

Pour trouver le domaine d’une fraction rationnelle, commencez par demander quand son dénominateur est nul. Ces entrées sont interdites, même si une simplification semble possible.

$$r(x)=\frac{x^2-2x+2}{x(x-2)},\qquad D_r=\mathbb R\setminus\{0,2\}$$

Une fonction peut être définie seulement sur une partie de la droite réelle. Dire « tous les réels » sans vérifier les divisions est une erreur classique.

## Exemple détaillé : calculer des images

Remplacez chaque occurrence de l’entrée, conservez les parenthèses et effectuez les opérations dans l’ordre.

$$f(0)=0^3+2(0)+3=3$$

$$f(-1)=(-1)^3+2(-1)+3=0$$

$$f(2)=2^3+2(2)+3=15$$

Vérifiez séparément le domaine puis la valeur obtenue. Ne confondez pas f(2), une sortie, avec 2, une entrée.

## Du calcul au graphique

Le graphe rassemble tous les couples entrée–sortie. Sur le plan cartésien, l’abscisse porte l’entrée et l’ordonnée porte son image.

$$G_f=\{(x,f(x))\mid x\in A\}\subseteq\mathbb R^2$$

$$f(0)=3\quad\Longleftrightarrow\quad (0,3)\in G_f$$

La courbe du PDF, page 4, illustre le polynôme précédent. Le graphe ne peut attribuer deux ordonnées à une même abscisse.

## Deux pièges à éviter

Premier piège : substituer dans une expression dont le dénominateur vaut zéro. Deuxième piège : intervertir le sens des coordonnées en lisant un point.

$$r(0)\text{ n’est pas défini},\qquad r(2)\text{ n’est pas défini}$$

Lorsque vous avez un doute, écrivez les entrées interdites avant le premier calcul.

## Vérification rapide

Calculez la valeur de la fonction polynomiale en une nouvelle entrée et indiquez pourquoi la fonction rationnelle n’est pas définie en deux points.

$$f(1)=1+2+3=6$$

$$x(x-2)=0\quad\Longleftrightarrow\quad x\in\{0,2\}$$

Objectif atteint si vous pouvez passer sans hésitation d’un calcul à un point du graphe.

