# Contributing to RiceHub

Thank you for your interest in contributing to RiceHub! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ricehub/ricehub.git
   cd ricehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start all services
   npm run dev

   # Or start individual services
   cd website && npm run dev
   cd cli && npm run build && node dist/index.js
   ```

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

## Creating a Theme

To create a new theme:

1. Create a directory under `themes/{wm_de}/{theme-name}/`
2. Add a `manifest.yaml` file with theme metadata
3. Add an `install.sh` script for installation
4. Add dotfiles under `dotfiles/` subdirectory
5. Add screenshots under `assets/` subdirectory

See `docs/theme-manifest.md` for the complete manifest specification.

## Testing

```bash
# Run all tests
npm test

# Validate theme manifests
npm run build --workspace=scripts
node scripts/dist/validate-theme.js themes/{wm}/{theme}/manifest.yaml

# Test CLI
cd cli && npm run build && node dist/index.js --help
```

## Code Style

- Use TypeScript for all new code
- Follow existing code style (Prettier)
- Write meaningful commit messages
- Add tests for new features

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit with clear messages
6. Push to your fork
7. Create a pull request

## Getting Help

- GitHub Issues: https://github.com/ricehub/ricehub/issues
- Documentation: https://github.com/ricehub/ricehub/tree/main/docs

## License

By contributing to RiceHub, you agree that your contributions will be licensed under the MIT license.
