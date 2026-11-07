# Sound for the ball battle (NO-SHRILL rules): every CRASH between two balls plays the NEXT note of Mozart's
# "Eine kleine Nachtmusik" (public domain; own arrangement transposed to C, fundamentals G3..G4, all <= 523 Hz) on a soft marimba + wood
# layer, panned to the crash. Wall bounces = very quiet low wood tap. A knock-out = soft low thump + falling three-note marimba figure.
# The last knock-out = rolled low major chord. A low pad rises as fewer balls are left; a soft heartbeat fills quiet gaps before the end.
# Final mix in ffmpeg: lowpass 7.5k + high-shelf -4 dB @5k + loudnorm -14 LUFS / TP -2.5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',30);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=d['endT'];EV=V(ET);CX=d['CX'];m=Mix(D,d['seed'])
MEL=('C4 G3 C4 G3 C4 G3 C4 E4 G4 '
     'F4 D4 F4 D4 F4 D4 B3 D4 G3 '
     'C4 C4 C4 E4 D4 C4 C4 B3 B3 '
     'D4 D4 D4 F4 E4 D4 D4 C4 C4').split()
cr=[e for e in d['events'] if e['type']=='crash'];wl=[e for e in d['events'] if e['type']=='wall'];outs=[e for e in d['events'] if e['type']=='out']
for k,e in enumerate(cr):
    f=hz(MEL[k%len(MEL)]);g=.17+.05*min(1,e['v']/900);pan=(e['x']-CX)/520
    m.add(V(e['t']),m.marimba(f,g,.8),pan);m.add(V(e['t']),m.wood(f/2,g*.35),pan)
for e in wl:
    after=e['t']>ET;m.add(V(e['t']),m.wood(146.83,(.035+.025*min(1,e['v']/800))*(.6 if after else 1)),(e['x']-CX)/520)
for o in outs:
    v=V(o['t']);fin=abs(o['t']-ET)<1e-6;tt=np.arange(int(SR*.9))/SR
    m.add(v,(.11 if fin else .08)*np.sin(2*np.pi*(62+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
    if fin:
        for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0]):m.add(v+.03+i*.05,m.marimba(f,.13,.9),(i-2.5)*.25)
    else:
        for i,n in enumerate(['G3','E3','C3']):m.add(v+.08+i*.11,m.marimba(hz(n),.12,.8),(o['x']-CX)/520)
t=m.t
alive=np.full(len(t),4.0)
for o in outs:alive-=(t>=V(o['t']))
ten=np.clip((4-alive)/2.5,0,1)*(t<EV)+(t>=EV)*np.exp(-(t-EV)*1.0)*.6
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.35)])
m.bed(pad*.0065*(.45+.55*ten))
nt=sorted(V(e['t']) for e in cr if e['t']<=ET);hb=EV-5.0
while hb<EV-.35:
    prev=max([v for v in nt if v<=hb],default=-9);nxt=min([v for v in nt if v>hb],default=99)
    if hb-prev>.35 and nxt-hb>.35 and (nxt-prev)>.7:
        for dt,g in [(0,.10),(.16,.07)]:
            tt=np.arange(int(SR*.35))/SR;m.add(hb+dt,g*np.sin(2*np.pi*(52+20*np.exp(-tt*25))*tt)*(1-np.exp(-tt/.006))*np.exp(-tt*11))
        hb+=.62
    else:hb+=.1
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'crash notes',len(cr),'walls',len(wl),'outs',len(outs))
