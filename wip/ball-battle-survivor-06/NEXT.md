# ball-battle-survivor-06 (family B, "Game 6", FIRST FACES + VOICE video) — 17 Nov 03:07 run
Why B on 18 Nov 17:00: 16 Nov = H (marble-survival-01), 17 Nov = G (black-hole-01); B last 15 Nov 01:00; faces adapter ready in tools/ball-battle (STATE plan).
Rebuild: cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.15 GAME=6 LASTWIN=2 FOLLOWTEXT='Follow → Game 7 is next' HP=13 RMIN=40 RK=2.6 TAIL=3.2 SHR=.15 MAXGAP=4.5 MINT=23 MAXT=32 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=5 CAMLAG=.7 WINEX=2 node sim.js data.js 610000 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
(needs: python3 -m pip install numpy pyspellchecker)
Result: seed 610993, GREEN wins on 1 HP (new champ, YELLOW won Game 5); OUT BLUE 12.7 s, RED 18.8 s (x1.15), YELLOW 23.2 s (x1.32); 51 crashes, 1 tie, tunnel 0, check.js PASS; video 28.9 s, final KO at 24.85 s (86 %).
Faces: two eyes only; voices oof@3.42 oof@10.64 ooo@12.72 ooo@18.81 oof@22.02 ooo@23.25 giggle@24.08 (7 voices, never overlapping, checkVoices PASS).
Rule sheet: 4 balls 13 HP in one ring; every crash the SLOWER ball loses 1 HP; 0 HP = OUT; after each non-final KO all balls +15 % speed and the ring shrinks 15 % (camera follows 0.7 s late); last ball alive wins.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG first 40.7 / last 39.7, -14.0 LUFS TP -2.5, 4k band -49.7 (35.7 dB below). Spelling OK (HP = game term). Safe zones clear. Contact sheet clean.
Listen check: by measurement (voices built 12 dB under impacts by voice.py; whole mix passes loudness + 4 kHz gate); the agent cannot hear audio.
Review v1: 7.4 (hook 7, polish 7, clarity 8, pacing 7, payoff 8), LOGIC PASS -> schedule.
Engine fixes for next B (review): ring shrink hard to see because the camera zooms back (show it), follow pill overlaps winner crown, stacked "-1" popups, "YELLOW OUT!" banner lingers under champion banner, "Did your color win?" low contrast.
Caption/title: caption.txt. Slot: 18 Nov 17:00 Europe/London.
