---
lessonId: L08
locale: fr
version: 1
status: extended
title: "Complétude fonctionnelle : toute table avec OU et NON"
summary: "Transformer toute table de vérité en une formule qui n’utilise que ∨ et ¬, en décrivant chaque ligne vraie puis en éliminant ∧ avec de Morgan."
minutes: 14
objectives: [L08-O01, L08-O02, L08-O03, L08-O04, L08-O05, L08-O06]
prerequisites: [L03, L04]
sourcePages: [32, 33, 34, 35]
---
# Complétude fonctionnelle : toute table avec OU et NON

## Votre objectif

À la fin de cette leçon, vous savez lire une table de vérité comme une fonction, décrire chaque ligne vraie par une conjonction, les combiner avec $\lor$, et éliminer $\land$ grâce à de Morgan, de sorte que la formule n’utilise que $\lor$ et $\neg$.

**Prérequis :** L03 (tables de vérité) et L04 (lois booléennes, de Morgan).

## Le problème

Une fonction $f$ donne une valeur $0$ ou $1$ pour chaque affectation de $x$, $y$, $z$. La question est de savoir si une assertion a exactement $f$ pour table de vérité. La réponse est oui, et la construction ci-dessous fonctionne toujours.

## Étape 1 : une conjonction par ligne vraie

Un **littéral** est une lettre ou sa négation. Pour une ligne où $f = 1$, écrivez la conjonction de littéraux qui est vraie sur cette ligne et sur aucune autre. Pour la ligne $x = 0$, $y = 1$, $z = 1$, c’est $\neg x \land y \land z$.

## Étape 2 : relier les lignes vraies par OU

Si $f$ vaut $1$ sur plusieurs lignes, prenez la disjonction de leurs conjonctions. Le résultat vaut $1$ exactement sur les lignes où $f$ vaut $1$.

## Étape 3 : éliminer ET avec de Morgan

Pour tous $C$ et $D$,
$$
C \land D \equiv \neg(\neg C \lor \neg D).
$$
En appliquant cette équivalence à plusieurs reprises, on obtient une formule qui n’utilise que $\lor$ et $\neg$.

## Exemple guidé : le ou exclusif

Soit $f(x, y)$ qui vaut $1$ exactement sur les lignes $01$ et $10$.

1. La ligne $01$ donne $\neg x \land y$. La ligne $10$ donne $x \land \neg y$.
2. Reliez-les : $(\neg x \land y) \lor (x \land \neg y)$.
3. Éliminez $\land$ : $\neg x \land y \equiv \neg(x \lor \neg y)$ et $x \land \neg y \equiv \neg(\neg x \lor y)$.

Donc $f$ est la table de $\neg(x \lor \neg y) \lor \neg(\neg x \lor y)$, qui n’utilise que $\lor$ et $\neg$.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Le théorème

Toute fonction $f : \{0,1\}^n \to \{0,1\}$ est la table de vérité d’une assertion à $n$ variables propositionnelles qui n’utilise que $\lor$ et $\neg$.

Si $f$ ne vaut $1$ sur aucune ligne, il n’y a aucune ligne vraie à décrire ; prenez $\neg(x \lor \neg x)$, qui est toujours fausse.

## Attention : les deux connecteurs sont nécessaires

Utiliser $\lor$ seul sur une lettre $x$ ne donne que $x$, car $x \lor x \equiv x$. Donc $\lor$ seul ne peut pas construire $\neg x$. La négation est indispensable.

## Pratique indépendante

Les six exercices pilotes portent sur la lecture des lignes vraies, la conjonction d’une ligne, la jonction des lignes, l’élimination de $\land$, l’énoncé du théorème et la construction d’une table à trois variables.

La pratique interactive nécessite une connexion. Elle sera ajoutée une fois les comptes et la correction côté serveur intégrés.

## À retenir

Décrivez chaque ligne vraie, reliez les descriptions par $\lor$, puis remplacez $\land$ avec de Morgan. Toute table de vérité est atteignable avec $\lor$ et $\neg$ seuls.

Texte et exemples originaux du projet. La couverture suit les pages 32 à 35 du PDF selon la carte du cours du dépôt ; la table d’exemple de la source n’est pas reproduite.
