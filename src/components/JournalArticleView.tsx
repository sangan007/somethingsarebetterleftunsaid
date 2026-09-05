"use client";

import React, { useEffect } from "react";
import { JournalEntry, getRelatedJournalEntries } from "@/data/journal";
import PaletteDots from "@/components/PaletteDots";
import { getPaletteById } from "@/lib/palettes";
import { MessageData } from "@/components/MessageCard";

interface JournalArticleViewProps {
  entry: JournalEntry;
  onBack: () => void;
  onSelectRelated: (relatedEntry: JournalEntry) => void;
  archiveMessages?: MessageData[];
}

export default function JournalArticleView({
  entry,
  onBack,
  onSelectRelated,
  archiveMessages = [],
}: JournalArticleViewProps) {
  const palette = getPaletteById(entry.palette);
  const relatedEntries = getRelatedJournalEntries(entry, 3);

  // Filter 1 or 2 real matching archive messages by emotion tag if present
  const matchingArchiveMessages = archiveMessages
    .filter((m) => {
      if (!entry.archiveEmotionFilter) return true;
      return m.emotion?.toUpperCase() === entry.archiveEmotionFilter.toUpperCase();
    })
    .slice(0, 2);

  // Handle Escape key to return to index
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  // Scroll to top upon entry
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [entry.slug]);

  return (
    <div className="relative min-h-screen bg-[#0C0B0A] text-[#EDE8E0] pb-24 pt-8 sm:pt-12">
      {/* Soft atmospheric radial ambient glow matching mineral palette */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: palette.dots[0] }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">
        {/* Navigation / Return Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-6 mb-12">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#8C827A] hover:text-[#EDE8E0] transition-colors cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Return to Journal Index</span>
          </button>

          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C827A]">
            <PaletteDots dots={palette.dots} size="sm" />
            <span>{entry.readingTime}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-white/[0.07]">
          {/* Series & Entry Number */}
          <div className="flex flex-wrap items-center gap-3 text-[9.5px] font-mono uppercase tracking-[0.26em] text-[#8C827A]">
            <span className="text-[#EDE8E0] font-semibold">{entry.seriesName}</span>
            <span className="text-white/20">/</span>
            <span>{entry.entryNumber}</span>
            <span className="text-white/20">/</span>
            <span>{entry.date}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[3.25rem] text-[#EDE8E0] font-normal tracking-[-0.02em] leading-[1.15]">
            {entry.title}
          </h1>

          {/* Subtitle / Deck */}
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#A8A196] leading-relaxed max-w-2xl font-light">
            {entry.subtitle}
          </p>
        </header>

        {/* Article Body */}
        <article className="pt-12 pb-16 max-w-2xl mx-auto space-y-7">
          {entry.paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              <p className="font-serif text-[17px] sm:text-[19px] text-[#EDE8E0]/90 leading-[1.8] font-normal tracking-[-0.005em]">
                {index === 0 ? (
                  <span className="first-letter:float-left first-letter:text-4xl first-letter:sm:text-5xl first-letter:font-serif first-letter:mr-2.5 first-letter:text-[#C29B68] first-letter:leading-none">
                    {paragraph}
                  </span>
                ) : (
                  paragraph
                )}
              </p>

              {/* Mid-article Pull Quote (placed after second paragraph if available) */}
              {index === 1 && entry.pullQuote && (
                <figure className="my-10 border-l-2 border-[#C29B68]/60 pl-6 sm:pl-8 py-3 space-y-2">
                  <blockquote className="font-serif italic text-xl sm:text-2xl text-[#EDE8E0] leading-snug">
                    "{entry.pullQuote.text}"
                  </blockquote>
                  {entry.pullQuote.attribution && (
                    <figcaption className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C827A]">
                      — {entry.pullQuote.attribution}
                    </figcaption>
                  )}
                </figure>
              )}
            </React.Fragment>
          ))}
        </article>

        {/* Research Context & Formal Citations (if present) */}
        {entry.researchContext && (
          <section className="max-w-2xl mx-auto my-12 rounded-xl border border-white/[0.08] bg-[#121110] p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#C29B68] block font-medium">
                [ Research Findings & Literature ]
              </span>
              <h3 className="font-serif text-xl text-[#EDE8E0]">
                Methodological Context
              </h3>
              <p className="font-serif text-sm text-[#A8A196] leading-relaxed">
                {entry.researchContext.finding}
              </p>
            </div>

            {/* Source Citations */}
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#736B63] block">
                Primary Literature Cited:
              </span>
              <ul className="space-y-2.5 font-mono text-[11px] text-[#8C827A]">
                {entry.researchContext.sources.map((src, i) => (
                  <li key={i} className="leading-relaxed border-l border-white/[0.1] pl-3">
                    <span className="text-[#EDE8E0] font-medium">{src.title}</span> ({src.year}).{" "}
                    <span className="text-[#736B63]">{src.authors}. </span>
                    {src.publication && (
                      <span className="italic text-[#8C827A]">{src.publication}.</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Authentic Vault Voices (Connecting Journal to Real Firebase Archive) */}
        {matchingArchiveMessages.length > 0 && (
          <section className="max-w-2xl mx-auto my-16 border-t border-b border-white/[0.07] py-10 space-y-6">
            <div className="flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.24em] text-[#8C827A]">
              <span>[ Echoes from the Vault ]</span>
              <span>Authentic Confessions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchingArchiveMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl border border-white/[0.07] bg-[#141312] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-wider text-[#736B63]">
                    <span>To: {msg.to || "Someone"}</span>
                    <span>{msg.emotion || "UNSAID"}</span>
                  </div>
                  <p className="font-serif italic text-sm text-[#EDE8E0] leading-relaxed line-clamp-4">
                    "{msg.msg}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Article Footer & Tags */}
        <div className="max-w-2xl mx-auto pt-6 pb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07]">
          <div className="flex flex-wrap items-center gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8C827A] rounded-full border border-white/[0.08] px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={onBack}
            className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#C29B68] hover:text-[#EDE8E0] transition-colors cursor-pointer"
          >
            ← Back to Index
          </button>
        </div>

        {/* You May Also Want to Read (Curated Related Pieces) */}
        {relatedEntries.length > 0 && (
          <section className="max-w-3xl mx-auto pt-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8C827A] block">
                [ Related Observations ]
              </span>
              <h3 className="font-serif text-2xl text-[#EDE8E0]">
                You May Also Want to Read
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedEntries.map((related) => (
                <article
                  key={related.id}
                  onClick={() => onSelectRelated(related)}
                  className="group cursor-pointer rounded-xl border border-white/[0.07] bg-[#141312] p-5 space-y-3 transition-all duration-250 hover:border-white/[0.18] hover:bg-[#181615]"
                >
                  <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-wider text-[#736B63]">
                    <span>{related.seriesName}</span>
                    <span>{related.readingTime}</span>
                  </div>
                  <h4 className="font-serif text-base text-[#EDE8E0] leading-snug group-hover:text-[#C29B68] transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="font-serif text-xs text-[#8C827A] line-clamp-2 leading-relaxed">
                    {related.subtitle}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
