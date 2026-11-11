# merge-race-01 (family E "merge game", rebuilt to the 10 Nov gate) — 11 Nov 03:07 queue-check run, NEW engine tools/merge-arena/race
Why: Erkan 10 Nov 20:24 — merge game back in rotation, next EMPTY non-17:00 slot = 12 Nov 01:00 (publish order before it: D 10/21, D 11/01, C 11/17, B 11/21 -> E is fresh).
Game: 4 colors drop (fair shuffled bag) into one jar, each drop is a 2 (or a 4, 40%). Same NUMBERS merge into the next number; the new ball takes the color
of the NEWER of the two ("newest color takes it"). First color to make the 👑 (64 + 64) wins; drops and merges stop then. Live panel: biggest number each color holds.
Rebuild: cd tools/merge-arena/race && FOLLOWTEXT='Follow → Game 2 is next' R0=34 PASSES=6 TOP=6 I0=.34 I1=.20 NS=1 MINT=21 MAXT=26.5 LEADMIN=3 CLOSE=1 node sim.js data.js 13 && node check.js data.js && TMPD=/tmp/claude-0/mr-build ./make.sh <out.mp4> 4 && ../../ball-battle/gate.sh <mp4> <dir>
Result: seed 13, BLUE wins (king = BLUE 64 + RED 64, "stolen from RED"), 3 lead changes, 109 drops (27/27/27/28), 85 merges, king at sim 25.26 s = video 26.55 s (84.4%), 31.5 s.
check.js PASS: overlap max 2.02 px, maxStep/r 0.069, tunnel 0, 600 Hz (10 sub-steps), 6 solver passes.
Sound: every merge = next note of Frere Jacques (public domain) on soft marimba + low wood; quiet wood taps; rolled low chord on the 👑.
