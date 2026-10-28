---
lessonId: L40
locale: fr
version: 1
status: extended
title: "La fonction exponentielle"
summary: "Comprendre e puissance x, son graphe et ses propriétés de croissance."
minutes: 30
objectives: [L40-O01, L40-O02, L40-O03, L40-O04, L40-O05, L40-O06]
prerequisites: [L38, L39]
sourcePages: [14, 15]
---
# La fonction exponentielle

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 14, 15.

## Objectifs et prérequis

La fonction exponentielle est un modèle central de croissance. Elle a une propriété remarquable : sa dérivée est elle-même.

$$D(e^x)=e^x$$

Les notions de dérivée et de composition sont nécessaires ici.

## Définition et condition initiale

Le PDF caractérise cette fonction comme l’unique solution de l’équation différentielle donnée et de la condition initiale. Nous utilisons ce résultat sans démontrer ici l’existence et l’unicité.

$$Df=f,\qquad f(0)=1$$

$$f(x)=e^x$$

La condition en zéro fixe le facteur multiplicatif et distingue cette solution particulière.

## Pourquoi le graphe monte-t-il ?

Sur le graphique du PDF, page 15, la fonction reste strictement positive et croît lorsque x augmente. Sa pente est aussi sa hauteur.

$$e^0=1,\qquad e^x>0$$

$$D(e^x)=e^x>0$$

La courbe s’approche de zéro vers la gauche sans atteindre zéro.

## La propriété fondamentale

Une addition dans l’exposant devient une multiplication de valeurs. Cela simplifie de nombreux calculs sans calculatrice.

$$e^{x+y}=e^x e^y$$

$$e^2e^3=e^5,\qquad e^xe^{-x}=1$$

Ne remplacez pas une somme des exponentielles par une exponentielle de somme : ces opérations sont différentes.

## Dériver une exponentielle composée

Pour une fonction exponentielle dont l’exposant dépend de x, utilisez la règle de la chaîne.

$$D(e^{g(x)})=g'(x)e^{g(x)}$$

$$D(e^{2x+1})=2e^{2x+1}$$

Le coefficient 2 vient de la variation de l’exposant, pas de la base e.

## Un exemple de tangente

Au point d’abscisse zéro, la courbe a une hauteur égale à un et une pente égale à un.

$$f(0)=1,\qquad Df(0)=1$$

$$y=1+x$$

La tangente est une approximation locale, pas l’égalité de la fonction avec une droite partout.

## Bilan et erreurs à éviter

Vérifiez que votre résultat garde l’exponentielle et le facteur dérivé de l’exposant. Interprétez l’égalité entre fonction et dérivée comme une croissance proportionnelle à la valeur actuelle.

$$\frac{D(e^x)}{e^x}=1$$

Cette relation utilise la positivité de l’exponentielle ; le quotient est bien défini pour tout réel.

