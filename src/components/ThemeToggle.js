"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons/Icons";

const STORAGE_KEY = "theme";

// ---- Reading the current mode (the data-theme attribute on <html>) ----

function subscribeToTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function useTheme() {
  return useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.getAttribute("data-theme") || "light",
    () => "light" // while pre-building on the server
  );
}

// ---- Changing the mode ----

function applyTheme(theme) {
  const root = document.documentElement;
  // Briefly animate colours so the switch feels smooth rather than a hard cut
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  window.setTimeout(() => root.classList.remove("theme-switching"), 400);
}

function savedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Sun/moon button that switches between light and night mode.
 * variant="icon": square icon button (navbar)
 * variant="row":  full-width button with text (mobile menu)
 */
export default function ThemeToggle({ variant = "icon", className }) {
  const theme = useTheme();
  const isDark = theme === "dark";

  // Until the visitor picks a mode themselves, follow their device setting live
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!savedTheme()) applyTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing etc.: the switch still works, it just won't be remembered
    }
  }

  const label = isDark ? "Switch to light mode" : "Switch to night mode";
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <button type="button" className={className} onClick={toggle} aria-label={label} title={label}>
      <Icon size={variant === "row" ? 18 : 20} />
      {variant === "row" && <span>{isDark ? "Light mode" : "Night mode"}</span>}
    </button>
  );
}
