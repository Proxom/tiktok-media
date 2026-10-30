const {chromium}=require('playwright');const fs=require('fs');const d='/tmp/lb';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+d+'/anim.html');fs.mkdirSync(d+'/f',{recursive:true});const n=16*30;
for(let i=0;i<n;i++){const u=await p.evaluate(t=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.9)},i/30);
fs.writeFileSync(d+'/f/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'));}await b.close()})();
