# Original synthesized audio for odd-donut (12 s): pad, clock ticks, riser, reveal pop + chime.
import numpy as np, wave, sys
SR=44100;D=12;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n)
rng=np.random.default_rng(3)
def add(t0,sig):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=sig[:m]
def env(m,a=.004,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
# warm pad (A minor-ish -> major on reveal), loop-safe fades
for f,amp in [(110,.10),(164.8,.06),(220,.05),(261.6,.035)]:
    out+=amp*np.sin(2*np.pi*f*t+np.sin(2*np.pi*.3*t))
out*=np.clip(np.minimum(t/0.4,(D-t)/0.6),0,1)
# whoosh at start (camera dolly)
m=int(SR*1.0);tt,e=env(m,.15,4);nz=rng.standard_normal(m);nz=np.convolve(nz,np.ones(30)/30,'same');add(0,.5*nz*e)
# ticks each second of the countdown 1.5..6.5, tock pitch rises
for k in range(6):
    m=int(SR*.08);tt,e=env(m,.0005,70);f=1800+k*150
    add(1.5+k,.55*np.sin(2*np.pi*f*tt)*e+.2*rng.standard_normal(m)*e)
# riser 5.0 -> 7.0
m=int(SR*2);tt=np.arange(m)/SR;fr=200+600*(tt/2)**2;ph=2*np.cumsum(np.pi*fr)/SR
add(5.0,.18*np.sin(ph)*(tt/2)**1.5+.12*np.convolve(rng.standard_normal(m),np.ones(8)/8,'same')*(tt/2)**2)
# reveal: sub thump + pop + chime arpeggio
m=int(SR*.5);tt,e=env(m,.002,7);add(7.0,.8*np.sin(2*np.pi*(50+90*np.exp(-tt*30))*tt)*e)
m=int(SR*.12);tt,e=env(m,.0005,40);add(7.0,.5*np.sin(2*np.pi*(900-500*tt/.12)*tt)*e)
for i,f in enumerate([523.25,659.25,783.99,1046.5]):
    m=int(SR*1.2);tt,e=env(m,.002,3.5);add(7.05+i*.09,.22*(np.sin(2*np.pi*f*tt)+.3*np.sin(4*np.pi*f*tt))*e)
# soft boing at 8.2 (comment prompt)
m=int(SR*.4);tt,e=env(m,.003,9);add(8.3,.3*np.sin(2*np.pi*(300+120*np.sin(2*np.pi*12*tt))*tt)*e)
# room tone
out+=.004*np.convolve(rng.standard_normal(n),np.ones(20)/20,'same')
out=np.tanh(out*1.2);out/=np.abs(out).max()/0.9
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
