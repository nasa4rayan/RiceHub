'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Copy, Download, Package, Shield, Star, Terminal } from 'lucide-react';

type ThemeDetail = {
  slug: string;
  name: string;
  description: string;
  wm: string;
  image: string;
  screenshots: [string, string, string];
  rating: number;
  totalRatings: number;
  downloads: number;
  dependencies: {
    common: string[];
    arch?: string[];
    debian?: string[];
    fedora?: string[];
  };
};

export default function ThemeDetailPage({ params }: { params: { slug: string } }) {
  const [copied, setCopied] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [theme, setTheme] = useState<ThemeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setTheme(null);
      setError(null);
      try {
        const res = await fetch(`/api/themes/${params.slug}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Theme not found (${res.status})`);
        const data = (await res.json()) as ThemeDetail;
        setTheme(data);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') setError((e as Error).message);
      }
    };
    void load();
    return () => controller.abort();
  }, [params.slug]);

  const installCommand = useMemo(() => {
    if (!theme) return '';
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_URL || 'https://ricehub.sh';
    return `bash <(curl -fsSL ${origin}/install/${theme.wm}/${theme.slug}.sh)${dryRun ? ' --dry-run' : ''}`;
  }, [theme, dryRun]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">RiceHub</span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/themes" className="text-gray-600 hover:text-gray-900">
              Themes
            </Link>
            <Link href="/submit" className="text-gray-600 hover:text-gray-900">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href="/themes" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to themes
        </Link>

        {error ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-red-600">{error}</div>
        ) : !theme ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-600">Loading…</div>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                    <Image
                      src={theme.screenshots[0]}
                      alt={`${theme.name} screenshot`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[theme.screenshots[1], theme.screenshots[2]].map((src, idx) => (
                      <div key={idx} className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                        <Image
                          src={src}
                          alt={`${theme.name} screenshot ${idx + 2}`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 25vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2">{theme.name}</h1>
                  <p className="text-gray-600 mb-5">{theme.description}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{theme.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({theme.totalRatings})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Download className="w-5 h-5" />
                      <span>{theme.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-gray-50">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Install Command
                    </h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm mb-3 overflow-x-auto">
                      {installCommand}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                      <input
                        type="checkbox"
                        checked={dryRun}
                        onChange={(e) => setDryRun(e.target.checked)}
                        className="rounded"
                      />
                      <span>Dry run</span>
                    </label>
                    <button
                      onClick={handleCopy}
                      className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy command
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Backups are created automatically during install.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Dependencies
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Common</div>
                  <div className="flex flex-wrap gap-2">
                    {theme.dependencies.common.map((dep) => (
                      <span key={dep} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-full">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>

                {theme.dependencies.arch && theme.dependencies.arch.length > 0 ? (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Arch</div>
                    <div className="flex flex-wrap gap-2">
                      {theme.dependencies.arch.map((dep) => (
                        <span key={dep} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-full">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {theme.dependencies.debian && theme.dependencies.debian.length > 0 ? (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Debian/Ubuntu</div>
                    <div className="flex flex-wrap gap-2">
                      {theme.dependencies.debian.map((dep) => (
                        <span key={dep} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-full">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {theme.dependencies.fedora && theme.dependencies.fedora.length > 0 ? (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Fedora</div>
                    <div className="flex flex-wrap gap-2">
                      {theme.dependencies.fedora.map((dep) => (
                        <span key={dep} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-full">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
