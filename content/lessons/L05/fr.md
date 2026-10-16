---
lessonId: L05
locale: fr
version: 1
status: pilot
title: "L’implication : une promesse avec un seul échec"
summary: "Lire A ⇒ B, distinguer les conditions nécessaires et suffisantes, et trouver un contre-exemple."
minutes: 12
objectives: [L05-O01, L05-O02, L05-O03, L05-O04, L05-O05, L05-O06]
prerequisites: [L01, L02]
sourcePages: [20, 21, 22, 23]
---
# L’implication : une promesse avec un seul échec

## Votre objectif

À la fin de cette leçon, vous saurez lire $A \Rightarrow B$, compléter sa table de vérité, distinguer « nécessaire » de « suffisant » et reconnaître un contre-exemple.

**Prérequis :** une assertion possède une valeur de vérité ; ET, OU inclusif et NON. Pour revoir ces notions, consultez les leçons L01 (assertions) et L02 (connecteurs logiques), disponibles dans le programme.

## Une promesse très précise

Imaginez cette règle : « Si une carte est rouge, elle porte un tampon. »

- $A$ : « la carte est rouge ».
- $B$ : « la carte porte un tampon ».

La règle échoue pour une **carte rouge sans tampon**. Elle ne dit rien sur les cartes bleues : une carte bleue peut avoir un tampon ou ne pas en avoir.

L’implication mathématique exprime une relation entre valeurs de vérité. Elle ne décrit pas, à elle seule, une cause ou une chronologie.

## Définition et lecture

$A \Rightarrow B$ se lit « A implique B » ou « si A, alors B ». $A$ est l’antécédent ; $B$ est le conséquent.

On peut calculer l’implication avec :
$$
A \Rightarrow B \equiv \neg A \lor B.
$$

Ici $\equiv$ signifie que les deux expressions ont la même valeur pour **toutes** les affectations. Le symbole $\Rightarrow$ construit l’implication.

| A | B | ¬A | A ⇒ B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 |

Dans ce tableau, 0 signifie faux et 1 signifie vrai.

## Exemple guidé : la carte bleue sans tampon

1. La carte n’est pas rouge : $A = 0$.
2. Elle n’a pas de tampon : $B = 0$.
3. Donc $\neg A = 1$.
4. On calcule $\neg A \lor B = 1 \lor 0 = 1$.

Cette carte ne contredit pas la règle. **Elle ne prouve pas non plus que toutes les cartes rouges portent un tampon.** Une observation et une preuve générale sont deux choses différentes.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Nécessaire et suffisant

Dire $A \Rightarrow B$ revient à dire :

- A est une condition **suffisante** pour B : A garantit B.
- B est une condition **nécessaire** pour A : si B manque, A ne peut pas être vraie.

Par exemple, pour un entier naturel, « être supérieur à 10 » suffit à garantir « être supérieur à 5 ». La condition « être supérieur à 5 » est nécessaire pour être supérieur à 10, mais elle ne suffit pas : 8 est supérieur à 5 et pas à 10.

**Rappel préalable :** dans ce cours, $\mathbb{N} = \{0,1,2,\ldots\}$. Ce rappel aide l’exemple ; pour approfondir les ensembles de nombres, consultez la leçon L10 et le guide « Familles de nombres ».

## Nier une implication

Nier la règle, c’est décrire son échec :
$$
\neg(A \Rightarrow B) \equiv A \land \neg B.
$$

Avec les cartes : « la carte est rouge ET elle n’a pas de tampon ».

On peut vérifier autrement :
$$
\neg(\neg A \lor B) \equiv A \land \neg B.
$$

Nier chaque terme pour écrire $\neg A \Rightarrow \neg B$ n’est pas nier l’implication entière. Par exemple, pour $A=B=1$, cette nouvelle implication est vraie, tandis que $\neg(A \Rightarrow B)$ est fausse.

## Attention au piège

Une condition fausse ne suffit jamais à construire un contre-exemple à $A \Rightarrow B$. Il faut **A vraie et B fausse**. De même, A implique B ne garantit pas que B implique A.

## Pratique indépendante

Les six exercices du pilote couvrent le cas faux, la table de vérité, les conditions nécessaires/suffisantes, la négation, une règle en langage courant et un contre-exemple numérique.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Utilisez le bouton « S’exercer » après la leçon pour répondre aux six exercices, recevoir une correction et retrouver vos tentatives dans votre progression privée.

## À retenir

L’implication est une promesse avec un seul échec : **la condition est satisfaite, mais le résultat promis ne l’est pas**. Cherchez ce cas pour réfuter une implication.

Texte et exemples originaux du projet. Couverture alignée sur les pages PDF 20–23 du programme décrit dans le dépôt ; aucun exercice du professeur n’est reproduit.
