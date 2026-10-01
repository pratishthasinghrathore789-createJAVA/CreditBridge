/* Home page interactions */
(function(){
"use strict";
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches, touch=matchMedia("(pointer:coarse)").matches;
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const menu=qs(".menu-toggle"), links=qs(".nav-links");
if(menu)menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
qsa(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
const reveals=qsa(".reveal"); if(reduce)reveals.forEach(x=>x.classList.add("in")); else new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");e.target.classList.add("solution-visible");}}),{threshold:.12}).observe(reveals[0]||document.body);
if(!reduce){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");e.target.classList.add("solution-visible");io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(e=>io.observe(e))}
const spot=qsa(".spotlight");addEventListener("pointermove",e=>spot.forEach(s=>{s.style.setProperty("--mx",e.clientX+"px");s.style.setProperty("--my",e.clientY+"px")}),{passive:true});
const dot=qs(".cursor-dot"),ring=qs(".cursor-ring");let px=0,py=0,rx=0,ry=0;
if(!touch&&!reduce&&dot&&ring){addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;dot.style.transform=`translate(${px}px,${py}px)`},{passive:true});(function loop(){rx+=(px-rx)*.18;ry+=(py-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)})();qsa("a,button,.tilt").forEach(x=>{x.addEventListener("pointerenter",()=>ring.classList.add("big"));x.addEventListener("pointerleave",()=>ring.classList.remove("big"));x.addEventListener("pointerdown",()=>ring.classList.add("press"));x.addEventListener("pointerup",()=>ring.classList.remove("press"))})}
function magnetic(el){el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);if(Math.hypot(dx,dy)<70)el.style.transform=`translate(${dx*.12}px,${dy*.12}px)`});el.addEventListener("pointerleave",()=>el.style.transform="")}
if(!touch&&!reduce)qsa(".magnetic").forEach(magnetic);
function tilt(el){el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(800px) rotateX(${y*-6}deg) rotateY(${x*6}deg)`});el.addEventListener("pointerleave",()=>el.style.transform="")}
if(!touch&&!reduce)qsa(".tilt").forEach(tilt);
const canvas=qs("#network");
if(canvas){const ctx=canvas.getContext("2d"),nodes=[];let active=true,W=0,H=0;
function resize(){W=canvas.width=Math.min(2,devicePixelRatio)*innerWidth;H=canvas.height=Math.min(2,devicePixelRatio)*canvas.offsetHeight;ctx.setTransform(Math.min(2,devicePixelRatio),0,0,Math.min(2,devicePixelRatio),0,0);nodes.length=0;const n=innerWidth<700?35:70;for(let i=0;i<n;i++)nodes.push({x:Math.random()*innerWidth,y:Math.random()*canvas.offsetHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18})}
resize();addEventListener("resize",resize,{passive:true});new IntersectionObserver(e=>active=e[0].isIntersecting).observe(canvas);document.addEventListener("visibilitychange",()=>active=!document.hidden);
let mx=-1000,my=-1000;addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY},{passive:true});
function draw(){ctx.clearRect(0,0,innerWidth,canvas.offsetHeight);for(const n of nodes){if(active&&!reduce){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>innerWidth)n.vx*=-1;if(n.y<0||n.y>canvas.offsetHeight)n.vy*=-1;const dx=mx-n.x,dy=my-n.y,d=Math.hypot(dx,dy);if(d<140){n.x+=(dx/d)*.7;n.y+=(dy/d)*.7}}ctx.fillStyle="#5D6B7A";ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(n.x,n.y,2,0,Math.PI*2);ctx.fill()}
for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<150){ctx.globalAlpha=(1-d/150)*.16;ctx.strokeStyle=d<90?"#D9622B":"#5D6B7A";ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}ctx.globalAlpha=1;if(active&&!reduce)requestAnimationFrame(draw)}
draw()}
qsa(".stream").forEach(s=>{s.addEventListener("mouseenter",()=>activate(s));s.addEventListener("focus",()=>activate(s))});
function activate(s){qsa(".stream").forEach(x=>x.classList.toggle("active",x===s));const c=qs("#stream-caption");if(c)c.textContent=s.dataset.caption}
const countEls=qsa("[data-count]");const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count,start=0,t=performance.now();function f(now){const p=Math.min(1,(now-t)/900);el.textContent="~"+Math.round(start+(end-start)*p)+el.dataset.suffix;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f);cio.unobserve(el)}));countEls.forEach(e=>cio.observe(e));
})();
