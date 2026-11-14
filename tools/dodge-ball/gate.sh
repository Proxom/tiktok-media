#!/bin/bash
# HARD GATE helpers (AGENT.md §5) for one finished mp4: technical probe, first/last frame brightness, loudness,
# 4 kHz band vs whole mix, 2 fps contact sheet and the 0.5 s frame with the safe zones drawn.
# usage: tools/dodge-ball/gate.sh <video.mp4> <outdir>
set -e
V="$1"; O="$2"; mkdir -p "$O"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:format=duration -of compact "$V"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
for T in 0 $(python3 -c "print(round($DUR-0.05,3))"); do
  ffmpeg -hide_banner -ss $T -i "$V" -frames:v 1 -vf signalstats,metadata=print:key=lavfi.signalstats.YAVG -f null - 2>&1 | grep -m1 -o "YAVG=[0-9.]*" | sed "s/^/t=$T /"; done
echo "mix:  $(ffmpeg -hide_banner -nostats -i "$V" -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I:|Peak:)' | tr -s ' ' | tr '\n' ' ')"
echo "4k+:  $(ffmpeg -hide_banner -nostats -i "$V" -af highpass=f=4000,ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tr -s ' ')"
ffmpeg -hide_banner -v error -y -i "$V" -vf "fps=2,scale=270:480,tile=12x$(python3 -c "import math;print(math.ceil($DUR*2/12))")" -frames:v 1 "$O/contact.jpg"
ffmpeg -hide_banner -v error -y -ss 0.5 -i "$V" -frames:v 1 -vf "drawbox=0:0:1080:320:red@0.35:fill,drawbox=0:1440:1080:480:red@0.35:fill,drawbox=930:0:150:1920:red@0.35:fill,drawbox=0:0:60:1920:red@0.35:fill" "$O/safe-0.5s.jpg"
echo "contact + safe frame in $O"
