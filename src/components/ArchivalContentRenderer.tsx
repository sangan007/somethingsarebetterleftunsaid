"use client";

import React from "react";

interface ArchivalContentRendererProps {
  content: string;
  className?: string;
  color?: string;
  variant?: "lead" | "slip" | "card" | "solitary";
}

/**
 * Checks whether the text contains Braille patterns (\u2800-\u28FF)
 * or structured multi-line ASCII/dot graphic patterns.
 */
export function isArchivalGraphic(text: string): boolean {
  if (!text) return false;
  // Braille unicode range check
  if (/[\u2800-\u28FF]/.test(text)) return true;

  // Dense multi-line symbol graphic check (lines with high density of decorative characters)
  const lines = text.split("\n");
  if (lines.length >= 4) {
    const symbolLineCount = lines.filter((line) => {
      const nonWord = line.replace(/[a-zA-Z0-9\s]/g, "").length;
      return nonWord > 8;
    }).length;
    if (symbolLineCount >= 3) return true;
  }

  return false;
}

export default function ArchivalContentRenderer({
  content,
  className = "",
  color,
  variant = "card",
}: ArchivalContentRendererProps) {
  const cleanText = (content || "").trim();
  const isGraphic = isArchivalGraphic(cleanText);

  if (!isGraphic) {
    // Standard literary unsaid text
    return (
      <p
        className={`break-words [overflow-wrap:anywhere] [word-break:break-word] w-full max-w-full min-w-0 whitespace-pre-line ${className}`}
        style={color ? { color } : undefined}
      >
        &ldquo;{cleanText}&rdquo;
      </p>
    );
  }

  // Format containing ASCII or Braille visual pattern
  // Split into leading text (if any) and graphic body
  const lines = cleanText.split("\n");
  const firstNonGraphicIndex = lines.findIndex((l) => /[\u2800-\u28FF]/.test(l));
  const textIntro = firstNonGraphicIndex > 0 ? lines.slice(0, firstNonGraphicIndex).join("\n") : "";
  const graphicLines = firstNonGraphicIndex >= 0 ? lines.slice(firstNonGraphicIndex).join("\n") : cleanText;

  // Sizing scale for graphic by variant
  const graphicSizeClass =
    variant === "solitary"
      ? "text-[clamp(0.55rem,2.4vw,1.1rem)]"
      : variant === "lead"
      ? "text-[clamp(0.48rem,1.9vw,0.85rem)] sm:text-[clamp(0.55rem,1.4vw,0.95rem)]"
      : "text-[clamp(0.42rem,1.6vw,0.78rem)] sm:text-[clamp(0.5rem,1.2vw,0.88rem)]";

  return (
    <div className="w-full max-w-full min-w-0 space-y-3">
      {textIntro && (
        <p
          className={`break-words [overflow-wrap:anywhere] [word-break:break-word] w-full max-w-full min-w-0 ${className}`}
          style={color ? { color } : undefined}
        >
          &ldquo;{textIntro}&rdquo;
        </p>
      )}

      {/* Constrained visual container: proportional scaling with interior safe scrolling */}
      <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden select-text py-1 text-center scrollbar-none">
        <pre
          className={`inline-block text-left font-mono leading-[1.08] tracking-[-0.05em] select-text max-w-full whitespace-pre ${graphicSizeClass}`}
          style={color ? { color } : undefined}
        >
          {graphicLines}
        </pre>
      </div>
    </div>
  );
}
