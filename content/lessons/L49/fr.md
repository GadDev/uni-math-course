---
lessonId: L49
locale: fr
version: 1
status: extended
title: "L’algorithme de Huffman : compresser avec un arbre"
summary: "Introduction pas à pas aux arbres et aux codes de Huffman."
minutes: 30
objectives: [L49-O01, L49-O02, L49-O03, L49-O04, L49-O05, L49-O06]
prerequisites: [L48]
sourcePages: [14, 15, 16]
---
# Huffman : compresser avec un arbre binaire

**Extension pédagogique originale — hors du PDF source.** Le PDF de théorie de l'information (pp. 14–16) introduit la longueur moyenne et propose de raccourcir les mots codes des symboles fréquents, mais **il ne présente pas l'algorithme de Huffman**. Nous ajoutons ici cette méthode classique avec un exemple entièrement expliqué.

## Objectifs et prérequis

Objectifs : (1) expliquer le lien fréquence / longueur de code, (2) sélectionner les deux poids minimaux, (3) construire un arbre de Huffman, (4) lire et concaténer les mots codes, (5) calculer leur longueur moyenne, (6) justifier le décodage unique et expliquer les limites.

Prérequis : L44 à L48, fractions, moyennes pondérées et codes préfixes.

## 01 · L'idée simple

Un message contient souvent certains symboles plus fréquemment que d'autres. Si l'on donne un **mot code court** au symbole le plus fréquent, on économise des bits. L'algorithme de Huffman cherche à obtenir une **longueur moyenne minimale parmi les codes binaires préfixes** pour les fréquences choisies.

La règle se répète : **prendre les deux poids les plus faibles, les réunir sous un parent, puis remettre leur somme dans la liste**. La construction se termine lorsqu'il ne reste qu'un arbre.

## 02 · Exemple guidé : A, B, C et D

Observons les fréquences A : 8, B : 4, C : 2, D : 2, soit **16 occurrences**.

**Première fusion :** C (2) et D (2) donnent un nœud de poids 4.

**Deuxième fusion :** il reste A (8), B (4) et CD (4). B et CD donnent un nœud de poids 8.

**Troisième fusion :** A (8) et BCD (8) produisent la racine de poids 16.

En cas d'égalité, prenons d'abord le sous-arbre contenant la **plus petite lettre alphabétique**. Le premier sous-arbre va à gauche (bit 0) et l'autre à droite (bit 1).

~~~text
             (16)
          0 /    \ 1
          A:8    (8)
               0/   \1
               B:4  (4)
                   0/ \1
                   C:2 D:2
~~~

Les mots codes se lisent depuis la racine jusqu'aux feuilles :

| Symbole | Code | Bits |
| --- | --- | --- |
| A | 0 | 1 |
| B | 10 | 2 |
| C | 110 | 3 |
| D | 111 | 3 |

**Exemple résolu.** Pour le mot ABCD, concaténer les quatre codes sans séparateurs : 0 + 10 + 110 + 111 = **010110111**, soit 9 bits. Le décodeur suit l'arbre depuis la racine et revient à la racine chaque fois qu'il atteint une lettre.

## 03 · Mesurer la compression

Les probabilités sont 8/16, 4/16, 2/16 et 2/16. La longueur moyenne en bits **par symbole source** est :

$$
L(c)=\sum_i p_i\,|c(s_i)|
$$

$$
L(c)=\frac{8\times1+4\times2+2\times3+2\times3}{16}=\frac{28}{16}=\frac74=1{,}75
$$

Un code à longueur fixe pour quatre lettres exige 2 bits par lettre. Ici, le code de Huffman demande en moyenne **1,75 bit**, soit un gain moyen de **0,25 bit par lettre**. La moyenne peut être fractionnaire même si chaque mot code contient un nombre entier de bits.

## 04 · Pourquoi le décodage est-il unique ?

Les symboles se trouvent uniquement **aux feuilles**. Aucun chemin vers une feuille ne peut être le début d'un chemin vers une autre feuille. Les codes sont donc **préfixes**, ce qui permet de retrouver sans ambiguïté tout message concaténé. Rappel : il existe aussi des codes à décodage unique non préfixes (L45).

## 05 · Conditions et erreurs fréquentes

- **Remettre chaque nœud fusionné** parmi les candidats : sélectionner seulement les deux lettres initiales les moins fréquentes est une erreur.
- Les **égalités de fréquences** peuvent créer plusieurs arbres optimaux. La convention de départage rend notre exemple reproductible, sans rendre tous les autres arbres incorrects.
- Le décodeur doit connaître le **même arbre** : le coût de le transmettre n'est pas inclus dans la moyenne.
- Huffman n'est ni un **chiffrement**, ni un système de **correction d'erreurs**. Les fréquences observées ne sont pas une promesse sur les prochains messages.
- La garantie d'optimalité s'applique au **codage binaire préfixe des symboles individuels** pour les probabilités choisies ; pas à toutes les techniques de compression imaginables.

## 06 · Mini-évaluation corrigée

1. Quels poids fusionnent d'abord ? **Réponse :** 2 et 2, pour obtenir 4.
2. Pourquoi le nouveau nœud pèse-t-il 4 ? **Réponse :** ses feuilles ont au total deux plus deux occurrences.
3. Quel mot code reçoit C dans **notre arbre** ? **Réponse :** 110, trois bits.
4. Encoder AAAB. **Réponse :** 0 + 0 + 0 + 10 = 00010 (5 bits).
5. Peut-on ajouter le code 01 à une nouvelle lettre en conservant A=0 ? **Réponse :** non ; 0 serait son préfixe.
6. Les bits d'un arbre avec des égalités peuvent-ils être différents ? **Réponse :** oui, mais les longueurs moyennes optimales sont égales.

**Référence complémentaire (en dehors du PDF fourni)** : cours de Stanford sur le codage de Huffman, https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/24-huffman/huffman_background.html.
