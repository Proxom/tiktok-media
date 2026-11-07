# Sound for the colour race (NO-SHRILL rules, Erkan 5 Nov): every ring bounce of any ball plays the NEXT note of
# "Ode to Joy" (Beethoven, public domain) on a soft marimba + wood layer, fundamentals G3..G4 (all <= 523 Hz), panned to the
# ball. Ball-ball hits = quiet low wood tap. A low pad rises with the biggest BALL vs GAP ratio (tension). Escape = rolled low
# major chord + soft thump; bounces after the win are quieter (race over). Final mix: lowpass 7.5k + high-shelf -4 dB in ffmpeg.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',30);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['escT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
ODE=('E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 '
     'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4 '
     'D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3 '
     'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4').split()
bo=[e for e in d['events'] if e['type']=='bounce'];bb=[e for e in d['events'] if e['type']=='bb']
for k,e in enumerate(bo):
    f=hz(ODE[k%len(ODE)]);after=e['t']>ET;g=(.15+.06*min(1,e['v']/800))*(.45 if after else 1);pan=(e['x']-CX)/520
    if e['kind']=='wall':m.add(V(e['t']),m.marimba(f,g,.8),pan);m.add(V(e['t']),m.wood(f/2,g*.3),pan)
    else:m.add(V(e['t']),m.marimba(f,g*.85,.6),pan);m.add(V(e['t']),m.wood(f/2,g*.4),pan)
for e in bb:
    m.add(V(e['t']),m.wood(196.0,.05+.04*min(1,e['v']/700)),(e['x']-CX)/520)
t=m.t
q0=2*d['R0']/d['CLEAR'];bt=[V(e['t']) for e in bo if e['t']<=ET];br=[];mx=[q0]*3
for e in bo:
    if e['t']>ET:break
    mx[e['ball']]=e['ratio'];br.append(max(mx))
ratio=np.interp(t,bt,br,left=q0)
ten=np.clip((ratio-.4)/.5,0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.6
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.35)])
m.bed(pad*.0065*(.5+.5*ten))
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(EV+.03+i*.05,m.marimba(f,.13,.9),(i-2.5)*.25)
tt=np.arange(int(SR*.9))/SR;m.add(EV,.08*np.sin(2*np.pi*(70+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
# soft low heartbeat in any quiet stretch (> .7 s without a note) during the last 4 s before the escape (keeps the tension)
nt=sorted(V(e['t']) for e in bo if e['t']<=ET);hb=EV-4.0
while hb<EV-.35:
    prev=max([v for v in nt if v<=hb],default=-9);nxt=min([v for v in nt if v>hb],default=99)
    if hb-prev>.35 and nxt-hb>.35 and (nxt-prev)>.7:
        for dt,g in [(0,.10),(.16,.07)]:
            tt=np.arange(int(SR*.35))/SR;m.add(hb+dt,g*np.sin(2*np.pi*(52+20*np.exp(-tt*25))*tt)*(1-np.exp(-tt/.006))*np.exp(-tt*11))
        hb+=.62
    else:hb+=.1
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'bounces',len(bo),'bb',len(bb),'notes before win',sum(1 for e in bo if e['t']<=ET))
