"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const quotes = [
      "some things were felt in full and said in half.",
      "an archive of the human interior.",
      "words held back, thoughts whispered into the dark.",
      "letters that were never posted.",
      "the parallel life of everything we never said.",
    ];
    setText(quotes[Math.floor(Math.random() * quotes.length)]);

    const visibleTimer = setTimeout(() => {
      setVisible(true);
    }, 300);

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    const unmountTimer = setTimeout(() => {
      setMounted(false);
    }, 3400);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div id="splash-screen" className={fadeOut ? "fade-out" : ""}>
      <div id="splash-text" className={visible ? "visible" : ""}>
        &ldquo;{text}&rdquo;
      </div>
    </div>
  );
}
