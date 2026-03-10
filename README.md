# RiceHub

RiceHub is a modern Linux ricing platform for discovering, previewing, and installing desktop themes and dotfiles.

## What this repository now includes

- A full implementation blueprint: `docs/full-platform-guide.md`
- Executable PostgreSQL schema starter: `docs/schema.sql`
- Frontend component examples:
  - `examples/frontend/WmSelector.tsx`
  - `examples/frontend/ThemeCard.tsx`
- Backend API route example:
  - `examples/backend/api/themes/route.ts`
- Distro-aware installer script starter:
  - `install-scripts/install-theme.sh`
- CLI starter command set:
  - `cli/src/index.ts`

## Product goals

RiceHub enables users to:
- Choose their window manager/desktop environment
- Browse compatible themes with screenshots and ratings
- Inspect dependencies and software stack per theme
- Install themes with one generated command
- Upload and share themes with community feedback

## Quick architecture

- **Frontend:** Next.js + React + TailwindCSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL
- **Theme storage:** GitHub repositories and static assets
- **Deployment:** Vercel

## Install command pattern

```bash
bash <(curl -s https://ricehub.sh/install/openbox/tokyo-night.sh)
```

## Next steps

1. Initialize a Next.js app in `website/frontend`.
2. Move `examples/*` into production folders.
3. Add Prisma/Drizzle and apply `docs/schema.sql`.
4. Implement authentication + uploads + moderation.
5. Add CI for theme manifest validation and installer tests.

For the full step-by-step build walkthrough, read `docs/full-platform-guide.md`.
