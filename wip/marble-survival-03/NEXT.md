# marble-survival-03 (game H shrinking floor, "Game 3", faces + voice) — 19 Nov 13:10 run
Slot: 25 Nov 01:00 Europe/London (H last on 21 Nov 17:00; 24 Nov = B + F; 25 Nov 17:00 = A melody).
Rule sheet: 24 numbered marbles with eyes on a round floor that shrinks and shakes; centre past the edge = falls = OUT; LEFT/FLOOR/timer from events; last one on the floor wins. Hook "#5 won Game 2. Pick a face 👇".
Engine (tools/marble-survival/page.html, from the Game 2 review): follow pill 2.6 s before the end, bigger (700x98, 52 px); LEFT and timer left-aligned (no jitter); all HUD text fades 0.62 s before the end (clean loop); crown goes beside the winner when it would touch the HUD panel; confetti starts outside the grown winner (face visible). TAIL 3.6 -> 2.4 (shorter still hold).
Rebuild: cd tools/marble-survival && MR=28 TE=26 MINT=21.5 MAXT=25.5 FIRSTMIN=2 DUELMIN=2.5 BURST=3 MAXGAP=4 GAME=3 PREVWIN=5 WINEX=5,6 TAIL=2.4 node sim.js data.js 9397 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/ms/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ../dodge-ball/gate.sh <out.mp4> <dir>
Result: seed 9397, #9 wins at 23.057 s (final 2 #4/#9, #4 falls 23.1 s), 23 falls, 195 bumps, check.js PASS (max overlap 0.07 px, tunnel 0); voices 9 (checkVoices PASS). Video 27.52 s, final fall at 24.40 s (89 %).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 27.52 s, YAVG first 40.1 / last 38.9, -13.8 LUFS TP -3.2, 4k band -48.5 (34.7 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Review v1 (subagent): 7.2 (hook 7, polish 7, clarity 8, pacing 6, payoff 8), LOGIC PASS -> schedule. Fixed before scheduling (render only): confetti over the winner's face, crown touching the HUD panel. Not done: mid pacing 6-17 s + 4 s final duel on the rim (physics/time-map), first fall at 2.5 s (physics).
Caption: Game 3 😬 #5 won Game 2. 24 marbles, 1 floor that keeps shrinking. Off the edge = OUT. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 😬 24 marbles, only 1 survives. Pick a face 👇
DONE: media/marble-survival-03.
