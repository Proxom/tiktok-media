# Sound for "It grows every bounce": each bounce = one tuned note whose pitch drops as the ball grows (bigger = deeper),
# played as a 4-note motif that walks down a C-major pentatonic; wall hits = marimba (wood), gap-cap hits = glockenspiel (metal).
# A soft pad rises in brightness/level with the BALL vs GAP ratio (tension); escape = rolled major chord, soft thump, sparkles.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);TV=np.arange(len(TM))/30.0;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/30;ET=V(d['escT']);CX=d['CX'];m=Mix(D,d['seed'])
SCALE=[hz(n) for n in 'C4 D4 E4 G4 A4 C5 D5 E5 G5 A5 C6 D6 E6'.split()]
MOTIF=[0,2,1,3]
bo=[e for e in d['events'] if e['type']=='bounce'];esc=[e for e in d['events'] if e['type']=='escape'][0]
q0=bo[0]['ratio']
for k,e in enumerate(bo):
    base=int(round((1-(e['ratio']-q0)/(1-q0))*(len(SCALE)-5)))  # high and small -> low and big
    f=SCALE[min(len(SCALE)-1,max(0,base+MOTIF[k%4]))]
    g=.15+.07*min(1,e['v']/800);pan=(e['x']-CX)/520
    if e['kind']=='wall':m.add(V(e['t']),m.marimba(f,g,.85),pan);m.add(V(e['t']),m.wood(f/2,g*.35),pan)
    else:m.add(V(e['t']),m.glock(f*(1 if f<900 else .5),g*.35),pan)
t=m.t
ratio=np.interp(t,[V(e['t']) for e in bo],[e['ratio'] for e in bo],left=q0)
ten=np.clip((ratio-.5)/.5,0,1)*(t<ET)+(t>=ET)*np.exp(-(t-ET)*1.0)*.6
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.4)])
hi=np.sin(2*np.pi*392.0*t+.2*np.sin(2*np.pi*.17*t))*.35+np.sin(2*np.pi*523.25*t)*.18
m.bed(pad*.0065*(.5+.5*ten)+hi*.004*ten**2)
for i,f in enumerate([261.63,329.63,392.0,523.25,659.25,783.99]):m.add(ET+.03+i*.05,m.marimba(f,.13,.9),(i-2.5)*.25)
tt=np.arange(int(SR*.9))/SR;m.add(ET,.08*np.sin(2*np.pi*(70+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
r=np.random.default_rng(4)
for k in range(14):m.add(ET+.2+k*.12+r.uniform(0,.04),m.glock(SCALE[-1-(k%6)]*(.5 if SCALE[-1-(k%6)]>1000 else 1),.03*(1-k/18)),r.uniform(-.8,.8))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'bounces',len(bo))
