---
lessonId: L07
locale: fr
version: 2
status: extended
title: "La biconditionnelle et l’équivalence sémantique"
summary: "Définir le connecteur ⇔, le distinguer de la relation ≡, et utiliser le fait que A ≡ B est vrai exactement lorsque A ⇔ B est une tautologie."
minutes: 12
objectives: [L07-O01, L07-O02, L07-O03, L07-O04, L07-O05, L07-O06]
prerequisites: [L04, L05, L06]
sourcePages: [30, 31]
---
# La biconditionnelle et l’équivalence sémantique

## Votre objectif

À la fin de cette leçon, vous savez définir $A \Leftrightarrow B$, compléter sa table de vérité, distinguer le connecteur $\Leftrightarrow$ de la relation $\equiv$, et utiliser une table pour décider d’une équivalence.

**Prérequis :** L04 (équivalence sémantique et tautologies), L05 (implication) et L06 (réciproque).

## La biconditionnelle

$A \Leftrightarrow B$ est l’assertion définie par
$$
(A \Rightarrow B) \land (B \Rightarrow A).
$$

| A | B | A ⇒ B | B ⇒ A | A ⇔ B |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

$A \Leftrightarrow B$ est vraie exactement lorsque $A$ et $B$ ont la même valeur de vérité.

## Deux niveaux différents

Les deux symboles vivent à des niveaux différents.

- $\Leftrightarrow$ est un **connecteur** : il fabrique une nouvelle assertion, avec sa propre table de vérité.
- $\equiv$ est une **relation entre assertions** : elle compare deux tables de vérité.

Un énoncé relie les deux niveaux : $A \equiv B$ est vrai exactement lorsque $A \Leftrightarrow B$ est une tautologie, c’est-à-dire lorsque $A \Leftrightarrow B$ ne prend jamais la valeur $0$.

Pourquoi : $A \Leftrightarrow B$ vaut $1$ sur une ligne exactement lorsque $A$ et $B$ s’accordent sur cette ligne. Elle vaut $1$ sur toutes les lignes exactement lorsqu’elles s’accordent partout, ce qui est la définition de $A \equiv B$. Cette explication est un travail original du projet.

## Exemple guidé : tester une équivalence

Pour tester $(A \Rightarrow B) \equiv (\neg A \lor B)$, on vérifie si $(A \Rightarrow B) \Leftrightarrow (\neg A \lor B)$ est une tautologie.

| A | B | A ⇒ B | ¬A ∨ B | (A ⇒ B) ⇔ (¬A ∨ B) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

La dernière colonne vaut toujours $1$ : l’équivalence est donc vraie.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : mélanger les deux niveaux

$A \Leftrightarrow B$ peut valoir $0$ sur une ligne : pour $A = 1$ et $B = 0$, elle vaut $0$. En revanche, $A \equiv B$ n’est pas une valeur calculée sur une ligne. C’est un énoncé sur les tables entières de $A$ et de $B$. Lorsque $A \Leftrightarrow B$ vaut $0$ sur une ligne, cette ligne montre que $A \equiv B$ est faux.

## Pratique indépendante

Les six exercices pilotes portent sur la définition, la table de vérité de la biconditionnelle, les deux niveaux, le lien avec les tautologies, un test d’équivalence par table et la détection de la confusion entre niveaux.

La pratique interactive nécessite une connexion. Sa disponibilité dépend de la version sélectionnée et du statut de publication de cette leçon.

## À retenir

$\Leftrightarrow$ fabrique une assertion ; $\equiv$ compare des assertions. Les deux se rejoignent en un fait : $A \equiv B$ exactement lorsque $A \Leftrightarrow B$ est une tautologie.

Texte et exemples originaux du projet. La couverture suit les pages 30 et 31 du PDF selon la carte du cours du dépôt ; l’énoncé de démonstration de la page 31 n’est pas reproduit.
