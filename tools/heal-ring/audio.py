# Sound for "The wall HEALS": every hit = the next note of Ode to Joy (Beethoven, public domain) on a soft marimba, on the hit frame;
# a brick breaking adds a low wood knock + low marimba; a hole growing back = a very soft low marimba; a wall shattering = rolled
# major chord; breaking out = bigger rolled chord + soft thump. Soft pad bed that gets fuller with each wall down. All fundamentals <= C5.
# python3 audio.py data.js out.wav
import sys,json,numpy as np
sys.path.insert(0,__file__.rsplit('/',2)[0]);from sfx import Mix,hz,SR
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
TM=np.array(d['tmap']);VF=d.get('vfps',60);TV=np.arange(len(TM))/VF;V=lambda s:float(np.interp(s,TM,TV));D=len(TM)/VF;ET=V(d['escT']);CX=d['CX'];m=Mix(D,d['seed'])
ODE=('E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4 '
     'D4 D4 E4 C4 D4 E4 F4 E4 C4 D4 E4 F4 E4 D4 C4 D4 G3 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4').split()
ev=d['events'];hits=[e for e in ev if e['type']=='hit']
for k,e in enumerate(hits):
    f=hz(ODE[k%len(ODE)]);g=.17+.06*min(1,e['v']/900);pan=(e['x']-CX)/520;tt=V(e['t'])
    m.add(tt,m.marimba(f,g,.85),pan);m.add(tt,m.wood(f/2,g*.3),pan)
    if e['brk']:m.add(tt,m.wood(hz('C3'),.16),pan);m.add(tt,m.marimba(hz('C3'),.10,.6),pan)
for e in ev:
    if e['type']=='heal':m.add(V(e['t']),m.marimba(hz('G2'),.05,.5),0)
    if e['type']=='ring':
        for i,n in enumerate(['C3','E3','G3','C4']):m.add(V(e['t'])+.02+i*.045,m.marimba(hz(n),.12,.8),(i-1.5)*.3)
t=m.t;rt=[V(e['t']) for e in ev if e['type']=='ring']
lvl=sum((t>=r).astype(float) for r in rt[:2])
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.6),(261.63,.4)])
m.bed(pad*.006*(.55+.25*lvl)*(t<ET+.2)+pad*.006*1.05*np.exp(-np.maximum(0,t-ET-.2)*.8)*(t>=ET+.2))
for i,f in enumerate([130.81,164.81,196.0,261.63,329.63,392.0,523.25]):m.add(ET+.03+i*.05,m.marimba(f,.13,.9),(i-3)*.22)
tt=np.arange(int(SR*.9))/SR;m.add(ET,.08*np.sin(2*np.pi*(70+30*np.exp(-tt*8))*tt)*(1-np.exp(-tt/.012))*np.exp(-tt*5))
m.reverb();m.write(sys.argv[2]);print('dur',round(D,2),'hits',len(hits))
