---
lessonId: L03
locale: fr
version: 1
status: pilot
title: "Tables de vérité : calculer une formule ligne par ligne"
summary: "Lister toutes les affectations, construire une table colonne par colonne à partir des sous-formules, évaluer une formule sur une ligne et vérifier une table complétée."
minutes: 12
objectives: [L03-O01, L03-O02, L03-O03, L03-O04, L03-O05, L03-O06]
prerequisites: [L01, L02]
sourcePages: [13, 14]
---
# Tables de vérité : calculer une formule ligne par ligne

## Votre objectif

À la fin de cette leçon, vous savez lister toutes les affectations de plusieurs assertions, construire une table de vérité colonne par colonne, évaluer une formule sur une ligne et vérifier une table complétée.

**Prérequis :** L01 (valeurs de vérité $1$ et $0$) et L02 (les connecteurs $\land$, $\lor$, $\neg$).

## Assertions atomiques et composées

Une assertion est **atomique** lorsqu’elle n’est pas construite à partir d’autres assertions avec $\lor$, $\land$ ou $\neg$. Sinon, elle est **composée**.

- $A$, $B$ et $C$ sont atomiques.
- $(A \land B) \lor \neg C$ est composée : elle est construite à partir de $A$, $B$ et $C$.

Une table de vérité décrit une assertion composée pour toutes les affectations de valeurs à ses assertions atomiques. On infère de proche en proche la valeur d’une assertion composée à partir de ses parties, et la table organise ce calcul.

## Lister les lignes

Avec $n$ assertions atomiques, il y a $2^n$ affectations. Listez-les de façon systématique : commencez par tous les zéros et comptez en binaire. Pour trois assertions $A$, $B$, $C$, les huit lignes sont $000$, $001$, $010$, $011$, $100$, $101$, $110$ et $111$.

## Construire une table colonne par colonne

Calculez d’abord les sous-formules, puis combinez-les. Prenons $(A \lor B) \land \neg A$ avec deux assertions.

| A | B | A ∨ B | ¬A | (A ∨ B) ∧ ¬A |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 |

Chaque colonne utilise seulement des colonnes déjà calculées ou les colonnes atomiques $A$ et $B$.

## Exemple guidé : lire la table terminée

La dernière colonne est vraie seulement à la ligne $01$ : là, $A = 0$ et $B = 1$. La formule $(A \lor B) \land \neg A$ est donc vraie exactement lorsque $A$ est fausse et $B$ est vraie.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : une ligne n’est pas toute la table

Évaluer une formule sur une seule ligne ne la décrit pas. Il faut couvrir toutes les affectations. Une erreur fréquente consiste à écrire trop peu de lignes, ou à recopier une valeur de la ligne précédente au lieu de la recalculer.

## Pratique indépendante

Les six exercices pilotes portent sur le comptage des lignes, l’identification des assertions atomiques, la construction et la lecture de tables à trois assertions, l’évaluation d’une ligne et la vérification de la table d’un élève.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Une table de vérité liste toutes les affectations, calcule les sous-formules d’abord, puis donne la valeur de la formule entière sur chaque ligne. C’est la table complète, et non une seule ligne, qui donne le sens complet de la formule.

Texte et exemples originaux du projet. La couverture suit les pages 13 et 14 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
