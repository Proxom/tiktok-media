# marble-elim-02 (game C obstacle/elimination race, "Game 2") — 19 Nov 22:09 UTC run (funny-ibox05-2209)
Why C: 19 Nov 21:00 published -> QUEUE 19. Nearest empty slot = 21 Nov 21:00. Neighbours: 21 Nov 01:00 B, 21 Nov 17:00 H, 22 Nov 01:00 I; 20 Nov 21:00 D.
  A/B/D/F/G/H/I all have later episodes already scheduled (numbering) -> C (last post 11 Nov, no pending episode, 0.94x). Game 1 = marble-elim-01 (RED won).
Engine (tools/marble-elim) upgrades this run: FACES + VOICE added (tools/marble-elim/faces.js: scared = among the last 2-3 not through the current gate,
  pupils look at the GATE; angry = duel pair within 220 px; hit = hard clacks/paddle; out = sad "ooo"; win = giggle), marbles RAD 20 (40 px = full eyes;
  21 does not fit the 40 px lift), "Game N" + "<LASTWIN> won Game N-1 👑 Who wins now?" (first 3.4 s), panel text + follow pill fade 0.62 s before the end,
  follow pill 2.0 s, name tags above the bigger marbles.
Rule sheet: 6 marbles drop through a trapdoor, peg board with 2 spinning paddles, bottom ramp, GATE, glass lift back to the top. A marble passes gate k on its k-th lap.
  The moment every marble still racing except one has passed gate k, that one is OUT. After gate 5 the last one left wins.
Rebuild: cd tools/marble-elim && RAD=20 GAME=2 LASTWIN=0 WINEX=0 FOLLOWTEXT='Follow → a new one every day' TAIL=3.6 SLOW=.25 S0=1.0 S1=.5 MINT=23.5 MAXT=29 GAPMAX=300 node sim.js data.js 2000 && node faces.js data.js && node check.js data.js && ./make.sh raw.mp4 4 && ../loopfade.sh raw.mp4 out.mp4 && ../ball-battle/gate.sh out.mp4 gate/
Result: seed 2004, out order YELLOW, GREEN, RED, ORANGE, BLUE; PURPLE wins, BLUE (first through gate 1) loses the duel by 93 px. endT 23.87 s sim, win at 26.55 s video (84 %), 31.7 s.
  check.js PASS (tunnel 0, maxPen line 0.06, peg 0.00, maxStep/r 0.095, 600 Hz). Voices 8 (ooo x5, oof, eep, giggle), checkVoices OK.
