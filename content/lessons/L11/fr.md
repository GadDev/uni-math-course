---
lessonId: L11
locale: fr
version: 1
status: extended
title: "Prédicats et quantificateurs"
summary: "Lire un prédicat P(x) sur un ensemble, évaluer ∀ et ∃ sur un domaine, et voir pourquoi le domaine change la valeur de vérité."
minutes: 14
objectives: [L11-O01, L11-O02, L11-O03, L11-O04, L11-O05, L11-O06]
prerequisites: [L01, L10]
sourcePages: [44, 45, 46, 47, 48]
---
# Prédicats et quantificateurs

## Votre objectif

À la fin de cette leçon, vous savez lire un prédicat $P(x)$ sur un ensemble $X$, évaluer $\forall x\ P(x)$ et $\exists x\ P(x)$, et expliquer comment le domaine change la valeur de vérité.

**Prérequis :** L01 (assertions) et L10 (ensembles et appartenance).

## Prédicats

Un **prédicat** $P(x)$ sur un ensemble $X$ est un énoncé qui devient une assertion dès que la variable $x$ est interprétée par un élément de $X$. Sa valeur de vérité dépend de cette interprétation. La définition s’étend aux prédicats à plusieurs variables, comme $P(x, y)$.

Par exemple, sur $\mathbb{R}$, soit $P(x)$ : $x > 2$. Il est vrai lorsque $x$ est interprété par $3$ et faux lorsque $x$ est interprété par $1$.

## Quantificateurs

Si $P(x)$ est un prédicat sur $X$ :

- $\forall x\ P(x)$ est vraie exactement lorsque $P(a)$ est vrai quel que soit le choix de $a$ dans $X$ ;
- $\exists x\ P(x)$ est vraie exactement lorsqu’il existe un choix de $a$ dans $X$ tel que $P(a)$ est vrai.

Le symbole $\forall$ se lit « pour tout » et $\exists$ se lit « il existe ».

## Exemple guidé : un prédicat, deux domaines

Soit $P(x)$ : $x > 2$.

1. Sur $\mathbb{R}$ : $\exists x\ P(x)$ est vraie, avec le témoin $3$. $\forall x\ P(x)$ est fausse, avec le contre-exemple $1$.
2. Sur $[10, +\infty[$ : $\forall x\ P(x)$ est vraie, car tout nombre à partir de $10$ dépasse $2$. $\exists x\ P(x)$ est aussi vraie.

Le même prédicat donne une valeur différente pour $\forall$ lorsque le domaine change.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : oublier le domaine

Une assertion avec un quantificateur n’a de sens qu’une fois l’ensemble $X$ nommé. Précisez toujours le domaine avant de décider de $\forall x\ P(x)$ ou de $\exists x\ P(x)$.

## Une précaution sur la source

L’exemple de l’âge à la page 48 de la source mêle des quantificateurs imbriqués et une comparaison « plus vieux que ». Lu littéralement, personne n’est plus vieux que soi-même : l’énoncé imbriqué évalué n’est donc pas vrai tel qu’il est écrit. Cette leçon n’utilise pas cet exemple ; voir les notes de relecture.

## Pratique indépendante

Les six exercices pilotes portent sur les prédicats, l’évaluation d’une valeur, $\forall$ sur un domaine fini, $\exists$ avec un témoin, l’effet du domaine et un prédicat sur des noms de lieux.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Un prédicat devient une assertion une fois sa variable fixée. $\forall x\ P(x)$ demande tous les éléments du domaine ; $\exists x\ P(x)$ en demande un. Nommez d’abord le domaine.

Texte et exemples originaux du projet. La couverture suit les pages 44 à 48 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
