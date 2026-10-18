---
lessonId: L29
locale: fr
version: 2
status: extended
title: "Pente et ordonnée à l’origine"
summary: "Interpréter les paramètres d’une droite affine et reconnaître les cas limites."
minutes: 30
objectives: [L29-O01, L29-O02, L29-O03, L29-O04, L29-O05, L29-O06]
prerequisites: [L28]
sourcePages: [37, 38, 39]
---
# Pente et ordonnée à l’origine

## Objectifs et prérequis

- Identifier la pente.
- Identifier l’ordonnée à l’origine.
- Évaluer une fonction affine.
- Relier pente et variation.
- Comparer des droites.
- Reconnaître les limites de la forme affine.

Prérequis : L28. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-37" class="source-topic-marker"></span>

## Tracer une droite : du tableau au repère

**Exemple du PDF, page 37.** Pour tracer $y=2x+1$, choisir quelques abscisses et calculer les ordonnées.

| $x$ | $-1$ | $0$ | $1$ | $2$ |
| --- | --- | --- | --- | --- |
| $y=2x+1$ | $-1$ | $1$ | $3$ | $5$ |

Par exemple, pour $x=-1$, $y=2(-1)+1=-1$. Placer ensuite les couples $(-1,-1)$, $(0,1)$, $(1,3)$ et $(2,5)$ sur les axes. Ils sont alignés. Deux points distincts fixent la droite ; un troisième point aide à détecter une erreur de calcul. Prolonger la ligne des deux côtés : les points du tableau ne sont pas ses seuls points.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/line-table.svg" alt="Droite y égale 2x plus 1 passant par les quatre points du tableau." width="440" height="360" loading="lazy" />
<figcaption>Une valeur de x produit une valeur de y, puis un point.</figcaption>
</figure>

## Deux paramètres, deux rôles

Toute droite non verticale s’écrit $y=mx+p$. La pente $m$ mesure la variation de $y$ pour une unité supplémentaire de $x$. L’ordonnée à l’origine $p$ est la valeur de $y$ lorsque $x=0$. Le mot affine autorise une constante non nulle ; une fonction linéaire au sens strict a $p=0$.

## Exemple guidé : lire puis calculer

Pour $y=-2x+5$, la pente vaut $-2$ et l’ordonnée à l’origine vaut $5$. À $x=3$, on obtient $y=-1$. Si l’abscisse augmente de $4$, l’ordonnée varie de $-8$, quelle que soit l’abscisse de départ. Une pente négative indique une décroissance.

<p class="source-next"><a href="/fr/lessons/L29/#pdf-38">Suite du PDF : Pente et ordonnée à l’origine →</a></p>

<span id="pdf-38" class="source-topic-marker"></span>

## Pente et ordonnée à l’origine : lire m et p

Dans $y=mx+p$, $p$ est l’ordonnée à l’origine, donc la droite passe par $(0,p)$. La pente est $m=\Delta y/\Delta x$ lorsque $\Delta x\ne0$. On lit « variation verticale divisée par variation horizontale ». Le dessin utilise une marche horizontale suivie d’une marche verticale pour rendre ce rapport visible.

**Exemple du PDF, page 38.** Un forfait coûte $10$ euros plus $2$ euros par Go : $y=2x+10$. Le coût fixe est $p=10$ euros et la pente $m=2$ euros par Go. Pour $x=3$, le prix vaut $16$ euros. Quatre Go supplémentaires coûtent $8$ euros de plus : $\Delta y=2\Delta x$.

**Exemple supplémentaire.** Pour $y=-x+3$, avancer d’une unité fait descendre d’une unité ; la pente vaut $-1$. Une pente nulle produit une horizontale, et une verticale ne possède pas de pente définie par ce quotient.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/slope.svg" alt="Droite y égale 2x plus 1 avec une marche horizontale de 1 et verticale de 2 et le point 0,1." width="440" height="360" loading="lazy" />
<figcaption>La pente compare les deux marches ; l’intercept repère le passage sur l’axe vertical.</figcaption>
</figure>

## Tracer et déplacer une droite

Pour tracer $y=(1/2)x+1$, placer $(0,1)$, puis avancer de $2$ unités et monter de $1$ unité pour obtenir $(2,2)$. Deux points distincts suffisent. Modifier seulement $p$ translate la droite verticalement. Modifier $m$ en gardant $p$ fixe conserve le passage par $(0,p)$ et change l’inclinaison.

## Exemple guidé : unités et conversion

Un coût est modélisé par $C(q)=3q+8$, où $q$ compte des objets et $C$ est en euros. La pente représente $3$ euros par objet et la constante un coût fixe de $8$ euros. Pour $q=4$, le coût est $20$ euros. Le modèle mathématique existe sur les réels, mais le contexte ne permet ici que des quantités entières non négatives.

<p class="source-next"><a href="/fr/lessons/L29/#pdf-39">Suite du PDF : L’effet de m et de p →</a></p>

<span id="pdf-39" class="source-topic-marker"></span>

## L’effet de m et de p : changer une chose à la fois

**Comparaisons du PDF, page 39.** Dans $y=mx+1$, garder $p=1$ et choisir $m=2,1,0,-1/2$ donne quatre droites passant par $(0,1)$. Elles montent, restent horizontales ou descendent selon le signe de $m$.

Dans $y=(7/5)x+p$, garder la pente $7/5$ et choisir $p=2,0,-2$ donne trois droites parallèles. Le déplacement est vertical ; la pente ne change pas. **Vérification supplémentaire :** les droites $y=3x-1$ et $y=3x+4$ restent distantes de $5$ unités verticales pour toute abscisse.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/vary-slope.svg" alt="Quatre droites de pentes 2, 1, 0 et moins un demi passant par 0,1." width="440" height="360" loading="lazy" />
<figcaption>Même p, différentes pentes m.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/vary-intercept.svg" alt="Trois droites parallèles de pente sept cinquièmes et d’intercepts 2, 0 et moins 2." width="440" height="360" loading="lazy" />
<figcaption>Même m, différents intercepts p.</figcaption>
</figure>

## Horizontales et verticales

Deux droites de même pente et de constantes différentes sont parallèles et distinctes. Une pente nulle donne une horizontale $y=p$. Une verticale $x=c$ n’est pas de la forme $y=mx+p$ : une seule abscisse correspond à plusieurs ordonnées. Sa pente est indéfinie, pas zéro. Pour $ax+by=c$ avec $b\ne0$, isoler $y$ donne $m=-a/b$ et $p=c/b$.

<p class="source-next"><a href="/fr/lessons/L30/#pdf-40">Suite du PDF : Une droite à partir de deux points →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
