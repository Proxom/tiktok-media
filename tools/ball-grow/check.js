// Headless HARD GATE check for a ring-escape episode (AGENT.md §5.2): node check.js [data.js]
// zero tunnelling, one escape, meter == logged events, growth rule, escaping ball fully in frame, ending reached.
global.window={};require(require('path').resolve(process.argv[2]||__dirname+'/data.js'));const d=window.DATA,bad=[];
const bo=d.events.filter(e=>e.type==='bounce'),es=d.events.filter(e=>e.type==='escape');
if(d.teleport!==0)bad.push('teleport '+d.teleport);if(!(d.maxPen<1))bad.push('maxPen '+d.maxPen);if(d.outsideTouch!==0)bad.push('ring touched after escape');
if(es.length!==1)bad.push('escapes '+es.length);const e=es[0];
bo.forEach((b,i)=>{if(b.n!==i+1)bad.push('bounce count '+i);if(Math.abs(b.r-(d.R0+d.GROW*(i+1)))>1e-6)bad.push('growth '+i);if(Math.abs(b.ratio-2*b.r/d.CLEAR)>1e-9)bad.push('ratio '+i)});
if(e){if(e.n!==bo.length)bad.push('escape n');if(!(e.ratio<1))bad.push('escaped at >=100%');if(Math.abs(e.ratio-bo[bo.length-1].ratio)>1e-9)bad.push('meter at escape != last bounce');
 if(e.x-e.r<60||e.x+e.r>930||e.y-e.r<640)bad.push('escape outside frame/safe');if(bo.some(b=>b.t>e.t))bad.push('bounce after escape')}
const sub=d.frames.filter(f=>f[3]===0);if(sub.some(f=>f[0]-f[2]<0||f[0]+f[2]>1080||f[1]-f[2]<0||f[1]+f[2]>1920))bad.push('ball out of frame before escape');
const last=d.frames[d.frames.length-1];if(!(last[3]===1&&last[1]>1920+last[2]))bad.push('ending not reached (ball still on screen)');
console.log('bounces',bo.length,'escape',e&&e.t.toFixed(2),'pct',e&&Math.round(e.ratio*100),'maxPen',d.maxPen.toFixed(3),'video',(d.tmap.length/d.vfps).toFixed(2)+'s',bad.length?'FAIL '+bad.join('; '):'PASS');process.exit(bad.length?1:0)
