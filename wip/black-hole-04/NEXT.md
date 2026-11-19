# black-hole-04 (game G black hole, "Game 4", faces + voice) — 19 Nov 13:10 run
Slot: 26 Nov 01:00 Europe/London (G last on 23 Nov 01:00; 25 Nov = H + A).
Hook: "Game 4 · Who survives? 😱" + "GREEN won Game 3. Pick a face 👇" (GREEN won black-hole-03). WINEX=3 (GREEN) -> a new winner.
Engine (tools/black-hole/page.html, from the Game 3 review + this review): confetti starts outside the winner and never over the hole; LEFT 1/6 in gold at the win; winner pulse; crown 84 px, in 0.25 s, beside the winner if it would touch the HUD panel; HUD text + follow pill fade 0.62 s before the end (clean loop); the final eat is named in the win subtitle for 0.75 s ("GREEN got eaten 😱"), then "Last of 6 · Did you pick RED? 💬".
Rebuild: cd tools/black-hole && N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 GAME=4 PREVWIN=GREEN WINEX=3 node sim.js data.js 5882 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/bh/build ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: seed 5882, RED wins at 23.49 s; eaten ORANGE 6.8, YELLOW 10.5, PURPLE 15.1, BLUE 19.4, GREEN 23.5 (duel 4.1 s); check.js PASS (min live gap 0.09 px, tunnel 0). Voices 12. Video 28.95 s, final eat 24.82 s (86 %).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 28.95 s, YAVG 37.1 / 36.3, -14.0 LUFS TP -2.5, 4k band -47.5 (33.5 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Review v1 (subagent): 6.4 (hook 6, polish 7, clarity 7, pacing 6, payoff 6), LOGIC "FAIL" = the final eat was never named (win text replaced it in one frame; the winner was right) -> fixed (subtitle above) + crown sooner. Not done (physics): first eat at 6.8 s (hole growth), balls bigger (RB 25 -> 35+) for readable faces. Next G: try a bigger RB and faster early hole growth.
Caption: Game 4 🕳️ GREEN won Game 3. The hole grows every second, touch it and you're gone. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 4 😱 Who survives the black hole? Pick a face 👇
DONE: media/black-hole-04.
