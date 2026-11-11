// Headless gate for the marble disaster race (17:00 1M+ #4, family C): the winner is the FIRST marble to pass the gate LAPS times and endT is that pass;
// no other marble had LAPS passes before it; 'lead' events = every time the lap leader count goes up; disaster k fires exactly at the first pass of lap k
// (k < LAPS), and the physics switches at that moment (paddles reverse x2, wind, quake kicks only after disaster 3, gravity after 4); rolling marbles are
// never inside a ramp, wall, peg, paddle or each other and stay on the board; lift marbles stay in the glass tube; no tunnelling; the ending is reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];
const NAMES=['RED','ORANGE','YELLOW','GREEN','BLUE','PURPLE'];
const E=D.events,gates=E.filter(e=>e.type==='gate'),leads=E.filter(e=>e.type==='lead'),dis=E.filter(e=>e.type==='disaster'),quakes=E.filter(e=>e.type==='quake');
const lapsAt=(c,t)=>gates.filter(g=>g.m===c&&g.t<=t+1e-12).length;
// winner
const first=gates.find(g=>g.lap===D.LAPS);if(!first||first.m!==D.winner||Math.abs(first.t-D.endT)>1e-12)bad.push('winner / endT mismatch');
for(let c=0;c<D.N;c++)if(c!==D.winner&&lapsAt(c,D.endT)>=D.LAPS)bad.push('another marble finished first '+NAMES[c]);
// leads + disasters
for(let k=1;k<=D.LAPS;k++){const g=gates.find(g=>g.lap===k),l=leads.find(e=>e.lap===k);if(!g||!l||l.m!==g.m||Math.abs(l.t-g.t)>1e-12)bad.push('lead '+k);
 if(k<D.LAPS){const d=dis.find(e=>e.k===k);if(!d||Math.abs(d.t-g.t)>1e-12||d.by!==g.m)bad.push('disaster '+k+' not at the first pass of lap '+k)}}
if(dis.length!==Math.min(4,D.LAPS-1))bad.push('disaster count '+dis.length);
const d1=dis.find(e=>e.k===1),d3=dis.find(e=>e.k===3);
// paddles: angle rate before/after disaster 1
D.SPINS.forEach((S,j)=>{for(let k=1;k<D.spinA.length;k++){const t=k/D.fps,w=(D.spinA[k][j]-D.spinA[k-1][j])*D.fps,exp=t<=d1.t?S.w:t-1/D.fps>=d1.t?-2*S.w:null;if(exp!==null&&Math.abs(w-exp)>1e-2)bad.push('paddle '+j+' rate at frame '+k)}});
if(quakes.length&&quakes[0].t<d3.t-1e-12)bad.push('quake before disaster 3');
const cl=(s,px,py)=>{const ex=s[2]-s[0],ey=s[3]-s[1],u=Math.max(0,Math.min(1,((px-s[0])*ex+(py-s[1])*ey)/(ex*ex+ey*ey)));return Math.hypot(px-s[0]-ex*u,py-s[1]-ey*u)};
const SEGS=[D.RA,D.RC,[D.XL,640,D.XL,1210],[D.LXL,736,D.LXL,1296]];let worst=0;
D.frames.forEach((F,k)=>{const t=k/D.fps;const SPS=D.SPINS.map((S,j)=>{const a=D.spinA[k][j],cs=Math.cos(a),sn=Math.sin(a);return[S.x-cs*S.L,S.y-sn*S.L,S.x+cs*S.L,S.y+sn*S.L]});
 F.forEach((q,i)=>{const c=D.order[i];
  if(q[2]===0){const segs=t<D.TOPEN?[...SEGS,D.TRAP]:SEGS;for(const s of [...segs,...SPS]){const d=cl(s,q[0],q[1]);if(D.R+D.SW-d>worst)worst=D.R+D.SW-d;if(d<D.R+D.SW-1)bad.push(`frame ${k} ${NAMES[c]} inside a line`)}
   for(const p of D.PEGS)if(Math.hypot(q[0]-p[0],q[1]-p[1])<D.R+D.PR-1.5)bad.push(`frame ${k} ${NAMES[c]} inside a peg`);
   if(q[0]<D.XL+D.R-1||q[0]>D.LXR||q[1]<640||q[1]>1440)bad.push(`frame ${k} ${NAMES[c]} off the board`);
   F.forEach((o,j)=>{if(j>i&&o[2]===0&&Math.hypot(o[0]-q[0],o[1]-q[1])<2*D.R-3)bad.push(`frame ${k} marbles ${i}/${j} overlap`)})}
  if(q[2]===1&&(q[0]<D.LXL-30||q[0]>D.LXR-D.R+.5||q[1]<D.LIFT_TOP[1]-1||q[1]>1360))bad.push(`frame ${k} ${NAMES[c]} outside the lift`)})});
if(D.tunnel)bad.push('tunnel '+D.tunnel);{const vi=D.tmap.findIndex(v=>v>=D.endT);if(vi<0||(D.tmap.length-vi)/D.vfps<2.5)bad.push('ending not reached')}
console.log(bad.length?'FAIL\n'+[...new Set(bad)].slice(0,25).join('\n'):`PASS marbles=${D.N} laps=${D.LAPS} gates=${gates.length} leaders=${leads.map(l=>NAMES[l.m]).join(',')} disasters at ${dis.map(d=>d.t.toFixed(2)).join(',')} quakes=${quakes.length} winner=${NAMES[D.winner]} runner-up=${NAMES[D.runnerUp]} gap=${D.lastGap.toFixed(0)}px maxPen line=${worst.toFixed(2)} peg=${D.maxPen.toFixed(2)} maxStep/r=${D.maxStep.toFixed(3)} tunnel=0 sub-steps/frame=10 (600 Hz)`)
