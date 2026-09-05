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
        <div className="text-center py-24 max-w-md mx-auto space-y-4 border border-[rgba(255,255,255,0.08)] bg-[#141312] p-8 rounded-sm">
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#D9828A] block">
            [ Connection Notice ]
          </span>
          <h3 className="font-serif text-2xl text-[#EDE8E0]">
            The Archive Could Not Be Reached
          </h3>
          <p className="font-sans text-xs text-[#8E877C] leading-relaxed">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 border border-[#EDE8E0] bg-[#EDE8E0] text-[#0C0B0A] rounded-full hover:bg-white transition-all cursor-pointer font-medium"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Loading Skeleton Placeholders */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 md:gap-10 lg:gap-11 pt-6">
          {/* Skeleton 1 */}
          <div className="animate-pulse flex flex-col justify-between rounded-[2px] p-6 sm:p-7 min-h-[210px] border border-[rgba(255,255,255,0.06)] bg-[#141312]">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.04] border border-white/[0.08]" />
              </div>
              <div className="h-2.5 w-14 rounded-xs bg-white/[0.06]" />
            </div>
            <div className="space-y-2.5 my-3">
              <div className="h-2 w-16 rounded-xs bg-white/[0.06]" />
              <div className="h-4 w-5/6 rounded-xs bg-white/[0.08]" />
              <div className="h-4 w-3/6 rounded-xs bg-white/[0.06]" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
              <div className="h-2 w-12 rounded-xs bg-white/[0.06]" />
              <div className="h-2 w-6 rounded-xs bg-white/[0.06]" />
            </div>
          </div>

          {/* Skeleton 2 */}
          <div className="md:col-span-2 animate-pulse flex flex-col justify-between rounded-[2px] p-7 sm:p-8 min-h-[250px] border border-[rgba(255,255,255,0.06)] bg-[#141312]">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.04]" />
                </div>
                <div className="h-2.5 w-24 rounded-xs bg-white/[0.06]" />
              </div>
              <div className="h-2.5 w-14 rounded-xs bg-white/[0.06]" />
            </div>
            <div className="space-y-3 my-4">
              <div className="h-2 w-20 rounded-xs bg-white/[0.06]" />
              <div className="h-6 w-11/12 rounded-xs bg-white/[0.08]" />
              <div className="h-6 w-4/6 rounded-xs bg-white/[0.06]" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
              <div className="h-2.5 w-20 rounded-xs bg-white/[0.06]" />
              <div className="h-2.5 w-28 rounded-xs bg-white/[0.06]" />
            </div>
          </div>

          {/* Skeleton 3 */}
          <div className="animate-pulse flex flex-col justify-between rounded-[2px] p-5 min-h-[160px] border border-[rgba(255,255,255,0.06)] bg-[#141312]">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
                <div className="w-2 h-2 rounded-full bg-white/[0.04]" />
              </div>
              <div className="h-2 w-12 rounded-xs bg-white/[0.06]" />
            </div>
            <div className="space-y-2 my-2">
              <div className="h-2 w-14 rounded-xs bg-white/[0.06]" />
              <div className="h-5 w-4/5 rounded-xs bg-white/[0.08]" />
            </div>
            <div className="h-2 w-12 rounded-xs bg-white/[0.06]" />
          </div>
        </div>
      )}

      {/* Active Editorial Archival Grid (Table of Preserved Fragments) */}
      {!loading && !error && pageMessages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 md:gap-10 lg:gap-11 pt-6 items-stretch">
          {pageMessages.map((msg, index) => {
            const originalIndex = messages.indexOf(msg);
            const cardIndex = originalIndex !== -1 ? originalIndex : startIndex + index;
            return (
              <MessageCard
                key={msg.id || (msg.createdAt?.seconds ? `${msg.createdAt.seconds}-${cardIndex}` : cardIndex)}
                data={msg}
                index={cardIndex}
                onClick={() => onCardClick(cardIndex)}
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

      {/* Filter Yielded 0 Results State */}
      {!loading && !error && messages.length > 0 && pageMessages.length === 0 && (
        <div className="text-center py-28 max-w-md mx-auto space-y-4">
          <p className="font-serif italic text-2xl text-[#EDE8E0]">
            No records matched your search.
          </p>
          <p className="font-sans text-xs text-[#8E877C] leading-relaxed font-light">
            Perhaps these words were never spoken under this specific sentiment.
          </p>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedResonance("ALL");
              setSelectedPaletteId(null);
              setCurrentPage(1);
            }}
            className="font-mono text-[10px] uppercase tracking-widest text-[#EDE8E0] underline underline-offset-4 hover:text-[#C29B68] cursor-pointer pt-2"
          >
            Clear All Filters
          </button>
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
