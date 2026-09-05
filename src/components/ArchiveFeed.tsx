"use client";

import React, { useState } from "react";
import MessageCard, { MessageData } from "./MessageCard";
import PaletteDots from "./PaletteDots";
import { ARCHIVAL_PALETTES, resolveMessagePalette } from "@/lib/palettes";

interface ArchiveFeedProps {
  messages: MessageData[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCardClick: (index: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenWrite?: () => void;
}

const PRIMARY_RESONANCE_FILTERS = [
  "ALL",
  "LOVE",
  "REGRET",
  "GRIEF",
  "HOPE",
  "LONGING",
  "GRATITUDE",
  "ANGER",
  "MEMORY",
  "OTHER",
] as const;

export interface EditorialLayoutConfig {
  layoutVariant: "featured" | "wide" | "standard" | "compact";
  layoutSpanClass: string;
  showSectionDividerBefore?: {
    label: string;
    sublabel: string;
    accentColor: string;
  };
}

// Deterministically assign 12-column grid spans and rhythmic layout variants
export function getEditorialLayout(
  indexInPage: number,
  totalInPage: number
): EditorialLayoutConfig {
  // Edge Case: 1 item on the page -> Centered Featured Record
  if (totalInPage === 1) {
    return {
      layoutVariant: "featured",
      layoutSpanClass: "col-span-12 md:col-span-6 md:col-start-1 lg:col-span-8 lg:col-start-3",
    };
  }

  // Edge Case: 2 items on the page -> Asymmetric Pair (7 + 5 = 12)
  if (totalInPage === 2) {
    if (indexInPage === 0) {
      return {
        layoutVariant: "wide",
        layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-7",
      };
    }
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-5",
    };
  }

  // Edge Case: 3 items on the page -> Balanced Archival Trio (4 + 4 + 4 = 12)
  if (totalInPage === 3) {
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-2 lg:col-span-4",
    };
  }

  // Edge Case: 4 items on the page -> Row 1 (8 + 4 = 12), Row 2 (6 + 6 = 12)
  if (totalInPage === 4) {
    if (indexInPage === 0) {
      return {
        layoutVariant: "featured",
        layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-8",
      };
    }
    if (indexInPage === 1) {
      return {
        layoutVariant: "standard",
        layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-4",
      };
    }
    return {
      layoutVariant: "wide",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-6",
    };
  }

  // General 13-Item Cadence:
  // Row 1: 8 + 4 = 12 (Items 0, 1) -> Opening Feature Anchor
  // Row 2: 4 + 4 + 4 = 12 (Items 2, 3, 4) -> Archival Trio
  // [Divider: SELECTION / 02 · CORRESPONDENCE]
  // Row 3: 5 + 7 = 12 (Items 5, 6) -> Asymmetric Duet (Compact + Wide)
  // Row 4: 3 + 3 + 3 + 3 = 12 (Items 7, 8, 9, 10) -> Micro Fragment Quad
  // [Divider: SELECTION / 03 · DISTANT WHISPERS]
  // Row 5: 4 + 8 = 12 (Items 11, 12) -> Inverted Feature Anchor
  const cycleIndex = indexInPage % 13;
  const remaining = totalInPage - indexInPage;

  // Row 1: The Accession Opening (8 + 4 = 12 cols)
  if (cycleIndex === 0) {
    return {
      layoutVariant: "featured",
      layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-8",
    };
  }
  if (cycleIndex === 1) {
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-4",
    };
  }

  // Row 2: The Archival Trio (4 + 4 + 4 = 12 cols)
  if (cycleIndex === 2 || cycleIndex === 3) {
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-4",
    };
  }
  if (cycleIndex === 4) {
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-4",
    };
  }

  // Row 3: The Asymmetric Duet (starts at item 5 with section divider)
  if (cycleIndex === 5) {
    if (remaining === 1) {
      return {
        layoutVariant: "wide",
        layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-12",
        showSectionDividerBefore: {
          label: "CORRESPONDENCE",
          sublabel: "",
          accentColor: "#C29B68",
        },
      };
    }
    return {
      layoutVariant: "compact",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-5",
      showSectionDividerBefore: {
        label: "CORRESPONDENCE",
        sublabel: "",
        accentColor: "#C29B68",
      },
    };
  }
  if (cycleIndex === 6) {
    return {
      layoutVariant: "wide",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-7",
    };
  }

  // Row 4: Micro Fragment Quad (Items 7, 8, 9, 10)
  if (cycleIndex >= 7 && cycleIndex <= 10) {
    if (remaining === 1) {
      return {
        layoutVariant: "wide",
        layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-12",
      };
    }
    if (remaining === 2) {
      return {
        layoutVariant: "standard",
        layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-6",
      };
    }
    if (remaining === 3) {
      return {
        layoutVariant: "standard",
        layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-4",
      };
    }
    return {
      layoutVariant: "compact",
      layoutSpanClass: "col-span-12 md:col-span-3 lg:col-span-3",
    };
  }

  // Row 5: The Inverted Anchor (Items 11, 12)
  if (cycleIndex === 11) {
    if (remaining === 1) {
      return {
        layoutVariant: "featured",
        layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-12",
        showSectionDividerBefore: {
          label: "DISTANT WHISPERS",
          sublabel: "",
          accentColor: "#7CA2CC",
        },
      };
    }
    return {
      layoutVariant: "standard",
      layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-4",
      showSectionDividerBefore: {
        label: "DISTANT WHISPERS",
        sublabel: "",
        accentColor: "#7CA2CC",
      },
    };
  }

  // cycleIndex === 12
  return {
    layoutVariant: "featured",
    layoutSpanClass: "col-span-12 md:col-span-6 lg:col-span-8",
  };
}

export default function ArchiveFeed({
  messages,
  loading,
  error,
  onRetry,
  onCardClick,
  searchTerm,
  onSearchChange,
  onOpenWrite,
}: ArchiveFeedProps) {
  const [selectedResonance, setSelectedResonance] = useState<string>("ALL");
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>(null);
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

  React.useEffect(() => {
    setIsInitialMount(false);
  }, []);

  const handleToggleExpand = (key: string) => {
    setExpandedCardKey((prev) => (prev === key ? null : key));
  };

  const itemsPerPage = 13;

  const term = searchTerm.toLowerCase().trim();

  // Filter messages by search, resonance, and palette
  const filteredMessages = messages.filter((m, index) => {
    // 1. Search filter
    const matchesSearch =
      !term ||
      (m.msg && m.msg.toLowerCase().includes(term)) ||
      (m.to && m.to.toLowerCase().includes(term)) ||
      (m.emotion && m.emotion.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // 2. Primary resonance filter
    const messageEmotion = (m.emotion || m.category || "").toUpperCase();
    if (selectedResonance !== "ALL") {
      if (selectedResonance === "OTHER") {
        const known = [
          "LOVE",
          "REGRET",
          "GRIEF",
          "HOPE",
          "LONGING",
          "GRATITUDE",
          "ANGER",
          "MEMORY",
        ];
        if (known.some((k) => messageEmotion.includes(k))) return false;
      } else if (!messageEmotion.includes(selectedResonance)) {
        return false;
      }
    }

    // 3. Palette filter
    if (selectedPaletteId) {
      const palette = resolveMessagePalette(m, index);
      if (palette.id !== selectedPaletteId) return false;
    }

    return true;
  });

  // Sort messages
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedMessages.length / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const pageMessages = sortedMessages.slice(startIndex, startIndex + itemsPerPage);

  const totalCountFormatted = messages.length.toLocaleString();

  return (
    <section id="view-archive" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-14 space-y-8 sm:space-y-10 md:space-y-12">
      {/* Archive Masthead & Accession Counter */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 sm:gap-4 border-b border-[rgba(255,255,255,0.07)] pb-5 sm:pb-7">
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="font-serif text-3xl sm:text-5xl md:text-[3.6rem] text-[#EDE8E0] font-normal tracking-[-0.02em] leading-[1.08]">
            The Archive
          </h2>
          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#8E877C] max-w-lg">
            Fragments, feelings, and words that never found their way out.
          </p>
        </div>

        <div className="font-mono text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#6B655B] self-start md:self-baseline">
          {loading ? "CALCULATING ARCHIVE..." : `${totalCountFormatted} PRESERVED RECORDS`}
        </div>
      </div>

      {/* Accession Search and Catalog Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Minimal Search Field */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#6B655B]">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            id="searchInput"
            placeholder="Search by recipient, feeling, or keyword..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white/[0.03] border border-[rgba(255,255,255,0.12)] focus:border-[#EDE8E0] pl-9 pr-9 py-2 text-xs font-sans text-[#EDE8E0] placeholder:text-[#6B655B] rounded-full outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange("");
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-3 flex items-center font-mono text-[10px] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quiet Chronological Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="bg-[#141312] border border-[rgba(255,255,255,0.12)] hover:border-[#EDE8E0] px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#EDE8E0] rounded-full outline-none cursor-pointer transition-colors"
            aria-label="Sort archive messages"
          >
            <option value="newest">Newest records</option>
            <option value="oldest">Earliest records</option>
          </select>
        </div>
      </div>

      {/* Editorial Index Controls */}
      <div className="space-y-6 pt-1">
        {/* Row 1: PRIMARY RESONANCE (Restrained Archival Index) */}
        <div className="space-y-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8E877C] block font-medium">
            PRIMARY RESONANCE
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {PRIMARY_RESONANCE_FILTERS.map((item) => {
              const isActive = selectedResonance === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedResonance(item);
                    setCurrentPage(1);
                  }}
                  className={`font-mono text-[9.5px] uppercase tracking-[0.16em] px-3 py-1 rounded-[2px] border transition-all cursor-pointer ${
                    isActive
                      ? "border-[#EDE8E0] bg-white/[0.08] text-[#EDE8E0] font-medium"
                      : "border-[rgba(255,255,255,0.1)] text-[#8E877C] hover:border-[rgba(255,255,255,0.25)] hover:text-[#EDE8E0] bg-transparent"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: ARCHIVAL PALETTES (Pure Color Groups Only) */}
        <div className="space-y-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8E877C] block font-medium">
            ARCHIVAL PALETTES
          </span>
          <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
            {selectedPaletteId && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPaletteId(null);
                  setCurrentPage(1);
                }}
                aria-label="Clear tone filter"
                className="font-mono text-[9px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.18)] bg-white/[0.06] text-[#EDE8E0] cursor-pointer transition-all hover:bg-white/[0.12]"
              >
                All Palettes ✕
              </button>
            )}

            {ARCHIVAL_PALETTES.map((palette) => {
              const isActive = selectedPaletteId === palette.id;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    setSelectedPaletteId(isActive ? null : palette.id);
                    setCurrentPage(1);
                  }}
                  aria-label={`Filter by ${palette.name}`}
                  aria-pressed={isActive}
                  className={`inline-flex items-center justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-[var(--card-accent)] ring-1 ring-[var(--card-accent)] scale-105 shadow-lg shadow-black/80"
                      : "border-[rgba(255,255,255,0.12)] hover:border-white/30 hover:scale-102"
                  }`}
                  style={{
                    backgroundColor: palette.surface,
                  }}
                >
                  <PaletteDots dots={palette.dots} size="md" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4 border border-white/[0.08] bg-[#141312] p-8 rounded-[2px]">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C29B68] block">
            [ ARCHIVAL NOTICE ]
          </span>
          <h3 className="font-serif text-2xl text-[#EDE8E0]">
            ARCHIVE TEMPORARILY UNAVAILABLE
          </h3>
          <p className="font-serif italic text-xs text-[#8E877C] leading-relaxed">
            The records could not be retrieved from custody at this moment.
          </p>
          <div className="pt-2">
            <button
              onClick={onRetry || (() => window.location.reload())}
              className="press-tactile font-mono text-[9.5px] uppercase tracking-[0.2em] px-5 py-2.5 border border-white/[0.2] hover:border-white/50 text-[#EDE8E0] bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-all cursor-pointer"
            >
              TRY AGAIN →
            </button>
          </div>
        </div>
      )}

      {/* Loading State: Quiet Archival Loading */}
      {loading && (
        <div className="space-y-8 pt-4">
          <div className="flex flex-col items-center justify-center py-12 space-y-3.5 text-center">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-[#8C827A] animate-pulse">
              ACCESSING ARCHIVE
            </span>
            <div className="w-20 h-[1px] bg-white/[0.1] overflow-hidden relative">
              <div className="absolute inset-0 bg-[#C29B68]/60 w-1/2 animate-pulse" />
            </div>
            <p className="font-serif italic text-xs text-[#736B63]">
              Retrieving records from the quiet repository...
            </p>
          </div>

          {/* Subtle skeleton structure mirroring the 12-column editorial grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7">
            {/* Opening Featured Skeleton (8 cols) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-8 rounded-[2px] p-6 sm:p-8 min-h-[260px] border border-[rgba(255,255,255,0.05)] bg-[#141312]/60 animate-pulse flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                  <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                  <div className="w-2 h-2 rounded-full bg-white/[0.04]" />
                </div>
                <div className="h-2 w-16 bg-white/[0.06] rounded-xs" />
              </div>
              <div className="space-y-2.5">
                <div className="h-2.5 w-24 bg-white/[0.06] rounded-xs" />
                <div className="h-6 w-4/5 bg-white/[0.08] rounded-xs" />
                <div className="h-6 w-3/5 bg-white/[0.06] rounded-xs" />
              </div>
              <div className="pt-2 border-t border-white/[0.04] flex justify-between">
                <div className="h-2 w-16 bg-white/[0.05] rounded-xs" />
                <div className="h-2 w-12 bg-white/[0.05] rounded-xs" />
              </div>
            </div>

            {/* Companion Standard Skeleton (4 cols) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2px] p-6 min-h-[200px] border border-[rgba(255,255,255,0.05)] bg-[#141312]/60 animate-pulse flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                  <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                </div>
                <div className="h-2 w-14 bg-white/[0.06] rounded-xs" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-16 bg-white/[0.06] rounded-xs" />
                <div className="h-4 w-5/6 bg-white/[0.08] rounded-xs" />
              </div>
              <div className="pt-2 border-t border-white/[0.04] flex justify-between">
                <div className="h-2 w-12 bg-white/[0.05] rounded-xs" />
                <div className="h-2 w-10 bg-white/[0.05] rounded-xs" />
              </div>
            </div>

            {/* Archival Trio Skeletons (4 + 4 + 4 = 12 cols) */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="col-span-12 md:col-span-3 lg:col-span-4 rounded-[2px] p-6 min-h-[190px] border border-[rgba(255,255,255,0.05)] bg-[#141312]/60 animate-pulse flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                    <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                  </div>
                  <div className="h-2 w-14 bg-white/[0.06] rounded-xs" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-white/[0.06] rounded-xs" />
                  <div className="h-4 w-5/6 bg-white/[0.08] rounded-xs" />
                </div>
                <div className="pt-2 border-t border-white/[0.04] flex justify-between">
                  <div className="h-2 w-12 bg-white/[0.05] rounded-xs" />
                  <div className="h-2 w-10 bg-white/[0.05] rounded-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Editorial Archival Grid (Curated 12-Column Archive Wall) */}
      {!loading && !error && pageMessages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 pt-4 items-start">
          {pageMessages.map((msg, index) => {
            const originalIndex = messages.indexOf(msg);
            const cardIndex = originalIndex !== -1 ? originalIndex : startIndex + index;
            const cardKey = msg.id || (msg.createdAt?.seconds ? `${msg.createdAt.seconds}-${cardIndex}` : `${cardIndex}`);
            const isExpanded = expandedCardKey === cardKey;
            const layoutConfig = getEditorialLayout(index, pageMessages.length);

            return (
              <React.Fragment key={cardKey}>
                {layoutConfig.showSectionDividerBefore && (
                  <div className="col-span-12 flex items-center justify-between pt-6 pb-2 border-b border-white/[0.07] my-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: layoutConfig.showSectionDividerBefore.accentColor }}
                      />
                      <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8E877C]">
                        {layoutConfig.showSectionDividerBefore.label}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6B655B] hidden sm:inline">
                      {layoutConfig.showSectionDividerBefore.sublabel}
                    </span>
                  </div>
                )}

                <MessageCard
                  key={cardKey}
                  data={msg}
                  index={cardIndex}
                  isExpanded={isExpanded}
                  layoutVariant={layoutConfig.layoutVariant}
                  layoutSpanClass={layoutConfig.layoutSpanClass}
                  onToggleExpand={() => handleToggleExpand(cardKey)}
                  onOpenFullEntry={() => onCardClick(cardIndex)}
                  staggerArrival={isInitialMount}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Empty Database State */}
      {!loading && !error && messages.length === 0 && (
        <div className="text-center py-28 max-w-md mx-auto space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#6B655B] block">
            [ Archival Notice ]
          </span>
          <h3 className="font-serif text-3xl text-[#EDE8E0]">
            The Archive Is Quiet
          </h3>
          <p className="font-sans text-xs text-[#8E877C] leading-relaxed font-light">
            No unsaid things have been found. Be the first person to leave unspoken words in this room.
          </p>
        </div>
      )}

      {/* Filter / Search Yielded 0 Results State */}
      {!loading && !error && messages.length > 0 && pageMessages.length === 0 && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#736B63] block">
            [ ARCHIVAL INVENTORY ]
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#EDE8E0] tracking-[-0.015em]">
            NO RECORDS FOUND
          </h3>
          <p className="font-serif italic text-sm text-[#A8A196] leading-relaxed">
            Nothing in the archive matches this search. Try another word, another memory, or simply leave the field empty.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onSearchChange("");
                setSelectedResonance("ALL");
                setSelectedPaletteId(null);
                setCurrentPage(1);
              }}
              className="press-tactile font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#C29B68] hover:text-[#EDE8E0] border border-white/[0.12] hover:border-white/[0.25] px-4 py-2 rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>RESET FILTERS</span>
              <span>↺</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] pt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B655B]">
          <button
            onClick={() => {
              if (effectivePage > 1) {
                setCurrentPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={effectivePage <= 1}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              effectivePage > 1 ? "hover:text-[#EDE8E0]" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <span>←</span>
            <span>PREVIOUS</span>
          </button>

          <span className="text-[#EDE8E0] font-semibold">
            PAGE {effectivePage} OF {totalPages.toLocaleString()}
          </span>

          <button
            onClick={() => {
              if (effectivePage < totalPages) {
                setCurrentPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={effectivePage >= totalPages}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              effectivePage < totalPages ? "hover:text-[#EDE8E0]" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <span>NEXT</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Content CTA: + LEAVE SOMETHING UNSAID (Natural Editorial Invitation) */}
      {!loading && !error && onOpenWrite && (
        <div className="pt-14 sm:pt-16 pb-4 sm:pb-6 text-center flex flex-col items-center justify-center space-y-3.5 border-t border-[rgba(255,255,255,0.07)] mt-12 sm:mt-16">
          <p className="font-serif italic text-xs sm:text-sm text-[#8E877C] max-w-sm px-4 leading-relaxed">
            After looking through what other people left behind, you are invited to leave something of your own.
          </p>

          <button
            type="button"
            onClick={onOpenWrite}
            id="archiveContentCta"
            aria-label="Leave something unsaid in the archive"
            className="group font-mono text-[9px] xs:text-[9.5px] sm:text-[10px] uppercase tracking-[0.18em] xs:tracking-[0.2em] text-[#EDE8E0] hover:text-white border border-white/[0.14] hover:border-[#C29B68]/70 active:border-[#C29B68] bg-white/[0.02] hover:bg-[#C29B68]/[0.06] active:bg-[#C29B68]/[0.12] px-6 xs:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer inline-flex items-center justify-center gap-2 select-none min-h-[44px] max-w-[90vw] active:scale-[0.98]"
          >
            <span className="text-[#C29B68] font-medium transition-transform duration-300 group-hover:rotate-45">+</span>
            <span>LEAVE SOMETHING UNSAID</span>
          </button>
        </div>
      )}
    </section>
  );
}
