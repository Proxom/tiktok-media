// Runs 4 real sorting algorithms on the same shuffled data and records the array + highlighted indices after every comparison.
const fs=require('fs');const N=40;let seed=+process.argv[2]||5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const base=[...Array(N)].map((_,i)=>i+1);for(let i=N-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[base[i],base[j]]=[base[j],base[i]]}
function rec(){const a=base.slice(),log=[];const cmp=(i,j)=>{log.push({a:a.slice(),h:[i,j]});return a[i]>a[j]};return {a,log,cmp}}
const algos={};
{const {a,log,cmp}=rec();for(let i=0;i<N;i++)for(let j=0;j<N-1-i;j++)if(cmp(j,j+1))[a[j],a[j+1]]=[a[j+1],a[j]];log.push({a:a.slice(),h:[]});algos.BUBBLE=log}
{const {a,log,cmp}=rec();for(let i=1;i<N;i++){let j=i;while(j>0&&cmp(j-1,j)){[a[j-1],a[j]]=[a[j],a[j-1]];j--}}log.push({a:a.slice(),h:[]});algos.INSERTION=log}
{const {a,log}=rec();function ms(l,r){if(r-l<1)return;const m=(l+r)>>1;ms(l,m);ms(m+1,r);const tmp=[];let i=l,j=m+1;while(i<=m&&j<=r){log.push({a:a.slice(),h:[i,j]});if(a[i]<=a[j])tmp.push(a[i++]);else tmp.push(a[j++])}while(i<=m)tmp.push(a[i++]);while(j<=r)tmp.push(a[j++]);for(let k=0;k<tmp.length;k++)a[l+k]=tmp[k]}ms(0,N-1);log.push({a:a.slice(),h:[]});algos.MERGE=log}
{const {a,log}=rec();function qs(l,r){if(l>=r)return;const p=a[r];let i=l;for(let j=l;j<r;j++){log.push({a:a.slice(),h:[j,r]});if(a[j]<p){[a[i],a[j]]=[a[j],a[i]];i++}}[a[i],a[r]]=[a[r],a[i]];qs(l,i-1);qs(i+1,r)}qs(0,N-1);log.push({a:a.slice(),h:[]});algos.QUICK=log}
for(const k in algos)console.log(k,algos[k].length);
fs.writeFileSync(__dirname+'/data.js','const DATA='+JSON.stringify({N,algos})+';');
