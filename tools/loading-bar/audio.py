import numpy as np,wave
SR=44100;y=np.zeros(int(16.5*SR))
def add(t,s,g=1):
    i=int(t*SR);s=s[:len(y)-i];y[i:i+len(s)]+=s*g
def tone(f,l,dec=18,f2=None):
    t=np.arange(int(l*SR))/SR;ff=np.full(len(t),f) if f2 is None else np.linspace(f,f2,len(t))
    return np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-dec*t)
for k in range(11): add(k*0.5,tone(90,.2,14,50),.3)          # soft beat
for k in range(int(5.5/0.25)): add(k*.25,tone(500+k*25,.05,60),.15)  # fill ticks rising
for k in range(12): add(5.5+k*.5,tone(300,.08,40),.12)       # stalled ticks
r=np.linspace(0,1,int(.7*SR));add(11.5,np.sin(2*np.pi*np.cumsum(400+1200*r)/SR)*r*.3)
for i,f in enumerate([523,659,784,1047]): add(12.2+i*.1,tone(f,.5,5),.35)
add(13.6,tone(500,.4,6,120),.6)   # sad slide
y=np.tanh(y*1.3);y/=abs(y).max();y*=.8
w=wave.open('audio.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((y*32767).astype(np.int16).tobytes());w.close()
