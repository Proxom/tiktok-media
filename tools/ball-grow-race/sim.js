// Format D colour race "Pick a colour": THREE balls (red, blue, green) bounce inside one rotating neon ring with a gap.
// Until someone escapes, every bounce OFF THE RING makes that ball a bit bigger (ball-ball hits do not grow). A ball escapes only if it passes the
// gap while it is still narrower than the gap. First one out wins. Real 2D physics: gravity, elastic ring/cap bounces,
// elastic ball-ball collisions (mass ~ r^2), 600 Hz sub-steps (max move per step << radius, so nothing can tunnel).
// frames[k] = state at sim time (k+1)/60 (renderer uses ff=t*60-1). The game rule keeps each ball's speed between VMIN and VMAX. Seed search picks a close, late race.
// node sim.js <out.js> [seed]  (env R, CX, CY, GAP, GROW, R0, OM, MINT, MAXT, MINRATIO, LOSEMIN, TAIL)
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=20,DT=1/(FPS*SUB),CX=+process.env.CX||540,CY=+process.env.CY||1030,R=+process.env.R||390,HT=9,G=620;
const GAP=+process.env.GAP||.24,GROW=+process.env.GROW||1.5,R0=+process.env.R0||22,OM=+process.env.OM||.8,VMIN=+process.env.VMIN||380,VMAX=+process.env.VMAX||700,TAIL=+process.env.TAIL||4.4;
const N=3,CLEAR=2*R*Math.sin(GAP)-2*HT;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
function run(seed){
 const rnd=rng(seed);const a0=rnd()*6.283;
 const B=[];for(let i=0;i<N;i++){B.push({x:CX+(i-1)*150+(rnd()-.5)*30,y:CY-90-rnd()*90,vx:(rnd()<.5?-1:1)*(140+rnd()*140),vy:200+rnd()*160,r:R0,cool:0,state:0,n:0})}
 const frames=[],events=[];let t=0,winT=null,win=-1,maxPen=0,maxStep=0,teleport=0,outsideTouch=0,bb=0;
 const snap=()=>B.map(b=>[+b.x.toFixed(1),+b.y.toFixed(1),+b.r.toFixed(2),b.state]);
 for(let f=0;f<FPS*70;f++){
  for(let s=0;s<SUB;s++){t+=DT;const gc=a0+OM*t;
   for(let i=0;i<N;i++){const b=B[i];
    b.vy+=G*DT;const ox=b.x,oy=b.y;b.x+=b.vx*DT;b.y+=b.vy*DT;b.cool-=DT;maxStep=Math.max(maxStep,Math.hypot(b.x-ox,b.y-oy)/b.r);
    if(b.state===0){let sp=Math.hypot(b.vx,b.vy);if(sp<VMIN){b.vx*=VMIN/sp;b.vy*=VMIN/sp}else if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}}
    if(b.state!==0){const d4=Math.hypot(b.x-CX,b.y-CY);if(Math.abs(d4-R)<b.r+HT){const off4=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));if(off4>=GAP-.02)outsideTouch++}continue}
    const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d,off=Math.abs(wrap(Math.atan2(dy,dx)-gc));let hit=null;
    if(off>=GAP&&d+b.r>R-HT){if(d>R)teleport++;b.x=CX+nx*(R-HT-b.r);b.y=CY+ny*(R-HT-b.r);const vr=b.vx*nx+b.vy*ny;if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;hit={kind:'wall',v:vr,nx,ny}}}
    for(const sg of [-1,1]){const pa=gc+sg*GAP,px=CX+R*Math.cos(pa),py=CY+R*Math.sin(pa),qx=b.x-px,qy=b.y-py,qd=Math.hypot(qx,qy);
     if(qd<b.r+HT){const mx=qx/qd,my=qy/qd;b.x=px+mx*(b.r+HT);b.y=py+my*(b.r+HT);const cvx=-OM*(py-CY),cvy=OM*(px-CX),vn=(b.vx-cvx)*mx+(b.vy-cvy)*my;
      if(vn<0){b.vx-=2*vn*mx;b.vy-=2*vn*my;hit={kind:'cap',v:-vn,nx:-mx,ny:-my}}}}
    if(hit&&hit.v>70&&b.cool<=0){b.cool=.12;b.n++;const r1=b.r;if(win<0)b.r+=GROW; // the race ends at the first escape: no growth after that
     const d2=Math.hypot(b.x-CX,b.y-CY),off2=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));if(off2>=GAP&&d2+b.r>R-HT){const k=(R-HT-b.r)/d2;b.x=CX+(b.x-CX)*k;b.y=CY+(b.y-CY)*k}
     for(const sg of [-1,1]){const pa=gc+sg*GAP,px=CX+R*Math.cos(pa),py=CY+R*Math.sin(pa),qx=b.x-px,qy=b.y-py,qd=Math.hypot(qx,qy);if(qd<b.r+HT){b.x=px+qx/qd*(b.r+HT);b.y=py+qy/qd*(b.r+HT)}}
     events.push({t,type:'bounce',ball:i,kind:hit.kind,x:b.x+hit.nx*b.r,y:b.y+hit.ny*b.r,nx:hit.nx,ny:hit.ny,v:hit.v,r:b.r,r1,n:b.n,ratio:2*b.r/CLEAR})}
   }
   // ball-ball elastic collisions (only balls still inside)
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];if(a.state||c.state)continue;const qx=c.x-a.x,qy=c.y-a.y,qd=Math.hypot(qx,qy)||1e-6,ov=a.r+c.r-qd;
    if(ov>0){const mx=qx/qd,my=qy/qd,ma=a.r*a.r,mc=c.r*c.r;a.x-=mx*ov*mc/(ma+mc);a.y-=my*ov*mc/(ma+mc);c.x+=mx*ov*ma/(ma+mc);c.y+=my*ov*ma/(ma+mc);
     const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;if(vn<0){const J=2*vn/(ma+mc);a.vx+=J*mc*mx;a.vy+=J*mc*my;c.vx-=J*ma*mx;c.vy-=J*ma*my;
      if(-vn>60){bb++;events.push({t,type:'bb',a:i,b:j,x:(a.x+c.x)/2,y:(a.y+c.y)/2,v:-vn})}}}}
   // escape check, stuck check, penetration measurement
   for(let i=0;i<N;i++){const b=B[i];if(b.state!==0)continue;const d3=Math.hypot(b.x-CX,b.y-CY),off3=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));
    if(off3<GAP&&d3-b.r>R+HT){b.state=1;events.push({t,type:'escape',ball:i,x:b.x,y:b.y,r:b.r,ratio:2*b.r/CLEAR,first:win<0});if(win<0){win=i;winT=t}else return{fail:'second'}}
    if(2*b.r>=CLEAR)return{fail:'stuck'};
    let pen=0;if(off3>=GAP)pen=Math.max(pen,b.r+HT-Math.abs(d3-R));
    for(const sg of [-1,1]){const pa=gc+sg*GAP;pen=Math.max(pen,b.r+HT-Math.hypot(b.x-CX-R*Math.cos(pa),b.y-CY-R*Math.sin(pa)))}
    for(let j=0;j<N;j++)if(j!==i&&B[j].state===0)pen=Math.max(pen,b.r+B[j].r-Math.hypot(b.x-B[j].x,b.y-B[j].y));
    if(pen>maxPen)maxPen=pen}
   if(s===SUB/2-1)frames.push(snap());
  }
  frames.push(snap());
  if(winT!==null&&t>winT+TAIL)break;
 }
 if(winT===null)return{fail:'timeout'};
 return{frames,events,escT:winT,win,seed,a0,OM,GAP,R,HT,CX,CY,CLEAR,R0,GROW,N,fps:FPS,maxPen,maxStep,teleport,outsideTouch,bb};
}
const MIN=+process.env.MINT||27,MAX=+process.env.MAXT||31,MINRATIO=+process.env.MINRATIO||.88,LOSEMIN=+process.env.LOSEMIN||.80;let res=null,log=[];
for(let s=SEED;s<SEED+4000;s++){const r=run(s);
 if(r.fail){log.push(s+':'+r.fail);continue}
 const e=r.events.find(q=>q.type==='escape'),bo=r.events.filter(q=>q.type==='bounce');
 const ratioAt=i=>{const l=bo.filter(q=>q.ball===i&&q.t<=r.escT);return l.length?l[l.length-1].ratio:2*R0/CLEAR};
 const losers=[0,1,2].filter(i=>i!==r.win).map(ratioAt);
 log.push(s+':esc'+r.escT.toFixed(1)+'@'+e.ratio.toFixed(2)+'/'+losers.map(v=>v.toFixed(2)).join(','));
 const last=r.frames[r.frames.length-1][r.win];
 const firstB=[0,1,2].map(i=>bo.find(q=>q.ball===i)).every(q=>q&&q.t<1.2);
 if(r.escT>MIN&&r.escT<MAX&&e.ratio>=MINRATIO&&Math.min(...losers)>=LOSEMIN&&r.maxPen<1.0&&r.maxStep<.25&&r.teleport===0&&r.outsideTouch===0&&firstB&&last[1]>2000
  &&r.frames.every(F=>F.every(q=>q[1]-q[2]>(+process.env.TOPMIN||640)))&&e.x-e.r>(+process.env.ESCXMIN||120)&&e.x+e.r<(+process.env.ESCXMAX||900)
  &&r.frames.every(F=>{const q=F[r.win];return q[3]===0||q[1]-q[2]>1920||(q[0]-q[2]>=0&&q[0]+q[2]<=1080)})/* winner leaves through the BOTTOM, fully in frame */){res=r;res.loserRatios=losers;break}}
if(!res){console.log(log.slice(-50).join(' '));process.exit(1)}
const bo=res.events.filter(e=>e.type==='bounce'),gaps=bo.slice(1).map((e,i)=>e.t-bo[i].t);
console.log('seed',res.seed,'winner',res.win,'escape',res.escT.toFixed(2),'ratio',res.events.find(e=>e.type==='escape').ratio.toFixed(3),'losers',res.loserRatios.map(v=>v.toFixed(3)).join(','),
 'bounces',[0,1,2].map(i=>bo.filter(e=>e.ball===i).length).join('/'),'bb',res.bb,'min gap',Math.min(...gaps).toFixed(3),'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tried',log.length);
res.ffps=60;{const SP=+process.env.SLOW||.4,s0=res.escT-(+process.env.S0||1.2),s1=res.escT+(+process.env.S1||.5),end=res.frames.length/60-.02;
 const VF=+process.env.VFPS||60;res.vfps=VF;const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'escape at video t',(tm.findIndex(v=>v>=res.escT)/VF).toFixed(2))}
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
