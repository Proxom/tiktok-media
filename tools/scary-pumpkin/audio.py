# Original audio for scary-pumpkin (13 s): night bed (wind, crickets), music-box loop in A minor, low drone,
# thunder at 3.2, spider zip-drop + thread boing, cute chirps, "eep" squeal + jump boing at 7.6, candle sputter,
# puff out, sad descending tones, ratchet climb, relight whoosh for the loop.
import numpy as np, wave, sys
SR=44100;D=13;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n);rng=np.random.default_rng(31);TS=7.6
def add(t0,sig,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig));out[i:i+m]+=g*sig[:m]
def lp(x,k=30):return np.convolve(x,np.ones(k)/k,'same')
def env(m,a=.004,dec=8):
    tt=np.arange(m)/SR;return tt,(1-np.exp(-tt/a))*np.exp(-tt*dec)
def bell(f,dur=.8,amp=.1):
    m=int(SR*dur);tt,e=env(m,.001,5);return amp*e*(np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*2.76*f*tt)*np.exp(-tt*9))
def gliss(t0,dur,f0,f1,amp,vib=0,harm=.15):
    m=int(SR*dur);tt=np.arange(m)/SR;f=f0*(f1/f0)**(tt/dur)+vib*np.sin(2*np.pi*9*tt);ph=2*np.pi*np.cumsum(f)/SR
    e=np.clip(np.minimum(tt/.02,(dur-tt)/.05),0,1);add(t0,amp*e*(np.sin(ph)+harm*np.sin(2*ph)))
def boing(t0,f,amp,dur=.5):
    m=int(SR*dur);tt,e=env(m,.003,6);add(t0,amp*np.sin(2*np.pi*(f+f*.5*np.sin(2*np.pi*12*tt)*np.exp(-tt*4))*tt)*e)
# night bed: wind + crickets (always on, so no silent gaps)
wind=lp(rng.standard_normal(n),200);wind/=np.abs(wind).max();out+=.05*wind*(.6+.4*np.sin(2*np.pi*.15*t))
for c0 in np.arange(0.2,D,.9):
    for k in range(3):
        m=int(SR*.03);tt,e=env(m,.001,120);add(c0+k*.05,.02*np.sin(2*np.pi*4400*tt)*e)
# low menace drone until the twist
dr=(np.sin(2*np.pi*55*t)+.5*np.sin(2*np.pi*82.4*t+np.sin(2*np.pi*.3*t)))*np.clip(t/1.0,0,1)*np.clip((TS-t)/.15,0,1)
out+=.05*dr
# music box loop (A minor arpeggio), stops at the twist, a softer bit back at the end
arp=[440,523.3,659.3,523.3,440,587.3,698.5,587.3];tb=0;k=0
while tb<D-.3:
    if tb<TS-.1 or tb>11.6:add(tb,bell(arp[k%8],.7,.06 if tb<TS else .035))
    tb+=.3;k+=1
# thunder 0.9
m=int(SR*2.2);tt=np.arange(m)/SR;nz=lp(rng.standard_normal(m),60);add(0.9,.55*nz*np.exp(-tt*1.6)*(1-np.exp(-tt/.02))/np.abs(nz).max()*3)
# spider zip-drop 5.2 + thread boing + little chirps while waving
gliss(5.2,.35,1600,500,.10,harm=.05);boing(5.55,420,.18,.6)
for i,c0 in enumerate([6.05,6.35,6.65,6.95]):gliss(c0,.09,1800+i*120,2600+i*120,.06,harm=0)
# twist: "eep" squeal (synth, rising, wobbly) + jump boing + scrape
gliss(TS,.45,700,1700,.16,vib=60,harm=.35);boing(TS,150,.4,.55)
m=int(SR*.12);tt,e=env(m,.0005,30);add(TS,.5*np.sin(2*np.pi*(60+60*np.exp(-tt*30))*tt)*e)
# candle sputter crackles, then puff out
for c0 in np.arange(TS+.5,TS+1.1,.075):
    m=int(SR*.03);tt,e=env(m,.0005,90);add(c0+rng.uniform(0,.03),.12*lp(rng.standard_normal(m),2)*e)
m=int(SR*.35);tt=np.arange(m)/SR;add(TS+1.15,.22*lp(rng.standard_normal(m),8)*np.sin(np.pi*np.clip(tt/.35,0,1)))
# sad descending tones in the dark
for i,f in enumerate([392,349.2,329.6,293.7]):add(TS+1.6+i*.38,bell(f,.9,.06))
# spider climbs back up: ratchet ticks rising
for i,c0 in enumerate(np.arange(10.4,11.8,.07)):
    m=int(SR*.02);tt,e=env(m,.0005,150);add(c0,.05*np.sin(2*np.pi*(900+i*25)*tt)*e)
# relight whoosh for the loop
m=int(SR*.6);tt=np.arange(m)/SR;add(12.4,.18*lp(rng.standard_normal(m),6)*np.sin(np.pi*np.clip(tt/.6,0,1))**2)
out=np.tanh(out*1.3);out/=np.abs(out).max()/0.89
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
