---
lessonId: L09
locale: fr
version: 3
status: extended
title: "Ensembles naïfs et paradoxe de Russell"
summary: "Comprendre pourquoi « toute collection » est une notion d’ensemble trop naïve, suivre l’argument de Russell, et nommer les types d’ensembles admis dans le cours."
minutes: 14
objectives: [L09-O01, L09-O02, L09-O03, L09-O04, L09-O05, L09-O06]
prerequisites: [L01]
sourcePages: [37, 38, 39, 40]
---
# Ensembles naïfs et paradoxe de Russell

## Votre objectif

À la fin de cette leçon, vous savez dire ce qu’est un ensemble au sens informel, expliquer pourquoi « toute collection » est trop naïf, suivre l’argument de Russell et nommer les types d’ensembles admis dans le cours.

**Prérequis :** L01 (assertions et valeurs de vérité).

## Un exemple concret avant de généraliser

Dans $S = \{2,4\}$, $2 \in S$ dit que deux est l’un des objets listés. $\{2\} \subseteq S$ dit que tous les objets de ce petit ensemble sont dans $S$. Les deux symboles ne posent pas la même question. La négation $\neg$ signifie NON, comme en L02.

## Les ensembles comme collections

De façon informelle, un **ensemble** est une collection d’objets. C’est une structure de données fondamentale : par exemple, l’ensemble des lettres du mot « math ».

## Pourquoi « toute collection » échoue

Supposons que toute collection soit un ensemble. Soit $E$ la collection de tous les ensembles $x$ qui ne sont pas éléments d’eux-mêmes, c’est-à-dire tels que $x \notin x$. Le symbole $\notin$ se lit « n’est pas élément de ».

Est-ce que $E$ est un élément de $E$ ?

## L’argument de Russell

- Si $E \in E$, alors $E$ vérifie la condition de définition, qui dit $E \notin E$. C’est une contradiction.
- Si $E \notin E$, alors $E$ vérifie la condition de définition, donc $E \in E$. C’est une contradiction.

Dans les deux cas, on aboutit à une contradiction. C’est le **paradoxe de Russell**.

## Exemple guidé : l’argument avec des valeurs de vérité

Soit $v$ la valeur de vérité de l’assertion « $E \in E$ ». Par la condition de définition, « $E \in E$ » est vraie exactement lorsque $E \notin E$ l’est, donc $v = \neg v$.

Aucune valeur $v \in \{0, 1\}$ ne vérifie cette équation, car $\neg 0 = 1$ et $\neg 1 = 0$. La situation est celle de la phrase menteuse de la leçon L01, écrite dans le langage des ensembles.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Quelles collections sont des ensembles

Pour éviter les paradoxes, le cours n’accepte que certaines collections comme ensembles :

- les ensembles de nombres ;
- les ensembles définis par énumération ;
- les ensembles définis par compréhension ;
- les ensembles construits à partir des précédents.

La compréhension puise ses éléments dans un ensemble déjà donné, comme dans $\{a \in X \mid P(a)\}$ (L13). La collection $E$ ne puise dans aucun ensemble donné : elle n’est donc pas acceptée. C’est la restriction de travail du cours ; les axiomes complets de la théorie des ensembles dépassent ce cours.

Dans la notation de compréhension de cette section, $X$ est un ensemble déjà connu et $P(a)$ est un test qui garde ou rejette chaque élément. L10 à L13 développent ces outils. L’argument de Russell est un approfondissement : retenez d’abord pourquoi on ne fabrique pas un ensemble à partir de n’importe quelle description.

## Pratique indépendante

Les exercices sélectionnés portent sur la notion informelle d’ensemble, pourquoi elle est naïve, la collection de Russell, la contradiction, les types d’ensembles admis et pourquoi la compréhension sur un ensemble donné est plus sûre.

La pratique interactive est disponible avec un compte lorsque la connexion est configurée. Le bouton « S’exercer » ouvre les exercices avec correction et tentatives enregistrées dans votre progression privée.

## À retenir

« Toute collection est un ensemble » mène à la contradiction de Russell. Le cours ne garde que les ensembles de nombres, les énumérations, les compréhensions sur un ensemble donné et les ensembles construits à partir d’eux.

Texte et exemples originaux du projet. La couverture suit les pages 37 à 40 du PDF selon la carte du cours du dépôt ; aucun texte d’enseignant n’est reproduit.
