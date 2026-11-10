# plinko-pick-bin-03 (family D plinko, episode 3 = "Game 3") — 10 Nov 03:07 run
Why D at 01:00: 10 Nov was A 01 / D 17 / B 21 -> 11 Nov rotates to D 01 / (17:00 = 1M+ list #1, melody ball in a circle) / B 21. Keeps the "Game 3 is next" promise from Game 2.
Engine change (tools/plinko/page.html, review fixes): hook "Last winner" line held to 4.0 s; crown hands over to the winner's label 0.5 s after the end.
Rebuild: cd tools/plinko && PRE=2.6 TAIL=4.4 LASTDECIDES=1 GAME=3 LASTWIN=1 FOLLOWTEXT='Follow → Game 4 is next' node sim.js data.js 800 && node check.js && ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>
Result: seed 804, RED 11 / BLUE 7 / YELLOW 10 / GREEN 8, RED wins by 1 on the last ball (breaks a 10-10 tie with YELLOW) -> "RED IS THE NEW CHAMP! 👑", 4 lead changes, 405 peg hits, tunnel 0, check.js PASS.
Video: 30.7 s 60 fps CRF 16, last landing at video 25.98 s (84.5%), -14.0 LUFS TP -2.4, 4k band 34.4 dB below.
Review v1: 7.4 (hook 7, polish 8, clarity 8, pacing 6, payoff 8), logic PASS. Next engine work: last ball should not creep down a wall for 3 s (drop it nearer the centre), "X takes the lead!" flash mid-game, header 10-20 px lower.
Caption: Game 3 👇 BLUE won Game 2. Pick a color before the first ball lands. Did yours win? Follow for Game 4 #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 👇 Can BLUE win again? Pick a color before the drop
Slot: 11 Nov 01:00 Europe/London. DONE: media/plinko-pick-bin-03. Game 4 must use LASTWIN=0 (RED) and GAME=4.
