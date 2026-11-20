# merge-race-03 (family E "merge game", Game 3) — 20 Nov 03:09 UTC run, for 22 Nov 21:00 Europe/London
Why: QUEUE 19 (20 Nov 01:00 black-hole-02 PUBLISHED). Nearest empty slot 22 Nov 21:00; neighbours I brick 01:00, F dodge 17:00, G black hole 23 Nov 01:00.
E merge has not posted since 14 Nov 01:00 (Game 2 promised "Game 3 is next") -> E.
Engine: tools/merge-arena/race + NEW faces + voice (tools/merge-arena/race/faces.js, per-ball-id channels trimmed to each ball's lifetime;
page.html draws eyes in the upper half and the number in the lower half; audio.py adds tools/faces voices 12 dB under the merge notes).
sim.js: hit/wall events now carry ball ids (physics unchanged). check.js: path fix + voice limits + giggle on the king.
Rule sheet:
1) 4 colors drop in turn (shuffled bag, equal drops) from a sliding dropper; each drop is a 2 or a 4.
2) two touching balls with the same number merge into the next number; the new ball takes the color of the NEWER parent.
3) the first color to make 64 + 64 = 👑 wins; drops and merges stop then.
4) eyes: scared = a newer same-number ball of another color is closing in; angry = it is the one closing in; ^ ^ after a takeover; winner color happy, others sad at the end.
Rebuild: cd tools/merge-arena/race && GAME=3 WINEX=0 FF=1.5 FF0=7 FF1=20 TAIL=3.8 FOLLOWTEXT='Follow → Game 4 is next' R0=34 RF=1.25 PASSES=6 TOP=6 I0=.26 I1=.20 NS=1 MINT=22 MAXT=28 LEADMIN=3 CLOSE=1 node sim.js data.js 395 && node faces.js data.js && node check.js data.js && TMPD=<tmp> ./make.sh <out.mp4> 4
Result: seed 395, YELLOW wins (king = 64 YELLOW + 64 RED, stolen from RED), 4 lead changes, 129 drops (33/32/32/32), 110 merges, king at video 24.65 s / 29.17 s (84.5 %).
check.js PASS: maxOverlap 0.78 px, maxStep/r 0.069, tunnel 0, 600 Hz. Voices 16 (7 oof, 7 eep, giggle, ooo), limits PASS.
Review v1: 7.0 (hook 6, polish 7.5, clarity 7, pacing 7, payoff 7.5), LOGIC PASS -> scheduled; 3 cheap renderer fixes applied anyway (pulsing leader boxes on a 64/64 tie, bigger follow pill 2.0 s, less end fade). Final: 29.17 s, -13.9 LUFS, TP -7.4, 4 kHz band -48.1 LUFS (34 dB under), qc_scan clean.
Caption: Game 3 👇 RED won Game 2. Now every ball has eyes 👀 Same numbers merge, the newest color takes it. Pick a face before the first drop. Who makes the 👑? Follow for Game 4 #satisfying #physics #simulation #oddlysatisfying
Title: Game 3 👀 RED won Game 2. Pick a face! Who makes the 👑 this time?
Next E (Game 4): WINEX=2 (YELLOW) GAME=4.
