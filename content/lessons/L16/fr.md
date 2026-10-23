---
lessonId: L16
locale: fr
version: 3
status: extended
title: "Quantificateurs bornés"
summary: "Lire ∀x ∈ X et ∃x ∈ X comme des abréviations, développer les quantificateurs bornés avec leur connecteur, et nier des assertions bornées."
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

Pour **développer ces quantificateurs bornés dans un univers plus grand**, $\forall$ va avec $\Rightarrow$, et $\exists$ avec $\land$. Ce moyen mnémotechnique ne concerne pas tous les usages de ces symboles.

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

## Du domaine au tableau

L’univers U est l’ensemble parcouru par les quantificateurs non bornés ; X est la partie sur laquelle porte notre affirmation. Pour développer la notation, le test P doit avoir un sens sur U (ou être prolongé à U). L05 explique le connecteur $\Rightarrow$ : il ne peut échouer que pour une condition vraie et une conclusion fausse.

Voici le tableau de l’exemple, avec $P(x)$ signifiant $x>10$. La ligne $4$ satisfait l’implication sans satisfaire la conjonction : elle explique le faux témoin du troisième énoncé.

| x | $x\in X$ | $P(x)$ | $x\in X\Rightarrow P(x)$ | $x\in X\land P(x)$ |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 0 | 0 |
| 2 | 1 | 0 | 0 | 0 |
| 3 | 1 | 0 | 0 | 0 |
| 4 | 0 | 0 | 1 | 0 |
| 5 | 0 | 0 | 1 | 0 |

Dans l’exemple, un, deux et trois sont dans X et échouent au test ; quatre et cinq ne sont pas dans X et ne peuvent donc pas réfuter la règle sur X. Pour X vide, le « pour tout » est vrai sans contre-exemple et le « il existe » est faux sans témoin. Le moyen mnémotechnique concerne le développement des quantificateurs bornés, pas tous les usages de ces symboles.

## Pratique indépendante

Les exercices sélectionnés portent sur les deux développements, l’association quantificateur-connecteur, le piège du mauvais connecteur, la négation et l’ensemble vide.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Le bouton « S’exercer » ouvre les exercices avec correction et tentatives enregistrées dans votre progression privée.

## À retenir

$\forall x \in X$ se développe avec $\Rightarrow$ ; $\exists x \in X$ se développe avec $\land$. La négation échange les quantificateurs et conserve la borne.

Texte et exemples originaux du projet. La couverture suit les pages 67 à 70 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
