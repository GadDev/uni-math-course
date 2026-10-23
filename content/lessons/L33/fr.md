---
lessonId: L33
locale: fr
version: 3
status: extended
title: "Rastérisation et idée de Bresenham"
summary: "Échantillonner un segment et suivre un algorithme entier dans un octant explicite."
minutes: 45
objectives: [L33-O01, L33-O02, L33-O03, L33-O04, L33-O05, L33-O06]
prerequisites: [L31, L32]
sourcePages: [56, 57, 59, 60, 61, 62, 63]
---
# Rastérisation et idée de Bresenham

Les exercices emploient aussi la lettre majuscule $D=d$ pour cette même décision entière.

## Objectifs et prérequis

- Échantillonner par colonne.
- Choisir l’axe de parcours.
- Gérer les extrémités et la direction.
- Interpréter le test du milieu.
- Mettre à jour une décision entière.
- Respecter les limites de l’algorithme.

Prérequis : L31, L32. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-56" class="source-topic-marker"></span>

## Rastériser : choisir des pixels

Une droite contient une infinité de points ; une image ne propose que des cases. **Rastériser**, c’est choisir les pixels qui représentent un segment. Pour une pente modérée et un parcours de gauche à droite, calculer une hauteur par colonne puis arrondir au pixel le plus proche.

**PDF, pages 56–57.** Pour le segment de $(0,0)$ à $(5,2)$, la pente vaut $m=2/5=0{,}4$. Aux colonnes $0,1,2,3,4,5$, les hauteurs idéales sont $0;0{,}4;0{,}8;1{,}2;1{,}6;2$. Les hauteurs arrondies sont $0,0,1,1,2,2$. Il n’y a pas d’égalité à mi-chemin dans cet exemple.

**Convention supplémentaire pour les exemples d’arrondi :** à mi-chemin, choisir l’entier supérieur. Ce choix n’est pas celui de toutes les fonctions `round` ; ce n’est pas non plus la règle d’égalité de Bresenham ci-dessous.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-gentle.svg" alt="Segment de pente 0,4, six pixels aux hauteurs 0,0,1,1,2,2." width="440" height="360" loading="lazy" />
<figcaption>Une case par colonne.</figcaption>
</figure>
<p class="source-next"><a href="/fr/lessons/L33/#pdf-59">Suite du PDF : Corriger les trous →</a></p>

<span id="pdf-59" class="source-topic-marker"></span>

## Corriger les trous : parcourir le bon axe

**PDF, pages 57 et 59.** De $(0,0)$ à $(3,8)$, la pente vaut $m=8/3$. Un pixel par colonne ne donne que quatre pixels : le segment présente de grands sauts verticaux. Parcourir les lignes donne $x=(3/8)y$. Pour $y=0,1,2,3,4,5,6,7,8$, les abscisses arrondies sont $0,0,1,1,2,2,2,3,3$ selon la convention précédente.

Dans la notation écran du PDF, $v=v_1+m(u-u_1)$ se réécrit $u=u_1+(v-v_1)/m$ lorsque $m\ne0$. On parcourt les lignes si $|m|>1$. Pour une verticale, fixer la colonne et parcourir les lignes sans calculer une pente infinie. La page 58 est une illustration de jeu vidéo, pas une étape algébrique supplémentaire.

**À vérifier.** De $(4,1)$ à $(4,5)$, quelles cases choisir ? Garder la colonne $4$ et les lignes $1,2,3,4,5$, extrémités incluses.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-holes.svg" alt="Quatre pixels laissent de grands sauts." width="440" height="360" loading="lazy" />
<figcaption>Quatre pixels laissent de grands sauts.</figcaption>
</figure>
<figure class="teaching-figure">
<img src="/diagrams/droites/fr/raster-fixed.svg" alt="Un pixel par ligne représente mieux la pente forte." width="440" height="360" loading="lazy" />
<figcaption>Un pixel par ligne représente mieux la pente forte.</figcaption>
</figure>
<p class="source-next"><a href="/fr/lessons/L33/#pdf-60">Suite du PDF : L’idée de Bresenham →</a></p>

<span id="pdf-60" class="source-topic-marker"></span>

## L’idée de Bresenham : E, NE et le milieu

**PDF, page 60.** On utilise maintenant des axes cartésiens avec la verticale **vers le haut**. Le segment va de $(0,0)$ à $(u_2,v_2)$, où les coordonnées sont entières, $u_2>0$ et $0\le v_2\le u_2$. C’est un seul **octant**, une des huit zones de direction ; l’algorithme présenté ne couvre pas directement toutes les directions.

Depuis $(u,v)$, les candidats sont $E=(u+1,v)$ et $NE=(u+1,v+1)$. Leur milieu est $M=(u+1,v+1/2)$. Si le milieu est au-dessus de la droite ou sur elle, choisir E ; si la droite passe au-dessus du milieu, choisir NE. Les deux pixels sont aussi proches en cas d’égalité : **la convention de la page 62 choisit E**.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/bresenham.svg" alt="Pixel courant, candidats E et NE, milieu M et droite au-dessus du milieu." width="440" height="360" loading="lazy" />
<figcaption>Comparer au milieu avant de choisir.</figcaption>
</figure>
<p class="source-next"><a href="/fr/lessons/L33/#pdf-61">Suite du PDF : Adieu les arrondis ! →</a></p>

<span id="pdf-61" class="source-topic-marker"></span>

## Adieu les arrondis : un test entier

**PDF, page 61.** La droite a pour équation $v=(v_2/u_2)u$. Pour savoir si M est au-dessus ou sur la droite, tester $v+1/2\ge(v_2/u_2)(u+1)$. Multiplier par $2u_2>0$ conserve le sens de l’inégalité. Déplacer les termes donne $2v_2(u+1)-u_2(2v+1)\le0$.

Nommons cette expression $d=2v_2(u+1)-u_2(2v+1)$. Alors E correspond à $d\le0$ et NE à $d>0$. **Piège fréquent :** remplacer le second test par une inégalité large change les pixels à mi-chemin. Ce choix est permis dans une autre variante, mais ne reproduit pas ce PDF.

<p class="source-next"><a href="/fr/lessons/L33/#pdf-62">Suite du PDF : Bresenham : tout par incréments →</a></p>

<span id="pdf-62" class="source-topic-marker"></span>

## Bresenham : mettre à jour plutôt que recalculer

**PDF, page 62.** Au départ, $u=v=0$ donne $d=2v_2-u_2$. Après E, seule la colonne augmente : ajouter $2v_2$ à d. Après NE, colonne et ligne augmentent : ajouter $2v_2-2u_2$.

**Exemple supplémentaire,** $u_2=5$ et $v_2=2$ :

| Pixel courant | d avant le pas | Choix | Pixel suivant |
| --- | --- | --- | --- |
| $(0,0)$ | $-1$ | E | $(1,0)$ |
| $(1,0)$ | $3$ | NE | $(2,1)$ |
| $(2,1)$ | $-3$ | E | $(3,1)$ |
| $(3,1)$ | $1$ | NE | $(4,2)$ |
| $(4,2)$ | $-5$ | E | $(5,2)$ |

**À vérifier :** pour $u_2=2$, $v_2=1$, la décision initiale vaut $0$. Choisir E donne $(1,0)$, puis NE donne $(2,1)$. L’ancienne variante du chapitre choisissait $(1,1)$ ; la distance est la même, mais le choix discret diffère.

<p class="source-next"><a href="/fr/lessons/L33/#pdf-63">Suite du PDF : Adieu les multiplications →</a></p>

<span id="pdf-63" class="source-topic-marker"></span>

## Adieu les multiplications dans la boucle

**PDF, page 63 — transcription exécutable du pseudocode.** Cette fonction supplémentaire renvoie les pixels au lieu de les allumer. Elle exige des entiers dans l’octant annoncé.

```python
def raster(u2, v2):
    if not isinstance(u2, int) or not isinstance(v2, int):
        raise ValueError("integer endpoints required")
    if not (u2 > 0 and 0 <= v2 <= u2):
        raise ValueError("requires u2 > 0 and 0 <= v2 <= u2")
    twice_u = 2 * u2
    twice_v = 2 * v2
    d = twice_v - u2
    v = 0
    pixels = []
    for u in range(u2 + 1):
        pixels.append((u, v))
        if d > 0:
            v = v + 1
            d = d - twice_u
        d = d + twice_v
    return pixels
```

Les deux doubles sont calculés avant la boucle ; chaque pas utilise des additions et une comparaison d’entiers. Les deux extrémités sont incluses. Pour un segment réduit à un point, afficher ce point directement. Pour une pente négative ou forte, un parcours inversé ou un écran à verticale descendante, adapter le repère ou utiliser une version générale : ne pas appliquer cette fonction aveuglément.

<p class="source-next"><a href="/fr/lessons/L36/#pdf-65">Suite du PDF : Une découverte troublante →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
