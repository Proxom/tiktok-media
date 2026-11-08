# Sound for plinko (family D, NO-SHRILL rules): every LANDING (the moment a ball counts for a bin) plays the NEXT note of
# Beethoven's "Ode to Joy" (public domain; own arrangement in C, fundamentals C4..G4 <= 392 Hz) on a soft marimba + low wood layer, panned to the bin.
# Peg hits = very quiet low wood taps (rate-limited, never louder than the melody). Each drop = soft low tock. A lead change = a quiet low pad swell.
# The winning landing = rolled low major chord. Final mix in make.sh: lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF
def V(s):
    i=int(np.searchsorted(TM,s-1e-9));return float(TV[min(i,len(TV)-1)])
D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 '
     'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4 '
     'D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3').split()
lands=[e for e in d['events'] if e['type']=='land'];pegs=[e for e in d['events'] if e['type']=='peg'];drops=[e for e in d['events'] if e['type']=='drop']
BX=[d['XL']]+d['DIVS']+[d['XR']]
for k,e in enumerate(lands):
    if abs(e['t']-ET)<1e-9:continue
    f=hz(MEL[k%len(MEL)]);pan=((BX[e['bin']]+BX[e['bin']+1])/2-CX)/520
    m.add(V(e['t']),m.marimba(f,.20,.8),pan);m.add(V(e['t']),m.wood(f/2,.07),pan)
lastp=-9
for e in pegs:
    v=V(e['t'])
    if v-lastp<.045:continue
    lastp=v;m.add(v,m.wood(196.0 if e['p']%2 else 174.61,.012+.012*min(1,e['v']/700)),(e['x']-CX)/520)
for e in drops:m.add(V(e['t']),m.wood(110.0,.03),(e['x']-CX)/520)
v=V(ET);tt=np.arange(int(SR*.9))/SR
m.add(v,.10*np.sin(2*np.pi*(62+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(v+.03+i*.05,m.marimba(f,.14,.9),(i-2.5)*.25)
t=m.t;ten=np.clip(np.interp(t,[0,EV],[0,1]),0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.8
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.35)])
m.bed(pad*.006*(.4+.6*ten))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'land notes',len(lands),'peg taps',len(pegs),'drops',len(drops))
