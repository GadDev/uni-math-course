---
lessonId: L23
locale: fr
version: 3
status: extended
title: "Fractions, puissances et racines"
summary: "Conserver le domaine des quotients et lire correctement puissances et racines."
minutes: 28
objectives: [L23-O01, L23-O02, L23-O03, L23-O04, L23-O05, L23-O06]
prerequisites: [L21, L22]
sourcePages: [13, 14]
---
# Fractions, puissances et racines

## Objectifs et prérequis

- Additionner des fractions.
- Multiplier et diviser.
- Utiliser les puissances.
- Calculer une racine réelle.
- Conserver le domaine.
- Analyser une simplification.

Prérequis : L21, L22. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-13" class="source-topic-marker"></span>

## Fractions : une unité commune avant d’additionner

Dans $a/b$, le **numérateur** $a$ compte des parts et le **dénominateur** $b$ décrit leur taille, avec $b\ne0$. Pour les parts positives du dessin, un demi et un tiers n’ont pas la même taille.

**Exemple du PDF, page 13.** $1/2+1/3=3/6+2/6=5/6$. On découpe chaque unité en six parts de même taille, puis on en compte cinq. Le résultat $2/5$ additionnerait des tailles de parts incompatibles.

**Exemple supplémentaire.** $3/4-1/6=9/12-2/12=7/12$. Pour multiplier, la règle est différente : $(a/b)(c/d)=ac/(bd)$ pour $b,d\ne0$. Par exemple $(2/3)(3/5)=6/15=2/5$. Pour diviser, multiplier par l’inverse : $(a/b)/(c/d)=ad/(bc)$ exige aussi $c\ne0$.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/fractions.svg" alt="Un demi représente trois sixièmes et un tiers deux sixièmes." width="440" height="360" loading="lazy" />
<figcaption>Des parts de même taille permettent l’addition.</figcaption>
</figure>

## Des écritures avec conditions

Le quotient $a/b$ de réels exige $b\ne0$. Pour $b,d\ne0$, $a/b+c/d=(ad+bc)/(bd)$. On construit une unité commune : additionner les dénominateurs confond les tailles des parts. Pour multiplier des fractions, on multiplie en revanche numérateurs et dénominateurs séparément. Une simplification supprime des facteurs communs non nuls, jamais des termes d’une somme.

## Exemple guidé : diviser deux fractions

Calculons $(3/4)/(9/8)$. Le diviseur n’est pas nul. Son inverse est $8/9$, donc $(3/4)(8/9)=2/3$. Vérification différente : multiplier le résultat par le diviseur donne $(2/3)(9/8)=3/4$. Cette opération retrouve le dividende. Vérifier ainsi un quotient est souvent plus sûr que répéter le même calcul.

<p class="source-next"><a href="/fr/lessons/L23/#pdf-14">Suite du PDF : Puissances et racines carrées →</a></p>

<span id="pdf-14" class="source-topic-marker"></span>

## Puissances et racines carrées : lire chaque règle

Un exposant entier positif compte des facteurs répétés : $a^3=a\cdot a\cdot a$. Pour des bases non nulles et des exposants entiers $m,n$, les règles du PDF sont :

| Règle | Exemple calculé |
| --- | --- |
| $a^ma^n=a^{m+n}$ | $2^3\cdot2^2=2^5=32$ |
| $(a^m)^n=a^{mn}$ | $(2^3)^2=2^6=64$ |
| $(ab)^n=a^nb^n$ | $(2\cdot3)^2=2^2\cdot3^2=36$ |
| $a^0=1$ | $7^0=1$ |
| $a^{-n}=1/a^n$ | $2^{-3}=1/8$ |

Pour un exposant entier strictement positif, la règle du produit vaut aussi pour une base nulle. **Application supplémentaire à la pratique :** $(a^2b)^3=(a^2)^3b^3=a^6b^3$ pour tous réels $a,b$. Le carré de $a+b$ exige en revanche les identités remarquables : la puissance ne se distribue pas sur une somme.

Pour $t\ge0$, $\sqrt t$ désigne la racine **non négative**. Ainsi $\sqrt{25}=5$ ; résoudre $z^2=25$ donne les deux solutions $z=-5$ et $z=5$. Pour tous réels $a$, $\sqrt{a^2}=|a|$ : c’est la distance de $a$ à zéro. La valeur absolue $|a|$ vaut $a$ si $a\ge0$ et $-a$ sinon.

La suite du PDF est [Identités remarquables](../L22/#pdf-15), puis [Résoudre une équation](../L24/#pdf-19).

## Lois des puissances

Les conditions du tableau comptent : le domaine non nul évite les inverses interdits ; on n’utilise pas $0^0$. Un exposant négatif désigne un inverse, pas un résultat forcément négatif. Ne confondez pas une somme d’exposants avec leur produit.

## Exemple guidé : racine et signe

Pour $a\ge0$, $\sqrt a$ est l’unique réel non négatif dont le carré est $a$. Ainsi $\sqrt{72}=6\sqrt2$ car $72=36\cdot2$. Pour tout réel $x$, $\sqrt{x^2}=|x|$ : à $x=-6$, la racine vaut $6$. La loi $\sqrt{ab}=\sqrt a\sqrt b$ est utilisée ici pour $a,b\ge0$. Elle ne se transpose pas à une addition.

## Une formule simplifiée garde ses restrictions

L’expression $(x^2-9)/(x-3)$ impose $x\ne3$. La factorisation donne $x+3$ sur ce domaine seulement. La formule simplifiée possède une valeur en $3$, mais l’expression initiale n’en possède pas. Une ligne « domaine » évite de rajouter par accident des valeurs interdites lorsque vous résolvez ensuite une équation.

<p class="source-next"><a href="/fr/lessons/L22/#pdf-15">Suite du PDF : Identités remarquables →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
