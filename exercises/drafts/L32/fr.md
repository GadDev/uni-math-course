---
lessonId: L32
locale: fr
version: 1
status: extended
title: "Du repère aux pixels"
summary: "Construire et inverser une transformation vers un écran dont l’axe vertical descend."
minutes: 17
objectives: [L32-O01, L32-O02, L32-O03, L32-O04, L32-O05, L32-O06]
prerequisites: [L25, L27, L29]
sourcePages: [53, 54, 55]
---
# Du repère aux pixels

## Objectifs et prérequis

- Distinguer les conventions d’axes.
- Transformer un point.
- Inverser la transformation.
- Transformer les variations et pentes.
- Choisir échelle et origine.
- Analyser arrondi et visibilité.

Prérequis : L25, L27, L29. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

## Deux repères

Dans le plan mathématique, $y$ augmente vers le haut. Sur l’écran considéré ici, l’origine est en haut à gauche, $u$ augmente vers la droite et $v$ vers le bas. Les coordonnées continues peuvent être réelles ; les indices de pixels sont entiers. Une image de largeur $W$ et hauteur $H$ a des indices $0\le u<W$ et $0\le v<H$.

## Translation, échelle et signe

Avec $s_x>0$ et $s_y>0$ pixels par unité, utiliser $u=u_0+s_xx$ et $v=v_0-s_yy$. Le point mathématique origine s’affiche en $(u_0,v_0)$. Le signe moins inverse la verticale. Pour préserver les formes et les angles, choisir $s_x=s_y$ ; sinon un cercle apparaît elliptique.

## Exemple guidé : aller et retour

Prenons $u=300+40x$ et $v=200-40y$. Le point $(-2,3)$ devient $(220,80)$. Pour revenir, utiliser $x=(u-300)/40$ et $y=(200-v)/40$. Le pixel $(380,240)$ correspond donc à $(2,-1)$ avant toute incertitude liée à l’arrondi.

## Exemple guidé : transformer une droite

Avec les mêmes échelles, la droite $y=2x+1$ devient $v=760-2u$. En effet, remplacer $x=(u-300)/40$ dans $v=200-40(2x+1)$. La pente écran est négative : un trait montant vers la droite possède une ordonnée écran décroissante. En général, la pente devient $-(s_y/s_x)m$.

## Arrondir après le calcul

Pour afficher un point, calculer les coordonnées continues, puis appliquer une règle d’arrondi explicite. Arrondir au plus proche limite l’erreur à un demi-pixel par coordonnée ; les égalités à mi-chemin demandent une convention. Plusieurs points réels peuvent donner le même pixel : l’arrondi n’est pas inversible. Une coordonnée hors image reste hors image même si sa transformation algébrique est correcte.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
