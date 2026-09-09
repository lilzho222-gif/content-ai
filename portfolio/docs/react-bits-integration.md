# React Bits integration

Installed from the exact JS-CSS registry payloads retrieved on 2026-09-08:

- https://reactbits.dev/r/BorderGlow-JS-CSS.json
- https://reactbits.dev/r/EvilEye-JS-CSS.json
- https://reactbits.dev/r/FlowingMenu-JS-CSS.json

Dependencies: ogl ^1.0.11 and gsap ^3.13.0. Vanilla CSS retained.

BorderGlow wraps the hero project note, featured project, and listening-room controls. EvilEye uses the requested settings in the exploration section. Its wrapper mounts it only when visible, respects reduced motion, and provides a static fallback for unavailable WebGL. FlowingMenu provides three navigation destinations. Its local changes guard zero-width measurements and pause the marquee until hovered; reduced-motion disables the marquee. The site's existing `.menu` styles are explicitly overridden inside this component's section.

Uploaded reference videos are H.264 derivatives at their original 960px width, with sound removed. No upscaling or claim of 4K. Credit: user-supplied visual references; not represented as lilzho's own design projects.

Revision: the reference videos now form full-bleed section backdrops (crimson: featured work; silver: capabilities), not a gallery. The FlowingMenu is directly after About and uses shorter Chinese labels. Each video backdrop includes an independent pause control that persists when scrolling away and back; reduced-motion, hidden tabs and offscreen sections stop playback.

The music player shares one audio element across the portfolio and listening room. Local files are browser-only object URLs for the current page session. NetEase supports links to the official external player and an official-site login link. Account authorization, private playlists, and membership synchronization are NOT implemented: no verified application credentials or server integration are available. Public embed availability is controlled by NetEase.
