#!/usr/bin/env bash
set -euo pipefail

THEME_SLUG="${1:-tokyo-night-openbox}"
WM="${2:-openbox}"

log() { printf "\033[1;34m[ricehub]\033[0m %s\n" "$1"; }
err() { printf "\033[1;31m[ricehub]\033[0m %s\n" "$1" >&2; }

require() {
  command -v "$1" >/dev/null 2>&1 || { err "Missing required command: $1"; exit 1; }
}

source /etc/os-release
case "${ID:-}" in
  arch|manjaro) DISTRO="arch"; PKG="pacman" ;;
  ubuntu|debian|linuxmint|pop) DISTRO="debian"; PKG="apt" ;;
  fedora) DISTRO="fedora"; PKG="dnf" ;;
  *) err "Unsupported distro: ${ID:-unknown}"; exit 1 ;;
esac

install_pkgs() {
  case "$PKG" in
    pacman) sudo pacman -Syu --noconfirm "$@" ;;
    apt) sudo apt update && sudo apt install -y "$@" ;;
    dnf) sudo dnf install -y "$@" ;;
  esac
}

backup_dir="$HOME/.ricehub-backups/${THEME_SLUG}-$(date +%s)"
mkdir -p "$backup_dir"
log "Created backup directory: $backup_dir"

if [ -d "$HOME/.config" ]; then
  cp -a "$HOME/.config" "$backup_dir/config"
fi

common=(git curl feh rofi)
arch_extra=(picom polybar kitty)
debian_extra=(picom polybar kitty)
fedora_extra=(picom polybar kitty)

log "Installing dependencies for $DISTRO"
case "$DISTRO" in
  arch) install_pkgs "${common[@]}" "${arch_extra[@]}" ;;
  debian) install_pkgs "${common[@]}" "${debian_extra[@]}" ;;
  fedora) install_pkgs "${common[@]}" "${fedora_extra[@]}" ;;
esac

require git
repo_dir="$HOME/.cache/ricehub/$THEME_SLUG"
mkdir -p "$(dirname "$repo_dir")"

log "Fetching theme dotfiles"
rm -rf "$repo_dir"
git clone "https://github.com/ricehub/themes.git" "$repo_dir"

log "Applying config"
mkdir -p "$HOME/.config"
cp -a "$repo_dir/$WM/$THEME_SLUG/dotfiles/." "$HOME/.config/"

if command -v fc-cache >/dev/null 2>&1; then
  fc-cache -fv || true
fi

log "Theme installation completed: $THEME_SLUG"
log "If needed, restore from backup: $backup_dir"
