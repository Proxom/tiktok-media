// usage: node build.js <seed> <outdir>  -> writes anim.html, data.js, events.json
const S=require('./sim'),fs=require('fs');const [seed,out]=[+process.argv[2],process.argv[3]];fs.mkdirSync(out,{recursive:true});
const r=S.run(seed);const dur=Math.min(r.frames.length/30,r.finishT[r.order[0]]+4.5);
r.frames=r.frames.slice(0,Math.ceil(dur*30)+1);
r.geo={segs:S.segs,pegs:S.pegs,spinners:S.spinners,R:S.R,GATE_T:S.GATE_T,FINISH:S.FINISH};
fs.writeFileSync(out+'/data.js','const DATA='+JSON.stringify(r)+';');
fs.writeFileSync(out+'/events.json',JSON.stringify({events:r.events,gate:S.GATE_T,winT:r.finishT[r.order[0]],dur}));
fs.copyFileSync(__dirname+'/page.html',out+'/anim.html');console.log('dur',dur);
