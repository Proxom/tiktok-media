// Headless gate for the marble elimination race (family C): every 'out' happens exactly when all other marbles still racing have passed that gate
// and the one that goes out has not; 5 outs, the winner is the only marble never out and it passed gate 5; rolling marbles are never inside a ramp,
// wall, peg or each other and stay on the board; lift marbles stay inside the glass tube; no tunnelling; the ending is reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];
const NAMES=['RED','ORANGE','YELLOW','GREEN','BLUE','PURPLE'];
const E=D.events,gates=E.filter(e=>e.type==='gate'),outs=E.filter(e=>e.type==='out');
if(outs.length!==D.N-1)bad.push('outs '+outs.length);
const lapsAt=(c,t)=>gates.filter(g=>g.m===c&&g.t<=t+1e-12).length;
const outT={};outs.forEach(o=>outT[o.m]=o.t);
outs.forEach((o,k)=>{if(o.gate!==k+1)bad.push('gate number '+k);const alive=[...Array(D.N).keys()].filter(c=>!(c in outT)||outT[c]>=o.t);
 alive.forEach(c=>{const L=lapsAt(c,o.t);if(c===o.m){if(L>=o.gate)bad.push(`out ${NAMES[c]} had passed gate ${o.gate}`)}else if(L<o.gate)bad.push(`${NAMES[c]} not through gate ${o.gate} when ${NAMES[o.m]} went out`)});
 if(o.left!==D.N-1-k)bad.push('left counter '+k);
 // the out is triggered by a gate pass at the same instant
 if(!gates.some(g=>Math.abs(g.t-o.t)<1e-12&&g.lap===o.gate))bad.push('out without a gate pass '+k)});
const never=[...Array(D.N).keys()].filter(c=>!(c in outT));if(never.length!==1||never[0]!==D.winner)bad.push('winner mismatch '+never+' vs '+D.winner);
if(lapsAt(D.winner,D.endT)<D.N-1)bad.push('winner did not pass gate 5');
if(Math.abs(outs[outs.length-1].t-D.endT)>1e-12)bad.push('endT');
gates.forEach(g=>{if(g.m in outT&&g.t>outT[g.m])bad.push('gate after out '+g.m)});
const cl=(s,px,py)=>{const ex=s[2]-s[0],ey=s[3]-s[1],u=Math.max(0,Math.min(1,((px-s[0])*ex+(py-s[1])*ey)/(ex*ex+ey*ey)));return Math.hypot(px-s[0]-ex*u,py-s[1]-ey*u)};
const SEGS=[D.RA,D.RC,[D.XL,640,D.XL,1210],[D.LXL,736,D.LXL,1296]];let worst=0;
D.frames.forEach((F,k)=>{const t=k/D.fps;const SPS=D.SPINS.map(S=>{const a=S.w*t,cs=Math.cos(a),sn=Math.sin(a);return[S.x-cs*S.L,S.y-sn*S.L,S.x+cs*S.L,S.y+sn*S.L]});
 F.forEach((q,i)=>{const c=D.order[i];if(q[2]===2&&!(c in outT&&outT[c]<=t+1e-9))bad.push(`frame ${k} ${NAMES[c]} shown out early`);if(q[2]!==2&&c in outT&&outT[c]<t-1e-9)bad.push(`frame ${k} ${NAMES[c]} still racing after out`);
  if(q[2]===0){const segs=t<D.TOPEN?[...SEGS,D.TRAP]:SEGS;for(const s of [...segs,...SPS]){const d=cl(s,q[0],q[1]);if(D.R+D.SW-d>worst)worst=D.R+D.SW-d;if(d<D.R+D.SW-1)bad.push(`frame ${k} ${NAMES[c]} inside a line`)}
   for(const p of D.PEGS)if(Math.hypot(q[0]-p[0],q[1]-p[1])<D.R+D.PR-1.5)bad.push(`frame ${k} ${NAMES[c]} inside a peg`);
   if(q[0]<D.XL+D.R-1||q[0]>D.LXR||q[1]<640||q[1]>1440)bad.push(`frame ${k} ${NAMES[c]} off the board`);
   F.forEach((o,j)=>{if(j>i&&o[2]===0&&Math.hypot(o[0]-q[0],o[1]-q[1])<2*D.R-3)bad.push(`frame ${k} marbles ${i}/${j} overlap`)})}
  if(q[2]===1&&(q[0]<D.LXL-30||q[0]>D.LXR-D.R+.5||q[1]<D.LIFT_TOP[1]-1||q[1]>1360))bad.push(`frame ${k} ${NAMES[c]} outside the lift`)})});
if(D.tunnel)bad.push('tunnel '+D.tunnel);{const vi=D.tmap.findIndex(v=>v>=D.endT);if(vi<0||(D.tmap.length-vi)/D.vfps<2.5)bad.push('ending not reached')}
console.log(bad.length?'FAIL\n'+[...new Set(bad)].slice(0,25).join('\n'):`PASS marbles=${D.N} gates=${gates.length} out order=${outs.map(o=>NAMES[o.m]).join(',')} winner=${NAMES[D.winner]} (first through gate 1: ${NAMES[D.firstGate1]}) duel gap=${D.lastGap.toFixed(0)}px maxPen line=${worst.toFixed(2)} peg=${D.maxPen.toFixed(2)} maxStep/r=${D.maxStep.toFixed(3)} tunnel=0 sub-steps/frame=10 (600 Hz)`)
