---
lessonId: L22
locale: fr
version: 2
status: extended
title: "Développer et factoriser"
summary: "Changer la forme d’une expression sans changer sa valeur."
minutes: 30
objectives: [L22-O01, L22-O02, L22-O03, L22-O04, L22-O05, L22-O06]
prerequisites: [L21]
sourcePages: [7, 8, 9, 10, 11, 12, 15, 16, 17, 18]
---
# Développer et factoriser

## Objectifs et prérequis

- Distribuer un facteur.
- Factoriser un facteur commun.
- Développer un produit.
- Utiliser les identités remarquables.
- Choisir une forme utile.
- Réfuter une fausse identité.

Prérequis : L21. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-7" class="source-topic-marker"></span>

## Développer et factoriser : les exemples du PDF

Un **terme** est un morceau séparé par une addition ou une soustraction. Un **facteur** est un morceau multiplié par un autre. Dans $3x+6$, les termes sont $3x$ et $6$ ; dans $3(x+2)$, les facteurs sont $3$ et $x+2$. Développer fait apparaître les termes ; factoriser fait apparaître les facteurs.

**PDF, pages 7–12 — calculs repris et expliqués.**

- Développer : $3(x-2)-2(x+1)=3x-6-2x-2=x-8$. Le facteur $-2$ multiplie $x$ **et** $1$.
- Factoriser : $6x^2-9x=3x(2x-3)$. Chaque terme contient le facteur $3x$ ; redévelopper permet de contrôler.
- Retirer un groupe : $5-(2x-3)=5-2x+3=8-2x$.

La double distributivité est $(a+b)(c+d)=ac+ad+bc+bd$. Chaque terme du premier groupe rencontre chaque terme du second. **Exemple supplémentaire :** $(x+2)(x+3)=x^2+3x+2x+6=x^2+5x+6$. Le coefficient $5$ vient de $3+2$.

Pour suivre strictement le PDF, lire ensuite les [fractions, puissances et racines](../L23/#pdf-13), puis revenir aux [identités remarquables](#pdf-15).

## Une valeur, plusieurs formes

Pour $a,b,c\in\mathbb{R}$, $a(b+c)=ab+ac$. Développer lit cette égalité vers la droite ; factoriser la lit vers la gauche. Le facteur multiplie chaque terme avec son signe. Une identité vaut pour toutes les valeurs annoncées, pas seulement pour un exemple favorable. Gardez cette distinction lorsque vous utilisez une calculatrice pour contrôler un résultat.

## Exemple guidé : développer et réduire

Pour $x\in\mathbb{R}$, $5(x-2)-3(x+4)=5x-10-3x-12=2x-22$. Réunissez les termes de même nature. À $x=2$, les deux expressions donnent $-18$ : c’est un contrôle local. La justification générale reste la distributivité, qui fonctionne pour tout réel. Un signe moins devant un groupe modifie tous ses termes, pas seulement le premier.

<p class="source-next"><a href="/fr/lessons/L23/#pdf-13">Suite du PDF : Fractions →</a></p>

<span id="pdf-15" class="source-topic-marker"></span>

## Identités remarquables : comprendre les trois formules

Une **identité** est une égalité vraie pour toutes les valeurs de son domaine. Pour tous réels $a,b$ :

| Forme à reconnaître | Développement | Point d’attention |
| --- | --- | --- |
| $(a+b)^2$ | $a^2+2ab+b^2$ | Deux produits croisés $ab$. |
| $(a-b)^2$ | $a^2-2ab+b^2$ | Le dernier carré reste positif ou nul. |
| $(a+b)(a-b)$ | $a^2-b^2$ | Les produits croisés s’annulent. |

Déroulons la première : $(a+b)^2=(a+b)(a+b)=a^2+ab+ba+b^2$. Comme $ab=ba$, les deux morceaux donnent $2ab$. Le dessin utilise des longueurs positives ; l’identité algébrique reste vraie pour tous réels. Pour la seconde, remplacer $b$ par $-b$. Pour la troisième, développer donne $a^2-ab+ab-b^2$.

**Exemples du PDF, pages 15–18.** $101^2=(100+1)^2=10000+200+1=10201$. Pour $(2x-3)^2$, identifier $a=2x$ et $b=3$ : $(2x)^2-2(2x)(3)+3^2=4x^2-12x+9$.

**Deux exemples supplémentaires.** $49^2=(50-1)^2=2500-100+1=2401$. Et $103\cdot97=(100+3)(100-3)=10000-9=9991$. À chaque fois, nommer les deux morceaux avant de choisir une formule.

**Vérification rapide.** $(x+4)^2$ contient-il $8x$ ? Oui : $2\cdot x\cdot4=8x$. Écrire seulement $x^2+16$ efface les deux rectangles du dessin.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/identity-area.svg" alt="Carré de côté a plus b partagé en deux carrés et deux rectangles ab." width="440" height="360" loading="lazy" />
<figcaption>Les quatre aires s’additionnent : a², ab, ab et b².</figcaption>
</figure>

## Reconstruire les identités

Les produits donnent $(a+b)^2=a^2+2ab+b^2$, $(a-b)^2=a^2-2ab+b^2$ et $(a-b)(a+b)=a^2-b^2$. Le terme croisé est présent deux fois dans le carré ; les termes croisés s’annulent dans le produit des conjugués. Pour éviter les erreurs de mémoire, écrivez le carré comme un produit avant de réduire.

## Exemple guidé : factoriser en deux temps

Pour $x\in\mathbb{R}$, $3x^3-12x=3x(x^2-4)=3x(x-2)(x+2)$. Extrayez d’abord le facteur commun, puis reconnaissez la différence de carrés. Redévelopper vérifie le résultat. La forme factorisée rend les zéros visibles sans diviser par un facteur qui pourrait justement être nul.

## Choisir une forme pour une question

Une forme développée facilite l’addition. Une forme factorisée facilite l’étude des zéros. Une forme carrée peut révéler un signe : $x^2+10x+25=(x+5)^2\ge0$. Pour réfuter $(a+b)^2=a^2+b^2$, choisissez par exemple $a=2$ et $b=3$ ; le terme croisé manquant explique l’écart. Un seul contre-exemple réfute une identité universelle.

<p class="source-next"><a href="/fr/lessons/L24/#pdf-19">Suite du PDF : Résoudre une équation →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
