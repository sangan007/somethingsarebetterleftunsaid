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

export default function ArchiveFeed({
  messages,
  loading,
  error,
  onRetry,
  onCardClick,
  searchTerm,
  onSearchChange,
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

  const itemsPerPage = 12;

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
    <section id="view-archive" className="w-full max-w-[1180px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12 md:space-y-16">
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

          {/* Subtle skeleton structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 md:gap-10 lg:gap-11">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[2px] p-6 min-h-[200px] border border-[rgba(255,255,255,0.05)] bg-[#141312]/60 animate-pulse flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                    <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                    <div className="w-2 h-2 rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="h-2 w-16 bg-white/[0.06] rounded-xs" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-white/[0.06] rounded-xs" />
                  <div className="h-4 w-5/6 bg-white/[0.08] rounded-xs" />
                  <div className="h-4 w-3/5 bg-white/[0.06] rounded-xs" />
                </div>
                <div className="pt-2 border-t border-white/[0.04] flex justify-between">
                  <div className="h-2 w-14 bg-white/[0.05] rounded-xs" />
                  <div className="h-2 w-10 bg-white/[0.05] rounded-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Editorial Archival Grid (Table of Preserved Fragments) */}
      {!loading && !error && pageMessages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 md:gap-10 lg:gap-11 pt-6 items-stretch">
          {pageMessages.map((msg, index) => {
            const originalIndex = messages.indexOf(msg);
            const cardIndex = originalIndex !== -1 ? originalIndex : startIndex + index;
            const cardKey = msg.id || (msg.createdAt?.seconds ? `${msg.createdAt.seconds}-${cardIndex}` : `${cardIndex}`);
            const isExpanded = expandedCardKey === cardKey;

            return (
              <MessageCard
                key={cardKey}
                data={msg}
                index={cardIndex}
                isExpanded={isExpanded}
                onToggleExpand={() => handleToggleExpand(cardKey)}
                onOpenFullEntry={() => onCardClick(cardIndex)}
                staggerArrival={isInitialMount}
              />
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
    </section>
  );
}
