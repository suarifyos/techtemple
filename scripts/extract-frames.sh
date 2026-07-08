#!/usr/bin/env bash
# Extract a video into a web-ready JPG frame sequence for scroll-scrubbing.
#
# Usage:
#   bash scripts/extract-frames.sh <input.mp4> <out-dir> <frame-count> [width]
#
# Example:
#   bash scripts/extract-frames.sh video/hero.mp4 public/frames/hero 120 1600
#
# Requires ffmpeg + ffprobe on PATH.
set -euo pipefail

IN="${1:?input video required}"
OUT="${2:?output dir required}"
FRAMES="${3:-120}"
WIDTH="${4:-1600}"
QUALITY="${JPG_Q:-4}"   # ffmpeg -q:v 2 (best) .. 31 (worst); 3-5 is a good web range

command -v ffmpeg >/dev/null || { echo "ffmpeg not found on PATH"; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe not found on PATH"; exit 1; }

mkdir -p "$OUT"

# Duration (seconds) → target fps so we land ~FRAMES total frames.
DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")"
FPS="$(awk -v f="$FRAMES" -v d="$DUR" 'BEGIN{ printf "%.4f", f / d }')"

echo "Input:    $IN (${DUR}s)"
echo "Target:   $FRAMES frames  →  fps=$FPS, width=$WIDTH, q=$QUALITY"
echo "Output:   $OUT/frame_%04d.jpg"

ffmpeg -y -i "$IN" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -q:v "$QUALITY" \
  "$OUT/frame_%04d.jpg"

COUNT="$(ls "$OUT"/frame_*.jpg | wc -l | tr -d ' ')"
SIZE="$(du -sh "$OUT" | cut -f1)"
echo "Done: $COUNT frames, $SIZE total."
echo "Now set frameCount=$COUNT and a src prop on <ScrollScrub> (see public/frames/hero/README.md)."
