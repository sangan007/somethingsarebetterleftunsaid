"use client";

import React, { useEffect, useState } from "react";
import PaletteDots from "./PaletteDots";
import { resolveMessagePalette, PaletteDefinition } from "@/lib/palettes";

export interface MessageData {
  id?: string;
  msg: string;
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
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  uid?: string;
}

export type CardVariant =
  | "compact-ledger"
  | "archival-slip"
  | "letter-fragment"
  | "featured-fragment";

// Deterministically resolve the optimal card layout variant
export function resolveCardVariant(
  data: MessageData,
  index: number
): CardVariant {
  const cleanMsg = (data.msg || "").trim();
  const len = cleanMsg.length;

  // Stagger featured editorial selections at indices that complement a 3-column grid
  // (e.g. index 1 sits in cols 2-3 alongside index 0 at col 1; index 6 sits in cols 2-3 alongside index 5 at col 1)
  if ((index % 8 === 1 || index % 8 === 6) && len >= 28) {
    return "featured-fragment";
  }

  if (len < 48) {
    return "compact-ledger";
  }

  if (index % 2 === 1 || len > 130) {
    return "letter-fragment";
  }

  return "archival-slip";
}

export interface MessageCardProps {
  data: MessageData;
  index: number;
  onClick?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenFullEntry?: () => void;
  overridePalette?: PaletteDefinition;
  variant?: CardVariant;
  className?: string;
  staggerArrival?: boolean;
}

export default function MessageCard({
  data,
  index,
  onClick,
  isExpanded = false,
  onToggleExpand,
  onOpenFullEntry,
  overridePalette,
  variant: propVariant,
  className = "",
  staggerArrival = false,
}: MessageCardProps) {
  const [visible, setVisible] = useState(!staggerArrival);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (staggerArrival) {
      const delay = Math.min(index * 40, 240);
      const timer = setTimeout(() => {
        setVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [index, staggerArrival]);

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking directly on a button or link inside, allow its own handler
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    if (onToggleExpand) {
      onToggleExpand();
    } else if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      // Don't intercept if focus is on a child button
      if ((e.target as HTMLElement).tagName.toLowerCase() === "button") {
        return;
      }
      e.preventDefault();
      if (onToggleExpand) {
        onToggleExpand();
      } else if (onClick) {
        onClick();
      }
    }
  };

  const palette = overridePalette || resolveMessagePalette(data, index);
  const variant = propVariant || resolveCardVariant(data, index);

  const accessionNumber = `NO. ${String(index + 1).padStart(4, "0")}`;
  const emotionDisplay = (
    data.emotion ||
    data.category ||
    palette.defaultEmotion
  ).toUpperCase();
  const recipientDisplay = (data.to || "Someone").toUpperCase();
  const msgText = (data.msg || "").trim();
  const msgLength = msgText.length;

  const dateStr = data.createdAt?.seconds
    ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Archived Record";

  // Layered paper effect on Archival Slip, Letter Fragment, and Featured Fragment
  const hasLayeredSheet = variant !== "compact-ledger";

  // Grid column span: Featured Fragments span 2 columns on medium/large screens
  const colSpanClass =
    variant === "featured-fragment" ? "md:col-span-2" : "col-span-1";

  // The "TO" Rule state (inspect or expanded triggers 100% width and pigment color)
  const isInspecting = isHovered || isExpanded;

  return (
    <div
      className={`group relative self-start h-fit w-full ${colSpanClass} ${className} transition-opacity duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Archival record to ${recipientDisplay}, accession ${accessionNumber}. ${
        isExpanded ? "Expanded." : "Click to unfold record."
      }`}
    >
      {/* 1-2px Offset Secondary Paper Underlay (Subtle secondary paper sheet) */}
      {hasLayeredSheet && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[2px] transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: isHovered && !isExpanded ? "translate(3px, 3px)" : "translate(2px, 2px)",
            backgroundColor: palette.underlay,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            opacity: 0.65,
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Primary Card Paper Surface — Physical Three-State Archival Object */}
      <article
        className={`relative z-10 w-full flex flex-col rounded-[2px] border cursor-pointer select-none transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-1 focus-visible:ring-[#C29B68] focus-visible:outline-none ${
          isHovered && !isExpanded ? "-translate-y-1" : ""
        }`}
        style={{
          backgroundColor: palette.surface,
          borderColor: isExpanded
            ? palette.accent
            : isHovered
            ? "rgba(255, 255, 255, 0.22)"
            : palette.border,
          color: palette.text,
          boxShadow: isExpanded
            ? "0 20px 48px -12px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.5)"
            : isHovered
            ? "0 16px 36px -12px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.3)"
            : "0 4px 24px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Subtle Atmospheric Color Presence */}
        {isExpanded && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-[2px]"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${palette.dots[1]} 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* ===================================================================
            VARIANT 1: COMPACT LEDGER (Tight Slip)
            =================================================================== */}
        {variant === "compact-ledger" && (
          <div className="flex flex-col p-5 sm:p-6 space-y-4">
            {/* Header: Swatch Dots + Accession No. */}
            <div className="flex items-center justify-between gap-3">
              <PaletteDots dots={palette.dots} size="sm" />
              <span
                className="font-mono text-[9px] uppercase tracking-[0.2em] font-normal opacity-60"
                style={{ color: palette.muted }}
              >
                {accessionNumber}
              </span>
            </div>

            {/* Recipient & The "TO" Rule */}
            <div className="space-y-1.5">
              <div>
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium transition-colors duration-300"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  TO: {recipientDisplay}
                </span>
                {/* The "TO" Rule: 30% default, expands to 100% on inspect */}
                <div
                  className="h-[1px] mt-1 transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: isInspecting ? "100%" : "30%",
                    backgroundColor: isInspecting ? palette.accent : "rgba(255, 255, 255, 0.12)",
                    opacity: isInspecting ? 0.85 : 0.4,
                  }}
                  aria-hidden="true"
                />
              </div>

              <blockquote className="w-full pt-1">
                <p
                  className={`font-serif font-normal break-words tracking-[-0.015em] ${
                    msgLength < 35
                      ? "text-[23px] sm:text-[26px] leading-[1.28]"
                      : "text-[19px] sm:text-[21px] leading-[1.35]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* In-Place Accordion Unfolding Section */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono uppercase tracking-[0.16em]" style={{ color: palette.muted }}>
                    <div>
                      <span className="opacity-50 block">DATE</span>
                      <span className="text-[#EDE8E0]">{dateStr}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block">TYPE</span>
                      <span className="text-[#EDE8E0]">{emotionDisplay}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenFullEntry) onOpenFullEntry();
                      }}
                      className="press-tactile font-mono text-[9px] uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-white/[0.18] hover:border-[#EDE8E0] bg-white/[0.05] hover:bg-white/[0.1] text-[#EDE8E0] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>SOLITARY VIEW</span>
                      <span className="text-[#C29B68]">↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleExpand) onToggleExpand();
                      }}
                      className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
                    >
                      FOLD —
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Quiet Sentiment & Unfold Hint */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.07]">
              <span
                className="font-mono text-[8.5px] uppercase tracking-[0.2em] font-medium opacity-75"
                style={{ color: isInspecting ? palette.accent : palette.muted }}
              >
                {emotionDisplay}
              </span>
              <span
                className="font-mono text-[8.5px] uppercase tracking-[0.18em] transition-opacity duration-250"
                style={{
                  color: isInspecting ? palette.accent : palette.muted,
                  opacity: isExpanded ? 0.9 : isHovered ? 0.8 : 0.4,
                }}
              >
                {isExpanded ? "CLOSE —" : "READ →"}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 2: ARCHIVAL SLIP (Balanced Specimen Slip)
            =================================================================== */}
        {variant === "archival-slip" && (
          <div className="flex flex-col p-6 sm:p-7 space-y-4">
            {/* Header: Palette Dots near upper edge + Accession */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <PaletteDots dots={palette.dots} size="md" />
                <span
                  className="font-mono text-[8.5px] uppercase tracking-[0.22em] font-medium opacity-60"
                  style={{ color: palette.muted }}
                >
                  SPECIMEN
                </span>
              </div>
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.2em] opacity-65"
                style={{ color: palette.muted }}
              >
                {accessionNumber}
              </span>
            </div>

            {/* Recipient & The "TO" Rule */}
            <div className="space-y-2">
              <div>
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium transition-colors duration-300"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  TO: {recipientDisplay}
                </span>
                {/* The "TO" Rule: 30% default, expands to 100% on inspect */}
                <div
                  className="h-[1px] mt-1 transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: isInspecting ? "100%" : "30%",
                    backgroundColor: isInspecting ? palette.accent : "rgba(255, 255, 255, 0.12)",
                    opacity: isInspecting ? 0.85 : 0.4,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Message as dominant element */}
              <blockquote className="w-full pt-1">
                <p
                  className={`font-serif font-normal break-words tracking-[-0.015em] ${
                    msgLength < 80
                      ? "text-[21px] sm:text-[23px] leading-[1.38]"
                      : "text-[18px] sm:text-[20px] leading-[1.44]"
                  }`}
                  style={{ color: palette.text }}
                >
                  {msgText}
                </p>
              </blockquote>
            </div>

            {/* In-Place Accordion Unfolding Section */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-white/[0.08] space-y-3.5">
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono uppercase tracking-[0.16em]" style={{ color: palette.muted }}>
                    <div>
                      <span className="opacity-50 block">RECORD</span>
                      <span className="text-[#EDE8E0]">{accessionNumber}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block">DATE</span>
                      <span className="text-[#EDE8E0]">{dateStr}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenFullEntry) onOpenFullEntry();
                      }}
                      className="press-tactile font-mono text-[9px] uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-white/[0.18] hover:border-[#EDE8E0] bg-white/[0.05] hover:bg-white/[0.1] text-[#EDE8E0] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>READ IN SOLITARY VIEW</span>
                      <span className="text-[#C29B68]">↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleExpand) onToggleExpand();
                      }}
                      className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
                    >
                      FOLD RECORD —
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Quiet Bottom Metadata */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em] font-medium transition-colors"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  {emotionDisplay}
                </span>
                <span
                  className="font-mono text-[8.5px] opacity-35"
                  style={{ color: palette.muted }}
                >
                  ·
                </span>
                <span
                  className="font-mono text-[8.5px] uppercase tracking-[0.16em] opacity-55"
                  style={{ color: palette.muted }}
                >
                  UNSAID
                </span>
              </div>

              <span
                className="font-mono text-[9px] uppercase tracking-[0.16em] transition-opacity duration-250"
                style={{
                  color: palette.accent,
                  opacity: isExpanded ? 1 : isHovered ? 0.9 : 0.45,
                }}
              >
                {isExpanded ? "CLOSE —" : "READ →"}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 3: LETTER FRAGMENT (Correspondence)
            =================================================================== */}
        {variant === "letter-fragment" && (
          <div className="flex flex-col p-6 sm:p-7 space-y-4">
            {/* Header: Accession NO. and Recipient in correspondence format */}
            <div className="border-b border-white/[0.07] pb-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-60"
                  style={{ color: palette.muted }}
                >
                  {accessionNumber}
                </div>
                <div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.16em] font-medium transition-colors duration-300"
                    style={{ color: isInspecting ? palette.accent : palette.muted }}
                  >
                    TO: {recipientDisplay}
                  </span>
                  {/* The "TO" Rule: 30% default, expands to 100% on inspect */}
                  <div
                    className="h-[1px] mt-1 transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      width: isInspecting ? "100%" : "30%",
                      backgroundColor: isInspecting ? palette.accent : "rgba(255, 255, 255, 0.12)",
                      opacity: isInspecting ? 0.85 : 0.4,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <PaletteDots dots={palette.dots} size="sm" />
            </div>

            {/* Correspondence Body with "Dear—" salutation */}
            <div className="space-y-1">
              <div
                className="font-serif italic text-[13.5px] sm:text-[14px] tracking-normal opacity-75"
                style={{ color: palette.muted }}
              >
                Dear—
              </div>

              <blockquote className="w-full pl-0.5">
                <p
                  className={`font-serif font-normal break-words tracking-[-0.015em] ${
                    msgLength < 80
                      ? "text-[20px] sm:text-[22px] leading-[1.4]"
                      : "text-[17px] sm:text-[19px] leading-[1.46]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* In-Place Accordion Unfolding Section */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-white/[0.08] space-y-3.5">
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono uppercase tracking-[0.16em]" style={{ color: palette.muted }}>
                    <div>
                      <span className="opacity-50 block">RECORD</span>
                      <span className="text-[#EDE8E0]">{accessionNumber}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block">DATE</span>
                      <span className="text-[#EDE8E0]">{dateStr}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenFullEntry) onOpenFullEntry();
                      }}
                      className="press-tactile font-mono text-[9px] uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full border border-white/[0.18] hover:border-[#EDE8E0] bg-white/[0.05] hover:bg-white/[0.1] text-[#EDE8E0] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>READ IN SOLITARY VIEW</span>
                      <span className="text-[#C29B68]">↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleExpand) onToggleExpand();
                      }}
                      className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
                    >
                      FOLD LETTER —
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: LOVE · UNSAID */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em] font-medium"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  {emotionDisplay}
                </span>
                <span
                  className="font-mono text-[8.5px] opacity-35"
                  style={{ color: palette.muted }}
                >
                  ·
                </span>
                <span
                  className="font-mono text-[8.5px] uppercase tracking-[0.18em] opacity-55"
                  style={{ color: palette.muted }}
                >
                  UNSAID
                </span>
              </div>

              <span
                className="font-mono text-[9px] tracking-widest transition-opacity duration-250"
                style={{
                  color: palette.accent,
                  opacity: isExpanded ? 1 : isHovered ? 0.9 : 0.45,
                }}
              >
                {isExpanded ? "CLOSE —" : "READ →"}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 4: FEATURED FRAGMENT (Editorial Centerpiece)
            =================================================================== */}
        {variant === "featured-fragment" && (
          <div className="flex flex-col justify-between min-h-[300px] sm:min-h-[340px] p-7 sm:p-9 md:p-10 space-y-6">
            {/* Header: Prominent Swatch + Accession + Badge */}
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <div className="flex items-center gap-3">
                <PaletteDots dots={palette.dots} size="md" />
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.24em] font-semibold"
                  style={{ color: palette.accent }}
                >
                  ARCHIVAL SELECTION
                </span>
              </div>

              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-65"
                style={{ color: palette.muted }}
              >
                {accessionNumber}
              </span>
            </div>

            {/* Body: Recipient & The "TO" Rule */}
            <div className="space-y-2.5 flex-1 flex flex-col justify-center py-2">
              <div>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] font-medium transition-colors duration-300"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  TO: {recipientDisplay}
                </span>
                {/* The "TO" Rule: 30% default, expands to 100% on inspect */}
                <div
                  className="h-[1px] mt-1 transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: isInspecting ? "100%" : "30%",
                    backgroundColor: isInspecting ? palette.accent : "rgba(255, 255, 255, 0.12)",
                    opacity: isInspecting ? 0.85 : 0.4,
                  }}
                  aria-hidden="true"
                />
              </div>

              <blockquote className="w-full pt-1">
                <p
                  className={`font-serif font-normal break-words tracking-[-0.018em] ${
                    msgLength < 90
                      ? "text-[26px] sm:text-[31px] md:text-[34px] leading-[1.26]"
                      : "text-[21px] sm:text-[24px] md:text-[27px] leading-[1.34]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* In-Place Accordion Unfolding Section */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-white/[0.08] space-y-3.5">
                  <div className="grid grid-cols-2 gap-3 text-[9.5px] font-mono uppercase tracking-[0.16em]" style={{ color: palette.muted }}>
                    <div>
                      <span className="opacity-50 block">RESONANCE</span>
                      <span className="text-[#EDE8E0]">{emotionDisplay}</span>
                    </div>
                    <div>
                      <span className="opacity-50 block">DATE</span>
                      <span className="text-[#EDE8E0]">{dateStr}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenFullEntry) onOpenFullEntry();
                      }}
                      className="press-tactile font-mono text-[9.5px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-white/[0.2] hover:border-[#EDE8E0] bg-white/[0.06] hover:bg-white/[0.12] text-[#EDE8E0] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>READ IN SOLITARY VIEW</span>
                      <span className="text-[#C29B68]">↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleExpand) onToggleExpand();
                      }}
                      className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
                    >
                      FOLD RECORD —
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Rich Archival Provenance */}
            <div className="pt-4 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.2em] font-medium"
                  style={{ color: isInspecting ? palette.accent : palette.muted }}
                >
                  {emotionDisplay}
                </span>
                <span
                  className="font-mono text-[8.5px] opacity-30"
                  style={{ color: palette.muted }}
                >
                  ·
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-55"
                  style={{ color: palette.muted }}
                >
                  ARCHIVE RECORD
                </span>
              </div>

              <div
                className="font-mono text-[9.5px] uppercase tracking-[0.18em] flex items-center gap-1.5 transition-colors"
                style={{ color: palette.accent }}
              >
                <span>{isExpanded ? "CLOSE —" : "READ IN SOLITARY VIEW"}</span>
                <span>{isExpanded ? "↑" : "→"}</span>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
