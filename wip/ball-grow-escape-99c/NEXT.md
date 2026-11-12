# ball-grow-escape-99c (family A ring escape) — 12 Nov 03:07 queue-check run (QUEUE 1 -> make 2)
Why A at 21:00: 12 Nov = E 01:00 (merge-race-01), C 17:00 (marble-disaster-01) -> 21:00 needs a third family; D on watch (falling), A median ~190 > account median 160.
outlier: none (not a 17:00 1M+ slot).
Engine change (tools/ball-grow/page.html): TENSION BEATS — when the meter (rounded %) first reaches 90/95/97, hook line 2 becomes a red callout with the meter's own number for 1.3 s
 ("91%... still fits? 😬", "97%!! last chance 🔥"); gap caps pulse red once the ball is at 90 %+.
Params: seed 624794, R 390, CY 1030, GAP .21, GROW 1.35, VMIN 430, VMAX 780, VFPS 60, S1 .8, MINT 27 MAXT 31 MINRATIO .96 ESCXMIN 60 ESCXMAX 930 TOPMIN 640; hue 320 (pink ring), bg ['#2c1446','#130a2a','#05030c'], followText 'Follow → a new one every day'.
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=27 MAXT=31 MINRATIO=.96 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 624001
  then set hue 320 + bg + followText in data.js, node check.js, TMPD=... ./make.sh <out.mp4> 4, tools/ball-battle/gate.sh <mp4> <dir>.
Result: 35 bounces, escape at sim 30.78 s (video 32.4 s of 37.3 s = 87%) at 98.5% (shown 99%), check.js PASS (maxPen 0).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG first 38 / last 42, -14.0 LUFS TP -2.2, 4k band -46.9 (32.9 dB below). Spelling OK.
Rule sheet: 1 ball in a rotating ring with one gap; every bounce grows it by a fixed step; meter = ball diameter / free gap width; it escapes only through the gap under 100 %; 99 % here.
Caption: It grows every bounce 😬 Can it squeeze out before 100%? Guess the % 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: It grows every bounce. 97%... 99%... will it still fit? 😬
Slot: 12 Nov 21:00 Europe/London.
