# ball-battle-survivor-04 (family B, "Game 4") — 12 Nov 03:07 queue-check run
Why B at 01:00: 13 Nov 17:00 = 1M+ #5 (regenerating ring walls, family A) and 12 Nov 21:00 = A -> 13 Nov 01:00 must not be A; E went 01:00 on 12 Nov (rotation) and is due at 13 Nov 21:00 / 14 Nov 01:00; D on hold. B last 11 Nov 21:00.
Engine change (tools/ball-battle): SHUF=1 random start corner per color (Games 2+3 both YELLOW, seeds in other ranges too -> start bias from the fixed corner), CX env (525: ring glow out of the right safe zone),
 STREAK env -> hook line "YELLOW won 2 in a row 👑 Can it make it 3?".
Rebuild: cd tools/ball-battle && SHUF=1 CX=525 SPEEDUP=.1 GAME=4 LASTWIN=2 STREAK=2 FOLLOWTEXT='Follow → Game 5 is next' HP=13 RMIN=32 RK=3.2 TAIL=3.2 SHR=.12 MAXGAP=4.5 MINT=25 MAXT=33 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 DUELMAX=6 node sim.js data.js 320000 && node check.js && ./make.sh <out.mp4> 4 && ./gate.sh <mp4> <dir>
Result: seed 320288, GREEN wins on 1 HP (new champ); OUT BLUE 13.8 s (x1.1), YELLOW 24.1 s (x1.21), RED 28.5 s; 51 crashes, 1 tie, tunnel 0, check.js PASS; video 34.2 s, final KO at 30.2 s (88%).
Caption: Game 4 👇 YELLOW won 2 in a row. Pick your color before the first crash. The slower ball loses 1 HP, every knockout makes the rest faster. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 4 👇 YELLOW won 2 in a row. Can it make it 3?
Slot: 13 Nov 01:00 Europe/London.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG first 40.5 / last 39.2, -14.0 LUFS TP -2.2, 4k band -49.9 (35.9 dB below). Spelling OK. Safe zones clear (ring right edge x≈922 < 930 with CX 525).
Rule sheet: 4 balls 13 HP in one ring; every crash the SLOWER ball loses 1 HP; 0 HP = OUT; after each non-final KO all balls +10 % speed and the ring shrinks 12 %; last ball alive wins.
Review v1: 7.2 (hook 7, polish 7, clarity 8, pacing 6, payoff 8), LOGIC PASS. Fixed once: follow pill now goes on the side away from the winner (CY-215 / CY+200 by the winner's mean y in the last 1.5 s), text 50 px; loop cross-fade (tools/loopfade.sh).
Still open (next B engine work): ring shrink hard to see (make it 8-10 % per KO with a flash), slow final duel 25-29 s, clumping at 9-12 s.
DONE: media/ball-battle-survivor-04.
