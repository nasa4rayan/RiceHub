export type WindowManagerId = 'hyprland' | 'openbox' | 'i3' | 'bspwm' | 'kde' | 'gnome' | 'xfce';

export type ThemeCatalogItem = {
  slug: string;
  name: string;
  description: string;
  wm: WindowManagerId;
  repo: string;
  rating: number;
  downloads: number;
  dependencies: {
    common: string[];
    arch?: string[];
    debian?: string[];
    fedora?: string[];
  };
};

export const themeCatalog: ThemeCatalogItem[] = [
  {
    slug: 'tokyo-night-openbox',
    name: 'Tokyo Night Openbox',
    description: 'Clean and minimal Openbox theme with Tokyo Night colors.',
    wm: 'openbox',
    repo: 'https://github.com/ricehub/themes',
    rating: 4.8,
    downloads: 1234,
    dependencies: {
      common: ['picom', 'rofi', 'polybar', 'kitty', 'feh'],
      arch: ['ttf-jetbrains-mono-nerd'],
      debian: ['fonts-jetbrains-mono'],
      fedora: ['jetbrains-mono-fonts'],
    },
  },
  {
    slug: 'dracula-hyprland',
    name: 'Dracula Hyprland',
    description: 'Official Dracula theme configuration for Hyprland.',
    wm: 'hyprland',
    repo: 'https://github.com/ricehub/themes',
    rating: 4.9,
    downloads: 2345,
    dependencies: {
      common: ['waybar', 'rofi', 'kitty', 'swaybg', 'wlogout'],
      arch: ['ttf-jetbrains-mono-nerd'],
      debian: ['fonts-jetbrains-mono'],
      fedora: ['jetbrains-mono-fonts'],
    },
  },
  {
    slug: 'nord-i3',
    name: 'Nord i3',
    description: 'Nord-themed i3 rice with a clean, minimal layout.',
    wm: 'i3',
    repo: 'https://github.com/ricehub/themes',
    rating: 4.7,
    downloads: 987,
    dependencies: {
      common: ['picom', 'rofi', 'polybar', 'kitty', 'feh'],
      arch: ['ttf-jetbrains-mono-nerd'],
      debian: ['fonts-jetbrains-mono'],
      fedora: ['jetbrains-mono-fonts'],
    },
  },
];
