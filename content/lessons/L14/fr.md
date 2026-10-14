---
lessonId: L14
locale: fr
version: 1
status: extended
title: "Ensembles des parties"
summary: "Lister les parties d’un petit ensemble, utiliser la notation 𝒫(A) et 2^A, et ne pas confondre un élément avec une partie."
minutes: 8
objectives: [L14-O01, L14-O02, L14-O03, L14-O04, L14-O05, L14-O06]
prerequisites: [L10]
sourcePages: [58]
---
# Ensembles des parties

## Votre objectif

À la fin de cette leçon, vous savez définir $\mathcal{P}(A)$, lister ses éléments pour un petit ensemble, et distinguer un élément de $A$ d’un élément de $\mathcal{P}(A)$.

**Prérequis :** L10 (appartenance et inclusion).

## Définition

Si $A$ est un ensemble, $2^A$ ou $\mathcal{P}(A)$ désigne l’ensemble dont les éléments sont les parties de $A$. Ses éléments sont des ensembles : chacun est un sous-ensemble de $A$.

Par exemple :
$$
\mathcal{P}(\{1, 2\}) = \{\varnothing, \{1\}, \{2\}, \{1, 2\}\}.
$$

## Deux parties toujours présentes

Pour tout ensemble $A$, $\varnothing$ et $A$ lui-même appartiennent à $\mathcal{P}(A)$, car $\varnothing \subseteq A$ et $A \subseteq A$.

## Combien de parties ?

Un ensemble à $n$ éléments a $2^n$ parties : chaque élément est soit dans une partie, soit en dehors. Cette remarque explique la notation $2^A$ ; c’est un complément d’enrichissement, et non un résultat énoncé par la source.

## Exemple guidé : trois éléments

Soit $A = \{a, b, c\}$. Ses parties sont $\varnothing$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$ et $\{a, b, c\}$. Cela fait $2^3 = 8$ parties.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : élément ou partie ?

Les éléments de $\mathcal{P}(\{1, 2\})$ sont des ensembles. Donc $\{1\} \in \mathcal{P}(\{1, 2\})$ est vrai, tandis que $1 \in \mathcal{P}(\{1, 2\})$ est faux : $1$ est un élément de $\{1, 2\}$, et non une partie. De plus, $\mathcal{P}(\varnothing) = \{\varnothing\}$ a un élément : il n’est donc pas vide.

## Pratique indépendante

Les six exercices pilotes portent sur le comptage des parties, la reconnaissance d’une partie, l’ensemble vide comme partie, le nombre $2^n$, l’ensemble des parties de l’ensemble vide et la distinction entre élément et partie.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

$\mathcal{P}(A)$ est l’ensemble de toutes les parties de $A$. Il contient toujours $\varnothing$ et $A$, et un ensemble à $n$ éléments a $2^n$ parties.

Texte et exemples originaux du projet. La couverture suit la page 58 du PDF selon la carte du cours du dépôt ; la remarque de dénombrement est un complément d’enrichissement.
