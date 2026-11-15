// 1M+ #7 "24 marble survival" (our version): 24 numbered marbles on ONE round floating platform, seen from above.
// RULES (exactly what the code does):
//  0. The platform is a shallow dish: a pull K*r back toward the middle.
//  0b. The platform SHAKES: every marble gets small random kicks (strength SIG), rolling friction FR slows it.
//  1. (optional, G0>0) The platform tilts: one gravity pull G(t) along the TILT direction phi(t) acts on every marble alike (shown as the arrow); the tilt turns and gets steeper over time.
//  2. Marbles roll (light rolling friction) and bounce off each other (elastic, equal mass, restitution E). There is NO wall at the edge.
//  3. The platform shrinks from R0 to REND between TS and TE, losing the same area every second (shown as %).
//  4. A marble whose CENTER passes over the edge falls off and is OUT (it keeps its velocity and drops away; no more collisions).
//  5. Last marble on the platform wins: at that moment the shaking and the shrinking stop (the winner rolls to a stop). LEFT counter = 24 - falls.
// Fixed timestep 600 Hz (10 sub-steps per 60 fps frame) + swept (continuous) pair check every sub-step (pass-through counted as tunnel, must be 0).
// frames[k] = state at sim time (k+1)/60: per marble x,y,st (st 1 = on the platform, 0 = fallen). Fallen marbles keep moving ballistically for the renderer.
// node sim.js <out.js> [seed]  env: G0 GK E FR R0 REND TS TE MR MINT MAXT DUELMIN TAIL GAME
const fs=require('fs');const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const E_=(k,d)=>process.env[k]!==undefined?+process.env[k]:d;
const FPS=60,SUB=10,DT=1/(FPS*SUB),N=24,CX=E_('CX',495),CY=E_('CY',1035),R0=E_('R0',405),REND=E_('REND',16),TS=E_('TS',2.5),TE=E_('TE',24),MR=E_('MR',23);
const SIG=E_('SIG',184),K=E_('K',.62),G0=E_('G0',0),GK=E_('GK',0),EL=E_('E',.92),FR=E_('FR',1.4),TAIL=E_('TAIL',3.6),V0=E_('V0',120),W1=E_('W1',1.1),W2=E_('W2',.7);
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const Rt=t=>{const u=Math.min(1,Math.max(0,(t-TS)/(TE-TS)));return REND+(R0-REND)*Math.sqrt(1-u)}; // area shrinks at a steady rate
function run(seed){const rnd=rng(seed),gs=()=>{let u=0;for(let q=0;q<4;q++)u+=rnd();return (u-2)*1.7320508};
 const a1=rnd()*6.283,a2=rnd()*6.283,p0=rnd()*6.283,f1=.33+rnd()*.12,f2=.8+rnd()*.25;
 const phi=t=>p0+0.9*t*0+(W1/f1)*Math.sin(f1*t+a1)+(W2/f2)*Math.sin(f2*t+a2)+.35*t; // tilt direction (rad): slow drift + two swings
 const Gt=t=>G0+GK*t;
 const M=[];let tries=0;
 while(M.length<N&&tries<20000){tries++;const r=Math.sqrt(rnd())*(R0*E_('SP0',.6)),a=rnd()*6.283,x=CX+Math.cos(a)*r,y=CY+Math.sin(a)*r;
  if(M.every(o=>Math.hypot(o.x-x,o.y-y)>2*MR+10)){const va=rnd()*6.283,vs=V0*(.3+.7*rnd());M.push({x,y,vx:Math.cos(va)*vs,vy:Math.sin(va)*vs,on:1})}}
 if(M.length<N)return{fail:'place'};
 const frames=[],events=[];let t=0,endT=null,win=-1,tunnel=0,maxPen=0,maxStep=0,late=0;const pc={};
 const snap=()=>{const a=[];for(const m of M)a.push(+m.x.toFixed(1),+m.y.toFixed(1),m.on);return a};
 for(let f=0;f<FPS*60;f++){
  for(let s=0;s<SUB;s++){t+=DT;const prev=M.map(m=>[m.x,m.y]);const ended=endT!==null,ph=phi(t),g=Gt(t),gx=Math.cos(ph)*g,gy=Math.sin(ph)*g,dmp=Math.exp(-FR*DT);
   for(const m of M){if(m.on&&ended){const k=Math.exp(-6*DT);m.vx*=k;m.vy*=k}else if(m.on){const nx=SIG*Math.sqrt(DT)*gs(),ny=SIG*Math.sqrt(DT)*gs();m.vx=(m.vx+(gx-K*(m.x-CX))*DT)*dmp+nx;m.vy=(m.vy+(gy-K*(m.y-CY))*DT)*dmp+ny}else{m.vx*=1;m.vy*=1}m.x+=m.vx*DT;m.y+=m.vy*DT}
   for(let i=0;i<N;i++){const m=M[i];if(m.on)maxStep=Math.max(maxStep,Math.hypot(m.x-prev[i][0],m.y-prev[i][1])/MR)}
   // CCD: did any pair of marbles on the platform pass through each other inside this sub-step?
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=M[i],c=M[j];if(!a.on||!c.on)continue;
    const rx0=prev[j][0]-prev[i][0],ry0=prev[j][1]-prev[i][1],rx1=c.x-a.x,ry1=c.y-a.y,ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;
    const u=ee>0?Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)):0;if(Math.hypot(rx0+ex*u,ry0+ey*u)<2*MR-.01&&Math.hypot(rx1,ry1)>=2*MR&&Math.hypot(rx0,ry0)>=2*MR)tunnel++}
   for(let it=0;it<2;it++)for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=M[i],c=M[j];if(!a.on||!c.on)continue;const qx=c.x-a.x,qy=c.y-a.y,qd=Math.hypot(qx,qy)||1e-6,ov=2*MR-qd;
    if(ov>0){const mx=qx/qd,my=qy/qd;a.x-=mx*ov/2;a.y-=my*ov/2;c.x+=mx*ov/2;c.y+=my*ov/2;const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;
     if(vn<0){const J=(1+EL)*vn/2;a.vx+=J*mx;a.vy+=J*my;c.vx-=J*mx;c.vy-=J*my;const key=i*N+j;
      if(-vn>70&&!(pc[key]>t)&&it===0){pc[key]=t+.2;events.push({t,type:'bump',a:i,b:j,x:(a.x+c.x)/2,y:(a.y+c.y)/2,v:-vn})}}}}
   // falls: centre over the edge
   const RN=Rt(ended?endT:t);for(let i=0;i<N;i++){const m=M[i];if(!m.on)continue;const d=Math.hypot(m.x-CX,m.y-CY);if(d>RN){if(d>RN+3)late++;m.on=0;const left=M.filter(q=>q.on).length;
     events.push({t,type:'fall',m:i,x:m.x,y:m.y,vx:m.vx,vy:m.vy,d,R:RN,left});if(left===1&&endT===null){endT=t;win=M.findIndex(q=>q.on)}}}
   if(endT===null||t<endT+.01)for(let i=0;i<N;i++){const a=M[i];if(!a.on)continue;for(let j=i+1;j<N;j++){const c=M[j];if(!c.on)continue;maxPen=Math.max(maxPen,2*MR-Math.hypot(a.x-c.x,a.y-c.y))}}
  }
  frames.push(snap());if(endT!==null&&t>endT+TAIL)break;
 }
 if(endT===null)return{fail:'timeout'};
 return{frames,events,endT,win,seed,tunnel,maxPen,maxStep,late,phiP:[p0,a1,a2,f1,f2]};
}
const MINT=E_('MINT',22),MAXT=E_('MAXT',26),DUELMIN=E_('DUELMIN',3),FIRSTMIN=E_('FIRSTMIN',2.2),BURST=E_('BURST',4),WINEX=(process.env.WINEX||'').split(',').filter(v=>v).map(Number);let res=null;const log=[];
for(let s=SEED;s<SEED+3000;s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 const fl=r.events.filter(e=>e.type==='fall').map(e=>e.t);let burst=0;for(let i=0;i<fl.length;i++){let k=0;for(let j=i;j<fl.length&&fl[j]-fl[i]<1;j++)k++;burst=Math.max(burst,k)}
 const duel=fl[fl.length-1]-fl[fl.length-2],gaps=fl.slice(1).map((v,i)=>v-fl[i]),mg=Math.max(...gaps);
 log.push(`${s}: end ${r.endT.toFixed(1)} first ${fl[0].toFixed(1)} duel ${duel.toFixed(1)} burst ${burst} maxgap ${mg.toFixed(1)} win ${r.win+1}`);
 if(r.endT>MINT&&r.endT<MAXT&&fl[0]>FIRSTMIN&&duel>DUELMIN&&burst<=BURST&&mg<E_('MAXGAP',4.5)&&r.tunnel===0&&r.late===0&&r.maxPen<1&&WINEX.indexOf(r.win+1)<0){res=r;break}}
if(!res){console.log(log.slice(-30).join('\n'));process.exit(1)}
const fl=res.events.filter(e=>e.type==='fall');
console.log('seed',res.seed,'winner #'+(res.win+1),'end',res.endT.toFixed(2),'falls',fl.map(e=>(e.m+1)+'@'+e.t.toFixed(1)).join(' '),'bumps',res.events.filter(e=>e.type==='bump').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
Object.assign(res,{Rstop:Rt(res.endT),SIG,FR,K,N,CX,CY,R0,REND,TS,TE,MR,G0,GK,ffps:FPS,game:E_('GAME',0)});
{const SP=E_('SLOW',.4),s0=res.endT-E_('S0',1.0),s1=res.endT+E_('S1',.45),end=res.frames.length/60-.02,VF=60;res.vfps=VF;const tm=[];let ts=0,sp=1;
 while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video dur',(tm.length/VF).toFixed(2),'final fall at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
// tilt + gravity per video frame time for the renderer (arrow)
res.tilt=res.frames.map((_,k)=>{const t=(k+1)/60,[p0,a1,a2,f1,f2]=res.phiP;return +(p0+(W1/f1)*Math.sin(f1*t+a1)+(W2/f2)*Math.sin(f2*t+a2)+.35*t).toFixed(4)});
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
