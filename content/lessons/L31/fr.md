---
lessonId: L31
locale: fr
version: 2
status: extended
title: "Demi-plans et triangles"
summary: "Utiliser le signe d’une expression affine pour décrire et tester une région."
minutes: 27
objectives: [L31-O01, L31-O02, L31-O03, L31-O04, L31-O05, L31-O06]
prerequisites: [L24, L28, L30]
sourcePages: [50, 51, 60]
---
# Demi-plans et triangles

## Objectifs et prérequis

- Tester une inégalité de demi-plan.
- Distinguer bord inclus et exclu.
- Choisir un côté par un point test.
- Combiner plusieurs contraintes.
- Tester l’intérieur d’un triangle.
- Analyser signe et dégénérescence.

Prérequis : L24, L28, L30. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-50" class="source-topic-marker"></span>

## Les deux demi-plans : tester de quel côté se trouve un point

Une droite coupe le plan en deux régions. **Exemple du PDF, pages 50–51 :** la frontière est $y=2x+1$. Pour $(0,3)$, comparer $3$ à $2\cdot0+1=1$ donne $3>1$ : le point est au-dessus. Pour $(2,0)$, $0<2\cdot2+1=5$ : le point est en dessous.

La différence $f(x,y)=y-2x-1$ vaut respectivement $2$ et $-5$. Son signe suffit donc à distinguer les côtés. Une inégalité stricte exclut la frontière, dessinée en pointillés ; une inégalité large l’inclut, avec un trait continu. Pour une droite verticale, parler plutôt de gauche et de droite.

Dans le parcours du PDF, poursuivre avec [les pixels](../L32/#pdf-53) ; le [triangle rempli](#pdf-60) apparaît après la rastérisation.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/halfplanes.svg" alt="La droite pointillée y égale 2x plus 1 sépare une région hachurée au-dessus et une région non hachurée en dessous." width="440" height="360" loading="lazy" />
<figcaption>Les signes et les hachures identifient les côtés sans dépendre seulement des couleurs.</figcaption>
</figure>

## Une droite sépare le plan

Pour $f(x,y)=ax+by-c$ avec $(a,b)\ne(0,0)$, la frontière est $f=0$. Les deux demi-plans ouverts sont $f>0$ et $f<0$ ; les versions fermées incluent le bord. Le signe est constant d’un côté de la droite. Il n’est pas toujours pertinent de dire « au-dessus » : une verticale sépare gauche et droite.

## Exemple guidé : point test

Pour $x+2y\le6$, l’origine donne $0\le6$ : on retient le côté contenant l’origine et la frontière. Le point $(4,2)$ donne $8>6$ et est exclu. Un point de la frontière ne permet pas de choisir le côté, puisque sa valeur est zéro pour les deux inégalités larges.

<p class="source-next"><a href="/fr/lessons/L32/#pdf-53">Suite du PDF : L’écran est une grille de pixels →</a></p>

<span id="pdf-60" class="source-topic-marker"></span>

## Remplir un triangle : combiner trois tests

**Application du PDF, page 60 — calcul supplémentaire détaillé.** Un triangle non aplati est l’intersection de trois demi-plans : pour chaque côté, garder celui qui contient le sommet opposé. Cela transforme un dessin en trois tests algébriques.

Prenons $A=(0,0)$, $B=(4,0)$ et $C=(0,3)$. Les côtés horizontaux et verticaux donnent $y\ge0$ et $x\ge0$. Le troisième côté vérifie $3x+4y=12$, car il passe par $B$ et $C$. L’origine donne $0\le12$ : garder $3x+4y\le12$.

Le point $(1,1)$ satisfait les trois conditions, tandis que $(3,2)$ échoue au troisième test car $3\cdot3+4\cdot2=17>12$. Le bord est inclus ici. Pour remplir une image, tester le centre de chaque pixel ; ce sont les mêmes idées de demi-plan, appliquées à une grille.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/triangle.svg" alt="Triangle de sommets 0,0, 4,0 et 0,3, avec un point intérieur en 1,1 et un point extérieur en 3,2." width="440" height="360" loading="lazy" />
<figcaption>Un point doit satisfaire les trois contraintes à la fois.</figcaption>
</figure>

## Intersection de contraintes

La région $x\ge0$, $y\ge0$, $x+y\le4$ est un triangle fermé. Un point appartient à la région seulement s’il satisfait les trois tests. Vérifier une seule contrainte ne suffit pas. Les sommets sont $(0,0)$, $(4,0)$ et $(0,4)$ ; les arêtes sont incluses.

## Exemple guidé : triangle général

Pour trois sommets non alignés, chaque côté définit une droite. Pour chaque droite, garder le demi-plan fermé contenant le troisième sommet. Leur intersection est exactement le triangle rempli, bord compris. Avec $A=(0,0)$, $B=(4,0)$ et $C=(0,3)$, les contraintes sont $x\ge0$, $y\ge0$ et $3x+4y\le12$. Le point $(1,1)$ les satisfait toutes.

## Un test de même côté

Si $R$ est un point de référence hors de la droite, $P$ est du même côté ou sur le bord lorsque $f(P)f(R)\ge0$. Pour le même côté strict, utiliser $>0$. Multiplier une équation de frontière par un nombre négatif conserve la droite mais inverse les signes. Trois sommets alignés ne définissent pas un triangle d’intérieur non vide ; le test doit signaler ce cas avant le remplissage.

<p class="source-next"><a href="/fr/lessons/L36/#pdf-62">Suite du PDF : Une découverte troublante →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
