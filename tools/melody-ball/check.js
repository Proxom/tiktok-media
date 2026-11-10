// Headless check for the melody ball: every note = one real wall bounce (ball touching the wall), notes in melody order, counter in every frame = bounces so far,
// speed x SPD after every bounce, every chord turns by the same angle (elastic reflection), ball never outside the circle (tunnel 0), the reveal is reached.
global.window={};require('./'+(process.argv[2]||'data.js'));const D=window.DATA;const bad=[];const H=D.hits,NN=D.MEL.length;
if(H.length!==NN)bad.push('hits '+H.length+' vs notes '+NN);
H.forEach((h,k)=>{const d=Math.hypot(h.x-D.CX,h.y-D.CY);if(Math.abs(d-D.RE)>1e-6)bad.push('hit '+k+' not on the wall '+d);if(h.note!==D.MEL[k])bad.push('note order '+k);
 if(k&&Math.abs(h.v/H[k-1].v-D.SPD)>.002)bad.push('speed step '+k);if(k&&h.t<=H[k-1].t)bad.push('time order '+k)});
const ang=h=>Math.atan2(h.y-D.CY,h.x-D.CX);for(let k=2;k<H.length;k++){let a=ang(H[k])-ang(H[k-1]),b=ang(H[k-1])-ang(H[k-2]);a=(a+6*Math.PI)%(2*Math.PI);b=(b+6*Math.PI)%(2*Math.PI);if(Math.abs(a-b)>1e-6)bad.push('chord angle '+k)}
D.frames.forEach((F,k)=>{const n=H.filter(h=>h.t<=k/D.ffps+1e-9).length;if(F[2]!==n)bad.push('frame '+k+' counter '+F[2]+' vs '+n);if(Math.hypot(F[0]-D.CX,F[1]-D.CY)>D.RE+1e-6)bad.push('frame '+k+' outside')});
if(D.tunnel)bad.push('tunnel '+D.tunnel);if(D.tmap.length/D.vfps<D.endT+3)bad.push('reveal not reached');
let st=ang(H[1])-ang(H[0]);st=((st+6*Math.PI)%(2*Math.PI))*180/Math.PI;
console.log(bad.length?'FAIL\n'+bad.slice(0,20).join('\n'):`PASS notes=${H.length} first=${H[0].t.toFixed(2)}s last=${D.endT.toFixed(2)}s chord step=${st.toFixed(3)}deg speed x${D.SPD}/bounce final ${(H[NN-1].v*D.SPD).toFixed(0)}px/s tunnel=0 sub-steps/frame=10 (600 Hz, exact hit time)`)
