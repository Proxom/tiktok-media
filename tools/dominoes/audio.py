# Dominoes audio from data.js timing: a wooden click for every domino hit (slightly varied, pitch drifting up along the chain),
# a marimba note every 6th domino walking up a pentatonic scale, ball roll-in rumble, final chord + bells. Warm pad underneath.
# python3 audio.py data.js out.wav
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
SR=44100;N=d['N'];T=d['t'];DUR=d['tEnd']+1.6;n=int(SR*DUR);t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(3)
PENT=[261.63,293.66,329.63,392.0,440.0]
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig))
    if m>0:out[i:i+m]+=g*sig[:m]
def env(m,a=.001,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def click(f,amp):
    m=int(SR*.06);tt,e=env(m,.0002,70);nz=rng.standard_normal(m)*np.exp(-tt*300)
    return amp*e*(np.sin(2*np.pi*f*tt)+.6*np.sin(2*np.pi*f*2.3*tt))+amp*.5*nz
def mar(f,amp,dur=.8):
    m=int(SR*dur);tt,e=env(m,.001,7);return amp*e*(np.sin(2*np.pi*f*tt)+.25*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*30))
def bell(f,amp,dur=2.2):
    m=int(SR*dur);tt,e=env(m,.001,2);return amp*e*(np.sin(2*np.pi*f*tt)+.45*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt*4))
out+=.009*sum(np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.08*t)) for f in [130.81,196.0,261.63,329.63])*np.clip(t/1.5,0,1)
roll=np.convolve(rng.standard_normal(n),np.ones(120)/120,'same')*np.clip(t/T[0],0,1)*(t<T[0]);out+=.25*roll
for i in range(N):
    te=T[i]+d['D']*.92 # the moment domino i lands on the next one
    u=i/N;add(te,click(900+700*u+rng.uniform(-60,60),.07+.03*rng.random()))
    if i%6==0:k=i//6;add(te,mar(PENT[k%5]*2**(k//5%3),.07+.04*u))
FIN=T[-1]+d['D']
for fr in [261.63,329.63,392.0,523.25]:add(FIN,mar(fr,.14,2.6))
for i,fr in enumerate([523.25,659.25,783.99,1046.5,1318.5]):add(FIN+.12+i*.11,bell(fr,.07))
out*=np.clip((DUR-t)/.4,0,1)
out=np.tanh(out*1.3);out/=np.abs(out).max()/0.85
st=np.stack([out,out],1)
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('dur',DUR,'finish',FIN)
