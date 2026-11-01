// Rule check for a merge-arena data file (PACING AND LOGIC C.2): node check.js data.js
// 1) every merge: two items of tier k-1 existed in the previous frame, both gone, a new tier-k item appears; no item appears
//    or vanishes without a drop/merge event; 2) max overlap between items (px); 3) longest time two equal-tier items touch
//    without merging (should be <= COOL+small); 4) final tier formed exactly once.
global.window={};require(require('path').resolve(process.argv[2]));const D=window.DATA,F=D.frames,fps=D.fps;
const rad=k=>D.r0*Math.pow(D.rf,k);let errs=[],maxOv=0,ovAt=0,touch=new Map(),maxWait=0,waitAt=0;
for(let f=1;f<F.length;f++){const A=new Map(F[f-1].it.map(a=>[a[0],a])),B=new Map(F[f].it.map(a=>[a[0],a]));
 const gone=[...A.values()].filter(a=>!B.has(a[0])),born=[...B.values()].filter(b=>!A.has(b[0]));
 const drops=born.filter(b=>b[1]===0&&b[3]<D.CY-D.R+rad(0)+60),news=born.filter(b=>!drops.includes(b));
 for(const n of news){const ps=gone.filter(g=>g[1]===n[1]-1);if(ps.length<2)errs.push(`f${f} tier ${n[1]} born without 2 parents (gone tiers ${gone.map(g=>g[1])})`);else{gone.splice(gone.indexOf(ps[0]),1);gone.splice(gone.indexOf(ps[1]),1)}}
 if(gone.length)errs.push(`f${f} vanished without merge: ${gone.map(g=>g[1])}`);
 const it=F[f].it;for(let i=0;i<it.length;i++)for(let j=i+1;j<it.length;j++){const a=it[i],b=it[j],d=Math.hypot(a[2]-b[2],a[3]-b[3]),ov=rad(a[1])+rad(b[1])-d;
  if(ov>maxOv){maxOv=ov;ovAt=f}const key=a[0]+'-'+b[0];if(a[1]===b[1]&&ov>-1.5){const s=touch.get(key)??f;touch.set(key,s);const w=(f-s)/fps;if(w>maxWait){maxWait=w;waitAt=f}}else touch.delete(key)}}
const finals=D.events.filter(e=>e.type==='final').length;
console.log('frames',F.length,'merges',D.events.filter(e=>e.type==='merge').length,'final at',D.final&&D.final.toFixed(2),'finals',finals);
console.log('max overlap px',maxOv.toFixed(1),'at f',ovAt,'| longest equal-tier touch without merge s',maxWait.toFixed(2),'at f',waitAt);
console.log(errs.length?'ERRORS:\n'+errs.slice(0,20).join('\n'):'parents/vanish check OK');
process.exit(errs.length||finals!==1?1:0);
