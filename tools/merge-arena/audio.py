# Original audio for the merge arena: built from the simulation's events (data.js), so every sound lands on its frame.
# drop = soft tick, collision = woody tap scaled by impact speed, merge = bubbly pop pitched up the scale by tier,
# new tier reached = bell, final = riser into a big chord + shimmer. Soft pad + pulse underneath.
# python3 audio.py data.js out.wav [T0]
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
T0=float(sys.argv[3]) if len(sys.argv)>3 else 2.0
SR=44100;FIN=d['final'];D=len(d['frames'])/d['fps']-T0;n=int(SR*D);t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(7)
def add(t0,sig,g=1.0):
    t0-=T0
    if t0<0:sig=sig[int(-t0*SR):];t0=0
    i=int(t0*SR);m=min(n-i,len(sig))
    if m>0:out[i:i+m]+=g*sig[:m]
def env(m,a=.002,dec=10):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def lp(x,k):return np.convolve(x,np.ones(k)/k,'same')
SCALE=[261.6,293.7,329.6,392.0,440.0,523.3,587.3,659.3,784.0,880.0,1046.5]
def tone(f,dur,amp,dec,harm=(1,.3,.1)):
    m=int(SR*dur);tt,e=env(m,.002,dec);return amp*e*sum(h*np.sin(2*np.pi*f*(i+1)*tt) for i,h in enumerate(harm))
# bed: soft pad on the scale root + gentle 100 bpm pulse
pad=sum(np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.15*t)) for f in [130.8,196.0,261.6])*.012
out+=pad+.004*lp(rng.standard_normal(n),80)
for b in np.arange(0,D,.6):
    m=int(SR*.25);tt,e=env(m,.003,14);add(b+T0,.05*np.sin(2*np.pi*(55+30*np.exp(-tt*30))*tt)*e)
seen=set();hits=0;last_hit=-1
for e in d['events']:
    ty=e['type'];te=e['t']
    if ty=='drop':
        m=int(SR*.05);tt,ee=env(m,.0008,60);add(te,.05*np.sin(2*np.pi*1800*tt)*ee)
    elif ty in('hit','wall'):
        if te-last_hit<.03:continue
        last_hit=te;v=min(1,(e['v']-260)/900)
        m=int(SR*.08);tt,ee=env(m,.0006,45);f=900-60*e['k']+rng.uniform(-40,40)
        add(te,(.03+.09*v)*(np.sin(2*np.pi*f*tt)+.5*lp(rng.standard_normal(m),3))*ee)
    elif ty=='merge':
        k=e['k'];f=SCALE[min(len(SCALE)-1,k+2)]
        m=int(SR*.18);tt=np.arange(m)/SR;fr=f*(1+.6*np.exp(-tt*35));ph=2*np.pi*np.cumsum(fr)/SR
        add(te,.16*np.sin(ph)*np.exp(-tt*16)*(1-np.exp(-tt/.002)))
        add(te,tone(f*2,.4,.05,9))
        if k not in seen:
            seen.add(k);add(te+.02,tone(f*2,1.2,.10,3,(1,.5,.25,.12)))
# final: riser, impact, chord, shimmer
r0=FIN-1.6;m=int(SR*1.6);tt=np.arange(m)/SR;fr=200*(4**(tt/1.6));ph=2*np.pi*np.cumsum(fr)/SR
add(r0,.10*np.sin(ph)*(tt/1.6)**2+.06*lp(rng.standard_normal(m),4)*(tt/1.6)**2)
m=int(SR*.6);tt,e=env(m,.001,6);add(FIN,.6*np.sin(2*np.pi*(45+60*np.exp(-tt*25))*tt)*e)
for f in [261.6,329.6,392.0,523.3,659.3,784.0]:add(FIN+.02,tone(f,2.6,.07,1.4,(1,.4,.2)))
for i in range(14):add(FIN+.1+i*.11,tone(SCALE[(i*3)%len(SCALE)]*2,.5,.04,8))
out=np.tanh(out*1.3);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('dur',D)
