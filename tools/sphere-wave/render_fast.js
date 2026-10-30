const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:720,height:1280}});p.on('pageerror',e=>console.log(e));
await p.goto('file://'+__dirname+'/page.html');const out=process.argv[2]||'/tmp/sw/f';fs.mkdirSync(out,{recursive:true});
const FPS=30,T=+process.argv[3]||16,SUB=1,SH=1/FPS*0.5;const t0=Date.now();
const A=+process.argv[4]||0,B=+process.argv[5]||FPS*T;for(let i=A;i<B;i++){const u=await p.evaluate(([t,SUB,SH])=>{const c=document.getElementById('c');const a=document.createElement('canvas');a.width=c.width;a.height=c.height;const x=a.getContext('2d');
 for(let k=0;k<SUB;k++){draw(t+(k/SUB-0.5)*SH);x.globalAlpha=1/(k+1);x.drawImage(c,0,0);}return a.toDataURL('image/jpeg',0.93)},[i/FPS,SUB,SH]);
 fs.writeFileSync(out+'/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'));if(i==2)console.log('3 frames',(Date.now()-t0)/1000,'s');}
await b.close();})();
