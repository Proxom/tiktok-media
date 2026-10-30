# Original audio for sort-race: a short blip per frame for each running algorithm (pitch = value of compared bar),
# panned per lane, a ding on each finish, a riser-free win chord at the end, soft beat underneath.
import numpy as np, wave, sys, json
d=json.loads(open(sys.argv[1]).read().split('=',1)[1].rstrip(';\n'))
SR=44100;D=14;n=SR*D;FPS=30;STEP=3;GO=2.0;L=np.zeros(n);R=np.zeros(n)
names=['BUBBLE','INSERTION','MERGE','QUICK'];pan=[.2,.4,.6,.8];N=d['N']
def add(t0,sig,p=.5):
    i=int(t0*SR);m=min(n-i,len(sig));L[i:i+m]+=sig[:m]*(1-p)*1.4;R[i:i+m]+=sig[:m]*p*1.4
fins=[]
for k,nm in enumerate(names):
    log=d['algos'][nm];fins.append(GO+(len(log)-1)/STEP/FPS)
    for f in range(0,(len(log)-1)//STEP+1):
        st=log[min(len(log)-1,f*STEP)]
        if not st['h']:continue
        v=st['a'][st['h'][0]];fr=180*2**(v/N*2.5);m=int(SR/FPS*1.4);tt=np.arange(m)/SR
        add(GO+f/FPS,.07*np.sin(2*np.pi*fr*tt)*np.exp(-tt*35)*(1-np.exp(-tt*2000)),pan[k])
order=sorted(range(4),key=lambda k:fins[k])
for r,k in enumerate(order):
    m=int(SR*1.0);tt=np.arange(m)/SR
    if r<3:
        for i,f in enumerate([880,1108.7,1318.5][:3-r]):add(fins[k]+i*.06,.18*np.sin(2*np.pi*f*tt)*np.exp(-tt*4),pan[k])
    else:
        for i,f in enumerate([523.25,659.25,783.99,1046.5]):add(fins[k]+.2+i*.1,.2*np.sin(2*np.pi*f*tt)*np.exp(-tt*2.5))
# intro: 3 ticks + go whoosh
for i in range(3):
    m=int(SR*.08);tt=np.arange(m)/SR;add(.5+i*.5,.3*np.sin(2*np.pi*1500*tt)*np.exp(-tt*60))
m=int(SR*.6);tt=np.arange(m)/SR;add(GO,.3*np.sin(2*np.pi*np.cumsum(200+900*tt)/SR)*np.exp(-tt*5))
t=np.arange(n)/SR
beat=np.zeros(n)
for b in np.arange(GO,13.5,.5):
    i=int(b*SR);m=int(SR*.2);tt=np.arange(m)/SR;beat[i:i+m]+=.3*np.sin(2*np.pi*(50+60*np.exp(-tt*30))*tt)*np.exp(-tt*12)
pad=.05*np.sin(2*np.pi*65.4*t)+.03*np.sin(2*np.pi*98*t)
L+=beat+pad;R+=beat+pad
st=np.stack([L,R],1);st=np.tanh(st*1.2);st/=np.abs(st).max()/0.9
w=wave.open(sys.argv[2],'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes());w.close()
