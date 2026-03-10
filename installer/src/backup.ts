import * as fs from 'fs';
import * as path from 'path';

export interface BackupOptions {
  backupDir?: string;
  configs?: string[];
}

export async function createBackup(options: BackupOptions = {}): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = options.backupDir || path.join(process.env.HOME || '', '.config', `ricehub-backup-${timestamp}`);
  
  const defaultConfigs = [
    'openbox',
    'polybar',
    'kitty',
    'rofi',
    'picom',
  ];
  
  const configs = options.configs || defaultConfigs;
  
  fs.mkdirSync(backupDir, { recursive: true });
  
  for (const config of configs) {
    const configPath = path.join(process.env.HOME || '', '.config', config);
    
    if (fs.existsSync(configPath)) {
      const backupPath = path.join(backupDir, config);
      copyDirectory(configPath, backupPath);
    }
  }
  
  return backupDir;
}

export async function restoreBackup(backupDir: string): Promise<void> {
  if (!fs.existsSync(backupDir)) {
    throw new Error(`Backup directory not found: ${backupDir}`);
  }
  
  const configPath = path.join(process.env.HOME || '', '.config');
  
  const items = fs.readdirSync(backupDir);
  
  for (const item of items) {
    const sourcePath = path.join(backupDir, item);
    const destPath = path.join(configPath, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    }
  }
}

function copyDirectory(source: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}
