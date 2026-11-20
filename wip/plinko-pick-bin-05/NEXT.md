# plinko-pick-bin-05 (game D plinko, "Game 5") — 20 Nov 18:09 UTC run
Why D: 20 Nov 17:00 ring PUBLISHED -> QUEUE 19 -> nearest empty TikTok slot 23 Nov 21:00. Neighbours: 23 Nov 01:00 G, 17:00 A, 24 Nov 01:00 B, 17:00 F. F would run 22/23/24 Nov in a row and break the Round 3/4/5 record chain, so not F. C (last 21 Nov 21:00) or D (last 20 Nov 21:00): D has the longer gap.
Faces: none (balls 30 px < 40 px).
Rule sheet: 36 balls drop one by one from a sliding dropper through a 10-row peg board into 4 colored bins (RED, BLUE, YELLOW, GREEN). A ball counts for a bin the moment it first touches that bin's floor or a ball resting in it, and stays there. After the last ball the bin with the most balls wins (no tie).
Rebuild: cd tools/plinko && I0=.62 I1=.26 MINT=17 MAXT=21.5 LASTFALL=4.4 PRE=2.0 TAIL=4.4 LASTDECIDES=1 GAME=5 LASTWIN=2 WINEX=2 FOLLOWTEXT='Follow → a new one every day' node sim.js data.js 91000 (+ data.follows=2.0) && node check.js && TMPD=/tmp/claude-0/pk/build ./make.sh raw.mp4 4 && ../loopfade.sh raw.mp4 out.mp4 && ../ball-battle/gate.sh out.mp4 gate/
Result: seed 91096, RED 8 / BLUE 7 / YELLOW 10 / GREEN 11, GREEN wins by 1 with the last ball (breaks a 10-10 tie with last champion YELLOW), 4 lead changes, 418 peg hits, tunnel 0, maxPen 0.19, maxStep/r 0.122, check.js PASS. Video 23.78 s, last landing at 19.03 s (80 %).
Caption: Game 5 👇 YELLOW won Game 4. Pick a color before the first ball lands. Which bin gets the most? Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Game 5 👇 YELLOW won Game 4. Pick a color! Which bin wins?
Slot: 23 Nov 21:00 Europe/London.
STATUS: rendering.
