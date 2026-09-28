"use client";

import { useEffect, useRef } from "react";

/**
 * Moves its contents a little slower than the page while scrolling (a depth effect).
 *
 * Put it inside a box that has `overflow: hidden` and `position: relative`.
 * It is 12% taller than that box at the top and bottom, so the edges never show.
 * Photos inside should use `fill` (they fill this layer).
 *
 * strength: how far it moves, as a share of the box height (0.1 = up to 10%)
 * Phones get half the movement; "reduce motion" turns it off completely.
 */
export default function Parallax({ strength = 0.1, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const layer = ref.current;
    const box = layer?.parentElement;
    if (!layer || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let onScreen = false;

    function update() {
      frame = 0;
      const rect = box.getBoundingClientRect();
      const viewport = window.innerHeight;
      // -1 when the box is just below the screen, 0 in the middle, 1 just above
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      const amount = window.innerWidth <= 600 ? strength / 2 : strength;
      layer.style.setProperty("--parallax-y", `${(clamped * amount * rect.height).toFixed(1)}px`);
    }

    function requestUpdate() {
      if (onScreen && !frame) frame = requestAnimationFrame(update);
    }

    // Only do work while the box is on screen
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      requestUpdate();
    });
    observer.observe(box);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}
