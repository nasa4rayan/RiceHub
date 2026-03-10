# RiceHub Contributor Guide

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ricehub/ricehub.git
cd ricehub

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Development

### Website Development

```bash
# Start Next.js dev server
cd website
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### CLI Development

```bash
# Build CLI
cd cli
pnpm build

# Run CLI
node dist/index.js --help

# Link for local testing
pnpm link --global
ricehub --help
```

### Scripts Development

```bash
# Build scripts
cd scripts
pnpm build

# Validate theme manifest
node dist/validate-theme.js ../themes/openbox/tokyo-night/manifest.yaml

# Sync theme index
node dist/sync-theme-index.js ../themes

# Build search index
node dist/build-search-index.js
```

## Creating a Theme

### Theme Structure

```
themes/{wm_de}/{theme-name}/
├── manifest.yaml
├── install.sh
├── dotfiles/
│   ├── openbox/
│   ├── polybar/
│   └── kitty/
└── assets/
    ├── screenshot-1.png
    └── screenshot-2.png
```

### Manifest Requirements

See `docs/theme-manifest.md` for the complete manifest specification.

### Install Script Requirements

Install scripts must:
1. Start with `#!/bin/bash` and `set -e`
2. Detect distro from `/etc/os-release`
3. Backup existing configurations
4. Install packages via appropriate package manager
5. Copy dotfiles to `~/.config`
6. Reload services
7. Provide rollback instructions

### Example Install Script

```bash
#!/bin/bash
set -e

THEME_SLUG="your-theme"
WM_DE="your-wm"

# Detect distro
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        case "$ID" in
            arch|manjaro) echo "arch" ;;
            ubuntu|debian|linuxmint|pop) echo "debian" ;;
            fedora) echo "fedora" ;;
            *) exit 1 ;;
        esac
    fi
}

# Backup configs
backup_configs() {
    BACKUP_DIR="$HOME/.config/ricehub-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    # Backup logic here
    echo "$BACKUP_DIR"
}

# Install packages
install_packages() {
    local distro=$1
    shift
    local packages=("$@")
    
    case "$distro" in
        arch) sudo pacman -Syu --noconfirm "${packages[@]}" ;;
        debian) sudo apt update && sudo apt install -y "${packages[@]}" ;;
        fedora) sudo dnf install -y "${packages[@]}" ;;
    esac
}

# Main installation
main() {
    DETECTED_DISTRO=$(detect_distro)
    BACKUP_DIR=$(backup_configs)
    install_packages "$DETECTED_DISTRO" package1 package2
    # Copy dotfiles and reload services
}

main "$@"
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific workspace tests
pnpm --filter @ricehub/website test
```

### Manual Testing

1. Test theme validation:
   ```bash
   node scripts/dist/validate-theme.js themes/{wm}/{theme}/manifest.yaml
   ```

2. Test theme installation:
   ```bash
   cd themes/{wm}/{theme}
   bash install.sh --dry-run
   ```

3. Test CLI:
   ```bash
   ricehub list openbox
   ricehub preview tokyo-night-openbox
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

## Pull Request Guidelines

- Describe what the PR does
- Link to related issues
- Ensure all tests pass
- Add tests for new features
- Update documentation if needed

## Getting Help

- GitHub Issues: https://github.com/ricehub/ricehub/issues
- Discussions: https://github.com/ricehub/ricehub/discussions

## License

By contributing to RiceHub, you agree that your contributions will be licensed under the MIT license.
