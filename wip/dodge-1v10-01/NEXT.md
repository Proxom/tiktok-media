# dodge-1v10-01 (family B, 1M+ list #6 "1v10") — 14 Nov 19:07 run (QUEUE 1 -> make 1)
Slot: 15 Nov 17:00 Europe/London (1M+ slot).
outlier: "1v10 AI Dodgeball (deep reinforcement learning)" (AI Warehouse, YouTube) https://www.youtube.com/watch?v=8fICnUvIw6g — 4,254,752 views (vidIQ, checked 14 Nov; channel page shows 4.2M). Idea only; our engine, look, text and sound. No AI claim: scripted steering.
Our twist: 1 gold ball vs 10 red chasers that join one by one (every 1.8 s) and get faster every second; a dodge dash when one gets close; live timer, CHASERS n/10, DODGES; "Guess the seconds".
NEW ENGINE tools/dodge-ball (sim.js, page.html, check.js, audio.py, make.sh, gate.sh, preview.js, render.js).
Rule sheet:
 1. One gold runner in a closed ring; a red chaser joins every 1.8 s (from the side opposite the runner) until there are 10.
 2. Chasers steer toward where the runner is heading; their top speed rises 3 % of the start speed every second (34 % -> ~58 % of the runner's speed).
 3. The runner picks the heading with the most room (looks 0.5 s ahead); when a chaser gets within 45 px it DODGES (1.7x speed for 0.35 s, 1.6 s cooldown).
 4. Chasers bounce off each other and the wall (real elastic collisions). The first chaser to touch the runner catches it: the timer stops.
 5. Timer = sim time to the catch; CHASERS = enter events; DODGES = dodge events.
Params: VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 (defaults ENT 1.8 T0 1.2 DTRIG 45 DASH 1.7 DDUR .35 DCD 1.6 R 400 CX 500 CY 1030), seed 1275.
Rebuild: cd tools/dodge-ball && VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 MINT=21.5 MAXT=27 MINCLOSE=4 node sim.js data.js 1275 && node check.js && TMPD=/tmp/claude-0/db/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: caught by #2 at 23.605 s, 11 dodges, 68 bumps, check.js PASS (min runner gap before catch 0.59 px, tunnel 0, maxPen 0); video 28.88 s, catch at 25.07 s (86.8 %).
Caption: 1 ball vs 10 chasers 😬 A new one joins every 1.8 s and they keep getting faster. Guess how many seconds it lasts 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: 1 vs 10 😬 How long can it last? Guess the seconds 👇
