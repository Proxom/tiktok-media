# plinko-pick-bin-01 (family D plinko, episode 1, NEW engine tools/plinko) — 8 Nov 19:07 run
Why D: 9 Nov has B (01:00) and A (17:00); the new 21:00 slot (3 a day from 9 Nov) needs a third family -> new D engine.
Params: seed 304, NB 36, I0 .92, I1 .34, TAIL 4.4, LASTDECIDES 1 (defaults: G 1500, R 15, peg r 7, 10 peg rows, 4 bins, dropper amp 330).
Rebuild: cd tools/plinko && TAIL=4.4 LASTDECIDES=1 node sim.js data.js 300 && node check.js && ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>
Result: RED 11 / BLUE 9 / YELLOW 6 / GREEN 10, won by 1, the last ball breaks a RED-GREEN 10-10 tie, 7 lead changes, last landing sim 26.8 s (video 28.1 s of 32.9 s = 85%).
Caption: Pick a color before the first ball lands 👇 36 balls, 4 bins, most balls wins. Did yours win? Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Pick a color 👇 36 balls drop. Which bin gets the most?
Slot: 9 Nov 21:00 Europe/London.
