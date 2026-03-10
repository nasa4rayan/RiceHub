import { NextRequest, NextResponse } from "next/server";

// Example route handler: GET /api/themes?wm=hyprland&q=tokyo
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wm = searchParams.get("wm");
  const q = searchParams.get("q")?.toLowerCase();

  // Replace with real DB query (Prisma/Drizzle/SQL)
  const seed = [
    {
      slug: "tokyo-night-openbox",
      name: "Tokyo Night Openbox",
      description: "Clean and minimal Openbox theme with Tokyo Night colors.",
      window_manager: "openbox",
      image: "/themes/tokyo-openbox.png",
      rating: 4.8,
      downloads: 1234,
    },
  ];

  const filtered = seed.filter((theme) => {
    const matchWm = wm ? theme.window_manager === wm : true;
    const matchQ = q ? theme.name.toLowerCase().includes(q) || theme.description.toLowerCase().includes(q) : true;
    return matchWm && matchQ;
  });

  return NextResponse.json({ data: filtered });
}
