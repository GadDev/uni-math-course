# Longueur moyenne et efficacité du code

*Chapitre 04 · Séquence T05 · Source : PDF pp. 11–16 · Brouillon non publié.*

## Objectifs et prérequis

Vous pourrez : (1) compter la longueur $|w_i|$ d'un mot code ; (2) utiliser une moyenne pondérée ; (3) calculer $L(c)$ ; (4) comparer deux propositions de codage ; (5) contrôler la possibilité de décodage ; (6) expliquer pourquoi une longueur petite ne prouve pas l'optimalité.

Prérequis : T03–T04 et calcul de fractions. La source a un alphabet fini $S=\{s_1,\ldots,s_n\}$ et des probabilités $p_i>0$ de somme $1$.

## 01 · Une moyenne qui tient compte des fréquences

**Définition du PDF, p. 12.** Si $c(s_i)=w_i$, la **longueur moyenne du codage**, en symboles de l'alphabet cible par symbole source, est :

$$L(c)=\sum_{i=1}^{n}p_i|w_i|.$$

Le terme $|w_i|$ est la longueur du mot code, et $p_i$ est sa fréquence attendue. Il ne s'agit **pas** de la moyenne simple des longueurs si les symboles ne sont pas équiprobables.

**Exemple pédagogique complémentaire.** Pour deux symboles de probabilités $(3/4,1/4)$ et mots codes de longueurs $(1,3)$, on obtient $L(c)=3/4\times1+1/4\times3=3/2$ bit par symbole source. La moyenne simple des longueurs aurait donné $2$, ce qui ne reflète pas les fréquences.

## 02 · Le calcul de la source, étape par étape

**PDF, pp. 14–15.** Prenons $S=\{x,y,z\}$, $p=(1/2,1/4,1/4)$ et deux codages :

| Symbole | $p_i$ | $c_1(s_i)$ | $|c_1(s_i)|$ | $c_2(s_i)$ | $|c_2(s_i)|$ |
| --- | --- | --- | --- | --- | --- |
| $x$ | $1/2$ | $001$ | $3$ | $0$ | $1$ |
| $y$ | $1/4$ | $01$ | $2$ | $01$ | $2$ |
| $z$ | $1/4$ | $0$ | $1$ | $011$ | $3$ |

Pour $c_1$ :

$$L(c_1)=\frac12\cdot3+\frac14\cdot2+\frac14\cdot1=\frac94=2{,}25.$$

Pour $c_2$ :

$$L(c_2)=\frac12\cdot1+\frac14\cdot2+\frac14\cdot3=\frac74=1{,}75.$$

Les deux valeurs sont en **bits par symbole source**. Ainsi $c_2$ a une moyenne inférieure de $1/2$ bit par symbole source. L'ordre des longueurs compte : le symbole le plus fréquent, $x$, reçoit un mot plus court dans $c_2$.

## 03 · Une réserve indispensable : décoder le code

Une comparaison de longueur ne suffit pas pour déclarer un code utilisable.

**Contrôle mathématique du PDF.** Comme vu en T03, $c_1(x)=001=c_1(zy)$ : $c_1$ est ambigu, donc impropre au décodage unique. En revanche, $c_2$ est à décodage unique bien qu'il ne soit pas préfixe. Les valeurs de $L$ calculées restent correctes, mais comparer des moyennes n'efface pas ce critère.

## 04 · Plus court ne veut pas dire le plus court possible

**Question du PDF, pp. 15–16.** En quel sens $L(c_2)$ est-il « bon » ? Pour cette comparaison particulière, il est plus petit que $L(c_1)$. **Cela ne prouve pas qu'il minimise toutes les longueurs possibles.**

**Contre-exemple pédagogique complémentaire.** Choisissons plutôt un code préfixe :

$$d(x)=0,\qquad d(y)=10,\qquad d(z)=11.$$

Il est à décodage unique et

$$L(d)=\frac12\cdot1+\frac14\cdot2+\frac14\cdot2=\frac32=1{,}5.$$

On a $L(d)<L(c_2)$. Il existe donc au moins un code admissible plus court en moyenne que $c_2$. Ce contre-exemple suffit à réfuter son optimalité. Prouver qu'un code est **globalement optimal** demande un argument supplémentaire, qui n'est pas fourni dans ces diapositives.

**Règle pratique du PDF, p. 16.** Donner des mots courts aux symboles fréquents et des mots plus longs aux moins fréquents est une idée directrice, à appliquer sans négliger la décodabilité.

## Vérifiez vos acquis — solutions incluses

1. **Question.** Probabilités $(1/2,1/2)$, longueurs $(1,3)$ : trouver $L$. **Réponse.** $L=2$.
2. **Question.** Pour $(3/4,1/4)$ et longueurs $(1,2)$ : trouver $L$. **Réponse.** $3/4+1/2=5/4=1{,}25$.
3. **Question.** Pourquoi $L(c_1)=9/4$ ne suffit-il pas à approuver $c_1$ ? **Réponse.** Le code est ambigu : $c_1(x)=c_1(zy)$.
4. **Question.** Une moyenne $1{,}75$ peut-elle être améliorée ici ? **Réponse.** Oui, le code $d$ atteint $1{,}5$.
5. **Question.** Le fait qu'une moyenne baisse garantit-il la sécurité du message ? **Réponse.** Non ; longueur, décodage et confidentialité sont des propriétés différentes.

**Suite.** T06 relie la quantité d'information aux probabilités.