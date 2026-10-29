// usage: node render.js <dir>  (dir from build.js) -> <dir>/f/%04d.jpg
const {chromium}=require('playwright');const fs=require('fs');const d=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+d+'/anim.html');fs.mkdirSync(d+'/f',{recursive:true});
const T=await p.evaluate(()=>DURATION);const n=Math.floor(T*30);
for(let i=0;i<n;i++){const u=await p.evaluate(t=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.9)},i/30);
fs.writeFileSync(d+'/f/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'));}
console.log('frames',n);await b.close()})();
