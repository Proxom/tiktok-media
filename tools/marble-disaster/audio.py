# Sound for the marble DISASTER race (17:00 1M+ #4, family C, NO-SHRILL rules). Same base as marble-elim/audio.py; outs -> disasters: every GATE PASS plays the NEXT note of Grieg's
# "In the Hall of the Mountain King" (public domain; own arrangement, fundamentals A2..E4 <= 330 Hz) on a soft marimba + low wood layer, panned right (the gate).
# Peg / paddle / marble contacts = very quiet low wood taps (rate-limited). Trapdoor = soft low thump. An OUT = low thud + two falling marimba notes.
# The winning pass = rolled low A-major chord + swell. A quiet A-minor pad grows with every out. Final mix in make.sh: lowpass 7.5k + high-shelf -4 dB @5k
# + loudnorm -14 LUFS / TP -2.5.   python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF
def V(s):
    if s<TM[0]:return -1.0
    i=int(np.searchsorted(TM,s-1e-9));return float(TV[min(i,len(TV)-1)])
SEMI={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def hz(n):
    s=SEMI[n[0]]+(1 if '#' in n else 0);o=int(n[-1]);return 440*2**((s+12*(o+1)-69)/12)
D=len(TM)/VF;ET=d['endT'];EV=V(ET);m=Mix(D,d['seed']+7)
MEL='A2 B2 C3 D3 E3 C3 E3 D#3 B2 D#3 D3 A#2 D3 A2 B2 C3 D3 E3 C3 E3 A3 G3 E3 C3 E3 G3'.split()
ev=d['events'];gates=[e for e in ev if e['type']=='gate' and e['t']<=ET+1e-9];outs=[e for e in ev if e['type']=='disaster'];quakes=[e for e in ev if e['type']=='quake' and e['t']<ET]
for k,e in enumerate(gates):
    if abs(e['t']-ET)<1e-9:continue
    f=hz(MEL[k%len(MEL)])*2;m.add(V(e['t']),m.marimba(f,.21,.8),.55);m.add(V(e['t']),m.wood(f/2,.07),.55)
last=-9
for e in ev:
    if e['type'] not in('peg','spin','clack','tap') or e['t']>ET+2:continue
    v=V(e['t'])
    if v<0 or v-last<.05:continue
    last=v;g={'peg':.014,'spin':.022,'clack':.012,'tap':.008}[e['type']]*(.6+.4*min(1,e['v']/700))
    m.add(v,m.wood(185.0 if e['type']!='spin' else 130.81,g),(e['x']-490)/520)
tt=np.arange(int(SR*.7))/SR;thump=lambda a,f0:a*np.sin(2*np.pi*(f0+28*np.exp(-tt*9))*tt)*(1-np.exp(-tt/.01))*np.exp(-tt*6)
m.add(V(d['TOPEN']),thump(.07,70),0)
for o in outs:
    v=V(o['t']);m.add(v,thump(.10,52),0)
    m.add(v+.04,m.marimba(hz('A2'),.12,.9),0);m.add(v+.18,m.marimba(hz('C3'),.12,.9),0);m.add(v+.32,m.marimba(hz('E3'),.13,.9),0)
lq=-9
for q in quakes:
    v=V(q['t'])
    if v-lq<.29:continue
    lq=v;m.add(v,thump(.035,42),0)
v=EV;m.add(v,thump(.10,62),.3)
for i,n in enumerate(['A2','E3','A3','C#4','E4','A3']):m.add(v+.03+i*.06,m.marimba(hz(n),.15 if i<5 else .10,.9),(i-2.5)*.22)
t=m.t;lvl=np.zeros_like(t)
for k,o in enumerate(outs):lvl+= (t>=V(o['t']))*.14
env=(.35+lvl)*(t<EV)+(t>=EV)*(.9*np.exp(-(t-EV)*.6)+.1)
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.1*t+f)) for f,g in [(110.0,1),(164.81,.55),(220.0,.35),(261.63,.2)])
m.bed(pad*.006*env)
tt=np.arange(int(SR*2.4))/SR;m.add(EV,.06*np.sin(2*np.pi*55*tt)*(1-np.exp(-tt/.3))*np.exp(-tt*1.4))
m.reverb(wet=.3);m.write(sys.argv[2]);print('dur',round(D,2),'gate notes',len(gates),'disasters',len(outs),'quakes',len(quakes),'win at',round(EV,2))
