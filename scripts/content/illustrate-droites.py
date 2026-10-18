"""Reproduce original teaching SVGs: Python 3, matplotlib, numpy (authoring only).

Run from the repository root. The PDF is not needed or redistributed. Mathematical
examples/data follow Droites PDF pages cited in the lessons; plots are original.
Anscombe data: R datasets/anscombe, https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/anscombe.html
"""
from pathlib import Path
import re
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
from matplotlib.ticker import MaxNLocator
import numpy as np

ROOT=Path(__file__).resolve().parents[2]
GREEN='#19704b'
INK='#202520'
OTHER='#715039'
PAPER='#fffdf8'
X=np.array([8.2,7.0,6.5,5.3,5.2,4.0,4.6,4.5,4.2,3.7])
Y=np.array([5.0,4.7,4.6,4.4,4.3,4.1,4.2,4.2,4.2,4.1])
ANS_X=np.array([10,8,13,9,11,14,6,4,12,7,5])
ANS_Y=[
 [8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],
 [9.14,8.14,8.74,8.77,9.26,8.10,6.13,3.10,9.13,7.26,4.74],
 [7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73],
 [6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.50,5.56,7.91,6.89],
]
ANS_X4=np.array([8,8,8,8,8,8,8,19,8,8,8])

plt.rcParams.update({'font.size':13,'axes.titlesize':15,'axes.labelsize':13,
 'xtick.labelsize':12,'ytick.labelsize':12,'svg.fonttype':'none',
 'svg.hashsalt':'droites-teaching-v1','axes.edgecolor':INK,'text.color':INK,
 'axes.labelcolor':INK,'xtick.color':INK,'ytick.color':INK,
 'figure.facecolor':PAPER,'axes.facecolor':PAPER,'lines.linewidth':2})

def fit(x,y):
    dx=x-x.mean();dy=y-y.mean()
    m=(dx@dy)/(dx@dx)
    return m,y.mean()-m*x.mean()

def frame(xlim=(-3,4),ylim=(-3,4),equal=True,title=None):
    fig,ax=plt.subplots(figsize=(4.4,3.6),layout='constrained')
    ax.set_xlim(*xlim);ax.set_ylim(*ylim)
    ax.xaxis.set_major_locator(MaxNLocator(5,integer=True))
    ax.yaxis.set_major_locator(MaxNLocator(5,integer=True))
    ax.grid(alpha=.22,zorder=0)
    ax.set_xlabel('x');ax.set_ylabel('y',rotation=0)
    if equal:ax.set_aspect('equal',adjustable='box')
    if xlim[0]<=0<=xlim[1]:ax.axvline(0,color=INK,lw=.9)
    if ylim[0]<=0<=ylim[1]:ax.axhline(0,color=INK,lw=.9)
    ax.spines[['top','right']].set_visible(False)
    if title:ax.set_title(title,pad=10)
    return fig,ax

def blank():
    fig,ax=plt.subplots(figsize=(4.4,3.6),layout='constrained')
    ax.set_xlim(0,10);ax.set_ylim(0,8);ax.axis('off')
    return fig,ax

def dot(ax,x,y,label=None,offset=(6,7),marker='o',color=GREEN):
    ax.scatter([x],[y],s=38,c=color,marker=marker,zorder=5)
    if label:ax.annotate(label,(x,y),xytext=offset,textcoords='offset points',fontsize=12,zorder=6)

def line(ax,m,p,style='-',label=None,color=GREEN):
    xx=np.linspace(*ax.get_xlim(),200)
    ax.plot(xx,m*xx+p,style,color=color,label=label,zorder=2)

def save(fig,locale,name):
    path=ROOT/f'public/diagrams/droites/{locale}/{name}.svg'
    path.parent.mkdir(parents=True,exist_ok=True)
    fig.savefig(path,format='svg',metadata={'Date':None,'Creator':'Uni Math Course original teaching diagram'})
    path.write_text('\n'.join(line.rstrip() for line in path.read_text().splitlines())+'\n')
    plt.close(fig)

for locale in ('fr','en'):
    fr=locale=='fr'
    def done(fig,name):save(fig,locale,name)

    fig,ax=blank()
    for x,y,w,h,label,alpha in [(2,2,3,3,'a²',.12),(5,2,2,3,'ab',.25),(2,5,3,2,'ab',.25),(5,5,2,2,'b²',.4)]:
        ax.add_patch(Rectangle((x,y),w,h,facecolor=GREEN,alpha=alpha,edgecolor=INK))
        ax.add_patch(Rectangle((x,y),w,h,fill=False,edgecolor=INK,lw=1.4))
        ax.text(x+w/2,y+h/2,label,ha='center',va='center',fontsize=20)
    for x,t in [(3.5,'a'),(6,'b')]:ax.text(x,1.4,t,ha='center',fontsize=18)
    for y,t in [(3.5,'a'),(6,'b')]:ax.text(1.4,y,t,va='center',fontsize=18)
    ax.set_aspect('equal');done(fig,'identity-area')

    fig,ax=blank()
    for row,filled,text in [(6,3,'1/2 = 3/6'),(3.5,2,'1/3 = 2/6'),(1,5,'3/6 + 2/6 = 5/6')]:
        for j in range(6):ax.add_patch(Rectangle((1+j*1.25,row),1.25,.9,facecolor=GREEN if j<filled else PAPER,edgecolor=INK,alpha=.7 if j<filled else 1))
        ax.text(1,row+1.15,text,fontsize=16)
    done(fig,'fractions')

    fig,ax=frame((-3,4),(-1,1),title='x < 2')
    ax.set_aspect('auto');ax.set_yticks([]);ax.set_ylabel('');ax.set_xlabel('x')
    ax.annotate('',(-3,0),(2,0),arrowprops={'arrowstyle':'->','color':GREEN,'lw':4})
    ax.scatter([2],[0],s=130,facecolor=PAPER,edgecolor=GREEN,lw=2.5,zorder=5)
    done(fig,'inequality')

    fig,ax=blank()
    ax.text(5,6.7,r'$\sum_{i=1}^{3} a_i = a_1 + a_2 + a_3$',ha='center',fontsize=21)
    for j,v in enumerate([2,5,8]):
        x=1+j*3
        ax.text(x+1,5.3,f'i = {j+1}',ha='center')
        ax.annotate('',(x+1,3.8),(x+1,4.8),arrowprops={'arrowstyle':'->','color':INK})
        ax.add_patch(Rectangle((x,2.5),2,1.2,facecolor=GREEN,alpha=.12,edgecolor=INK))
        ax.text(x+1,3.1,str(v),ha='center',va='center',fontsize=22)
    ax.text(5,1,'2 + 5 + 8 = 15',ha='center',fontsize=20);done(fig,'sigma')

    fig,ax=frame((0,10),(-1,2),equal=False,title='x̄ = (2 + 5 + 8) / 3 = 5')
    ax.set_yticks([]);ax.set_ylabel('')
    for x in [2,5,8]:dot(ax,x,0,str(x),offset=(-3,-22))
    for x,label in [(2,'−3'),(8,'+3')]:
        ax.annotate('',(x,.7),(5,.7),arrowprops={'arrowstyle':'->','color':GREEN,'lw':2})
        ax.text((x+5)/2,.9,label,ha='center')
    ax.axvline(5,color=INK,ls=':',lw=1.5);done(fig,'mean')

    fig,ax=frame((-3,4),(-3,4))
    for x,y,label,off in [(3,2,'A(3,2)',(-4,-23)),(2,3,'B(2,3)',(-5,10)),(-2,1,'C(−2,1)',(-26,10)),(-1,-2,'D(−1,−2)',(-23,-23))]:
        ax.plot([x,x,0],[0,y,y],':',color=GREEN,lw=1)
        dot(ax,x,y,label,off)
    done(fig,'coordinates')

    fig,ax=frame((0,6),(0,7))
    ax.plot([1,4,4],[1,1,5],'--',color=OTHER)
    ax.plot([1,4],[1,5],color=GREEN,lw=3)
    dot(ax,1,1,'A(1,1)',offset=(-20,8));dot(ax,4,5,'B(4,5)',offset=(3,8))
    ax.text(2.5,.5,'Δx = 3',ha='center');ax.text(4.2,2.8,'Δy = 4');ax.text(1.2,3.2,'d = 5')
    ax.add_patch(Rectangle((3.7,1),.3,.3,fill=False,edgecolor=INK));done(fig,'distance')

    for name in ['gallery-line','gallery-circle','gallery-parabola','gallery-sideways']:
        fig,ax=frame((-3,3),(-3,4))
        if name=='gallery-line':line(ax,2,1)
        elif name=='gallery-circle':
            t=np.linspace(0,2*np.pi,300);ax.plot(2*np.cos(t),2*np.sin(t),color=GREEN)
        elif name=='gallery-parabola':
            t=np.linspace(-2.2,2.2,250);ax.plot(t,t*t,color=GREEN)
        else:
            t=np.linspace(-2.2,2.2,250);ax.plot(t*t,t,color=GREEN)
        done(fig,name)

    fig,ax=frame((-2,3),(-2,6),title='y = 2x + 1')
    line(ax,2,1)
    for x in [-1,0,1,2]:dot(ax,x,2*x+1)
    done(fig,'line-table')
    fig,ax=frame((-1,3),(-1,5),title='m = Δy / Δx = 2 / 1')
    line(ax,2,1);ax.plot([0,1,1],[1,1,3],'--',color=OTHER)
    dot(ax,0,1,'(0,p)',offset=(-1,-25));dot(ax,1,3)
    ax.text(.1,.5,'Δx = 1');ax.text(1.15,1.7,'Δy = 2');done(fig,'slope')
    fig,ax=frame((-2,3),(-3,6),title='y = mx + 1')
    for m,style,c in [(2,'-',GREEN),(1,'--',INK),(0,':',OTHER),(-.5,'-.','#536d8b')]:line(ax,m,1,style,label=f'm = {m:g}',color=c)
    ax.legend(loc='upper left',fontsize=10);done(fig,'vary-slope')
    fig,ax=frame((-3,3),(-5,6),title='y = (7/5)x + p')
    for p,style,c in [(2,'-',GREEN),(0,'--',INK),(-2,':',OTHER)]:line(ax,7/5,p,style,label=f'p = {p}',color=c)
    ax.legend(loc='upper left',fontsize=11);done(fig,'vary-intercept')

    fig,ax=frame((-65,45),(-70,90),equal=False)
    ax.set_xlabel('C (°C)');ax.set_ylabel('F (°F)')
    line(ax,1.8,32,label='F = 1.8C + 32');line(ax,1,0,'--',label='F = C',color=OTHER)
    dot(ax,-40,-40,'(−40,−40)',offset=(8,-20));ax.legend(fontsize=10,loc='upper left');done(fig,'temperature')
    for name in ['intersection-one','intersection-none','intersection-many']:
        fig,ax=frame((-2,3),(-2,7))
        line(ax,2,1,label='y = 2x + 1')
        if name=='intersection-one':
            line(ax,-1,4,'--',label='y = −x + 4',color=OTHER);dot(ax,1,3,'(1,3)',offset=(10,7))
        elif name=='intersection-none':line(ax,2,5,'--',label='y = 2x + 5',color=OTHER)
        else:line(ax,2,1,':',label='2y = 4x + 2',color=OTHER)
        ax.legend(fontsize=10,loc='upper left');done(fig,name)

    fig,ax=frame((-2,4),(-2,7))
    t=np.linspace(-2,4,200)
    ax.fill_between(t,2*t+1,7,where=2*t+1<=7,facecolor=GREEN,alpha=.12,hatch='//',edgecolor=GREEN)
    line(ax,2,1,'--',label='y = 2x + 1')
    dot(ax,0,3,'(0,3): f > 0',offset=(-38,12));dot(ax,2,0,'(2,0): f < 0',offset=(-20,-25))
    done(fig,'halfplanes')
    fig,ax=frame((-1,5),(-1,4))
    ax.add_patch(Polygon([(0,0),(4,0),(0,3)],facecolor=GREEN,alpha=.15,hatch='//',edgecolor=INK,lw=2))
    ax.plot([0,4,0,0],[0,0,3,0],color=GREEN)
    for x,y,t,off in [(0,0,'A',(-15,-18)),(4,0,'B',(5,4)),(0,3,'C',(4,6))]:dot(ax,x,y,t,off)
    dot(ax,1,1,'(1,1)',offset=(4,7));dot(ax,3,2,'(3,2)',marker='x',color=OTHER)
    done(fig,'triangle')

    fig,ax=plt.subplots(figsize=(4.4,3.6),layout='constrained')
    ax.set_xlim(-.5,7.5);ax.set_ylim(5.5,-.5);ax.set_aspect('equal')
    ax.set_xticks(range(8));ax.set_yticks(range(6));ax.xaxis.tick_top();ax.xaxis.set_label_position('top')
    ax.set_xlabel('u →');ax.set_ylabel('v ↓',rotation=0)
    for x in range(9):ax.axvline(x-.5,color=INK,lw=.5)
    for y in range(7):ax.axhline(y-.5,color=INK,lw=.5)
    ax.add_patch(Rectangle((4.5,1.5),1,1,facecolor=GREEN,alpha=.2))
    dot(ax,5,2,'(5,2)',offset=(3,20),marker='x');done(fig,'pixels')
    fig,ax=plt.subplots(figsize=(4.4,3.6),layout='constrained')
    ax.set_xlim(0,800);ax.set_ylim(600,0);ax.set_aspect('equal')
    ax.set_xticks([0,400,800]);ax.set_yticks([0,300,600]);ax.xaxis.tick_top();ax.xaxis.set_label_position('top')
    ax.set_xlabel('u →');ax.set_ylabel('v ↓',rotation=0)
    ax.axvline(400,color=INK,lw=1);ax.axhline(300,color=INK,lw=1)
    ax.annotate('y ↑',(400,60),ha='center',fontsize=13)
    ax.annotate('x →',(720,285),fontsize=13)
    dot(ax,400,300,'O',offset=(-18,-20))
    dot(ax,500,250,'(500,250)',offset=(3,8))
    ax.plot([400,500,500],[300,300,250],'--',color=GREEN)
    done(fig,'screen')

    def pixel_segment(name,dx,dy,by_rows=False,holes=False):
        fig,ax=frame((-1,dx+1),(-1,dy+1))
        ax.plot([0,dx],[0,dy],color=OTHER)
        if by_rows:coords=[(int(np.floor(y*dx/dy+.5)),y) for y in range(dy+1)]
        else:coords=[(x,int(np.floor(x*dy/dx+.5))) for x in range(dx+1)]
        for x,y in coords:
            ax.add_patch(Rectangle((x-.45,y-.45),.9,.9,facecolor=GREEN,alpha=.25,edgecolor=INK))
            ax.plot(x,y,'o',color=INK,ms=3)
        done(fig,name)
    pixel_segment('raster-gentle',5,2)
    pixel_segment('raster-holes',3,8)
    pixel_segment('raster-fixed',3,8,True)
    fig,ax=frame((-.6,2.3),(-.6,2.2),title='E / NE / M')
    for x,y in [(0,0),(1,0),(1,1)]:ax.add_patch(Rectangle((x-.45,y-.45),.9,.9,facecolor=GREEN,alpha=.12,edgecolor=INK))
    line(ax,.8,0,color=OTHER)
    dot(ax,0,0,'(x,y)',offset=(2,-24));dot(ax,1,0,'E',offset=(15,-9));dot(ax,1,1,'NE',offset=(10,10))
    dot(ax,1,.5,'M',offset=(15,0),marker='x',color=OTHER)
    done(fig,'bresenham')

    def stats_axes():
        fig,ax=frame((3,9),(3.7,5.3),equal=False)
        ax.set_xlabel('Margarine (lb / personne / an)' if fr else 'Margarine (lb / person / year)',fontsize=10)
        ax.set_ylabel('Divorces / 1000',fontsize=11,rotation=90,labelpad=8)
        ax.yaxis.set_major_locator(MaxNLocator(4))
        return fig,ax
    fig,ax=stats_axes();ax.scatter(X,Y,color=GREEN,s=32);done(fig,'margarine')
    fig,ax=stats_axes();ax.scatter(X,Y,color=INK,s=25)
    m,p=fit(X,Y);line(ax,m,p,label='A');line(ax,.1,3.8,'--',label='B',color=OTHER)
    ax.legend(fontsize=11);done(fig,'regression-models')
    fig,ax=frame((-.5,3),(-.5,5),equal=False,title='ŷ = x + 1')
    line(ax,1,1)
    for j,(x,y) in enumerate([(0,2),(1,1.5),(2,4)]):
        ax.plot([x,x],[x+1,y],'--',color=OTHER,lw=2)
        dot(ax,x,y);ax.annotate(f'e{j+1}',(x,(y+x+1)/2),xytext=(7,0),textcoords='offset points')
    done(fig,'residuals')
    fig,ax=frame((-7,1),(-10,10),equal=False,title='y = (x + 3)² − 8')
    t=np.linspace(-7,1,300);ax.plot(t,(t+3)**2-8,color=GREEN)
    ax.axvline(-3,color=INK,ls=':',lw=1);dot(ax,-3,-8,'(−3,−8)',offset=(8,9));done(fig,'complete-square')
    fig,ax=stats_axes();selected=[0,3,5,9];other=[j for j in range(10) if j not in selected]
    ax.scatter(X[other],Y[other],color=INK,marker='x',s=36,label='6 autres' if fr else '6 others')
    ax.scatter(X[selected],Y[selected],color=GREEN,s=40,label='4 du calcul' if fr else '4 fitted')
    m,p=fit(X[selected],Y[selected]);line(ax,m,p)
    ax.scatter([5.3],[4.4],color=OTHER,marker='D',s=55,label='Moyenne' if fr else 'Mean')
    ax.legend(fontsize=9,loc='upper left');done(fig,'regression-four')
    for j,y in enumerate(ANS_Y):
        xx=ANS_X4 if j==3 else ANS_X
        fig,ax=frame((2,21),(2,14),equal=False,title=f'Anscombe {j+1}')
        ax.scatter(xx,y,color=GREEN,s=32)
        m,p=fit(xx,np.array(y));line(ax,m,p,'--',color=OTHER)
        done(fig,f'anscombe-{j+1}')
    fig,ax=frame((-1,7),(-3,7),equal=False)
    ax.scatter(range(6),range(6),color=GREEN,s=35)
    dot(ax,6,-2,'(6,−2)',offset=(-57,7),marker='x',color=OTHER)
    line(ax,1,0,label='Sans ajout' if fr else 'Before')
    line(ax,1/7,10/7,'--',label='Avec ajout' if fr else 'After',color=OTHER)
    ax.legend(fontsize=11,loc='upper left');done(fig,'outlier')
    fig,ax=frame((0,20),(-2,9),equal=False)
    ax.set_xlabel('t (années après 2000)' if fr else 't (years after 2000)',fontsize=11)
    ax.set_ylabel('Margarine (lb)',fontsize=11,rotation=90,labelpad=8)
    ax.axvspan(9,20,facecolor=OTHER,alpha=.09,hatch='//')
    ax.plot(np.arange(10),X,'o',color=GREEN)
    line(ax,-.445,7.32);ax.axvline(9,color=INK,ls=':',lw=1)
    dot(ax,7.32/.445,0,'t ≈ 16.45',offset=(-55,18));done(fig,'extrapolation')

if __name__=='__main__':
    referenced=set()
    for i in range(21,37):
        for locale in ('fr','en'):
            text=(ROOT/f'content/lessons/L{i}/{locale}.md').read_text()
            referenced.update(re.findall(r'/diagrams/droites/[^" ]+\.svg',text))
    assert all((ROOT/'public'/p.lstrip('/')).is_file() for p in referenced)
    print(f'Generated {len(referenced)} referenced bilingual teaching SVGs.')
