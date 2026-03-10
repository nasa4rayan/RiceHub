# RiceHub Architecture

## Overview

RiceHub is a monorepo containing a Next.js website, CLI tool, shared installer library, and theme repository. The architecture follows a modular design with clear separation of concerns.

## Project Structure

```
ricehub/
├── website/          # Next.js frontend + API routes
├── cli/              # TypeScript CLI tool
├── installer/        # Shared installation library
├── scripts/          # Build and validation utilities
├── themes/           # Theme repository
└── docs/             # Documentation
```

## Components

### Website (Next.js)

**Frontend:**
- React components for theme discovery and preview
- TailwindCSS for styling
- Client-side state management with React hooks

**Backend:**
- Next.js API routes for theme data
- Install script generation
- Search and filtering

### CLI (TypeScript)

- Commander.js for CLI interface
- Chalk for colored output
- Ora for spinners
- Inquirer for interactive prompts
- Axios for API requests

### Installer Library

- Distro detection (Arch, Debian, Fedora)
- Package manager abstraction (pacman, apt, dnf)
- Backup and restore functionality
- Package mapping for cross-distro compatibility

### Scripts

- Theme manifest validation with Zod
- Theme index generation
- Search index building

## Data Flow

1. **Theme Discovery**: Website/CLI → API → Theme Index
2. **Theme Preview**: Website/CLI → API → Theme Details
3. **Install Generation**: Website/CLI → API → Install Script Template
4. **Theme Installation**: User runs install script → Installer Library → System Changes

## Theme Manifest Standard

Each theme must include `manifest.yaml` with:

- Basic metadata (id, name, wm_de, version, author, license)
- Screenshots
- Dependencies (common + distro-specific)
- Fonts, icons, GTK theme
- Installation configuration
- Compatibility matrix

## Installation Flow

1. User selects theme on website or CLI
2. API generates install script with theme-specific configuration
3. Install script:
   - Detects distro
   - Backs up existing configs
   - Installs packages
   - Copies dotfiles
   - Reloads services
4. User can rollback from backup

## Security Considerations

- Install scripts are generated server-side with checksums
- All manifests are validated before publishing
- Rate limiting on API endpoints
- User confirmation before installation
- Automatic backup creation

## Future Enhancements

- PostgreSQL database for user accounts and ratings
- OAuth authentication (GitHub/GitLab)
- Theme submission system
- Rating and favorites
- CLI package distribution via npm
- CDN for theme assets
