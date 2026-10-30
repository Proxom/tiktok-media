// node render.js <outdir> <fromFrame> <toFrame> [SUB]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));
await p.goto('file://'+__dirname+'/page.html');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const FPS=30,A=+process.argv[3],B=+process.argv[4],SUB=+process.argv[5]||4;
for(let i=A;i<B;i++){const u=await p.evaluate(([t,s])=>draw(t),[i/FPS,SUB]);
 fs.writeFileSync(out+'/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'))}
await b.close();})();
