---
lessonId: L13
locale: fr
version: 1
status: extended
title: "Ensembles définis par compréhension"
summary: "Lire et calculer un ensemble défini par compréhension, y compris les intervalles et les nombres pairs, et séparer le domaine du filtre."
minutes: 12
objectives: [L13-O01, L13-O02, L13-O03, L13-O04, L13-O05, L13-O06]
prerequisites: [L10, L11]
sourcePages: [52, 53, 54, 55, 56]
---
# Ensembles définis par compréhension

## Votre objectif

À la fin de cette leçon, vous savez lire $\{a \in X \mid P(a)\}$, le calculer pour un $X$ fini, reconnaître les intervalles et les nombres pairs écrits ainsi, et séparer le domaine $X$ du filtre $P$.

**Prérequis :** L10 (ensembles et énumération) et L11 (prédicats).

## Définition

Si $P(x)$ est un prédicat sur $X$, l’ensemble des éléments $a$ de $X$ pour lesquels $P(a)$ est vrai se note
$$
\{a \in X \mid P(a)\}.
$$
On lit « l’ensemble des $a$ de $X$ tels que $P(a)$ ».

## Intervalles

Avec la notation française, un crochet tourné vers l’extérieur exclut une borne et un crochet tourné vers l’intérieur l’inclut :
$$
\{x \in \mathbb{R} \mid x > 2\} = ]2, +\infty[.
$$
L’intervalle $[10, +\infty[$ contient $10$ et tout réel plus grand.

## Les nombres pairs

$$
\{n \in \mathbb{N} \mid \exists k \in \mathbb{N}\ n = 2k\} = \{0, 2, 4, \ldots\}.
$$
Ici $\exists k \in \mathbb{N}$ se lit « il existe $k$ dans $\mathbb{N}$ ». Zéro est inclus, puisque $0 = 2 \cdot 0$.

## Exemple guidé : les nombres premiers jusqu’à 8

Soit $X = \{1, 2, 3, 4, 5, 6, 7, 8\}$ et $P(n)$ : « $n$ est premier ».

1. Testez chaque élément de $X$ avec $P$.
2. Les éléments qui passent le test sont $2$, $3$, $5$ et $7$.
3. Donc $\{n \in X \mid P(n)\} = \{2, 3, 5, 7\}$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : domaine et filtre

Le résultat dépend des deux parties. $\{n \in \{1, 2, 3\} \mid n > 5\} = \varnothing$, car le filtre élimine tous les éléments. Et $\{x \in \mathbb{N} \mid x > 2\}$ n’est pas le même ensemble que $\{x \in \mathbb{R} \mid x > 2\}$ : le domaine diffère.

## Pratique indépendante

Les six exercices pilotes portent sur une compréhension finie, deux intervalles, les nombres pairs, un résultat vide et un filtre sur les nombres premiers.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

$\{a \in X \mid P(a)\}$ garde les éléments de l’ensemble donné $X$ qui satisfont $P$. Nommez le domaine, appliquez le filtre, et attendez-vous à un résultat vide quand rien ne passe.

Texte et exemples originaux du projet. La couverture suit les pages 52 à 56 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
