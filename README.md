# RiceHub

Open-source platform for discovering, previewing, installing, and sharing Linux desktop themes ("rices") and dotfiles.

## Features

- **Website**: Discover themes with previews, filters, and one-click install commands
- **CLI**: Search, preview, and install themes from the terminal
- **Theme Manifest**: Standardized theme metadata with dependency management
- **Deterministic Installation**: Automated installs with backup and rollback support
- **Community**: Submit, rate, and favorite themes

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

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL (for local development)

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all services
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Contributor Guide](docs/contributor-guide.md)
- [Theme Manifest Standard](docs/theme-manifest.md)

## License

MIT
