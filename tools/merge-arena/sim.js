// S1 "Will it evolve?" merge arena: deterministic 2D physics (circles in a round arena, equal tiers merge).
// node sim.js <out.js> [seed] [chain]  -> writes window.DATA={...} with per-frame item states and sound events.
const fs=require('fs');
const OUT=process.argv[2]||'data.js';
const CHAINS={
 dragon:{items:['🥚','🐣','🐥','🐔','🦃','🦚','🦅','🐉'],r0:30,f:1.3},
 sun:{items:['✨','🪨','☄️','🌑','🌍','🪐','☀️'],r0:30,f:1.36},
 dino:{items:['🦴','🥚','🦎','🐢','🐊','🦕','🦖'],r0:30,f:1.36},
 fruit:{items:['🍒','🍓','🍊','🍎','🍑','🍍','🍉'],r0:30,f:1.36},
 ocean:{items:['🐚','🦐','🐟','🐠','🐙','🦈','🐋'],r0:30,f:1.36},
 balls:{items:['🎱','⚾','🥎','🏐','⚽','🏀'],r0:32,f:1.45}, // no 🎾: Noto draws it with a racket
};
const chainName=process.argv[4]||'dragon',CC=CHAINS[chainName],CH=CC.items,TOP=CH.length-1;
const CX=540,CY=1010,R=400,G=2600,E=.25,FPS=30,SUB=16,DT=1/(FPS*SUB),TMAX=+(process.env.TMAX||30);
// DROP = seconds between drops (0.27 = old fast pace; 0.5+ for the 40 s+ readable pace).
// COOL = a freshly merged/dropped item cannot merge again for COOL s, so every tier is visible on screen
// (QC 1 Nov: with COOL 0 two merges could happen in the same frame and the final form appeared from ONE shark).
const DROP=+(process.env.DROP||.27),COOL=+(process.env.COOL||.4),FMIN=+(process.env.FMIN||14),FMAX=+(process.env.FMAX||24);
// MGAP = at most one merge every MGAP s (one event at a time, readable pacing; PACING rule max ~4-5 events/s).
const MGAP=+(process.env.MGAP||0);
const rad=k=>CC.r0*Math.pow(CC.f,k);
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function run(seed){
 const rnd=rng(seed);let lastM=-9,items=[],nid=1,t=0,next=.35,frames=[],events=[],final=null,queue=[];
 const pick=()=>{const u=rnd();return u<.5?0:u<.85?1:2};
 for(let i=0;i<8;i++)queue.push(pick());
 const spawn=()=>{const k=queue.shift();queue.push(pick());const r=rad(k);
  items.push({id:nid++,k,x:CX+(rnd()-.5)*20,y:CY-R+r+4,vx:(rnd()-.5)*90,vy:500,a:0,born:t});events.push({t,type:'drop',k})};
 for(let f=0;f<FPS*TMAX;f++){
  for(let s=0;s<SUB;s++){
   t+=DT;
   if(final===null&&t>=next){spawn();next=t+DROP}
   for(const it of items){it.vy+=G*DT;it.x+=it.vx*DT;it.y+=it.vy*DT;it.a+=it.vx/rad(it.k)*DT}
   for(let pass=0;pass<3;pass++){
    // circle-circle
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j];if(a.dead||b.dead)continue;
     const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1e-6,ra=rad(a.k),rb=rad(b.k),ov=ra+rb-d;
     if(ov>0){
      if(a.k===b.k&&a.k<TOP&&final===null&&t-a.born>=COOL&&t-b.born>=COOL&&t-lastM>=MGAP){lastM=t; // merge
       const k=a.k+1,nx=(a.x+b.x)/2,ny=(a.y+b.y)/2;a.dead=b.dead=true;
       const m={id:nid++,k,x:nx,y:ny,vx:(a.vx+b.vx)/2,vy:(a.vy+b.vy)/2-250,a:(a.a+b.a)/2,born:t};items.push(m);
       events.push({t,type:'merge',k,x:nx,y:ny});if(k===TOP){final=t;events.push({t,type:'final',k,x:nx,y:ny})}continue}
      const nx=dx/d,ny=dy/d,ma=ra*ra,mb=rb*rb,sum=ma+mb;
      a.x-=nx*ov*mb/sum;a.y-=ny*ov*mb/sum;b.x+=nx*ov*ma/sum;b.y+=ny*ov*ma/sum;
      const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const jj=-(1+E)*rv/(1/ma+1/mb);a.vx-=jj*nx/ma;a.vy-=jj*ny/ma;b.vx+=jj*nx/mb;b.vy+=jj*ny/mb;
       if(-rv>260&&pass===0)events.push({t,type:'hit',v:-rv,k:Math.max(a.k,b.k),x:(a.x+b.x)/2})}}}
    items=items.filter(i=>!i.dead);
    // arena wall
    for(const it of items){const r=rad(it.k),dx=it.x-CX,dy=it.y-CY,d=Math.hypot(dx,dy)||1e-6;if(d+r>R){const nx=dx/d,ny=dy/d;it.x=CX+nx*(R-r);it.y=CY+ny*(R-r);
     const vn=it.vx*nx+it.vy*ny;if(vn>0){if(vn>260&&pass===0)events.push({t,type:'wall',v:vn,k:it.k,x:it.x});it.vx-=(1+E)*vn*nx;it.vy-=(1+E)*vn*ny;
      const tx=-ny,ty=nx,vt=it.vx*tx+it.vy*ty;it.vx-=.02*vt*tx;it.vy-=.02*vt*ty}}}
   }
   for(const it of items){it.vx*=.9995;it.vy*=.9995}
  }
  frames.push({q:queue.slice(0,6),it:items.map(i=>[i.id,i.k,Math.round(i.x*10)/10,Math.round(i.y*10)/10,Math.round(i.a*100)/100,Math.round(i.born*100)/100])});
  // overflow: arena too full before the final -> failed run
  if(final===null&&items.some(i=>i.y<CY-R+rad(i.k)-2&&t-i.born>1.5))return{fail:'overflow',t};
  if(final!==null&&t>final+3.2)break;
 }
 return{final,frames,events,seed,chain:CH,r0:CC.r0,rf:CC.f,R,CX,CY,fps:FPS};
}
let seed=+process.argv[3]||0,res;
const s0=seed||1,stats=[];for(let s=s0;s<s0+400;s++){res=run(s);stats.push(res.fail||(res.final?res.final.toFixed(1):"none"));if(res.final&&res.final>FMIN&&res.final<FMAX){seed=s;break}res=null}
if(!res)console.log(stats.slice(0,40).join(" "));
if(!res){console.log('no good seed');process.exit(1)}
console.log('seed',res.seed,'final at',res.final.toFixed(2),'frames',res.frames.length,'events',res.events.length,'merges',res.events.filter(e=>e.type==='merge').length);
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
