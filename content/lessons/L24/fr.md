---
lessonId: L24
locale: fr
version: 2
status: extended
title: "Équations et inéquations"
summary: "Transformer une condition sans perdre de solutions ni ajouter de valeurs interdites."
minutes: 25
objectives: [L24-O01, L24-O02, L24-O03, L24-O04, L24-O05, L24-O06]
prerequisites: [L21, L22, L23]
sourcePages: [19, 20, 21, 22]
---
# Équations et inéquations

## Objectifs et prérequis

- Isoler une inconnue.
- Résoudre avec des fractions.
- Inverser correctement une inégalité.
- Écrire un ensemble de solutions.
- Préserver les cas nuls et le domaine.
- Analyser une transformation non équivalente.

Prérequis : L21, L22, L23. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-19" class="source-topic-marker"></span>

## Résoudre une équation : garder les mêmes solutions

Une inconnue est une valeur à chercher. Les deux **membres** sont les expressions de part et d’autre du signe égal. Résoudre ne veut pas dire deviner un nombre : il faut trouver toutes les solutions. Le symbole $\Leftrightarrow$ signifie ici « ces deux équations ont les mêmes solutions sur le domaine annoncé ».

**Exemple du PDF, pages 19–20.** $3x+5=11\Leftrightarrow3x=6\Leftrightarrow x=2$. On soustrait d’abord $5$ aux deux membres, puis on divise les deux par $3$. Vérification : $3\cdot2+5=11$.

Le piège du PDF est $x^2=x$. Diviser par $x$ sans vérifier son signe n’est pas le problème principal : il faut vérifier qu’il est **non nul**. La bonne transformation est $x^2-x=0\Leftrightarrow x(x-1)=0$ ; les solutions sont $0$ et $1$. On dit qu’un produit est nul si au moins un de ses facteurs est nul.

## Une équation décrit un ensemble

Résoudre une équation réelle consiste à trouver toutes les valeurs qui la rendent vraie. Ajouter le même réel aux deux membres ou multiplier par une constante non nulle conserve les solutions. Diviser par une expression dépendant de l’inconnue demande une restriction supplémentaire. L’équivalence doit porter sur le même domaine aux deux étapes ; une formule plus courte n’est pas automatiquement une condition équivalente.

## Exemple guidé : isoler puis vérifier

Pour $x\in\mathbb{R}$, $4(x-1)+2=14$ donne $4x-2=14$, puis $4x=16$ et $x=4$. Substituer dans l’énoncé donne $4(4-1)+2=14$. Le calcul de substitution vérifie le candidat ; les opérations réversibles montrent qu’il n’existe pas d’autre solution. Ces deux rôles sont distincts.

<p class="source-next"><a href="/fr/lessons/L24/#pdf-21">Suite du PDF : Inéquations →</a></p>

<span id="pdf-21" class="source-topic-marker"></span>

## Inéquations : pourquoi le sens s’inverse

**Exemple du PDF, pages 21–22.** $-2x+4>0\Leftrightarrow-2x>-4\Leftrightarrow x<2$. La dernière étape divise par $-2$ et inverse donc le sens. Sur une droite graduée, multiplier par un nombre négatif retourne l’ordre : $2<3$ mais $-2>-3$.

La solution s’écrit $]-\infty;2[$. Le crochet ouvert en $2$ indique que $2$ est exclu : le membre gauche serait zéro, alors qu’on demande strictement plus que zéro. Le point $0$ convient ; le point $3$ ne convient pas. On ne ferme jamais un intervalle sur l’infini : ce n’est pas un nombre réel à inclure.

**Exemple supplémentaire.** $3x-6\ge0\Leftrightarrow x\ge2$. Cette fois le bord est inclus, donc la solution est $[2;+\infty[$.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/inequality.svg" alt="Une demi-droite vers la gauche, avec un cercle ouvert en 2, représente x inférieur à 2." width="440" height="360" loading="lazy" />
<figcaption>Le cercle ouvert exclut la borne 2.</figcaption>
</figure>

## Inégalités et intervalles

Ajouter un réel conserve l’ordre. Multiplier par un réel positif le conserve aussi ; multiplier par un réel négatif l’inverse. Ainsi $-4x+3\le11$ équivaut à $-4x\le8$, puis $x\ge-2$. L’ensemble est $[-2;+\infty[$ : la borne est incluse. On utilise cette notation française aussi en anglais. Un facteur de signe inconnu ne permet pas de choisir un sens sans distinguer les cas.

## Exemple guidé : ne pas perdre zéro

L’équation $x^2=3x$ sur les réels devient $x(x-3)=0$. Les solutions sont $0$ et $3$. Diviser directement par $x$ aurait perdu zéro. Un produit nul a au moins un facteur nul. À l’inverse, élever au carré peut ajouter des candidats : après une étape non réversible, vérifiez chaque candidat dans l’équation initiale.

## Domaine avant simplification

Dans $(x^2-4)/(x-2)=4$, le domaine exclut $2$. La simplification donne $x+2=4$, dont le seul candidat est justement exclu : l’ensemble de solutions est vide. Ce n’est pas une erreur de calcul ; c’est le résultat de la restriction initiale. Conservez les bornes strictes ou larges avec la même attention lorsque l’inconnue doit ensuite être entière.

<p class="source-next"><a href="/fr/lessons/L25/#pdf-23">Suite du PDF : Systèmes de deux équations →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
