export type WindowManagerId = 'hyprland' | 'openbox' | 'i3' | 'bspwm' | 'kde' | 'gnome' | 'xfce';

export type ThemeCatalogItem = {
  slug: string;
  name: string;
  description: string;
  wm: WindowManagerId;
  image: string; // card image
  screenshots: [string, string, string]; // gallery (main + 2)
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
    image: '/themes/tokyo-openbox.png',
    screenshots: ['/themes/tokyo-openbox.png', '/themes/tokyo-openbox-2.png', '/themes/tokyo-openbox-3.png'],
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
    image: '/themes/dracula-hyprland.png',
    screenshots: ['/themes/dracula-hyprland.png', '/themes/dracula-hyprland.png', '/themes/dracula-hyprland.png'],
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
    image: '/themes/nord-i3.png',
    screenshots: ['/themes/nord-i3.png', '/themes/nord-i3.png', '/themes/nord-i3.png'],
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

