# black-hole-03 (game G black hole, "Game 3", faces + voice) — 18 Nov 22:07 run
Slot: 23 Nov 01:00 Europe/London (G last on 20 Nov 01:00; 22 Nov = I + F).
Hook: "Game 3 · Who survives? 😱" + "PURPLE won Game 2. Pick a face 👇".
Rebuild: cd tools/black-hole && N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 GAME=3 PREVWIN=PURPLE WINEX=4 node sim.js data.js 3701 && node faces.js data.js && node check.js && make.sh/loopfade/gate
Result: seed 3847, GREEN wins at 23.74 s; eaten PURPLE 5.9, RED 10.0, BLUE 12.9, YELLOW 18.5, ORANGE 23.7 (duel 5.3 s); check.js PASS (min live gap 0.02 px, tunnel 0). Voices 10. Video 29.2 s, final eat 25.08 s (86 %).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG 37.1 / 36.6, -13.9 LUFS TP -2.7, 4k band -47.5 (33.6 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Game 3 🕳️ PURPLE won Game 2. The hole grows every second, touch it and you're gone. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 😱 Who survives the black hole? Pick a face 👇
