---
lessonId: L33
locale: fr
version: 2
status: extended
title: "Rastérisation et idée de Bresenham"
summary: "Échantillonner un segment et suivre un algorithme entier dans un octant explicite."
minutes: 35
objectives: [L33-O01, L33-O02, L33-O03, L33-O04, L33-O05, L33-O06]
prerequisites: [L31, L32]
sourcePages: [56, 57, 58, 59]
---
# Rastérisation et idée de Bresenham

## Objectifs et prérequis

- Échantillonner par colonne.
- Choisir l’axe de parcours.
- Gérer les extrémités et la direction.
- Interpréter le test du milieu.
- Mettre à jour une décision entière.
- Respecter les limites de l’algorithme.

Prérequis : L31, L32. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-56" class="source-topic-marker"></span>

## Rastériser : quels pixels allumer ?

Une droite mathématique contient une infinité de points ; une grille n’offre que des cases. **Rastériser** signifie choisir les pixels qui représentent le segment. Pour un segment de gauche à droite de pente modérée, le PDF parcourt les colonnes et arrondit la hauteur.

**Exemple du PDF, pages 56–57, pente $m=0{,}4$.** Entre $(0,0)$ et $(5,2)$, les hauteurs exactes aux colonnes $0,1,2,3,4,5$ valent $0;0{,}4;0{,}8;1{,}2;1{,}6;2$. L’arrondi au plus proche sélectionne $0,0,1,1,2,2$. Le trait continu et les centres des pixels ne coïncident pas toujours : c’est une approximation assumée.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-gentle.svg" alt="Segment de pente 0,4 et pixels choisis aux hauteurs 0,0,1,1,2,2." width="440" height="360" loading="lazy" />
<figcaption>Un pixel est choisi par colonne pour cette pente modérée.</figcaption>
</figure>

## Une droite continue, des pixels discrets

Rastériser consiste à choisir des pixels pour représenter un segment continu. Si $|m|\le1$, parcourir les colonnes entières et arrondir la hauteur au pixel le plus proche est naturel. Pour les exemples d’arrondi de cette leçon, une égalité à mi-chemin est arrondie vers l’entier supérieur. Ce choix explicite peut différer de celui d’un langage de programmation.

## Exemple guidé : pente forte

De $(0,0)$ à $(2,6)$, la pente vaut $3$. Un pixel par colonne produit seulement les hauteurs $0,3,6$, laissant des sauts. Parcourir les lignes donne plutôt $x=y/3$ pour chaque ordonnée entière de $0$ à $6$. Pour un segment vertical, fixer l’abscisse et parcourir les lignes évite toute division par un écart horizontal nul.

<p class="source-next"><a href="/fr/lessons/L33/#pdf-58">Suite du PDF : Corriger les trous →</a></p>

<span id="pdf-58" class="source-topic-marker"></span>

## Corriger les trous : parcourir le bon axe

**Exemple du PDF, pages 57–58, pente $m=8/3$.** Entre $(0,0)$ et $(3,8)$, un pixel par colonne laisse de grands sauts verticaux. Parcourir chaque ligne donne $x=(3/8)y$. Pour $y=0,1,2,3,4,5,6,7,8$, les abscisses arrondies sont $0,0,1,1,2,2,2,3,3$ avec la convention d’arrondi de la leçon.

La règle pratique est de parcourir l’axe du plus grand déplacement : colonnes si $|\Delta x|\ge|\Delta y|$, lignes sinon. Cela ne dispense pas de traiter la direction et les segments verticaux. Le dessin utilise ici une verticale vers le haut pour comparer les méthodes ; sur écran, il faut appliquer la convention descendante de la leçon précédente.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-holes.svg" alt="Segment de 0,0 à 3,8 avec seulement quatre pixels, laissant des trous." width="440" height="360" loading="lazy" />
<figcaption>Parcours par colonnes : trop peu de pixels.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-fixed.svg" alt="Même segment avec un pixel par ligne pour éviter les grands sauts." width="440" height="360" loading="lazy" />
<figcaption>Parcours par lignes : le segment est mieux représenté.</figcaption>
</figure>

<p class="source-next"><a href="/fr/lessons/L33/#pdf-59">Suite du PDF : L’idée de Bresenham →</a></p>

<span id="pdf-59" class="source-topic-marker"></span>

## L’idée de Bresenham : choisir entre E et NE

**PDF, page 59 — explication développée.** Un **octant** est l’une des huit zones de direction autour d’un point. On étudie seulement les segments qui vont vers la droite et montent sans être plus raides que la diagonale : $\Delta x>0$ et $0\le\Delta y\le\Delta x$. L’axe vertical pointe vers le haut.

Depuis le pixel courant, deux cases sont candidates : E, à droite ; NE, à droite et en haut. Le milieu entre leurs centres permet de choisir la plus proche de la droite. Si la droite passe au-dessus ou sur ce milieu, choisir NE ; sinon E. Une égalité choisit NE dans ce cours.

Le test entier ci-dessous évite de recalculer et d’arrondir une hauteur à chaque pas. **Exemple supplémentaire détaillé**, $\Delta x=5$ et $\Delta y=2$ :

| Pixel courant | Décision D avant le pas | Choix | Pixel suivant |
| --- | --- | --- | --- |
| $(0,0)$ | $-1$ | E | $(1,0)$ |
| $(1,0)$ | $3$ | NE | $(2,1)$ |
| $(2,1)$ | $-3$ | E | $(3,1)$ |
| $(3,1)$ | $1$ | NE | $(4,2)$ |
| $(4,2)$ | $-5$ | E | $(5,2)$ |

Lire d’abord ce tableau et le dessin ; la formule qui suit explique comment produire la colonne D avec seulement des additions.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/bresenham.svg" alt="Pixel courant, candidats E et NE et milieu M entre leurs centres ; la droite passe au-dessus du milieu." width="440" height="360" loading="lazy" />
<figcaption>Comparer la droite au milieu permet de choisir entre deux pixels.</figcaption>
</figure>

## Un octant volontairement limité

Pour comprendre Bresenham, revenons à un axe vertical vers le haut. Le segment va de $(0,0)$ à $(\Delta x,\Delta y)$, avec des entiers $\Delta x>0$ et $0\le\Delta y\le\Delta x$. Depuis $(x,y)$, les candidats sont $E=(x+1,y)$ et $NE=(x+1,y+1)$. Le milieu est $(x+1,y+1/2)$. Posons $D=2\Delta y(x+1)-2\Delta x y-\Delta x$. Si $D\ge0$, choisir NE ; sinon choisir E. Ici une égalité choisit NE.

## Exemple guidé : additions entières

Au départ, $D=2\Delta y-\Delta x$. Après E, ajouter $2\Delta y$ ; après NE, ajouter $2\Delta y-2\Delta x$. Pour $\Delta x=5$ et $\Delta y=2$, les décisions successives avant chaque pas sont $-1,3,-3,1,-5$. Les pixels sont $(0,0),(1,0),(2,1),(3,1),(4,2),(5,2)$. Après initialisation, seules des additions et comparaisons entières sont nécessaires.

## Direction et cas particuliers

Inclure les deux extrémités donne $\Delta x+1$ pixels dans cet octant. Une boucle croissante ne traite pas automatiquement un segment donné de droite à gauche : réordonner les extrémités ou adapter le pas. Les pentes fortes, négatives et l’axe écran descendant exigent des transformations ou une version générale. Le segment réduit à un point s’affiche directement. L’algorithme limité présenté ici ne prétend pas couvrir tous les octants.

<p class="source-next"><a href="/fr/lessons/L31/#pdf-60">Suite du PDF : Remplir un triangle →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
