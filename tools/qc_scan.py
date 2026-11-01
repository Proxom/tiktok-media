# Per-frame QC scan for a finished mp4 (QC lesson 1 Nov 2026: 2 fps contact sheets missed a one-frame flash in
# marble-music-jingle at 10.4 s and one-frame colour pops at the render-chunk seams of a merge video).
# Reports: one-frame luma spikes (frame differs from BOTH neighbours in the same direction), persistent steps,
# loudness/true peak, silence gaps, black frames. Exit code 1 if any spike, silence or black frame is found.
# python3 tools/qc_scan.py video.mp4 [spike_threshold=1.5]
import re, subprocess, sys, statistics
f = sys.argv[1]; TH = float(sys.argv[2]) if len(sys.argv) > 2 else 1.5
out = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', 'signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-an', '-f', 'null', '-'], capture_output=True, text=True).stdout
y = [float(v) for v in re.findall(r'YAVG=([\d.]+)', out)]
d = [y[i] - y[i - 1] for i in range(1, len(y))]
med = statistics.median(abs(v) for v in d) if d else 0
spikes = [(i, round(y[i - 1], 1), round(y[i], 1), round(y[i + 1], 1)) for i in range(1, len(y) - 1)
          if abs(y[i] - y[i - 1]) > TH and abs(y[i] - y[i + 1]) > TH and (y[i] - y[i - 1]) * (y[i] - y[i + 1]) > 0
          and abs(y[i + 1] - y[i - 1]) < TH]  # back to the previous level next frame = a pop (a designed flash decays over several frames)
steps = [(i, round(d[i - 1], 2)) for i in range(1, len(y)) if abs(d[i - 1]) > max(TH, 8 * med) and i not in [s[0] for s in spikes] and i - 1 not in [s[0] for s in spikes]]
e = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', e); P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)
s = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-af', 'silencedetect=n=-45dB:d=0.4', '-f', 'null', '-'], capture_output=True, text=True).stderr
sil = re.findall(r'silence_start: ([\d.]+)', s)
b = subprocess.run(['ffmpeg', '-nostats', '-i', f, '-vf', 'blackdetect=d=0.05:pix_th=0.05', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
blk = re.findall(r'black_start:([\d.]+)', b)
print(f'frames {len(y)}  median |step| {med:.3f}')
print('one-frame spikes (frame, prev, this, next):', spikes or 'none')
print('large steps (check: merges/pop-ins/flashes by design are OK, render seams are not):', steps[:20] or 'none')
print('loudness', I[-1] if I else '?', 'LUFS  true peak', P[-1] if P else '?', 'dBTP  silence starts', sil or 'none', ' black starts', blk or 'none')
sys.exit(1 if (spikes or sil or blk) else 0)
