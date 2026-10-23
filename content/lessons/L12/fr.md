---
lessonId: L12
locale: fr
version: 3
status: extended
title: "Nier des assertions quantifiées"
summary: "Nier ∀ et ∃ correctement, énoncer des négations en langage courant, et utiliser contre-exemples et témoins."
minutes: 10
objectives: [L12-O01, L12-O02, L12-O03, L12-O04, L12-O05, L12-O06]
prerequisites: [L11]
sourcePages: [49, 50, 51]
---
# Nier des assertions quantifiées

## Votre objectif

À la fin de cette leçon, vous savez nier $\forall x\ P(x)$ et $\exists x\ P(x)$, énoncer des négations en langage courant, et utiliser contre-exemples et témoins.

**Prérequis :** L11 (prédicats et quantificateurs).

## Nier « pour tout »

« À la bibliothèque, tous les livres sont disponibles » échoue dès qu’un livre n’est pas disponible. Sa négation est « À la bibliothèque, un livre n’est pas disponible ».

## Nier « il existe »

« Au club, un membre a moins de 18 ans » échoue quand personne n’a moins de 18 ans. Sa négation est « Au club, tous les membres ont au moins 18 ans ».

## Les deux lois

Si $P(x)$ est un prédicat sur $X$ :
$$
\neg \forall x\ P(x) \equiv \exists x\ \neg P(x),
$$
$$
\neg \exists x\ P(x) \equiv \forall x\ \neg P(x).
$$

La négation échange le quantificateur et nie le prédicat.

## Exemple guidé : les naturels au-dessus de 2

Prenons le domaine $\mathbb{N}$, avec $0 \in \mathbb{N}$, et $P(n)$ : $n > 2$.

1. $\forall n\ P(n)$ est fausse : $n = 0$ est un contre-exemple.
2. Sa négation est $\exists n\ \neg P(n)$, qui dit $\exists n\ n \leq 2$.
3. Elle est vraie, et $n = 0$ est un témoin.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : nier seulement le prédicat

$\neg \forall x\ P(x)$ n’est pas $\forall x\ \neg P(x)$. Sur le domaine $\{1, 2\}$ avec $P(x)$ : $x > 1$, la première est vraie car $P(1)$ échoue, tandis que la seconde est fausse car $P(2)$ est vrai. « Ce ne sont pas tous les oiseaux qui volent » ne veut pas dire « aucun oiseau ne vole ».

## Nier toute la phrase, même sur un domaine vide

$\neg$ signifie NON et porte ici sur toute l’assertion quantifiée. Le symbole $\equiv$ dit que les deux formulations ont la même vérité dans toute interprétation du domaine et du prédicat ; nous étendons ainsi la comparaison des formules de L04 aux assertions quantifiées.

Si $X$ est vide, « tous les éléments vérifient P » est vrai car aucun contre-exemple n’existe ; « un élément vérifie P » est faux car aucun témoin n’existe. Leurs négations donnent respectivement faux et vrai : les deux lois continuent donc à fonctionner. Dans le premier exemple, dites explicitement « il existe au moins un livre indisponible » ; cela ne signifie pas un unique livre.

## Pratique indépendante

Les exercices sélectionnés portent sur les deux lois, des négations en langage courant et un contre-exemple, et la négation numérique sur $\mathbb{N}$.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Le bouton « S’exercer » ouvre les exercices avec correction et tentatives enregistrées dans votre progression privée.

## À retenir

Pour nier une assertion quantifiée, échangez $\forall$ et $\exists$ et niez le prédicat. Un contre-exemple réfute un « pour tout » ; un témoin prouve un « il existe ».

Texte et exemples originaux du projet. La couverture suit les pages 49 à 51 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
