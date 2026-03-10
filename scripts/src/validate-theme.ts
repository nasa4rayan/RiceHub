#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import YAML from 'yaml';
import { z } from 'zod';

const ThemeManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  wm_de: z.enum(['hyprland', 'openbox', 'i3', 'bspwm', 'kde', 'gnome', 'xfce']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  author: z.string().min(1),
  license: z.string(),
  homepage: z.string().url().optional(),
  screenshots: z.array(z.string()).min(1),
  dependencies: z.object({
    common: z.array(z.string()),
    arch: z.array(z.string()).optional(),
    debian: z.array(z.string()).optional(),
    fedora: z.array(z.string()).optional(),
  }),
  fonts: z.array(z.string()).optional(),
  icons: z.array(z.string()).optional(),
  gtk_theme: z.string().optional(),
  terminal: z.string().optional(),
  compositor: z.string().optional(),
  bar: z.string().optional(),
  dotfiles_path: z.string().optional(),
  install: z.object({
    script: z.string(),
    requires_sudo: z.boolean().optional(),
  }).optional(),
  compatibility: z.record(z.enum(['verified', 'partial', 'unknown'])).optional(),
});

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTheme(manifestPath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  if (!existsSync(manifestPath)) {
    result.valid = false;
    result.errors.push(`Manifest file not found: ${manifestPath}`);
    return result;
  }

  try {
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const manifest = YAML.parse(manifestContent);

    const parseResult = ThemeManifestSchema.safeParse(manifest);

    if (!parseResult.success) {
      result.valid = false;
      parseResult.error.errors.forEach((error) => {
        result.errors.push(
          `${error.path.join('.')}: ${error.message}`
        );
      });
    }

    if (manifest.screenshots && manifest.screenshots.length === 0) {
      result.warnings.push('No screenshots defined in manifest');
    }

    if (!manifest.dependencies || !manifest.dependencies.common || manifest.dependencies.common.length === 0) {
      result.warnings.push('No common dependencies defined');
    }

  } catch (error) {
    result.valid = false;
    result.errors.push(`Failed to parse manifest: ${error}`);
  }

  return result;
}

if (require.main === module) {
  const manifestPath = process.argv[2] || './manifest.yaml';
  const result = validateTheme(manifestPath);

  if (result.valid) {
    console.log('✓ Theme manifest is valid');
    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((warning) => console.log(`  ⚠ ${warning}`));
    }
    process.exit(0);
  } else {
    console.error('✗ Theme manifest validation failed');
    console.error('\nErrors:');
    result.errors.forEach((error) => console.error(`  ✗ ${error}`));
    process.exit(1);
  }
}
