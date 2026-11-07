// Family B "Ball battle / last one standing": FOUR balls (red, blue, yellow, green) bounce inside one closed neon ring.
// RULE (exactly what the code does): every crash between two balls costs the SLOWER ball 1 HP (speed just before the crash).
// HP is shown as the number inside the ball and as a bar; a ball shrinks with its HP; at 0 HP it pops and is out. Last ball alive wins.
// Wall hits cost nothing. After every knock-out the arena ring shrinks by SHR (14%) of its start radius over 0.8 s (moving wall, real push). Real 2D physics: gravity, elastic wall bounces, elastic ball-ball collisions (mass ~ r^2),
// fixed timestep 600 Hz (20 sub-steps per 30 fps frame) + swept (continuous) collision check every sub-step, logged as tunnel=0.
// frames[k] = state at sim time (k+1)/60 (renderer uses ff=t*60-1). The game rule keeps each ball's speed between VMIN and VMAX.
// node sim.js <out.js> [seed]  (env HP, RMIN, RK, G, VMIN, VMAX, MINT, MAXT, WINMAX, TAIL)
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=20,DT=1/(FPS*SUB),CX=540,CY=1030,R=390,HT=9,G=+process.env.G||380;
const HP0=+process.env.HP||8,RMIN=+process.env.RMIN||24,RK=+process.env.RK||2.9,VMIN=+process.env.VMIN||430,VMAX=+process.env.VMAX||780,TAIL=+process.env.TAIL||4.4;
const N=4,rad=hp=>RMIN+RK*hp,SHR=+process.env.SHR||.14,SHT=.8;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function run(seed){
 const rnd=rng(seed);const B=[];
 const start=[[-150,-120],[150,-120],[-150,90],[150,90]];
 for(let i=0;i<N;i++){const a=rnd()*6.283,sp=VMIN+rnd()*(VMAX-VMIN)*.6;B.push({x:CX+start[i][0]+(rnd()-.5)*40,y:CY+start[i][1]+(rnd()-.5)*40,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,hp:HP0,r:rad(HP0),alive:1,wc:0})}
 const pc={},kos=[];const Rt=tt=>{let r=R;for(const k of kos)r-=SHR*R*Math.min(1,Math.max(0,(tt-k)/SHT));return r};

 const frames=[],events=[];let t=0,endT=null,win=-1,maxPen=0,maxStep=0,tunnel=0,ties=0,outside=0;
 const snap=()=>B.map(b=>[+b.x.toFixed(1),+b.y.toFixed(1),+b.r.toFixed(2),b.alive?b.hp:0]);
 for(let f=0;f<FPS*70;f++){
  for(let s=0;s<SUB;s++){t+=DT;
   const prev=B.map(b=>[b.x,b.y]);const RIN=Rt(t)-HT,WV=(Rt(t-DT)-Rt(t))/DT;
   for(let i=0;i<N;i++){const b=B[i];if(!b.alive)continue;
    b.vy+=G*DT;let sp=Math.hypot(b.vx,b.vy);if(sp<VMIN){b.vx*=VMIN/sp;b.vy*=VMIN/sp}else if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}
    b.x+=b.vx*DT;b.y+=b.vy*DT;b.wc-=DT;maxStep=Math.max(maxStep,Math.hypot(b.x-prev[i][0],b.y-prev[i][1])/b.r);
    const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d;
    if(d+b.r>RIN){if(d-b.r>RIN)tunnel++;b.x=CX+nx*(RIN-b.r);b.y=CY+ny*(RIN-b.r);const vr=b.vx*nx+b.vy*ny+WV;if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;
      if(vr>80&&b.wc<=0){b.wc=.1;events.push({t,type:'wall',ball:i,x:CX+nx*RIN,y:CY+ny*RIN,nx,ny,v:vr})}}}}
   // swept check (CCD): did any pair pass THROUGH each other during this sub-step without an overlap being seen?
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];if(!a.alive||!c.alive)continue;
    const rx0=prev[j][0]-prev[i][0],ry0=prev[j][1]-prev[i][1],rx1=c.x-a.x,ry1=c.y-a.y,ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;
    let u=ee>0?Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)):0;const mx0=rx0+ex*u,my0=ry0+ey*u;
    if(Math.hypot(mx0,my0)<a.r+c.r&&Math.hypot(rx1,ry1)>=a.r+c.r&&Math.hypot(rx0,ry0)>=a.r+c.r)tunnel++}
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];if(!a.alive||!c.alive)continue;const qx=c.x-a.x,qy=c.y-a.y,qd=Math.hypot(qx,qy)||1e-6,ov=a.r+c.r-qd;
    if(ov>0){const mx=qx/qd,my=qy/qd,ma=a.r*a.r,mc=c.r*c.r;a.x-=mx*ov*mc/(ma+mc);a.y-=my*ov*mc/(ma+mc);c.x+=mx*ov*ma/(ma+mc);c.y+=my*ov*ma/(ma+mc);
     const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;
     if(vn<0){const sa=Math.hypot(a.vx,a.vy),sc=Math.hypot(c.vx,c.vy),J=2*vn/(ma+mc);a.vx+=J*mc*mx;a.vy+=J*mc*my;c.vx-=J*ma*mx;c.vy-=J*ma*my;
      const key=i+'-'+j;if(-vn>60&&!(pc[key]>t)){pc[key]=t+.15;
       if(Math.abs(sa-sc)<12){ties++;events.push({t,type:'tie',a:i,b:j,x:a.x+mx*a.r,y:a.y+my*a.r})}
       else{const L=sa<sc?i:j,W=L===i?j:i,lb=B[L];lb.hp--;const r1=lb.r;lb.r=rad(lb.hp);
        events.push({t,type:'crash',a:i,b:j,loser:L,winner:W,sl:Math.min(sa,sc),sw:Math.max(sa,sc),x:a.x+mx*a.r,y:a.y+my*a.r,hp:lb.hp,r1,v:-vn});
        if(lb.hp<=0){lb.alive=0;kos.push(t);events.push({t,type:'out',ball:L,by:W,x:lb.x,y:lb.y,r:r1});const al=B.filter(q=>q.alive);if(al.length===1&&endT===null){endT=t;win=B.indexOf(al[0])}}}}}}}
   {const RIN=Rt(t)-HT;for(let i=0;i<N;i++){const b=B[i];if(!b.alive)continue;const d=Math.hypot(b.x-CX,b.y-CY);if(d+b.r>RIN+.5)outside++;
    let pen=Math.max(0,d+b.r-RIN);for(let j=0;j<N;j++)if(j!==i&&B[j].alive)pen=Math.max(pen,b.r+B[j].r-Math.hypot(b.x-B[j].x,b.y-B[j].y));if(pen>maxPen)maxPen=pen}}
   if(s===SUB/2-1)frames.push(snap());
  }
  frames.push(snap());
  if(endT!==null&&t>endT+TAIL)break;
 }
 if(endT===null)return{fail:'timeout'};
 return{frames,events,endT,win,seed,R,SHR,SHT,kos,HT,CX,CY,HP0,RMIN,RK,N,fps:FPS,maxPen,maxStep,tunnel,ties,outside};
}
const MIN=+process.env.MINT||27,MAX=+process.env.MAXT||31,WINMAX=+process.env.WINMAX||3;let res=null,log=[];
for(let s=SEED;s<SEED+6000;s++){const r=run(s);
 if(r.fail){log.push(s+':'+r.fail);continue}
 const outs=r.events.filter(e=>e.type==='out').map(e=>e.t),whp=r.frames[r.frames.length-1][r.win][3];
 log.push(s+':end'+r.endT.toFixed(1)+' outs '+outs.map(v=>v.toFixed(1)).join(',')+' whp'+whp+' ties'+r.ties);
 const sp=outs.length===3&&outs[0]>7&&outs[1]-outs[0]>3&&outs[2]-outs[1]>3.5&&outs[2]-outs[1]<(+process.env.DUELMAX||99)&&outs[1]-outs[0]<(+process.env.MIDMAX||99);
 const ct=r.events.filter(e=>e.type==="crash").map(e=>e.t),mg=Math.max(...ct.slice(1).map((v,i)=>v-ct[i]));
 if(mg<(+process.env.MAXGAP||99)&&r.endT>MIN&&r.endT<MAX&&sp&&whp<=WINMAX&&r.ties===0&&r.tunnel===0&&r.outside===0&&r.maxPen<1.0&&r.maxStep<.25){res=r;break}}
if(!res){console.log(log.slice(-40).join('\n'));process.exit(1)}
const cr=res.events.filter(e=>e.type==='crash');
console.log('seed',res.seed,'winner',res.win,'end',res.endT.toFixed(2),'outs',res.events.filter(e=>e.type==='out').map(e=>e.ball+'@'+e.t.toFixed(1)).join(' '),'winnerHP',res.frames[res.frames.length-1][res.win][3],
 'crashes',cr.length,'walls',res.events.filter(e=>e.type==='wall').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
res.ffps=60;{const SP=+process.env.SLOW||.4,s0=res.endT-(+process.env.S0||1.2),s1=res.endT+(+process.env.S1||.5),end=res.frames.length/60-.02;
 const VF=+process.env.VFPS||60;res.vfps=VF;const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'final KO at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
