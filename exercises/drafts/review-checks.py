"""Reproduce finding counterexamples and finite SQL/Python checks; no bank-key verifier."""
import json
import sqlite3
import sys
from itertools import product

print('Scope: finding counterexamples and finite executions; not automatic choice-key coverage')
print('Python:', sys.version.split()[0], 'SQLite:', sqlite3.sqlite_version)
implies = lambda a, b: not a or b
print('L06 converse comparison:', [(a, b, implies(a,b), implies(b,a)) for a,b in product([False,True], repeat=2)])
assert implies(False, True) and not implies(True, False)
print('L12/L16 empty domain: forall not P =', all([]), '; not forall P =', not all([]))
assert all([]) and not (not all([]))
A = {frozenset()}
power_A = {frozenset(), frozenset(A)}
print('L14 A={empty}: empty belongs to A and P(A):', frozenset() in A and frozenset() in power_A)
assert frozenset() in A and frozenset() in power_A
for t in [[], [1], [1,3,2], [1,1], [1,2,3]]:
    n = len(t)
    sorted_value = all(t[i] <= t[i+1] for i in range(n-1))
    descent = any(t[i] > t[i+1] for i in range(n-1))
    has_max = any(all(t[j] <= t[i] for j in range(n)) for i in range(n))
    try:
        wrong_range = all(t[i] <= t[i+1] for i in range(n))
    except IndexError:
        wrong_range = 'IndexError'
    print('L19', json.dumps(t), 'pairs=',len(range(n-1)), 'n-1=',n-1,
          'all=',sorted_value,'any-descent=',descent,'max-exists=',has_max,'range(n)=',wrong_range)
    assert sorted_value == (not descent)
assert len(range(-1)) == 0 and -1 != len(range(-1))
t = [float('nan'), 1.0]
le = all(t[i] <= t[i+1] for i in range(len(t)-1))
gt = any(t[i] > t[i+1] for i in range(len(t)-1))
print('L19 NaN counterexample: not all <= =',not le,'; any > =',gt)
assert not le and not gt
try:
    (1+1j) <= (2+1j)
except TypeError:
    print('L19 complex numeric comparison: TypeError')
else:
    raise AssertionError('Expected complex comparison TypeError')
# A model where necessity and sufficiency both hold disproves the inference
# from only-managers to the failure of sufficiency.
users, requests = ['ana','ben'], ['r1','r2']
M = lambda u: u == 'ana'
V = lambda u,r: M(u)
only_managers = all(implies(V(u,r),M(u)) for u in users for r in requests)
all_managers = all(implies(M(u),V(u,r)) for u in users for r in requests)
print('L20 only-managers=',only_managers,'; every manager can approve all=',all_managers)
assert only_managers and all_managers
c = sqlite3.connect(':memory:')
c.executescript("CREATE TABLE Student(id TEXT); CREATE TABLE Enrolled(student TEXT,course TEXT); INSERT INTO Student VALUES ('lia'),('max'),('noa'); INSERT INTO Enrolled VALUES ('lia','art'),('max','bio'),('noa','bio');")
for q in ["SELECT e.student FROM Enrolled e WHERE e.course = 'bio';", "SELECT s.id FROM Student s WHERE NOT EXISTS (SELECT * FROM Enrolled e WHERE e.student = s.id AND e.course = 'art');"]:
    rows = sorted(x[0] for x in c.execute(q))
    print('L18',q,'=>',json.dumps(rows))
    assert rows == ['max','noa']
print('All reproduction assertions passed. These expose/confirm the stated cases only.')
