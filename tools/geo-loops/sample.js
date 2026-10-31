// node sample.js <outdir> t1 t2 ... : render single frames at given seconds (SUB=2) for review
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log(e));
await p.goto('file://'+__dirname+'/page.html?theme='+(process.env.THEME||'peach')+(process.env.L1?'&l1='+encodeURIComponent(process.env.L1):'')+(process.env.L2?'&l2='+encodeURIComponent(process.env.L2):''));const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
for(const ts of process.argv.slice(3)){const u=await p.evaluate(t=>frame(t,2),+ts);fs.writeFileSync(out+'/t'+ts+'.jpg',Buffer.from(u.split(',')[1],'base64'))}
await b.close()})();
