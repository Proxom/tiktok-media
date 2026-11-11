# marble-disaster-01 (17:00 1M+ list #4 "marble disaster race", family C) — 11 Nov 11:07 run, NEW engine tools/marble-disaster (base tools/marble-elim course)
outlier: "24 Marble Race EP. 18: Disaster Race (by Algodoo)" by Crazy Marble Race, YouTube (channel https://www.youtube.com/@CrazyMarbleRace) — 6.1M views
  (shown on YouTube watch-page sidebars crawled 24 Oct - 8 Nov 2026, "6.1M • 5y ago"; checked 11 Nov 11:2x UTC). Idea only; course, look, rules, sound 100% ours.
Ours: 6 marbles, 5 laps on our looping course (trapdoor -> peg board + 2 paddles -> ramp -> GATE -> glass lift). FIRST to finish lap 5 wins.
  Each time a NEW lap leader appears (leader finishes lap k<5) DISASTER k hits and stays: 1 WILD PADDLES (reverse, 2x speed), 2 WIND (push left on the peg
  board, y 880-1140), 3 EARTHQUAKE (every 0.3 s random kick to each marble on the board + screen shake), 4 MOON GRAVITY (g x0.75).
Rebuild: cd tools/marble-disaster && LAPS=5 LG=.75 MINT=23 MAXT=28.5 GAPMAX=220 NLEAD=3 TAIL=3.4 SLOW=.25 S0=1.0 S1=.5 FOLLOWTEXT='Follow → a new race every day' node sim.js data.js 1 && node check.js data.js && TMPD=/tmp/claude-0/md/build ./make.sh <out.mp4> 4 && ../ball-battle/gate.sh <mp4> <dir>
Result: seed 53, leaders BLUE, BLUE, BLUE, RED, PURPLE; PURPLE wins, RED runner-up 140 px from the gate; endT 27.42 s sim, win at video 30.12 s of 35.10 s (86%).
check.js PASS: 29 gate passes, disasters at 2.66/8.16/13.84/20.48 s, tunnel 0, maxPen 0.06, maxStep/r 0.099, 600 Hz.
Caption: Pick a color before the trapdoor opens 👇 Every new lap leader brings a new DISASTER. Did yours make it? Follow for a new race every day #satisfying #physics #simulation #oddlysatisfying
Title: Disaster race 🌋 Pick a color 👇 every new lap = a new disaster
Slot: 12 Nov 17:00 Europe/London.
Gate: 1080x1920 60 fps H.264 CRF 16 + AAC, 35.1 s; first/last YAVG 37.1/35.6; -14.0 LUFS, TP -5.0; 4k band -49.2 (35.2 dB below); spelling OK; safe zones clear.
Sound: every gate pass = next note of "In the Hall of the Mountain King" (Grieg, public domain) on soft marimba + low wood; disaster = low thump + A-C-E marimba; quake = quiet low thumps; win = rolled low A chord.
Review v1: 6.8 (hook 6, polish 7, clarity 7, pacing 6, payoff 8), LOGIC PASS. Fixed once (renderer only, physics unchanged): hook line 2 'First to finish 5 laps wins 🏁' for 1.6 s,
  pulsing white ring on the lap leader, lap dots 2x (r 8.5), disaster banner 3.0 s, live 'A vs B 👀 who's first?' on the final lap (the two lap-4 marbles furthest along the bottom ramp),
  brighter wind (clipped to the board) and moon tint.
DONE: media/marble-disaster-01 (mp4 + cover.jpg).
Next engine ideas: TOPEN .3 (faster start), bigger marbles (RAD 22) in the same course, BLUE leading 3 laps made 9-20 s look alike -> NLEAD 4 filter.
