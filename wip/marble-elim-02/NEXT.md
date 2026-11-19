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
Gate v1: 1080x1920 60 fps H.264 CRF 16 + AAC; -14.0 LUFS, peak -3.1 dBFS; 4k+ band -48.1 LUFS (34 dB under); first/last frame YAVG 37/36; spelling OK; safe zones OK.
Review v1: 6.4 (hook 6, polish 6, clarity 7, pacing 6, payoff 7), LOGIC PASS (out order, chips, danger pairs, winner, eyes only, loop).
Fix round (v2, no second review): live "Gate k · X of N through 👀" status between outs, danger rings 7 px brighter + pulsing, payoff line from the real story
  ("BLUE was first at gate 1… and still lost 😱"), follow pill 2.5 s. NOT done: board scale-up 1.35x (would push key action into the bottom 480 px safe zone;
  marble size capped by the 40 px lift) -> engine geometry job for a later C episode (wider lift + taller board inside y 640-1440).
Caption: Game 2 🏁 RED won Game 1. Now every marble has eyes 👀 Last one through the gate is OUT. Pick a color before the trapdoor opens 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 🏁 RED won Game 1. Pick a color! Last one through the gate is OUT 👇
Slot: 21 Nov 21:00 Europe/London. Next C: Game 3 with LASTWIN=5 (PURPLE).
v2 gate: 1080x1920 60 fps + AAC, -14.0 LUFS, peak -3.1 dBFS, 4k+ -48.1 LUFS, YAVG 37/36, 31.72 s. Final: media/marble-elim-02.
