# Amine Saddik · Matchday

**Live:** https://amn-sdk.github.io/matchday/ · Classic version: https://amn-sdk.github.io/

An interactive 3D portfolio set in a football stadium. Every player on the pitch is one of my projects:
dribble the ball into a player to open the case study, and score in the far goal to get in touch.

## Features

- Night stadium built with Three.js: pitch markings drawn on a canvas, stands with an animated crowd, floodlights, scoreboard
- Starting XI: 11 projects in a 4-3-3 formation plus one on the bench, each with a shirt number and a clickable label
- Ball physics written from scratch: rolling, friction, lobbed shots, goal posts, net and player collisions
- Stations around the pitch: dugout (career), tactics board (skills), corner flag (resume), goal (contact), center circle (about)
- Keyboard (WASD / arrows, Space to shoot), mouse and touch (tap to move) controls
- Every piece of content is also reachable from HTML panels and a squad list, without playing
- Falls back to the content panels when WebGL is not available

## Stack

TypeScript · Vite · Three.js (WebGL, CSS2DRenderer)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build in dist/
```

The English and French resumes live in `public/resume/` and open in the Resume panel. All content lives in `src/content.ts`, and the lineup in `src/ui.ts`.

## Project structure

```
src/
├── content.ts   # profile, projects, experience, education, skills
├── ui.ts        # lineup, HTML panels and squad list
├── main.ts      # scene, stadium, players, ball physics, camera, input
└── style.css    # HUD, labels and panels
```

## License

MIT
