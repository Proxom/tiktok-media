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
Result: BLUE wins at 23.90 s; eaten ORANGE 5.3, RED 8.4, PURPLE 13.7, YELLOW 19.6, GREEN 23.9 (duel 4.3 s); 117 wall hits + 8 bumps = notes; check.js PASS (min live gap to hole 0.23 px, tunnel 0); video 27.32 s... (see final).
