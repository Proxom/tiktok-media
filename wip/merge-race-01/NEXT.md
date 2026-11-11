# merge-race-01 (family E "merge game", rebuilt to the 10 Nov gate) — 11 Nov 03:07 queue-check run, NEW engine tools/merge-arena/race
Why: Erkan 10 Nov 20:24 — merge game back in rotation, next EMPTY non-17:00 slot = 12 Nov 01:00 (publish order before it: D 10/21, D 11/01, C 11/17, B 11/21 -> E is fresh).
Game: 4 colors drop (fair shuffled bag) into one jar, each drop is a 2 (or a 4, 40%). Same NUMBERS merge into the next number; the new ball takes the color
of the NEWER of the two ("newest color takes it"). First color to make the 👑 (64 + 64) wins; drops and merges stop then. Live panel: biggest number each color holds.
Rebuild: cd tools/merge-arena/race && FF=1.25 FOLLOWTEXT='Follow → Game 2 is next' R0=34 PASSES=6 TOP=6 I0=.34 I1=.20 NS=1 MINT=21 MAXT=26.5 LEADMIN=3 CLOSE=1 node sim.js data.js 13 && node check.js data.js && TMPD=/tmp/claude-0/mr-build ./make.sh <out.mp4> 4 && ../../ball-battle/gate.sh <mp4> <dir>
Result: seed 13, BLUE wins (king = BLUE 64 + RED 64, "stolen from RED"), 3 lead changes, 109 drops (27/27/27/28), 85 merges, king at sim 25.26 s = video 26.55 s (84.4%), 31.5 s.
check.js PASS: overlap max 2.02 px, maxStep/r 0.069, tunnel 0, 600 Hz (10 sub-steps), 6 solver passes.
Sound: every merge = next note of Frere Jacques (public domain) on soft marimba + low wood; quiet wood taps; rolled low chord on the 👑.
Review v1 (on the 31.5 s v1 render): 7.0 (hook 6, polish 8, clarity 7, pacing 6, payoff 8), LOGIC PASS. >= 7 -> schedule; applied the cheap top-3 fixes once:
  goal line '64 + 64 = 👑 · first color to make it wins' after the rule line, 'RED hits 64! 👀' callout + pulsing cell when the first 64 forms (video 13.1 s),
  1.25x fast-forward of sim 6-17 s (FF; physics unchanged, renderer + audio follow the same tmap), panel cross-fades back to its frame-0 state in the last 0.35 s (loop).
Final: 29.25 s, king at video 24.33 s (83.2%).
Caption: Game 1 👇 Pick a color before the first drop. Same numbers merge, the newest color takes it. Who makes the 👑 first? Follow for Game 2 #satisfying #physics #simulation #oddlysatisfying
Title: Game 1 👇 Pick a color! Same numbers merge, newest color takes it. Who makes the 👑?
Slot: 12 Nov 01:00 Europe/London. Next E (Game 2) within 2 days in a 01:00/21:00 slot: WINEX=1 (BLUE) and GAME=2, reviewer ideas left: busier first 2 s (lower I0 for the first 3 s), 32/64 radii ~8% smaller so the pile never reaches the rim.
DONE: media/merge-race-01 (final mp4 moved there; v1 render is in git history).
