#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

interface Theme {
  slug: string;
  name: string;
  wm_de: string;
  description?: string;
  version: string;
  author: string;
  license: string;
  homepage?: string;
  screenshots: string[];
  dependencies: {
    common: string[];
    arch?: string[];
    debian?: string[];
    fedora?: string[];
  };
  fonts?: string[];
  icons?: string[];
  gtk_theme?: string;
  terminal?: string;
  compositor?: string;
  bar?: string;
  compatibility?: Record<string, string>;
}

function scanThemes(themesDir: string): Theme[] {
  const themes: Theme[] = [];

  if (!existsSync(themesDir)) {
    console.error(`Themes directory not found: ${themesDir}`);
    return themes;
  }

  const wmDirs = readdirSync(themesDir);

  for (const wmDir of wmDirs) {
    const wmPath = join(themesDir, wmDir);
    
    if (!existsSync(wmPath)) continue;

    const themeDirs = readdirSync(wmPath);

    for (const themeDir of themeDirs) {
      const manifestPath = join(wmPath, themeDir, 'manifest.yaml');
      
      if (!existsSync(manifestPath)) continue;

      try {
        const manifestContent = readFileSync(manifestPath, 'utf-8');
        const manifest = YAML.parse(manifestContent);
        
        themes.push({
          slug: manifest.id || themeDir,
          name: manifest.name,
          wm_de: manifest.wm_de,
          description: manifest.description,
          version: manifest.version,
          author: manifest.author,
          license: manifest.license,
          homepage: manifest.homepage,
          screenshots: manifest.screenshots || [],
          dependencies: manifest.dependencies || { common: [] },
          fonts: manifest.fonts,
          icons: manifest.icons,
          gtk_theme: manifest.gtk_theme,
          terminal: manifest.terminal,
          compositor: manifest.compositor,
          bar: manifest.bar,
          compatibility: manifest.compatibility,
        });
      } catch (error) {
        console.error(`Failed to parse manifest for ${wmDir}/${themeDir}:`, error);
      }
    }
  }

  return themes;
}

function generateThemeIndex(themes: Theme[]): string {
  return `// Auto-generated theme index
// DO NOT EDIT MANUALLY

export const themes = ${JSON.stringify(themes, null, 2)} as const;

export type Theme = typeof themes[number];
`;
}

if (require.main === module) {
  const themesDir = process.argv[2] || './themes';
  const outputPath = process.argv[3] || './website/src/lib/themes.ts';

  console.log('Scanning themes...');
  const themes = scanThemes(themesDir);
  
  console.log(`Found ${themes.length} theme(s)`);
  
  const indexContent = generateThemeIndex(themes);
  
  writeFileSync(outputPath, indexContent, 'utf-8');
  
  console.log(`Theme index written to ${outputPath}`);
}
