# Audio for the GROW layout (page-grow.html), modal synthesis from tools/sfx.py, every sound on its physical event:
# - marble rolling in (soft low wood taps), its tap on domino 0 at t[0];
# - domino i-1 strikes domino i at t[i] (gen.js contact moment): a wood knock whose pitch falls and level rises gently
#   with the size of the struck domino (bigger body = lower, fuller knock; never a boom);
# - a marimba note every 4th domino walking DOWN a pentatonic scale as the dominoes grow;
# - the giant lands flat at t[last] + Di[last]: soft low knock + warm marimba chord + glockenspiel sparkle;
# - warm pad underneath (no silence). python3 audio-grow.py data.js out.wav
import sys, os, json, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from sfx import Mix, hz
src = open(sys.argv[1]).read()
d = json.loads(src.split('=', 1)[1].split(';\n', 1)[0])
N, T, END, SC, DI = d['N'], d['t'], d['tEnd'], d['sc'], d['Di']
TAIL = float(sys.argv[3]) if len(sys.argv) > 3 else 5.8
DUR = END + TAIL
mx = Mix(DUR, seed=17); r = mx.rng
rel = [k / SC[0] for k in SC]  # size relative to the first domino (1 .. ~18)
PENTA = ['E6', 'D6', 'C6', 'A5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4', 'E4', 'D4', 'C4', 'A3', 'G3', 'E3', 'D3', 'C3']
for k in range(int(T[0] / .05)):  # marble rolling in
    mx.add(k * .05, mx.wood(hz('C4') * r.uniform(.95, 1.05), .010 * (k * .05 / T[0])), -.1)
mx.add(T[0], mx.wood(hz('A5'), .14), 0)
for i in range(1, N):
    g = rel[i] ** .33
    f = hz('E5') / rel[i] ** .38 * r.uniform(.97, 1.03)
    mx.add(T[i], mx.wood(f, (.085 + .03 * min(g, 2.8)) * r.uniform(.9, 1.0)), float(r.uniform(-.12, .12)))
    if i % 4 == 0:
        k = min(len(PENTA) - 1, (i // 4) * len(PENTA) // (N // 4 + 1))
        mx.add(T[i], mx.marimba(hz(PENTA[k]), .15 + .05 * i / N, .9), 0)
land = T[N - 1] + DI[N - 1]
mx.add(land, mx.wood(hz('E3'), .07), 0)
mx.add(land + .01, mx.wood(hz('A2'), .05), .1)
for j, (n, p) in enumerate([('C3', 0), ('G3', -.3), ('C4', .3), ('E4', -.2), ('G4', .2), ('C5', 0)]):  # gentle strum, not a stacked hit
    mx.add(land + .03 + .045 * j, mx.marimba(hz(n), .07, 1.0), p)
for i, n in enumerate(['C6', 'E6', 'G6', 'C7', 'G6', 'E6', 'C6']):
    mx.add(land + .2 + i * .13, mx.glock(hz(n), .05 * (1 - i / 10)), -.45 + .15 * i)
t = mx.t; sw = .7 + .3 * np.clip(t / END, 0, 1)
pad = sum(a * np.sin(2 * np.pi * hz(n) * t + .4 * np.sin(2 * np.pi * .1 * t + i)) for i, (n, a) in enumerate([('C3', 1), ('G3', .7), ('E4', .4), ('D4', .25)]))
mx.bed(.017 * sw * pad * np.clip(t / 1.0, 0, 1))
mx.reverb(wet=.24, dry=.86, sec=1.1)
mx.write(sys.argv[2], fade_out=.3)
print('dur', round(DUR, 3), 'giant lands', round(land, 2))
