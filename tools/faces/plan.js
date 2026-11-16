// tools/faces/plan.js — shared EYES + VOICE planner for every Tiny Chaos ball engine (Erkan 15 Nov 2026: faces = TWO EYES ONLY, no mouth).
// Runs once in node after the sim. It turns each ball's OWN situation into smooth expression channels, so the renderer (which draws
// any frame in any order, in parallel workers) just reads numbers. It also picks the few voice sounds (eep / oof / giggle / ooo).
//
// usage (in an engine adapter, see tools/black-hole/faces.js):
//   const {planFaces}=require('../faces/plan.js');
//   D.faces=planFaces({ffps:60,nFrames:D.frames.length,n:D.N,seed:D.seed,
//     sense:(f,i)=>({alive:true,threat:0..1,lx:dx,ly:dy,chase:0..1}),   // per frame f (sim time (f+1)/ffps), per ball i
//     events:[{t,b,type:'hit'|'out'|'win',v:0..1}],                      // hit = hard hit (v = strength), out = eliminated, win = winner
//     pitch:[...]});                                                     // optional voice pitch factor per ball (default by index)
//
// Output (compact, stored in data.js as D.faces):
//   fps      sample rate of the channels (ffps/2 = 30 Hz; the renderer interpolates)
//   ch[i]    flat array per ball, 7 numbers per sample: S scared, K hit/dizzy, A angry, J happy, Dd sad, lx, ly (pupil look -1..1)
//   blink[i] blink start times (s) per ball (random, never synchronised)
//   voices   [{t,b,kind:'eep'|'oof'|'giggle'|'ooo',pitch}] after the NEVER-NOISY limits:
//            at most 1 voice at a time, at most 2 starts in any 1 s window, out + win always kept, ordinary hits mostly silent.
// Each ball gets its own lag (0-90 ms) and its own rise/decay rates, so expressions never change in sync.
const VOICE_LEN={eep:.2,oof:.26,giggle:.62,ooo:.78};
function rng(seed){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function planFaces(o){
  const FF=o.ffps,NF=o.nFrames,N=o.n,rnd=rng((o.seed||1)*7919+13),EV=(o.events||[]).slice().sort((a,b)=>a.t-b.t);
  const STEP=Math.max(1,Math.round(FF/30)),fps=FF/STEP,dt=1/fps;
  const per=[...Array(N)].map(()=>({lag:Math.floor(rnd()*6),rs:.8+.4*rnd(),ds:.8+.4*rnd()}));
  const outT=Array(N).fill(Infinity);let winB=-1,winT=Infinity;
  for(const e of EV){if(e.type==='out')outT[e.b]=Math.min(outT[e.b],e.t);if(e.type==='win'){winB=e.b;winT=e.t}}
  const ch=[],blink=[];
  for(let i=0;i<N;i++){const P=per[i],arr=[];let S=0,K=0,A=0,J=0,Dd=0,lx=0,ly=0;
    const hits=EV.filter(e=>e.b===i&&e.type==='hit');let hp=0;
    for(let f=0;f<NF;f+=STEP){const t=(f+1)/FF,fl=Math.max(0,f-P.lag),s=o.sense(Math.min(NF-1,fl),i)||{},tl=(fl+1)/FF;
      const out=tl>=outT[i],won=i===winB&&tl>=winT;
      // targets from this ball's own situation
      const tS=out||won?0:cl(s.threat||0),tA=out||won?0:cl(s.chase||0),tJ=won?1:0,tD=out?1:0;
      // first-order smoothing, rise faster than decay (no flicker), per-ball rates
      const sm=(v,tg,rise,fall)=>v+(tg-v)*cl(dt*(tg>v?rise*P.rs:fall*P.ds));
      S=sm(S,tS,9,3.5);A=sm(A,tA,5,2.5);J=sm(J,tJ,6,3);Dd=sm(Dd,tD,10,2);
      // hard hits: impulse, held ~0.15 s then fades over ~0.45 s
      while(hp<hits.length&&hits[hp].t<=tl){K=Math.max(K,cl(.3+.62*(hits[hp].v||0)));hp++}
      K=Math.max(0,K-dt*(K>.7?1.2:2.6)*P.ds);if(out||won)K*=.8;
      // pupils look at the threat / rival (unit-ish vector), smoothed
      const L=Math.hypot(s.lx||0,s.ly||0),ux=L>1e-6?(s.lx||0)/L:0,uy=L>1e-6?(s.ly||0)/L:0,lk=cl(dt*7*P.rs);
      const wob=won?0:.18*Math.sin(t*(1.3+P.rs)+i*2.1);lx+=(ux+(L>1e-6?0:wob)-lx)*lk;ly+=(uy-ly)*lk;
      arr.push(+S.toFixed(2),+K.toFixed(2),+A.toFixed(2),+J.toFixed(2),+Dd.toFixed(2),+lx.toFixed(2),+ly.toFixed(2))}
    ch.push(arr);
    // blinks: every 2.2-5.5 s, own phase per ball; no blink while scared/hit (eyes stay wide)
    const bl=[];let bt=.6+rnd()*2.5;const END=NF/FF;while(bt<END){const k=Math.min(arr.length/7-1,Math.floor(bt*fps));if(arr[7*k]<.4&&arr[7*k+1]<.3&&bt<outT[i])bl.push(+bt.toFixed(3));bt+=2.2+rnd()*3.3}
    blink.push(bl)}
  // ---- voices ----
  const pitch=o.pitch||[...Array(N)].map((_,i)=>.88+.26*(N>1?i/(N-1):.5));
  const cand=[];
  for(const e of EV){if(e.type==='out')cand.push({t:e.t+.03,b:e.b,kind:'ooo',pr:3});else if(e.type==='win')cand.push({t:e.t+.12,b:e.b,kind:'giggle',pr:3});
    else if(e.type==='hit'&&(e.v||0)>=.75)cand.push({t:e.t+.02,b:e.b,kind:'oof',pr:1+(e.v||0)*.5})} // oof: hardest hits only, max one per 4 s
  // scared onset: S crosses .65 upward (own ball), at most once every 4 s per ball
  for(let i=0;i<N;i++){let last=-9,a=ch[i];for(let k=1;k<a.length/7;k++){const t=k/fps;if(a[7*k]>=.65&&a[7*(k-1)]<.65&&t-last>4&&t<outT[i]-.4){cand.push({t,b:i,kind:'eep',pr:1.2});last=t}}}
  cand.sort((a,b)=>b.pr-a.pr||a.t-b.t);const acc=[];
  const fits=c=>{const e=c.t+VOICE_LEN[c.kind];for(const a of acc){if(c.t<a.t+VOICE_LEN[a.kind]+.05&&a.t<e+.05)return false}
    const win=acc.filter(a=>Math.abs(a.t-c.t)<1).length;if(c.kind==='oof'&&acc.some(a=>a.kind==='oof'&&Math.abs(a.t-c.t)<4))return false;return win<2};
  for(const c0 of cand){const c={...c0};
    if(c.pr>=3){// out + win always: slide later (up to 1.2 s) until it fits
      let ok=false;for(let d=0;d<=1.2;d+=.02){c.t=c0.t+d;if(fits(c)){ok=true;break}}if(!ok){c.t=c0.t;/* force: drop lower-priority voices in the way */
        for(let k=acc.length-1;k>=0;k--)if(acc[k].pr<3&&Math.abs(acc[k].t-c.t)<1.1)acc.splice(k,1);let d=0;while(!fits(c)&&d<2){d+=.02;c.t=c0.t+d}}acc.push(c)}
    else if(fits(c)&&rnd()<(c.kind==='oof'?.6:.85))acc.push(c)}
  acc.sort((a,b)=>a.t-b.t);
  const voices=acc.map(a=>({t:+a.t.toFixed(3),b:a.b,kind:a.kind,pitch:+pitch[a.b].toFixed(3)}));
  return {fps,ch,blink,voices,step:STEP};
}
// headless check of the voice limits (used by engine check.js): returns [] when fine
function checkVoices(v){const bad=[];for(let i=0;i<v.length;i++){const a=v[i];if(i&&a.t<v[i-1].t+VOICE_LEN[v[i-1].kind])bad.push('voice overlap at '+a.t);
  if(v.filter(b=>b.t>=a.t&&b.t<a.t+1).length>2)bad.push('more than 2 voices in 1 s at '+a.t)}return bad}
module.exports={planFaces,checkVoices,VOICE_LEN};
