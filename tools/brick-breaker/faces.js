// Adds the shared EYES + VOICE plan (tools/faces/plan.js) to a brick-breaker data.js. Run after sim.js:  node faces.js data.js
// Each ball's own situation (frames[k][i] = x,y,score):
//  scared = a rival ball is close AND coming straight at it (collision course); angry = it is BEHIND the leader (chasing points, stronger the bigger the gap);
//  hit = a hard ball-ball bump (500-1200 px/s closing speed -> 0-1); win = most bricks (^ ^ + giggle); last place (if alone) = sad + falling "ooo" at the end.
// Pupils look at the threatening rival, otherwise at the nearest live brick (its next target).
const fs=require('fs'),P=process.argv[2]||'data.js';global.window={};require(require('path').resolve(P));const D=window.DATA;
const {planFaces,checkVoices}=require('../faces/plan.js');const N=D.N,FF=D.ffps,FR=D.frames,cl=v=>Math.min(1,Math.max(0,v));
const brk=D.events.filter(e=>e.type==='brick'),dead=new Float64Array(D.NB).fill(Infinity);for(const e of brk)dead[e.brick]=e.t;
const ev=[];for(const e of D.events)if(e.type==='bump'&&e.v>500){const v=cl((e.v-500)/700);ev.push({t:e.t,b:e.a,type:'hit',v});ev.push({t:e.t,b:e.b,type:'hit',v})}
ev.push({t:D.endT,b:D.win,type:'win'});
const fin=FR[FR.length-1].map(q=>q[2]),mn=Math.min(...fin);if(fin.filter(v=>v===mn).length===1){D.lastPlace=fin.indexOf(mn);ev.push({t:D.endT+.05,b:D.lastPlace,type:'out'})}
const vel=(f,i)=>{const a=FR[Math.max(0,f-2)][i],b=FR[Math.min(FR.length-1,f+2)][i],dt=(Math.min(FR.length-1,f+2)-Math.max(0,f-2))/FF;return[(b[0]-a[0])/dt,(b[1]-a[1])/dt]};
D.faces=planFaces({ffps:FF,nFrames:FR.length,n:N,seed:D.seed,events:ev,sense:(f,i)=>{const F=FR[f],me=F[i],t=(f+1)/FF,lead=Math.max(...F.map(q=>q[2]));
  let threat=0,lx=0,ly=0;const vm=vel(f,i);
  for(let j=0;j<N;j++){if(j===i)continue;const o=F[j],dx=o[0]-me[0],dy=o[1]-me[1],d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,vo=vel(f,j);
   const closing=(vm[0]-vo[0])*ux+(vm[1]-vo[1])*uy,th=cl(1-(d-2*D.RB)/200)*cl((closing-300)/700);if(th>threat){threat=th;lx=dx;ly=dy}}
  const chase=t<D.endT?cl((lead-me[2]-1)/4)*cl(t/3):0;
  if(threat<.2){let best=1e9;for(let q=0;q<D.NB;q++)if(dead[q]>t){const k=D.bricks[q],dx=k[0]+k[2]/2-me[0],dy=k[1]+k[3]/2-me[1],d=Math.hypot(dx,dy);if(d<best){best=d;lx=dx;ly=dy}}}
  return{threat,chase,lx,ly}}});
const bad=checkVoices(D.faces.voices);if(bad.length){console.log('VOICE FAIL',bad);process.exit(1)}
fs.writeFileSync(P,'window.DATA='+JSON.stringify(D)+';\n');
console.log('faces: voices',D.faces.voices.map(v=>v.kind+'@'+v.t.toFixed(2)+'#'+v.b).join(' '),'| blinks',D.faces.blink.map(b=>b.length).join(','),'| lastPlace',D.lastPlace);
