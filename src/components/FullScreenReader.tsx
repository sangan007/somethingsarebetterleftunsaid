"use client";

import React, { useEffect, useRef, useState } from "react";
import PaletteDots from "./PaletteDots";
import { MessageData } from "./MessageCard";
import { resolveMessagePalette } from "@/lib/palettes";

interface FullScreenReaderProps {
  viewState: "closed" | "opening" | "open" | "closing";
  data: MessageData | null;
  onClose: () => void;
  onNavigate: (direction: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function FullScreenReader({
  viewState,
  data,
  onClose,
  onNavigate,
  hasPrevious,
  hasNext,
}: FullScreenReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [localData, setLocalData] = useState<MessageData | null>(null);

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // Keyboard navigation
  useEffect(() => {
    if (viewState !== "open") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrevious) {
        onNavigate(-1);
      } else if (e.key === "ArrowRight" && hasNext) {
        onNavigate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewState, hasPrevious, hasNext, onNavigate, onClose]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (viewState !== "open") return;
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (viewState !== "open" || touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const xDiff = touchEndX - touchStartX.current;
    const yDiff = touchEndY - touchStartY.current;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (Math.abs(xDiff) > 50) {
        if (xDiff > 0 && hasPrevious) {
          onNavigate(-1);
        } else if (xDiff < 0 && hasNext) {
          onNavigate(1);
        }
      }
    } else {
      if (yDiff > 70 && containerRef.current && containerRef.current.scrollTop <= 0) {
        onClose();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (viewState === "closed" || !localData) return null;

  const palette = resolveMessagePalette(localData, 0);
  const emotionLabel = (localData.emotion || localData.category || palette.defaultEmotion).toUpperCase();
  const dateStr = localData.createdAt?.seconds
    ? new Date(localData.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Archived Record";

  return (
    <div
      ref={containerRef}
      id="full-screen-view"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 flex flex-col transition-opacity duration-500 overflow-y-auto ${
        viewState === "opening" || viewState === "open"
          ? "active opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: palette.surface,
        color: palette.text,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Solitary archival reading room"
    >
      {/* Subtle Atmospheric Color Glow in the Dark (Soft & Subconscious) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${palette.dots[1]} 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Top Reading Navigation Bar */}
      <div
        className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between border-b"
        style={{ borderColor: palette.border }}
      >
        <button
          onClick={onClose}
          className="font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer transition-colors hover:text-[#EDE8E0]"
          style={{ color: palette.muted }}
        >
          <span>←</span>
          <span>Return to Archive</span>
        </button>

        <div className="flex items-center gap-3">
          <PaletteDots dots={palette.dots} size="sm" />
          <span
            className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: palette.muted }}
          >
            {palette.defaultEmotion}
          </span>
        </div>

        <button
          onClick={onClose}
          className="font-mono text-[10px] uppercase tracking-widest cursor-pointer p-1 hover:text-[#EDE8E0] transition-colors"
          style={{ color: palette.muted }}
          aria-label="Close record"
        >
          ✕ Esc
        </button>
      </div>

      {/* Main Solitary Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-3xl mx-auto w-full px-6 py-12 md:py-24 text-center">
        {/* Archival Provenance */}
        <div className="mb-10 sm:mb-14 space-y-3">
          <PaletteDots dots={palette.dots} size="md" className="justify-center" />

          <h2
            className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium"
            style={{ color: palette.muted }}
          >
            TO &thinsp;/&thinsp; {(localData.to || "Someone").toUpperCase()}
          </h2>

          <div
            className="flex items-center justify-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em]"
            style={{ color: palette.muted }}
          >
            <span>{dateStr}</span>
            <span className="opacity-40">·</span>
            <span>{emotionLabel}</span>
          </div>
        </div>

        {/* Hairline Divider */}
        <div
          className="w-12 h-px mb-12 sm:mb-16 mx-auto opacity-40"
          style={{ backgroundColor: palette.border }}
        />

        {/* The Hero Unsaid Message - Dominant in the quiet darkness */}
        <div
          ref={msgContainerRef}
          className="w-full my-auto transition-all duration-500 max-w-2xl px-2"
        >
          <blockquote className="space-y-4">
            <p
              className={`font-serif tracking-[-0.018em] leading-[1.32] break-words font-normal ${
                localData.msg.length > 200
                  ? "text-xl sm:text-2xl md:text-3xl"
                  : localData.msg.length > 80
                  ? "text-2xl sm:text-3xl md:text-4xl"
                  : "text-3xl sm:text-4xl md:text-5xl"
              }`}
              style={{ color: palette.text }}
            >
              &ldquo;{localData.msg}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Hairline Divider */}
        <div
          className="w-12 h-px mt-12 sm:mt-16 mb-6 mx-auto opacity-40"
          style={{ backgroundColor: palette.border }}
        />

        {/* Solitary Metadata Footnote */}
        <div
          className="font-mono text-[9px] uppercase tracking-[0.18em] space-y-1"
          style={{ color: palette.muted }}
        >
          <p>Archival Record {localData.id ? `· № ${localData.id.slice(0, 8)}` : ""}</p>
        </div>
      </div>

      {/* Bottom Paging Controls */}
      <div
        className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 border-t flex items-center justify-between font-mono text-[10px] uppercase tracking-widest"
        style={{ borderColor: palette.border, color: palette.muted }}
      >
        <button
          onClick={() => onNavigate(-1)}
          disabled={!hasPrevious}
          className={`flex items-center gap-2 transition-colors ${
            hasPrevious ? "hover:text-[#EDE8E0] cursor-pointer" : "opacity-25 cursor-not-allowed"
          }`}
        >
          <span>←</span>
          <span>PREVIOUS</span>
        </button>

        <span className="hidden sm:inline text-[9px] tracking-[0.2em] opacity-50">
          Use keyboard ← → to read
        </span>

        <button
          onClick={() => onNavigate(1)}
          disabled={!hasNext}
          className={`flex items-center gap-2 transition-colors ${
            hasNext ? "hover:text-[#EDE8E0] cursor-pointer" : "opacity-25 cursor-not-allowed"
          }`}
        >
          <span>NEXT</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
