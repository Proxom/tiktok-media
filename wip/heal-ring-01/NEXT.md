# heal-ring-01 (family A ring escape, 1M+ list #5 "the wall heals") — 14 Nov 03:07 queue-check run (QUEUE 0 -> make 1)
Slot: 14 Nov 17:00 Europe/London (1M+ slot). 15 Nov 01:00 should be B (not A, not E).
outlier: "Can it break the whole spiral? 🤔" (CodeCraftedPhysics, YouTube Shorts) https://www.youtube.com/shorts/HznYfH4sOJU — 11M views on the channel's Shorts page (checked 14 Nov).
  The list's exact #5 title ("Will the ball manage to escape this time?", 4.4M) could not be found/verified, so the closest verified 1M+ short of the same idea (ball breaking through ring layers) is the reference. Idea only; our engine, look, text and sound.
Our twist: the wall HEALS — broken bricks grow back after 3.5 s, so the ball has to find a hole before it closes.
NEW ENGINE tools/heal-ring (sim.js, page.html, check.js, audio.py, make.sh, preview.js, render.js).
Rule sheet:
 1. One ball bounces inside 3 nested rotating brick rings; only the innermost remaining ring is solid (the outer ones wait, dimmed).
 2. Every hit takes 1 HP from the brick it touches; 2 hits = the brick breaks and leaves a hole.
 3. A hole grows back after 3.5 s at full HP (only when the ball is clear of it); the arc along the hole shows the timer.
 4. When the ball gets fully outside a ring through a hole, that ring shatters; out of the 3rd ring = BROKE OUT.
 5. HITS counter = logged hit events; the end shows the real total.
Params: NS=12,16,20 HPS=2,2,2 HEAL=3.5 MINT=27 MAXT=32 R1=5,12 R2=14,23 TAIL=4.2 (defaults RS 215,305,395 OMS .9,-.7,.55 VMIN 520 VMAX 820 R0 26 G 620 CX 500 CY 1030), seed 301.
Rebuild: cd tools/heal-ring && NS=12,16,20 HPS=2,2,2 HEAL=3.5 MINT=27 MAXT=32 R1=5,12 R2=14,23 TAIL=4.2 node sim.js data.js 301 && node check.js && TMPD=/tmp/claude-0/bg/hr ./make.sh <out.mp4> 4
Result: walls down at 7.45 / 14.43 / 27.21 s, 40 hits, 13 breaks, 5 heals, maxPen 0, check.js PASS; video 33.18 s, break-out at 28.3 s (85 %).
Caption: The wall heals itself 🩹 2 hits make a hole, but every hole grows back. Guess how many hits it takes to break out 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: The wall HEALS itself 🩹 Can the ball break out? Guess the hits 👇
