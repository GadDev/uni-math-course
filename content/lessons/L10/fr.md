---
lessonId: L10
locale: fr
version: 1
status: extended
title: "Ensembles de nombres, énumération, appartenance et inclusion"
summary: "Ordonner les ensembles de nombres, définir un ensemble par énumération, utiliser l’ensemble vide, et distinguer l’appartenance ∈ de l’inclusion ⊆."
minutes: 12
objectives: [L10-O01, L10-O02, L10-O03, L10-O04, L10-O05, L10-O06]
prerequisites: [L09]
sourcePages: [41, 42, 43, 57]
---
# Ensembles de nombres, énumération, appartenance et inclusion

## Votre objectif

À la fin de cette leçon, vous savez ordonner les ensembles de nombres $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ et $\mathbb{R}$, définir un ensemble par énumération, utiliser l’ensemble vide, et distinguer $\in$ de $\subseteq$.

**Prérequis :** L09 (ce qu’est un ensemble).

## Les ensembles de nombres

Les naturels $\mathbb{N}$, les entiers $\mathbb{Z}$, les rationnels $\mathbb{Q}$ et les réels $\mathbb{R}$ vérifient
$$
\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}.
$$
Dans ce cours, $\mathbb{N} = \{0, 1, 2, \ldots\}$ contient zéro. Les langages de programmation représentent ces ensembles de façons différentes, et les ordinateurs ne représentent les réels qu’approximativement.

L’**ensemble vide** $\varnothing$ ne contient aucun élément.

## Les ensembles par énumération

Un ensemble peut être défini en listant ses éléments, comme $\{1, 2, 4\}$. Un ensemble est déterminé par ses éléments : $\{4, 1, 2\}$ est donc le même ensemble. Cette remarque est un appui préalable et n’est pas enseignée par la source.

## Appartenance et inclusion

Pour des ensembles $A$ et $B$ :

- $a \in A$ signifie que $a$ est un élément de $A$ ;
- $B \subseteq A$ signifie que tout élément de $B$ est un élément de $A$, c’est-à-dire
$$
\forall b\ (b \in B \Rightarrow b \in A).
$$

On dit alors que $B$ est une **partie** ou un **sous-ensemble** de $A$. L’appartenance relie un objet à un ensemble ; l’inclusion relie deux ensembles.

## Exemple guidé : distinguer les symboles

Soit $A = \{1, 2, 3\}$.

1. $2 \in A$ est vrai : $2$ est un élément de $A$.
2. $\{2\} \subseteq A$ est vrai : le seul élément de $\{2\}$ est dans $A$.
3. $\{2\} \in A$ est faux : les éléments de $A$ sont des nombres, et $\{2\}$ est un ensemble.
4. $\varnothing \subseteq A$ est vrai : $\varnothing$ n’a aucun élément qui pourrait ne pas être dans $A$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : élément ou partie ?

Écrire $\{2\} \in A$ ou $2 \subseteq A$ mélange les deux relations. Demandez-vous laquelle vous voulez dire : « est un élément de » s’écrit $\in$, « est une partie de » s’écrit $\subseteq$.

## Pratique indépendante

Les six exercices pilotes portent sur la chaîne des ensembles de nombres, l’énumération, l’ensemble vide, la distinction entre $\in$ et $\subseteq$, la définition de l’inclusion et la recherche d’un non-sous-ensemble.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

$\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}$, avec $0 \in \mathbb{N}$. Utilisez $\in$ pour les éléments et $\subseteq$ pour les parties, et rappelez-vous que $\varnothing \subseteq A$ pour tout ensemble $A$.

Texte et exemples originaux du projet. La couverture suit les pages 41 à 43 et 57 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
