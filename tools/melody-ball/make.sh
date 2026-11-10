#!/bin/bash
# Build one melody-ball episode from tools/melody-ball/data.js (run sim.js first).
# usage: tools/melody-ball/make.sh <out.mp4> [workers]
# 1) frames 1080x1920 @ VFPS 60 in parallel (render.js), 2) audio.py -> wav, 3) master: compressor + lowpass 7.5k + high-shelf -4 dB @5k
#    + 2-pass linear loudnorm I -14 / TP -2.5 / LRA 20, 4) H.264 CRF 16 yuv420p + AAC 192k, faststart.
set -e
D=$(cd "$(dirname "$0")" && pwd); OUT=$(realpath -m "$1"); WK=${2:-4}; TMP=${TMPD:-/tmp/claude-0/mb/build}
python3 -c "import numpy" || { echo "numpy missing: python3 -m pip install numpy"; exit 1; }
if [ -z "$SKIPRENDER" ]; then rm -rf "$TMP"; mkdir -p "$TMP/f"; fi   # SKIPRENDER=1 reuses frames already in $TMP/f
N=$(node -e "global.window={};require('$D/data.js');console.log(window.DATA.tmap.length)")
echo "frames $N workers $WK"; S=$(( (N+WK-1)/WK ))
[ -z "$SKIPRENDER" ] && for ((w=0;w<WK;w++)); do A=$((w*S)); B=$(( (w+1)*S<N ? (w+1)*S : N )); VFPS=60 node "$D/render.js" "$TMP/f" $A $B & done; wait
python3 "$D/audio.py" "$D/data.js" "$TMP/a.wav"
PRE="acompressor=threshold=0.06:ratio=3:attack=10:release=200,lowpass=f=7500,highshelf=f=5000:g=-4"
J=$(ffmpeg -hide_banner -nostats -i "$TMP/a.wav" -af "$PRE,loudnorm=I=-14:TP=-2.5:LRA=20:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
LN="loudnorm=I=-14:TP=-2.5:LRA=20:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -hide_banner -loglevel error -y -framerate 60 -i "$TMP/f/%04d.jpg" -i "$TMP/a.wav" -map 0:v -map 1:a -af "$PRE,$LN,aresample=48000" \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -r 60 -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' ' | tr '\n' ' '; echo
