# RiceHub

RiceHub is an open-source platform for discovering, previewing, installing, and sharing Linux desktop themes ("rices") and dotfiles.

It is designed for:
- **Beginners** who want one-command setup
- **Advanced users** who want reusable, versioned setups
- **Theme creators** who want distribution and community feedback

---

## 1) Product Vision

RiceHub has two core surfaces:

1. **Website** (discovery + previews + install command generation)
2. **CLI** (search + preview + install from terminal)

The website and CLI share one metadata API and one theme manifest standard. Every theme has:
- screenshots and preview images
- required packages
- fonts/icons/themes metadata
- distro compatibility
- install steps and post-install hooks

The final desktop should match preview screenshots by using explicit versions and deterministic install steps.

---

## 2) Monorepo Structure

```text
ricehub/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── security.md
│   └── contributor-guide.md
├── website/
│   ├── frontend/                  # Next.js + React + Tailwind
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── styles/
│   │   ├── public/
│   │   └── package.json
│   └── backend/                   # Next API routes or Express service
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── db/
│       │   └── middleware/
│       └── package.json
├── cli/
│   ├── src/
│   │   ├── commands/
│   │   ├── api/
│   │   ├── installers/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── themes/
│   ├── openbox/
│   │   └── tokyo-night/
│   │       ├── manifest.yaml
│   │       ├── dotfiles/
│   │       ├── assets/
│   │       │   ├── screenshot-1.png
│   │       │   └── screenshot-2.png
│   │       └── install.sh
│   ├── hyprland/
│   ├── i3/
│   ├── bspwm/
│   ├── kde/
│   ├── gnome/
│   └── xfce/
├── installer/
│   ├── lib/
│   │   ├── distro.sh
│   │   ├── packages.sh
│   │   ├── fonts.sh
│   │   └── backup.sh
│   └── templates/
│       └── install-theme.sh
├── scripts/
│   ├── validate-theme.ts
│   ├── sync-theme-index.ts
│   └── build-search-index.ts
├── infra/
│   ├── docker/
│   ├── vercel.json
│   └── cloudflare-pages.md
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   ├── theme-validation.yml
    │   └── release-cli.yml
    └── ISSUE_TEMPLATE/
```

---

## 3) Core Data Model

Use **PostgreSQL** for relational integrity and filtering performance.

### Tables

- `users`
  - `id`, `username`, `email`, `avatar_url`, `bio`, `created_at`
- `themes`
  - `id`, `slug`, `name`, `wm_de`, `description`, `author_id`, `license`, `repo_url`, `created_at`, `updated_at`
- `theme_versions`
  - `id`, `theme_id`, `version`, `manifest_json`, `install_script_url`, `checksum`, `created_at`
- `theme_assets`
  - `id`, `theme_version_id`, `type` (screenshot/preview), `url`, `width`, `height`
- `theme_dependencies`
  - `id`, `theme_version_id`, `package_name`, `category`
- `ratings`
  - `id`, `theme_id`, `user_id`, `score` (1-5), `review`, `created_at`
- `favorites`
  - `id`, `theme_id`, `user_id`, `created_at`
- `compatibility`
  - `id`, `theme_version_id`, `distro` (arch/debian/fedora), `status` (verified/partial/unknown)

---

## 4) Theme Manifest Standard

Each theme must include `manifest.yaml`:

```yaml
id: tokyo-night-openbox
name: Tokyo Night Openbox
wm_de: openbox
version: 1.0.0
author: ricehub-user
license: MIT
homepage: https://github.com/ricehub/themes/tree/main/openbox/tokyo-night
screenshots:
  - assets/screenshot-1.png
  - assets/screenshot-2.png
dependencies:
  common: [picom, rofi, polybar, kitty, feh]
  arch: [ttf-jetbrains-mono-nerd]
  debian: [fonts-jetbrains-mono]
  fedora: [jetbrains-mono-fonts]
fonts:
  - JetBrainsMono Nerd Font
icons:
  - Papirus
gtk_theme: Tokyo-Night-Dark
terminal: kitty
compositor: picom
bar: polybar
dotfiles_path: dotfiles
install:
  script: install.sh
  requires_sudo: true
compatibility:
  arch: verified
  debian: verified
  fedora: partial
```

Manifest is validated in CI before publishing.

---

## 5) Website User Flow

## Step 1: Environment Selection
- Landing page shows WM/DE cards: Hyprland, Openbox, i3, BSPWM, KDE, GNOME, XFCE.
- User chooses one to scope compatible themes.

## Step 2: Theme Discovery Grid
- Responsive card grid with preview image, name, rating, distro badges, tags.
- Filters: WM/DE, distro support, dark/light, popularity, newest.

## Step 3: Theme Detail Page
Display:
- screenshots and before/after previews
- full dependency list
- fonts/icons/compositor/terminal/bar
- version and compatibility matrix
- install risk notes and backup behavior

Primary CTA:
- **INSTALL THEME** button

## Step 4: Command Generation
Generated command example:

```bash
bash <(curl -fsSL https://ricehub.sh/install/openbox/tokyo-night.sh)
```

Command generator adds optional flags:
- `--distro auto|arch|debian|fedora`
- `--dry-run`
- `--no-fonts`
- `--no-icons`
- `--rollback-on-fail`

---

## 6) Installation Engine (Deterministic)

Each generated installer should:

1. Detect distro from `/etc/os-release`
2. Map dependency names per distro
3. Backup existing configs (`~/.config`, theme-specific files)
4. Install packages via package manager
5. Install fonts and refresh cache (`fc-cache -fv`)
6. Copy dotfiles with merge strategy
7. Set GTK/icon/theme assets
8. Reload services/components (polybar, WM config reload)
9. Print success summary and rollback instructions

### Distro detection snippet

```bash
source /etc/os-release
case "$ID" in
  arch|manjaro) DISTRO="arch"; PKG_MGR="pacman" ;;
  ubuntu|debian|linuxmint|pop) DISTRO="debian"; PKG_MGR="apt" ;;
  fedora) DISTRO="fedora"; PKG_MGR="dnf" ;;
  *) echo "Unsupported distro: $ID"; exit 1 ;;
esac
```

### Package install abstraction

```bash
install_packages() {
  case "$PKG_MGR" in
    pacman) sudo pacman -Syu --noconfirm "$@" ;;
    apt) sudo apt update && sudo apt install -y "$@" ;;
    dnf) sudo dnf install -y "$@" ;;
  esac
}
```

---

## 7) Backend/API Design

Implement with Next.js API routes or Express.

### Key endpoints
- `GET /api/themes?wm=openbox&distro=arch&sort=popular`
- `GET /api/themes/:slug`
- `GET /api/themes/:slug/install-script?distro=auto`
- `POST /api/themes` (submit)
- `POST /api/themes/:slug/rating`
- `GET /api/search?q=tokyo+night`
- `GET /api/users/:username`

### Security
- Sanitize manifests and uploads
- Require signed commits or verified repo ownership for publish
- Rate limit submissions/ratings
- Store script checksum and verify during generation

---

## 8) Feature-by-Feature Build Plan

1. **Theme discovery system**
   - Build `themes` endpoint + indexed DB query + tag metadata.
2. **Theme preview gallery**
   - Optimized Next Image pipeline, lazy loading, WebP variants.
3. **Theme dependency list**
   - Manifest parser + distro-specific dependency transformer.
4. **One-click install command generator**
   - Server endpoint renders shell from template + manifest + distro map.
5. **Theme installation scripts**
   - Shared installer library + theme-specific hooks.
6. **Theme submission system**
   - Upload manifest + screenshot + repo URL; run validation pipeline.
7. **Community rating system**
   - 1–5 score, optional review, anti-spam rate limits.
8. **Search and filters**
   - PostgreSQL full-text + faceted filters.
9. **User profiles**
   - Published themes, ratings, favorites, install stats.
10. **Theme categories**
   - Minimal, anime, cyberpunk, productivity, retro.
11. **Linux distro compatibility**
   - CI matrix tests in Arch/Debian/Fedora containers.

---

## 9) CLI Tool Design (`ricehub`)

Build CLI in TypeScript (Node.js) with `commander` + `chalk` + `ora`.

### Commands

```bash
ricehub search hyprland
ricehub list openbox
ricehub preview dracula
ricehub install tokyo-night --dry-run
```

### Command behavior
- `search <query>`: search by name/tags/WM/DE.
- `list <wm_de>`: show compatible themes.
- `preview <slug>`: open screenshot URLs or render terminal summary.
- `install <slug>`: fetch install script URL and execute with confirmation.

### CLI architecture
- `src/commands/*.ts`: command handlers
- `src/api/client.ts`: HTTP client to RiceHub API
- `src/installers/runner.ts`: safe subprocess wrapper
- `src/installers/confirm.ts`: prompts and risk warnings

---

## 10) CI/CD and Quality Gates

### CI jobs
1. Lint + typecheck frontend/backend/cli
2. Validate every `manifest.yaml`
3. Test installer shell scripts (`shellcheck` + integration containers)
4. Build website
5. Build CLI and publish release on Git tags

### Deployment
- **Website**: Vercel or Cloudflare Pages
- **API**: Next API routes on Vercel or container service
- **Database**: managed PostgreSQL (Neon/Supabase/RDS)
- **Theme assets**: GitHub repos + optional CDN cache layer

---

## 11) Open-Source Governance

- License: `MIT` (code), `CC BY-SA` (screenshots/docs optional)
- `CONTRIBUTING.md` with theme template and QA checklist
- `CODE_OF_CONDUCT.md`
- Maintainer bot checks for broken screenshot links and invalid manifests

---

## 12) MVP Milestones (Practical Roadmap)

### Milestone 1: Core Discovery (2–3 weeks)
- Theme schema + DB + list/detail pages
- Manual install command generation

### Milestone 2: Installer Automation (2–4 weeks)
- Shared distro detection + package mapping
- Backup/restore + dry-run mode

### Milestone 3: Community Features (2–3 weeks)
- Submissions + ratings + profiles

### Milestone 4: CLI + Hardening (2–3 weeks)
- CLI search/list/install/preview
- Security hardening, checksums, signatures

---

## 13) Example “Tokyo Night Openbox” Theme Page Spec

- **Theme name:** Tokyo Night Openbox
- **Dependencies:** picom, rofi, polybar, kitty, feh, nerd-fonts
- **Programs used:** Openbox, Polybar, Picom, Kitty, Rofi
- **Fonts:** JetBrainsMono Nerd Font
- **Icons:** Papirus Dark
- **Install button:** generates installer command shown above

Expected outcome: user runs a single command and receives a desktop matching screenshots.

---

## 14) Next Build Steps

1. Initialize monorepo workspaces (`website`, `cli`, `themes`).
2. Implement manifest validator.
3. Implement API endpoints for list/detail/install-script.
4. Build theme detail page UI and install CTA.
5. Add first 3 verified themes (Openbox, Hyprland, i3).
6. Add installer integration tests for Arch, Debian, Fedora.

RiceHub is now defined as a complete, extensible open-source architecture ready for implementation.
