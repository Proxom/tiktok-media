# plinko-pick-bin-04 (game D plinko, "Game 4") — 19 Nov 18:09 run
Why D: 3 posts a day from 19 Nov (Erkan 18:07) opened 20 Nov 21:00 = nearest empty slot. Neighbours: 20 Nov 01:00 G, 20 Nov 17:00 A, 21 Nov 01:00 B, 21 Nov 17:00 H -> not A/B/G/H. I/F/B/H have later episodes already scheduled (numbering), so a game with no pending episode: D plinko, which also keeps Game 3's on-screen promise "Game 4 is next" (11 Nov).
Faces: none. Plinko balls are 30 px (R=15) < 40 px; AGENT.md allows tiny-ball games without faces.
Rule sheet: 36 balls drop one by one from a sliding dropper through a 10-row peg board into 4 colored bins (RED, BLUE, YELLOW, GREEN). A ball counts for a bin the moment it first touches that bin's floor or a ball resting in it, and stays there. After the last ball the bin with the most balls wins (no tie).
Engine (tools/plinko): HUD text, leader box + follow pill fade 0.62 s before the end (clean 0.4 s loop cross-fade); "<COLOR> takes the lead! 🔥" flash on each new single leader (review 10 Nov); seed filter LASTFALL (the deciding ball's fall <= 4.4 s; Game 3's last ball crept down a wall for 5.6 s; normal falls are 3.6-4.3 s).
Rebuild: cd tools/plinko && LASTFALL=4.4 PRE=2.6 TAIL=4.4 LASTDECIDES=1 GAME=4 LASTWIN=0 WINEX=0 FOLLOWTEXT='Follow → a new one every day' node sim.js data.js 60000 && node check.js && ./make.sh raw.mp4 4 && ../loopfade.sh raw.mp4 out.mp4 && ../ball-battle/gate.sh out.mp4 gate/
Result: seed 60000, GREEN 12 / BLUE 11 / RED 8 / YELLOW 5, GREEN wins by 1 with the last ball (11-11 tie broken), 3 lead changes, 397 peg hits, tunnel 0, maxPen 0.03, check.js PASS. Video 29.43 s, last landing at 24.68 s (84 %).
Caption: Game 4 👇 RED won Game 3. Pick a color before the first ball lands. Which bin gets the most? Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Game 4 👇 RED won Game 3. Pick a color! Which bin wins?
Slot: 20 Nov 21:00 Europe/London. Next D: Game 5 with LASTWIN=3 (GREEN).
