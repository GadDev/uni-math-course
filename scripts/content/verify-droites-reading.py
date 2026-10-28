"""Supplemental exact checks for the source-aligned reading revision.
Run from repository root with SymPy installed (authoring tool, not app runtime).
This checks named computations and identities, not natural-language semantics.
"""
from pathlib import Path
from fractions import Fraction as Q
import re
import sympy as s

checks=[]
def check(name,actual,expected):
    assert actual==expected,(name,actual,expected)
    checks.append(name)

x,a,b,c,m,p=s.symbols('x a b c m p',real=True)
check('L21 priorities',2+3*4**2,50)
check('L21 sign and base',-3**2+(-3)**2,0)
check('L21 group subtraction',7-(2-5),10)
check('L22 expansion',s.expand(3*(x-2)-2*(x+1)),x-8)
check('L22 common factor',s.expand(3*x*(2*x-3)),6*x*x-9*x)
check('L22 double distributivity',s.expand((x+2)*(x+3)),x*x+5*x+6)
check('L22 square sum',s.expand((a+b)**2),a*a+2*a*b+b*b)
check('L22 square difference',s.expand((a-b)**2),a*a-2*a*b+b*b)
check('L22 conjugates',s.expand((a+b)*(a-b)),a*a-b*b)
check('L22 mental arithmetic',(101**2,49**2,103*97),(10201,2401,9991))
check('L22 squared binomial',s.expand((2*x-3)**2),4*x*x-12*x+9)
check('L23 fraction sum',Q(1,2)+Q(1,3),Q(5,6))
check('L23 fraction difference',Q(3,4)-Q(1,6),Q(7,12))
check('L23 positive integer product power',s.expand((a*a*b)**3),a**6*b**3)
check('L24 affine equation',s.solve(3*x+5-11,x),[2])
check('L24 lost zero',s.solve(x*x-x,x),[0,1])
check('L24 strict inequality',s.solve_univariate_inequality(-2*x+4>0,x,relational=False),s.Interval.open(-s.oo,2))
check('L25 coffee prices',(Q(5,2)+2,2*Q(5,2)+2),(Q(9,2),7))
check('L26 summation rules',sum([2,5,8]),15)
check('L26 weighted mean',Q(2*10+8*20,10),18)
check('L26 unequal sizes equal means',Q(2*10+8*10,10),10)
check('L27 PDF distance',(4-1)**2+(5-1)**2,25)
check('L28 equivalent equations',s.expand(2*(2*x-b+1)),4*x-2*b+2)
check('L29 plotted table',[2*t+1 for t in [-1,0,1,2]],[-1,1,3,5])
check('L30 conversion',Q(212-32,100),Q(9,5))
check('L30 inverse conversion',(50-32)/Q(9,5),10)
check('L30 temperature intersection',s.solve(x-Q(9,5)*x-32,x),[-40])
check('L30 PDF intersection',s.solve(2*x+1-(-x+4),x),[1])
check('L31 halfplane signs',(3-2*0-1,0-2*2-1),(2,-5))
check('L31 triangle side',[(3*t+4*u)<=12 for t,u in [(0,0),(4,0),(0,3),(1,1),(3,2)]],[True,True,True,True,False])
check('L32 source transform',(400+50*2,300-50*1),(500,250))
check('L32 extra transform',(400+50*(-3),300-50*(-2)),(250,400))
check('L33 source gentle raster',[int(s.floor(Q(2,5)*t+Q(1,2))) for t in range(6)],[0,0,1,1,2,2])
check('L33 source steep raster',[int(s.floor(Q(3,8)*t+Q(1,2))) for t in range(9)],[0,0,1,1,2,2,2,3,3])
check('L35 supplemental completing square',s.expand((x+3)**2-8),x*x+6*x+1)
check('L35 extra completing square',s.expand((x-2)**2+3),x*x-4*x+7)
check('L35 positive-leading-coefficient square',s.expand(a*(m-b/a)**2+c-b*b/a),a*m*m-2*b*m+c)

def fit(points):
    n=len(points);xb=sum(t for t,u in points)/n;yb=sum(u for t,u in points)/n
    sxx=sum((t-xb)**2 for t,u in points);sxy=sum((t-xb)*(u-yb) for t,u in points)
    slope=sxy/sxx
    return xb,yb,sxx,sxy,slope,yb-slope*xb
four=[(s.Rational(t),s.Rational(u)) for t,u in [('8.2','5.0'),('5.3','4.4'),('4.0','4.1'),('3.7','4.1')]]
xb,yb,sxx,sxy,slope,intercept=fit(four)
check('L35 four-year table',(xb,yb,sxx,sxy),(s.Rational('5.3'),s.Rational('4.4'),s.Rational('12.66'),s.Rational('2.61')))
check('L35 four-year slope',slope,s.Rational(87,422))
check('L35 mean-point passage',slope*xb+intercept,yb)
check('L35 source prediction rounded',round(float(2*slope+intercept),2),3.72)
points=[(s.Integer(t),s.Integer(u)) for t,u in [(0,0),(1,1),(2,2),(3,3),(4,4),(5,5),(6,-2)]]
check('L36 extra outlier model',fit(points)[-2:],(s.Rational(1,7),s.Rational(10,7)))
ages=[s.Integer(i) for i in [2,4,6,8,10]]
heights=[s.Integer(i) for i in [87,103,116,128,139]]
check('L36 revised height fit',fit(list(zip(ages,heights)))[-2:],(s.Rational('6.45'),s.Rational('75.9')))
check('L36 revised height extrapolation',s.Rational('6.45')*30+s.Rational('75.9'),s.Rational('269.4'))
students=[(s.Integer(x),s.Integer(y)) for x,y in [(1,8),(2,9),(3,12),(4,14),(5,17)]]
check('L35 revised student table',fit(students),(3,12,10,23,s.Rational('2.3'),s.Rational('5.1')))
check('L35 revised student interpolation',s.Rational('2.3')*s.Rational('3.5')+s.Rational('5.1'),s.Rational('13.15'))
check('L35 revised student extrapolation',s.Rational('2.3')*10+s.Rational('5.1'),s.Rational('28.1'))
# Execute the published restricted-octant code, including every tie, in both languages.
for lang in ('fr','en'):
    text=next(Path('content/lessons/L33').glob(f'{lang}.md*')).read_text()
    namespace={}
    for code in re.findall(r'```python\n(.*?)\n```',text,re.S):exec(code,namespace)
    raster=namespace['raster']
    for u2 in range(1,41):
        for v2 in range(u2+1):
            expected=[(u,int(s.ceiling(Q(v2*u,u2)-Q(1,2)))) for u in range(u2+1)]
            assert raster(u2,v2)==expected,(lang,u2,v2)
    check(f'L33 {lang} tie chooses E',raster(2,1),[(0,0),(1,0),(2,1)])
    for endpoint in [(0,0),(2,3),(2,-1),(-1,0),(2.5,1)]:
        try:raster(*endpoint)
        except ValueError:pass
        else:raise AssertionError('Expected octant/domain rejection')


# Run all published Python snippets in reading order, in both languages.
for lang in ('fr','en'):
    text=Path(f'content/lessons/L35/{lang}.md').read_text()
    namespace={}
    for code in re.findall(r'```python\n(.*?)\n```',text,re.S):exec(code,namespace)
    check(f'L35 {lang} ten-point code output',(round(namespace['m'],4),round(namespace['p'],4)),(.2014,3.3086))
    for invalid in [[],[(1,2),(1,3)]]:
        try:namespace['fit'](invalid)
        except ValueError:pass
        else:raise AssertionError('Expected invalid-input rejection')

# Symbolic general argument for the two-stage loss decomposition.
u1,u2,u3,v1,v2,v3=s.symbols('u1 u2 u3 v1 v2 v3',real=True)
us=[u1,u2,u3];vs=[v1,v2,v3];ub=sum(us)/3;vb=sum(vs)/3
loss=sum((v-m*u-p)**2 for u,v in zip(us,vs))
centered=sum(((v-vb)-m*(u-ub))**2 for u,v in zip(us,vs))+3*(vb-m*ub-p)**2
check('L35 3-symbol loss decomposition',s.expand(loss-centered),0)
print(f'{len(checks)} named exact arithmetic/symbolic checks passed; published Python snippets executed; 860 raster segments per language checked including ties.')
print('The three-observation symbolic identity is a supplemental check; the general n proof is author-reviewed prose.')
