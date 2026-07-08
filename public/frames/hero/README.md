# Hero frame sequence

The scroll-scrub slide (`components/ScrollScrub.js`) runs in **placeholder mode**
until real frames live here.

## Drop in Higgsfield (or any) footage

1. Save the generated clip as `tech-temple/video/hero.mp4`.
2. Extract frames into this folder:

   ```bash
   # from the tech-temple/ root — needs ffmpeg installed
   bash scripts/extract-frames.sh video/hero.mp4 public/frames/hero 120
   ```

   This writes `frame_0001.jpg … frame_0120.jpg`, scaled and compressed for web.

3. Turn off placeholder mode in `app/page.js` by giving `<ScrollScrub>` a `src`:

   ```jsx
   <ScrollScrub
     frameCount={120}
     src={(i) => `/frames/hero/frame_${String(i + 1).padStart(4, "0")}.jpg`}
     heightVh={320}
     eyebrow="The Ascent"
     captions={[...]}
   />
   ```

## Tuning
- **Frame count**: 100–180 is the sweet spot. More = smoother but heavier.
- **Weight**: keep the whole sequence under ~4–5 MB total. Lower JPG quality or
  resolution in `extract-frames.sh` if needed.
- The component preloads every frame, cover-fits it to the canvas, and is
  theme-aware (redraws on light/dark toggle).
