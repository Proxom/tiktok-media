# ball-grow-escape-98b (family A ring escape) — 8 Nov 11:07 run
Why A: family rotation (B was 2 in a row: 8 Nov 17:00, 9 Nov 01:00). A batch 96/91/98 = 259/244/140 views = 1.3x median 164.5 -> "more turns" (AGENT §4.1).
Params: seed 62721, R 390, CY 1030, GAP .21, GROW 1.8, R0 24, VFPS 60, MINT 27 MAXT 31 MINRATIO .93 ESCXMIN 60 ESCXMAX 930 TOPMIN 640; hue 305, bg violet (same as -98).
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.8 VFPS=60 MINT=27 MAXT=31 MINRATIO=.93 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 62721
  then add hue 305 + bg ['#2c1446','#130a2a','#05030c'] to data.js, node check.js, ./make.sh <out.mp4> 4, ./gate.sh-equivalent (tools/ball-battle/gate.sh <mp4> <dir>).
Result: 26 bounces, escape at sim 28.51 s (video 30.15 s) at 98%, video 34.57 s 60 fps. NEW: follow pill "Follow → next one tomorrow" in the last 1.4 s (main goal 8 Nov).
Caption: Every bounce makes it bigger. Can it squeeze out before 100%? Guess the % 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: It grows every bounce. Can it escape before 100%? 😬
Slot: 9 Nov 17:00 Europe/London.
