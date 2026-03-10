import { NextRequest, NextResponse } from 'next/server';
import { themeCatalog } from '@/lib/theme-catalog';
import { sanitizeInput, validateSlug } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = sanitizeInput(params.slug.toLowerCase());
  if (!validateSlug(slug)) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });

  const theme = themeCatalog.find((t) => t.slug === slug);
  if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    slug: theme.slug,
    name: theme.name,
    wm: theme.wm,
    description: theme.description,
    image: theme.image,
    screenshots: theme.screenshots,
    rating: theme.rating,
    totalRatings: 42,
    downloads: theme.downloads,
    dependencies: theme.dependencies,
  });
}
