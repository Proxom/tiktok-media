// 1M+ list #5 "the wall HEALS": ONE ball bounces inside 3 nested rotating brick rings (only the innermost remaining ring is solid).
// Every hit cracks the brick it touches (HP shown); a brick at 0 HP breaks and leaves a hole; a broken brick GROWS BACK after HEAL s
// (only when the ball is clear of it). When the ball gets fully outside a ring through a hole, that ring shatters and the next one
// is the wall. Out of the last ring = BROKE OUT. Real 2D collisions vs annular-sector bricks (inner/outer arc + side faces + corners),
// moving-wall velocity, gravity, elastic bounces; the game rule keeps the speed between VMIN and VMAX. Fixed step 1/600 s (20 sub-steps).
// node sim.js <out.js> [seed]   env: see below
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1,E=process.env;
const FPS=30,SUB=20,DT=1/(FPS*SUB),CX=+E.CX||500,CY=+E.CY||1030,HT=+E.HT||13,G=+E.G||620;
const RS=(E.RS||'215,305,395').split(',').map(Number),NS=(E.NS||'12,18,24').split(',').map(Number),HPS=(E.HPS||'2,2,3').split(',').map(Number);
const OMS=(E.OMS||'.9,-.7,.55').split(',').map(Number),HEAL=+E.HEAL||3,R0=+E.R0||26,VMIN=+E.VMIN||520,VMAX=+E.VMAX||820,TAIL=+E.TAIL||3.4;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const TAU=Math.PI*2,m2=a=>((a%TAU)+TAU)%TAU;
// closest point of brick (ring L, index i, rotation rot) to point (px,py)
function closest(L,i,rot,px,py){const Ri=RS[L]-HT,Ro=RS[L]+HT,w=TAU/NS[L],t1=rot+i*w,dx=px-CX,dy=py-CY,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
 const u=m2(a-t1);if(u<=w){const rr=Math.min(Ro,Math.max(Ri,d));return[CX+Math.cos(a)*rr,CY+Math.sin(a)*rr,d>Ri&&d<Ro]}
 // outside the angular span: nearest side face (radial segment)
 let best=null;for(const te of [t1,t1+w]){const s=Math.min(Ro,Math.max(Ri,d*Math.cos(a-te))),qx=CX+Math.cos(te)*s,qy=CY+Math.sin(te)*s,q=Math.hypot(px-qx,py-qy);if(!best||q<best[3])best=[qx,qy,false,q]}
 return[best[0],best[1],false]}
function run(seed){
 const rnd=rng(seed);const a0=RS.map(()=>rnd()*TAU);
 const b={x:CX+(rnd()-.5)*80,y:CY-60-rnd()*40,vx:(rnd()<.5?-1:1)*(180+rnd()*160),vy:200+rnd()*100,r:R0,cool:0,state:0};
 const hp=RS.map((_,L)=>new Array(NS[L]).fill(HPS[L])),brokeAt=RS.map((_,L)=>new Array(NS[L]).fill(-1));
 const frames=[],events=[],hpLog=[];let t=0,L=0,escT=null,maxPen=0,hits=0,touchAfter=0,deep=0;
 const rot=(l,tt)=>a0[l]+OMS[l]*tt;
 for(let f=0;f<FPS*80;f++){
  for(let s=0;s<SUB;s++){t+=DT;
   b.vy+=G*DT;b.x+=b.vx*DT;b.y+=b.vy*DT;b.cool-=DT;
   if(b.state===0){let sp=Math.hypot(b.vx,b.vy);if(sp<VMIN){b.vx*=VMIN/sp;b.vy*=VMIN/sp}else if(sp>VMAX){b.vx*=VMAX/sp;b.vy*=VMAX/sp}
    const ro=rot(L,t);
    // regrow broken bricks after HEAL s, only if the ball is clear of the brick
    for(let i=0;i<NS[L];i++)if(hp[L][i]===0&&t-brokeAt[L][i]>=HEAL){const c=closest(L,i,ro,b.x,b.y);if(!c[2]&&Math.hypot(b.x-c[0],b.y-c[1])>b.r+6){hp[L][i]=HPS[L];events.push({t,type:'heal',L,i})}}
    // collide with intact bricks of the active ring: deepest contact first
    let hit=null;
    for(let it=0;it<2;it++){let bc=null;
     for(let i=0;i<NS[L];i++){if(hp[L][i]===0)continue;const c=closest(L,i,ro,b.x,b.y);if(c[2]){deep++;continue}const q=Math.hypot(b.x-c[0],b.y-c[1]);if(q<b.r&&(!bc||q<bc.q))bc={i,q,px:c[0],py:c[1]}}
     if(!bc)break;const nx=(b.x-bc.px)/(bc.q||1e-6),ny=(b.y-bc.py)/(bc.q||1e-6);b.x=bc.px+nx*b.r;b.y=bc.py+ny*b.r;
     const wx=-OMS[L]*(bc.py-CY),wy=OMS[L]*(bc.px-CX),vn=(b.vx-wx)*nx+(b.vy-wy)*ny;
     if(vn<0){b.vx-=2*vn*nx;b.vy-=2*vn*ny;if(!hit||-vn>hit.v)hit={i:bc.i,v:-vn,x:bc.px,y:bc.py,nx:-nx,ny:-ny}}}
    if(hit&&hit.v>80&&b.cool<=0){b.cool=.1;hits++;const i=hit.i;hp[L][i]--;const brk=hp[L][i]===0;if(brk)brokeAt[L][i]=t;
     events.push({t,type:'hit',L,i,hp:hp[L][i],brk,x:hit.x,y:hit.y,nx:hit.nx,ny:hit.ny,v:hit.v,n:hits})}
    // through the ring? (fully outside its outer edge)
    const d=Math.hypot(b.x-CX,b.y-CY);
    if(d-b.r>RS[L]+HT+1){events.push({t,type:'ring',L,x:b.x,y:b.y,n:hits,rot:ro});L++;if(L>=RS.length){b.state=1;escT=t;events.push({t,type:'escape',x:b.x,y:b.y,n:hits})}}
    // penetration check vs intact bricks of the (new) active ring
    if(b.state===0){const ro2=rot(L,t);for(let i=0;i<NS[L];i++){if(hp[L][i]===0)continue;const c=closest(L,i,ro2,b.x,b.y);const pen=c[2]?b.r+HT:b.r-Math.hypot(b.x-c[0],b.y-c[1]);if(pen>maxPen)maxPen=pen}}
   }
   if(s===SUB/2-1||s===SUB-1){frames.push([+b.x.toFixed(1),+b.y.toFixed(1),b.state]);hpLog.push(hp.map(a=>a.join('')).join('|'))}
  }
  if(escT!==null&&t>escT+TAIL)break;
 }
 if(escT===null)return{fail:'timeout'};
 return{frames,events,hpLog,escT,seed,a0,OMS,RS,NS,HPS,HEAL,HT,CX,CY,R0,fps:FPS,maxPen,deep,hits};
}
const MIN=+E.MINT||27,MAX=+E.MAXT||32;let res=null,log=[];
const R1=(E.R1||'6,12').split(',').map(Number),R2=(E.R2||'14,22').split(',').map(Number);
for(let s=SEED;s<SEED+(+E.TRIES||400);s++){const r=run(s);
 if(r.fail){log.push(s+':'+r.fail);continue}
 const rg=r.events.filter(e=>e.type==='ring'),e=r.events.find(q=>q.type==='escape');log.push(s+':'+rg.map(q=>q.t.toFixed(0)).join('/'));
 const fr=r.frames,okFrame=fr.every(q=>q[2]===0||q[1]-r.R0>1920||(q[0]-r.R0>=0&&q[0]+r.R0<=1080&&q[1]-r.R0>=(+E.TOPMIN||640)));
 if(r.escT>MIN&&r.escT<MAX&&rg[0].t>R1[0]&&rg[0].t<R1[1]&&rg[1].t>R2[0]&&rg[1].t<R2[1]&&r.maxPen<1&&r.deep===0&&okFrame&&e.y<(+E.ESCMAXY||1380)&&e.x-r.R0>60&&e.x+r.R0<930&&fr[fr.length-1][1]>1950&&r.events.find(q=>q.type==='hit').t<1.2){res=r;break}}
if(!res){console.log(log.slice(-80).join(' '));process.exit(1)}
const hi=res.events.filter(e=>e.type==='hit');
console.log('seed',res.seed,'escape',res.escT.toFixed(2),'rings',res.events.filter(e=>e.type==='ring').map(e=>e.t.toFixed(2)).join(','),'hits',hi.length,'breaks',hi.filter(e=>e.brk).length,
 'heals',res.events.filter(e=>e.type==='heal').length,'maxPen',res.maxPen.toFixed(2),'tried',log.length);
// video time map: 1x, FF x fast-forward between FF0..FF1 (optional), eased down to SLOW x around the final escape
res.ffps=60;{const SP=+E.SLOW||.45,s0=res.escT-(+E.S0||1.0),s1=res.escT+(+E.S1||.5),end=res.frames.length/60-.02,FF=+E.FF||1,F0=+E.FF0||0,F1=+E.FF1||0;
 const VF=+E.VFPS||60;res.vfps=VF;const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:(ts>=F0&&ts<F1)?FF:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'escape at video t',(tm.findIndex(v=>v>=res.escT)/VF).toFixed(2))}
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
