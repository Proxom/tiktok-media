# tools/faces — shared EYES + VOICE for every ball engine (built 16 Nov 2026, Erkan's 15 Nov override)

Two eyes only, never a mouth. One style for the whole channel. Each ball reacts to ITS OWN situation, with its own lag, rates and blinks.

| file | what |
|------|------|
| `plan.js` | node, after the sim: per-ball expression channels (scared, hit, angry, happy, sad, look x/y) at 30 Hz, blink times, and the voice list with the NEVER-NOISY limits. `checkVoices()` for check.js. |
| `faces.js` | browser renderer: `Faces.draw(ctx, D.faces, i, t, x, y, r, {lid, ey, alpha})`. Diameter >= 40 px full eyes, 24-40 px simple eyes, < 24 px nothing. |
| `voice.py` | additive-synth voices (eep / oof / giggle / ooo), per-ball pitch, nothing above ~4 kHz, no noise. `add_voices(m, voices, V, ref, pan=)` adds them to an `sfx.Mix` 12 dB under `ref` (the engine's typical impact peak). `python3 voice.py demo.wav` = demo of all sounds. |

## Expressions (from the eyes alone)
calm = slightly lowered lids, look at the nearest rival · scared = big whites, small pupils · hit = squeezed lids, very hard hits = short wobbling X ·
angry = slanted lids (inner corners down) · happy (winner) = ^ ^ · sad (eliminated) = drooping lids, pupils down · random blinks.

## Voice limits (plan.js)
max 1 voice at a time, max 2 starts in any 1 s, out ("ooo") + win ("giggle") always kept (slid later if needed),
"oof" only on the hardest hits and max one per 4 s, "eep" when a ball's own scared level crosses 0.65 (max once per 4 s per ball).

## Adding faces to an engine (3 steps)
1. `tools/<game>/faces.js`: load data.js, build `events` (hit/out/win) and `sense(f,i)` -> `{threat, chase, lx, ly}` for that game, call `planFaces`, write `D.faces`.
   Examples: `tools/black-hole/faces.js` (threat = own gap to the growing hole), `tools/ball-battle/faces.js` (threat = rival closing in + low HP, angry = chasing).
2. page.html: `<script src="../faces/faces.js">` and `if(D.faces)Faces.draw(...)` after the ball body (keep the old drawing in `else`, so older data.js files render unchanged).
3. audio.py: `voice.add_voices(m, d['faces']['voices'], V, ref=<impact peak>, pan=...)` before `m.reverb()`.
Pipeline: `node sim.js data.js SEED && node faces.js data.js && node check.js && make.sh`.

## Test (16 Nov 03:07 run, black-hole seed 147, NOT posted)
Full 29.4 s render: 1080x1920 60 fps, -13.9 LUFS, peak -2.8 dBFS, 4 kHz+ band -47.4 LUFS (33 dB under the mix), contact sheet clean.
Voice stem alone: peak -17.3 dB vs rest of mix -3.1 dB (14 dB under), integrated -31.0 vs -17.3 LUFS. 9 voices in 29 s, never overlapping.
Spectrum of the demo: all energy under 4 kHz. The "listen check" was done by measurement + spectrum (the agent cannot hear audio).
