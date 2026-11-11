'use strict';
// reveal.js cuando hay internet; navegador normal con navegación de respaldo si no lo hay.
if (typeof Reveal !== 'undefined') {
  Reveal.initialize({hash:true,transition:'slide',transitionSpeed:'fast',slideNumber:'c/t',width:1280,height:720,margin:0.04,center:true,controls:true,progress:true,backgroundTransition:'fade'});
} else {
  document.body.classList.add('fallback');
  const sections=[...document.querySelectorAll('.slides > section')]; let at=0;
  const nav=document.createElement('div');nav.className='fallback-nav';
  nav.innerHTML='<button type="button" id="fallbackPrev" aria-label="Anterior">←</button> <span id="fallbackCount"></span> <button type="button" id="fallbackNext" aria-label="Siguiente">→</button>';
  document.body.appendChild(nav);
  function show(idx){at=Math.min(sections.length-1,Math.max(0,idx));sections.forEach((s,i)=>s.classList.toggle('fallback-active',i===at));document.getElementById('fallbackCount').textContent=`${at+1}/${sections.length}`;}
  document.getElementById('fallbackPrev').onclick=()=>show(at-1);document.getElementById('fallbackNext').onclick=()=>show(at+1);
  document.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){show(at+1)}if(e.key==='ArrowLeft'||e.key==='PageUp'){show(at-1)}});show(0);
}

const $=id=>document.getElementById(id);
const TAU=Math.PI*2;
const colors={cyan:'#4bd5f5',amber:'#ffbf72',grid:'#254159',axis:'#718ca8',text:'#93b1c8'};
function plot(id,series,{xmin=-2,xmax=2,ymin=-2.5,ymax=2.5}={}){
  const canvas=$(id);if(!canvas)return;
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const L=56,R=16,T=20,B=32;const W=w-L-R,H=h-T-B;
  const X=t=>L+(t-xmin)/(xmax-xmin)*W;
  const Y=y=>T+(ymax-y)/(ymax-ymin)*H;
  c.clearRect(0,0,w,h);c.fillStyle='#091b2f';c.fillRect(0,0,w,h);
  c.lineWidth=1;c.strokeStyle=colors.grid;c.font='15px Segoe UI,Arial';
  c.textAlign='center';c.textBaseline='top';
  for(let t=Math.ceil(xmin*2)/2;t<=xmax+1e-7;t+=.5){let px=X(t);c.beginPath();c.moveTo(px,T);c.lineTo(px,h-B);c.stroke();if(Math.abs(t*2-Math.round(t*2))<.001 && (Math.round(t*2)%2===0)){c.fillStyle=colors.text;c.fillText(t.toFixed(t===0?0:1).replace('.0',''),px,h-B+6);}}
  c.textAlign='right';c.textBaseline='middle';
  const dy=(ymax-ymin)/4;
  for(let i=0;i<=4;i++){const y=ymin+i*dy;let py=Y(y);c.beginPath();c.moveTo(L,py);c.lineTo(w-R,py);c.stroke();c.fillStyle=colors.text;c.fillText(Number(y.toFixed(1)).toString(),L-9,py);}
  c.strokeStyle=colors.axis;c.lineWidth=1.4;
  if(ymin<=0&&ymax>=0){c.beginPath();c.moveTo(L,Y(0));c.lineTo(w-R,Y(0));c.stroke();}
  if(xmin<=0&&xmax>=0){c.beginPath();c.moveTo(X(0),T);c.lineTo(X(0),h-B);c.stroke();}
  for(const s of series){c.beginPath();c.strokeStyle=s.color;c.lineWidth=s.width||3.5;c.lineJoin='round';
    if(s.dash)c.setLineDash([13,8]);else c.setLineDash([]);
    for(let i=0;i<=W;i+=2){const t=xmin+(i/W)*(xmax-xmin),v=s.fn(t);const py=Y(v);if(i===0)c.moveTo(L+i,py);else c.lineTo(L+i,py);}
    c.stroke();c.setLineDash([]);
  }
}

const xwave=t=>Math.sin(TAU*t);
let isSquare=false;
function drawTransforms(){
  const a=Number($('amplitude').value);$('ampVal').textContent=a.toFixed(1);
  plot('inputCanvas',[{color:colors.cyan,fn:t=>a*xwave(t)}],{xmin:0,xmax:2,ymin:-4.4,ymax:4.4});
  plot('outputCanvas',[{color:colors.amber,fn:t=>isSquare?(a*xwave(t))**2:2*a*xwave(t)}],{xmin:0,xmax:2,ymin:-4.4,ymax:4.4});
  $('systemType').textContent=isSquare?'Sistema NO lineal':'Sistema lineal';
  $('systemType').className=isSquare?'result-ok result-bad':'result-ok';
  $('systemExplanation').textContent=isSquare?'El cuadrado modifica la forma de la onda y no conserva la superposición.':'La salida tiene el doble de amplitud, sin modificar la frecuencia.';
}
$('amplitude').addEventListener('input',drawTransforms);
document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{isSquare=btn.dataset.system==='square';document.querySelectorAll('.choice').forEach(b=>b.classList.toggle('is-selected',b===btn));drawTransforms();}));

let superSquare=false;
const x1=t=>Math.sin(TAU*.75*t),x2=t=>.8*Math.cos(TAU*1.2*t);
function drawSuper(){
  const a=Number($('coefA').value),b=Number($('coefB').value);$('aVal').textContent=a.toFixed(1);$('bVal').textContent=b.toFixed(1);
  const f=z=>superSquare?z*z:2*z;
  const lhs=t=>f(a*x1(t)+b*x2(t)),rhs=t=>a*f(x1(t))+b*f(x2(t));
  const series=[{color:colors.cyan,fn:lhs},{color:colors.amber,fn:rhs,dash:true}];
  const extrema=[];for(let i=0;i<=500;i++){const t=-2+4*i/500;extrema.push(Math.abs(lhs(t)),Math.abs(rhs(t)));}
  const scale=Math.max(2.5,Math.ceil(Math.max(...extrema)*1.15));
  plot('superCanvas',series,{xmin:-2,xmax:2,ymin:-scale,ymax:scale});
  let error=0;for(let i=0;i<=500;i++){const t=-2+4*i/500;error=Math.max(error,Math.abs(lhs(t)-rhs(t)));}
  const pass=error<.00001;
  const fb=$('superFeedback');
  if(pass){fb.className='feedback '+(superSquare?'neutral':'good');fb.textContent=superSquare?'Coinciden en esta elección de constantes; esto NO prueba linealidad. Cambia a y(t)=2x(t) o mueve a/b para comparar.':'Curvas coincidentes en este ensayo. Además, 2x cumple algebraicamente la superposición para cualquier entrada.';}
  else {fb.className='feedback bad';fb.textContent=`Las curvas NO coinciden (diferencia máxima ≈ ${error.toFixed(2)}). Es un contraejemplo: x² no es lineal.`;}
}
['coefA','coefB'].forEach(id=>$(id).addEventListener('input',drawSuper));
document.querySelectorAll('.superchoice').forEach(btn=>btn.addEventListener('click',()=>{superSquare=btn.dataset.kind==='square';document.querySelectorAll('.superchoice').forEach(b=>b.classList.toggle('is-selected',b===btn));drawSuper();}));

const pulse=t=>Math.exp(-((t/.73)**2))*Math.cos(TAU*1.12*t);
function drawShift(){const tau=Number($('shift').value);$('shiftVal').textContent=tau.toFixed(2);plot('shiftCanvas',[{color:colors.cyan,fn:pulse},{color:colors.amber,fn:t=>pulse(t-tau),dash:true}],{xmin:-2,xmax:2.8,ymin:-1.4,ymax:1.4});}
let animating=false,animFrame=0;
function stopAnimation(){animating=false;$('animateShift').textContent='▶ Animar desplazamiento';cancelAnimationFrame(animFrame);}
$('shift').addEventListener('input',()=>{stopAnimation();drawShift();});
$('animateShift').addEventListener('click',()=>{if(animating){stopAnimation();return;}animating=true;$('animateShift').textContent='⏸ Pausar';const start=performance.now();function step(now){if(!animating)return;const v=((now-start)/2600)%1.0;$('shift').value=(v*1.5).toFixed(2);drawShift();animFrame=requestAnimationFrame(step);}animFrame=requestAnimationFrame(step);});
$('resetShift').addEventListener('click',()=>{stopAnimation();$('shift').value=.7;drawShift();});

let timeVariant=false;
function drawTime(){
  const tau=Number($('delay').value);$('delayVal').textContent=tau.toFixed(2);
  const left=t=>timeVariant?t*pulse(t-tau):2*pulse(t-tau);
  const right=t=>timeVariant?(t-tau)*pulse(t-tau):2*pulse(t-tau);
  plot('timeCanvas',[{color:colors.cyan,fn:left},{color:colors.amber,fn:right,dash:true}],{xmin:-2,xmax:2.8,ymin:-3.2,ymax:3.2});
  const fb=$('timeFeedback');fb.className='feedback '+(timeVariant?'bad':'good');fb.textContent=timeVariant?'Las curvas difieren: t·x(t−τ) ≠ (t−τ)·x(t−τ). Sistema variante en el tiempo.':'Las curvas coinciden: 2x(t−τ) = y(t−τ). Sistema invariante en el tiempo.';
}
$('delay').addEventListener('input',drawTime);
document.querySelectorAll('.timechoice').forEach(btn=>btn.addEventListener('click',()=>{timeVariant=btn.dataset.time==='variant';document.querySelectorAll('.timechoice').forEach(b=>b.classList.toggle('is-selected',b===btn));drawTime();}));

const answers=[...document.querySelectorAll('.quiz-answer')];
answers.forEach(btn=>btn.addEventListener('click',()=>{const correct=btn.dataset.correct==='true';answers.forEach(b=>{b.classList.remove('wrong','correct');});btn.classList.add(correct?'correct':'wrong');$('quizFeedback').textContent=correct?'✓ Correcto. Un retraso fijo conserva la superposición y la invariancia temporal.':'✗ Inténtalo de nuevo. El retraso es fijo y no depende del instante t.';$('quizFeedback').style.color=correct?'#66e1b5':'#ffb0ba';$('quizReason').textContent=correct?'La suma de entradas retrasadas se conserva y el desplazamiento fijo funciona igual en cualquier instante.':'Compara T{a·x₁+b·x₂} con a·T{x₁}+b·T{x₂} y luego prueba los dos órdenes de desplazamiento.';}));

// Onda de portada, dibujada en canvas y animada mientras la página está visible.
function drawHero(phase){const id='heroCanvas',can=$(id);if(!can)return;const c=can.getContext('2d'),w=can.width,h=can.height;c.clearRect(0,0,w,h);for(let i=0;i<13;i++){c.strokeStyle='#24445b';c.lineWidth=1;c.beginPath();const y=i*h/12;c.moveTo(0,y);c.lineTo(w,y);c.stroke();}for(let j=0;j<19;j++){c.strokeStyle='#193d54';const x=j*w/18;c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}const list=[{color:colors.cyan,fn:t=>70*Math.sin(.018*t+phase)+26*Math.sin(.047*t+phase*.8),dy:-52},{color:colors.amber,fn:t=>58*Math.sin(.018*t+phase)+19*Math.sin(.047*t+phase*.8),dy:68}];list.forEach(s=>{c.beginPath();c.lineWidth=4;c.strokeStyle=s.color;c.shadowBlur=16;c.shadowColor=s.color;for(let i=0;i<w;i+=3){const y=h/2+s.dy-s.fn(i);if(i===0)c.moveTo(i,y);else c.lineTo(i,y);}c.stroke();c.shadowBlur=0;});}
let startHero=null;function heroLoop(ts){if(startHero===null)startHero=ts;drawHero((ts-startHero)/1000);requestAnimationFrame(heroLoop);}
drawTransforms();drawSuper();drawShift();drawTime();requestAnimationFrame(heroLoop);

// Los rótulos matemáticos se maquetan con MathJax local.
if(window.MathJax?.startup?.promise){window.MathJax.startup.promise.then(()=>{if(typeof Reveal!== 'undefined' && Reveal.isReady())Reveal.layout();});}
