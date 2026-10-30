#!/bin/bash
# Gentle audio remaster (AUDIO LEVEL rule): video copied, audio -> about -20 LUFS, TP <= -3 dBTP.
# usage: tools/remaster.sh in.mp4 out.mp4
set -e
IN="$1"; OUT="$2"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
FO=$(python3 -c "print(max(0.0, $DUR-0.4))")
PRE="highpass=f=38,lowpass=f=9500,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=150:makeup=1,afade=t=in:d=0.08,afade=t=out:st=$FO:d=0.4"
J=$(ffmpeg -hide_banner -nostats -i "$IN" -af "$PRE,loudnorm=I=-20:TP=-3.5:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
LN="loudnorm=I=-20:TP=-3.5:LRA=7:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -hide_banner -loglevel error -y -i "$IN" -map 0:v -map 0:a -c:v copy -af "$PRE,$LN,aresample=48000" -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' ' | tr '\n' ' '; echo
