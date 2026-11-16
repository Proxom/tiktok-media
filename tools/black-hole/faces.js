// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a black-hole data.js. Run after sim.js:  node faces.js data.js
// Each ball's own situation: scared = its own gap to the growing hole (< ~170 px), pupils look at the hole when scared,
// otherwise at the nearest live rival; bumps / wall hits above 350 px/s = hit (strength 350-850 px/s -> 0-1); eaten = out (sad, falling "ooo"); last ball = win.
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');
const RHt=t=>{if(t>D.endT)t=D.endT;return D.RH0+(D.RH1-D.RH0)*Math.min(1,Math.max(0,t/D.TG))};
const hv=v=>Math.min(1,Math.max(0,(v-350)/500)),ev=[];for(const e of D.events){if(e.type==='eat')ev.push({t:e.t,b:e.b,type:'out'});
 else if(e.type==='wall'){if(hv(e.v)>0)ev.push({t:e.t,b:e.b,type:'hit',v:hv(e.v)})}
 else if(e.type==='bump'&&hv(e.v)>0){ev.push({t:e.t,b:e.a,type:'hit',v:hv(e.v)});ev.push({t:e.t,b:e.b,type:'hit',v:hv(e.v)})}}
ev.push({t:D.endT,b:D.win,type:'win'});
D.faces=planFaces({ffps:D.ffps,nFrames:D.frames.length,n:D.N,seed:D.seed,events:ev,sense:(f,i)=>{const F=D.frames[f],t=(f+1)/D.ffps;if(!F[3*i+2])return{alive:false};
  const px=F[3*i],py=F[3*i+1],dh=Math.hypot(px-D.CX,py-D.CY)-D.RB-RHt(t),threat=Math.min(1,Math.max(0,1-(dh-20)/150));
  if(threat>.15)return{threat,lx:D.CX-px,ly:D.CY-py};let best=1e9,lx=0,ly=0;
  for(let j=0;j<D.N;j++)if(j!==i&&F[3*j+2]){const d=Math.hypot(F[3*j]-px,F[3*j+1]-py);if(d<best){best=d;lx=F[3*j]-px;ly=F[3*j+1]-py}}return{threat,lx,ly}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| blinks',D.faces.blink.map(b=>b.length).join(','));
