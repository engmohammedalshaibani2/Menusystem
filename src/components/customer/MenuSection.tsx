"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface MenuItem {
  id: number;
  categoryId: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  price: number;
  imagePath: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  imagePath: string | null;
  sortOrder: number;
  isActive: boolean;
  menuItems: MenuItem[];
}

interface MenuSectionProps {
  categories: Category[];
  formatPrice: (price: number) => string;
}

export default function MenuSection({ categories, formatPrice }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const effectiveCategories = categories.filter((c) => c.menuItems.length > 0);
  const selectedCategory = activeCategory ?? effectiveCategories[0]?.id ?? null;

  const filteredItems =
    effectiveCategories.find((c) => c.id === selectedCategory)?.menuItems ?? [];

  return (
    <div id="menu-section" className="px-4 md:px-8 py-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-8"
      >
        <h2
          className="text-3xl font-black font-['Cairo'] pr-4"
          style={{
            color: "var(--bg)",
            borderRight: "4px solid var(--gold)",
          }}
        >
          قائمة الطعام
        </h2>
      </motion.div>

      {effectiveCategories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {effectiveCategories.map((cat) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-8 py-2.5 rounded-full border-2 transition-all font-bold font-['Cairo']"
              style={{
                backgroundColor: selectedCategory === cat.id ? "var(--bg)" : "transparent",
                color: selectedCategory === cat.id ? "var(--primary)" : "var(--bg)",
                borderColor: selectedCategory === cat.id ? "var(--bg)" : "color-mix(in srgb, var(--gold) 40%, transparent)",
                boxShadow: selectedCategory === cat.id ? "0 4px 15px color-mix(in srgb, var(--gold) 40%, transparent)" : "none",
              }}
            >
              {cat.nameAr}
            </motion.button>
          ))}
        </motion.div>
      )}

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-xl font-['Cairo'] font-bold" style={{ color: "color-mix(in srgb, var(--bg) 60%, transparent)" }}>
                لا توجد أصناف في هذا القسم
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className={`rounded-3xl overflow-hidden flex flex-col transition-shadow duration-300 glass-card ${
                  !item.isAvailable ? "opacity-60" : ""
                }`}
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid color-mix(in srgb, var(--gold) 20%, transparent)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                }}
              >
                <div className="p-5 flex-grow">
                  <div className="rounded-2xl overflow-hidden mb-5 h-48 md:h-56 relative group">
                    {item.imagePath ? (
                      <img
                        src={item.imagePath}
                        alt={item.nameAr}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, color-mix(in srgb, var(--gold) 30%, transparent), color-mix(in srgb, var(--primary) 30%, transparent))`,
                        }}
                      >
                        <span
                          className="text-4xl font-black font-['Cairo']"
                          style={{ color: "var(--gold)" }}
                        >
                          {item.nameAr.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                    {item.isFeatured && (
                      <span
                        className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-bold shadow-md"
                        style={{
                          backgroundColor: "var(--gold)",
                          color: "var(--primary)",
                        }}
                      >
                        مميز
                      </span>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <span
                          className="font-bold px-4 py-1.5 rounded-full text-sm"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--bg) 90%, transparent)",
                            color: "var(--primary)",
                          }}
                        >
                          غير متوفر
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className="text-2xl font-black font-['Cairo'] mb-1 text-center"
                    style={{ color: "var(--primary)" }}
                  >
                    {item.nameAr}
                  </h3>
                  {item.nameEn && (
                    <p className="text-sm text-center mb-2 font-medium" style={{ color: "color-mix(in srgb, var(--primary) 60%, transparent)" }}>
                      {item.nameEn}
                    </p>
                  )}
                  {(item.descriptionAr || item.descriptionEn) && (
                    <p className="text-base text-center mb-4 min-h-[40px] font-medium" style={{ color: "color-mix(in srgb, var(--primary) 80%, transparent)" }}>
                      {item.descriptionAr || item.descriptionEn}
                    </p>
                  )}
                  <div className="text-center font-black text-2xl" style={{ color: "var(--gold)" }}>
                    {formatPrice(item.price)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
