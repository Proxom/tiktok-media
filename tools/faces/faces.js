// tools/faces/faces.js — the ONE channel eye style (Erkan 15 Nov 2026: TWO EYES ONLY, never a mouth). Browser + node.
// <script src="../faces/faces.js"></script> then, for ball i at sim time t, centre (x,y), radius r:
//   Faces.draw(ctx, D.faces, i, t, x, y, r, {lid:'hsl(...)', ffps:60, ey:-.08 /* eye height in r */, alpha:1})
// Emotion comes from the eyes alone (channels from plan.js):
//   calm   = slightly lowered upper lids, slow look-around      scared = big whites, small pupils, lids wide open
//   hit    = squeezed lids; only very hard hits give short wobbling X eyes   angry  = slanted lids (inner corners down)
//   happy  = curved ^ ^ eyes                                    sad    = drooping lids (inner corners up), pupils down
//   pupils look at the threat / rival; random blinks (own times per ball).
// Readability: ball diameter >= 40 px -> full eyes; 24-40 px -> simple eyes (white + pupil, scared size only); < 24 px -> nothing.
// The eyes sit in the upper middle of the ball and cover < 30 % of it, so the colour still identifies the ball.
(function(){
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),sst=(v,a,b)=>{v=cl((v-a)/(b-a));return v*v*(3-2*v)};
const INK='#120818';
function chan(F,i,t,ffps){const a=F.ch[i],n=a.length/7,step=F.step||1,k=cl((t*ffps-1)/step,0,n-1),k0=Math.floor(k),k1=Math.min(n-1,k0+1),u=k-k0,o=[];
  for(let j=0;j<7;j++)o.push(a[7*k0+j]+(a[7*k1+j]-a[7*k0+j])*u);return o}
function blinkAt(F,i,t){let b=0;for(const bt of F.blink[i]){const s=t-bt;if(s>0&&s<.17)b=Math.max(b,Math.sin(Math.PI*s/.17))}return b}
function draw(x,F,i,t,bx,by,r,opt){opt=opt||{};if(!F||2*r<24)return;const ffps=opt.ffps||60,al=opt.alpha==null?1:opt.alpha;
  let [S,K,A,J,Dd,lx,ly]=chan(F,i,t,ffps);const B=blinkAt(F,i,t),simple=2*r<40;
  ly=ly*(1-Dd)+.65*Dd;const xw=simple?0:sst(K,.66,.86),hw=simple?0:sst(J,.35,.75)*(1-xw),nw=1-xw-hw;
  const er=r*(2*r<70?.25:.22)*(1+.38*S-.08*Dd),ery=er*(1+.14*S);
  x.save();x.globalAlpha*=al;
  for(const sd of [-1,1]){const ex=bx+sd*r*.36+lx*r*.06,ey=by+r*(opt.ey==null?-.08:opt.ey)+ly*r*.05;
    if(nw>.01){x.save();x.globalAlpha*=nw;
      // white + soft outline
      x.fillStyle='#fff';x.beginPath();x.ellipse(ex,ey,er,ery,0,0,7);x.fill();
      x.lineWidth=Math.max(1,r*.025);x.strokeStyle='rgba(18,8,24,.55)';x.stroke();
      // pupil (shrinks when scared), looks at the threat; tiny highlight
      const pr=er*(.5-.2*S),px=ex+lx*(er-pr)*.8,py=ey+ly*(ery-pr)*.8;
      x.fillStyle=INK;x.beginPath();x.arc(px,py,pr,0,7);x.fill();
      if(!simple){x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(px-pr*.35,py-pr*.38,pr*.28,0,7);x.fill()}
      // upper lid: closure + slant (angry: inner corner down; sad: inner corner up)
      const lc=simple?B:cl(Math.max(B,.12-.14*S+.4*Dd+.6*K*(1-xw)+.28*A)),rot=simple?0:-sd*(A*.42-Dd*.34);
      if(lc>.02){x.save();x.beginPath();x.ellipse(ex,ey,er*1.02,ery*1.02,0,0,7);x.clip();x.translate(ex,ey);x.rotate(rot);
        const yl=-ery*1.3+ery*2.3*lc;x.fillStyle=opt.lid||'#555';x.fillRect(-er*1.6,-ery*1.8,er*3.2,yl+ery*1.8);
        x.strokeStyle='rgba(18,8,24,.8)';x.lineWidth=Math.max(1.2,er*.14);x.lineCap='round';x.beginPath();x.moveTo(-er*1.4,yl);x.lineTo(er*1.4,yl);x.stroke();x.restore()}
      x.restore()}
    if(xw>.01){// dizzy X, wobbling
      x.save();x.globalAlpha*=xw;x.translate(ex,ey);x.rotate(.25*Math.sin(t*22+i));x.strokeStyle=INK;x.lineCap='round';x.lineWidth=er*.34;const q=er*.72;
      x.beginPath();x.moveTo(-q,-q);x.lineTo(q,q);x.moveTo(q,-q);x.lineTo(-q,q);x.stroke();x.restore()}
    if(hw>.01){// happy ^ ^
      x.save();x.globalAlpha*=hw;x.translate(ex,ey);x.strokeStyle=INK;x.lineCap='round';x.lineJoin='round';x.lineWidth=er*.36;
      x.beginPath();x.moveTo(-er*.85,er*.3);x.quadraticCurveTo(0,-er*1.05,er*.85,er*.3);x.stroke();x.restore()}
  }
  x.restore()}
const api={draw,chan,blinkAt};
if(typeof window!=='undefined')window.Faces=api;if(typeof module!=='undefined')module.exports=api;
})();
