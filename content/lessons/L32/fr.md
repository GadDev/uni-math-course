---
lessonId: L32
locale: fr
version: 2
status: extended
title: "Du repère aux pixels"
summary: "Construire et inverser une transformation vers un écran dont l’axe vertical descend."
minutes: 25
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

<span id="pdf-53" class="source-topic-marker"></span>

## L’écran est une grille de pixels

Un **pixel** est une case d’une image. Dans la convention du PDF, les colonnes $u$ vont vers la droite et les lignes $v$ vers le bas ; la première colonne et la première ligne portent le numéro zéro.

**Exemple du PDF, page 53.** Le pixel $(5,2)$ est dans la sixième colonne et la troisième ligne. L’ordre reste horizontal puis vertical, mais la verticale descend. Dans une image $8\times6$, les colonnes vont de $0$ à $7$ et les lignes de $0$ à $5$ : le pixel $(8,6)$ n’existe pas dans cette image.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/pixels.svg" alt="Grille de huit colonnes et six lignes, origine en haut à gauche, case 5,2 marquée par une croix." width="440" height="360" loading="lazy" />
<figcaption>Les indices commencent à zéro ; v augmente vers le bas.</figcaption>
</figure>

## Deux repères

Dans le plan mathématique, $y$ augmente vers le haut. Sur l’écran considéré ici, l’origine est en haut à gauche, $u$ augmente vers la droite et $v$ vers le bas. Les coordonnées continues peuvent être réelles ; les indices de pixels sont entiers. Une image de largeur $W$ et hauteur $H$ a des indices $0\le u<W$ et $0\le v<H$.

<p class="source-next"><a href="/fr/lessons/L32/#pdf-54">Suite du PDF : Du repère à l’écran : centrer →</a></p>

<span id="pdf-54" class="source-topic-marker"></span>

## Du repère mathématique au repère écran : centrer

**PDF, page 54.** Dans une fenêtre de $800\times600$ pixels, choisir l’origine au centre donne $(u_0,v_0)=(400,300)$. Avec une unité pour un pixel, $u=400+x$ et $v=300-y$. Le moins est nécessaire : un point plus haut doit avoir un numéro de ligne plus petit.

**Exemple supplémentaire.** $(x,y)=(20,10)$ devient $(u,v)=(420,290)$. L’origine mathématique $(0,0)$ devient $(400,300)$ ; elle ne devient pas le coin supérieur gauche.

## Translation, échelle et signe

Avec $s_x>0$ et $s_y>0$ pixels par unité, utiliser $u=u_0+s_xx$ et $v=v_0-s_yy$. Le point mathématique origine s’affiche en $(u_0,v_0)$. Le signe moins inverse la verticale. Pour préserver les formes et les angles, choisir $s_x=s_y$ ; sinon un cercle apparaît elliptique.

<p class="source-next"><a href="/fr/lessons/L32/#pdf-55">Suite du PDF : Changer d’unité →</a></p>

<span id="pdf-55" class="source-topic-marker"></span>

## Changer d’unité : 50 pixels pour une unité

**Exemple du PDF, page 55.** Garder le centre et choisir $50$ pixels par unité donne $u=400+50x$ et $v=300-50y$. Pour $(2,1)$ : $u=400+100=500$ et $v=300-50=250$.

**Exemple supplémentaire.** Pour $(-3,-2)$, obtenir $(250,400)$. Pour inverser, soustraire le déplacement du centre puis diviser par l’échelle : $x=(u-400)/50$ et $y=(300-v)/50$. Revenir de $(500,250)$ donne bien $(2,1)$. Cette inversion concerne les coordonnées continues, avant l’arrondi en pixels.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/screen.svg" alt="Fenêtre écran avec origine en haut à gauche, centre en 400,300 et point mathématique 2,1 affiché en 500,250." width="440" height="360" loading="lazy" />
<figcaption>Monter dans le plan diminue la coordonnée v de l’écran.</figcaption>
</figure>

## Exemple guidé : aller et retour

Prenons $u=300+40x$ et $v=200-40y$. Le point $(-2,3)$ devient $(220,80)$. Pour revenir, utiliser $x=(u-300)/40$ et $y=(200-v)/40$. Le pixel $(380,240)$ correspond donc à $(2,-1)$ avant toute incertitude liée à l’arrondi.

## Exemple guidé : transformer une droite

Avec les mêmes échelles, la droite $y=2x+1$ devient $v=760-2u$. En effet, remplacer $x=(u-300)/40$ dans $v=200-40(2x+1)$. La pente écran est négative : un trait montant vers la droite possède une ordonnée écran décroissante. En général, la pente devient $-(s_y/s_x)m$.

## Arrondir après le calcul

Pour afficher un point, calculer les coordonnées continues, puis appliquer une règle d’arrondi explicite. Arrondir au plus proche limite l’erreur à un demi-pixel par coordonnée ; les égalités à mi-chemin demandent une convention. Plusieurs points réels peuvent donner le même pixel : l’arrondi n’est pas inversible. Une coordonnée hors image reste hors image même si sa transformation algébrique est correcte.

<p class="source-next"><a href="/fr/lessons/L33/#pdf-56">Suite du PDF : Rastériser : quels pixels allumer ? →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
