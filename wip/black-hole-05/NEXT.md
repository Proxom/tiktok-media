# black-hole-05 (game G black hole, "Game 5", faces + voice) — 19 Nov 13:10 run
Slot: 29 Nov 01:00 Europe/London (G last on 26 Nov 01:00; 28 Nov = H + A).
Hook: "Game 5 · Who survives? 😱" + "RED won Game 4. Pick a face 👇". WINEX=0 (RED) -> PURPLE wins.
Rebuild: cd tools/black-hole && N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 GAME=5 PREVWIN=RED WINEX=0 node sim.js data.js 7696 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/bh/build ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: seed 7696, PURPLE wins at 21.52 s; eaten GREEN 4.5 (first eat earlier than Game 4's 6.8), ORANGE 9.8, YELLOW 13.2, RED 16.8, BLUE 21.5 (duel 4.7 s); check.js PASS (tunnel 0). Video 27.02 s, final eat 22.87 s (85 %).
Review v1 (subagent): 6.8 (hook 7, polish 6, clarity 8, pacing 6, payoff 7); its "FAIL" = the final-eat subtitle ran ~1.5 s on the video clock (slow-mo) -> fix round (page.html): subtitle 0.42 sim s, counter cover stays opaque under the fading pill (no stats row ghost). Not done: hole tint during the gold flash, confetti clipped at the arena edge.
Gate (final v2): 1080x1920 60 fps H.264 CRF 16 + AAC, 27.02 s, YAVG 37.1 / 36.2, -14.0 LUFS TP -2.5, 4k band -47.1 (33.1 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Game 5 🕳️ RED won Game 4. The hole grows every second, touch it and you're gone. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 5 😱 Who survives the black hole? Pick a face 👇
DONE: media/black-hole-05. Next G = Game 6 with PREVWIN=PURPLE WINEX=4.
