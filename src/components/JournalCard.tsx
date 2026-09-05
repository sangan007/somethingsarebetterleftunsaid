"use client";

import React from "react";
import { JournalEntry } from "@/data/journal";
import PaletteDots from "@/components/PaletteDots";
import { getPaletteById } from "@/lib/palettes";

interface JournalCardProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
  variant?: "standard" | "featured" | "compact" | "research" | "field-note";
}

export default function JournalCard({
  entry,
  onSelect,
  variant = "standard",
}: JournalCardProps) {
  const palette = getPaletteById(entry.palette);

  // =========================================================================
  // VARIANT: FEATURED (Wide, visually dominant story anchor)
  // =========================================================================
  if (variant === "featured") {
    return (
      <article
        onClick={() => onSelect(entry)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141312]/90 p-5 sm:p-8 md:p-12 transition-all duration-300 hover:border-white/[0.18] hover:bg-[#181615]"
        style={{
          boxShadow: "0 12px 35px -8px rgba(0,0,0,0.6)",
        }}
      >
        {/* Subtle ambient mineral underlay glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
          style={{ backgroundColor: palette.dots[0] }}
        />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-[9px] sm:text-[9.5px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#8C827A]">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-[#EDE8E0] font-semibold">{entry.sourceType}</span>
              <span className="text-white/20">·</span>
              <span>{entry.seriesName}</span>
              <span className="text-white/20">·</span>
              <span>{entry.entryNumber}</span>
              <span className="text-white/20">·</span>
              <span>{entry.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <PaletteDots dots={palette.dots} size="sm" />
              <span>{entry.readingTime}</span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2.5 sm:space-y-3">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#EDE8E0] font-normal tracking-[-0.02em] leading-[1.18] transition-colors duration-250 group-hover:text-white">
              {entry.title}
            </h2>
            <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#A8A196] leading-relaxed max-w-3xl">
              {entry.subtitle}
            </p>
          </div>

          {/* Excerpt */}
          <p className="font-serif text-sm sm:text-base text-[#8C827A] leading-[1.65] max-w-2xl line-clamp-3">
            {entry.excerpt}
          </p>

          {/* Read Action Bar */}
          <div className="pt-2 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C29B68] transition-colors group-hover:text-[#EDE8E0]">
            <span>Read Publication</span>
            <span className="transition-transform duration-250 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </article>
    );
  }

  // =========================================================================
  // VARIANT: RESEARCH NOTE (Index card with literature tags and empirical notes)
  // =========================================================================
  if (variant === "research" || entry.category === "research-notes") {
    return (
      <article
        onClick={() => onSelect(entry)}
        className="group relative cursor-pointer rounded-xl border border-white/[0.08] bg-[#121110] p-6 sm:p-7 transition-all duration-300 hover:border-white/[0.18] hover:bg-[#161514] flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em] text-[#8C827A]">
            <span className="text-[#C29B68] font-medium">[ Research Note ]</span>
            <span>{entry.entryNumber}</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl text-[#EDE8E0] leading-snug tracking-[-0.015em] transition-colors group-hover:text-[#C29B68]">
              {entry.title}
            </h3>
            <p className="font-serif text-xs sm:text-sm text-[#A8A196] line-clamp-2 leading-relaxed">
              {entry.subtitle}
            </p>
          </div>

          {/* Finding / Empirical Callout */}
          {entry.researchFindings && (
            <div className="rounded-lg border border-white/[0.05] bg-black/30 p-3 text-[11px] font-mono text-[#8C827A] leading-relaxed">
              <span className="text-[#EDE8E0] font-semibold block mb-1">EMPIRICAL SCOPE:</span>
              <span className="line-clamp-2">{entry.researchFindings}</span>
            </div>
          )}
        </div>

        <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[9.5px] font-mono text-[#736B63] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <PaletteDots dots={palette.dots} size="sm" />
            <span>{entry.readingTime}</span>
          </div>
          <span className="text-[#C29B68] group-hover:text-[#EDE8E0] transition-colors">
            Inspect Study & Reading →
          </span>
        </div>
      </article>
    );
  }

  // =========================================================================
  // VARIANT: FIELD NOTE (Tactile community or street-level observation)
  // =========================================================================
  if (variant === "field-note" || entry.category === "field-notes" || entry.category === "small-rituals") {
    return (
      <article
        onClick={() => onSelect(entry)}
        className="group relative cursor-pointer rounded-xl border border-white/[0.07] bg-[#141312]/80 p-5 sm:p-6 transition-all duration-300 hover:border-white/[0.16] hover:bg-[#181615] flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-[0.24em] text-[#736B63]">
            <span className="text-[#A8A196]">
              {entry.sourceType === "COMMUNITY FIELD NOTE" ? "[ Community Note ]" : `[ ${entry.seriesName} ]`}
            </span>
            <span>{entry.date}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl text-[#EDE8E0] leading-snug tracking-[-0.015em] transition-colors group-hover:text-[#C29B68]">
            {entry.title}
          </h3>

          <p className="font-serif italic text-xs sm:text-[13px] text-[#8C827A] line-clamp-3 leading-relaxed">
            "{entry.excerpt}"
          </p>

          {entry.communityContext && (
            <div className="text-[9px] font-mono text-[#736B63]">
              Observed in: <span className="text-[#A8A196]">{entry.communityContext.platform}</span>
            </div>
          )}
        </div>

        <div className="pt-4 mt-3 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-[#736B63] uppercase tracking-wider">
          <span>{entry.readingTime} read</span>
          <span className="text-[#C29B68] group-hover:text-[#EDE8E0] transition-colors">
            Open Note →
          </span>
        </div>
      </article>
    );
  }

  // =========================================================================
  // VARIANT: STANDARD (Editorial publication card)
  // =========================================================================
  return (
    <article
      onClick={() => onSelect(entry)}
      className="group relative cursor-pointer rounded-xl border border-white/[0.07] bg-[#141312]/70 p-6 sm:p-7 transition-all duration-300 hover:border-white/[0.18] hover:bg-[#181615] flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-[#8C827A]">
          <div className="flex items-center gap-2">
            <span className="text-[#EDE8E0] font-medium">{entry.sourceType}</span>
            <span className="text-white/20">·</span>
            <span>{entry.entryNumber}</span>
          </div>
          <span>{entry.readingTime}</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-xl sm:text-2xl text-[#EDE8E0] font-normal leading-[1.25] tracking-[-0.015em] transition-colors group-hover:text-[#C29B68]">
            {entry.title}
          </h3>
          <p className="font-serif italic text-xs sm:text-sm text-[#A8A196] line-clamp-2 leading-relaxed">
            {entry.subtitle}
          </p>
        </div>

        <p className="font-serif text-xs sm:text-[13px] text-[#736B63] line-clamp-3 leading-relaxed">
          {entry.excerpt}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[9.5px] font-mono text-[#8C827A] uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <PaletteDots dots={palette.dots} size="sm" />
          <span>{entry.date}</span>
        </div>
        <span className="text-[#C29B68] group-hover:text-[#EDE8E0] transition-colors">
          Read Essay →
        </span>
      </div>
    </article>
  );
}
