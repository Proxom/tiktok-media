// S5 marble run: deterministic 2D physics of one marble on a wall course (planks, bells, pins) down to a FINISH cup.
// node sim.js <out.js> [seed]  -> window.DATA={pieces, frames:[[x,y,rot]], hits:[{t,kind,id,v}], finish}
const fs=require('fs');
const OUT=process.argv[2]||'data.js',SEED=+process.argv[3]||1;
const FPS=30,SUB=24,DT=1/(FPS*SUB),G=1500,BR=13,TMAX=40;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function build(seed){
 const rnd=rng(seed),P=[];let y=60,dir=1,x=-260;const COL=['#ffbe0b','#06a77d','#ff4d3d','#7b2cbf','#1f7ae0','#ff8500','#00b4d8','#e5007e'];
 let ci=0;const N=11;
 for(let i=0;i<N;i++){
  const L=290+rnd()*70,tilt=(.17+rnd()*.07),dx=Math.cos(tilt)*L*dir,dy=Math.sin(tilt)*L;
  const x1=x,y1=y,x2=x+dx,y2=y+dy;P.push({type:'plank',x1,y1,x2,y2,r:8,col:COL[ci++%COL.length],e:.25});
  // metal deflector past the drop point: catches the marble, rings, sends it back onto the next plank
  if(i<N-1){const wx=x2+dir*(150+rnd()*30);P.push({type:'bell',x1:wx+dir*12,y1:y2-50,x2:wx,y2:y2+120,r:7,col:'#d9dde3',e:.45});
   if(i%3===1)P.push({type:'pin',x:x2+dir*70,y:y2+60,r:7,col:'#ffffff',e:.5});
   x=wx-dir*20;y=y2+175;}
  dir=-dir;
 }
 // finish cup under the last drop
 const last=P.filter(p=>p.type==='plank').pop(),cx=last.x2+Math.sign(last.x2-last.x1)*70,cy=last.y2+200;
 P.push({type:'cupL',x1:cx-70,y1:cy-90,x2:cx-48,y2:cy,r:7,col:'#ffffff',e:.2},{type:'cupB',x1:cx-48,y1:cy,x2:cx+48,y2:cy,r:7,col:'#ffffff',e:.1},{type:'cupR',x1:cx+48,y1:cy,x2:cx+70,y2:cy-90,r:7,col:'#ffffff',e:.2});
 return{P,start:{x:-260+14,y:60-BR-9},cup:{x:cx,y:cy}};
}
function closest(px,py,x1,y1,x2,y2){const vx=x2-x1,vy=y2-y1,l=vx*vx+vy*vy;let u=((px-x1)*vx+(py-y1)*vy)/l;u=Math.max(0,Math.min(1,u));return[x1+u*vx,y1+u*vy]}
function run(seed){
 const {P,start,cup}=build(seed);let bx=start.x,by=start.y,vx=40,vy=0,rot=0,t=0;const frames=[],hits=[];const lastHit={};let finish=null,still=0,contact=0;
 for(let f=0;f<FPS*TMAX;f++){
  contact=0;for(let s=0;s<SUB;s++){t+=DT;vy+=G*DT;bx+=vx*DT;by+=vy*DT;
   P.forEach((p,id)=>{let cx,cy;if(p.type==='pin'){cx=p.x;cy=p.y}else[cx,cy]=closest(bx,by,p.x1,p.y1,p.x2,p.y2);
    const dx=bx-cx,dy=by-cy,d=Math.hypot(dx,dy)||1e-6,ov=BR+p.r-d;if(ov<=0)return;const nx=dx/d,ny=dy/d;bx+=nx*ov;by+=ny*ov;contact=1;
    const vn=vx*nx+vy*ny;if(vn<0){vx-=(1+p.e)*vn*nx;vy-=(1+p.e)*vn*ny;const tx=-ny,ty=nx,vt=vx*tx+vy*ty;vx-=.0015*vt*tx;vy-=.0015*vt*ty;
     if(-vn>110&&(t-(lastHit[id]||-1))>.12){hits.push({t,id,kind:p.type,v:-vn,x:bx,y:by});}lastHit[id]=t}});
   rot+=vx*DT/BR;
  }
  frames.push([Math.round(bx*10)/10,Math.round(by*10)/10,Math.round(rot*100)/100,contact,Math.round(Math.hypot(vx,vy))]);
  if(finish===null&&Math.abs(bx-cup.x)<50&&by>cup.y-40&&Math.hypot(vx,vy)<60){finish=t}
  if(Math.hypot(vx,vy)<8)still++;else still=0;
  if(finish===null&&still>45)return{fail:'stuck',t,x:bx,y:by};
  if(by>cup.y+400)return{fail:'fell',t,x:bx,pieces:P,frames,hits,cup};
  if(finish!==null&&t>finish+2.5)break;
 }
 if(finish===null)return{fail:'timeout'};
 return{pieces:P,frames,hits,finish,cup,fps:FPS,BR,seed};
}
let res,log=[];for(let s=SEED;s<SEED+300;s++){res=run(s);log.push(s+':'+(res.fail||res.finish.toFixed(1)));if(!res.fail&&res.finish>14&&res.finish<30)break;res=null}
if(!res){console.log(log.slice(0,30).join(' '));if(process.env.DEBUG){fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(run(SEED))+';\n')}process.exit(1)}
console.log('seed',res.seed,'finish',res.finish.toFixed(2),'hits',res.hits.length,'frames',res.frames.length);
fs.writeFileSync(OUT,'window.DATA='+JSON.stringify(res)+';\n');
