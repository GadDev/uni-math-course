---
lessonId: L45
locale: fr
version: 1
status: extended
title: "Décoder sans ambiguïté"
summary: "Comprendre le codage de l'information, avec des exemples guidés."
minutes: 30
objectives: [L45-O01, L45-O02, L45-O03, L45-O04, L45-O05, L45-O06]
prerequisites: [L44]
sourcePages: [9, 10, 14, 15]
---
# Décoder sans ambiguïté


<span id="pdf-9" class="source-topic-marker"></span>

## Objectifs et prérequis

Vous pourrez : (1) tester un exemple de décodage ; (2) reformuler le décodage unique ; (3) construire un contre-exemple ; (4) reconnaître la propriété de préfixe ; (5) distinguer « préfixe » de « décodage unique » ; (6) expliquer la limite de ce que prouve un exemple.

Prérequis : T02 ; les mots sources appartiennent à $S^*$ et les mots codés à $T^*$.

## 01 · Quand deux messages produisent les mêmes bits

**Exemple du PDF, p. 9.** Prenons $S=\{x,y,z\}$ et

$$c(x)=0,\qquad c(y)=1,\qquad c(z)=10.$$

Le mot binaire $10$ admet deux origines distinctes :

$$c(z)=10=c(yx).$$

Par conséquent, le récepteur ne sait pas si le message était $z$ ou $yx$. **Le codage existe, mais son décodage n'est pas unique.**

## 02 · La définition mathématique

**PDF, p. 10.** Un codage est **à décodage unique** si deux mots sources distincts ne peuvent jamais donner la même suite codée :

$$\forall u,v\in S^*,\quad u\ne v\Longrightarrow c(u)\ne c(v).$$

Cela signifie que l'extension de $c$ aux mots sources est **injective**. Pour prouver qu'un code n'est *pas* à décodage unique, il suffit de montrer deux messages distincts ayant le même code. Pour prouver qu'il l'est, vérifier quelques messages ne suffit pas : il faut un argument valable pour tous les messages.

**Piège.** Des mots codes distincts pour chaque symbole ne suffisent pas. Dans l'exemple, $0$, $1$ et $10$ sont différents, mais leur concaténation crée une collision.

## 03 · Une garantie facile : les codes préfixes

**Exemple pédagogique complémentaire, au-delà du PDF.** Un code est **préfixe** lorsqu'aucun mot code n'est le début d'un autre mot code. Considérons

$$d(x)=0,\qquad d(y)=10,\qquad d(z)=11.$$

Aucun mot code ne commence par un autre : on peut lire $0$ immédiatement comme $x$ ; lorsqu'un bloc commence par $1$, il faut lire le deuxième bit pour choisir $y$ ou $z$. Donc le décodage se fait de gauche à droite sans hésitation, et ce code est à décodage unique.

**Important.** Être préfixe est une **condition suffisante**, mais **non nécessaire**, pour être à décodage unique.

## 04 · Reprendre les codes du PDF sans masquer leur statut

**Exemple du PDF, pp. 14–15.**

$$c_1(x)=001,\quad c_1(y)=01,\quad c_1(z)=0.$$

Ici $c_1(x)=001=c_1(zy)$ puisque $c_1(z)c_1(y)=0\,01=001$. Le code $c_1$ **n'est donc pas à décodage unique**, bien que le PDF l'utilise pour faire calculer une longueur moyenne. Ce calcul de longueur reste algébriquement possible ; il ne prouve pas que le code conviendrait à une transmission inversible.

Toujours sur les mêmes pages :

$$c_2(x)=0,\quad c_2(y)=01,\quad c_2(z)=011.$$

Ce code **n'est pas préfixe** car $0$ commence $01$ et $011$. Cependant, **il est à décodage unique** : chaque mot code contient exactement un $0$, au début, puis zéro, un ou deux $1$. Dans tout message codé, les positions des $0$ déterminent exactement le début de chaque codeword ; les blocs entre deux `0` identifient alors $x$, $y$ ou $z$. Ceci est un argument valable pour toutes les concaténations finies.

**Note de lecture.** La p. 10 annonce que les codes considérés ensuite sont à décodage unique. L'usage de $c_1$ p. 14 constitue une exception à cette annonce ; nous la signalons explicitement au lieu de l'ignorer.

## Vérifiez vos acquis — solutions incluses

1. **Question.** Avec `c(z)=10` et `c(yx)=10`, quelle propriété échoue ? **Réponse.** L'injectivité de l'extension $c:S^*\to T^*$.
2. **Question.** $d(x)=0,d(y)=10,d(z)=11$ est-il préfixe ? **Réponse.** Oui, aucun mot code n'est préfixe d'un autre.
3. **Question.** $c_2$ est-il préfixe ? **Réponse.** Non, $0$ est préfixe de $01$.
4. **Question.** $c_2$ est-il malgré cela à décodage unique ? **Réponse.** Oui, les séparations sont repérées par chaque occurrence de $0$.
5. **Question.** Un seul décodage réussi suffit-il pour démontrer la propriété pour tous les messages ? **Réponse.** Non ; il faut un raisonnement général.

**Suite.** T04 introduit les probabilités d'apparition des symboles.
