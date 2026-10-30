# Original audio for cafe-wall (13 s): airy pad, laser zaps on each ruler, slide whooshes, riser + soft boom on the "breaks again" beat.
import numpy as np, wave, sys
SR=44100;D=13;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(4)
def add(t0,sig):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=sig[:m]
lp=lambda v,k:np.convolve(v,np.ones(k)/k,'same')
pad=sum(a*np.sin(2*np.pi*f*t+.4*np.sin(2*np.pi*.2*t+f)) for f,a in [(110,.08),(138.6,.05),(164.8,.05),(220,.03)])
out+=pad*np.clip(np.minimum(t/.3,(D-t)/.5),0,1)
# heartbeat-ish pulse under the hook
for b in np.arange(0,4.5,1.0):
    for d_,a in [(0,.35),(.22,.22)]:
        m=int(SR*.25);tt=np.arange(m)/SR;add(b+d_,a*np.sin(2*np.pi*(52+40*np.exp(-tt*30))*tt)*np.exp(-tt*14))
for r in range(1,8):
    m=int(SR*.6);tt=np.arange(m)/SR;f=900+r*80;add(4.6+r*.12,.07*np.sin(2*np.pi*np.cumsum(f+600*np.exp(-tt*8))/SR)*np.exp(-tt*5))
def whoosh(t0,dur,amp):
    m=int(SR*dur);tt=np.arange(m)/SR;add(t0,amp*lp(rng.standard_normal(m),6)*np.sin(np.pi*tt/dur)**2)
whoosh(7.0,1.4,.25);whoosh(9.6,1.4,.25)
m=int(SR*1.0);tt=np.arange(m)/SR;add(8.6,.15*np.sin(2*np.pi*np.cumsum(200+700*(tt/1.0)**2)/SR)*(tt/1.0)**2)
m=int(SR*.8);tt=np.arange(m)/SR;add(9.6,.6*np.sin(2*np.pi*(45+60*np.exp(-tt*20))*tt)*np.exp(-tt*6))
for i,f in enumerate([587.3,740,880]):
    m=int(SR*1.2);tt=np.arange(m)/SR;add(9.65+i*.07,.12*np.sin(2*np.pi*f*tt)*np.exp(-tt*3))
out+=.004*lp(rng.standard_normal(n),20)
out=np.tanh(out*1.2);out/=np.abs(out).max()/0.9
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
