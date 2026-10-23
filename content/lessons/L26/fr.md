---
lessonId: L26
locale: fr
version: 3
status: extended
title: "La notation sigma, les sommes et les moyennes"
summary: "Lire la notation sigma, calculer une moyenne et comprendre les écarts centrés."
minutes: 28
objectives: [L26-O01, L26-O02, L26-O03, L26-O04, L26-O05, L26-O06]
prerequisites: [L21, L23]
sourcePages: [25, 26]
---
# La notation sigma, les sommes et les moyennes

## Objectifs et prérequis

- Développer une somme indicée.
- Compter les termes.
- Utiliser la linéarité.
- Calculer une moyenne.
- Centrer des données.
- Analyser les limites d’une somme.

Prérequis : L21, L23. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-25" class="source-topic-marker"></span>

## La notation sigma (Σ) : lire le symbole

La lettre grecque majuscule sigma, $\sum$, signifie **additionner les termes indiqués**. Ce n’est ni une nouvelle multiplication ni une inconnue à résoudre. Dans $\sum_{i=1}^n a_i$ :

| Morceau | Comment le lire |
| --- | --- |
| $i$ | L’indice : il compte les positions. |
| $i=1$ | On commence à la position 1. |
| $n$ | On termine à la position n, incluse. |
| $a_i$ | Le nombre à additionner à la position i. |

On lit « somme des a indice i, pour i allant de un à n ». Si $a_1=2$, $a_2=5$ et $a_3=8$, alors $\sum_{i=1}^3a_i=2+5+8=15$. Le petit $i$ de $a_i$ est un **indice**, pas un exposant : $a_2$ désigne le deuxième nombre, pas le carré de $a$.

**Les trois propriétés du PDF, pages 25–26.** Pour des listes de longueur $n\ge1$ et une constante réelle $c$ :

1. Addition terme à terme : $\sum_{i=1}^n(a_i+b_i)=\sum_{i=1}^n a_i+\sum_{i=1}^n b_i$.
2. Facteur constant : $\sum_{i=1}^n ca_i=c\sum_{i=1}^n a_i$.
3. Constante répétée : $\sum_{i=1}^n c=nc$.

**Exemples supplémentaires.** Pour les listes $(2,5)$ et $(1,3)$, la première règle donne $(2+1)+(5+3)=(2+5)+(1+3)=11$. La deuxième donne $3\cdot2+3\cdot5=3(2+5)=21$. La troisième donne $4+4+4=3\cdot4=12$. Ces règles viennent de l’addition et de la distributivité ; elles ne demandent pas de nouvelle recette mystérieuse.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/sigma.svg" alt="Les valeurs i égales à 1, 2 et 3 sélectionnent a1, a2 et a3, puis on additionne 2, 5 et 8." width="440" height="360" loading="lazy" />
<figcaption>L’indice parcourt une liste ; chaque valeur est ajoutée une fois.</figcaption>
</figure>

## Sigma est une instruction de répétition

Pour une suite finie de réels, $\sum_{i=1}^n a_i=a_1+\cdots+a_n$. L’indice est une variable locale : le renommer ne change pas la somme si toutes ses occurrences changent ensemble. De $i=r$ à $i=s$ avec $r\le s$, il existe $s-r+1$ termes. Ici les moyennes portent toujours sur un nombre entier $n\ge1$ de données.

## Exemple guidé : dérouler avant de simplifier

La somme $\sum_{i=2}^4(2i-1)$ vaut $3+5+7=15$. Il y a trois termes, pas quatre. Une vérification utilise la linéarité : $2\sum_{i=2}^4i-\sum_{i=2}^41=2(2+3+4)-3=15$. Le terme constant est répété autant de fois que l’indice prend de valeurs.

<p class="source-next"><a href="/fr/lessons/L26/#pdf-26">Suite du PDF : Moyenne et écarts centrés →</a></p>

<span id="pdf-26" class="source-topic-marker"></span>

## Moyenne et écarts : pourquoi la somme est nulle

La barre dans $\bar x$ se lit « x barre » et désigne la moyenne. On additionne les $n$ observations puis on partage par $n$ : $\bar x=\frac{x_1+\cdots+x_n}{n}$. Pour $2,5,8$, on calcule $(2+5+8)/3=5$. Les écarts $-3,0,3$ se compensent autour de cette valeur.

La preuve du PDF se déroule ainsi : $\sum_{i=1}^n(x_i-\bar x)=\sum_{i=1}^n x_i-\sum_{i=1}^n\bar x=n\bar x-n\bar x=0$. Dans la deuxième somme, $\bar x$ est constant : il apparaît exactement $n$ fois. Plus loin, $\sum_i$ sera une abréviation de cette somme sur toutes les observations, de $1$ à $n$.

**Exemple supplémentaire avec groupes.** Deux personnes ont une moyenne $10$, huit autres une moyenne $20$. La moyenne globale est $(2\cdot10+8\cdot20)/(2+8)=18$, pas $15$. Pondérer signifie compter la taille de chaque groupe. Si les deux moyennes étaient toutes deux $10$, le résultat serait $10$ malgré les tailles différentes : des tailles égales garantissent le raccourci, sans être nécessaires dans chaque cas particulier.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/mean.svg" alt="Les observations 2, 5 et 8 sont placées sur une droite ; les écarts de moins 3 et plus 3 se compensent autour de 5." width="440" height="360" loading="lazy" />
<figcaption>La moyenne 5 équilibre les écarts signés.</figcaption>
</figure>

## Moyenne et unités

La moyenne possède la même unité que les observations. Un échantillon vide n’a pas de moyenne définie par cette formule.

## Exemple guidé : les écarts à la moyenne

Pour les données $1,4,7$, la moyenne vaut $4$ et les écarts valent $-3,0,3$. Leur somme est nulle. Cette propriété ne signifie pas que chaque écart est nul. Des données dispersées peuvent avoir des écarts qui se compensent exactement.

## Somme des carrés et carré de la somme

Pour $1$ et $-1$, la somme vaut zéro, mais la somme des carrés vaut $2$. Le carré de la somme contient des termes croisés ; il ne s’obtient pas en élevant chaque terme séparément au carré. Cette distinction sera essentielle pour mesurer des erreurs de prédiction sans que leurs signes se compensent.

<p class="source-next"><a href="/fr/lessons/L27/#pdf-28">Suite du PDF : Le repère cartésien →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
