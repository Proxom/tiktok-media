# Sound for the merge race (family E, NO-SHRILL rules): every MERGE plays the NEXT note of "Frere Jacques" (traditional, public domain;
# own arrangement in C, fundamentals G3..A4 <= 440 Hz) on a soft marimba + a low wood layer one octave down, panned to the merge position;
# bigger numbers get a little more weight. Ball-ball / wall hits = very quiet low wood taps (rate-limited, never louder than the melody).
# Each drop = soft low tock. The KING = soft low thump + rolled low major chord. Quiet warm pad bed that rises with the tension.
# Final mix in make.sh: compressor + lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',3)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF
def V(s):
    if s<TM[0]:return -1.0
    i=int(np.searchsorted(TM,s-1e-9));return float(TV[min(i,len(TV)-1)])
D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4 E4 F4 G4 '
     'G4 A4 G4 F4 E4 C4 G4 A4 G4 F4 E4 C4 C4 G3 C4 C4 G3 C4').split()
ev=d['events'];merges=[e for e in ev if e['type']=='merge'];hits=[e for e in ev if e['type'] in('hit','wall')];drops=[e for e in ev if e['type']=='drop']
hits.sort(key=lambda e:e['t'])
k=0
for e in merges:
    if e['t']>=ET-1e-9:continue
    f=hz(MEL[k%len(MEL)]);k+=1;pan=(e['x']-CX)/520;w=1+.12*e['k']
    m.add(V(e['t']),m.marimba(f,.17*w,.8),pan);m.add(V(e['t']),m.wood(f/2,.05*w),pan)
lastp=-9
for e in hits:
    v=V(e['t'])
    if v<0 or v-lastp<.06 or e['t']>ET+3:continue
    lastp=v;m.add(v,m.wood(174.61 if e['k']%2 else 196.0,.008+.010*min(1,e['v']/900)),(e['x']-CX)/520)
for e in drops:
    if e['t']>=TM[0]:m.add(V(e['t']),m.wood(110.0,.025),(e['x']-CX)/520)
v=EV;tt=np.arange(int(SR*.9))/SR
m.add(v,.11*np.sin(2*np.pi*(62+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(v+.03+i*.05,m.marimba(f,.14,.9),(i-2.5)*.25)
t=m.t;ten=np.clip(np.interp(t,[0,EV],[0,1]),0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.8
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.35)])
m.bed(pad*.006*(.4+.6*ten))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'merge notes',k,'hit taps',len(hits),'drops',len(drops))
