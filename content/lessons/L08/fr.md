---
lessonId: L08
locale: fr
version: 4
status: extended
title: "Complétude fonctionnelle : toute table avec OU et NON"
summary: "Transformer toute table de vérité en une formule qui n’utilise que ∨ et ¬, en décrivant chaque ligne vraie puis en éliminant ∧ avec de Morgan."
minutes: 20
objectives: [L08-O01, L08-O02, L08-O03, L08-O04, L08-O05, L08-O06]
prerequisites: [L03, L04]
sourcePages: [32, 33, 34, 35]
---
# Complétude fonctionnelle : toute table avec OU et NON

Dans cette leçon, le nombre de variables vérifie $n \geq 1$. Nous utilisons seulement des variables, OU et NON ; les formules sans variable ne font pas partie du théorème.

## Votre objectif

À la fin de cette leçon, vous savez lire une table de vérité comme une fonction, décrire chaque ligne vraie par une conjonction, les combiner avec $\lor$, et éliminer $\land$ grâce à de Morgan, de sorte que la formule n’utilise que $\lor$ et $\neg$.

**Prérequis :** L03 (tables de vérité) et L04 (lois booléennes, de Morgan).

## Décoder l’énoncé du théorème

Pensez à une machine : elle reçoit une ligne de zéros et de uns, puis renvoie un zéro ou un un. $f$ est le nom de cette règle. $\{0,1\}$ est l’ensemble des deux valeurs ; $\{0,1\}^n$ désigne tous les choix de $n$ entrées. La flèche $\to$ indique « entrées vers résultat ». Le théorème dit que toute règle de ce type peut être construite avec OU et NON.

Commencez par deux entrées et quatre lignes. Une ligne vraie fournit une condition ; plusieurs lignes vraies fournissent plusieurs possibilités reliées par OU. Si toutes les lignes sont fausses, $\neg(x \lor \neg x)$ donne bien zéro pour les deux valeurs de $x$.

## Le problème

Une fonction $f$ donne une valeur $0$ ou $1$ pour chaque affectation de $x$, $y$, $z$. La question est de savoir si une assertion a exactement $f$ pour table de vérité. La réponse est oui, et la construction ci-dessous fonctionne toujours.

Pour deux entrées, le OU exclusif fournit un premier tableau à construire. Chaque ligne vraie possède une description qui ne vaut $1$ que sur cette ligne.

| x | y | f(x,y) | Description de la ligne vraie |
| --- | --- | --- | --- |
| 0 | 0 | 0 | aucune |
| 0 | 1 | 1 | $\neg x\land y$ |
| 1 | 0 | 1 | $x\land\neg y$ |
| 1 | 1 | 0 | aucune |

Essayez la ligne $11$ dans chacune des deux descriptions : elles valent toutes deux $0$. Les étiquettes et les valeurs, sans code couleur, relient le tableau à la construction suivante.

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

NON seul ne combine jamais deux entrées indépendantes : toute formule obtenue à partir d’une seule variable par des négations reste cette variable ou sa négation. Il ne peut donc pas exprimer $A \land B$. OU seul donne une disjonction de variables, qui ne peut pas exprimer $\neg A$.

## Reprendre la table des pages 32 à 35

Dans la table du PDF, la sortie vaut un exactement pour $010$ et $110$, dans l’ordre x, y, z. Chaque ligne donne une branche : $(\neg x \land y \land \neg z) \lor (x \land y \land \neg z)$. Dans les deux cas, y vaut un et z vaut zéro ; x est libre. Une formule plus courte est donc $y \land \neg z$, puis $\neg(\neg y \lor z)$ avec seulement OU et NON. Cette simplification et son explication sont originales.

## Pratique indépendante

Les exercices sélectionnés portent sur la lecture des lignes vraies, la conjonction d’une ligne, la jonction des lignes, l’élimination de $\land$, l’énoncé du théorème et la construction d’une table à trois variables.

La pratique interactive nécessite une connexion. Sa disponibilité dépend de la version sélectionnée et du statut de publication de cette leçon.

## À retenir

Décrivez chaque ligne vraie, reliez les descriptions par $\lor$, puis remplacez $\land$ avec de Morgan. Toute table de vérité est atteignable avec $\lor$ et $\neg$ seuls.

Texte et exemples originaux du projet. La couverture suit les pages 32 à 35 du PDF selon la carte du cours du dépôt ; les lignes vraies de l’exemple de la source sont expliquées avec une simplification originale.
