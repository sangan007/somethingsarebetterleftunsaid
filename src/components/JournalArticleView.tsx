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

  // Source Type badge styling
  const renderSourceTypeBadge = () => {
    switch (entry.sourceType) {
      case "RESEARCH NOTE":
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C29B68] bg-[#C29B68]/10 border border-[#C29B68]/30 px-3 py-1 rounded-full font-medium">
            [ Research Note · Peer-Reviewed Literature ]
          </span>
        );
      case "COMMUNITY FIELD NOTE":
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#A8A196] bg-white/[0.05] border border-white/[0.12] px-3 py-1 rounded-full font-medium">
            [ Community Field Note · Public Forum Observation ]
          </span>
        );
      case "ARCHIVAL NOTE":
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8C827A] bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full">
            [ Archival Note · Material Culture ]
          </span>
        );
      case "LITERARY NOTE":
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8C827A] bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full">
            [ Literary Note · Unsent Correspondence ]
          </span>
        );
      case "ORIGINAL EDITORIAL":
      default:
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8C827A] bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full">
            [ Original Editorial · Cultural Inquiry ]
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0C0B0A] text-[#EDE8E0] pb-24 pt-8 sm:pt-12">
      {/* Soft atmospheric radial ambient glow matching mineral palette */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: palette.dots[0] }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8">
        {/* Navigation / Return Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5 sm:pb-6 mb-8 sm:mb-12">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#8C827A] hover:text-[#EDE8E0] transition-colors cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Return to Journal Index</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C827A]">
            <PaletteDots dots={palette.dots} size="sm" />
            <span>{entry.readingTime}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-5 sm:space-y-6 pb-8 sm:pb-12 border-b border-white/[0.07]">
          {/* Series & Source Type Badging */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {renderSourceTypeBadge()}
            <span className="text-[9px] sm:text-[9.5px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#736B63]">
              {entry.entryNumber} · {entry.date}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-[3.25rem] text-[#EDE8E0] font-normal tracking-[-0.02em] leading-[1.2] sm:leading-[1.15] break-words">
            {entry.title}
          </h1>

          {/* Subtitle / Deck */}
          <p className="font-serif italic text-base sm:text-xl md:text-2xl text-[#A8A196] leading-relaxed max-w-2xl font-light">
            {entry.subtitle}
          </p>

          {/* Research Focus Metadata (if research note) */}
          {entry.researchFocus && entry.researchFocus.length > 0 && (
            <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#736B63] mr-1">
                Literature Discussed:
              </span>
              {entry.researchFocus.map((focus, i) => (
                <span
                  key={i}
                  className="font-mono text-[9px] tracking-wider text-[#A8A196] bg-[#141312] border border-white/[0.07] px-2.5 py-0.5 rounded"
                >
                  {focus}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Main Article Body */}
        <article className="pt-12 pb-14 max-w-2xl mx-auto space-y-7">
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

        {/* =====================================================================
            RESEARCH NOTE: DISTINCTION BETWEEN RESEARCH SAYS AND OUR READING
            ===================================================================== */}
        {entry.sourceType === "RESEARCH NOTE" && entry.researchFindings && (
          <section className="max-w-2xl mx-auto my-12 space-y-6">
            {/* Box 1: Empirical Findings (Research Says) */}
            <div className="rounded-xl border border-white/[0.08] bg-[#121110] p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#C29B68] font-semibold">
                  [ Empirical Observation ]
                </span>
                <span className="text-white/20 font-mono text-xs">/</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C827A]">
                  What the Research Found
                </span>
              </div>
              <p className="font-serif text-[15px] sm:text-base text-[#EDE8E0]/90 leading-relaxed font-light">
                {entry.researchFindings}
              </p>
            </div>

            {/* Box 2: Editorial Interpretation (Our Reading) */}
            {entry.editorialReading && (
              <div className="rounded-xl border border-white/[0.06] bg-[#141312]/80 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#A8A196] font-semibold">
                    [ Editorial Reading ]
                  </span>
                  <span className="text-white/20 font-mono text-xs">/</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#736B63]">
                    Archival Interpretation
                  </span>
                </div>
                <p className="font-serif italic text-[15px] sm:text-base text-[#A8A196] leading-relaxed">
                  {entry.editorialReading}
                </p>
              </div>
            )}
          </section>
        )}

        {/* =====================================================================
            COMMUNITY FIELD NOTE CONTEXT (e.g. Reddit r/Journaling)
            ===================================================================== */}
        {entry.sourceType === "COMMUNITY FIELD NOTE" && entry.communityContext && (
          <section className="max-w-2xl mx-auto my-12 rounded-xl border border-white/[0.08] bg-[#131211] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#A8A196] font-medium">
                [ Community Observation Context ]
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#736B63]">
                {entry.communityContext.platform}
              </span>
            </div>
            <p className="font-serif text-sm text-[#A8A196] leading-relaxed">
              {entry.communityContext.description}
            </p>
            <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-3 text-[9.5px] font-mono uppercase tracking-[0.2em]">
              <span className="text-[#736B63] text-[8.5px]">
                *Cultural observation of public rituals; not clinical evidence.
              </span>
              <a
                href={entry.communityContext.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C29B68] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Read Community Forum</span>
                <span>↗</span>
              </a>
            </div>
          </section>
        )}

        {/* =====================================================================
            BEAUTIFUL EDITORIAL SOURCES / REFERENCES SECTION
            ===================================================================== */}
        {entry.sources && entry.sources.length > 0 && (
          <section className="max-w-2xl mx-auto my-16 border-t border-white/[0.08] pt-10 space-y-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-[#8C827A]">
                [ Verified Primary Literature Cited ]
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#736B63]">
                {entry.sources.length} {entry.sources.length === 1 ? "Study" : "Studies"}
              </span>
            </div>

            <div className="space-y-6">
              {entry.sources.map((src, index) => {
                const sourceNumber = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={index}
                    className="group border-l border-white/[0.1] pl-5 sm:pl-6 py-1 space-y-2 transition-colors hover:border-[#C29B68]"
                  >
                    <div className="flex items-center gap-3 text-[9px] font-mono text-[#736B63] uppercase tracking-[0.2em]">
                      <span className="text-[#C29B68] font-semibold">{sourceNumber}</span>
                      <span>·</span>
                      <span>{src.year}</span>
                      {src.isOpenAccess && (
                        <>
                          <span>·</span>
                          <span className="text-[#8C827A]">[ Open Access ]</span>
                        </>
                      )}
                    </div>

                    <h4 className="font-serif text-base sm:text-lg text-[#EDE8E0] leading-snug font-normal">
                      {src.title}
                    </h4>

                    <div className="font-mono text-[11px] text-[#8C827A] leading-relaxed">
                      <span>{src.authors}</span>
                      <span className="mx-1.5 text-white/20">/</span>
                      <span className="italic text-[#A8A196]">{src.publication}</span>
                    </div>

                    {src.notes && (
                      <p className="font-serif italic text-xs text-[#736B63]">
                        {src.notes}
                      </p>
                    )}

                    {/* Verified Destination Action Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-[0.2em]">
                      {src.pmcId && (
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${src.pmcId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C29B68] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-1 border border-[#C29B68]/30 px-2.5 py-1 rounded"
                        >
                          <span>PMC Full Text ({src.pmcId})</span>
                          <span>↗</span>
                        </a>
                      )}

                      {src.pubmedId && (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${src.pubmedId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8C827A] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-1 border border-white/[0.08] px-2.5 py-1 rounded"
                        >
                          <span>PubMed ID: {src.pubmedId}</span>
                          <span>↗</span>
                        </a>
                      )}

                      {src.doi && (
                        <a
                          href={`https://doi.org/${src.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8C827A] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-1 border border-white/[0.08] px-2.5 py-1 rounded"
                        >
                          <span>DOI: {src.doi}</span>
                          <span>↗</span>
                        </a>
                      )}

                      {!src.pmcId && !src.pubmedId && !src.doi && src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C29B68] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-1 border border-white/[0.08] px-2.5 py-1 rounded"
                        >
                          <span>View Official Publication</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Editorial Disclaimer */}
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6B655B] pt-4 border-t border-white/[0.05] leading-relaxed">
              *Research literature is cited for educational, cultural, and archival inquiry. Interpretations belong to this publication and should not be construed as clinical or psychological advice.
            </p>
          </section>
        )}

        {/* =====================================================================
            FURTHER READING (2–4 curated legitimate resources)
            ===================================================================== */}
        {entry.furtherReading && entry.furtherReading.length > 0 && (
          <section className="max-w-2xl mx-auto my-12 border-t border-white/[0.06] pt-8 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8C827A] block">
              [ Further Reading & Scholarly Reviews ]
            </span>
            <div className="space-y-3">
              {entry.furtherReading.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/[0.05] bg-[#121110] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h5 className="font-serif text-sm text-[#EDE8E0] leading-snug">
                      {item.title}
                    </h5>
                    {item.authorsOrSource && (
                      <p className="font-mono text-[10px] text-[#736B63]">
                        {item.authorsOrSource}
                      </p>
                    )}
                    {item.description && (
                      <p className="font-serif italic text-xs text-[#8C827A]">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] uppercase tracking-wider text-[#C29B68] hover:text-[#EDE8E0] transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      Read Review ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================================
            AUTHENTIC VAULT VOICES (Real Firebase Archive Echoes)
            ===================================================================== */}
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
                  className="group cursor-pointer rounded-xl border border-white/[0.07] bg-[#141312] p-5 space-y-3 transition-all duration-250 hover:border-white/[0.18] hover:bg-[#181615] flex flex-col justify-between"
                >
                  <div className="space-y-2">
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
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[8.5px] font-mono uppercase tracking-widest text-[#736B63]">
                    <span className="text-[#A8A196]">{related.sourceType}</span>
                    <span className="group-hover:text-[#C29B68] transition-colors">Read →</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
