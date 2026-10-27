---
lessonId: L45
locale: en
version: 1
status: extended
title: "Decoding without ambiguity"
summary: "Understand source coding with guided examples."
minutes: 30
objectives: [L45-O01, L45-O02, L45-O03, L45-O04, L45-O05, L45-O06]
prerequisites: [L44]
sourcePages: [9, 10, 14, 15]
---
# Decoding without ambiguity


<span id="pdf-9" class="source-topic-marker"></span>

## Objectives and prerequisites

You will: (1) test a decoding example; (2) restate unique decodability; (3) exhibit a counterexample; (4) recognise a prefix code; (5) distinguish prefix-free from uniquely decodable; (6) explain what testing one example cannot prove.

Prerequisites: T02; source words belong to $S^*$, encoded words to $T^*$.

## 01 · When two messages have the same bits

**PDF example, p. 9.** Let $S=\{x,y,z\}$ and

$$c(x)=0,\qquad c(y)=1,\qquad c(z)=10.$$

The bits $10$ could originate from two different messages:

$$c(z)=10=c(yx).$$

Consequently the receiver cannot tell whether the sender meant $z$ or $yx$. **The code exists, but its decoding is not unique.**

## 02 · The mathematical definition

**PDF, p. 10.** A code is **uniquely decodable** if two distinct source words can never produce the same encoded string:

$$\forall u,v\in S^*,\quad u\ne v\Longrightarrow c(u)\ne c(v).$$

Equivalently, the extension of $c$ to source words is **injective**. To prove a code is *not* uniquely decodable, find two different messages with identical encodings. To prove it *is* uniquely decodable, testing only a few messages does not suffice: an argument for all words is needed.

**Common mistake.** Different codewords for individual symbols are not enough. Here $0$, $1$ and $10$ are distinct but concatenation still creates a collision.

## 03 · An easy guarantee: prefix codes

**Additional teaching example beyond the PDF.** A code is **prefix-free** when no codeword is the beginning of another. Consider

$$d(x)=0,\qquad d(y)=10,\qquad d(z)=11.$$

No codeword starts another: a leading $0$ immediately means $x$; when a block starts with $1$, reading one more bit identifies $y$ or $z$. Thus decoding from left to right is unambiguous, and this code is uniquely decodable.

**Important.** Prefix-free is **sufficient**, but **not necessary**, for unique decodability.

## 04 · Revisiting the PDF codes without hiding their status

**PDF example, pp. 14–15.**

$$c_1(x)=001,\quad c_1(y)=01,\quad c_1(z)=0.$$

Here $c_1(x)=001=c_1(zy)$ because $c_1(z)c_1(y)=0\,01=001$. Hence $c_1$ **is not uniquely decodable**, even though the PDF uses it to calculate an average length. That arithmetic remains possible; it does not prove the code suitable for invertible transmission.

From the same pages:

$$c_2(x)=0,\quad c_2(y)=01,\quad c_2(z)=011.$$

This code **is not prefix-free**, since $0$ is a prefix of $01$ and $011$. Nevertheless it **is uniquely decodable**: every codeword has exactly one $0$, at the start, followed by zero, one or two $1$s. In any concatenation, each $0$ identifies the start of a codeword, and the following block tells us whether it encodes $x$, $y$ or $z$. This argument applies to all finite messages.

**Reading note.** Page 10 states that codes considered from then on are uniquely decodable. The example $c_1$ on page 14 is an exception to that statement; we flag it rather than silently treating it as uniquely decodable.

## Check your understanding — with answers

1. **Question.** Given `c(z)=10=c(yx)`, what property fails? **Answer.** Injectivity of the extended function $c:S^*\to T^*$.
2. **Question.** Is $d(x)=0,d(y)=10,d(z)=11$ prefix-free? **Answer.** Yes: no codeword begins another.
3. **Question.** Is $c_2$ prefix-free? **Answer.** No; $0$ begins $01$.
4. **Question.** Is $c_2$ still uniquely decodable? **Answer.** Yes: each occurrence of $0$ marks a codeword boundary.
5. **Question.** Is one successful decoding enough to prove uniqueness for every message? **Answer.** No, a general argument is required.

**Next.** T04 introduces the probabilities of source symbols.
