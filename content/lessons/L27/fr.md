---
lessonId: L27
locale: fr
version: 2
status: extended
title: "Repères et distances"
summary: "Placer des points et mesurer une distance dans un repère orthonormé."
minutes: 25
objectives: [L27-O01, L27-O02, L27-O03, L27-O04, L27-O05, L27-O06]
prerequisites: [L23]
sourcePages: [28, 29, 30]
---
# Repères et distances

## Objectifs et prérequis

- Lire des coordonnées.
- Calculer un déplacement.
- Calculer une distance.
- Utiliser un milieu.
- Décrire un lieu de points.
- Vérifier les unités du repère.

Prérequis : L23. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-28" class="source-topic-marker"></span>

## Le repère cartésien : placer et lire un point

Un **repère** donne une adresse à chaque point. L’origine $O=(0,0)$ est le croisement des deux axes. Une graduation marque une unité. On lit d’abord l’abscisse $x$ sur l’axe horizontal, puis l’ordonnée $y$ sur l’axe vertical : l’ordre compte.

**Points du PDF, page 28.** Pour placer $A=(3,2)$, partir de l’origine, avancer de trois unités à droite puis monter de deux. Pour $B=(2,3)$, les déplacements sont différents : les deux points ne sont pas confondus. $C=(-2,1)$ est à gauche et au-dessus ; $D=(-1,-2)$ est à gauche et en dessous. Le plan $\mathbb R^2$ est l’ensemble de tous les couples de réels.

**Exemple supplémentaire.** Le point $(0,-3)$ est sur l’axe vertical car son déplacement horizontal est nul. Le point $(4,0)$ est sur l’axe horizontal. Pour relire un point sur un dessin, projeter vers les deux axes avant d’écrire le couple.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/coordinates.svg" alt="Repère gradué avec A en 3,2, B en 2,3, C en moins 2,1 et D en moins 1,moins 2." width="440" height="360" loading="lazy" />
<figcaption>L’abscisse se lit horizontalement, puis l’ordonnée verticalement.</figcaption>
</figure>

## Deux nombres ordonnés

Un point $A=(x_A,y_A)$ possède une abscisse horizontale et une ordonnée verticale. Dans le repère mathématique usuel, x augmente vers la droite et y augmente vers le haut. Le point $(-2,3)$ se situe donc deux unités à gauche et trois au-dessus de l’origine. Échanger les coordonnées change généralement le point.

<p class="source-next"><a href="/fr/lessons/L27/#pdf-29">Suite du PDF : Distance entre deux points →</a></p>

<span id="pdf-29" class="source-topic-marker"></span>

## Distance entre deux points : voir le triangle rectangle

**Exemple du PDF, pages 29–30.** Dans un repère orthonormé, prendre $A=(1,1)$ et $B=(4,5)$. Le mot **orthonormé** signifie ici deux axes perpendiculaires avec la même unité de longueur. Le déplacement horizontal vaut $4-1=3$ et le déplacement vertical $5-1=4$.

Le segment $AB$ est l’hypoténuse d’un triangle rectangle. Pythagore donne $d^2=3^2+4^2=25$, puis $d=\sqrt{25}=5$. On choisit la racine non négative parce qu’il s’agit d’une longueur.

La formule générale est $d(A,B)=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$. Le symbole $\Delta$ se lit « delta » et note une variation : $\Delta x=x_B-x_A$. **Exemple supplémentaire :** entre $(2,-1)$ et $(2,4)$, $\Delta x=0$ et $\Delta y=5$ ; la distance vaut $5$, comme le montre le segment vertical.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/distance.svg" alt="Triangle rectangle entre A en 1,1 et B en 4,5, de côtés 3 et 4 et d’hypoténuse 5." width="440" height="360" loading="lazy" />
<figcaption>La formule de distance est Pythagore appliqué aux deux déplacements.</figcaption>
</figure>

## Déplacement et longueur

De $A$ vers $B$, les écarts sont $\Delta x=x_B-x_A$ et $\Delta y=y_B-y_A$. Ils peuvent être négatifs. Dans un repère orthonormé, les axes sont perpendiculaires et une unité représente la même longueur sur les deux axes. Alors $d(A,B)=\sqrt{(\Delta x)^2+(\Delta y)^2}$. Une distance est positive ou nulle ; elle vaut zéro exactement lorsque les deux points coïncident.

## Exemple guidé : un triangle rectangle

Pour $A=(-1,2)$ et $B=(2,6)$, le déplacement vaut $(3,4)$. Pythagore donne $d(A,B)=\sqrt{9+16}=5$. Dans l’autre sens, le déplacement devient $(-3,-4)$, mais la distance reste $5$. Les signes disparaissent au carré, pas avant de calculer les écarts.

## Exemple guidé : milieu et lieu

Le milieu de $A=(0,2)$ et $B=(6,4)$ est $M=(3,3)$ : on moyenne séparément les coordonnées. Les points à distance $2$ de l’origine vérifient $x^2+y^2=4$ ; ils forment un cercle. Ceux à distance au plus $2$ forment le disque $x^2+y^2\le4$. La frontière seule et la région intérieure sont deux objets différents.

## Attention aux échelles

Des axes perpendiculaires ne suffisent pas pour utiliser directement la formule précédente. Si une unité horizontale représente $2$ mètres et une unité verticale $1$ mètre, un écart de coordonnées $(3,4)$ représente un déplacement physique $(6,4)$ mètres, de longueur $\sqrt{52}$ mètres. Un dessin étiré à l’écran ne change pas les coordonnées mathématiques, mais ses longueurs visuelles peuvent être trompeuses.

<p class="source-next"><a href="/fr/lessons/L28/#pdf-31">Suite du PDF : Équation cartésienne →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
