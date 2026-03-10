#!/usr/bin/env node
import { Command } from "commander";

const API_BASE = process.env.RICEHUB_API ?? "https://ricehub.sh/api";
const program = new Command();

async function getJson(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

program
  .name("ricehub")
  .description("Discover and install Linux rice themes")
  .version("0.1.0");

program
  .command("search")
  .argument("<query>")
  .action(async (query) => {
    const payload = await getJson(`/themes?q=${encodeURIComponent(query)}`);
    for (const theme of payload.data ?? []) {
      console.log(`${theme.name} (${theme.window_manager}) - ⭐ ${theme.rating}`);
    }
  });

program
  .command("list")
  .argument("<wm>")
  .action(async (wm) => {
    const payload = await getJson(`/themes?wm=${encodeURIComponent(wm)}`);
    for (const theme of payload.data ?? []) console.log(`${theme.slug}`);
  });

program
  .command("preview")
  .argument("<slug>")
  .action(async (slug) => {
    const payload = await getJson(`/themes/${encodeURIComponent(slug)}`);
    console.log(payload.data?.image ?? "No preview image available.");
  });

program
  .command("install")
  .argument("<slug>")
  .option("--wm <wm>", "window manager", "openbox")
  .action(async (slug, options) => {
    const cmd = `bash <(curl -fsSL https://ricehub.sh/install/${options.wm}/${slug}.sh)`;
    console.log(`Run this command:\n${cmd}`);
  });

program.parseAsync(process.argv);
