# marble-survival-02 (game H shrinking floor, "Game 2", FIRST H VIDEO WITH FACES + VOICE) — 18 Nov 22:07 run
Slot: 21 Nov 17:00 Europe/London (21 Nov 01:00 = B; A/G on 20 Nov). H = 1.11x (marble-survival-01).
NEW tools/marble-survival/faces.js: scared = own distance to the shrinking edge (110 px -> 0, 10 px -> 1), pupils look over the edge, hard bumps = hit, fall = out (sad), last = win. Voices filtered for 24 marbles: giggle + "ooo" only for the last falls + eeps where they fit (9 voices, checkVoices PASS).
page.html: eyes above a smaller number (num() shifts down/shrinks when D.faces), Game N + "#N won Game N-1. Pick a face 👇" hook (GAME/PREVWIN env).
Rule sheet: same as marble-survival-01 (24 marbles, shaking shrinking floor, off the edge = OUT, last one wins).
Rebuild: cd tools/marble-survival && MR=28 TE=26 MINT=21.5 MAXT=25.5 FIRSTMIN=2 DUELMIN=2.5 BURST=3 MAXGAP=4 GAME=2 PREVWIN=6 TRIES=1 node sim.js data.js 5157 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/ms/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ../dodge-ball/gate.sh <out.mp4> <dir>
Result: seed 5157, #5 wins at 22.185 s (final 2 #3/#5, #3 falls 22.2 s), 23 falls, 230 bumps, check.js PASS (max overlap 0.08 px, tunnel 0); video 27.85 s, final fall at 23.52 s (84 %).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 27.85 s, YAVG first 40.1 / last 39.1, -13.9 LUFS TP -3.2, 4k band -48.2 (34.3 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Game 2 😬 #6 won Game 1. Now every marble has eyes 👀 24 marbles, 1 floor that keeps shrinking. Off the edge = OUT. Pick a face 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 😬 24 marbles, only 1 survives. Pick a face 👇
