"use client";
import Link from "next/link";

const options = [
  { key: "hyprland", title: "Hyprland", description: "Dynamic tiling Wayland compositor" },
  { key: "openbox", title: "Openbox", description: "Lightweight stacking window manager" },
  { key: "i3", title: "i3", description: "Manual tiling X11 window manager" },
  { key: "bspwm", title: "BSPWM", description: "Binary space partitioning window manager" },
  { key: "kde", title: "KDE", description: "Feature-rich Plasma desktop" },
  { key: "gnome", title: "GNOME", description: "Polished Linux desktop environment" },
  { key: "xfce", title: "XFCE", description: "Fast and low-resource desktop" },
];

export function WmSelector() {
  return (
    <section className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-semibold">Choose Your Window Manager</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((wm) => (
          <Link
            key={wm.key}
            href={`/themes?wm=${wm.key}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-700"
          >
            <h2 className="text-lg font-medium">{wm.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{wm.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
