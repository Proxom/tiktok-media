# ball-battle-survivor-08 (game B battle, "Game 8", faces + voice), made 19 Nov 2026 in the 03:07 run
Slot: 24 Nov 01:00 Europe/London (23 Nov is G 01:00 + A 17:00; B last ran 21 Nov 01:00).
Rebuild: cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.15 GAME=8 LASTWIN=0 FOLLOWTEXT='Follow → a new one every day' FOLLOWS=2 HP=13 RMIN=40 RK=2.6 TAIL=3.2 SHR=.15 MAXGAP=4.5 MINT=23 MAXT=32 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=5 CAMLAG=1.0 WINEX=0 node sim.js data.js 858000 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: seed 858495. GREEN wins on 1 HP (new champ; RED won Game 7). OUT: RED 11.8 s (the champ goes first), YELLOW 19.6 s, BLUE 24.1 s. 51 crashes, 0 ties, tunnel 0, check.js PASS. Video 29.73 s, final KO at 25.72 s (86 %). 8 voices.
Rule sheet: 4 balls, 13 HP each, in one ring. Every crash costs the SLOWER ball 1 HP. 0 HP = OUT. After each KO except the last, all balls get +15 % speed and the ring shrinks 15 %. Last ball alive wins.
Gate v2: 1080x1920, 60 fps, H.264 CRF 16 + AAC, 29.73 s; YAVG first 40.8 / last 39.9; -13.9 LUFS, true peak -4.1 dBTP; 4 kHz band -49.7 (35.8 dB below the mix); spelling OK (HP is a game term); safe zones clear; loopfade 0.4 s.
Review v1 (seed 853886, BLUE wins): 6.8 (hook 7, polish 7, clarity 6, pacing 6, payoff 8), LOGIC PASS. One fix round, then scheduled:
 1. Middle too slow (first KO at 14 s) -> new seed with the first KO at 11.8 s.
 2. KO banner hid a ball -> a ball under the banner is drawn again on top of it (engine).
 Plus: a minimum HP number size (30 px); stacked "-1" pops no longer overlap; the follow pill picks the side with the most room for the winner over the whole pill window, and the champion + crown are drawn in front of the pill; the header text + pill fade out before the loop cross-fade; make.sh adds a soft limiter when linear loudnorm would overshoot the true peak (v1 measured +0.3 dBFS without it).
Caption: Game 8 👇 RED won Game 7. Pick your color before the first crash. The slower ball loses 1 HP. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 8 👀 RED won Game 7. Pick a color! Who survives this time?
Next B (Game 9): LASTWIN=3 (GREEN). The engine still hides the ring shrink with the zoom; a smaller zoom needs the KO banner moved (no room in the ring).
