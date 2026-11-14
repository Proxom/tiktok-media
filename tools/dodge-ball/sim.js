// 1M+ #6 "1 vs 10" (family B/F): ONE gold runner ball inside a closed neon ring; red chaser balls join one by one (every ENT s) until there are 10.
// RULES (exactly what the code does): chasers steer toward where the runner is heading; the runner steers away from the chasers and the wall.
// Chasers bounce off each other (elastic, equal mass) and off the wall; the runner bounces off the wall. The FIRST chaser that touches the runner catches it: game over.
// The TIMER is the sim time until the catch. A CLOSE CALL = a chaser came within NEAR px of the runner's edge and then fell back past FAR px without touching.
// Scripted steering (no AI training). Fixed timestep 600 Hz (10 sub-steps per 60 fps frame) + swept (continuous) checks every sub-step:
// runner-chaser contact time is found exactly inside the sub-step; chaser-chaser pass-throughs and wall escapes are counted as tunnel (must be 0).
// frames[k] = state at sim time (k+1)/60: [rx,ry, then per chaser x,y,on(0/1)].
// node sim.js <out.js> [seed]  env: ENT T0 VR VC AR AC TIRE CGROW MINT MAXT MINCLOSE TAIL
const fs=require('fs');const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=60,SUB=10,DT=1/(FPS*SUB),CX=+process.env.CX||500,CY=+process.env.CY||1030,R=+process.env.R||400,HT=9,RR=+process.env.RR||30,RC=+process.env.RC||27,NC=10;
const E=(k,d)=>process.env[k]!==undefined?+process.env[k]:d;
const ENT=E('ENT',1.8),T0=E('T0',1.2),VR=E('VR',560),VC=E('VC',430),AR=E('AR',2200),AC=E('AC',900),TIRE=E('TIRE',0),CGROW=E('CGROW',0),TAIL=E('TAIL',3.0),NEAR=E('NEAR',28),FAR=E('FAR',80),ND=E('ND',24),LA1=E('LA1',.3),LA2=E('LA2',.8),WM=E('WM',30),WP=E('WP',1.5),TURN=E('TURN',25),NOISE=E('NOISE',10),CL=E('CL',1),MCAP=E('MCAP',250),SOFT=E('SOFT',60),DTRIG=E('DTRIG',45),DASH=E('DASH',1.7),DDUR=E('DDUR',.35),DCD=E('DCD',1.6),KG=E('KG',7);
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function run(seed){const rnd=rng(seed),RIN=R-HT;
 const ra=rnd()*6.283;const P={x:CX+Math.cos(ra)*60,y:CY+Math.sin(ra)*60,vx:0,vy:0,ph:rnd()*9,ph2:rnd()*9};
 const C=[];for(let k=0;k<NC;k++)C.push({on:0,x:0,y:0,vx:0,vy:0,lead:.05+rnd()*.45,side:(rnd()-.5)*1.6,near:0,minG:1e9,minT:0,mx:0,my:0,wc:0,te:T0+k*ENT});
 const frames=[],events=[];let t=0,endT=null,catcher=-1,tunnel=0,maxPen=0,maxStep=0,outside=0,caughtAt=null;
 const snap=()=>{const a=[+P.x.toFixed(1),+P.y.toFixed(1)];for(const c of C)a.push(+c.x.toFixed(1),+c.y.toFixed(1),c.on);return a};
 const vmaxR=tt=>VR*(1-TIRE*Math.min(1,tt/30)),vmaxC=tt=>VC*(1+CGROW*tt);
 for(let f=0;f<FPS*60;f++){
  for(let s=0;s<SUB;s++){t+=DT;
   // entries: spawn on the rim opposite the runner, at the first free angle
   for(let k=0;k<NC;k++){const c=C[k];if(c.on||t<c.te||endT!==null)continue;const pa=Math.atan2(P.y-CY,P.x-CX);
    for(let j=0;j<40;j++){const a=pa+Math.PI+(j%2?1:-1)*Math.ceil(j/2)*.28,sx=CX+Math.cos(a)*(RIN-RC-4),sy=CY+Math.sin(a)*(RIN-RC-4);
     if(C.every(o=>!o.on||Math.hypot(o.x-sx,o.y-sy)>2*RC+14)&&Math.hypot(P.x-sx,P.y-sy)>RR+RC+160){c.on=1;c.x=sx;c.y=sy;c.vx=-Math.cos(a)*220;c.vy=-Math.sin(a)*220;events.push({t,type:'enter',c:k,x:sx,y:sy,n:C.filter(o=>o.on).length});break}}}
   const prevP=[P.x,P.y],prev=C.map(c=>[c.x,c.y]);
   if(endT===null){
    // runner steering (once per 60 fps frame): try ND headings, look ahead LA1/LA2 s, keep the one with the most room from the chasers and the wall
    if(s===0){const vm0=vmaxR(t)*(t<(P.dash||0)?DASH:1);let bestS=-1e9,bh=P.h||0;for(let q=0;q<ND*(process.env.HALF?2:1);q++){const th=(q%ND)*6.2832/ND,vf=q<ND?1:.5;let sc=0;
      // walk the path in 0.05 s steps (sliding along the wall like the real runner); margin = distance minus how far a chaser could close in by then
      {let qx=P.x,qy=P.y,mn=1e9,soft=0,pen=0;const st=Math.max(1,Math.round(LA2/.05));for(let k=1;k<=st;k++){const tau=k*LA2/st;qx+=Math.cos(th)*vm0*vf*LA2/st;qy+=Math.sin(th)*vm0*vf*LA2/st;
        const od=Math.hypot(qx-CX,qy-CY),lim=RIN-RR-4;if(od>lim){qx=CX+(qx-CX)*lim/od;qy=CY+(qy-CY)*lim/od}
        for(const c of C){if(!c.on)continue;const d=Math.hypot(qx-c.x,qy-c.y)-vmaxC(t)*tau*CL-RR-RC;if(d<mn)mn=d;if(k===st)soft+=Math.exp(-d/90)}}
       const od=Math.hypot(qx-CX,qy-CY);pen=Math.max(0,od-(RIN-RR-WM));sc+=(mn<1e8?Math.min(mn,MCAP):MCAP)-SOFT*soft-WP*pen}
      sc+=TURN*Math.cos(th-bh)+(rnd()-.5)*NOISE;if(sc>bestS){bestS=sc;P.ht=th;P.vf=vf}}P.h=P.ht}
    // DODGE: when a chaser's edge gets within DTRIG px and the dash is ready, the runner bursts to DASH x speed for DDUR s (cooldown DCD s)
    if(s===0&&endT===null&&t>=(P.cd||0)){let g=1e9;for(const c of C)if(c.on)g=Math.min(g,Math.hypot(c.x-P.x,c.y-P.y)-RR-RC);if(g<DTRIG){P.dash=t+DDUR;P.cd=t+DCD;events.push({t,type:'dodge',x:P.x,y:P.y,n:events.filter(e=>e.type==='dodge').length+1})}}
    let fx=Math.cos(P.h||0),fy=Math.sin(P.h||0);
    const dsh=t<(P.dash||0),fl=Math.hypot(fx,fy)||1e-6,vm=vmaxR(t)*(P.vf||1)*(dsh?DASH:1);let tx=fx/fl*vm,ty=fy/fl*vm;{const ox=P.x-CX,oy=P.y-CY,od=Math.hypot(ox,oy)||1e-6,nx=ox/od,ny=oy/od,out=tx*nx+ty*ny;if(out>0&&RIN-od-RR<50){const k=Math.min(1,(50-(RIN-od-RR))/40);tx-=out*nx*k;ty-=out*ny*k;const tl=Math.hypot(tx,ty)||1e-6;tx*=vm/tl;ty*=vm/tl}} /* slide along the wall instead of running into it */let ax=(tx-P.vx)*KG,ay=(ty-P.vy)*KG,al=Math.hypot(ax,ay),AM=AR*(dsh?3:1);if(al>AM){ax*=AM/al;ay*=AM/al}
    P.vx+=ax*DT;P.vy+=ay*DT;let sp=Math.hypot(P.vx,P.vy);if(sp>vm){P.vx*=vm/sp;P.vy*=vm/sp}
    P.x+=P.vx*DT;P.y+=P.vy*DT;
    {const dx=P.x-CX,dy=P.y-CY,d=Math.hypot(dx,dy),nx=dx/d,ny=dy/d;if(d+RR>RIN){if(d-RR>RIN)tunnel++;P.x=CX+nx*(RIN-RR);P.y=CY+ny*(RIN-RR);const vr=P.vx*nx+P.vy*ny;if(vr>0){P.vx-=1.9*vr*nx;P.vy-=1.9*vr*ny;events.push({t,type:'pwall',x:CX+nx*RIN,y:CY+ny*RIN,v:vr})}}}
   }
   // chasers
   for(const c of C){if(!c.on)continue;
    if(endT===null){const tx0=P.x+P.vx*c.lead,ty0=P.y+P.vy*c.lead,dx=tx0-c.x,dy=ty0-c.y,d=Math.hypot(dx,dy)||1e-6;
     // flankers aim a little to one side of the runner while still far away
     const sf=c.side*Math.min(1,d/400)*.5,ux=dx/d-dy/d*sf,uy=dy/d+dx/d*sf,ul=Math.hypot(ux,uy),vm=vmaxC(t);
     let ax=(ux/ul*vm-c.vx)*3,ay=(uy/ul*vm-c.vy)*3,al=Math.hypot(ax,ay);if(al>AC){ax*=AC/al;ay*=AC/al}c.vx+=ax*DT;c.vy+=ay*DT;let sp=Math.hypot(c.vx,c.vy);if(sp>vm*1.15){c.vx*=vm*1.15/sp;c.vy*=vm*1.15/sp}}
    else{const k=Math.exp(-1.6*DT);c.vx*=k;c.vy*=k}
    c.x+=c.vx*DT;c.y+=c.vy*DT;c.wc-=DT;
    const dx=c.x-CX,dy=c.y-CY,d=Math.hypot(dx,dy),nx=dx/d,ny=dy/d;if(d+RC>RIN){if(d-RC>RIN)tunnel++;c.x=CX+nx*(RIN-RC);c.y=CY+ny*(RIN-RC);const vr=c.vx*nx+c.vy*ny;if(vr>0){c.vx-=1.85*vr*nx;c.vy-=1.85*vr*ny;if(vr>90&&c.wc<=0){c.wc=.12;events.push({t,type:'wall',c:C.indexOf(c),x:CX+nx*RIN,y:CY+ny*RIN,v:vr})}}}}
   for(let i=0;i<NC;i++){if(C[i].on)maxStep=Math.max(maxStep,Math.hypot(C[i].x-prev[i][0],C[i].y-prev[i][1])/RC)}maxStep=Math.max(maxStep,Math.hypot(P.x-prevP[0],P.y-prevP[1])/RR);
   // swept chaser-chaser check + collisions
   for(let i=0;i<NC;i++)for(let j=i+1;j<NC;j++){const a=C[i],b=C[j];if(!a.on||!b.on)continue;
    const rx0=prev[j][0]-prev[i][0],ry0=prev[j][1]-prev[i][1],rx1=b.x-a.x,ry1=b.y-a.y,ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;let u=ee>0?Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)):0;
    if(Math.hypot(rx0+ex*u,ry0+ey*u)<2*RC&&Math.hypot(rx1,ry1)>=2*RC&&Math.hypot(rx0,ry0)>=2*RC)tunnel++;
    const qd=Math.hypot(rx1,ry1)||1e-6,ov=2*RC-qd;if(ov>0){const mx=rx1/qd,my=ry1/qd;a.x-=mx*ov/2;a.y-=my*ov/2;b.x+=mx*ov/2;b.y+=my*ov/2;const vn=(b.vx-a.vx)*mx+(b.vy-a.vy)*my;
     if(vn<0){a.vx+=vn*mx;a.vy+=vn*my;b.vx-=vn*mx;b.vy-=vn*my;if(-vn>70)events.push({t,type:'bump',a:i,b:j,x:a.x+mx*RC,y:a.y+my*RC,v:-vn})}}}
   // swept runner-chaser contact = CATCH (exact time inside the sub-step)
   if(endT===null){let best=null;for(let i=0;i<NC;i++){const c=C[i];if(!c.on)continue;
     const rx0=prev[i][0]-prevP[0],ry0=prev[i][1]-prevP[1],rx1=c.x-P.x,ry1=c.y-P.y,ex=rx1-rx0,ey=ry1-ry0,S=RR+RC;
     const A=ex*ex+ey*ey,B=2*(rx0*ex+ry0*ey),Cq=rx0*rx0+ry0*ry0-S*S;let u=null;if(Cq<=0)u=0;else if(A>0){const disc=B*B-4*A*Cq;if(disc>=0){const u1=(-B-Math.sqrt(disc))/(2*A);if(u1>=0&&u1<=1)u=u1}}
     if(u!==null&&(!best||u<best.u))best={u,i}}
    if(best){const i=best.i,u=best.u,c=C[i];endT=t-DT+u*DT;catcher=i;
     const px=prevP[0]+(P.x-prevP[0])*u,py=prevP[1]+(P.y-prevP[1])*u,cx=prev[i][0]+(c.x-prev[i][0])*u,cy=prev[i][1]+(c.y-prev[i][1])*u;P.x=px;P.y=py;c.x=cx;c.y=cy;
     events.push({t:endT,type:'catch',c:i,x:px+(cx-px)*RR/(RR+RC),y:py+(cy-py)*RR/(RR+RC),px,py});P.vx=P.vy=0}}
   // close calls
   if(endT===null)for(let i=0;i<NC;i++){const c=C[i];if(!c.on)continue;const g=Math.hypot(c.x-P.x,c.y-P.y)-RR-RC;if(g<0){maxPen=Math.max(maxPen,-g)}
    if(g<NEAR){c.near=1;if(g<c.minG){c.minG=g;c.minT=t;c.mx=(c.x+P.x)/2;c.my=(c.y+P.y)/2}}else if(c.near&&g>FAR){events.push({t:c.minT,type:'close',c:i,gap:+c.minG.toFixed(1),x:c.mx,y:c.my,tc:t});c.near=0;c.minG=1e9}}
   {for(const c of C)if(c.on){const d=Math.hypot(c.x-CX,c.y-CY);if(d+RC>RIN+.5)outside++}const d=Math.hypot(P.x-CX,P.y-CY);if(d+RR>RIN+.5)outside++}
  }
  frames.push(snap());if(endT!==null&&t>endT+TAIL)break;
 }
 if(endT===null)return{fail:'nocatch'};
 events.sort((a,b)=>a.t-b.t);
 return{frames,events,endT,catcher,seed,R,HT,CX,CY,RR,RC,NC,ENT,T0,fps:FPS,ffps:FPS,tunnel,maxPen,maxStep,outside};
}
const MIN=E('MINT',22),MAX=E('MAXT',27),MINCLOSE=E('MINCLOSE',6),LASTGAP=E('LASTGAP',3);let res=null,log=[];
for(let s=SEED;s<SEED+(+process.env.TRIES||3000);s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 const cl=r.events.filter(e=>e.type==='close').length,ne=r.events.filter(e=>e.type==='enter').length,le=Math.max(...r.events.filter(e=>e.type==='enter').map(e=>e.t));
 log.push(s+': catch '+r.endT.toFixed(2)+' close '+cl+' entered '+ne+' by #'+(r.catcher+1));
 if(process.env.ANY||r.endT>MIN&&r.endT<MAX&&ne===NC&&r.endT-le>LASTGAP&&cl>=MINCLOSE&&r.tunnel===0&&r.outside===0&&r.maxPen<1&&r.maxStep<.25){res=r;break}}
if(process.env.STATS){const ct=log.filter(l=>l.includes(': catch')).map(l=>+l.split('catch ')[1].split(' ')[0]).sort((a,b)=>a-b);console.log('runs',log.length,'nocatch',log.filter(l=>l.includes('nocatch')).length,'catch times p10/50/90',ct[Math.floor(ct.length*.1)],ct[Math.floor(ct.length*.5)],ct[Math.floor(ct.length*.9)])}
if(!res){console.log(log.slice(-15).join('\n'));process.exit(1)}
console.log('seed',res.seed,'catch',res.endT.toFixed(2),'by #'+(res.catcher+1),'close',res.events.filter(e=>e.type==='close').length,'bumps',res.events.filter(e=>e.type==='bump').length,'walls',res.events.filter(e=>e.type==='wall').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
{const SP=E('SLOW',.35),s0=res.endT-E('S0',.9),s1=res.endT+E('S1',.4),end=res.frames.length/60-.02,VF=60;res.vfps=VF;const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'dur',(tm.length/VF).toFixed(2),'catch at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;res.tire=TIRE;res.cgrow=CGROW;res.vc0=VC;res.vr=VR;
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
