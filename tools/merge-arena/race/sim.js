// Family E "Merge race" (merge game rebuilt to the 10 Nov gate): 4 colors drop into one jar; same COLOR + same NUMBER merge into the next number
// (2+2 -> 4 ... 16+16 -> 32 -> 👑). RULES (exactly what the code does):
// 1) a dropper slides (each drop is a 2 or, with probability MIX, a 4) left-right across the top; every drop takes the next color from a shuffled bag of the 4 colors (every color gets the same number of drops).
// 2) two balls with the SAME number that touch merge into one ball of the next number at their midpoint (both must be older than COOL s);
//    the new ball takes the color of the NEWER of the two (later drop or later merge) - "newest color takes it".
// 3) the first color to make the KING (tier TOP) wins; drops and merges stop at that moment (game over).
// Real 2D physics: gravity, ball-ball impulses (mass ~ r^2), restitution, walls + floor. Fixed timestep 600 Hz (10 sub-steps per 60 fps frame),
// swept (continuous) closest-approach check every sub-step for ball-ball and ball-wall, logged as tunnel. frames[k] = state at sim time k/60.
// node sim.js <out.js> [seed]   env: R0 RF TOP COOL I0 I1 MINT MAXT LEADMIN CLOSE PRE SLOW S0 S1 TAIL GAME FOLLOWTEXT WINEX
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1,CHECK=+process.env.CCD||0;
const FPS=60,SUB=10,DT=1/(FPS*SUB),G=+process.env.G||1800,VMAX=1400;
const XL=110,XR=890,CX=500,FL=1424,JT=700,DY=668,AMP=330;
const R0=+process.env.R0||25,RF=+process.env.RF||1.27,TOP=+process.env.TOP||7,COOL=+process.env.COOL||.25;
const I0=+process.env.I0||.30,I1=+process.env.I1||.14,IRAMP=+process.env.IRAMP||14,EB=.18,EW=.25;
const PASSES=+process.env.PASSES||4,MIX=+(process.env.MIX||.4);
const rad=k=>R0*Math.pow(RF,k),GROW=+(process.env.GROW||.15);
// a merged ball grows from its parents' size to its new size over GROW s (physics and drawing use the same radius)
let T=0;const rb_=b=>b.pa&&T-b.born<GROW?rad(b.k-1)+(rad(b.k)-rad(b.k-1))*(T-b.born)/GROW:rad(b.k);
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function run(seed,ccd){
 const rnd=rng(seed);const P=3.2+rnd()*1.4,ph=rnd();
 const dropX=t=>{const u=((t/P+ph)%1+1)%1;return CX+AMP*(u<.5?4*u-1:3-4*u)};
 let penAt=null,B=[],nid=0,t=0,next=.05,bag=[],king=null,tunnel=0,maxStep=0,maxPen=0,nd=0;const events=[],frames=[],best=[-1,-1,-1,-1];
 const takeColor=()=>{if(!bag.length){bag=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(rnd()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}}return bag.shift()};
 const snap=()=>B.map(b=>[b.id,b.c,b.k,+b.x.toFixed(1),+b.y.toFixed(1),+b.born.toFixed(3)]);
 frames.push(snap());
 for(let f=1;f<FPS*60;f++){
  for(let s=0;s<SUB;s++){t+=DT;T=t;
   if(king===null&&t>=next){const c=takeColor(),x=dropX(t)+(rnd()-.5)*8,k0=rnd()<MIX?1:0;B.push({id:nid++,c,k:k0,x,y:DY,vx:(rnd()-.5)*40,vy:120,born:t});best[c]=Math.max(best[c],k0);events.push({t,type:'drop',c,k:k0,x,id:nid-1});nd++;
    next=t+I0+(I1-I0)*Math.min(1,t/IRAMP)}
   const prev=new Map(B.map(b=>[b.id,[b.x,b.y]]));
   for(const b of B){b.vy+=G*DT;const sp=Math.hypot(b.vx,b.vy);if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}b.vx*=.99985;b.vy*=.99985;b.x+=b.vx*DT;b.y+=b.vy*DT;maxStep=Math.max(maxStep,sp*DT/rb_(b))}
   for(let pass=0;pass<PASSES;pass++){
    // merges first (same color + same number touching)
    if(pass===0&&king===null)for(let i=0;i<B.length;i++){const a=B[i];if(a.dead)continue;for(let j=i+1;j<B.length;j++){const b=B[j];if(b.dead||a.dead)continue;if(a.k!==b.k||a.k>=TOP)continue;
      const d=Math.hypot(b.x-a.x,b.y-a.y),r=rad(a.k);if(d<2*r+.5&&t-a.born>=COOL&&t-b.born>=COOL){a.dead=b.dead=true;const nw=(b.born>a.born||(b.born===a.born&&b.id>a.id))?b:a,od=nw===a?b:a,k=a.k+1,m={id:nid++,c:nw.c,k,x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:(a.vx+b.vx)/2,vy:(a.vy+b.vy)/2-100,born:t,pa:[a.id,b.id]};
       B.push(m);events.push({t,type:'merge',c:nw.c,from:od.c,k,x:m.x,y:m.y,id:m.id,pa:[a.id,b.id]});best[nw.c]=Math.max(best[nw.c],k);
       if(k===TOP&&king===null){king={t,c:nw.c,lose:od.c,id:m.id,x:m.x,y:m.y};events.push({t,type:'king',c:nw.c,lose:od.c,id:m.id})}}}}
    B=B.filter(b=>!b.dead);
    for(let i=0;i<B.length;i++){const a=B[i],ra=rb_(a);for(let j=i+1;j<B.length;j++){const b=B[j],rb=rb_(b),dx=b.x-a.x,dy=b.y-a.y;if(Math.abs(dx)>ra+rb||Math.abs(dy)>ra+rb)continue;
      const d=Math.hypot(dx,dy)||1e-6,ov=ra+rb-d;if(ov<=0)continue;const nx=dx/d,ny=dy/d,ma=ra*ra,mb=rb*rb,sm=ma+mb,pc=ov;
      a.x-=nx*pc*mb/sm;a.y-=ny*pc*mb/sm;b.x+=nx*pc*ma/sm;b.y+=ny*pc*ma/sm;
      const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const J=-(1+EB)*rv/(1/ma+1/mb);a.vx-=J*nx/ma;a.vy-=J*ny/ma;b.vx+=J*nx/mb;b.vy+=J*ny/mb;
       const tx=-ny,ty=nx,vt=(b.vx-a.vx)*tx+(b.vy-a.vy)*ty,Jt=.04*vt/(1/ma+1/mb);a.vx+=Jt*tx/ma;a.vy+=Jt*ty/ma;b.vx-=Jt*tx/mb;b.vy-=Jt*ty/mb;
       if(-rv>230&&pass===0)events.push({t,type:'hit',v:-rv,x:(a.x+b.x)/2,y:(a.y+b.y)/2,k:Math.max(a.k,b.k)})}}}
    for(const b of B){const r=rb_(b);
     if(b.x<XL+r){b.x=XL+r;if(b.vx<0){if(-b.vx>260&&pass===0)events.push({t,type:'wall',v:-b.vx,x:b.x,y:b.y,k:b.k});b.vx*=-EW;b.vy*=.995}}
     if(b.x>XR-r){b.x=XR-r;if(b.vx>0){if(b.vx>260&&pass===0)events.push({t,type:'wall',v:b.vx,x:b.x,y:b.y,k:b.k});b.vx*=-EW;b.vy*=.995}}
     if(b.y>FL-r){b.y=FL-r;if(b.vy>0){if(b.vy>260&&pass===0)events.push({t,type:'wall',v:b.vy,x:b.x,y:b.y,k:b.k});b.vy*=-EW;b.vx*=.985}}}
   }
   // swept check (only for the chosen run): a ball passing through another ball or a wall inside one sub-step
   if(ccd){for(let i=0;i<B.length;i++){const a=B[i],pa=prev.get(a.id);if(!pa)continue;const r=rb_(a);
     if(a.x<XL+r-1.5||a.x>XR-r+1.5||a.y>FL-r+1.5)tunnel++;
     for(let j=i+1;j<B.length;j++){const b=B[j],pb=prev.get(b.id);if(!pb)continue;const rr=r+rb_(b);
      const rx0=pb[0]-pa[0],ry0=pb[1]-pa[1],rx1=b.x-a.x,ry1=b.y-a.y;if(Math.abs(rx1)>rr+20||Math.abs(ry1)>rr+20)continue;
      const ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;if(ee<1e-9)continue;const u=Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)),cx=rx0+ex*u,cy=ry0+ey*u;
      if(Math.hypot(cx,cy)<rr*.5&&Math.hypot(rx0,ry0)>=rr*.5&&Math.hypot(rx1,ry1)>=rr*.5)tunnel++;
      const pen=rr-Math.hypot(rx1,ry1);if(pen>maxPen){maxPen=pen;penAt=[t,a.k,b.k]}}}}
  }
  frames.push(snap());
  if(king===null&&B.some(b=>b.y-rad(b.k)<JT-10&&t-b.born>1.2&&Math.abs(b.vy)<60))return{fail:'overflow best '+best.join('/')+' n'+B.length,t};
  if(king!==null&&t>king.t+(+process.env.SIMTAIL||5))break;
  if(king===null&&t>(+process.env.MAXT||29)+.1)return{fail:'slow best '+best.join('/')+' n'+B.length+' drops'+nd};
 }
 if(!king)return{fail:'noking'};
 // leader = the color holding the biggest number (unique); count lead changes up to the king
 let leader=-1,changes=0;const kf=Math.round(king.t*FPS);for(let f=0;f<=Math.min(kf,frames.length-1);f++){const hold=[-1,-1,-1,-1];for(const q of frames[f])hold[q[1]]=Math.max(hold[q[1]],q[2]);const m=Math.max(...hold),ls=hold.map((v,i)=>v===m?i:-1).filter(i=>i>=0);if(m>=2&&ls.length===1&&ls[0]!==leader){if(leader>=0)changes++;leader=ls[0]}}
 const second=king.lose!==king.c?TOP-1:0;
 return{frames,events,king,endT:king.t,win:king.c,best,second,changes,seed,drops:nd,XL,XR,CX,FL,JT,DY,AMP,P,ph,R0,RF,TOP,fps:FPS,tunnel,maxPen,maxStep,penAt,GROW};
}
const MIN=+process.env.MINT||21,MAX=+process.env.MAXT||27;let res=null,log=[];
const NS=+process.env.NS||600;for(let s=SEED;s<SEED+NS;s++){const r=run(s,0);if(r.fail){log.push(s+':'+r.fail+(r.t?r.t.toFixed(1):''));continue}
 log.push(s+':king'+r.endT.toFixed(1)+' win'+r.win+' lose'+r.king.lose+' ch'+r.changes+' step'+r.maxStep.toFixed(2));
 const ok=r.endT>MIN&&r.endT<MAX&&r.changes>=(+process.env.LEADMIN||2)&&r.second>=TOP-(+process.env.CLOSE||1)&&r.maxStep<.25&&(process.env.WINEX||'').split(',').indexOf(String(r.win))<0;
 if(ok){const r2=run(s,1);if(r2.tunnel===0&&r2.maxPen<4){res=r2;break}log.push(s+':ccd tunnel '+r2.tunnel+' pen '+r2.maxPen.toFixed(1)+' at '+JSON.stringify(r2.penAt))}}
if(!res){console.log(log.slice(-40).join('\n'));process.exit(1)}
console.log('seed',res.seed,'winner',res.win,'best',res.best.join('/'),'second',res.second,'leadChanges',res.changes,'king at',res.endT.toFixed(2),'drops',res.drops,
 'merges',res.events.filter(e=>e.type==='merge').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
{const SP=+process.env.SLOW||.35,s0=res.endT-(+process.env.S0||.8),s1=res.endT+(+process.env.S1||.35),TAIL=+process.env.TAIL||4.2,end=Math.min((res.frames.length-1)/60,res.endT+TAIL);
 const VF=60;res.vfps=VF;const PRE=+process.env.PRE||0;res.pre=PRE;const tm=[];let ts=PRE,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'king at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2),'=',(100*tm.findIndex(v=>v>=res.endT)/tm.length).toFixed(1)+'%')}
res.game=+process.env.GAME||1;if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
