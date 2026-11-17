# Sound for the brick breaker (NO-SHRILL rules): every BRICK that breaks plays the NEXT note of the Minuet in G major (BWV Anh. 114,
# Petzold, public domain; own arrangement one octave down, fundamentals F#3..G4, all <= 400 Hz) on a soft marimba + wood layer, panned to the brick.
# Ball-ball bumps = quiet low wood knock; wall bounces = very quiet low tap. The last brick = rolled low G major chord + soft thump.
# A low pad rises as the wall falls; shared ball voices (tools/faces/voice.py) sit 12 dB under the notes.
# Final mix in ffmpeg (make.sh): lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
NM={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def hz(n):return 440*2**((NM[n[0]]+('#' in n)+12*(int(n[-1])+1)-69)/12)
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('D4 G3 A3 B3 C4 D4 G3 G3 E4 C4 D4 E4 F#4 G4 G3 G3 '
     'C4 D4 C4 B3 A3 B3 C4 B3 A3 G3 F#3 G3 A3 B3 G3 B3 A3').split()
br=[e for e in d['events'] if e['type']=='brick'];bu=[e for e in d['events'] if e['type']=='bump'];wl=[e for e in d['events'] if e['type']=='wall']
lastv=-9
for k,e in enumerate(br):
    v=V(e['t']);f=hz(MEL[k%len(MEL)]);g=.16*(.55 if v-lastv<.06 else 1);pan=(e['x']-CX)/480;lastv=v
    m.add(v,m.marimba(f,g,.8),pan);m.add(v,m.wood(f/2,g*.3),pan)
for e in bu:m.add(V(e['t']),m.wood(110.0,.03+.03*min(1,e['v']/1200)),(e['x']-CX)/480)
for e in wl:m.add(V(e['t']),m.wood(146.83,.025*(.5 if e['t']>ET else 1)),(e['x']-CX)/480)
tt=np.arange(int(SR*.9))/SR;m.add(EV,.11*np.sin(2*np.pi*(62+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,n in enumerate(['G2','B2','D3','G3','B3','D4']):m.add(EV+.03+i*.05,m.marimba(hz(n),.13,.9),(i-2.5)*.25)
t=m.t;done=np.zeros(len(t))
for e in br:done+=(t>=V(e['t']))
ten=np.clip(done/len(br),0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.8
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(98.0,1),(146.83,.6),(196.0,.35)])
m.bed(pad*.0065*(.45+.55*ten))
if d.get('faces'):
    sys.path.insert(0,__file__.rsplit('/',2)[0]+'/faces');import voice
    FR=d['frames'];FF=d['ffps'];px=lambda b,t:(FR[min(len(FR)-1,max(0,int(t*FF)-1))][b][0]-CX)/480
    print('voices',voice.add_voices(m,d['faces']['voices'],V,ref=.18,pan=px))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'brick notes',len(br),'bumps',len(bu),'walls',len(wl))
