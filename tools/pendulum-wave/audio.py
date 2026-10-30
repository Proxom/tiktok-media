# Original audio for pendulum-wave (20 s loop): each ball plays a soft marimba note when it swings through the centre,
# pitched by ball index on a pentatonic scale, so the realignment at 0 s / 20 s lands as a chord. Plus a low pad.
import numpy as np, wave, sys
SR=44100;D=20;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n)
N=15;N0=12;CYCLE=20
pent=[0,2,4,7,9]
def note(t0,f,amp):
    i=int(t0*SR)%n;m=int(SR*.6);tt=np.arange(m)/SR
    s=(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*30))*np.exp(-tt*7)*(1-np.exp(-tt*800))*amp
    j=min(n,i+m);out[i:j]+=s[:j-i]
    if i+m>n: out[:i+m-n]+=s[j-i:]   # wrap for a seamless loop
for k in range(N):
    f=(N0+k)/CYCLE;freq=220*2**((pent[k%5]+12*(k//5))/12)
    # centre crossings: cos(2*pi*f*t)=0 -> t=(m+.5)/(2f)
    m=0
    while True:
        tc=(m+.5)/(2*f)
        if tc>=D: break
        note(tc,freq,.10);m+=1
# realignment chime at the loop point (t=0)
for i,f in enumerate([523.25,659.25,783.99,1046.5]):
    m=int(SR*1.6);tt=np.arange(m)/SR;s_=.12*np.sin(2*np.pi*f*tt)*np.exp(-tt*2.5)*(1-np.exp(-tt*600));out[:m]+=s_
# countdown ticks at 17,18,19
for c0 in [17,18,19]:
    m=int(SR*.12);tt=np.arange(m)/SR;i=int(c0*SR);out[i:i+m]+=.25*np.sin(2*np.pi*1760*tt)*np.exp(-tt*40)
pad=sum(a*np.sin(2*np.pi*fr*t) for fr,a in [(55,.12),(82.41,.06),(110,.05)])*(.75+.25*np.cos(2*np.pi*t/D))
out+=pad
rng=np.random.default_rng(1);out+=.003*np.convolve(rng.standard_normal(n),np.ones(20)/20,'same')
out=np.tanh(out*1.1);out/=np.abs(out).max()/0.9
st=np.stack([out,out],1)
w=wave.open(sys.argv[1],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
