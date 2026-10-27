---
lessonId: L39
locale: fr
version: 1
status: extended
title: "Calculer les dérivées"
summary: "Maîtriser constantes, puissances, sommes, produits, quotients et composition."
minutes: 40
objectives: [L39-O01, L39-O02, L39-O03, L39-O04, L39-O05, L39-O06]
prerequisites: [L23, L37, L38]
sourcePages: [13]
---
# Calculer les dérivées

*Matériel pédagogique original fondé sur* Bruno Teheux, Mathématiques Générales — Fonctions d’une variable réelle, BINFO-FCE 2025–2026, pages 13.

## Objectifs et prérequis

Les limites sont fondamentales mais calculer chaque dérivée à partir de zéro serait long. Nous utilisons des règles que l’on applique en respectant le domaine.

$$D(c)=0,\qquad D(x^n)=nx^{n-1}$$

Révisez les puissances et l’idée de tangente avant ce chapitre.

## Somme et constante multiplicative

Dérivez chaque terme séparément. Un coefficient constant reste devant la dérivée.

$$D(f+g)=Df+Dg,\qquad D(cf)=cDf$$

$$D(3x^2+2x+5)=6x+2$$

La dérivée de 5 est zéro, pas 5. Vérifiez en dérivant le polynôme terme à terme.

## La règle du produit

La dérivée d’un produit n’est généralement pas le produit des dérivées. Il faut deux termes.

$$D(fg)=(Df)g+f(Dg)$$

$$D\bigl(x^2(x+1)\bigr)=2x(x+1)+x^2=3x^2+2x$$

Contrôle indépendant : développez d’abord, puis dérivez le polynôme obtenu.

## La règle du quotient

Le dénominateur doit être différent de zéro. Notez l’ordre de la soustraction : dérivée du haut multipliée par le bas, moins le haut multiplié par la dérivée du bas.

$$D\left(\frac fg\right)=\frac{(Df)g-f(Dg)}{g^2},\qquad g\ne0$$

$$D\left(\frac{x}{x+1}\right)=\frac{(x+1)-x}{(x+1)^2}=\frac{1}{(x+1)^2}$$

N’oubliez pas la restriction d’origine : ici x ne vaut jamais moins un.

## La règle de la chaîne

Une fonction composée contient une fonction dans une autre. Dérivez l’extérieur puis multipliez par la dérivée de l’intérieur.

$$D(f\circ g)(x)=Df(g(x))\,Dg(x)$$

$$D\bigl((2x+1)^3\bigr)=3(2x+1)^2\cdot2=6(2x+1)^2$$

Le facteur 2 vient de la dérivée de l’expression intérieure.

## Choisir la bonne règle

Commencez par identifier la dernière opération de l’expression : somme, produit, quotient ou composition. Appliquez la règle extérieure, puis simplifiez sans perdre les restrictions.

$$D\left(\frac{x^2}{x^2+1}\right)=\frac{2x(x^2+1)-x^2(2x)}{(x^2+1)^2}=\frac{2x}{(x^2+1)^2}$$

On peut tester le résultat en substituant un x simple dans les deux formes avant et après simplification.

## Erreurs fréquentes et vérification

Attention aux puissances, aux règles du produit et aux dérivées intérieures oubliées. Une simplification algébrique préalable peut fournir une seconde méthode.

$$D\bigl((x+1)(x^2-x+1)\bigr)=D(x^3+1)=3x^2$$

Si les deux méthodes donnent une réponse différente, reprenez la première étape où les expressions ne coïncident plus.

