"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import OffersSection from "./OffersSection";
import MenuSection from "./MenuSection";
import FooterSection from "./FooterSection";
import LightTrail from "./LightTrail";

interface Settings {
  restaurantName: string;
  welcomeMessage: string;
  logoPath: string;
  coverPath: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textPrimary: string;
  borderColor: string;
  fontHeading: string;
  fontBody: string;
  phone: string;
  address: string;
}

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

interface Props {
  settings: Settings;
  categories: Category[];
  offers: Offer[];
}

export default function CustomerMenu({ settings, categories, offers }: Props) {
  const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

  const effectiveCategories = categories.filter((c) => c.menuItems.length > 0);
  const selectedCategory = activeCategory ?? effectiveCategories[0]?.id ?? null;

  return (
    <div
      className="min-h-screen font-['Tajawal'] text-white relative"
      dir="rtl"
    >
      <LightTrail />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          restaurantName={settings.restaurantName}
          logoPath={settings.logoPath}
          categories={effectiveCategories}
          activeCategory={selectedCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="flex-grow">
          <HeroSection
            restaurantName={settings.restaurantName}
            welcomeMessage={settings.welcomeMessage}
            coverPath={settings.coverPath}
          />

          <OffersSection offers={offers} />

          <MenuSection
            categories={categories}
            formatPrice={formatPrice}
          />
        </main>

        <FooterSection
          restaurantName={settings.restaurantName}
        />
      </div>
    </div>
  );
}
