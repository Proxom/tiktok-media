// Headless logic check for "black hole": every frame each live ball is fully inside the ring and fully outside the hole (RH frozen at the win);
// each 'eat' happens at first touch (overlap < 3 px); a ball is drawn as eaten only after its eat event; N-1 eats, LEFT = N - eats;
// the winner is the only ball never eaten and is alive at the end; live balls never overlap (> 1 px); no tunnelling; ending reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];
const RHt=t=>{if(t>D.endT)t=D.endT;return D.RH0+(D.RH1-D.RH0)*Math.min(1,Math.max(0,t/D.TG))};
const ea=D.events.filter(e=>e.type==='eat');if(ea.length!==D.N-1)bad.push('eats '+ea.length);const eAt={};
ea.forEach((e,k)=>{if(eAt[e.b]!==undefined)bad.push('double eat');eAt[e.b]=e.t;if(e.left!==D.N-1-k)bad.push('left count '+k);const ov=e.RH-(e.d-D.RB);if(ov<0||ov>3)bad.push(`eat ${e.b} overlap ${ov.toFixed(2)}`)});
if(eAt[D.win]!==undefined)bad.push('winner eaten');if(Math.abs(ea[ea.length-1].t-D.endT)>1e-9)bad.push('endT != last eat');
let maxOv=0,minHole=1e9,maxWall=-1e9;
D.frames.forEach((F,k)=>{const t=(k+1)/D.ffps,RH=RHt(t);for(let i=0;i<D.N;i++){const on=F[3*i+2],should=eAt[i]===undefined||t<eAt[i]-1e-9;
  if(on!==(should?1:0)&&Math.abs(t-(eAt[i]||0))>1/D.ffps)bad.push(`ball ${i} on=${on} at ${t.toFixed(3)}`);if(!on)continue;
  const d=Math.hypot(F[3*i]-D.CX,F[3*i+1]-D.CY);minHole=Math.min(minHole,d-D.RB-RH);maxWall=Math.max(maxWall,d+D.RB-(D.R-D.HT));
  if(d+D.RB>D.R-D.HT+.6)bad.push('ball outside ring f'+k);if(d-D.RB<RH-.6&&Math.abs(t-(eAt[i]||-9))>1/D.ffps)bad.push(`ball ${i} inside hole while alive f${k}`);
  for(let j=i+1;j<D.N;j++)if(F[3*j+2])maxOv=Math.max(maxOv,2*D.RB-Math.hypot(F[3*i]-F[3*j],F[3*i+1]-F[3*j+1]))}});
if(maxOv>1)bad.push('overlap '+maxOv.toFixed(2));if(D.tunnel)bad.push('tunnel '+D.tunnel);
if(!D.frames[D.frames.length-1][3*D.win+2])bad.push('winner not alive at end');if(D.frames.length/D.ffps<D.endT+1)bad.push('ending not reached');
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS winner ${D.win} at ${D.endT.toFixed(3)} s, eats=${ea.map(e=>e.b+'@'+e.t.toFixed(2)).join(' ')}, walls=${D.events.filter(e=>e.type==='wall').length}, bumps=${D.events.filter(e=>e.type==='bump').length}, max ball overlap=${maxOv.toFixed(2)} px, min live gap to hole=${minHole.toFixed(2)} px, max past wall=${maxWall.toFixed(2)} px, maxStep/r=${D.maxStep.toFixed(3)}, tunnel=0, sub-steps/frame=10 (600 Hz)`)
