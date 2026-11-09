# ball-grow-escape-99b (family A ring escape) — 9 Nov 03:07 run (Monday queue-check)
Why A: 10 Nov 01:00 slot; 9 Nov rotation was B 01 / A 17 / D 21, so 10 Nov shifts to A 01 (D and B later that day). A batch 1.2x median; A max 1 a day.
Params: seed 420779, R 390, CY 1030, GAP .21, GROW 1.35, R0 24, VMIN 430, VMAX 780, VFPS 60, S1 .8, MINT 27 MAXT 31 MINRATIO .96 ESCXMIN 60 ESCXMAX 930 TOPMIN 640; hue 175 (cyan ring), bg ['#2c1446','#130a2a','#05030c'].
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=27 MAXT=31 MINRATIO=.96 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 418001
  then set hue 175 + bg in data.js, node check.js, ./make.sh <out.mp4> 8, tools/ball-battle/gate.sh <mp4> <dir>.
Result: 35 bounces (1.0/1.2/1.2 per s, accelerating), escape at sim 30.29 s (video 31.9 s of 36.8 s = 87%) at 98.5% (shown 99%), check.js PASS (maxPen 0, no teleport).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, first/last YAVG 39, -14.0 LUFS TP -2.3, 4k band -46.4 (32.4 dB below).
Caption: Every bounce makes it bigger. Can it squeeze out before 100%? Guess the % 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Every bounce it gets bigger. Will it still fit through the gap? 😬
Slot: 10 Nov 01:00 Europe/London.
Review v1: LOGIC PASS, 7.0 (hook 7, polish 7, clarity 8, pacing 6, payoff 7) -> schedule (§6). Engine fix applied once (cheap, helps every A video): end question 'What % did / you guess?' 84 px on two lines, follow pill moved inside the empty ring (CY+175) so it no longer sits on the ring stroke. Not done (next A engine work): tension beats at 90/95/97% (meter pulse, gap flash on near-escapes), freeze-frame on the ball in the gap.
Final: re-rendered with the fix, gate unchanged (-14.0 LUFS TP -2.3, 4k band 32.4 dB below). DONE: media/ball-grow-escape-99b.
