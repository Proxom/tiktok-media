# ring-escape-faces-03 (game A ring escape, faces + voice) — 19 Nov 13:10 run
Slot: 28 Nov 17:00 Europe/London (A last on 25 Nov 17:00 melody; ring escape last on 23 Nov 17:00; 28 Nov 01:00 = H).
Twist vs -01/-02 (both escaped at 96-97 %): this one escapes EARLY at 82 % -> the "Guess the %" answer is different. New sim.js env MAXRATIO (seed filter only). Cyan hue 190.
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=24 MAXT=31 MINRATIO=.72 MAXRATIO=.84 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 1100790; set hue 190 + bg ['#2c1446','#130a2a','#05030c'] + followText in data.js; node faces.js data.js; node check.js; TMPD=/tmp/claude-0/bg/build ./make.sh <raw.mp4> 4; ../loopfade.sh; ../dodge-ball/gate.sh
Result: seed 1100790, 26 bounces, escape at sim 26.08 s at 81.7 % (shown 82 %), video 32.60 s, escape at 27.73 s (85 %); check.js PASS (maxPen 0). Voices 1 (giggle).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 32.60 s, YAVG 39.1 / 37.9, -14.0 LUFS TP -2.3, 4k band -46.1 (32.1 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Review v1 (subagent): 7.2 (hook 7, polish 7, clarity 8, pacing 6, payoff 8), LOGIC PASS (meter steps only at bounces, escape through the gap) -> schedule. Engine notes for next A: "SO CLOSE" beat when the ball passes the gap without fitting / hits a gap cap; hide the impact ripple during the escape slow-mo; follow pill off the ring line; bigger hook line / zoom on the ball for 1.5 s.
Caption: Every bounce it gets bigger 😬 Can it squeeze out before 100%? Guess the % before the end 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: It grows every bounce 👀 At what % does it escape? Guess 👇
DONE: media/ring-escape-faces-03.
