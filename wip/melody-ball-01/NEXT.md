# melody-ball-01 (17:00 1M+ list #1, counts as family A "ball in a circle") — 10 Nov 03:07 run, NEW engine tools/melody-ball
outlier: "Reminds me of something 🤔 #viral #satisfying #simulation" by satisfying.ba11s, YouTube Shorts https://www.youtube.com/watch?v=rgjeRfHFjms
  38,579,335 views / 1,553,476 likes on its page (checked 10 Nov 03:3x UTC; uploaded 29 Nov 2023; the Know Your Meme "Will the Ball Escape?" origin video).
  (The ~67M figure in AGENT.md could not be confirmed; the Dec 2023 "Reminds me of something" short ChdRbOl0y3c has 995,986 views, under 1M. List item #2 "~38M linked in KYM" is this same video.)
Ours (100% own): one ball, one circle, no gravity; every bounce = next note of Für Elise (Beethoven, public domain, own arrangement A2..E4 marimba) and +4% speed;
  only the newest 4 chords are visible while it draws; after the last note every chord lights up -> "IT DREW A STAR FLOWER! ✨" then "Name the song 🎵 💬". Our look, panel, font, follow pill.
Rebuild: cd tools/melody-ball && node sim.js data.js && node check.js && ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>   (defaults: STEP 146, V0 520, SPD 1.04, TAIL 5.2)
Result: 35 notes, first at 0.67 s, last at 25.53 s (83% of 30.7 s), chord step 146.000°, final speed 2052 px/s, tunnel 0, check.js PASS.
Caption: Every bounce plays the next note 🎵 Guess what it draws before the end 👇 Then name the song. Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Every bounce = the next note 🎵 Guess what it draws 👇
Slot: 11 Nov 17:00 Europe/London.
Video: 30.7 s 60 fps CRF 16, reveal at 25.5 s (83%), -13.8 LUFS TP -2.2, 4k band 36.9 dB below.
Review v1: 7.0 (hook 6, polish 8, clarity 7, pacing 6, payoff 8). LOGIC fix: the speed readout stalled at +279% on the 35th note (now +295% = 1.04^35). Also: newest 3 chords only, bigger "Guess what it draws", "+4% per bounce" readable, the mandala turns slowly after the reveal and fades back to the empty circle (seamless loop).
Next engine ideas: stronger first second (start faster or a bigger hook), something new in 6-24 s (the star shape is guessable early: change STEP so the shape is less obvious, e.g. 137.5 golden angle -> a sunflower).
DONE: media/melody-ball-01.
