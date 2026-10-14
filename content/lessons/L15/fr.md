---
lessonId: L15
locale: fr
version: 1
status: extended
title: "Opérations sur les ensembles, complémentaires relatifs et algèbre"
summary: "Calculer intersections, unions et complémentaires relatifs à un ensemble nommé, et relier les lois de l’algèbre des ensembles aux lois booléennes."
minutes: 14
objectives: [L15-O01, L15-O02, L15-O03, L15-O04, L15-O05, L15-O06]
prerequisites: [L04, L10]
sourcePages: [59, 60, 61, 62, 63, 64, 65]
---
# Opérations sur les ensembles, complémentaires relatifs et algèbre

## Votre objectif

À la fin de cette leçon, vous savez calculer $A \cap B$, $A \cup B$ et un complémentaire relatif à un ensemble nommé, appliquer les lois de l’algèbre des ensembles, et les relier aux lois booléennes.

**Prérequis :** L04 (lois booléennes) et L10 (ensembles et inclusion).

## Trois opérations

Soient $A$, $B$ et $C$ des ensembles avec $A \subseteq C$.

- $A \cap B$ est l’ensemble des éléments qui sont dans $A$ **et** dans $B$.
- $A \cup B$ est l’ensemble des éléments qui sont dans $A$ **ou** dans $B$.
- $\overline{A}^{\,C}$ est l’ensemble des éléments de $C$ qui ne sont pas dans $A$.

Le complémentaire a toujours besoin de son ensemble ambiant $C$ : il signifie « pas dans $A$, parmi les éléments de $C$ ».

## Exemple guidé : calculer

Soient $A = \{1, 2, 4\}$, $B = \{2, 4, 6, 8\}$ et $C = \{1, 2, 3, 4, 5, 6, 7, 8\}$.

1. $A \cap B = \{2, 4\}$.
2. $A \cup B = \{1, 2, 4, 6, 8\}$.
3. $\overline{A \cup B}^{\,C} = \{3, 5, 7\}$ : les éléments de $C$ qui ne sont pas dans $A \cup B$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Algèbre des ensembles

Les opérations vérifient des identités qui découlent des lois booléennes. Pour des ensembles $A$, $B$, $C$ :

- commutativité : $A \cap B = B \cap A$ et $A \cup B = B \cup A$ ;
- associativité : $A \cap (B \cap C) = (A \cap B) \cap C$ et $(A \cup B) \cup C = A \cup (B \cup C)$ ;
- distributivité : $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ et $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ ;
- de Morgan, lorsque $A, B \subseteq C$ : $\overline{A \cup B}^{\,C} = \overline{A}^{\,C} \cap \overline{B}^{\,C}$ et $\overline{A \cap B}^{\,C} = \overline{A}^{\,C} \cup \overline{B}^{\,C}$.

## Le lien avec la logique

L’appartenance transforme chaque opération sur les ensembles en connecteur : $x \in A \cap B$ signifie « $x \in A$ et $x \in B$ », $x \in A \cup B$ signifie « $x \in A$ ou $x \in B$ », et $x \in \overline{A}^{\,C}$ signifie « $x \in C$ et non $x \in A$ ». C’est pourquoi les lois booléennes réapparaissent.

## Piège : l’ensemble ambiant oublié

Un complémentaire ne veut rien dire tant que l’on n’a pas nommé l’ensemble dans lequel on le prend. Avec $A = \{1, 2\}$, le complémentaire est $\{3\}$ dans $\{1, 2, 3\}$ mais $\{3, 4\}$ dans $\{1, 2, 3, 4\}$. Les lois de de Morgan exigent aussi que $A$ et $B$ soient dans $C$.

## Pratique indépendante

Les six exercices pilotes portent sur l’intersection, l’union, un complémentaire relatif, la loi de de Morgan pour les ensembles, le rôle de l’ensemble ambiant et le lien avec les connecteurs.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

$\cap$ correspond à « et », $\cup$ correspond à « ou », et un complémentaire correspond à « non » relativement à un ensemble nommé $C$. Les lois booléennes se transposent aux ensembles.

Texte et exemples originaux du projet. La couverture suit les pages 59 à 65 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
