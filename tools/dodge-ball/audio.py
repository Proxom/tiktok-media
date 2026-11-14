# Sound for "1 vs 10" (NO-SHRILL rules). Every bump between two chasers plays the NEXT note of Grieg's "In the Hall of the Mountain King"
# (1875, public domain; own arrangement in A minor, fundamentals A3..A4, all <= 440 Hz) on a soft marimba + wood layer, panned to the bump.
# A new chaser = low soft wood thump. A DODGE = soft low two-note marimba lift. The catch = low thump + falling marimba figure + rolled low
# A-minor chord. A low pad rises with the number of chasers; a soft heartbeat fills quiet gaps and speeds up as chasers join.
# Final mix in ffmpeg: compressor + lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
def hz(n):
    S={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};s=S[n[0]]+(1 if '#' in n else 0);return 440*2**((s+12*(int(n[-1])+1)-69)/12)
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('A3 B3 C4 D4 E4 C4 E4 D#4 B3 D#4 D4 A#3 D4 '
     'A3 B3 C4 D4 E4 C4 E4 A4 G4 E4 C4 E4 G4').split()
ev=d['events'];bm=[e for e in ev if e['type']=='bump' and e['t']<=ET+.05];en=[e for e in ev if e['type']=='enter'];dg=[e for e in ev if e['type']=='dodge'];ca=[e for e in ev if e['type']=='catch'][0]
last=-9
for k,e in enumerate(bm):
    f=hz(MEL[k%len(MEL)]);g=(.15+.05*min(1,e['v']/500))*(.6 if e['t']-last<.08 else 1);pan=(e['x']-CX)/520;last=e['t']
    m.add(V(e['t']),m.marimba(f,g,.8),pan);m.add(V(e['t']),m.wood(f/2,g*.3),pan)
for e in en:
    tt=np.arange(int(SR*.5))/SR;m.add(V(e['t']),.07*np.sin(2*np.pi*(70+25*np.exp(-tt*14))*tt)*(1-np.exp(-tt/.01))*np.exp(-tt*7),(e['x']-CX)/520);m.add(V(e['t']),m.wood(110,.05),(e['x']-CX)/520)
for e in dg:
    v=V(e['t']);p=(e['x']-CX)/520
    for i,n in enumerate(['E3','A3']):m.add(v+i*.07,m.marimba(hz(n),.12,.7),p)
v=EV;tt=np.arange(int(SR*.9))/SR;m.add(v,.12*np.sin(2*np.pi*(60+32*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,n in enumerate(['E4','C4','A3']):m.add(v+.08+i*.12,m.marimba(hz(n),.12,.8),(ca['x']-CX)/520)
for i,f in enumerate([110.0,130.81,164.81,220.0,261.63,329.63]):m.add(v+.5+i*.06,m.marimba(f,.11,.9),(i-2.5)*.25)
t=m.t;n_in=np.zeros(len(t))
for e in en:n_in+=(t>=V(e['t']))
ten=np.clip(n_in/10,0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.7
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(110.0,1),(164.81,.6),(220.0,.35)])
m.bed(pad*.006*(.4+.6*ten))
nt=sorted(V(e['t']) for e in bm);hb=V(en[0]['t'])+.5
while hb<EV-.35:
    prev=max([q for q in nt if q<=hb],default=-9);nxt=min([q for q in nt if q>hb],default=99)
    if hb-prev>.3 and nxt-hb>.3:
        for dt,g in [(0,.08),(.16,.055)]:
            tt=np.arange(int(SR*.35))/SR;m.add(hb+dt,g*np.sin(2*np.pi*(52+20*np.exp(-tt*25))*tt)*(1-np.exp(-tt/.006))*np.exp(-tt*11))
        k=float(np.interp(hb,t,n_in));hb+=1.0-.05*k
    else:hb+=.1
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'bump notes',len(bm),'enters',len(en),'dodges',len(dg))
