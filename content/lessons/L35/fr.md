---
lessonId: L35
locale: fr
version: 4
status: extended
title: "Calculer la droite de régression"
summary: "Appliquer la formule, organiser les sommes et interpréter une prédiction ; preuve facultative."
minutes: 45
objectives: [L35-O01, L35-O02, L35-O03, L35-O04, L35-O05, L35-O06]
prerequisites: [L22, L26, L34]
sourcePages: [71, 72, 73, 74, 75, 76, 77, 84, 85, 86, 87, 88, 89, 90, 91]
---
# Calculer la droite de régression

## Objectifs et prérequis

- Calculer les moyennes et explorer un carré en complément.
- Trouver le meilleur intercept à pente fixée.
- Trouver la pente optimale.
- Effectuer un ajustement complet.
- Prédire et vérifier une implémentation.
- Traiter les cas dégénérés.

Prérequis : L22, L26, L34. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

<span id="pdf-71" class="source-topic-marker"></span>

## La formule : ce que l’on cherche à calculer

**PDF, page 71.** Si les abscisses ne sont pas toutes égales, $S_{xx}>0$ et la meilleure droite pour prédire $y$ à partir de $x$ est donnée par $m=S_{xy}/S_{xx}$ puis $p=\bar y-m\bar x$. Calculer d’abord les moyennes, puis les écarts, puis les sommes : les symboles ne remplacent pas ces étapes.

La droite passe par le point moyen $(\bar x,\bar y)$ : remplacer $x$ par $\bar x$ donne $m\bar x+(\bar y-m\bar x)=\bar y$. **Le PDF révisé, page 71, admet le théorème sans preuve.** Le parcours principal passe directement au calcul sur quatre années. La preuve et le code sont conservés plus bas comme compléments facultatifs.

<p class="source-next"><a href="/fr/lessons/L35/#pdf-72">Suite du PDF : À la main, sur quatre années →</a></p>

<span id="pdf-72" class="source-topic-marker"></span>

## À la main, sur quatre années : le tableau du PDF

**Exemple du PDF, pages 72–75.** Garder 2000, 2003, 2005 et 2009. Les données sont $(8{,}2;5{,}0)$, $(5{,}3;4{,}4)$, $(4{,}0;4{,}1)$ et $(3{,}7;4{,}1)$. Les moyennes sont $\bar x=(8{,}2+5{,}3+4{,}0+3{,}7)/4=5{,}3$ et $\bar y=(5{,}0+4{,}4+4{,}1+4{,}1)/4=4{,}4$.

| Année | $x_i$ | $y_i$ | $x_i-\bar x$ | $y_i-\bar y$ |
| --- | --- | --- | --- | --- |
| 2000 | 8,2 | 5,0 | 2,9 | 0,6 |
| 2003 | 5,3 | 4,4 | 0 | 0 |
| 2005 | 4,0 | 4,1 | −1,3 | −0,3 |
| 2009 | 3,7 | 4,1 | −1,6 | −0,3 |

| Année | $(x_i-\bar x)(y_i-\bar y)$ | $(x_i-\bar x)^2$ |
| --- | --- | --- |
| 2000 | 1,74 | 8,41 |
| 2003 | 0 | 0 |
| 2005 | 0,39 | 1,69 |
| 2009 | 0,48 | 2,56 |
| Somme | $S_{xy}=2{,}61$ | $S_{xx}=12{,}66$ |

Pour lire une ligne : $2{,}9\cdot0{,}6=1{,}74$ et $2{,}9^2=8{,}41$. Additionner ensuite chaque colonne, plutôt que mélanger produits et carrés. On obtient $m=2{,}61/12{,}66\approx0{,}206$ et $p=4{,}4-m\cdot5{,}3\approx3{,}31$. Garder la valeur non arrondie de $m$ pendant le calcul ; arrondir l’affichage à la fin.

<p class="source-next"><a href="/fr/lessons/L35/#pdf-76">Suite du PDF : Résultat et prédiction →</a></p>

<span id="pdf-76" class="source-topic-marker"></span>

## Résultat et prédiction : lire la droite ajustée

**PDF, pages 76–77.** La droite calculée sur quatre années est approximativement $\hat y=0{,}206x+3{,}31$. Les quatre points utilisés pour l’ajustement sont distingués des six autres sur le graphique. Elle passe par le point moyen $(5{,}3;4{,}4)$ avant l’arrondi des coefficients.

Pour $x=2$ livres de margarine par personne et par an, les coefficients affichés donnent $\hat y=0{,}206\cdot2+3{,}31\approx3{,}72$ divorces pour mille habitants. C’est une **prédiction numérique du modèle**, hors de l’intervalle observé $[3{,}7;8{,}2]$. Cela ne démontre ni une causalité ni une prévision fiable. Les limites sont étudiées ensuite.

**Exemple supplémentaire.** À $x=5{,}3$, les coefficients non arrondis redonnent exactement $4{,}4$. Ce contrôle du point moyen est un bon moyen de détecter une erreur d’intercept.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/regression-four.svg" alt="Droite ajustée aux quatre années sélectionnées, six autres observations en croix et point moyen en losange." width="440" height="360" loading="lazy" />
<figcaption>Quatre points pour le calcul ; six autres pour comparer visuellement. <a class="figure-full-size" href="/diagrams/droites/fr/regression-four.svg" target="_blank" rel="noopener">Ouvrir la figure en taille réelle (nouvel onglet)</a></figcaption>
</figure>

## Exemple guidé : trois observations originales

Pour $(0,1),(1,2),(2,2)$, on a $\bar x=1$, $\bar y=5/3$, $S_{xx}=2$, $S_{xy}=1$ et $S_{yy}=2/3$. Ainsi $m=1/2$ et $p=7/6$. Les résidus sont $-1/6,1/3,-1/6$ : leur somme est nulle et leur somme des carrés vaut $1/6$. À $x=3$, le modèle prédit $8/3$. Ce calcul est une prédiction du modèle, pas une certitude sur une observation future.

<p class="source-next"><a href="/fr/lessons/L36/#pdf-78">Suite du PDF : Vous venez de faire du machine learning →</a></p>

<span id="pdf-84" class="source-topic-marker"></span>

## Exercice du PDF : heures de révision et note

**PDF, pages 84–91.** Cinq étudiants déclarent leurs heures de révision $x$ et leur note $y$ sur 20. Chercher une droite qui résume ces observations ne prouve pas qu’une heure supplémentaire produit toujours le même gain.

| $x_i$ | $y_i$ |
| --- | --- |
| 1 | 8 |
| 2 | 9 |
| 3 | 12 |
| 4 | 14 |
| 5 | 17 |

**Essayez d’abord.** Calculer les moyennes, les deux sommes, puis la droite. Prédire ensuite la note pour 3,5 heures et pour 10 heures. La seconde réponse est-elle possible ?

<p class="source-next"><a href="/fr/lessons/L36/#pdf-92">Suite du PDF : Et ensuite ? →</a></p>

<details>
<summary>Afficher la solution expliquée</summary>

Les moyennes sont $\bar x=(1+2+3+4+5)/5=3$ et $\bar y=(8+9+12+14+17)/5=12$. Les écarts de chaque colonne ont une somme nulle : c’est un contrôle utile.

| $x_i$ | $y_i$ | $x_i-\bar x$ | $y_i-\bar y$ | Produit des écarts | Carré de l’écart en x |
| --- | --- | --- | --- | --- | --- |
| 1 | 8 | −2 | −4 | 8 | 4 |
| 2 | 9 | −1 | −3 | 3 | 1 |
| 3 | 12 | 0 | 0 | 0 | 0 |
| 4 | 14 | 1 | 2 | 2 | 1 |
| 5 | 17 | 2 | 5 | 10 | 4 |

Additionner les produits donne $S_{xy}=8+3+0+2+10=23$. Additionner les carrés donne $S_{xx}=4+1+0+1+4=10$. Donc $m=23/10=2{,}3$ et $p=12-2{,}3\cdot3=5{,}1$. La droite est $\hat y=2{,}3x+5{,}1$.

Pour $x=3{,}5$, obtenir $\hat y=2{,}3\cdot3{,}5+5{,}1=13{,}15$, soit environ 13 sur 20. Il s’agit d’une interpolation dans la plage observée $[1;5]$, sans garantie pour un étudiant particulier.

Pour $x=10$, obtenir $\hat y=2{,}3\cdot10+5{,}1=28{,}1$. Une note supérieure à 20 est impossible ici : l’extrapolation révèle la limite du modèle, pas une erreur dans la substitution.

</details>

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/study-score.svg" alt="Cinq notes observées, droite ajustée dans la plage 1 à 5 heures, prolongement pointillé jusqu’à 10 heures au-dessus du maximum 20." width="440" height="360" loading="lazy" />
<figcaption>La droite dépasse le plafond des notes lorsqu’on la prolonge trop loin. <a class="figure-full-size" href="/diagrams/droites/fr/study-score.svg" target="_blank" rel="noopener">Ouvrir la figure en taille réelle (nouvel onglet)</a></figcaption>
</figure>
<details>
<summary>Aller plus loin : preuve et Python (facultatif)</summary>

<span id="supplement-square" class="source-topic-marker"></span>

## Compléter le carré : construire la réécriture

**Complément facultatif du projet, hors du PDF révisé.** Pour transformer $x^2+6x+1$, chercher un carré $(x+a)^2=x^2+2ax+a^2$. Le coefficient $6$ impose $2a=6$, donc $a=3$.

1. Ajouter puis retirer le même nombre : $x^2+6x+1=x^2+6x+9-9+1$.
2. Reconnaître le carré : $(x+3)^2-8$.
3. Utiliser son signe : $(x+3)^2\ge0$, donc la valeur est au moins $-8$.
4. Atteindre cette valeur : $x=-3$ annule le carré, donc le minimum vaut $-8$.

La recette générale est $x^2+bx=(x+b/2)^2-b^2/4$. **Exemple supplémentaire :** $x^2-4x+7=(x-2)^2+3$ a pour minimum $3$, atteint en $x=2$. Le dessin montre le point le plus bas ; le calcul prouve qu’aucune autre valeur n’est plus petite. Pour un coefficient dominant positif $A$, on peut d’abord le mettre en facteur avant d’appliquer la même idée.

<figure class="teaching-figure">
<img src="/diagrams/droites/fr/complete-square.svg" alt="Parabole y égale x carré plus 6x plus 1, minimum en moins 3,moins 8." width="440" height="360" loading="lazy" />
<figcaption>Le carré est nul au sommet et non négatif ailleurs. <a class="figure-full-size" href="/diagrams/droites/fr/complete-square.svg" target="_blank" rel="noopener">Ouvrir la figure en taille réelle (nouvel onglet)</a></figcaption>
</figure>

## Exemple supplémentaire : un autre minimum

L’identité $m^2-6m+11=(m-3)^2+2$ montre un minimum égal à $2$, atteint uniquement à $m=3$. Plus généralement, $Am^2-2Bm+C=A(m-B/A)^2+C-B^2/A$ pour $A>0$. Cette méthode trouve le minimum sans dérivées, car le carré est positif ou nul.

<span id="supplement-proof-p" class="source-topic-marker"></span>

## Preuve, première partie : le meilleur p

**Complément facultatif du projet, hors du PDF révisé.** Fixer $m$ signifie choisir provisoirement une pente, puis ne faire varier que l’intercept $p$. Poser $r_i=y_i-mx_i$ donne $e_i=r_i-p$. Développer avec l’identité remarquable :

$$S(m,p)=\sum_i(r_i-p)^2=\sum_i r_i^2-2p\sum_i r_i+np^2.$$

Le terme $p^2$ est constant dans la somme, d’où $np^2$. Poser $\bar r=(1/n)\sum_i r_i$ permet de réécrire cette expression comme $n(p-\bar r)^2+\sum_i r_i^2-n\bar r^2$. Les deux derniers termes ne dépendent pas de $p$. Puisque $n>0$, le minimum est atteint uniquement en $p=\bar r$.

Enfin, la linéarité de la somme donne $\bar r=\bar y-m\bar x$. C’est exactement l’intercept annoncé. L’intercept est fixé pour chaque pente ; il reste maintenant à choisir la pente.

<span id="supplement-proof-m" class="source-topic-marker"></span>

## Preuve, deuxième partie : le meilleur m

**Complément facultatif du projet, hors du PDF révisé.** Après avoir choisi $p=\bar y-m\bar x$, les résidus deviennent $(y_i-\bar y)-m(x_i-\bar x)$. Développer chaque carré avec $(a-b)^2=a^2-2ab+b^2$, puis additionner, donne trois colonnes : $S_{yy}$, $-2mS_{xy}$ et $m^2S_{xx}$.

La perte est donc un polynôme du second degré en $m$, à coefficient dominant $S_{xx}>0$. Compléter le carré donne $S_{xx}(m-S_{xy}/S_{xx})^2+S_{yy}-S_{xy}^2/S_{xx}$. Le seul morceau qui varie avec $m$ est le premier carré : l’annuler donne $m=S_{xy}/S_{xx}$. La somme des écarts au carré $S_{xx}$ est nulle seulement si toutes les abscisses sont égales ; ce cas demande un traitement séparé.

<span id="supplement-python" class="source-topic-marker"></span>

## Complément facultatif : refaire les calculs en Python

Ce complément utilise les dix observations, et non seulement les quatre du calcul manuel : le résultat est donc légèrement différent. La fonction `fit` ci-dessous reprend les sommes centrées avec des contrôles d’entrée. La définition vient d’abord, puis son appel sur les dix observations.

## Exemple guidé : programmer le calcul

Le code suivant utilise des sommes centrées et refuse une entrée vide ou des abscisses toutes égales. Pour des nombres flottants très proches, une version de production doit aussi gérer la précision numérique. Vérifier le passage au point moyen et comparer les résidus à un petit exemple exact.

```python
def fit(points):
    if not points:
        raise ValueError("empty data")
    n = len(points)
    xb = sum(x for x, y in points) / n
    yb = sum(y for x, y in points) / n
    sxx = sum((x - xb) ** 2 for x, y in points)
    sxy = sum((x - xb) * (y - yb) for x, y in points)
    if sxx == 0:
        raise ValueError("constant inputs")
    m = sxy / sxx
    return m, yb - m * xb
```

```python
x = [8.2, 7.0, 6.5, 5.3, 5.2, 4.0, 4.6, 4.5, 4.2, 3.7]
y = [5.0, 4.7, 4.6, 4.4, 4.3, 4.1, 4.2, 4.2, 4.2, 4.1]
m, p = fit(list(zip(x, y)))
print(round(m, 4), round(p, 4))  # 0.2014 3.3086
```

`zip` associe les valeurs de même position, pour former les couples de données. `sum` effectue une somme ; `** 2` élève au carré. La liste vide et les abscisses toutes égales sont refusées parce que la formule ne fournit pas alors une pente unique. Une autre implémentation possible est `numpy.polyfit(x, y, 1)` ; la version détaillée conserve ici chaque étape visible, sans bibliothèque supplémentaire.

## Que se passe-t-il si les entrées sont constantes ?

Si tous les $x_i$ valent $c$, seule la valeur $mc+p$ est observée. Toute paire satisfaisant $mc+p=\bar y$ minimise la perte ; la pente n’est pas identifiable. Il ne faut pas diviser par $S_{xx}=0$. Des ordonnées constantes avec des abscisses variables posent un autre cas : la meilleure pente est zéro et l’intercept est l’ordonnée commune.

</details>

## Pratique et bilan

La banque comprend aussi des questions sur la preuve facultative ci-dessus. Elle contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
