# dodge-1v10-05 (game F "1 vs 10", ROUND 5, faces + voice) — 19 Nov 13:10 run
Slot: 27 Nov 17:00 Europe/London (F last on 24 Nov 17:00; 27 Nov 01:00 = B).
Hook: "Record: 30.8 s. Will it beat it? 👇" (Round 4 = 30.78 s). This run does NOT beat it (honest variety): "28.4 s · The record stays 30.8 s".
Engine: faces.js — the 9 losers stay angry after the catch; page.html — "SLOW-MO 🐢" under the timer while the time map runs slower than 0.85x.
Rebuild: cd tools/dodge-ball && CY=1020 VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 MINT=26.5 MAXT=29.5 MINCLOSE=8 TAIL=3.5 PREV=30.8 ROUND=5 TRIES=1 node sim.js data.js 52560 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/db/build ./make.sh <raw.mp4> 4 && ../loopfade.sh && ./gate.sh
Result: seed 52560, caught by #9 at 28.382 s, 8 dodges, 98 bumps, 8 close calls; check.js PASS (min gap 3.53 px, tunnel 0, voices 6). Video 34.17 s, catch at 29.87 s (87 %).
Review v1 (subagent): 6.6 (hook 6, polish 7, clarity 7, pacing 6, payoff 7), LOGIC PASS -> one fix round (losers stay angry, SLOW-MO cue). Not done (physics/timing): chaser blob 8-27 s (needs flanking/separation in sim.js), first chaser earlier, bigger faces.
Gate (final v2): 1080x1920 60 fps H.264 CRF 16 + AAC, 34.17 s, YAVG 36.6 / 35.3, -13.7 LUFS TP -2.3, 4k band -48.9 (35.2 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: 1 vs 10, Round 5 😬 The record is 30.8 s. Can it go even longer? Guess the seconds 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: 1 vs 10 Round 5 😬 Record 30.8 s. Guess the seconds 👇
DONE: media/dodge-1v10-05. NEXT F: build chaser separation/flanking first (3 reviews in a row flag the blob).
