---
lessonId: L44
locale: fr
version: 1
status: extended
title: "Alphabets et codage par substitution"
summary: "Comprendre le codage de l'information, avec des exemples guidés."
minutes: 25
objectives: [L44-O01, L44-O02, L44-O03, L44-O04, L44-O05, L44-O06]
prerequisites: [L43]
sourcePages: [5, 7, 8, 9]
---
# Alphabets et codage par substitution


<span id="pdf-5" class="source-topic-marker"></span>

## Objectifs et prérequis

Vous saurez : (1) reconnaître alphabet source et alphabet cible ; (2) interpréter $S^*$ ; (3) définir $c:S\to T^*$ ; (4) distinguer symbole et mot code ; (5) coder une suite par concaténation ; (6) vérifier un codage avec un exemple.

Prérequis : T01, ensembles et fonctions. La longueur d'un mot $w$ se note $|w|$.

## 01 · Deux alphabets

**PDF, pp. 5 et 7.** On choisit un alphabet source $S$ et un alphabet cible $T$. Le plus souvent dans ce chapitre, $T=\{0,1\}$. L'ensemble $S^*$ désigne toutes les suites finies formées avec les symboles de $S$, y compris le mot vide $\varepsilon$. De même, $T^*$ contient les mots sur $T$.

Le symbole $x$ est un élément de $S$ ; le mot $xyx$ est un élément de $S^*$. Le mot binaire $011$ est un élément de $T^*$ si `T=\{0,1\}`.

**Définition du PDF.** Un codage par substitution est une fonction

$$c:S\longrightarrow T^*.$$

Il associe un mot code $c(s)$ à chaque symbole source $s$. Dans les exemples, les mots codes sont non vides.

## 02 · Étendre le codage aux messages

La même lettre $c$ est utilisée pour coder des mots entiers : on **concatène** les mots codes, sans ajouter automatiquement de séparateur :

$$c(s_1s_2\cdots s_\ell)=c(s_1)c(s_2)\cdots c(s_\ell).$$

**Exemple du PDF, p. 8.** $S=\{x,y,z\}$, $T=\{0,1\}$ et

$$c(x)=0,\qquad c(y)=01,\qquad c(z)=011.$$

Pour $w=xyzx$, on applique la règle symbole par symbole :

| Étape | Symbole | Mot code | Message construit |
| --- | --- | --- | --- |
| 1 | $x$ | $0$ | $0$ |
| 2 | $y$ | $01$ | $001$ |
| 3 | $z$ | $011$ | $001011$ |
| 4 | $x$ | $0$ | $0010110$ |

Donc $c(xyzx)=0010110$.

**Attention.** Les espaces entre mots codes dans un calcul servent à expliquer la méthode. Ils ne sont pas transmis, sauf si le protocole définit un séparateur.

## 03 · Comparer un symbole et un mot

**Exemple pédagogique complémentaire.** Si $a\in S$, alors $c(a)$ est un mot sur $T$, pas nécessairement un seul bit. Pour le code précédent, $|c(x)|=1$, $|c(y)|=2$ et $|c(z)|=3$.

Si le message est $xy$, sa longueur codée vaut $|c(xy)|=1+2=3$. Compter les **symboles source** ($2$) ne donne pas le nombre de **bits transmis** ($3$).

## 04 · Comment savoir décoder ?

Le fait qu'une fonction $c:S\to T^*$ soit correctement définie ne garantit pas encore que tout message codé pourra être retrouvé de façon unique. Par exemple, avec $c(x)=0$, $c(y)=1$ et $c(z)=10$ (PDF, p. 9), le mot $10$ peut représenter $z$ ou $yx$.

Cette question — l'**ambiguïté de décodage** — est traitée dans T03. Ne confondez pas « c'est une fonction » et « on retrouve l'entrée sans hésitation ».

## Vérifiez vos acquis — solutions incluses

1. **Question.** Le mot $xy$ appartient-il à $S$ ou à $S^*$ ? **Réponse.** À $S^*$ ; $S$ contient les symboles individuels.
2. **Question.** Pour le code du PDF, calculer $c(zz)$. **Réponse.** $011011$.
3. **Question.** Quelle est la longueur de $c(yxx)$ ? **Réponse.** $2+1+1=4$ bits.
4. **Question.** Quelle différence entre $c(x)$ et $c(xy)$ ? **Réponse.** Le premier code un symbole, le second un mot de deux symboles par concaténation.

**Suite.** T03 : retrouver un message sans ambiguïté.
