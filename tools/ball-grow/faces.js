// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a ball-grow ("It grows every bounce") data.js. Run after sim.js:  node faces.js data.js
// One ball (face 0), frames[k] = x,y,r,state at sim time (k+1)/60.
//  scared = its OWN size vs the gap (meter 75 % -> 0, 95 %+ -> 1): the bigger it gets, the wider the eyes;
//  pupils look at the gap (the way out); hard bounces (> 520 px/s) = hit (squeezed lids); escape = win (^ ^ + giggle).
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const FF=D.ffps,FR=D.frames,cl=v=>Math.min(1,Math.max(0,v));
const ev=[];for(const e of D.events)if(e.type==='bounce'&&e.v>520)ev.push({t:e.t,b:0,type:'hit',v:cl((e.v-520)/500)});
ev.push({t:Math.max(0,D.escT-.2),b:0,type:'win'}); // win 0.2 s early: ^ ^ eyes are visible while it squeezes out (review 18 Nov)
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:1,seed:D.seed,events:ev,pitch:[1.05],sense:(f,i)=>{const F=FR[f],t=(f+1)/FF,gc=D.a0+D.OM*t;
  const ratio=2*F[2]/D.CLEAR,gx=D.CX+D.R*Math.cos(gc)-F[0],gy=D.CY+D.R*Math.sin(gc)-F[1];
  return{threat:F[3]?0:cl((ratio-.75)/.2),lx:gx,ly:gy}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)).join(' '),'| blinks',D.faces.blink[0].length);
