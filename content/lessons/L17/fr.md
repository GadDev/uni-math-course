---
lessonId: L17
locale: fr
version: 3
status: extended
title: "Produits, relations et ordre des quantificateurs"
summary: "Décrire une petite table comme un ensemble de couples ordonnés, traduire des phrases en quantificateurs imbriqués, les évaluer, et voir que l’ordre des quantificateurs compte."
minutes: 18
objectives: [L17-O01, L17-O02, L17-O03, L17-O04, L17-O05, L17-O06]
prerequisites: [L11, L16]
sourcePages: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
---
# Produits, relations et ordre des quantificateurs

## Votre objectif

À la fin de cette leçon, vous savez décrire une table comme un ensemble de couples ordonnés, traduire des phrases en assertions à deux quantificateurs, les évaluer sur une petite table, et expliquer pourquoi leur ordre compte.

**Prérequis :** L11 (quantificateurs) et L16 (quantificateurs bornés).

## Voir la relation dans une grille

Le symbole $:=$ signifie « est défini par » ; le produit rassemble tous les couples possibles, pas seulement les inscriptions. Le symbole $\mid$ se lit « tels que », comme en L13.

| Étudiant | art | bio |
| --- | --- | --- |
| lia | inscrit | non inscrit |
| max | non inscrit | inscrit |
| noa | non inscrit | inscrit |

Les six cases sont les six couples du produit. Les trois cases « inscrit » sont la relation. Pour « chaque étudiant, au moins un cours », cherchez une case inscrite dans chaque ligne ; pour « un même cours pour tous », cherchez une colonne entièrement inscrite. Les deux recherches ne demandent pas la même chose.

## Une table jouet

Prenons les étudiants $E = \{\text{lia}, \text{max}, \text{noa}\}$ et les cours $C = \{\text{art}, \text{bio}\}$. Les inscriptions sont les couples $(\text{lia}, \text{art})$, $(\text{max}, \text{bio})$ et $(\text{noa}, \text{bio})$.

Dans ce modèle d’enseignement, une table est un ensemble de lignes sans doublons. Les vraies tables SQL peuvent contenir des doublons et des valeurs manquantes ; cette leçon ne les traite pas.

## Couples ordonnés et produits

Un **couple ordonné** $(x, c)$ a deux composantes, et leur ordre compte. Le **produit cartésien** est
$$
E \times C := \{(x, c) \mid x \in E \land c \in C\}.
$$
Ici $E \times C$ a $3 \times 2 = 6$ couples. Soit $I(x, c)$ le prédicat « $x$ est inscrit à $c$ », vrai exactement lorsque $(x, c)$ est une inscription.

## Traduire des phrases

- « Tout étudiant est inscrit à au moins un cours » : $\forall x \in E\ \exists c \in C\ I(x, c)$.
- « Il existe un cours suivi par tous les étudiants » : $\exists c \in C\ \forall x \in E\ I(x, c)$.

## Exemple guidé : évaluer les deux

1. $\forall x \in E\ \exists c \in C\ I(x, c)$ : lia suit art, max suit bio et noa suit bio. Tout étudiant a un cours : l’assertion est vraie.
2. $\exists c \in C\ \forall x \in E\ I(x, c)$ : art est suivi seulement par lia, et bio seulement par max et noa. Aucun cours n’est suivi par les trois étudiants : l’assertion est fausse.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : l’ordre compte

Les deux assertions ci-dessus utilisent le même prédicat et les mêmes quantificateurs dans un ordre différent, et elles ont des valeurs différentes ici. En général, $\forall x\ \exists c$ n’est pas la même chose que $\exists c\ \forall x$ : la première laisse le cours dépendre de l’étudiant, la seconde non.

## Retrouver les données du PDF

Les pages 71 à 81 utilisent les étudiants ana, ben, cleo, les cours math, prog, et les inscriptions (ana, math), (ana, prog), (ben, prog).

| Étudiant | math | prog |
| --- | --- | --- |
| ana | inscrit | inscrit |
| ben | non inscrit | inscrit |
| cleo | non inscrit | non inscrit |

Tout étudiant a-t-il un cours ? Non : cleo est un contre-exemple. Un cours est-il suivi par tous ? Non : cleo n’en suit aucun. Un étudiant suit-il tous les cours ? Oui : ana est un témoin. Le modèle lia/max/noa ci-dessus est un second exemple original : il permet de voir une autre combinaison de valeurs de vérité sans changer le sens des quantificateurs.

## Pratique indépendante

Les exercices sélectionnés portent sur le comptage des couples, la lecture du prédicat, deux traductions, une évaluation et l’effet de l’ordre des quantificateurs.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Le bouton « S’exercer » ouvre les exercices avec correction et tentatives enregistrées dans votre progression privée.

## À retenir

Dans notre modèle à deux colonnes, une table est un ensemble de couples et la relation se décrit par un prédicat sur un produit. Dans les quantificateurs imbriqués, l’ordre change le sens : traduisez avec soin, puis évaluez sur les données.

Texte et exemples originaux du projet. La couverture suit les pages 71 à 81 du PDF selon la carte du cours du dépôt ; le jeu de données du PDF est identifié ; le second modèle et les explications sont originaux.
