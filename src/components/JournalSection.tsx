"use client";

import React, { useState, useEffect } from "react";
import { JournalEntry, getJournalEntryBySlug } from "@/data/journal";
import JournalIndex from "@/components/JournalIndex";
import JournalArticleView from "@/components/JournalArticleView";
import { MessageData } from "@/components/MessageCard";

interface JournalSectionProps {
  initialArticleSlug?: string | null;
  archiveMessages?: MessageData[];
  onNavigateHome?: () => void;
}

export default function JournalSection(props: JournalSectionProps) {
  const { initialArticleSlug = null, archiveMessages = [] } = props;
  const [activeSlug, setActiveSlug] = useState<string | null>(initialArticleSlug);

  // Sync initial slug from URL params if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const article = params.get("article");
      if (article) {
        const found = getJournalEntryBySlug(article);
        if (found) {
          setActiveSlug(article);
        }
      }

      // Handle browser back/forward buttons
      const handlePopState = () => {
        const p = new URLSearchParams(window.location.search);
        const art = p.get("article");
        setActiveSlug(art || null);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  const handleSelectArticle = (entry: JournalEntry) => {
    setActiveSlug(entry.slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", "journal");
      url.searchParams.set("article", entry.slug);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleBackToIndex = () => {
    setActiveSlug(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", "journal");
      url.searchParams.delete("article");
      window.history.pushState({}, "", url.toString());
    }
  };

  const activeEntry = activeSlug ? getJournalEntryBySlug(activeSlug) : null;

  if (activeEntry) {
    return (
      <JournalArticleView
        entry={activeEntry}
        onBack={handleBackToIndex}
        onSelectRelated={handleSelectArticle}
        archiveMessages={archiveMessages}
      />
    );
  }

  return (
    <JournalIndex
      onSelectArticle={handleSelectArticle}
      archiveMessages={archiveMessages}
    />
  );
}
