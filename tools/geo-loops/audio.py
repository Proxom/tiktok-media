# E "Infinite geometric loop" sound: every ring pass = one marimba note (steady T/(NB*NR) pulse), chords change
# every quarter loop (I-vi-IV-V), soft glock on each block downbeat, low marimba bass and a warm pad bed.
# Rendered over 3 periods and the last 2 kept, so reverb tails wrap and the audio loops seamlessly with the video.
# python3 -I audio.py data.js out.wav   (final level in ffmpeg: loudnorm I=-20 TP=-3)
import sys, json, os, wave, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from sfx import Mix, SR
src = open(sys.argv[1]).read(); D = json.loads(src[src.index('{'):src.rindex('}') + 1])
T = D['T']; NB = D['NB']; NR = D['NR']
CH = [(60, (0, 4, 7)), (57, (0, 3, 7)), (53, (0, 4, 7)), (55, (0, 4, 7))]  # C, Am, F, G
PAT = [0, 2, 4, 3, 5, 1]
mx = Mix(3 * T, seed=D['SEED'])
slot = T / (NB * NR)
def m2f(m): return 440 * 2 ** ((m - 69) / 12)
for rep in range(3):
    for e in D['ev']:
        t = e['t']; i = int(round(t / slot)) % (NB * NR)
        blk = (i * len(CH)) // (NB * NR); root, tri = CH[blk]
        tones = [root + 12 + tri[0], root + 12 + tri[1], root + 12 + tri[2], root + 24 + tri[0], root + 24 + tri[1], root + 24 + tri[2]]
        k = PAT[i % 6] if i % 6 < len(PAT) else 0
        f = m2f(tones[k]); t0 = rep * T + t
        pan = .45 * np.cos(2 * np.pi * D['rings'][e['ring']] + 2 * np.pi * t0 / (2 * T))
        down = (i % (NB * NR // len(CH))) == 0
        mx.add(t0, mx.marimba(f, .55 if down else .42, .9), pan)
        if down:
            mx.add(t0, mx.glock(m2f(tones[3] + 12) if tones[3] + 12 < 96 else f, .10), -pan * .5)
            mx.add(t0, mx.marimba(m2f(root - 12), .30, .6), 0)
# pad: chord-following soft triangle-ish tones, periodic in T (crossfaded per block)
n = mx.n; t = mx.t; pad = np.zeros(n); blkd = T / len(CH)
for b in range(int(3 * len(CH)) + 1):
    root, tri = CH[b % len(CH)]; a = b * blkd
    env = np.clip((t - a + .25) / .5, 0, 1) * np.clip((a + blkd + .25 - t) / .5, 0, 1)
    for st, g in ((tri[0], 1), (tri[1], .6), (tri[2], .7), (12, .35)):
        f = round(m2f(root - 12 + st) * T) / T; pad += env * g * (np.sin(2 * np.pi * f * t) + .12 * np.sin(2 * np.pi * 2 * f * t))
pad *= .028 * (1 + .15 * np.sin(2 * np.pi * t / T))
mx.bed(pad)
mx.reverb(wet=.26, dry=.85, sec=1.1)
L = mx.L[int(T * SR):]; R = mx.R[int(T * SR):]
st = np.stack([L, R], 1); st /= np.abs(st).max() / .7
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
print('wrote', sys.argv[2], len(st) / SR, 's')
