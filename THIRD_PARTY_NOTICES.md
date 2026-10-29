# Third-party assets and source

## FetchUp design assets

`public/brand/wordmark.svg`, `public/brand/journey-arrow.svg`, and the desktop/mobile SVG files in `public/illustrations/` were exported from the supplied FetchUp Figma file (`k2pLLTEddoIkGYmBHXbrHP`). The favicon comes from the supplied Purple Logo Brand Kit. Their ownership remains with the original rights holder.

## React Bits

The reduced Aurora and SpotlightCard implementations in `components/effects/react-bits/` are adaptations of React Bits source reviewed on 29 October 2026:

- https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/Aurora/Aurora.tsx
- https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx

Aurora retains the simplex-noise technique and uses OGL for a single, low-resolution violet layer. SpotlightCard is reduced to local pointer lighting without a continuous frame loop. The custom reveal component is independently implemented with Motion, rather than importing React Bits AnimatedContent and its GSAP dependency.

### MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

### Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

### No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Fonts

Space Grotesk and Manrope are self-hosted from their pinned Fontsource packages using `next/font/local`. Both are distributed under the SIL Open Font License 1.1; the complete licence files are included in the corresponding installed packages.

## Application libraries

Next.js, React, Motion, OGL, Zod, Upstash and development tools retain their respective licences. Exact versions and resolved transitive dependencies are recorded in `package-lock.json`.
