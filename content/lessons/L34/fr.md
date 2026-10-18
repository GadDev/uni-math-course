---
lessonId: L34
locale: fr
version: 2
status: extended
title: "Modèles affines et résidus"
summary: "Mesurer l’erreur verticale d’un modèle et construire une perte quadratique."
minutes: 30
objectives: [L34-O01, L34-O02, L34-O03, L34-O04, L34-O05, L34-O06]
prerequisites: [L26, L29]
sourcePages: [63, 64, 65, 66, 67]
---
# Modèles affines et résidus

## Objectifs et prérequis

- Calculer une prédiction.
- Calculer un résidu signé.
- Expliquer la compensation des erreurs.
- Calculer une perte quadratique.
- Calculer les sommes centrées.
- Comparer des critères de modèle.

Prérequis : L26, L29. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-63" class="source-topic-marker"></span>

## Le modèle : pourquoi comparer plusieurs droites ?

**Situation du PDF, pages 62–64.** Les dix observations de consommation de margarine et de divorces forment un nuage de points ; aucune droite ne passe par tous. Le [tableau de départ](../L36/#pdf-62) ouvre cette partie dans le parcours du PDF. On cherche une relation approximative $y\approx mx+p$, pas une égalité vraie pour chaque observation.

Une droite peut passer près d’un point et loin des autres. Pour comparer honnêtement deux modèles, il faut appliquer le **même critère** à toutes les observations. La droite verte du dessin est un ajustement aux dix points ; la droite pointillée est une autre candidate. Le dessin aide à poser la question, puis les résidus permettent de mesurer la réponse.

**Exemple supplémentaire.** Pour $(0,1),(1,2),(2,2)$, comparer les modèles $\hat y=x+1$ et $\hat y=2$. Le premier se trompe d’une unité au dernier point ; le second d’une unité au premier. Ils ont ici la même somme d’erreurs au carré, même s’ils ne produisent pas les mêmes prédictions.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/regression-models.svg" alt="Dix observations et deux droites candidates, l’une ajustée aux données et l’autre plus plate." width="440" height="360" loading="lazy" />
<figcaption>Comparer une droite au nuage entier, pas à un seul point.</figcaption>
</figure>

## Un modèle n’est pas une égalité des données

À chaque entrée $x_i$, le modèle prédit $\hat y_i=mx_i+p$. L’observation $y_i$ peut différer. Le résidu est $e_i=y_i-\hat y_i$. Un résidu positif signifie que le point observé est au-dessus de la droite, et donc que le modèle sous-estime cette observation. Nous ajustons les erreurs verticales, pas les distances perpendiculaires à la droite.

<p class="source-next"><a href="/fr/lessons/L34/#pdf-65">Suite du PDF : Mesurer l’erreur →</a></p>

<span id="pdf-65" class="source-topic-marker"></span>

## Mesurer l’erreur : observation, prédiction et résidu

Le petit chapeau de $\hat y_i$ se lit « y chapeau indice i » : c’est la valeur **prédite** pour la donnée numéro $i$. La valeur $y_i$ sans chapeau est **observée**. Le résidu du PDF est $e_i=y_i-\hat y_i=y_i-(mx_i+p)$.

**Exemple supplémentaire détaillé.** Avec $x_i=2$, $y_i=6$, $m=2$ et $p=1$, le modèle prédit $\hat y_i=2\cdot2+1=5$. Le résidu vaut $e_i=6-5=1$ : le point observé est une unité au-dessus de la droite. Avec l’observation $y_i=4$, le même modèle donnerait $e_i=-1$. Sur le dessin, les segments sont verticaux, car l’entrée $x_i$ reste fixée.

**Les choix discutés dans le PDF, pages 65–66.** Additionner les résidus signés peut masquer les erreurs : $-2+2=0$. Additionner leurs valeurs absolues est un autre critère possible : $|-2|+|2|=4$. Les moindres carrés choisissent $(-2)^2+2^2=8$ ; les erreurs ne se compensent plus et les grandes erreurs pèsent davantage. Il s’agit d’un choix de critère, pas de la seule manière de mesurer une erreur.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/residuals.svg" alt="Trois observations et la droite y égale x plus 1 ; segments verticaux marqués e1, e2 et e3." width="440" height="360" loading="lazy" />
<figcaption>Un résidu compare observation et prédiction à la même abscisse.</figcaption>
</figure>

## Exemple guidé : calculer les résidus

Pour les données $(0,1),(1,2),(2,2)$ et le modèle $\hat y=x+1$, les prédictions sont $1,2,3$. Les résidus sont $0,0,-1$ et leur somme des carrés vaut $1$. Le dernier résidu négatif indique une surestimation. Changer de convention de signe ne changerait pas les carrés, mais changerait l’interprétation du signe.

## Une perte qui ne se compense pas

La perte des moindres carrés est $S(m,p)=\sum_{i=1}^n(y_i-mx_i-p)^2$, avec $n\ge1$. Elle est positive ou nulle, et vaut zéro exactement si toutes les prédictions sont exactes sur les données. La moyenne quadratique des erreurs est $\mathrm{MSE}=S/n$. Pour un même jeu de données, minimiser l’une ou l’autre donne les mêmes paramètres. Les carrés amplifient les grands résidus.

## Exemple guidé : une somme trompeuse

Les résidus $-2,2$ ont une somme nulle mais une perte $8$. Les résidus $1,1$ ont une somme $2$ mais une perte $2$. Choisir seulement la plus petite somme signée favoriserait à tort le premier modèle ; des résidus négatifs très grands pourraient même rendre ce critère arbitrairement négatif.

<p class="source-next"><a href="/fr/lessons/L34/#pdf-67">Suite du PDF : La méthode des moindres carrés →</a></p>

<span id="pdf-67" class="source-topic-marker"></span>

## Les moindres carrés et les trois sommes centrées

**Définition du PDF, page 67.** Choisir les paramètres $m,p$ pour rendre $S(m,p)=\sum_{i=1}^n e_i^2$ aussi petit que possible. Le nom signifie « plus petite somme des carrés », pas « choisir les plus petits points ».

Les notations de la page 67 condensent des calculs répétés :

| Notation | Calcul | Lecture |
| --- | --- | --- |
| $S_{xx}$ | $\sum_{i=1}^n(x_i-\bar x)^2$ | Somme des écarts horizontaux au carré. |
| $S_{xy}$ | $\sum_{i=1}^n(x_i-\bar x)(y_i-\bar y)$ | Somme des produits d’écarts. |
| $S_{yy}$ | $\sum_{i=1}^n(y_i-\bar y)^2$ | Somme des écarts verticaux au carré. |

**Exemple supplémentaire.** Pour $(0,1)$ et $(2,3)$, les moyennes sont $\bar x=1$, $\bar y=2$. Les deux écarts horizontaux sont $-1,1$, comme les écarts verticaux. Donc $S_{xx}=1+1=2$, $S_{xy}=1+1=2$ et $S_{yy}=1+1=2$. Dans la leçon suivante, un tableau garde ces colonnes visibles pour quatre observations.

## Trois sommes utiles

Définir $S_{xx}=\sum_i(x_i-\bar x)^2$, $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$ et $S_{yy}=\sum_i(y_i-\bar y)^2$. Pour $(0,1),(2,3)$, les moyennes sont $(1,2)$ et ces trois sommes valent toutes $2$. Les sommes de carrés ne sont jamais négatives, mais la somme croisée peut être négative. Ces quantités prépareront le calcul de la meilleure droite.

<p class="source-next"><a href="/fr/lessons/L35/#pdf-68">Suite du PDF : La formule →</a></p>

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
