# RiceHub Full Platform Guide

## 1. System Architecture

RiceHub is split into four bounded subsystems:

1. **Web Frontend (Next.js App Router)**
   - WM selector landing page (`/`)
   - Filterable theme browser (`/themes?wm=hyprland`)
   - Theme details page (`/themes/[slug]`)
2. **Backend API (Next.js Route Handlers)**
   - Search/list/details APIs
   - Upload/rating/comment endpoints
   - Install command + installer script generation
3. **Data + Asset Layer**
   - PostgreSQL for relational metadata
   - GitHub repositories for theme source/dotfiles
   - Public CDN/static folder for screenshots/logos
4. **Installer + CLI Layer**
   - Shell installers for distro-aware setup
   - Node.js CLI (`ricehub`) to discover/install themes from terminal

### Request flow

```text
Browser/CLI -> Next.js API -> PostgreSQL
                        -> GitHub metadata fetcher/cache
                        -> install script template renderer
```

## 2. Main UX Flow

### Step A: WM/DE selection (Landing)
- Show cards for: Hyprland, Openbox, i3, BSPWM, KDE, GNOME, XFCE.
- Each card includes logo + short description.
- Clicking a card routes to `/themes?wm=<selected>`.

### Step B: Theme browser
- Search input for fuzzy matching by name, tags, author.
- Filter chips/dropdowns:
  - distro (Arch/Debian/Fedora)
  - minimum rating
  - sort (popular/newest/top rated)
- Theme cards show screenshot, description, rating, download count.

### Step C: Theme detail
- Screenshot gallery (optimized with Next.js `Image`)
- metadata blocks: dependencies, programs, fonts, icons, compositor, terminal
- Install button that copies executable shell command

## 3. Database Schema (PostgreSQL)

See `docs/schema.sql` for executable SQL.

Key entities:
- `users`
- `themes`
- `theme_versions` (for versioning + rollback)
- `theme_assets` (screenshots)
- `theme_dependencies`
- `ratings`
- `comments`
- `theme_installs` (telemetry/popularity)

## 4. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/themes?wm=&q=&distro=&minRating=` | Browser grid search/filter |
| GET | `/api/themes/[slug]` | Theme details |
| POST | `/api/themes/[slug]/rate` | Add/update rating |
| POST | `/api/themes/[slug]/comments` | Add comment |
| GET | `/api/install/[wm]/[slug]` | Generate install command/script URL |
| POST | `/api/themes/upload` | Community theme submission |

## 5. Installer Design

Installer requirements:
- detect distro via `/etc/os-release`
- map generic package names to distro package names
- install dependencies/fonts
- clone/download dotfiles
- backup and apply configs
- optionally rollback if apply step fails

See `install-scripts/install-theme.sh` for a reference implementation.

## 6. CLI Design

CLI commands:

```bash
ricehub search hyprland
ricehub list openbox
ricehub preview dracula
ricehub install tokyo-night
```

Implementation approach:
- `commander` for command parsing
- `execa` for invoking installer
- `ora` for spinner
- REST client against the same public API as frontend

See `cli/src/index.ts` for starter implementation.

## 7. Advanced Features

1. **Live preview sandbox**: start disposable containers/VM snapshots for visual previews.
2. **Popularity ranking**: weighted score from installs + ratings + recency.
3. **Hardware recommendations**: infer GPU/RAM needs from compositor/effects.
4. **Theme versioning**: immutable versions with semantic tags.
5. **Rollback system**: automatic backup ID per install.
6. **Environment detection**: detect WM, shell, display server, distro before install.

## 8. Suggested Build Phases

1. Build schema + theme list/detail endpoints.
2. Build selector + browser + detail pages with static seed data.
3. Implement install command generation + script rendering.
4. Add auth + uploads + moderation queue.
5. Ship CLI and telemetry/popularity ranking.
