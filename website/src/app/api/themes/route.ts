import { NextRequest, NextResponse } from 'next/server';
import { themeCatalog } from '@/lib/theme-catalog';
import { sanitizeInput, validateDistro, validateWM_DE } from '@/lib/security';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const wm = searchParams.get('wm');
  const distro = searchParams.get('distro');
  const sort = sanitizeInput(searchParams.get('sort') || 'popular');
  const normalizedWm = wm ? sanitizeInput(wm.toLowerCase()) : '';
  const normalizedDistro = distro ? sanitizeInput(distro.toLowerCase()) : '';

  let themes = themeCatalog.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    wm: t.wm,
    image: t.image,
    rating: t.rating,
    downloads: t.downloads,
    distros: Object.keys(t.dependencies).filter((k) => k !== 'common'),
  }));

  if (normalizedWm) {
    if (!validateWM_DE(normalizedWm)) return NextResponse.json({ error: 'Invalid wm' }, { status: 400 });
    themes = themes.filter((t) => t.wm === normalizedWm);
  }

  if (normalizedDistro) {
    if (!validateDistro(normalizedDistro)) {
      return NextResponse.json({ error: 'Invalid distro' }, { status: 400 });
    }
    themes = themes.filter((t) => t.distros.includes(normalizedDistro));
  }

  if (sort === 'popular') themes.sort((a, b) => b.downloads - a.downloads);
  else if (sort === 'rating') themes.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') themes = [...themes].reverse();

  return NextResponse.json({ themes });
}
