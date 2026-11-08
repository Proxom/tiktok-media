# ball-grow-escape-95 (family A ring escape) — 8 Nov 11:07 run
Why A: B was 2 in a row (8 Nov 17:00, 9 Nov 01:00); A batch 96/91/98 = 259/244/140 views = 1.3x median 164.5 -> more turns (AGENT §4.1).
Params: seed 211897, R 390, CY 1030, GAP .21, GROW 1.35, R0 24, VMIN 430, VMAX 780, VFPS 60, S1 .8, MINT 27 MAXT 31 MINRATIO .93 ESCXMIN 60 ESCXMAX 930 TOPMIN 640; hue 305, bg ['#2c1446','#130a2a','#05030c'].
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=27 MAXT=31 MINRATIO=.93 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 211897
  then add hue + bg to data.js, node check.js, ./make.sh <out.mp4> 4, tools/ball-battle/gate.sh <mp4> <dir>.
Result: 33 bounces (1.0-1.2/s), escape at sim 29.97 s (video 31.6 s) at 95%, video 36.5 s 60 fps CRF 16, -14.0 LUFS TP -2.2, 4k band 32.6 dB below. Follow pill last 1.4 s.
Review v1 (seed 62721, 98%): logic PASS, 6.8 (pacing 6, payoff 6) -> fixed once: faster bounces (GROW 1.35, VMIN 430/VMAX 780), burst fountains UP into the ring (not into the bottom safe zone) and is drawn behind the ball, no ripple after escape, slow-mo tail S1 .8, sim/check filter: escaped ball never leaves through a side edge (an upper-half escape cannot stay in frame with R 390).
Caption: Every bounce makes it bigger. Can it squeeze out before 100%? Guess the % 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: It grows every bounce. Can it escape before 100%? 😬
Slot: 9 Nov 17:00 Europe/London.
