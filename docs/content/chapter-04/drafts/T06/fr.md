# Surprise, information et entropie de Shannon

*Chapitre 04 · Séquence T06 · Source : PDF pp. 17–20 · Brouillon non publié.*

## Objectifs et prérequis

Vous pourrez : (1) lire $\log_2$ ; (2) interpréter $-\log_2(p)$ ; (3) calculer l'information d'un symbole ; (4) utiliser $H(S)$ ; (5) comparer deux sources ; (6) distinguer entropie, longueur moyenne et certitude de prédiction.

Prérequis : T04–T05, puissances de $2$ et logarithmes élémentaires. Dans la convention du PDF, chaque $p_i>0$ et $\sum p_i=1$.

## 01 · Qu'est-ce qui nous surprend ?

**Motivation du PDF, pp. 18–19.** Une source émet une longue série de $0$ puis un nouveau symbole $s_1$ ; une autre affiche une suite de $0$ et de $1$ plus variée puis $s_2$. Le document demande sur quelle valeur on miserait. C'est une **intuition**, pas une estimation numérique de probabilités à partir de ces seules séquences : il manque un modèle de génération.

Un événement fréquent est peu surprenant ; un événement rare est plus surprenant. Shannon propose de quantifier ce contraste à l'aide d'un logarithme.

## 02 · Information portée par un symbole

**PDF, p. 20.** Pour un symbole $s$ de probabilité $p(s)>0$, la quantité

$$I(s)=-\log_2(p(s))$$

s'exprime en **bits d'information**. Le logarithme en base $2$ répond à la question « quelle puissance de $2$ ? » : $\log_2(1/8)=-3$ car $2^{-3}=1/8$.

**Vocabulaire.** La diapositive parle d'« entropie d'un caractère ». Pour distinguer la valeur individuelle de la moyenne, nous l'appelons aussi **information propre** ou **surprise** $I(s)$ ; l'entropie de la source sera notée $H(S)$.

| Probabilité | Information $I(s)$ | Lecture |
| --- | --- | --- |
| $1$ | $0$ | événement certain |
| $1/2$ | $1$ | un bit |
| $1/4$ | $2$ | deux bits |
| $1/8$ | $3$ | trois bits |

**Attention au domaine.** Le PDF suppose des probabilités strictement positives. La limite du cas $p=0$ n'est donc pas un calcul de $\log_2(0)$ dans le cours. Si une extension autorise $p=0$, le terme $p\log_2p$ est traité par limite et vaut $0$ dans le calcul de l'entropie.

## 03 · L'entropie d'une source : une moyenne

**Définition du PDF, p. 20.** Pour $S=\{s_1,\ldots,s_n\}$ et $p_1,\ldots,p_n$ :

$$H(S)=-\sum_{i=1}^{n}p_i\log_2(p_i)=\sum_{i=1}^{n}p_i I(s_i).$$

L'entropie est **l'information moyenne par symbole source** sous le modèle de probabilités choisi. Ce n'est ni la longueur d'un message particulier ni automatiquement la longueur d'un code concret.

**Exemple pédagogique complémentaire.** Pour deux symboles équiprobables $(1/2,1/2)$ :

$$H(S)=-\frac12(-1)-\frac12(-1)=1.$$

Pour $(3/4,1/4)$ :

$$H(S)=-\frac34\log_2(3/4)-\frac14\log_2(1/4)\approx0{,}811.$$

La deuxième distribution est plus prévisible ; son entropie est inférieure. Les valeurs approchées sont en bits par symbole source.

## 04 · Retour au calcul du codage

**Application pédagogique complémentaire au modèle des pp. 14–15.** Pour $p=(1/2,1/4,1/4)$ :

$$H(S)=-\frac12\log_2(1/2)-2\cdot\frac14\log_2(1/4)=\frac32=1{,}5.$$

Le code $c_2$ du PDF a $L(c_2)=1{,}75$ (T05) ; le code préfixe supplémentaire $d$ a $L(d)=1{,}5$. Ces valeurs coïncident numériquement avec l'entropie pour $d$ dans cet exemple. **Le PDF ne démontre pas de théorème général reliant $H$ et le minimum des longueurs** ; une telle démonstration relèverait d'une extension sur le codage optimal.

## 05 · Ce que l'entropie ne dit pas

Deux messages particuliers peuvent avoir une longueur identique mais venir de sources de probabilités différentes. L'entropie dépend de **la distribution modélisée**. Une source « très surprenante » au sens de Shannon n'est pas automatiquement intéressante en langue naturelle, vraie, utile ou secrète : cette quantité ne mesure pas la signification du texte.

**Erreur fréquente.** Confondre $I(s)$, information d'un symbole, avec $H(S)$, moyenne pondérée sur tous les symboles ; ou confondre les deux avec $L(c)$, longueur moyenne d'un code choisi.

## Vérifiez vos acquis — solutions incluses

1. **Question.** Si $p(s)=1/4$, combien vaut $I(s)$ ? **Réponse.** $2$ bits.
2. **Question.** Si $p(s)=1$, combien vaut $I(s)$ ? **Réponse.** $0$ bit.
3. **Question.** Calculer l'entropie de $(1/2,1/2)$. **Réponse.** $H(S)=1$.
4. **Question.** Calculer $H(S)$ pour $(1/2,1/4,1/4)$. **Réponse.** $3/2=1{,}5$.
5. **Question.** Une grande entropie signifie-t-elle un message plus « important » ? **Réponse.** Non ; elle mesure une moyenne de surprise probabiliste, pas un jugement de valeur.
6. **Question.** Pour le code $c_2$ des pages 14–15, $H(S)=L(c_2)$ ? **Réponse.** Non : $H(S)=1{,}5$ tandis que $L(c_2)=1{,}75$.

**Fin du parcours source.** Le PDF se termine après les définitions par « Exemples. [...] » ; les calculs chiffrés détaillés ci-dessus sont donc des **ajouts pédagogiques** et non des exemples repris d'une suite absente du document.
