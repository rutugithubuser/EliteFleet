"use client";

import { useEffect, useRef } from "react";

/**
 * Fades content up when it scrolls into view (once).
 *
 * <Reveal>...</Reveal>                  the whole block fades up
 * <Reveal stagger>...</Reveal>          each direct child fades up, one after another
 * <Reveal as="ol" className={x}>        renders as another tag, so it can replace
 *                                       an existing element without adding a wrapper
 * <Reveal delay={0.2}>                  waits 0.2s before starting
 *
 * The animation itself lives in globals.css ([data-reveal] rules).
 */
export default function Reveal({ as: Tag = "div", stagger = false, delay = 0, className, style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "");
            observer.unobserve(entry.target);
          }
        }
      },
      // Start a little before the element is fully on screen
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={stagger ? "stagger" : "fade"}
      className={className}
      style={delay ? { ...style, "--reveal-delay": `${delay}s` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
