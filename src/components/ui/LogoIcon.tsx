"use client";

import React, { useEffect, useState } from "react";

interface Props {
  size?: number | string;
  className?: string;
  ariaLabel?: string;
  src?: string;
}

export default function LogoIcon({ size = 24, className = "", ariaLabel, src: propSrc }: Props) {
  const [src, setSrc] = useState<string | null>(propSrc ?? null);

  useEffect(() => {
    if (propSrc) {
      setSrc(propSrc);
      return;
    }
    try {
      const val = getComputedStyle(document.body).getPropertyValue("--logo-url") || "";
      let url = val.trim();
      // strip wrapping url(...) or quotes if present
      url = url.replace(/^url\(["']?/, "").replace(/["']?\)$/, "").replace(/^['"]|['"]$/g, "");
      if (url.length > 0) setSrc(url);
      else setSrc(null);
    } catch (e) {
      setSrc(null);
    }
  }, [propSrc]);

  const w = typeof size === "number" ? size : undefined;
  const h = typeof size === "number" ? size : undefined;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={ariaLabel ?? "logo"}
        width={w}
        height={h}
        className={`${className} object-cover`}
        style={{ borderRadius: "9999px" }}
      />
    );
  }

  return (
    <svg
      width={w}
      height={h}
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role={ariaLabel ? "img" : "img"}
      aria-label={ariaLabel}
    >
      <circle cx="32" cy="32" r="30" fill="var(--primary)" />
      <path d="M20 28c4-6 20-6 24 0 0 0-6 6-12 6s-12-6-12-6z" fill="var(--gold)" />
    </svg>
  );
}
