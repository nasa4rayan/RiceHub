const DEFAULT_PLACEHOLDER_IMAGE = '/themes/placeholder-theme.svg';

const COMMON_SCREENSHOT_FILENAMES = [
  'screenshot.png',
  'preview.png',
  'desktop.png',
  'preview1.png',
  'screenshot.jpg',
  'preview.jpg',
];

const COMMON_BRANCHES = ['main', 'master'];

type CacheEntry = {
  expiresAt: number;
  screenshots: string[];
};

const screenshotCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 15;

function parseGitHubRepo(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(repoUrl);
    if (parsed.hostname !== 'github.com') return null;
    const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

async function urlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'force-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function resolveThemeScreenshots(repoUrl: string): Promise<string[]> {
  const cached = screenshotCache.get(repoUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.screenshots;

  const repo = parseGitHubRepo(repoUrl);
  if (!repo) return [DEFAULT_PLACEHOLDER_IMAGE];

  const candidates = COMMON_BRANCHES.flatMap((branch) =>
    COMMON_SCREENSHOT_FILENAMES.map(
      (filename) => `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${filename}`
    )
  );

  const checks = await Promise.all(
    candidates.map(async (candidate) => ({
      candidate,
      exists: await urlExists(candidate),
    }))
  );

  const found = checks.filter((check) => check.exists).map((check) => check.candidate);
  const screenshots = found.length > 0 ? found : [DEFAULT_PLACEHOLDER_IMAGE];

  screenshotCache.set(repoUrl, {
    screenshots,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return screenshots;
}

export function getThemePreviewImage(screenshots: string[]): string {
  return screenshots[0] ?? DEFAULT_PLACEHOLDER_IMAGE;
}

export function getThemeGallery(screenshots: string[]): [string, string, string] {
  if (screenshots.length === 0) {
    return [DEFAULT_PLACEHOLDER_IMAGE, DEFAULT_PLACEHOLDER_IMAGE, DEFAULT_PLACEHOLDER_IMAGE];
  }

  const first = screenshots[0];
  const second = screenshots[1] ?? first;
  const third = screenshots[2] ?? second;
  return [first, second, third];
}
