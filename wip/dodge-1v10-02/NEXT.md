# dodge-1v10-02 (game F "1 vs 10", ROUND 2, FIRST F VIDEO WITH FACES + VOICE) — 18 Nov 22:07 run
Slot: 19 Nov 01:00 Europe/London (01:00 slot reopened, Erkan 18 Nov 21:54).
Why F: dodge-1v10-01 = 1.93x median (WINNER) -> F gets the next free turn; 18 Nov 17:00 was B, 19 Nov 17:00 is I -> 01:00 must be neither.
Twist: Round 2 of 1 vs 10, hook "Record: 23.6 s. Will it beat it?" (Round 1 really lasted 23.605 s). NEW RECORD flash when the timer passes 23.6 (sim time).
Faces: NEW tools/dodge-ball/faces.js (runner 0 scared by nearest chaser gap, pupils on it, caught = out/ooo; chasers angry, pupils on runner, hard bumps = hit, catcher = win/giggle).
Rule sheet: same as dodge-1v10-01 (1 gold runner, a red chaser joins every 1.8 s up to 10, chasers +3 %/s, dodge dash at 45 px, first touch = catch, timer = sim time to the catch).
Rebuild: cd tools/dodge-ball && VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 MINT=24 MAXT=29 MINCLOSE=4 TAIL=4 PREV=23.6 ROUND=2 TRIES=1 node sim.js data.js 8204 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/db/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: seed 8204, caught by #10 at 28.461 s (NEW RECORD vs 23.6), 10 dodges, 118 bumps, 8 close calls; check.js PASS (min gap 3.82 px, tunnel 0, maxPen 0, voices 6: eep x4, ooo, giggle).
Video 34.73 s, catch at 29.93 s (86 %).
