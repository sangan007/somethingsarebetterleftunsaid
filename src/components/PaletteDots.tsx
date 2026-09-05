"use client";

import React from "react";

interface PaletteDotsProps {
  dots: [string, string, string, string];
  size?: "xs" | "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function PaletteDots({
  dots,
  size = "md",
  orientation = "horizontal",
  className = "",
}: PaletteDotsProps) {
  const sizeMap = {
    xs: {
      gap: "gap-1",
      dotClass: "w-2 h-2",
    },
    sm: {
      gap: "gap-1.5",
      dotClass: "w-2.5 h-2.5",
    },
    md: {
      gap: "gap-1.5",
      dotClass: "w-3 h-3",
    },
    lg: {
      gap: "gap-2",
      dotClass: "w-4 h-4",
    },
  };

  const { gap, dotClass } = sizeMap[size];
  const flexDir = orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div
      className={`inline-flex items-center ${flexDir} ${gap} ${className}`}
      aria-label="Archival palette color swatch"
      role="img"
    >
      {/* 1st Dot: Deepest archival ink tone */}
      <span
        className={`${dotClass} rounded-full shrink-0 border border-black/10 transition-transform duration-200 group-hover:scale-105`}
        style={{
          backgroundColor: dots[0],
          boxShadow: "0 0.5px 1.5px rgba(0, 0, 0, 0.08)",
        }}
      />
      {/* 2nd Dot: Medium pigment */}
      <span
        className={`${dotClass} rounded-full shrink-0 border border-black/10 transition-transform duration-200 group-hover:scale-105`}
        style={{
          backgroundColor: dots[1],
          boxShadow: "0 0.5px 1.5px rgba(0, 0, 0, 0.06)",
        }}
      />
      {/* 3rd Dot: Light tone */}
      <span
        className={`${dotClass} rounded-full shrink-0 border border-black/10 transition-transform duration-200 group-hover:scale-105`}
        style={{
          backgroundColor: dots[2],
          boxShadow: "0 0.5px 1.5px rgba(0, 0, 0, 0.04)",
        }}
      />
      {/* 4th Dot: Translucent tinted paper / ring swatch */}
      <span
        className={`${dotClass} rounded-full shrink-0 border border-black/20 transition-transform duration-200 group-hover:scale-105`}
        style={{
          backgroundColor: dots[3],
        }}
      />
    </div>
  );
}

