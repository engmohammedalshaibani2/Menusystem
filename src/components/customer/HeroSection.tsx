"use client";

import React from "react";
import { motion } from "motion/react";

interface HeroSectionProps {
  restaurantName: string;
  welcomeMessage: string;
  coverPath?: string;
}

function HeritageCorners() {
  return (
    <>
      <div className="heritage-corner heritage-corner-tl" />
      <div className="heritage-corner heritage-corner-tr" />
      <div className="heritage-corner heritage-corner-bl" />
      <div className="heritage-corner heritage-corner-br" />
    </>
  );
}

export default function HeroSection({ restaurantName, welcomeMessage, coverPath }: HeroSectionProps) {
  return (
    <div className="px-4 md:px-8 py-8 md:py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden relative h-[300px] md:h-[450px] border plum-heritage-gradient"
        style={{
          boxShadow: "0 8px 30px color-mix(in srgb, var(--gold) 30%, transparent)",
          borderColor: "color-mix(in srgb, var(--gold) 20%, transparent)",
        }}
      >
        <HeritageCorners />

        {coverPath && (
          <img
            src={coverPath}
            alt=""
            className="absolute inset-0 w-full h-full object-cover cover-fade z-[1]"
          />
        )}
        <div className="w-full h-full relative z-[2]" />
        <div className="logo-watermark z-[3]" />
        <div
          className="absolute inset-0 z-[4]"
          style={{
            background: `linear-gradient(to top, color-mix(in srgb, var(--plum-dark) 90%, transparent) 0%, color-mix(in srgb, var(--plum) 40%, transparent) 50%, transparent 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
        className="mt-[-60px] relative z-10 text-center rounded-3xl max-w-3xl border-2 mx-4 px-[39px] py-[15px]"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--primary)",
          boxShadow: "0 10px 40px color-mix(in srgb, var(--gold) 40%, transparent)",
          borderColor: "color-mix(in srgb, var(--gold) 30%, transparent)",
        }}
      >
        <h1
          className="text-3xl md:text-5xl font-black mb-4 font-['Cairo'] tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          أهلاً بكم في {restaurantName}
        </h1>
        <p className="mb-6 text-lg md:text-xl font-medium" style={{ color: "color-mix(in srgb, var(--primary) 80%, black)" }}>
          {welcomeMessage}
        </p>
        <motion.a
          href="#menu-section"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-10 py-3 rounded-full font-bold text-lg shadow-lg gold-pulse-btn"
          style={{
            backgroundColor: "var(--gold)",
            color: "var(--primary)",
          }}
        >
          قائمة الطعام
        </motion.a>
      </motion.div>
    </div>
  );
}
