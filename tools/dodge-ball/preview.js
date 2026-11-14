// node preview.js <outdir> t1 t2 ... (video seconds) -> jpgs
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));p.on('console',m=>console.log(m.text()));
await p.goto('file://'+__dirname+'/page.html');const o=process.argv[2];fs.mkdirSync(o,{recursive:true});
for(const t of process.argv.slice(3)){const u=await p.evaluate(t=>draw(t),+t);fs.writeFileSync(o+'/p'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'))}await b.close()})();
