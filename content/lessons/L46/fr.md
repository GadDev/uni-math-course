---
lessonId: L46
locale: fr
version: 1
status: extended
title: "Probabilités d'une source"
summary: "Comprendre le codage de l'information, avec des exemples guidés."
minutes: 25
objectives: [L46-O01, L46-O02, L46-O03, L46-O04, L46-O05, L46-O06]
prerequisites: [L45]
sourcePages: [11, 13]
---
# Probabilités d'une source


<span id="pdf-11" class="source-topic-marker"></span>

## Objectifs et prérequis

Vous saurez : (1) reconnaître la taille $n=|S|$ ; (2) énoncer les conditions sur une distribution ; (3) interpréter $p_i$ ; (4) calculer une fréquence à partir d'observations ; (5) construire une distribution valide ; (6) expliciter les hypothèses du modèle.

Prérequis : T02, fractions et pourcentages. Les probabilités portent ici sur les symboles individuels.

## 01 · Une source n'émet pas tous les symboles aussi souvent

**PDF, p. 11.** Une source prend ses symboles dans un alphabet fini $S=\{s_1,\ldots,s_n\}$, où $n=|S|$. Le document suppose des probabilités strictement positives :

$$p_i>0,\qquad \sum_{i=1}^{n}p_i=1.$$

La valeur $p_i$ représente la probabilité qu'un symbole émis soit $s_i$. Les nombres doivent former une distribution cohérente : ni une probabilité négative, ni une somme différente de $1$ n'est admissible.

**Exemple du PDF, p. 14 (annoncé ici pour préparer T05).** Sur $S=\{x,y,z\}$, la distribution est $(1/2,1/4,1/4)$. La somme $1/2+1/4+1/4=1$ : elle est valide.

## 02 · Construire des probabilités à partir de fréquences

**PDF, p. 13.** Pour du texte, on peut estimer la probabilité des caractères à partir d'un tableau de fréquences.

**Exemple pédagogique complémentaire.** Observons dix caractères sources : $xxxxyyyxxz$. Le symbole $x$ apparaît six fois, $y$ trois fois et $z$ une fois. Les fréquences empiriques sont donc

$$\widehat p(x)=6/10,\qquad \widehat p(y)=3/10,\qquad \widehat p(z)=1/10.$$

La somme est $1$. Le chapeau dans $\widehat p$ signifie ici **estimation** : la prochaine lettre n'est pas assurée d'obéir exactement aux mêmes proportions. Une fréquence calculée sur un échantillon n'est pas une loi de la nature.

## 03 · Hypothèses du modèle

Le PDF prévient, p. 11, que l'on fait des **hypothèses simplificatrices**. Dire qu'un symbole a une probabilité donnée ne décrit pas, à lui seul, les dépendances entre symboles successifs.

**Exemple pédagogique complémentaire.** Deux sources peuvent avoir $p(0)=p(1)=1/2$ tout en produisant des séquences différentes : l'une peut alterner strictement $0101\ldots$, l'autre peut faire des choix indépendants à chaque position. Les probabilités par symbole sont identiques, mais les règles de succession diffèrent. Ne confondez pas « répartition » et « indépendance ».

## 04 · Pourquoi ces probabilités intéressent le codage

Si un symbole fréquent a un mot code plus court, on peut parfois réduire la longueur moyenne. Cela motive la notion de **moyenne pondérée** de T05. Le PDF mentionne aussi l'estimation en deux passes pour des blocs de pixels vidéo (p. 13), sans détailler l'algorithme : nous ne présentons pas une technique particulière comme provenant du document.

**Erreur fréquente.** Traiter $p(x)=1/2$ comme « exactement une occurrence sur deux dans chaque message ». C'est une propriété probabiliste, pas une obligation pour chaque échantillon fini.

## Vérifiez vos acquis — solutions incluses

1. **Question.** $(1/2,1/3,1/6)$ est-elle valide ? **Réponse.** Oui, car les trois valeurs sont positives et leur somme vaut $1$.
2. **Question.** $(1/2,1/2,1/4)$ est-elle valide ? **Réponse.** Non, la somme vaut $5/4$.
3. **Question.** Cinq $x$ et trois $y$ : estimer $\widehat p(x)$. **Réponse.** $5/8$.
4. **Question.** Une fréquence observée garantit-elle la fréquence d'une prochaine série ? **Réponse.** Non ; elle n'est qu'une estimation.
5. **Question.** Connaître $p(x)$ et $p(y)$ prouve-t-il l'indépendance des caractères successifs ? **Réponse.** Non ; il manque l'information sur les transitions.

**Suite.** T05 : la longueur moyenne d'un code.
