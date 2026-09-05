"use client";

import React, { useState, useMemo } from "react";
import {
  JournalCategory,
  JournalEntry,
  JOURNAL_CATEGORIES,
  getAllJournalEntries,
  getFeaturedJournalEntry,
  filterJournalEntries,
} from "@/data/journal";
import JournalCard from "@/components/JournalCard";
import { MessageData } from "@/components/MessageCard";

interface JournalIndexProps {
  onSelectArticle: (entry: JournalEntry) => void;
  archiveMessages?: MessageData[];
}

export default function JournalIndex({
  onSelectArticle,
  archiveMessages = [],
}: JournalIndexProps) {
  const allEntries = useMemo(() => getAllJournalEntries(), []);
  const featuredEntry = useMemo(() => getFeaturedJournalEntry(), []);

  const [selectedCategory, setSelectedCategory] = useState<JournalCategory | "all">("all");
  const [selectedDepth, setSelectedDepth] = useState<"all" | "brief" | "medium" | "deep">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter entries based on active controls
  const filteredEntries = useMemo(() => {
    return filterJournalEntries(allEntries, selectedCategory, selectedDepth, searchQuery);
  }, [allEntries, selectedCategory, selectedDepth, searchQuery]);

  // Non-featured entries for grid display
  const nonFeaturedEntries = useMemo(() => {
    if (selectedCategory !== "all" || selectedDepth !== "all" || searchQuery.trim()) {
      return filteredEntries;
    }
    return filteredEntries.filter((e) => e.id !== featuredEntry.id);
  }, [filteredEntries, selectedCategory, selectedDepth, searchQuery, featuredEntry.id]);

  return (
    <section className="view-section active max-w-6xl mx-auto py-8 sm:py-12 md:py-20 px-4 sm:px-6 md:px-8 space-y-10 sm:space-y-14 md:space-y-16">
      {/* =====================================================================
          1. PUBLICATION MASTHEAD & MANIFESTO
          ===================================================================== */}
      <header className="text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-[9px] sm:text-[9.5px] font-mono uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#8C827A] flex-wrap">
          <span>[ THE UNTOLD REPOSITORY ]</span>
          <span className="text-white/20">·</span>
          <span>VOL. II</span>
          <span className="text-white/20">·</span>
          <span className="text-[#C29B68]">{allEntries.length} Records</span>
        </div>

        <h1 className="font-serif italic text-3xl sm:text-5xl md:text-[4rem] text-[#EDE8E0] font-normal tracking-[-0.025em] leading-[1.1]">
          The Journal of Interior Life
        </h1>

        <p className="font-serif text-base sm:text-lg text-[#A8A196] leading-relaxed max-w-2xl mx-auto">
          Notes on memory, distance, silence, and the things that remain after we stop saying them. A curated cultural archive of unwritten correspondence and ordinary intimacy.
        </p>
      </header>

      {/* =====================================================================
          2. FILTER & SEARCH CONTROLS
          ===================================================================== */}
      <div className="space-y-6 border-t border-b border-white/[0.07] py-8">
        {/* Top: Search and Depth Toggles */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays, concepts, artifacts..."
              className="w-full bg-[#141312] border border-white/[0.08] rounded-full px-5 py-2.5 text-xs text-[#EDE8E0] placeholder-[#736B63] focus:outline-none focus:border-[#C29B68]/60 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#736B63] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reading Depth Selector */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto max-w-full pb-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#736B63] mr-2 hidden sm:inline">
              Reading Depth:
            </span>
            {(
              [
                { id: "all", label: "All Depths" },
                { id: "brief", label: "3 Min (Brief)" },
                { id: "medium", label: "5–8 Min (Standard)" },
                { id: "deep", label: "10+ Min (Deep)" },
              ] as const
            ).map((depth) => (
              <button
                key={depth.id}
                onClick={() => setSelectedDepth(depth.id)}
                className={`font-mono text-[9px] uppercase tracking-[0.16em] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedDepth === depth.id
                    ? "border-[#C29B68] text-[#EDE8E0] bg-[#C29B68]/10"
                    : "border-white/[0.07] text-[#8C827A] hover:border-white/[0.18] hover:text-[#EDE8E0]"
                }`}
              >
                {depth.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom: Series Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`font-mono text-[9.5px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === "all"
                ? "border-[#EDE8E0] text-[#EDE8E0] bg-white/[0.06] font-semibold"
                : "border-white/[0.08] text-[#8C827A] hover:border-white/[0.18] hover:text-[#EDE8E0]"
            }`}
          >
            All Series ({allEntries.length})
          </button>

          {JOURNAL_CATEGORIES.map((cat) => {
            const count = allEntries.filter((e) => e.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-mono text-[9.5px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "border-[#C29B68] text-[#EDE8E0] bg-[#C29B68]/15 font-semibold"
                    : "border-white/[0.08] text-[#8C827A] hover:border-white/[0.18] hover:text-[#EDE8E0]"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          3. FEATURED LEAD ARTICLE (Show when no specific filters active)
          ===================================================================== */}
      {selectedCategory === "all" && selectedDepth === "all" && !searchQuery.trim() && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.26em] text-[#8C827A]">
            <span>[ CURRENT LEAD ESSAY ]</span>
          </div>
          <JournalCard
            entry={featuredEntry}
            onSelect={onSelectArticle}
            variant="featured"
          />
        </section>
      )}

      {/* =====================================================================
          4. ARTICLE STREAM / ASYMMETRIC GRID
          ===================================================================== */}
      <section className="space-y-8">
        <div className="flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.22em] text-[#8C827A]">
          <span>
            {selectedCategory === "all"
              ? "All Publications in Archive"
              : JOURNAL_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </span>
          <span>{filteredEntries.length} Documented Works</span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.06] rounded-2xl bg-[#141312] p-8 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#736B63] block">
              [ NO MATCHING ENTRIES ]
            </span>
            <p className="font-serif italic text-lg text-[#A8A196]">
              No journal records match your current search filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDepth("all");
                setSearchQuery("");
              }}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C29B68] hover:text-[#EDE8E0] transition-colors pt-2 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonFeaturedEntries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onSelect={onSelectArticle}
                variant={
                  entry.sourceType === "RESEARCH NOTE"
                    ? "research"
                    : entry.sourceType === "COMMUNITY FIELD NOTE" ||
                      entry.category === "field-notes" ||
                      entry.category === "small-rituals"
                    ? "field-note"
                    : "standard"
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* =====================================================================
          5. FOOTNOTE & CUSTODIAN NOTE
          ===================================================================== */}
      <footer className="border-t border-white/[0.07] pt-12 text-center space-y-3">
        <p className="font-serif italic text-sm text-[#8C827A] max-w-xl mx-auto">
          "Every record in this publication is written from the conviction that what remains unsaid does not vanish; it merely seeks a more patient resting place."
        </p>
        <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#736B63]">
          THE JOURNAL OF INTERIOR LIFE · A COLLECTION OF UNSAID THINGS · MMXXVI
        </div>
      </footer>
    </section>
  );
}
