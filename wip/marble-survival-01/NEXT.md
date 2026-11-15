# marble-survival-01 (family B last one standing, 1M+ list #7 "24 marble survival") — 15 Nov 03:07 run (QUEUE 1 -> fill to 3)
Slot: 16 Nov 17:00 Europe/London (1M+ slot; 1 video a day rule from 14 Nov 20:25).
outlier: "24 Marble Survival : Happy Ball" (Crazy Marble Race, YouTube) https://www.youtube.com/watch?v=QMxm5O3U1Pw — 2.6M views (YouTube page, checked 15 Nov). Idea only; our engine, look, text and sound.
Our twist: 24 numbered marbles on ONE floating floor that shrinks and shakes; off the edge = OUT; live LEFT n/24, FLOOR %, timer; camera zooms in as the floor shrinks; "Pick a number".
NEW ENGINE tools/marble-survival (sim.js, page.html, check.js, audio.py, make.sh, gate.sh, preview.js, render.js).
Rule sheet:
 1. 24 numbered marbles on a round floor seen from above; no wall at the edge.
 2. The floor shakes: every marble gets small random kicks; rolling friction slows it; the floor is a shallow dish (gentle pull to the middle).
 3. Marbles bounce off each other (elastic, restitution .92).
 4. The floor shrinks from 405 px to 16 px radius between 2.5 s and 26 s, losing the same area every second (FLOOR % = area left).
 5. A marble whose centre passes over the edge falls and is OUT; LEFT = 24 - falls. The last marble on the floor wins; then shaking and shrinking stop.
Params: MR=28 TE=26 (defaults SIG 184 FR 1.4 K .62 R0 405 REND 16 TS 2.5 E .92 SP0 .6 CX 495 CY 1035), seed 460 (search MINT 21.5 MAXT 25.5 FIRSTMIN 2 DUELMIN 2.5 BURST 3 MAXGAP 4, start 451).
Rebuild: cd tools/marble-survival && MR=28 TE=26 MINT=21.5 MAXT=25.5 FIRSTMIN=2 DUELMIN=2.5 BURST=3 MAXGAP=4 node sim.js data.js 460 && node check.js && TMPD=/tmp/claude-0/ms/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: winner #6 at 22.607 s, 23 falls (first 3.0 s, duel 20.0 -> 22.6 s), 195 bumps, check.js PASS (max overlap 0.07 px, tunnel 0); video 28.27 s, final fall at 23.95 s (84.7 %).
Review v1 (v2 render): 7.4 (hook 7, polish 8, clarity 8, pacing 7, payoff 7), LOGIC PASS (counts match LEFT, FLOOR ~-4.2 %/s, winner correct, safe zones clear) -> schedule.
Small fix applied (one, cheap): follow pill moved below the zoomed final floor (y 1392) so it no longer sits on the gold ring. Not done (engine ideas): harder zoom from FINAL 3, less slow-motion on the edge drift, header hard-cut in the loop fade.
Gate (final v3): 1080x1920 60 fps H.264 CRF 16 + AAC, 28.27 s, YAVG first 39.8 / last 38.9, -14.0 LUFS TP -2.9, 4k band -48.3 (34.3 dB below), spelling OK (pyspellchecker), safe zones clear, loopfade 0.4 s.
DONE: media/marble-survival-01 (mp4 + cover.jpg at 1.0 s).
Caption: 24 marbles, 1 floor that keeps shrinking 😬 Off the edge = OUT. Pick a number before it starts 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: 24 marbles. Only 1 survives 😬 Pick a number 👇
