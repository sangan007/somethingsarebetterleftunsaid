import { MessageData } from "@/components/MessageCard";

/**
 * SAMPLE / EDITORIAL DEMO DATASET
 * 
 * Used strictly as an offline/development fallback when the live Firebase archive
 * is unreachable. Never overwrites, seeds, or alters real user submissions in production.
 * 
 * WRITING GUIDELINES:
 * - Simple, unfinished, awkward, honest words typed quickly at 1 AM.
 * - No literary metaphors or artificial poetry.
 * - 1–4 sentences mostly, varied emotions (humor, regret, relief, awkwardness, love).
 */
export const SAMPLE_ARCHIVE_RECORDS: MessageData[] = [
  {
    id: "sample-001",
    to: "My Bestie",
    msg: "I’m sorry. I pushed you away again. I don't know why I keep doing that. I just want you here.",
    emotion: "REGRET",
    palette: "deep-blue",
    createdAt: { seconds: 1724745600, nanoseconds: 0 },
  },
  {
    id: "sample-002",
    to: "Someone",
    msg: "I saw your name on my phone today and forgot for a second that we don't talk anymore.",
    emotion: "LONGING",
    palette: "dusty-plum",
    createdAt: { seconds: 1724659200, nanoseconds: 0 },
  },
  {
    id: "sample-003",
    to: "D.",
    msg: "Still haven't returned your hoodie. At this point it's basically mine.",
    emotion: "LOVE",
    palette: "dusty-rose",
    createdAt: { seconds: 1724572800, nanoseconds: 0 },
  },
  {
    id: "sample-004",
    to: "Dad",
    msg: "I finally bought the car you told me to get five years ago. You would've liked it.",
    emotion: "MEMORY",
    palette: "warm-parchment",
    createdAt: { seconds: 1724486400, nanoseconds: 0 },
  },
  {
    id: "sample-005",
    to: "The girl on the 8:15 train",
    msg: "I typed this like three times and deleted it. I just wanted to say you looked really pretty today.",
    emotion: "LOVE",
    palette: "dusty-rose",
    createdAt: { seconds: 1724400000, nanoseconds: 0 },
  },
  {
    id: "sample-006",
    to: "Alex",
    msg: "I’m still mad at you. I also still miss you. Annoying.",
    emotion: "ANGER",
    palette: "terracotta",
    createdAt: { seconds: 1724313600, nanoseconds: 0 },
  },
  {
    id: "sample-007",
    to: "Roommate from sophomore year",
    msg: "You were a really good friend to me when things were bad. I hope you know that.",
    emotion: "GRATITUDE",
    palette: "ochre",
    createdAt: { seconds: 1724227200, nanoseconds: 0 },
  },
  {
    id: "sample-008",
    to: "J.",
    msg: "Your birthday is next week. I won't text you, but I didn't forget.",
    emotion: "MEMORY",
    palette: "warm-parchment",
    createdAt: { seconds: 1724140800, nanoseconds: 0 },
  },
  {
    id: "sample-009",
    to: "Nobody",
    msg: "I don't even know what I want from you anymore.",
    emotion: "CONFUSION",
    palette: "slate-ash",
    createdAt: { seconds: 1724054400, nanoseconds: 0 },
  },
  {
    id: "sample-010",
    to: "K.",
    msg: "I deleted our chat yesterday. Kept the screenshots though. Idk why.",
    emotion: "REGRET",
    palette: "deep-blue",
    createdAt: { seconds: 1723968000, nanoseconds: 0 },
  },
  {
    id: "sample-011",
    to: "Mom",
    msg: "I should have called you back earlier. I'm sorry.",
    emotion: "REGRET",
    palette: "deep-blue",
    createdAt: { seconds: 1723881600, nanoseconds: 0 },
  },
  {
    id: "sample-012",
    to: "Sarah",
    msg: "I was going to tell you… never mind.",
    emotion: "UNSAID",
    palette: "sage",
    createdAt: { seconds: 1723795200, nanoseconds: 0 },
  },
];
