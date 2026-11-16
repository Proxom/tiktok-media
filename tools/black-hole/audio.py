# Sound for "black hole" (NO-SHRILL rules). Every wall hit and every ball-ball bump plays the NEXT note of the French melody
# "Ah! vous dirai-je, maman" (Twinkle Twinkle, 18th c., public domain; own arrangement in C major, fundamentals C4..A4, all <= 440 Hz)
# on a soft marimba + wood layer, panned to the hit. An eaten ball = deep falling sine "whoomp" + low minor marimba figure.
# The hole hums: a low pad that deepens and grows as the hole grows. The win = low thump + rising figure + rolled low C-major chord.
# Final mix in ffmpeg (make.sh): compressor + lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
def hz(n):
    S={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};s=S[n[0]]+(1 if '#' in n else 0);return 440*2**((s+12*(int(n[-1])+1)-69)/12)
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('C4 C4 G4 G4 A4 A4 G4 F4 F4 E4 E4 D4 D4 C4 '
     'G4 G4 F4 F4 E4 E4 D4 G4 G4 F4 F4 E4 E4 D4').split()
ev=d['events'];hits=sorted([e for e in ev if e['type'] in('wall','bump') and e['t']<=ET+.05],key=lambda e:e['t']);ea=[e for e in ev if e['type']=='eat']
last=-9
for k,e in enumerate(hits):
    f=hz(MEL[k%len(MEL)]);g=(.15+.05*min(1,e['v']/500))*(.6 if e['t']-last<.08 else 1);pan=(e['x']-CX)/480;last=e['t']
    m.add(V(e['t']),m.marimba(f,g,.8),pan);m.add(V(e['t']),m.wood(f/2,g*.3),pan)
for k,e in enumerate(ea[:-1]):
    v=V(e['t']);p=(e['x']-CX)/480;tt=np.arange(int(SR*.9))/SR
    m.add(v,.12*np.sin(2*np.pi*(120*np.exp(-tt*2.5)+30)*tt)*(1-np.exp(-tt/.01))*np.exp(-tt*3.5),p*.5)
    for i,n in enumerate(['E4','C4','A3']):m.add(v+.06+i*.1,m.marimba(hz(n),.1,.7),p)
v=EV;tt=np.arange(int(SR*.9))/SR;m.add(v,.12*np.sin(2*np.pi*(60+32*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
for i,n in enumerate(['C4','E4','G4']):m.add(v+.1+i*.11,m.marimba(hz(n),.12,.8),0)
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(v+.5+i*.06,m.marimba(f,.11,.9),(i-2.5)*.25)
t=m.t;st=np.interp(t,TV,TM);grow=np.clip(np.minimum(st,ET)/d['TG'],0,1)
amp=(.35+.65*grow)*np.where(t<EV,1,np.exp(-(t-EV)*1.2)*.7+.0)
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.09*t+f)) for f,g in [(65.41,1),(98.0,.55),(130.81,.3)])
m.bed(pad*.009*amp)
if d.get('faces'):# shared ball voices (tools/faces/voice.py), 12 dB under the impact notes; pan = ball x at that time
    sys.path.insert(0,__file__.rsplit('/',2)[0]+'/faces');import voice
    FR=d['frames'];FF=d['ffps'];px=lambda b,t:(FR[min(len(FR)-1,max(0,int(t*FF)-1))][3*b]-CX)/480
    print('voices',voice.add_voices(m,d['faces']['voices'],V,ref=.19,pan=px))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'hit notes',len(hits),'eats',len(ea))
