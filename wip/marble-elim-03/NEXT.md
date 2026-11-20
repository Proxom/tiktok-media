# marble-elim-03 (game C obstacle/elimination race, "Game 3") — 20 Nov 22:09 UTC run (funny-1ffiyr-2209)
Why C: 20 Nov 21:00 D plinko G4 PUBLISHED -> QUEUE 19. Nearest empty TikTok slot = 24 Nov 21:00 (neighbours 24 Nov 17:00 F, 25 Nov 01:00 H).
  C last on 21 Nov 21:00 (Game 2, PURPLE won), no later C episode pending -> C Game 3.
Rule sheet: 6 marbles drop through a trapdoor, peg board with 2 spinning paddles, bottom ramp, GATE, glass lift back to the top. A marble passes gate k on its k-th lap.
  The moment every marble still racing except one has passed gate k, that one is OUT. After gate 5 the last one left wins.
Build: cd tools/marble-elim && RAD=20 GAME=3 LASTWIN=5 WINEX=5,0 FOLLOWTEXT='Follow → a new one every day' TAIL=3.6 SLOW=.25 S0=1.0 S1=.5 MINT=23.5 MAXT=29 GAPMAX=300 node sim.js data.js 3000 && node faces.js data.js && node check.js data.js && ./make.sh raw.mp4 4 && ../loopfade.sh raw.mp4 out.mp4 && ../ball-battle/gate.sh out.mp4 gate/
  (WINEX=5,0: neither last champ PURPLE nor Game 1 champ RED may win, for variety.)
Result: seed 3022; out order BLUE, GREEN, ORANGE, RED, PURPLE; YELLOW wins the final duel vs last champ PURPLE (gap 260 px). endT 25.10 s sim, win at 27.80 s video (84 %), 32.97 s.
  check.js PASS (tunnel 0, maxPen line 0.11, peg 0.00, maxStep/r 0.094, 600 Hz). Voices 8.
Gate v1: 1080x1920 60 fps H.264 CRF 16 + AAC; -14.0 LUFS, TP -2.5 dBTP; 4k+ -47.8 LUFS (34 dB under); YAVG 37/36; spelling OK; safe zones OK.
Review v1 (one subagent): 6.8 (hook 7, polish 7, clarity 8, pacing 5, payoff 7), NO logic fail. Top 3: cut final-duel dead time; scale board up; stronger elimination moments.
Fix round (v2, no second review):
  - pacing: lift speed LSP 900 -> 1200, MINT 20 MAXT 25 GAPMAX 240 -> new seed search (3031).
  - elimination pop (tools/marble-elim/page.html): 0.18 s color flash, double glowing ring, 16 shards, big ❌ + "<COLOR> OUT" tag, 1.3 s (was 0.9 s).
  - NOT done: board scale-up (needs new lift/board geometry inside y 640-1440; safe zones) -> later C episode.
Final build: LSP=1200 RAD=20 GAME=3 LASTWIN=5 WINEX=5,0 FOLLOWTEXT='Follow → a new one every day' TAIL=3.6 SLOW=.25 S0=1.0 S1=.5 MINT=20 MAXT=25 GAPMAX=240 node sim.js data.js 3000
Final result: seed 3031; out order GREEN, RED, PURPLE (last champ), ORANGE, YELLOW; BLUE wins; YELLOW was first through gate 1 and lost the duel by 217 px.
  endT 22.78 s sim, win at 25.47 s video (83 %), 30.65 s. check.js PASS (tunnel 0, maxPen line 0.06, peg 0.00, maxStep/r 0.094, 600 Hz). Voices 10.
Gate v2: 1080x1920 60 fps + AAC, -14.0 LUFS, TP -3.7 dBTP, 4k+ -48.4 LUFS (34 dB under), YAVG 37/36, spelling OK, safe zones OK. Final: media/marble-elim-03.
Caption: Game 3 🏁 PURPLE won Game 2. Last one through the gate is OUT 👀 Pick a color before the trapdoor opens 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 🏁 PURPLE won Game 2. Pick a color! Who makes it to the end? 👇
Slot: 24 Nov 21:00 Europe/London. Next C: Game 4 with LASTWIN=4 (BLUE) WINEX=4.
