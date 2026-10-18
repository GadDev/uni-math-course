---
lessonId: L35
locale: fr
version: 1
status: extended
title: "Calculer et justifier les moindres carrés"
summary: "Compléter le carré pour obtenir la meilleure droite, puis programmer le calcul."
minutes: 25
objectives: [L35-O01, L35-O02, L35-O03, L35-O04, L35-O05, L35-O06]
prerequisites: [L22, L26, L34]
sourcePages: [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
---
# Calculer et justifier les moindres carrés

## Objectifs et prérequis

- Compléter un carré.
- Trouver le meilleur intercept à pente fixée.
- Trouver la pente optimale.
- Effectuer un ajustement complet.
- Prédire et vérifier une implémentation.
- Traiter les cas dégénérés.

Prérequis : L22, L26, L34. Les domaines et restrictions précisés ci-dessous font partie de chaque règle.

## Compléter le carré

L’identité $m^2-6m+11=(m-3)^2+2$ montre un minimum égal à $2$, atteint uniquement à $m=3$. Plus généralement, $Am^2-2Bm+C=A(m-B/A)^2+C-B^2/A$ pour $A>0$. Cette méthode trouve le minimum sans dérivées, car le carré est positif ou nul.

## Étape 1 : fixer la pente

Écrire $X_i=x_i-\bar x$, $Y_i=y_i-\bar y$ et $q=\bar y-m\bar x-p$. Alors $e_i=Y_i-mX_i+q$. Comme les sommes des écarts centrés sont nulles, le développement donne $S(m,p)=\sum_i(Y_i-mX_i)^2+nq^2$. Pour une pente fixée et $n\ge1$, le minimum en $p$ est unique : $p=\bar y-m\bar x$. La droite optimale passe donc par le point moyen.

## Étape 2 : optimiser la pente

Avec cet intercept, la perte devient $S_{yy}-2mS_{xy}+m^2S_{xx}$. Si $S_{xx}>0$, compléter le carré donne $S_{xx}(m-S_{xy}/S_{xx})^2+S_{yy}-S_{xy}^2/S_{xx}$. Le minimum unique est donc atteint pour $m=S_{xy}/S_{xx}$ et $p=\bar y-m\bar x$. La perte minimale est $S_{yy}-S_{xy}^2/S_{xx}$.

## Exemple guidé : trois observations originales

Pour $(0,1),(1,2),(2,2)$, on a $\bar x=1$, $\bar y=5/3$, $S_{xx}=2$, $S_{xy}=1$ et $S_{yy}=2/3$. Ainsi $m=1/2$ et $p=7/6$. Les résidus sont $-1/6,1/3,-1/6$ : leur somme est nulle et leur somme des carrés vaut $1/6$. À $x=3$, le modèle prédit $8/3$. Ce calcul est une prédiction du modèle, pas une certitude sur une observation future.

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

## Que se passe-t-il si les entrées sont constantes ?

Si tous les $x_i$ valent $c$, seule la valeur $mc+p$ est observée. Toute paire satisfaisant $mc+p=\bar y$ minimise la perte ; la pente n’est pas identifiable. Il ne faut pas diviser par $S_{xx}=0$. Des ordonnées constantes avec des abscisses variables posent un autre cas : la meilleure pente est zéro et l’intercept est l’ordonnée commune.

## Pratique et bilan

La banque contient 15 questions originales : 5 faciles, 5 moyennes et 5 difficiles. Commencez sans indice ; après la correction, expliquez pourquoi chaque autre proposition échoue. Les questions difficiles demandent un transfert ou une analyse, pas seulement un calcul plus long. Un indice ou un nouvel essai reste utile pour apprendre, mais ne constitue pas une nouvelle preuve indépendante de maîtrise. Les tentatives sont conservées dans votre progression après connexion.

Texte, exemples et solutions originaux du projet ; concepts suivis dans le cours Droites de Bruno Teheux. Les pages de source sont des pages PDF, titre compté comme page 1.
