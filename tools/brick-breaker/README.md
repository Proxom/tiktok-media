# tools/brick-breaker — Game I "Brick breaker" (built 17 Nov 2026, with the shared faces + voice)
4 balls (RED, BLUE, YELLOW, GREEN), constant speed, no gravity, closed neon box with a 9x6 wall of bricks. A brick breaks on first touch = +1 for that ball's color.
Last brick = game over (balls coast to a stop); most bricks wins (seeds with a tie for first are skipped).
Pipeline: `GAME=N FOLLOWTEXT='Follow → Game N+1 is next' SPEED2=1.3 MAXGAP=2.6 LASTGAP=2 node sim.js data.js <seed> && node faces.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh <raw.mp4> <out.mp4> && ./gate.sh <out.mp4> <dir>`
Seed filter (sim.js): end 24-30 s, >= 3 lead changes (LEADMIN), winning margin 1-3 (MARGINMAX), longest gap between breaks < MAXGAP, last gap < LASTGAP, tunnel 0. WINEX=1,2 skips winners (series variety).
preview.js <dir> t1 t2 ... = quick PNG frames. Audio: Minuet in G (public domain), one note per brick, soft marimba + wood.
