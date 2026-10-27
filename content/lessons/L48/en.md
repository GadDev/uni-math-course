---
lessonId: L48
locale: en
version: 1
status: extended
title: "Surprise, self-information and Shannon entropy"
summary: "Understand source coding with guided examples."
minutes: 35
objectives: [L48-O01, L48-O02, L48-O03, L48-O04, L48-O05, L48-O06]
prerequisites: [L47]
sourcePages: [17, 18, 19, 20]
---
# Surprise, self-information and Shannon entropy


<span id="pdf-17" class="source-topic-marker"></span>

## Objectives and prerequisites

You will: (1) read $\log_2$; (2) interpret $-\log_2(p)$; (3) calculate self-information; (4) use $H(S)$; (5) compare sources; (6) distinguish entropy, average code length and certainty of prediction.

Prerequisites: T04–T05, powers of $2$ and elementary logarithms. In the PDF's convention, $p_i>0$ and $\sum p_i=1$.

## 01 · What makes us surprised?

**PDF motivation, pp. 18–19.** One source displays a long run of $0$s followed by a symbol $s_1$; another displays a more varied pattern of $0$s and $1$s followed by $s_2$. The slides ask what value you would bet on. This is an **intuition exercise**, not a numerical probability estimate from those strings alone: the generating model has not been specified.

A frequent event is less surprising; a rare one is more surprising. Shannon's framework measures this using a logarithm.

## 02 · Information carried by a symbol

**PDF, p. 20.** For a symbol $s$ with probability $p(s)>0$, the quantity

$$I(s)=-\log_2(p(s))$$

is measured in **bits of information**. The base-$2$ logarithm asks “which exponent of $2$?”: $\log_2(1/8)=-3$, since $2^{-3}=1/8$.

**Terminology.** The slide calls this “entropy of a character”. To distinguish an individual value from the average, we also use **self-information** or **surprisal** $I(s)$; source entropy is $H(S)$.

| Probability | Information $I(s)$ | Interpretation |
| --- | --- | --- |
| $1$ | $0$ | certain event |
| $1/2$ | $1$ | one bit |
| $1/4$ | $2$ | two bits |
| $1/8$ | $3$ | three bits |

**Domain warning.** The PDF assumes strictly positive probabilities. The case $p=0$ therefore does not call for calculating $\log_2(0)$ in this course. If an extension permits $p=0$, the term $p\log_2p$ is defined by its limit as $0$ in the entropy sum.

## 03 · Source entropy: an average

**PDF definition, p. 20.** For $S=\{s_1,\ldots,s_n\}$ and $p_1,\ldots,p_n$:

$$H(S)=-\sum_{i=1}^{n}p_i\log_2(p_i)=\sum_{i=1}^{n}p_i I(s_i).$$

Entropy is the **average information per source symbol** under the chosen probability model. It is neither the length of one particular message nor automatically the length of a specific code.

**Additional teaching example.** For two equiprobable symbols $(1/2,1/2)$:

$$H(S)=-\frac12(-1)-\frac12(-1)=1.$$

For $(3/4,1/4)$:

$$H(S)=-\frac34\log_2(3/4)-\frac14\log_2(1/4)\approx0{,}811.$$

The latter distribution is more predictable and has less entropy. Approximate values are in bits per source symbol.

## 04 · Linking entropy back to coding

**Additional application of the model on pp. 14–15.** For $p=(1/2,1/4,1/4)$:

$$H(S)=-\frac12\log_2(1/2)-2\cdot\frac14\log_2(1/4)=\frac32=1{,}5.$$

The PDF code $c_2$ has $L(c_2)=1{,}75$ (T05), whereas the additional prefix code $d$ has $L(d)=1{,}5$. The latter numerically equals entropy in this example. **The PDF does not prove a general theorem relating $H$ to optimal code length**; such a proof would belong to further study of optimal coding.

## 05 · What entropy does not mean

Messages of the same length can come from sources with different probability distributions. Entropy depends on **the modelled distribution**. A source with high Shannon entropy is not automatically semantically interesting, truthful, useful or secret: the number does not measure a message's meaning.

**Common mistake.** Confusing $I(s)$, information about one symbol, with $H(S)$, its weighted average over all symbols, or confusing either with $L(c)$, the average length of a chosen code.

## Check your understanding — with answers

1. **Question.** If $p(s)=1/4$, what is $I(s)$? **Answer.** $2$ bits.
2. **Question.** If $p(s)=1$, what is $I(s)$? **Answer.** $0$ bits.
3. **Question.** Compute entropy for $(1/2,1/2)$. **Answer.** $H(S)=1$.
4. **Question.** Compute $H(S)$ for $(1/2,1/4,1/4)$. **Answer.** $3/2=1{,}5$.
5. **Question.** Does high entropy mean a message is more “important”? **Answer.** No; it is average probabilistic surprise, not a value judgement.
6. **Question.** For the code $c_2$ on pp. 14–15, is $H(S)=L(c_2)$? **Answer.** No: $H(S)=1{,}5$ but $L(c_2)=1{,}75$.

**End of source-based route.** The PDF ends just after its definitions with “Exemples. [...]”. The detailed numerical calculations above are **additional teaching work**, not examples quoted from a missing continuation.
