#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { searchCommand } from './commands/search';
import { listCommand } from './commands/list';
import { previewCommand } from './commands/preview';
import { installCommand } from './commands/install';

const program = new Command();

program
  .name('ricehub')
  .description('CLI tool for discovering, previewing, and installing Linux desktop themes')
  .version('1.0.0');

program
  .command('search <query>')
  .description('Search for themes by name, tags, or window manager')
  .action(searchCommand);

program
  .command('list <wm>')
  .description('List all themes for a specific window manager')
  .action(listCommand);

program
  .command('preview <slug>')
  .description('Preview a theme with screenshots and details')
  .action(previewCommand);

program
  .command('install <slug>')
  .description('Install a theme')
  .option('--dry-run', 'Preview installation without executing')
  .option('--distro <distro>', 'Specify distro (auto, arch, debian, fedora)')
  .option('--no-fonts', 'Skip font installation')
  .option('--no-icons', 'Skip icon installation')
  .option('--rollback-on-fail', 'Automatically rollback on failure')
  .action(installCommand);

program.parse();
