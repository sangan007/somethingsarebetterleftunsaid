import { MessageData } from "@/components/MessageCard";
import { ARCHIVAL_PALETTES } from "./palettes";

export interface RawFirestoreDoc {
  id?: string;
  name?: string;
  fields?: Record<string, unknown>;
  msg?: string;
  to?: string;
  bg?: string;
  font?: string;
  size?: string;
  weight?: string;
  leading?: string;
  align?: string;
  border?: string;
  padding?: string;
  radius?: string;
  width?: string;
  toOpacity?: string;
  icon?: string;
  footer?: string;
  emotion?: string;
  category?: string;
  palette?: string;
  createdAt?: unknown;
  uid?: string;
}

// Convert Firestore timestamp value to { seconds: number; nanoseconds: number }
function parseTimestamp(rawDate: unknown): { seconds: number; nanoseconds: number } {
  if (!rawDate) {
    return { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 };
  }

  // Already { seconds, nanoseconds }
  if (typeof rawDate === "object" && rawDate !== null && "seconds" in rawDate) {
    const record = rawDate as { seconds?: unknown; nanoseconds?: unknown };
    const s = Number(record.seconds) || Math.floor(Date.now() / 1000);
    const ns = Number(record.nanoseconds) || 0;
    return { seconds: s, nanoseconds: ns };
  }

  // ISO String e.g. "2026-02-07T10:12:02.030Z"
  if (typeof rawDate === "string") {
    const parsed = Date.parse(rawDate);
    if (!isNaN(parsed)) {
      return { seconds: Math.floor(parsed / 1000), nanoseconds: 0 };
    }
  }

  // Firestore JS SDK Timestamp object with toMillis() or toDate()
  if (
    typeof rawDate === "object" &&
    rawDate !== null &&
    "toDate" in rawDate &&
    typeof (rawDate as { toDate: () => Date }).toDate === "function"
  ) {
    const d = (rawDate as { toDate: () => Date }).toDate();
    return { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
  }

  return { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 };
}

// Deterministically infer emotion label from existing Firebase fields
export function inferEmotion(doc: {
  emotion?: string;
  category?: string;
  bg?: string;
  msg?: string;
  to?: string;
}): string {
  if (doc.emotion && doc.emotion.trim()) return doc.emotion.trim().toUpperCase();
  if (doc.category && doc.category.trim()) return doc.category.trim().toUpperCase();

  const text = ((doc.msg || "") + " " + (doc.to || "")).toLowerCase();

  // Semantic keyword mapping
  if (text.includes("love") || text.includes("crush") || text.includes("heart") || text.includes("marry") || text.includes("kiss")) {
    return "LOVE";
  }
  if (text.includes("sorry") || text.includes("apolog") || text.includes("regret") || text.includes("mistake") || text.includes("should have")) {
    return "REGRET";
  }
  if (text.includes("hate") || text.includes("fucked") || text.includes("angry") || text.includes("anger") || text.includes("destroy")) {
    return "ANGER";
  }
  if (text.includes("miss") || text.includes("wish") || text.includes("long") || text.includes("yearn") || text.includes("want you")) {
    return "LONGING";
  }
  if (text.includes("thank") || text.includes("grateful") || text.includes("listening") || text.includes("helped")) {
    return "GRATITUDE";
  }
  if (text.includes("hope") || text.includes("survive") || text.includes("better") || text.includes("manifest") || text.includes("future")) {
    return "HOPE";
  }
  if (text.includes("die") || text.includes("dead") || text.includes("rip") || text.includes("porch") || text.includes("dad") || text.includes("mom")) {
    return "GRIEF";
  }
  if (text.includes("remember") || text.includes("intersection") || text.includes("radio") || text.includes("years") || text.includes("2015")) {
    return "MEMORY";
  }

  // Fallback to legacy background color mapping
  const bg = (doc.bg || "").toLowerCase();
  if (bg === "#450a0a") return "ANGER";
  if (bg === "#14532d") return "GRATITUDE";
  if (bg === "#0f172a") return "GRIEF";
  if (bg === "#0a0a0a") return "MEMORY";
  if (bg === "#262626") return "LONGING";
  if (bg === "#57534e") return "HOPE";

  return "OTHER";
}

// Deterministically infer palette from emotion and legacy styling
export function inferPaletteId(emotion: string, bg?: string, index: number = 0): string {
  const emo = emotion.toUpperCase();
  if (emo === "LOVE") return "dusty-rose";
  if (emo === "REGRET") return "deep-blue";
  if (emo === "ANGER") return "terracotta";
  if (emo === "HOPE") return "sage";
  if (emo === "LONGING") return "dusty-plum";
  if (emo === "GRIEF") return "forest";
  if (emo === "GRATITUDE") return "ochre";
  if (emo === "MEMORY") return "warm-parchment";

  // Check background hex
  const cleanBg = (bg || "").toLowerCase();
  if (cleanBg === "#450a0a") return "faded-brick";
  if (cleanBg === "#14532d") return "forest";
  if (cleanBg === "#0f172a") return "deep-blue";
  if (cleanBg === "#0a0a0a") return "midnight-ink";
  if (cleanBg === "#262626") return "dusty-plum";
  if (cleanBg === "#57534e") return "terracotta";

  // Rotating default
  return ARCHIVAL_PALETTES[index % ARCHIVAL_PALETTES.length].id;
}

// Normalizes any raw Firebase document (REST API or SDK Snapshot)
export function normalizeFirestoreMessage(
  raw: RawFirestoreDoc,
  index: number = 0
): MessageData {
  // If raw object came from REST API (fields wrapper)
  if (raw.fields && typeof raw.fields === "object") {
    const f = raw.fields as Record<string, { stringValue?: string; timestampValue?: string }>;
    const msg = f.msg?.stringValue || "";
    const to = f.to?.stringValue || "";
    const bg = f.bg?.stringValue || "#0a0a0a";
    const docId = raw.id || raw.name?.split("/").pop() || `doc-${index}`;
    const emotion = f.emotion?.stringValue || inferEmotion({ bg, msg, to });
    const paletteId = f.palette?.stringValue || inferPaletteId(emotion, bg, index);

    return {
      id: docId,
      uid: f.uid?.stringValue,
      msg,
      to,
      bg,
      font: f.font?.stringValue || "font-serif",
      size: f.size?.stringValue || "size-medium",
      weight: f.weight?.stringValue || "weight-normal",
      leading: f.leading?.stringValue || "leading-normal",
      align: f.align?.stringValue || "align-center",
      border: f.border?.stringValue || "border-thin",
      padding: f.padding?.stringValue || "pad-balanced",
      radius: f.radius?.stringValue || "rad-round",
      width: f.width?.stringValue || "width-standard",
      toOpacity: f.toOpacity?.stringValue || "opacity-100",
      icon: f.icon?.stringValue || "show",
      footer: f.footer?.stringValue || "show",
      emotion,
      palette: paletteId,
      createdAt: parseTimestamp(f.createdAt?.timestampValue),
    };
  }

  // If raw object came from Firestore JS SDK (doc.data())
  const docId = raw.id || `doc-${index}`;
  const emotion = raw.emotion || inferEmotion({ bg: raw.bg, msg: raw.msg, to: raw.to });
  const paletteId = raw.palette || inferPaletteId(emotion, raw.bg, index);

  return {
    id: docId,
    uid: raw.uid,
    msg: raw.msg || "",
    to: raw.to || "",
    bg: raw.bg || "#0a0a0a",
    font: raw.font || "font-serif",
    size: raw.size || "size-medium",
    weight: raw.weight || "weight-normal",
    leading: raw.leading || "leading-normal",
    align: raw.align || "align-center",
    border: raw.border || "border-thin",
    padding: raw.padding || "pad-balanced",
    radius: raw.radius || "rad-round",
    width: raw.width || "width-standard",
    toOpacity: raw.toOpacity || "opacity-100",
    icon: raw.icon || "show",
    footer: raw.footer || "show",
    emotion,
    palette: paletteId,
    createdAt: parseTimestamp(raw.createdAt),
  };
}
