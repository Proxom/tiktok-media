// Headless gate for plinko (family D): every dropped ball lands exactly once; the live counters (land events) equal the balls resting in each bin
// at the end (final positions); the winner shown is the bin with the most balls and there is no tie; no tunnelling; no ball inside a peg/wall; ending reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];
const binOf=x=>x<D.DIVS[0]?0:x<D.DIVS[1]?1:x<D.DIVS[2]?2:3;
const lands=D.events.filter(e=>e.type==='land'),drops=D.events.filter(e=>e.type==='drop');
if(drops.length!==D.NB)bad.push('drops '+drops.length);if(lands.length!==D.NB)bad.push('lands '+lands.length);
if(new Set(lands.map(e=>e.ball)).size!==D.NB)bad.push('a ball landed twice');
const last=D.frames[D.frames.length-1],fin=[0,0,0,0];last.forEach((q,i)=>{const b=binOf(q[0]);fin[b]++;if(b!==D.binOfBall[i])bad.push('ball '+i+' rests in '+b+' but counted for '+D.binOfBall[i]);if(q[1]<D.BT)bad.push('ball '+i+' not in a bin')});
const ev=[0,0,0,0];lands.forEach(e=>ev[e.bin]++);if(ev.join()!==fin.join()||ev.join()!==D.cnt.join())bad.push('counts events '+ev+' final '+fin+' shown '+D.cnt);
lands.forEach((e,k)=>{const c=[0,0,0,0];lands.slice(0,k+1).forEach(q=>c[q.bin]++);if(c.join()!==e.c.join())bad.push('running counter wrong at land '+k)});
const mx=Math.max(...fin);if(fin.filter(v=>v===mx).length!==1||fin.indexOf(mx)!==D.win)bad.push('winner mismatch '+fin+' vs '+D.win);
D.frames.forEach((F,k)=>F.forEach((q,i)=>{if(q[0]<D.XL+D.R-.6||q[0]>D.XR-D.R+.6||q[1]>D.FL-D.R+.6)bad.push(`frame ${k} ball ${i} in a wall`);
 for(const p of D.PEGS)if(Math.hypot(q[0]-p[0],q[1]-p[1])<D.R+D.PR-2)bad.push(`frame ${k} ball ${i} inside a peg`)}));
if(D.tunnel)bad.push('tunnel '+D.tunnel);{const vi=D.tmap.findIndex(v=>v>=D.endT);if(vi<0||(D.tmap.length-vi)/D.vfps<2)bad.push('ending not reached')}
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS balls=${D.NB} counts=${fin.join('/')} winner=${['RED','BLUE','YELLOW','GREEN'][D.win]} margin=${D.margin} leadChanges=${D.changes} lastDecides=${D.lastDecides} pegHits=${D.events.filter(e=>e.type==='peg').length} maxPen=${D.maxPen.toFixed(2)} maxStep/r=${D.maxStep.toFixed(3)} tunnel=0 sub-steps/frame=10 (600 Hz)`)
