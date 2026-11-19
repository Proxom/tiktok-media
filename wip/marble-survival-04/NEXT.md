# marble-survival-04 (game H shrinking floor, "Game 4", faces + voice) — 19 Nov 13:10 run
Slot: 28 Nov 01:00 Europe/London (H last on 25 Nov 01:00; 27 Nov = B + F).
Rebuild: cd tools/marble-survival && MR=28 TE=26 MINT=21.5 MAXT=25.5 FIRSTMIN=2 DUELMIN=2.5 BURST=3 MAXGAP=4 GAME=4 PREVWIN=9 WINEX=9,5 TAIL=2.4 node sim.js data.js 13116 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/ms/build ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: seed 13116, #23 wins at 21.988 s (final 2 #10/#23, #10 falls 22.0 s), 23 falls, 206 bumps, check.js PASS (tunnel 0); voices 8. Video 26.45 s, final fall at 23.32 s (88 %).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 26.45 s, YAVG 40.1 / 38.7, -13.8 LUFS TP -3.0, 4k band -48.4 (34.6 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Review v1 (subagent): 7.0 (hook 6, polish 8, clarity 7, pacing 6, payoff 8), LOGIC PASS -> schedule. Engine notes for next H: final 2 of similar colours (#10/#23 both green) -> add a seed filter for distinct final-2 hues; crown together with the SURVIVES text; FINAL 2 dead stretch 19.3-21.8 s (time-map speed-up when nobody is near the edge); first fall by ~1 s.
Caption: Game 4 😬 #9 won Game 3. 24 marbles, 1 floor that keeps shrinking. Off the edge = OUT. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 4 😬 24 marbles, only 1 survives. Pick a face 👇
DONE: media/marble-survival-04.
