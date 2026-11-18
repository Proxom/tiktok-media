# ring-escape-faces-01 (game A ring escape "It grows every bounce", FIRST A VIDEO WITH FACES + VOICE) — 18 Nov 22:07 run
Slot: 20 Nov 17:00 Europe/London (20 Nov 01:00 = G -> 17:00 must not be G; F/I were on 19 Nov). A = best family (1.4x), last A on 14 Nov.
NEW tools/ball-grow/faces.js: one ball; scared = its own size vs the gap (meter 75 % -> 0, 95 %+ -> 1), pupils look at the gap, hard bounces (>520 px/s) = squeezed lids, escape = ^ ^ + giggle.
page.html: Faces.draw inside ball() (squash-aware), D.hook1 option. audio-soft.py: voices 12 dB under (ref .2).
Rule sheet: 1 ball in a rotating ring with one gap; every bounce grows it by a fixed step (1.35 px); meter = ball diameter / free gap width; it escapes only through the gap while under 100 %.
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=27 MAXT=31 MINRATIO=.96 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 820751
  then set hue 320 + bg ['#2c1446','#130a2a','#05030c'] + followText in data.js, node faces.js data.js, node check.js, TMPD=... ./make.sh <raw.mp4> 4, ../loopfade.sh, ../dodge-ball/gate.sh.
Result: seed 820751, 35 bounces, escape at sim 30.24 s at 98.5 % (shown 99 %), video 36.75 s, escape at 31.87 s (87 %); check.js PASS (maxPen 0). Voices 3: oof 24.75, eep 26.97, giggle 30.36.
