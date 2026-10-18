---
lessonId: L30
locale: fr
version: 2
status: extended
title: "Deux points et intersections"
summary: "Construire une droite et distinguer intersection unique, parallélisme et coïncidence."
minutes: 30
objectives: [L30-O01, L30-O02, L30-O03, L30-O04, L30-O05, L30-O06]
prerequisites: [L25, L29]
sourcePages: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
---
# Deux points et intersections

## Objectifs et prérequis

- Calculer une pente entre deux points.
- Trouver une équation de droite.
- Résoudre une intersection.
- Distinguer les trois cas.
- Traiter les verticales.
- Analyser un paramètre ou un contexte.

Prérequis : L25, L29. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-40" class="source-topic-marker"></span>

## Deux points : retrouver la conversion Celsius–Fahrenheit

**Exemple du PDF, pages 40–43.** On suppose la conversion affine. Les deux observations sont $(C,F)=(0,32)$ et $(100,212)$. La variation de Fahrenheit vaut $212-32=180$ pour une variation de Celsius de $100-0=100$.

1. Pente : $m=(212-32)/(100-0)=1{,}8$.
2. Intercept : $p=32-1{,}8\cdot0=32$.
3. Conversion : $F=1{,}8C+32$.
4. Pour $F=50$, résoudre $50=1{,}8C+32$ donne $C=(50-32)/1{,}8=10$.

Les lettres changent, pas la méthode : l’entrée $C$ remplace $x$ et la sortie $F$ remplace $y$. **Exemple supplémentaire :** à $C=20$, la formule donne $F=68$. Remplacer ce résultat dans la formule inverse retrouve $20$.

## Deux points distincts

Pour $A=(x_1,y_1)$ et $B=(x_2,y_2)$ avec $x_1\ne x_2$, la pente est $m=(y_2-y_1)/(x_2-x_1)$. Ensuite $p=y_1-mx_1$. Inverser l’ordre des deux points change les deux signes du quotient et conserve la pente. Si les abscisses sont égales et les points distincts, la droite est verticale. Un seul point répété ne détermine pas une droite unique.

## Exemple guidé : construire puis vérifier

Pour $(1,4)$ et $(3,10)$, la pente vaut $(10-4)/(3-1)=3$ et la constante vaut $4-3\cdot1=1$. La droite est $y=3x+1$. Vérifier les deux points est rapide et détecte une erreur de signe. La forme $y-y_1=m(x-x_1)$ fournit aussi l’équation sans calculer immédiatement la constante.

<p class="source-next"><a href="/fr/lessons/L30/#pdf-44">Suite du PDF : Intersection de deux droites →</a></p>

<span id="pdf-44" class="source-topic-marker"></span>

## Intersection : la même température dans les deux unités

**Exemple du PDF, pages 44–45.** On cherche un nombre dont l’expression en Celsius et Fahrenheit est la même : cela impose $F=C$ en plus de $F=1{,}8C+32$. Remplacer $F$ par $C$ donne $C=1{,}8C+32$, puis $-0{,}8C=32$ et $C=-40$. L’intersection est $(C,F)=(-40,-40)$.

Sur le dessin, l’intersection est le point commun aux deux droites. L’algèbre en fournit les coordonnées exactes. Il faut donner les deux coordonnées et vérifier les deux équations, pas seulement résoudre pour la première inconnue.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/temperature.svg" alt="Les droites F égale C et F égale 1,8C plus 32 se croisent en moins 40,moins 40." width="440" height="360" loading="lazy" />
<figcaption>Le point commun satisfait simultanément les deux équations.</figcaption>
</figure>

## Exemple guidé : intersection

Les droites $y=2x+1$ et $y=-x+7$ se rencontrent lorsque $2x+1=-x+7$. On obtient $x=2$, puis $y=5$. Le résultat est le point $(2,5)$, pas seulement son abscisse. Les deux substitutions valent bien $5$.

<p class="source-next"><a href="/fr/lessons/L30/#pdf-46">Suite du PDF : Trois situations →</a></p>

<span id="pdf-46" class="source-topic-marker"></span>

## Trois situations : une, aucune ou une infinité de solutions

**Exemples du PDF, pages 46–49.** Pour $y=2x+1$ et $y=-x+4$, on obtient $2x+1=-x+4$, donc $3x=3$ et l’intersection $(1,3)$. Pour $y=2x+1$ et $y=2x+5$, éliminer $2x$ donnerait $1=5$ : aucune solution. Pour $y=2x+1$ et $2y=4x+2$, la seconde équation est deux fois la première : chaque point de la droite est commun.

Ces cas expliquent les trois résultats rencontrés dans les systèmes. Une seule équation à deux inconnues peut décrire une infinité de couples : l’expression $0=0$ ne signifie pas que les seules coordonnées possibles sont zéro.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/intersection-one.svg" alt="Deux droites se croisent au point 1,3." width="440" height="360" loading="lazy" />
<figcaption>Une solution.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/intersection-none.svg" alt="Deux droites parallèles distinctes ne se croisent pas." width="440" height="360" loading="lazy" />
<figcaption>Aucune solution.</figcaption>
</figure>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/intersection-many.svg" alt="Deux équations représentent la même droite, avec un trait continu et un trait pointillé superposés." width="440" height="360" loading="lazy" />
<figcaption>Une infinité de points communs.</figcaption>
</figure>

## Une, aucune ou une infinité

Pour deux droites non verticales, des pentes différentes donnent une intersection unique. Des pentes égales et des constantes différentes donnent aucune intersection. Des paramètres identiques décrivent la même droite et donc une infinité de points communs. Après élimination, une égalité fausse comme $0=3$ indique l’absence de solution ; une identité comme $0=0$ exige de conserver l’équation restante.

## Verticales et domaine d’application

Pour croiser $x=4$ et $y=-x+6$, substituer directement l’abscisse fixée donne $(4,2)$. Deux verticales distinctes ne se croisent pas. Dans un modèle de coûts ou de conversion, une intersection algébrique peut être hors du domaine utilisable. Une quantité négative ou une extrapolation n’acquiert pas un sens pratique uniquement parce qu’elle résout les équations.

<p class="source-next"><a href="/fr/lessons/L31/#pdf-50">Suite du PDF : Les deux demi-plans →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
