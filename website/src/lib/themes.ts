// Auto-generated theme index
// DO NOT EDIT MANUALLY

export const themes = [
  {
    "slug": "dracula-hyprland",
    "name": "Dracula Hyprland",
    "wm_de": "hyprland",
    "description": "Popular Dracula color scheme for Hyprland with rounded corners and modern aesthetics.",
    "version": "1.0.0",
    "author": "ricehub-user",
    "license": "MIT",
    "homepage": "https://github.com/ricehub/themes/tree/main/hyprland/dracula",
    "screenshots": [
      "assets/screenshot-1.png",
      "assets/screenshot-2.png"
    ],
    "dependencies": {
      "common": [
        "waybar",
        "rofi",
        "kitty",
        "swaybg",
        "wlogout"
      ],
      "arch": [
        "ttf-jetbrains-mono-nerd"
      ],
      "debian": [
        "fonts-jetbrains-mono"
      ],
      "fedora": [
        "jetbrains-mono-fonts"
      ]
    },
    "fonts": [
      "JetBrainsMono Nerd Font"
    ],
    "icons": [
      "Papirus-Dark"
    ],
    "terminal": "kitty",
    "bar": "waybar",
    "compatibility": {
      "arch": "verified",
      "debian": "partial",
      "fedora": "partial"
    }
  },
  {
    "slug": "nord-i3",
    "name": "Nord i3",
    "wm_de": "i3",
    "description": "Nord color palette for i3 with polybar and rofi, featuring a clean and minimal design.",
    "version": "1.0.0",
    "author": "ricehub-user",
    "license": "MIT",
    "homepage": "https://github.com/ricehub/themes/tree/main/i3/nord",
    "screenshots": [
      "assets/screenshot-1.png",
      "assets/screenshot-2.png"
    ],
    "dependencies": {
      "common": [
        "picom",
        "rofi",
        "polybar",
        "kitty",
        "feh"
      ],
      "arch": [
        "ttf-jetbrains-mono-nerd"
      ],
      "debian": [
        "fonts-jetbrains-mono"
      ],
      "fedora": [
        "jetbrains-mono-fonts"
      ]
    },
    "fonts": [
      "JetBrainsMono Nerd Font"
    ],
    "icons": [
      "Papirus-Nord"
    ],
    "gtk_theme": "Nordic",
    "terminal": "kitty",
    "compositor": "picom",
    "bar": "polybar",
    "compatibility": {
      "arch": "verified",
      "debian": "verified",
      "fedora": "partial"
    }
  },
  {
    "slug": "tokyo-night-openbox",
    "name": "Tokyo Night Openbox",
    "wm_de": "openbox",
    "description": "Clean and minimal Openbox theme with Tokyo Night color palette featuring smooth animations and a cohesive design.",
    "version": "1.0.0",
    "author": "ricehub-user",
    "license": "MIT",
    "homepage": "https://github.com/ricehub/themes/tree/main/openbox/tokyo-night",
    "screenshots": [
      "assets/screenshot-1.png",
      "assets/screenshot-2.png"
    ],
    "dependencies": {
      "common": [
        "picom",
        "rofi",
        "polybar",
        "kitty",
        "feh"
      ],
      "arch": [
        "ttf-jetbrains-mono-nerd"
      ],
      "debian": [
        "fonts-jetbrains-mono"
      ],
      "fedora": [
        "jetbrains-mono-fonts"
      ]
    },
    "fonts": [
      "JetBrainsMono Nerd Font"
    ],
    "icons": [
      "Papirus"
    ],
    "gtk_theme": "Tokyo-Night-Dark",
    "terminal": "kitty",
    "compositor": "picom",
    "bar": "polybar",
    "compatibility": {
      "arch": "verified",
      "debian": "verified",
      "fedora": "partial"
    }
  }
] as const;

export type Theme = typeof themes[number];
