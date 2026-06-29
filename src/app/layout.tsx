import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/utils";

export const metadata: Metadata = {
  title: "بيت المندي",
  description: "أهلاً وسهلاً بكم في مطعم بيت المندي",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  function getOnColor(hex: string) {
    try {
      const { r, g, b } = hexToRgb(hex);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#000000" : "#FFFFFF";
    } catch (e) {
      return "#FFFFFF";
    }
  }

  const gradientPrimary = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`;
  const gradientGold = `linear-gradient(135deg, ${settings.accentColor}, ${settings.secondaryColor})`;
  const onPrimary = getOnColor(settings.primaryColor);

  const rootStyle = {
    ["--primary" as any]: settings.primaryColor,
    ["--primary-light" as any]: settings.secondaryColor,
    ["--gold" as any]: settings.accentColor,
    ["--accent" as any]: settings.accentColor,
    ["--bg" as any]: settings.bgColor,
    ["--bg-card" as any]: settings.bgColor,
    ["--text-primary" as any]: settings.textPrimary,
    ["--border" as any]: settings.borderColor,
    ["--font-heading" as any]: settings.fontHeading,
    ["--font-body" as any]: settings.fontBody,
    ["--gradient-primary" as any]: gradientPrimary,
    ["--gradient-gold" as any]: gradientGold,
    ["--on-primary" as any]: onPrimary,
    ["--logo-url" as any]: settings.logoPath ? `url(${settings.logoPath})` : "none",
  } as any;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={rootStyle}>{children}</body>
    </html>
  );
}
