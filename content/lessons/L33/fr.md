---
lessonId: L33
locale: fr
version: 1
status: extended
title: "Rastérisation et idée de Bresenham"
summary: "Échantillonner un segment et suivre un algorithme entier dans un octant explicite."
minutes: 22
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

## Une droite continue, des pixels discrets

Rastériser consiste à choisir des pixels pour représenter un segment continu. Si $|m|\le1$, parcourir les colonnes entières et arrondir la hauteur au pixel le plus proche est naturel. Pour les exemples d’arrondi de cette leçon, une égalité à mi-chemin est arrondie vers l’entier supérieur. Ce choix explicite peut différer de celui d’un langage de programmation.

## Exemple guidé : pente forte

De $(0,0)$ à $(2,6)$, la pente vaut $3$. Un pixel par colonne produit seulement les hauteurs $0,3,6$, laissant des sauts. Parcourir les lignes donne plutôt $x=y/3$ pour chaque ordonnée entière de $0$ à $6$. Pour un segment vertical, fixer l’abscisse et parcourir les lignes évite toute division par un écart horizontal nul.

## Un octant volontairement limité

Pour comprendre Bresenham, revenons à un axe vertical vers le haut. Le segment va de $(0,0)$ à $(\Delta x,\Delta y)$, avec des entiers $\Delta x>0$ et $0\le\Delta y\le\Delta x$. Depuis $(x,y)$, les candidats sont $E=(x+1,y)$ et $NE=(x+1,y+1)$. Le milieu est $(x+1,y+1/2)$. Posons $D=2\Delta y(x+1)-2\Delta x y-\Delta x$. Si $D\ge0$, choisir NE ; sinon choisir E. Ici une égalité choisit NE.

## Exemple guidé : additions entières

Au départ, $D=2\Delta y-\Delta x$. Après E, ajouter $2\Delta y$ ; après NE, ajouter $2\Delta y-2\Delta x$. Pour $\Delta x=5$ et $\Delta y=2$, les décisions successives avant chaque pas sont $-1,3,-3,1,-5$. Les pixels sont $(0,0),(1,0),(2,1),(3,1),(4,2),(5,2)$. Après initialisation, seules des additions et comparaisons entières sont nécessaires.

## Direction et cas particuliers

Inclure les deux extrémités donne $\Delta x+1$ pixels dans cet octant. Une boucle croissante ne traite pas automatiquement un segment donné de droite à gauche : réordonner les extrémités ou adapter le pas. Les pentes fortes, négatives et l’axe écran descendant exigent des transformations ou une version générale. Le segment réduit à un point s’affiche directement. L’algorithme limité présenté ici ne prétend pas couvrir tous les octants.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
