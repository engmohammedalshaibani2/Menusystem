"use client";

import React from "react";

interface FooterSectionProps {
  restaurantName: string;
}

export default function FooterSection({ restaurantName }: FooterSectionProps) {
  return (
    <footer className="relative overflow-hidden plum-heritage-gradient">
      <div className="divider-gold-thick" />
      <div className="logo-watermark logo-watermark-footer" />
      <div className="relative z-10 py-8 text-center">
        <p className="text-sm font-['Cairo']" style={{ color: "color-mix(in srgb, var(--bg) 80%, transparent)" }}>
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {restaurantName}
        </p>
      </div>
    </footer>
  );
}
