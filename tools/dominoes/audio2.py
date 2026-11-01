# Domino audio v2 (AUDIO QUALITY UPGRADE): modal-synthesis sounds from tools/sfx.py, each on its physical event.
# click = domino i strikes domino i+1 (exactly t[i+1], the contact moment from gen.js), the starter ball's tap at t[0],
# a softer, lower knock when the last domino lands flat; a marimba note every 5th domino climbing a pentatonic scale;
# warm pad underneath; finale = marimba chord + glockenspiel sparkle + bell. python3 audio2.py data.js out.wav
import sys, os, json, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from sfx import Mix, hz
d = json.loads(open(sys.argv[1]).read().split('=', 1)[1].rstrip(';\n'))
N, T, END = d['N'], d['t'], d['tEnd']
DUR = END + (3.8 if d.get('ang') else 1.6)
mx = Mix(DUR, seed=9); r = mx.rng
PENTA = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6']
# starter ball rolling in: very soft low wood rumble made of tiny taps, then the tap on domino 0
for k in range(int(T[0] / .05)):
    mx.add(k * .05, mx.wood(hz('C3') * r.uniform(.95, 1.05), .012 * (k * .05 / T[0])), -.2)
mx.add(T[0], mx.wood(hz('G5'), .16), 0)
for i in range(1, N):  # domino i-1 hits domino i
    v = r.uniform(.85, 1.0)
    mx.add(T[i], mx.wood(hz('E5') * r.uniform(.96, 1.04), .13 * v), float(r.uniform(-.15, .15)))
    if i % 5 == 0:
        k = min(len(PENTA) - 1, (i // 5) * len(PENTA) // (N // 5 + 1))
        mx.add(T[i], mx.marimba(hz(PENTA[k]), .16 + .06 * i / N, .9), 0)
last = T[N - 1] + d['D']  # last domino lands flat
mx.add(last, mx.wood(hz('A3'), .22), 0)
for n, p in [('C3', 0), ('C4', -.3), ('E4', .3), ('G4', -.2), ('C5', .2)]:
    mx.add(last + .02, mx.marimba(hz(n), .45, 1.0), p)
for i, n in enumerate(['C6', 'E6', 'G6', 'C7', 'G6', 'E6']):
    mx.add(last + .15 + i * .12, mx.glock(hz(n), .10 * (1 - i / 9)), -.4 + .16 * i)
mx.add(last + .05, mx.glock(hz('C6'), .16), 0)
t = mx.t; sw = .7 + .3 * np.clip(t / END, 0, 1)
pad = sum(a * np.sin(2 * np.pi * hz(n) * t + .4 * np.sin(2 * np.pi * .1 * t + i)) for i, (n, a) in enumerate([('C3', 1), ('G3', .7), ('E4', .4), ('D4', .25)]))
mx.bed(.016 * sw * pad * np.clip(t / 1.0, 0, 1))
mx.reverb(wet=.24, dry=.86, sec=1.0)
mx.write(sys.argv[2], fade_out=.25)
print('dur', round(DUR, 3), 'last lands', round(last, 2))
