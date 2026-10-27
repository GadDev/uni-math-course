---
lessonId: L41
locale: fr
version: 1
status: extended
title: "Le logarithme népérien"
summary: "Utiliser la fonction réciproque de l’exponentielle, ses règles et sa dérivée."
minutes: 36
objectives: [L41-O01, L41-O02, L41-O03, L41-O04, L41-O05, L41-O06]
prerequisites: [L37, L39, L40]
sourcePages: [16, 17]
---
# Le logarithme népérien

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 16, 17.

## Objectifs et prérequis

Le logarithme népérien répond à la question : quel exposant faut-il appliquer à e pour obtenir une valeur strictement positive ?

$$\ln:(0,+\infty)\longrightarrow\mathbb R$$

Vous devez connaître le graphe et les règles de l’exponentielle.

## Deux fonctions réciproques

Le logarithme annule une exponentiation, et l’exponentielle annule un logarithme lorsque l’entrée du logarithme est positive.

$$\ln(e^y)=y\qquad(y\in\mathbb R)$$

$$e^{\ln(x)}=x\qquad(x>0)$$

Les domaines jouent un rôle essentiel : l’exponentielle est définie partout ; le logarithme ne s’applique qu’aux positifs.

## Repères indispensables

Partez des valeurs simples de l’exponentielle, puis inversez le sens de la relation.

$$e^0=1\ \Longrightarrow\ \ln(1)=0$$

$$e^1=e\ \Longrightarrow\ \ln(e)=1$$

$$e^{-2}=\frac1{e^2}\ \Longrightarrow\ \ln(e^{-2})=-2$$

Un logarithme peut être négatif ; c’est l’entrée du logarithme qui doit rester positive.

## Les règles de calcul

Transformer un produit en somme permet de réécrire une expression sans évaluer numériquement les valeurs.

$$\ln(xy)=\ln(x)+\ln(y)\qquad(x>0,y>0)$$

$$\ln(x^a)=a\ln(x)\qquad(x>0)$$

La formule pour une somme à l’intérieur du logarithme est différente et ne s’obtient pas en séparant les termes.

## Dériver le logarithme

Le PDF donne une règle remarquablement simple. Pour une composition, la chaîne ajoute la dérivée de l’intérieur.

$$D\ln(x)=\frac1x\qquad(x>0)$$

$$D\ln(2x+1)=\frac{2}{2x+1}\qquad(x>-\tfrac12)$$

Écrivez toujours l’inégalité qui garantit que l’argument est positif.

## Lire le graphique

Le graphe du PDF, page 17, passe par l’abscisse un à hauteur zéro, croît lentement et plonge sans borne quand x approche zéro par valeurs positives.

$$\lim_{x\to0^+}\ln(x)=-\infty$$

$$\ln(1)=0$$

Cette limite est une explication supplémentaire de la forme du graphe ; la planche source fournit la représentation.

## Exemple et pièges de domaine

Résoudre une équation logarithmique consiste souvent à appliquer l’exponentielle aux deux membres. Vérifiez ensuite la positivité de la solution.

$$\ln(x)=2\quad\Longleftrightarrow\quad x=e^2$$

Ne calculez jamais ln(0) ni ln d’un nombre négatif dans ce cours réel.

