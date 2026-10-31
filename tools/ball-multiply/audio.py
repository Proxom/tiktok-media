# Sound for "Every bounce = +1 ball": each new ball = marimba note on a C-major pentatonic that climbs with the count
# (throttled to ~10 notes/s), escapes = soft glockenspiel pling panned to the ball, a quiet pad that swells with the count,
# ring break = rolled chord + soft warm thump + falling glass-like sparkles. python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
fps=d['fps'];D=len(d['frames'])/fps;BT=d['breakT'];CX=d['CX'];m=Mix(D,d['seed'])
SCALE=[hz(n) for n in 'G4 A4 C5 D5 E5 G5 A5 C6 D6 E6'.split()]
t=m.t;last=-1;lastE=-1
sp=[e for e in d['events'] if e['type']=='spawn']
for e in sp:
    if e['t']-last<.11:continue
    last=e['t'];i=min(len(SCALE)-1,int(np.log2(e['n']+1)*1.35));f=SCALE[i] if (e['n']%3) else SCALE[max(0,i-2)]
    m.add(e['t'],m.marimba(f,.16+.05*min(1,e['v']/500),.8),(e['x']-CX)/520)
for e in d['events']:
    if e['type']=='escape':
        if e['t']-lastE<.2 or min(abs(e['t']-q['t']) for q in sp)<.05:continue
        lastE=e['t'];m.add(e['t'],m.glock(SCALE[(e['esc']*2)%len(SCALE)]*(1 if SCALE[(e['esc']*2)%len(SCALE)]<1000 else .5),.04),(e['x']-CX)/520)
# pad swelling with the count until the break, then resolving
cnt=np.interp(t,[e['t'] for e in sp] or [0],[e['n'] for e in sp] or [1]);sw=np.clip(np.log2(cnt+1)/7.3,0,1)*(t<BT)+(t>=BT)*np.exp(-(t-BT)*1.2)
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.13*t+f)) for f,g in [(130.81,1),(196.0,.7),(261.63,.45),(392.0,.25*sw.mean()+.1)])
m.bed(pad*.007*(.35+.65*sw))
# finale
for i,f in enumerate([261.63,329.63,392.0,523.25,659.25,783.99]):m.add(BT+.02+i*.04,m.marimba(f,.14,.9),(i-2.5)*.25)
tt=np.arange(int(SR*.9))/SR;m.add(BT,.10*np.sin(2*np.pi*(70+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
r=np.random.default_rng(4)
for k in range(16):m.add(BT+.15+k*.11+r.uniform(0,.04),m.glock(SCALE[-1-(k%6)]*(.5 if k%2 else 1),.03*(1-k/20)),r.uniform(-.8,.8))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2))
