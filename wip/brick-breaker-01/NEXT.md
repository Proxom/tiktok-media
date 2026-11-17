# brick-breaker-01 (NEW game I "brick breaker", "Game 1", faces + voice) — 17 Nov 11:07 run (engine build + gate test video)
Why: QUEUE 2 (full) -> this week's 2nd engine build (I, first in the new-game order). The test video passed the HARD GATE + review, so it fills the next empty 17:00 (19 Nov). Rotation: 17 Nov G, 18 Nov B, 19 Nov I.
Rebuild: cd tools/brick-breaker && GAME=1 FOLLOWTEXT='Follow → Game 2 is next' SPEED2=1.3 MAXGAP=2.6 LASTGAP=2 node sim.js data.js 1 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
(needs: python3 -m pip install numpy pyspellchecker; seed search ~2-3 min)
Result: seed 1641, GREEN wins 15 vs RED 14 / BLUE 14 / YELLOW 11 (last brick by BLUE); 4 lead changes; 56 bumps; check.js PASS (tunnel 0, maxStep/r 0.048, maxPen 1.52 px); video 29.7 s, last brick at 25.5 s (86 %).
Rule sheet: 4 balls, constant speed (rises to x1.3 as the wall falls), no gravity, closed box with 54 bricks; a brick breaks on first touch = +1 for that ball's color; elastic bounces off walls/bricks/balls; last brick ends the game, most bricks wins (no tie seeds); after the end the balls coast to a stop.
Faces: two eyes only; scared = rival on collision course, angry = behind the leader, hit = hard bump, win ^ ^ + giggle, last place (YELLOW) sad + ooo. Voices: oof@1.28 oof@5.76 oof@11.53 oof@15.87 oof@20.32 ooo@24.25 giggle@25.09 (7, checkVoices PASS).
Audio: every brick = next note of Petzold's Minuet in G (public domain, own arrangement, F#3..G4) on soft marimba + wood; bumps/walls quiet low wood; end = rolled G chord.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG first 47.6 / last 45.5, -14.0 LUFS peak -2.3, 4k band -50.2 (36 dB below). Spelling OK. Safe zones clear (panel 322-622, box x 100-928, y 660-1428). Contact sheet clean.
Review v1 (seed 381 version): 7.4 (hook 8, polish 8, clarity 8, pacing 6, payoff 7), LOGIC PASS -> applied fixes: faster endgame (SPEED2 1.3, max gap 2.6 s, last gap < 2 s), crown + "15 vs 14! Did your color win?" right at the end. No logic change -> no second review (AGENT §6).
Next engine fixes: follow pill can still sit next to a ball (move it when a ball passes), the X eyes on hard bumps can look like a knocked-out leader.
Slot: 19 Nov 17:00 Europe/London.
