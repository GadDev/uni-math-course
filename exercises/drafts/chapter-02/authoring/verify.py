"""Exact supplemental checks of authored statements and all original candidates.
Run with SymPy installed; no app dependency is added. Conceptual arguments are
enumerated explicitly as manual self-checks, never counted as computed proofs.
"""
from pathlib import Path
import json
import sympy as s

env={name:getattr(s,name) for name in ['Integer','Rational','sqrt','Abs','FiniteSet','Tuple','Interval','Union','Eq','S','solveset','linsolve','expand','simplify','Sum','symbols','Matrix','And','Or','solve','ceiling']}
env.update({str(v):v for v in s.symbols('a b c x y z m p t u v',real=True)})
env['i']=s.Symbol('i',integer=True)
def equal(a,b):
    if isinstance(a,s.Set) and isinstance(b,s.Set): return a.symmetric_difference(b)==s.EmptySet
    if isinstance(a,(s.Tuple,tuple,list)) and isinstance(b,(s.Tuple,tuple,list)): return len(a)==len(b) and all(equal(x,y) for x,y in zip(a,b))
    return s.simplify(a-b)==0
report=[]
for folder in sorted(Path('exercises/drafts').glob('L*')):
    if not 21<=int(folder.name[1:])<=36: continue
    bank=json.loads((folder/'v1.draft.json').read_text())
    checks=json.loads((folder/'answer-checks.json').read_text())
    for exercise,check in zip(bank['exercises'],checks):
        assert exercise['id']==check['id'] and exercise['answer']==check['correctOption']
        if check['kind']=='calculation':
            value=s.sympify(check['expression'],locals=env)
            candidates=[s.sympify(x,locals=env) for x in check['candidates']]
            matches=[equal(value,x) for x in candidates]
            assert matches==[True,False,False],(check['id'],value,candidates,matches)
            report.append({'id':check['id'],'scope':'exact-symbolic-or-numeric','value':str(value),'candidateMatches':matches})
        else:
            assert len(check['argument'])>60,check['id']
            report.append({'id':check['id'],'scope':'recorded-mathematical-argument; manual author self-check','argument':check['argument']})
# Independently check the worked regression example with exact rational arithmetic.
points=[(s.Integer(0),s.Integer(1)),(s.Integer(1),s.Integer(2)),(s.Integer(2),s.Integer(2))]
xb=sum(x for x,y in points)/len(points); yb=sum(y for x,y in points)/len(points)
sxx=sum((x-xb)**2 for x,y in points); sxy=sum((x-xb)*(y-yb) for x,y in points)
slope=sxy/sxx; intercept=yb-slope*xb
residuals=[y-slope*x-intercept for x,y in points]
assert (slope,intercept,sum(e**2 for e in residuals))==(s.Rational(1,2),s.Rational(7,6),s.Rational(1,6))
# Execute the actual lesson's Python block, rather than a separately copied implementation.
import re
code=re.search(r'```python\n(.*?)\n```',Path('exercises/drafts/L35/en.md').read_text(),re.S).group(1)
namespace={}; exec(code,namespace)
assert namespace['fit'](points)==(slope,intercept)
for invalid in [[],[(1,2),(1,3)]]:
    try: namespace['fit'](invalid)
    except ValueError: pass
    else: raise AssertionError('Lesson fit() must reject empty/constant inputs')
# Exhaust all segments in the taught octant up to width 25, against exact nearest rounding.
for dx in range(1,26):
    for dy in range(dx+1):
        y=0; decision=2*dy-dx; pixels=[(0,0)]
        for x in range(dx):
            if decision>=0: y+=1; decision+=2*dy-2*dx
            else: decision+=2*dy
            pixels.append((x+1,y))
        expected=[(x,(2*dy*x+dx)//(2*dx)) for x in range(dx+1)]
        assert pixels==expected,(dx,dy,pixels,expected)
        assert pixels[-1]==(dx,dy)
        if (dx,dy)==(5,2): assert pixels==[(0,0),(1,0),(2,1),(3,1),(4,2),(5,2)]
out=Path('exercises/drafts/chapter-02/verification-results.json')
out.write_text(json.dumps({'verifier':'SymPy '+s.__version__,'independentPeerReview':False,'workedExamples':{'regression':'exact parameters, residuals, loss; executed lesson Python; rejected invalid inputs','rasterisation':'350 segments in taught octant, integer widths 1–25, exact nearest-pixel comparison including ties'},'checks':report},ensure_ascii=False,indent=2)+'\n')
print(f'{len(report)} keys: {sum(x["scope"]=="exact-symbolic-or-numeric" for x in report)} exact calculations; remaining conceptual arguments recorded, not automatically proved.')
