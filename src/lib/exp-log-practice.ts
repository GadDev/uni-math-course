type Pair = { fr: string; en: string };
type Choice = { text: string; feedback: Pair; correct?: boolean };
export type EquationTask = {
  id: string;
  prompt: Pair;
  choices: Choice[];
  solution: Pair;
};

// Original public self-study examples. No imports from graded exercise banks.
export const equationTasks: Record<'L40' | 'L41' | 'L42', EquationTask[]> = {
  L40: [
    {
      id: 'equal-exponents',
      prompt: {
        fr: 'Résoudre $e^{3x+1}=e^7$ sur $\\mathbb R$. Quelle solution résiste à la substitution ?',
        en: 'Solve $e^{3x+1}=e^7$ on $\\mathbb R$. Which solution survives substitution?',
      },
      choices: [
        {
          text: '$x=8/3$',
          feedback: {
            fr: 'Le +1 doit être soustrait : 3x=7−1. Avec 8/3, l’exposant vaudrait 9.',
            en: 'Subtract the +1: 3x=7−1. At 8/3, the exponent would be 9.',
          },
        },
        {
          text: '$x=2$',
          correct: true,
          feedback: {
            fr: 'Exact : 3×2+1=7. La stricte croissance justifie l’égalité des exposants.',
            en: 'Correct: 3×2+1=7. Strict increase justifies equating the exponents.',
          },
        },
        {
          text: '$x=6$',
          feedback: {
            fr: 'Après 3x=6, il reste à diviser par 3. Vérifiez aussi 3×6+1.',
            en: 'After 3x=6, divide by 3. Also check 3×6+1.',
          },
        },
      ],
      solution: {
        fr: 'Domaine : $\\mathbb R$. Par injectivité, $3x+1=7$, donc $3x=6$ et $x=2$. Vérification : les deux membres valent $e^7$.',
        en: 'Domain: $\\mathbb R$. By injectivity, $3x+1=7$, so $3x=6$ and $x=2$. Check: both sides equal $e^7$.',
      },
    },
    {
      id: 'positive-output',
      prompt: {
        fr: 'Résoudre $e^{2x}=-1$ dans les réels.',
        en: 'Solve $e^{2x}=-1$ in the reals.',
      },
      choices: [
        {
          text: '$x=0$',
          feedback: {
            fr: 'À zéro, le membre gauche vaut 1, pas −1.',
            en: 'At zero, the left side is 1, not −1.',
          },
        },
        {
          text: '$x=\\ln(-1)/2$',
          feedback: {
            fr: 'Le logarithme réel de −1 n’existe pas. Examinez le signe de l’exponentielle avant de transformer.',
            en: 'The real logarithm of −1 is undefined. Check the sign of the exponential before transforming.',
          },
        },
        {
          text: '$\\varnothing$',
          correct: true,
          feedback: {
            fr: 'Exact : une exponentielle est toujours strictement positive. L’ensemble des solutions est vide.',
            en: 'Correct: an exponential is always strictly positive. The solution set is empty.',
          },
        },
      ],
      solution: {
        fr: 'Pour tout réel $x$, $e^{2x}>0$. Il ne peut pas valoir −1 ; aucune solution réelle.',
        en: 'For every real $x$, $e^{2x}>0$. It cannot equal −1; there is no real solution.',
      },
    },
    {
      id: 'moving-exponents',
      prompt: {
        fr: 'Résoudre $e^{2x-3}=e^{x+1}$, sans dériver.',
        en: 'Solve $e^{2x-3}=e^{x+1}$, without differentiating.',
      },
      choices: [
        {
          text: '$x=4$',
          correct: true,
          feedback: {
            fr: 'Exact : les deux exposants valent 5. Résoudre une équation ne demande pas de dériver.',
            en: 'Correct: both exponents are 5. Solving this equation does not require differentiation.',
          },
        },
        {
          text: '$x=2$',
          feedback: {
            fr: 'À 2, les exposants valent 1 et 3. Regroupez les x d’un côté et les constantes de l’autre.',
            en: 'At 2, the exponents are 1 and 3. Collect x terms on one side and constants on the other.',
          },
        },
        {
          text: '$x=-4$',
          feedback: {
            fr: 'Soustraire x puis ajouter 3 donne x=4. Le signe de la constante a été inversé.',
            en: 'Subtract x, then add 3 to obtain x=4. The constant’s sign was reversed.',
          },
        },
      ],
      solution: {
        fr: 'Sur $\\mathbb R$, $2x-3=x+1$ par injectivité. Donc $x=4$. Vérification : $e^{8-3}=e^{4+1}=e^5$.',
        en: 'On $\\mathbb R$, injectivity gives $2x-3=x+1$. Thus $x=4$. Check: $e^{8-3}=e^{4+1}=e^5$.',
      },
    },
  ],
  L41: [
    {
      id: 'combine-logs',
      prompt: {
        fr: 'Résoudre $\\ln(x-2)+\\ln(3)=\\ln(12)$.',
        en: 'Solve $\\ln(x-2)+\\ln(3)=\\ln(12)$.',
      },
      choices: [
        {
          text: '$x=11$',
          feedback: {
            fr: 'Une somme de logarithmes devient le logarithme d’un produit : 3(x−2), pas (x−2)+3.',
            en: 'A sum of logarithms becomes the logarithm of a product: 3(x−2), not (x−2)+3.',
          },
        },
        {
          text: '$x=6$',
          correct: true,
          feedback: {
            fr: 'Exact : x>2, puis 3(x−2)=12. À 6, ln4+ln3=ln12.',
            en: 'Correct: x>2, then 3(x−2)=12. At 6, ln4+ln3=ln12.',
          },
        },
        {
          text: '$x=4$',
          feedback: {
            fr: 'x−2=4 est une étape intermédiaire. Ajoutez 2 pour obtenir x.',
            en: 'x−2=4 is an intermediate step. Add 2 to obtain x.',
          },
        },
      ],
      solution: {
        fr: 'Domaine : $x>2$. Alors $\\ln(3(x-2))=\\ln(12)$, donc $3(x-2)=12$ et $x=6$. Cette valeur appartient au domaine et vérifie l’originale.',
        en: 'Domain: $x>2$. Then $\\ln(3(x-2))=\\ln(12)$, so $3(x-2)=12$ and $x=6$. It belongs to the domain and satisfies the original equation.',
      },
    },
    {
      id: 'negative-input-trap',
      prompt: {
        fr: 'Résoudre $\\ln(x-1)+\\ln(x+1)=\\ln(3)$.',
        en: 'Solve $\\ln(x-1)+\\ln(x+1)=\\ln(3)$.',
      },
      choices: [
        {
          text: '$x=-2$ ou $x=2$',
          feedback: {
            fr: 'Le produit positif ne suffit pas : les deux arguments originaux doivent être positifs. À −2, ils sont négatifs.',
            en: 'A positive product is insufficient: both original arguments must be positive. At −2, they are negative.',
          },
        },
        {
          text: '$x=-2$',
          feedback: {
            fr: 'À −2, ln(−3) et ln(−1) sont indéfinis dans les réels.',
            en: 'At −2, ln(−3) and ln(−1) are undefined in the reals.',
          },
        },
        {
          text: '$x=2$',
          correct: true,
          feedback: {
            fr: 'Exact : le domaine est x>1. Parmi les racines de x²=4, seule 2 est admissible.',
            en: 'Correct: the domain is x>1. Of the roots of x²=4, only 2 is admissible.',
          },
        },
      ],
      solution: {
        fr: 'Il faut $x-1>0$ et $x+1>0$, donc $x>1$. Sur ce domaine, $(x-1)(x+1)=3$, soit $x^2=4$. On rejette −2. À 2, $\\ln(1)+\\ln(3)=\\ln(3)$.',
        en: 'Require $x-1>0$ and $x+1>0$, hence $x>1$. On this domain, $(x-1)(x+1)=3$, so $x^2=4$. Reject −2. At 2, $\\ln(1)+\\ln(3)=\\ln(3)$.',
      },
    },
    {
      id: 'square-log-domain',
      prompt: {
        fr: 'Résoudre $\\ln(x^2)=\\ln(9)$.',
        en: 'Solve $\\ln(x^2)=\\ln(9)$.',
      },
      choices: [
        {
          text: '$x=-3$ ou $x=3$',
          correct: true,
          feedback: {
            fr: 'Exact : le domaine est x≠0 ; les deux carrés valent 9.',
            en: 'Correct: the domain is x≠0; both squares equal 9.',
          },
        },
        {
          text: '$x=3$ seulement',
          feedback: {
            fr: 'C’est x², l’argument, qui doit être positif. x lui-même peut être négatif.',
            en: 'The argument x² must be positive. x itself may be negative.',
          },
        },
        {
          text: '$x=9$',
          feedback: {
            fr: 'L’injectivité donne x²=9, pas x=9.',
            en: 'Injectivity gives x²=9, not x=9.',
          },
        },
      ],
      solution: {
        fr: 'Domaine : $x\\ne0$. L’injectivité donne $x^2=9$, donc $x\\in\\{-3,3\\}$. Les deux valeurs vérifient l’équation. Identité valable : $\\ln(x^2)=2\\ln|x|$.',
        en: 'Domain: $x\\ne0$. Injectivity gives $x^2=9$, hence $x\\in\\{-3,3\\}$. Both values satisfy the equation. Valid identity: $\\ln(x^2)=2\\ln|x|$.',
      },
    },
  ],
  L42: [
    {
      id: 'isolate-power',
      prompt: { fr: 'Résoudre $5\\cdot2^x=80$.', en: 'Solve $5\\cdot2^x=80$.' },
      choices: [
        {
          text: '$x=16$',
          feedback: {
            fr: '16 est la valeur de 2ˣ après division par 5. Quel exposant produit 16 ?',
            en: '16 is the value of 2ˣ after dividing by 5. Which exponent produces 16?',
          },
        },
        {
          text: '$x=4$',
          correct: true,
          feedback: {
            fr: 'Exact : 2ˣ=16=2⁴ ; 5×16=80.',
            en: 'Correct: 2ˣ=16=2⁴; 5×16=80.',
          },
        },
        {
          text: '$x=\\ln(80)/\\ln(2)$',
          feedback: {
            fr: 'Isolez d’abord la puissance en divisant par 5. Sinon, vous résolvez 2ˣ=80.',
            en: 'First isolate the power by dividing by 5. Otherwise you solve 2ˣ=80.',
          },
        },
      ],
      solution: {
        fr: 'Sur $\\mathbb R$, diviser par 5 donne $2^x=16=2^4$. La base 2 est injective, donc $x=4$. Substitution : $5\\cdot2^4=80$.',
        en: 'On $\\mathbb R$, dividing by 5 gives $2^x=16=2^4$. Base 2 is one-to-one, so $x=4$. Substitution: $5\\cdot2^4=80$.',
      },
    },
    {
      id: 'exact-base-change',
      prompt: {
        fr: 'Pour $2^x=7$, quelle est la valeur exacte de x ?',
        en: 'For $2^x=7$, what is the exact value of x?',
      },
      choices: [
        {
          text: '$x=\\ln(7)/\\ln(2)$',
          correct: true,
          feedback: {
            fr: 'Exact : ln7 est au numérateur, ln2 au dénominateur. Gardez cette forme avant d’arrondir.',
            en: 'Correct: ln7 is the numerator and ln2 the denominator. Keep this form before rounding.',
          },
        },
        {
          text: '$x=\\ln(2)/\\ln(7)$',
          feedback: {
            fr: 'Le quotient est inversé : x ln2=ln7, donc on divise par ln2.',
            en: 'The quotient is reversed: x ln2=ln7, so divide by ln2.',
          },
        },
        {
          text: '$x=3.5$',
          feedback: {
            fr: 'Diviser 7 par 2 résoudrait 2x=7, pas 2ˣ=7.',
            en: 'Dividing 7 by 2 would solve 2x=7, not 2ˣ=7.',
          },
        },
      ],
      solution: {
        fr: 'Les membres sont positifs. $x\\ln(2)=\\ln(7)$, donc $x=\\ln(7)/\\ln(2)\\approx2.807355$. Vérification exacte : $2^x=e^{x\\ln(2)}=e^{\\ln(7)}=7$.',
        en: 'Both sides are positive. $x\\ln(2)=\\ln(7)$, so $x=\\ln(7)/\\ln(2)\\approx2.807355$. Exact check: $2^x=e^{x\\ln(2)}=e^{\\ln(7)}=7$.',
      },
    },
    {
      id: 'decreasing-base',
      prompt: { fr: 'Résoudre $(1/2)^x=8$.', en: 'Solve $(1/2)^x=8$.' },
      choices: [
        {
          text: '$x=3$',
          feedback: {
            fr: 'À 3, la puissance vaut 1/8. Un exposant négatif inverse cette fraction.',
            en: 'At 3, the power is 1/8. A negative exponent inverts this fraction.',
          },
        },
        {
          text: '$\\varnothing$',
          feedback: {
            fr: 'Une base entre 0 et 1 est autorisée ; sa fonction puissance est décroissante et injective.',
            en: 'A base between 0 and 1 is valid; its power function is decreasing and one-to-one.',
          },
        },
        {
          text: '$x=-3$',
          correct: true,
          feedback: {
            fr: 'Exact : (1/2)⁻³=2³=8. Une base décroissante reste injective.',
            en: 'Correct: (1/2)⁻³=2³=8. A decreasing base remains one-to-one.',
          },
        },
      ],
      solution: {
        fr: 'Base $a=1/2>0$ et $a\\ne1$. $x=\\ln(8)/\\ln(1/2)=-3$. Substitution : $(1/2)^{-3}=8$.',
        en: 'Base $a=1/2>0$ and $a\\ne1$. $x=\\ln(8)/\\ln(1/2)=-3$. Substitution: $(1/2)^{-3}=8$.',
      },
    },
  ],
};
