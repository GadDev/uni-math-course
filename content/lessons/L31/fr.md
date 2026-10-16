---
lessonId: L31
locale: fr
version: 1
status: extended
title: "Demi-plans et triangles"
summary: "Utiliser le signe d’une expression affine pour décrire et tester une région."
minutes: 17
objectives: [L31-O01, L31-O02, L31-O03, L31-O04, L31-O05, L31-O06]
prerequisites: [L24, L28, L30]
sourcePages: [50, 51, 60]
---
# Demi-plans et triangles

## Objectifs et prérequis

- Tester une inégalité de demi-plan.
- Distinguer bord inclus et exclu.
- Choisir un côté par un point test.
- Combiner plusieurs contraintes.
- Tester l’intérieur d’un triangle.
- Analyser signe et dégénérescence.

Prérequis : L24, L28, L30. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

## Une droite sépare le plan

Pour $f(x,y)=ax+by-c$ avec $(a,b)\ne(0,0)$, la frontière est $f=0$. Les deux demi-plans ouverts sont $f>0$ et $f<0$ ; les versions fermées incluent le bord. Le signe est constant d’un côté de la droite. Il n’est pas toujours pertinent de dire « au-dessus » : une verticale sépare gauche et droite.

## Exemple guidé : point test

Pour $x+2y\le6$, l’origine donne $0\le6$ : on retient le côté contenant l’origine et la frontière. Le point $(4,2)$ donne $8>6$ et est exclu. Un point de la frontière ne permet pas de choisir le côté, puisque sa valeur est zéro pour les deux inégalités larges.

## Intersection de contraintes

La région $x\ge0$, $y\ge0$, $x+y\le4$ est un triangle fermé. Un point appartient à la région seulement s’il satisfait les trois tests. Vérifier une seule contrainte ne suffit pas. Les sommets sont $(0,0)$, $(4,0)$ et $(0,4)$ ; les arêtes sont incluses.

## Exemple guidé : triangle général

Pour trois sommets non alignés, chaque côté définit une droite. Pour chaque droite, garder le demi-plan fermé contenant le troisième sommet. Leur intersection est exactement le triangle rempli, bord compris. Avec $A=(0,0)$, $B=(4,0)$ et $C=(0,3)$, les contraintes sont $x\ge0$, $y\ge0$ et $3x+4y\le12$. Le point $(1,1)$ les satisfait toutes.

## Un test de même côté

Si $R$ est un point de référence hors de la droite, $P$ est du même côté ou sur le bord lorsque $f(P)f(R)\ge0$. Pour le même côté strict, utiliser $>0$. Multiplier une équation de frontière par un nombre négatif conserve la droite mais inverse les signes. Trois sommets alignés ne définissent pas un triangle d’intérieur non vide ; le test doit signaler ce cas avant le remplissage.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
