---
lessonId: L06
locale: fr
version: 1
status: extended
title: "Réciproque, contraposée et langage de tous les jours"
summary: "Écrire la réciproque et la contraposée d’une implication, savoir laquelle lui est équivalente, et éviter de lire « si » comme « seulement si » dans le langage courant."
minutes: 12
objectives: [L06-O01, L06-O02, L06-O03, L06-O04, L06-O05, L06-O06]
prerequisites: [L05]
sourcePages: [24, 25, 26, 27, 28, 29]
---
# Réciproque, contraposée et langage de tous les jours

## Votre objectif

À la fin de cette leçon, vous savez écrire la réciproque et la contraposée de $A \Rightarrow B$, dire laquelle lui est équivalente, et éviter de lire « si » comme « seulement si » dans le langage courant.

**Prérequis :** la leçon L05, où $A \Rightarrow B$ et sa table de vérité sont introduites.

## Réciproque et contraposée

Pour une implication $A \Rightarrow B$ :

- sa **réciproque** est $B \Rightarrow A$ ;
- sa **contraposée** est $\neg B \Rightarrow \neg A$.

La réciproque échange les deux côtés. La contraposée les échange et nie les deux.

## La contraposée est équivalente

Toute implication est sémantiquement équivalente à sa contraposée :
$$
(A \Rightarrow B) \equiv (\neg B \Rightarrow \neg A).
$$

| A | B | A ⇒ B | ¬B ⇒ ¬A | B ⇒ A |
| --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Les colonnes de $A \Rightarrow B$ et de sa contraposée coïncident sur chaque ligne. La réciproque diffère aux lignes $01$ et $10$ : une implication et sa réciproque ne sont donc **pas** équivalentes. Cette explication est un travail original du projet.

## Exemple guidé : divisible par 4

Soit $n$ un entier naturel. Soit $A$ « $n$ est divisible par 4 » et $B$ « $n$ est pair ».

1. $A \Rightarrow B$ est vraie : tout multiple de 4 est un multiple de 2.
2. La réciproque $B \Rightarrow A$ dit « si $n$ est pair, alors $n$ est divisible par 4 ». Elle est fausse : $n = 2$ est pair et n’est pas divisible par 4.
3. La contraposée $\neg B \Rightarrow \neg A$ dit « si $n$ est impair, alors $n$ n’est pas divisible par 4 ». Elle est vraie, comme il se doit.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Piège : le « si » du langage courant

Une responsable dit : « Si tu termines le rapport, tu as un jour de congé. » Un employé n’a pas de jour de congé. Par la contraposée, le rapport n’a pas été terminé, et cette déduction est valide.

Mais la responsable voulait probablement dire quelque chose de plus fort : un jour de congé **seulement** pour ceux qui ont terminé le rapport. C’est $B \Rightarrow A$, où $A$ est « tu termines le rapport » et $B$ est « tu as un jour de congé ». La phrase réellement prononcée, $A \Rightarrow B$, ne dit rien des personnes qui n’ont pas terminé.

Pour dire ce que vous pensez, écrivez l’implication dans le sens voulu, puis examinez sa réciproque et sa contraposée.

## Pratique indépendante

Les six exercices pilotes portent sur la réciproque, la contraposée, les énoncés équivalents, une table de vérité pour la réciproque, une déduction valide à partir d’une règle et la lecture d’une phrase courante.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Une implication est équivalente à sa contraposée, en général jamais à sa réciproque. Dans le langage courant, vérifiez si « si » voulait dire « seulement si ».

Texte et exemples originaux du projet. La couverture suit les pages 24 à 29 du PDF selon la carte du cours du dépôt ; les phrases d’exemple et l’énoncé de démonstration de la source ne sont pas reproduits.
