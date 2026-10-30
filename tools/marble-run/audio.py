# Marble music: every hit in the simulation (data.js) plays the next note of a public-domain melody,
# marimba tone on planks/pins and a bell tone on metal deflectors; rolling = filtered noise scaled by speed while in contact;
# the finish lands a resolving chord + sparkle. python3 audio.py data.js out.wav [melody]
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
MEL=sys.argv[3] if len(sys.argv)>3 else 'ode'
N={'G3':196.0,'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392.0,'A4':440.0,'B4':493.88,'C5':523.25}
MELODIES={  # public domain
 'ode':'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4 D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4',
}
notes=[N[n] for n in MELODIES[MEL].split()]
SR=44100;fps=d['fps'];D=len(d['frames'])/fps;n=int(SR*D);t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(3)
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig))
    if m>0:out[i:i+m]+=g*sig[:m]
def env(m,a=.002,dec=6):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def marimba(f,amp):
    m=int(SR*1.2);tt,e=env(m,.001,5.5);return amp*e*(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*25)+.15*np.sin(2*np.pi*10*f*tt)*np.exp(-tt*60))
def bell(f,amp):
    m=int(SR*2.0);tt,e=env(m,.001,2.2);return amp*e*(np.sin(2*np.pi*f*2*tt)+.5*np.sin(2*np.pi*f*2*2.76*tt)*np.exp(-tt*4)+.25*np.sin(2*np.pi*f*2*5.4*tt)*np.exp(-tt*8))
def click(amp):
    m=int(SR*.03);tt,e=env(m,.0003,120);return amp*(rng.standard_normal(m)*.6+np.sin(2*np.pi*2400*tt))*e
# rolling noise
fr=np.array(d['frames']);sp=np.repeat(fr[:,4]*fr[:,3],SR//fps)[:n];sp=np.pad(sp,(0,max(0,n-len(sp))))
nz=np.convolve(rng.standard_normal(n),np.ones(18)/18,'same');roll=nz*np.clip(sp/600,0,1)*.10
roll=np.convolve(roll,np.ones(200)/200,'same')*6+roll*.4;out+=roll
# soft room tone so it is never silent
out+=.003*np.convolve(rng.standard_normal(n),np.ones(60)/60,'same')
# warm pad on C major so the gaps between notes are never empty
out+=.010*sum(np.sin(2*np.pi*f*t+.4*np.sin(2*np.pi*.12*t)) for f in [130.81,196.0,261.63])*(.7+.3*np.sin(2*np.pi*t/8))
k=0
for h in d['hits']:
    v=min(1,h['v']/700)
    if k>=len(notes):break
    f=notes[k];k+=1
    add(h['t'],click(.08+.1*v))
    add(h['t'],bell(f,.10+.10*v) if h['kind']=='bell' else marimba(f,.16+.16*v))
FIN=d['finish']
for f in [261.63,329.63,392.0,523.25]:add(FIN+.05,marimba(f,.12))
for f in [523.25,659.25,783.99,1046.5]:add(FIN+.05,bell(f/2,.05))
for i in range(10):add(FIN+.25+i*.09,bell([523.25,659.25,783.99][i%3],.025))
out=np.tanh(out*1.4);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('notes used',k,'dur',D)
