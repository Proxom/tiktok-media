// "Black hole" (family B last one standing): 5 colored balls fly inside one closed neon ring around a black hole in the middle.
// RULES (exactly what the code does):
//  1. The black hole pulls every ball toward the middle (gravity GM/(d^2+S^2), the pull grows with the hole).
//  2. The black hole GROWS: its radius goes from RH0 to RH1 between 0 and TG seconds (shown as "HOLE SIZE").
//  3. Balls bounce off the ring wall and off each other (elastic, equal mass). Nothing else pushes them.
//  4. A ball that touches the black hole (edge of the ball reaches the hole's edge) is EATEN: it is out.
//  5. Last ball outside the hole wins. After the win the hole stops growing.
// Fixed timestep 600 Hz (10 sub-steps per 60 fps frame) + swept (continuous) pair check every sub-step (pass-through counted as tunnel, must be 0);
// the eat moment is the first sub-step where d - r <= RH (logged with the overlap, must be < 3 px).
// frames[k] = state at sim time (k+1)/60: per ball x,y,st (1 = alive, 0 = eaten). Eaten balls keep spiralling in for the renderer.
// node sim.js <out.js> [seed]  env: N R RB RH0 RH1 TG GM0 GK S V0 MINT MAXT DUELMIN FIRSTMIN GAPMIN TAIL WINEX
const fs=require('fs');const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const E_=(k,d)=>process.env[k]!==undefined?+process.env[k]:d;
const FPS=60,SUB=10,DT=1/(FPS*SUB),N=E_('N',5),CX=E_('CX',495),CY=E_('CY',1030),R=E_('R',400),HT=9,RB=E_('RB',26),RH0=E_('RH0',34),RH1=E_('RH1',330),TG=E_('TG',30);
const GM0=E_('GM0',2.2e7),GK=E_('GK',1.2),S=E_('S',30),V0=E_('V0',330),TAIL=E_('TAIL',3.4);
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const RHt=(t,stop)=>{if(stop!==null&&t>stop)t=stop;const u=Math.min(1,Math.max(0,t/TG));return RH0+(RH1-RH0)*u};
const GMt=(t,stop)=>GM0*(1+GK*(RHt(t,stop)-RH0)/(RH1-RH0));
function run(seed){const rnd=rng(seed);const B=[];
 const a0=rnd()*6.283;for(let i=0;i<N;i++){const a=a0+i*6.283/N+(rnd()-.5)*.4,d=170+rnd()*170,dir=rnd()<.8?1:-1,v=V0*(.8+.4*rnd());
  B.push({x:CX+Math.cos(a)*d,y:CY+Math.sin(a)*d,vx:-Math.sin(a)*v*dir+(rnd()-.5)*80,vy:Math.cos(a)*v*dir+(rnd()-.5)*80,on:1,wc:0})}
 for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(Math.hypot(B[i].x-B[j].x,B[i].y-B[j].y)<2*RB+8)return{fail:'place'};
 const frames=[],events=[];let t=0,endT=null,win=-1,tunnel=0,maxPen=0,maxStep=0,maxEatOv=0;const pc={};
 const snap=()=>{const a=[];for(const b of B)a.push(+b.x.toFixed(1),+b.y.toFixed(1),b.on);return a};
 for(let f=0;f<FPS*70;f++){
  for(let s=0;s<SUB;s++){t+=DT;const prev=B.map(b=>[b.x,b.y]),RH=RHt(t,endT),GM=GMt(t,endT),RIN=R-HT;
   for(const b of B){const dx=CX-b.x,dy=CY-b.y,d2=dx*dx+dy*dy,d=Math.sqrt(d2)||1e-6,a=GM/(d2+S*S);
    if(b.on){b.vx+=a*dx/d*DT;b.vy+=a*dy/d*DT;b.x+=b.vx*DT;b.y+=b.vy*DT}
    else{const k=Math.exp(-3*DT);b.vx=(b.vx+a*dx/d*DT)*k;b.vy=(b.vy+a*dy/d*DT)*k;b.x+=b.vx*DT;b.y+=b.vy*DT;if(d<4){b.x=CX;b.y=CY;b.vx=b.vy=0}}}
   for(let i=0;i<N;i++){const b=B[i];if(!b.on)continue;maxStep=Math.max(maxStep,Math.hypot(b.x-prev[i][0],b.y-prev[i][1])/RB);
    const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d;
    if(d+RB>RIN){if(d-RB>RIN)tunnel++;b.x=CX+nx*(RIN-RB);b.y=CY+ny*(RIN-RB);const vr=b.vx*nx+b.vy*ny;if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;if(vr>80&&b.wc<=t){b.wc=t+.12;events.push({t,type:'wall',b:i,x:CX+nx*RIN,y:CY+ny*RIN,v:vr})}}}}
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];if(!a.on||!c.on)continue;
    const rx0=prev[j][0]-prev[i][0],ry0=prev[j][1]-prev[i][1],rx1=c.x-a.x,ry1=c.y-a.y,ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;
    const u=ee>0?Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)):0;if(Math.hypot(rx0+ex*u,ry0+ey*u)<2*RB-.01&&Math.hypot(rx1,ry1)>=2*RB&&Math.hypot(rx0,ry0)>=2*RB)tunnel++}
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];if(!a.on||!c.on)continue;const qx=c.x-a.x,qy=c.y-a.y,qd=Math.hypot(qx,qy)||1e-6,ov=2*RB-qd;
    if(ov>0){const mx=qx/qd,my=qy/qd;a.x-=mx*ov/2;a.y-=my*ov/2;c.x+=mx*ov/2;c.y+=my*ov/2;const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;
     if(vn<0){a.vx+=vn*mx;a.vy+=vn*my;c.vx-=vn*mx;c.vy-=vn*my;const key=i*N+j;if(-vn>60&&!(pc[key]>t)){pc[key]=t+.15;events.push({t,type:'bump',a:i,b:j,x:(a.x+c.x)/2,y:(a.y+c.y)/2,v:-vn})}}}}
   for(let i=0;i<N;i++){const b=B[i];if(!b.on)continue;const d=Math.hypot(b.x-CX,b.y-CY);if(d-RB<=RH){maxEatOv=Math.max(maxEatOv,RH-(d-RB));b.on=0;const left=B.filter(q=>q.on).length;
     events.push({t,type:'eat',b:i,x:b.x,y:b.y,d,RH,left});if(left===1&&endT===null){endT=t;win=B.findIndex(q=>q.on)}}}
   if(endT===null)for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(B[i].on&&B[j].on)maxPen=Math.max(maxPen,2*RB-Math.hypot(B[i].x-B[j].x,B[i].y-B[j].y));
  }
  frames.push(snap());if(endT!==null&&t>endT+TAIL)break;
 }
 if(endT===null)return{fail:'timeout'};
 // the winner must survive the tail (hole stopped growing)
 if(!B[win].on)return{fail:'winner eaten in tail'};
 return{frames,events,endT,win,seed,tunnel,maxPen,maxStep,maxEatOv};
}
const MINT=E_('MINT',21),MAXT=E_('MAXT',25),DUELMIN=E_('DUELMIN',3),FIRSTMIN=E_('FIRSTMIN',4),GAPMIN=E_('GAPMIN',2),WINEX=(process.env.WINEX||'').split(',').filter(v=>v).map(Number);let res=null;const log=[];
for(let s=SEED;s<SEED+4000;s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 const et=r.events.filter(e=>e.type==='eat').map(e=>e.t),gaps=et.slice(1).map((v,i)=>v-et[i]),duel=gaps[gaps.length-1];
 log.push(`${s}: end ${r.endT.toFixed(1)} eats ${et.map(v=>v.toFixed(1)).join(',')} win ${r.win}`);
 if(r.endT>MINT&&r.endT<MAXT&&et[0]>FIRSTMIN&&duel>DUELMIN&&Math.min(...gaps)>GAPMIN&&Math.max(...gaps)<E_('GAPMAX',7)&&r.tunnel===0&&r.maxPen<1&&r.maxEatOv<3&&r.maxStep<.3&&WINEX.indexOf(r.win)<0){res=r;break}}
if(!res){console.log(log.slice(-25).join('\n'));process.exit(1)}
const ea=res.events.filter(e=>e.type==='eat');
console.log('seed',res.seed,'winner',res.win,'end',res.endT.toFixed(2),'eats',ea.map(e=>e.b+'@'+e.t.toFixed(1)).join(' '),'bumps',res.events.filter(e=>e.type==='bump').length,'walls',res.events.filter(e=>e.type==='wall').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'eatOv',res.maxEatOv.toFixed(2),'tunnel',res.tunnel,'tried',log.length);
Object.assign(res,{N,CX,CY,R,HT,RB,RH0,RH1,TG,GM0,GK,S,ffps:FPS,RHstop:RHt(res.endT,null)});
{const SP=E_('SLOW',.4),s0=res.endT-E_('S0',1.0),s1=res.endT+E_('S1',.45),end=res.frames.length/60-.02,VF=60;res.vfps=VF;const tm=[];let ts=0,sp=1;
 while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video dur',(tm.length/VF).toFixed(2),'final eat at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
if(process.env.GAME){res.game=+process.env.GAME;res.prevWin=process.env.PREVWIN||''}
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
