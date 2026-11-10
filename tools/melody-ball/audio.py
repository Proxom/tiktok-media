# Sound for the melody ball (NO-SHRILL rules): every WALL BOUNCE plays the NEXT note of Beethoven's "Für Elise" (public domain; own arrangement,
# fundamentals A2..E4, all <= 330 Hz) on a soft marimba + a quiet wood layer, panned to the bounce. A soft A-minor pad grows with the speed.
# The reveal = a rolled A-minor chord on marimba + low swell. Final mix in ffmpeg: lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d['vfps'];TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,7)
SEMI={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def hz(n):
    s=SEMI[n[0]]+(1 if '#' in n else 0);o=int(n[-1]);return 440*2**((s+12*(o+1)-69)/12)
hits=d['hits'];NN=len(hits)
for k,h in enumerate(hits):
    f=hz(h['note']);pan=(h['x']-CX)/480;g=.20+.04*k/NN
    m.add(V(h['t']),m.marimba(f,g,.85),pan);m.add(V(h['t']),m.wood(f/2,g*.30),pan)
t=m.t;sp=np.clip(np.array([sum(1 for h in hits if V(h['t'])<=tt) for tt in t[::441]])/NN,0,1);sp=np.repeat(sp,441)[:len(t)]
if len(sp)<len(t):sp=np.pad(sp,(0,len(t)-len(sp)),'edge')
env=(.35+.65*sp)*(t<EV)+(t>=EV)*(.9*np.exp(-(t-EV)*.5)+.1)
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.09*t+f)) for f,g in [(110.0,1),(164.81,.55),(220.0,.35),(261.63,.22)])
m.bed(pad*.006*env)
for i,n in enumerate(['A2','E3','A3','C4','E4','A3']):m.add(EV+.02+i*.09,m.marimba(hz(n),.16 if i<5 else .10,.9),(i-2.5)*.22)
tt=np.arange(int(SR*2.5))/SR;m.add(EV,.06*np.sin(2*np.pi*55*tt)*(1-np.exp(-tt/.3))*np.exp(-tt*1.4))
m.reverb(wet=.34);m.write(sys.argv[2]);print('dur',round(D,2),'notes',NN,'reveal at',round(EV,2))
