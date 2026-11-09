# plinko-pick-bin-02 (family D plinko, episode 2 = "Game 2") — 9 Nov 19:07 run
Why D: slot 10 Nov 17:00 (10 Nov: A at 01:00, D at 17:00, B at 21:00; yesterday D was at 21:00). Test 1 from reports/market-2026-11-09.md: numbered series + returning champion.
Engine change (tools/plinko): GAME=N -> hook "Game N · Pick a color 👇"; LASTWIN=i -> "Last winner: RED 👑 Can it win again?" for 3.4 s + crown on that bin's label; end title "X WINS AGAIN! 🏆" or "X IS THE NEW CHAMP! 👑"; FOLLOWTEXT env for the follow pill.
Rebuild: cd tools/plinko && PRE=2.6 TAIL=4.4 LASTDECIDES=1 GAME=2 LASTWIN=0 FOLLOWTEXT='Follow → Game 3 is next' node sim.js data.js 500 && node check.js && ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>
Result: seed 615, RED 10 / BLUE 11 / YELLOW 7 / GREEN 8, BLUE wins by 1 on the last ball (breaks a 10-10 tie with RED), 5 lead changes, 402 peg hits, tunnel 0, check.js PASS.
Video: 29.3 s 60 fps CRF 16, last landing at 24.55 s (84%), -14.0 LUFS TP -2.2, 4k band 34.7 dB below.
Caption: Game 2 👇 RED won last time. Pick a color before the first ball lands. Did yours win? Follow for Game 3 #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 👇 Can RED win again? Pick a color before the drop
Slot: 10 Nov 17:00 Europe/London. Game 3 (LASTWIN=1, BLUE) must follow in a later D turn.
