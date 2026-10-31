// E "Infinite geometric loop": closed 3D track, NB brass balls rolling forever through NR chime rings.
// node gen.js data.js  (env: SEED, NB, NR, T, LOBES)  -> track params + ring hit events, shared by page.html and audio.py
// Seamless by construction: each ball travels the whole loop length L in T, so frame(t)==frame(t+T); video = 2T with one camera orbit.
const fs=require('fs');
const E=process.env, SEED=+E.SEED||7, NB=+E.NB||4, NR=+E.NR||6, T=+E.T||7.5, LOBES=+E.LOBES||3;
// ring arc positions: k*STEP/(NB*NR) mod 1 -> each ring has a distinct phase, giving a steady T/(NB*NR) pulse
const gcd=(a,b)=>b?gcd(b,a%b):a;let STEP=Math.round(NB*NR*.29);while(gcd(STEP,NR)!==1)STEP++; // k*STEP mod NR distinct -> distinct phases
const rings=[];for(let k=0;k<NR;k++)rings.push(((k*STEP)%(NB*NR))/(NB*NR));
// events over one period: ball j at arc fraction u_j(t)=(j/NB + t/T) mod 1 ; hits ring at t=((r-j/NB) mod 1)*T
const ev=[];for(let k=0;k<NR;k++)for(let j=0;j<NB;j++){let u=((rings[k]-j/NB)%1+1)%1;ev.push({t:+(u*T).toFixed(5),ring:k,ball:j})}
ev.sort((a,b)=>a.t-b.t);
const gaps=ev.map((e,i)=>((i+1<ev.length?ev[i+1].t:ev[0].t+T)-e.t));
console.log('STEP',STEP,'rings',rings.map(r=>r.toFixed(3)).join(' '),'events/period',ev.length,'gap min/max',Math.min(...gaps).toFixed(3),Math.max(...gaps).toFixed(3));
const data={SEED,NB,NR,T,LOBES,rings,ev,DUR:2*T};
fs.writeFileSync(process.argv[2]||'data.js','const DATA='+JSON.stringify(data)+';if(typeof module!=="undefined")module.exports=DATA;');
