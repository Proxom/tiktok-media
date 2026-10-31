# Shared sound-design helpers (AUDIO QUALITY UPGRADE rules): modal-synthesis instruments with soft attacks and
# per-hit variation, equal-power stereo panning, generated stereo reverb, a quiet bed, 16-bit stereo writer.
# Final level is set in ffmpeg (highpass 38, lowpass 9500, compressor, loudnorm I=-20 TP=-3.5).
import numpy as np, wave
SR=44100
NAMES='C D E F G A B'.split();SEMI=[0,2,4,5,7,9,11]
def hz(n):return 440*2**((SEMI[NAMES.index(n[0])]+12*(int(n[-1])+1)-69)/12)
MARIMBA=[(1,1.0,4.2),(3.93,.28,14),(9.2,.07,40),(2.0,.05,9)]
GLOCK=[(1,1.0,2.0),(2.76,.30,4.5),(5.4,.10,9),(8.93,.04,16)]
WOOD=[(1,1.0,22),(2.31,.5,35),(4.1,.25,60)]
class Mix:
    def __init__(s,dur,seed=1):
        s.n=int(SR*dur);s.t=np.arange(s.n)/SR;s.L=np.zeros(s.n);s.R=np.zeros(s.n);s.rng=np.random.default_rng(seed)
    def add(s,t0,sig,pan=0.0,g=1.0):
        i=int(t0*SR);m=min(s.n-i,len(sig))
        if m<=0 or i<0:return
        a=(np.clip(pan,-1,1)+1)*np.pi/4;s.L[i:i+m]+=g*np.cos(a)*sig[:m];s.R[i:i+m]+=g*np.sin(a)*sig[:m]
    def bed(s,sig,width=.02):
        s.L+=sig*(1+width);s.R+=sig*(1-width)
    def modal(s,f,partials,dur,amp,bright=1.0,attack=.0025):
        m=int(SR*dur);tt=np.arange(m)/SR;out=np.zeros(m);r=s.rng
        for ratio,g,dec in partials:
            fr=f*ratio*(1+r.uniform(-.0015,.0015))
            if fr>9000:continue
            out+=g*(bright if ratio>1.5 else 1)*np.sin(2*np.pi*fr*tt+r.uniform(0,6.28))*np.exp(-tt*dec*r.uniform(.97,1.03))
        out*=1-np.exp(-tt/attack)
        k=int(SR*.004);nz=np.convolve(r.standard_normal(k),np.ones(6)/6,'same')*np.hanning(k)*.05*bright;out[:k]+=nz
        return amp*r.uniform(.97,1.03)*out
    def marimba(s,f,amp,b=1):return s.modal(f,MARIMBA,1.4,amp,b)
    def glock(s,f,amp):return s.modal(f,GLOCK,2.2,amp,.8)
    def wood(s,f,amp):return s.modal(f,WOOD,.25,amp,.8,.001)
    def ir(s,seed,sec=1.0,dec=6.5):
        r=np.random.default_rng(seed);m=int(SR*sec);tt=np.arange(m)/SR
        x=r.standard_normal(m)*np.exp(-tt*dec);x=np.convolve(x,np.ones(5)/5,'same');x[:int(SR*.012)]=0;return x/np.sqrt((x**2).sum())
    def reverb(s,wet=.30,dry=.82,sec=1.0):
        def conv(a,b):
            N=1<<int(np.ceil(np.log2(len(a)+len(b))));return np.fft.irfft(np.fft.rfft(a,N)*np.fft.rfft(b,N),N)[:len(a)]
        L,R=s.L.copy(),s.R.copy();s.L=L*dry+conv(L,s.ir(11,sec))*wet;s.R=R*dry+conv(R,s.ir(12,sec))*wet
    def write(s,path,fade_out=.5,peak=.7):
        D=s.n/SR;fade=np.clip((D-s.t)/fade_out,0,1)*np.clip(s.t/.03,0,1);st=np.stack([s.L*fade,s.R*fade],1);st/=np.abs(st).max()/peak
        w=wave.open(path,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
