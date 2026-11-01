// Dominoes: generates the layout, the exact topple start times and the CONSTRAINED fall angle of every domino over
// time (shared by page.html and audio.py).
// node gen.js <out.js> [N]   env: LAYOUT=spiral|snake  D=fall duration (s)  ROWS/ROWLEN/TURN (snake)  FPSA (angle table fps)
// -> window.DATA={N,pos:[[x,z,tx,tz]],t:[start times],D,tEnd,rmax,fpsA,ang:[[mrad per domino] per table frame]}
//
// PHYSICS (QC 1 Nov 2026): the old model let every domino swing on to 72 deg after touching the next one, so it passed
// up to half a domino deep THROUGH its neighbour. Now:
//  1. free fall curve a_free(u)=90deg*u^2.1, u=(t-t_i)/D (slow start, accelerating);
//  2. domino i+1 starts ONLY when domino i's top front corner touches its back face (contact angle from the real gap);
//  3. at every instant a_i = min(a_free_i, largest angle at which domino i's box does not intersect domino i+1's box),
//     computed from the last domino backwards, so a fallen domino LEANS on the next one and only the last lies flat.
//  4. assertions: no pair overlaps by more than 2 mm (in domino-height units 0.002), every start happens at contact.
const fs = require('fs');
const OUT = process.argv[2] || 'data.js', N = +process.argv[3] || 110;
const LAYOUT = process.env.LAYOUT || 'spiral', S = .5;
const DH = 1.0, DT = .13, AMAX = Math.PI / 2, D = +(process.env.D || .42), FPSA = +(process.env.FPSA || 60);
let pts = [];
if (LAYOUT === 'spiral') {
  const B = .19, R0 = 1.2; let th = 0, prev = [R0, 0];
  for (let i = 0; i < N; i++) { let p; while (true) { const r = R0 + B * th; p = [r * Math.cos(th), r * Math.sin(th)]; if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) >= S) break; th += .001 } pts.push(p); prev = p }
} else { // snake: ROWS straight rows along z joined by half-circle U-turns, centred on the origin
  const ROWS = +(process.env.ROWS || 4), L = +(process.env.ROWLEN || 13.5), RT = +(process.env.TURN || 1.2);
  const seg = []; // polyline sampled finely, then marched at spacing S
  const x0 = -(ROWS - 1) * RT;
  for (let r = 0; r < ROWS; r++) {
    const x = x0 + r * 2 * RT, dir = r % 2 ? -1 : 1, za = -dir * L / 2, zb = dir * L / 2;
    for (let k = 0; k <= 8000; k++) seg.push([x, za + (zb - za) * k / 8000]);
    if (r < ROWS - 1) { const cx = x + RT; for (let k = 1; k < 2000; k++) { const a = Math.PI * k / 2000; seg.push([cx - RT * Math.cos(a), zb + dir * RT * Math.sin(a)]) } }
  }
  let prev = seg[0]; pts.push(prev);
  for (const p of seg) { if (pts.length >= N) break; if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) >= S) { pts.push(p); prev = p } }
  if (pts.length < N) { console.log('path too short for N', pts.length); process.exit(1) }
  if (process.env.AXIS === 'x') pts = pts.map(([a, b]) => [b, a]); // rows run left-right on screen (fits the portrait overview)
}
const pos = pts.map((p, i) => { const q = pts[Math.min(N - 1, i + 1)], o = pts[Math.max(0, i - 1)]; let tx = q[0] - o[0], tz = q[1] - o[1]; const l = Math.hypot(tx, tz); return [+p[0].toFixed(3), +p[1].toFixed(3), +(tx / l).toFixed(4), +(tz / l).toFixed(4)] });
// forward gap from domino i to i+1 measured along i's own tangent (local straight-line model)
const gap = pos.map((p, i) => i < N - 1 ? (pos[i + 1][0] - p[0]) * p[2] + (pos[i + 1][1] - p[1]) * p[3] : 9);
// 2D side view boxes: domino i pivots on its front bottom edge (x=DT/2), body x in [-DT/2,DT/2], y in [0,DH]
function box(off, a) { const px = off + DT / 2, c = Math.cos(a), s = Math.sin(a); // clockwise rotation by a about (px,0)
  return [[-DT, 0], [0, 0], [0, DH], [-DT, DH]].map(([u, v]) => [px + u * c + v * s, -u * s + v * c]) }
function overlap(P, Q) { // SAT penetration depth of two convex quads (0 = separated)
  let best = 1e9;
  for (const poly of [P, Q]) for (let k = 0; k < 4; k++) { const a = poly[k], b = poly[(k + 1) % 4]; let nx = b[1] - a[1], ny = a[0] - b[0]; const l = Math.hypot(nx, ny); nx /= l; ny /= l;
    let p0 = 1e9, p1 = -1e9, q0 = 1e9, q1 = -1e9; for (const v of P) { const d = v[0] * nx + v[1] * ny; p0 = Math.min(p0, d); p1 = Math.max(p1, d) } for (const v of Q) { const d = v[0] * nx + v[1] * ny; q0 = Math.min(q0, d); q1 = Math.max(q1, d) }
    const o = Math.min(p1, q1) - Math.max(p0, q0); if (o <= 0) return 0; best = Math.min(best, o) }
  return best }
function allowed(i, a2) { const Q = box(gap[i], a2); if (overlap(box(0, AMAX), Q) === 0) return AMAX; let lo = 0, hi = AMAX;
  if (overlap(box(0, 0), Q) > 0) return 0; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (overlap(box(0, m), Q) > 0) hi = m; else lo = m } return lo }
const free = u => u <= 0 ? 0 : u >= 1 ? AMAX : AMAX * Math.pow(u, 2.1);
// start times: domino i+1 starts when domino i (falling freely, nothing ahead of it is moving yet) first touches it
const t = [.7];
for (let i = 0; i < N - 1; i++) { const thc = allowed(i, 0); const uc = Math.pow(thc / AMAX, 1 / 2.1); t.push(+(t[i] + uc * D).toFixed(4)) }
const tEnd = t[N - 1] + D + .1, frames = Math.ceil((tEnd + 6) * FPSA), ang = [];
let worst = 0;
for (let f = 0; f < frames; f++) { const tt = f / FPSA, a = new Array(N);
  a[N - 1] = free((tt - t[N - 1]) / D);
  for (let i = N - 2; i >= 0; i--) { const fr = free((tt - t[i]) / D); a[i] = fr > 0 ? Math.min(fr, allowed(i, a[i + 1])) : 0 }
  for (let i = 0; i < N - 1; i++) worst = Math.max(worst, overlap(box(0, a[i]), box(gap[i], a[i + 1])));
  ang.push(a.map(v => Math.round(v * 1000))) }
const iv = t.slice(1).map((v, i) => v - t[i]);
console.log('layout', LAYOUT, 'N', N, 'interval s min', Math.min(...iv).toFixed(3), 'max', Math.max(...iv).toFixed(3), 'tEnd', tEnd.toFixed(2), 'max overlap', worst.toFixed(4));
const last = ang[ang.length - 1].map(v => v / 1000), standing = last.filter(v => v < .3).length;
console.log('final angles deg: first', (last[0] * 57.3).toFixed(1), 'mid', (last[N >> 1] * 57.3).toFixed(1), 'last', (last[N - 1] * 57.3).toFixed(1), 'still standing', standing);
if (worst > .002 || standing > 0) { console.log('ASSERTION FAILED'); process.exit(1) }
const out = { N, pos, t, D, tEnd, rmax: Math.max(...pts.map(p => Math.hypot(...p))), fpsA: FPSA, layout: LAYOUT, ang };
fs.writeFileSync(OUT, 'window.DATA=' + JSON.stringify(out) + ';\n');
