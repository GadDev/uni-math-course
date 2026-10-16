---
lessonId: L19
locale: fr
version: 2
status: extended
title: "Python all et any : tri, doublons et maximum"
summary: "Traduire des énoncés sur une liste en ∀ et ∃ puis en all et any de Python, et traiter les cas limites des listes courtes."
minutes: 14
objectives: [L19-O01, L19-O02, L19-O03, L19-O04, L19-O05, L19-O06]
prerequisites: [L16]
sourcePages: [90, 91, 92, 93, 94]
---
# Python all et any : tri, doublons et maximum

## Votre objectif

À la fin de cette leçon, vous savez traduire « la liste est triée », « la liste contient un doublon » et « la liste contient son maximum » en $\forall$ et $\exists$, les écrire avec `all` et `any` de Python, et énoncer les cas limites.

**Prérequis :** L16 (quantificateurs bornés).

## Une liste et ses indices

Soit `t` une liste Python finie de longueur $n = \mathrm{len}(t)$, composée de réels comparables sans NaN. Les comparaisons suivent un ordre total ; les complexes et les valeurs non comparables sont exclus. Les indices valides forment $J = \{i \in \mathbb{Z} \mid 0 \leq i < n\}$ ; les départs de paires voisines forment $K = \{i \in J \mid i+1 < n\}$. Ces deux ensembles sont vides lorsque $n = 0$. L’élément d’indice `i` est `t[i]`.

## Triée et non triée

« `t` est triée » (croissante au sens large) se traduit par
$$
\forall i \in K\ t[i] \leq t[i+1],
$$
ce que Python écrit
```python
all(t[i] <= t[i+1] for i in range(n-1))
```
« `t` n’est pas triée » en est la négation :
$$
\exists i \in K\ t[i] > t[i+1],
$$
écrite
```python
any(t[i] > t[i+1] for i in range(n-1))
```
Il y a $\max(n-1, 0)$ paires voisines. Pour $n \geq 1$, leurs indices de départ vont de $0$ à $n-2$ ; pour la liste vide, aucun indice ne convient. `range(n-1)` énumère exactement ces départs, y compris `range(-1)`, qui est vide.

## Exemple guidé : une liste de trois nombres

Prenons `t = [1, 3, 2]`, donc $n = 3$ et les indices de comparaison sont $0$ et $1$.

1. `t[0] <= t[1]` est `1 <= 3`, vrai.
2. `t[1] <= t[2]` est `3 <= 2`, faux.
3. Donc `all(...)` vaut `False` et `any(t[i] > t[i+1] ...)` vaut `True` : la liste n’est pas triée, avec le témoin $i = 1$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Doublons et maximum

Ce sont des traductions originales ; la source du cours ne les pose que comme exercices.

- « `t` contient un doublon » : $\exists i \in J\ \exists j \in J\ (i < j \land t[i] = t[j])$.
- « `t` contient son maximum » : $\exists i \in J\ \forall j \in J\ t[j] \leq t[i]$.

La condition $i < j$ compte : sans elle, chaque élément est égal à lui-même.

Avec ces domaines d’indices, les traductions Python sont :

```python
any(t[i] == t[j] for i in range(n) for j in range(i+1, n))
any(all(t[j] <= t[i] for j in range(n)) for i in range(n))
```

La première recherche deux positions distinctes de même valeur ; la seconde recherche une position dont la valeur domine toutes les autres.

## Cas limites

Pour une liste vide, la plage est vide. Alors `all(...)` sur une plage vide vaut `True` et `any(...)` sur une plage vide vaut `False`. Une liste de longueur $0$ ou $1$ est donc triée. L’énoncé « contient son maximum » exige une liste finie et non vide de nombres : une liste vide n’a pas de maximum, et la traduction donne bien faux.

## Pratique indépendante

Les six exercices pilotes portent sur la traduction avec `all`, la négation, le nombre de comparaisons, les doublons, le maximum et la liste vide.

La pratique interactive nécessite une connexion. Sa disponibilité dépend de la version sélectionnée et du statut de publication de cette leçon.

## À retenir

$\forall$ sur des indices est `all`, $\exists$ sur des indices est `any`. Vérifiez la plage d’indices, et rappelez-vous ce que renvoient `all` et `any` sur une plage vide.

Texte et exemples originaux du projet. La couverture suit les pages 90 à 94 du PDF selon la carte du cours du dépôt ; les traductions des doublons et du maximum sont des solutions originales à l’exercice ouvert de la source.
