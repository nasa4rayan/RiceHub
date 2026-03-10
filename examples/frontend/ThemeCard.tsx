import Image from "next/image";

export function ThemeCard({ theme }: { theme: any }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:shadow-lg hover:shadow-black/20">
      <Image src={theme.image} alt={theme.name} width={960} height={540} className="h-44 w-full object-cover" />
      <div className="space-y-2 p-4">
        <h3 className="font-medium">{theme.name}</h3>
        <p className="line-clamp-2 text-sm text-zinc-400">{theme.description}</p>
        <div className="flex items-center gap-4 text-sm text-zinc-300">
          <span>⭐ {theme.rating.toFixed(1)}</span>
          <span>⬇ {theme.downloads}</span>
        </div>
      </div>
    </article>
  );
}
