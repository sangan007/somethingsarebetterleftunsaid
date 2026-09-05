export interface PaletteDefinition {
  id: string;
  name: string;
  // 4 Coordinated Dots: [Deep Pigment, Rich Mineral, Bright Accent, Subtle Luminous Tone]
  dots: [string, string, string, string];
  surface: string;       // Deep tinted dark card surface
  underlay: string;      // 1-2px offset secondary dark paper underlay
  border: string;        // Delicate luminous hairline edge border
  leftAccent: string;    // Subtle accent tone
  text: string;          // Primary typography ink (luminous off-white)
  muted: string;         // Quiet secondary/label typography
  accent: string;        // Metadata highlight tone
  defaultEmotion: string;
}

export const ARCHIVAL_PALETTES: PaletteDefinition[] = [
  {
    id: "warm-parchment",
    name: "WARM PARCHMENT",
    dots: ["#4A3728", "#9E7B4F", "#D4A373", "#F2E8DC"],
    surface: "#171513",
    underlay: "#110F0E",
    border: "rgba(212, 163, 115, 0.22)",
    leftAccent: "#C29B68",
    text: "#EDE8E0",
    muted: "#9E968A",
    accent: "#D4A373",
    defaultEmotion: "MEMORY",
  },
  {
    id: "dusty-rose",
    name: "DUSTY ROSE",
    dots: ["#5C2429", "#A64B53", "#D9828A", "#F5DADA"],
    surface: "#191416",
    underlay: "#130E10",
    border: "rgba(217, 130, 138, 0.24)",
    leftAccent: "#D9828A",
    text: "#EDE8E0",
    muted: "#A89698",
    accent: "#E28E95",
    defaultEmotion: "LOVE",
  },
  {
    id: "terracotta",
    name: "TERRACOTTA",
    dots: ["#54251B", "#A44933", "#D9775F", "#F5DDD5"],
    surface: "#191412",
    underlay: "#130E0C",
    border: "rgba(217, 119, 95, 0.24)",
    leftAccent: "#D9775F",
    text: "#EDE8E0",
    muted: "#A89690",
    accent: "#E2856E",
    defaultEmotion: "ANGER",
  },
  {
    id: "sage",
    name: "SAGE",
    dots: ["#243326", "#506E53", "#86A88A", "#DCE8DD"],
    surface: "#131814",
    underlay: "#0E130F",
    border: "rgba(134, 168, 138, 0.24)",
    leftAccent: "#86A88A",
    text: "#EDE8E0",
    muted: "#94A396",
    accent: "#98BA9C",
    defaultEmotion: "HOPE",
  },
  {
    id: "deep-blue",
    name: "DEEP BLUE",
    dots: ["#1B2738", "#436185", "#7CA2CC", "#DDE8F5"],
    surface: "#12161E",
    underlay: "#0C1016",
    border: "rgba(124, 162, 204, 0.24)",
    leftAccent: "#7CA2CC",
    text: "#EDE8E0",
    muted: "#909EAE",
    accent: "#8EB2DB",
    defaultEmotion: "REGRET",
  },
  {
    id: "forest",
    name: "FOREST",
    dots: ["#1A2E20", "#3E6647", "#76A680", "#D9EBDC"],
    surface: "#131914",
    underlay: "#0D130E",
    border: "rgba(118, 166, 128, 0.24)",
    leftAccent: "#76A680",
    text: "#EDE8E0",
    muted: "#92A696",
    accent: "#87B891",
    defaultEmotion: "GRIEF",
  },
  {
    id: "dusty-plum",
    name: "DUSTY PLUM",
    dots: ["#3D2145", "#7A4687", "#B37AC2", "#F0DCF5"],
    surface: "#18131B",
    underlay: "#120D14",
    border: "rgba(179, 122, 194, 0.24)",
    leftAccent: "#B37AC2",
    text: "#EDE8E0",
    muted: "#A494A8",
    accent: "#C289D1",
    defaultEmotion: "LONGING",
  },
  {
    id: "ochre",
    name: "OCHRE",
    dots: ["#473318", "#946B2E", "#D4A559", "#F7EEDB"],
    surface: "#181510",
    underlay: "#120F0A",
    border: "rgba(212, 165, 89, 0.24)",
    leftAccent: "#D4A559",
    text: "#EDE8E0",
    muted: "#A69B88",
    accent: "#DFB269",
    defaultEmotion: "GRATITUDE",
  },
  {
    id: "faded-brick",
    name: "FADED BRICK",
    dots: ["#521F1F", "#9C4242", "#D67676", "#F5DEDE"],
    surface: "#1A1212",
    underlay: "#130C0C",
    border: "rgba(214, 118, 118, 0.24)",
    leftAccent: "#D67676",
    text: "#EDE8E0",
    muted: "#A89494",
    accent: "#E08585",
    defaultEmotion: "ANGER",
  },
  {
    id: "midnight-ink",
    name: "MIDNIGHT INK",
    dots: ["#161B24", "#3D485C", "#7A8DAE", "#D4DCED"],
    surface: "#11141B",
    underlay: "#0B0D12",
    border: "rgba(122, 141, 174, 0.24)",
    leftAccent: "#7A8DAE",
    text: "#EDE8E0",
    muted: "#96A0B0",
    accent: "#8DA0C2",
    defaultEmotion: "OTHER",
  },
];

// Helper to look up a palette by ID with fallback
export function getPaletteById(id?: string): PaletteDefinition {
  if (!id) return ARCHIVAL_PALETTES[0];
  const found = ARCHIVAL_PALETTES.find(
    (p) => p.id.toLowerCase() === id.toLowerCase().replace("palette-", "")
  );
  return found || ARCHIVAL_PALETTES[0];
}

// Backward-compatible resolver for existing messages
export function resolveMessagePalette(
  msg: { palette?: string; emotion?: string; category?: string; bg?: string },
  index: number
): PaletteDefinition {
  if (msg.palette) {
    return getPaletteById(msg.palette);
  }

  const emotion = (msg.emotion || msg.category || "").toLowerCase().trim();
  if (emotion.includes("love")) return getPaletteById("dusty-rose");
  if (emotion.includes("regret")) return getPaletteById("deep-blue");
  if (emotion.includes("anger")) return getPaletteById("terracotta");
  if (emotion.includes("hope")) return getPaletteById("sage");
  if (emotion.includes("longing")) return getPaletteById("dusty-plum");
  if (emotion.includes("grief")) return getPaletteById("forest");
  if (emotion.includes("gratitude")) return getPaletteById("ochre");
  if (emotion.includes("memory")) return getPaletteById("warm-parchment");

  // Legacy bg checks
  const bg = (msg.bg || "").toLowerCase();
  if (bg === "#450a0a") return getPaletteById("faded-brick");
  if (bg === "#0f172a") return getPaletteById("deep-blue");
  if (bg === "#14532d") return getPaletteById("forest");
  if (bg === "#57534e") return getPaletteById("terracotta");
  if (bg === "#3f3f46") return getPaletteById("sage");

  // Rotating default for harmonious archival variety
  return ARCHIVAL_PALETTES[index % ARCHIVAL_PALETTES.length];
}
