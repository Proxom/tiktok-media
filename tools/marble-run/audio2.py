# Marble music v2 sound design (AUDIO QUALITY UPGRADE): modal-synthesis marimba on planks (melody notes),
# soft glockenspiel echo on metal deflectors, low rolling rumble while in contact, quiet warm pad, generated stereo reverb,
# equal-power pan from the marble x; the finish lands a rolled chord + sparkles held ~2.5 s.
# python3 audio2.py data.js out.wav [melody]   (master/loudness is done in ffmpeg, see README)
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
MEL=sys.argv[3] if len(sys.argv)>3 else 'twinkle'
NAMES='C D E F G A B'.split();SEMI=[0,2,4,5,7,9,11]
def hz(n):return 440*2**((SEMI[NAMES.index(n[0])]+12*(int(n[-1])+1)-69)/12)
MELODIES={  # public-domain melodies, one note per plank hit
 'twinkle':'C5 C5 G5 G5 A5 A5 G5 F5 F5 E5 E5 D5 D5 C5 G5 G5 F5 F5 E5 E5 D5 G5 G5 F5 F5 E5 E5 D5 C5 C5 G5 G5 A5 A5 G5 F5 F5 E5 E5 D5 D5 C5',
 'jingle':'E5 E5 E5 E5 E5 E5 E5 G5 C5 D5 E5 F5 F5 F5 F5 F5 E5 E5 E5 E5 D5 D5 E5 D5 G5 E5 E5 E5 E5 E5 E5 E5 G5 C5 D5 E5 G5 G5 F5 D5 C5 C5',
 'ode':'E5 E5 F5 G5 G5 F5 E5 D5 C5 C5 D5 E5 E5 D5 D5 E5 E5 F5 G5 G5 F5 E5 D5 C5 C5 D5 E5 D5 C5 C5',
}
notes=[hz(n) for n in MELODIES[MEL].split()]
SR=44100;fps=d['fps'];D=len(d['frames'])/fps;n=int(SR*D);t=np.arange(n)/SR
L=np.zeros(n);R=np.zeros(n);rng=np.random.default_rng(int(d.get('seed',1)))
xs=[p.get('x1',p.get('x',0)) for p in d['pieces']];XC=(min(xs)+max(xs))/2;XW=(max(xs)-min(xs))/2 or 1
def add(t0,sig,pan=0.0,g=1.0):
    i=int(t0*SR);m=min(n-i,len(sig))
    if m<=0:return
    a=(np.clip(pan,-1,1)+1)*np.pi/4;L[i:i+m]+=g*np.cos(a)*sig[:m];R[i:i+m]+=g*np.sin(a)*sig[:m]
def modal(f,partials,dur,amp,bright=1.0):
    m=int(SR*dur);tt=np.arange(m)/SR;out=np.zeros(m)
    for ratio,g,dec in partials:
        fr=f*ratio*(1+rng.uniform(-.0015,.0015))
        if fr>9000:continue
        out+=g*(bright if ratio>1.5 else 1)*np.sin(2*np.pi*fr*tt+rng.uniform(0,6.28))*np.exp(-tt*dec*rng.uniform(.97,1.03))
    att=1-np.exp(-tt/0.0025)  # soft attack, no click
    # mallet contact: 3 ms band-limited noise
    k=int(SR*.004);nz=np.convolve(rng.standard_normal(k),np.ones(6)/6,'same')*np.hanning(k)*.06*bright
    out[:k]+=nz;return amp*att*out
MARIMBA=[(1,1.0,4.2),(3.93,.28,14),(9.2,.07,40),(2.0,.05,9)]
GLOCK=[(1,1.0,2.0),(2.76,.30,4.5),(5.4,.10,9),(8.93,.04,16)]
def marimba(f,amp,b=1):return modal(f,MARIMBA,1.4,amp,b)
def glock(f,amp):return modal(f,GLOCK,2.2,amp,.8)
# rolling rumble while in contact (low-passed, quiet, follows speed)
fr=np.array(d['frames']);sp=np.repeat(fr[:,4]*fr[:,3],SR//fps);sp=np.pad(sp,(0,max(0,n-len(sp))))[:n]
sp=np.convolve(sp,np.ones(1500)/1500,'same')
nz=rng.standard_normal(n)
for w in (40,40):nz=np.convolve(nz,np.ones(w)/w,'same')  # ~ <600 Hz
roll=nz*np.clip(sp/700,0,1)*.05;L+=roll;R+=roll
# warm pad (C major, slow swell) far below the notes
pad=sum(g*np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.11*t+f)) for f,g in [(130.81,1),(196.0,.7),(261.63,.5),(329.63,.25)])
pad*=.006*(.75+.25*np.sin(2*np.pi*t/9))*np.clip(t/1.0,0,1)
L+=pad*1.02;R+=pad*.98
k=0;prev=notes[0]
for h in d['hits']:
    v=min(1,h['v']/700);pan=.55*(h['x']-XC)/XW
    if h['kind']=='plank' and k<len(notes):
        f=notes[k];k+=1;prev=f
        add(h['t'],marimba(f,.20+.10*v,.7+.5*v),pan)
    elif h['kind']=='bell':
        add(h['t'],glock(prev*2 if prev*2<1800 else prev,.045+.03*v),pan)
    else:
        add(h['t'],marimba(notes[-1]/2,.06+.05*v,.6),pan)  # soft wooden thud in the cup
FIN=d['finish']
for i,f in enumerate([261.63,329.63,392.0,523.25,659.25]):add(FIN+.04+i*.045,marimba(f,.13,.8),(i-2)*.25)
for i,f in enumerate([1046.5,1318.5,1568.0,1046.5,1318.5,1568.0,2093.0/2*1.5]):add(FIN+.45+i*.16,glock(f,.035),(-1)**i*.4)
# second, softer chord when the camera reveals the whole course
for i,f in enumerate([523.25,659.25,783.99,1046.5]):add(FIN+1.7+i*.07,marimba(f,.08,.6),(i-1.5)*.3)
for i,f in enumerate([261.63,392.0]):add(FIN+1.7,marimba(f,.07,.5),(i-.5)*.4)
# generated stereo reverb (exp-decaying low-passed noise, 1.0 s), ~20 % wet
def ir(seed):
    r=np.random.default_rng(seed);m=int(SR*1.0);tt=np.arange(m)/SR
    x=r.standard_normal(m)*np.exp(-tt*6.5);x=np.convolve(x,np.ones(5)/5,'same');x[:int(SR*.012)]=0;return x/np.sqrt((x**2).sum())
def conv(a,b):
    N=1<<int(np.ceil(np.log2(len(a)+len(b))));return np.fft.irfft(np.fft.rfft(a,N)*np.fft.rfft(b,N),N)[:len(a)]
dryL,dryR=L.copy(),R.copy()
L=dryL*.82+conv(dryL,ir(11))*.30;R=dryR*.82+conv(dryR,ir(12))*.30
fade=np.clip((D-t)/0.5,0,1)*np.clip(t/0.03,0,1);L*=fade;R*=fade
st=np.stack([L,R],1);st/=np.abs(st).max()/0.7
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
print('melody notes used',k,'of',len(notes),'dur',round(D,2))
