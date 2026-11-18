# black-hole-02 (game G black hole, Game 2, WITH FACES + VOICE) — 18 Nov 22:07 run
Slot: 20 Nov 01:00 Europe/London (19 Nov = F 01:00 + I 17:00, so 20 Nov 01:00 must be neither; G last on 17 Nov).
Hook: "Game 2 · Who survives? 😱" + "BLUE won Game 1. Pick a face 👇" (BLUE really won black-hole-01). Faces hook allowed (faces video).
Rule sheet: same as black-hole-01 (6 balls in a ring around a hole that grows 34 -> 330 px over 30 s and pulls them in; balls bounce off wall + each other; touch the hole = eaten; last ball wins, hole stops).
Rebuild: cd tools/black-hole && N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 GAME=2 PREVWIN=BLUE node sim.js data.js 2611 && node faces.js data.js && node check.js && TMPD=/tmp/claude-0/bh/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ../dodge-ball/gate.sh <out.mp4> <dir>
Result: seed 2620, PURPLE wins at 24.08 s; eaten YELLOW 4.9, RED 9.7, ORANGE 14.0, BLUE 18.9, GREEN 24.1 (duel 5.2 s); check.js PASS (min live gap to hole 0.18 px, tunnel 0). Voices 12 (5 ooo, 6 eep, 1 giggle), checkVoices OK.
Title line shortened to "Game 2 · Who survives? 😱" before the final render.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 29.55 s, YAVG first 37.1 / last 36.5, -13.9 LUFS TP -2.9, 4k band -47.1 (33.2 dB below), spelling OK, safe zones clear, loopfade 0.4 s. Final eat at 25.42 s (86 %).
Review v1 (subagent): 7.4 (hook 7, polish 7, clarity 8, pacing 7, payoff 8), LOGIC PASS -> schedule as is. Engine notes for next time: clear an eaten ball's trail at once; keep winner confetti outside the hole; fade the top panel before the loop cross-fade.
Caption: Game 2 🕳️ BLUE won Game 1. Now every ball has eyes 👀 The hole grows every second, touch it and you're gone. Pick a face before it starts 👇 #satisfying #physics #simulation #oddlysatisfying
Title: Game 2 😱 Who survives the black hole? Pick a face 👇
DONE: media/black-hole-02 (mp4 + cover.jpg at 21.5 s).
