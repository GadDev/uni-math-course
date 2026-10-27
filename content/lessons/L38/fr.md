---
lessonId: L38
locale: fr
version: 1
status: extended
title: "De la sécante à la dérivée"
summary: "Relier vitesse moyenne, taux de variation, limite et pente d’une tangente."
minutes: 45
objectives: [L38-O01, L38-O02, L38-O03, L38-O04, L38-O05, L38-O06]
prerequisites: [L27, L37]
sourcePages: [5, 6, 7, 8, 9, 10, 11, 12]
---
# De la sécante à la dérivée

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 5, 6, 7, 8, 9, 10, 11, 12.

## Objectifs et prérequis

Interpréter un taux de variation, calculer une pente de sécante et comprendre la dérivée comme une limite.

$$\frac{f(x_0+h)-f(x_0)}{h},\qquad h\ne0$$

Vous utiliserez la pente des droites et les fonctions du cours précédent.

## Pourquoi parler de vitesse ?

Lors d’un trajet, on mesure facilement la distance parcourue pendant un intervalle ; on cherche ensuite la vitesse à un instant précis.

$$v_{\mathrm{moy}}=\frac{x(t_0+h)-x(t_0)}{h}$$

Réduire la durée h rapproche la vitesse moyenne de la vitesse instantanée, lorsque la limite existe.

## Définition de la dérivée

La dérivée est une limite finie de quotients de différences. Un quotient calculé en h égal à zéro n’a aucun sens : seule la limite peut avoir un sens.

$$Df(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$

Le PDF définit la dérivabilité sur un intervalle ouvert ; les quotients prennent des valeurs non nulles de h suffisamment proches de zéro.

## Exemple fil rouge : une parabole

Prenez le point P de coordonnées fixes et un second point Q qui se déplace le long de la courbe. La droite PQ est une sécante tant que les abscisses diffèrent.

$$f(x)=\frac{x^2}{2},\qquad P=(1,\tfrac12)$$

$$Q=(1+h,f(1+h)),\qquad \frac{f(1+h)-f(1)}{h}=1+\frac h2$$

Développez le carré avant de simplifier, en gardant la condition h non nul.

## Du numérique à la tangente

Le PDF illustre cinq positions successives de Q. Lorsque h diminue, les pentes calculées se rapprochent de 1.

$$\begin{array}{c|ccccc}h&2&1&0.5&0.25&0.1\\\hline\text{pente}&2&1.5&1.25&1.125&1.05\end{array}$$

$$Df(1)=\lim_{h\to0}(1+\tfrac h2)=1$$

La tangente à P a donc une pente égale à 1. Le point Q se rapproche de P mais le quotient ne se calcule pas à h égal à zéro.

## Équation de la tangente

Une droite de pente m passant par P satisfait la forme point–pente étudiée avec les droites.

$$y-f(x_0)=Df(x_0)(x-x_0)$$

$$y-\tfrac12=x-1\quad\Longleftrightarrow\quad y=x-\tfrac12$$

Vérifiez votre équation en remplaçant x par l’abscisse de P : vous devez retrouver son ordonnée.

## Essayez depuis les deux côtés

Une dérivée exige une limite commune pour h positif et négatif, pas seulement une suite de valeurs positives.

$$h=-0.2\quad\Longrightarrow\quad\text{pente}=0.9$$

$$\lim_{h\to0^-}(1+\tfrac h2)=\lim_{h\to0^+}(1+\tfrac h2)=1$$

Dans le prototype interactif « De la sécante à la tangente », déplacez Q à gauche puis à droite de P pour vérifier cette idée.

