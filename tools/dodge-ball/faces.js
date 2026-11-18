// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a dodge-ball data.js. Run after sim.js:  node faces.js data.js
// Face index 0 = the gold runner, 1..10 = chaser #1..#10 (frames[k] = rx,ry, then per chaser x,y,on).
//  runner: scared = nearest chaser edge gap (0 px -> 1, 170 px+ -> 0), pupils on that chaser; caught = 'out' (sad + falling "ooo").
//  chasers: angry while hunting (stronger the closer they are to the runner), pupils on the runner; hard chaser-chaser bumps = 'hit' for both;
//  the catcher = 'win' (^ ^ + giggle). After the catch the other chasers calm down (no target).
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const NC=D.NC,N=NC+1,FF=D.ffps,FR=D.frames,ET=D.endT,cl=v=>Math.min(1,Math.max(0,v));
const ev=[];for(const e of D.events)if(e.type==='bump'&&e.t<ET&&e.v>260){const v=cl((e.v-260)/420);ev.push({t:e.t,b:e.a+1,type:'hit',v});ev.push({t:e.t,b:e.b+1,type:'hit',v})}
ev.push({t:ET,b:0,type:'out'});ev.push({t:ET+.05,b:D.catcher+1,type:'win'});
const pitch=[1.16,...[...Array(NC)].map((_,k)=>.84+.1*k/(NC-1))];
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:N,seed:D.seed,events:ev,pitch,sense:(f,i)=>{const F=FR[f],t=(f+1)/FF,rx=F[0],ry=F[1];
  if(i===0){let g=1e9,lx=0,ly=1;for(let k=0;k<NC;k++)if(F[4+3*k]){const dx=F[2+3*k]-rx,dy=F[3+3*k]-ry,d=Math.hypot(dx,dy)-D.RR-D.RC;if(d<g){g=d;lx=dx;ly=dy}}
    return{threat:t<ET?cl(1-g/170):0,lx,ly}}
  const k=i-1;if(!F[4+3*k])return{threat:0};const dx=rx-F[2+3*k],dy=ry-F[3+3*k],d=Math.hypot(dx,dy);
  return{threat:0,chase:t<ET?.45+.55*cl(1-(d-D.RR-D.RC)/350):0,lx:dx,ly:dy}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| blinks',D.faces.blink.map(b=>b.length).join(','));
