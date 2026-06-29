"use client";

export default function BackgroundPattern() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[0] mandi-premium-bg" />
      <svg
        className="fixed inset-0 pointer-events-none z-[1]"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "var(--gold)" }}
      >
        <defs>
          <pattern id="mandi-premium" width="160" height="160" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.08">
              <circle cx="80" cy="80" r="60" />
              <circle cx="0" cy="0" r="60" />
              <circle cx="160" cy="0" r="60" />
              <circle cx="0" cy="160" r="60" />
              <circle cx="160" cy="160" r="60" />
              <path d="M0,0 L160,160 M160,0 L0,160" />
              <path d="M80,0 L80,160 M0,80 L160,80" />
              <rect x="38" y="38" width="84" height="84" transform="rotate(45 80 80)" />
              <rect x="38" y="38" width="84" height="84" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mandi-premium)" />
      </svg>
      <div className="fixed inset-0 pointer-events-none z-[1] mandi-radial-glow" />
    </>
  );
}
