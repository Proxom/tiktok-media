# usage: python3 audio.py <dir> -> <dir>/audio.wav  (original synthesized SFX from events.json)
import json,sys,numpy as np,wave
d=sys.argv[1];E=json.load(open(d+'/events.json'));SR=44100;dur=E['dur'];y=np.zeros(int((dur+.5)*SR))
def add(t,s,g=1):
    i=int(t*SR);s=s[:len(y)-i];y[i:i+len(s)]+=s*g
def tone(f,l,dec=18,wave='sin',f2=None):
    t=np.arange(int(l*SR))/SR;ff=f if f2 is None else np.linspace(f,f2,len(t))
    ph=2*np.pi*np.cumsum(ff)/SR if f2 is not None else 2*np.pi*f*t
    w=np.sin(ph) if wave=='sin' else np.sign(np.sin(ph))*.5
    return w*np.exp(-dec*t)
rng=np.random.default_rng(3)
# steady soft beat during race
g=E['gate']
for k in range(int((dur-g)/0.4)):
    add(g+k*0.4,tone(70,.25,12,f2=45),.35)
    if k%2==1: add(g+k*0.4,tone(1800,.04,80,'sq'),.05)
# collisions, thinned
last=-1;notes=[523,587,659,784,880,988]
for e in sorted(E['events'],key=lambda e:e['t']):
    if e['t']-last<0.045: continue
    last=e['t'];v=e['v']
    if e['k']=='peg': add(e['t'],tone(notes[int(e['t']*37)%6]*2,.12,30),.10+.2*v)
    elif e['k']=='marble': add(e['t'],tone(300,.1,35,f2=180),.25*v+.1)
    elif e['k']=='spin': add(e['t'],tone(220,.1,25,'sq'),.12)
    else: add(e['t'],tone(140+60*v,.08,40),.10+.15*v)
# countdown ticks 0.85,1.7,2.55 and GO
for tt in (.85,1.7,2.55): add(tt,tone(660,.15,12),.4)
add(g,tone(990,.4,6),.5);add(g,tone(1320,.4,6),.3)
# riser before finish
w=E['winT'];r=np.linspace(0,1,int(1.5*SR));ph=2*np.pi*np.cumsum(300+900*r)/SR;add(w-1.5,np.sin(ph)*r*.25,1)
# win jingle
for i,f in enumerate([523,659,784,1047,1319]): add(w+i*.11,tone(f,.5,5),.35)
add(w,tone(130,.6,6,f2=60),.7)
y=np.tanh(y*1.3);y/=max(abs(y).max(),1e-6);y*=0.8
a=(y*32767).astype(np.int16);wf=wave.open(d+'/audio.wav','wb');wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(SR);wf.writeframes(a.tobytes());wf.close()
