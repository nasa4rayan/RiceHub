'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Filter, Search, Star } from 'lucide-react';

type ThemeCard = {
  slug: string;
  name: string;
  description: string;
  wm: string;
  image: string;
  rating: number;
  downloads: number;
  distros: string[];
};

export default function ThemesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWM, setSelectedWM] = useState('');
  const [selectedDistro, setSelectedDistro] = useState('');
  const [themes, setThemes] = useState<ThemeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const windowManagers = ['hyprland', 'openbox', 'i3', 'bspwm', 'kde', 'gnome', 'xfce'];
  const distros = ['arch', 'debian', 'fedora'];

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedWM) params.set('wm', selectedWM);
        if (selectedDistro) params.set('distro', selectedDistro);
        const res = await fetch(`/api/themes?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load themes (${res.status})`);
        const data = (await res.json()) as { themes: ThemeCard[] };
        setThemes(data.themes);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [selectedWM, selectedDistro]);

  const filteredThemes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return themes;
    return themes.filter((t) => `${t.name} ${t.description} ${t.wm}`.toLowerCase().includes(q));
  }, [themes, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">RiceHub</span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/themes" className="text-primary-600 font-medium">
              Themes
            </Link>
            <Link href="/submit" className="text-gray-600 hover:text-gray-900">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Themes</h1>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedWM}
                onChange={(e) => setSelectedWM(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Window Managers</option>
                {windowManagers.map((wm) => (
                  <option key={wm} value={wm}>
                    {wm.charAt(0).toUpperCase() + wm.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDistro}
                onChange={(e) => setSelectedDistro(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Distros</option>
                {distros.map((distro) => (
                  <option key={distro} value={distro}>
                    {distro.charAt(0).toUpperCase() + distro.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-gray-600">Loading themes…</div>
          ) : error ? (
            <div className="col-span-full text-red-600">{error}</div>
          ) : filteredThemes.length === 0 ? (
            <div className="col-span-full text-gray-600">No themes match your filters.</div>
          ) : (
            filteredThemes.map((theme) => (
              <div
                key={theme.slug}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Link href={`/themes/${theme.slug}`} className="block aspect-video bg-gray-100 relative">
                  <Image
                    src={theme.image}
                    alt={`${theme.name} screenshot`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{theme.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{theme.rating.toFixed(1)}</span>
                    <span className="text-gray-300">•</span>
                    <Download className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{theme.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {theme.distros.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-full"
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/themes/${theme.slug}`}
                    className="inline-flex items-center justify-center w-full bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Install
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
