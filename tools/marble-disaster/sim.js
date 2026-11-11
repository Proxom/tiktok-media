// 17:00 1M+ list #4 "Marble disaster race" (our own version; family C obstacle race). Base: tools/marble-elim course.
// RULES (exactly what the code does): 6 colored marbles race round a looping course: a trapdoor opens, they fall through a peg board with two
// spinning paddles, roll down a ramp and through the GATE into a glass lift that carries them back to the top ramp. A marble finishes lap k when it
// passes the gate for the k-th time. The FIRST marble to finish lap LAPS wins. The moment the leader finishes lap k (k < LAPS), DISASTER k hits the
// course and stays for the rest of the race: 1 WILD PADDLES (both paddles reverse and spin 2x faster), 2 WIND (a steady push to the left across
// the peg board), 3 EARTHQUAKE (every 0.3 s each marble on the peg board gets a random kick, the screen shakes), 4 LOW GRAVITY (gravity x0.55).
// Real 2D physics: gravity, restitution + friction on ramps / walls / pegs / paddles, marble-marble impulses (equal mass). The lift is a scripted
// conveyor (constant speed, keeps a gap, first in first out). Fixed timestep 600 Hz (10 sub-steps per 60 fps frame) + swept check every sub-step.
// frames[k] = state at sim time k/60: [x, y, mode] per marble (mode 0 rolling, 1 in the lift); spinA[k] = paddle angles. node sim.js <out.js> [seed]
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=60,SUB=10,DT=1/(FPS*SUB),G0=+process.env.G||1700,LAPS=+process.env.LAPS||4,WX=+process.env.WX||800,QI=+process.env.QI||.3,QK=+process.env.QK||420,LG=+process.env.LG||.55,R=+process.env.RAD||19,PR=7,SW=4,VMAX=1150,N=6;
const XL=84,LXL=856,LXR=896,LX=876,GX=846,TOPEN=+process.env.TOPEN||.8,LSP=+process.env.LSP||900;
// static segments [x1,y1,x2,y2,restitution,keep-tangential]
const RA=[852,700,172,812],RC=[XL,1210,GX,1352];
const KT=+process.env.KT||.99985;const SEGS=[[...RA,.35,KT],[...RC,.35,KT],[XL,640,XL,1210,.45,.9995],[LXL,736,LXL,1296,.45,.9995]];
const TRAP=[110,862,826,862];   // trapdoor floor under the start row, removed at TOPEN
const SPINS=[{x:470,y:1036,L:78,w:+process.env.SPINW||2.3},{x:+process.env.S2X||205,y:+process.env.S2Y||948,L:62,w:+process.env.S2W||-3.1}],SPIN=SPINS[0];
const PEGS=[];for(let k=0;k<5;k++){const y=922+56*k;for(let j=0;j<8;j++){const px=(k%2?196:150)+92*j;if(px>LXL-28)continue;if(SPINS.some(S=>Math.hypot(px-S.x,y-S.y)<S.L+R+PR+16))continue;PEGS.push([px,y])}}
const LIFT_IN=[LX,1334],LIFT_TOP=[LX,668],EXIT=[836,RA[1]+(RA[0]-836)*(RA[3]-RA[1])/(RA[0]-RA[2])-R-SW-.5];
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function closest(s,px,py){const ex=s[2]-s[0],ey=s[3]-s[1],u=Math.max(0,Math.min(1,((px-s[0])*ex+(py-s[1])*ey)/(ex*ex+ey*ey)));return[s[0]+ex*u,s[1]+ey*u]}
function side(s,px,py){return (s[2]-s[0])*(py-s[1])-(s[3]-s[1])*(px-s[0])}
function run(seed){
 const rnd=rng(seed);const order=[0,1,2,3,4,5].sort(()=>rnd()-.5);
 const M=order.map((c,i)=>({c,x:200+110*i+(rnd()-.5)*10,y:862-SW-R-.5,vx:0,vy:0,mode:0,laps:0,lift:null}));
 const SP=SPINS.map(S=>({...S,a:0}));let dis=0,G=G0,nextQ=0;const spinA=[SP.map(S=>0)],shake=[[0,0]];
 const ev=[],frames=[];let t=0,tunnel=0,maxPen=0,maxStep=0,liftQ=[],endT=null,winner=-1,lead=0;
 const snap=()=>M.map(m=>[+m.x.toFixed(1),+m.y.toFixed(1),m.mode]);frames.push(snap());
 for(let f=1;f<FPS*60;f++){
  for(let s=0;s<SUB;s++){t+=DT;SP.forEach(S=>S.a+=S.w*DT);
   if(dis>=3&&t>=nextQ){nextQ=t+QI;const kick=[];for(const m of M){if(m.mode!==0||m.y<880||m.y>1195||t<TOPEN)continue;const kx=(rnd()-.5)*2*QK,ky=-(.4+.6*rnd())*QK;m.vx+=kx;m.vy+=ky;kick.push(m.c)}ev.push({t,type:'quake',n:kick.length})}
   const SPS=SP.map(S=>{const a=S.a,cs=Math.cos(a),sn=Math.sin(a);return[S.x-cs*S.L,S.y-sn*S.L,S.x+cs*S.L,S.y+sn*S.L,S]});
   const segs=t<TOPEN?[...SEGS,[...TRAP,.2,.9]]:SEGS;const prev=M.map(m=>[m.x,m.y]);
   for(const m of M){if(m.mode!==0)continue;
    m.vy+=G*DT;if(dis>=2&&m.y>880&&m.y<1140)m.vx-=WX*DT;const sp=Math.hypot(m.vx,m.vy);if(sp>VMAX){m.vx*=VMAX/sp;m.vy*=VMAX/sp}m.x+=m.vx*DT;m.y+=m.vy*DT;maxStep=Math.max(maxStep,Math.hypot(m.vx,m.vy)*DT/R);
    for(const sg of segs){const [qx,qy]=closest(sg,m.x,m.y),dx=m.x-qx,dy=m.y-qy,d=Math.hypot(dx,dy);if(d<R+SW&&d>1e-9){const nx=dx/d,ny=dy/d;m.x=qx+nx*(R+SW);m.y=qy+ny*(R+SW);
      const vn=m.vx*nx+m.vy*ny;if(vn<0){const tx=-ny,ty=nx,vt=m.vx*tx+m.vy*ty;m.vx=-sg[4]*vn*nx+sg[5]*vt*tx;m.vy=-sg[4]*vn*ny+sg[5]*vt*ty;if(-vn>160)ev.push({t,type:'tap',m:m.c,v:-vn,x:m.x,y:m.y})}}}
    // spinning paddle: relative velocity against the paddle surface
    for(const SP of SPS){const SPIN=SP[4],[qx,qy]=closest(SP,m.x,m.y),dx=m.x-qx,dy=m.y-qy,d=Math.hypot(dx,dy);if(d<R+SW&&d>1e-9){const nx=dx/d,ny=dy/d;m.x=qx+nx*(R+SW);m.y=qy+ny*(R+SW);
      const ux=-SPIN.w*(qy-SPIN.y),uy=SPIN.w*(qx-SPIN.x),rx=m.vx-ux,ry=m.vy-uy,vn=rx*nx+ry*ny;if(vn<0){m.vx-=1.5*vn*nx;m.vy-=1.5*vn*ny;if(-vn>160)ev.push({t,type:'spin',m:m.c,v:-vn,x:m.x,y:m.y})}}}
    for(const p of PEGS){if(Math.abs(p[1]-m.y)>R+PR+2||Math.abs(p[0]-m.x)>R+PR+2)continue;const dx=m.x-p[0],dy=m.y-p[1],d=Math.hypot(dx,dy);
     if(d<R+PR){const nx=dx/d,ny=dy/d;m.x=p[0]+nx*(R+PR);m.y=p[1]+ny*(R+PR);const vn=m.vx*nx+m.vy*ny;if(vn<0){const tx=-ny,ty=nx,vt=m.vx*tx+m.vy*ty;
      m.vx=-.5*vn*nx+.93*vt*tx;m.vy=-.5*vn*ny+.93*vt*ty;if(-vn>140)ev.push({t,type:'peg',m:m.c,v:-vn,x:p[0],y:p[1],p:PEGS.indexOf(p)})}}}
    // GATE: past the end of the bottom ramp = into the lift
    if(m.x>GX&&m.y>1296){m.laps++;m.mode=1;m.lift={ph:0,x0:m.x,y0:m.y,t0:t};liftQ.push(m);ev.push({t,type:'gate',m:m.c,lap:m.laps,x:m.x,y:m.y});gateCheck(m)}
   }
   // marble-marble
   for(let i=0;i<M.length;i++)for(let j=i+1;j<M.length;j++){const a=M[i],b=M[j];if(a.mode!==0||b.mode!==0)continue;const qx=b.x-a.x,qy=b.y-a.y;if(Math.abs(qx)>2*R||Math.abs(qy)>2*R)continue;
    const qd=Math.hypot(qx,qy)||1e-6,ov=2*R-qd;if(ov>0){const mx=qx/qd,my=qy/qd;a.x-=mx*ov/2;a.y-=my*ov/2;b.x+=mx*ov/2;b.y+=my*ov/2;const vn=(b.vx-a.vx)*mx+(b.vy-a.vy)*my;
     if(vn<0){const J=-.8*vn;a.vx-=J*mx;a.vy-=J*my;b.vx+=J*mx;b.vy+=J*my;if(-vn>150)ev.push({t,type:'clack',m:a.c,v:-vn,x:(a.x+b.x)/2,y:(a.y+b.y)/2})}}}
   // re-clamp: never drawn inside a ramp/wall after the pushes
   for(const m of M){if(m.mode!==0)continue;for(const sg of segs){const [qx,qy]=closest(sg,m.x,m.y),dx=m.x-qx,dy=m.y-qy,d=Math.hypot(dx,dy);if(d<R+SW&&d>1e-9){m.x=qx+dx/d*(R+SW);m.y=qy+dy/d*(R+SW)}}}
   // lift (scripted conveyor, FIFO, keeps a 2R+8 gap): slide in, ride up, step out onto the top ramp when the exit is clear
   liftQ=liftQ.filter(m=>m.mode===1);
   for(let qi=0;qi<liftQ.length;qi++){const m=liftQ[qi],L=m.lift,ahead=qi&&liftQ[qi-1].mode===1?liftQ[qi-1]:null;if(!L)continue;
    if(L.ph===0){const u=Math.min(1,(t-L.t0)/.12);m.x=L.x0+(LIFT_IN[0]-L.x0)*u;m.y=L.y0+(LIFT_IN[1]-L.y0)*u;if(u>=1)L.ph=1}
    else if(L.ph===1){let ny=m.y-LSP*DT;if(ahead&&ahead.lift.ph===1)ny=Math.max(ny,ahead.y+2*R+8);if(ahead&&ahead.lift.ph>=2)ny=Math.max(ny,LIFT_TOP[1]+2*R+8);m.y=Math.max(LIFT_TOP[1],ny);
     if(m.y<=LIFT_TOP[1]+1e-9&&M.every(o=>o===m||o.mode!==0||Math.hypot(o.x-EXIT[0],o.y-EXIT[1])>2*R+10)){L.ph=2;L.t2=t}}
    else if(L.ph===2){const u=Math.min(1,(t-L.t2)/.1);m.x=LIFT_TOP[0]+(EXIT[0]-LIFT_TOP[0])*u;m.y=LIFT_TOP[1]+(EXIT[1]-LIFT_TOP[1])*u;if(u>=1){m.mode=0;m.vx=-240;m.vy=0;m.lift=null;ev.push({t,type:'exit',m:m.c})}}}
   // swept check: a rolling marble centre must never cross a ramp/wall line or jump into a peg within one sub-step
   for(let i=0;i<M.length;i++){const m=M[i];if(m.mode!==0||prev[i][2])continue;const x0=prev[i][0],y0=prev[i][1];
    for(const sg of segs){const s0=side(sg,x0,y0),s1=side(sg,m.x,m.y);if(s0*s1<0){const [qx,qy]=closest(sg,(x0+m.x)/2,(y0+m.y)/2);if(Math.hypot((x0+m.x)/2-qx,(y0+m.y)/2-qy)<R)tunnel++}}
    for(const p of PEGS){if(Math.abs(p[1]-m.y)>40)continue;const d=Math.hypot(m.x-p[0],m.y-p[1]);if(R+PR-d>maxPen)maxPen=R+PR-d;if(d<R+PR-3)tunnel++}}
  }
  frames.push(snap());spinA.push(SP.map(S=>+S.a.toFixed(4)));
  if(f>=90){const A=frames[f-90];for(let i=0;i<M.length;i++)if(M[i].mode===0&&A[i][2]===0&&dis<3&&Math.hypot(A[i][0]-M[i].x,A[i][1]-M[i].y)<3&&t>TOPEN+.5&&(endT===null||t<endT))return{fail:'stuck@'+M[i].x.toFixed(0)+','+M[i].y.toFixed(0)}}
  if(endT!==null&&t>endT+6)break;
 }
 function gateCheck(m){if(endT!==null)return;
  if(m.laps>lead){lead=m.laps;ev.push({t,type:'lead',m:m.c,lap:lead});
   if(lead>=LAPS){endT=t;winner=m.c;return}
   if(lead<=4){dis=lead;ev.push({t,type:'disaster',k:dis,by:m.c});
    if(dis===1)SP.forEach(S=>S.w*=-2);if(dis===4)G=G0*LG}}}
 if(endT===null)return{fail:'timeout'};
 const gates=ev.filter(e=>e.type==='gate'),leads=ev.filter(e=>e.type==='lead');
 // runner-up at the finish: most laps among the others, then the furthest along the bottom ramp
 const fe=frames[Math.min(frames.length-1,Math.round(endT*FPS))];const others=M.filter(m=>m.c!==winner).map(m=>{const i=M.indexOf(m),q=fe[i];const L=gates.filter(g=>g.m===m.c&&g.t<=endT).length;return{c:m.c,L,x:q[0],y:q[1],mode:q[2]}});
 others.sort((p,q)=>q.L-p.L||(q.mode===0&&q.y>1150?q.x:-1e4)-(p.mode===0&&p.y>1150?p.x:-1e4));const ru=others[0];
 const lastGap=ru.L===LAPS-1&&ru.mode===0&&ru.y>1150?Math.hypot(ru.x-GX,ru.y-1330):9999;
 const firstGate1=gates.find(e=>e.lap===1).m,leaders=leads.map(e=>e.m);
 return{frames,spinA,events:ev,endT,winner,seed,order,tunnel,maxPen,maxStep,lastGap,runnerUp:ru.c,firstGate1,leaders,LAPS,WX,QI,QK,LG,G0,
  N,R,PR,SW,XL,LXL,LXR,LX,GX,RA,RC,TRAP,TOPEN,SPIN,SPINS,PEGS,LIFT_IN,LIFT_TOP,EXIT,fps:FPS};
}
const MIN=+process.env.MINT||25,MAX=+process.env.MAXT||30;let res=null,log=[];
if(process.env.ONE){const r=run(SEED);if(r.fail){console.log(r.fail);process.exit(1)}console.log(r.events.filter(e=>e.type==="lead").map(e=>"L"+e.lap+":"+e.m+"@"+e.t.toFixed(1)).join(" "),'end',r.endT.toFixed(1),'gap',r.lastGap.toFixed(0));process.exit(0)}
for(let s=SEED;s<SEED+600;s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 log.push(s+':end'+r.endT.toFixed(1)+' win'+r.winner+' ru'+r.runnerUp+' leaders'+r.leaders.join('')+' gap'+r.lastGap.toFixed(0)+' tun'+r.tunnel+' pen'+r.maxPen.toFixed(1));
 const ok=r.endT>MIN&&r.endT<MAX&&r.tunnel===0&&r.maxPen<2&&r.maxStep<.25&&r.lastGap<(+process.env.GAPMAX||260)&&r.firstGate1!==r.winner&&new Set(r.leaders).size>=(+process.env.NLEAD||3)&&
  (process.env.WINEX||'').split(',').indexOf(String(r.winner))<0;
 if(ok){res=r;break}}
if(!res){console.log(log.slice(-40).join("\n"));const gs=log.map(l=>+((l.match(/gap(\d+)/)||[])[1])).filter(v=>v>=0).sort((a,b)=>a-b);console.log("gaps",gs.slice(0,15).join(" "),"lastOutY filter + others");process.exit(1)}
console.log('seed',res.seed,'winner',res.winner,'runnerUp',res.runnerUp,'leaders',res.leaders.join(','),'endT',res.endT.toFixed(2),'lastGap',res.lastGap.toFixed(0),'gates',res.events.filter(e=>e.type==='gate').length,
 'pegHits',res.events.filter(e=>e.type==='peg').length,'maxPen',res.maxPen.toFixed(2),'maxStep/r',res.maxStep.toFixed(3),'tunnel',res.tunnel,'tried',log.length);
{const SPf=+process.env.SLOW||.35,s0=res.endT-(+process.env.S0||1.1),s1=res.endT+(+process.env.S1||.35),TAIL=+process.env.TAIL||3.6,end=Math.min((res.frames.length-1)/60,res.endT+TAIL);
 const VF=60;res.vfps=VF;const tm=[];let ts=0,sp=1;while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SPf:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}
 res.tmap=tm;console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'win at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
res.game=+process.env.GAME||0;if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
