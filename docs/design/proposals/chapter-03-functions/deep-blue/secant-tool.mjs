import { f, derivative, secantSlope } from './secant-math.mjs';

// Review-only client-side learning tool. No grading, storage, or network access.
const root = document.querySelector('[data-secant-lab]');
if (root) {
  const fr = document.documentElement.lang === 'fr';
  const text = fr ? {
    secant:'Sécante PQ',limit:'h = 0 : tangente en P (limite)',
    left:'h < 0 : Q est à gauche de P et la pente approche aussi 1.',
    normal:'La pente vaut 1 + h/2. Rapprochez Q de P pour observer la limite.',
    zero:'À h = 0, le quotient est indéfini (0/0). La dérivée est sa limite.',
    h:'Écart h',slope:'Pente'
  } : {
    secant:'Secant PQ',limit:'h = 0: tangent at P (limit)',
    left:'h < 0: Q is left of P, and the slope still approaches 1.',
    normal:'The slope is 1 + h/2. Bring Q closer to P to see the limit.',
    zero:'At h = 0 the quotient is undefined (0/0). The derivative is its limit.',
    h:'Gap h',slope:'Slope'
  };
  const $ = selector => root.querySelector(selector);
  const svg = $('[data-plot]'), slider = $('[data-h]'), q = $('[data-q]');
  const p = $('[data-p]'), qCenter = $('[data-q-center]');
  const curve = $('[data-curve]'), secant = $('[data-secant]'), tangent = $('[data-tangent]');
  const hLine = $('[data-hline]'), vLine = $('[data-vline]');
  const qLabel = $('[data-label-q]'), pLabel = $('[data-label-p]'), hLabel = $('[data-label-h]');
  const X = x => 48 + (x + 2.2) * 624/5.8;
  const Y = y => 440 - (y + 0.5) * 395/7.3;
  const point = (node,x,y) => {node.setAttribute('cx',X(x));node.setAttribute('cy',Y(y));};
  const label = (node,x,y) => {node.setAttribute('x',X(x));node.setAttribute('y',Y(y));};
  curve.setAttribute('d',Array.from({length:260},(_,i)=>{
    const x=-2.2+i*5.8/259;
    return (i?'L':'M')+X(x).toFixed(2)+' '+Y(f(x)).toFixed(2);
  }).join(' '));
  point(p,1,f(1)); label(pLabel,0.76,0.2);
  const line = (el,slope,visible) => {
    el.setAttribute('x1',X(-2.2));el.setAttribute('x2',X(3.6));
    el.setAttribute('y1',Y(f(1)+slope*(-3.2)));
    el.setAttribute('y2',Y(f(1)+slope*(2.6)));
    el.style.display = visible?'':'none';
  };
  function update(raw,announce=false) {
    let h = Math.min(2.5,Math.max(-2.5,Number(raw)));
    if(!Number.isFinite(h)) h=2;
    h = Math.round(h*100)/100;
    if(Math.abs(h)<.006)h=0;
    slider.value=String(h);
    const qx=1+h, qy=f(qx), m=secantSlope(1,h);
    point(q,qx,qy); point(qCenter,qx,qy);
    label(qLabel,qx+(h<0?-.28:.14),qy+(h<0?-.22:.35));
    qLabel.style.display=h===0?'none':'';
    hLine.setAttribute('x1',X(1));hLine.setAttribute('x2',X(qx));
    hLine.setAttribute('y1',Y(.5));hLine.setAttribute('y2',Y(.5));
    vLine.setAttribute('x1',X(qx));vLine.setAttribute('x2',X(qx));
    vLine.setAttribute('y1',Y(.5));vLine.setAttribute('y2',Y(qy));
    hLine.style.display=vLine.style.display=Math.abs(h)<.03?'none':'';
    label(hLabel,1+h/2,.5+(h<0?.27:-.19));
    hLabel.textContent=h>0?'+h':'h';
    hLabel.style.display=Math.abs(h)<.03?'none':'';
    line(secant,m??derivative(1),h!==0);
    line(tangent,derivative(1),true);
    const fmt=n=>n.toLocaleString(fr?'fr-FR':'en-US',{maximumFractionDigits:3});
    $('[data-h-value]').textContent=fmt(h);
    $('[data-slope]').textContent=m===null?'→ '+fmt(1):fmt(m);
    $('[data-q-coordinates]').textContent='('+fmt(qx)+' ; '+fmt(qy)+')';
    $('[data-formula]').textContent=m===null ?
      "f′(1) = limₕ→₀ [f(1+h) − f(1)] / h = 1" :
      '[f(1+h) − f(1)] / h = 1 + h/2 = '+fmt(m);
    $('[data-status]').textContent=m===null?text.limit:text.secant;
    $('[data-explanation]').textContent=m===null?text.zero:h<0?text.left:text.normal;
    q.setAttribute('aria-valuenow',String(h));
    q.setAttribute('aria-valuetext','h = '+fmt(h)+', '+text.slope+' = '+fmt(m??1));
    if(announce)$('[data-live]').textContent=text.h+': '+fmt(h)+'. '+text.slope+': '+fmt(m??1);
  }
  slider.addEventListener('input',()=>update(slider.value,true));
  root.querySelectorAll('[data-set-h]').forEach(button=>{
    button.addEventListener('click',()=>update(button.dataset.setH,true));
  });
  $('[data-reset]').addEventListener('click',()=>update(2,true));
  let dragging=false;
  function drag(event) {
    const transform=svg.getScreenCTM();
    if(!transform)return;
    const pt=svg.createSVGPoint();pt.x=event.clientX;pt.y=event.clientY;
    const x=pt.matrixTransform(transform.inverse()).x;
    update(Math.round(((-2.2+(x-48)*5.8/624)-1)*100)/100,true);
  }
  q.addEventListener('pointerdown',event=>{
    event.preventDefault();dragging=true;q.setPointerCapture(event.pointerId);drag(event);
  });
  q.addEventListener('pointermove',event=>{if(dragging)drag(event);});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])
    q.addEventListener(name,()=>{dragging=false;});
  q.addEventListener('keydown',event=>{
    const delta=['ArrowLeft','ArrowDown'].includes(event.key)?-.01:
      ['ArrowRight','ArrowUp'].includes(event.key)?.01:0;
    if(!delta)return;
    event.preventDefault();
    update(Number(slider.value)+delta,true);
  });
  update(2);
}
