// Format D "It grows every bounce": ONE ball bounces inside a rotating neon ring with a gap. Every bounce makes it a bit
// bigger. It escapes only if it passes the gap while it is still narrower than the gap (meter BALL vs GAP < 100%).
// Real 2D collisions: inner arc wall + the two round gap caps (moving with the ring), gravity, elastic bounces; the game rule
// keeps the speed between VMIN and VMAX. Seed search picks an episode where the escape happens late and close to 100%.
// node sim.js <out.js> [seed]  (env R, GAP, GROW, R0, OM, MINT, MAXT, MINRATIO)
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=20,DT=1/(FPS*SUB),CX=+process.env.CX||525,CY=+process.env.CY||1060,R=+process.env.R||400,HT=9,G=620;
const GAP=+process.env.GAP||.27,GROW=+process.env.GROW||1.6,R0=+process.env.R0||24,OM=+process.env.OM||.8,VMIN=+process.env.VMIN||380,VMAX=+process.env.VMAX||720,TAIL=+process.env.TAIL||3.6;
const CLEAR=2*R*Math.sin(GAP)-2*HT; // free width between the two caps: the ball fits through only if 2r < CLEAR
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
function run(seed){
 const rnd=rng(seed);const a0=rnd()*6.283;
 const b={x:CX+(rnd()-.5)*120,y:CY-120-rnd()*60,vx:(rnd()<.5?-1:1)*(140+rnd()*120),vy:260+rnd()*100,r:R0,cool:0,state:0};
 const frames=[],events=[];let t=0,escT=null,maxPen=0,bounces=0,outsideTouch=0,teleport=0;
 for(let f=0;f<FPS*70;f++){
  for(let s=0;s<SUB;s++){t+=DT;const gc=a0+OM*t;
   b.vy+=G*DT;b.x+=b.vx*DT;b.y+=b.vy*DT;b.cool-=DT;
   if(b.state===0){let sp=Math.hypot(b.vx,b.vy);if(sp<VMIN){b.vx*=VMIN/sp;b.vy*=VMIN/sp}else if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}}
   const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d,off=Math.abs(wrap(Math.atan2(dy,dx)-gc));
   let hit=null;
   if(b.state===0){
    if(off>=GAP&&d+b.r>R-HT){ if(d>R)teleport++; b.x=CX+nx*(R-HT-b.r);b.y=CY+ny*(R-HT-b.r);const vr=b.vx*nx+b.vy*ny;if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;hit={kind:'wall',v:vr,nx,ny}}}
    for(const sg of [-1,1]){const pa=gc+sg*GAP,px=CX+R*Math.cos(pa),py=CY+R*Math.sin(pa),qx=b.x-px,qy=b.y-py,qd=Math.hypot(qx,qy);
     if(qd<b.r+HT){const mx=qx/qd,my=qy/qd;b.x=px+mx*(b.r+HT);b.y=py+my*(b.r+HT);const cvx=-OM*(py-CY),cvy=OM*(px-CX),vn=(b.vx-cvx)*mx+(b.vy-cvy)*my;
      if(vn<0){b.vx-=2*vn*mx;b.vy-=2*vn*my;hit={kind:'cap',v:-vn,nx:-mx,ny:-my}}}}
    if(hit&&hit.v>70&&b.cool<=0){b.cool=.12;bounces++;const r1=b.r;
     if(2*(b.r+GROW)<CLEAR*1.02||true)b.r+=GROW;
     if(hit.kind==='wall'){const d2=Math.hypot(b.x-CX,b.y-CY);if(d2+b.r>R-HT){const k=(R-HT-b.r)/d2;b.x=CX+(b.x-CX)*k;b.y=CY+(b.y-CY)*k}}
     else{for(const sg of [-1,1]){const pa=gc+sg*GAP,px=CX+R*Math.cos(pa),py=CY+R*Math.sin(pa),qx=b.x-px,qy=b.y-py,qd=Math.hypot(qx,qy);if(qd<b.r+HT){b.x=px+qx/qd*(b.r+HT);b.y=py+qy/qd*(b.r+HT)}}}
     events.push({t,type:'bounce',kind:hit.kind,x:b.x+hit.nx*b.r,y:b.y+hit.ny*b.r,nx:hit.nx,ny:hit.ny,v:hit.v,r:b.r,r1,n:bounces,ratio:2*b.r/CLEAR})}
    const d3=Math.hypot(b.x-CX,b.y-CY),off3=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));
    if(off3<GAP&&d3-b.r>R+HT){b.state=1;escT=t;events.push({t,type:'escape',x:b.x,y:b.y,r:b.r,n:bounces,ratio:2*b.r/CLEAR})}
    if(2*b.r>=CLEAR)return{fail:'stuck',t};
   }else{ // escaped: must never touch the ring again
    const d4=Math.hypot(b.x-CX,b.y-CY);if(Math.abs(d4-R)<b.r+HT){const off4=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));if(off4>=GAP-.02)outsideTouch++}}
   // penetration check vs the solid ring (arc outside the gap + caps)
   {const d5=Math.hypot(b.x-CX,b.y-CY),off5=Math.abs(wrap(Math.atan2(b.y-CY,b.x-CX)-gc));let pen=0;
    if(off5>=GAP)pen=Math.max(pen,b.r+HT-Math.abs(d5-R));
    for(const sg of [-1,1]){const pa=gc+sg*GAP;pen=Math.max(pen,b.r+HT-Math.hypot(b.x-CX-R*Math.cos(pa),b.y-CY-R*Math.sin(pa)))}
    if(pen>maxPen)maxPen=pen}
   if(s===SUB/2-1)frames.push([+b.x.toFixed(1),+b.y.toFixed(1),+b.r.toFixed(2),b.state]);
  }
  frames.push([+b.x.toFixed(1),+b.y.toFixed(1),+b.r.toFixed(2),b.state]);
  if(escT!==null&&t>escT+TAIL)break;
 }
 if(escT===null)return{fail:'timeout'};
 return{frames,events,escT,seed,a0,OM,GAP,R,HT,CX,CY,CLEAR,R0,GROW,fps:FPS,maxPen,teleport,outsideTouch,bounces};
}
const MIN=+process.env.MINT||33,MAX=+process.env.MAXT||44,MINRATIO=+process.env.MINRATIO||.85;let res=null,log=[];
for(let s=SEED;s<SEED+3000;s++){const r=run(s);
 if(r.fail){log.push(s+':'+r.fail+(r.t?r.t.toFixed(0):''));continue}
 const e=r.events.find(q=>q.type==='escape');log.push(s+':esc'+r.escT.toFixed(1)+'@'+e.ratio.toFixed(2));
 const first=r.events.find(q=>q.type==='bounce');
 const last=r.frames[r.frames.length-1];
 if(r.escT>MIN&&r.escT<MAX&&e.ratio>=MINRATIO&&r.maxPen<1.0&&r.teleport===0&&r.outsideTouch===0&&first.t<1.0&&last[1]>2000&&r.events.find(q=>q.type==="escape").y<(+process.env.ESCMAXY||9999)){res=r;break}}
if(!res){console.log(log.slice(-60).join(' '));process.exit(1)}
const bo=res.events.filter(e=>e.type==='bounce'),gaps=bo.slice(1).map((e,i)=>e.t-bo[i].t);
const rate=[0,10,20,30,40].map(a=>bo.filter(e=>e.t>=a&&e.t<a+10).length/10);
console.log('seed',res.seed,'escape',res.escT.toFixed(2),'ratio',res.events.find(e=>e.type==='escape').ratio.toFixed(3),'bounces',bo.length,'first',bo[0].t.toFixed(2),
 'min gap',Math.min(...gaps).toFixed(2),'bounces/s per 10 s',rate.join(','),'maxPen',res.maxPen.toFixed(2),'frames',res.frames.length,'tried',log.length);
// frames are sampled at 60 fps (two per 1/30 s step). Video time map: 1x, eased down to SLOW x around the escape, eased back.
res.ffps=60;{const SP=+process.env.SLOW||.4,s0=res.escT-(+process.env.S0||1.2),s1=res.escT+(+process.env.S1||.5),end=res.frames.length/60-.02;
 const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/30)/.12);ts+=sp/30}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/30).toFixed(2),'escape at video t',(tm.findIndex(v=>v>=res.escT)/30).toFixed(2))}
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
