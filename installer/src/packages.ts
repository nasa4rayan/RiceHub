import { Distro, PackageManager } from './distro';

export interface PackageMapping {
  common: string[];
  arch?: string[];
  debian?: string[];
  fedora?: string[];
}

export function getPackagesForDistro(
  mapping: PackageMapping,
  distro: Distro
): string[] {
  const packages = [...mapping.common];
  
  if (distro === 'arch' && mapping.arch) {
    packages.push(...mapping.arch);
  } else if (distro === 'debian' && mapping.debian) {
    packages.push(...mapping.debian);
  } else if (distro === 'fedora' && mapping.fedora) {
    packages.push(...mapping.fedora);
  }
  
  return packages;
}

export function getInstallCommand(
  packages: string[],
  packageManager: PackageManager
): string {
  switch (packageManager) {
    case 'pacman':
      return `sudo pacman -Syu --noconfirm ${packages.join(' ')}`;
    case 'apt':
      return `sudo apt update && sudo apt install -y ${packages.join(' ')}`;
    case 'dnf':
      return `sudo dnf install -y ${packages.join(' ')}`;
    default:
      throw new Error(`Unknown package manager: ${packageManager}`);
  }
}
