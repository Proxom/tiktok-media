# Original synthesized audio for phone-1pct (14 s): lo-fi pad, hop boings, strain creak, plug zap + chime, sad trombone-ish drop, thud.
import numpy as np, wave, sys
SR=44100;D=14;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(5)
def add(t0,sig):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=sig[:m]
def env(m,a=.004,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
# lo-fi pad + soft beat until the reveal
pad=sum(a*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.25*t)) for f,a in [(130.8,.07),(164.8,.05),(196,.05),(246.9,.03)])
pad*=np.clip(np.minimum(t/.3,(10.6-t)/.4),0,1);out+=pad
for b in np.arange(0,10.5,0.5):
    m=int(SR*.25);tt,e=env(m,.002,14)
    if int(b*2)%2==0: add(b,.35*np.sin(2*np.pi*(48+70*np.exp(-tt*35))*tt)*e)
    else: add(b,.06*rng.standard_normal(m)*np.exp(-tt*40))
# low-battery beeps 0-1.5
for k in range(3):
    m=int(SR*.12);tt,e=env(m,.002,20);add(.1+k*.45,.25*np.sin(2*np.pi*1320*tt)*e)
# hop boings (take-off) + landing taps
for h in [1.6,2.5,3.4,4.3,6.6]:
    m=int(SR*.35);tt,e=env(m,.003,9);add(h,.35*np.sin(2*np.pi*np.cumsum(220+500*tt/.35)/SR)*e)
    m=int(SR*.1);tt,e=env(m,.001,40);add(h+(.7 if h==6.6 else .6),.4*np.sin(2*np.pi*140*tt)*e+.1*rng.standard_normal(m)*e)
# strain creak 5.2-6.6
m=int(SR*1.4);tt=np.arange(m)/SR;cr=np.sign(np.sin(2*np.pi*(70+20*np.sin(2*np.pi*3*tt))*tt))*.05*(np.sin(2*np.pi*30*tt)>0);add(5.2,cr*np.clip(tt/.2,0,1))
# plug-in zap + success chime 7.3
m=int(SR*.25);tt,e=env(m,.001,18);add(7.28,.3*rng.standard_normal(m)*e*np.sin(2*np.pi*90*tt))
for i,f in enumerate([659.25,880,1318.5]):
    m=int(SR*.9);tt,e=env(m,.002,4);add(7.4+i*.08,.2*np.sin(2*np.pi*f*tt)*e)
# 'hmm' two dull blips at 9.1
for k in range(2):
    m=int(SR*.2);tt,e=env(m,.003,12);add(9.1+k*.35,.25*np.sin(2*np.pi*330*tt)*e)
# reveal sting 10.8: descending wah (original)
for i,f in enumerate([392,370,349,330]):
    m=int(SR*(.35 if i<3 else .9));tt,e=env(m,.01,2.5);wob=1+.02*np.sin(2*np.pi*6*tt)*(i==3)
    add(10.8+i*.3,.22*(np.sign(np.sin(2*np.pi*f*wob*tt))*.3+np.sin(2*np.pi*f*wob*tt))*e)
# faceplant thud 12.65+.45 and power-down
m=int(SR*.4);tt,e=env(m,.001,10);add(13.05,.7*np.sin(2*np.pi*(55+60*np.exp(-tt*25))*tt)*e)
m=int(SR*.5);tt=np.arange(m)/SR;add(13.1,.15*np.sin(2*np.pi*np.cumsum(600*np.exp(-tt*6))/SR)*np.exp(-tt*5))
out+=.004*np.convolve(rng.standard_normal(n),np.ones(20)/20,'same')
out=np.tanh(out*1.2);out/=np.abs(out).max()/0.9
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
