# merge-race-02 (family E "merge game", Game 2) — 13 Nov 19:07 run, for 14 Nov 01:00 Europe/London
Why: QUEUE 0 (no runs since 12 Nov 03:32; 13 Nov 17:00 was missed). Next slot 14 Nov 01:00 -> E is due (last E 12 Nov 01:00, rule: one E every 2 days).
Engine: tools/merge-arena/race (unchanged code). Reviewer ideas from Game 1 applied as params: busier start (I0 .34 -> .26), top radii ~7% smaller (RF 1.27 -> 1.25).
Rebuild: cd tools/merge-arena/race && GAME=2 WINEX=1 FF=1.25 FOLLOWTEXT='Follow → Game 3 is next' R0=34 RF=1.25 PASSES=6 TOP=6 I0=.26 I1=.20 NS=300 MINT=22 MAXT=28 LEADMIN=3 CLOSE=1 node sim.js data.js 200 && node check.js data.js && TMPD=/tmp/claude-0/mr2/build ./make.sh <out.mp4> 4
Result: seed 203, RED wins (king = 64 RED + 64 BLUE, stolen from last game's winner BLUE), 3 lead changes, 113 drops (28/28/29/28), 93 merges, king at video 23.58 s / 28.5 s (82.7%).
check.js PASS: maxOverlap 3.83 px, maxStep/r 0.069, tunnel 0, 600 Hz (10 sub-steps), 6 passes.
Caption: Game 2 👇 BLUE won Game 1. Pick a color before the first drop. Same numbers merge, the newest color takes it. Who makes the 👑? Follow for Game 3 #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 👇 BLUE won Game 1. Pick a color! Who makes the 👑 this time?
Next E (Game 3) by 16 Nov 01:00: WINEX=0 (RED) GAME=3.
