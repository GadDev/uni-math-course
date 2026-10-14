---
lessonId: L04
locale: fr
version: 1
status: extended
title: "Équivalence sémantique et lois booléennes"
summary: "Vérifier que deux formules ont la même table de vérité, appliquer les lois booléennes, reconnaître les tautologies et les contradictions, et réfuter une équivalence par une seule ligne."
minutes: 14
objectives: [L04-O01, L04-O02, L04-O03, L04-O04, L04-O05, L04-O06]
prerequisites: [L01, L02, L03]
sourcePages: [15, 16, 17, 18, 19]
---
# Équivalence sémantique et lois booléennes

## Votre objectif

À la fin de cette leçon, vous savez vérifier que deux formules sont sémantiquement équivalentes, appliquer les lois booléennes, reconnaître les tautologies et les contradictions, et réfuter une équivalence par une seule ligne.

**Prérequis :** L01 à L03 : valeurs de vérité, connecteurs $\land$, $\lor$, $\neg$, et tables de vérité complètes.

## Équivalence : la même table de vérité

Deux assertions $A$ et $B$ sont **sémantiquement équivalentes**, ce qu’on écrit $A \equiv B$, lorsqu’elles ont la même table de vérité : elles prennent la même valeur pour **toute** affectation. La logique ne peut pas distinguer deux assertions équivalentes.

## L’équivalence n’est pas un connecteur

$\equiv$ est une affirmation sur deux formules, et non un opérateur à l’intérieur d’une formule. L’énoncé $A \equiv B$ est vrai exactement lorsque les deux tables de vérité coïncident.

Ne le confondez pas avec $\Leftrightarrow$, la biconditionnelle étudiée dans la leçon L07. La formule $A \Leftrightarrow B$ est une assertion construite à partir de $A$ et $B$ ; l’énoncé $A \equiv B$ compare deux formules.

## Lois booléennes

Pour toutes assertions $A$, $B$ et $C$, les équivalences suivantes sont vraies :

- commutativité : $A \lor B \equiv B \lor A$ et $A \land B \equiv B \land A$ ;
- associativité : $A \lor (B \lor C) \equiv (A \lor B) \lor C$ et $A \land (B \land C) \equiv (A \land B) \land C$ ;
- distributivité : $A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$ et $A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$ ;
- double négation : $\neg\neg A \equiv A$ ;
- tiers exclu : $A \lor \neg A \equiv \top$ ;
- non-contradiction : $A \land \neg A \equiv \neg\top$ ;
- de Morgan : $\neg(A \lor B) \equiv \neg A \land \neg B$ et $\neg(A \land B) \equiv \neg A \lor \neg B$.

## Exemple guidé : vérifier une loi de distributivité

Vérifions que $A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$. Calculez les deux membres sur les huit affectations.

| A | B | C | A ∨ (B ∧ C) | (A ∨ B) ∧ (A ∨ C) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Les deux colonnes coïncident sur chaque ligne : l’équivalence est donc vraie. Cette vérification utilise des tables de vérité ; dériver la loi à partir des autres est une méthode différente, qui n’est pas demandée ici.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Tautologies et contradictions

Une **tautologie** est une assertion vraie pour toute affectation. Une **contradiction** est fausse pour toute affectation. La constante $\top$ est une tautologie, et $\neg\top$ est une contradiction.

- $A \lor \neg A$ est une tautologie.
- $A \land \neg A$ est une contradiction.

## Piège : nier chaque partie

$\neg (A \land B)$ n’est pas équivalent à $\neg A \land \neg B$. Une seule ligne suffit à le réfuter : avec $A = 1$ et $B = 0$, le membre de gauche vaut $\neg 0 = 1$, tandis que celui de droite vaut $0 \land 1 = 0$.

Une seule ligne différente suffit à réfuter une équivalence. Pour l’établir, il faut l’accord sur toutes les lignes.

## Pratique indépendante

Les six exercices pilotes portent sur la définition de l’équivalence, la loi de de Morgan, la vérification par table de vérité, la reconnaissance d’une tautologie, les lois du tiers exclu et de la non-contradiction, et la réfutation d’une équivalence par une seule ligne.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Deux formules sont équivalentes lorsque leurs tables de vérité sont identiques. Les lois booléennes donnent de telles équivalences ; une seule ligne différente en réfute une ; les tautologies et les contradictions sont les formules toujours vraies ou toujours fausses.

Texte et exemples originaux du projet. La couverture suit les pages 15 à 19 du PDF selon la carte du cours du dépôt. L’énoncé de démonstration de la page 19 n’est pas reproduit ; la vérification guidée ci-dessus est un travail original du projet.
