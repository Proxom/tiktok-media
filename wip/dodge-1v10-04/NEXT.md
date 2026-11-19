# dodge-1v10-04 (game F "1 vs 10", ROUND 4, faces + voice) — 19 Nov 13:10 run
Slot: 24 Nov 17:00 Europe/London (F = winner 1.93x -> extra turn; F last on 22 Nov 17:00; 24 Nov 01:00 = B).
Hook: "Record: 28.5 s. Will it beat it? 👇" (Round 2 = 28.46 s; Round 3 = 26.5 s). This run BEATS it: 30.8 s, NEW RECORD flash at 28.5 s.
Engine fix (sim.js): after the catch the frozen runner pushes chasers out (the fast catcher used to sink 2-4 px in -> check.js 'catch distance' FAIL at 30 s speeds). Pre-catch physics unchanged (same seed = same catch).
Rebuild: cd tools/dodge-ball && CY=1020 VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 MINT=29.5 MAXT=31 MINCLOSE=6 TAIL=3.5 PREV=28.5 ROUND=4 TRIES=1 node sim.js data.js 41440 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/db/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: seed 41440, caught by #9 at 30.784 s (NEW RECORD vs 28.5), 9 dodges, 153 bumps, 6 close calls; check.js PASS (min gap 0.17 px, max chaser overlap 0.10 px, tunnel 0, maxPen 0, voices 6: eep x4, ooo, giggle).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 36.55 s, YAVG first 36.6 / last 35.5, -14.0 LUFS TP -2.4, 4k band -48.4 (34.4 dB below), spelling OK, safe zones clear, loopfade 0.4 s. Catch at 32.23 s (88 %). Render 1 min (4 workers).
Caption: 1 vs 10, Round 4 😬 The record is 28.5 s. Does it finally fall? Guess the seconds 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: 1 vs 10 Round 4 😬 Can it beat 28.5 s? Guess 👇
