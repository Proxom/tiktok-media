// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a ball-battle data.js. Run after sim.js:  node faces.js data.js
// Each ball's own situation (frames[k][i] = x,y,r,hp):
//  scared = a rival is close AND closing in, stronger with low HP; angry = it is chasing (moving toward the nearest rival faster than the rival);
//  hit = it LOST a crash (-1 HP; harder crash / lower HP = stronger, X eyes only on the hardest); out = 0 HP (sad, falling "ooo"); win = last ball.
// Pupils look at the nearest live rival.
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const N=D.N||4,FF=D.ffps,FR=D.frames,cl=v=>Math.min(1,Math.max(0,v));
const ev=[];for(const e of D.events){if(e.type==='out')ev.push({t:e.t,b:e.ball,type:'out'});
 else if(e.type==='crash'&&e.hp>0)ev.push({t:e.t,b:e.loser,type:'hit',v:cl(.3+.45*cl((e.v-300)/600)+.25*cl((3-e.hp)/2))})}
if(D.win>=0)ev.push({t:D.endT,b:D.win,type:'win'});
const vel=(f,i)=>{const a=FR[Math.max(0,f-2)][i],b=FR[Math.min(FR.length-1,f+2)][i],dt=(Math.min(FR.length-1,f+2)-Math.max(0,f-2))/FF;return[(b[0]-a[0])/dt,(b[1]-a[1])/dt]};
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:N,seed:D.seed,events:ev,sense:(f,i)=>{const F=FR[f],me=F[i];if(me[3]<=0)return{alive:false};
  let best=1e9,j0=-1;for(let j=0;j<N;j++)if(j!==i&&F[j][3]>0){const d=Math.hypot(F[j][0]-me[0],F[j][1]-me[1])-me[2]-F[j][2];if(d<best){best=d;j0=j}}
  if(j0<0)return{threat:0};const o=F[j0],dx=o[0]-me[0],dy=o[1]-me[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,vm=vel(f,i),vo=vel(f,j0);
  const closing=(vm[0]-vo[0])*ux+(vm[1]-vo[1])*uy,mine=vm[0]*ux+vm[1]*uy,theirs=-(vo[0]*ux+vo[1]*uy),hpF=me[3]<=2?1:me[3]<=4?.75:.5;
  const near=cl(1-best/220),threat=near*cl(closing/500)*hpF*(theirs>mine*.8?1:.4),chase=near*cl((mine-Math.max(0,theirs))/400)*(me[3]>=o[3]?1:.5);
  return{threat,chase,lx:dx,ly:dy}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| blinks',D.faces.blink.map(b=>b.length).join(','));
