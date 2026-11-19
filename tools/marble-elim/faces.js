// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a marble-elim data.js (family C). Run after sim.js:  node faces.js data.js
// Faces are indexed by COLOR (0 RED .. 5 PURPLE); frames[k][i] belongs to color D.order[i], sim time k/60.
// Each marble's own situation:
//  scared = it is still racing for the current gate and is one of the marbles that have not passed it yet:
//           last two left = 1, last three = .45 (the danger rings show the same two), pupils look at the GATE when scared;
//  angry  = it is one of the last two AND within 220 px of its rival (chasing / being chased in the duel);
//  hit    = hard marble-marble clack (> 380 px/s, both marbles) or a hard paddle hit (> 520 px/s);
//  out    = its own OUT (sad + falling "ooo"); win = the last marble left (^ ^ + giggle). Otherwise pupils look at the nearest marble.
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const N=D.N,FR=D.frames,FF=D.fps,cl=v=>Math.min(1,Math.max(0,v));
const E=D.events,gates=E.filter(e=>e.type==='gate'),outs=E.filter(e=>e.type==='out'),outT=Array(N).fill(Infinity);outs.forEach(o=>outT[o.m]=o.t);
const idx=[];D.order.forEach((c,i)=>idx[c]=i);
const lapsAt=(c,t)=>{let n=0;for(const g of gates)if(g.m===c&&g.t<=t)n++;return n};
const ev=[];
for(const e of E){
 if(e.type==='out')ev.push({t:e.t,b:e.m,type:'out'});
 else if(e.type==='clack'&&e.v>380){const v=cl((e.v-380)/500);ev.push({t:e.t,b:e.m,type:'hit',v});
  // the other marble of the clack = the nearest rolling marble to the contact point at that frame
  const F=FR[Math.min(FR.length-1,Math.round(e.t*FF))];let best=1e9,o=-1;F.forEach((q,i)=>{const c=D.order[i];if(c===e.m||q[2]!==0)return;const d=Math.hypot(q[0]-e.x,q[1]-e.y);if(d<best){best=d;o=c}});
  if(o>=0&&best<2*D.R+6)ev.push({t:e.t,b:o,type:'hit',v})}
 else if(e.type==='spin'&&e.v>520)ev.push({t:e.t,b:e.m,type:'hit',v:cl((e.v-520)/500)})}
ev.push({t:D.endT,b:D.winner,type:'win'});
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:N,seed:D.seed,events:ev,sense:(f,c)=>{const t=f/FF,F=FR[f],q=F[idx[c]];if(q[2]===2||t>=outT[c])return{alive:false};
  const px=q[0],py=q[1];let threat=0,chase=0,lx=0,ly=0;
  if(t<D.endT&&t>D.TOPEN){const alive=[...Array(N).keys()].filter(k=>outT[k]>t),k=N-alive.length+1,pend=alive.filter(a=>lapsAt(a,t)<k);
   if(pend.includes(c)){threat=pend.length===2?1:pend.length===3?.45:0;
    if(pend.length===2){const r=pend.find(a=>a!==c),rq=F[idx[r]];if(rq[2]===0&&q[2]===0&&Math.hypot(rq[0]-px,rq[1]-py)<220)chase=.8}}}
  if(threat>.3)return{threat,chase,lx:D.GX-px,ly:1330-py};
  let best=1e9;F.forEach((o,i)=>{const k=D.order[i];if(k===c||o[2]===2||outT[k]<=t)return;const d=Math.hypot(o[0]-px,o[1]-py);if(d<best){best=d;lx=o[0]-px;ly=o[1]-py}});
  return{threat,chase,lx,ly}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| voices',D.faces.voices.length,'| hits',ev.filter(e=>e.type==='hit').length);
