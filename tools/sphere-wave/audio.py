import numpy as np, wave
SR=44100;D=16;n=SR*D;t=np.arange(n)/SR;out=np.zeros(n)
pent=[0,2,4,7,9,12,14,16]
def blip(t0,f,amp=.5,dec=7):
    i=int(t0*SR);m=min(n-i,int(SR*.9));tt=np.arange(m)/SR
    f_=f*(1+.04*np.exp(-tt*40))
    s=np.sin(2*np.pi*f_*tt)+.3*np.sin(4*np.pi*f_*tt)
    out[i:i+m]+=amp*s*np.exp(-tt*dec)*(1-np.exp(-tt*600))
for k in range(D*2):
    ph=(k%16)
    deg=pent[int(abs(((ph+8)%16)-8))%8] if False else pent[(ph if ph<8 else 15-ph)]
    blip(k*.5,261.6*2**(deg/12),.45)
    if k%2==0: blip(k*.5+.25,261.6*2**((deg+7)/12)*.5,.15,10)
# soft bass pad, loop-synced 8s
bass=np.sin(2*np.pi*55*t)*(0.5+0.5*np.sin(2*np.pi*t/8))*.25+np.sin(2*np.pi*82.4*t)*.08
out+=bass
# kick-like thump every 2s on the ripple start
for k in range(D//2):
    i=int(k*2*SR);m=int(SR*.35);tt=np.arange(m)/SR
    out[i:i+m]+=.5*np.sin(2*np.pi*(45+80*np.exp(-tt*25))*tt)*np.exp(-tt*9)
out=np.tanh(out*1.1);out/=np.abs(out).max()/0.89
# fade tail for loop smoothness
st=np.stack([out,out],1)
w=wave.open('/tmp/sw/a.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
