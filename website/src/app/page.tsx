import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Download, Search, Star } from 'lucide-react';

export default function HomePage() {
  const windowManagers = [
    { id: 'hyprland', name: 'Hyprland', description: 'Dynamic tiling Wayland compositor' },
    { id: 'openbox', name: 'Openbox', description: 'Lightweight stacking window manager' },
    { id: 'i3', name: 'i3', description: 'Tiling window manager' },
    { id: 'bspwm', name: 'BSPWM', description: 'Binary space partitioning WM' },
    { id: 'kde', name: 'KDE', description: 'Modern desktop environment' },
    { id: 'gnome', name: 'GNOME', description: 'Feature-rich desktop environment' },
    { id: 'xfce', name: 'XFCE', description: 'Lightweight desktop environment' },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold">RiceHub</h1>
          </div>
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

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Discover Beautiful Linux Desktop Themes
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Preview, install, and share your favorite rices with one command
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/themes"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Themes
            </Link>
            <Link
              href="/docs/installing"
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Get CLI
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Choose Your Window Manager</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {windowManagers.map((wm) => (
              <Link
                key={wm.id}
                href={`/themes?wm=${wm.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                    <Image src={`/logos/${wm.id}.svg`} width={28} height={28} alt={`${wm.name} logo`} />
                  </div>
                  <h4 className="text-xl font-semibold">{wm.name}</h4>
                </div>
                <p className="text-gray-600 text-sm">{wm.description}</p>
                <div className="mt-4 text-sm font-medium text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse themes →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold mb-2">Discover</h4>
              <p className="text-gray-600 text-sm">
                Browse themes by window manager, distro, or style
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold mb-2">Preview</h4>
              <p className="text-gray-600 text-sm">
                See screenshots and detailed configuration info
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold mb-2">Install</h4>
              <p className="text-gray-600 text-sm">
                One command to install with automatic setup
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 RiceHub. Open source under MIT license.</p>
        </div>
      </footer>
    </div>
  );
}
