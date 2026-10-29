// Deterministic marble-race physics. run(seed) -> {frames, events, finish}
const FPS=30, SUB=8, DT=1/(FPS*SUB), G=2300, R=26;
const X0=60, X1=1020;
const NAMES=['BOB','PIXEL','GARY','DOT','MOCHI'];
const COLS=['#ff5a5f','#ffd23f','#3ddc97','#4cc9f0','#c77dff'];
const FINISH=1470, GATE_T=3.6;
// static segments [x1,y1,x2,y2]
const segs=[[X0,330,X0,1500],[X1,330,X1,1500]];
const rampY=[470,690,910,1130];
rampY.forEach((y,i)=>{ if(i%2==0) segs.push([X0,y,X1-250,y+110]); else segs.push([X1,y,X0+250,y+110]); });
// pegs
const pegs=[];
[[300,600],[470,610],[640,590],[700,820],[540,830],[380,810],[300,1040],[470,1050],[640,1030],[750,1290],[600,1300],[450,1290],[300,1300],[180,1290],[900,1290]].forEach(p=>pegs.push(p));
// spinners: centre, half-length, angular speed
const spinners=[{x:175,y:1340,L:100,w:2.6},{x:895,y:1040,L:70,w:-3.2}];
function run(seed){
  let s=seed;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
  const m=NAMES.map((n,i)=>({x:200+i*150+(rnd()-.5)*16,y:360,vx:0,vy:0,fin:null,kick:(rnd()-.5)*700}));
  const frames=[],events=[];let t=0,order=[];
  const hit=(kind,v)=>{ if(v>90) events.push({t:+t.toFixed(3),k:kind,v:Math.min(1,v/900)}) };
  const total=30*FPS;
  for(let f=0;f<total;f++){
    frames.push({m:m.map(a=>[+a.x.toFixed(1),+a.y.toFixed(1)]),sp:spinners.map(p=>+(p.w*t).toFixed(3)),order:order.slice()});
    for(let k=0;k<SUB;k++){
      t+=DT;
      m.forEach(a=>{
        if(a.fin!==null)return;
        if(t<GATE_T){ // held on a gate at y=360+R
          a.vx=0;a.vy=0;a.y=360;return}
        if(!a.k0){a.k0=1;a.vx=a.kick}
        a.vy+=G*DT;a.x+=a.vx*DT;a.y+=a.vy*DT;
        // segments
        segs.forEach(([x1,y1,x2,y2])=>{
          const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;let u=((a.x-x1)*dx+(a.y-y1)*dy)/l2;u=Math.max(0,Math.min(1,u));
          const cx=x1+u*dx,cy=y1+u*dy;col(a,cx,cy,0,0,R,.45,'ramp')});
        pegs.forEach(p=>col(a,p[0],p[1],0,0,R+13,.6,'peg'));
        spinners.forEach(p=>{const ang=p.w*t,ca=Math.cos(ang),sa=Math.sin(ang);
          const x1=p.x-ca*p.L,y1=p.y-sa*p.L,x2=p.x+ca*p.L,y2=p.y+sa*p.L;
          const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;let u=((a.x-x1)*dx+(a.y-y1)*dy)/l2;u=Math.max(0,Math.min(1,u));
          const cx=x1+u*dx,cy=y1+u*dy;const rx=cx-p.x,ry=cy-p.y;
          col(a,cx,cy,-p.w*ry,p.w*rx,R+9,.5,'spin')});
        if(a.y>FINISH&&a.fin===null){a.fin=t;order.push(m.indexOf(a));}
      });
      for(let i=0;i<m.length;i++)for(let j=i+1;j<m.length;j++){
        const a=m[i],b=m[j];if(a.fin!==null||b.fin!==null||t<GATE_T)continue;
        let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
        if(d<2*R&&d>0){dx/=d;dy/=d;const o=2*R-d;a.x-=dx*o/2;a.y-=dy*o/2;b.x+=dx*o/2;b.y+=dy*o/2;
          const rv=(b.vx-a.vx)*dx+(b.vy-a.vy)*dy;if(rv<0){const j2=-(1.6)*rv/2;a.vx-=j2*dx;a.vy-=j2*dy;b.vx+=j2*dx;b.vy+=j2*dy;hit('marble',-rv)}}
      }
    }
  }
  function col(a,cx,cy,wx,wy,rad,e,kind){
    let dx=a.x-cx,dy=a.y-cy,d=Math.hypot(dx,dy);
    if(d<rad&&d>0){dx/=d;dy/=d;a.x=cx+dx*rad;a.y=cy+dy*rad;
      const rvn=(a.vx-wx)*dx+(a.vy-wy)*dy;
      if(rvn<0){a.vx-=(1+e)*rvn*dx;a.vy-=(1+e)*rvn*dy;
        // friction tangent damping
        const tx=-dy,ty=dx,rvt=(a.vx-wx)*tx+(a.vy-wy)*ty;a.vx-=rvt*tx*.01;a.vy-=rvt*ty*.01;hit(kind,-rvn)}}
  }
  return {frames,events,order,names:NAMES,cols:COLS,finishT:m.map(a=>a.fin)};
}
module.exports={run,segs,pegs,spinners,NAMES,COLS,R,GATE_T,FINISH};
if(require.main===module){
  for(let seed=1;seed<=400;seed++){const r=run(seed);
    const mid=r.frames.findIndex((f,i)=>Math.max(...f.m.map(p=>p[1]))>FINISH-20);
    // mid-race ranking at 60% of winner time
    const wt=Math.min(...r.finishT.filter(x=>x));const tm=GATE_T+(wt-GATE_T)*.6;const fr=r.frames[Math.floor(tm*FPS)];
    const rank=fr.m.map((p,i)=>[p[1],i]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
    console.log(seed,'order',r.order.map(i=>NAMES[i]).join('>'),'winT',wt.toFixed(1),'lastT',Math.max(...r.finishT.map(x=>x||99)).toFixed(1),'mid-leader',NAMES[rank[0]],'mid-last',NAMES[rank[4]],'winner was midlast?',r.order[0]==rank[4]);}
}
