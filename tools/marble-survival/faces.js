// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a marble-survival data.js. Run after sim.js:  node faces.js data.js
// frames[k] = per marble x,y,st (st 1 = on the floor). Each marble's own situation:
//  scared = its own distance to the shrinking floor edge (110 px+ -> 0, 10 px -> 1), pupils look over the edge (outward) when scared,
//  otherwise at the nearest marble; hard bumps (> 260 px/s) = hit; falling off = out (sad + falling "ooo"); last marble = win.
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const N=D.N,FF=D.ffps,FR=D.frames,cl=v=>Math.min(1,Math.max(0,v));
const Rt=t=>{if(t>D.endT)t=D.endT;const u=cl((t-D.TS)/(D.TE-D.TS));return D.REND+(D.R0-D.REND)*Math.sqrt(1-u)};
const ev=[];for(const e of D.events){if(e.type==='fall')ev.push({t:e.t,b:e.m,type:'out'});
 else if(e.type==='bump'&&e.v>260){const v=cl((e.v-260)/450);ev.push({t:e.t,b:e.a,type:'hit',v});ev.push({t:e.t,b:e.b,type:'hit',v})}}
ev.push({t:D.endT,b:D.win,type:'win'});
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:N,seed:D.seed,events:ev,sense:(f,i)=>{const F=FR[f],t=(f+1)/FF;if(!F[3*i+2])return{alive:false};
  const px=F[3*i],py=F[3*i+1],dx=px-D.CX,dy=py-D.CY,dc=Math.hypot(dx,dy),de=Rt(t)-dc,threat=t<D.endT?cl(1-(de-10)/100):0;
  if(threat>.15)return{threat,lx:dx,ly:dy};let best=1e9,lx=0,ly=0;
  for(let j=0;j<N;j++)if(j!==i&&F[3*j+2]){const d=Math.hypot(F[3*j]-px,F[3*j+1]-py);if(d<best){best=d;lx=F[3*j]-px;ly=F[3*j+1]-py}}return{threat,lx,ly}}});
// 24 marbles = up to 23 falls: voicing every fall breaks the NEVER-NOISY limits, so keep the win giggle, the "ooo" of the LAST 5 falls only,
// then other voices only where they still fit (no overlap, max 2 starts per 1 s).
{const {VOICE_LEN}=require('../faces/plan.js'),falls=D.events.filter(e=>e.type==='fall').map(e=>e.t),late=falls.slice(-5).map(t=>t.toFixed(3));
 const pr=v=>v.kind==='giggle'?3:v.kind==='ooo'?(falls.slice(-5).some(t=>Math.abs(v.t-t)<1.3)?2:-1):v.kind==='eep'?1:.5;
 const cand=D.faces.voices.map(v=>({...v,p:pr(v)})).filter(v=>v.p>=0).sort((a,b)=>b.p-a.p||a.t-b.t),acc=[];
 for(const c of cand){const e=c.t+VOICE_LEN[c.kind];if(acc.some(a=>c.t<a.t+VOICE_LEN[a.kind]+.05&&a.t<e+.05))continue;if(acc.filter(a=>Math.abs(a.t-c.t)<1).length>=2)continue;acc.push(c)}
 D.faces.voices=acc.sort((a,b)=>a.t-b.t).map(({p,...v})=>v)}
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| voices',D.faces.voices.length);
