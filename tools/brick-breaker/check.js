// Headless check for the brick breaker: every brick breaks exactly once; the score shown in every frame == bricks broken by that ball (events) so far;
// the winner == the ball with the most bricks (no tie for first); ending reached; no tunnelling (ball inside a live brick / beyond a wall / through a ball);
// every ball fully inside the box in every frame; no ball overlaps a brick that is still standing at that frame (0.5 px tolerance).
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;let bad=[];
const br=D.events.filter(e=>e.type==='brick'),seen=new Set(),dead=new Float64Array(D.NB).fill(Infinity);
for(const e of br){if(seen.has(e.brick))bad.push('brick broken twice '+e.brick);seen.add(e.brick);dead[e.brick]=e.t}
if(seen.size!==D.NB)bad.push('bricks broken '+seen.size+' of '+D.NB);if(Math.abs(br[br.length-1].t-D.endT)>1e-9)bad.push('end != last brick');
const L=D.BX0+D.HT,R=D.BX1-D.HT,T=D.BY0+D.HT,Bo=D.BY1-D.HT;
D.frames.forEach((F,k)=>{const t=(k+1)/D.ffps;F.forEach((q,i)=>{const n=br.filter(e=>e.ball===i&&e.t<=t+1e-9).length;if(q[2]!==n)bad.push(`frame ${k} ball ${i} score ${q[2]} vs ${n}`);
 if(q[0]-D.RB<L-.6||q[0]+D.RB>R+.6||q[1]-D.RB<T-.6||q[1]+D.RB>Bo+.6)bad.push(`frame ${k} ball ${i} outside box`);
 for(let b=0;b<D.NB;b++)if(dead[b]>t+1e-9){const K=D.bricks[b],cx=Math.max(K[0],Math.min(q[0],K[0]+K[2])),cy=Math.max(K[1],Math.min(q[1],K[1]+K[3]));if(Math.hypot(q[0]-cx,q[1]-cy)<D.RB-.5)bad.push(`frame ${k} ball ${i} inside live brick ${b}`)}})});
const fin=D.frames[D.frames.length-1].map(q=>q[2]),mx=Math.max(...fin);if(fin.filter(v=>v===mx).length!==1||fin.indexOf(mx)!==D.win)bad.push('winner mismatch '+fin+' vs '+D.win);
if(fin.reduce((a,b)=>a+b,0)!==D.NB)bad.push('scores do not add up');if(D.tunnel)bad.push('tunnel '+D.tunnel);
if(D.frames.length/D.ffps<D.endT+1)bad.push('ending not reached');
if(D.faces){const {checkVoices}=require('../faces/plan.js');bad.push(...checkVoices(D.faces.voices))}
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS bricks=${D.NB} scores=${fin} winner=${D.win} end=${D.endT.toFixed(2)} bumps=${D.events.filter(e=>e.type==='bump').length} maxStep/r=${D.maxStep.toFixed(3)} maxPen=${D.maxPen.toFixed(2)} tunnel=${D.tunnel} sub-steps/frame=20 (600 Hz) voices=${D.faces?D.faces.voices.length:0}`)
