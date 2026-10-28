---
lessonId: L05
locale: fr
version: 5
status: pilot
title: "L’implication : une promesse avec un seul échec"
summary: "Lire A ⇒ B, distinguer les conditions nécessaires et suffisantes, et trouver un contre-exemple."
minutes: 18
objectives: [L05-O01, L05-O02, L05-O03, L05-O04, L05-O05, L05-O06]
prerequisites: [L01, L02, L03, L04]
sourcePages: [20, 21, 22, 23]
---
# L’implication : une promesse avec un seul échec

## Votre objectif

À la fin de cette leçon, vous saurez lire $A \Rightarrow B$, compléter sa table de vérité, distinguer « nécessaire » de « suffisant » et reconnaître un **contre-exemple** : un cas qui suffit à montrer qu’une règle générale est fausse.

**Prérequis :** une assertion est un énoncé vrai ou faux (<a href="/fr/lessons/L01/">L01</a>) ; ET, OU inclusif et NON combinent ces valeurs (<a href="/fr/lessons/L02/">L02</a>). La lecture d’une table vient de <a href="/fr/lessons/L03/">L03</a> ; l’équivalence et les lois de de Morgan, utilisées plus bas, viennent de <a href="/fr/lessons/L04/">L04</a>.

## Une promesse très précise

Imaginez cette règle : « Si une carte est rouge, elle porte un tampon. » Chaque carte a une seule couleur uniforme : rouge ou bleue, jamais les deux.

Fixons d’abord **une carte** :

- $A$ : « la carte est rouge ».
- $B$ : « la carte porte un tampon ».

La règle échoue pour une **carte rouge sans tampon**. Pour une carte bleue, elle n’exige rien : avec ou sans tampon, cette carte ne contredit pas la règle.

![Quatre cartes : bleue sans tampon, bleue avec tampon et rouge avec tampon ne contredisent pas la règle ; rouge sans tampon est le seul échec.](/diagrams/logic/L05-cards-fr.svg)

Les quatre cartes ci-dessus représentent toutes les combinaisons possibles. Le mot « rouge » et le symbole du tampon permettent aussi de lire le dessin sans distinguer les couleurs.

**Une carte et une règle générale.** Pour une carte fixée, on évalue une implication. Dire « toutes les cartes rouges portent un tampon » exige que cette implication soit vraie pour chaque carte. Une seule carte rouge sans tampon réfute cette règle générale ; une carte conforme ne suffit pas à la prouver.

L’implication mathématique relie des valeurs de vérité. Elle ne décrit pas, à elle seule, une cause ou une chronologie : la couleur ne fabrique pas le tampon.

## Définition et lecture

$A \Rightarrow B$ se lit « A implique B » ou « si A, alors B ». $A$ est l’**antécédent** (la condition) ; $B$ est le **conséquent** (ce que la condition exige).

**Définition :** l’implication est fausse exactement lorsque A est vraie et B est fausse. Elle est vraie dans les trois autres cas.

Pourquoi la déclarer vraie quand A est fausse ? Ici, « vraie » signifie que cette combinaison ne constitue pas l’échec interdit. Cela ne signifie ni que B est vraie, ni qu’A et B ont un lien causal. On parle parfois de **vérité par vacuité** : la condition n’est pas remplie, donc aucune exigence n’est violée.

Dans ce tableau, 0 signifie faux et 1 signifie vrai.

| A | B | ¬A | A ⇒ B |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 |

Lisez d’abord la ligne A = 1, B = 0 : c’est le seul échec. Puis les deux premières : A est fausse, donc aucun échec de la règle n’est possible pour ces combinaisons.

On retrouve exactement cette table avec :
$$
(A \Rightarrow B) \equiv (\neg A \lor B).
$$

$\neg A$ signifie « NON A » ; $\lor$ signifie « OU inclusif » (au moins l’une des deux assertions est vraie). Ainsi, « pas rouge OU avec tampon » exclut uniquement la carte rouge sans tampon.

$\equiv$ signifie que les deux formules ont la même valeur pour **tous les choix de valeurs de A et B** : ce sont les quatre lignes du tableau, aussi appelées affectations. $\Rightarrow$ construit une implication ; $\equiv$ compare deux formules. Ces symboles n’ont donc pas le même rôle.

## Exemple guidé : la carte bleue sans tampon

Avant de calculer, demandez-vous : « La condition rouge est-elle remplie ? » Non. La règle ne demande donc rien à cette carte.

1. La carte n’est pas rouge : $A = 0$.
2. Elle n’a pas de tampon : $B = 0$.
3. Donc $\neg A = 1$.
4. On calcule $\neg A \lor B = 1 \lor 0 = 1$.

Cette carte ne contredit pas la règle. **Elle ne prouve pas non plus que toutes les cartes rouges portent un tampon.** Une observation et une preuve générale sont deux choses différentes.

**À vous de prédire :** gardez la carte sans tampon et changez seulement sa couleur. Quand l’implication devient-elle fausse ?

<div class="implication-lab" data-logic-lab="cards">
<fieldset><legend>Explorer les quatre cartes</legend>
<div class="implication-controls">
<label>Couleur — valeur de A<select data-a disabled><option value="0" selected>Bleue : A = 0</option><option value="1">Rouge : A = 1</option></select></label>
<label>Tampon — valeur de B<select data-b disabled><option value="0" selected>Sans tampon : B = 0</option><option value="1">Avec tampon : B = 1</option></select></label>
</div></fieldset>
<div aria-live="polite" aria-atomic="true">
<p class="implication-card" data-card data-colour="blue">Carte bleue, sans tampon.</p>
<p data-calculation>¬A ∨ B = 1 ∨ 0 = 1</p>
<p data-reason>A est fausse : cette carte ne contredit pas la règle. Cela ne prouve pas la règle pour toutes les cartes.</p>
</div>
<p>La ligne correspondant à votre carte est encadrée dans la table ci-dessus. Les deux listes fonctionnent aussi au clavier.</p>
<noscript><p>Activez JavaScript pour manipuler les cartes. Le dessin et la table ci-dessus présentent déjà les quatre cas.</p></noscript>
</div>

Ce travail guidé, dont la solution est visible, sert à explorer ; il ne mesure pas votre maîtrise de façon indépendante.

## Nécessaire et suffisant

Dans ce cours, $\mathbb{N} = \{0,1,2,\ldots\}$ désigne les entiers naturels, zéro compris. Fixons un entier naturel n et prenons :

- $A$ : « n > 10 ».
- $B$ : « n > 5 ».

Si n est plus grand que 10, il est forcément plus grand que 5. Cela vaut pour **tout** entier naturel : dépasser 10 suffit à garantir qu’on dépasse 5.

Quand $A \Rightarrow B$ est vraie :

- A est une condition **suffisante** pour B : savoir A vraie suffit pour conclure B vraie.
- B est une condition **nécessaire** pour A : B doit être vraie pour qu’A puisse être vraie. Mais B seule ne garantit pas A.

Ainsi, être supérieur à 5 est nécessaire pour être supérieur à 10. Ce n’est pas suffisant : **8** est supérieur à 5, mais pas à 10. La **réciproque**, c’est-à-dire l’implication dans l’autre sens, serait ici « si n > 5, alors n > 10 » ; 8 la réfute.

**À vous de prédire :** que se passe-t-il à n = 5 puis à n = 10 ? Trouvez tous les entiers qui réfutent la réciproque avant de déplacer le curseur.

<div class="implication-lab" data-number-lab>
<fieldset><legend>Explorer les seuils 5 et 10</legend>
<label for="l05-number">Entier naturel n (de 0 à 15) : <output for="l05-number">8</output></label>
<input id="l05-number" type="range" min="0" max="15" step="1" value="8" disabled>
</fieldset>
<svg viewBox="0 0 510 175" role="img" aria-label="Deux rangées d’entiers : B commence à 6, A commence à 11 ; 5 et 10 sont des seuils exclus. Le trait vertical repère n.">
<g stroke="currentColor" fill="none" stroke-width="2"><path d="M170 55H480l-8 -5m8 5l-8 5M310 105H480l-8 -5m8 5l-8 5"/>
<circle cx="170" cy="55" r="6" fill="var(--card)"/><circle cx="310" cy="105" r="6" fill="var(--card)"/>
<line data-marker x1="254" x2="254" y1="25" y2="125" stroke-dasharray="4 4" stroke-width="3"/>
</g><g fill="currentColor" font-size="20" font-family="sans-serif"><text x="30" y="28">B : n &gt; 5</text><text x="30" y="106">A : n &gt; 10</text><text x="25" y="158">0</text><text x="165" y="158">5</text><text x="300" y="158">10</text><text x="440" y="158">15</text></g><circle cx="198" cy="55" r="3" fill="currentColor"/><circle cx="226" cy="55" r="3" fill="currentColor"/><circle cx="254" cy="55" r="3" fill="currentColor"/><circle cx="282" cy="55" r="3" fill="currentColor"/><circle cx="310" cy="55" r="3" fill="currentColor"/><circle cx="338" cy="55" r="3" fill="currentColor"/><circle cx="366" cy="55" r="3" fill="currentColor"/><circle cx="394" cy="55" r="3" fill="currentColor"/><circle cx="422" cy="55" r="3" fill="currentColor"/><circle cx="450" cy="55" r="3" fill="currentColor"/><circle cx="338" cy="105" r="3" fill="currentColor"/><circle cx="366" cy="105" r="3" fill="currentColor"/><circle cx="394" cy="105" r="3" fill="currentColor"/><circle cx="422" cy="105" r="3" fill="currentColor"/><circle cx="450" cy="105" r="3" fill="currentColor"/></svg>
<p data-number-result aria-live="polite" aria-atomic="true">n = 8 : A (« n > 10 ») : faux ; B (« n > 5 ») : vrai. A ⇒ B vaut 1 ; B ⇒ A vaut 0. Ce nombre réfute la réciproque.</p>
<noscript><p>Activez JavaScript pour déplacer n. Le dessin reste lisible avec n = 8.</p></noscript>
</div>

Le curseur montre seulement les entiers de 0 à 15 ; les flèches prolongent les deux conditions au-delà. Les seuils 5 et 10 sont exclus par le signe « > ». Pour tous les entiers naturels, les contre-exemples à la réciproque sont exactement **6, 7, 8, 9 et 10**. Le dessin aide à le voir ; l’argument général est : il faut dépasser 5 sans dépasser 10.

Pour revoir les familles de nombres : <a href="/fr/lessons/L10/">L10</a> et le <a href="/fr/numbers/">guide visuel</a>.

## Nier une implication

Pour **une carte fixée**, nier l’implication revient à décrire son seul échec : la condition est remplie ET le résultat exigé manque.
$$
\neg(A \Rightarrow B) \equiv A \land \neg B.
$$

$\land$ signifie « ET » ; les parenthèses indiquent que NON porte sur **toute** l’implication. Avec les cartes : « la carte est rouge ET elle n’a pas de tampon ».

Pour nier la règle portant sur **toutes** les cartes, on dit : « il existe au moins une carte rouge sans tampon ». On ne dit pas que toutes les cartes sont rouges et sans tampon.

Voici le calcul, une étape à la fois. Essayez de prévoir l’étape suivante avant de l’ouvrir.

<div class="implication-lab">
<details><summary>1 · Réécrire l’implication</summary><p>Remplacer « si A, alors B » par « NON A OU B » : ¬(A ⇒ B) ≡ ¬(¬A ∨ B).</p></details>
<details><summary>2 · Nier le OU</summary><p>Pour qu’un OU soit faux, ses deux parties doivent être fausses (loi de de Morgan, L04) : ¬(¬A ∨ B) ≡ ¬¬A ∧ ¬B.</p></details>
<details><summary>3 · Supprimer la double négation</summary><p>NON NON A a la même valeur que A : ¬¬A ∧ ¬B ≡ A ∧ ¬B. On retrouve la carte rouge sans tampon.</p></details>
</div>

**Piège :** nier les deux termes pour écrire $\neg A \Rightarrow \neg B$ conserve une implication. Cela ne nie pas l’implication entière.

**À vous de prédire :** pour A = B = 1, la négation et l’implication entre les termes niés ont-elles la même valeur ? Testez ensuite les trois autres cas.

<div class="implication-lab" data-logic-lab="negation">
<fieldset><legend>Comparer les négations</legend>
<div class="implication-controls">
<label>Valeur de A<select data-a disabled><option value="0">0</option><option value="1" selected>1</option></select></label>
<label>Valeur de B<select data-b disabled><option value="0">0</option><option value="1" selected>1</option></select></label>
</div></fieldset>
<div aria-live="polite" aria-atomic="true">
<p data-implication>A ⇒ B : vrai (1)</p>
<p data-negation>¬(A ⇒ B) : faux (0)</p>
<p data-failure>A ∧ ¬B = 1 ∧ 0 = 0</p>
<p data-operands>¬A ⇒ ¬B : vrai (1)</p>
<p data-comparison>Les deux dernières valeurs diffèrent : ces formules ne sont donc pas équivalentes.</p>
</div>
<noscript><p>Activez JavaScript pour changer A et B. Le cas A = B = 1 suffit déjà à distinguer les deux formules.</p></noscript>
</div>

## Attention au piège

Un contre-exemple à $A \Rightarrow B$ exige **A vraie et B fausse**. Une condition fausse ne suffit jamais. De même, A implique B ne garantit pas que B implique A : le nombre 8 l’a montré. La leçon <a href="/fr/lessons/L06/">L06</a> approfondit la réciproque et la contraposée.

## Une pause pour vérifier

Sans regarder le tableau, expliquez pourquoi une carte bleue avec tampon ne contredit pas la règle. Puis complétez : « Pour réfuter une implication, je cherche une condition ___ et une conclusion ___. »

<details><summary>Voir une réponse expliquée</summary><p>Pour la carte bleue, A est fausse : la règle ne lui impose aucun tampon. Pour réfuter une implication, il faut une condition vraie et une conclusion fausse.</p></details>

## Pratique indépendante

Les exercices sélectionnés du pilote couvrent le cas faux, la table de vérité, les conditions nécessaires/suffisantes, la négation, une règle en langage courant et un contre-exemple numérique.

Les explorations dans cette page sont libres d’accès et ne sont pas enregistrées. La pratique avec correction et progression privée est disponible avec un compte lorsque la connexion est configurée : utilisez « S’exercer » après la leçon.

## À retenir

L’implication est une promesse avec un seul échec : **la condition est satisfaite, mais le résultat promis ne l’est pas**. A suffit à garantir B ; B est nécessaire pour A. Pour nier l’implication, décrivez son échec : A ET NON B.

Texte, dessins et exemples originaux du projet. Couverture alignée sur les pages PDF 20–23 du programme décrit dans le dépôt ; aucun exercice du professeur n’est reproduit.
