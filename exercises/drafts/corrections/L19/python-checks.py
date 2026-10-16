"""Finite execution corroboration for L19; not a proof over all real lists."""
from itertools import product
count = 0
for n in range(5):
    for values in product([0, 1, 2], repeat=n):
        t = list(values)
        starts = [i for i in range(n) if i + 1 < n]
        assert starts == list(range(n-1))
        assert len(starts) == max(n-1, 0)
        ascending = all(t[i] <= t[i+1] for i in range(n-1))
        descending_pair = any(t[i] > t[i+1] for i in range(n-1))
        assert ascending == (not descending_pair)
        duplicate = any(t[i] == t[j] for i in range(n) for j in range(i+1, n))
        assert duplicate == (len(set(t)) != n)
        maximum = any(all(t[j] <= t[i] for j in range(n)) for i in range(n))
        assert maximum == bool(t)
        for i in range(n):
            assert all(t[j] <= t[i] for j in range(n)) == (t[i] == max(t))
        count += 1
print(f'PASS: all {count} lists over {{0,1,2}}, lengths 0..4; count/sortedness/duplicates/maximum and every fixed-index certificate.')
print('Scope: exhaustive finite list domain only; total-order arguments in the review supply the general justification.')
