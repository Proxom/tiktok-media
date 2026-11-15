# black-hole-01 (family B last one standing, new outlier after list #8) — 15 Nov 03:07 run (QUEUE 1 -> fill to 3)
Slot: 17 Nov 17:00 Europe/London (1M+ slot).
List #8 "Can the ball escape 1000 rings?" SKIPPED: no copy above 1M views / 100K likes was verifiable (best found: @satisfyingba1ls "Can the ball escape 1500 rings?" Instagram 264K plays; YouTube "CAN THE BALL ESCAPE 1000 RINGS ?" (Ball Logic) ~10K views). AGENT.md: skip when the 1M is not confirmed.
List ended -> new outlier (reports/outliers.md): "Black Hole Gravity Simulation: Can balls outrun the growing black hole?" (physics short credited to 'Our Physique'), Facebook Reel 2.2M views (20 Jun 2026)
  https://www.facebook.com/moolaram.nahar/videos/1694985848992769/ — NOTE: platform is Facebook, not TikTok/YouTube Shorts (no TikTok/YT copy found quickly); flagged for the GM.
Our twist: 6 colored balls with eyes orbit inside our neon ring; the hole grows every second; touch it = eaten; LEFT n/6, HOLE xN, timer, "Pick a color".
NEW ENGINE tools/black-hole (sim.js, page.html, check.js, audio.py, make.sh, gate.sh, preview.js, render.js).
Rule sheet:
 1. 6 balls fly inside one closed ring around a black hole in the middle; the hole pulls every ball toward the middle (gravity GM/(d^2+S^2); the pull grows with the hole).
 2. The hole grows from radius 34 px to 330 px over 30 s (HOLE x = radius / start radius).
 3. Balls bounce off the ring wall and each other (elastic, equal mass); nothing else pushes them.
 4. A ball that touches the hole is EATEN (out). LEFT = 6 - eaten.
 5. Last ball outside wins; then the hole stops growing.
Params: N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 (defaults R 400 RB 26 RH0 34 RH1 330 TG 30 GM0 2.2e7 GK 1.2 S 30 CX 495 CY 1030), seed 147 (search start 1).
Rebuild: cd tools/black-hole && N=6 V0=550 FIRSTMIN=3 GAPMIN=1.8 GAPMAX=6 MINT=21 MAXT=25 node sim.js data.js 1 && node check.js && TMPD=/tmp/claude-0/bh/build ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>
Result: BLUE wins at 23.90 s; eaten ORANGE 5.3, RED 8.4, PURPLE 13.7, YELLOW 19.6, GREEN 23.9 (duel 4.3 s); 117 wall hits + 8 bumps = notes; check.js PASS (min live gap to hole 0.23 px, tunnel 0); video 29.40 s, final eat at 25.25 s (85.9 %).
Review v1: 7.2 (hook 7, polish 7, clarity 8, pacing 7, payoff 7). Reviewer-flagged glitch: the follow pill jumped (its position followed the winner's y) during the loop fade.
Fix round (once): follow pill fixed inside the top panel over the counters row (never moves, never covers the ring); 'Last of 6' line fades in with the header; eaten dots get a bold X. Plus: swirl clipped inside the ring, hook shortened ('Who survives the black hole? 😱' + 'Pick a color before it grows 👇').
Gate (final v2): 1080x1920 60 fps H.264 CRF 16 + AAC, 29.40 s, YAVG first 36.9 / last 36.3, -14.0 LUFS TP -2.8, 4k band -47.4 (33.4 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
DONE: media/black-hole-01 (mp4 + cover.jpg at 21.5 s, FINAL 2).
Caption: The black hole grows every second 😱 Touch it and you're gone. Pick a color before it starts 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Who survives the black hole? 😱 Pick a color 👇
