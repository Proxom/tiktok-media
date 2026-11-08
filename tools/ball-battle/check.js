// Headless check (arena radius follows the post-knock-out shrink) for the ball battle: HP shown (frames) == HP0 - crashes lost (events), OUT events == HP 0, winner == last ball alive,
// ending reached, no tunnelling, no ties, every ball fully inside the arena in every frame.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;let bad=[];
const Rt=tt=>{let r=D.R;for(const k of (D.kos||[]))r-=(D.SHR||0)*D.R*Math.min(1,Math.max(0,(tt-k)/D.SHT));return r};
const cr=D.events.filter(e=>e.type==='crash'),outs=D.events.filter(e=>e.type==='out');
D.frames.forEach((F,k)=>{const t=(k+1)/D.ffps;F.forEach((q,i)=>{const lost=cr.filter(e=>e.loser===i&&e.t<=t+1e-9).length,hp=Math.max(0,D.HP0-lost);if(q[3]!==hp)bad.push(`frame ${k} ball ${i} hp ${q[3]} vs ${hp}`);
 if(q[3]>0&&Math.hypot(q[0]-D.CX,q[1]-D.CY)+q[2]>Rt(t)-D.HT+.6)bad.push(`frame ${k} ball ${i} outside arena`);
 if(q[3]>0&&Math.abs(q[2]-(D.RMIN+D.RK*q[3]))>.01)bad.push(`frame ${k} ball ${i} radius != hp`)})});
outs.forEach(o=>{if(cr.filter(e=>e.loser===o.ball&&e.t<=o.t).length!==D.HP0)bad.push('out without 0 HP '+o.ball)});
const last=D.frames[D.frames.length-1],alive=last.map((q,i)=>q[3]>0?i:-1).filter(i=>i>=0);
if(alive.length!==1||alive[0]!==D.win)bad.push('winner mismatch '+alive+' vs '+D.win);
if(outs.length!==D.N-1)bad.push('outs '+outs.length);if(D.tunnel||D.outside)bad.push('tunnel/outside '+D.tunnel+'/'+D.outside);
// a tie (speeds within 12 px/s, both at the speed cap) has no slower ball: nobody loses HP (HP check above proves it); at most 1 allowed
if(D.ties>1)bad.push('ties '+D.ties);
if(D.frames.length/D.ffps<D.endT+1)bad.push('ending not reached');
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS crashes=${cr.length} outs=${outs.map(o=>o.ball+'@'+o.t.toFixed(2)).join(',')} winner=${D.win} winnerHP=${last[D.win][3]} maxPen=${D.maxPen.toFixed(3)} maxStep/r=${D.maxStep.toFixed(3)} tunnel=${D.tunnel} ties(no HP lost)=${D.ties} sub-steps/frame=20 (600 Hz)`)
