// Generic 24px line icons, 1.5 stroke, colored via currentColor.
// NOTE: the original Figma icon assets could not be downloaded in this
// build environment (the Figma asset CDN is outside the sandbox's allowed
// network). These are close hand-built substitutes — swap the actual
// exported SVGs in later if you want pixel-exact icons.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M20 10.5c0 5.25-8 12-8 12s-8-6.75-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  );
}

export function CarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M4 15.5 5.6 10a2 2 0 0 1 1.9-1.4h9a2 2 0 0 1 1.9 1.4L20 15.5" />
      <rect x="2.5" y="15.5" width="19" height="5" rx="1.5" />
      <circle cx="7" cy="18" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="17" cy="18" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export function WhatsappIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} {...base} {...props}>
      <path d="M6.5 17.5 4 20l2.6-.7a8 8 0 1 0-3.1-6.3 7.9 7.9 0 0 0 1 3.9" />
      <path d="M9 9.7c0 3.6 2.7 6.3 6.3 6.3.6 0 1-.5.9-1l-.3-1.2a.9.9 0 0 0-1-.6l-1.1.2a4.6 4.6 0 0 1-3-3l.2-1.1a.9.9 0 0 0-.6-1L9.2 8c-.5-.1-1 .3-1 .9v.8Z" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.8 7 7.3 5.3a1.6 1.6 0 0 0 1.8 0L20.2 7" />
    </svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} {...base} {...props}>
      <path
        d="M13.5 21v-7.6h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5h1.5V4.3c-.3 0-1.3-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.2v3h2.2V21h3.1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function YouTubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.6 9.4v5.2l4.5-2.6-4.5-2.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function SeatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <circle cx="12" cy="7.5" r="3.25" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="M7 5.5v13M17 5.5v13M7 12h10" />
    </svg>
  );
}

export function RoadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="M7.5 3.5 4.5 20.5M16.5 3.5l3 17" />
      <path d="M12 4v3.5M12 10.5v3.5M12 17v3.5" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor" stroke="none" {...props}>
      <path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.6L12 17l-5.9 3.4 1.4-6.6-5-4.5 6.6-.7L12 2.5Z" />
    </svg>
  );
}

export function QuoteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 28} height={props.size || 28} fill="currentColor" stroke="none" {...props}>
      <path d="M9.5 6C6.5 7.3 4.8 9.7 4.8 13c0 2.6 1.7 4.4 3.9 4.4a3 3 0 0 0 3-3c0-1.6-1.1-2.8-2.6-3-.1-1.6 1-3 2.9-3.7L9.5 6Zm9 0C15.5 7.3 13.8 9.7 13.8 13c0 2.6 1.7 4.4 3.9 4.4a3 3 0 0 0 3-3c0-1.6-1.1-2.8-2.6-3-.1-1.6 1-3 2.9-3.7L18.5 6Z" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} {...base} {...props}>
      <path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5Z" />
    </svg>
  );
}

export function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M12 3l7 3v5.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M12.5 3.5H6a2 2 0 0 0-2 2v6.5l10 10 8.5-8.5-10-10Z" />
      <circle cx="8" cy="9" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function SlidersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 22} height={props.size || 22} {...base} {...props}>
      <path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M20 18h0" />
      <circle cx="12" cy="6" r="2" fill="var(--icon-bg,#f7f7f5)" />
      <circle cx="7" cy="12" r="2" fill="var(--icon-bg,#f7f7f5)" />
      <circle cx="17" cy="18" r="2" fill="var(--icon-bg,#f7f7f5)" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} {...base} {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

// ---------- Chauffeur page ----------

export function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function PlaneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} {...base} {...props}>
      <path d="M12 2.75c.9 0 1.5.9 1.5 2v4.5l7.5 4.25v2l-7.5-2.25v4.25l2.25 1.75v1.75L12 20l-3.75 1v-1.75l2.25-1.75V13.25L3 15.5v-2l7.5-4.25V4.75c0-1.1.6-2 1.5-2Z" />
    </svg>
  );
}

export function BriefcaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </svg>
  );
}

export function GlassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} {...base} {...props}>
      <path d="M7.5 3h9l-.6 5.5a3.9 3.9 0 0 1-7.8 0L7.5 3ZM7.8 7.5h8.4M12 12.5V21M9 21h6" />
    </svg>
  );
}

export function SeatsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} {...base} {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 19.5a6 6 0 0 1 12 0M15.5 4.9a3.25 3.25 0 0 1 0 6.2M17.5 14a6 6 0 0 1 3.5 5.5" />
    </svg>
  );
}
