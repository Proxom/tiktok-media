// "Melody ball" (17:00 1M+ list #1, our version): ONE ball bounces inside ONE closed circle with NO gravity.
// RULES (exactly what the code does): every wall bounce plays the NEXT note of a public-domain melody (Beethoven, "Für Elise", own arrangement)
// and makes the ball 4% faster (SPD). Elastic reflection on the circle, so every chord between two bounces has the same length and turns by the same
// angle STEP (a little more than 144° = a 5-point star) -> the path slowly turns while it draws. When the last note has played, the drawing is revealed.
// Fixed timestep 600 Hz (10 sub-steps per 60 fps frame) with an exact (continuous) wall-hit time inside each sub-step: zero tunnelling by construction, logged.
// frames[k] = state at sim time k/60. node sim.js <out.js>  (env STEP deg, V0, SPD, NOTES, TAIL, PRE)
const fs=require('fs');const OUT=process.argv[2]||'data.js';
const FPS=60,SUB=10,DT=1/(FPS*SUB),CX=495,CY=1035,R=395,HT=9,BR=19,RE=R-HT-BR;
const STEP=(+process.env.STEP||146.0)*Math.PI/180,V0=+process.env.V0||520,SPD=+process.env.SPD||1.04,TAIL=+process.env.TAIL||5.2;
const MEL=(process.env.MEL||'E4 D#4 E4 D#4 E4 B3 D4 C4 A3 C3 E3 A3 B3 E3 G#3 B3 C4 E3 E4 D#4 E4 D#4 E4 B3 D4 C4 A3 C3 E3 A3 B3 E3 C4 B3 A3').split(' ');
const NN=+process.env.NOTES||MEL.length;
// start on the first chord (half-way along it) so the first note comes after ~0.7 s
const a0=-Math.PI/2-STEP/2,a1=a0+STEP;const P0=[CX+RE*Math.cos(a0),CY+RE*Math.sin(a0)],P1=[CX+RE*Math.cos(a1),CY+RE*Math.sin(a1)];
const chord=Math.hypot(P1[0]-P0[0],P1[1]-P0[1]);let x=(P0[0]+P1[0])/2,y=(P0[1]+P1[1])/2,vx=(P1[0]-P0[0])/chord*V0,vy=(P1[1]-P0[1])/chord*V0;
const frames=[],hits=[];let t=0,tunnel=0,maxOut=0,endT=null,v=V0;
frames.push([+x.toFixed(2),+y.toFixed(2),0]);
for(let f=1;f<FPS*90;f++){
 for(let s=0;s<SUB;s++){let left=DT;
  while(left>1e-12){
   // exact time to reach |p - c| = RE along the straight line (only if the ball has notes left; after the last note it keeps bouncing silently)
   const px=x-CX,py=y-CY,A=vx*vx+vy*vy,B=2*(px*vx+py*vy),C=px*px+py*py-RE*RE,disc=B*B-4*A*C,th=(-B+Math.sqrt(Math.max(0,disc)))/(2*A);
   if(th>left){x+=vx*left;y+=vy*left;t+=left;left=0;break}
   x+=vx*th;y+=vy*th;t+=th;left-=th;const nx=(x-CX)/RE,ny=(y-CY)/RE,vn=vx*nx+vy*ny;vx-=2*vn*nx;vy-=2*vn*ny;
   if(hits.length<NN){const k=hits.length;hits.push({t,x,y,k,note:MEL[k],v:+v.toFixed(1)});v*=SPD;vx*=SPD;vy*=SPD;if(hits.length===NN)endT=t}
  }
  const d=Math.hypot(x-CX,y-CY);if(d>RE+1e-6){tunnel++;maxOut=Math.max(maxOut,d-RE)}
 }
 frames.push([+x.toFixed(2),+y.toFixed(2),hits.length]);
 if(endT!==null&&t>endT+TAIL)break;
}
const res={CX,CY,R,HT,BR,RE,STEP:STEP*180/Math.PI,V0,SPD,MEL:MEL.slice(0,NN),hits,frames,endT,tunnel,maxOut,ffps:FPS,vfps:60};
// video time map: real time, with a short ease into slow motion is not needed (no single decisive frame); the reveal starts at endT
res.tmap=[];for(let k=0;k<frames.length-1;k++)res.tmap.push(+(k/FPS).toFixed(4));
if(process.env.GAME)res.game=+process.env.GAME;if(process.env.FOLLOWTEXT)res.followText=process.env.FOLLOWTEXT;
console.log('notes',hits.length,'endT',endT&&endT.toFixed(2),'first note',hits[0].t.toFixed(2),'last gap',(hits[NN-1].t-hits[NN-2].t).toFixed(3),'final speed',v.toFixed(0),'video',(res.tmap.length/60).toFixed(2),'reveal at',(endT/(res.tmap.length/60)*100).toFixed(1)+'%','tunnel',tunnel,'maxStep px',(v*DT).toFixed(2));
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
