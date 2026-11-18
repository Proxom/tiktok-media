# ball-battle-survivor-07 (game B battle, "Game 7", faces + voice) — 18 Nov 22:07 run
Slot: 21 Nov 01:00 Europe/London (20 Nov = G 01:00 + A 17:00; B last on 18 Nov 17:00).
Rebuild: cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.15 GAME=7 LASTWIN=3 FOLLOWTEXT='Follow → a new one every day' HP=13 RMIN=40 RK=2.6 TAIL=3.2 SHR=.15 MAXGAP=4.5 MINT=23 MAXT=32 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=5 CAMLAG=.7 WINEX=3 node sim.js data.js 710000 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: seed 713557, RED wins on 3 HP (new champ; GREEN won Game 6); OUT YELLOW 14.8 s, BLUE 19.4 s, GREEN 23.3 s; 49 crashes, tunnel 0, check.js PASS; video 28.93 s, final KO at 24.93 s (86 %). Voices 7.
Engine fix (from the Game 6 review): the FINAL KO label ("GREEN OUT!") now clears before the champion crown appears (page.html KA()).
Rule sheet: 4 balls 13 HP in one ring; every crash the SLOWER ball loses 1 HP; 0 HP = OUT; after each non-final KO all balls +15 % speed and the ring shrinks 15 %; last ball alive wins.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 28.93 s, YAVG first 40.7 / last 39.6, -14.0 LUFS TP -2.5, 4k band -49.7 (35.7 dB below), spelling OK (HP = game term), safe zones clear, loopfade 0.4 s.
Caption: Game 7 👇 GREEN won Game 6. Pick your color before the first crash. The slower ball loses 1 HP. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 7 👀 GREEN won Game 6. Pick a color! Who survives this time?
Review v1 (subagent): 7.2 (hook 7, polish 8, clarity 7, pacing 6, payoff 8). Reviewer called LOGIC FAIL "ring springs back after each KO"; checked: NOT a logic error: the sim really shrinks the ring 15 %/KO (sim.js Rt, kos) and page.html zooms the camera in (Z=R/Rt, camLag .7 s) while balls shrink with HP, so on-screen sizes look constant. Counters, KO times, speed lines, winner all correct -> schedule.
Engine notes for next B: make the shrink VISIBLE (smaller zoom, or a ghost ring of the start size); fade the header + pill before the loop cross-fade; follow pill under the header (clears the crown); stack "-1" pops; first KO earlier (~11 s).
Slot: 21 Nov 01:00 Europe/London.
