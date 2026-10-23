---
lessonId: L10
locale: fr
version: 3
status: extended
title: "Ensembles de nombres, énumération, appartenance et inclusion"
summary: "Ordonner les ensembles de nombres, définir un ensemble par énumération, utiliser l’ensemble vide, et distinguer l’appartenance ∈ de l’inclusion ⊆."
minutes: 18
objectives: [L10-O01, L10-O02, L10-O03, L10-O04, L10-O05, L10-O06]
prerequisites: [L09]
sourcePages: [41, 42, 43, 57]
---
# Ensembles de nombres, énumération, appartenance et inclusion

## Votre objectif

À la fin de cette leçon, vous savez ordonner les ensembles de nombres $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ et $\mathbb{R}$, définir un ensemble par énumération, utiliser l’ensemble vide, et distinguer $\in$ de $\subseteq$.

**Prérequis :** L09 (ce qu’est un ensemble).

## Mettre des exemples derrière les lettres

![Ensembles emboîtés : les naturels sont dans les entiers, les entiers dans les rationnels, les rationnels dans les réels ; zéro, moins trois, trois demis et racine de deux montrent les différences.](/diagrams/number-families.svg)

Les naturels sont $0,1,2,\ldots$ ; les entiers ajoutent les négatifs comme $-3$. Un rationnel est une fraction de deux entiers dont le dénominateur n’est pas nul, comme $\frac{3}{2}$. Les réels comprennent aussi des nombres irrationnels comme $\sqrt{2}$, qui ne s’écrivent pas comme une telle fraction.

Dans la définition symbolique de l’inclusion, $\forall$ se lit « pour tout » et $\Rightarrow$ « si… alors… » : pour chaque objet, s’il appartient à $B$, il appartient à $A$. $\exists$ se lit « il existe ». Vous pouvez utiliser la lecture en français avant de travailler ces symboles en L11 ; L05 explique l’implication. Si un objet de $B$ manque dans $A$, l’inclusion échoue.

## Les ensembles de nombres

Les naturels $\mathbb{N}$, les entiers $\mathbb{Z}$, les rationnels $\mathbb{Q}$ et les réels $\mathbb{R}$ vérifient
$$
\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}.
$$
Dans ce cours, $\mathbb{N} = \{0, 1, 2, \ldots\}$ contient zéro. Les langages de programmation représentent ces ensembles de façons différentes, et les nombres à virgule flottante courants approximent beaucoup de réels. Certains nombres sont représentés exactement, notamment de petits entiers ; des représentations rationnelles ou symboliques existent aussi.

L’**ensemble vide** $\varnothing$ ne contient aucun élément.

## Les ensembles par énumération

Un ensemble peut être défini en listant ses éléments, comme $\{1, 2, 4\}$. Un ensemble est déterminé par ses éléments : $\{4, 1, 2\}$ est donc le même ensemble. Cette remarque est un appui préalable et n’est pas enseignée par la source.

## Appartenance et inclusion

Appartenance et inclusion sont anticipées ici comme appui de lecture ; le rappel de la page 57 revient avec les ensembles de parties en L14.

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

Pour $A=\{1,2,3\}$, $2\in A$ et $\{2\}\subseteq A$ sont vrais, mais $\{2\}\in A$ est faux : A ne contient pas ce singleton. Ce n’est pas une interdiction d’avoir un ensemble comme élément. Si $B=\{\{2\}\}$, alors $\{2\}\in B$ est vrai.

Demandez-vous ce qui est comparé : $\in$ teste un objet parmi les éléments, $\subseteq$ compare deux ensembles. Dans la convention numérique de ce cours, $2\subseteq A$ n’est pas un test d’inclusion approprié : $2$ est un nombre, pas l’ensemble $\{2\}$.

## Pratique indépendante

Les exercices sélectionnés portent sur la chaîne des ensembles de nombres, l’énumération, l’ensemble vide, la distinction entre $\in$ et $\subseteq$, la définition de l’inclusion et la recherche d’un non-sous-ensemble.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Le bouton « S’exercer » ouvre les exercices avec correction et tentatives enregistrées dans votre progression privée.

## À retenir

$\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}$, avec $0 \in \mathbb{N}$. Utilisez $\in$ pour les éléments et $\subseteq$ pour les parties, et rappelez-vous que $\varnothing \subseteq A$ pour tout ensemble $A$.

Texte et exemples originaux du projet. La couverture suit les pages 41 à 43 et 57 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
