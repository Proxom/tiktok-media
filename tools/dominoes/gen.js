// Format 3 dominoes: generates the layout + exact topple times (shared by page.html and audio.py).
// node gen.js <out.js> [N] -> window.DATA={N,pos:[[x,z,tx,tz]],t:[start times],D:fall duration,tEnd}
const fs=require('fs');const OUT=process.argv[2]||'data.js',N=+process.argv[3]||110;
const S=.5,B=.19,R0=1.2; // spacing along the path, spiral arm pitch per radian, start radius
let th=0,pts=[];let arc=0,prev=[R0*Math.cos(0),R0*Math.sin(0)];
for(let i=0;i<N;i++){ // march along the spiral so consecutive dominoes are S apart
 let step=.001,p;while(true){const r=R0+B*th;p=[r*Math.cos(th),r*Math.sin(th)];if(Math.hypot(p[0]-prev[0],p[1]-prev[1])>=S)break;th+=step}
 pts.push(p);prev=p}
const pos=pts.map((p,i)=>{const q=pts[Math.min(N-1,i+1)],o=pts[Math.max(0,i-1)];let tx=q[0]-o[0],tz=q[1]-o[1];const l=Math.hypot(tx,tz);return[+p[0].toFixed(3),+p[1].toFixed(3),+(tx/l).toFixed(4),+(tz/l).toFixed(4)]});
// CONTACT-BASED TIMING (1 Nov fix: dominoes used to start falling before the previous one touched them).
// Domino i pivots on its front bottom edge; its top front corner reaches the back face of domino i+1 when
// sin(theta_c)=(S-DT)/DH. page.html angle model: ang=FINAL*u^2.1 (FINAL 72deg, u=(t-t_i)/D), so domino i+1 may start
// ONLY when u_c=(theta_c/FINAL)^(1/2.1) of domino i's fall has passed. Never use a fixed time step.
const DH=1.0,DT=.13,FINAL=72*Math.PI/180,D=.42;
const thc=Math.asin(Math.min(.95,(S-DT)/DH)),uc=Math.pow(thc/FINAL,1/2.1),HOLD=+process.env.HOLD||1.0; // HOLD>1 = slower chain
const t=[];let tt=.7;
for(let i=0;i<N;i++){t.push(+tt.toFixed(4));tt+=uc*D*HOLD}
console.log('contact angle deg',(thc*180/Math.PI).toFixed(1),'u_c',uc.toFixed(3),'interval s',(uc*D*HOLD).toFixed(3));
const out={N,pos,t,D,tEnd:t[N-1]+.5,rmax:Math.hypot(...pts[N-1])};
console.log('N',N,'rmax',out.rmax.toFixed(2),'end',out.tEnd.toFixed(1));
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(out)+';\n');
