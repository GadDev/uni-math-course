---
lessonId: L44
locale: en
version: 1
status: extended
title: "Alphabets and substitution coding"
summary: "Understand source coding with guided examples."
minutes: 25
objectives: [L44-O01, L44-O02, L44-O03, L44-O04, L44-O05, L44-O06]
prerequisites: [L43]
sourcePages: [5, 7, 8, 9]
---
# Alphabets and substitution coding


<span id="pdf-5" class="source-topic-marker"></span>

## Objectives and prerequisites

You will: (1) identify source and target alphabets; (2) read $S^*$; (3) define $c:S\to T^*$; (4) distinguish symbols from codewords; (5) encode a string by concatenation; (6) check an encoding using an example.

Prerequisites: T01, sets and functions. We write the length of a word $w$ as $|w|$.

## 01 · Two alphabets

**PDF, pp. 5 and 7.** Choose a source alphabet $S$ and a target alphabet $T$. Here the target is usually $T=\{0,1\}$. The set $S^*$ comprises every finite word using symbols from $S$, including the empty word $\varepsilon$. Likewise, $T^*$ contains words over $T$.

The symbol $x$ belongs to $S$; the word $xyx$ belongs to $S^*$. If `T=\{0,1\}`, the binary word $011$ is in $T^*$.

**Definition from the PDF.** A substitution code is a function

$$c:S\longrightarrow T^*.$$

It assigns a codeword $c(s)$ to each source symbol $s$. In the examples, codewords are nonempty.

## 02 · Extending the code to full messages

We use the same letter $c$ for whole words: **concatenate** the individual codewords without automatically adding separators:

$$c(s_1s_2\cdots s_\ell)=c(s_1)c(s_2)\cdots c(s_\ell).$$

**PDF example, p. 8.** Let $S=\{x,y,z\}$, $T=\{0,1\}$ and

$$c(x)=0,\qquad c(y)=01,\qquad c(z)=011.$$

To encode $w=xyzx$, work symbol by symbol:

| Step | Symbol | Codeword | Result so far |
| --- | --- | --- | --- |
| 1 | $x$ | $0$ | $0$ |
| 2 | $y$ | $01$ | $001$ |
| 3 | $z$ | $011$ | $001011$ |
| 4 | $x$ | $0$ | $0010110$ |

Thus $c(xyzx)=0010110$.

**Be careful.** Spaces between codewords in calculations merely explain the method. The actual bit stream has no separators unless the protocol defines them.

## 03 · Symbols are not codewords

**Additional teaching example.** If $a\in S$, then $c(a)$ is a word over $T$, not necessarily one bit. Above, $|c(x)|=1$, $|c(y)|=2$, and $|c(z)|=3$.

For the message $xy$, the encoded length is $|c(xy)|=1+2=3$. Counting the **source symbols** ($2$) is not the same as counting the **transmitted bits** ($3$).

## 04 · Can we recover the original message?

A validly defined function $c:S\to T^*$ does not automatically let us recover every encoded message uniquely. For instance, if $c(x)=0$, $c(y)=1$ and $c(z)=10$ (PDF, p. 9), the bit string $10$ can stand for either $z$ or $yx$.

T03 explores this **decoding ambiguity**. Do not confuse “a function is well-defined” with “its inputs can be recovered without ambiguity”.

## Check your understanding — with answers

1. **Question.** Does the word $xy$ belong to $S$ or $S^*$? **Answer.** $S^*$; $S$ contains individual symbols.
2. **Question.** Compute $c(zz)$ using the PDF code. **Answer.** $011011$.
3. **Question.** Find the length of $c(yxx)$. **Answer.** $2+1+1=4$ bits.
4. **Question.** What is the difference between $c(x)$ and $c(xy)$? **Answer.** The first encodes one symbol; the second encodes a two-symbol word through concatenation.

**Next.** T03: decoding messages without ambiguity.
