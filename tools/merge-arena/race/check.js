// Headless gate for the merge race (family E): every ball that appears is a drop or a merge of exactly two vanished balls with the SAME number,
// and it carries the color of the NEWER parent (the rule on screen); no ball vanishes without a merge; exactly one KING and its color = the winner shown;
// every color got the same number of drops (+-1); no ball inside a wall/floor; no overlap between settled balls above 4 px; tunnel 0; ending reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA,bad=[];
const rad=k=>D.R0*Math.pow(D.RF,k),merges=D.events.filter(e=>e.type==='merge'),drops=D.events.filter(e=>e.type==='drop'),mg=new Map(merges.map(e=>[e.id,e])),dr=new Set(drops.map(e=>e.id));
const rAt=(q,t)=>mg.has(q[0])&&t-q[5]<D.GROW?rad(q[2]-1)+(rad(q[2])-rad(q[2]-1))*(t-q[5])/D.GROW:rad(q[2]);
let maxOv=0,ovAt=-1;const seen=new Map();
for(let f=1;f<D.frames.length;f++){const A=new Map(D.frames[f-1].map(q=>[q[0],q])),B=new Map(D.frames[f].map(q=>[q[0],q])),t=f/D.fps;
 const gone=[...A.values()].filter(q=>!B.has(q[0])),born=[...B.values()].filter(q=>!A.has(q[0]));const used=new Set();
 for(const n of born){if(dr.has(n[0]))continue;const e=mg.get(n[0]);if(!e){bad.push(`f${f} ball ${n[0]} appeared without drop/merge`);continue}
  const ps=e.pa.map(id=>seen.get(id)).filter(Boolean);if(ps.length!==2){bad.push(`f${f} merge ${n[0]} parents missing`);continue}
  if(!e.pa.every(id=>gone.some(g=>g[0]===id)&&!B.has(id)))bad.push(`f${f} parents of ${n[0]} did not vanish in this frame`);
  if(ps[0][2]!==ps[1][2]||n[2]!==ps[0][2]+1)bad.push(`f${f} merge ${n[0]} numbers ${ps[0][2]},${ps[1][2]} -> ${n[2]}`);
  const nw=(ps[1][5]>ps[0][5]||(ps[1][5]===ps[0][5]&&ps[1][0]>ps[0][0]))?ps[1]:ps[0];if(n[1]!==nw[1])bad.push(`f${f} merge ${n[0]} color ${n[1]} but newer parent is ${nw[1]}`);
  e.pa.forEach(id=>used.add(id))}
 for(const g of gone)if(!used.has(g[0]))bad.push(`f${f} ball ${g[0]} vanished without a merge`);
 for(const q of D.frames[f]){seen.set(q[0],q);const r=rAt(q,t);if(q[3]<D.XL+r-1||q[3]>D.XR-r+1||q[4]>D.FL-r+1)bad.push(`f${f} ball ${q[0]} in a wall`)}
 const F=D.frames[f];for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const a=F[i],b=F[j],ov=rAt(a,t)+rAt(b,t)-Math.hypot(a[3]-b[3],a[4]-b[4]);if(ov>maxOv){maxOv=ov;ovAt=f}}}
const kings=D.events.filter(e=>e.type==='king');if(kings.length!==1)bad.push('kings '+kings.length);else if(kings[0].c!==D.win)bad.push('winner shown '+D.win+' but king color '+kings[0].c);
const kf=Math.round(D.endT*D.fps)+1;const kq=D.frames[Math.min(kf,D.frames.length-1)].find(q=>q[0]===D.king.id);if(!kq||kq[1]!==D.win||kq[2]!==D.TOP)bad.push('king ball not in frames as shown');
if(D.frames.slice(0,kf-1).some(F=>F.some(q=>q[2]>=D.TOP)))bad.push('a king existed before the king event');
const per=[0,0,0,0];drops.forEach(e=>per[e.c]++);if(Math.max(...per)-Math.min(...per)>1)bad.push('unfair drops '+per);
if(drops.some(e=>e.t>D.endT))bad.push('drop after the king');
if(merges.some(e=>e.t>D.endT))bad.push('merge after the king');
if(maxOv>4)bad.push('overlap '+maxOv.toFixed(1)+' px at frame '+ovAt);
if(D.tunnel)bad.push('tunnel '+D.tunnel);{const vi=D.tmap.findIndex(v=>v>=D.endT);if(vi<0||(D.tmap.length-vi)/D.vfps<2)bad.push('ending not reached')}
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS drops=${drops.length} per color ${per.join('/')} merges=${merges.length} takeovers=${merges.filter(e=>e.from!==e.c).length} winner=${['RED','BLUE','YELLOW','GREEN'][D.win]} (king = 64 ${['RED','BLUE','YELLOW','GREEN'][D.win]} + 64 ${['RED','BLUE','YELLOW','GREEN'][D.king.lose]}) leadChanges=${D.changes} maxOverlap=${maxOv.toFixed(2)} px maxStep/r=${D.maxStep.toFixed(3)} tunnel=0 sub-steps/frame=10 (600 Hz) passes=6`);
process.exit(bad.length?1:0)
