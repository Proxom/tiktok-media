# marble-elim-01 (17:00 1M+ list #3, family C "obstacle race") — 10 Nov 19:07 run, NEW engine tools/marble-elim
outlier: "Marble track stage / which one do you like?" (numbered "Game 187 / choose your color" series) by @marble.track.game, TikTok
  https://www.tiktok.com/@marble.track.game/video/7499292239063993605 — 1.4M likes / 18.7K comments / 31.1K shares on its page (checked 10 Nov 19:2x UTC; views hidden, likes > 100K = counts).
  List #2 (shrinking square, satisfying.ba11s https://www.youtube.com/watch?v=mUns7QevB2g) SKIPPED: 222,091 views / 7,102 likes on its page (< 1M); the ~38M in the list was the melody video.
Ours (100% own): 6 marbles, looping course (trapdoor -> peg board with 2 spinning paddles -> bottom ramp -> checkered GATE -> glass lift -> top ramp -> peg board ...).
  The moment all marbles still racing except one have passed gate k, that one is OUT. After gate 5 the last one left wins. Danger rings on the last two, "FINAL: A vs B".
Rebuild: cd tools/marble-elim && FOLLOWTEXT='Follow → a new one every day' TAIL=3.4 SLOW=.25 S0=1.0 S1=.5 MINT=23.5 MAXT=29 GAPMAX=300 node sim.js data.js 1 && node check.js data.js && ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>
Result: seed 1, out order YELLOW, ORANGE, PURPLE, BLUE, GREEN; RED wins by a photo finish (GREEN 53 px from the gate); GREEN was first through gate 1. endT 24.65 s sim, win at 27.3 s video (85%), 32.3 s.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC; -14.0 LUFS, TP -3.2; 4k band 34.7 dB below; tunnel 0, maxPen 0.06; check.js PASS; spelling OK.
Caption: Pick a color before the trapdoor opens 👇 Last one through the gate is OUT. Did yours survive? Follow for a new one every day #satisfying #physics #simulation #oddlysatisfying
Title: Pick a color 👇 Last one through the gate is OUT. Who survives?
Slot: 11 Nov 17:00 Europe/London.
Review v1: 6.6 (hook 6, polish 7, clarity 7, pacing 7, payoff 6), LOGIC PASS. Fixed once (no second review): gate flash capped at 25% white (RED stays red),
  confetti full-width from the board top, slow-motion hold 0.25x on the photo finish, chips in the same order as the start row, name tags over the
  marbles until the trapdoor opens, peg flashes tinted (no white dots), shorter tail (TAIL 3.4).
Next engine ideas: bigger marbles in a taller board (use y 640-1440 fully), a fresh course each Game N (move/add a paddle), 'Game N' + 'Last winner' series labels.
DONE: media/marble-elim-01.
