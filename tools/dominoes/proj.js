// node proj.js : print screen x / y(top) / y(base) of the next domino to fall, for camera tuning (PAGE env)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('file://'+__dirname+'/'+(process.env.PAGE||'page-grow.html'));
const ts=process.argv.slice(2).map(Number);for(const t of ts)console.log(t,JSON.stringify(await p.evaluate(t=>proj(t),t)));await b.close()})();
