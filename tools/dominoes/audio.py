# Domino audio: a wooden click per domino at its exact topple time (pitch/level jittered), a marimba note every 5th domino
# climbing a pentatonic scale over the whole wave, starter-ball roll, finale bell + chord. python3 audio.py data.js out.wav
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
SR=44100;N=d['N'];T=d['t'];END=d['tEnd'];D=END+1.6+1.0;n=int(SR*D);t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(9)
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig))
    if m>0 and i>=0:out[i:i+m]+=g*sig[:m]
def env(m,a=.0008,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def mar(f,amp,dur=.9):
    m=int(SR*dur);tt,e=env(m,.001,6);return amp*e*(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*28))
def bell(f,amp,dur=2.2):
    m=int(SR*dur);tt,e=env(m,.001,2.2);return amp*e*(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt*5))
def click(v):
    m=int(SR*.03);tt,e=env(m,.0004,90);f=1500+900*v;return e*(.5*rng.standard_normal(m)*np.exp(-tt*140)+np.sin(2*np.pi*f*tt)*.6+np.sin(2*np.pi*(150+60*v)*tt)*.8*np.exp(-tt*40))
SC=[261.63,293.66,329.63,392.0,440.0]
# starter ball roll
m=int(SR*T[0]);tt=np.arange(m)/SR;out[:m]+=np.convolve(rng.standard_normal(m),np.ones(30)/30,'same')*.05*np.clip(tt/T[0],0,1)
for i in range(N):
    v=rng.uniform();add(T[i],click(v),.07+.05*v)
    if i%5==0:
        k=i//5;f=SC[k%5]*2**((k//5)%3+(0 if i<N*.5 else 0))
        add(T[i],mar(f,.045+.02*(i/N),.7))
# soft pad that swells with the wave
sw=np.clip(t/END,0,1)
out+=.012*sum(np.sin(2*np.pi*f*t) for f in [130.81,196.0,261.63])*(.4+.6*sw)
out+=.003*np.convolve(rng.standard_normal(n),np.ones(60)/60,'same')
# finale
for f in [261.63,329.63,392.0,523.25]:add(END-.5,mar(f,.12,3.0))
for i,f in enumerate([523.25,659.25,783.99,1046.5,1318.5]):add(END-.5+.12*i,bell(f,.07))
add(END-.5,bell(1046.5,.10,3.0))
out*=np.clip((D-t)/.4,0,1)
out=np.tanh(out*1.5);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('dur',D)
