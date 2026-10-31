# tools/ : reusable video engines for the @dipnotscom TikTok agent
Each folder is one format. Read the FORMAT BOOK in ../AGENT.md first (formats, how to make an episode, quality ladder, pitfalls).
- merge-arena: "Will X evolve?" merge arena (2D canvas, sim.js + CHAINS themes, audio from sim events)
- marble-run: musical marble run to a FINISH (three.js, xylophone staircase, public-domain melodies)
- dominoes: rainbow domino spiral (three.js instanced, gen.js timing shared with audio.py)
- geo-loops: E "infinite geometric loop" (three.js lobed track, brass balls through chime rings; seamless video+audio loop; gen.js env NB/NR/T/LOBES/SEED, page.html?theme=)
- ball-rings: balls escaping neon rotating rings (2D canvas, deterministic sim)
- jelly-press, square-hole, scary-pumpkin, sort-race, pendulum-wave, cafe-wall, odd-donut, phone-1pct, loading-bar, marble-race, sphere-wave: older one-off videos (retired formats), kept as code examples
Common pattern: sim/gen -> data.js -> page.html draws frame(t) -> render.js (4 parallel processes) -> audio.py -> ffmpeg encode (see AGENT.md).
three.min.js is copied per folder (r150-era build); use --use-gl=angle --use-angle=swiftshader in Playwright for WebGL.
