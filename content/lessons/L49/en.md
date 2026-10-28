---
lessonId: L49
locale: en
version: 1
status: extended
title: "Huffman coding: build a compression tree"
summary: "Step-by-step introduction to Huffman trees and codes."
minutes: 30
objectives: [L49-O01, L49-O02, L49-O03, L49-O04, L49-O05, L49-O06]
prerequisites: [L48]
sourcePages: [14, 15, 16]
---
# Huffman coding: build a compression tree

**Original teaching extension — not covered by the source PDF.** The information-theory PDF (pp. 14–16) introduces average codeword length and the idea of shorter words for frequent symbols, but **does not teach Huffman's algorithm**. This lesson adds the classical technique with a complete guided example.

## Objectives and prerequisites

Learning outcomes: (1) explain the link between frequency and word length, (2) select the two lightest weights, (3) construct a Huffman tree, (4) read and join its codewords, (5) calculate average length, (6) justify unique decoding and understand limitations.

Prerequisites: L44–L48, fractions, weighted averages and prefix codes.

## 01 · The core idea

Some symbols occur more often than others in a message. Giving the most frequent symbol a **shorter codeword** can save bits. Huffman's algorithm constructs a code with **minimum average length among binary prefix codes** for the chosen symbol frequencies.

Repeat one rule: **take the two smallest weights, connect them under a parent, then put their sum back into the list**. Stop when only one tree remains.

## 02 · Worked example: A, B, C and D

Suppose the frequencies are A: 8, B: 4, C: 2, D: 2, for **16 occurrences**.

**First merge:** combine C (2) and D (2) into a node of weight 4.

**Second merge:** remaining weights are A (8), B (4), and CD (4). Merge B and CD into a node of weight 8.

**Third merge:** combine A (8) and BCD (8) to obtain the root of weight 16.

For a tie, choose the subtree containing the **alphabetically earliest symbol** first. Put the first subtree on the left (bit 0), the other on the right (bit 1).

~~~text
             (16)
          0 /    \ 1
          A:8    (8)
               0/   \1
               B:4  (4)
                   0/ \1
                   C:2 D:2
~~~

Read each codeword by following the path from root to leaf:

| Symbol | Codeword | Bits |
| --- | --- | --- |
| A | 0 | 1 |
| B | 10 | 2 |
| C | 110 | 3 |
| D | 111 | 3 |

**Worked example.** Encode ABCD by joining the four codewords without separators: 0 + 10 + 110 + 111 = **010110111**, or 9 bits. To decode, traverse the tree and restart from its root every time a leaf is reached.

## 03 · Calculating the savings

The symbol probabilities are 8/16, 4/16, 2/16 and 2/16. Average length in bits **per source symbol** is:

$$
L(c)=\sum_i p_i\,|c(s_i)|
$$

$$
L(c)=\frac{8\times1+4\times2+2\times3+2\times3}{16}=\frac{28}{16}=\frac74=1{,}75
$$

A fixed-length binary code for four letters needs 2 bits per symbol. This Huffman code uses **1.75 bits per symbol on average**, saving **0.25 bit per symbol**. The average may be fractional even when each actual codeword has an integer length.

## 04 · Why can we always decode it?

Symbols appear only at the **leaves**. The path to one leaf cannot begin the path to another leaf. Thus the codewords are **prefix-free** and every concatenated message has one unambiguous decoding. Remember that some uniquely decodable codes are not prefix-free (L45).

## 05 · Limits and common mistakes

- **Return each merged node to the candidates**. Never keep selecting only the least-frequent original letters.
- **Equal frequencies** may produce different optimal trees. Our deterministic tie rule specifies one valid answer, not the only valid tree.
- The decoder must know the **same tree**. Sending that tree has a cost not included in the average length.
- Huffman coding is not **encryption** or **error correction**. Sample frequencies need not match future messages.
- Optimality means minimum average length among **binary prefix codes for individual symbols** with the chosen probabilities, not among all conceivable compression systems.

## 06 · Check your understanding, with solutions

1. Which weights merge first? **Answer:** 2 and 2, producing weight 4.
2. Why does that node weigh 4? **Answer:** its two leaves represent two plus two occurrences.
3. What is C's codeword in **our tree**? **Answer:** 110, three bits.
4. Encode AAAB. **Answer:** 0 + 0 + 0 + 10 = 00010 (5 bits).
5. Can we add codeword 01 for a new letter while retaining A=0? **Answer:** no, because 0 would be its prefix.
6. Can ties generate different bit strings? **Answer:** yes, while the optimal average lengths are the same.

**Further source (not part of the supplied PDF):** Stanford's Huffman coding tutorial, https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/24-huffman/huffman_background.html.
