---
lessonId: L20
locale: fr
version: 1
status: extended
title: "Contrôle d’accès et piège du « seuls »"
summary: "Traduire des règles de contrôle d’accès avec ∀, ∃ et ⇒, éviter l’inversion cachée dans « seuls », et nier des assertions imbriquées."
minutes: 14
objectives: [L20-O01, L20-O02, L20-O03, L20-O04, L20-O05, L20-O06]
prerequisites: [L05, L16]
sourcePages: [95, 96]
---
# Contrôle d’accès et piège du « seuls »

## Votre objectif

À la fin de cette leçon, vous savez traduire « seuls les responsables peuvent approuver une demande » en formule, dire pourquoi être responsable est nécessaire mais pas suffisant, et nier des assertions quantifiées imbriquées.

**Prérequis :** L05 (implication) et L16 (quantificateurs bornés).

## Un petit modèle

Soit $U$ l’ensemble des utilisateurs et $R$ l’ensemble des demandes. Soit $M(u)$ : « $u$ est responsable » et $V(u, r)$ : « $u$ peut approuver $r$ ».

Pour les exemples, prenons les utilisateurs ana, ben et cleo ; seule ana est responsable ; les demandes sont r1 et r2 ; et les approbations sont (ana, r1), (ana, r2) et (ben, r1).

## Le piège du « seuls »

« Seuls les responsables peuvent approuver une demande » dit que quiconque peut approuver est responsable :
$$
\forall u \in U\ \forall r \in R\ (V(u, r) \Rightarrow M(u)).
$$
Être responsable est une condition **nécessaire** pour approuver, pas une condition suffisante. La phrase ne dit pas que tout responsable peut approuver. Lire « seuls » à l’envers donne $\forall u\ (M(u) \Rightarrow \ldots)$, qui est une autre assertion.

## Exemple guidé : évaluer sur le modèle

1. L’assertion dit : quiconque approuve est responsable.
2. Dans le modèle, ben approuve r1 et n’est pas responsable.
3. Donc $\forall u \in U\ \forall r \in R\ (V(u, r) \Rightarrow M(u))$ est fausse, avec le contre-exemple $(\text{ben}, \text{r1})$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Deux autres traductions et leurs négations

Ces exemples sont des solutions originales du type d’exercice posé par la source.

- « Tout responsable peut approuver toutes les demandes » : $\forall u \in U\ (M(u) \Rightarrow \forall r \in R\ V(u, r))$. Sa négation est $\exists u \in U\ (M(u) \land \exists r \in R\ \neg V(u, r))$.
- « Il existe une demande que personne ne peut approuver » : $\exists r \in R\ \forall u \in U\ \neg V(u, r)$. Sa négation est $\forall r \in R\ \exists u \in U\ V(u, r)$.

## Pratique indépendante

Les six exercices pilotes portent sur la traduction de « seuls », nécessaire contre suffisant, une évaluation, et deux traductions avec une négation.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

« Seul $A$ peut $B$ » signifie $B \Rightarrow A$ : $A$ est nécessaire pour $B$. Traduisez avec $\forall$ et $\Rightarrow$, et niez en échangeant les quantificateurs et en niant le prédicat.

Texte et exemples originaux du projet. La couverture suit les pages 95 et 96 du PDF selon la carte du cours du dépôt ; le modèle, les phrases et les solutions sont originaux et ne reproduisent pas l’exercice de la source.
