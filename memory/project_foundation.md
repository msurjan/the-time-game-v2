---
name: The Time Game v2 — Project Foundation
description: Stack, structure, and key decisions established in the scaffolding phase
type: project
---

Stack: Vite + React 18, React Router v6, @supabase/supabase-js v2. No CSS frameworks — inline styles only.

Supabase project URL: https://gpcjfgqtudanyaajyzxo.supabase.co
Supabase validated: HTTP 200, table 'profiles' accessible (2026-04-07).

**Why:** EdTech B2B/B2C product requiring high scalability and portability.

**How to apply:** All new features must follow the governance rules in `.agent/rules/global.md`. Never install CSS frameworks or CSS-in-JS libraries. Never create a second Supabase client instance.

Key architectural decisions:
- Canvas: 2500×2000px world, 1000×700px viewport
- App.jsx is a pure router only (no state, no data fetching)
- Screens live in src/screens/, not src/components/
- All game logic (lives, points, progress) lives in src/core/
- Design tokens in src/constants/theme.js
- Game config in src/constants/gameConfig.js
- Era/Eon master data in src/constants/eras.js
- Island positions in src/constants/islands.js
