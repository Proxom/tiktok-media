# marble-elim-03 (game C obstacle/elimination race, "Game 3") — 20 Nov 22:09 UTC run (funny-1ffiyr-2209)
Why C: 20 Nov 21:00 D plinko G4 PUBLISHED -> QUEUE 19. Nearest empty TikTok slot = 24 Nov 21:00 (neighbours 24 Nov 17:00 F, 25 Nov 01:00 H).
  C last on 21 Nov 21:00 (Game 2, PURPLE won), no later C episode pending -> C Game 3.
Rule sheet: 6 marbles drop through a trapdoor, peg board with 2 spinning paddles, bottom ramp, GATE, glass lift back to the top. A marble passes gate k on its k-th lap.
  The moment every marble still racing except one has passed gate k, that one is OUT. After gate 5 the last one left wins.
Build: cd tools/marble-elim && RAD=20 GAME=3 LASTWIN=5 WINEX=5,0 FOLLOWTEXT='Follow → a new one every day' TAIL=3.6 SLOW=.25 S0=1.0 S1=.5 MINT=23.5 MAXT=29 GAPMAX=300 node sim.js data.js 3000 && node faces.js data.js && node check.js data.js && ./make.sh raw.mp4 4 && ../loopfade.sh raw.mp4 out.mp4 && ../ball-battle/gate.sh out.mp4 gate/
  (WINEX=5,0: neither last champ PURPLE nor Game 1 champ RED may win, for variety.)
Result: seed 3022; out order BLUE, GREEN, ORANGE, RED, PURPLE; YELLOW wins the final duel vs last champ PURPLE (gap 260 px). endT 25.10 s sim, win at 27.80 s video (84 %), 32.97 s.
  check.js PASS (tunnel 0, maxPen line 0.11, peg 0.00, maxStep/r 0.094, 600 Hz). Voices 8.
Status: rendering.
