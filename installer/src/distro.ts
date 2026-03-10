export type Distro = 'arch' | 'debian' | 'fedora';
export type PackageManager = 'pacman' | 'apt' | 'dnf';

export interface DistroInfo {
  distro: Distro;
  packageManager: PackageManager;
}

export function detectDistro(): DistroInfo {
  if (typeof process !== 'undefined' && process.platform === 'linux') {
    try {
      const fs = require('fs');
      const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
      const lines = osRelease.split('\n');
      
      for (const line of lines) {
        const match = line.match(/^ID=(.*)$/);
        if (match) {
          const id = match[1].replace(/"/g, '');
          
          if (['arch', 'manjaro'].includes(id)) {
            return { distro: 'arch', packageManager: 'pacman' };
          } else if (['ubuntu', 'debian', 'linuxmint', 'pop'].includes(id)) {
            return { distro: 'debian', packageManager: 'apt' };
          } else if (id === 'fedora') {
            return { distro: 'fedora', packageManager: 'dnf' };
          }
        }
      }
    } catch (error) {
      // Fallback if file cannot be read
    }
  }
  
  throw new Error('Unsupported or undetectable distribution');
}

export function getPackageManager(distro: Distro): PackageManager {
  switch (distro) {
    case 'arch':
      return 'pacman';
    case 'debian':
      return 'apt';
    case 'fedora':
      return 'dnf';
    default:
      throw new Error(`Unknown distro: ${distro}`);
  }
}
