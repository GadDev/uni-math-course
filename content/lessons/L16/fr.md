---
lessonId: L16
locale: fr
version: 1
status: extended
title: "Quantificateurs bornés"
summary: "Lire ∀x ∈ X et ∃x ∈ X comme des abréviations, retenir que ∀ va avec ⇒ et ∃ va avec ∧, et nier des assertions bornées."
minutes: 12
objectives: [L16-O01, L16-O02, L16-O03, L16-O04, L16-O05, L16-O06]
prerequisites: [L11, L12]
sourcePages: [67, 68, 69, 70]
---
# Quantificateurs bornés

## Votre objectif

À la fin de cette leçon, vous savez développer $\forall x \in X\ P(x)$ et $\exists x \in X\ P(x)$, associer chaque quantificateur au bon connecteur, et nier des assertions bornées.

**Prérequis :** L11 (quantificateurs) et L12 (nier les quantificateurs).

## Notation

Si $X$ est un ensemble et $P(x)$ un prédicat, on écrit

- $\forall x \in X\ P(x)$ pour $\forall x\ (x \in X \Rightarrow P(x))$ ;
- $\exists x \in X\ P(x)$ pour $\exists x\ (x \in X \land P(x))$.

Le quantificateur parcourt alors un univers plus large, et la condition d’appartenance $x \in X$ le restreint.

## À retenir

$\forall$ va avec $\Rightarrow$, et $\exists$ va avec $\land$.

## Exemple guidé : pourquoi l’association compte

Travaillons dans l’univers $U = \{1, 2, 3, 4, 5\}$ avec $X = \{1, 2, 3\}$ et soit $P(x)$ : $x > 10$.

1. $\forall x\ (x \in X \Rightarrow P(x))$ est fausse : $x = 1$ est dans $X$ et ne vérifie pas $P$.
2. $\exists x\ (x \in X \land P(x))$ est fausse : aucun élément de $X$ ne vérifie $P$.
3. $\exists x\ (x \in X \Rightarrow P(x))$ est vraie : prenez $x = 4$. Il n’est pas dans $X$, donc l’implication est vraie quel que soit $P$.

La troisième assertion est vraie pour tout prédicat dès qu’un objet se trouve hors de $X$ : elle ne dit rien d’utile sur $X$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Négation

La négation conserve la borne :
$$
\neg \forall x \in X\ P(x) \equiv \exists x \in X\ \neg P(x),
$$
$$
\neg \exists x \in X\ P(x) \equiv \forall x \in X\ \neg P(x).
$$

## L’ensemble vide

$\forall x \in \varnothing\ P(x)$ est vraie pour tout $P$ : elle se développe en $\forall x\ (x \in \varnothing \Rightarrow P(x))$, et $x \in \varnothing$ est toujours faux, donc toute implication est vraie. C’est une conséquence du développement, et non une règle à part.

## Piège : le mauvais connecteur

Écrire $\exists x\ (x \in X \Rightarrow P(x))$ pour « un élément de $X$ vérifie $P$ » est faux, de même que $\forall x\ (x \in X \land P(x))$ pour « tout élément de $X$ vérifie $P$ » : cette dernière dit que tout objet de l’univers est dans $X$.

## Pratique indépendante

Les six exercices pilotes portent sur les deux développements, l’association quantificateur-connecteur, le piège du mauvais connecteur, la négation et l’ensemble vide.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

$\forall x \in X$ se développe avec $\Rightarrow$ ; $\exists x \in X$ se développe avec $\land$. La négation échange les quantificateurs et conserve la borne.

Texte et exemples originaux du projet. La couverture suit les pages 67 à 70 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
