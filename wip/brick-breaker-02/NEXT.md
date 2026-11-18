# brick-breaker-02 (game I brick breaker, "Game 2", faces + voice) — 18 Nov 22:07 run
Slot: 22 Nov 01:00 Europe/London (I last on 19 Nov 17:00; 21 Nov = B + H).
Hook: "Game 2 · Pick a color 👇" + "GREEN won Game 1 · every brick = +1" (GREEN won brick-breaker-01). New PREVWIN env in sim.js, hook line in page.html.
Rebuild: cd tools/brick-breaker && GAME=2 PREVWIN=GREEN WINEX=3 SPEED=700 MINT=23 FOLLOWTEXT='Follow → a new one every day' SPEED2=1.3 MAXGAP=2.6 LASTGAP=2 node sim.js data.js 10001 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: seed 10852, RED wins 19 vs BLUE 18 / YELLOW 9 / GREEN 8 (sum 54), 4 lead changes, 79 bumps, check.js PASS (tunnel 0, maxStep/r 0.045, maxPen 1.30). Voices 9. Video 32.47 s.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG 47.6 / 45.8, -14.1 LUFS TP -2.2, 4k band -50.8 (36.7 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Review v1 (subagent): 7.4 (hook 7, polish 8, clarity 8, pacing 6, payoff 8), LOGIC PASS -> schedule. Engine notes: shorten the LAST 2 / LAST 1 endgame (speed boost at <= 3 bricks), fade panel text before the loop cross-fade, "19 vs 18!" in the same frame as "RED WINS!" + flash on the last brick.
Caption: Game 2 🧱 GREEN won Game 1. Every brick a ball breaks = +1 for its color. Pick yours before the first brick breaks 👇 Who breaks the most? #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 🧱 GREEN won Game 1. Pick a color! Who breaks the most? 👇
