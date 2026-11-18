import type { ReactNode } from 'react'

// One consistent line-icon set for the public pages (replaces emoji, which render differently per
// platform and are read aloud by screen readers). Sized by font-size (1em) and coloured by currentColor.
const ICONS = {
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  van: (
    <>
      <path d="M5 17H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h11l5 5h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2M9 17h6M14 6v5h5" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  guide: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M19 3v8M19 3l3 1.5L19 6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
      <path d="M14 7v10" strokeDasharray="2 2" />
    </>
  ),
  dining: <path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2 1.5-3 4-3 7v3h3" />,
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 16h6" />
    </>
  ),
  plane: (
    <path
      transform="rotate(45 12 12)"
      d="M12 2c1 0 1.5 1 1.5 2.5V9l8 5v2l-8-2.5V19l2.5 2v1L12 21l-4 1v-1l2.5-2v-5.5l-8 2.5v-2l8-5V4.5C10.5 3 11 2 12 2z"
    />
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  speech: <path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5" />,
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  palm: <path d="M12 21c0-5 .5-8 1-11M13 10c-1-3-4-4-7-3M13 10c1-3 4-4 7-3M13 10c-3 0-5 2-6 5M13 10c3 0 5 2 6 5M5 21h14" />,
  beach: <path d="M3 11a9 9 0 0 1 18 0zM12 11v10M4 21h16" />,
  hills: <path d="M2 19c2-5 4-7 6-7s4 2 6 7M10 19c2-4 4-6 6-6s4 2 6 6M2 19h20" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  members: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20a7 7 0 0 1 14 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14a5 5 0 0 1 5 5" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ICONS

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  )
}
