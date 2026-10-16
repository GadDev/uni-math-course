---
lessonId: L02
locale: fr
version: 2
status: pilot
title: "Connecteurs logiques : et, ou, non"
summary: "Lire les connecteurs ∧, ∨ et ¬ avec leur constante, les évaluer sur des valeurs données, appliquer la priorité de ¬, et distinguer le « ou » inclusif du « ou » exclusif."
minutes: 12
objectives: [L02-O01, L02-O02, L02-O03, L02-O04, L02-O05, L02-O06]
prerequisites: [L01]
sourcePages: [6, 7, 8, 9, 10, 11, 12]
---
# Connecteurs logiques : et, ou, non

## Votre objectif

À la fin de cette leçon, vous savez lire $\land$, $\lor$, $\neg$ et $\top$, les évaluer sur des valeurs données, appliquer la priorité de $\neg$, et distinguer le « ou » inclusif du « ou » exclusif.

**Prérequis :** la leçon L01, où une assertion a une seule valeur de vérité, notée $1$ ou $0$.

## Notation et la constante $\top$

Les lettres $A$, $B$, $C$, etc. désignent des assertions, ou des variables interprétées par des assertions. On construit de nouvelles assertions à partir d’assertions existantes à l’aide de connecteurs. La constante $\top$ est une assertion toujours vraie, quelles que soient les autres assertions.

Vous rencontrerez plusieurs notations pour le même connecteur :

- $A \land B$, aussi noté $A \cdot B$, se lit « A et B ».
- $A \lor B$, aussi noté $A + B$, se lit « A ou B ».
- $\neg A$, aussi noté $A'$, se lit « non A ».

## Conjonction : et

$A \land B$ est vraie exactement lorsque $A$ et $B$ sont toutes deux vraies.

| A | B | A ∧ B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

## Disjonction : ou inclusif

$A \lor B$ est vraie exactement lorsqu’au moins une des assertions $A$ et $B$ est vraie. Elle est aussi vraie lorsque les deux le sont.

| A | B | A ∨ B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

## Négation et priorité

$\neg A$ est vraie exactement lorsque $A$ est fausse.

| A | ¬A |
| --- | --- |
| 0 | 1 |
| 1 | 0 |

Dans ce cours, $\neg$ est prioritaire sur les autres connecteurs. Ainsi $\neg A \lor B$ signifie $(\neg A) \lor B$, et non $\neg (A \lor B)$. Le cours ne fixe pas d’ordre par défaut entre $\land$ et $\lor$ : écrivez donc des parenthèses dès qu’ils apparaissent ensemble, comme dans $(A \land B) \lor C$.

## Exemple guidé : une formule mixte

Évaluons $\neg A \lor B$ lorsque $A = 1$ et $B = 1$.

1. Calculez d’abord la négation : $\neg A = 0$.
2. Calculez $(\neg A) \lor B = 0 \lor 1$.
3. Une partie est vraie, donc le résultat est $1$.

L’autre lecture, $\neg (A \lor B)$, donne $\neg 1 = 0$. Les deux lectures diffèrent, et c’est pourquoi la priorité compte.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : le ou inclusif n’est pas exclusif

Dans $A \lor B$, le cas $A = B = 1$ est vrai. Un « ou » exclusif, souvent appelé XOR, est faux dans ce cas, car il exige qu’exactement une partie soit vraie. Dans ce cours, le « ou » mathématique est inclusif, sauf mention contraire.

## Pratique indépendante

Les six exercices pilotes portent sur la conjonction, les notations, le ou inclusif, la priorité, la constante $\top$ et le besoin de parenthèses.

La pratique interactive nécessite une connexion. Sa disponibilité dépend de la version sélectionnée et du statut de publication de cette leçon.

## À retenir

$\land$ demande les deux parties, $\lor$ demande au moins une partie, et $\neg$ inverse une valeur. $\neg$ est prioritaire, et les formules mixtes demandent des parenthèses.

Texte et exemples originaux du projet. La couverture suit les pages 6 à 12 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
