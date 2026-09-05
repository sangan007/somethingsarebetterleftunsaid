"use client";

import React from "react";

interface EmotionalLayerProps {
  active: boolean;
  text: string;
}

export default function EmotionalLayer({ active, text }: EmotionalLayerProps) {
  return (
    <div id="emotional-layer" className={active ? "active" : ""}>
      <div id="emotional-text">{text}</div>
    </div>
  );
}
