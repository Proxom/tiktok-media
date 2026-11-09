// Family D "Plinko / pick a bin": NB balls drop one by one from a dropper that slides left and right at a steady speed across the top.
// RULES (exactly what the code does): each ball falls under gravity through a staggered peg board into one of 4 colored bins (RED, BLUE, YELLOW, GREEN).
// A ball COUNTS for a bin the moment it first touches that bin's floor or a ball already resting in it; it then stays in that bin.
// After the last ball, the bin with the most balls wins (seed filter: no tie at the end).
// Real 2D physics: gravity, restitution on pegs / walls / dividers / balls, ball-ball impulses (equal mass). Fixed timestep 600 Hz (10 sub-steps per 60 fps frame)
// + swept (continuous) check every sub-step against pegs, dividers and balls, logged as tunnel=0. Balls resting in a bin go to sleep (frozen) once slow.
// frames[k] = state at sim time k/60. node sim.js <out.js> [seed]  (env NB, I0, I1, LEADMIN, LASTDECIDES, WINEX, MINT, MAXT)
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=60,SUB=10,DT=1/(FPS*SUB),G=+process.env.G||1500,R=15,PR=7,VMAX=1100;
const XL=90,XR=910,CX=500,BT=1312,FL=1430,DY=690,DIVS=[295,500,705],DW=4,NBIN=4;
const NB=+process.env.NB||36,I0=+process.env.I0||.92,I1=+process.env.I1||.34;
const PEGS=[];for(let k=0;k<10;k++){const y=772+52*k;if(k%2===0)for(let j=-4;j<=4;j++)PEGS.push([CX+82*j,y,k]);else for(let j=-5;j<=4;j++)PEGS.push([CX+41+82*j,y,k])}
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const binOf=x=>x<DIVS[0]?0:x<DIVS[1]?1:x<DIVS[2]?2:3;
function run(seed){
 const rnd=rng(seed);const P=3.6+rnd()*1.6,ph=rnd(),AMP=330;
 const dropX=t=>{const u=((t/P+ph)%1+1)%1;return CX+AMP*(u<.5?4*u-1:3-4*u)};
 const dropT=[];{let t=0;for(let i=0;i<NB;i++){dropT.push(+t.toFixed(4));t+=I0+(I1-I0)*i/(NB-1)}}
 const B=[],events=[],frames=[];let t=0,tunnel=0,maxPen=0,maxStep=0,nd=0;const cnt=[0,0,0,0];
 const snap=()=>B.map(b=>[+b.x.toFixed(1),+b.y.toFixed(1),b.bin]);
 frames.push(snap());
 for(let f=1;f<FPS*45;f++){
  for(let s=0;s<SUB;s++){t+=DT;
   while(nd<NB&&dropT[nd]<=t+1e-9){const x=dropX(t)+(rnd()-.5)*6;B.push({x,y:DY,vx:(rnd()-.5)*30,vy:nd===0?260:60,bin:-1,sleep:0,slow:0,id:nd});events.push({t,type:'drop',ball:nd,x});nd++}
   const prev=B.map(b=>[b.x,b.y]);
   for(const b of B){b.sup=0;if(b.sleep)continue;b.vy+=G*DT;const sp=Math.hypot(b.vx,b.vy);if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}
    b.x+=b.vx*DT;b.y+=b.vy*DT;maxStep=Math.max(maxStep,Math.hypot(b.vx,b.vy)*DT/R);
    // pegs (static circles)
    for(const p of PEGS){if(Math.abs(p[1]-b.y)>R+PR+2||Math.abs(p[0]-b.x)>R+PR+2)continue;const dx=b.x-p[0],dy=b.y-p[1],d=Math.hypot(dx,dy);
     if(d<R+PR){const nx=dx/d,ny=dy/d;b.x=p[0]+nx*(R+PR);b.y=p[1]+ny*(R+PR);const vn=b.vx*nx+b.vy*ny;if(vn<0){const tx=-ny,ty=nx,vt=b.vx*tx+b.vy*ty;
      b.vx=-.5*vn*nx+.92*vt*tx;b.vy=-.5*vn*ny+.92*vt*ty;if(-vn>110)events.push({t,type:'peg',ball:b.id,p:PEGS.indexOf(p),v:-vn,x:p[0],y:p[1]})}}}
    // side walls
    if(b.x<XL+R){b.x=XL+R;if(b.vx<0)b.vx*=-.45;b.sup++}if(b.x>XR-R){b.x=XR-R;if(b.vx>0)b.vx*=-.45;b.sup++}
    // dividers: vertical capsules from (x,BT) to (x,FL), radius DW
    for(const dx0 of DIVS){const cy=Math.max(BT,Math.min(FL,b.y)),dx=b.x-dx0,dy=b.y-cy,d=Math.hypot(dx,dy);if(d<R+DW&&d>0){const nx=dx/d,ny=dy/d;b.x=dx0+nx*(R+DW);b.y=cy+ny*(R+DW);
      const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.4*vn*nx;b.vy-=1.4*vn*ny}b.sup++}}
    if(b.y>FL-R){b.y=FL-R;if(b.vy>0){b.vy*=-.25;b.vx*=.6}b.sup+=2;touch(b)}
   }
   // ball-ball (equal mass; a sleeping ball is static)
   for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],c=B[j];if(a.sleep&&c.sleep)continue;const qx=c.x-a.x,qy=c.y-a.y;if(Math.abs(qx)>2*R||Math.abs(qy)>2*R)continue;const qd=Math.hypot(qx,qy)||1e-6,ov=2*R-qd;
    if(ov>0){const mx=qx/qd,my=qy/qd,wa=a.sleep?0:c.sleep?1:.5,wc=1-wa;a.x-=mx*ov*wa;a.y-=my*ov*wa;c.x+=mx*ov*wc;c.y+=my*ov*wc;
     const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;if(vn<0){const J=-(1.3)*vn;if(a.sleep){c.vx+=J*mx;c.vy+=J*my}else if(c.sleep){a.vx-=J*mx;a.vy-=J*my}else{a.vx-=J*mx/2;a.vy-=J*my/2;c.vx+=J*mx/2;c.vy+=J*my/2}}
     if(c.sleep&&c.y>a.y){a.sup++;if(my>.97)a.vx-=(mx||1e-3)/Math.abs(mx||1e-3)*12}if(a.sleep&&a.y>c.y){c.sup++;if(-my>.97)c.vx+=(mx||1e-3)/Math.abs(mx||1e-3)*12}if(c.sleep)touch(a);if(a.sleep)touch(c);if(a.bin>=0&&!c.sleep)touch(c,a);if(c.bin>=0&&!a.sleep)touch(a,c)}}
   // re-clamp after pushes (walls, floor) so no ball is ever drawn inside a wall
   for(const b of B){if(b.sleep)continue;b.x=Math.min(XR-R,Math.max(XL+R,b.x));if(b.y>FL-R)b.y=FL-R;
    if(b.bin>=0){const sp=Math.hypot(b.vx,b.vy);b.slow=sp<40&&b.sup>=2?b.slow+DT:0;if(b.slow>.25){b.sleep=1;b.vx=b.vy=0}}}
   // CCD: swept test vs pegs (closest approach on the sub-step path)
   for(let i=0;i<B.length;i++){const b=B[i];if(b.sleep||i>=prev.length)continue;const x0=prev[i][0],y0=prev[i][1],ex=b.x-x0,ey=b.y-y0,ee=ex*ex+ey*ey;if(ee<1e-9)continue;
    for(const p of PEGS){if(Math.abs(p[1]-b.y)>40)continue;const u=Math.max(0,Math.min(1,((p[0]-x0)*ex+(p[1]-y0)*ey)/ee)),cx=x0+ex*u-p[0],cy=y0+ey*u-p[1];
     if(Math.hypot(cx,cy)<R+PR-2.5&&Math.hypot(b.x-p[0],b.y-p[1])>=R+PR-.01&&Math.hypot(x0-p[0],y0-p[1])>=R+PR-.01)tunnel++}}
   for(const b of B){for(const p of PEGS){const d=Math.hypot(b.x-p[0],b.y-p[1]);if(R+PR-d>maxPen)maxPen=R+PR-d}}
  }
  frames.push(snap());
  if(nd===NB&&B.every(b=>b.sleep))break;
 }
 function touch(b){if(b.bin>=0||b.y<BT+R)return;b.bin=binOf(b.x);cnt[b.bin]++;events.push({t,type:'land',ball:b.id,bin:b.bin,x:b.x,y:b.y,c:cnt.slice()})}
 if(!(nd===NB&&B.every(b=>b.sleep)))return{fail:'timeout'};
 const lands=events.filter(e=>e.type==='land');const endT=lands[lands.length-1].t;
 const fin=cnt.slice(),mx=Math.max(...fin),win=fin.indexOf(mx),second=Math.max(...fin.filter((v,i)=>i!==win));
 let leader=-1,changes=0;for(const e of lands){const m=Math.max(...e.c),ls=e.c.map((v,i)=>v===m?i:-1).filter(i=>i>=0);if(ls.length===1&&ls[0]!==leader){if(leader>=0)changes++;leader=ls[0]}}
 const pre=lands.length>1?lands[lands.length-2].c:[0,0,0,0],pm=Math.max(...pre),lastDecides=pre.filter(v=>v===pm).length===2&&lands[lands.length-1].bin===pre.indexOf(pm)||(pre.filter(v=>v===pm).length===2&&pre[lands[lands.length-1].bin]===pm);
 const finalBin=B.map(b=>binOf(b.x));
 return{frames,events,endT,win,cnt:fin,margin:mx-second,changes,lastDecides,tie:fin.filter(v=>v===mx).length>1,seed,NB,PEGS,XL,XR,CX,BT,FL,DY,DIVS,R,PR,P,ph,AMP,dropT,fps:FPS,tunnel,maxPen,maxStep,finalBin,binOfBall:B.map(b=>b.bin)};
}
const MIN=+process.env.MINT||23,MAX=+process.env.MAXT||28.5;let res=null,log=[];
for(let s=SEED;s<SEED+3000;s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 log.push(s+':end'+r.endT.toFixed(1)+' cnt '+r.cnt.join('/')+' ch'+r.changes+' last'+(r.lastDecides?1:0));
 const ok=!r.tie&&r.margin===1&&r.changes>=(+process.env.LEADMIN||3)&&(!+process.env.LASTDECIDES||r.lastDecides)&&r.endT>MIN&&r.endT<MAX&&r.tunnel===0&&r.maxPen<2&&r.maxStep<.25&&
  r.finalBin.every((v,i)=>v===r.binOfBall[i])&&(process.env.WINEX||'').split(',').indexOf(String(r.win))<0&&Math.min(...r.cnt)>=4;
 if(ok){res=r;break}}
if(!res){console.log(log.slice(-30).join('\n'));process.exit(1)}
console.log('seed',res.seed,'winner',res.win,'counts',res.cnt.join('/'),'margin',res.margin,'leadChanges',res.changes,'lastDecides',res.lastDecides,'endT',res.endT.toFixed(2),
 'pegHits',res.events.filter(e=>e.type==='peg').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
{const SP=+process.env.SLOW||.4,s0=res.endT-(+process.env.S0||1.0),s1=res.endT+(+process.env.S1||.4),TAIL=+process.env.TAIL||3.6,end=Math.min((res.frames.length-1)/60,res.endT+TAIL);
 const VF=60;res.vfps=VF;const PRE=+process.env.PRE||0;res.pre=PRE;const tm=[];let ts=PRE,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 // hold the last sim frame for the tail if the sim settled early
 while(tm.length/VF<res.endT-PRE+TAIL+(1/SP-1)*(s1-s0)*.8)tm.push(+Math.min(ts,(res.frames.length-1)/60).toFixed(4)),ts+=1/VF;
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'last land at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
delete res.finalBin;res.game=+process.env.GAME||0;res.lastWin=process.env.LASTWIN!==undefined?+process.env.LASTWIN:-1;if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
