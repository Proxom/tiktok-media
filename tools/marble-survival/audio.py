# Sound for "24 marble survival" (NO-SHRILL rules). Every bump between two marbles on the floor plays the NEXT note of Beethoven's
# "Ode to Joy" (1824, public domain; own arrangement in C major, fundamentals G3..G4, all <= 440 Hz) on a soft marimba + wood layer, panned to the bump.
# A fall = soft low falling thump + one low marimba note. The win = low thump + rising marimba figure + rolled low C-major chord.
# A low pad rises as marbles drop out; a soft heartbeat fills quiet gaps when 3 or fewer are left.
# Final mix in ffmpeg (make.sh): compressor + lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
def hz(n):
    S={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};s=S[n[0]]+(1 if '#' in n else 0);return 440*2**((s+12*(int(n[-1])+1)-69)/12)
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 '
     'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4 '
     'D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3').split()
ev=d['events'];bm=[e for e in ev if e['type']=='bump' and e['t']<=ET+.05];fl=[e for e in ev if e['type']=='fall']
last=-9
for k,e in enumerate(bm):
    f=hz(MEL[k%len(MEL)]);g=(.15+.05*min(1,e['v']/400))*(.6 if e['t']-last<.08 else 1);pan=(e['x']-CX)/480;last=e['t']
    m.add(V(e['t']),m.marimba(f,g,.8),pan);m.add(V(e['t']),m.wood(f/2,g*.3),pan)
for k,e in enumerate(fl[:-1]):
    v=V(e['t']);p=(e['x']-CX)/480;tt=np.arange(int(SR*.6))/SR
    m.add(v,.08*np.sin(2*np.pi*(95*np.exp(-tt*2.2))*tt)*(1-np.exp(-tt/.008))*np.exp(-tt*5),p);m.add(v+.05,m.marimba(hz(['A3','G3','E3','D3'][k%4]),.09,.6),p)
v=EV;tt=np.arange(int(SR*.9))/SR;m.add(v,.12*np.sin(2*np.pi*(60+32*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,n in enumerate(['C4','E4','G4']):m.add(v+.1+i*.11,m.marimba(hz(n),.12,.8),0)
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(v+.5+i*.06,m.marimba(f,.11,.9),(i-2.5)*.25)
t=m.t;nf=np.zeros(len(t))
for e in fl:nf+=(t>=V(e['t']))
ten=np.clip(nf/23,0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.7
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.3)])
m.bed(pad*.006*(.4+.6*ten))
nt=sorted(V(e['t']) for e in bm);hb=V(fl[-3]['t'])+.4
while hb<EV-.35:
    prev=max([q for q in nt if q<=hb],default=-9);nxt=min([q for q in nt if q>hb],default=99)
    if hb-prev>.3 and nxt-hb>.3:
        for dt,g in [(0,.08),(.16,.055)]:
            tt=np.arange(int(SR*.35))/SR;m.add(hb+dt,g*np.sin(2*np.pi*(52+20*np.exp(-tt*25))*tt)*(1-np.exp(-tt/.006))*np.exp(-tt*11))
        hb+=.8
    else:hb+=.1
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'bump notes',len(bm),'falls',len(fl))
