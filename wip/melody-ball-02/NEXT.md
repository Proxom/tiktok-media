# melody-ball-02 (family A "ball in a circle", melody ball episode 2) — 19 Nov 13:10 run
Slot: 25 Nov 17:00 Europe/London (A last on 23 Nov 17:00; 25 Nov 01:00 = H). melody-ball-01 = 261 views (1.74x).
Ours (100% own): one ball, one circle, no gravity; every wall bounce = the next note of Beethoven's "Ode to Joy" (public domain; own marimba arrangement in G major, G3..D4, 30 notes) and +2% speed; chord step 122 deg -> the chords draw a TWISTED TRIANGLE (only the newest 3 chords visible while it plays). Hook "Name the song before it ends 👇". No faces (one 38 px ball, under the 40 px faces rule; voices would clash with the melody).
Engine (tools/melody-ball): KEY env (pad + reveal chord follow the key: Am or G), ANSWER/HOOK2 env, hook text 62/58 px, HUD + progress bar fade 0.62 s before the end, the ball + last ripple/♪ fade in 0.15 s at the reveal.
Rebuild: cd tools/melody-ball && MEL="B3 B3 C4 D4 D4 C4 B3 A3 G3 G3 A3 B3 B3 A3 A3 B3 B3 C4 D4 D4 C4 B3 A3 G3 G3 A3 B3 A3 G3 G3" STEP=122 KEY=G V0=900 SPD=1.02 TAIL=4.2 ANSWER='IT DREW A TWISTED TRIANGLE! 🔺' HOOK2='Name the song before it ends 👇' node sim.js data.js && node check.js && ./make.sh <raw.mp4> 4 && ../loopfade.sh && ../dodge-ball/gate.sh
Result: 30 notes, first 0.36 s, last 15.94 s, SPEED +81 % (1.02^30), tunnel 0, check.js PASS. Video 20.15 s, reveal 79 %.
Review v1 (subagent, on the V0 520/+4 % cut): 6.4 (hook 5, polish 7, clarity 8, pacing 5, payoff 7), LOGIC PASS -> one fix round: faster start (V0 900, +2 %/bounce: notes ~0.7 s apart from 0.36 s, was 1.1 s), hook 1.2x bigger, bar/panel fade before the loop, ball + ripple gone at the reveal. No second review (no logic error).
Gate (final v3): 1080x1920 60 fps H.264 CRF 16 + AAC, 20.15 s, YAVG 36.3 / 34.8, -13.9 LUFS TP -2.4, 4k band -53.1 (39.2 dB below), spelling OK, safe zones clear, loopfade 0.4 s.
Caption: Every bounce plays the next note 🎵 Can you name the song before it ends? 👇 Then guess what it draws. Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Every bounce = the next note 🎵 Name the song 👇
DONE: media/melody-ball-02.
