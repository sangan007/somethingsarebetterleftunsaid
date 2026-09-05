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

  // Selected Featured cadence: every 7 cards, pick an entry to feature (e.g. index 2, 5, 9, 12...)
  // Spans 2 columns on desktop to establish intentional editorial asymmetry
  if ((index % 7 === 2 || index % 7 === 5) && len >= 35) {
    return "featured-fragment";
  }

  // Very short messages (< 48 chars): Compact Ledger slip
  if (len < 48) {
    return "compact-ledger";
  }

  // Alternating between Letter Fragment and Archival Slip for rich correspondence variation
  if (index % 2 === 1 || len > 130) {
    return "letter-fragment";
  }

  return "archival-slip";
}

export interface MessageCardProps {
  data: MessageData;
  index: number;
  onClick: () => void;
  overridePalette?: PaletteDefinition;
  variant?: CardVariant;
  className?: string;
}

export default function MessageCard({
  data,
  index,
  onClick,
  overridePalette,
  variant: propVariant,
  className = "",
}: MessageCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, Math.min(index * 30, 250));
    return () => clearTimeout(timer);
  }, [index]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
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

  // Layered paper effect on Archival Slip, Letter Fragment, and Featured Fragment
  const hasLayeredSheet = variant !== "compact-ledger";

  // Grid column span: Featured Fragments span 2 columns on medium/large screens
  const colSpanClass =
    variant === "featured-fragment" ? "md:col-span-2" : "col-span-1";

  return (
    <div
      className={`group relative transition-transform duration-300 ease-out cursor-pointer ${colSpanClass} ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Unsaid record to ${recipientDisplay} - ${accessionNumber}`}
    >
      {/* 1-2px Offset Secondary Paper Underlay (Tactile layered paper effect) */}
      {hasLayeredSheet && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[2px] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:translate-y-[3px]"
          style={{
            transform: "translate(2px, 2px)",
            backgroundColor: palette.underlay,
            border: `1px solid ${palette.border}`,
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Primary Card Paper Surface */}
      <article
        className="relative z-10 w-full h-full flex flex-col justify-between rounded-[2px] border transition-all duration-300 ease-out group-hover:-translate-y-[2px]"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.border,
          color: palette.text,
          boxShadow:
            "0 4px 24px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* ===================================================================
            VARIANT 1: COMPACT LEDGER (Very Restrained, Tight Slip)
            =================================================================== */}
        {variant === "compact-ledger" && (
          <div className="flex flex-col justify-between h-full p-5 sm:p-6 space-y-4">
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

            {/* Recipient & Quote */}
            <div className="space-y-1.5">
              <div
                className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium opacity-75"
                style={{ color: palette.muted }}
              >
                TO: {recipientDisplay}
              </div>

              <blockquote className="w-full">
                <p
                  className={`font-serif font-normal break-words transition-transform duration-300 group-hover:translate-x-[1px] tracking-[-0.015em] ${
                    msgLength < 35
                      ? "text-[25px] sm:text-[28px] leading-[1.28]"
                      : "text-[20px] sm:text-[23px] leading-[1.35]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Footer: Quiet Sentiment */}
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.07]">
              <span
                className="font-mono text-[8.5px] uppercase tracking-[0.2em] font-medium opacity-75"
                style={{ color: palette.muted }}
              >
                {emotionDisplay}
              </span>
              <span
                className="font-mono text-[8.5px] uppercase tracking-[0.18em] opacity-0 group-hover:opacity-75 transition-opacity"
                style={{ color: palette.muted }}
              >
                OPEN →
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 2: ARCHIVAL SLIP (Balanced Specimen Slip)
            =================================================================== */}
        {variant === "archival-slip" && (
          <div className="flex flex-col justify-between h-full p-6 sm:p-7 space-y-5">
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

            {/* Recipient sits cleanly below header */}
            <div className="space-y-2 flex-1 flex flex-col justify-start">
              <div
                className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium opacity-70"
                style={{ color: palette.muted }}
              >
                TO: {recipientDisplay}
              </div>

              {/* Message as dominant element */}
              <blockquote className="w-full pt-0.5">
                <p
                  className={`font-serif font-normal break-words transition-transform duration-300 group-hover:translate-x-[1px] tracking-[-0.015em] ${
                    msgLength < 80
                      ? "text-[21px] sm:text-[24px] leading-[1.38]"
                      : "text-[18px] sm:text-[20px] leading-[1.44]"
                  }`}
                  style={{ color: palette.text }}
                >
                  {msgText}
                </p>
              </blockquote>
            </div>

            {/* Footer: Quiet Bottom Metadata */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em] font-medium opacity-80"
                  style={{ color: palette.muted }}
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
                className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: palette.accent }}
              >
                READ →
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 3: LETTER FRAGMENT (Fragment of Correspondence)
            =================================================================== */}
        {variant === "letter-fragment" && (
          <div className="flex flex-col justify-between h-full p-6 sm:p-7 space-y-4">
            {/* Header: Accession NO. and Recipient in correspondence format */}
            <div className="border-b border-white/[0.07] pb-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-60"
                  style={{ color: palette.muted }}
                >
                  {accessionNumber}
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.16em] font-medium opacity-80"
                  style={{ color: palette.muted }}
                >
                  TO: {recipientDisplay}
                </div>
              </div>

              <PaletteDots dots={palette.dots} size="sm" />
            </div>

            {/* Correspondence Body with "Dear—" salutation */}
            <div className="space-y-1 flex-1">
              <div
                className="font-serif italic text-[13.5px] sm:text-[14px] tracking-normal opacity-75"
                style={{ color: palette.muted }}
              >
                Dear—
              </div>

              <blockquote className="w-full pl-0.5">
                <p
                  className={`font-serif font-normal break-words transition-transform duration-300 group-hover:translate-x-[1px] tracking-[-0.015em] ${
                    msgLength < 80
                      ? "text-[20px] sm:text-[23px] leading-[1.4]"
                      : "text-[17px] sm:text-[19.5px] leading-[1.46]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Footer: LOVE · UNSAID */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.18em] font-medium opacity-80"
                  style={{ color: palette.muted }}
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
                className="font-mono text-[10px] tracking-widest opacity-35 group-hover:opacity-80 transition-opacity"
                style={{ color: palette.muted }}
                aria-hidden="true"
              >
                ···
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            VARIANT 4: FEATURED FRAGMENT (Generous Editorial Centerpiece)
            =================================================================== */}
        {variant === "featured-fragment" && (
          <div className="flex flex-col justify-between h-full p-7 sm:p-9 space-y-6">
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

            {/* Body: Recipient & High-Impact Serif Typography */}
            <div className="space-y-2.5 flex-1 flex flex-col justify-center py-2">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.18em] font-medium opacity-75"
                style={{ color: palette.muted }}
              >
                TO: {recipientDisplay}
              </div>

              <blockquote className="w-full">
                <p
                  className={`font-serif font-normal break-words transition-transform duration-300 group-hover:translate-x-[2px] tracking-[-0.018em] ${
                    msgLength < 90
                      ? "text-[26px] sm:text-[32px] md:text-[35px] leading-[1.26]"
                      : "text-[21px] sm:text-[25px] md:text-[28px] leading-[1.34]"
                  }`}
                  style={{ color: palette.text }}
                >
                  &ldquo;{msgText}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Footer: Rich Archival Provenance */}
            <div className="pt-4 flex items-center justify-between border-t border-white/[0.07]">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.2em] font-medium opacity-80"
                  style={{ color: palette.muted }}
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
                  PERMANENT RECORD
                </span>
              </div>

              <div
                className="font-mono text-[9.5px] uppercase tracking-[0.18em] flex items-center gap-1.5 transition-colors group-hover:text-[#EDE8E0]"
                style={{ color: palette.accent }}
              >
                <span>READ IN SOLITARY VIEW</span>
                <span>→</span>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

