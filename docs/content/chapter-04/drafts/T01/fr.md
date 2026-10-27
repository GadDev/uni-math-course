# Des messages aux bits

*Chapitre 04 · Séquence T01 · Source : PDF pp. 2–6 · Brouillon non publié.*

## Objectifs et prérequis

À la fin de la séquence, vous pourrez : (1) décrire émetteur, canal et récepteur ; (2) distinguer le message du support de transmission ; (3) définir un bit ; (4) compter les mots binaires de longueur fixée ; (5) encoder et décoder un texte avec une convention explicitée ; (6) identifier ce que la transmission ne garantit pas à elle seule.

Prérequis : compter des possibilités et lire une fonction. On travaille avec des suites finies de symboles.

## 01 · Pourquoi coder ?

**Motivation du PDF, p. 2.** Le robot Perseverance et sa première image après son arrivée sur Mars illustrent une question : comment transmettre une image à distance ? La figure conceptuelle de la p. 3 est **émetteur → canal → récepteur**. Avant d'envoyer quoi que ce soit, les deux extrémités doivent s'accorder sur la représentation des données.

Un message peut être un texte, une image, un son ou une vidéo. Un **bit** est un symbole appartenant à l'alphabet binaire $T=\{0,1\}$. Une suite binaire est un mot sur cet alphabet ; elle ne représente pas spontanément une image ou une lettre. **Le codage est une convention**, et le décodage doit connaître cette convention.

**À vérifier.** Une suite de huit bits garantit-elle la signification d'un texte ? Non : il faut préciser comment convertir les suites de bits en caractères.

## 02 · Combien de messages binaires ?

**Exemple pédagogique complémentaire.** Avec exactement trois bits, chaque position offre deux choix. Il existe donc $2^3=8$ mots : $000,001,010,011,100,101,110,111$.

De manière générale, avec exactement $n$ positions binaires, il existe $2^n$ mots, pour $n\in\mathbb N$ (avec $0\in\mathbb N$ dans ce cours). Pour $n=0$, le seul mot est le mot vide, noté $\varepsilon$. Attention : « longueur **exactement** $n$ » n'est pas « longueur **au plus** $n$ ».

**Exemple résolu.** Pour distinguer huit états par des mots de longueur fixe, trois bits suffisent puisque $2^3=8$. Pour neuf états, trois bits ne suffisent pas ; quatre permettent $2^4=16$ mots possibles.

## 03 · L'exercice « Hello World »

**Question du PDF, p. 6.** Encoder « Hello World » en binaire, puis expliquer le décodage. Le document ne fixe aucun encodage de caractères. Il n'existe donc pas **une** seule réponse binaire imposée par le PDF.

**Solution pédagogique complémentaire, avec convention explicite.** Choisissons UTF-8 : chacun des onze caractères de « Hello World », espace compris, appartient ici à l'ASCII et s'écrit sur un octet. Ainsi le résultat compte $11\times8=88$ bits :

| Caractère | Bits UTF-8 |
| --- | --- |
| H | $01001000$ |
| e | $01100101$ |
| l | $01101100$ |
| o | $01101111$ |
| espace | $00100000$ |
| W | $01010111$ |
| r | $01110010$ |
| d | $01100100$ |

Conserver les répétitions dans leur ordre donne :

$01001000\,01100101\,01101100\,01101100\,01101111\,00100000\,01010111\,01101111\,01110010\,01101100\,01100100$.

Pour décoder : regrouper ici les bits par octets, lire chaque octet selon UTF-8, puis restituer les caractères dans l'ordre. Le regroupement convient à cet exemple parce que ses caractères sont tous codés sur un octet ; **UTF-8 n'a pas toujours un octet par caractère**.

## 04 · La transmission a plusieurs problèmes

**PDF, p. 3.** Les défis mentionnés sont le format des données et du canal, la sécurité, la correction des erreurs et l'efficacité énergétique. Chacun est un problème distinct. Un code qui raccourcit un message n'apporte pas automatiquement de chiffrement ou de correction d'erreurs.

**Confusion fréquente.** Croire que le mot « binaire » signifie « secret » : un message composé de $0$ et de $1$ peut être parfaitement lisible si la convention de décodage est connue.

## Vérifiez vos acquis — solutions incluses

1. **Question.** Combien de mots de quatre bits ? **Réponse.** $2^4=16$.
2. **Question.** Peut-on coder sept états par trois bits à longueur fixe ? **Réponse.** Oui, huit mots distincts sont disponibles ; un mot reste inutilisé.
3. **Question.** Une image et un texte ayant la même suite de bits ont-ils forcément le même sens ? **Réponse.** Non ; la représentation et le format déterminent l'interprétation.
4. **Question.** Si un canal inverse un bit, le codage de texte détectera-t-il forcément l'erreur ? **Réponse.** Non ; il faut un mécanisme supplémentaire de détection ou de correction.

**Suite.** T02 introduit les alphabets et la fonction de codage.