// Game I "BRICK BREAKER" (Tiny Chaos ball games, built 17 Nov 2026): FOUR balls (red, blue, yellow, green) bounce inside one closed neon box
// that holds a wall of white bricks. RULE (exactly what the code does): a brick breaks the first time a ball touches it, and that brick
// is +1 point for the ball's color. Balls never lose speed (constant speed, no gravity); they bounce off the box walls, the bricks and each other
// (elastic, equal mass). When the LAST brick breaks the game ends; the color with the MOST bricks wins (seeds with a tie for first are skipped).
// Fixed timestep 600 Hz (20 sub-steps per 30 fps frame); every sub-step a swept check counts tunnelling (ball centre inside a live brick or
// beyond a wall, or two balls passing through each other) -> logged as tunnel=0. frames[k] = state at sim time (k+1)/60.
// After the last brick (game over) the balls coast to a stop (speed x exp(-1.7 s)); nothing scores any more.
// node sim.js <out.js> [seed]   env: COLS ROWS SPEED SPEED2 MINT MAXT LEADMIN MARGINMAX MAXGAP GAME FOLLOWTEXT WINEX
const fs=require('fs');const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=20,DT=1/(FPS*SUB),N=4,RB=+process.env.RB||34;
const BX0=100,BX1=920,BY0=660,BY1=1420,HT=8; // box inner edges = BX0+HT .. BX1-HT (x 100..920 stays inside the side safe zones)
const COLS=+process.env.COLS||9,ROWS=+process.env.ROWS||6,BW=78,BH=30,GAP=6,GX0=(BX0+BX1)/2-(COLS*BW+(COLS-1)*GAP)/2,GY0=+process.env.GY0||840;
const SP0=+process.env.SPEED||760,SP2=+process.env.SPEED2||1.0; // SPEED2: speed factor when 25 % of the bricks are left (rises linearly as the wall falls)
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function run(seed){const rnd=rng(seed);
 const bricks=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)bricks.push({x0:GX0+c*(BW+GAP),y0:GY0+r*(BH+GAP),x1:GX0+c*(BW+GAP)+BW,y1:GY0+r*(BH+GAP)+BH,alive:1});
 const NB=bricks.length,B=[];const L=BX0+HT+RB,R=BX1-HT-RB,T=BY0+HT+RB,Bo=BY1-HT-RB;
 const xs=[0,1,2,3].map(k=>BX0+120+k*(BX1-BX0-240)/3);for(let i=xs.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[xs[i],xs[j]]=[xs[j],xs[i]]}
 for(let i=0;i<N;i++){const a=-Math.PI/2+(rnd()-.5)*1.3;B.push({x:xs[i]+(rnd()-.5)*30,y:Bo-10-rnd()*60,vx:Math.cos(a)*SP0,vy:Math.sin(a)*SP0,score:0,wc:0})}
 const frames=[],events=[];let t=0,endT=null,win=-1,tunnel=0,maxStep=0,maxPen=0,left=NB,pc={};
 const snap=()=>B.map(b=>[+b.x.toFixed(1),+b.y.toFixed(1),b.score]);
 for(let f=0;f<FPS*80;f++){
  for(let s=0;s<SUB;s++){t+=DT;const prev=B.map(b=>[b.x,b.y]);
   const sp=endT!==null?SP0*Math.exp(-1.7*(t-endT)) /* game over: balls coast to a stop, so the winner + crown stay visible */:SP0*(1+(SP2-1)*Math.min(1,(NB-left)/(NB*.75)));
   for(let i=0;i<N;i++){const b=B[i];const v=Math.hypot(b.vx,b.vy)||1;if(v>1e-3){b.vx*=sp/v;b.vy*=sp/v}b.x+=b.vx*DT;b.y+=b.vy*DT;b.wc-=DT;
    maxStep=Math.max(maxStep,Math.hypot(b.x-prev[i][0],b.y-prev[i][1])/RB);
    // walls
    for(const [k,lim,sg] of [['x',L,-1],['x',R,1],['y',T,-1],['y',Bo,1]]){const over=(b[k]-lim)*sg;if(over>0){if(over>RB)tunnel++;b[k]=lim;const vk=k==='x'?'vx':'vy';if(b[vk]*sg>0){
      if(Math.abs(b[vk])>200&&b.wc<=0){b.wc=.08;events.push({t,type:'wall',ball:i,x:k==='x'?lim+sg*RB:b.x,y:k==='y'?lim+sg*RB:b.y,v:Math.abs(b[vk])})}b[vk]=-b[vk]}}}
    // bricks (circle vs rectangle): break on first touch, bounce off the touched face/corner
    if(endT===null){let nx=0,ny=0,hit=0;for(let q=0;q<NB;q++){const k=bricks[q];if(!k.alive)continue;
      if(b.x>k.x0&&b.x<k.x1&&b.y>k.y0&&b.y<k.y1)tunnel++;
      const cx=Math.max(k.x0,Math.min(b.x,k.x1)),cy=Math.max(k.y0,Math.min(b.y,k.y1)),dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy);
      if(d<RB){const ux=d>1e-6?dx/d:0,uy=d>1e-6?dy/d:-1;maxPen=Math.max(maxPen,RB-d);b.x+=ux*(RB-d);b.y+=uy*(RB-d);nx+=ux;ny+=uy;hit++;
       k.alive=0;left--;b.score++;events.push({t,type:'brick',ball:i,brick:q,x:(k.x0+k.x1)/2,y:(k.y0+k.y1)/2,score:b.score,left});
       if(left===0&&endT===null){endT=t;const sc=B.map(q=>q.score),mx=Math.max(...sc);win=sc.indexOf(mx);if(sc.filter(v=>v===mx).length>1)win=-2}}}
     if(hit){const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=2*vn*nx;b.vy-=2*vn*ny}}}}
   // ball-ball: swept check, then elastic equal-mass collision
   for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const a=B[i],c=B[j];
    const rx0=prev[j][0]-prev[i][0],ry0=prev[j][1]-prev[i][1],rx1=c.x-a.x,ry1=c.y-a.y,ex=rx1-rx0,ey=ry1-ry0,ee=ex*ex+ey*ey;
    const u=ee>0?Math.max(0,Math.min(1,-(rx0*ex+ry0*ey)/ee)):0;if(Math.hypot(rx0+ex*u,ry0+ey*u)<2*RB&&Math.hypot(rx1,ry1)>=2*RB&&Math.hypot(rx0,ry0)>=2*RB)tunnel++;
    const qd=Math.hypot(rx1,ry1)||1e-6,ov=2*RB-qd;if(ov>0){const mx=rx1/qd,my=ry1/qd;a.x-=mx*ov/2;a.y-=my*ov/2;c.x+=mx*ov/2;c.y+=my*ov/2;
     const vn=(c.vx-a.vx)*mx+(c.vy-a.vy)*my;if(vn<0){a.vx+=vn*mx;a.vy+=vn*my;c.vx-=vn*mx;c.vy-=vn*my;const key=i+'-'+j;
      if(!(pc[key]>t)){pc[key]=t+.12;events.push({t,type:'bump',a:i,b:j,x:a.x+mx*RB,y:a.y+my*RB,v:-vn})}}}}
   if(s===SUB/2-1)frames.push(snap());}
  frames.push(snap());if(endT!==null&&t>endT+(+process.env.TAIL||3.4))break}
 if(endT===null)return{fail:'timeout '+left};
 return{frames,events,endT,win,seed,N,RB,BX0,BX1,BY0,BY1,HT,bricks:bricks.map(k=>[k.x0,k.y0,BW,BH]),NB,tunnel,maxStep,maxPen,CX:(BX0+BX1)/2,CY:(BY0+BY1)/2}}
const MIN=+process.env.MINT||24,MAX=+process.env.MAXT||30;let res=null,log=[];
for(let s=SEED;s<SEED+4000;s++){const r=run(s);if(r.fail){log.push(s+':'+r.fail);continue}
 const br=r.events.filter(e=>e.type==='brick');
 // lead changes (strict leader changes, counted only after 6 bricks), final margin, longest gap between breaks
 let lead=-1,lc=0;const sc=[0,0,0,0];for(const e of br){sc[e.ball]++;const mx=Math.max(...sc),ls=sc.map((v,k)=>v===mx?k:-1).filter(k=>k>=0);if(ls.length===1&&ls[0]!==lead){if(lead>=0&&br.indexOf(e)>=6)lc++;lead=ls[0]}}
 const fin=r.frames[r.frames.length-1].map(q=>q[2]).sort((a,b)=>b-a),margin=fin[0]-fin[1],gaps=Math.max(...br.slice(1).map((e,k)=>e.t-br[k].t)),lastGap=br[br.length-1].t-br[br.length-2].t;
 log.push(`${s}:end${r.endT.toFixed(1)} win${r.win} lc${lc} m${margin} gap${gaps.toFixed(1)} sc${fin}`);
 if(r.win>=0&&(process.env.WINEX||'').split(',').indexOf(String(r.win))<0&&r.endT>MIN&&r.endT<MAX&&lc>=(+process.env.LEADMIN||3)&&margin>=1&&margin<=(+process.env.MARGINMAX||3)&&gaps<(+process.env.MAXGAP||3)&&lastGap<(+process.env.LASTGAP||2.5)&&r.tunnel===0&&r.maxStep<.25){res=r;res.leadChanges=lc;res.margin=margin;break}}
if(!res){console.log(log.slice(-30).join('\n'));process.exit(1)}
console.log('seed',res.seed,'winner',res.win,'end',res.endT.toFixed(2),'scores',res.frames[res.frames.length-1].map(q=>q[2]).join(','),'leadChanges',res.leadChanges,'bumps',res.events.filter(e=>e.type==='bump').length,'maxStep/r',res.maxStep.toFixed(3),'maxPen',res.maxPen.toFixed(2),'tunnel',res.tunnel,'tried',log.length);
res.ffps=60;{const SP=+process.env.SLOW||.4,s0=res.endT-(+process.env.S0||1.0),s1=res.endT+(+process.env.S1||.5),end=res.frames.length/60-.02,VF=60;res.vfps=VF;const tm=[];let ts=0,sp=1;
 while(ts<end){tm.push(+ts.toFixed(4));const tg=(ts>=s0&&ts<s1)?SP:1;sp+=(tg-sp)*Math.min(1,(1/VF)/.12);ts+=sp/VF}res.tmap=tm;
 console.log('video frames',tm.length,'video dur',(tm.length/VF).toFixed(2),'last brick at video t',(tm.findIndex(v=>v>=res.endT)/VF).toFixed(2))}
res.game=+process.env.GAME||0;if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
