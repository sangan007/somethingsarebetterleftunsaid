"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import JournalSection from "@/components/JournalSection";
import EditorModal from "@/components/EditorModal";
import EmotionalLayer from "@/components/EmotionalLayer";
import { MessageData } from "@/components/MessageCard";
import { fetchFirebaseMessages } from "@/lib/messages";

interface JournalClientWrapperProps {
  initialSlug?: string;
}

export default function JournalClientWrapper({
  initialSlug,
}: JournalClientWrapperProps) {
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [emotionalActive, setEmotionalActive] = useState(false);
  const [emotionalText, setEmotionalText] = useState("");

  // Load real messages for archive tie-ins
  useEffect(() => {
    fetchFirebaseMessages()
      .then((data) => setMessages(data))
      .catch((err) => console.warn("Journal archive load note:", err));
  }, []);

  const handleViewChange = (view: string) => {
    if (view === "home") {
      router.push("/");
    } else if (view === "archive") {
      router.push("/?view=archive");
    } else if (view === "about") {
      router.push("/?view=about");
    } else if (view === "journal") {
      router.push("/journal");
    }
  };

  const triggerEmotional = (text?: string) => {
    setEmotionalText(text || "your words have been entrusted to the archive");
    setEmotionalActive(true);
    setTimeout(() => setEmotionalActive(false), 3800);
  };

  return (
    <>
      <Navigation
        currentView="journal"
        onViewChange={handleViewChange}
        onOpenWrite={() => setEditorOpen(true)}
      />

      <main className="min-h-screen pt-20 md:pt-24 pb-16">
        <JournalSection
          initialArticleSlug={initialSlug}
          archiveMessages={messages}
          onNavigateHome={() => router.push("/")}
        />
      </main>

      {/* Editorial Footer (With mobile clearance for floating bottom quick navigation) */}
      <footer className="w-full border-t border-[rgba(255,255,255,0.07)] pt-10 sm:pt-12 pb-24 md:pb-12 px-4 sm:px-6 text-center text-[10px] font-mono tracking-[0.16em] uppercase text-[#6B655B] space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2">
          <button
            onClick={() => router.push("/")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Home
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => router.push("/?view=archive")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Archive
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => router.push("/journal")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors text-[#EDE8E0] font-semibold py-1"
          >
            Journal
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => router.push("/?view=about")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            About
          </button>
        </div>
        <div className="text-[9px] sm:text-[10px]">A Collection of Unsaid Things · Archive MMXXVI</div>
      </footer>

      {/* Submission Modal */}
      <EditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSuccess={(text) => triggerEmotional(text)}
        onAddMessage={(newMsg) => {
          setMessages((prev) => [newMsg, ...prev.filter((m) => m.id !== newMsg.id)]);
        }}
      />

      {/* Emotional Whisper Overlay */}
      <EmotionalLayer active={emotionalActive} text={emotionalText} />
    </>
  );
}
