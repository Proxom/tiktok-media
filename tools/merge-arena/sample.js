const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));
await p.goto('file://'+__dirname+'/page.html');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
for(const t of process.argv.slice(3).map(Number)){const u=await p.evaluate(t=>draw(t),t);fs.writeFileSync(out+'/t'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'))}
await b.close();})();
