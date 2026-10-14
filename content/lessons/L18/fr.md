---
lessonId: L18
locale: fr
version: 1
status: extended
title: "SQL comme compréhension : EXISTS et NOT EXISTS"
summary: "Lire une requête SELECT comme un ensemble défini par compréhension, associer AND, OR, NOT à ∧, ∨, ¬, et associer EXISTS et NOT EXISTS à ∃ et ¬∃."
minutes: 14
objectives: [L18-O01, L18-O02, L18-O03, L18-O04, L18-O05, L18-O06]
prerequisites: [L16, L17]
sourcePages: [82, 83, 84, 85, 86, 87, 88, 89]
---
# SQL comme compréhension : EXISTS et NOT EXISTS

## Votre objectif

À la fin de cette leçon, vous savez lire une requête `SELECT` comme un ensemble défini par compréhension, associer `AND`, `OR`, `NOT` à $\land$, $\lor$, $\neg$, et associer `EXISTS` et `NOT EXISTS` à $\exists$ et $\neg\exists$.

**Prérequis :** L16 (quantificateurs bornés) et L17 (tables comme ensembles de couples).

## La base de données jouet

Utilisez la table `Student(id)` avec les identifiants lia, max et noa, et la table `Enrolled(student, course)` avec les lignes (lia, art), (max, bio) et (noa, bio). Comme dans L17, chaque table est un ensemble de lignes sans doublons ; les doublons et les valeurs manquantes de SQL sortent du cadre de cette leçon.

## Une requête est une compréhension

```sql
SELECT e.student FROM Enrolled e WHERE e.course = 'bio';
```

- `e` est une variable qui parcourt les lignes de `Enrolled`.
- La condition après `WHERE` est un prédicat sur `e` ; `AND`, `OR` et `NOT` jouent les rôles de $\land$, $\lor$ et $\neg$.
- Le résultat est une table.

Avec $E = \{\text{lia}, \text{max}, \text{noa}\}$ et $I(x, c)$ signifiant « $x$ est inscrit à $c$ », cette requête se lit
$$
\{x \in E \mid I(x, \text{bio})\} = \{\text{max}, \text{noa}\}.
$$

## EXISTS est un quantificateur

Une condition peut contenir une sous-requête. `EXISTS (...)` est vrai exactement lorsque la sous-requête renvoie au moins une ligne. `EXISTS` correspond à $\exists$ et `NOT EXISTS` à $\neg\exists$.

## Exemple guidé : les étudiants non inscrits en art

```sql
SELECT s.id FROM Student s
WHERE NOT EXISTS (SELECT * FROM Enrolled e
                  WHERE e.student = s.id AND e.course = 'art');
```

1. Pour chaque étudiant `s`, la sous-requête cherche une inscription de `s` en art.
2. `NOT EXISTS` garde les étudiants pour lesquels il n’y en a pas.
3. Seule lia est inscrite en art : le résultat est $\{x \in E \mid \neg I(x, \text{art})\} = \{\text{max}, \text{noa}\}$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## SQL n’a pas de ∀

SQL n’a pas de quantificateur universel. Ce n’est pas grave, car
$$
\forall x\ P(x) \equiv \neg\exists x\ \neg P(x).
$$
Pour exprimer « tous… », écrivez `NOT EXISTS` d’un contre-exemple.

## Piège : lire la requête, pas les données

Le résultat d’une requête dépend des tables. La même requête sur d’autres lignes donne un autre ensemble : évaluez donc toujours sur les données fournies.

## Pratique indépendante

Les six exercices pilotes portent sur la lecture d’une requête, le prédicat, les connecteurs, `EXISTS`, une requête `NOT EXISTS` et le remplacement de $\forall$.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Une requête `SELECT … WHERE` est un ensemble défini par compréhension. `EXISTS` est $\exists$, `NOT EXISTS` est $\neg\exists$, et $\forall$ s’écrit avec $\neg\exists\neg$.

Texte et exemples originaux du projet. La couverture suit les pages 82 à 89 du PDF selon la carte du cours du dépôt ; les données et les requêtes d’exemple sont originales.
