# ball-battle-survivor-05 (family B, "Game 5") — 14 Nov 11:07 run
Why B at 15 Nov 01:00: 14 Nov 01:00 = E, 14 Nov 17:00 = A (heal-ring-01); 15 Nov 17:00 = 1M+ #6; E due again 16 Nov 01:00. B last 13 Nov 01:00.
Engine change (tools/ball-battle): CAMLAG env (camera follows the ring shrink 0.7 s late, so the wall is SEEN closing in) + ring flash for 1.3 s after each knock-out
 (fixes the Game 4 note "ring shrink hard to see"); KO/SPEED label box now follows the SPEED label (was an empty dark box at the top ~1.5 s after each KO); bandOf uses the lagged zoom.
Rebuild (FINAL v3): cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.15 GAME=5 LASTWIN=3 FOLLOWTEXT='Follow → Game 6 is next' HP=13 RMIN=40 RK=2.6 TAIL=3.2 SHR=.15 MAXGAP=4.5 MINT=23 MAXT=32 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=5 CAMLAG=.7 WINEX=3 node sim.js data.js 530000 && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: seed 533095, YELLOW (Game 2+3 champ) wins on 1 HP, back as champion; OUT RED 14.2 s (x1.15), GREEN 18.7 s (x1.32), BLUE 23.4 s; 51 crashes, 0 ties, tunnel 0, check.js PASS; video 29.1 s, final KO at 25.1 s (86%).
Rule sheet: 4 balls 13 HP in one ring; every crash the SLOWER ball loses 1 HP; 0 HP = OUT; after each non-final KO all balls +15 % speed and the ring shrinks 15 % (camera follows 0.7 s late); last ball alive wins.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG first 40.6 / last 39.5, -14.0 LUFS TP -2.5, 4k band -49.9 (35.9 dB below). Spelling OK (HP = game term). Safe zones clear.
Review v1 (seed 503760 version): 6.0 (hook 7, polish 6, clarity 6, pacing 5, payoff 6), LOGIC PASS (BLUE's fast early HP loss = 4 separate crashes with 3 partners, pair cooldown 0.15 s holds).
Fix round (once): 1) min ball size 58 % of start (RMIN 40 RK 2.6, was 48 %) + HUD crown moves to the winner; 2) SPEED label 0.9 s (was 1.8 s), box follows it; 3) pace: SPEEDUP .15, SHR .15 -> KOs 4.5 s apart (was 9 s gap). New seed search (RMIN 44 found no seed in 6000: too many ties).
Caption: Game 5 👇 GREEN ended YELLOW's streak in Game 4. Pick your color before the first crash. The slower ball loses 1 HP, every knockout makes the rest faster. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 5 👇 GREEN won Game 4. Pick a color! Who survives this time?
Slot: 15 Nov 01:00 Europe/London.
Next B ideas: winner scale-up + center at the win; KO banner outside the ring (no room under the HUD now).
