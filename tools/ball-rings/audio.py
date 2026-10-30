# Ball-rings audio from sim events: each bounce plays a pentatonic note (pitch = ring + ball, outer rings lower),
# throttled to about 10 notes/s; passing a gap = rising chime; ball-ball clack = soft tick; winner = fanfare. Pad underneath.
# python3 audio.py data.js out.wav
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
SR=44100;fps=d['fps'];FIN=d['finish'];D=len(d['frames'])/fps;n=int(SR*D);t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(5)
PENT=[261.63,293.66,329.63,392.0,440.0]
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig))
    if m>0:out[i:i+m]+=g*sig[:m]
def env(m,a=.001,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def mar(f,amp,dur=.9):
    m=int(SR*dur);tt,e=env(m,.001,6);return amp*e*(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*28))
def bell(f,amp,dur=1.4):
    m=int(SR*dur);tt,e=env(m,.001,3);return amp*e*(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt*5))
out+=.010*sum(np.sin(2*np.pi*f*t+.4*np.sin(2*np.pi*.1*t)) for f in [130.81,196.0,261.63])*(.75+.25*np.sin(2*np.pi*t/9))
out+=.003*np.convolve(rng.standard_normal(n),np.ones(60)/60,'same')
last=-1;K=d['K']
for e in d['events']:
    te=e['t']
    if e['type']=='bounce':
        if te-last<.095:continue
        last=te;k=e['ring'];i=(k*2+e['ball'])%len(PENT);octv=2**(1-(k*3//K)*0+ (0 if k<K/2 else -1)+1)
        f=PENT[i]*(2 if k<K//2 else 1)
        v=min(1,e['v']/520);add(te,mar(f,.10+.12*v))
    elif e['type']=='pass':
        k=e['ring'];f=PENT[(k+e['ball'])%5]*2*(1+k*.05)
        add(te,bell(f,.10));add(te+.05,bell(f*1.5,.06))
    elif e['type']=='clack':
        if te-last<.04:continue
        m=int(SR*.02);tt,ee=env(m,.0003,150);add(te,.04*np.sin(2*np.pi*2000*tt)*ee)
for fr in [261.63,329.63,392.0,523.25]:add(FIN+.03,mar(fr,.13,2.5))
for i,fr in enumerate([523.25,659.25,783.99,1046.5,1318.5]):add(FIN+.15+i*.1,bell(fr,.07))
out*=np.clip((D-t)/.3,0,1)
out=np.tanh(out*1.4);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('dur',D)
