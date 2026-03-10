# Theme Manifest Specification

## Overview

Every RiceHub theme must include a `manifest.yaml` file that describes the theme's metadata, dependencies, and configuration.

## Required Fields

### Basic Metadata

```yaml
id: tokyo-night-openbox              # Unique identifier (kebab-case)
name: Tokyo Night Openbox            # Human-readable name
wm_de: openbox                       # Window manager/desktop environment
version: 1.0.0                      # SemVer version
author: ricehub-user                 # Author username
license: MIT                         # License identifier
```

### Screenshots

```yaml
screenshots:
  - assets/screenshot-1.png
  - assets/screenshot-2.png
```

At least one screenshot is required. Screenshots should be:
- PNG format
- Minimum 800x450 resolution
- Show the complete desktop setup

### Dependencies

```yaml
dependencies:
  common:
    - picom
    - rofi
    - polybar
    - kitty
    - feh
  arch:
    - ttf-jetbrains-mono-nerd
  debian:
    - fonts-jetbrains-mono
  fedora:
    - jetbrains-mono-fonts
```

- `common`: Packages required for all distros
- `arch`/`debian`/`fedora`: Distro-specific package names

### Installation Configuration

```yaml
install:
  script: install.sh                 # Install script filename
  requires_sudo: true                # Whether sudo is required
```

## Optional Fields

### Description

```yaml
description: Clean and minimal Openbox theme with Tokyo Night color palette
```

### Homepage

```yaml
homepage: https://github.com/ricehub/themes/tree/main/openbox/tokyo-night
```

### Fonts

```yaml
fonts:
  - JetBrainsMono Nerd Font
```

### Icons

```yaml
icons:
  - Papirus
```

### GTK Theme

```yaml
gtk_theme: Tokyo-Night-Dark
```

### Terminal

```yaml
terminal: kitty
```

### Compositor

```yaml
compositor: picom
```

### Bar/Panel

```yaml
bar: polybar
```

### Dotfiles Path

```yaml
dotfiles_path: dotfiles
```

### Compatibility Matrix

```yaml
compatibility:
  arch: verified      # verified, partial, unknown
  debian: verified
  fedora: partial
```

### Tags

```yaml
tags:
  - minimal
  - dark
  - anime
```

## Complete Example

```yaml
id: tokyo-night-openbox
name: Tokyo Night Openbox
wm_de: openbox
description: Clean and minimal Openbox theme with Tokyo Night color palette featuring smooth animations and a cohesive design.
version: 1.0.0
author: ricehub-user
license: MIT
homepage: https://github.com/ricehub/themes/tree/main/openbox/tokyo-night
screenshots:
  - assets/screenshot-1.png
  - assets/screenshot-2.png
dependencies:
  common:
    - picom
    - rofi
    - polybar
    - kitty
    - feh
  arch:
    - ttf-jetbrains-mono-nerd
  debian:
    - fonts-jetbrains-mono
  fedora:
    - jetbrains-mono-fonts
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
tags:
  - minimal
  - dark
  - anime
```

## Validation

Themes are validated using the `validate-theme` script:

```bash
node scripts/dist/validate-theme.js themes/{wm}/{theme}/manifest.yaml
```

The validator checks:
- Required fields are present
- Field types are correct
- Screenshots list is not empty
- Dependencies are properly structured
- Version follows SemVer format
- wm_de is a valid value

## Best Practices

1. **Use descriptive IDs**: Use kebab-case, include WM/DE
2. **Provide multiple screenshots**: Show different aspects of the theme
3. **List all dependencies**: Include all required packages
4. **Specify distro packages**: Map package names correctly
5. **Include compatibility info**: Test on multiple distros
6. **Use semantic versioning**: Follow SemVer for version numbers
7. **Add relevant tags**: Help users discover your theme
