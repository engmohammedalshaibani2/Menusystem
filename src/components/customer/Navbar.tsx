"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu as MenuIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface NavbarProps {
  restaurantName: string;
  logoPath: string;
  categories: { id: number; nameAr: string }[];
  activeCategory: number | null;
  onCategoryChange: (id: number) => void;
}

export default function Navbar({ restaurantName, logoPath, categories, activeCategory, onCategoryChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className={`plum-heritage-gradient navbar ${scrolled ? "scrolled" : ""}`}
        style={{ borderBottom: "1px solid var(--navbar-border)" }}
      >
        <div className="flex items-center justify-between px-4 md:px-12 py-3 md:py-5">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6 text-base font-bold font-['Cairo']">
              <span
                className="pb-1 cursor-default"
                style={{ color: "var(--gold)", borderBottom: "2px solid var(--gold)" }}
              >
                قائمة الطعام
              </span>
              <button
                className="transition-colors p-1"
                style={{ color: "var(--bg)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--bg)")}
                aria-label="بحث"
              >
                <Search size={22} />
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 transition-colors"
              style={{ color: "var(--bg)" }}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>

          <Link href="/" className="block">
            <div
              className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2.5 -mt-3 md:-mt-5 transition-all hover:scale-105 hover:translate-y-1"
              style={{
                backgroundColor: "var(--bg)",
                borderRadius: "9999px",
                boxShadow: "0 10px 20px color-mix(in srgb, var(--gold) 30%, transparent)",
                border: "2px solid color-mix(in srgb, var(--gold) 40%, transparent)",
              }}
            >
              <img
                src={logoPath || "/uploads/logos/1782289425516-1.webp"}
                alt={restaurantName}
                className="w-10 h-10 md:w-14 md:h-14 object-contain flex-shrink-0 rounded-full"
              />
              <span
                className="text-sm md:text-xl font-black font-['Cairo'] whitespace-nowrap ml-1"
                style={{ color: "var(--primary)" }}
              >
                {restaurantName}
              </span>
            </div>
          </Link>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[1001] md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm p-6 border-l overflow-y-auto plum-heritage-gradient"
              style={{ borderLeftColor: "var(--navbar-border)" }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-['Cairo'] font-black text-xl" style={{ color: "var(--bg)" }}>القائمة</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1" style={{ color: "var(--bg)" }}>
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategoryChange(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-right px-4 py-3 rounded-xl font-bold font-['Cairo'] transition-all"
                    style={{
                      backgroundColor: activeCategory === cat.id ? "var(--gold)" : "transparent",
                      color: activeCategory === cat.id ? "var(--primary)" : "color-mix(in srgb, var(--bg) 70%, transparent)",
                    }}
                    onMouseEnter={(e) => {
                      if (activeCategory !== cat.id) e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--gold) 20%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (activeCategory !== cat.id) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {cat.nameAr}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
