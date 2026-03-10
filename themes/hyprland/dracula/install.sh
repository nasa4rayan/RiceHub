#!/bin/bash
# RiceHub Theme Installer
# Theme: Dracula Hyprland

set -e

THEME_SLUG="dracula-hyprland"
WM_DE="hyprland"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect distro
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        case "$ID" in
            arch|manjaro) echo "arch" ;;
            ubuntu|debian|linuxmint|pop) echo "debian" ;;
            fedora) echo "fedora" ;;
            *) 
                log_error "Unsupported distro: $ID"
                exit 1
                ;;
        esac
    else
        log_error "Cannot detect distro"
        exit 1
    fi
}

# Backup existing configs
backup_configs() {
    log_info "Backing up existing configurations..."
    BACKUP_DIR="$HOME/.config/ricehub-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$HOME/.config/hypr" ]; then
        cp -r "$HOME/.config/hypr" "$BACKUP_DIR/"
        log_info "Backed up Hyprland config"
    fi
    
    if [ -d "$HOME/.config/waybar" ]; then
        cp -r "$HOME/.config/waybar" "$BACKUP_DIR/"
        log_info "Backed up Waybar config"
    fi
    
    if [ -d "$HOME/.config/kitty" ]; then
        cp -r "$HOME/.config/kitty" "$BACKUP_DIR/"
        log_info "Backed up Kitty config"
    fi
    
    log_success "Backup created at: $BACKUP_DIR"
    echo "$BACKUP_DIR"
}

# Install packages
install_packages() {
    local distro=$1
    shift
    local packages=("$@")
    
    log_info "Installing packages for $distro..."
    
    case "$distro" in
        arch)
            sudo pacman -Syu --noconfirm "${packages[@]}"
            ;;
        debian)
            sudo apt update
            sudo apt install -y "${packages[@]}"
            ;;
        fedora)
            sudo dnf install -y "${packages[@]}"
            ;;
    esac
    
    log_success "Packages installed successfully"
}

# Install fonts
install_fonts() {
    log_info "Installing fonts..."
    fc-cache -fv
    log_success "Fonts installed"
}

# Copy dotfiles
copy_dotfiles() {
    log_info "Copying dotfiles..."
    
    # Copy Hyprland config
    if [ -d "dotfiles/hypr" ]; then
        mkdir -p "$HOME/.config/hypr"
        cp -r dotfiles/hypr/* "$HOME/.config/hypr/"
        log_info "Copied Hyprland config"
    fi
    
    # Copy Waybar config
    if [ -d "dotfiles/waybar" ]; then
        mkdir -p "$HOME/.config/waybar"
        cp -r dotfiles/waybar/* "$HOME/.config/waybar/"
        log_info "Copied Waybar config"
    fi
    
    # Copy Kitty config
    if [ -d "dotfiles/kitty" ]; then
        mkdir -p "$HOME/.config/kitty"
        cp -r dotfiles/kitty/* "$HOME/.config/kitty/"
        log_info "Copied Kitty config"
    fi
    
    log_success "Dotfiles copied"
}

# Main installation
main() {
    log_info "Starting installation of $THEME_SLUG..."
    
    # Detect distro
    DETECTED_DISTRO=$(detect_distro)
    log_info "Detected distro: $DETECTED_DISTRO"
    
    # Backup configs
    BACKUP_DIR=$(backup_configs)
    
    # Install packages
    case "$DETECTED_DISTRO" in
        arch)
            install_packages "$DETECTED_DISTRO" waybar rofi kitty swaybg wlogout ttf-jetbrains-mono-nerd
            ;;
        debian)
            install_packages "$DETECTED_DISTRO" waybar rofi kitty swaybg wlogout fonts-jetbrains-mono
            ;;
        fedora)
            install_packages "$DETECTED_DISTRO" waybar rofi kitty swaybg wlogout jetbrains-mono-fonts
            ;;
    esac
    
    # Install fonts
    install_fonts
    
    # Copy dotfiles
    copy_dotfiles
    
    # Reload Hyprland
    log_info "Reloading Hyprland..."
    hyprctl reload
    
    log_success "Theme installation complete!"
    log_info "Backup location: $BACKUP_DIR"
    log_info "To rollback, restore from: $BACKUP_DIR"
}

# Run main function
main "$@"
