# brick-breaker-03 (game I brick breaker, "Game 3", faces + voice) — 19 Nov 13:10 run
Slot: 26 Nov 17:00 Europe/London (I last on 22 Nov 01:00; 26 Nov 01:00 = G).
Hook: "Game 3 · Pick a color 👇" + "RED won Game 2 · every brick = +1" (RED won brick-breaker-02). WINEX=0 -> a new winner.
Rule sheet: 4 balls with eyes under a 9x6 wall of 54 bricks; each brick a ball breaks = +1 for its color (live bars, sum = 54 - bricks left); after the last brick the color with the most wins.
Engine (tools/brick-breaker/page.html): HUD text + pill fade 0.62 s before the end (clean loop); follow pill row = farthest from ALL balls (27 rows scanned; was 3 rows vs the winner only -> covered RED in v1); "17 vs 15! Did your color win?" in 0.15 s with the win title.
Rebuild: cd tools/brick-breaker && GAME=3 PREVWIN=RED WINEX=0 SPEED=700 MINT=21 FOLLOWTEXT='Follow → a new one every day' SPEED2=1.3 MAXGAP=2.6 LASTGAP=1.0 node sim.js data.js 22480 && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: seed 22480, BLUE wins 17 vs YELLOW 15 / GREEN 13 / RED 9 (sum 54), 3 lead changes, 59 bumps, check.js PASS (tunnel 0, maxStep/r 0.045). Voices 7. Video 28.73 s, last brick at 24.52 s (85 %).
Review v1 (seed 20231, YELLOW 16-13): 6.8 (hook 7, polish 7, clarity 8, pacing 6, payoff 6), LOGIC PASS (scores = 54 - left at 6 checks). Fix round: new seed with LASTGAP 1.0 (v1 had a 2.5 s "LAST 1 BRICK" stall), pill avoids all balls, subtitle sooner. Not done: bigger win celebration (confetti/zoom).
Gate (final v2): 1080x1920 60 fps H.264 CRF 16 + AAC, 28.73 s, YAVG 45.2 / 45.2, -14.0 LUFS TP -2.4, 4k band -51.0 (37.0 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Game 3 🧱 RED won Game 2. Every brick a ball breaks = +1 for its color. Pick yours before the first brick breaks 👇 Who breaks the most? #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 🧱 RED won Game 2. Pick a color! Who breaks the most? 👇
DONE: media/brick-breaker-03.
