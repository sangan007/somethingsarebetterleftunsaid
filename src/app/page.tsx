"use client";

import { useEffect, useRef, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, db, appId } from "@/lib/firebase";

import Navigation from "@/components/Navigation";
import SplashScreen from "@/components/SplashScreen";
import EmotionalLayer from "@/components/EmotionalLayer";
import ArchiveFeed from "@/components/ArchiveFeed";
import FullScreenReader from "@/components/FullScreenReader";
import EditorModal from "@/components/EditorModal";
import HomepageEditorial from "@/components/HomepageEditorial";
import JournalSection from "@/components/JournalSection";
import { MessageData } from "@/components/MessageCard";
import { fetchFirebaseMessages } from "@/lib/messages";
import { normalizeFirestoreMessage, RawFirestoreDoc } from "@/lib/messageAdapter";

export default function Home() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sync initial view from URL params if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("view");
      if (v && ["home", "archive", "journal", "about", "terms"].includes(v)) {
        setCurrentView(v);
      }
    }
  }, []);

  // Editor modal state
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  // Full-screen solitary reading view state
  const [viewState, setViewState] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Emotional acknowledgment state
  const [emotionalActive, setEmotionalActive] = useState<boolean>(false);
  const [emotionalText, setEmotionalText] = useState<string>("");

  const hasShownSessionAck = useRef<boolean>(false);
  const interactionCount = useRef<number>(0);

  const emotionalPhrases = [
    "it is okay to feel this",
    "take your time",
    "you do not have to carry it all",
    "silence is heavy",
    "let these words rest here",
  ];

  const triggerEmotional = (customText?: string, isSystem = false) => {
    if (isSystem && hasShownSessionAck.current) return;

    const text =
      customText ||
      emotionalPhrases[Math.floor(Math.random() * emotionalPhrases.length)];
    setEmotionalText(text);
    setEmotionalActive(true);

    if (isSystem) {
      hasShownSessionAck.current = true;
    }

    setTimeout(() => {
      setEmotionalActive(false);
    }, 3800);
  };

  // 1. Fetch real Firebase messages
  const loadFirebaseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFirebaseMessages();
      setMessages(data);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Error fetching Firebase messages:", err);
      const msg = err instanceof Error ? err.message : "Failed to connect to Firebase archive";
      setError(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirebaseData();
  }, []);

  // 2. Real-time Message Stream via client SDK when available
  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const colRef = collection(db, "artifacts", appId, "public", "data", "messages");
        const q = query(colRef);
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snap) => {
            const list: MessageData[] = [];
            snap.forEach((doc) => {
              list.push(
                normalizeFirestoreMessage({
                  id: doc.id,
                  ...(doc.data() as RawFirestoreDoc),
                })
              );
            });
            list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            if (list.length > 0) {
              setMessages(list);
              setLoading(false);
              setError(null);
            }
          },
          (err) => {
            console.warn("Client Firestore snapshot note:", err.message);
          }
        );
        return () => unsubscribeSnapshot();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 3. Focused Background Effects
  useEffect(() => {
    if (viewState === "opening" || viewState === "open") {
      document.body.classList.add("mode-focused");
    } else {
      document.body.classList.remove("mode-focused");
    }
  }, [viewState]);

  // 4. Scroll Locking
  useEffect(() => {
    const shouldLock = viewState !== "closed" || editorOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewState, editorOpen]);

  const handleOpenReader = (index: number) => {
    if (viewState !== "closed") return;
    setViewState("opening");
    setActiveIndex(index);
    setTimeout(() => {
      setViewState("open");
    }, 450);
  };

  const handleCloseReader = () => {
    if (viewState !== "open") return;
    setViewState("closing");

    interactionCount.current += 1;
    if (interactionCount.current === 4) {
      triggerEmotional(undefined, true);
    }

    setTimeout(() => {
      setViewState("closed");
      setActiveIndex(-1);
    }, 450);
  };

  const handleNavigateReader = (direction: number) => {
    if (viewState !== "open" || activeIndex === -1) return;
    const newIndex = activeIndex + direction;
    if (newIndex >= 0 && newIndex < messages.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentMessage = activeIndex !== -1 ? messages[activeIndex] : null;

  return (
    <>
      <SplashScreen />

      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenWrite={() => setEditorOpen(true)}
      />

      <main className="w-full min-h-screen pt-20 sm:pt-24 md:pt-36 pb-20 sm:pb-28 md:pb-36 px-4 sm:px-6 md:px-12">
        {/* ==================================================================
            VIEW: HOMEPAGE (The Literary & Archival Entry)
           ================================================================== */}
        {currentView === "home" && (
          <div className="view-section active">
            <HomepageEditorial
              messages={messages}
              loading={loading}
              onOpenReader={handleOpenReader}
              onViewChange={handleViewChange}
              onOpenWrite={() => setEditorOpen(true)}
            />
          </div>
        )}

        {/* ==================================================================
            VIEW: ARCHIVE
           ================================================================== */}
        {currentView === "archive" && (
          <ArchiveFeed
            messages={messages}
            loading={loading}
            error={error}
            onRetry={loadFirebaseData}
            onCardClick={handleOpenReader}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {/* ==================================================================
            VIEW: JOURNAL (The Journal of Interior Life)
           ================================================================== */}
        {currentView === "journal" && (
          <JournalSection
            archiveMessages={messages}
            onNavigateHome={() => handleViewChange("home")}
          />
        )}

        {/* ==================================================================
            VIEW: ABOUT (The Philosophy)
           ================================================================== */}
        {currentView === "about" && (
          <section className="view-section active max-w-2xl mx-auto py-12 md:py-20 space-y-12">
            <div className="text-center space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E877C] block font-medium">
                [ Manifesto & Origin ]
              </span>
              <h2 className="font-serif italic text-4xl sm:text-5xl text-[#EDE8E0] font-normal tracking-[-0.02em]">
                About the Archive
              </h2>
            </div>

            <div className="space-y-8 font-serif text-[17px] sm:text-[19px] text-[#A8A196] leading-[1.65] border-t border-[rgba(255,255,255,0.07)] pt-10">
              <p>
                This archive is a resting place for words that were never sent. In an age of relentless, frictionless communication, we often carry our heaviest truths in absolute silence.
              </p>
              <p>
                This project exists to give those thoughts a physical, permanent space to exist outside of your mind—without the friction, consequences, or permanent entanglements of delivery.
              </p>
              <p>
                There are no user accounts here. No follower graphs, no heart buttons, no algorithmic reward loops chasing your attention. Submissions are permanently decoupled from your identity.
              </p>
              <p>
                We invite you to write to release, and read to witness. That is the whole of the compact.
              </p>

              <div className="h-px bg-[rgba(255,255,255,0.08)] w-20 mx-auto my-12" />

              <div className="text-center font-mono text-[10px] uppercase tracking-widest text-[#7E786E] space-y-2">
                <p>Pure Anonymity · Preserved in Stone & Charcoal</p>
                <p>A Public Repository of Unspoken Words</p>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            VIEW: TERMS
           ================================================================== */}
        {currentView === "terms" && (
          <section className="view-section active max-w-2xl mx-auto py-8 md:py-16 space-y-10">
            <div className="text-center space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8E877C]">
                [ Principles of Custody ]
              </span>
              <h3 className="font-serif text-3xl text-[#EDE8E0]">
                Terms of Use
              </h3>
            </div>

            <div className="space-y-8 text-xs font-mono text-[#8E877C] leading-relaxed border-t border-[rgba(255,255,255,0.07)] pt-8">
              <div>
                <h4 className="text-[#EDE8E0] font-semibold uppercase tracking-wider mb-2">
                  1. Public Submission
                </h4>
                <p>
                  Everything submitted here becomes public to the archive but is strictly disconnected from your personal identity. We track no IP addresses, cookies, or user identifiers.
                </p>
              </div>
              <div>
                <h4 className="text-[#EDE8E0] font-semibold uppercase tracking-wider mb-2">
                  2. Your Sole Responsibility
                </h4>
                <p>
                  This is a space for vulnerable human reflection, not abuse. Harassment, doxxing, and harmful attacks do not belong in this room and will be removed.
                </p>
              </div>
              <div>
                <h4 className="text-[#EDE8E0] font-semibold uppercase tracking-wider mb-2">
                  3. The Nature of the Archive
                </h4>
                <p>
                  Once deposited, these words belong to the quiet ledger of human experience. Release them with honest intention.
                </p>
              </div>
              <div>
                <h4 className="text-[#EDE8E0] font-semibold uppercase tracking-wider mb-2">
                  4. Not a Crisis Service
                </h4>
                <p>
                  This archive is for creative reflection. If you or someone you know is in distress, please reach out to professional local crisis helplines.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Editorial Footer (With mobile clearance for floating bottom quick navigation) */}
      <footer className="w-full border-t border-[rgba(255,255,255,0.07)] pt-10 sm:pt-12 pb-24 md:pb-12 px-4 sm:px-6 text-center text-[10px] font-mono tracking-[0.16em] uppercase text-[#6B655B] space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2">
          <button
            onClick={() => handleViewChange("home")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Home
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => handleViewChange("archive")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Archive
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => handleViewChange("journal")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Journal
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => handleViewChange("about")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            About
          </button>
          <span className="opacity-40">·</span>
          <button
            onClick={() => handleViewChange("terms")}
            className="hover:text-[#EDE8E0] cursor-pointer transition-colors py-1"
          >
            Terms
          </button>
        </div>
        <div className="text-[9px] sm:text-[10px]">A Collection of Unsaid Things · Archive MMXXIV</div>
      </footer>

      {/* Solitary Reading View */}
      <FullScreenReader
        viewState={viewState}
        data={currentMessage}
        onClose={handleCloseReader}
        onNavigate={handleNavigateReader}
        hasPrevious={activeIndex > 0}
        hasNext={activeIndex < messages.length - 1}
      />

      {/* Submission Ritual Modal */}
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
