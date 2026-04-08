# Agent Governance Rules — The Time Game v2

## 1. File Size Limit
- **Max 400 lines per file.** If a component or module grows beyond this, it MUST be split.
- Decompose by responsibility: one file = one concern.
- Large data arrays (eras, nodes, quests) go in `/src/constants/`, never inline in components.

## 2. Styling
- **All styling must use inline React style objects** (`style={{ ... }}`).
- No external CSS files, no CSS modules, no Tailwind, no styled-components.
- Exception: a single `src/index.css` is allowed only for global CSS resets (box-sizing, margin 0, font-family).
- Design tokens (colors, spacing, font sizes) live in `src/constants/theme.js` and are imported, never hardcoded.

## 3. Business Logic Separation
- **All game logic lives in `/src/core/`** — points, lives, progress, scoring, level-up rules.
- Visual components in `/src/components/` must be dumb: they receive data via props and call handlers.
- Components must NOT import from each other across domain boundaries. Cross-domain communication goes through the global store (`/src/store/`).

## 4. Map & Canvas Constraints
- World map canvas size: **2500 × 2000 px** (logical units).
- Viewport size: **1000 × 700 px**.
- All island node positions are defined in `src/constants/islands.js` as `{ x, y }` within the 2500×2000 grid.
- Panning logic lives in `src/components/world/useMapPan.js`, not in the render component.

## 5. Supabase & Auth
- The Supabase client is a singleton at `src/lib/supabaseClient.js`. Import from there; never instantiate a new client elsewhere.
- Auth state is managed exclusively in `src/store/authStore.js`.
- Never store `SUPABASE_SERVICE_KEY` on the client side.

## 6. Routing
- `App.jsx` is a pure router. No data fetching, no state, no UI — only `<Routes>` and `<Route>` elements.
- Screen-level components (`LoginScreen`, `WorldMapScreen`, etc.) live in `src/screens/`.

## 7. Constants & Data
- Era and Eon master data: `src/constants/eras.js`
- Island/node data: `src/constants/islands.js`
- Theme tokens: `src/constants/theme.js`
- Game config (lives, point values, timers): `src/constants/gameConfig.js`

## 8. Commit Discipline
- Every commit must be scoped: `feat(world):`, `fix(core):`, `chore(config):`, etc.
- No commit should touch more than 3 unrelated files.

## 9. No Speculative Code
- Do not add features, helpers, or abstractions that are not immediately needed.
- No TODO stubs, no placeholder components beyond what is scaffolded here.
