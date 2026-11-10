# ball-battle-survivor-03 (family B, episode 3 = "Game 3") — 10 Nov 03:07 run
Why B at 21:00: 10 Nov plan (A 01 / D 17 / B 21). Tests 1+2 from reports/market-2026-11-09.md: "Game N" + last-winner crown, and SPEED +10% after every knock-out.
Engine change (tools/ball-battle): SPEEDUP env (after every non-final KO all balls x1.1 and speed limits x1.1, logged as 'speed' events, check.js verifies them), GAME/LASTWIN/FOLLOWTEXT env,
 hook "Game N · Pick a color 👇", "Last winner: X 👑 Can it win again?" for 3.4 s, crown over the winner's mini ball, "SPEED +10% ⚡" under "X OUT!", rule line shows the total speed-up,
 end "X WINS AGAIN! 🏆" / "X IS THE NEW CHAMP! 👑", follow pill inside the dimmed arena for the last 1.4 s.
Rebuild: cd tools/ball-battle && SPEEDUP=.1 GAME=3 LASTWIN=2 FOLLOWTEXT='Follow → Game 4 is next' HP=13 RMIN=32 RK=3.2 TAIL=3.2 SHR=.12 MAXGAP=4.5 MINT=25 MAXT=33 MIDMAX=11 FIRSTMAX=15 TIEMAX=1 node sim.js data.js 200000 && node check.js && ./make.sh <out.mp4> 4 && ./gate.sh <mp4> <dir>
Result: seed 203059, YELLOW wins again on 1 HP; OUT GREEN 11.5 s (speed x1.1), BLUE 21.2 s (x1.21), RED 27.8 s; 51 crashes, 1 tie (no HP lost), tunnel 0, check.js PASS.
Note: seeds 212965 and 221748 (other ranges) also had YELLOW winning: check for a start-position bias before Game 4 (randomise which colour gets which start corner).
Caption: Game 3 👇 YELLOW won Game 2. Pick your color before the first crash. The slower ball loses 1 HP and every knockout makes the rest faster. Who survives? #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 👇 Can YELLOW win again? Every KO = SPEED +10%
Slot: 10 Nov 21:00 Europe/London.
