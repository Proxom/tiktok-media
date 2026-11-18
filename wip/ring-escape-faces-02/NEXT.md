# ring-escape-faces-02 (game A ring escape, faces + voice) — 18 Nov 22:07 run
Slot: 23 Nov 17:00 Europe/London (A last on 20 Nov 17:00; 23 Nov 01:00 = G; 22 Nov = I + F).
Engine change (review of -01): the 'win' face event fires 0.2 s before the escape, so the ^ ^ eyes are visible while it squeezes out.
Tried ESCMAXY=1300 (escape above the bottom safe line): 0 of 6000 seeds pass -> not used (same as every earlier A video; the ring bottom is at y 1420).
Rebuild: cd tools/ball-grow && R=390 CY=1030 GAP=.21 GROW=1.35 VMIN=430 VMAX=780 VFPS=60 S1=.8 MINT=27 MAXT=31 MINRATIO=.96 ESCXMIN=60 ESCXMAX=930 TOPMIN=640 node sim.js data.js 936939; set hue 320 + bg + followText; node faces.js data.js; node check.js; make.sh; loopfade; gate.
Result: seed 936939, 34 bounces, escape at sim 30.43 s at 96.7 % (shown 97 %), video 36.93 s, escape at 32.08 s (87 %); check.js PASS (maxPen 0). Voices 2 (eep, giggle).
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, YAVG 38.0 / 37.4, -14.1 LUFS TP -2.2, 4k band -46.5 (32.4 dB below), spelling OK, loopfade 0.4 s.
Caption: Every bounce it gets bigger 😬 Can it squeeze out before 100%? Guess the % before the end 👇 Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: It grows every bounce 👀 Will it fit through? Guess the % 👇
DONE: media/ring-escape-faces-02.
Review v1 (subagent): 6.8 (hook 6, polish 7, clarity 8, pacing 6, payoff 7), LOGIC PASS.
Fix round (once, tools/ball-grow/page.html): all text (incl. the meter %) fades out 0.42-0.54 s before the end, so the 0.4 s loop cross-fade never ghosts "97%" over "33%"; follow pill bigger (700x98, 54 px, higher contrast). Not done (physics/sim changes): escape fall through the bottom gap into the lower safe area (ESCMAXY finds no seeds), bigger start ball (R0).
Gate (final v2): YAVG 38.0 / 36.9, -14.1 LUFS TP -2.2, 4k band -46.5 (32.4 dB below). Slot 23 Nov 17:00.
