// Headless HARD GATE logic check for a "wall heals" episode (AGENT.md §5.2): node check.js [data.js]
// zero tunnelling, hit counter == logged hits, every hit costs exactly 1 HP, a brick breaks only at 0 HP, a hole grows back only
// after HEAL s at full HP, 3 rings broken in order, one escape, escape point in frame/safe, ball fully in frame, ending reached.
global.window={};require(require('path').resolve(process.argv[2]||__dirname+'/data.js'));const d=window.DATA,bad=[];
const ev=d.events,hits=ev.filter(e=>e.type==='hit'),rings=ev.filter(e=>e.type==='ring'),es=ev.filter(e=>e.type==='escape');
if(!(d.maxPen<1))bad.push('maxPen '+d.maxPen);if(d.deep!==0)bad.push('ball centre inside a brick '+d.deep);
const hp=d.RS.map((_,L)=>new Array(d.NS[L]).fill(d.HPS[L])),bt=d.RS.map((_,L)=>new Array(d.NS[L]).fill(-1));let L=0,n=0;
for(const e of ev){if(e.type==='hit'){n++;if(e.n!==n)bad.push('hit count '+n);if(e.L!==L)bad.push('hit on a non-active ring');if(hp[e.L][e.i]<=0)bad.push('hit on a hole');hp[e.L][e.i]--;if(e.hp!==hp[e.L][e.i])bad.push('hp '+n);if(e.brk!==(hp[e.L][e.i]===0))bad.push('break flag '+n);if(e.brk)bt[e.L][e.i]=e.t}
 else if(e.type==='heal'){if(hp[e.L][e.i]!==0)bad.push('heal of intact brick');if(e.t-bt[e.L][e.i]<d.HEAL-1e-9)bad.push('healed too early');hp[e.L][e.i]=d.HPS[e.L]}
 else if(e.type==='ring'){if(e.L!==L)bad.push('ring order');if(!hp[L].some(v=>v===0))bad.push('ring passed with no hole');L++}}
if(rings.length!==3)bad.push('rings '+rings.length);if(es.length!==1)bad.push('escapes '+es.length);const e=es[0];
if(e){if(e.n!==hits.length)bad.push('HITS shown != logged hits');if(e.x-d.R0<60||e.x+d.R0>930||e.y-d.R0<640)bad.push('escape outside frame/safe');if(hits.some(h=>h.t>e.t))bad.push('hit after escape')}
// hpLog (what is drawn) matches the replayed state at each event
const FF=60;for(const q of hits.concat(ev.filter(e=>e.type==='heal'))){const k=Math.min(d.hpLog.length-1,Math.ceil(q.t*FF)+1);const s=d.hpLog[k].split('|')[q.L];if(q.type==='hit'&&+s[q.i]>q.hp&&!ev.some(h=>h.type==='heal'&&h.L===q.L&&h.i===q.i&&h.t>q.t&&h.t<=(k+1)/FF))bad.push('drawn hp lags at '+q.t.toFixed(2))}
const R0=d.R0;if(d.frames.some(f=>f[2]===0&&(f[0]-R0<0||f[0]+R0>1080||f[1]-R0<0||f[1]+R0>1920)))bad.push('ball out of frame before escape');
if(d.frames.some(f=>f[2]===1&&f[1]-R0<=1920&&(f[0]-R0<0||f[0]+R0>1080)))bad.push('escaped ball leaves through a side edge');
const last=d.frames[d.frames.length-1];if(!(last[2]===1&&last[1]>1920+R0))bad.push('ending not reached');
console.log('hits',hits.length,'breaks',hits.filter(h=>h.brk).length,'heals',ev.filter(e=>e.type==='heal').length,'rings',rings.map(r=>r.t.toFixed(2)).join(','),'maxPen',d.maxPen.toFixed(3),'video',(d.tmap.length/d.vfps).toFixed(2)+'s',bad.length?'FAIL '+bad.join('; '):'PASS');process.exit(bad.length?1:0)
