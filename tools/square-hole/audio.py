# Original audio for square-hole (15 s): soft marimba loop, whooshes, wooden thunk + ding on each fit,
# slide whistle when the star changes its mind, rising plops into the square hole, cube "hmm", squish squeak, pop + sting.
import numpy as np, wave, sys
SR=44100;D=15;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(11)
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=g*sig[:m]
def lp(x,k=30):return np.convolve(x,np.ones(k)/k,'same')
def env(m,a=.004,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def mar(f,dur=.5,amp=.12):
    m=int(SR*dur);tt,e=env(m,.002,9);return amp*e*(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*30))
def whoosh(t0,dur=.6,amp=.18):
    m=int(SR*dur);tt=np.arange(m)/SR;nz=lp(rng.standard_normal(m),5)-lp(rng.standard_normal(m),40)
    add(t0,amp*nz*np.sin(np.pi*np.clip(tt/dur,0,1))**2)
def thunk(t0,f=140,amp=.6):
    m=int(SR*.35);tt,e=env(m,.001,22);add(t0,amp*(np.sin(2*np.pi*(f+90*np.exp(-tt*40))*tt)+.4*lp(rng.standard_normal(m),3)*np.exp(-tt*60))*e)
def ding(t0,f=1568,amp=.16):
    m=int(SR*1.0);tt,e=env(m,.002,4);add(t0,amp*e*(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*f*2.01*tt)*np.exp(-tt*6)))
def boing(t0,f,amp,dur=.5):
    m=int(SR*dur);tt,e=env(m,.003,6);add(t0,amp*np.sin(2*np.pi*(f+f*.5*np.sin(2*np.pi*12*tt)*np.exp(-tt*4))*tt)*e)
def gliss(t0,dur,f0,f1,amp,vib=0):
    m=int(SR*dur);tt=np.arange(m)/SR;f=f0*(f1/f0)**(tt/dur)+vib*np.sin(2*np.pi*7*tt);ph=2*np.pi*np.cumsum(f)/SR
    e=np.clip(np.minimum(tt/.03,(dur-tt)/.06),0,1);add(t0,amp*e*(np.sin(ph)+.15*np.sin(3*ph)))
# room tone + soft pad (never silent)
out+=.004*lp(rng.standard_normal(n),60)
pad=np.zeros(n)
for f in [130.8,196.0,261.6]:pad+=np.sin(2*np.pi*f*t+np.sin(2*np.pi*.2*t))
out+=.012*pad*(.6+.4*np.sin(2*np.pi*t/D))
# marimba loop (C major pentatonic), 100 bpm eighths; ducks for the cube beat 10.3-13.3
notes=[523.3,659.3,784.0,659.3,880.0,784.0,659.3,587.3];step=60/100/2
k=0;tb=0.0
while tb<D-.4:
    duck=.35 if 10.3<tb<13.75 else 1.0
    add(tb,mar(notes[k%8]/2 if k%4==0 else notes[k%8],amp=.07*duck));tb+=step;k+=1
# 1) circle + 2) triangle: clean fits
whoosh(0.0,.8);thunk(1.37,150);ding(1.42,1568)
whoosh(1.35,.75);thunk(2.67,150);ding(2.72,1760)
# 3) star: arrives, hesitant ticks while lining up, slide whistle to the square hole, dull boop
whoosh(2.75,.8)
for i,tk in enumerate(np.arange(3.6,4.5,.15)):add(tk,mar(1200+i*40,.08,.05))
gliss(4.55,.62,900,500,.16,vib=30);thunk(5.57,110,.65);boing(5.6,160,.25,.45)
# 4) everything else into the square hole: quick plops climbing in pitch
for i,(t0,td) in enumerate([(6.05,6.6),(6.85,7.35),(7.55,8.0),(8.15,8.6),(8.75,9.2)]):
    whoosh(t0,.45,.12);thunk(td+.32,130+i*18,.55);add(td+.33,mar(660*(1.12**i),.25,.10))
# box rattle 9.2-9.6
for i in range(6):thunk(9.22+i*.06,220+20*(i%2),.18)
# 5) cube: whoosh in, two questioning blips, blink, hop boing, stretch squeak, slow squeeze, pop + sting
add(12.2,mar(1500,.06,.05))
whoosh(10.2,.9);gliss(11.15,.18,420,520,.09);gliss(11.45,.22,420,620,.09)
boing(11.8,240,.3,.5)
gliss(12.45,.35,300,900,.12,vib=20)
m=int(SR*.8);tt=np.arange(m)/SR;add(12.95,.14*np.sin(2*np.pi*(700+300*tt+400*np.sin(2*np.pi*14*tt))*tt)*np.clip((.8-tt)/.1,0,1))
m=int(SR*.12);tt,e=env(m,.0005,40);add(13.72,.7*np.sin(2*np.pi*(900*np.exp(-tt*30)+120)*tt)*e)
for f in [523.3,659.3,784.0,1046.5]:add(13.78,mar(f,1.2,.08))
# loop tail fade
out*=np.clip((D-t)/.15,0,1)*.6+.4
out=np.tanh(out*1.2);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
