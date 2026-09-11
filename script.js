const pages=[...document.querySelectorAll(".page")];
let current=0;

function goTo(index,dir=1){
  index=Math.max(0,Math.min(pages.length-1,index));
  if(index===current)return;
  pages[current].classList.remove("active");
  current=index;
  pages[current].style.animationName=dir>=0?"pageIn":"pageBack";
  pages[current].classList.add("active");
  document.getElementById("menu").classList.remove("show");
  if(index===5) burst(70);
}
const style=document.createElement("style");
style.textContent="@keyframes pageBack{from{opacity:0;transform:translateX(-55px) scale(.98)}to{opacity:1;transform:none}}";
document.head.appendChild(style);

document.querySelectorAll("[data-go]").forEach(btn=>{
  btn.addEventListener("click",()=>goTo(+btn.dataset.go,+btn.dataset.go>=current?1:-1));
});

const menu=document.getElementById("menu");
const menuBtn=document.getElementById("menuBtn");
menuBtn?.addEventListener("click",()=>menu.classList.toggle("show"));
document.querySelectorAll("#menu [data-go]").forEach(btn=>{
  btn.addEventListener("click",()=>goTo(+btn.dataset.go,+btn.dataset.go>=current?1:-1));
});

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight")goTo(current+1,1);
  if(e.key==="ArrowLeft")goTo(current-1,-1);
  if(e.key==="Escape")menu.classList.remove("show");
});

let sx=0,sy=0;
document.addEventListener("touchstart",e=>{
  sx=e.changedTouches[0].screenX;
  sy=e.changedTouches[0].screenY;
},{passive:true});
document.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].screenX-sx;
  const dy=e.changedTouches[0].screenY-sy;
  if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)) goTo(current+(dx<0?1:-1),dx<0?1:-1);
},{passive:true});

function burst(n=60){
  const box=document.getElementById("confetti");
  const symbols=["♥","✦","✿","★","🦋","♡"];
  for(let i=0;i<n;i++){
    const x=document.createElement("span");
    x.className="conf";
    x.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    x.style.left=(48+Math.random()*4)+"vw";
    x.style.top=(25+Math.random()*25)+"vh";
    x.style.color=["#ff4f98","#ffd36c","#a77bff","#fff","#75dcff"][Math.floor(Math.random()*5)];
    x.style.setProperty("--dx",(Math.random()*120-60)+"vw");
    x.style.animationDelay=(Math.random()*.3)+"s";
    box.appendChild(x);
    setTimeout(()=>x.remove(),2200);
  }
}

function makeAmbient(){
  const box=document.getElementById("ambient");
  const chars=["✦","✧","•","♡","✿"];
  for(let i=0;i<25;i++){
    const s=document.createElement("span");
    s.className="ambient-particle";
    s.textContent=chars[Math.floor(Math.random()*chars.length)];
    s.style.left=Math.random()*100+"vw";
    s.style.top=Math.random()*100+"vh";
    s.style.fontSize=(7+Math.random()*17)+"px";
    s.style.opacity=.12+Math.random()*.3;
    s.style.animationDelay=(-Math.random()*8)+"s";
    box.appendChild(s);
  }
}
makeAmbient();

function makeButterflies(){
  const box=document.getElementById("butterflies");
  for(let i=0;i<8;i++){
    const b=document.createElement("span");
    b.className="butterfly-particle";
    b.textContent="🦋";
    b.style.top=(10+Math.random()*75)+"vh";
    b.style.animationDelay=(-Math.random()*12)+"s";
    b.style.animationDuration=(9+Math.random()*8)+"s";
    b.style.opacity=.2+Math.random()*.5;
    box.appendChild(b);
  }
}
makeButterflies();

function makeDrops(){
  const box=document.getElementById("drops");
  for(let i=0;i<18;i++){
    const d=document.createElement("span");
    d.className="drop-particle";
    d.style.left=Math.random()*100+"vw";
    d.style.animationDelay=(-Math.random()*5)+"s";
    d.style.animationDuration=(3+Math.random()*4)+"s";
    d.style.opacity=.15+Math.random()*.4;
    box.appendChild(d);
  }
}
makeDrops();

document.querySelectorAll(".wish-card").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const m=document.getElementById("dreamMessage");
    m.textContent=btn.dataset.msg;
    m.animate(
      [{opacity:.1,transform:"translateY(10px) scale(.95)"},
       {opacity:1,transform:"translateY(0) scale(1)"}],
      {duration:500,easing:"ease-out"}
    );
    burst(18);
  });
});

document.getElementById("blessBtn").addEventListener("click",()=>{
  document.getElementById("blessing").classList.add("show");
  burst(35);
});

const wish=document.getElementById("wishBtn");
const result=document.getElementById("finalResult");
wish.addEventListener("click",()=>{
  burst(120);
  result.textContent="✨ May all your wishes come true — stay happy, loved, confident and beautifully you. 💖";
  wish.textContent="Wish Made ♥";
  wish.disabled=true;
  document.querySelectorAll(".page-final .cake-flames i").forEach(x=>{
    x.style.filter="drop-shadow(0 0 18px #ffd761) brightness(1.5)";
  });
  setTimeout(()=>burst(55),700);
});

document.getElementById("restart").addEventListener("click",()=>{
  result.textContent="";
  wish.textContent="Make My Wish ✨";
  wish.disabled=false;
  document.getElementById("blessing").classList.remove("show");
  goTo(0,-1);
});

const cursor=document.querySelector(".cursor-glow");
document.addEventListener("pointermove",e=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
},{passive:true});

let ctx=null,on=false,timer=null;
document.getElementById("music").addEventListener("click",async()=>{
  if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();
  if(ctx.state==="suspended")await ctx.resume();
  on=!on;
  document.getElementById("music").textContent=on?"♫":"♪";
  if(!on){clearInterval(timer);return}
  const notes=[261.63,329.63,392,523.25,392,329.63];
  let i=0;
  timer=setInterval(()=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type="sine";
    o.frequency.value=notes[i++%notes.length];
    g.gain.setValueAtTime(.0001,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.025,ctx.currentTime+.03);
    g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.38);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime+.4);
  },420);
});
