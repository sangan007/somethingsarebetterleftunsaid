"use client";

import React, { useState, useEffect, useRef } from "react";
import { db, auth, appId } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import PaletteDots from "./PaletteDots";
import MessageCard, { MessageData } from "./MessageCard";
import { ARCHIVAL_PALETTES, PaletteDefinition } from "@/lib/palettes";
import { submitFirebaseMessage } from "@/lib/messages";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (text: string) => void;
  onAddMessage?: (msg: MessageData) => void;
}

const EMOTION_CHOICES = [
  "LOVE",
  "REGRET",
  "GRIEF",
  "HOPE",
  "LONGING",
  "GRATITUDE",
  "ANGER",
  "MEMORY",
  "OTHER",
];

export default function EditorModal({
  isOpen,
  onClose,
  onSuccess,
  onAddMessage,
}: EditorModalProps) {
  const [toVal, setToVal] = useState("");
  const [msgVal, setMsgVal] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("LOVE");
  const [selectedPalette, setSelectedPalette] = useState<PaletteDefinition>(ARCHIVAL_PALETTES[1]); // Default to Dusty Rose

  const [submitting, setSubmitting] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState<"none" | "showing" | "hiding">("none");

  const toInputRef = useRef<HTMLInputElement>(null);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        toInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = msgVal.trim();
    if (!msg || submitting) return;

    setSubmitting(true);
    setOverlayPhase("showing");

    const user = auth.currentUser;
    const fallbackUid =
      typeof window !== "undefined"
        ? localStorage.getItem("unsaid_anon_uid") ||
          "anon_" + Math.random().toString(36).substring(2, 9)
        : "anon_local";
    if (typeof window !== "undefined") {
      localStorage.setItem("unsaid_anon_uid", fallbackUid);
    }

    const newMsgData: MessageData = {
      msg,
      to: toVal.trim() || "Someone",
      emotion: selectedEmotion,
      palette: selectedPalette.id,
      bg: selectedPalette.surface,
      font: "font-serif",
      size: "size-medium",
      weight: "weight-normal",
      leading: "leading-normal",
      align: "align-center",
      border: "border-thin",
      padding: "pad-balanced",
      radius: "rad-soft",
      width: "width-standard",
      toOpacity: "opacity-100",
      icon: "show",
      footer: "show",
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
      uid: user ? user.uid : fallbackUid,
    };

    try {
      // Primary: Submit directly to real Firebase Firestore collection
      const savedDoc = await submitFirebaseMessage(newMsgData);
      if (onAddMessage) {
        onAddMessage(savedDoc);
      }
    } catch (err) {
      console.warn("API write error, attempting client SDK write:", err);
      if (user) {
        try {
          const docRef = await addDoc(
            collection(db, "artifacts", appId, "public", "data", "messages"),
            {
              msg: newMsgData.msg,
              to: newMsgData.to,
              emotion: newMsgData.emotion,
              palette: newMsgData.palette,
              bg: newMsgData.bg,
              font: newMsgData.font,
              size: newMsgData.size,
              weight: newMsgData.weight,
              leading: newMsgData.leading,
              align: newMsgData.align,
              border: newMsgData.border,
              padding: newMsgData.padding,
              radius: newMsgData.radius,
              width: newMsgData.width,
              toOpacity: newMsgData.toOpacity,
              icon: newMsgData.icon,
              footer: newMsgData.footer,
              createdAt: serverTimestamp(),
              uid: user.uid,
            }
          );
          if (onAddMessage) {
            onAddMessage({
              ...newMsgData,
              id: docRef.id,
            });
          }
        } catch (sdkErr) {
          console.error("Firestore SDK fallback also failed:", sdkErr);
        }
      }
    }

    setTimeout(() => {
      setOverlayPhase("hiding");
      setTimeout(() => {
        setSubmitting(false);
        setOverlayPhase("none");
        setToVal("");
        setMsgVal("");
        onClose();
        onSuccess(
          "Your words have been released into the dark. They are safe here."
        );
      }, 400);
    }, 1200);
  };

  if (!isOpen) return null;

  // Mock message for live preview
  const previewData: MessageData = {
    to: toVal || "A",
    msg: msgVal || "I loved you.",
    emotion: selectedEmotion,
    palette: selectedPalette.id,
  };

  return (
    <div
      id="writeModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0C0B0A]/92 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Leave something you never said"
    >
      <div className="relative w-full max-w-4xl bg-[#141312] border border-[rgba(255,255,255,0.08)] rounded-[3px] p-6 sm:p-9 shadow-2xl space-y-7 my-auto max-h-[92vh] overflow-y-auto text-[#EDE8E0]">
        {/* Modal Top Masthead */}
        <div className="flex justify-between items-baseline border-b border-[rgba(255,255,255,0.07)] pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8E877C] block">
              Archival Intake
            </span>
            <h2 className="font-serif text-2xl sm:text-[1.75rem] text-[#EDE8E0] font-normal tracking-[-0.015em]">
              Leave Something Unsaid
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer py-1 px-2 border border-transparent hover:border-[rgba(255,255,255,0.15)] rounded-[2px] transition-colors"
            aria-label="Close"
          >
            Esc ✕
          </button>
        </div>

        {/* 2-Column Responsive Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            {/* Recipient */}
            <div className="space-y-1.5">
              <label
                htmlFor="recipient-input"
                className="block font-sans text-[10px] uppercase tracking-[0.14em] text-[#8E877C] font-medium"
              >
                Recipient / To
              </label>
              <input
                id="recipient-input"
                ref={toInputRef}
                type="text"
                placeholder="e.g. Someone, E., The stranger on the 7:15..."
                maxLength={50}
                value={toVal}
                onChange={(e) => setToVal(e.target.value)}
                className="w-full bg-[#0C0B0A] border border-[rgba(255,255,255,0.12)] focus:border-[#EDE8E0] px-3 py-2 font-sans text-sm text-[#EDE8E0] placeholder:text-[#6B655B] rounded-[2px] outline-none transition-colors"
              />
            </div>

            {/* Unspoken Words */}
            <div className="space-y-1.5">
              <label
                htmlFor="message-textarea"
                className="block font-sans text-[10px] uppercase tracking-[0.14em] text-[#8E877C] font-medium"
              >
                Unspoken Words
              </label>
              <textarea
                id="message-textarea"
                ref={msgInputRef}
                required
                rows={4}
                maxLength={500}
                placeholder="Write what was never brought to voice..."
                value={msgVal}
                onChange={(e) => setMsgVal(e.target.value)}
                className="w-full bg-[#0C0B0A] border border-[rgba(255,255,255,0.12)] focus:border-[#EDE8E0] p-3 font-serif text-base sm:text-lg text-[#EDE8E0] placeholder:text-[#6B655B] leading-relaxed resize-none rounded-[2px] outline-none transition-colors"
              />
              <div className="flex justify-end text-[9px] font-mono tracking-wider text-[#6B655B]">
                {msgVal.length} / 500
              </div>
            </div>

            {/* Emotion / Primary Resonance */}
            <div className="space-y-1.5">
              <label className="block font-sans text-[10px] uppercase tracking-[0.14em] text-[#8E877C] font-medium">
                Resonance Index
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOTION_CHOICES.map((emo) => (
                  <button
                    type="button"
                    key={emo}
                    onClick={() => setSelectedEmotion(emo)}
                    className={`font-mono text-[9px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-[2px] border transition-all cursor-pointer ${
                      selectedEmotion === emo
                        ? "bg-white/[0.12] text-[#EDE8E0] border-[#EDE8E0]"
                        : "bg-transparent text-[#8E877C] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-[#EDE8E0]"
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* Archival Palettes (Swatches with Dots) */}
            <div className="space-y-2">
              <label className="block font-sans text-[10px] uppercase tracking-[0.14em] text-[#8E877C] font-medium">
                Archival Palette
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ARCHIVAL_PALETTES.map((pal) => {
                  const isSelected = selectedPalette.id === pal.id;
                  return (
                    <button
                      type="button"
                      key={pal.id}
                      onClick={() => setSelectedPalette(pal)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] border font-mono text-[9px] uppercase tracking-[0.12em] transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#EDE8E0] ring-1 ring-[#EDE8E0] shadow-sm"
                          : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)]"
                      }`}
                      style={{
                        backgroundColor: pal.surface,
                        color: pal.text,
                      }}
                    >
                      <PaletteDots dots={pal.dots} size="sm" />
                      <span>{pal.defaultEmotion}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8E877C] hover:text-[#EDE8E0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !msgVal.trim()}
                className="font-sans text-[11px] uppercase tracking-[0.14em] font-medium px-5 py-2.5 border border-[#EDE8E0] bg-[#EDE8E0] text-[#0C0B0A] hover:bg-white transition-all rounded-[2px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? "Preserving..." : "Deposit into Archive"}
              </button>
            </div>
          </form>

          {/* Right Column: Live Interactive Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 pt-2 lg:pt-0">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#8E877C]">
              <span>Live Fragment Preview</span>
              <span className="text-[#C29B68] font-medium">{selectedPalette.defaultEmotion}</span>
            </div>

            <div className="p-0.5">
              <MessageCard
                data={previewData}
                index={0}
                overridePalette={selectedPalette}
                onClick={() => {}}
              />
            </div>

            <p className="font-mono text-[9px] text-[#6B655B] leading-relaxed uppercase tracking-wide text-center pt-1">
              Recorded in permanent anonymous custody.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Overlay Animation */}
      {submitting && (
        <div className="fixed inset-0 z-60 bg-[#0C0B0A]/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p
            className={`font-serif italic text-2xl sm:text-3xl text-[#EDE8E0] transition-all duration-700 ${
              overlayPhase === "showing" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            Preserving your words in the archive...
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E877C]">
            These words are now released.
          </p>
        </div>
      )}
    </div>
  );
}
