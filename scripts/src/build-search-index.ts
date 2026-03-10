#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Theme {
  slug: string;
  name: string;
  wm_de: string;
  description?: string;
  tags?: string[];
}

interface SearchIndex {
  themes: Theme[];
  wm_de: string[];
  tags: string[];
}

function buildSearchIndex(themesPath: string): SearchIndex {
  const themesContent = readFileSync(themesPath, 'utf-8');
  
  const match = themesContent.match(/export const themes = (\[.*?\]) as const;/s);
  
  if (!match) {
    throw new Error('Could not find themes array');
  }

  const themes: Theme[] = JSON.parse(match[1]);
  const wm_de = new Set<string>();
  const tags = new Set<string>();

  themes.forEach((theme) => {
    wm_de.add(theme.wm_de);
    
    if (theme.tags) {
      theme.tags.forEach((tag) => tags.add(tag));
    }
  });

  return {
    themes,
    wm_de: Array.from(wm_de),
    tags: Array.from(tags),
  };
}

if (require.main === module) {
  const themesPath = process.argv[2] || './website/src/lib/themes.ts';
  const outputPath = process.argv[3] || './website/src/lib/search-index.ts';

  console.log('Building search index...');
  const index = buildSearchIndex(themesPath);
  
  const indexContent = `// Auto-generated search index
// DO NOT EDIT MANUALLY

export const searchIndex = ${JSON.stringify(index, null, 2)} as const;
`;

  writeFileSync(outputPath, indexContent, 'utf-8');
  
  console.log(`Search index written to ${outputPath}`);
}
