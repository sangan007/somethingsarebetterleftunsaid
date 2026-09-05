"use client";

import React from "react";

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
  const handleKeyDown = (view: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onViewChange(view);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "archive", label: "Archive" },
    { id: "journal", label: "Journal" },
    { id: "about", label: "About" },
  ] as const;

  return (
    <>
      {/* Editorial Top Masthead */}
      <header
        className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 md:py-6 flex justify-between items-center bg-[#0C0B0A]/85 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] transition-all duration-300"
        style={{ paddingTop: "max(1.25rem, var(--safe-top))" }}
      >
        {/* Left: Publication Masthead */}
        <div className="flex items-center">
          <div
            onClick={() => onViewChange("home")}
            onKeyDown={handleKeyDown("home")}
            role="button"
            tabIndex={0}
            className="cursor-pointer group text-left"
          >
            <span className="block font-mono text-[9px] md:text-[9.5px] tracking-[0.24em] uppercase text-[#EDE8E0] font-medium transition-opacity group-hover:opacity-75">
              A Collection of Unsaid Things
            </span>
            <span className="hidden sm:block font-serif italic text-[12px] text-[#8E877C] tracking-normal mt-0.5">
              An archive of the human interior
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-9">
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

        {/* Right: Restrained Editorial Action */}
        <div className="flex items-center gap-4">
          <button
            id="btnOpenWrite"
            onClick={onOpenWrite}
            className="font-mono text-[9px] md:text-[9.5px] uppercase tracking-[0.18em] text-[#EDE8E0] border border-[rgba(255,255,255,0.16)] hover:border-[#EDE8E0] px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-250 bg-transparent hover:bg-white/[0.04] cursor-pointer"
          >
            + Leave Something Unsaid
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dock (Bottom) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-6 left-0 w-full z-40 flex justify-center pointer-events-none px-4"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="pointer-events-auto bg-[#141312]/92 backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-full px-5 py-2 flex items-center gap-5 shadow-2xl shadow-black/80">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`font-mono text-[9px] uppercase tracking-[0.16em] transition-colors cursor-pointer py-1 ${
                  currentView === item.id
                    ? "text-[#EDE8E0] font-semibold"
                    : "text-[#8E877C] hover:text-[#EDE8E0]"
                }`}
              >
                {item.label}
              </button>
              {index < navItems.length - 1 && (
                <span className="w-px h-2.5 bg-[rgba(255,255,255,0.1)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </>
  );
}
