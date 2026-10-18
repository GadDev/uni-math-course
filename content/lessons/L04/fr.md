---
lessonId: L04
locale: fr
version: 3
status: extended
title: "Équivalence sémantique et lois booléennes"
summary: "Vérifier que deux formules ont la même table de vérité, appliquer les lois booléennes, reconnaître les tautologies et les contradictions, et réfuter une équivalence par une seule ligne."
minutes: 30
objectives: [L04-O01, L04-O02, L04-O03, L04-O04, L04-O05, L04-O06]
prerequisites: [L01, L02, L03]
sourcePages: [15, 16, 17, 18, 19]
---
# Équivalence sémantique et lois booléennes

## Votre objectif

À la fin de cette leçon, vous savez vérifier que deux formules sont sémantiquement équivalentes, appliquer les lois booléennes, reconnaître les tautologies et les contradictions, et réfuter une équivalence par une seule ligne.

**Prérequis :** L01 à L03 : valeurs de vérité, connecteurs $\land$, $\lor$, $\neg$, et tables de vérité complètes.

## Équivalence : la même table de vérité

Deux assertions $A$ et $B$ sont **sémantiquement équivalentes**, ce qu’on écrit $A \equiv B$, lorsqu’elles ont la même table de vérité : elles prennent la même valeur pour **toute** affectation. La logique ne peut pas distinguer deux assertions équivalentes.

## L’équivalence n’est pas un connecteur

$\equiv$ est une affirmation sur deux formules, et non un opérateur à l’intérieur d’une formule. L’énoncé $A \equiv B$ est vrai exactement lorsque les deux tables de vérité coïncident.

Ne le confondez pas avec $\Leftrightarrow$, la biconditionnelle étudiée dans la leçon L07. La formule $A \Leftrightarrow B$ est une assertion construite à partir de $A$ et $B$ ; l’énoncé $A \equiv B$ compare deux formules.

## Exemple guidé : vérifier une loi de distributivité

Vérifions que $A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$. Calculez les deux membres sur les huit affectations.

| A | B | C | A ∨ (B ∧ C) | (A ∨ B) ∧ (A ∨ C) |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Les deux colonnes coïncident sur chaque ligne : l’équivalence est donc vraie. Cette vérification utilise des tables de vérité ; dériver la loi à partir des autres est une méthode différente, qui n’est pas demandée ici.

Ce travail guidé, dont la solution est visible, n’est pas une réponse indépendante pour mesurer la maîtrise.

## Algèbre de Boole : réécrire sans changer le sens

Une loi booléenne est un outil pour remplacer une formule par une autre qui donne toujours le même résultat. Pensez à deux recettes différentes qui produisent la même colonne finale. Ici $A$, $B$ et $C$ peuvent aussi désigner des formules entières : une loi reste valable quand on remplace chaque occurrence d’une même lettre par la même formule.

Une affectation fixe une valeur pour chaque variable. Un calcul sur une seule affectation illustre une loi ; il ne la prouve pas. Pour la vérifier par table, il faut comparer toutes les lignes. Les explications et exemples ci-dessous sont des développements originaux du projet.

### Commutativité : changer l’ordre

$A \lor B \equiv B \lor A$ et $A \land B \equiv B \land A$.

« Avoir un billet ET une invitation » demande la même chose que « avoir une invitation ET un billet ». OU fonctionne aussi dans les deux sens : seul compte le nombre de parties vraies, pas leur place. Si $A = 0$ et $B = 1$, les deux disjonctions valent $1$ et les deux conjonctions valent $0$.

### Associativité : changer le groupement

$A \lor (B \lor C) \equiv (A \lor B) \lor C$ et $A \land (B \land C) \equiv (A \land B) \land C$.

Avec seulement des OU, les deux écritures demandent au moins une partie vraie ; avec seulement des ET, elles demandent les trois parties vraies. Les parenthèses changent l’ordre du calcul, pas le résultat.

Cette règle ne permet pas de déplacer librement des parenthèses dans une formule mixte. Avec $A = 0$, $B = 1$, $C = 1$, $A \land (B \lor C)$ vaut $0$, mais $(A \land B) \lor C$ vaut $1$.

### Distributivité : développer et factoriser

![Arbre de A ET (B OU C) : le ET principal relie A au groupe B OU C ; B et C sont les deux entrées du OU.](/diagrams/formula-grouping.svg)

$A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$.

Fixons une personne et un événement. Soit $A$ : « elle est inscrite », $B$ : « elle a un billet papier » et $C$ : « elle a un billet numérique ». « Inscrite ET munie d’un billet papier OU numérique » se précise en $A \land (B \lor C)$. Cela veut dire « inscrite avec billet papier, OU inscrite avec billet numérique ». La condition $A$ accompagne chaque possibilité.

La seconde distributivité est tout aussi valable :

$A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)$.

Pourquoi ? Si $A$ est vraie, les deux membres sont vrais. Si $A$ est fausse, les deux membres demandent que $B$ et $C$ soient vraies. C’est une justification qui couvre tous les cas, sans analogie trompeuse avec l’addition ordinaire.

Les deux lois se lisent aussi de droite à gauche : c’est **factoriser**. Par exemple $(A \land B) \lor (A \land C)$ devient $A \land (B \lor C)$. On conserve les deux branches ; supprimer $A \land C$ ferait perdre une possibilité.

### Double négation : annuler deux inversions

$\neg\neg A \equiv A$.

NON inverse une valeur, puis le second NON l’inverse à nouveau : $0$ devient $1$, puis $0$ ; $1$ devient $0$, puis $1$. En logique classique, « il est faux que je n’ai pas de billet » dit donc « j’ai un billet ». Il faut que les deux négations portent bien sur la même assertion.

### Tiers exclu et non-contradiction : toujours vrai ou toujours faux

$A \lor \neg A \equiv \top$ et $A \land \neg A \equiv \neg\top$.

$\top$ se lit « toujours vrai ». $\neg\top$ se lit « négation de la constante vraie » et désigne la constante toujours fausse : la négation porte sur la constante vraie. On la note aussi parfois $\bot$ ; nous gardons $\neg\top$ comme dans la source.

Dans le cadre classique, pour une assertion précise, soit elle est vraie, soit sa négation l’est : c’est le **tiers exclu**. Elles ne sont jamais vraies ensemble : c’est la **non-contradiction**. Ignorer si une assertion est vraie ne lui donne pas une troisième valeur.

| A | ¬A | A ∨ ¬A | A ∧ ¬A |
| --- | --- | --- | --- |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |

### De Morgan : nier un groupe entier

$\neg(A \lor B) \equiv \neg A \land \neg B$ et $\neg(A \land B) \equiv \neg A \lor \neg B$.

Avec $A$ : « j’ai un billet » et $B$ : « j’ai une invitation », nier « j’ai un billet OU une invitation » signifie n’avoir **ni billet ni invitation**. Les deux doivent manquer. Nier « j’ai un billet ET une invitation » signifie qu’au moins une des deux choses manque ; il n’est pas nécessaire que les deux manquent.

Méthode : repérez le connecteur à l’intérieur des parenthèses, échangez ET et OU, puis niez chaque partie. Pour nier un groupe plus grand, avancez une paire de parenthèses à la fois.

| A | B | ¬(A ∧ B) | ¬A ∨ ¬B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |

### Exemple de réécriture en deux étapes

Partons de $\neg(\neg A \lor B)$. De Morgan donne $\neg\neg A \land \neg B$. La double négation donne ensuite $A \land \neg B$. Chaque étape conserve la table de vérité : écrivez le nom de la loi à côté de chaque transformation pour pouvoir la vérifier.

### Petite pause : essayez avant de lire

1. Réordonnez $B \land A$ pour commencer par $A$.
2. Factorisez $(C \land A) \lor (C \land B)$.
3. Niez $A \lor \neg B$ sans laisser de négation devant un groupe.

Corrections : $A \land B$ (commutativité) ; $C \land (A \lor B)$ (distributivité en sens inverse) ; $\neg A \land B$ (de Morgan puis double négation). Ce sont des essais guidés avec solutions visibles ; les exercices suivants permettent de réessayer avec d’autres formules.

## Tautologies et contradictions

Une **tautologie** est une assertion vraie pour toute affectation. Une **contradiction** est fausse pour toute affectation. La constante $\top$ est une tautologie, et $\neg\top$ est une contradiction.

- $A \lor \neg A$ est une tautologie.
- $A \land \neg A$ est une contradiction.

## Piège : nier chaque partie

$\neg (A \land B)$ n’est pas équivalent à $\neg A \land \neg B$. Une seule ligne suffit à le réfuter : avec $A = 1$ et $B = 0$, le membre de gauche vaut $\neg 0 = 1$, tandis que celui de droite vaut $0 \land 1 = 0$.

Une seule ligne différente suffit à réfuter une équivalence. Pour l’établir, il faut l’accord sur toutes les lignes.

## Développer la preuve proposée page 19

La source propose de démontrer $A \land (B \lor C) \equiv (A \land B) \lor (A \land C)$ sans fournir la preuve. Voici une justification originale par cas.

Si $A = 0$, le membre de gauche vaut zéro et les deux conjonctions du membre de droite valent zéro. Si $A = 1$, le membre de gauche vaut $B \lor C$ et le membre de droite aussi. A n’a que ces deux valeurs : la justification couvre toutes les affectations de B et C. Elle complète le travail de la source sans attribuer cette solution au professeur.

## Pratique indépendante

Les quatorze exercices de cette leçon portent sur la définition de l’équivalence, la loi de de Morgan, la vérification par table de vérité, la reconnaissance d’une tautologie, les lois du tiers exclu et de la non-contradiction, et la réfutation d’une équivalence par une seule ligne. Huit nouveaux exercices travaillent aussi la commutativité, l’associativité, la double négation, les deux distributivités et la factorisation.

La pratique interactive nécessite une connexion. Sa disponibilité dépend de la version sélectionnée et du statut de publication de cette leçon.

## À retenir

Deux formules sont équivalentes lorsque leurs tables de vérité sont identiques. Les lois booléennes donnent de telles équivalences ; une seule ligne différente en réfute une ; les tautologies et les contradictions sont les formules toujours vraies ou toujours fausses.

Texte et exemples originaux du projet. La couverture suit les pages 15 à 19 du PDF selon la carte du cours du dépôt. La justification par cas de l’objectif de la page 19 et les vérifications complétées sont des développements originaux du projet.
