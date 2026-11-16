# tools/faces/voice.py — soft synthesised ball voices (Erkan 15 Nov 2026). No samples, no sound libraries: pure additive synthesis.
#   eep    tiny rising "ee"            when a ball becomes scared
#   oof    short falling "oo"          on a hard hit
#   giggle 3 soft "he" syllables       on winning
#   ooo    long falling "ooo"          when eliminated
# Each ball has its own pitch factor (plan.js 'pitch'). NEVER NOISY: harmonics only below 3.4 kHz plus a smooth FFT low-pass
# (nothing above ~4 kHz), 8-20 ms attack, soft release, no noise (no hiss), voices sit 12 dB below the engine's impact sounds.
# usage inside an engine's audio.py (after the hit sounds, before m.reverb()):
#   sys.path.insert(0, <tools>/faces); import voice
#   voice.add_voices(m, d['faces']['voices'], V, ref=.17, pan=lambda b,t: ...)   # ref = typical peak of one impact sound in that mix
import numpy as np
SR=44100
VOW={'ee':[(320,90,1),(2150,180,.22),(2800,220,.08)],'oo':[(330,90,1),(780,120,.45)],'o':[(480,100,1),(880,140,.5)],'eh':[(460,100,1),(1850,180,.25)]}
def _formant(f,vw):
    return sum(g*np.exp(-.5*((f-F)/bw)**2) for F,bw,g in VOW[vw])+.04/(1+f/400)
def _lowpass(x,f0=3300,f1=4000):
    N=1<<int(np.ceil(np.log2(len(x)+1)));X=np.fft.rfft(x,N);fr=np.fft.rfftfreq(N,1/SR);w=np.clip((f1-fr)/(f1-f0),0,1);w=w*w*(3-2*w);return np.fft.irfft(X*w,N)[:len(x)]
def _env(n,att,rel):
    t=np.arange(n)/SR;e=np.ones(n);a=int(att*SR);r=int(rel*SR);e[:a]=.5-.5*np.cos(np.pi*np.arange(a)/a);e[n-r:]*=.5+.5*np.cos(np.pi*np.arange(r)/r);return e
def _syl(f0,vw,att=.012,rel=.06,vw2=None):
    n=len(f0);ph=2*np.pi*np.cumsum(f0)/SR;out=np.zeros(n);mix=np.linspace(0,1,n) if vw2 else None
    for k in range(1,40):
        fk=k*f0
        if fk.min()>3400:break
        a=_formant(fk,vw)*(1-mix)+_formant(fk,vw2)*mix if vw2 else _formant(fk,vw)
        a=a*(fk<3400)/k**.6;out+=a*np.sin(k*ph)
    return out*_env(n,att,rel)
def sound(kind,p=1.0,seed=0):
    r=np.random.default_rng(seed);j=1+r.uniform(-.03,.03)
    if kind=='eep':
        n=int(.18*SR);u=np.linspace(0,1,n);s=_syl(p*j*(330+110*u**.7),'ee',.012,.07)
    elif kind=='oof':
        n=int(.24*SR);u=np.linspace(0,1,n);s=_syl(p*j*(240-75*u),'oo',.008,.09)
    elif kind=='giggle':
        parts=[]
        for q,f in enumerate([390,410,370]):
            n=int(.1*SR);u=np.linspace(0,1,n);parts.append(_syl(p*j*f*(1.04-.08*u),'eh',.01,.05));parts.append(np.zeros(int(.07*SR)))
        s=np.concatenate(parts[:-1])
    elif kind=='ooo':
        n=int(.75*SR);u=np.linspace(0,1,n);t=np.arange(n)/SR;f=p*j*(150+210*np.exp(-u*2.2))*(1+.02*np.sin(2*np.pi*5.5*t)*u)
        s=_syl(f,'oo',.02,.16,vw2='o')
    else:raise ValueError(kind)
    s=_lowpass(s);return s/np.abs(s).max()
def add_voices(m,voices,V=lambda t:t,ref=.17,db=-12.0,pan=None):
    """Add voices to an sfx.Mix. V maps sim time -> video time (slow-motion map). Peak of each voice = ref * 10^(db/20)."""
    g=ref*10**(db/20);n=0
    for k,v in enumerate(voices):
        s=sound(v['kind'],v.get('pitch',1),k+1)*g*(1.1 if v['kind'] in('ooo','giggle') else 1)
        m.add(V(v['t']),s,pan(v['b'],v['t'])*.6 if pan else 0);n+=1
    return n
if __name__=='__main__':
    # demo: python3 voice.py out.wav -> every voice at 3 pitches (for a listen / spectrum check)
    import sys,wave
    seq=[];t=.3
    for p in(.88,1.0,1.14):
        for kd in('eep','oof','giggle','ooo'):
            s=sound(kd,p);seq.append((t,s));t+=len(s)/SR+.35
    out=np.zeros(int((t+.5)*SR))
    for t0,s in seq:i=int(t0*SR);out[i:i+len(s)]+=.5*s
    w=wave.open(sys.argv[1],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype('<i2').tobytes());w.close();print('demo',round(t,2),'s')
