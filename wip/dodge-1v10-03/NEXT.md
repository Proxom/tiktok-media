# dodge-1v10-03 (game F "1 vs 10", ROUND 3, faces + voice) — 18 Nov 22:07 run
Slot: 22 Nov 17:00 Europe/London (F = winner 1.93x -> extra turn; F last on 19 Nov 01:00).
Hook: "Record: 28.5 s. Will it beat it? 👇" (Round 2 = 28.46 s). This run does NOT beat it (honest variety): "26.5 s · The record stays 28.5 s".
Rebuild: cd tools/dodge-ball && VR=650 LA2=.5 WP=.3 AR=8000 KG=20 VC=220 CGROW=.03 RR=35 RC=31 MINT=24 MAXT=27.5 MINCLOSE=6 TAIL=3.5 PREV=28.5 ROUND=3 TRIES=1 node sim.js data.js 20317 && node faces.js data.js && node check.js && TMPD=... ./make.sh <raw.mp4> 3 && ../loopfade.sh && ./gate.sh
Result: seed 20317, caught by #6 at 26.511 s, 11 dodges, 123 bumps, 9 close calls; check.js PASS (min gap 3.17 px, tunnel 0, maxPen 0, voices 6).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 32.28 s, YAVG first 36.5 / last 35.5, -14.1 LUFS TP -2.5, 4k band -49.6 (35.5 dB below), spelling OK, safe zones clear, loopfade 0.4 s. Catch at 27.98 s (87 %).
Caption: 1 vs 10, Round 3 😬 The record is 28.5 s. Can it last longer this time? Guess the seconds 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: 1 vs 10 Round 3 😬 Record 28.5 s. Guess the seconds 👇
DONE: media/dodge-1v10-03.
Review v1 (subagent): 6.6 (hook 7, polish 7, clarity 6, pacing 6, payoff 7), LOGIC PASS.
Fix round (once): "chaser speed" label under the bar; "·" separator between CHASERS and DODGES; rule/result lines 34/36 -> 40/42 px; ring moved up 10 px (CY 1030 -> 1020, sim re-run: identical result, catch 26.511 by #6) so its stroke stays out of the bottom safe zone. Not done (physics change): chasers clump 18-26 s.
Rebuild now uses CY=1020. Gate (final v2): 32.28 s, YAVG 36.6 / 35.5, -14.1 LUFS TP -2.5, 4k band -49.6 (35.5 dB below), safe zones clear.
