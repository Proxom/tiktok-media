// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a merge-race data.js. Run after sim.js:  node faces.js data.js
// Balls are born (drop / merge) and vanish (merge) all the time, so every ball id gets its own channels, trimmed to its own lifetime
// (D.faces.off[id] = first sample). Each ball reacts to ITS OWN situation:
//   scared = a NEWER ball of the SAME number but ANOTHER color is closing in (touching it would steal this ball's color); pupils look at it
//   angry  = this ball is the newer one closing in on an older same-number ball of another color (it is about to take it over)
//   look   = otherwise at the nearest same-number ball (its merge partner), else the nearest ball
//   hit    = ball-ball / wall impacts above 300 px/s (strength 300-800 -> 0-1)
//   happy  = short ^ ^ right after a TAKEOVER merge (the new ball's color just stole the number); the KING = win (stays happy)
//   end    = after the king: balls of the winning color turn happy, every other ball turns sad (each with its own delay)
// Voices: giggle on the king, one falling "ooo" for the color the king was stolen from, "oof" on the hardest hits, "eep" on scared onsets
// (all NEVER-NOISY limits from plan.js: 1 at a time, max 2 per second).
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../../faces/plan.js');
const FPS=D.fps,NF=D.frames.length,rad=k=>D.R0*Math.pow(D.RF,k),KT=D.king.t;
let N=0;for(const F of D.frames)for(const q of F)N=Math.max(N,q[0]+1);
const FM=D.frames.map(F=>F);
const first=Array(N).fill(-1),last=Array(N).fill(-1);
D.frames.forEach((F,f)=>{for(const q of F){if(first[q[0]]<0)first[q[0]]=f;last[q[0]]=f}});
const hv=v=>Math.min(1,Math.max(0,(v-300)/500)),ev=[];
for(const e of D.events){if(e.t>KT+.05)continue;
 if(e.type==='hit'&&hv(e.v)>0&&e.a!=null){ev.push({t:e.t,b:e.a,type:'hit',v:hv(e.v)});ev.push({t:e.t,b:e.b,type:'hit',v:hv(e.v)})}
 else if(e.type==='wall'&&hv(e.v)>0&&e.b!=null)ev.push({t:e.t,b:e.b,type:'hit',v:hv(e.v)})}
ev.push({t:KT,b:D.king.id,type:'win'});
// the stolen-from color: its biggest ball still in the jar right after the king gets the one sad "ooo"
{const kf=Math.min(NF-1,Math.round(KT*FPS)+2),cand=D.frames[kf].filter(q=>q[1]===D.king.lose&&q[0]!==D.king.id).sort((a,b)=>b[2]-a[2]||a[4]-b[4]);
 if(cand.length&&D.king.lose!==D.win){D.sadId=cand[0][0];ev.push({t:KT+.55,b:cand[0][0],type:'out'})}}
const sense=(f,i)=>{const F=FM[f];let me=null;for(const q of F)if(q[0]===i){me=q;break}if(!me)return{alive:false};
 const r=rad(me[2]);let threat=0,chase=0,tl=null,best=1e9,bl=null,near=1e9,nl=null;
 for(const q of F){if(q[0]===i)continue;const dx=q[3]-me[3],dy=q[4]-me[4],d=Math.hypot(dx,dy)-r-rad(q[2]);
  if(q[2]===me[2]&&me[2]<D.TOP){if(q[1]!==me[1]){const w=Math.min(1,Math.max(0,1-d/(2.4*r)));
     if(q[5]>me[5]){if(w>threat){threat=w;tl=[dx,dy]}}else if(w>chase)chase=w}
   if(d<best){best=d;bl=[dx,dy]}}
  if(d<near){near=d;nl=[dx,dy]}}
 const L=tl||bl||nl||[0,0];return{threat,chase,lx:L[0],ly:L[1]}};
const pl=planFaces({ffps:FPS,nFrames:NF,n:N,seed:D.seed,events:ev,sense});
// fewer voices (never noisy): "eep" only for balls of 8 or more (a real loss) and at most one every 1.6 s; "oof" at most one every 4 s (plan.js)
{const tier=new Map();for(const F of D.frames)for(const q of F)tier.set(q[0],q[2]);let le=-9;
 pl.voices=pl.voices.filter(v=>{if(v.kind!=='eep')return true;if((tier.get(v.b)||0)<2||v.t-le<1.6)return false;le=v.t;return true})}
const bad=checkVoices(pl.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
const step=pl.step,sfps=pl.fps,rnd=(()=>{let s=(D.seed*977+5)>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}})();
const mergeById=new Map(D.events.filter(e=>e.type==='merge').map(e=>[e.id,e]));
const ch={},blink={},off={};
for(let i=0;i<N;i++){if(first[i]<0)continue;const a=pl.ch[i],n=a.length/7,k0=Math.max(0,Math.floor(first[i]/step)),k1=Math.min(n-1,Math.ceil((last[i]+1)/step)+1);
 // happy pulse right after a takeover merge (0.65 s), per-ball strength
 const m=mergeById.get(i);if(m&&m.from!==m.c&&m.t<KT){const amp=.8+.15*rnd();for(let k=k0;k<=k1;k++){const tt=k/sfps-m.t;if(tt<0||tt>.65)continue;const v=amp*Math.sin(Math.PI*Math.min(1,tt/.65))**.6;a[7*k+3]=Math.max(a[7*k+3],+v.toFixed(2))}}
 // after the king: winner-color balls happy, all other balls sad, each with its own delay
 if(i!==D.king.id&&i!==D.sadId){const q=D.frames[Math.min(NF-1,Math.round(KT*FPS)+2)].find(z=>z[0]===i);if(q){const dl=.15+.5*rnd(),hap=q[1]===D.win;
   for(let k=k0;k<=k1;k++){const tt=k/sfps-KT-dl;if(tt<0)continue;const v=Math.min(1,tt/.35)*(hap?.85:.75);
    a[7*k]=+(a[7*k]*(1-v)).toFixed(2);a[7*k+2]=+(a[7*k+2]*(1-v)).toFixed(2);if(hap)a[7*k+3]=Math.max(a[7*k+3],+v.toFixed(2));else a[7*k+4]=Math.max(a[7*k+4],+v.toFixed(2))}}}
 ch[i]=a.slice(7*k0,7*(k1+1));off[i]=k0;const t0=k0/sfps,t1=(k1+1)/sfps;blink[i]=pl.blink[i].filter(b=>b>=t0&&b<t1).map(b=>+(b-t0).toFixed(3))}
D.faces={fps:sfps,step,ch,blink,off,voices:pl.voices,perId:1};
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
const kinds={};pl.voices.forEach(v=>kinds[v.kind]=(kinds[v.kind]||0)+1);
console.log('faces: ids',N,'voices',pl.voices.length,JSON.stringify(kinds),pl.voices.map(v=>v.kind+'@'+v.t.toFixed(2)).join(' '),'| size',(fs.statSync(P).size/1e6).toFixed(2),'MB');
