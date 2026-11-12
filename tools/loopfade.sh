#!/bin/bash
# Loop fix (review 12 Nov): cross-fade the last FADE seconds of a finished video into its own first frame, so the cut back to the start is seamless.
# Video is re-encoded H.264 CRF 16 yuv420p 60 fps, audio is copied untouched (loudness unchanged).
# usage: tools/loopfade.sh <in.mp4> <out.mp4> [fade seconds, default 0.4]
set -e
IN="$1"; OUT="$2"; F=${3:-0.4}; T=$(mktemp -d)
ffmpeg -v error -y -i "$IN" -frames:v 1 "$T/first.png"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN"); ST=$(python3 -c "print(round($DUR-$F,3))")
ffmpeg -v error -y -i "$IN" -loop 1 -framerate 60 -t "$DUR" -i "$T/first.png" -filter_complex "[1:v]format=rgba,fade=in:st=$ST:d=$F:alpha=1[o];[0:v][o]overlay=shortest=1,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 16 -r 60 -c:a copy -movflags +faststart "$OUT"
rm -rf "$T"; echo "loopfade $F s -> $OUT"
