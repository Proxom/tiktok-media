# Original audio for jelly-press (15 s): hydraulic hum, squelches, alarm, spring-launch boing, whoosh, clang, cute blip.
import numpy as np, wave, sys
SR=44100;D=15;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(9)
def add(t0,sig):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=sig[:m]
def lp(x,k=30):return np.convolve(x,np.ones(k)/k,'same')
def env(m,a=.004,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def hum(t0,dur,f0,f1,amp):
    m=int(SR*dur);tt=np.arange(m)/SR;f=f0+(f1-f0)*tt/dur;ph=2*np.pi*np.cumsum(f)/SR
    e=np.clip(np.minimum(tt/.15,(dur-tt)/.2),0,1);add(t0,amp*e*(np.sign(np.sin(ph))*.25+np.sin(ph)+.3*lp(rng.standard_normal(m),6)))
def squelch(t0,dur,amp):
    m=int(SR*dur);tt=np.arange(m)/SR;nz=lp(rng.standard_normal(m),12);wob=np.sin(2*np.pi*(8+30*tt)*tt)
    add(t0,amp*nz*(.5+.5*wob)*np.clip(np.minimum(tt/.05,(dur-tt)/.3),0,1))
def boing(t0,f,amp,dur=.6):
    m=int(SR*dur);tt,e=env(m,.003,5);add(t0,amp*np.sin(2*np.pi*(f+f*.5*np.sin(2*np.pi*14*tt)*np.exp(-tt*4))*tt)*e)
# room bed
out+=.006*lp(rng.standard_normal(n),40)+.03*np.sin(2*np.pi*50*t)
hum(0.0,1.2,70,55,.12);squelch(0.9,1.0,.35);hum(3.3,1.0,55,75,.10);boing(4.0,180,.35)
# alarm 5.9-8.2
for k in range(8):
    m=int(SR*.22);tt,e=env(m,.005,6);add(5.9+k*.3,.18*np.sign(np.sin(2*np.pi*(880 if k%2 else 660)*tt))*e)
hum(6.3,1.3,90,45,.2);squelch(7.0,2.0,.5)
# creak/strain 7.6-9.0
m=int(SR*1.4);tt=np.arange(m)/SR;add(7.6,.08*np.sin(2*np.pi*(60+25*np.sin(2*np.pi*2.5*tt))*tt)*np.sign(np.sin(2*np.pi*23*tt)))
# launch 9.0: big boing + sub + whoosh up
m=int(SR*.6);tt,e=env(m,.002,6);add(9.0,.9*np.sin(2*np.pi*(45+80*np.exp(-tt*20))*tt)*e)
boing(9.0,110,.6,1.2)
m=int(SR*1.0);tt=np.arange(m)/SR;nz=lp(rng.standard_normal(m),4);add(9.05,.35*nz*np.exp(-tt*3)*np.sin(np.pi*np.clip(tt/1.0,0,1)))
# distant clang 10.3 (press hits something far above)
m=int(SR*1.5);tt,e=env(m,.001,3);add(10.3,.12*sum(np.sin(2*np.pi*f*tt) for f in [523,787,1240])*e)
# cute blip when eyes appear
for i,f in enumerate([988,1319]):
    m=int(SR*.15);tt,e=env(m,.002,20);add(10.05+i*.09,.2*np.sin(2*np.pi*f*tt)*e)
# ram returning 12.6-14.2
hum(12.6,1.4,50,70,.1)
for h0 in [10.6,11.5]: boing(h0,320,.3,.45)
m=int(SR*.3);tt,e=env(m,.001,14);add(14.0,.5*np.sin(2*np.pi*(60+50*np.exp(-tt*25))*tt)*e)
out=np.tanh(out*1.1);out/=np.abs(out).max()/0.9
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
