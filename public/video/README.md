# Hero scrub video

Drop the Kling-generated clip here as **`hero.mp4`** (H.264 MP4).

```
tech-temple/public/video/hero.mp4
```

The scroll-scrub slide (`components/ScrollScrub.js`) is wired to look for
`/video/hero.mp4`. When present, it binds the video's `currentTime` to scroll
progress (native scrub — no ffmpeg needed). When absent, it falls back to the
procedural placeholder automatically.

## Kling prompt used (3s, 16:9, low motion)

**Prompt:**
A lone techmonk seated in lotus meditation on weathered temple stone, filmed in
one continuous ultra-slow frontal dolly push-in. He wears a heavy dark hooded
robe, hood up, face half-lit and serene with eyes closed. Across his robe and
cupped hands, faint circuitry-like filaments of warm golden light slowly awaken
and begin to glow like living fiber-optics. In his hands a single small flame
ignites and grows steadily brighter across the shot, casting warm amber
rim-light up onto his face and hood. The setting is a vast pitch-black obsidian
temple interior — only the flame and glowing filaments give light. Fine embers
and slow dust motes drift upward through volumetric haze. The camera moves in one
perfectly smooth, extremely slow push-in, no cuts, no shake. The upper two-thirds
of the frame stay deep empty darkness. The FIRST frame begins in near-total
darkness with the flame unlit; the FINAL frame ends with the flame at its
brightest and filaments fully glowing. Mood: reverent, meditative, cinematic.
Palette: obsidian black, warm candle-gold, faint bronze. 85mm, shallow depth of
field, filmic grain, anamorphic.

**Negative prompt:**
text, letters, words, subtitles, watermark, logo, fast motion, camera shake,
whip pan, jump cut, scene change, cutaway, multiple people, crowd, flicker,
strobing, cartoon, distortion, extra limbs, warped hands, oversaturation

**Settings:** 3s (5s ok), 16:9, 1920×1080 min (2K ideal), low motion strength,
slow push-in, no audio.

## Notes
- One dark clip works for BOTH light and dark page themes — the scrub renders in
  a dark, letterboxed cinema panel either way.
- For smoothest native seeking, a high-keyframe/all-intra encode helps but isn't
  required. If scrubbing stutters, re-encode with a short GOP:
  `ffmpeg -i hero.mp4 -g 1 -c:v libx264 -crf 18 hero_scrub.mp4`
