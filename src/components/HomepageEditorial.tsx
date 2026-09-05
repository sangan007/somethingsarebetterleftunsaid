"use client";

import React from "react";
import PaletteDots from "./PaletteDots";
import { MessageData } from "./MessageCard";
import {
  ARCHIVAL_PALETTES,
  resolveMessagePalette,
  PaletteDefinition,
} from "@/lib/palettes";

interface HomepageEditorialProps {
  messages: MessageData[];
  loading: boolean;
  onOpenReader: (index: number) => void;
  onViewChange: (view: string) => void;
  onOpenWrite: () => void;
}

export default function HomepageEditorial({
  messages,
  loading,
  onOpenReader,
  onViewChange,
  onOpenWrite,
}: HomepageEditorialProps) {
  // Format the real Firebase archive count (e.g. "00,057")
  const formattedCount = loading
    ? "·····"
    : String(messages.length).padStart(5, "0");

  // Select 4 real messages for the editorial composition
  const leadMessage = messages[0];
  const offsetMessage1 = messages[1];
  const offsetMessage2 = messages[2];
  const ledgerMessage = messages[3];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-28 sm:space-y-36 md:space-y-44">
      {/* ====================================================================
          SECTION 1 — MASTHEAD / ENTRY (Nocturnal Editorial Atmosphere)
          ==================================================================== */}
      <section className="pt-2 sm:pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column (7 cols): Publication Masthead */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C29B68]" />
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.28em] text-[#8E877C] font-medium">
                [ An Ongoing Nocturnal Archive ]
              </span>
            </div>

            <h1 className="font-masthead text-[34px] xs:text-[42px] sm:text-[68px] md:text-[80px] lg:text-[94px] leading-[0.96] sm:leading-[0.93] tracking-[-0.03em] text-[#EDE8E0] font-normal uppercase break-words">
              A Collection<br />
              of Unsaid<br />
              <span className="italic font-normal lowercase tracking-[-0.02em] text-[#D8D2C7]">things</span>
            </h1>

            <div className="pt-2 flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[9.5px] font-mono tracking-[0.18em] sm:tracking-[0.22em] text-[#7A746B] uppercase flex-wrap">
              <span>Catalog MMXXIV</span>
              <span>—</span>
              <span>Preserved in Solitude</span>
            </div>
          </div>

          {/* Right Column (5 cols): Intimate Curator Statement */}
          <div className="lg:col-span-5 lg:pt-16 space-y-8">
            <div className="border-t border-[rgba(255,255,255,0.1)] pt-7 space-y-5">
              <p className="font-serif text-[18px] sm:text-[21px] md:text-[22px] text-[#C2BCB3] leading-[1.5] font-normal">
                There are things we never say. Not because they weren&apos;t important,
                but because saying them would have changed everything.
              </p>
              <p className="font-serif text-[14px] sm:text-[16px] text-[#7E786E] leading-[1.62]">
                This room is a resting place for words that were held back in throats,
                confessions left in coats, and apologies that arrived too late—preserved
                here in darkness, without names, accounts, or judgment.
              </p>
            </div>

            {/* Understated Editorial Actions */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button
                onClick={() => onViewChange("archive")}
                className="group font-mono text-[9.5px] uppercase tracking-[0.2em] px-6 py-3 bg-[#EDE8E0] text-[#0C0B0A] hover:bg-[#FAF7F2] transition-all rounded-full cursor-pointer shadow-lg inline-flex items-center justify-center gap-2 font-medium min-h-[44px]"
              >
                <span>Enter The Archive</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                onClick={onOpenWrite}
                className="font-mono text-[9.5px] uppercase tracking-[0.2em] px-6 py-3 border border-[rgba(255,255,255,0.18)] hover:border-[#EDE8E0] hover:bg-white/[0.04] text-[#EDE8E0] transition-all rounded-full cursor-pointer text-center min-h-[44px]"
              >
                Leave Something Unsaid
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />

      {/* ====================================================================
          SECTION 2 & 3 — THE ARCHIVE IS ALREADY HERE / FEATURED FRAGMENTS
          ==================================================================== */}
      <section className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[rgba(255,255,255,0.07)] pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E877C]">
              [ 01 / From The Nocturnal Archive ]
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6B655B]">
            Recent Accessions · Preserved In Darkness
          </span>
        </div>

        {/* Real Firebase Messages Container */}
        {loading && messages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E877C]">
              Retrieving Catalog Records From Vault···
            </span>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {/* Fragment A: The Lead Archival Specimen (Luminous in the Dark) */}
            {leadMessage && (
              <LeadArchivalFragment
                message={leadMessage}
                index={0}
                onClick={() => onOpenReader(0)}
              />
            )}

            {/* Asymmetrical Spacing Divider */}
            <div className="w-24 h-px bg-[rgba(255,255,255,0.12)] mx-auto" />

            {/* Fragment B & C: Offset Editorial Pair (Asymmetrical Stagger) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Left-Offset Fragment */}
              {offsetMessage1 && (
                <div className="md:col-span-6 lg:col-span-5 md:mr-auto w-full">
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#8E877C] mb-3">
                    [ Specimen NO. 0002 ]
                  </div>
                  <EditorialSlip
                    message={offsetMessage1}
                    index={1}
                    onClick={() => onOpenReader(1)}
                  />
                </div>
              )}

              {/* Right-Offset Fragment (Deliberately dropped lower for rhythm) */}
              {offsetMessage2 && (
                <div className="md:col-span-6 lg:col-span-6 lg:col-start-7 md:mt-16 w-full">
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#8E877C] mb-3 text-right">
                    [ Specimen NO. 0003 ]
                  </div>
                  <EditorialSlip
                    message={offsetMessage2}
                    index={2}
                    onClick={() => onOpenReader(2)}
                  />
                </div>
              )}
            </div>

            {/* Fragment D: Wide Horizontal Archival Ledger Band */}
            {ledgerMessage && (
              <div className="pt-6">
                <HorizontalLedgerFragment
                  message={ledgerMessage}
                  index={3}
                  onClick={() => onOpenReader(3)}
                />
              </div>
            )}
          </div>
        )}

        {/* Subtle Link Into the Archive */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => onViewChange("archive")}
            className="group font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#8E877C] hover:text-[#EDE8E0] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>View All {messages.length > 0 ? messages.length : ""} Deposited Records</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />

      {/* ====================================================================
          SECTION 4 — COLOR / PALETTE MOMENT (Pure Color Groups Only)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[rgba(255,255,255,0.07)] pb-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E877C]">
            [ 02 / Archival Palettes ]
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6B655B]">
            A Spectrum of Unuttered Feelings
          </span>
        </div>

        <p className="font-serif text-[16px] sm:text-[17px] text-[#9E968A] max-w-2xl leading-[1.6]">
          Every silence holds a color. Our catalog preserves words across ten dedicated
          pigment families—ranging from the warmth of long-held memory to the deep indigo
          of words buried in the dark.
        </p>

        {/* Sequence of Pure Color Swatches (Dots Only, Pure Visual Language) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
          {ARCHIVAL_PALETTES.map((palette, idx) => (
            <div
              key={palette.id}
              className="group p-4 sm:p-5 rounded-[2px] border transition-all duration-300 hover:-translate-y-1 cursor-default flex flex-col justify-between h-28"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.border,
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[8px] uppercase tracking-[0.18em] opacity-50"
                  style={{ color: palette.muted }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: palette.dots[2] }}
                  aria-hidden="true"
                />
              </div>

              {/* The Visual Signature: 4 Coordinated Dots */}
              <div className="my-auto py-1">
                <PaletteDots dots={palette.dots} size="md" />
              </div>

              <div
                className="font-mono text-[8.5px] uppercase tracking-[0.22em] font-medium"
                style={{ color: palette.accent }}
              >
                {palette.defaultEmotion}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />

      {/* ====================================================================
          SECTION 5 — THE HUMAN / CREATOR (A Note From The Builder)
          ==================================================================== */}
      <section className="space-y-8">
        <div className="border-b border-[rgba(255,255,255,0.07)] pb-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E877C]">
            [ 03 / Custodian&apos;s Record ]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-masthead text-3xl sm:text-4xl text-[#EDE8E0] font-normal leading-[1.18] tracking-[-0.02em]">
              A note from the person who built this room.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#A8A196] font-serif text-[17px] sm:text-[19px] leading-[1.65]">
            <p>
              Every archive begins because someone wanted to prevent something fragile
              from disappearing. I built this room as a quiet shelter for sentences that
              were too heavy to carry, too dangerous to deliver, or that simply arrived
              too late.
            </p>
            <p>
              There are no algorithms here, no follower counts, and no vanity metrics.
              Submissions are permanently decoupled from your identity. It is simply a
              place to set your burden down on digital paper and walk away unburdened.
            </p>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#EDE8E0] font-medium">
                — The Custodian
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7E786E]">
                A Collection of Unsaid Things
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />

      {/* ====================================================================
          SECTION 6 — THE ARCHIVE COUNT (Real Firebase Metric)
          ==================================================================== */}
      <section className="py-4">
        <div className="border border-[rgba(255,255,255,0.08)] bg-[#131211] p-8 sm:p-12 md:p-14 rounded-[2px] space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.07)] pb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#8E877C]">
              [ Archive Ledger Status ]
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6B655B]">
              Real-Time Repository Count
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
            <div className="md:col-span-6 space-y-2">
              <div className="font-mono text-5xl sm:text-6xl md:text-7xl tracking-[-0.04em] text-[#EDE8E0] font-normal">
                {formattedCount}
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#8E877C]">
                Unsaid Things Preserved in Vault
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-6 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.08)] pt-6 md:pt-0 md:pl-8">
              <div className="space-y-1">
                <div className="font-mono text-2xl sm:text-3xl text-[#EDE8E0]">10</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E786E]">
                  Archival Palettes
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-2xl sm:text-3xl text-[#EDE8E0]">∞</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7E786E]">
                  Feelings Preserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7 — FINAL INVITATION (Quiet Nocturnal Closing)
          ==================================================================== */}
      <section className="text-center py-12 sm:py-20 space-y-8 max-w-2xl mx-auto">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#8E877C] block font-medium">
          [ 04 / An Invitation ]
        </span>

        <h3 className="font-masthead text-3xl sm:text-4xl md:text-[2.75rem] text-[#EDE8E0] font-normal leading-[1.18] tracking-[-0.025em]">
          Some things don&apos;t need to be sent to be real.
        </h3>

        <p className="font-serif text-[16px] sm:text-[18px] text-[#8E877C] leading-[1.6] max-w-lg mx-auto">
          Your words will be given a permanent, anonymous resting place in the archive.
          Nothing is delivered. Nothing is judged.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenWrite}
            className="w-full sm:w-auto font-mono text-[10px] uppercase tracking-[0.22em] px-8 py-3.5 bg-[#EDE8E0] text-[#0C0B0A] hover:bg-[#FAF7F2] transition-all rounded-full cursor-pointer shadow-lg font-medium"
          >
            Leave Something Unsaid
          </button>

          <button
            onClick={() => onViewChange("archive")}
            className="w-full sm:w-auto font-mono text-[9.5px] uppercase tracking-[0.2em] px-6 py-3 text-[#8E877C] hover:text-[#EDE8E0] transition-colors cursor-pointer"
          >
            Explore Complete Archive →
          </button>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// BESPOKE EDITORIAL FRAGMENT COMPONENTS (Full Multi-Color Palette Fidelity)
// ============================================================================

interface FragmentProps {
  message: MessageData;
  index: number;
  onClick: () => void;
}

/**
 * 1. The Lead Archival Fragment: Stately, high-contrast, glowing in the darkness
 */
function LeadArchivalFragment({ message, index, onClick }: FragmentProps) {
  const palette: PaletteDefinition = resolveMessagePalette(message, index);
  const accession = `NO. ${String(index + 1).padStart(4, "0")}`;
  const recipient = (message.to || "Someone").toUpperCase();
  const msgText = (message.msg || "").trim();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 2px Layered Secondary Paper Underlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[2px] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
        style={{
          transform: "translate(3px, 3px)",
          backgroundColor: palette.underlay,
          border: `1px solid ${palette.border}`,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Primary Card Surface */}
      <article
        className="relative z-10 w-full p-7 sm:p-10 md:p-12 rounded-[2px] border transition-all duration-300"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header: Dots + Accession + Emotion */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div className="flex items-center gap-3">
            <PaletteDots dots={palette.dots} size="md" />
            <span
              className="font-mono text-[9px] uppercase tracking-[0.24em] font-medium"
              style={{ color: palette.muted }}
            >
              ARCHIVAL SPECIMEN
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9.5px] uppercase tracking-[0.2em]"
              style={{ color: palette.muted }}
            >
              {accession}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                borderColor: palette.border,
                color: palette.accent,
                backgroundColor: palette.underlay,
              }}
            >
              {(message.emotion || palette.defaultEmotion).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content: Recipient + Large Editorial Typography */}
        <div className="py-8 sm:py-10 space-y-3">
          <div
            className="font-mono text-[10.5px] uppercase tracking-[0.2em] font-medium opacity-80"
            style={{ color: palette.muted }}
          >
            TO: {recipient}
          </div>

          <blockquote className="w-full">
            <p
              className="font-serif text-[24px] sm:text-[32px] md:text-[38px] leading-[1.28] tracking-[-0.02em] font-normal transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: palette.text }}
            >
              &ldquo;{msgText}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Footer: Quiet Action */}
        <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-60"
            style={{ color: palette.muted }}
          >
            Cataloged in Silence
          </span>

          <span
            className="font-mono text-[9.5px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-opacity opacity-75 group-hover:opacity-100"
            style={{ color: palette.accent }}
          >
            <span>Read In Solitary View</span>
            <span>→</span>
          </span>
        </div>
      </article>
    </div>
  );
}

/**
 * 2. Asymmetrical Offset Editorial Slip
 */
function EditorialSlip({ message, index, onClick }: FragmentProps) {
  const palette: PaletteDefinition = resolveMessagePalette(message, index);
  const accession = `NO. ${String(index + 1).padStart(4, "0")}`;
  const recipient = (message.to || "Someone").toUpperCase();
  const msgText = (message.msg || "").trim();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 2px Layered Secondary Paper Underlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[2px] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
        style={{
          transform: "translate(2px, 2px)",
          backgroundColor: palette.underlay,
          border: `1px solid ${palette.border}`,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <article
        className="relative z-10 w-full p-6 sm:p-7 rounded-[2px] border transition-all duration-300 space-y-4"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <PaletteDots dots={palette.dots} size="sm" />
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-65"
            style={{ color: palette.muted }}
          >
            {accession}
          </span>
        </div>

        <div className="space-y-1.5 py-1">
          <div
            className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium opacity-75"
            style={{ color: palette.muted }}
          >
            TO: {recipient}
          </div>

          <blockquote className="w-full">
            <p
              className="font-serif text-[19px] sm:text-[22px] leading-[1.36] tracking-[-0.015em] font-normal transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ color: palette.text }}
            >
              &ldquo;{msgText}&rdquo;
            </p>
          </blockquote>
        </div>

        <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between">
          <span
            className="font-mono text-[8.5px] uppercase tracking-[0.2em] font-medium opacity-70"
            style={{ color: palette.muted }}
          >
            {(message.emotion || palette.defaultEmotion).toUpperCase()}
          </span>

          <span
            className="font-mono text-[8.5px] uppercase tracking-[0.18em] opacity-0 group-hover:opacity-85 transition-opacity"
            style={{ color: palette.accent }}
          >
            OPEN →
          </span>
        </div>
      </article>
    </div>
  );
}

/**
 * 3. Horizontal Archival Ledger Fragment
 */
function HorizontalLedgerFragment({ message, index, onClick }: FragmentProps) {
  const palette: PaletteDefinition = resolveMessagePalette(message, index);
  const accession = `NO. ${String(index + 1).padStart(4, "0")}`;
  const recipient = (message.to || "Someone").toUpperCase();
  const msgText = (message.msg || "").trim();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer border-t border-b border-[rgba(255,255,255,0.08)] py-6 px-4 sm:px-6 transition-all duration-300 hover:bg-white/[0.02]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <PaletteDots dots={palette.dots} size="sm" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#8E877C]">
            {accession}
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#EDE8E0] font-medium">
            TO: {recipient}
          </span>
        </div>

        <blockquote className="flex-1 md:px-8">
          <p className="font-serif text-[17px] sm:text-[19px] text-[#C2BCB3] leading-[1.4] tracking-[-0.015em] line-clamp-2 md:line-clamp-1">
            &ldquo;{msgText}&rdquo;
          </p>
        </blockquote>

        <div className="shrink-0 flex items-center gap-4 justify-between md:justify-end">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5 rounded-full border"
            style={{
              borderColor: palette.border,
              color: palette.accent,
              backgroundColor: palette.underlay,
            }}
          >
            {(message.emotion || palette.defaultEmotion).toUpperCase()}
          </span>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8E877C] group-hover:text-[#EDE8E0] transition-colors">
            READ →
          </span>
        </div>
      </div>
    </div>
  );
}
