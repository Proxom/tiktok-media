// node preview.js <out-dir> t1 t2 ... -> single PNG frames at those video times (quick look before the full render)
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));
await p.goto('file://'+__dirname+'/page.html');const o=process.argv[2];fs.mkdirSync(o,{recursive:true});for(const s of process.argv.slice(3)){const u=await p.evaluate(t=>draw(t),+s);fs.writeFileSync(o+'/t'+s+'.jpg',Buffer.from(u.split(',')[1],'base64'))}await b.close()})();
