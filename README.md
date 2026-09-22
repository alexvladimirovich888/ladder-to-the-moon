# Ladder to the Moon

Cinematic 3D crypto site visualizing a token's climb toward a $1,000,000 market cap
as a giant staircase rising from Earth to the Moon. Built with Next.js (App Router),
React Three Fiber, drei, postprocessing and GSAP.

## Stack

- Next.js 14 (App Router) + TypeScript
- React Three Fiber / drei / postprocessing
- GSAP for UI animation
- Zustand for shared state between the 3D scene and the UI
- Live market cap from pump.fun's API (Dexscreener as secondary source, mock as fallback)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/            Next.js routes, layout, global styles, icon.tsx (favicon)
  components/
    scene/        Canvas, camera rig, postprocessing effects
    ladder/       Instanced-mesh golden staircase
    moon/         Moon mesh + lighting
    earth/        Earth mesh
    stars/        Starfield, nebula
    particles/    Trail + atmospheric dust
    ui/           HUD, progress scale, contract bar, milestone effects
  services/
    marketcap/    Provider abstraction (pump.fun, Dexscreener, mock) + polling service
  store/          Zustand store for market cap / progress
  config/         Site copy, token contract, Axiom URL, ladder + milestone tuning
```

## Configuration

All the values you're likely to change live in [`src/config/index.ts`](src/config/index.ts):

- `TOKEN_CONFIG.contractAddress` — the token's Solana contract address.
- `TOKEN_CONFIG.axiomUrl` — the "VIEW ON AXIOM" button target.
- `MARKET_CAP_CONFIG.useMockProvider` — force the simulated mock data instead of live data.
- `LADDER_CONFIG` / `MILESTONES` — staircase scale and milestone thresholds.

No environment variables or API keys are required — market cap is fetched directly
from public endpoints in the browser.

## Deploying to GitHub + Vercel

1. Create a new empty repository on GitHub (do not initialize it with a README).
2. Push this project to it:

   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. In [Vercel](https://vercel.com/new), import the GitHub repository. Since your
   GitHub account is already linked to Vercel, it will be detected automatically.
4. Vercel auto-detects Next.js — no custom build settings are needed
   (Build Command: `next build`, Output: `.next`, Install Command: `npm install`).
5. Click **Deploy**. Every subsequent push to `main` redeploys automatically.
6. To use your own domain: open the deployed project in Vercel → **Settings → Domains**
   → add your domain and follow the DNS instructions shown there.

## Production build (local check)

```bash
npm run build
npm run start
```
