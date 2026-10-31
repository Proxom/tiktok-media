// Format D "Every bounce = 1 more ball": balls bounce inside one rotating ring with a gap; every wall bounce spawns a new ball,
// balls that leave through the gap escape and fall away. When BREAK balls are inside, the ring shatters (finale).
// Deterministic (seeded). node sim.js <out.js> [seed] -> window.DATA={frames:[[x,y,hue,state]...],events,breakT,...}
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=12,DT=1/(FPS*SUB),CX=540,CY=1010,R=+process.env.R||375,HT=9,BR=+process.env.BR||15,G=520;
const GAP=+process.env.GAP||.20,OM=+process.env.OM||.85,BREAK=+process.env.BREAK||120,COOL=+process.env.COOL||.45,TAIL=3.0;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
function run(seed){
 const rnd=rng(seed);const a0=rnd()*6.283;let hue=rnd()*360;
 const balls=[{x:CX+(rnd()-.5)*60,y:CY+150,vx:(rnd()<.5?-1:1)*(120+rnd()*80),vy:420,hue,state:0,born:0,cool:0}];
 const frames=[],events=[];let t=0,breakT=null,escaped=0;
 for(let f=0;f<FPS*45;f++){
  for(let s=0;s<SUB;s++){t+=DT;const gc=a0+OM*t;
   const nb=balls.length;
   for(let i=0;i<nb;i++){const b=balls[i];if(b.state===2)continue;b.vy+=(breakT!==null?G*.45:G)*DT;b.x+=b.vx*DT;b.y+=b.vy*DT;b.cool-=DT;
    if(b.state===1){if(b.y>2300)b.state=2;continue}
    let sp=Math.hypot(b.vx,b.vy);if(sp<300){b.vx*=300/sp;b.vy*=300/sp}else if(sp>620){b.vx*=620/sp;b.vy*=620/sp}
    if(breakT!==null)continue;
    const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d;
    if(d+BR>R-HT){const inGap=Math.abs(wrap(Math.atan2(dy,dx)-gc))<GAP-BR/R*.9;
     if(inGap){if(d>R){b.state=1;escaped++;events.push({t,type:'escape',i,x:b.x,y:b.y,n:balls.length-escaped,esc:escaped})}}
     else{b.x=CX+nx*(R-HT-BR);b.y=CY+ny*(R-HT-BR);const vr=b.vx*nx+b.vy*ny;
      if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;
       if(b.cool<=0&&vr>120){const nIn=balls.length-escaped;b.cool=Math.min(COOL,.12+nIn*.012);hue=(hue+23)%360;const an=(rnd()-.5)*1.4,c=Math.cos(an),sn=Math.sin(an);
        const nbx=b.x-nx*BR*2.1,nby=b.y-ny*BR*2.1;
        balls.push({x:nbx,y:nby,vx:b.vx*c-b.vy*sn,vy:b.vx*sn+b.vy*c,hue,state:0,born:t,cool:Math.min(COOL,.12+(balls.length-escaped)*.012)});
        const inside=balls.filter(q=>q.state===0).length;events.push({t,type:'spawn',i:balls.length-1,x:nbx,y:nby,v:vr,n:inside});
        if(inside>=BREAK&&breakT===null){breakT=t;events.push({t,type:'break',n:inside})}}
       else if(vr>60)events.push({t,type:'tap',x:b.x,y:b.y,v:vr})}}}}
   if(breakT===null){const live=balls.filter(q=>q.state===0);const L=live.length;
    for(let i=0;i<L;i++)for(let j=i+1;j<L;j++){const a=live[i],b=live[j],dx=b.x-a.x,dy=b.y-a.y;if(Math.abs(dx)>2*BR||Math.abs(dy)>2*BR)continue;const d=Math.hypot(dx,dy);
     if(d<2*BR&&d>1e-6){const nx=dx/d,ny=dy/d,ov=2*BR-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx;a.vy+=rv*ny;b.vx-=rv*nx;b.vy-=rv*ny}}}}
  }
  if(breakT!==null&&Math.abs(t-breakT)<DT*SUB*1.01&&!balls.burst){balls.burst=1; // ring shatters: every inside ball flies outward
   balls.forEach(b=>{if(b.state!==0)return;const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1;const k=140+((b.x*7+b.y*13)%160);b.vx=dx/d*k+b.vx*.15;b.vy=dy/d*k-260;b.state=1})}
  frames.push(balls.map(b=>[Math.round(b.x),Math.round(b.y),Math.round(b.hue),b.state]));
  if(breakT!==null&&t>breakT+TAIL)break;
 }
 if(breakT===null)return{fail:'timeout',n:balls.length,esc:escaped};
 return{frames,events,breakT,seed,a0,OM,GAP,R,HT,BR,CX,CY,BREAK,fps:FPS};
}
let res,log=[];const MIN=+process.env.MINT||15,MAX=+process.env.MAXT||22;
for(let s=SEED;s<SEED+400;s++){res=run(s);log.push(s+':'+(res.fail?res.fail+res.n+'/'+res.esc:res.breakT.toFixed(1)));if(!res.fail&&res.breakT>MIN&&res.breakT<MAX){const at=x=>res.events.filter(e=>e.type==='spawn'&&e.t<x).length+1-res.events.filter(e=>e.type==='escape'&&e.t<x).length;res.early=[at(1),at(1.5),at(3)];log[log.length-1]+='/'+res.early.join(',');if(at(1.5)>=+(process.env.EARLY||4)&&at(3)>=6)break}res=null}
if(!res){console.log(log.join(' '));process.exit(1)}
const TRIM=+process.env.TRIM||0;if(TRIM){const pre=res.events.filter(e=>e.t<TRIM);res.esc0=pre.filter(e=>e.type==='escape').length;res.n0=1+pre.filter(e=>e.type==='spawn').length-res.esc0;const k=Math.round(TRIM*FPS);res.frames=res.frames.slice(k);res.events=res.events.filter(e=>e.t>=TRIM).map(e=>Object.assign(e,{t:e.t-TRIM}));res.breakT-=TRIM;res.a0+=res.OM*TRIM;res.trim=TRIM;}
const sp=res.events.filter(e=>e.type==='spawn'),esc=res.events.filter(e=>e.type==='escape');
console.log('seed',res.seed,'break',res.breakT.toFixed(2),'spawns',sp.length,'escaped',esc.length,'first spawn',sp[0]&&sp[0].t.toFixed(2),'frames',res.frames.length);
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
