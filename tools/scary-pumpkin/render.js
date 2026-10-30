// node render.js <outdir> <fromFrame> <toFrame> [SUB]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));p.on('console',m=>console.log(m.text()));
await p.goto('file://'+__dirname+'/page.html');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const FPS=30,A=+process.argv[3],B=+process.argv[4],SUB=+process.argv[5]||1;const t0=Date.now();
for(let i=A;i<B;i++){const u=await p.evaluate(([t,s])=>frame(t,s),[i/FPS,SUB]);
 fs.writeFileSync(out+'/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'));if(i==A+2)console.log('3 frames',(Date.now()-t0)/1000,'s');}
await b.close();})();
