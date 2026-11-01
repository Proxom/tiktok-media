# Merge arena audio v2 (AUDIO QUALITY UPGRADE): modal-synthesis sounds from the shared tools/sfx.py, every sound on
# its simulation event, panned by screen x, with a generated reverb and a quiet pad. No raw beeps or noise bursts.
# drop = soft high wood tick, collision = wood tap (pitch by tier, gain by impact speed),
# merge = marimba note climbing a pentatonic scale with the tier, first time a tier is reached = glockenspiel bell,
# final = marimba roll rising into a chord + glock shimmer.
# python3 audio2.py data.js out.wav [T0]   (master + loudness in ffmpeg afterwards)
import sys, json, os, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from sfx import Mix, hz, SR
d = json.loads(open(sys.argv[1]).read().split('=', 1)[1].rstrip(';\n'))
T0 = float(sys.argv[3]) if len(sys.argv) > 3 else d.get('t0', 2.0)
FIN = d['final']; SL = d.get('slow')
# simulation time -> video time (inverse of page.html simT, incl. the optional slow motion before the final)
def vt(ts):
    if not SL or ts <= SL['s0']: return ts - T0
    L = (SL['s1'] - SL['s0']) / SL['sp']
    if ts <= SL['s1']: return SL['s0'] - T0 + (ts - SL['s0']) / SL['sp']
    return SL['s0'] - T0 + L + (ts - SL['s1'])
D = vt(len(d['frames']) / d['fps'])
mx = Mix(D, seed=int(d.get('seed', 1)))
PENTA = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6']
pan = lambda x: float(np.clip((x - d['CX']) / d['R'], -1, 1)) * .7
def at(te): return vt(te)
# bed: warm pad (C major add9), slow swell, very quiet
t = mx.t; sw = .78 + .22 * np.sin(2 * np.pi * t / 9.0)
pad = sum(a * np.sin(2 * np.pi * hz(n) * t + .4 * np.sin(2 * np.pi * .11 * t + i)) for i, (n, a) in enumerate([('C3', 1), ('G3', .7), ('E4', .45), ('D4', .3)]))
mx.bed(.016 * sw * pad * np.clip(t / 1.5, 0, 1))
last = -1; seen = set(e['k'] for e in d['events'] if e['type'] == 'drop')
for e in d['events']:
    ty, te = e['type'], e['t']
    if at(te) < 0 or te > FIN + .01 and ty != 'final': continue
    if ty == 'drop':
        mx.add(at(te), mx.wood(hz('A6') * (1 + .03 * e['k']), .05), 0)
    elif ty in ('hit', 'wall'):
        if te - last < .045: continue
        last = te; v = min(1, (e['v'] - 260) / 900)
        mx.add(at(te), mx.wood(hz('E5') * (0.92 ** e['k']), .05 + .13 * v), pan(e['x']))
    elif ty == 'merge':
        k = e['k']; f = hz(PENTA[min(len(PENTA) - 1, k + 2)])
        mx.add(at(te), mx.marimba(f, .42, 1.0), pan(e['x']))
        if k not in seen:
            seen.add(k); mx.add(at(te) + .03, mx.glock(f * 2, .22), pan(e['x']))
# final: marimba roll climbing into the chord, glock shimmer on top
roll = ['C5', 'E5', 'G5', 'C6', 'E5', 'G5', 'C6', 'E6']
for i, n in enumerate(roll):
    mx.add(at(FIN) - 1.25 + i * .15, mx.marimba(hz(n), .10 + .03 * i, .8), (-.4 + .1 * i))
for n, p in [('C3', 0), ('C4', -.3), ('E4', .3), ('G4', -.2), ('C5', .2), ('E5', 0)]:
    mx.add(at(FIN) + .02, mx.marimba(hz(n), .55, 1.0), p)
for i in range(10):
    mx.add(at(FIN) + .15 + i * .13, mx.glock(hz(['C6', 'E6', 'G6', 'E6', 'C6'][i % 5]), .12 * (1 - i / 12)), (-.5 + .1 * i))
mx.reverb(wet=.26, dry=.85, sec=1.0)
mx.write(sys.argv[2], fade_out=.25)
print('dur', round(D, 3))
