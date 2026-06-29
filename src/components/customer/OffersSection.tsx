"use client";

import React from "react";
import { motion } from "motion/react";

interface MenuItem {
  id: number;
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

interface OfferItem {
  item: MenuItem;
}

interface Offer {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imagePath: string | null;
  discountType: string;
  discountValue: number;
  items: OfferItem[];
}

interface OffersSectionProps {
  offers: Offer[];
}

export default function OffersSection({ offers }: OffersSectionProps) {
  if (offers.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const getDiscountLabel = (offer: Offer) => {
    if (offer.discountType === "percentage") return `خصم ${offer.discountValue}%`;
    return `خصم ${offer.discountValue} ر.س`;
  };

  return (
    <div className="px-4 md:px-8 py-12 max-w-6xl mx-auto">
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
          العروض المميزة
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="relative rounded-3xl overflow-hidden h-56 md:h-72 group cursor-pointer border glass-card"
            style={{
              borderColor: "color-mix(in srgb, var(--gold) 20%, transparent)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            {offer.imagePath ? (
              <img
                src={offer.imagePath}
                alt={offer.titleAr}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full" style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--primary) 80%, var(--gold)), var(--primary))`,
              }} />
            )}
            <div
              className="absolute inset-0 flex flex-col justify-end p-8"
              style={{
                background: `linear-gradient(to top, color-mix(in srgb, var(--primary) 90%, transparent) 0%, color-mix(in srgb, var(--primary) 40%, transparent) 50%, transparent 100%)`,
              }}
            >
              <div
                className="absolute top-6 right-6 text-sm px-4 py-1.5 rounded-full font-bold shadow-md"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "var(--primary)",
                }}
              >
                {getDiscountLabel(offer)}
              </div>
              <h3 className="text-2xl font-black font-['Cairo'] mb-2" style={{ color: "var(--bg)" }}>
                {offer.titleAr}
              </h3>
              <p className="text-base font-medium" style={{ color: "color-mix(in srgb, var(--bg) 80%, transparent)" }}>
                {offer.descriptionAr || `${offer.items.length} أصناف`}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
