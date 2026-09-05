"use client";

import React, { useState, useEffect } from "react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenWrite: () => void;
}

export default function Navigation({
  currentView,
  onViewChange,
  onOpenWrite,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleKeyDown = (view: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onViewChange(view);
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "archive", label: "Archive" },
    { id: "journal", label: "Journal" },
    { id: "about", label: "About" },
  ] as const;

  return (
    <>
      {/* ====================================================================
          TOP MASTHEAD (Desktop + Compact Mobile Header)
          ==================================================================== */}
      <header
        className="fixed top-0 left-0 w-full z-40 px-4 sm:px-6 md:px-12 py-3.5 sm:py-4 md:py-6 flex justify-between items-center bg-[#0C0B0A]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.07)] transition-all duration-300 min-h-[64px] sm:min-h-[72px] md:min-h-[80px]"
        style={{ paddingTop: "max(0.875rem, var(--safe-top))" }}
      >
        {/* Left: Publication Masthead (Brand Never Disappears, Wraps Naturally) */}
        <div className="flex items-center min-w-0 pr-2">
          <div
            onClick={() => {
              onViewChange("home");
              setMobileMenuOpen(false);
            }}
            onKeyDown={handleKeyDown("home")}
            role="button"
            tabIndex={0}
            className="cursor-pointer group text-left min-w-0"
            aria-label="Return to Homepage"
          >
            <span className="block font-mono text-[9px] xs:text-[9.5px] md:text-[9.5px] tracking-[0.14em] xs:tracking-[0.2em] uppercase text-[#EDE8E0] font-medium transition-opacity group-hover:opacity-75 leading-snug">
              A Collection of Unsaid Things
            </span>
            <span className="font-serif italic text-[11px] sm:text-[12px] text-[#8E877C] tracking-normal mt-0.5 block leading-snug">
              An archive of the human interior
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Preserved Exactly on Desktop) */}
        <nav className="hidden md:flex items-center gap-9" aria-label="Desktop Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              onKeyDown={handleKeyDown(item.id)}
              id={`nav-${item.id}`}
              className={`nav-editorial-link ${
                currentView === item.id ? "active" : ""
              }`}
              tabIndex={0}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Desktop: Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            id="btnOpenWrite"
            onClick={onOpenWrite}
            className="font-mono text-[9px] md:text-[9.5px] uppercase tracking-[0.18em] text-[#EDE8E0] border border-[rgba(255,255,255,0.16)] hover:border-[#EDE8E0] px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-250 bg-transparent hover:bg-white/[0.04] cursor-pointer whitespace-nowrap"
          >
            + Leave Something Unsaid
          </button>
        </div>

        {/* Right Mobile: Elegant Editorial MENU / CLOSE Control */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 min-h-[42px] rounded-full border border-white/[0.16] hover:border-white/30 text-[#EDE8E0] bg-white/[0.05] transition-all cursor-pointer select-none active:scale-95"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span>{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
            <span
              className="text-[11px] text-[#C29B68] font-bold transition-transform duration-200"
              style={{ transform: mobileMenuOpen ? "rotate(90deg)" : "none" }}
            >
              {mobileMenuOpen ? "✕" : "—"}
            </span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          MOBILE MENU REVEAL PANEL & BACKDROP
          ==================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex flex-col justify-start">
          {/* Subtle Ambient Dimming Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-250"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Reveal Drawer Content */}
          <div
            className="relative z-40 bg-[#0C0B0A]/98 backdrop-blur-2xl border-b border-white/[0.1] px-6 pt-20 sm:pt-24 pb-8 shadow-2xl space-y-7 transition-all duration-250"
            style={{
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* Editorial Series Header inside Mobile Menu */}
            <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#736B63]">
                Navigation Index
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#C29B68]">
                Vol. II
              </span>
            </div>

            {/* Navigation Links with Active Indicators */}
            <nav className="flex flex-col space-y-1" aria-label="Mobile Menu Navigation">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between py-3.5 text-left font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-colors border-b border-white/[0.04] cursor-pointer ${
                      isActive
                        ? "text-[#EDE8E0] font-semibold"
                        : "text-[#8E877C] hover:text-[#EDE8E0]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive ? (
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] text-[#C29B68] font-mono tracking-widest">[ ACTIVE ]</span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C29B68]" />
                      </span>
                    ) : (
                      <span className="text-white/20">→</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Call to Action: + Leave Something Unsaid */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => {
                  onOpenWrite();
                  setMobileMenuOpen(false);
                }}
                className="w-full font-mono text-[10px] uppercase tracking-[0.2em] text-[#EDE8E0] border border-[#C29B68]/60 hover:border-[#EDE8E0] bg-[#C29B68]/10 hover:bg-[#C29B68]/20 px-5 py-3.5 rounded-full transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 min-h-[44px]"
              >
                <span>+ Leave Something Unsaid</span>
              </button>

              <p className="font-serif italic text-xs text-[#736B63] text-center max-w-xs mx-auto pt-1">
                &ldquo;Pure anonymity. Preserved in stone &amp; charcoal.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
