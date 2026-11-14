// Headless logic check for "1 vs 10": every frame all balls fully inside the ring; the runner never overlaps a chaser before the catch;
// the catch event = first contact (runner-catcher distance == RR+RC at endT); chasers appear only after their 'enter' event, one every ENT s,
// all 10 in before the catch; counters on screen come from events; no tunnelling; chaser-chaser overlap < 1 px; ending reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];const RIN=D.R-D.HT;
const en=D.events.filter(e=>e.type==='enter'),ca=D.events.filter(e=>e.type==='catch'),dg=D.events.filter(e=>e.type==='dodge');
if(ca.length!==1)bad.push('catch events '+ca.length);const c0=ca[0];
if(en.length!==D.NC)bad.push('enters '+en.length);en.forEach((e,k)=>{if(e.c!==k||Math.abs(e.t-(D.T0+k*D.ENT))>2/600)bad.push('enter '+k+' at '+e.t);if(e.n!==k+1)bad.push('enter count '+k)});
if(en.length&&en[en.length-1].t>=D.endT)bad.push('not all 10 in before the catch');
let minGap=1e9,maxOv=0;
D.frames.forEach((F,k)=>{const t=(k+1)/D.ffps;if(Math.hypot(F[0]-D.CX,F[1]-D.CY)+D.RR>RIN+.6)bad.push('runner outside f'+k);
 for(let i=0;i<D.NC;i++){const on=F[4+3*i];const shouldOn=t>=en[i].t-1e-9;if(on!==(shouldOn?1:0))bad.push(`chaser ${i} on=${on} at ${t.toFixed(3)}`);if(!on)continue;
  if(Math.hypot(F[2+3*i]-D.CX,F[3+3*i]-D.CY)+D.RC>RIN+.6)bad.push('chaser outside f'+k);
  if(t<D.endT-1e-6){const g=Math.hypot(F[2+3*i]-F[0],F[3+3*i]-F[1])-D.RR-D.RC;minGap=Math.min(minGap,g);if(g<-.5)bad.push(`runner overlaps chaser ${i} before catch f${k}`)}
  for(let j=i+1;j<D.NC;j++)if(F[4+3*j]){const ov=2*D.RC-Math.hypot(F[2+3*i]-F[2+3*j],F[3+3*i]-F[3+3*j]);maxOv=Math.max(maxOv,ov)}}});
if(maxOv>1)bad.push('chaser overlap '+maxOv.toFixed(2));
{const k=Math.ceil(D.endT*D.ffps)-1,F=D.frames[k],i=D.catcher,d=Math.hypot(F[2+3*i]-c0.px,F[3+3*i]-c0.py);if(Math.abs(d-D.RR-D.RC)>1.5)bad.push('catch distance '+d.toFixed(2));if(c0.c!==D.catcher)bad.push('catcher mismatch')}
if(Math.abs(c0.t-D.endT)>1e-9)bad.push('timer != catch time');if(D.tunnel||D.outside)bad.push('tunnel/outside '+D.tunnel+'/'+D.outside);
if(D.frames.length/D.ffps<D.endT+1)bad.push('ending not reached');
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS caught by #${D.catcher+1} at ${D.endT.toFixed(3)} s, chasers in at ${en.map(e=>e.t.toFixed(1)).join(',')}, dodges=${dg.length}, bumps=${D.events.filter(e=>e.type==='bump').length}, min runner gap before catch=${minGap.toFixed(2)} px, max chaser overlap=${maxOv.toFixed(2)} px, maxPen=${D.maxPen.toFixed(3)}, maxStep/r=${D.maxStep.toFixed(3)}, tunnel=${D.tunnel}, sub-steps/frame=10 (600 Hz)`)
