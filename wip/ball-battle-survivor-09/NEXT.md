# ball-battle-survivor-09 (game B last ball standing, "Game 9", faces + voice) — 19 Nov 13:10 run
Slot: 27 Nov 01:00 Europe/London (B last on 24 Nov 01:00; 26 Nov = G + I).
Hook: "Game 9 · Pick a color 👇" + "Last winner: GREEN 👑 Can it win again?" (GREEN won Game 8). WINEX=3 -> YELLOW is the new champ.
Rule sheet: 4 balls, 13 HP each; every crash the SLOWER ball loses 1 HP; 0 HP = OUT; every KO makes the rest +15 % faster; last ball wins.
Engine (tools/ball-battle/page.html, from this review): one HP pop per ball (stacked hits merge into -2/-3) and it flips below its ball if it would sit on another ball; crown beside the champ if it would reach the panel; after the win the champ glides to the arena centre (render only, game over) and the follow pill sits at CY+250 (the champ used to roll over the pill); pill row search 27 rows (non-win fallback).
Rebuild: cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.15 GAME=9 LASTWIN=3 FOLLOWTEXT='Follow → a new one every day' FOLLOWS=2 HP=13 RMIN=40 RK=2.6 TAIL=3.2 SHR=.15 MAXGAP=4.5 MINT=23 MAXT=32 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=5 CAMLAG=1.0 WINEX=3 node sim.js data.js 960531 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/bat/build ./make.sh <raw.mp4> 4 && ../loopfade.sh && ./gate.sh
Result: seed 960531, YELLOW wins on 1 HP. OUT: BLUE 11.6 s, RED 18.8 s, GREEN 23.7 s. 51 crashes, 0 ties, tunnel 0, check.js PASS. Video 29.38 s, final KO at 25.37 s (86 %). 9 voices.
Review v1 (subagent): 6.4 (hook 6, polish 6, clarity 6, pacing 7, payoff 7), LOGIC PASS -> one fix round (render only): stacked -1 pops, champ over the follow pill, crown into the panel. Not done: bigger ring/HP numbers + ring lower (layout change for the next B), first crash before 0.5 s (physics).
Gate (final v2): 1080x1920 60 fps H.264 CRF 16 + AAC, 29.38 s, YAVG 39.9 / 39.9, -13.9 LUFS TP -4.1, 4k band -49.8 (35.9 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Game 9 👇 GREEN won Game 8. Pick your color before the first crash. The slower ball loses 1 HP. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 9 👀 GREEN won Game 8. Pick a color! Who survives this time?
DONE: media/ball-battle-survivor-09. Next B = Game 10 with LASTWIN=2 (YELLOW).
