// Format 1 "Which ball escapes first?": N balls bounce inside concentric rotating rings, each ring has a gap.
// Balls pass through gaps ring by ring; first ball outside the last ring wins. Deterministic (seeded).
// node sim.js <out.js> [seed]  ->  window.DATA={rings,balls,frames:[[x,y,region]*N],events,winner,finish}
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=20,DT=1/(FPS*SUB),TMAX=60,CX=540,CY=990;
const NB=+process.env.NB||5,K=+process.env.K||7,BR=+process.env.BR||15,HT=7;
const NAMES=['RED','BLUE','GREEN','YELLOW','PURPLE'],COLS=['#ff4d5e','#4d8dff','#3ddc84','#ffd23f','#b56cff'];
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
function run(seed){
 const rnd=rng(seed);
 const rings=Array.from({length:K},(_,k)=>({R:125+k*52,gapHalf:+(process.env.GAP||.34)-k*.012,om:(k%2?1:-1)*(.45+rnd()*.5),a0:rnd()*6.283}));
 const balls=Array.from({length:NB},(_,i)=>{const an=rnd()*6.283,sp=380+rnd()*60,dir=rnd()*6.283;return{x:CX+Math.cos(an)*50*rnd(),y:CY+Math.sin(an)*50*rnd(),vx:Math.cos(dir)*sp,vy:Math.sin(dir)*sp,region:0,pass:0}});
 const frames=[],events=[];let t=0,winner=-1,finish=null;
 for(let f=0;f<FPS*TMAX;f++){
  for(let s=0;s<SUB;s++){t+=DT;
   balls.forEach((b,bi)=>{b.vy+=380*DT;b.x+=b.vx*DT;b.y+=b.vy*DT;
    let sp=Math.hypot(b.vx,b.vy);if(sp<330){b.vx*=330/sp;b.vy*=330/sp}else if(sp>560){b.vx*=560/sp;b.vy*=560/sp}
    const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy)||1e-6,nx=dx/d,ny=dy/d,ang=Math.atan2(dy,dx);
    for(let k=0;k<K;k++){const rg=rings[k],delta=wrap(ang-(rg.a0+rg.om*t)),inGap=Math.abs(delta)<rg.gapHalf-BR/rg.R*.8;
     if(b.region<=k){ // inside ring k
      if(d+BR>rg.R-HT){if(inGap){if(d>rg.R){b.region=k+1;b.pass=k+1;events.push({t,type:'pass',ball:bi,ring:k});if(k===K-1&&winner<0){winner=bi;finish=t}}}
       else{const px=CX+nx*(rg.R-HT-BR),py=CY+ny*(rg.R-HT-BR);b.x=px;b.y=py;const vr=b.vx*nx+b.vy*ny;if(vr>0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;events.push({t,type:'bounce',ball:bi,ring:k,v:vr})}}}}
     else{ // outside ring k
      if(d-BR<rg.R+HT){if(inGap){if(d<rg.R){b.region=k}}else{b.x=CX+nx*(rg.R+HT+BR);b.y=CY+ny*(rg.R+HT+BR);const vr=b.vx*nx+b.vy*ny;if(vr<0){b.vx-=2*vr*nx;b.vy-=2*vr*ny;events.push({t,type:'bounce',ball:bi,ring:k,v:-vr})}}}}}});
   // ball-ball elastic
   for(let i=0;i<NB;i++)for(let j=i+1;j<NB;j++){const a=balls[i],b=balls[j];if(a.region!==b.region)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<2*BR&&d>1e-6){const nx=dx/d,ny=dy/d,ov=2*BR-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx;a.vy+=rv*ny;b.vx-=rv*nx;b.vy-=rv*ny;events.push({t,type:'clack',ball:i,v:-rv})}}}
  }
  frames.push(balls.map(b=>[Math.round(b.x*10)/10,Math.round(b.y*10)/10,b.region]));
  if(finish!==null&&t>finish+3)break;
 }
 if(finish===null)return{fail:'timeout'};
 return{rings,balls:NAMES.slice(0,NB).map((n,i)=>({name:n,col:COLS[i]})),frames,events,winner,finish,seed,CX,CY,BR,HT,K,fps:FPS};
}
let res,log=[];const MIN=+process.env.MINT||16,MAX=+process.env.MAXT||30;
for(let s=SEED;s<SEED+300;s++){res=run(s);log.push(s+':'+(res.fail||res.finish.toFixed(1)));if(!res.fail&&res.finish>MIN&&res.finish<MAX)break;res=null}
if(!res){console.log(log.slice(0,40).join(' '));process.exit(1)}
console.log('seed',res.seed,'finish',res.finish.toFixed(2),'winner',res.balls[res.winner].name,'events',res.events.length,'frames',res.frames.length);
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
