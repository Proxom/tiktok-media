// Headless logic check for "24 marble survival": every frame each marble still on the floor has its centre inside the floor radius R(t)
// (R frozen at the winner moment); every 'fall' happens exactly when the centre crosses the edge (R <= d <= R+3 px); a marble is drawn
// as fallen only after its fall event; 23 falls, LEFT counter = 24 - falls, the winner is the only marble that never falls and stays on
// to the end; floor marbles never overlap (> 1 px); no tunnelling; ending reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];
const Rt=t=>{if(t>D.endT)t=D.endT;const u=Math.min(1,Math.max(0,(t-D.TS)/(D.TE-D.TS)));return D.REND+(D.R0-D.REND)*Math.sqrt(1-u)};
const fl=D.events.filter(e=>e.type==='fall');if(fl.length!==D.N-1)bad.push('falls '+fl.length);
const fAt={};fl.forEach((e,k)=>{if(fAt[e.m]!==undefined)bad.push('double fall '+e.m);fAt[e.m]=e.t;if(e.left!==D.N-1-k)bad.push('left count '+k);
 const R=Rt(e.t);if(e.d<R-1e-6||e.d>R+3)bad.push(`fall ${e.m} at d=${e.d.toFixed(2)} R=${R.toFixed(2)}`)});
if(fAt[D.win]!==undefined)bad.push('winner fell');if(Math.abs(fl[fl.length-1].t-D.endT)>1e-9)bad.push('endT != last fall');
let maxOv=0,maxOut=-1e9;
D.frames.forEach((F,k)=>{const t=(k+1)/D.ffps,R=Rt(t);
 for(let i=0;i<D.N;i++){const on=F[3*i+2],should=fAt[i]===undefined||t<fAt[i]-1e-9;if(on!==(should?1:0)&&Math.abs(t-(fAt[i]||0))>1/D.ffps)bad.push(`marble ${i} on=${on} at ${t.toFixed(3)}`);if(!on)continue;
  const d=Math.hypot(F[3*i]-D.CX,F[3*i+1]-D.CY);maxOut=Math.max(maxOut,d-R);if(d>R+.5)bad.push(`marble ${i} past edge on floor f${k}`);
  for(let j=i+1;j<D.N;j++)if(F[3*j+2])maxOv=Math.max(maxOv,2*D.MR-Math.hypot(F[3*i]-F[3*j],F[3*i+1]-F[3*j+1]))}});
if(maxOv>1)bad.push('overlap '+maxOv.toFixed(2));if(D.tunnel||D.late)bad.push('tunnel/late '+D.tunnel+'/'+D.late);
const last=D.frames[D.frames.length-1];if(!last[3*D.win+2])bad.push('winner not on floor at the end');
if(D.frames.length/D.ffps<D.endT+1)bad.push('ending not reached');
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS winner #${D.win+1} at ${D.endT.toFixed(3)} s, falls=${fl.length} (${fl.map(e=>'#'+(e.m+1)+'@'+e.t.toFixed(1)).join(' ')}), bumps=${D.events.filter(e=>e.type==='bump').length}, max overlap=${maxOv.toFixed(2)} px, max centre past edge on floor=${maxOut.toFixed(2)} px, maxPen=${D.maxPen.toFixed(3)}, maxStep/r=${D.maxStep.toFixed(3)}, tunnel=${D.tunnel}, sub-steps/frame=10 (600 Hz)`)
